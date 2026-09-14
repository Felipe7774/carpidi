# API REST v1

Todas las rutas se prefijan con `/api/v1`. Las respuestas de error usan `application/problem+json` con `status`, `title`, `detail` y `traceId`.

## Autenticación

| Método y ruta | Request | Respuesta | Códigos |
| --- | --- | --- | --- |
| `POST /auth/register` | `name,email,password` | `userId,email` | 201, 400, 409 |
| `POST /auth/login` | `email,password` | `accessToken,refreshToken,expiresIn,user` | 200, 401 |
| `POST /auth/refresh-token` | `refreshToken` | tokens renovados | 200, 401 |
| `POST /auth/forgot-password` | `email` | vacío | 202 |

## Catálogo

| Método y ruta | Request / parámetros | Respuesta | Códigos |
| --- | --- | --- | --- |
| `GET /products` | `q,category,size,color,page,size,sort` | `items,page` | 200 |
| `GET /products/{id}` | - | producto con variantes | 200, 404 |
| `POST /products` | producto y variantes | producto | 201, 400, 403 |
| `PUT /products/{id}` | producto y variantes | producto | 200, 403, 404 |
| `DELETE /products/{id}` | - | vacío | 204, 403, 404 |

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
