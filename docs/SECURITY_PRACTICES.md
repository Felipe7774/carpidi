# Prácticas de seguridad y gestión de riesgos — CARPIDI

## 1. Contexto y alcance

CARPIDI es una tienda virtual de ropa y accesorios. Su cliente web utiliza React y Vite, mientras que la API está desarrollada con Spring Boot. La aplicación contempla autenticación con JWT, perfiles de cliente y administrador, catálogo, carrito, pedidos y funciones administrativas.

Este documento separa claramente dos conceptos:

- **Evidencia comprobada:** resultados obtenidos con pruebas ejecutadas.
- **Controles por implementar o verificar:** buenas prácticas recomendadas antes de un despliegue productivo.

No se deben interpretar las recomendaciones como funciones ya implementadas sin una revisión adicional del código y de la configuración desplegada.

## 2. Evidencia técnica disponible

| Evidencia | Resultado |
|---|---|
| Compilación y pruebas del backend | `mvn test` ejecutó 7 pruebas: 0 fallos, 0 errores y 0 omitidas. |
| Empaquetado del backend | `mvn package` finalizó con `BUILD SUCCESS` y generó `backend/target/carpidi-api-0.1.0-SNAPSHOT.jar`. |
| Autenticación de pedidos | La evidencia de validación pública registra una respuesta `401` al consultar pedidos sin JWT. |
| Manejo de errores HTTP | Se registraron respuestas controladas `400` para registro inválido y `404` para producto inexistente. |
| Flujo de compra | La evidencia existente registra checkout exitoso y reducción de inventario en una prueba controlada. |

La matriz de pruebas públicas se encuentra en [evidencia-validacion-2026-09-26.md](evidencia-validacion-2026-09-26.md). No se incluyen contraseñas, tokens, API keys ni secretos en esta documentación.

## 3. Matriz de prácticas de seguridad

| Práctica | Riesgo mitigado | Aplicación para CARPIDI | Evidencia o validación | Prioridad |
|---|---|---|---|---|
| Hash seguro de contraseñas | Exposición de credenciales tras una fuga de datos | Almacenar contraseñas usando BCrypt, Argon2id o PBKDF2 con salt; nunca texto plano | Revisar el `PasswordEncoder`, pruebas unitarias y que la BD no guarde contraseñas legibles | Alta |
| Protección contra fuerza bruta | Intentos masivos de inicio de sesión | Aplicar límite de intentos, pausas progresivas y registro de fallos | Prueba de solicitudes repetidas; verificar que la API responda con limitación controlada | Alta |
| Ciclo de vida de JWT | Reutilización o alteración de tokens | Validar firma y vencimiento; usar tokens de duración corta; definir revocación si el modelo de sesión lo exige | Probar token vencido, alterado y ausente; esperar `401` | Alta |
| Control de acceso por roles | Escalada de privilegios | Autorizar en el backend cada operación de CLIENT y ADMIN; ocultar botones no es una barrera de seguridad | Probar endpoint administrativo con un JWT de cliente; esperar `403` | Alta |
| Validación de entradas | Inyección, corrupción de datos y entradas inesperadas | Validar tipo, longitud, formato y rango en los DTO de Spring Boot | Enviar peticiones inválidas; esperar `400` sin trazas internas | Alta |
| CORS restrictivo | Llamadas desde orígenes no autorizados en navegadores | Permitir explícitamente el frontend de producción, por ejemplo `https://carpidi.vercel.app` | Inspeccionar `Access-Control-Allow-Origin` desde un origen no autorizado | Alta |
| Gestión de secretos | Fuga de JWT secret, credenciales o API keys | Usar variables de entorno o gestor de secretos; excluir `.env` de Git | Buscar secretos en Git y revisar variables de Cloud Run/Vercel | Alta |
| HTTPS y cabeceras | Intercepción, clickjacking y MIME sniffing | Usar HTTPS y definir CSP, HSTS, `X-Content-Type-Options` y protección de framing | Revisar cabeceras con las herramientas del navegador o un analizador HTTP | Alta |
| Errores y auditoría | Divulgación de detalles internos y falta de trazabilidad | Responder mensajes genéricos al cliente; registrar eventos de autenticación y acciones administrativas | Provocar errores controlados y revisar respuestas/logs | Media |
| Dependencias seguras | Vulnerabilidades conocidas en paquetes | Ejecutar `npm audit`, mantener Maven actualizado y activar Dependabot | Revisar alertas de GitHub y reportes de auditoría | Media |
| Pedidos e inventario en servidor | Manipulación de precios, stock o estado del pedido | Calcular totales, validar stock y transiciones de pedido en el backend | Intentar alterar monto o estado desde el cliente; el servidor debe rechazarlo | Alta |
| Datos personales | Acceso indebido a perfiles, direcciones o historial | Minimizar datos almacenados y verificar que cada cliente acceda solo a sus recursos | Pruebas de autorización entre dos usuarios | Alta |

## 4. Prácticas explicadas

### 4.1 Contraseñas y autenticación

Las contraseñas no se cifran para recuperarlas: se almacenan mediante un **hash adaptativo**. OWASP recomienda Argon2id como primera opción, o BCrypt/PBKDF2 cuando el contexto técnico lo requiera. Cada contraseña debe tener un salt único. Además, el inicio de sesión debe resistir ataques automatizados mediante limitación de intentos y registro de eventos fallidos.

Para JWT, el backend debe comprobar siempre la firma, fecha de expiración y los claims necesarios antes de autorizar la solicitud. El frontend no debe ser la única capa que determina si una acción está permitida.

### 4.2 Autorización de CLIENT y ADMIN

El rol `CLIENT` debe estar limitado a su propio perfil, carrito y pedidos. El rol `ADMIN` puede requerir permisos sobre catálogo e inventario. Cada endpoint sensible debe aplicar la regla en Spring Boot; una persona puede manipular la interfaz o hacer llamadas HTTP directas, por lo que ocultar botones no evita una escalada de privilegios.

### 4.3 API, CORS y validación

Todo valor recibido por la API es no confiable hasta ser validado. La API debe rechazar formatos no esperados, tamaños excesivos y valores fuera del rango de negocio. Las respuestas de error deben usar códigos HTTP apropiados y no revelar stack traces.

CORS permite decidir desde qué sitios puede un navegador llamar a la API. Debe configurarse con orígenes específicos de CARPIDI. CORS **no reemplaza** autenticación, autorización ni validación de solicitudes: clientes fuera del navegador pueden enviar peticiones directamente.

### 4.4 Secretos, despliegue y privacidad

Nunca se deben subir claves privadas, tokens, contraseñas de base de datos o API keys a GitHub. Deben suministrarse durante el despliegue mediante variables de entorno configuradas en el proveedor. También se recomienda rotar secretos expuestos y revocar inmediatamente los que hayan sido publicados.

La aplicación debe usar HTTPS y cabeceras que reduzcan riesgos del navegador. Se deben conservar únicamente los datos personales necesarios para prestar el servicio y proteger el acceso a direcciones, pedidos y perfil.

## 5. Checklist antes de producción

- [ ] No hay contraseñas en texto plano ni secretos incluidos en Git.
- [ ] Las variables sensibles se configuraron en Cloud Run/Vercel, no en el código.
- [ ] Todos los JWT vencidos, inválidos o ausentes reciben rechazo controlado.
- [ ] Se probaron rutas administrativas con usuario CLIENT y fueron rechazadas.
- [ ] Los DTO de entrada tienen validaciones de formato, longitud y obligatoriedad.
- [ ] CORS solo permite dominios autorizados de CARPIDI.
- [ ] Las respuestas de error no incluyen stack traces ni información de infraestructura.
- [ ] Los totales, stock y estados de pedido se calculan y validan en el backend.
- [ ] Se ejecutaron `mvn test`, `mvn package` y `npm audit` antes del despliegue.
- [ ] Dependabot o una alternativa equivalente está habilitada y sin alertas críticas pendientes.
- [ ] HTTPS y las cabeceras de seguridad fueron revisadas en producción.

## 6. Fuentes

1. [OWASP Top 10](https://owasp.org/Top10/)
2. [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
3. [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
4. [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
5. [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
6. [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)
7. [NIST SP 800-63B: Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
8. [GitHub Docs: Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts)
