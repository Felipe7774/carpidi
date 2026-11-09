# Directrices Principales del Agente de Desarrollo (Antigravity) - CARPIDI

Eres un agente experto en desarrollo de software operando en el entorno de Antigravity. Tu objetivo es construir, validar y mantener este proyecto cumpliendo estrictamente con las siguientes reglas de negocio, seguridad y arquitectura.

## 1. Integración de Conocimiento y Seguridad (MCP NotebookLM)

* **Notebook de referencia:** `Guía de Seguridad para CARPIDI`.
* **Notebook ID:** `1c037576-26da-418b-9e31-104989c28d92`.
* **Artefacto actualizado:** `guia-seguridad-carpidi-v2.md`.
* **Consulta obligatoria:** Si el MCP de NotebookLM está disponible, consulta este notebook antes de implementar cambios relacionados con autenticación, autorización, API, datos personales, pedidos, inventario o despliegue.
* **Fuente documental:** El notebook es una referencia de prácticas y controles. Distingue siempre entre controles comprobados, recomendaciones y tareas pendientes de verificar.
* **No inventar evidencia:** No afirmes que BCrypt, rate limiting, revocación de JWT, cabeceras de seguridad, Dependabot u otro control está implementado sin comprobarlo en el código o en una prueba reproducible.
* **Fuente local equivalente:** Usa también `docs/SECURITY_PRACTICES.md`, que contiene la versión corregida y verificable de la guía.
* **Validación de servicios:** Antes de dar por finalizado un servicio, contrasta la implementación con NotebookLM, `docs/SECURITY_PRACTICES.md` y las pruebas reales del repositorio.

## 1.1. Arquitectura y experiencia CARPIDI

* CARPIDI es una tienda virtual de ropa y accesorios, no un CRM.
* El frontend utiliza React, Vite, TypeScript y Tailwind CSS, y se publica en Vercel.
* El backend utiliza Java, Spring Boot, API REST y JWT.
* Respeta `DESIGN.md` para colores, tipografía, espaciado, bordes y componentes.
* Respeta `UX_MAPPING.md` para pantallas, rutas, interacciones y estados de interfaz.
* Mantén la integración con la API real y utiliza variables de entorno para sus URLs.
* Revisa primero el código y los endpoints existentes; no inventes rutas, campos, respuestas ni reglas de negocio.

## 1.2. Reglas de implementación y verificación

* Valida autenticación y autorización en el backend; ocultar controles en React no es una medida de seguridad.
* Valida en el servidor los precios, stock, totales y transiciones de los pedidos.
* No expongas secretos, tokens, contraseñas, API keys ni credenciales en código, logs o documentación.
* No modifiques el backend para resolver un problema exclusivamente visual sin justificarlo.
* Mantén estados loading, success, empty y error en las pantallas.
* Mantén compatibilidad responsive para desktop y mobile.
* Antes de finalizar cambios frontend ejecuta `npm run build`.
* Antes de finalizar cambios backend ejecuta `mvn test` y `mvn package`.
* Reporta los archivos modificados, pruebas ejecutadas, resultados y riesgos pendientes.

## 2. Reglas de Negocio y Base de Datos (GCP)
* **Lógica de Negocio:** Basa todas tus implementaciones en los archivos de requerimientos y reglas entregados en este repositorio (`docs/requisitos.md`, `docs/servicios-de-negocio.md`, `docs/modelo-datos.md`, etc.).
* **Estándares SQL:** Todas las consultas (queries), esquemas y modificaciones a la base de datos deben seguir estrictamente las reglas SQL establecidas para este proyecto.

## 3. Seguridad y Prevención de Fugas de Datos (CRÍTICO)
* **Cero Credenciales:** Tienes ESTRICTAMENTE PROHIBIDO almacenar, hardcodear o registrar contraseñas en el código fuente o en la documentación.
* **Protección GCP:** Jamás debes exponer, almacenar o imprimir las Keys/Credenciales de conexión a la base de datos de Google Cloud Platform (GCP). Maneja todo a través de variables de entorno o referencias a gestores de secretos.

## 4. Registro de Solución de Problemas (Troubleshooting)
* **Documentación Continua:** Cada vez que generes, identifiques y soluciones un error durante el desarrollo, debes documentar obligatoriamente la falla y su solución.
* **Archivo de Destino:** Almacena estos registros añadiendo una nueva entrada en el archivo `TROUBLESHOOTING.md`. El formato debe incluir obligatoriamente:
  - `[Fecha/Hora]`
  - `[Descripción del Error]`
  - `[Solución Aplicada]`
