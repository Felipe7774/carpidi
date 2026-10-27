# CARPIDI — Sistema de diseño

> Fuente de verdad visual local: `docs/UXMAPING_V1.PDF`, `docs/ux-screens/` y
> `frontend/src/styles.css`. Este documento consolida los tokens ya aplicados en
> la interfaz; no contiene claves, contratos API ni reglas de backend.

## 1. Principios visuales

- **Quiet luxury:** composición editorial, sobria y espaciosa; evitar gradientes
  llamativos, sombras fuertes, colores saturados o componentes tipo SaaS.
- **Moda premium:** el producto, la tipografía serif y el espacio en blanco son
  los protagonistas.
- **Claridad funcional:** los formularios, filtros, estados y llamadas a la
  acción deben ser fáciles de identificar sin romper el tono editorial.
- **Consistencia:** reutilizar los tokens y clases existentes antes de crear
  estilos locales o valores hexadecimales nuevos.

## 2. Tokens de color

| Token | Valor | Uso |
|---|---:|---|
| `--bg-primary` | `#FAF8F5` | Fondo global alabastro. |
| `--bg-card` | `#FFFFFF` | Tarjetas, inputs y superficies elevadas. |
| `--text-primary` | `#1C1917` | Texto principal, botones oscuros y navegación activa. |
| `--text-muted` | `#78716C` | Texto secundario, ayudas y metadatos. |
| `--border-subtle` | `#ECE6DE` | Bordes de tarjetas y separadores suaves. |
| `--border-input` | `#D8CFC4` | Bordes de inputs, filtros y selectores. |
| `--accent-wine` | `#8B395A` | Categoría y acento editorial puntual. |
| `--accent-pink-bg` | `#FFF4F7` | Fondo de KPI administrativo. |
| `--accent-pink-text` | `#A13B61` | Valor principal de KPI administrativo. |
| Sin token | `#F4EDE6` | Barra de sesión activa. |
| Sin token | `#E6DDD3` | Separadores cálidos. |
| Sin token | `#2F2B28` | Hover de botón oscuro. |

### Estados semánticos

| Estado | Fondo | Texto / borde |
|---|---:|---:|
| Error | `#FEF2F2` | `#991B1B` / `#EF4444` |
| Éxito | `#ECFDF5` | `#065F46` / `#10B981` |
| Pedido pendiente | `#FEF3C7` | `#92400E` |
| Pedido pagado | `#D1FAE5` | `#065F46` |

No usar colores de estado como decoración. Deben comunicar disponibilidad,
resultado de una acción o estado de un pedido.

## 3. Tipografía

### Serif editorial

```css
--font-serif: "Playfair Display", "Bodoni Moda", "Didot", "Cormorant Garamond", Georgia, serif;
```

Usar en logotipo, `h1`, `h2`, `h3`, `.serif-title`, cifras KPI y titulares de
hero. Peso base `500`; `letter-spacing: -0.01em` en encabezados.

### Sans-serif funcional

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

Usar en navegación, cuerpo, formularios, filtros, precios, ayudas, badges y
mensajes de estado.

### Escala aplicada

| Elemento | Tamaño |
|---|---:|
| Logo | `1.75rem` |
| Hero | `2.75rem` / `1.15` de interlineado |
| Título de página | `2.25rem` |
| Detalle de producto | `2.5rem` |
| Título de tarjeta de producto | `1.25rem` |
| Precio de detalle | `1.75rem` |
| Texto de cuerpo | `0.9rem`–`1.05rem` |
| Etiqueta / navegación | `0.70rem`–`0.80rem`, mayúsculas |

Las etiquetas funcionales usan peso `600` o `700`, `text-transform: uppercase`
y `letter-spacing` entre `0.08em` y `0.16em`.

## 4. Espaciado y layout

- Contenedor principal: `max-width: 1180px`, margen superior `2.5rem`, padding
  horizontal `1.5rem`.
- Cabecera y footer: padding lateral `6%`.
- Tarjeta estándar: padding `2.25rem`, radio `8px`, margen inferior `2rem`.
- Tarjeta angosta de autenticación: `max-width: 480px`, centrada, margen
  vertical `3rem`.
- Separación habitual entre controles: `0.5rem`, `0.75rem`, `1.25rem`,
  `1.75rem`, `2.5rem` y `3.5rem`.
- Nunca comprimir formularios o tarjetas para llenar espacio: se prioriza el
  aire visual y la legibilidad.

### Grillas

| Componente | Desktop | Pantalla ≤ 900px |
|---|---|---|
| Productos | `repeat(auto-fill, minmax(260px, 1fr))` | Fluida por ancho disponible |
| Detalle de producto | 2 columnas | 1 columna |
| Carrito / checkout | `1fr 380px` | 1 columna |
| KPI admin | 3 columnas | 1 columna |
| Pilares de footer | 3 columnas | 1 columna |

La cabecera se convierte en columna a `900px` y mantiene los enlaces visibles
sin usar un patrón de dashboard lateral.

## 5. Bordes, radios y elevación

| Elemento | Borde | Radio |
|---|---|---:|
| Card | `1px solid var(--border-subtle)` | `8px` |
| Input / select / textarea | `1px solid var(--border-input)` | `4px` |
| Botón principal | Sin borde | `4px` |
| Selector de variante | `1px solid var(--border-input)` | `6px` |
| Hero y KPI | Borde sutil | `12px` |
| Chips y bolsa | Borde sutil o sin borde | `9999px` |

La sombra de tarjeta es mínima: `0 4px 20px rgba(28, 25, 23, 0.03)`. El hover
de producto utiliza desplazamiento vertical de `-3px` y una sombra suave.

## 6. Componentes

### Header

1. Barra de anuncios oscura (`#1C1917`), texto blanco, mayúsculas y tracking.
2. Header marfil adhesivo, logo serif a la izquierda, navegación central y
   acciones a la derecha.
3. La bolsa es un pill negro con contador.
4. La ruta activa se indica con subrayado negro, no con relleno de color.

### Formularios

- Labels en mayúsculas, `0.75rem`, peso `600` y tracking `0.08em`.
- Inputs blancos, padding `0.75rem 1rem` y foco en negro con anillo fino.
- Mostrar el error junto al formulario en una alerta semántica; no solo por
  color.
- El botón primario ocupa el ancho requerido por el contexto y usa texto en
  mayúsculas.

### Botones

- Primario: fondo `#1C1917`, texto blanco, `padding: 0.85rem 1.75rem`.
- Hover: `#2F2B28`.
- Secundario: fondo marfil, borde de input y texto negro.
- Deshabilitado: `opacity: 0.6` y cursor no interactivo.

### Catálogo y productos

- Las tarjetas incluyen marco de imagen, metadato en vino, título serif,
  precio y acciones.
- Los placeholders de imagen usan el degradado cálido `#EBE4DD` a `#D8CEC3`.
- Marco arqueado: radio superior pronunciado (`120px` en card, `200px` en
  detalle) y base suavemente redondeada.
- Los chips de categoría son pills blancos; activos y hover pasan a negro.

### Estados de UI

- **Loading:** bloque o texto discreto, centrado, con color de texto secundario.
- **Empty:** tarjeta centrada, borde sutil, padding amplio y siguiente acción.
- **Error:** fondo rojo suave, borde izquierdo rojo, texto explicativo y
  reintento cuando la acción pueda repetirse.
- **Success:** fondo verde suave, borde izquierdo verde, mensaje no técnico.

### Administración

- Los KPI usan fondo rosa pálido, borde rosa y cifra serif en vino.
- Las tablas y formularios conservan bordes cálidos; no usar tablas oscuras.
- Las acciones destructivas deben usar confirmación y rojo solo para comunicar
  riesgo.

## 7. Reglas de uso

- Reutilizar las clases existentes: `.card`, `.form-stitch`, `.button-stitch`,
  `.secondary-stitch`, `.products-grid`, `.product-card-stitch`,
  `.arched-frame`, `.empty-state`, `.alert-error` y `.alert-success`.
- Mantener los cuatro estados: loading, success, empty y error en toda vista
  que consume datos.
- No introducir una biblioteca visual nueva ni un sistema de tokens paralelo.
- No usar imágenes o contenido que contradigan los módulos de
  `docs/UXMAPING_V1.PDF`.
- Las nuevas pantallas deben ser responsive desde el diseño base y conservar la
  navegación global de CARPIDI.

## 8. Fuente de verdad y mantenimiento

Cuando un diseño de Google Stitch esté disponible mediante una integración
autorizada, compáralo con este documento y actualiza únicamente los tokens o
reglas que tengan evidencia visual directa. Toda modificación de este archivo
debe conservar la coherencia con `frontend/src/styles.css`.
