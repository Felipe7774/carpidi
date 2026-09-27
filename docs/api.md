# API REST v1

Todas las rutas se prefijan con `/api/v1`. Las respuestas de error usan `application/problem+json` con `status`, `title`, `detail`, `type` e `instance`.

## Autenticación

| Método y ruta | Request | Respuesta | Códigos |
| --- | --- | --- | --- |
| `POST /auth/register` | `name,email,password` | usuario y roles | 201, 400, 409 |
| `POST /auth/login` | `email,password` | `accessToken,refreshToken,expiresIn,user` | 200, 401 |
| `POST /auth/refresh-token` | `refreshToken` | tokens renovados | 200, 401 |
| `POST /auth/logout` | `refreshToken` | vacío | 204 |

La recuperación de contraseña está planificada para una iteración posterior del MVP.

## Catálogo

| Método y ruta | Request / parámetros | Respuesta | Códigos |
| --- | --- | --- | --- |
| `GET /products` | `q,category,size,color,page,pageSize` | página de productos activos | 200, 400 |
| `GET /products/{id}` | - | producto con variantes | 200, 404 |
| `POST /products` | producto, categoría, variantes e inventario | producto | 201, 400, 403, 409 |
| `PUT /products/{id}` | datos generales del producto | producto | 200, 400, 403, 404, 409 |
| `DELETE /products/{id}` | - | vacío | 204, 403, 404 |
| `GET /categories` | - | categorías activas | 200 |
| `POST /categories` | `name,slug` | categoría | 201, 400, 403, 409 |

## Pedidos y recomendaciones

| Método y ruta | Request | Respuesta | Códigos |
| --- | --- | --- | --- |
| `GET /orders` | `page,size` | pedidos del cliente o todos para ADMIN | 200, 403 |
| `POST /orders` | `items,address,paymentMethod` | pedido pendiente de pago | 201, 400, 409 |
| `POST /questionnaire` | perfil de estilo y consentimiento | cuestionario guardado | 201, 400, 401 |
| `GET /recommendations` | - | productos recomendados y motivo | 200, 401 |

### Ejemplo de pedido

```json
{
  "items": [{"variantId":"uuid","quantity":2}],
  "shippingAddress": {"line1":"Calle 1","city":"Bogotá","country":"CO"},
  "paymentMethod":"PAYU"
}
```
