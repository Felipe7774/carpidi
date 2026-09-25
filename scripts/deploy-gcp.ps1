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
  --service-account "carpidi-api-runner@$ProjectId.iam.gserviceaccount.com" `
  --add-cloudsql-instances "$ProjectId`:$Region`:carpidi-db" `
  --port 8080 `
  --set-env-vars "APP_ALLOWED_ORIGINS=https://carpidi-web.carlosgcb74.chatgpt.site,SPRING_DATASOURCE_URL=jdbc:postgresql:///carpidi?cloudSqlInstance=$ProjectId`:$Region`:carpidi-db&socketFactory=com.google.cloud.sql.postgres.SocketFactory" `
  --update-secrets "SPRING_DATASOURCE_USERNAME=DB_USERNAME:latest,SPRING_DATASOURCE_PASSWORD=DB_PASSWORD:latest,APP_JWT_SECRET=JWT_SECRET:latest"

Write-Host "Copia la URL de Cloud Run y úsala en frontend/.env.production como VITE_API_URL=https://URL/api/v1"
