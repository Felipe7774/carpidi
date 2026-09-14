# Arquitectura de software de CARPIDI

## Decisiones

CARPIDI inicia como un monolito modular con API REST. Esta decisión reduce la complejidad operativa del MVP, permite desplegar frontend, API y base de datos de forma coordinada y conserva límites de dominio claros para extraer servicios cuando el volumen lo justifique. El frontend es una SPA en React y se comunica exclusivamente con la API a través de HTTPS.

El backend sigue arquitectura hexagonal pragmática: `api` recibe HTTP, `application` contiene casos de uso, `domain` modela las reglas y `infrastructure` implementa persistencia y servicios externos. Los módulos son `identity`, `catalog`, `orders`, `recommendations` y `administration`; no se permiten dependencias directas entre repositorios de módulos.

## Límites del sistema

Dentro de CARPIDI están catálogo, perfiles, cuestionario voluntario, recomendaciones, carrito, pedidos, inventario y administración. Fuera del sistema quedan el cobro real, la entrega y las notificaciones; se integran mediante puertos para una pasarela de pagos, operador logístico y proveedor de correo. El MVP no almacena información de tarjetas.

## Componentes y capas

| Capa | Responsabilidad |
| --- | --- |
| React | Vistas, navegación, formularios, sesión y estado de carrito |
| API REST | Autenticación, validación, autorización, orquestación de casos de uso |
| Aplicación | Registro, catálogo, checkout, inventario y recomendaciones |
| Dominio | Entidades, reglas, roles y transiciones de pedido |
| Infraestructura | PostgreSQL, JWT, BCrypt, adaptadores de pago y mensajería |

## Atributos de calidad

- **Seguridad:** TLS, JWT de corta duración con refresh token revocable, BCrypt, RBAC, validaciones y auditoría de cambios administrativos.
- **Rendimiento:** índices en búsqueda y catálogo, paginación obligatoria, caché posterior para categorías y productos publicados.
- **Disponibilidad:** contenedores sin estado, copias de seguridad de PostgreSQL y health checks.
- **Escalabilidad:** API horizontal, almacenamiento de imágenes externo y módulos independientes listos para extracción.
- **Mantenibilidad:** TypeScript estricto, DTOs separados de entidades, migraciones versionadas, pruebas y contratos API.
- **Usabilidad:** diseño móvil primero, filtros accesibles, checkout corto y asesoría totalmente opcional.

## Evolución

Cuando el tráfico o equipos independientes lo requieran, separar `catalog`, `orders`, `identity` y `recommendations` tras eventos de dominio. La IA se añadirá como servicio de recomendación que consume un perfil anonimizado y eventos de catálogo; inicialmente se mantiene el motor de reglas explicable. La nube debe incorporar CDN para imágenes, servicio gestionado de PostgreSQL, colas para notificaciones e infraestructura declarativa. Pagos se conectan mediante el puerto `PaymentGateway` y webhooks firmados. La analítica avanzada se alimenta de eventos de navegación, pedido y recomendación, nunca de secretos ni datos sensibles sin consentimiento.
