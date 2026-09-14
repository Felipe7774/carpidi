# Modelo relacional

## Tablas principales

| Tabla | Clave y atributos principales | Relaciones |
| --- | --- | --- |
| `users` | `id`, `email` único, `password_hash`, `enabled`, `created_at` | N:M con `roles`; 1:N con pedidos y cuestionarios |
| `roles` | `id`, `name` único (`ADMIN`, `CLIENT`) | N:M con usuarios mediante `user_roles` |
| `customers` | `user_id` PK/FK, `full_name`, teléfono opcional | 1:1 con usuario cliente; 1:N con pedidos |
| `admins` | `user_id` PK/FK, `display_name` | 1:1 con usuario administrador |
| `categories` | `id`, `name` único, `slug`, `active` | 1:N con productos |
| `products` | `id`, `category_id`, `name`, `description`, `base_price`, `active` | 1:N con variantes |
| `product_variants` | `id`, `product_id`, `size`, `color`, `sku` único, `price` | 1:1 con inventario; N:1 en detalle de pedido |
| `inventory` | `id`, `variant_id` único, `available`, `reserved`, `version` | Una fila por variante; control optimista |
| `orders` | `id`, `customer_id`, `status`, `total`, dirección congelada, `created_at` | 1:N con detalles y pagos |
| `order_details` | `id`, `order_id`, `variant_id`, nombre congelado, `unit_price`, `quantity` | N:1 pedido y variante |
| `payments` | `id`, `order_id`, proveedor, referencia externa, monto, estado | N:1 pedido |
| `style_questionnaires` | `id`, `customer_id`, cuerpo, piel, estatura, preferencias, consentimiento | N:1 cliente |
| `recommendations` | `id`, `customer_id`, `product_id`, motivo, puntuación | N:1 cliente y producto |

## Integridad y privacidad

- Índices: `products(category_id, active)`, `product_variants(sku)`, `orders(customer_id, created_at)`, `recommendations(customer_id, created_at)`.
- `available >= 0`, `reserved >= 0` y `reserved <= available + reserved` se validan en servicio y en restricciones de base de datos.
- Direcciones y precios se copian al pedido para conservar la evidencia transaccional.
- El cuestionario requiere `consent = true`; su revocación debe eliminar o anonimizar el perfil y las recomendaciones asociadas según la política de retención.
