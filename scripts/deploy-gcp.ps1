param(
  [Parameter(Mandatory=$true)][string]$ProjectId,
  [string]$Region = "us-central1",
  [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"
gcloud config set project $ProjectId
gcloud services enable run.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
gcloud builds submit backend --tag "$Region-docker.pkg.dev/$ProjectId/carpidi/api:$ImageTag"
gcloud run deploy carpidi-api `
  --image "$Region-docker.pkg.dev/$ProjectId/carpidi/api:$ImageTag" `
  --region $Region `
  --allow-unauthenticated `
  --port 8080 `
  --set-env-vars "APP_ALLOWED_ORIGINS=https://carpidi-web.carlosgcb74.chatgpt.site"

Write-Host "Copia la URL de Cloud Run y úsala en frontend/.env.production como VITE_API_URL=https://URL/api/v1"
