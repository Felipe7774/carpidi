# Conectar CARPIDI a Supabase PostgreSQL

## Alcance

Supabase se usará como PostgreSQL administrado para desarrollo y demostración del MVP. La API Spring Boot conserva Flyway y JPA, por lo que una migración posterior a Cloud SQL solo requerirá cambiar variables de entorno, no el modelo de datos ni el código de negocio.

## Crear el proyecto gratuito

1. Crea una cuenta en [Supabase](https://supabase.com) y un proyecto en el plan Free.
2. Define una contraseña sólida para la base de datos y guárdala en un gestor de contraseñas.
3. En el panel del proyecto, abre **Connect** y copia la conexión PostgreSQL directa. No copies esas credenciales en GitHub, Postman ni capturas de pantalla.
4. Usa la región más próxima a tus usuarios. Para el MVP, la cercanía y el plan gratuito son más importantes que una arquitectura multirregión.

## Variables locales

1. Copia `.env.example` como `.env` en la raíz del proyecto.
2. Reemplaza `<project-ref>` y la contraseña con los valores de Supabase.
3. Para `SUPABASE_DB_JDBC_URL`, usa una URL JDBC con `sslmode=require`.
4. Usa la conexión directa para `SUPABASE_MIGRATION_JDBC_URL`; Flyway necesita una conexión estable para ejecutar las migraciones.

Ejemplo de URL:

```text
jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require
```

## Ejecutar la API

En PowerShell, carga las variables del archivo `.env` en tu sesión o configúralas desde el IDE y arranca el backend con el perfil `supabase`. Al iniciar, Flyway crea o valida el esquema definido en `backend/src/main/resources/db/migration` y Hibernate queda en modo `validate`.

## Seguridad y límites del plan gratuito

- El archivo `.env` está ignorado por Git; confirma con `git status` que no se vaya a publicar.
- Usa contraseñas distintas para Supabase y para usuarios de CARPIDI.
- El pool de conexiones se limita inicialmente a tres conexiones porque el plan gratuito tiene recursos limitados.
- El proyecto gratuito puede pausarse por inactividad. Antes de una demostración, confirma que la base esté activa y que las migraciones estén aplicadas.
- Supabase no reemplaza la autenticación de CARPIDI: Spring Security, JWT, BCrypt y RBAC continúan siendo responsabilidad del backend.

## Migración futura a Cloud SQL

Cuando CARPIDI pase a producción, se conservarán las mismas migraciones Flyway. Solo cambiarán `SPRING_DATASOURCE_URL`, usuario, contraseña, secretos y la red de despliegue hacia Cloud SQL.
