# Historias de usuario

## Clientes

| Historia | Criterio de aceptación |
| --- | --- |
| Como clienta quiero registrarme | Email único y contraseña válida; recibo confirmación. |
| Quiero iniciar sesión | Credenciales correctas generan sesión; incorrectas no revelan cuál campo falló. |
| Quiero recuperar mi contraseña | Recibo enlace de un solo uso, con vencimiento. |
| Quiero editar mi perfil | Los cambios válidos se persisten y solo yo los veo. |
| Quiero ver el catálogo | Veo productos activos paginados. |
| Quiero buscar prendas | El texto encuentra nombre y descripción. |
| Quiero filtrar productos | Puedo combinar categoría, talla y color. |
| Quiero ver variantes | Solo veo variantes disponibles y su precio. |
| Quiero agregar al carrito | La cantidad no supera el inventario disponible. |
| Quiero modificar el carrito | El total y la disponibilidad se recalculan. |
| Quiero comprar | Se crea pedido y se solicita pago seguro. |
| Quiero ver mis pedidos | Solo aparecen mis pedidos, con estado actual. |
| Quiero responder el cuestionario | Puedo omitirlo; requiere consentimiento antes de guardar. |
| Quiero recomendaciones | Veo productos y una razón entendible de cada sugerencia. |
| Quiero cancelar un pedido pendiente | Se libera la reserva si aún no fue despachado. |

## Administradores

| Historia | Criterio de aceptación |
| --- | --- |
| Como administradora quiero crear productos | Deben tener categoría, precio y al menos una variante. |
| Quiero editar productos | Los cambios se reflejan sin alterar líneas de pedidos previos. |
| Quiero desactivar productos | Dejan de venderse, pero se mantienen en historial. |
| Quiero gestionar categorías | No puedo eliminar una categoría con productos activos. |
| Quiero actualizar inventario | No se admiten existencias negativas y queda auditoría. |
| Quiero consultar pedidos | Puedo filtrar por estado y fecha. |
| Quiero actualizar el estado de un pedido | Solo se permiten transiciones válidas. |
| Quiero gestionar usuarios | Puedo activar o bloquear cuentas con justificación auditada. |
| Quiero ver el dashboard | Veo ventas, pedidos, productos con bajo stock y clientes. |
| Quiero gestionar recomendaciones base | Puedo mantener reglas sin acceder a datos no consentidos. |
