# CARPIDI

Plataforma de comercio electrónico para ropa femenina con asesoría de imagen opcional.

## Objetivo

Vender ropa, zapatos y accesorios en línea, ofreciendo a cada cliente recomendaciones opcionales basadas en morfología corporal, tono de piel y estatura.

## Primera versión

La primera versión del producto incluirá:

- Catálogo de productos con fotos, tallas, colores y precios.
- Carrito de compras y proceso de pago seguro.
- Registro e inicio de sesión de clientes.
- Panel básico para administrar productos y pedidos.
- Cuestionario voluntario de estilo para recibir recomendaciones.

## Alcance posterior

- Asesoría virtual con especialistas de imagen.
- Recomendaciones de looks y combinaciones.
- Inventario sincronizado, promociones y seguimiento de envíos.
- Métricas de ventas y comportamiento de clientes.

## Arquitectura y documentación

- [Visión del producto](docs/vision-del-producto.md)
- [Plan inicial](docs/plan-inicial.md)
- [Requisitos y reglas de negocio](docs/requisitos.md)
- [Arquitectura de software](docs/arquitectura.md)
- [Diseño de APIs REST](docs/api.md)
- [Modelo relacional](docs/modelo-datos.md)
- [Historias de usuario](docs/historias-usuario.md)
- [Matriz y guía de pruebas](docs/matriz-evidencia-servicios.md)
- [Evidencia de validación pública](docs/evidencia-validacion-2026-09-26.md)
- [Guion de demostración](docs/guion-demostracion.md)
- Diagramas C4 y UML en `docs/diagramas/` (PlantUML).

## Ejecutar en desarrollo

1. Copia `.env.example` como `.env` y asigna valores locales seguros.
2. Inicia PostgreSQL y la API con `docker compose up --build`.
3. En otra terminal: `cd frontend`, `npm install` y `npm run dev`.
4. La API queda en `http://localhost:8080/api/v1` y el frontend en el puerto indicado por Vite.

En GCP, las credenciales de Cloud SQL y el secreto JWT se suministrarán mediante Secret Manager y la cuenta de servicio de Cloud Run.

## Enlaces de demostración

- **Frontend público:** [CARPIDI Web](https://carpidi-web.carlosgcb74.chatgpt.site)
- **API pública (salud):** [Cloud Run /api/v1/health](https://carpidi-api-a3w662uxxq-uc.a.run.app/api/v1/health)

El frontend se conecta a la API desplegada; no requiere Docker ni un servidor local para la demostración.

## Estado

MVP desplegado: autenticación JWT, catálogo, carrito, checkout con descuento de inventario, historial de pedidos, cuestionario/recomendaciones y panel ADMIN para productos e inventario. La integración con una pasarela de pago real, seguimiento de envíos y recomendaciones con IA quedan como evolución posterior.
