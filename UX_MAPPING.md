# CARPIDI — Matriz de Mapeo UX, Arquitectura Frontend y Contratos API REST

---

## A. Propósito y Alcance

### 1. ¿Qué es CARPIDI?
CARPIDI es una plataforma colombiana de comercio electrónico de moda femenina y contemporánea orientada al concepto de *quiet luxury*, prendas de fibras naturales y asesoría de imagen personalizada voluntaria (morfología corporal, tono de piel, estatura y estilo preferido). La plataforma integra catálogo comercial con variantes (talla, color, SKU), carrito de compras, checkout con reserva transaccional de inventario, autenticación JWT basada en roles (`CLIENT` y `ADMIN`), historial de compras, motor de recomendaciones y un panel administrativo para la gestión de catálogo e inventario.

### 2. Función del Documento
Este documento constituye la **Fuente Única de Verdad Técnica y de Experiencia de Usuario (UX)** del proyecto CARPIDI. Conecta de manera formal, trazable y sin ambigüedades:
- Las pantallas, flujos e intenciones de usuario definidos en el documento de UX Mapping y capturas de diseño de Google Stitch / Figma.
- Las rutas, componentes, hooks y manejadores de estado implementados en el cliente web (React + TypeScript + Vite).
- Los contratos de datos, endpoints REST, códigos de estado HTTP y políticas de seguridad configurados en el backend (Java 21 + Spring Boot + Spring Security).

### 3. Fuentes Analizadas
- **Documento UX y Diseños:**
  - Archivo primario UX: [`docs/UXMAPING_V1.PDF`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/UXMAPING_V1.PDF) (8 páginas revisadas en su totalidad).
  - Capturas maestras de interfaz en alta resolución: [`docs/ux-screens/`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/ux-screens/) (`screen-01.png` a `screen-08.jpg`).
- **Frontend Real:**
  - Enrutamiento: [`frontend/src/app/App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx)
  - Vistas y páginas: [`frontend/src/pages/CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx), [`ProductPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProductPage.tsx), [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx), [`LoginPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/LoginPage.tsx), [`RegisterPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/RegisterPage.tsx), [`StylePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/StylePage.tsx), [`OrdersPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/OrdersPage.tsx), [`ProfilePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProfilePage.tsx), [`AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx)
  - Capa de servicios API: [`frontend/src/services/api.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/api.ts), [`auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts), [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts), [`orders.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/orders.ts), [`recommendations.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/recommendations.ts)
  - Estado global de sesión y bolsa: [`frontend/src/state/AuthContext.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/state/AuthContext.tsx), [`frontend/src/state/CartContext.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/state/CartContext.tsx)
  - Variables de entorno y proxies: [`frontend/.env.production`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/.env.production), [`frontend/.env.production.example`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/.env.production.example), [`frontend/vercel.json`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/vercel.json)
- **Backend Real:**
  - Controladores REST: [`backend/src/main/java/com/carpidi/api/`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/) (`AuthController.java`, `CategoryController.java`, `ProductController.java`, `RecommendationController.java`, `OrderController.java`, `ProfileController.java`, `HealthController.java`, `GlobalExceptionHandler.java`)
  - Configuración y seguridad: [`backend/src/main/resources/application.yml`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/resources/application.yml), [`backend/src/main/java/com/carpidi/config/SecurityConfig.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/config/SecurityConfig.java), [`JwtAuthenticationFilter.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/config/JwtAuthenticationFilter.java), [`SecurityProblemWriter.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/config/SecurityProblemWriter.java)
  - Lógica de aplicación y dominio: [`backend/src/main/java/com/carpidi/application/`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/application/) (`AuthService.java`, `CatalogService.java`, `OrderService.java`, `RecommendationService.java`, `JwtService.java`)
- **Documentación de Proyecto:**
  - [`README.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/README.md), [`docs/api.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/api.md), [`docs/servicios-de-negocio.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/servicios-de-negocio.md), [`docs/requisitos.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/requisitos.md), [`docs/modelo-datos.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/modelo-datos.md), [`docs/DEPLOY_GCP.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/DEPLOY_GCP.md).

### 4. Fecha de Generación
**2026-10-19**

### 5. Diferencia entre Información del PDF y Evidencia del Código
- **Información del PDF / Diseños Stitch:** Refleja la visión gráfica, capturas funcionales del MVP ejecutado y una maqueta de alta fidelidad (*Main Dashboard*, página 8) con características aspiracionales (Wishlist/favoritos, banners de curaduría por categorías, newsletter, paginación infinita de archivo y membresía *Maison Privé*).
- **Evidencia del Código:** Refleja el estado ejecutable y desplegado en Google Cloud Run y Vercel. En el código, la pantalla de inicio `/` está servida directamente por [`CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx); el carrito y el formulario de checkout conviven en la misma ruta `/carrito` de [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx); no existe pantalla separada para checkout ni sistema de lista de deseos; y la consulta de pedidos de administradores está restringida a nivel de servicio al correo del propio usuario. Cualquier discordancia se documenta explícitamente en este archivo como brecha funcional o técnica.

---

## B. Fuentes de Verdad

La jerarquía estricta para resolver dudas o inconsistencias entre capas se establece en el siguiente orden de precedencia:

1. **Contratos implementados en Backend (Java / Spring Boot):** Controladores REST, records/DTOs de entrada y salida, beans de validación (`jakarta.validation`), filtros de seguridad Spring Security y esquemas de base de datos Flyway.
2. **Rutas y servicios implementados en Frontend (React / Vite):** Definición de rutas en React Router, contextos de sesión y carrito, llamadas HTTP de Axios/Fetch y tipado en TypeScript.
3. **UX Mapping del PDF ([`docs/UXMAPING_V1.PDF`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/UXMAPING_V1.PDF)):** Capturas reales de la aplicación web en funcionamiento (páginas 1 a 7) que evidencian la interacción efectiva de usuario.
4. **Diseños Google Stitch / Figma ([`screen-08.jpg`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/ux-screens/screen-08.jpg)):** Diseño gráfico de alta fidelidad de la experiencia omnicanal y de marca, utilizado como guía de diseño y catálogo de funcionalidades futuras o brechas de experiencia.

---

## C. Configuración Global

### 1. Variables de Entorno y URLs de API
CARPIDI implementa una separación limpia entre ambientes locales y productivos:

| Parámetro | Entorno | Valor Real en Repositorio | Descripción / Ubicación |
| --- | --- | --- | --- |
| `VITE_API_URL` | Producción (Vercel) | `/api/v1` | Configurado en [`frontend/.env.production`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/.env.production). Vercel reenvía las peticiones mediante rewrite a la URL de Cloud Run. |
| `VITE_API_URL` | Producción Ejemplo | `https://REEMPLAZAR_CON_URL_DE_CLOUD_RUN/api/v1` | Documentado en [`frontend/.env.production.example`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/.env.production.example). |
| `VITE_API_URL` | Fallback Local | `http://localhost:8080/api/v1` | Configurado como fallback predeterminado en [`frontend/src/services/api.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/api.ts). |
| Backend Cloud Run Real | Producción Desplegada | `https://carpidi-api-a3w662uxxq-uc.a.run.app/api/v1` | Verificado en [`frontend/vercel.json`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/vercel.json) y [`README.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/README.md) L52. |
| Frontend Web Real | Producción Desplegada | `https://carpidi-web.carlosgcb74.chatgpt.site` | Verificado en [`README.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/README.md) L51. |

> [!NOTE]
> El proyecto no utiliza `NEXT_PUBLIC_API_URL` debido a que el cliente está construido con Vite y React Router. Todas las referencias públicas se realizan mediante el prefijo `VITE_`.

### 2. Context Path y Prefijo de Rutas
El backend Spring Boot tiene configurado en [`application.yml`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/resources/application.yml):
```yaml
server.servlet.context-path: /api/v1
```
Por ende, cualquier endpoint definido en controladores con `@RequestMapping("/products")` responde efectivamente en la ruta absoluta `/api/v1/products`.

### 3. Cliente HTTP, Interceptores y Headers
- El cliente principal está instanciado con Axios en [`frontend/src/services/api.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/api.ts).
- Posee un interceptor de solicitudes que extrae el token de acceso de `localStorage.getItem('accessToken')` y lo inyecta en el encabezado HTTP:
  ```http
  Authorization: Bearer <accessToken>
  ```
- **Discrepancia en servicios de autenticación:** En [`frontend/src/services/auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts), las operaciones de autenticación (`login`, `register`, `getProfile`) utilizan la API nativa `fetch()` en lugar de la instancia compartida de Axios. Esto genera llamadas a rutas relativas `/api/v1/auth/...` que funcionan bajo el rewrite de Vite o Vercel.

### 4. Ciclo de Vida de Tokens (Access Token y Refresh Token)
- **Access Token:**
  - Formato: JWT firmado con HMAC-SHA256 (`Keys.hmacShaKeyFor`) utilizando `APP_JWT_SECRET`.
  - Duración (`TTL`): **15 minutos** (`app.jwt.access-ttl-minutes: 15`).
  - Claims incluidos: `sub` (ID de usuario UUID), `email` (correo electrónico), `roles` (lista de cadenas de roles, ej. `["CLIENT"]`), `iat`, `exp`, `jti`.
- **Refresh Token:**
  - Formato: Cadena aleatoria de alta entropía (`UUID.randomUUID() + "." + UUID.randomUUID()`).
  - Almacenamiento seguro: El backend almacena únicamente el hash SHA-256 en la tabla `refresh_tokens`.
  - Duración (`TTL`): **14 días** (`app.jwt.refresh-ttl-days: 14`).
  - Rotación: Cada uso de `POST /api/v1/auth/refresh-token` revoca el token actual y emite un nuevo par de tokens.

### 5. Manejo de Errores y Seguridad (401 y 403)
- El backend implementa [`SecurityProblemWriter.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/config/SecurityProblemWriter.java) y [`GlobalExceptionHandler.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/GlobalExceptionHandler.java) bajo el estándar **RFC 7807 (Problem Details for HTTP APIs)** con `Content-Type: application/problem+json`:
  - **401 Unauthorized:** Retornado cuando falta autenticación o el token es inválido/expirado.
    - `type`: `https://api.carpidi.com/errors/authentication-required` o `https://api.carpidi.com/errors/invalid-credentials`
    - `title`: `Unauthorized`
    - `detail`: `"Se requiere autenticación válida."` o `"Credenciales inválidas"`
  - **403 Forbidden:** Retornado cuando el usuario autenticado no posee el rol requerido (ej. `CLIENT` intentando acceder a `/admin`).
    - `type`: `https://api.carpidi.com/errors/access-denied`
    - `title`: `Forbidden`
    - `detail`: `"No tienes permiso para realizar esta operación."`

### 6. Roles de Usuario
Definidos en el enum Java [`UserRole.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/domain/UserRole.java):
- `CLIENT`: Rol asignado por defecto a cualquier cliente que se registre vía `POST /auth/register`. Habilita el diligenciamiento del cuestionario de estilo (`/questionnaire`), consulta de recomendaciones (`/recommendations`), confirmación de compras (`POST /orders`) y visualización de sus propios pedidos (`GET /orders`).
- `ADMIN`: Rol administrativo con acceso a métricas de negocio, creación de categorías (`POST /categories`), publicación de productos con inventario (`POST /products`), actualización de productos (`PUT /products/{id}`) y desactivación de productos (`DELETE /products/{id}`).

---

## D. Inventario de Pantallas

| Nombre Stitch / Figma | Componente React | Ruta | Objetivo UX | Tipo de Usuario | Autenticación | Rol Requerido | Endpoint Principal | Estado de Implementación | Evidencia PDF | Evidencia Código |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Login Screen - Ingresar** | [`LoginPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/LoginPage.tsx) | `/login` | Iniciar sesión mediante credenciales seguras y obtener tokens JWT. | Visitante / Cliente | Pública | Ninguno | `POST /api/v1/auth/login` | Implementada | Página 1 (`screen-01.png`) | [`LoginPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/LoginPage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L37 |
| **Register Screen - Crear cuenta** | [`RegisterPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/RegisterPage.tsx) | `/registro` | Registro de nuevos clientes con validación estricta de contraseña e inicio de sesión automático. | Visitante | Pública | Ninguno | `POST /api/v1/auth/register` | Implementada | Página 2 (`screen-02.png`) | [`RegisterPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/RegisterPage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L38 |
| **Catalog Screen - Encuentra tu próxima pieza** | [`CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx) | `/catalogo` | Exploración de prendas, búsqueda por texto, filtrado por categorías y acceso a detalle. | Todos | Pública | Ninguno | `GET /api/v1/products`, `GET /api/v1/categories` | Implementada | Página 3 (`screen-03.png`), Página 8 (`screen-08.jpg`) | [`CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L34 |
| **Main Dashboard (Home / Landing Quiet Luxury)** | Equivalente en [`CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx) | `/` | Presentar propuesta de valor, hero de marca, curaduría por categorías, recomendados y catálogo destacado. | Todos | Pública (personalizada si está autenticado) | Ninguno | `GET /api/v1/products`, `GET /api/v1/categories`, `GET /api/v1/recommendations` | Parcialmente implementada | Página 8 (`screen-08.jpg`) | [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L33 (enruta `/` a `CatalogPage` simple) |
| **Product Detail Screen** | [`ProductPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProductPage.tsx) | `/productos/:id` | Visualizar ficha técnica, descripción, precio, selector de variantes y agregar a la bolsa. | Todos | Pública | Ninguno | `GET /api/v1/products/{id}` | Implementada | Ausente como captura dedicada; referenciada por botón "VER DETALLE" en Página 8 | [`ProductPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProductPage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L35 |
| **Style Profile - Asesoría de estilo** | [`StylePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/StylePage.tsx) | `/estilo` | Diligenciar cuestionario de morfología/estilo con consentimiento y ver prendas recomendadas. | Cliente autenticado | Autenticada | `CLIENT` | `POST /api/v1/questionnaire`, `GET /api/v1/recommendations` | Implementada | Página 4 (`screen-04.png`) | [`StylePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/StylePage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L39 |
| **Shopping Bag & Checkout - Tu carrito** | [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx) | `/carrito` | Revisión de prendas seleccionadas, modificación de unidades, captura de dirección y creación de orden. | Visitante (ver) / Cliente (checkout) | Mixta (Revisar carrito es público; Confirmar pedido exige login) | `CLIENT` (para confirmar orden) | `POST /api/v1/orders` | Implementada | Página 5 (`screen-05.png`) | [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L36 |
| **Orders Screen - Mis pedidos** | [`OrdersPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/OrdersPage.tsx) | `/pedidos` | Consulta del histórico de pedidos realizados, estado de pago, total y desglose de artículos. | Cliente / Admin | Autenticada | `CLIENT`, `ADMIN` | `GET /api/v1/orders` | Implementada | Enlace visible en navbar de Páginas 3, 4, 5, 6, 7 | [`OrdersPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/OrdersPage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L41 |
| **Profile Screen - Mi perfil** | [`ProfilePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProfilePage.tsx) | `/perfil` | Consulta de información básica del usuario en sesión (nombre, email, roles asignados). | Usuario autenticado | Autenticada | `CLIENT`, `ADMIN` | `GET /api/v1/me` (vía `AuthContext`) | Implementada | Página 6 (`screen-06.png`) | [`ProfilePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProfilePage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L42 |
| **Admin Screen - Panel administrativo** | [`AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx) | `/admin` | Visualizar KPIs operativos, registrar nuevos productos con variantes e inventario, y desactivar prendas. | Administrador | Autenticada | `ADMIN` | `GET /api/v1/products`, `GET /api/v1/categories`, `GET /api/v1/orders`, `POST /api/v1/products`, `DELETE /api/v1/products/{id}` | Implementada | Página 7 (`screen-07.png`) | [`AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx), [`App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx) L40 |
| **Favoritos / Wishlist** | No implementado | `/favoritos` | Guardar prendas predilectas sin agregarlas a la bolsa. | Cliente | Autenticada | `CLIENT` | Ninguno | Diseñada no implementada | Diseñado en Página 8 (icono de corazón en header y tarjetas) | Sin archivo ni ruta en frontend |
| **Checkout Independiente** | Integrado en [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx) | `/checkout` | Flujo de pago y facturación paso a paso en página aislada. | Cliente autenticado | Autenticada | `CLIENT` | `POST /api/v1/orders` | No respaldada como pantalla separada | El PDF muestra Checkout embebido en "Tu carrito" (Página 5) | Embebido en [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx) |

---

## E. Etapas del Usuario

### 1. Etapas del Visitante (Usuario no autenticado)

#### Etapa 1.1: Descubrimiento y Exploración del Catálogo
- **Objetivo:** Conocer la marca, revisar la colección de ropa femenina, filtrar prendas por categoría o término de búsqueda.
- **Entrada:** Ingreso a la URL raíz `/` o `/catalogo`.
- **Acciones:**
  - Visualizar listado de productos con fotos de referencia, nombre, categoría y precio en COP.
  - Escribir en la barra de búsqueda y seleccionar una categoría para filtrar.
  - Hacer clic en "Ver producto".
- **Decisiones:** Elegir un producto para ver el detalle o continuar navegando.
- **Pantallas:** `Main Dashboard` (`/`), `Catalog Screen` (`/catalogo`), `Product Detail` (`/productos/:id`).
- **Resultado:** Visualización de la ficha técnica y disponibilidad de variantes.
- **Fricciones:** En la implementación actual, la página `/` no tiene el Hero editorial de la Página 8; las imágenes de productos en el código son bloques grises (`div.placeholder`) debido a que la API aún no almacena URLs de fotos reales.
- **Endpoint:** `GET /api/v1/categories`, `GET /api/v1/products`.
- **Siguiente etapa:** Selección y armado de bolsa (Etapa 1.2) o Registro/Inicio de sesión (Etapa 1.3).

#### Etapa 1.2: Selección de Prenda y Armado de Bolsa
- **Objetivo:** Seleccionar talla, color y cantidad de una prenda disponible y colocarla en el carrito.
- **Entrada:** Clic en "Ver producto" desde el catálogo hacia `/productos/:id`.
- **Acciones:**
  - Seleccionar una variante de inventario disponible mediante radio buttons.
  - Hacer clic en "Agregar al carrito".
  - Navegar a `/carrito` mediante el enlace en cabecera "Carrito (N)" o notificación de éxito.
- **Decisiones:** Modificar cantidad en bolsa, quitar artículos o proceder a la compra.
- **Pantallas:** `Product Detail` (`/productos/:id`), `Shopping Bag` (`/carrito`).
- **Resultado:** Ítem almacenado en el `CartContext` local (`localStorage`).
- **Fricciones:** Si el visitante intenta hacer clic en "Confirmar pedido" en el formulario de Checkout, el botón está bloqueado y se muestra un mensaje de advertencia: *"Para finalizar compra primero debes iniciar sesión"*.
- **Endpoint:** `GET /api/v1/products/{id}`. (La bolsa no consume endpoint).
- **Siguiente etapa:** Inicio de sesión o Registro (Etapa 1.3).

#### Etapa 1.3: Autenticación o Creación de Cuenta
- **Objetivo:** Crear una identidad en CARPIDI para poder comprar o recibir asesoría personalizada.
- **Entrada:** Clic en enlace "Ingresar" en navbar, "Crear cuenta" en formulario, o redirección desde el carrito.
- **Acciones:**
  - En `/registro`: Ingresar nombre completo, correo electrónico y contraseña compleja (mínimo 12 caracteres con mayúscula, minúscula, dígito y símbolo).
  - En `/login`: Ingresar correo y contraseña registrados.
- **Decisiones:** Iniciar sesión si ya tiene cuenta, o registrarse si es su primera vez.
- **Pantallas:** `Login Screen` (`/login`), `Register Screen` (`/registro`).
- **Resultado:** Emisión de `accessToken` y `refreshToken`, carga del perfil de usuario y almacenamiento en sesión local.
- **Fricciones:** Tras iniciar sesión o registrarse, el frontend redirige automáticamente a `/carrito` mediante `navigate('/carrito')`, incluso si el usuario pretendía ir a su perfil o completar su cuestionario de estilo.
- **Endpoint:** `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/me`.
- **Siguiente etapa:** Experiencia de Cliente Autenticado (Etapa 2.1).

---

### 2. Etapas del Cliente Autenticado (`CLIENT`)

#### Etapa 2.1: Asesoría de Estilo y Cuestionario Morfológico
- **Objetivo:** Proporcionar información sobre morfología y recibir recomendaciones personalizadas basadas en reglas de estilo.
- **Entrada:** Clic en "Mi estilo" / "TU ESTILO" en el navbar hacia la ruta `/estilo`.
- **Acciones:**
  - Seleccionar tipo de cuerpo (`Reloj de arena`, `Triángulo`, `Rectángulo`, `Óvalo`).
  - Seleccionar tono de piel (`Claro`, `Medio`, `Oscuro`).
  - Seleccionar estatura (`Baja`, `Media`, `Alta`).
  - Marcar uno o varios estilos preferidos (`casual`, `elegante`, `deportivo`, `romántico`).
  - Hacer clic en "Guardar y recomendar".
- **Decisiones:** Elegir estilos deseados y decidir explorar los productos recomendados.
- **Pantallas:** `Style Profile` (`/estilo`).
- **Resultado:** Almacenamiento seguro del cuestionario y visualización inmediata de hasta 6 prendas afines con explicación del motivo (`reason`).
- **Fricciones:** El backend exige `@AssertTrue boolean consent`. El frontend envía implícitamente `consent: true`, pero en la pantalla de la Página 4 del PDF no se muestra un checkbox visible de términos de privacidad y consentimiento explícito al usuario.
- **Endpoint:** `POST /api/v1/questionnaire`, `GET /api/v1/recommendations`.
- **Siguiente etapa:** Explorar prenda recomendada o ir al Carrito para comprar.

#### Etapa 2.2: Checkout y Creación de Pedido
- **Objetivo:** Formalizar la orden de compra con los ítems de la bolsa y congelar el inventario correspondiente.
- **Entrada:** Ingreso a `/carrito` con sesión activa iniciada.
- **Acciones:**
  - Verificar productos, tallas, colores y precios en la columna izquierda.
  - Completar dirección de residencia, ciudad (por defecto "Bogotá") y país (por defecto "Colombia").
  - Hacer clic en "Confirmar pedido".
- **Decisiones:** Confirmar la orden o regresar a seguir explorando el catálogo.
- **Pantallas:** `Shopping Bag & Checkout` (`/carrito`).
- **Resultado:** Generación de pedido en estado `PENDING_PAYMENT`, reducción atómica del inventario vendible en backend, vaciado de la bolsa local y mensaje con el ID de la orden generada.
- **Fricciones:** El método de pago viaja hardcodeado en frontend como `"MANUAL_TEST"` (no hay pasarela PayU/Wompi conectada en UI). No hay pantalla de agradecimiento o resumen post-checkout (`/order-success`), el resultado se muestra como un texto de éxito en la misma página del carrito.
- **Endpoint:** `POST /api/v1/orders`.
- **Siguiente etapa:** Consulta del pedido en el historial (Etapa 2.3).

#### Etapa 2.3: Consulta de Pedidos y Perfil de Cuenta
- **Objetivo:** Verificar el estado de las compras realizadas y confirmar los datos de cuenta.
- **Entrada:** Clic en "Mis pedidos" (`/pedidos`) o "Perfil" (`/perfil`) en la cabecera.
- **Acciones:**
  - En `/pedidos`: Ver lista ordenada descendentemente por fecha con ID de pedido, fecha legible, estado (`PENDING_PAYMENT`, `PAID`, etc.), valor total y lista de prendas compradas con sus unidades.
  - En `/perfil`: Ver nombre del usuario, correo electrónico, roles asignados y aviso de seguridad JWT.
- **Decisiones:** Cerrar sesión o volver a la tienda.
- **Pantallas:** `Orders Screen` (`/pedidos`), `Profile Screen` (`/perfil`).
- **Resultado:** Información clara y transparente sobre compras y credenciales seguras.
- **Fricciones:** No hay opción en `/pedidos` para cancelar un pedido pendiente ni enlace para pagar; en `/perfil` no existe edición de datos personales ni cambio de contraseña.
- **Endpoint:** `GET /api/v1/orders`, `GET /api/v1/me`.
- **Siguiente etapa:** Cierre de sesión o navegación general.

---

### 3. Etapas del Administrador (`ADMIN`)

#### Etapa 3.1: Monitoreo Operativo y Publicación de Catálogo
- **Objetivo:** Supervisar el inventario, verificar métricas de ventas y dar de alta nuevas prendas con sus respectivas variantes de inventario.
- **Entrada:** Iniciar sesión con cuenta con rol `ADMIN` y hacer clic en el enlace "Admin" de la cabecera (`/admin`).
- **Acciones:**
  - Consultar los paneles de métricas (Productos activos, Pedidos registrados, Ventas acumuladas en COP).
  - Diligenciar el formulario "Crear producto e inventario": nombre comercial, slug amigable único, descripción detallada, categoría y precio base.
  - Agregar una o más variantes especificando SKU (único en mayúsculas), talla, color, precio diferencial (opcional) y unidades disponibles en stock.
  - Hacer clic en "Crear producto".
  - En la tabla inferior de "Productos publicados", consultar stock consolidado por prenda o hacer clic en "Desactivar" para retirar una prenda del catálogo público.
- **Decisiones:** Ajustar inventario, crear nuevas referencias o inactivar productos obsoletos o sin stock.
- **Pantallas:** `Admin Screen` (`/admin`).
- **Resultado:** Producto registrado transaccionalmente en base de datos junto con sus variantes e inventario inicial en estado `sellable`.
- **Fricciones:**
  - El backend calcula las órdenes para `GET /api/v1/orders` filtrando por el correo del usuario que consulta (`principal.getName()`). Por ende, el admin solo ve las compras hechas con su propio correo administrativo, marcando $0 ventas acumuladas si el administrador no ha comprado.
  - No existe formulario en la UI para crear nuevas categorías (solo se pueden seleccionar las existentes cargadas vía seed SQL).
- **Endpoint:** `GET /api/v1/products`, `GET /api/v1/categories`, `GET /api/v1/orders`, `POST /api/v1/products`, `DELETE /api/v1/products/{id}`.
- **Siguiente etapa:** Salir de la plataforma (Etapa 3.2).

#### Etapa 3.2: Cierre de Sesión
- **Objetivo:** Finalizar la sesión administrativa o de cliente y revocar el acceso en el navegador.
- **Entrada:** Clic en botón "Salir" en el navbar de la aplicación.
- **Acciones:** Llamada al método `logout()` de `AuthContext`, el cual elimina `accessToken`, `refreshToken` y `sessionUser` de `localStorage` y limpia el estado de React.
- **Decisiones:** Ninguna; la sesión se finaliza de inmediato.
- **Pantallas:** Redirige o permanece en la pantalla actual con barra de navegación en modo visitante ("Ingresar").
- **Resultado:** Navegación en modo anónimo seguro.
- **Fricciones:** `AuthContext.logout()` no invoca el endpoint del backend `POST /api/v1/auth/logout`. Por tanto, el refresh token en el servidor sigue marcado como activo hasta su expiración bi-semanal a menos que se llame explícitamente a dicho endpoint.
- **Endpoint:** Local (Omite `POST /api/v1/auth/logout`).
- **Siguiente etapa:** Navegación anónima como Visitante.

---

## F. Diagrama Mermaid de Flujo de Navegación y Decisiones

```mermaid
flowchart TD
    %% Nodos Iniciales y Públicos
    Start(["Inicio de Navegación"]) --> Home["Main Dashboard / Home (/)<br/>CatalogPage"]
    Home -->|Clic en Catálogo| Catalog["Catálogo de Prendas (/catalogo)<br/>CatalogPage"]
    Catalog -->|Buscar o Filtrar| Catalog
    Catalog -->|Clic en Ver producto| ProductDetail["Detalle de Producto (/productos/:id)<br/>ProductPage"]

    %% Carrito
    ProductDetail -->|Seleccionar variante y Clic Agregar| Cart["Tu Carrito y Checkout (/carrito)<br/>CartPage"]
    Home -->|Clic en Carrito / Bolsa| Cart

    %% Autenticación
    Home -->|Clic en Ingresar| Login["Inicio de Sesión (/login)<br/>LoginPage"]
    Cart -->|Usuario no autenticado hace clic en Iniciar Sesión| Login
    Login -->|¿Primera vez en CARPIDI?| Register["Crear Cuenta (/registro)<br/>RegisterPage"]
    Register -->|¿Ya tienes cuenta?| Login

    %% Procesos de Autenticación
    Register -->|Enviar formulario de Registro| ApiRegister["POST /api/v1/auth/register"]
    ApiRegister -->|201 Creado| AutoLogin["POST /api/v1/auth/login"]
    Login -->|Enviar Credenciales| ApiLogin["POST /api/v1/auth/login"]

    ApiLogin -->|401 Credenciales Inválidas| LoginError["Mostrar Alerta de Error en UI"]
    LoginError --> Login

    ApiLogin -->|200 OK Token Emitido| FetchMe["GET /api/v1/me"]
    AutoLogin --> FetchMe

    FetchMe --> DecisionNav{"Destino Post-Login"}
    DecisionNav -->|navigate('/carrito') predeterminado| Cart
    DecisionNav -->|Acceso por Navbar| SessionActive["Sesión Activa"]

    %% Rutas Protegidas Cliente
    SessionActive -->|Clic en Tu estilo| StylePage["Asesoría de Estilo (/estilo)<br/>StylePage"]
    StylePage -->|Enviar Cuestionario| PostQuestionnaire["POST /api/v1/questionnaire"]
    PostQuestionnaire -->|201 Creado| GetRecs["GET /api/v1/recommendations"]
    GetRecs --> ShowRecs["Mostrar Recomendaciones de Prendas"]
    ShowRecs -->|Clic en Ver Producto| ProductDetail

    SessionActive -->|Clic en Mis pedidos| OrdersPage["Historial de Compras (/pedidos)<br/>OrdersPage"]
    OrdersPage --> GetOrders["GET /api/v1/orders"]

    SessionActive -->|Clic en Perfil| ProfilePage["Mi Perfil (/perfil)<br/>ProfilePage"]
    ProfilePage --> ShowProfile["Mostrar Nombre, Correo y Roles"]

    %% Proceso Checkout en Carrito
    Cart --> DecisionCheckout{"¿Sesión activa?"}
    DecisionCheckout -->|No| PromptLogin["Bloquear Botón y Pedir Login"]
    DecisionCheckout -->|Sí| FillAddress["Ingresar Dirección, Ciudad y País"]
    FillAddress --> SubmitOrder["POST /api/v1/orders"]

    SubmitOrder -->|409 Conflicto / Sin Stock| OrderError["Alerta: No fue posible crear el pedido.<br/>Revisa stock y datos de envío"]
    SubmitOrder -->|201 Pedido Creado| OrderSuccess["Mensaje de Éxito en Pantalla<br/>Pedido ID creado y Carrito Vaciado"]

    %% Rutas Protegidas Admin
    SessionActive --> DecisionAdmin{"¿Tiene rol ADMIN?"}
    DecisionAdmin -->|No| AdminForbidden["Acceso Denegado (403)"]
    DecisionAdmin -->|Sí: Clic en Admin| AdminPanel["Panel Administrativo (/admin)<br/>AdminPage"]

    AdminPanel --> LoadAdmin["GET /products<br/>GET /categories<br/>GET /orders"]
    AdminPanel --> CreateProd["POST /api/v1/products"]
    AdminPanel --> DeactProd["DELETE /api/v1/products/{id}"]

    %% Cierre de Sesión
    SessionActive -->|Clic en Salir| LogoutAction["Limpiar localStorage<br/>clearSession()"]
    LogoutAction --> Home

    %% Estilos de Nodos
    classDef public fill:#f9f9f9,stroke:#333,stroke-width:1px;
    classDef auth fill:#e8f4fd,stroke:#2b7bb9,stroke-width:2px;
    classDef client fill:#f0fff4,stroke:#2e7d32,stroke-width:2px;
    classDef admin fill:#fdf2e9,stroke:#e65100,stroke-width:2px;
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:1px;

    class Home,Catalog,ProductDetail,Cart public;
    class Login,Register,ApiLogin,ApiRegister,FetchMe auth;
    class StylePage,OrdersPage,ProfilePage,SubmitOrder,OrderSuccess client;
    class AdminPanel,CreateProd,DeactProd admin;
    class LoginError,OrderError,AdminForbidden error;
```

---

## G. Tabla de Enrutamiento

| Pantalla | Ruta | Origen | Acción de Usuario | Destino | Condición de Navegación | Rol | Comportamiento sin Autenticación | Comportamiento sin Permisos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Main Dashboard** | `/` | Inicio / Directo | Carga de URL o clic en logo "CARPIDI" | `/` | Ninguna | Cualquiera | Accesible libremente. | No aplica. |
| **Catalog Screen** | `/catalogo` | Header / Footer | Clic en enlace "Catálogo" | `/catalogo` | Ninguna | Cualquiera | Accesible libremente. | No aplica. |
| **Product Detail** | `/productos/:id` | Catálogo / Recs | Clic en "Ver producto" o tarjeta | `/productos/:id` | UUID de producto válido en URL | Cualquiera | Accesible libremente. | No aplica. |
| **Shopping Bag** | `/carrito` | Header / Notif | Clic en "Carrito (N)" o "Ver carrito" | `/carrito` | Ninguna | Cualquiera | Permite ver artículos y editar cantidades; bloquea botón de confirmar pedido con aviso de login. | No aplica. |
| **Login Screen** | `/login` | Header / Enlaces | Clic en "Ingresar" | `/login` | Usuario no autenticado | Cualquiera | Accesible libremente; si se autentica redirige a `/carrito`. | No aplica. |
| **Register Screen** | `/registro` | Login Screen | Clic en "¿Primera vez? Crear cuenta" | `/registro` | Usuario no autenticado | Cualquiera | Accesible libremente; al crearse cuenta inicia sesión y redirige a `/carrito`. | No aplica. |
| **Style Profile** | `/estilo` | Header navbar | Clic en "Mi estilo" / "TU ESTILO" | `/estilo` | Ninguna a nivel de enrutador | `CLIENT` | Muestra tarjeta con mensaje: *"Ingresa para recibir recomendaciones personalizadas"* y botón a `/login`. | Si un `ADMIN` sin rol `CLIENT` intenta enviar, la API rechaza con HTTP 403. |
| **Orders Screen** | `/pedidos` | Header navbar | Clic en "Mis pedidos" | `/pedidos` | Visible en navbar solo si `user` existe | `CLIENT`, `ADMIN` | Si se accede manualmente por URL sin sesión, muestra tarjeta: *"Ingresa para consultar tus compras"* con botón a `/login`. | Ambos roles pueden consultar. (Admin ve sus propios pedidos). |
| **Profile Screen** | `/perfil` | Header navbar | Clic en "Perfil" | `/perfil` | Visible en navbar solo si `user` existe | `CLIENT`, `ADMIN` | Si se accede directamente sin sesión, muestra tarjeta: *"Ingresa para consultar tu perfil"* con botón a `/login`. | No aplica. |
| **Admin Screen** | `/admin` | Header navbar | Clic en "Admin" | `/admin` | Visible en navbar solo si `user.roles.includes('ADMIN')` | `ADMIN` | Si se accede por URL sin login, muestra mensaje: *"Debes iniciar sesión"* y botón a `/login`. | Si ingresa un cliente con rol `CLIENT` únicamente, muestra tarjeta: *"Acceso restringido: Esta sección solo está disponible para administradores"*. |

---

## H. Mapeo Detallado por Pantalla

---

### Pantalla 1: Login Screen (`/login`)
- **Nombre Exacto:** Login Screen - Ingresar
- **Ruta:** `/login`
- **Componente React:** [`LoginPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/LoginPage.tsx)
- **Objetivo UX:** Permitir a usuarios registrados validar su identidad para realizar compras y acceder a sus pedidos y preferencias de estilo.
- **Tipo de Usuario:** Visitante / Cliente / Administrador
- **Autenticación:** Pública
- **Rol Requerido:** Ninguno
- **Fuente PDF:** Página 1 (`screen-01.png`)
- **Evidencia Código:** [`LoginPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/LoginPage.tsx), [`auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts), [`AuthContext.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/state/AuthContext.tsx)

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Correo** | Input (email) | Escribe dirección de correo | Requerido por HTML5 (`required`, `type="email"`) | Actualiza estado `email` | Permanece | Ninguno |
| **Contraseña** | Input (password) | Escribe contraseña de acceso | Requerido por HTML5 (`required`, `type="password"`) | Actualiza estado `password` | Permanece | Ninguno |
| **Ingresar** | Botón (submit) | Envía credenciales | Inputs no vacíos | Llama a `login(email, password)`. Bloquea botón mostrando *"Ingresando…"*. | `navigate('/carrito')` al tener éxito | `POST /api/v1/auth/login` + `GET /api/v1/me` |
| **Crear cuenta** | Enlace (Link) | Clic en enlace inferior | Ninguna | Cambia la vista a registro | `/registro` | Ninguno |

#### Integración con API
- **Método HTTP:** `POST`
- **Ruta:** `/api/v1/auth/login`
- **Autenticación:** Ninguna (Pública)
- **Rol:** Ninguno
- **Request JSON:**
  ```json
  {
    "email": "camila.valencia@example.com",
    "password": "Password123!"
  }
  ```
- **Response JSON (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjhhNzE2MC0xYjFjLTRlZjMtODIyOC0xNDQ1OGE4Mjg2MWEiLCJlbWFpbCI6ImNhbWlsYS52YWxlbmNpYUBleGFtcGxlLmNvbSIsInJvbGVzIjpbIkNMSUVOVCJdLCJpYXQiOjE3MjkzNzUyMDAsImV4cCI6MTcyOTM3NjEwMCwianRpIjoiN2I5MWY4MmEtYTFjOS00NWI3LTgxZTgtNmNhYTRjNjFmN2I0In0.signature",
    "refreshToken": "84c8d5e1-8910-449a-9e12-4f3b7c891a2b.6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d",
    "expiresIn": 900
  }
  ```
- **Códigos HTTP Manejados:**
  - `200 OK`: Sesión autorizada.
  - `400 Bad Request`: Formato de email inválido o cuerpo mal formado.
  - `401 Unauthorized`: Correo o contraseña incorrectos.
- **Mensajes de Error:**
  - Status 401: *"Correo o contraseña incorrectos."*
  - Sin conexión / Red: *"No fue posible iniciar sesión."* o *"No se pudo conectar con el servicio de autenticación."*

#### Documentación de los Cuatro Estados de UI
1. **Loading:** El botón de submit se deshabilita (`disabled={loading}`) y cambia su etiqueta a *"Ingresando…"*.
2. **Success:** Guarda `accessToken`, `refreshToken` y `sessionUser` en `localStorage` y ejecuta `navigate('/carrito')`.
3. **Empty State:** No aplica (es un formulario de entrada de credenciales).
4. **Error:** Muestra un contenedor rojo accesible (`role="alert"`, `.error`) sobre el botón con el mensaje retornado por la API o el error de credenciales.

---

### Pantalla 2: Register Screen (`/registro`)
- **Nombre Exacto:** Register Screen - Crear cuenta
- **Ruta:** `/registro`
- **Componente React:** [`RegisterPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/RegisterPage.tsx)
- **Objetivo UX:** Permitir a clientas nuevas registrarse en CARPIDI bajo estándares de seguridad exigentes y comenzar su compra sin fricción.
- **Tipo de Usuario:** Visitante
- **Autenticación:** Pública
- **Rol Requerido:** Ninguno (asigna `CLIENT`)
- **Fuente PDF:** Página 2 (`screen-02.png`)
- **Evidencia Código:** [`RegisterPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/RegisterPage.tsx), [`AuthController.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/AuthController.java) L17-21

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Nombre** | Input (text) | Ingresa nombre completo | `required`, `maxLength={150}` | Actualiza estado `name` | Permanece | Ninguno |
| **Correo** | Input (email) | Ingresa correo único | `required`, `type="email"` | Actualiza estado `email` | Permanece | Ninguno |
| **Contraseña** | Input (password) | Ingresa contraseña segura | `required`, `minLength={12}` | Actualiza estado `password` | Permanece | Ninguno |
| **Crear cuenta** | Botón (submit) | Envía formulario | Campos válidos | Registra cuenta, inicia sesión automáticamente | `navigate('/carrito')` al tener éxito | `POST /api/v1/auth/register` + login automático |
| **Ingresar** | Enlace (Link) | Clic en "¿Ya tienes cuenta? Ingresar" | Ninguna | Navega al login | `/login` | Ninguno |

#### Integración con API
- **Método HTTP:** `POST`
- **Ruta:** `/api/v1/auth/register`
- **Autenticación:** Ninguna (Pública)
- **Rol:** Ninguno
- **Request JSON:**
  ```json
  {
    "name": "Camila Valencia",
    "email": "camila.valencia@example.com",
    "password": "Password123!"
  }
  ```
- **Response JSON (201 Created, Location: `/api/v1/users/{id}`):**
  ```json
  {
    "id": "6b8a7160-1b1c-4ef3-8228-14458a82861a",
    "name": "Camila Valencia",
    "email": "camila.valencia@example.com",
    "roles": [
      "CLIENT"
    ]
  }
  ```
- **Códigos HTTP Manejados:**
  - `201 Created`: Usuario creado exitosamente.
  - `400 Bad Request`: Validación fallida (ej. contraseña menor a 12 caracteres o sin mayúscula/minúscula/número/símbolo).
  - `409 Conflict`: Correo ya registrado previamente (`email-already-registered`).
- **Mensajes de Error:**
  - Status 409: *"Ese correo ya está registrado."*
  - Status 400: Detalle de validación devuelto por la API (ej. *"debe incluir mayúscula, minúscula, número y símbolo"*).
  - Sin conexión: *"No fue posible crear la cuenta. Inténtalo de nuevo."*

#### Documentación de los Cuatro Estados de UI
1. **Loading:** Botón deshabilitado mostrando *"Creando…"*.
2. **Success:** Ejecuta `login()` en cascada y redirige a `/carrito`.
3. **Empty State:** No aplica (formulario de captura).
4. **Error:** Contenedor de alerta rojo visible con el mensaje específico de rechazo de la cuenta.

---

### Pantalla 3: Catalog Screen (`/catalogo`) y Main Dashboard (`/`)
- **Nombre Exacto:** Catalog Screen - Encuentra tu próxima pieza (Pág 3) / Main Dashboard (Pág 8)
- **Ruta:** `/catalogo` y `/`
- **Componente React:** [`CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx)
- **Objetivo UX:** Descubrir prendas de vestir, zapatos y accesorios, filtrar por palabras clave y categorías, y explorar fichas de producto.
- **Tipo de Usuario:** Visitante / Cliente / Administrador
- **Autenticación:** Pública
- **Rol Requerido:** Ninguno
- **Fuente PDF:** Página 3 (`screen-03.png`) y Página 8 (`screen-08.jpg`)
- **Evidencia Código:** [`CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx), [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts) L25-35

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Buscar prendas** | Input (search) | Escribe término de búsqueda | Ninguna | Actualiza estado local `query` | Permanece | Ninguno directo (aplica al filtrar) |
| **Todas las categorías** | Select | Selecciona categoría | Opciones dinámicas de API | Actualiza estado `category` | Permanece | Ninguno directo |
| **Filtrar** | Botón (submit) | Envía formulario de filtros | Ninguna | Ejecuta `loadCatalog(query, category)` | Permanece | `GET /api/v1/products?q=...&category=...` |
| **Ver producto** | Enlace (Link) | Clic en tarjeta de producto | ID válido | Abre ficha de producto | `/productos/:id` | Ninguno |

#### Integración con API
- **Métodos y Rutas:**
  - `GET /api/v1/categories` (Carga lista de categorías para el dropdown).
  - `GET /api/v1/products?q={query}&category={slug}&page=0&pageSize=20` (Carga página de productos).
- **Autenticación:** Ninguna (Pública).
- **Query Params:** `q` (opcional), `category` (opcional), `page` (0), `pageSize` (20).
- **Response JSON `GET /categories` (200 OK):**
  ```json
  [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Ropa",
      "slug": "ropa"
    },
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "name": "Accesorios",
      "slug": "accesorios"
    }
  ]
  ```
- **Response JSON `GET /products` (200 OK):**
  ```json
  {
    "content": [
      {
        "id": "33333333-3333-3333-3333-333333333333",
        "slug": "blazer-luna",
        "name": "Blazer Luna",
        "description": "Blazer estructurado en lino.",
        "basePrice": 180000.00,
        "active": true,
        "category": {
          "id": "11111111-1111-1111-1111-111111111111",
          "name": "Ropa",
          "slug": "ropa"
        },
        "variants": [
          {
            "id": "44444444-4444-4444-4444-444444444444",
            "sku": "BLZ-LUN-S",
            "size": "S",
            "color": "Arena",
            "price": 180000.00,
            "available": 5
          }
        ]
      }
    ],
    "totalElements": 1
  }
  ```
- **Códigos HTTP Manejados:** `200 OK`, `400 Bad Request` (parámetros de página inválidos).

#### Documentación de los Cuatro Estados de UI
1. **Loading:** Mensaje accesible `<p role="status">Cargando catálogo…</p>`.
2. **Success:** Renderiza la cuadrícula de productos (`div.grid`) con tarjeta por artículo, etiqueta de categoría, nombre, precio formateado en COP (`$ 180.000`) y enlace al detalle.
3. **Empty State:** Si `!loading && !error && products.length === 0`: Muestra `<p className="empty">Aún no hay productos publicados. El catálogo ya está conectado a la API.</p>`.
4. **Error:** Muestra alerta roja accesible con el código de estado retornado: *"No fue posible cargar el catálogo (HTTP 500)."* o *"No fue posible conectar con CARPIDI API."*.

---

### Pantalla 4: Product Detail Screen (`/productos/:id`)
- **Nombre Exacto:** Product Detail Screen
- **Ruta:** `/productos/:id`
- **Componente React:** [`ProductPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProductPage.tsx)
- **Objetivo UX:** Presentar el detalle técnico y visual de una prenda, permitir la selección de variantes disponibles en tiempo real y agregar la unidad a la bolsa.
- **Tipo de Usuario:** Visitante / Cliente
- **Autenticación:** Pública
- **Rol Requerido:** Ninguno
- **Fuente PDF:** Implícita en flujo general y botón "VER DETALLE" en Página 8
- **Evidencia Código:** [`ProductPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProductPage.tsx), [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts) L37-40

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Variante (Radio)** | Radio button | Selecciona talla/color | Al menos una variante | Modifica `selectedVariantId` | Permanece | Ninguno |
| **Agregar al carrito** | Botón | Clic para agregar ítem | Variante seleccionada con `available >= 1` | Agrega ítem al `CartContext` | Permanece | Ninguno (almacenamiento local) |
| **Ver carrito** | Enlace (Link) | Clic en enlace de confirmación | Ítem agregado | Navega a la bolsa | `/carrito` | Ninguno |
| **Volver al catálogo** | Enlace (Link) | Clic ante error 404 | Ninguna | Regresa al listado | `/catalogo` | Ninguno |

#### Integración con API
- **Método HTTP:** `GET`
- **Ruta:** `/api/v1/products/{id}`
- **Path Params:** `id` (UUID del producto)
- **Autenticación:** Pública
- **Response JSON (200 OK):**
  ```json
  {
    "id": "33333333-3333-3333-3333-333333333333",
    "slug": "blazer-luna",
    "name": "Blazer Luna",
    "description": "Blazer de corte contemporáneo y lino italiano.",
    "basePrice": 180000.00,
    "active": true,
    "category": {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Ropa",
      "slug": "ropa"
    },
    "variants": [
      {
        "id": "44444444-4444-4444-4444-444444444444",
        "sku": "BLZ-LUN-S",
        "size": "S",
        "color": "Arena",
        "price": 180000.00,
        "available": 5
      },
      {
        "id": "55555555-5555-5555-5555-555555555555",
        "sku": "BLZ-LUN-M",
        "size": "M",
        "color": "Arena",
        "price": 180000.00,
        "available": 2
      }
    ]
  }
  ```
- **Códigos HTTP Manejados:** `200 OK`, `404 Not Found`.

#### Documentación de los Cuatro Estados de UI
1. **Loading:** Muestra `<p role="status">Cargando producto…</p>`.
2. **Success:** Muestra categoría, título, descripción, precio COP, lista de variantes con unidades en stock (`S · Arena · 5 disponibles`) y botón de agregar. Al agregar, despliega mensaje verde: *"Producto agregado al carrito. Ver carrito"*.
3. **Empty State:** Si la variante no tiene stock (`available < 1`), el botón "Agregar al carrito" se deshabilita automáticamente.
4. **Error:** Si la API devuelve 404, muestra: *"Este producto ya no está disponible."* junto con el enlace *"Volver al catálogo"*. Ante fallas de conexión: *"No fue posible cargar el producto."*.

---

### Pantalla 5: Shopping Bag & Checkout Screen (`/carrito`)
- **Nombre Exacto:** Shopping Bag & Checkout - Tu carrito
- **Ruta:** `/carrito`
- **Componente React:** [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx)
- **Objetivo UX:** Administrar las prendas elegidas (cantidades y remoción), visualizar el total consolidado en COP, capturar dirección de entrega y formalizar la compra con reserva transaccional de stock.
- **Tipo de Usuario:** Visitante (para ver/editar bolsa) / Cliente autenticado (para crear pedido)
- **Autenticación:** Mixta (Revisar carrito es público; Confirmar pedido exige rol `CLIENT`)
- **Rol Requerido:** `CLIENT`
- **Fuente PDF:** Página 5 (`screen-05.png`)
- **Evidencia Código:** [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx), [`CartContext.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/state/CartContext.tsx), [`OrderController.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/OrderController.java) L31-34

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Cantidad** | Input (number) | Modifica número de unidades | Entre 1 y `available` | Actualiza cantidad y recalcula total en COP | Permanece | Ninguno (local) |
| **Quitar** | Botón (button) | Clic para remover variante | Ninguna | Elimina el ítem del carrito | Permanece | Ninguno (local) |
| **Dirección** | Input (text) | Escribe dirección de envío | `required` | Actualiza estado `line1` | Permanece | Ninguno |
| **Ciudad** | Input (text) | Escribe ciudad de entrega | `required` (def. Bogotá) | Actualiza estado `city` | Permanece | Ninguno |
| **País** | Input (text) | Escribe país de entrega | `required` (def. Colombia) | Actualiza estado `country` | Permanece | Ninguno |
| **Confirmar pedido** | Botón (submit) | Confirma la compra | Usuario logueado + campos completos | Envía orden a backend y descuenta inventario | Permanece (muestra éxito) | `POST /api/v1/orders` |
| **iniciar sesión** | Enlace (Link) | Clic ante aviso de visitante | Ninguna | Lleva a login | `/login` | Ninguno |

#### Integración con API
- **Método HTTP:** `POST`
- **Ruta:** `/api/v1/orders`
- **Autenticación:** Requiere Bearer Token (`CLIENT`)
- **Rol Requerido:** `CLIENT`
- **Request JSON:**
  ```json
  {
    "items": [
      {
        "variantId": "44444444-4444-4444-4444-444444444444",
        "quantity": 1
      }
    ],
    "paymentMethod": "MANUAL_TEST",
    "shippingAddress": {
      "line1": "Calle 85 # 11-53",
      "city": "Bogotá",
      "country": "Colombia"
    }
  }
  ```
- **Response JSON (201 Created, Location: `/api/v1/orders/{id}`):**
  ```json
  {
    "id": "77777777-7777-7777-7777-777777777777",
    "status": "PENDING_PAYMENT",
    "total": 180000.00,
    "createdAt": "2026-10-19T20:15:00Z",
    "items": [
      {
        "variantId": "44444444-4444-4444-4444-444444444444",
        "productName": "Blazer Luna",
        "size": "S",
        "color": "Arena",
        "quantity": 1,
        "unitPrice": 180000.00
      }
    ]
  }
  ```
- **Códigos HTTP Manejados:**
  - `201 Created`: Pedido generado con éxito.
  - `400 Bad Request`: Dirección vacía o cantidad menor a 1.
  - `401 Unauthorized`: Token no proporcionado o expirado.
  - `403 Forbidden`: Usuario sin rol `CLIENT`.
  - `409 Conflict`: Variante sin inventario suficiente para la cantidad solicitada.

#### Documentación de los Cuatro Estados de UI
1. **Loading:** Durante la creación de la orden, el botón se deshabilita y muestra *"Creando pedido…"*.
2. **Success:** Limpia la bolsa (`clear()`) y renderiza banner verde: *"Pedido {id} creado por $ 180.000."*.
3. **Empty State:** Si `items.length === 0 && !success`: Renderiza `<p className="empty">Aún no tienes productos. <Link to="/catalogo">Explorar catálogo</Link></p>`.
4. **Error:** Ante 401/403 muestra: *"Debes iniciar sesión como cliente para comprar."*. Ante 409 o fallo general: *"No fue posible crear el pedido. Revisa stock y datos de envío."*.

---

### Pantalla 6: Style Profile / Questionnaire Screen (`/estilo`)
- **Nombre Exacto:** Style Profile - Asesoría de estilo
- **Ruta:** `/estilo`
- **Componente React:** [`StylePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/StylePage.tsx)
- **Objetivo UX:** Capturar datos morfológicos y preferencias de vestimenta para alimentar el motor explicable de sugerencias de prendas.
- **Tipo de Usuario:** Cliente autenticado
- **Autenticación:** Requiere autenticación
- **Rol Requerido:** `CLIENT`
- **Fuente PDF:** Página 4 (`screen-04.png`)
- **Evidencia Código:** [`StylePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/StylePage.tsx), [`recommendations.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/recommendations.ts), [`RecommendationController.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/RecommendationController.java)

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Tipo de cuerpo** | Select | Elige morfología | Requerido (`required`) | Opciones: Reloj de arena, Triángulo, Rectángulo, Óvalo | Permanece | Ninguno |
| **Tono de piel** | Select | Elige paleta de piel | Requerido (`required`) | Opciones: Claro, Medio, Oscuro | Permanece | Ninguno |
| **Estatura** | Select | Elige rango de estatura | Requerido (`required`) | Opciones: Baja, Media, Alta | Permanece | Ninguno |
| **Estilo preferido** | Checkboxes | Marca 1 o más estilos | Al menos uno seleccionado (`styles.length > 0`) | Opciones: casual, elegante, deportivo, romántico | Permanece | Ninguno |
| **Guardar y recomendar**| Botón (submit) | Envía cuestionario | Formulario completo | Guarda perfil y consulta recomendaciones inmediatas | Permanece | `POST /api/v1/questionnaire` + `GET /api/v1/recommendations` |
| **Ver producto** | Enlace (Link) | Clic en prenda recomendada| ID válido | Lleva a la ficha técnica | `/productos/:id` | Ninguno |

#### Integración con API
- **Métodos y Rutas:**
  - `POST /api/v1/questionnaire`
  - `GET /api/v1/recommendations`
- **Autenticación:** Bearer Token obligatorio (`CLIENT`).
- **Request JSON `POST /questionnaire`:**
  ```json
  {
    "bodyType": "Reloj de arena",
    "skinTone": "Medio",
    "heightRange": "Media",
    "stylePreferences": [
      "casual",
      "elegante"
    ],
    "consent": true
  }
  ```
- **Response JSON `POST /questionnaire`:** `201 Created` (Cuerpo vacío).
- **Response JSON `GET /recommendations` (200 OK):**
  ```json
  [
    {
      "productId": "33333333-3333-3333-3333-333333333333",
      "name": "Blazer Luna",
      "slug": "blazer-luna",
      "price": 180000.00,
      "reason": "Coincide con tus preferencias de estilo",
      "score": 1.0
    }
  ]
  ```
- **Códigos HTTP Manejados:** `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`.

#### Documentación de los Cuatro Estados de UI
1. **Loading:** Mientras consulta recomendaciones iniciales o guarda el formulario, el botón permanece controlado.
2. **Success:** Despliega mensaje verde *"¡Listo! Actualizamos tus recomendaciones."* y renderiza la cuadrícula con las prendas sugeridas y su motivo explicable.
3. **Empty State:** Si `recommendations.length === 0`: Muestra *"Aún no hay recomendaciones. Completa el cuestionario."*. Si el usuario no ha iniciado sesión (`!user`): Muestra tarjeta bloqueada *"Ingresa para recibir recomendaciones personalizadas"* con botón a `/login`.
4. **Error:** Muestra mensaje rojo: *"Completa todos los campos e inténtalo de nuevo."*.

---

### Pantalla 7: Orders Screen (`/pedidos`)
- **Nombre Exacto:** Orders Screen - Mis pedidos
- **Ruta:** `/pedidos`
- **Componente React:** [`OrdersPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/OrdersPage.tsx)
- **Objetivo UX:** Brindar trazabilidad a la clienta sobre el estado, valor y detalle de sus transacciones comerciales.
- **Tipo de Usuario:** Cliente autenticado / Administrador
- **Autenticación:** Requiere autenticación
- **Rol Requerido:** `CLIENT`, `ADMIN`
- **Fuente PDF:** Enlace en navbar en Páginas 3, 4, 5, 6, 7
- **Evidencia Código:** [`OrdersPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/OrdersPage.tsx), [`orders.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/orders.ts) L38-41, [`OrderController.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/OrderController.java) L23-27

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Ingresar** | Enlace (Link) | Clic ante usuario no logueado | Ninguna | Redirige a inicio de sesión | `/login` | Ninguno |
| **Tarjetas de Pedido** | Contenedor | Inspección visual de items | Ninguna | Consulta estado, fecha y productos comprados | Permanece | Ninguno |

#### Integración con API
- **Método HTTP:** `GET`
- **Ruta:** `/api/v1/orders`
- **Autenticación:** Bearer Token obligatorio (`CLIENT` o `ADMIN`).
- **Response JSON (200 OK):**
  ```json
  [
    {
      "id": "77777777-7777-7777-7777-777777777777",
      "status": "PENDING_PAYMENT",
      "total": 180000.00,
      "createdAt": "2026-10-19T20:15:00Z",
      "items": [
        {
          "variantId": "44444444-4444-4444-4444-444444444444",
          "productName": "Blazer Luna",
          "size": "S",
          "color": "Arena",
          "quantity": 1,
          "unitPrice": 180000.00
        }
      ]
    }
  ]
  ```
- **Códigos HTTP Manejados:** `200 OK`, `401 Unauthorized`, `403 Forbidden`.

#### Documentación de los Cuatro Estados de UI
1. **Loading:** La lista se inicializa vacía mientras se resuelve la promesa de `getOrders()`.
2. **Success:** Lista cada orden con ID abreviado (primeros 8 caracteres), fecha formateada en locale `es-CO`, estado del pedido, total en COP y lista de items con sus cantidades.
3. **Empty State:** Si `!orders.length && !error`: Muestra `<p className="empty">Aún no tienes pedidos.</p>`. Si `!user`: Muestra tarjeta *"Ingresa para consultar tus compras"* con botón a `/login`.
4. **Error:** Muestra mensaje rojo: *"No se pudo cargar tu historial."*.

---

### Pantalla 8: Profile Screen (`/perfil`)
- **Nombre Exacto:** Profile Screen - Mi perfil
- **Ruta:** `/perfil`
- **Componente React:** [`ProfilePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProfilePage.tsx)
- **Objetivo UX:** Confirmar los datos de identidad del usuario activo y validar la seguridad de la sesión.
- **Tipo de Usuario:** Usuario autenticado (`CLIENT` o `ADMIN`)
- **Autenticación:** Requiere autenticación
- **Rol Requerido:** `CLIENT`, `ADMIN`
- **Fuente PDF:** Página 6 (`screen-06.png`)
- **Evidencia Código:** [`ProfilePage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProfilePage.tsx), [`ProfileController.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/ProfileController.java)

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Ingresar** | Enlace (Link) | Clic si no hay sesión | Ninguna | Redirige a login | `/login` | Ninguno |

#### Integración con API
- **Método HTTP:** `GET`
- **Ruta:** `/api/v1/me` (ejecutado al iniciar sesión y persistido en `AuthContext`).
- **Autenticación:** Bearer Token obligatorio.
- **Response JSON (200 OK):**
  ```json
  {
    "id": "6b8a7160-1b1c-4ef3-8228-14458a82861a",
    "name": "Felipe",
    "email": "felixriver707@gmail.com",
    "roles": [
      "CLIENT",
      "ADMIN"
    ]
  }
  ```
- **Códigos HTTP Manejados:** `200 OK`, `401 Unauthorized`.

#### Documentación de los Cuatro Estados de UI
1. **Loading:** No aplica (lee datos ya sincronizados en `AuthContext`).
2. **Success:** Renderiza tarjeta con **Nombre**, **Correo**, **Roles** y mensaje verde: *"Tu sesión está protegida con JWT. Las credenciales nunca se muestran."*.
3. **Empty State:** Si `!user`: Muestra tarjeta *"Ingresa para consultar tu perfil"* con botón a `/login`.
4. **Error:** No aplica a nivel visual directo; si el token expira, el interceptor o las llamadas subsecuentes limpian sesión.

---

### Pantalla 9: Admin Dashboard Screen (`/admin`)
- **Nombre Exacto:** Admin Screen - Panel administrativo
- **Ruta:** `/admin`
- **Componente React:** [`AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx)
- **Objetivo UX:** Proveer al administrador métricas clave consolidadas, un formulario para crear prendas e inventarios variantes, y la capacidad de retirar productos del catálogo.
- **Tipo de Usuario:** Administrador
- **Autenticación:** Requiere autenticación y rol `ADMIN`
- **Rol Requerido:** `ADMIN`
- **Fuente PDF:** Página 7 (`screen-07.png`)
- **Evidencia Código:** [`AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx), [`ProductController.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/ProductController.java) L35-53

#### Elementos Interactivos
| Nombre Visible | Tipo | Acción del Usuario | Validación en Cliente | Resultado de Interacción | Navegación | Endpoint Asociado |
| --- | --- | --- | --- | --- | --- | --- |
| **Nombre** | Input (text) | Escribe nombre comercial | `required`, `maxLength={160}` | Asigna nombre | Permanece | Ninguno |
| **Slug** | Input (text) | Escribe URL amigable | `required`, pattern `[a-z0-9]+(?:-[a-z0-9]+)*` | Normaliza a minúsculas | Permanece | Ninguno |
| **Descripción** | Textarea | Describe material/ocasión | `required`, `maxLength={4000}` | Asigna descripción | Permanece | Ninguno |
| **Categoría** | Select | Elige categoría | `required` (UUID válido) | Asigna `categoryId` | Permanece | Ninguno |
| **Precio base** | Input (number) | Fija precio base en COP | `required`, `min="0.01"` | Asigna `price` | Permanece | Ninguno |
| **SKU** | Input (text) | Identificador de inventario | `required`, pattern `[A-Za-z0-9_-]+` | Normaliza a mayúsculas | Permanece | Ninguno |
| **+ Agregar otra talla o color** | Botón | Añade editor de variante | Ninguna | Agrega variante al estado | Permanece | Ninguno |
| **Quitar variante** | Botón | Elimina fila de variante | Visible si `variants.length > 1` | Quita variante del estado | Permanece | Ninguno |
| **Crear producto** | Botón (submit) | Envía formulario | Todos los campos requeridos | Crea producto, resetea form y recarga lista | Permanece | `POST /api/v1/products` |
| **Desactivar** | Botón | Clic en fila de la tabla | Confirmación `window.confirm` | Inactiva prenda en BD | Permanece | `DELETE /api/v1/products/{id}` |

#### Integración con API
- **Métodos y Rutas:**
  - `GET /api/v1/products` (Productos existentes).
  - `GET /api/v1/categories` (Categorías para el selector).
  - `GET /api/v1/orders` (Para cálculo de pedidos y ventas).
  - `POST /api/v1/products` (Creación de producto y variantes).
  - `DELETE /api/v1/products/{id}` (Desactivación lógica).
- **Request JSON `POST /products`:**
  ```json
  {
    "categoryId": "11111111-1111-1111-1111-111111111111",
    "slug": "gorra-urbana-negra",
    "name": "Gorra urbana negra",
    "description": "Gorra en dril de algodón con visera precurvada.",
    "basePrice": 59900.00,
    "active": true,
    "variants": [
      {
        "sku": "GOR-NEG-UNI",
        "size": "Única",
        "color": "Negro",
        "price": 59900.00,
        "available": 10
      }
    ]
  }
  ```
- **Códigos HTTP:** `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `403 Forbidden`, `409 Conflict` (slug o SKU duplicado).

#### Documentación de los Cuatro Estados de UI
1. **Loading:** Durante la creación, el botón se deshabilita y muestra *"Creando producto…"*.
2. **Success:** Mensaje verde: *"Producto, variantes e inventario inicial creados correctamente."*. Los KPIs y la tabla de productos se actualizan de inmediato.
3. **Empty State:** Si `!user`: Muestra *"Debes iniciar sesión."* con botón a `/login`. Si no es admin (`!isAdmin`): Muestra *"Acceso restringido: Esta sección solo está disponible para administradores."*.
4. **Error:** Muestra alerta roja: *"No se pudo crear el producto. Revisa que el slug y cada SKU sean únicos y que los precios e inventarios sean válidos."* o *"No se pudo cargar el dashboard. Verifica los permisos de administrador."*.

---

## I. Matriz Pantalla-Endpoint

| Pantalla | Interacción de Usuario | Método | Endpoint Real | Request Payload / Params | Response Payload / DTO | Autenticación | Rol | Estado UI | Implementación Frontend |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Login** | Enviar credenciales | `POST` | `/api/v1/auth/login` | `LoginRequest(email, password)` | `TokenResponse(accessToken, refreshToken, expiresIn)` | No | Ninguno | Loading en botón / Error en alerta | Implementado en [`auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts) |
| **Login / Register** | Obtener perfil activo | `GET` | `/api/v1/me` | Ninguno (Bearer Token) | `Map<String,Object>` (`id, name, email, roles`) | Sí | `CLIENT`, `ADMIN` | Persistencia en sesión | Implementado en [`auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts) |
| **Register** | Crear cuenta cliente | `POST` | `/api/v1/auth/register` | `RegisterRequest(name, email, password)` | `UserResponse(id, name, email, roles)` | No | Ninguno | Loading en botón / Error en alerta | Implementado en [`auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts) |
| **Catalog** | Cargar categorías | `GET` | `/api/v1/categories` | Ninguno | `List<CategoryView>` (`id, name, slug`) | No | Ninguno | Dropdown options | Implementado en [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts) |
| **Catalog** | Buscar y filtrar prendas | `GET` | `/api/v1/products` | `?q={q}&category={c}&page=0&pageSize=20` | `Page<ProductView>` | No | Ninguno | Grid de productos / Empty state | Implementado en [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts) |
| **Product Detail**| Cargar ficha técnica | `GET` | `/api/v1/products/{id}` | Path: `id` (UUID) | `ProductView` con `variants` | No | Ninguno | Loading / Detalle / 404 alert | Implementado en [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts) |
| **Shopping Bag** | Confirmar pedido | `POST` | `/api/v1/orders` | `CreateOrderRequest(items, shippingAddress, paymentMethod)` | `OrderView(id, status, total, createdAt, items)` | Sí | `CLIENT` | Loading / Mensaje éxito / Error | Implementado en [`orders.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/orders.ts) |
| **Style Profile** | Guardar respuestas | `POST` | `/api/v1/questionnaire`| `QuestionnaireRequest(bodyType, skinTone, heightRange, stylePreferences, consent)` | `201 Created` (Void) | Sí | `CLIENT` | Mensaje de éxito | Implementado en [`recommendations.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/recommendations.ts) |
| **Style Profile** | Obtener recomendados | `GET` | `/api/v1/recommendations` | Ninguno (Bearer Token) | `List<RecommendationView>` (`productId, name, slug, price, reason, score`) | Sí | `CLIENT` | Grid recomendados / Empty | Implementado en [`recommendations.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/recommendations.ts) |
| **Orders** | Consultar historial | `GET` | `/api/v1/orders` | Ninguno (Bearer Token) | `List<OrderView>` | Sí | `CLIENT`, `ADMIN` | Lista tarjetas / Empty state | Implementado en [`orders.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/orders.ts) |
| **Admin** | Cargar métricas órdenes | `GET` | `/api/v1/orders` | Ninguno (Bearer Token) | `List<OrderView>` (órdenes del usuario) | Sí | `ADMIN` | KPI Pedidos y Ventas COP | Implementado en [`orders.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/orders.ts) |
| **Admin** | Publicar producto | `POST` | `/api/v1/products` | `CreateProductRequest(categoryId, slug, name, description, basePrice, active, variants)` | `ProductView` | Sí | `ADMIN` | Mensaje éxito / Reset form | Implementado en [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts) |
| **Admin** | Desactivar prenda | `DELETE` | `/api/v1/products/{id}` | Path: `id` (UUID) | `204 No Content` | Sí | `ADMIN` | Confirmación / Recarga lista | Implementado en [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts) |
| **Sistema** | Chequeo de salud | `GET` | `/api/v1/health` | Ninguno | `{"status":"UP","service":"carpidi-api","timestamp":"..."}` | No | Ninguno | Verificación DevOps/Cloud Run | Sin pantalla (Backend directo) |
| **Sesión** | Renovar sesión JWT | `POST` | `/api/v1/auth/refresh-token` | `RefreshRequest(refreshToken)` | `TokenResponse(accessToken, refreshToken, expiresIn)` | No | Ninguno | Sin llamada automática en cliente | Implementado en backend; pendiente interceptor |
| **Sesión** | Revocar token servidor| `POST` | `/api/v1/auth/logout` | `RefreshRequest(refreshToken)` | `204 No Content` | No | Ninguno | Solo limpia local en `logout()` | Implementado en backend; no llamado en frontend |
| **Admin** | Crear categoría | `POST` | `/api/v1/categories` | `CreateCategoryRequest(name, slug)` | `CategoryView(id, name, slug)` | Sí | `ADMIN` | Sin interfaz de creación en UI | Implementado en backend; sin UI en `AdminPage` |
| **Admin** | Actualizar producto | `PUT` | `/api/v1/products/{id}` | `UpdateProductRequest(categoryId, slug, name, description, basePrice, active)` | `ProductView` | Sí | `ADMIN` | Sin modal/formulario de edición | Implementado en backend; sin UI en `AdminPage` |

---

## J. Brechas UX, Frontend y Backend

### 1. Pantalla del PDF sin Ruta Implementada
- **Evidencia:** La Página 8 del PDF (`screen-08.jpg`, maqueta Stitch/Figma) presenta una landing page rica con: Hero editorial *"Encuentra prendas que realmente van contigo"*, Curaduría por categorías (`Mujer`, `Hombre`, `Accesorios`, `Nuevas Colecciones`, `Edición Especial`), widget de clienta preferencial *"Recomendado para ti, Camila"*, sección de newsletter *"La Gaceta CARPIDI"* y enlaces a Favoritos (`BOLSA 3` y corazón de Wishlist).
- **Impacto:** Alta discrepancia visual y de marketing; el cliente que ingresa a `/` encuentra únicamente una lista simple de productos con placeholders grises en lugar de la experiencia de lujo proyectada.
- **Prioridad:** Media (fase de consolidación de marca).
- **Recomendación:** Construir un componente `LandingPage.tsx` o enriquecer `CatalogPage.tsx` para incorporar el hero y las secciones editoriales cuando la ruta sea `/`.
- **Archivos Probables:** [`frontend/src/app/App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx), [`frontend/src/pages/CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx).

### 2. Ruta sin Documentación en Capturas de Pantalla del PDF
- **Evidencia:** Las rutas `/productos/:id` ([`ProductPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/ProductPage.tsx)) y `/pedidos` ([`OrdersPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/OrdersPage.tsx)) están plenamente programadas en React y conectadas a la API, pero en el archivo `UXMAPING_V1.PDF` no se incluyeron capturas de pantalla dedicadas para ellas (solo aparecen como botones/enlaces en otras pantallas).
- **Impacto:** Bajo funcionalmente, pero genera vacíos en guías de diseño y criterios de aceptación visual.
- **Prioridad:** Baja.
- **Recomendación:** Agregar al PDF de diseño las pantallas correspondientes a la ficha técnica de producto y la tabla de órdenes de compra.
- **Archivos Probables:** [`docs/UXMAPING_V1.PDF`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/UXMAPING_V1.PDF).

### 3. Acción de Usuario sin Endpoint Backend
- **Evidencia:**
  1. Icono de corazón / Favoritos en tarjetas de producto y cabecera (Página 8). No existe entidad `Wishlist` ni endpoints en Spring Boot.
  2. Formulario de suscripción al newsletter *"La Gaceta CARPIDI"* (Página 8). No existe endpoint de newsletter.
  3. Cuestionario de asesoría morfológica: En el frontend se envían opciones fijas (`Reloj de arena`, `Claro`, `Baja`), pero no hay endpoint que devuelva las opciones de catálogo dinámicamente.
- **Impacto:** Medio; funcionalidades cosméticas no operativas.
- **Prioridad:** Baja (definidas para versiones posteriores en el `README.md`).
- **Recomendación:** Mantener documentadas como requerimientos de evolución posterior.
- **Archivos Probables:** [`backend/src/main/java/com/carpidi/api/`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/).

### 4. Endpoint Backend sin Interfaz en Frontend
- **Evidencia:**
  - `POST /api/v1/categories`: El backend permite a administradores crear categorías con nombre y slug, pero en [`AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx) no existe ningún formulario para crear categorías (solo un dropdown de selección).
  - `PUT /api/v1/products/{id}`: El backend permite actualizar datos comerciales de un producto, pero en [`AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx) la tabla solo incluye el botón "Desactivar" (`DELETE`), sin opción de editar.
  - `POST /api/v1/auth/refresh-token`: Existe en backend pero el frontend no tiene configurado un interceptor de Axios para refrescar automáticamente el token ante respuestas HTTP 401.
  - `POST /api/v1/auth/logout`: Existe en backend pero la función `logout()` de [`AuthContext.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/state/AuthContext.tsx) solo borra el `localStorage` sin llamar al endpoint para revocar el refresh token en base de datos.
- **Impacto:** Alto en gestión administrativa y seguridad de sesiones.
- **Prioridad:** Alta.
- **Recomendación:** Agregar modal de edición en `AdminPage`, formulario de creación de categorías e interceptor de refresco de tokens en `api.ts`.
- **Archivos Probables:** [`frontend/src/pages/AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx), [`frontend/src/services/api.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/api.ts), [`frontend/src/state/AuthContext.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/state/AuthContext.tsx).

### 5. Inconsistencia de Contrato: Métricas de Órdenes para Administrador
- **Evidencia:** En [`docs/api.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/api.md) L32 se especifica que `GET /orders` devuelve: *"pedidos del cliente o todos para ADMIN"*. Sin embargo, en el código real de [`OrderService.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/application/OrderService.java) L24-28:
  ```java
  public List<OrderView> listFor(String email) {
    return orders.findAllByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(email).stream()
        .map(this::toView).toList();
  }
  ```
  El método siempre filtra por el email del usuario autenticado, sin verificar si tiene el rol `ADMIN`.
- **Impacto:** En [`AdminPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/AdminPage.tsx), el dashboard calcula las métricas operativas sumando las órdenes obtenidas de `getOrders()`. Si el administrador no ha realizado compras personales, el panel muestra: **0 Pedidos registrados** y **$0 Ventas acumuladas** (exactamente como se observa en la captura de la Página 7, `screen-07.png`).
- **Prioridad:** Alta.
- **Recomendación:** Modificar `OrderService.java` para que verifique si el rol es `ADMIN`; de ser así, invocar `orders.findAllByOrderByCreatedAtDesc()`.
- **Archivos Probables:** [`backend/src/main/java/com/carpidi/application/OrderService.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/application/OrderService.java), [`backend/src/main/java/com/carpidi/api/OrderController.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/api/OrderController.java).

### 6. Contrato Diferente en Cliente HTTP Frontend (`fetch` vs `axios`)
- **Evidencia:** Mientras que [`catalog.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/catalog.ts), [`orders.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/orders.ts) y [`recommendations.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/recommendations.ts) utilizan la instancia centralizada `api` de Axios (la cual respeta `VITE_API_URL` e inyecta el Bearer token), el archivo [`auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts) utiliza directamente `fetch('/api/v1' + path)`.
- **Impacto:** Medio; si se ejecuta el frontend contra un backend local en otro puerto sin pasar por el proxy de Vite o Vercel, las peticiones de autenticación fallan porque `fetch` no respeta `baseURL`.
- **Prioridad:** Media.
- **Recomendación:** Migrar [`auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts) para usar la instancia configurada de Axios.
- **Archivos Probables:** [`frontend/src/services/auth.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/auth.ts), [`frontend/src/services/api.ts`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/services/api.ts).

### 7. Navegación Inconsistente Post-Login / Registro
- **Evidencia:** Tanto en [`LoginPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/LoginPage.tsx) L20 como en [`RegisterPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/RegisterPage.tsx) L21, tras autenticarse con éxito se ejecuta forzosamente `navigate('/carrito')`.
- **Impacto:** Fricción de usuario; si un cliente entra a iniciar sesión desde el catálogo, o si un administrador inicia sesión para gestionar la tienda, el sistema siempre lo redirige a la bolsa de compras en lugar de devolverlo a la página previa o a `/admin`.
- **Prioridad:** Media.
- **Recomendación:** Implementar redirección contextual basada en `location.state?.from` y roles de usuario.
- **Archivos Probables:** [`frontend/src/pages/LoginPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/LoginPage.tsx), [`frontend/src/pages/RegisterPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/RegisterPage.tsx).

### 8. Función Simulada: Método de Pago en Checkout
- **Evidencia:** En [`CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx) L28, la creación del pedido envía el valor fijo `"paymentMethod": "MANUAL_TEST"`.
- **Impacto:** No existe integración en tiempo real con pasarelas de pago colombianas (Wompi, PayU, PSE, tarjetas de crédito/débito).
- **Prioridad:** Baja para el MVP actual; documentado como evolución posterior en el `README.md`.
- **Recomendación:** Incorporar selector de pasarela de pago cuando se habiliten las credenciales comerciales.
- **Archivos Probables:** [`frontend/src/pages/CartPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CartPage.tsx).

### 9. Ausencia de Imágenes Reales en Productos del Catálogo
- **Evidencia:** En [`CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx) L57, cada producto renderiza `<div className="placeholder" aria-hidden="true" />`. El modelo de datos de `Product` y la base de datos PostgreSQL no poseen columna `image_url`.
- **Impacto:** Alto impacto estético; el catálogo del frontend desplegado muestra cuadros con gradiente en lugar de las fotografías editoriales mostradas en la maqueta de la Página 8 o los arcos de la Página 3.
- **Prioridad:** Alta.
- **Recomendación:** Agregar campo `imageUrl` a la entidad `Product` y a los DTOs, ejecutando una migración Flyway (`V5__product_images.sql`).
- **Archivos Probables:** [`backend/src/main/resources/db/migration/`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/resources/db/migration/), [`backend/src/main/java/com/carpidi/domain/Product.java`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/backend/src/main/java/com/carpidi/domain/Product.java), [`frontend/src/pages/CatalogPage.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/pages/CatalogPage.tsx).

---

## K. Criterios de Aceptación y Checklist de Verificación

- [x] **PDF Completo Revisado:** Las 8 páginas de [`docs/UXMAPING_V1.PDF`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/UXMAPING_V1.PDF) y las capturas correspondientes en [`docs/ux-screens/`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/docs/ux-screens/) fueron examinadas exhaustivamente.
- [x] **Pantallas Inventariadas:** Cada pantalla fue contrastada entre su nombre de diseño, componente React, ruta en enrutador y endpoint principal.
- [x] **Rutas Verificadas:** Se contrastaron todas las rutas declaradas en [`frontend/src/app/App.tsx`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/frontend/src/app/App.tsx).
- [x] **Endpoints Obtenidos de Código:** Todos los endpoints provienen directamente de los controladores Spring Boot (`AuthController`, `ProductController`, `CategoryController`, `OrderController`, `RecommendationController`, `ProfileController`, `HealthController`).
- [x] **Sin Contratos Inventados:** Todas las estructuras JSON corresponden a records Java, DTOs y tipos TypeScript reales existentes en el repositorio.
- [x] **Cuatro Estados por Pantalla:** Se documentaron los estados de *Loading*, *Success*, *Empty State* y *Error* para cada una de las pantallas.
- [x] **Roles Documentados:** Se discriminaron claramente los flujos para visitantes anónimos, usuarios autenticados (`CLIENT`) y administradores (`ADMIN`).
- [x] **Mermaid Válido:** Diagrama de navegación `flowchart TD` testeado con sintaxis correcta y etiquetas entre comillas para evitar fallas de renderizado.
- [x] **Enlaces Markdown Funcionales:** Todos los enlaces a archivos del repositorio utilizan el esquema seguro `file:///` con rutas absolutas legibles.
- [x] **Brechas Identificadas:** Se clasificaron y detallaron las brechas de diseño, frontend, backend y contratos de datos con sus respectivos impactos y archivos afectados.
- [x] **Ubicación del Archivo:** Guardado exclusivamente en la raíz del repositorio como [`UX_MAPPING.md`](file:///c:/Users/jusnf/Desktop/Carpidi/carpidi/UX_MAPPING.md).
