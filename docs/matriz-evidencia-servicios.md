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
