# Guía técnica de desarrollo seguro para CARPIDI

## Propósito y alcance

Esta guía define cómo se construye CARPIDI: una plataforma de comercio electrónico para ropa femenina, zapatos y accesorios con asesoría de imagen voluntaria. Es la referencia de arquitectura, seguridad, API y operación para el frontend React, la API Spring Boot y PostgreSQL. Toda contribución debe cumplirla antes de integrarse a `main`.

## 1 Arquitectura y organización del dominio

CARPIDI utiliza un monolito modular con arquitectura hexagonal. Es la opción adecuada para el MVP porque permite entregar catálogo, compras y administración con una única operación, sin acoplar la lógica de negocio a Spring, JPA o servicios externos. Cada módulo conserva sus casos de uso y contratos; las dependencias entre módulos se resuelven por interfaces de aplicación, no accediendo al repositorio de otro módulo.

| Módulo | Responsabilidad | Interfaces externas |
| --- | --- | --- |
| `identity` | Registro, sesión, roles, recuperación de contraseña | Proveedor de correo y JWT |
| `catalog` | Categorías, productos, variantes, imágenes e inventario | Almacenamiento de imágenes |
| `orders` | Carrito, checkout, reservas, pedidos y pagos | Pasarela de pagos y envíos |
| `recommendations` | Cuestionario consentido y reglas de recomendación | Futuro servicio de IA |
| `administration` | Dashboard, auditoría y operación de catálogo | Analítica posterior |

En cada módulo, `api` contiene controladores y DTOs HTTP, `application` los casos de uso, `domain` las reglas y puertos, e `infrastructure` los adaptadores JPA, JWT, pagos, correo o nube. Las entidades JPA nunca se devuelven por HTTP. Se emplean `record` inmutables para requests y responses, y MapStruct para convertir entidades a DTOs.

## 2 Estándar de API REST

- Todas las rutas se publican bajo `/api/v1`; los recursos usan sustantivos plurales: `/products`, `/orders`, `/categories`.
- `GET` es seguro e idempotente; `POST` crea recursos; `PUT` reemplaza; `PATCH` modifica parcialmente; `DELETE` desactiva de forma lógica cuando exista historial transaccional.
- El catálogo soporta `page`, `size` (máximo 100), `sort`, `q`, `category`, `size` y `color`. La respuesta incluye contenido, total y metadatos de página.
- La identidad usa excepciones justificadas por el protocolo: `/auth/login`, `/auth/register`, `/auth/refresh-token` y `/auth/forgot-password`.
- El cliente accede a sus recursos en `/me/profile`, `/me/orders` y `/me/questionnaire`. Los endpoints `/admin/**` requieren rol `ADMIN`.
- Las URLs no incluyen datos personales, tokens ni secretos.

### Respuestas y errores

Las creaciones responden `201 Created` y `Location`; lecturas `200`; cambios exitosos `200` o `204`; ausencia `404`; validación `400`; autenticación `401`; autorización `403`; conflicto de stock o versión `409`; límite de tasa `429`.

Toda excepción conocida se transforma mediante `@RestControllerAdvice` a RFC 7807:

```json
{
  "type": "https://api.carpidi.com/errors/insufficient-stock",
  "title": "Stock insuficiente",
  "status": 409,
  "detail": "Una variante del carrito ya no tiene la cantidad solicitada.",
  "instance": "/api/v1/orders",
  "traceId": "..."
}
```

No se exponen trazas, consultas SQL, identificadores internos de proveedores ni información sobre si un correo está registrado.

## 3 Seguridad OWASP aplicada a CARPIDI

### Identidad y autorización

- Las contraseñas se almacenan únicamente con BCrypt (factor 12 o superior). Nunca se registran, devuelven ni se envían por correo.
- Los JWT de acceso duran como máximo 15 minutos; los refresh tokens se rotan, se almacenan con hash y pueden revocarse al cerrar sesión o recuperar la contraseña.
- Cada endpoint protege tanto el rol como la propiedad del recurso. Un `CLIENT` solo consulta y modifica sus pedidos, perfil y cuestionario. `ADMIN` gestiona operación; no obtiene información de estilo sin una finalidad autorizada.
- `@PreAuthorize` complementa las reglas de seguridad de ruta. Las decisiones de autorización se prueban de forma explícita.

### Entradas, abuso y datos

- Todo request se valida con Bean Validation: tamaños máximos, formatos, listas no vacías, cantidades positivas y enumeraciones permitidas. El frontend ayuda, pero el backend siempre es la autoridad.
- Los campos de texto se codifican al mostrarse; no se acepta HTML de usuarios en descripción, reseñas o perfil sin saneamiento estricto.
- Se limita la tasa por IP y cuenta: login, recuperación y checkout tienen reglas más estrictas. En GCP se combina Cloud Armor con un límite de aplicación, por ejemplo Bucket4j.
- Se aplica CORS con la URL exacta del frontend; no `*` con credenciales. CSRF se evalúa si se usan cookies; con JWT por `Authorization` se mantiene deshabilitado solo de forma justificada.
- Los secretos se leen de variables en desarrollo y de GCP Secret Manager en producción. `.env`, llaves, tokens y archivos de credenciales nunca se versionan.

### Cabeceras y transporte

Producción exige HTTPS con TLS 1.3, redirección desde HTTP y HSTS. Spring Security agrega CSP restrictiva, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` y una política de permisos mínima. La API aplica límites de carga y tipos de contenido admitidos.

## 4 Inventario, pedidos y pagos

El inventario es el punto crítico del negocio. Para modificar catálogo se usa bloqueo optimista con `@Version`. Para reservar una variante durante checkout, el repositorio adquiere `PESSIMISTIC_WRITE` dentro de una transacción breve: verifica disponibilidad, incrementa reserva y crea un pedido `PENDING_PAYMENT`. Al confirmar un webhook firmado de la pasarela, descuenta el inventario reservado y cambia el pedido a `PAID`; si expira o falla el pago, libera la reserva.

Las líneas de pedido guardan una instantánea de producto, variante, cantidad y precio. Ningún cambio de catálogo puede alterar un pedido histórico. La pasarela se consume mediante un puerto `PaymentGateway` con idempotency key; CARPIDI no procesa ni persiste números de tarjeta. Los webhooks se autentican, son idempotentes y se auditan.

Consultas usan `@Transactional(readOnly = true)`. El checkout y transiciones de estado usan transacciones de escritura cortas. El servicio registra auditoría de ajustes de inventario, cambios de precio y acciones administrativas.

## 5 Privacidad y asesoría de imagen

El cuestionario solicita tipo de cuerpo, tono de piel, rango de estatura y preferencias de estilo solo después de consentimiento claro, específico y revocable. La compra funciona si se omite. Las recomendaciones iniciales son reglas explicables; cada respuesta indica el motivo de la sugerencia. El usuario puede corregir, descargar o eliminar su perfil según la política de datos aplicable. Fotografías corporales no forman parte del MVP.

## 6 Resiliencia y observabilidad

Las llamadas a pagos, envíos, correo y una futura IA se protegen con Resilience4j: timeout, circuit breaker, retry con backoff y rate limiter. Un fallo externo no bloquea el catálogo ni duplica cobros. Los reintentos solo se aplican a operaciones idempotentes o con clave de idempotencia.

La API expone health checks y métricas; cada solicitud recibe un `traceId`. Los logs son estructurados, sin contraseñas, tokens, datos de pago ni el contenido sensible del cuestionario. Se monitorizan errores 5xx, latencia p95, tasa de pagos fallidos, stock bajo y reservas vencidas.

## 7 Pruebas y calidad de entrega

- Pruebas unitarias para reglas de precio, stock, transiciones de pedido y recomendaciones.
- Pruebas de integración con PostgreSQL/Testcontainers para repositorios, reservas y control de concurrencia.
- Pruebas de seguridad para `401`, `403`, control de propiedad, validación y limitación de tasa.
- Pruebas de contrato para la API y simulación de webhooks de pago.
- Lint, análisis estático, cobertura y revisión de dependencias en GitHub Actions antes de fusionar.

Una pull request debe describir el caso de uso, incluir pruebas y no mezclar refactorizaciones no relacionadas. Los cambios de esquema se realizan mediante migraciones versionadas de Flyway; no con `ddl-auto` en producción.

## 8 Despliegue y evolución en GCP

El entorno productivo se compone de frontend distribuido por CDN, API stateless en Cloud Run o GKE, Cloud SQL PostgreSQL con copias automáticas, Secret Manager, Cloud Storage para imágenes, Cloud Logging y Cloud Monitoring. Cloud Load Balancing termina TLS y Cloud Armor filtra tráfico abusivo. Las migraciones se ejecutan de forma controlada en el despliegue.

Cuando exista demanda comprobada, `catalog`, `orders`, `identity` y `recommendations` pueden independizarse mediante eventos y colas. La futura IA consume datos minimizados, con consentimiento, métricas de sesgo y mecanismos para que una clienta ignore o corrija recomendaciones.

## 9 Lista de verificación antes de producción

- [ ] Secretos cargados desde Secret Manager, no desde el repositorio.
- [ ] HTTPS, HSTS, CORS restringido y cabeceras defensivas comprobados.
- [ ] JWT corto, refresh rotation, RBAC y ownership cubiertos por pruebas.
- [ ] Webhooks de pago firmados, idempotentes y auditados.
- [ ] Reservas de stock concurrentes probadas contra PostgreSQL.
- [ ] Migraciones Flyway, backups y restauración verificados.
- [ ] Límite de tasa, observabilidad, alertas y runbook operativo activos.
- [ ] Consentimiento y eliminación del cuestionario probados.

## Referencias

- Spring Boot Reference Documentation
- OWASP API Security Top 10 y Cheat Sheet Series
- Google Cloud Architecture Framework
- *Clean Architecture*, Robert C. Martin; *Effective Java*, Joshua Bloch; *Domain-Driven Design*, Eric Evans
