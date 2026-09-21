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
