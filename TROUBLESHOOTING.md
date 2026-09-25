# Registro de Solución de Problemas (Troubleshooting) - CARPIDI

Este documento registra de forma continua cada falla, error o anomalía identificada y su correspondiente solución durante el ciclo de vida del desarrollo.

---

## [2026-09-14 20:40:00 -05:00] - Falla en uv trampoline al ejecutar comandos del CLI `nlm` (NotebookLM MCP)

### Descripción del Error
Al intentar ejecutar los comandos de autenticación y configuración del servidor MCP de NotebookLM en PowerShell:
```powershell
$env:Path += ";$env:USERPROFILE\.local\bin"
nlm login
nlm setup add antigravity
```
El comando falla inmediatamente arrojando:
```text
error: uv trampoline failed to canonicalize script path
```

### Causa Raíz
En sistemas Windows, los ejecutables generados por `uv tool install` en `$env:USERPROFILE\.local\bin\` son binarios "trampoline" ligeros encargados de invocar el intérprete de Python dentro del entorno aislado de la herramienta (`%APPDATA%\uv\tools\notebooklm-mcp-cli` o `%LOCALAPPDATA%\uv\tools`). Si la ruta contiene caracteres especiales, enlaces simbólicos/junctions no resueltos, o si el entorno de la herramienta se instaló de forma inconsistente, el trampoline de `uv` no puede canonicalizar la ruta absoluta del script Python de destino y aborta la ejecución con código de salida 1.

### Solución Aplicada / Métodos de Corrección

#### Método 1: Ejecutar directamente con `uvx` (Bypass del trampoline - Recomendado)
Evita el ejecutable trampoline invocando el paquete directamente a través de `uvx`:
```powershell
uvx --from notebooklm-mcp-cli nlm login
uvx --from notebooklm-mcp-cli nlm setup add antigravity
```

#### Método 2: Reinstalación limpia forzada de la herramienta con `uv`
Desinstalar y reinstalar el paquete para regenerar el entorno y el ejecutable trampoline:
```powershell
uv tool uninstall notebooklm-mcp-cli
uv tool install notebooklm-mcp-cli --force
```
Luego verificar con:
```powershell
nlm doctor
nlm login
nlm setup add antigravity
```

#### Método 3: Instalación mediante `pip` estándar de Python
Si `uv` continúa presentando problemas con trampolines en Windows:
```powershell
pip install --upgrade notebooklm-mcp-cli
python -m notebooklm_mcp_cli login
python -m notebooklm_mcp_cli setup add antigravity
```

#### Método 4: Registro manual del MCP en Antigravity
Si el comando `setup add antigravity` no pudiera escribir en la configuración global, se puede registrar el servidor MCP de forma manual creando o editando el archivo de configuración MCP (por ejemplo en `.agents/mcp_config.json` o en `~/.gemini/config/mcp_config.json`):
```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "uvx",
      "args": ["--from", "notebooklm-mcp-cli", "nlm", "server"]
    }
  }
}
```

## [2026-09-21 08:57:53 -05:00] - NotebookLM no tiene un perfil autenticado

### Descripción del Error

La verificación `nlm login --check` respondió `Profile not found: default`. Por esta razón, los servicios pueden construirse a partir de los requisitos versionados, pero todavía no pueden declararse validados contra las fuentes de NotebookLM.

### Solución Aplicada

Se detuvo la validación externa para no inventar evidencia. Debe ejecutarse manualmente `nlm login` en la terminal de Antigravity y completar el inicio de sesión de Google; después se debe repetir `nlm login --check` y consultar las fuentes antes de cerrar el servicio.

### Prevención

Incluir `nlm login --check` como verificación previa al inicio de cada sesión de validación arquitectónica.

## [2026-09-21 08:57:53 -05:00] - Motor de Docker Desktop no disponible

### Descripción del Error

La validación del backend con contenedores no pudo iniciarse porque el cliente Docker no encontró `dockerDesktopLinuxEngine`. El archivo de Docker Compose sí superó la validación de configuración.

### Solución Aplicada

La compilación y las pruebas quedan como paso obligatorio en la terminal de Antigravity, donde debe iniciarse Docker Desktop o disponer de Java 21 y Maven antes de ejecutar `mvn test`.

### Prevención

Verificar el estado del motor con `docker version` antes de iniciar las pruebas y no declarar un servicio terminado mientras la compilación no haya finalizado correctamente.

## [2026-09-21 09:45:00 -05:00] - Distribución `docker-desktop` de WSL iniciada sin API Docker disponible

### Descripción del Error

Docker Desktop aparece abierto y WSL 2 está instalado, pero `docker compose up` no puede conectarse al endpoint `npipe:////./pipe/dockerDesktopLinuxEngine`. La distribución `docker-desktop` inicialmente estaba detenida; al iniciarla manualmente pasó a `Running`, pero el socket/API del motor todavía no está disponible.

### Estado y Solución Aplicada

Se inició Docker Desktop, se activó el contexto `desktop-linux` y se validó que `docker compose config` es correcto. No se levantaron contenedores ni se alteraron volúmenes porque el daemon aún no responde. El siguiente paso seguro es reiniciar Docker Desktop desde su interfaz y comprobar `docker version`; después se puede ejecutar `docker compose up --build`.

### Prevención

Comprobar que `docker version` muestre una sección `Server` antes de ejecutar Compose. Si solo aparece `Client` o falta `dockerDesktopLinuxEngine`, esperar a que Docker Desktop termine de iniciar o revisar el estado de WSL sin eliminar la distribución ni sus datos.

## [2026-09-21 10:05:00 -05:00] - Fallos de compilación y pruebas del backend en Docker

### Descripción del Error

La imagen del backend encontró varios bloqueos durante `mvn package`: un paso redundante de descarga de dependencias alargaba la compilación, había imports ambiguos o ausentes, dos cuerpos JSON estaban escritos con delimitadores de text block inválidos, el test JWT usaba una fecha fija ya expirada y el test MVC necesitaba dependencias del filtro JWT para crear su contexto.

### Solución Aplicada

Se eliminó el paso redundante `dependency:go-offline` del Dockerfile, se corrigieron los imports, se reemplazaron los cuerpos JSON por cadenas Java válidas, se movió el reloj fijo del test JWT a una fecha futura y se añadieron mocks de `JwtService` y `UserRepository` al test del controlador. Después de un reintento por una intermitencia de Maven Central, `docker compose build api` finalizó correctamente.

### Prevención

Mantener los tests deterministas usando fechas futuras o relojes inyectables, aislar las pruebas MVC de infraestructura no relevante y conservar el Dockerfile con el mínimo de pasos necesarios.

## [2026-09-21 10:15:00 -05:00] - Filtros de productos con parámetros nulos en PostgreSQL

### Descripción del Error

La consulta de catálogo devolvía un error `function lower(bytea) does not exist` cuando los filtros opcionales se enviaban vacíos. PostgreSQL no podía inferir el tipo de los parámetros nulos usados en las expresiones `:param is null`.

### Solución Aplicada

Los filtros del catálogo ahora se normalizan a cadena vacía antes de consultar y la consulta JPQL usa `:param = ''` como condición de filtro desactivado. Se reconstruyó la imagen y `GET /api/v1/products` respondió `200`.

### Prevención

Probar siempre los endpoints con todos los filtros opcionales ausentes y evitar expresiones SQL que dejen parámetros nulos sin tipo cuando el motor requiere inferencia explícita.

## [2026-09-21 10:25:00 -05:00] - TypeScript no reconocía Vite ni importaciones CSS

### Descripción del Error

Al validar el frontend con `npm run build`, TypeScript no encontraba las declaraciones para la importación de `styles.css` ni para `ImportMeta.env`, que se usa para configurar la URL de la API.

### Solución Aplicada

Se añadió `frontend/src/vite-env.d.ts` con las definiciones oficiales de Vite. El build de producción finalizó correctamente y se verificó la comunicación CORS desde `http://127.0.0.1:5173` hacia la API local.

### Prevención

Conservar las declaraciones de entorno de Vite como parte del código fuente y ejecutar `npm run build` antes de validar cambios del frontend.

## [2026-09-21 10:40:00 -05:00] - Bootstrap de ADMIN rechazado por política de contraseña

### Descripción del Error

Al habilitar el bootstrap del administrador para cargar productos, el backend detuvo el arranque porque la contraseña local configurada no cumplía la política mínima: 12 a 72 caracteres con mayúscula, minúscula, número y símbolo.

### Solución Aplicada

Se deshabilitó nuevamente el bootstrap para conservar la disponibilidad de la API. En la base local de Docker se otorgó el rol `ADMIN` a la cuenta de prueba ya registrada y, usando el endpoint protegido, se publicaron tres productos iniciales. No se modificaron ni expusieron secretos en archivos versionados.

### Prevención

Antes de habilitar el bootstrap, validar las variables locales de administrador contra la política de contraseña. En GCP, el administrador inicial debe obtenerse desde Secret Manager y no desde valores versionados.
## 2026-09-23 00:00 - Error de compilación TypeScript en carrito

**Descripción del error:** `npm run build` falló porque las variantes del catálogo permiten `size` y `color` como `null`, mientras que el estado del carrito espera valores opcionales `string | undefined`.

**Solución aplicada:** Se normalizaron `size` y `color` con `?? undefined` al agregar productos al carrito, manteniendo el contrato del estado interno sin cambiar la respuesta de la API.

## 2026-09-23 00:00 - Maven no disponible en PowerShell

**Descripción del error:** La ejecución local de `mvn test` falló porque el comando `mvn` no está disponible en el PATH de PowerShell y el proyecto no incluye Maven Wrapper.

**Solución aplicada:** La verificación Java se realizará con el build Docker del servicio API, que usa la imagen `maven:3.9-eclipse-temurin-21` definida en el `Dockerfile`.

## 2026-09-23 00:00 - Credenciales demo en ambientes de API

**Descripción del error:** Los ambientes locales de Bruno/Postman tenían una contraseña demo escrita como valor de variable, lo que contradice la regla de cero credenciales del agente.

**Solución aplicada:** Se reemplazaron esos valores por placeholders locales (`CAMBIAR_EN_BRUNO_LOCAL` y `CAMBIAR_EN_POSTMAN_LOCAL`). Las contraseñas reales deben configurarse solo en el cliente local de pruebas, no versionarse.

## 2026-09-25 00:00 - Cloud SQL rechazó el tier de desarrollo

**Descripción del error:** La creación de la instancia PostgreSQL con el tier `db-f1-micro` fue rechazada porque GCP asumió la edición `enterprise-plus`, que no permite tiers compartidos.

**Solución aplicada:** Se configuró explícitamente la edición `enterprise`, compatible con `db-f1-micro`, antes de reintentar la creación.

**Prevención:** Declarar siempre `--edition=enterprise` cuando el entorno académico use un tier compartido de Cloud SQL.

## 2026-09-25 00:00 - Lectura de secretos contaminada por aviso local de gcloud

**Descripción del error:** El lanzador portable de Google Cloud CLI emitió un aviso local de Python junto con el valor obtenido desde Secret Manager. PowerShell interpretó ambas líneas como la contraseña, por lo que PostgreSQL rechazó la autenticación administrativa.

**Solución aplicada:** Se filtra explícitamente la última línea devuelta por `gcloud secrets versions access` antes de usarla como contraseña. Las contraseñas se rotan y se vuelve a retirar toda red autorizada temporal antes de reintentar.

**Prevención:** No usar directamente la salida completa de un CLI como secreto; normalizarla y verificar que no incluya mensajes del entorno.

## 2026-09-25 00:00 - Cambio de propietario restringido en Cloud SQL PostgreSQL

**Descripción del error:** PostgreSQL rechazó `ALTER DATABASE ... OWNER TO carpidi_app` porque el rol administrador administrado por Cloud SQL no puede ejecutar `SET ROLE` hacia el usuario de aplicación.

**Solución aplicada:** Se reemplaza el cambio de propiedad por privilegios explícitos mínimos sobre la base y el esquema `public`, suficientes para las migraciones Flyway.

**Prevención:** En Cloud SQL usar privilegios SQL explícitos para las cuentas de aplicación; no depender de cambios de propietario entre roles administrados.

## 2026-09-25 00:00 - Escape incorrecto de comando meta de psql

**Descripción del error:** El uso de `\\connect` en PowerShell produjo dos barras invertidas para `psql`, que respondió `invalid command` y no ejecutó la concesión del esquema.

**Solución aplicada:** Se elimina el comando meta y se abre una segunda conexión directa a la base `carpidi` para ejecutar el `GRANT` del esquema.

**Prevención:** Para automatizaciones multiplataforma, preferir conexiones explícitas por base sobre comandos meta interactivos de `psql`.

## 2026-09-25 00:00 - Cloud Build sin acceso al artefacto fuente

**Descripción del error:** `gcloud builds submit` subió el archivo fuente al bucket de Cloud Build, pero la cuenta de cómputo predeterminada no tenía `storage.objects.get` y la compilación fue rechazada con HTTP 403.

**Solución aplicada:** Se concede a esa cuenta solamente el rol `roles/storage.objectViewer` para que Cloud Build pueda leer los archivos fuente del proyecto.

**Prevención:** Validar las cuentas de servicio efectivas de Cloud Build e incluir el permiso mínimo de lectura del bucket de fuentes en proyectos GCP nuevos.

## 2026-09-25 00:00 - Cloud Build sin permiso para publicar en Artifact Registry

**Descripción del error:** La imagen de CARPIDI compiló y superó las pruebas, pero Cloud Build no pudo subirla al repositorio `carpidi` por falta de `artifactregistry.repositories.uploadArtifacts`.

**Solución aplicada:** Se asigna a la cuenta de compilación el rol `roles/artifactregistry.writer`, limitado al proyecto que contiene el repositorio de CARPIDI.

**Prevención:** Al crear un repositorio Artifact Registry nuevo, conceder a la cuenta efectiva de Cloud Build permisos de escritura antes de lanzar la primera compilación.

## 2026-09-25 00:00 - Variables de Cloud Run incompletas en el primer despliegue

**Descripción del error:** La primera revisión no recibió `APP_JWT_SECRET` y la URL JDBC quedó truncada antes de `socketFactory`, por lo que Spring Boot no pudo iniciar.

**Solución aplicada:** Se actualiza la revisión con secretos de Secret Manager y un delimitador explícito para las variables de entorno, preservando el carácter `&` de la URL JDBC.

**Prevención:** Para valores de variables que contienen caracteres reservados, usar un delimitador alternativo de `gcloud` en lugar de la sintaxis separada por comas.

## 2026-09-25 00:00 - Saltos de línea en secretos inyectados en Cloud Run

**Descripción del error:** Los secretos creados desde PowerShell mediante una tubería contenían un salto de línea final. Cloud Run inyectó ese carácter en el usuario y contraseña de PostgreSQL, que rechazó la autenticación.

**Solución aplicada:** Se generan versiones nuevas de los secretos con archivos temporales UTF-8 sin salto de línea y se rota la contraseña del usuario de aplicación para que coincida exactamente.

**Prevención:** Para secretos que se comparan byte a byte, evitar la salida de consola como fuente de datos y usar una escritura explícita sin terminador de línea.

## 2026-09-25 00:00 - Checkout rechazado por datos de entrega incompletos

**Descripción del error:** La primera prueba de `POST /orders` respondió `400` porque no incluía `paymentMethod` ni `shippingAddress`.

**Solución aplicada:** Se envió una solicitud con método de pago demostrativo y dirección de envío completa. El pedido se creó con estado `PENDING_PAYMENT`.

**Prevención:** Mantener en Postman y Bruno el cuerpo completo del checkout, incluyendo artículos, método de pago y dirección.
