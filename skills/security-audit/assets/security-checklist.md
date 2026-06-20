# Security Audit Checklist

Todas las reglas de auditoría de seguridad condicional. Este archivo es la fuente de verdad para el skill `security-audit`.

Cada regla incluye: ID único, condición lógica evaluable, requerimiento, severidad, patrones de detección y referencia.

**Condiciones disponibles:** `source_files_found`, `has_authentication`, `uses_jwt_tokens`, `is_web_application`, `has_file_upload`, `has_graphql`, `has_llm_agent`, `has_multi_tenant`, `has_unsafe_deserialization`, `environment`, `agent_fetches_external_urls`, `has_multi_agent_system`, `uses_refresh_tokens`, `has_password_storage`, `has_multi_factor_auth`, `sensitivity`, `has_authorization`, `uses_row_level_security`, `has_api`, `has_expensive_operations`, `has_user_generated_html`, `has_user_input`, `has_path_traversal_risk`, `has_encryption`, `has_randomness_requirements`, `has_dependencies`, `has_docker_image`, `has_sensitive_data_processing`, `has_agentic_config_files`, `is_critical_infrastructure`, `has_model_download`, `has_dataset_download`, `uses_rag`, `uses_agentic_tools`, `has_sensitive_business_flows`, `has_third_party_api_consumption`

**Operadores lógicos:** `AND`, `OR`, `NOT`

---

## Grupo 1: Autenticación JWT

### SEC-001: Algoritmo JWT débil o "none"

**Condición:** `uses_jwt_tokens`
**Requerimiento:** Verificar que el algoritmo JWT nunca sea "none" ni un algoritmo simétrico débil (HS256 es aceptable, pero debe estar explícitamente declarado)
**Severidad:** CRITICAL
**Patrones de detección:**
- `alg.*none`
- `"alg":"none"`
- `algorithm.*none`
- `algorithms.*none`
**Referencia:** OWASP JWT Security Cheat Sheet, CWE-327

---

### SEC-002: Secreto JWT hardcodeado en código fuente

**Condición:** `uses_jwt_tokens`
**Requerimiento:** El secreto de firma JWT nunca debe estar en el código fuente; debe leerse desde variables de entorno o un gestor de secretos
**Severidad:** CRITICAL
**Patrones de detección:**
- `jwt.sign\(.*["'][A-Za-z0-9+/=]{8,}["']`
- `jwt.verify\(.*["'][A-Za-z0-9+/=]{8,}["']`
- `secret.*=.*["'][^"']{8,}["']`
- `JWT_SECRET\s*=\s*["'][^"']{4,}["']`
**Referencia:** OWASP Secrets Management Cheat Sheet, CWE-798

---

### SEC-003: Token JWT almacenado en localStorage

**Condición:** `uses_jwt_tokens AND is_web_application`
**Requerimiento:** Los tokens JWT no deben almacenarse en localStorage (vulnerable a XSS); usar httpOnly cookies
**Severidad:** HIGH
**Patrones de detección:**
- `localStorage.setItem.*token`
- `localStorage.setItem.*jwt`
- `localStorage\[.*token`
- `localStorage\.token\s*=`
**Referencia:** OWASP HTML5 Security Cheat Sheet, CWE-922

---

### SEC-004: JWT sin expiración configurada

**Condición:** `uses_jwt_tokens`
**Requerimiento:** Todos los tokens JWT deben tener un tiempo de expiración (campo `expiresIn` o `exp`) para limitar la ventana de ataque en caso de robo
**Severidad:** MEDIUM
**Patrones de detección:**
- `jwt.sign\([^)]*\)` (verificar ausencia de `expiresIn`)
- Presencia de `jwt.sign(` sin `expiresIn:` en el mismo bloque
**Referencia:** RFC 7519 §4.1.4, OWASP JWT Security Cheat Sheet

---

### SEC-005: Uso de jwt.decode() sin verificación de firma

**Condición:** `uses_jwt_tokens`
**Requerimiento:** No usar `jwt.decode()` para obtener datos del token sin verificar la firma; siempre usar `jwt.verify()`
**Severidad:** HIGH
**Patrones de detección:**
- `jwt\.decode\(`
- `jwtDecode\(`
- `base64.*decode.*split.*\.`
**Referencia:** CWE-347, OWASP JWT Security Cheat Sheet

---

## Grupo 2: Cross-Site Scripting (XSS)

### SEC-006: Uso peligroso de innerHTML

**Condición:** `is_web_application`
**Requerimiento:** Evitar asignación directa a `innerHTML` con datos no sanitizados; usar `textContent` o una librería de sanitización
**Severidad:** HIGH
**Patrones de detección:**
- `innerHTML\s*=`
- `\.innerHTML\s*\+=`
- `outerHTML\s*=`
**Referencia:** OWASP XSS Prevention Cheat Sheet, CWE-79

---

### SEC-007: Uso de eval() o new Function()

**Condición:** `is_web_application`
**Requerimiento:** No usar `eval()` ni `new Function()` con datos provenientes del usuario o de fuentes externas
**Severidad:** HIGH
**Patrones de detección:**
- `eval\(`
- `new Function\(`
- `setTimeout\(.*string`
- `setInterval\(.*string`
**Referencia:** OWASP XSS Prevention Cheat Sheet, CWE-95

---

### SEC-008: dangerouslySetInnerHTML o directivas de HTML crudo

**Condición:** `is_web_application`
**Requerimiento:** Evitar el uso de directivas que inyectan HTML crudo sin sanitización previa
**Severidad:** HIGH
**Patrones de detección:**
- `dangerouslySetInnerHTML`
- `v-html\s*=`
- `[innerHTML]=`
- `bypassSecurityTrustHtml`
**Referencia:** React/Vue/Angular Security Docs, CWE-79

---

### SEC-009: document.write() con datos externos

**Condición:** `is_web_application`
**Requerimiento:** No usar `document.write()` con datos de usuario o provenientes de URL/cookies
**Severidad:** MEDIUM
**Patrones de detección:**
- `document\.write\(`
- `document\.writeln\(`
**Referencia:** OWASP XSS Prevention Cheat Sheet, CWE-79

---

### SEC-010: Falta de Content Security Policy (CSP)

**Condición:** `is_web_application`
**Requerimiento:** La aplicación debe configurar un encabezado CSP para mitigar XSS
**Severidad:** MEDIUM
**Patrones de detección:**
- Ausencia de `Content-Security-Policy` en configuración de headers
- Ausencia de `helmet` (Express) o equivalente
- `helmet()` sin parámetros de `contentSecurityPolicy`
**Referencia:** OWASP Content Security Policy Cheat Sheet, CWE-1021

---

## Grupo 3: SQL Injection

### SEC-011: Consultas SQL con concatenación de strings

**Condición:** `source_files_found`
**Requerimiento:** Nunca construir consultas SQL concatenando strings con datos del usuario; usar consultas parametrizadas
**Severidad:** CRITICAL
**Patrones de detección:**
- `"SELECT.*\+.*req\.(body|params|query)`
- `query\(.*\+.*req\.(body|params|query)`
- `execute\(.*f".*{`
- `cursor\.execute\(.*%.*%`
**Referencia:** OWASP SQL Injection Prevention Cheat Sheet, CWE-89

---

### SEC-012: Uso de ORM sin protección contra injection

**Condición:** `source_files_found`
**Requerimiento:** Al usar ORMs (Sequelize, TypeORM, SQLAlchemy), evitar el uso de `where` con strings crudos
**Severidad:** HIGH
**Patrones de detección:**
- `\.where\(.*\+`
- `\.whereRaw\(`
- `\.rawQuery\(`
- `text\s*:.*\+`
**Referencia:** OWASP SQL Injection Prevention Cheat Sheet, CWE-89

---

### SEC-013: Mensajes de error SQL expuestos al cliente

**Condición:** `source_files_found`
**Requerimiento:** No exponer mensajes de error de base de datos en respuestas HTTP; logear internamente y devolver errores genéricos
**Severidad:** MEDIUM
**Patrones de detección:**
- `res\.json\(.*err\.message`
- `res\.send\(.*error\.stack`
- `console\.log\(.*sql.*error`
**Referencia:** OWASP Error Handling Cheat Sheet, CWE-209

---

### SEC-014: NoSQL injection en filtros de consulta

**Condición:** `source_files_found`
**Requerimiento:** Validar que los parámetros de consulta a MongoDB u otras bases NoSQL no contengan operadores maliciosos (`$where`, `$gt`, etc.)
**Severidad:** HIGH
**Patrones de detección:**
- `find\(.*req\.body`
- `findOne\(.*req\.params`
- `filter\(.*req\.query`
**Referencia:** OWASP Injection Prevention Cheat Sheet, CWE-943

---

### SEC-015: Stored procedures con concatenación

**Condición:** `source_files_found`
**Requerimiento:** Los stored procedures no deben construir SQL dinámico con concatenación de parámetros de usuario
**Severidad:** HIGH
**Patrones de detección:**
- `EXEC\s*\(.*\+`
- `sp_executesql.*\+`
- `EXECUTE\s*\(.*\+`
**Referencia:** OWASP SQL Injection Prevention Cheat Sheet, CWE-89

---

## Grupo 4: Cross-Site Request Forgery (CSRF)

### SEC-016: Ausencia de protección CSRF en formularios

**Condición:** `is_web_application AND has_authentication`
**Requerimiento:** Las solicitudes que mutan estado (POST, PUT, DELETE) deben incluir un token CSRF
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de `csrf`, `csurf`, `csrfToken` en rutas POST
- Ausencia de `SameSite` en configuración de cookies
**Referencia:** OWASP CSRF Prevention Cheat Sheet, CWE-352

---

### SEC-017: Cookies sin atributo SameSite

**Condición:** `is_web_application AND has_authentication`
**Requerimiento:** Las cookies de sesión deben incluir el atributo `SameSite=Strict` o `SameSite=Lax`
**Severidad:** MEDIUM
**Patrones de detección:**
- `res\.cookie\(` sin `sameSite`
- `Set-Cookie:` sin `SameSite`
- `cookie.*{` sin `sameSite:`
**Referencia:** OWASP CSRF Prevention Cheat Sheet, CWE-352

---

### SEC-018: Cookies sin atributo HttpOnly

**Condición:** `is_web_application AND has_authentication`
**Requerimiento:** Las cookies de sesión deben incluir el atributo `HttpOnly` para prevenir acceso desde JavaScript
**Severidad:** HIGH
**Patrones de detección:**
- `res\.cookie\(` sin `httpOnly: true`
- `Set-Cookie:` sin `HttpOnly`
**Referencia:** OWASP Session Management Cheat Sheet, CWE-1004

---

### SEC-019: Cookies sin atributo Secure

**Condición:** `is_web_application AND has_authentication`
**Requerimiento:** Las cookies de sesión deben incluir el atributo `Secure` para transmitirse solo por HTTPS
**Severidad:** MEDIUM
**Patrones de detección:**
- `res\.cookie\(` sin `secure: true`
- `Set-Cookie:` sin `Secure`
**Referencia:** OWASP Session Management Cheat Sheet, CWE-614

---

### SEC-020: Origin no validado en solicitudes cross-origin

**Condición:** `is_web_application`
**Requerimiento:** Validar el encabezado `Origin` o `Referer` en endpoints sensibles; configurar CORS correctamente
**Severidad:** MEDIUM
**Patrones de detección:**
- `cors\(\)` sin opciones (permite todos los orígenes)
- `Access-Control-Allow-Origin: \*` en endpoints autenticados
**Referencia:** OWASP CORS Security Cheat Sheet, CWE-346

---

## Grupo 5: Gestión de Secretos

### SEC-021: Credenciales hardcodeadas en código fuente

**Condición:** `source_files_found`
**Requerimiento:** Nunca incluir passwords, API keys, tokens o credenciales de base de datos directamente en el código
**Severidad:** CRITICAL
**Patrones de detección:**
- `password\s*=\s*["'][^"']{4,}["']`
- `api_key\s*=\s*["'][^"']{4,}["']`
- `apiKey\s*=\s*["'][^"']{4,}["']`
- `secret_key\s*=\s*["'][^"']{4,}["']`
- `DB_PASSWORD\s*=\s*["'][^"']{4,}["']`
**Referencia:** OWASP Secrets Management Cheat Sheet, CWE-798

---

### SEC-022: Archivos .env commiteados en el repositorio

**Condición:** `source_files_found`
**Requerimiento:** Los archivos `.env` con valores reales no deben estar en el repositorio; solo `.env.example` con valores vacíos
**Severidad:** HIGH
**Patrones de detección:**
- Presencia de archivo `.env` con valores no vacíos
- `.env.production` en el repositorio
**Referencia:** OWASP Secrets Management Cheat Sheet, CWE-312

---

### SEC-023: Tokens o secrets en comentarios o logs

**Condición:** `source_files_found`
**Requerimiento:** No loguear tokens, passwords ni datos sensibles; los comentarios no deben contener credenciales reales
**Severidad:** HIGH
**Patrones de detección:**
- `console\.log\(.*token`
- `console\.log\(.*password`
- `logger\.debug\(.*secret`
- `print\(.*password`
**Referencia:** OWASP Logging Cheat Sheet, CWE-312

---

### SEC-024: Falta de rotación de secretos

**Condición:** `source_files_found`
**Requerimiento:** Los secretos deben tener mecanismo de rotación; no usar un único secreto estático indefinidamente
**Severidad:** INFO
**Patrones de detección:**
- Ausencia de múltiples versiones de clave o mecanismo de rotación
- Secretos leídos de env vars sin versionado
**Referencia:** OWASP Key Management Cheat Sheet, CWE-321

---

### SEC-025: Secrets en variables de entorno sin validación de presencia

**Condición:** `source_files_found`
**Requerimiento:** Al leer secretos desde `process.env`, validar que no sean `undefined` antes de usarlos en operaciones de seguridad
**Severidad:** MEDIUM
**Patrones de detección:**
- `process\.env\.[A-Z_]+` sin validación posterior
- `os\.getenv\(` sin valor default seguro
**Referencia:** CWE-20, OWASP Input Validation Cheat Sheet

---

## Grupo 6: File Upload

### SEC-026: Ausencia de validación de tipo de archivo

**Condición:** `has_file_upload`
**Requerimiento:** Validar la extensión y el tipo MIME real del archivo (no confiar solo en el nombre del archivo)
**Severidad:** HIGH
**Patrones de detección:**
- `req\.file` sin validación de `mimetype`
- `upload\.single` sin `fileFilter`
- `UploadedFile` sin validación de extensión
**Referencia:** OWASP File Upload Cheat Sheet, CWE-434

---

### SEC-027: Falta de límite de tamaño en uploads

**Condición:** `has_file_upload`
**Requerimiento:** Configurar un límite máximo de tamaño para archivos subidos para prevenir ataques de denegación de servicio
**Severidad:** MEDIUM
**Patrones de detección:**
- `multer(` sin `limits.fileSize`
- `upload` sin configuración de tamaño máximo
**Referencia:** OWASP File Upload Cheat Sheet, CWE-400

---

### SEC-028: Archivos subidos almacenados en directorio web-accessible

**Condición:** `has_file_upload`
**Requerimiento:** Los archivos subidos no deben almacenarse en directorios servidos directamente por el servidor web (usar almacenamiento separado o generar nombres aleatorios)
**Severidad:** HIGH
**Patrones de detección:**
- `dest.*public`
- `destination.*static`
- `path\.join.*__dirname.*uploads`
**Referencia:** OWASP File Upload Cheat Sheet, CWE-434

---

### SEC-029: Path traversal en nombre de archivo subido

**Condición:** `has_file_upload`
**Requerimiento:** Sanitizar el nombre de archivo para prevenir path traversal (`../../../etc/passwd`)
**Severidad:** CRITICAL
**Patrones de detección:**
- `req\.file\.originalname` usado directamente en rutas de archivo
- `filename.*req\.file\.originalname`
- `path\.join.*originalname`
**Referencia:** OWASP Path Traversal, CWE-22

---

### SEC-030: Ejecución de archivos subidos

**Condición:** `has_file_upload`
**Requerimiento:** Nunca ejecutar scripts o archivos subidos por el usuario; rechazar extensiones ejecutables (.php, .sh, .exe, .py si es upload público)
**Severidad:** CRITICAL
**Patrones de detección:**
- `exec.*req\.file`
- `spawn.*req\.file`
- `fileFilter` sin rechazo de extensiones ejecutables
**Referencia:** OWASP File Upload Cheat Sheet, CWE-434

---

## Grupo 7: GraphQL

### SEC-031: Introspección habilitada en producción

**Condición:** `has_graphql`
**Requerimiento:** Deshabilitar la introspección de GraphQL en entornos de producción para no exponer el schema
**Severidad:** MEDIUM
**Patrones de detección:**
- Ausencia de `introspection: false` en configuración de Apollo Server
- `NODE_ENV.*production` sin `introspection: false`
**Referencia:** OWASP GraphQL Cheat Sheet, CWE-200

---

### SEC-032: Falta de límite de profundidad de consultas

**Condición:** `has_graphql`
**Requerimiento:** Limitar la profundidad máxima de consultas GraphQL para prevenir ataques de denegación de servicio
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de `graphql-depth-limit` o equivalente
- Sin `complexityLimit` o `depthLimit`
**Referencia:** OWASP GraphQL Cheat Sheet, CWE-400

---

### SEC-033: Consultas GraphQL sin autenticación en resolvers

**Condición:** `has_graphql AND has_authentication`
**Requerimiento:** Verificar que los resolvers de GraphQL que acceden a datos sensibles validan la autenticación del usuario
**Severidad:** HIGH
**Patrones de detección:**
- `resolver.*{` sin verificación de `context.user`
- `Query.*{` sin `isAuthenticated`
**Referencia:** OWASP GraphQL Cheat Sheet, CWE-862

---

### SEC-034: Falta de rate limiting en endpoint GraphQL

**Condición:** `has_graphql`
**Requerimiento:** Aplicar rate limiting al endpoint GraphQL para prevenir abuso
**Severidad:** MEDIUM
**Patrones de detección:**
- Ausencia de `graphql-rate-limit` o similar
- Sin `rateLimiter` en middleware del endpoint `/graphql`
**Referencia:** OWASP GraphQL Cheat Sheet, CWE-400

---

### SEC-035: Errores GraphQL con stack trace expuesto

**Condición:** `has_graphql`
**Requerimiento:** No exponer stack traces ni información interna en errores GraphQL en producción
**Severidad:** LOW
**Patrones de detección:**
- `formatError.*error\.extensions\.exception`
- `debug: true` en `ApolloServer`
**Referencia:** OWASP Error Handling Cheat Sheet, CWE-209

---

## Grupo 8: LLM Agent Security

### SEC-036: Prompt injection desde input de usuario

**Condición:** `has_llm_agent`
**Requerimiento:** No insertar directamente el input del usuario en el system prompt o en el texto del prompt sin sanitización; usar delimitadores claros
**Severidad:** HIGH
**Patrones de detección:**
- `system_prompt.*\+.*user`
- `messages.*role.*user.*content.*req\.body`
- `prompt.*\+.*userInput`
- `template.*\+.*message`
**Referencia:** OWASP LLM Top 10: LLM01 Prompt Injection

---

### SEC-037: Permisos excesivos en herramientas del agente

**Condición:** `has_llm_agent`
**Requerimiento:** Las herramientas (tools) expuestas al agente LLM deben seguir el principio de mínimo privilegio; no exponer operaciones destructivas sin confirmación explícita
**Severidad:** HIGH
**Patrones de detección:**
- `tools.*delete` sin confirmación
- `tools.*execute` sin sandbox
- `tool_use.*system\s*command`
**Referencia:** OWASP LLM Top 10: LLM06 Excessive Agency

---

### SEC-038: Salida del LLM ejecutada directamente

**Condición:** `has_llm_agent`
**Requerimiento:** Nunca ejecutar directamente el output de un LLM como código; siempre validar y sanitizar antes de usar en operaciones del sistema
**Severidad:** CRITICAL
**Patrones de detección:**
- `eval.*completion`
- `exec.*response\.content`
- `subprocess.*llm.*output`
**Referencia:** OWASP LLM Top 10: LLM02 Insecure Output Handling

---

### SEC-039: API key del LLM expuesta en frontend

**Condición:** `has_llm_agent AND is_web_application`
**Requerimiento:** Las llamadas al API del LLM deben hacerse desde el backend; nunca exponer la API key en código frontend
**Severidad:** CRITICAL
**Patrones de detección:**
- `ANTHROPIC_API_KEY` o `OPENAI_API_KEY` en archivos `.js`, `.ts` del frontend
- `new Anthropic(` en componentes React/Vue/Angular
**Referencia:** OWASP LLM Top 10: LLM09 Misinformation

---

### SEC-040: Falta de límite de tokens o costos en llamadas LLM

**Condición:** `has_llm_agent`
**Requerimiento:** Configurar límites de tokens (`max_tokens`) en todas las llamadas al LLM para prevenir costos descontrolados y ataques de abuso
**Severidad:** MEDIUM
**Patrones de detección:**
- `client\.messages\.create(` sin `max_tokens`
- `openai\.chat\.completions\.create(` sin `max_tokens`
**Referencia:** OWASP LLM Top 10: LLM10 Model Theft, CWE-400

---

### SEC-051: Sanitización contra inyección indirecta de prompts

**Condición:** `has_llm_agent`
**Requerimiento:** Todo contenido de terceros (URLs, issues, correos, PDFs, páginas web) debe ser sanitizado antes de ser insertado en un prompt; no pasar contenido externo crudo al LLM sin validación de esquema o sanitización explícita
**Severidad:** CRITICAL
**Patrones de detección:**
- `fetch\(.*url.*prompt`
- `readFile.*prompt`
- `requests\.get\(` sin llamada a función de sanitización en el mismo bloque
- Ausencia de `DOMPurify`, `sanitize`, `schema\.validate`, `jsonschema` en proyectos que procesan contenido externo antes de enviarlo al LLM
**Referencia:** OWASP LLM Top 10: LLM01 Indirect Prompt Injection, CWE-20

---

### SEC-052: Principio de mínimo privilegio para el proceso agente

**Condición:** `has_llm_agent`
**Requerimiento:** El agente LLM debe operar con privilegios mínimos: sin acceso root, sin credenciales privilegiadas embebidas y sin capacidad de modificar su propio código en tiempo de ejecución
**Severidad:** HIGH
**Patrones de detección:**
- `USER root` en Dockerfile sin instrucción `USER` no-root posterior
- `sudo` en scripts de arranque del agente
- `chmod 777` aplicado a directorios del agente
- `__file__.*write` o `self.*modify` (auto-modificación del código del agente)
**Referencia:** OWASP LLM Top 10: LLM06 Excessive Agency, CWE-250

---

### SEC-053: Verificación de URLs externas con lista blanca

**Condición:** `agent_fetches_external_urls`
**Requerimiento:** Las URLs que el agente descarga deben estar en una lista blanca explícita; si se descargan instrucciones o código, se debe verificar integridad mediante checksums; nunca permitir URLs controladas directamente por el usuario sin validación de dominio
**Severidad:** CRITICAL
**Patrones de detección:**
- `fetch\(.*req\.body`
- `fetch\(.*user`
- `axios\.get\(.*params` sin comprobación de allowlist
- `requests\.get\(.*input` sin validación de dominio
- Ausencia de `allowedDomains`, `whitelist`, `ALLOWED_URLS`, `urlValidator` antes de llamadas HTTP dinámicas
**Referencia:** OWASP LLM Top 10: LLM07 Insecure Plugin Design, CWE-918 (SSRF)

---

### SEC-054: Verificación de identidad en handoffs multi-agente

**Condición:** `has_multi_agent_system`
**Requerimiento:** Los handoffs entre agentes deben incluir verificación explícita de identidad (tokens efímeros o claves API); ningún agente debe confiar ciegamente en mensajes recibidos de otro agente sin autenticar el origen
**Severidad:** HIGH
**Patrones de detección:**
- Llamadas HTTP inter-agente sin encabezado `Authorization:`
- `invoke_agent\(` o `call_agent\(` sin token o clave de verificación en el payload
- Ausencia de `verifyToken`, `validateAgent`, `agentSecret` en rutas de handoff entre agentes
**Referencia:** OWASP LLM Top 10: LLM08 Excessive Trust, CWE-287

---

### SEC-055: Logs de herramientas append-only y centralizados para auditoría

**Condición:** `has_llm_agent`
**Requerimiento:** Los logs de invocación de herramientas del agente deben ser append-only (no sobreescribibles) y centralizarse para auditoría; no se deben poder borrar ni truncar durante la ejecución
**Severidad:** MEDIUM
**Patrones de detección:**
- `fs\.writeFile\(.*log` (sobreescritura de log en lugar de append)
- `open\(.*log.*["\']w["\']` en Python (modo escritura destructivo en log)
- `deleteLog`, `clearLogs`, `truncate.*log`
- Ausencia de `fs\.appendFile` o modo `"a"` en operaciones de log de herramientas del agente
**Referencia:** OWASP Logging Cheat Sheet, CWE-532

---

### SEC-056: Filtrado de caracteres Unicode invisibles (ASCII smuggling)

**Condición:** `has_llm_agent`
**Requerimiento:** Todo texto o contenido visual de terceros (páginas web, documentos, correos, imágenes) debe ser filtrado para detectar y eliminar caracteres Unicode invisibles (bloques Tag U+E0000–U+E007F y Variation Selectors) y textos visualmente camuflados (color de fuente idéntico al fondo, o tamaño de fuente cero) antes de procesarse por el LLM
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de `normalize`, `strip_unicode`, filtrado de caracteres de control antes de pasar contenido externo al LLM
- Strings hardcodeados con caracteres en el rango Unicode Tag (`\uE0`xx) como señal de payload embebido
- Ausencia de `charCodeAt`, `codePointAt`, `unicodedata\.category` en validación de input de terceros
**Referencia:** OWASP LLM Top 10: LLM01 Prompt Injection (variante Unicode), CWE-116

---

## Grupo 9: Multi-Tenant

### SEC-041: Filtrado de tenant no aplicado en consultas de datos

**Condición:** `has_multi_tenant`
**Requerimiento:** Todas las consultas de datos deben incluir el filtro del tenant del usuario autenticado para prevenir acceso cruzado entre tenants
**Severidad:** CRITICAL
**Patrones de detección:**
- `findAll\({` sin `tenantId` o `orgId`
- `SELECT.*FROM` sin `WHERE.*tenant_id`
- Endpoints que no extraen `tenantId` del JWT o sesión
**Referencia:** OWASP Insecure Direct Object Reference, CWE-863

---

### SEC-042: tenant_id tomado del body en lugar del token

**Condición:** `has_multi_tenant`
**Requerimiento:** El `tenant_id` o `org_id` siempre debe extraerse del token de autenticación validado, nunca del body o query string de la solicitud
**Severidad:** CRITICAL
**Patrones de detección:**
- `req\.body\.tenantId`
- `req\.body\.orgId`
- `req\.query\.tenant_id`
**Referencia:** OWASP Insecure Direct Object Reference, CWE-639

---

### SEC-043: Falta de aislamiento en almacenamiento de archivos multi-tenant

**Condición:** `has_multi_tenant AND has_file_upload`
**Requerimiento:** Los archivos de cada tenant deben almacenarse en rutas o buckets separados con acceso estrictamente controlado
**Severidad:** HIGH
**Patrones de detección:**
- Rutas de almacenamiento sin `tenantId` en la ruta
- `path\.join.*upload` sin tenant en la ruta
**Referencia:** CWE-284, OWASP Access Control Cheat Sheet

---

### SEC-044: Logs sin segregación de tenant

**Condición:** `has_multi_tenant`
**Requerimiento:** Los logs deben incluir el tenant_id para facilitar auditoría y detectar accesos cruzados; pero no mezclar datos de diferentes tenants en un solo log accesible
**Severidad:** LOW
**Patrones de detección:**
- `logger\.info(` sin `tenantId` en los logs de operaciones de datos
**Referencia:** OWASP Logging Cheat Sheet, CWE-532

---

### SEC-045: APIs de administración sin verificación de tenant admin

**Condición:** `has_multi_tenant AND has_authentication`
**Requerimiento:** Las operaciones administrativas deben verificar que el usuario tiene rol de administrador del tenant correcto, no solo estar autenticado
**Severidad:** HIGH
**Patrones de detección:**
- `req\.user\.role.*admin` sin verificación de `tenantId`
- `isAdmin` sin comprobación de tenant
**Referencia:** OWASP Access Control Cheat Sheet, CWE-285

---

## Grupo 10: Deserialización Insegura

### SEC-046: pickle.loads() con datos no confiables

**Condición:** `has_unsafe_deserialization`
**Requerimiento:** `pickle.loads()` en Python nunca debe usarse con datos provenientes de usuarios o fuentes externas; puede ejecutar código arbitrario
**Severidad:** CRITICAL
**Patrones de detección:**
- `pickle\.loads\(`
- `cPickle\.loads\(`
- `pickle\.load\(.*req`
**Referencia:** OWASP Deserialization Cheat Sheet, CWE-502

---

### SEC-047: yaml.load() sin Loader seguro

**Condición:** `has_unsafe_deserialization`
**Requerimiento:** Usar `yaml.safe_load()` en lugar de `yaml.load()` para prevenir ejecución de código mediante YAML malicioso
**Severidad:** HIGH
**Patrones de detección:**
- `yaml\.load\(`
- `YAML\.load\(`
**Referencia:** PyYAML Security, CWE-502

---

### SEC-048: Java ObjectInputStream con datos externos

**Condición:** `has_unsafe_deserialization`
**Requerimiento:** `ObjectInputStream` en Java no debe deserializar datos provenientes de fuentes externas sin validación de la clase y librería de deserialización segura
**Severidad:** CRITICAL
**Patrones de detección:**
- `new ObjectInputStream\(`
- `readObject\(\)`
**Referencia:** OWASP Deserialization Cheat Sheet, CWE-502

---

### SEC-049: Node.js serialize/deserialize con datos de usuario

**Condición:** `has_unsafe_deserialization`
**Requerimiento:** No usar librerías como `node-serialize` o `serialize-javascript` con datos de usuario; son vulnerables a ejecución remota de código
**Severidad:** CRITICAL
**Patrones de detección:**
- `serialize\.deserialize\(`
- `node-serialize`
- `unserialize\(`
**Referencia:** CWE-502, CVE-2017-5941

---

### SEC-050: Deserialización de XML con XXE habilitado

**Condición:** `has_unsafe_deserialization`
**Requerimiento:** Los parsers XML deben deshabilitar la resolución de entidades externas (XXE) para prevenir lectura de archivos locales o SSRF
**Severidad:** HIGH
**Patrones de detección:**
- `DOMParser`
- `XMLReader`
- `libxml2` sin `LIBXML_NOENT`
- Ausencia de `FEATURE_EXTERNAL_GENERAL_ENTITIES = false`
**Referencia:** OWASP XXE Prevention Cheat Sheet, CWE-611

---

## Grupo 11: Autenticación y Gestión de Sesiones

### SEC-057: Rotación de refresh tokens

**Condición:** `uses_refresh_tokens`
**Requerimiento:** Los refresh tokens deben rotar en cada uso: el token anterior debe invalidarse y emitirse uno nuevo; nunca reutilizar el mismo refresh token indefinidamente
**Severidad:** HIGH
**Patrones de detección:**
- `refreshToken` almacenado y reutilizado sin invalidación del anterior
- Ausencia de `revokeToken(`, `deleteRefreshToken(`, `invalidateToken(` después de emitir un nuevo refresh token
- `jwt.sign(.*refreshToken` sin llamada de revocación previa
**Referencia:** OWASP Session Management Cheat Sheet, CWE-613

---

### SEC-058: Almacenamiento seguro de contraseñas (bcrypt/Argon2)

**Condición:** `has_password_storage`
**Requerimiento:** Las contraseñas deben almacenarse con bcrypt (cost >= 10) o Argon2; nunca con MD5, SHA-1 ni SHA-256 sin salt
**Severidad:** CRITICAL
**Patrones de detección:**
- `md5(.*password`
- `sha1(.*password`
- `sha256(.*password` sin salt explícito
- `createHash\(.*password`
- Ausencia de `bcrypt\.hash\(`, `bcrypt\.hashpw\(`, `argon2\.hash\(`, `Argon2PasswordEncoder` cuando se almacenan contraseñas
**Referencia:** OWASP Password Storage Cheat Sheet, CWE-916

---

### SEC-059: Recomendación de MFA para proyectos con autenticación

**Condición:** `has_authentication AND NOT has_multi_factor_auth`
**Requerimiento:** Los proyectos con autenticación deben considerar implementar autenticación multifactor (MFA/2FA); su ausencia es un hallazgo informativo que debe evaluarse según la sensibilidad del proyecto
**Severidad:** MEDIUM
**Patrones de detección:**
- Ausencia de dependencias MFA en proyectos con autenticación: no hay `speakeasy`, `otplib`, `pyotp`, `google-authenticator`, `authenticator`
- Ausencia de patrones: `totp`, `otp`, `two_factor`, `2fa`, `mfa`, `authenticator`
**Referencia:** OWASP MFA Cheat Sheet, NIST SP 800-63B

---

## Grupo 12: Autorización y Control de Acceso

### SEC-060: Verificación de permisos por endpoint

**Condición:** `has_authorization`
**Requerimiento:** Cada endpoint o función sensible debe verificar explícitamente los permisos del usuario (basados en rol o recurso); no asumir que la autenticación implica autorización
**Severidad:** CRITICAL
**Patrones de detección:**
- Rutas o handlers definidos sin middleware de autorización (`checkPermission`, `authorize`, `can(`, `@PreAuthorize`, `[Authorize]`, `@Roles`)
- Endpoints de mutación (POST, PUT, DELETE) sin verificación de permisos explícita
- Ausencia de `ability\.can\(`, `permission\.check\(`, `acl\.isAllowed\(` en operaciones sobre recursos
**Referencia:** OWASP Authorization Cheat Sheet, CWE-862

---

### SEC-061: Row Level Security (RLS) correctamente configurado

**Condición:** `uses_row_level_security`
**Requerimiento:** Las políticas de Row Level Security deben estar habilitadas y correctamente definidas en todas las tablas que contienen datos de usuario; no basta con habilitar RLS sin políticas
**Severidad:** HIGH
**Patrones de detección:**
- `ENABLE ROW LEVEL SECURITY` en tabla sin `CREATE POLICY` correspondiente
- `createPolicy\(` sin cláusula `USING \(`
- Consultas Supabase `.from\(` sin `.eq\('user_id', user\.id\)` u otro filtro de usuario
**Referencia:** OWASP Access Control Cheat Sheet, CWE-284

---

### SEC-062: Prevención de IDOR en APIs multi-tenant

**Condición:** `has_api AND has_multi_tenant`
**Requerimiento:** Los endpoints que reciben IDs de recursos deben verificar que el recurso pertenece al tenant/usuario autenticado antes de operar sobre él; nunca asumir que un ID válido implica acceso autorizado
**Severidad:** CRITICAL
**Patrones de detección:**
- `findById\(req\.params\.id\)` sin verificación de ownership o tenantId
- `getById\(req\.params\.id\)` sin comprobación de `where.*tenantId`
- `DELETE.*params\.id` sin filtro de tenant en la query
- `update.*params\.id` sin verificación de que el recurso pertenece al usuario autenticado
**Referencia:** OWASP Insecure Direct Object Reference, CWE-639

---

## Grupo 13: APIs y Comunicaciones

### SEC-063: Inyección de comandos del sistema (OS Command Injection)

**Condición:** `has_api`
**Requerimiento:** Nunca construir comandos del sistema concatenando datos del usuario; usar APIs nativas del lenguaje o librerías parametrizadas; si es imprescindible usar shell, validar con lista blanca estricta
**Severidad:** CRITICAL
**Patrones de detección:**
- `exec\(.*req\.`
- `spawn\(.*req\.`
- `execSync\(.*req\.`
- `subprocess\.run\(.*request\.`
- `os\.system\(.*user`
- `child_process.*req\.body`
**Referencia:** OWASP OS Command Injection Defense Cheat Sheet, CWE-78

---

### SEC-064: Rate limiting en endpoints REST

**Condición:** `has_api`
**Requerimiento:** Los endpoints públicos de la API deben tener rate limiting configurado para prevenir abuso y ataques de fuerza bruta
**Severidad:** HIGH
**Patrones de detección:**
- Rutas express/fastapi/rails sin `rateLimit`, `throttle`, `limiter` en su middleware
- Ausencia de `express-rate-limit`, `django-ratelimit`, `slowapi`, `rack-attack`, `flask-limiter` en dependencias del proyecto con API
- Ausencia de configuración de rate limiting en archivos de gateway o nginx/caddy
**Referencia:** OWASP API Security Top 10: API4 Lack of Resources and Rate Limiting, CWE-400

---

### SEC-065: Rate limiting específico para operaciones costosas

**Condición:** `has_expensive_operations`
**Requerimiento:** Los endpoints de búsqueda, generación de reportes, exportación masiva y operaciones bulk deben tener límites más restrictivos que los endpoints genéricos
**Severidad:** MEDIUM
**Patrones de detección:**
- Rutas con keywords `search`, `report`, `export`, `bulk`, `aggregate` sin rate limiting específico diferenciado
- Ausencia de límites separados por tipo de operación (ej. 10 req/min para búsqueda vs 100 req/min general)
**Referencia:** OWASP API Security Top 10: API4, CWE-400

---

## Grupo 14: Seguridad Web — Headers y Transporte

### SEC-066: Forzar HTTPS y configurar HSTS

**Condición:** `is_web_application AND environment == "production"`
**Requerimiento:** La aplicación debe forzar HTTPS (redirigir HTTP a HTTPS) y configurar el encabezado Strict-Transport-Security con `max-age >= 31536000` e `includeSubDomains`
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de `Strict-Transport-Security` o `hsts` en configuración de headers
- `http://` hardcodeado en URLs de producción o archivos de configuración
- Ausencia de redirección HTTP→HTTPS en configuración del servidor (nginx, express, caddy)
- `helmet\(\)` sin `hsts:` configurado
**Referencia:** OWASP Transport Layer Security Cheat Sheet, CWE-319

---

### SEC-067: Headers X-Frame-Options y X-Content-Type-Options

**Condición:** `is_web_application`
**Requerimiento:** La aplicación debe configurar los encabezados `X-Frame-Options: DENY` (o `SAMEORIGIN`) y `X-Content-Type-Options: nosniff` para prevenir clickjacking y MIME sniffing
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de `X-Frame-Options` en configuración de headers o middleware
- Ausencia de `X-Content-Type-Options` o `noSniff`
- `helmet\(\)` sin las opciones `frameguard` y `noSniff` activadas
- `helmet\.frameguard\(\)` con `action: "allow-from"` y wildcard de origen
**Referencia:** OWASP Clickjacking Defense Cheat Sheet, CWE-693

---

### SEC-068: Sanitización de HTML generado por usuarios con DOMPurify

**Condición:** `has_user_generated_html`
**Requerimiento:** El HTML generado o editado por usuarios debe ser sanitizado con DOMPurify (o equivalente) antes de renderizarse; la ausencia de sanitización permite XSS persistente
**Severidad:** HIGH
**Patrones de detección:**
- `dangerouslySetInnerHTML=\{\{__html: userContent\}\}` sin llamada a `DOMPurify\.sanitize\(`
- `innerHTML\s*=\s*userHtml` sin sanitización previa
- `v-html="userContent"` sin sanitización en Vue
- Ausencia de `dompurify`, `sanitize-html`, `bleach` en deps cuando hay editores ricos (quill, tiptap, ckeditor)
**Referencia:** OWASP XSS Prevention Cheat Sheet, CWE-79

---

## Grupo 15: Validación de Entradas

### SEC-069: Uso de esquemas de validación (Zod, Joi, Yup, Pydantic)

**Condición:** `has_user_input`
**Requerimiento:** Todo input de usuario (body, query params, path params, headers) debe validarse con esquemas declarativos (Zod, Joi, Yup, Pydantic, class-validator); no acceder a propiedades del request sin validación previa
**Severidad:** HIGH
**Patrones de detección:**
- `req\.body\.` accedido directamente sin schema de validación en el mismo handler
- `request\.form\[` o `request\.json\[` sin validación Pydantic o Marshmallow
- Ausencia de `zod`, `joi`, `yup`, `pydantic`, `class-validator`, `marshmallow` en deps cuando hay endpoints con body
**Referencia:** OWASP Input Validation Cheat Sheet, CWE-20

---

### SEC-070: Validación por lista blanca (whitelist) en lugar de lista negra

**Condición:** `has_user_input`
**Requerimiento:** La validación de input debe permitir solo lo esperado (lista blanca) en lugar de rechazar patrones conocidos (lista negra); la lista negra es incompleta por definición
**Severidad:** MEDIUM
**Patrones de detección:**
- `replace\(/<script/` como única sanitización de input
- `!/[<>'"]/\.test\(` como validación principal (lista negra de caracteres)
- `blacklist\(`, `blocklist\(` aplicados a input sin schema de lista blanca complementario
- Patrones de sanitización por eliminación sin validación de tipo o formato
**Referencia:** OWASP Input Validation Cheat Sheet, CWE-184

---

### SEC-071: Path traversal en endpoints con rutas de archivo

**Condición:** `has_path_traversal_risk`
**Requerimiento:** Los endpoints que reciben rutas o nombres de archivo del usuario deben sanitizarlos y validarlos contra una lista blanca de directorios accesibles; nunca usar la ruta del usuario directamente en operaciones de archivo
**Severidad:** HIGH
**Patrones de detección:**
- `path\.join\(.*req\.params`
- `path\.join\(.*req\.query`
- `readFile\(.*params`
- `os\.path\.join\(.*request\.`
- Uso de ruta de usuario sin `path\.resolve\(` seguido de verificación de directorio base permitido
**Referencia:** OWASP Path Traversal, CWE-22

---

## Grupo 16: Criptografía

### SEC-072: No implementar criptografía casera

**Condición:** `has_encryption`
**Requerimiento:** Nunca implementar algoritmos criptográficos desde cero ni usar algoritmos obsoletos; usar únicamente librerías estándar y auditadas con algoritmos modernos (AES-256-GCM, ChaCha20-Poly1305, RSA-OAEP)
**Severidad:** CRITICAL
**Patrones de detección:**
- `DES`, `RC4`, `Blowfish` usados para cifrado de datos sensibles
- `crypto\.createCipher\(` (deprecated, sin IV) en lugar de `createCipheriv(`
- Implementación manual de XOR para cifrado: `charCodeAt.*\^`
- `Math\.random\(` usado para generar claves criptográficas
**Referencia:** OWASP Cryptographic Failures, CWE-327

---

### SEC-073: Generación de números aleatorios criptográficamente seguros (CSPRNG)

**Condición:** `has_randomness_requirements`
**Requerimiento:** Los tokens de sesión, códigos de verificación, nonces, IDs de reset de contraseña y cualquier valor de seguridad deben generarse con un CSPRNG; nunca usar `Math.random()` o equivalentes no seguros
**Severidad:** HIGH
**Patrones de detección:**
- `Math\.random\(` en contexto de generación de tokens, IDs de sesión, códigos OTP o nonces
- `random\.random\(` en Python para valores de seguridad
- `rand\(\)` en PHP para tokens o códigos de verificación
- Ausencia de `crypto\.randomBytes\(`, `secrets\.token_hex\(`, `java\.security\.SecureRandom` cuando se generan valores de seguridad
**Referencia:** OWASP Cryptographic Failures, CWE-338

---

## Grupo 17: Dependencias y Cadena de Suministro

### SEC-074: Auditoría automática de dependencias en CI/CD

**Condición:** `has_dependencies`
**Requerimiento:** El pipeline de CI/CD debe ejecutar auditoría automática de vulnerabilidades en dependencias y fallar si existen vulnerabilidades críticas o altas sin parche conocido
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de `npm audit`, `pip-audit`, `cargo audit`, `govulncheck`, `trivy fs` en archivos de CI (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`)
- Ausencia de `snyk test`, `dependabot` o similar en configuración del repositorio
**Referencia:** OWASP Software Component Verification Standard, CWE-1035

---

### SEC-075: Lockfiles de dependencias versionados en el repositorio

**Condición:** `has_dependencies`
**Requerimiento:** Los archivos lockfile deben estar presentes y versionados en el repositorio para garantizar builds reproducibles y detectar cambios no autorizados en dependencias
**Severidad:** MEDIUM
**Patrones de detección:**
- `package-lock\.json` o `yarn\.lock` o `pnpm-lock\.yaml` listados en `.gitignore`
- `poetry\.lock` o `Cargo\.lock` ausentes del repositorio cuando hay `pyproject.toml` o `Cargo.toml`
- `Gemfile\.lock` ausente cuando hay `Gemfile`
**Referencia:** OWASP Dependency Management Cheat Sheet, CWE-1104

---

### SEC-076: Escaneo de vulnerabilidades en imágenes Docker

**Condición:** `has_docker_image`
**Requerimiento:** Las imágenes Docker deben escanearse con herramientas como Trivy o Grype en CI/CD; no usar tags `latest` en imágenes base (no reproducible y puede incluir versiones vulnerables)
**Severidad:** HIGH
**Patrones de detección:**
- `FROM.*:latest` en Dockerfile
- Ausencia de `trivy image`, `grype`, `docker scan` en archivos de CI
- Imagen base sin tag de versión específica (`FROM ubuntu` sin versión)
**Referencia:** OWASP Container Security Cheat Sheet, CWE-1104

---

## Grupo 18: Logging y Monitoreo

### SEC-077: Redacción de datos sensibles (PII) en logs

**Condición:** `has_sensitive_data_processing`
**Requerimiento:** Los logs no deben contener información sensible (PII, credenciales, datos de pago); se debe aplicar redacción automática antes de escribir en cualquier sistema de logging
**Severidad:** HIGH
**Patrones de detección:**
- `console\.log\(.*email`
- `log\(.*ssn`
- `log\(.*credit_card`
- `console\.log\(.*user\.password`
- `logger\.info\(.*dob`
- Ausencia de filtros de redacción en configuración de morgan, winston, structlog, loguru
**Referencia:** OWASP Logging Cheat Sheet, GDPR Art. 5, CWE-532

---

### SEC-078: Mensajes de error genéricos en producción (sin stack traces)

**Condición:** `environment == "production"`
**Requerimiento:** Los errores enviados al cliente en producción deben ser genéricos; los detalles internos (stack traces, mensajes de excepción, nombres de tablas) solo deben enviarse a logs del servidor
**Severidad:** MEDIUM
**Patrones de detección:**
- `res\.send\(err\.stack`
- `res\.json\(.*stack:`
- `return JsonResponse\(\{"error": str\(e\)\}`
- `DEBUG\s*=\s*True` en settings de producción Django o Flask
- `app\.set\('env', 'development'\)` en entorno de producción Express
**Referencia:** OWASP Error Handling Cheat Sheet, CWE-209

---

## Grupo 19: Configuración y Gobernanza

### SEC-079: Escaneo de archivos de configuración de agentes por comandos peligrosos

**Condición:** `has_llm_agent AND has_agentic_config_files`
**Requerimiento:** Los archivos de configuración de agentes (SKILL.md, .agent.md, .agent.yaml) no deben contener comandos del sistema peligrosos, exfiltración de datos ni ejecución remota de código
**Severidad:** HIGH
**Patrones de detección:**
- `rm -rf` en archivos `.agent.md`, `SKILL.md` o `.agent.yaml`
- `curl.*\|.*bash` o `wget.*\|.*sh` en instrucciones de skills o agentes
- `base64 -d` en instrucciones seguido de ejecución (`| sh`, `> file`)
- URLs de exfiltración en instrucciones: `curl.*attacker\.com`, comandos que envían datos a dominios externos
**Referencia:** OWASP LLM Top 10: LLM07 Insecure Plugin Design

---

### SEC-080: Política de control de acceso documentada como código

**Condición:** `has_multi_tenant OR has_authorization`
**Requerimiento:** Los proyectos con multi-tenancy o RBAC deben tener su política de control de acceso documentada como código (en archivos de roles, permisos o políticas versionables) para garantizar auditoría y reproducibilidad
**Severidad:** MEDIUM
**Patrones de detección:**
- Ausencia de archivos `permissions\.ts`, `roles\.ts`, `access-control\.ts`, directorio `policies/`, `abilities/`
- Ausencia de librerías de políticas: `casl`, `casbin`, `oso`, `accesscontrol`, `node-acl` en deps cuando el proyecto tiene RBAC o multi-tenant
**Referencia:** OWASP Access Control Cheat Sheet, CWE-285

---

### SEC-081: Análisis explícito contra OWASP Top 10 documentado

**Condición:** `is_critical_infrastructure`
**Requerimiento:** Los proyectos de infraestructura crítica deben tener documentado un análisis explícito de mitigación del OWASP Top 10 actualizado
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de `SECURITY.md`, `security-review.md`, `threat-model.md` en el repositorio
- Ausencia de referencia a `OWASP Top 10` en documentación del proyecto
- Ausencia de política de divulgación responsable de vulnerabilidades
**Referencia:** OWASP Top 10:2021

---

## Grupo 20: Supply Chain de IA (OWASP LLM03)

### SEC-082: Ausencia de SBOM/ML-BOM para componentes de IA

**Condición:** `has_llm_agent`
**Requerimiento:** Debe existir un inventario (SBOM/ML-BOM) que catalogue modelos, adaptadores (LoRA/PEFT), datasets y dependencias de IA, incluyendo proveedor, versión y origen. Sin este inventario no es posible auditar la cadena de suministro del sistema de IA.
**Severidad:** MEDIUM
**Patrones de detección:**
- Ausencia de archivos como `ML-BOM.json`, `model_inventory.yaml` o sección de IA en SBOM existente
- Ausencia de referencias a modelos base con versión y hash fijos en el repositorio
- Ausencia de herramientas como `cyclonedx`, `syft`, `spdx` en dependencias o CI/CD
**Referencia:** OWASP LLM03:2025

---

### SEC-083: Verificación de integridad de modelos y datasets descargados

**Condición:** `has_llm_agent AND (has_model_download OR has_dataset_download)`
**Requerimiento:** Todo modelo o dataset descargado de fuente externa debe tener verificación de integridad mediante checksums (SHA-256) o firmas digitales contra valores conocidos publicados por el proveedor. La ausencia de verificación permite ataques de sustitución de modelos.
**Severidad:** HIGH
**Patrones de detección:**
- `huggingface_hub.snapshot_download(` sin parámetro `local_files_only` o sin verificación posterior de hash
- `wget` o `curl` descargando modelos sin llamada a `sha256sum` o función de verificación
- `torch.load(` o `safetensors.load_file(` sobre archivos descargados sin validación de hash previo
- Ausencia de `hashlib.sha256`, `xxhash`, `sha256sum` en scripts de descarga de modelos/datasets
**Referencia:** OWASP LLM03:2025, CWE-494

---

## Grupo 21: Envenenamiento de Datos y Modelos (OWASP LLM04)

### SEC-084: Falta de controles de integridad en canales de RAG

**Condición:** `has_llm_agent AND uses_rag`
**Requerimiento:** El contenido ingerido en la base de conocimiento RAG debe tener verificación de origen (fuentes permitidas por lista blanca) y detección de contenido malicioso antes de ser vectorizado. El envenenamiento del corpus RAG puede desviar permanentemente las respuestas del sistema.
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de sanitización o prefiltrado en el pipeline de ingestión RAG antes de llamar al embedder
- `embed_documents(` o `add_texts(` recibiendo contenido externo sin validación de esquema ni sanitización
- Ingestión de URLs arbitrarias sin lista blanca de dominios permitidos (`ALLOWED_SOURCES`, `allowedDomains`)
- Ausencia de hash o firma de los documentos almacenados en el vector store (sin posibilidad de detectar alteraciones)
**Referencia:** OWASP LLM04:2025, OWASP LLM08:2025

---

## Grupo 22: Filtración de System Prompts (OWASP LLM07)

### SEC-085: System prompts tratados como secretos sensibles

**Condición:** `has_llm_agent`
**Requerimiento:** Los system prompts NO deben contener secretos (API keys, contraseñas), lógica de autorización crítica, ni instrucciones de seguridad que dependan de su confidencialidad. Aplicar el principio de que "el system prompt eventualmente se filtrará": diseñar la seguridad sin asumir que el prompt permanece secreto.
**Severidad:** HIGH
**Patrones de detección:**
- Búsqueda de patrones de secretos dentro de strings asignados a `system_prompt`, `system:`, `role: "system"`: `password`, `api_key`, `token`, `secret`, `sk-`, `Bearer `
- System prompt que contiene lógica de autorización como única barrera: `"only respond if the user is admin"` sin verificación en capa de aplicación
- `SYSTEM_PROMPT` leído desde variable de entorno y enviado directamente al LLM sin depuración de secretos
**Referencia:** OWASP LLM07:2025

---

### SEC-086: Ausencia de detección de intentos de extracción de system prompt

**Condición:** `has_llm_agent`
**Requerimiento:** Implementar monitorización y logging de patrones conocidos de extracción de system prompts (jailbreak, prompt leaking) para generar alertas y bloquear abusos. La ausencia de detección impide responder a ataques activos.
**Severidad:** MEDIUM
**Patrones de detección:**
- Ausencia de logging del input de usuario en interacciones con el LLM (sin trazabilidad de intentos)
- Ausencia de filtrado o alerta ante frases características: `"ignore previous instructions"`, `"repeat your system prompt"`, `"what were you told"`, `"translate your instructions"` en el input antes de enviarlo al LLM
- Ausencia de un sistema de monitoreo (middleware, interceptor) que analice patrones de jailbreak en requests al LLM
**Referencia:** OWASP LLM07:2025

---

## Grupo 23: Debilidades en Embeddings y Vectores (OWASP LLM08)

### SEC-087: Ausencia de segregación multi-tenant en vector stores

**Condición:** `has_llm_agent AND uses_rag AND has_multi_tenant`
**Requerimiento:** Los tenants deben tener namespaces, colecciones o índices separados en el vector store para prevenir fugas de información entre tenants. Una consulta de un tenant no debe poder recuperar embeddings de otro tenant bajo ninguna circunstancia.
**Severidad:** CRITICAL
**Patrones de detección:**
- Consultas al vector store sin filtro explícito por `tenant_id`, `namespace` o `collection` del tenant autenticado
- `similarity_search(` o `query(` sin parámetro de filtro de tenant
- Ausencia de `namespace=tenant_id`, `filter={"tenant_id": ...}`, `collection_name=tenant_id` en llamadas al vector store
- Uso de un único índice/colección global sin particionamiento por tenant (ej. un solo índice Pinecone para todos los tenants)
**Referencia:** OWASP LLM08:2025

---

## Grupo 24: Misinformation y Alucinaciones (OWASP LLM09)

### SEC-088: Ausencia de verificación factual en outputs críticos de LLM

**Condición:** `has_llm_agent AND (sensitivity == "high" OR uses_agentic_tools)`
**Requerimiento:** En sistemas con sensibilidad alta o con herramientas agénticas, implementar verificación de outputs del LLM contra fuentes autorizadas o requerir aprobación humana ("human-in-the-loop") antes de ejecutar acciones basadas en información no verificable generada por el LLM. Las alucinaciones no detectadas pueden desencadenar acciones irreversibles.
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de groundedness checks o verificación de citas antes de usar el output del LLM como input de una herramienta o acción
- Ejecución directa de `tool_call` o `function_call` propuesto por el LLM sin confirmación humana en flujos de alto impacto
- Ausencia de patrones de aprobación: `human_approval`, `confirm_action`, `review_step`, `hitl` en pipelines agénticos con acciones destructivas o financieras
- Ausencia de referencias (`citations`, `sources`, `grounding`) en respuestas del LLM sobre datos factuales críticos
**Referencia:** OWASP LLM09:2025

---

## Grupo 25: Consumo Sin Límites (OWASP LLM10)

### SEC-089: Ausencia de límites de costo y cuota por usuario/sesión en llamadas LLM

**Condición:** `has_llm_agent`
**Requerimiento:** Configurar límites de costo diario/mensual por usuario o sesión, límites de requests por intervalo de tiempo (complementario a `max_tokens` por request cubierto en SEC-040), y alertas de gasto anómalo para prevenir ataques de "denial-of-wallet" y extracción masiva del modelo. Un único `max_tokens` por request no es suficiente si no hay límites de volumen acumulado.
**Severidad:** HIGH
**Patrones de detección:**
- Ausencia de seguimiento de costo acumulado por usuario/sesión/día en sistemas con múltiples usuarios
- Ausencia de límites de requests por minuto/hora específicos para endpoints LLM (SEC-040 cubre tokens, este cubre requests/costo)
- Ausencia de alertas de gasto: no hay integración con presupuestos de proveedor (AWS Budgets, GCP Billing Alerts, Anthropic spend limits)
- Ausencia de `user_quota`, `cost_limit`, `budget_limit`, `spend_limit` en lógica de control de acceso al LLM
- Ausencia de circuit breaker o kill switch para detener llamadas LLM ante gasto anómalo
**Referencia:** OWASP LLM10:2025, CWE-400

---

## Grupo 26: BOLA General — Autorización a Nivel de Objeto (OWASP API1:2023)

### SEC-090: BOLA en APIs autenticadas sin verificación de ownership

**Condición:** `has_api AND has_authentication AND NOT has_multi_tenant`
**Requerimiento:** Cada endpoint que accede a un recurso por ID debe verificar que el recurso pertenece al usuario autenticado antes de devolverlo o modificarlo. Un ID válido no implica autorización de acceso. Esta regla complementa SEC-062 (que aplica solo a proyectos multi-tenant).
**Severidad:** CRITICAL
**Patrones de detección:**
- `findById(req.params.id)` sin filtro posterior de `userId`, `ownerId`, `createdBy` o equivalente
- `getById(params.id)` sin cláusula `where: { id, userId: req.user.id }`
- `Model.findOne({ id })` sin incluir el `userId` del usuario autenticado en el filtro
- Respuestas de GET/PUT/DELETE que no verifican `resource.userId === req.user.id` antes de operar
**Referencia:** OWASP API1:2023, CWE-639

---

## Grupo 27: Autorización Rota a Nivel de Propiedad (OWASP API3:2023)

### SEC-091: Mass assignment — escritura de propiedades no autorizadas

**Condición:** `has_api`
**Requerimiento:** Los endpoints de creación y actualización nunca deben aceptar el body completo del request como datos de un modelo; se debe aplicar una lista blanca de campos permitidos (pick/allowlist) para evitar que el usuario escriba campos privilegiados como `role`, `isAdmin`, `balance`, `verifiedAt`.
**Severidad:** HIGH
**Patrones de detección:**
- `Object.assign(record, req.body)` sin filtrado previo de campos
- `Model.update(req.body)` o `model.save(req.body)` sin pick/omit de campos permitidos
- `entity = { ...req.body }` sin lista blanca explícita de propiedades aceptadas
- Ausencia de DTOs de escritura (clases con decoradores de validación como `@IsString`, `@IsEmail`) en frameworks que los soportan (NestJS, Spring, Django REST Framework)
- Ausencia de librerías de filtrado (`lodash.pick`, `_.omit`, `allow`, `permit`) antes de persistir datos del usuario
**Referencia:** OWASP API3:2023, CWE-915

---

### SEC-092: Exposición excesiva de datos en respuestas de API

**Condición:** `has_api`
**Requerimiento:** Los endpoints deben devolver únicamente los campos necesarios para el caso de uso; no serializar objetos completos del modelo. Campos como `password`, `hash`, `salt`, `internalNotes`, `adminFlags`, `rawToken` no deben aparecer en ninguna respuesta de API pública.
**Severidad:** HIGH
**Patrones de detección:**
- `res.json(user)` o `res.json(await Model.findById(id))` devolviendo el objeto completo sin serialización selectiva
- `SELECT *` en consultas cuyo resultado va directamente a la respuesta HTTP sin transformación
- Ausencia de serializers, transformers o DTOs de respuesta (ej. `class-transformer`, `marshmallow`, `ActiveModel::Serializer`, `jsonapi-serializer`)
- `password`, `hash`, `salt`, `secret` presentes en objetos serializados y enviados en respuestas HTTP
**Referencia:** OWASP API3:2023, CWE-213

---

## Grupo 28: Autorización Rota a Nivel de Función (OWASP API5:2023)

### SEC-093: Endpoints administrativos o internos sin control de acceso por función

**Condición:** `has_api`
**Requerimiento:** Los endpoints que implementan funciones privilegiadas (administración, operaciones bulk, debug, configuración) deben protegerse con verificación explícita de rol o función, independientemente de la autenticación genérica del usuario. La autenticación no implica autorización funcional.
**Severidad:** CRITICAL
**Patrones de detección:**
- Rutas que contienen `/admin`, `/internal`, `/debug`, `/management`, `/backoffice`, `/superuser` sin middleware de verificación de rol
- Handlers de rutas con operaciones bulk (`deleteAll`, `purge`, `reset`) sin verificación de función-nivel (`isAdmin`, `hasRole`, `@Roles`)
- Endpoints con `router.delete(` o `router.put(` en rutas administrativas que solo validan autenticación genérica (`isAuthenticated`) sin verificar el rol
- Ausencia de `@PreAuthorize`, `[Authorize(Roles="Admin")]`, `@admin_required`, `requireRole('admin')` en controladores con operaciones privilegiadas
**Referencia:** OWASP API5:2023, CWE-285

---

## Grupo 29: Acceso Irrestricto a Flujos de Negocio Sensibles (OWASP API6:2023)

### SEC-094: Ausencia de anti-automatización en flujos de negocio críticos

**Condición:** `has_api AND has_sensitive_business_flows`
**Requerimiento:** Los endpoints que exponen flujos de negocio con valor económico o competitivo (compra, reserva, votación, registro masivo, scraping de precios) deben tener controles anti-automatización específicos al flujo, adicionales al rate limiting genérico. Sin estos controles, bots pueden abusar del sistema a escala sin ser detectados.
**Severidad:** HIGH
**Patrones de detección:**
- Endpoints de compra, reserva o registro sin validación de CAPTCHA (`recaptcha`, `hcaptcha`, `turnstile`, `friendlycaptcha`)
- Ausencia de límites por usuario sobre acciones de negocio acumuladas (ej. sin `MAX_PURCHASES_PER_DAY`, `MAX_RESERVATIONS_PER_HOUR`)
- Flujos críticos sin detección de comportamiento anómalo (ausencia de `device fingerprint`, `behavioral analytics`, `velocity checks` por IP/usuario)
- Ausencia de mecanismos de detección de bots en rutas de negocio (sin `bot-detection`, `arkose`, `DataDome` o equivalente)
**Referencia:** OWASP API6:2023, CWE-799

---

## Grupo 30: Server Side Request Forgery — SSRF General (OWASP API7:2023)

### SEC-095: SSRF en APIs que realizan peticiones HTTP basadas en input del usuario

**Condición:** `has_api`
**Requerimiento:** Ningún endpoint debe realizar peticiones HTTP hacia URLs o hosts controlados por el usuario sin validación estricta de dominio contra una lista blanca. El SSRF permite acceder a recursos internos, metadatos de cloud (169.254.169.254) y servicios internos no expuestos. Esta regla complementa SEC-053 (SSRF en contexto LLM/agente).
**Severidad:** CRITICAL
**Patrones de detección:**
- `fetch(req.body.url)`, `axios.get(req.query.url)`, `http.get(userInput)`, `requests.get(request.data['url'])` sin validación de dominio
- `new URL(userInput)` sin verificación posterior del hostname contra lista blanca
- Ausencia de bloqueo explícito de rangos internos: `localhost`, `127.0.0.1`, `0.0.0.0`, `::1`, `169.254.0.0/16` (AWS metadata), `10.0.0.0/8`, `192.168.0.0/16`
- `curl` o `wget` ejecutados con parámetros de URL del usuario sin validación de dominio
- Ausencia de `ALLOWED_HOSTS`, `allowedDomains`, `SSRF_SAFE_IPS`, `urlValidator` antes de peticiones HTTP salientes dinámicas
**Referencia:** OWASP API7:2023, CWE-918

---

## Grupo 31: Gestión Inadecuada del Inventario de APIs (OWASP API9:2023)

### SEC-096: Ausencia de inventario documentado de endpoints y versiones de API

**Condición:** `has_api`
**Requerimiento:** Todo proyecto con API debe mantener un inventario actualizado de sus endpoints, versiones activas y estado de ciclo de vida (activo, deprecado, sunset). Sin inventario, proliferan las "shadow APIs" (endpoints olvidados sin mantenimiento de seguridad).
**Severidad:** MEDIUM
**Patrones de detección:**
- Ausencia de `openapi.yaml`, `openapi.json`, `swagger.yaml`, `swagger.json` o directorio `api-docs/` en proyectos con API
- Ausencia de generación automática de documentación de API en CI/CD (sin `swagger-autogen`, `@nestjs/swagger`, `drf-spectacular`, `springdoc-openapi`)
- Múltiples prefijos de versión (`/v1/`, `/v2/`, `/v3/`) sin documentación que declare cuáles están activos y cuáles deprecados
**Referencia:** OWASP API9:2023, CWE-1059

---

### SEC-097: Versiones obsoletas de API accesibles en producción

**Condición:** `has_api`
**Requerimiento:** Las versiones deprecadas de la API deben retornar headers de deprecación (`Deprecation`, `Sunset`) y finalmente devolver 410 Gone o redirigir a la versión actual. Dejar versiones viejas activas indefinidamente crea superficie de ataque con mecanismos de seguridad desactualizados.
**Severidad:** HIGH
**Patrones de detección:**
- Rutas `/v0/`, `/v1/`, `/beta/`, `/legacy/` activas sin header `Sunset` ni `Deprecation` en las respuestas
- Endpoints de versiones antiguas con autenticación más débil que la versión actual (ej. versión antigua sin verificación de token, version actual con JWT)
- Ausencia de middleware de deprecation que añada `Deprecation: true` y `Sunset: <date>` a rutas marcadas como obsoletas
- Versiones antiguas con CORS más permisivo (`Access-Control-Allow-Origin: *`) que la versión actual
**Referencia:** OWASP API9:2023, CWE-1059

---

## Grupo 32: Consumo Inseguro de APIs de Terceros (OWASP API10:2023)

### SEC-098: Ausencia de validación de respuestas de APIs externas antes de procesarlas

**Condición:** `has_api AND has_third_party_api_consumption`
**Requerimiento:** Las respuestas de APIs de terceros deben validarse con esquemas declarativos antes de usarse, igual que el input de usuarios. Confiar ciegamente en la respuesta de una API externa permite ataques si esa API es comprometida o devuelve datos inesperados que se propagan a la base de datos o a comandos del sistema.
**Severidad:** HIGH
**Patrones de detección:**
- `thirdPartyResponse.data.field` accedido directamente sin validación de esquema previa
- `const { userId, role } = await externalApi.getUser(id)` sin validación de tipo/esquema de la respuesta
- Ausencia de `zod.parse(response)`, `joi.validate(response)`, `pydantic.parse_obj(response)` sobre respuestas de APIs externas antes de persistirlas o usarlas en lógica de negocio
- Datos de API externa pasados directamente a consultas SQL, comandos del sistema o como input de otro LLM sin transformación validada
- Ausencia de manejo de respuestas parciales, truncadas o con campos inesperados de APIs de terceros
**Referencia:** OWASP API10:2023, CWE-20
