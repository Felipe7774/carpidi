# Despliegue de CARPIDI en GCP

Esta guía prepara el MVP para Cloud Run y Cloud SQL. Las credenciales se inyectan con Secret Manager; no deben escribirse en Git.

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

## Secretos

Crear cada secreto desde un entorno seguro y conceder `roles/secretmanager.secretAccessor` únicamente a la cuenta de servicio de Cloud Run. No usar valores reales en comandos compartidos, capturas ni commits.

## Servicio Cloud Run

Configurar `SPRING_DATASOURCE_URL`, usuario, contraseña y `JWT_SECRET` mediante referencias a Secret Manager. Ajustar `APP_ALLOWED_ORIGINS` al dominio del frontend. Validar `GET /api/v1/health` y la respuesta `status=UP`.

## Conectar el frontend publicado

Antes de compilar la versión pública, crear `frontend/.env.production` a partir de `frontend/.env.production.example` y asignar la URL real de Cloud Run en `VITE_API_URL`. Después ejecutar `npm run build` dentro de `frontend` y publicar una nueva versión del sitio. No usar `localhost` en producción.

## Evidencia

Guardar en Postman/Bruno la URL pública, pruebas `200` de `/health`, autenticación, catálogo y pedidos, además de un caso `401` sin token. Nunca incluir tokens, contraseñas o claves en las capturas.
