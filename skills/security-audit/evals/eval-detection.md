# Evals: Detección de Contexto (eval-detection)

Benchmarks para verificar que el agente `context-detector` detecta correctamente las variables de contexto en proyectos representativos de Node.js, Python y Go.

## Metodología

Para cada variable y stack, se define:
- **Caso POSITIVE:** señales que deben producir `true`
- **Caso NEGATIVE:** ausencia de señales que deben producir `false`
- **Resultado esperado:** el valor de la variable en `project-context.json`

---

## Variable: `uses_jwt_tokens`

### POSITIVE — Node.js con jsonwebtoken

**Input:** proyecto con `package.json` que declara `"jsonwebtoken": "^9.0.0"` y archivo `src/auth.js` con `jwt.sign(`

**Resultado esperado:**
```json
{ "uses_jwt_tokens": true }
```

**Evidencia esperada en detection_notes:**
- `"uses_jwt_tokens: detectado via dependencia 'jsonwebtoken' en package.json"`

---

### POSITIVE — Python con PyJWT

**Input:** proyecto con `requirements.txt` que declara `PyJWT==2.8.0` y archivo `auth.py` con `jwt.encode(`

**Resultado esperado:**
```json
{ "uses_jwt_tokens": true }
```

---

### POSITIVE — Go con golang-jwt

**Input:** proyecto con `go.mod` que declara `github.com/golang-jwt/jwt` y archivo `auth.go` con `jwt.NewWithClaims(`

**Resultado esperado:**
```json
{ "uses_jwt_tokens": true }
```

---

### NEGATIVE — Proyecto sin JWT

**Input:** proyecto con solo `"express": "^4.18.0"` en `package.json`, sin patrones JWT en código

**Resultado esperado:**
```json
{ "uses_jwt_tokens": false }
```

---

## Variable: `has_authentication`

### POSITIVE — Express con Passport.js

**Input:** `package.json` con `passport`, archivos `middleware/auth.js` y `routes/auth.js`

**Resultado esperado:**
```json
{ "has_authentication": true }
```

---

### POSITIVE — Django con django.contrib.auth

**Input:** `settings.py` con `django.contrib.auth`, archivos `views/login.py` con `@login_required`

**Resultado esperado:**
```json
{ "has_authentication": true }
```

---

### NEGATIVE — API pública sin autenticación

**Input:** servidor Express sin passport ni middleware de autenticación, sin archivos `auth.*`

**Resultado esperado:**
```json
{ "has_authentication": false }
```

---

## Variable: `is_web_application`

### POSITIVE — Express.js API

**Input:** `package.json` con `express`, archivos con `app.get(`, `app.post(`

**Resultado esperado:**
```json
{ "is_web_application": true }
```

---

### POSITIVE — FastAPI (Python)

**Input:** `requirements.txt` con `fastapi`, archivos con `@app.get(`, `@router.post(`

**Resultado esperado:**
```json
{ "is_web_application": true }
```

---

### NEGATIVE — Script CLI sin servidor web

**Input:** `package.json` con solo `commander`, `chalk`; ningún framework web

**Resultado esperado:**
```json
{ "is_web_application": false }
```

---

## Variable: `has_file_upload`

### POSITIVE — Node.js con Multer

**Input:** `package.json` con `multer`, código con `upload.single('file')` y `req.file`

**Resultado esperado:**
```json
{ "has_file_upload": true }
```

---

### POSITIVE — Python con Flask-Uploads

**Input:** `requirements.txt` con `flask-uploads`, código con `request.files`

**Resultado esperado:**
```json
{ "has_file_upload": true }
```

---

### NEGATIVE — API sin uploads

**Input:** API REST sin dependencias de upload y sin `req.file` en código

**Resultado esperado:**
```json
{ "has_file_upload": false }
```

---

## Variable: `has_graphql`

### POSITIVE — Apollo Server

**Input:** `package.json` con `graphql` y `apollo-server-express`, archivos `schema.graphql`, código con `typeDefs`

**Resultado esperado:**
```json
{ "has_graphql": true }
```

---

### POSITIVE — Strawberry (Python)

**Input:** `requirements.txt` con `strawberry-graphql`, código con `@strawberry.type`

**Resultado esperado:**
```json
{ "has_graphql": true }
```

---

### NEGATIVE — REST API sin GraphQL

**Input:** API Express/FastAPI sin dependencias de GraphQL, sin archivos `.graphql`

**Resultado esperado:**
```json
{ "has_graphql": false }
```

---

## Variable: `has_llm_agent`

### POSITIVE — Anthropic SDK en Node.js

**Input:** `package.json` con `@anthropic-ai/sdk`, código con `client.messages.create(`, `tool_use`

**Resultado esperado:**
```json
{ "has_llm_agent": true }
```

---

### POSITIVE — OpenAI SDK en Python

**Input:** `requirements.txt` con `openai`, código con `openai.chat.completions.create(`

**Resultado esperado:**
```json
{ "has_llm_agent": true }
```

---

### NEGATIVE — Aplicación sin LLM

**Input:** aplicación web estándar sin dependencias de LLM

**Resultado esperado:**
```json
{ "has_llm_agent": false }
```

---

## Variable: `has_unsafe_deserialization`

### POSITIVE — Python con pickle

**Input:** código Python con `pickle.loads(data)` y `import pickle`

**Resultado esperado:**
```json
{ "has_unsafe_deserialization": true }
```

---

### POSITIVE — Python con yaml.load sin Safe

**Input:** código Python con `yaml.load(stream)` sin `Loader=yaml.SafeLoader`

**Resultado esperado:**
```json
{ "has_unsafe_deserialization": true }
```

---

### NEGATIVE — YAML seguro

**Input:** código Python con exclusivamente `yaml.safe_load(stream)`

**Resultado esperado:**
```json
{ "has_unsafe_deserialization": false }
```

---

## Variable: `has_multi_tenant`

### POSITIVE — Modelos con tenant_id

**Input:** archivos con `tenant_id`, `tenantId` en modelos de base de datos y rutas

**Resultado esperado:**
```json
{ "has_multi_tenant": true }
```

---

### NEGATIVE — Aplicación single-tenant

**Input:** aplicación sin referencias a `tenant_id`, `orgId`, `workspace_id`

**Resultado esperado:**
```json
{ "has_multi_tenant": false }
```

---

## Variable: `source_files_found`

### POSITIVE — Proyecto con código

**Input:** directorio con archivos `.js`, `.ts`, `.py`

**Resultado esperado:**
```json
{ "source_files_found": true, "detected_languages": ["javascript", "typescript"] }
```

---

### NEGATIVE — Directorio solo con documentación

**Input:** directorio con solo archivos `.md`, `.txt`, `package.json`

**Resultado esperado:**
```json
{ "source_files_found": false, "detected_languages": [] }
```

---

## Variable: `environment`

### POSITIVE — NODE_ENV en archivo de configuración

**Input:** archivo `.env.production` con `NODE_ENV=production` o código con `process.env.NODE_ENV === 'production'`

**Resultado esperado:**
```json
{ "environment": "production" }
```

---

### INDETERMINADO — Sin señal de entorno

**Input:** proyecto sin variables `NODE_ENV`, `APP_ENV`, sin archivos `.env.production`

**Resultado esperado (safe default):**
```json
{ "environment": "production", "environment_note": "manual_review_required" }
```

**Nota:** asumir `production` es el comportamiento seguro conservador.

---

## Benchmarks de evaluación de reglas

### Benchmark 1: SEC-002 (Secreto JWT hardcodeado) — FAIL esperado

**Input:** `src/auth.js` con `const JWT_SECRET = 'my-super-secret-key';`

**Resultado esperado en rule-results.json:**
```json
{
  "id": "SEC-002",
  "status": "FAIL",
  "severity": "CRITICAL",
  "evidence": { "file": "src/auth.js", "line": 15, "snippet": "const JWT_SECRET = 'my-super-secret-key';" }
}
```

---

### Benchmark 2: SEC-003 (JWT en localStorage) — FAIL esperado

**Input:** `src/client.js` con `localStorage.setItem('token', data.token);`

**Resultado esperado:**
```json
{
  "id": "SEC-003",
  "status": "FAIL",
  "severity": "HIGH",
  "evidence": { "file": "src/client.js", "line": 20, "snippet": "localStorage.setItem('token', data.token);" }
}
```

---

### Benchmark 3: SEC-001 (Algoritmo JWT none) — N/A esperado si no hay patrón

**Input:** `src/auth.js` con `jwt.sign({userId}, secret, {algorithm: 'HS256', expiresIn: '1h'})`

**Resultado esperado:**
```json
{
  "id": "SEC-001",
  "status": "PASS"
}
```

---

### Benchmark 4: Repositorio vacío — Todas las reglas N/A

**Input:** directorio con solo `README.md`

**Resultado esperado:**
```json
{
  "source_files_found": false
}
```
Todas las reglas: `"status": "N/A", "justification": "sin archivos fuente detectados"`
