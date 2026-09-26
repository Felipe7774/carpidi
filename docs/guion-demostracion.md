# Guion de demostración de CARPIDI

Duración estimada: **5 a 7 minutos**.

## 1. Problema y propuesta de valor — 40 segundos

CARPIDI es un comercio electrónico de ropa femenina, zapatos y accesorios. Su diferencial es el cuestionario de estilo opcional: a partir de tipo de cuerpo, tono de piel, estatura y preferencias, el sistema recomienda productos del catálogo.

## 2. Arquitectura — 60 segundos

- React + TypeScript + Tailwind para el frontend.
- Spring Boot 3 / Java 21, JWT y BCrypt para la API.
- PostgreSQL en Cloud SQL para datos transaccionales.
- Cloud Run para el backend y Secret Manager para secretos.
- Docker Compose para la ejecución local reproducible.

Mostrar los diagramas PlantUML de `docs/diagramas/` y la guía [DEPLOY_GCP.md](DEPLOY_GCP.md).

## 3. Recorrido funcional — 2 minutos

1. Abrir el catálogo público y filtrar productos.
2. Abrir un producto, seleccionar una variante de talla/color y agregarla al carrito.
3. Iniciar sesión como cliente, completar dirección y confirmar el checkout.
4. Abrir **Mis pedidos** y mostrar el pedido `PENDING_PAYMENT`.
5. Abrir **Mi estilo**, guardar el cuestionario y mostrar recomendaciones.
6. Iniciar sesión como ADMIN y abrir `/admin`: crear un producto con descripción, SKU, talla, color y cantidad; señalar que el inventario se muestra en la tabla.

## 4. Pruebas de servicios — 90 segundos

Abrir Bruno y ejecutar:

1. `health` y `catalog/list-products`: ambos con `200`.
2. `auth/register-invalid`: `400`; `catalog/product-not-found`: `404`; `orders/list-orders` sin token: `401`.
3. Con token CLIENT: `orders/checkout` devuelve `201`; `orders/list-orders` devuelve `200`.

Mencionar que la evidencia de ejecución real está en [evidencia-validacion-2026-09-26.md](evidencia-validacion-2026-09-26.md), incluyendo el descuento comprobado de stock 10 → 9.

## 5. Seguridad y cierre — 40 segundos

- Las contraseñas se almacenan con BCrypt; las sesiones usan JWT.
- Los endpoints administrativos exigen el rol ADMIN y los pedidos exigen CLIENT.
- Los secretos de producción se manejan con Secret Manager y no están en Git.
- El pago es `MANUAL_TEST` en el MVP; una pasarela real es parte de la siguiente iteración.

Finalizar mostrando el frontend público y el repositorio. No mostrar tokens, contraseñas, claves GCP ni datos personales en pantalla.
