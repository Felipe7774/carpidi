# MCP de CARPIDI

`mcp_config.json` registra los servidores que Antigravity debe utilizar para este proyecto:

- `gemini-notebook-mcp`: consulta la guía de seguridad de CARPIDI.
- `stitch`: conecta con el servidor remoto de Google Stitch.

La clave de Stitch nunca se guarda en este repositorio. Antes de iniciar Antigravity, configura la variable de usuario `STITCH_API_KEY` en Windows o introduce la clave mediante el gestor de MCP de Antigravity. El archivo solo contiene la referencia `${STITCH_API_KEY}`.

Después de configurarla, valida la conexión desde **Additional options (…) → MCP Servers**. Si el servidor aparece como conectado, Stitch y NotebookLM quedan disponibles para las reglas de este workspace.
