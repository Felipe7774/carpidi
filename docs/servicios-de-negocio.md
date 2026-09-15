# Servicios de negocio de CARPIDI

Este documento traduce la arquitectura de CARPIDI a servicios de negocio implementables. Cada servicio posee un responsable, reglas, entradas, salidas y eventos relevantes. La API REST es la puerta de entrada; los servicios no dependen de controladores, DTOs HTTP ni JPA.

## 1 Identidad y acceso

**Responsabilidad:** registrar clientes, autenticar usuarios, renovar sesión, recuperar contraseñas y aplicar roles `CLIENT` y `ADMIN`.

| Caso de uso | Entrada | Salida | Reglas |
| --- | --- | --- | --- |
| Registrar cliente | nombre, email, contraseña | usuario creado | Email único; contraseña BCrypt; rol inicial `CLIENT`. |
| Iniciar sesión | email, contraseña | access/refresh token | No revela si el email existe; aplica límite de tasa. |
| Renovar sesión | refresh token | par de tokens nuevo | Rota y revoca el token anterior. |
| Recuperar contraseña | email, token temporal, contraseña | confirmación | Token de un solo uso; revoca sesiones activas. |
| Gestionar perfil | usuario autenticado, cambios válidos | perfil actualizado | Solo el dueño puede modificarlo. |

## 2 Catálogo y categorías

**Responsabilidad:** publicar prendas, zapatos y accesorios, organizarlos por categorías y exponer un catálogo público filtrable.

| Caso de uso | Entrada | Salida | Reglas |
| --- | --- | --- | --- |
| Buscar catálogo | texto, filtros, página | productos activos paginados | Solo `ACTIVE`; máximo 100 resultados por página. |
| Consultar producto | slug o id | detalle y variantes | Incluye disponibilidad, no expone datos administrativos. |
| Crear/editar producto | DTO de producto, ADMIN | producto | Categoría obligatoria; al menos una variante; slug/SKU únicos. |
| Activar/inactivar producto | id, estado, ADMIN | producto actualizado | Inactivar no elimina el histórico de compras. |
| Gestionar categorías | nombre, slug, ADMIN | categoría | No eliminar si conserva productos activos. |

## 3 Inventario

**Responsabilidad:** conocer disponibilidad, registrar ajustes y reservar unidades sin sobreventa.

| Caso de uso | Entrada | Salida | Reglas |
| --- | --- | --- | --- |
| Consultar disponibilidad | variante | disponible/reservado | No permite cantidades negativas. |
| Ajustar inventario | variante, delta, motivo, ADMIN | inventario actualizado | Genera auditoría con usuario y fecha. |
| Reservar stock | variante, cantidad, pedido | reserva temporal | Bloqueo pesimista; falla con `409` si no alcanza. |
| Confirmar/liberar reserva | pago aprobado/fallido o vencimiento | inventario consistente | Operación idempotente y transaccional. |

## 4 Carrito y pedidos

**Responsabilidad:** conservar el carrito de cada clienta, validar la compra y gestionar el ciclo del pedido.

| Caso de uso | Entrada | Salida | Reglas |
| --- | --- | --- | --- |
| Gestionar carrito | variante, cantidad, CLIENT | carrito actualizado | La disponibilidad se valida al agregar y en checkout. |
| Crear pedido | dirección, método de pago, carrito | pedido `PENDING_PAYMENT` | Congela precio/nombre/SKU y crea reservas. |
| Consultar pedidos | usuario, filtros | historial autorizado | CLIENT ve los propios; ADMIN ve todos. |
| Cambiar estado | pedido, transición, ADMIN | pedido actualizado | Solo transiciones válidas y auditadas. |

## 5 Pagos

**Responsabilidad:** iniciar el pago externo y reconciliar su resultado sin almacenar datos de tarjeta.

| Caso de uso | Entrada | Salida | Reglas |
| --- | --- | --- | --- |
| Iniciar pago | pedido, proveedor | referencia de pago | Clave de idempotencia por intento. |
| Procesar webhook | firma, evento proveedor | pago/pedido actualizado | Verifica firma y evita duplicados. |
| Fallo o reversión | evento proveedor | reserva liberada o pago reversado | Nunca duplica descuento de inventario. |

## 6 Asesoría y recomendaciones

**Responsabilidad:** guardar un perfil de estilo voluntario y producir sugerencias explicables.

| Caso de uso | Entrada | Salida | Reglas |
| --- | --- | --- | --- |
| Guardar cuestionario | tipo de cuerpo, piel, estatura, estilo, consentimiento | perfil | Sin consentimiento no persiste datos. |
| Recomendar productos | perfil consentido, catálogo activo | lista y motivo | La compra no depende de recomendar. |
| Revocar perfil | CLIENT | perfil y recomendaciones eliminados | Cumple solicitud de eliminación. |

## 7 Administración y comunidad

**Responsabilidad:** operación del negocio, trazabilidad, reseñas y métricas del MVP.

| Caso de uso | Entrada | Salida | Reglas |
| --- | --- | --- | --- |
| Dashboard | ADMIN | ventas, pedidos, bajo stock | Datos agregados; no expone secretos. |
| Gestionar usuarios | estado, ADMIN | usuario activado/bloqueado | Auditoría obligatoria. |
| Crear reseña | compra verificada, calificación, CLIENT | reseña pendiente/publicada | Una reseña por detalle de pedido. |
| Moderar reseña | estado, ADMIN | reseña actualizada | No se destruye trazabilidad. |

## Dependencias y contratos

- `OrderService` consume puertos de `InventoryService` y `PaymentGateway`.
- `RecommendationService` solo usa datos de un cuestionario con consentimiento y productos activos.
- `CatalogService` publica cambios para invalidar caché futura.
- Todos los comandos devuelven errores de dominio que el adaptador HTTP transforma a RFC 7807.
