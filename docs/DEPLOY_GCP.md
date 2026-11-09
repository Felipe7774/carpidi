# Despliegue de CARPIDI en GCP

Esta guía conserva el procedimiento histórico para Cloud Run y Cloud SQL. El despliegue vigente de CARPIDI usa Render para el backend y Supabase PostgreSQL; las credenciales se configuran como variables privadas y no deben escribirse en Git.

## Despliegue vigente (Render + Supabase)

- Backend: [carpidi-api.onrender.com](https://carpidi-api.onrender.com), construido desde `backend/Dockerfile`.
- Base de datos: proyecto Supabase `carpidi-db`, con migraciones Flyway ejecutadas automáticamente.
- Frontend: [carpidi.vercel.app](https://carpidi.vercel.app), con el rewrite `/api/v1/*` hacia Render.
- Variables privadas del backend: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `APP_JWT_SECRET`, `APP_ALLOWED_ORIGINS`, `DB_POOL_SIZE` y `SERVER_PORT=10000`.
- Verificación: `GET https://carpidi-api.onrender.com/api/v1/health` responde `200` y `status: UP`.

El plan gratuito de Render puede suspender el servicio después de inactividad; la primera petición posterior puede tardar unos segundos en despertar el contenedor.

## Arquitectura

- Frontend React: Cloud Storage + CDN o Firebase Hosting.
- Backend Spring Boot: Cloud Run desde `backend/Dockerfile`.
- PostgreSQL: Cloud SQL PostgreSQL.
- Secretos: Secret Manager (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`).
- Identidad: una cuenta de servicio exclusiva para Cloud Run con permisos mínimos.

## Preparación

```powershell
gcloud auth login
gcloud config set project PROJECT_ID
gcloud services enable run.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
gcloud artifacts repositories create carpidi --repository-format=docker --location=us-central1
```

## Imagen del backend

```powershell
docker build -t us-central1-docker.pkg.dev/PROJECT_ID/carpidi/api:latest ./backend
docker push us-central1-docker.pkg.dev/PROJECT_ID/carpidi/api:latest
```

También puedes usar `backend/cloudrun.yaml.example` como base y ejecutar `scripts/deploy-gcp.ps1` después de autenticar `gcloud`. El manifiesto es una plantilla: reemplaza proyecto, región, instancia y cuenta de servicio sin guardar secretos.

## Secretos

Crear cada secreto desde un entorno seguro y conceder `roles/secretmanager.secretAccessor` únicamente a la cuenta de servicio de Cloud Run. No usar valores reales en comandos compartidos, capturas ni commits.

## Servicio Cloud Run

Configurar `SPRING_DATASOURCE_URL`, usuario, contraseña y `JWT_SECRET` mediante referencias a Secret Manager. Ajustar `APP_ALLOWED_ORIGINS` al dominio del frontend. Validar `GET /api/v1/health` y la respuesta `status=UP`.

## Conectar el frontend publicado

Antes de compilar la versión pública, crear `frontend/.env.production` a partir de `frontend/.env.production.example` y asignar la URL real de Cloud Run en `VITE_API_URL`. Después ejecutar `npm run build` dentro de `frontend` y publicar una nueva versión del sitio. No usar `localhost` en producción.

## Evidencia

Guardar en Postman/Bruno la URL pública, pruebas `200` de `/health`, autenticación, catálogo y pedidos, además de un caso `401` sin token. Nunca incluir tokens, contraseñas o claves en las capturas.

## Despliegue de demostración

- Proyecto GCP: `project-0b03e6ab-52a0-466a-a54`.
- API histórica de Cloud Run: `https://carpidi-api-a3w662uxxq-uc.a.run.app/api/v1`.
- Verificación: `GET /health` respondió `200` con `status: UP`.
- Frontend histórico: `https://carpidi-web.carlosgcb74.chatgpt.site`.

Cloud Run utiliza una cuenta de servicio exclusiva, Secret Manager para las credenciales y Cloud SQL PostgreSQL mediante Cloud SQL Connector. La instancia se configura con escala mínima de cero para reducir costos cuando no hay solicitudes.
