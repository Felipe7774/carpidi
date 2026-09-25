# Matriz de evidencia de servicios

| Servicio | Método | Ruta | Éxito | Error controlado | Cliente |
|---|---:|---|---:|---:|---|
| Salud | GET | `/api/v1/health` | 200 | — | Postman / Bruno |
| Registro | POST | `/api/v1/auth/register` | 201 | 400 validación | Postman / Bruno |
| Inicio de sesión | POST | `/api/v1/auth/login` | 200 | 401 credenciales | Postman / Bruno |
| Catálogo | GET | `/api/v1/products` | 200 | 404 producto | Postman / Bruno |
| Categorías | GET | `/api/v1/categories` | 200 | — | Postman / Bruno |
| Checkout | POST | `/api/v1/orders` | 201 | 401 / 409 inventario | Postman / Bruno |
| Historial | GET | `/api/v1/orders` | 200 | 401 sin token | Postman / Bruno |
| Cuestionario | POST | `/api/v1/questionnaire` | 201 | 400 validación | Postman |
| Recomendaciones | GET | `/api/v1/recommendations` | 200 | 401 sin token | Postman / Bruno |
| Administración | POST/DELETE | `/api/v1/products` | 201/204 | 403 sin rol ADMIN | Bruno |

Para la demostración, ejecutar primero Health, luego Register/Login y conservar el token únicamente dentro del entorno local de Postman o Bruno. No incluir tokens en capturas ni subirlos a GitHub.

## Guion breve para la evidencia de evaluación

1. En Bruno, configura en el entorno local `baseUrl`, `clientEmail`, `clientPassword`, `accessToken` y un `variantId` existente. Esos valores son locales y no se versionan.
2. Ejecuta `Health`, `List categories`, `List products`, `Register client` (con correo único) y `Login`. Deben devolver respectivamente `200`, `200`, `200`, `201` y `200`.
3. Ejecuta `Reject invalid registration`, `Product not found` y `Reject invalid checkout`. Deben devolver `400`, `404` y `400`, evidenciando errores controlados.
4. Con una variante que tenga inventario, ejecuta `Checkout` y luego `List orders`. Deben devolver `201` y `200`; el checkout crea el pedido `PENDING_PAYMENT` y descuenta una unidad del inventario de esa variante.
5. Para la evidencia administrativa, inicia sesión con un JWT de ADMIN, registra un producto desde `/admin` con descripción, SKU, talla/color y cantidad, y captura la respuesta `201` de `Create product as ADMIN`.

Las capturas deben mostrar únicamente códigos HTTP, cuerpos no sensibles y datos de catálogo/pedidos de prueba. Nunca mostrar tokens, contraseñas, secretos de GCP ni cadenas de conexión.

## Validación pública ejecutada

El 25 de septiembre de 2026 se validó la API desplegada en Cloud Run con datos reales de Cloud SQL, sin registrar credenciales ni tokens: registro `201`, inicio de sesión `200`, cuestionario `201`, recomendaciones con seis resultados y consulta de pedidos sin token `401`. El catálogo público respondió `200` con seis productos.

También se validó el checkout completo: la primera solicitud incompleta devolvió `400` y una solicitud con dirección y método de pago obtuvo `201`, creó un pedido `PENDING_PAYMENT` por `$189.900` y lo mostró en el historial del cliente.
