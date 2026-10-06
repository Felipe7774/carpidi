# Evidencia de validación pública — CARPIDI

**Fecha:** 26 de septiembre de 2026, 14:35 (-05:00)  
**Entorno:** Cloud Run + Cloud SQL PostgreSQL  
**API:** `https://carpidi-api-a3w662uxxq-uc.a.run.app/api/v1`

## Resultado de pruebas con datos reales

| Escenario | Resultado esperado | Resultado obtenido | Evidencia |
|---|---:|---:|---|
| Salud de la API | 200 | 200 | Servicio activo en Cloud Run |
| Catálogo público | 200 | 200 | Productos y variantes disponibles |
| Registro de cliente temporal | 201 | 201 | Cuenta CLIENT creada para prueba |
| Inicio de sesión | 200 | 200 | JWT recibido solo en memoria |
| Consulta de perfil | 200 | 200 | Perfil protegido accesible por su dueño |
| Cuestionario de estilo | 201 | 201 | Preferencias almacenadas |
| Recomendaciones | 200 | 200 | 6 recomendaciones retornadas |
| Checkout | 201 | 201 | Pedido creado como `PENDING_PAYMENT` |
| Historial de pedidos | 200 | 200 | Pedido visible para el cliente |
| Stock de la variante probada | -1 unidad | 10 → 9 | Descuento de inventario confirmado |
| Registro inválido | 400 | 400 | Validación de campos controlada |
| Producto inexistente | 404 | 404 | Recurso no encontrado controlado |
| Pedidos sin JWT | 401 | 401 | Endpoint protegido correctamente |

La variante utilizada fue `30000000-0000-0000-0000-000000000001`. No se incluyen correos de prueba, contraseñas, tokens, secretos ni cadenas de conexión.

## Cómo reproducirla en Bruno

1. Abre la carpeta `bruno/` y selecciona el entorno local.
2. Ajusta exclusivamente en tu equipo `baseUrl`, correo, contraseña y `variantId`; no guardes esos valores en Git.
3. Ejecuta en este orden: `health`, `auth/register-client`, `auth/login`, `catalog/list-products`, `orders/checkout` y `orders/list-orders`.
4. Para los errores controlados, ejecuta `auth/register-invalid`, `catalog/product-not-found` y `orders/checkout-invalid`.

Las solicitudes Bruno incluyen aserciones para los códigos HTTP críticos. Esta matriz complementa la evidencia visual que se mostrará durante la sustentación.

## Revalidación local con Bruno 4.2.1 — 5 de octubre de 2026

Se ejecutaron solicitudes seguras contra `http://localhost:8080/api/v1`, conectado al PostgreSQL local de Docker. La prueba de catálogo devolvió tres registros reales.

| Solicitud Bruno | HTTP esperado | HTTP obtenido | Estado |
|---|---:|---:|---|
| `health.bru` | 200 | 200 | PASS |
| `catalog/list-products.bru` | 200 | 200 | PASS |
| `catalog/product-not-found.bru` | 404 | 404 | PASS |
| `auth/register-invalid.bru` | 400 | 400 | PASS |
| `orders/list-orders-unauthorized.bru` | 401 | 401 | PASS |

Estas pruebas no crean usuarios, productos ni pedidos. Demuestran disponibilidad, consumo de datos reales y manejo controlado de validación, autenticación y recursos inexistentes.
