---
trigger: always_on
description: Directrices obligatorias para el desarrollo seguro de CARPIDI.
---

@GEMINI.md

# Aplicación obligatoria

- Usa el MCP de NotebookLM antes de finalizar un servicio. Si el MCP o la fuente necesaria no está disponible, informa el bloqueo y no inventes requisitos, validaciones ni evidencias.
- Basa la lógica en la documentación del repositorio y usa PostgreSQL en GCP siguiendo los estándares SQL definidos para CARPIDI.
- No crees recursos de pago, instancias ni servicios de GCP sin autorización explícita.
- No expongas, almacenes, imprimas ni registres contraseñas, tokens, claves, URLs privadas o cadenas de conexión. Usa variables de entorno y gestores de secretos.
- Mantén las capas controller, service, repository, DTO, entity y security. No expongas entidades JPA directamente mediante la API.
- Antes de declarar un cambio terminado, ejecuta pruebas, compilación y análisis estático que correspondan.
- Antes de editar, revisa los cambios existentes. No borres archivos, ramas, datos ni configuraciones; no uses `git reset --hard` sin confirmación.
- Ante cada falla identificada y resuelta, agrega una entrada sin secretos a `TROUBLESHOOTING.md` con fecha y hora, error, solución aplicada y prevención.
