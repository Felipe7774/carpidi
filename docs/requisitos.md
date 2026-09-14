# Requisitos y reglas de negocio

## Requisitos funcionales

1. Los clientes se registran, inician sesión, recuperan acceso y gestionan su perfil.
2. El catálogo permite búsqueda, paginación y filtros por categoría, talla, color y precio.
3. El cliente agrega variantes disponibles al carrito y crea un pedido.
4. El sistema reserva inventario durante el checkout y confirma o libera la reserva al terminar el pago.
5. El cliente consulta sus pedidos y el administrador administra catálogo, categorías, inventario, pedidos, usuarios y métricas básicas.
6. El cuestionario de estilo es voluntario; genera recomendaciones basadas en reglas transparentes.
7. El sistema registra pagos y estados del pedido sin guardar datos de tarjeta.

## Requisitos no funcionales y restricciones

- React con TypeScript, Tailwind, React Router, Axios; Java 21, Spring Boot, Maven, PostgreSQL y Docker Compose.
- API JSON versionada bajo `/api/v1`, UTC en fechas, paginación y errores RFC 7807.
- Contraseñas con BCrypt; acceso por roles `ADMIN` y `CLIENT`; no exponer entidades JPA en respuestas.
- La plataforma protege los datos personales y solicita consentimiento antes de tratar el perfil de estilo.
- Soportar pantalla móvil y navegadores modernos; objetivo inicial: respuesta p95 de catálogo menor a 500 ms sin imágenes.

## Reglas de negocio

1. Solo productos activos y con inventario disponible se pueden comprar.
2. Cada línea del pedido conserva el precio, nombre y variante comprados; cambios posteriores del catálogo no alteran el histórico.
3. El stock nunca puede ser negativo y toda modificación administrativa queda auditada.
4. El asesoramiento no bloquea catálogo, carrito ni compra.
5. Un cliente solo accede a sus propios pedidos y perfil; un administrador no usa el perfil de estilo para fines ajenos a la recomendación.
6. Un pedido pasa por `PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED` o `PAYMENT_FAILED`.
