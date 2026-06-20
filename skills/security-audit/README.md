# security-audit

Skill de auditoría automática condicional de seguridad para el framework SDDF. Detecta automáticamente las características del repositorio, evalúa un checklist de seguridad condicional y genera un reporte estructurado con hallazgos, evidencias y recomendaciones.

## Instalación y dependencias

Este skill es puramente declarativo (Markdown). No requiere dependencias de npm ni scripts de instalación.

El skill se instala como parte del framework SDDF. Para verificar que está disponible:

```bash
# Verificar que el skill está registrado
ls .claude/skills/security-audit/
```

## Modos de uso

### Modo autónomo (Markdown)

Audita el repositorio completo y genera un reporte en formato Markdown:

```
/security-audit --repo /ruta/al/proyecto
```

### Modo autónomo (JSON)

Genera el reporte en formato JSON estructurado:

```
/security-audit --repo /ruta/al/proyecto --output json
```

### Modo diff

Limita el análisis a los archivos modificados en un PR (más rápido para pipelines de CI/CD):

```
/security-audit --repo /ruta/al/proyecto --diff changed_files.json
```

Donde `changed_files.json` es una lista de rutas de archivo:
```json
["src/auth.ts", "src/api/routes.ts", "src/middleware/auth.ts"]
```

### Modo integrado (desde story-code-review)

El skill puede ser invocado como subagente de seguridad por el skill `story-code-review`.
La invocación usa un payload JSON:

```json
{
  "repo": "/ruta/al/proyecto",
  "changed_files": ["src/auth.ts", "src/api/routes.ts"]
}
```

Retorna:
```json
{
  "status": "PASS | FAIL",
  "summary": { "evaluated": 12, "pass": 9, "fail": 2, "na": 1 },
  "report": "# Security Audit Report\n..."
}
```

### Ejemplo de integración en CI/CD (GitHub Actions)

```yaml
- name: Security Audit
  uses: anthropics/claude-code-action@beta
  with:
    prompt: |
      /security-audit --repo . --output json
    claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

## Archivos del skill

```
security-audit/
├── SKILL.md                          ← orquestador principal
├── assets/
│   └── security-checklist.md         ← TODAS las reglas (fuente de verdad)
├── agents/
│   ├── context-detector.agent.md     ← detecta características del proyecto
│   ├── checklist-evaluator.agent.md  ← evalúa reglas activas
│   └── report-generator.agent.md     ← genera el reporte final
├── examples/
│   ├── jwt-project/                  ← proyecto con JWT (test AC-1, AC-2)
│   └── empty-project/               ← sin archivos fuente (test AC-3)
├── evals/
│   └── eval-detection.md             ← benchmarks de evaluación
└── README.md                         ← este archivo
```

## Heurísticas de detección de características

El agente `context-detector` detecta las siguientes variables para determinar qué reglas del checklist aplican:

| Variable | Qué busca | Fuentes |
|---|---|---|
| `has_authentication` | `passport`, `express-session`, archivos `auth.js`, `login.js` | `package.json`, código fuente |
| `uses_jwt_tokens` | dependencia `jsonwebtoken`, `jwt.sign(`, `jwt.verify(` | `package.json`, código fuente |
| `is_web_application` | `express`, `fastify`, `django`, `flask`, archivos `.html`, `.tsx` | `package.json`, estructura de archivos |
| `has_file_upload` | `multer`, `busboy`, `req.file`, `multipart/form-data` | `package.json`, código fuente |
| `has_graphql` | dependencia `graphql`, archivos `.graphql`, `typeDefs` | `package.json`, archivos, código |
| `has_llm_agent` | `anthropic`, `openai`, `langchain`, `tool_use` | `package.json`, código fuente |
| `has_multi_tenant` | `tenant_id`, `tenantId`, `org_id`, `workspace_id` | código fuente, modelos |
| `has_unsafe_deserialization` | `pickle.loads(`, `yaml.load(`, `ObjectInputStream` | código fuente |
| `environment` | `NODE_ENV`, `APP_ENV`, `.env.production` | variables de entorno, archivos de config |

Si una variable no puede determinarse:
- En modo autónomo: se asume el valor seguro por defecto y se marca como `manual_review_required` en el reporte
- El análisis nunca se interrumpe por variables no determinables

## Extensión del checklist

Para añadir nuevas reglas de seguridad, editar `assets/security-checklist.md` siguiendo el formato:

```markdown
### SEC-NNN: [Título descriptivo]

**Condición:** [expresión lógica usando variables de contexto]
**Requerimiento:** [qué debe verificarse en el código]
**Severidad:** CRITICAL | HIGH | MEDIUM | LOW | INFO
**Patrones de detección:**
- [patrón de texto/regex a buscar en el código]
- [patrón adicional]
**Referencia:** [OWASP Top 10, CWE-NNN u otro estándar]
```

**Operadores de condición disponibles:** `AND`, `OR`, `NOT`

**Variables disponibles:** `source_files_found`, `has_authentication`, `uses_jwt_tokens`, `is_web_application`, `has_file_upload`, `has_graphql`, `has_llm_agent`, `has_multi_tenant`, `has_unsafe_deserialization`

Los agentes cargan el checklist en runtime, por lo que cualquier regla añadida estará disponible inmediatamente en la próxima ejecución del skill sin modificar código.

## Limitaciones

- El skill realiza exclusivamente análisis estático (búsqueda de patrones). No ejecuta el código del repositorio.
- Puede generar falsos positivos (hallazgos FAIL en código correcto) o falsos negativos (no detectar vulnerabilidades sin patrones textuales claros). Toda regla FAIL debe confirmarse con revisión humana.
- El análisis completo de repositorios con más de 1000 archivos puede superar el tiempo de contexto disponible. Usar el modo `--diff` para análisis acotados.
- No integra herramientas SAST externas (Snyk, SonarQube, Semgrep) — son complementarios, no sustitutos.

## Grupos de reglas disponibles

1. **JWT Authentication** (SEC-001 a SEC-005): algoritmo, secreto, almacenamiento, expiración, verificación
2. **XSS Prevention** (SEC-006 a SEC-010): innerHTML, eval, dangerouslySetInnerHTML, document.write, CSP
3. **SQL Injection** (SEC-011 a SEC-015): concatenación, ORM, mensajes de error, NoSQL, stored procedures
4. **CSRF** (SEC-016 a SEC-020): tokens, cookies SameSite, HttpOnly, Secure, CORS
5. **Secrets Management** (SEC-021 a SEC-025): hardcoded, .env, logs, rotación, validación
6. **File Upload** (SEC-026 a SEC-030): tipo MIME, tamaño, ruta, path traversal, ejecución
7. **GraphQL** (SEC-031 a SEC-035): introspección, profundidad, autenticación, rate limiting, errores
8. **LLM Agent Security** (SEC-036 a SEC-040): prompt injection, permisos, output validation, API keys, tokens
9. **Multi-tenant** (SEC-041 a SEC-045): filtrado, tenant del token, archivos, logs, admin
10. **Unsafe Deserialization** (SEC-046 a SEC-050): pickle, yaml.load, ObjectInputStream, node-serialize, XXE
