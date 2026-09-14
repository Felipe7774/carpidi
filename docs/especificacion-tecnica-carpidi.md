# Especificación técnica y arquitectura de CARPIDI

## 1 Visión y alcance

CARPIDI es una plataforma web de comercio electrónico de ropa femenina, zapatos y accesorios. Su diferenciador es una asesoría de imagen opcional que recomienda productos según tipo de cuerpo, tono de piel, estatura y preferencias de estilo. El MVP opera como boutique propia: CARPIDI administra su catálogo y los clientes compran directamente. Por ello, los roles actuales son `CLIENT`, `ADMIN` y público/invitado.

La capacidad de marketplace con vendedores externos es una evolución futura. No se habilita en el MVP porque requiere verificación de comercios, órdenes divididas, liquidaciones, moderación y obligaciones operativas adicionales.

## 2 Stack tecnológico

| Capa | Tecnología | Uso en CARPIDI |
| --- | --- | --- |
| Web | React, TypeScript, Tailwind CSS, React Router, Axios | SPA móvil primero, catálogo, checkout, perfil y panel administrativo |
| API | Spring Boot 3, Java 21, Maven, Spring MVC, Spring Data JPA | API REST modular, validación, transacciones y casos de uso |
| Seguridad | Spring Security, JWT, BCrypt, RBAC | Sesión sin estado, roles y control de propiedad de recursos |
| Datos | PostgreSQL, Flyway | Datos transaccionales, migraciones y consistencia de inventario |
| Resiliencia | Resilience4j, Bucket4j | Protección de pagos/envíos y límite de tasa |
| Contenedores | Docker y Docker Compose | Entorno de desarrollo reproducible |
| Producción GCP | Cloud Run, Cloud SQL, Cloud Storage, Secret Manager, Cloud Armor, Cloud Logging/Monitoring | Despliegue escalable, imágenes, secretos, protección y observabilidad |

Redis Memorystore se incorpora cuando el catálogo y las sesiones lo requieran; las imágenes se almacenan en Cloud Storage y se entregan mediante CDN. Cloud Run ejecuta una API sin estado y Cloud SQL conserva las transacciones.

## 3 Roles y modelo de autorización

| Rol | Alcance |
| --- | --- |
| Público | Consulta catálogo publicado, categorías, disponibilidad y reseñas aprobadas; puede registrarse e iniciar sesión. |
| `CLIENT` | Gestiona perfil, carrito, cuestionario, recomendaciones y únicamente sus propios pedidos. |
| `ADMIN` | Gestiona productos, categorías, variantes, inventario, pedidos, usuarios, reseñas, métricas y auditoría. |
| `SELLER` futuro | Administra exclusivamente su tienda, productos, stock y subórdenes cuando CARPIDI adopte marketplace. |

Cada token JWT incluye `sub`, roles, emisión, vencimiento y un identificador único. La autorización combina filtros de Spring Security, `@PreAuthorize` y validación de propiedad dentro del caso de uso. Un rol no sustituye la verificación de que el recurso pertenece al usuario autenticado.

## 4 Catálogo de servicios HTTP

Todas las rutas se prefijan con `/api/v1`, producen JSON y devuelven errores RFC 7807. Los listados aceptan `page`, `size` (máximo 100) y `sort`; catálogo acepta además `q`, `category`, `size`, `color`, `minPrice` y `maxPrice`.

### 4.1 Autenticación y cuenta

| Método | Endpoint | Rol | Descripción | Códigos |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Público | Registra un cliente. | 201, 400, 409 |
| POST | `/auth/login` | Público | Autentica y entrega access/refresh token. | 200, 401, 429 |
| POST | `/auth/refresh-token` | Público con refresh | Rota el refresh token. | 200, 401 |
| POST | `/auth/forgot-password` | Público | Solicita recuperación sin revelar si existe el correo. | 202, 429 |
| POST | `/auth/reset-password` | Público con token temporal | Establece nueva contraseña y revoca sesiones. | 204, 400, 401 |
| GET | `/me/profile` | CLIENT, ADMIN | Obtiene el perfil propio. | 200, 401 |
| PATCH | `/me/profile` | CLIENT, ADMIN | Actualiza el perfil propio. | 200, 400, 401 |

### 4.2 Catálogo, categorías e inventario

| Método | Endpoint | Rol | Descripción | Códigos |
| --- | --- | --- | --- | --- |
| GET | `/products` | Público | Lista productos activos, paginados y filtrados. | 200, 400 |
| GET | `/products/{slugOrId}` | Público | Devuelve detalle, variantes, imágenes y disponibilidad. | 200, 404 |
| GET | `/categories` | Público | Lista categorías activas. | 200 |
| GET | `/products/{id}/availability` | Público | Consulta disponibilidad actual por variante. | 200, 404 |
| POST | `/admin/categories` | ADMIN | Crea una categoría. | 201, 400, 403, 409 |
| PATCH | `/admin/categories/{id}` | ADMIN | Actualiza o activa/inactiva categoría. | 200, 400, 403, 404 |
| POST | `/admin/products` | ADMIN | Crea producto, variantes e inventario inicial. | 201, 400, 403 |
| PUT | `/admin/products/{id}` | ADMIN | Reemplaza la información comercial del producto. | 200, 400, 403, 404, 409 |
| PATCH | `/admin/products/{id}/status` | ADMIN | Publica, desactiva o archiva un producto. | 200, 400, 403, 404 |
| PATCH | `/admin/inventory/variants/{id}` | ADMIN | Ajusta stock con motivo auditado. | 200, 400, 403, 404, 409 |
| GET | `/admin/inventory/audit` | ADMIN | Consulta ajustes, bajo stock e inconsistencias. | 200, 403 |

### 4.3 Carrito, checkout, órdenes y pagos

| Método | Endpoint | Rol | Descripción | Códigos |
| --- | --- | --- | --- | --- |
| GET | `/me/cart` | CLIENT | Recupera el carrito activo. | 200, 401 |
| POST | `/me/cart/items` | CLIENT | Agrega variante y cantidad. | 200, 400, 401, 409 |
| PATCH | `/me/cart/items/{itemId}` | CLIENT | Cambia cantidad. | 200, 400, 401, 404, 409 |
| DELETE | `/me/cart/items/{itemId}` | CLIENT | Quita una línea. | 204, 401, 404 |
| POST | `/orders` | CLIENT | Reserva stock, crea pedido e inicia pago. | 201, 400, 401, 409, 422 |
| GET | `/me/orders` | CLIENT | Lista el historial propio. | 200, 401 |
| GET | `/me/orders/{id}` | CLIENT | Consulta un pedido propio. | 200, 401, 403, 404 |
| POST | `/payments/webhooks/{provider}` | Pasarela | Recibe confirmación firmada e idempotente. | 200, 400, 401, 409 |
| GET | `/admin/orders` | ADMIN | Consulta global con filtros. | 200, 403 |
| PATCH | `/admin/orders/{id}/status` | ADMIN | Cambia estado permitido y registra auditoría. | 200, 400, 403, 404, 409 |

### 4.4 Asesoría de imagen y recomendaciones

| Método | Endpoint | Rol | Descripción | Códigos |
| --- | --- | --- | --- | --- |
| POST | `/me/style-questionnaire` | CLIENT | Guarda o actualiza perfil voluntario con consentimiento. | 201, 200, 400, 401 |
| GET | `/me/style-questionnaire` | CLIENT | Consulta perfil propio. | 200, 401, 404 |
| DELETE | `/me/style-questionnaire` | CLIENT | Revoca consentimiento y elimina perfil/recomendaciones. | 204, 401 |
| GET | `/me/recommendations` | CLIENT | Lista productos sugeridos y razón explicable. | 200, 401 |

### 4.5 Administración y reseñas

| Método | Endpoint | Rol | Descripción | Códigos |
| --- | --- | --- | --- | --- |
| GET | `/admin/dashboard` | ADMIN | Métricas básicas de ventas, pedidos y stock. | 200, 403 |
| GET | `/admin/users` | ADMIN | Lista usuarios con paginación. | 200, 403 |
| PATCH | `/admin/users/{id}/status` | ADMIN | Activa o bloquea una cuenta, con auditoría. | 200, 400, 403, 404 |
| POST | `/products/{id}/reviews` | CLIENT | Crea reseña de una compra verificada. | 201, 400, 401, 403, 409 |
| GET | `/products/{id}/reviews` | Público | Lista reseñas visibles. | 200, 404 |
| PATCH | `/admin/reviews/{id}/status` | ADMIN | Modera u oculta reseñas. | 200, 403, 404 |

## 5 Reglas técnicas críticas

### Inventario y checkout

`POST /orders` usa una transacción corta y bloqueo pesimista por variante. Valida precio y stock, reserva unidades y crea pedido `PENDING_PAYMENT`. El webhook firmado confirma un pago con idempotencia: descuenta el stock reservado y cambia el estado a `PAID`. Un pago fallido o reserva vencida libera el inventario. No se guardan tarjetas ni datos sensibles de pago.

### Errores, validación y trazabilidad

Los DTOs son `record` inmutables con Bean Validation. `@RestControllerAdvice` normaliza errores como validación `400`, stock insuficiente `409`, recurso no encontrado `404` y acceso prohibido `403`. Cada solicitud crea un `traceId`; logs y auditoría no registran contraseñas, JWT, información de tarjeta ni respuestas sensibles del cuestionario.

### Seguridad OWASP

Se aplican BCrypt, JWT de 15 minutos, refresh token rotativo, límite de tasa, CORS restringido, CSP, `X-Frame-Options: DENY`, `nosniff`, HSTS en producción y TLS 1.3. Secret Manager administra secretos en GCP. Los webhooks validan firma, fecha e idempotency key. Pruebas automatizadas cubren ownership, roles, validación, abuso y concurrencia de inventario.

## 6 Evolución a marketplace multi-vendedor

Si CARPIDI incorpora `SELLER`, se añaden `stores`, `seller_profiles`, verificación administrativa, productos por tienda, inventario por tienda, `sub_orders`, liquidaciones y trazabilidad de despacho. Se habilitarían rutas `/seller/products`, `/seller/inventory`, `/seller/orders` y `/admin/sellers/{id}/verification`.

La orden de cliente se dividiría en subórdenes por tienda sin cambiar el contrato de pago global. Esta evolución exige un modelo de comisiones, políticas de devolución entre partes, KYC de vendedores, moderación, facturación y soporte operativo; por ello es una fase posterior al MVP validado.

## 7 Referencias de implementación

- [Guía técnica de desarrollo seguro](guia-tecnica-carpidi.md)
- [Arquitectura de software](arquitectura.md)
- [Diseño de APIs REST](api.md)
- [Modelo de datos](modelo-datos.md)
- Spring Boot Reference Documentation, OWASP API Security Project, OWASP Cheat Sheet Series y Google Cloud Architecture Framework.
