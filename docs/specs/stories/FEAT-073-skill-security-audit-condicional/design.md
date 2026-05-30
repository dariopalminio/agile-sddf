---
alwaysApply: false
type: design
id: FEAT-073
slug: FEAT-073-skill-security-audit-condicional-design
title: "Design: Construir skill `security-audit` para auditoría automática condicional de seguridad"
story: FEAT-073
created: 2026-05-15
updated: 2026-05-15
related:
  - FEAT-073-skill-security-audit-condicional
  - FEAT-064-revision-codigo-multi-agente
---

<!-- Referencias -->
[[FEAT-073-skill-security-audit-condicional]]
[[FEAT-064-revision-codigo-multi-agente]]

## Context

El skill `security-audit` es un componente nuevo del framework SDDF que automatiza la evaluación de seguridad de un repositorio de código. Opera como skill independiente siguiendo el patrón establecido en `skill-structural-pattern.md` y `skill-master.md`: el SKILL.md actúa como orquestador y delega en subagentes especializados locales.

El skill es invocable de forma aislada por un ingeniero o como herramienta integrada dentro del flujo de `story-code-review`. Su salida es un reporte estructurado (Markdown o JSON) con el estado de auditoría y hallazgos detallados.

**Stack aplicable (extraído de constitution.md):**
- Skills y agentes: Markdown puro. Sin dependencias externas para el skill en sí.
- Partes ejecutables si se requieren: TypeScript/Node.js (no aplica aquí; el análisis estático lo realiza el agente vía búsqueda de patrones).
- Convención de nombres: kebab-case.
- Almacenamiento: solo archivos. Sin base de datos.
- Análisis: exclusivamente estático (búsqueda de patrones en texto). El skill nunca ejecuta código del repositorio auditado.

**Criterios de aceptación de la historia (referencia de trazabilidad):**
- AC-1: Auditoría exitosa y detección de `uses_jwt_tokens` con evaluación condicional de reglas y reporte Markdown completo.
- AC-2: Característica crítica no determinable → asumir valor seguro + marcar `manual_review_required`.
- AC-3: Repositorio sin archivos fuente reconocidos → N/A para todas las reglas, exit 0.
- AC-4: Modos de ejecución (autónomo Markdown, autónomo JSON, diff, integrado).
- AC-5: Todas las reglas del checklist en un único archivo `.md`.
- AC-6: Contrato de integración JSON con `story-code-review`.
- AC-7: Agente local al skill (sin dependencias de agentes externos/compartidos).
- AC-8: Seguir patrones estructurales de `skill-structural-pattern.md`.
- AC-9: Seguir lineamientos de `skill-master`.
- AC-10: Modos de Auditoría Release y Story Review.

---

## Goals / Non-Goals

**Goals:**
- Detectar automáticamente las características del repositorio auditado mediante heurísticas basadas en búsqueda de patrones (AC-1).
- Evaluar de forma condicional las reglas del checklist de seguridad definidas en un archivo Markdown externo (AC-1, AC-5).
- Generar un reporte estructurado con hallazgos, evidencias y recomendaciones en Markdown y JSON (AC-1, AC-4).
- Manejar gracefully las características no determinables y los repositorios vacíos (AC-2, AC-3).
- Ser invocable tanto en modo autónomo como como herramienta integrada en `story-code-review` (AC-4, AC-6).
- Ser extensible: añadir reglas solo requiere editar el archivo `.md` del checklist, sin modificar lógica del skill (AC-5).

**Non-Goals:**
- Análisis dinámico o ejecución de código del repositorio auditado.
- Integración con herramientas SAST externas (Snyk, SonarQube, Semgrep).
- Corrección automática de vulnerabilidades detectadas.
- Análisis de dependencias con CVEs (puede añadirse en historia futura).

---

## Decisions

### D-1: Estructura de directorios del skill (// satisface: AC-8, AC-9)

**Opción elegida:** Estructura canónica SDDF con subdirectorio `agents/` local.

```
security-audit/
├── SKILL.md                          # orquestador principal
├── assets/
│   └── security-checklist.md         # todas las reglas (fuente de verdad)
├── agents/
│   ├── context-detector.agent.md     # detecta características del proyecto
│   ├── checklist-evaluator.agent.md  # evalúa reglas activas contra el código
│   └── report-generator.agent.md     # produce el reporte final
├── examples/
│   ├── jwt-project/                  # repositorio de ejemplo con JWT
│   └── empty-project/               # repositorio de ejemplo sin archivos fuente
└── evals/
    └── eval-detection.md             # benchmarks de detección
```

**Alternativa rechazada A:** Un solo agente monolítico que detecta + evalúa + reporta.
Rechazada porque viola P11 (múltiples responsabilidades en un componente) y dificulta la extensión independiente de cada fase.

**Alternativa rechazada B:** Usar un agente compartido de otro skill (ej. el inspector del `story-code-review`).
Rechazada porque viola AC-7 (el agente debe ser local al skill) y crea acoplamiento entre skills.

---

### D-2: Formato del checklist de seguridad (// satisface: AC-5)

**Opción elegida:** Archivo `assets/security-checklist.md` con reglas en formato estructurado (bloques de texto parseable).

Estructura de cada regla:
```
### SEC-NNN: [Título descriptivo]

**Condición:** [expresión lógica: has_authentication AND uses_jwt_tokens]
**Requerimiento:** [qué verificar en el código]
**Severidad:** CRITICAL | HIGH | MEDIUM | LOW | INFO
**Patrones de detección:** [lista de patrones de texto/regex a buscar]
**Referencia:** [OWASP, CWE u otro estándar]
```

El agente `context-detector` y `checklist-evaluator` leen este archivo en runtime. Si el archivo evoluciona (nuevas reglas), los agentes se adaptan sin cambios en su lógica.

**Alternativa rechazada:** Reglas hardcodeadas en el SKILL.md.
Rechazada porque viola el principio de "Template como fuente de verdad dinámica" (Patrón #5 de skill-structural-pattern.md) y hace el sistema rígido ante cambios.

---

### D-3: Heurísticas de detección de contexto (// satisface: AC-1, AC-2)

**Opción elegida:** Análisis estático por búsqueda de patrones de texto.

El `context-detector.agent.md` detecta variables mediante:
1. **Archivo de dependencias:** buscar en orden `package.json`, `requirements.txt`, `go.mod`, `pom.xml`. Leer el primero encontrado y buscar nombres de librerías conocidas.
2. **Búsqueda en código fuente:** patrones de importación, nombres de archivos, constantes y configuraciones.
3. **Nombres de archivos y directorios:** ej. presencia de `auth/`, `login.`, `jwt.` → `has_authentication`.

Variables detectadas y sus heurísticas:

| Variable | Heurísticas |
|---|---|
| `has_authentication` | Archivos con `auth`, `login`, `session`, librerías `passport`, `jwt`, `flask-login`, etc. |
| `uses_jwt_tokens` | Dependencia `jsonwebtoken`, `pyjwt`, `java-jwt`; patrones `jwt.sign`, `jwt.verify` |
| `is_web_application` | `express`, `fastapi`, `spring-boot`, `rails`, archivos `.html`, `.tsx`, `.vue` |
| `has_file_upload` | Patrones `multer`, `multipart`, `file-upload`, `UploadedFile` |
| `has_graphql` | Dependencia `graphql`, `apollo-server`, archivos `.graphql` |
| `has_llm_agent` | Dependencias `anthropic`, `openai`, `langchain`; patrones `tool_use`, `system_prompt` |
| `has_multi_tenant` | Patrones `tenant_id`, `org_id`, `workspace_id` en modelos o rutas |
| `has_unsafe_deserialization` | Patrones `pickle.loads`, `yaml.load(`, `deserialize(`, `ObjectInputStream` |
| `environment` | Variables de entorno `NODE_ENV`, `ENVIRONMENT`, `APP_ENV`; archivos `.env.production` |
| `source_files_found` | Presencia de archivos `.js`, `.ts`, `.py`, `.go`, `.java`, `.rb`, `.cs` |

Si una variable no puede determinarse:
- Modo interactivo: preguntar al usuario.
- Modo autónomo/integrado: asumir valor safe-by-default (`environment = "production"`, booleanos → `false`) y marcar como `manual_review_required` en el reporte.

**Alternativa rechazada:** Análisis AST (Abstract Syntax Tree) del código fuente.
Rechazada porque requeriría ejecutar código del repositorio auditado (viola principio de seguridad) y añade complejidad sin beneficio proporcional para el nivel de análisis requerido.

---

### D-4: Modos de ejecución (// satisface: AC-4, AC-6)

**Opción elegida:** SKILL.md detecta el modo de ejecución por los parámetros recibidos.

| Modo | Parámetros | Entrada | Salida |
|---|---|---|---|
| Autónomo Markdown | `--repo /ruta` | path | stdout Markdown |
| Autónomo JSON | `--repo /ruta --output json` | path | stdout JSON |
| Diff | `--repo /ruta --diff pr.json` | path + lista de archivos | stdout Markdown |
| Integrado | payload JSON | JSON `{repo, changed_files}` | JSON `{status, summary, report}` |

El modo integrado usa el mismo contrato JSON que `story-code-review`:
```
Input:  { "repo": "/ruta", "changed_files": ["src/auth.ts", ...] }
Output: { "status": "PASS|FAIL", "summary": {...}, "report": "...md..." }
```

**Alternativa rechazada:** Dos skills separados (uno autónomo, uno integrado).
Rechazada porque duplica lógica y complica el mantenimiento del checklist. Un único orquestador con detección de modo es más simple (KISS).

---

### D-5: Separación de responsabilidades entre agentes (// satisface: AC-1, AC-3, AC-4, AC-7)

**Opción elegida:** Tres agentes especializados con responsabilidad única.

```
SKILL.md (orquestador)
  └── context-detector.agent.md     (detecta ProjectContext)
  └── checklist-evaluator.agent.md  (evalúa reglas activas → RuleResult[])
  └── report-generator.agent.md     (produce AuditReport en MD/JSON)
```

Cada agente escribe su resultado en `.tmp/security-audit/` para evitar el "teléfono descompuesto" (Principio 6 de constitution.md). El orquestador lee esos archivos intermedios, nunca pasa contexto heredado directamente.

**Archivos intermedios en `.tmp/security-audit/`:**
- `project-context.json` — resultado de context-detector
- `active-rules.json` — reglas filtradas por condición
- `rule-results.json` — evaluaciones de checklist-evaluator
- `audit-report.md` — reporte final en Markdown
- `audit-report.json` — reporte final en JSON (si se solicitó)

**Alternativa rechazada:** SKILL.md hace la detección directamente sin delegar a un agente.
Rechazada porque convierte al orquestador en un componente con múltiples responsabilidades (violación de P11).

---

## Interfaces

### SKILL.md → context-detector.agent.md (// satisface: AC-1, AC-7)

```
Input:
  repo_path: string       # ruta absoluta al repositorio
  changed_files?: string[] # opcional, para modo diff

Output (escribe en .tmp/security-audit/project-context.json):
  {
    "source_files_found": boolean,
    "detected_languages": string[],
    "has_authentication": boolean | "manual_review_required",
    "uses_jwt_tokens": boolean | "manual_review_required",
    "is_web_application": boolean | "manual_review_required",
    "has_file_upload": boolean | "manual_review_required",
    "has_graphql": boolean | "manual_review_required",
    "has_llm_agent": boolean | "manual_review_required",
    "environment": "production" | "development" | "manual_review_required",
    "has_multi_tenant": boolean | "manual_review_required",
    "has_unsafe_deserialization": boolean | "manual_review_required"
  }
```

### SKILL.md → checklist-evaluator.agent.md (// satisface: AC-1, AC-3)

```
Input (lee de .tmp/security-audit/):
  project-context.json    # contexto detectado
  active-rules.json       # reglas cuya condición es true

Output (escribe en .tmp/security-audit/rule-results.json):
  RuleResult[]:
    {
      "id": "SEC-NNN",
      "status": "PASS" | "FAIL" | "N/A",
      "justification": string,
      "evidence"?: {
        "file": string,
        "line": number,
        "snippet": string
      },
      "recommendation"?: string,
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
    }
```

### SKILL.md → report-generator.agent.md (// satisface: AC-1, AC-4, AC-5)

```
Input (lee de .tmp/security-audit/):
  project-context.json
  rule-results.json

Output (escribe en .tmp/security-audit/):
  audit-report.md    # siempre generado
  audit-report.json  # solo si output_format = "json"

Formato de audit-report.json:
  {
    "status": "PASS" | "FAIL",
    "summary": {
      "evaluated": number,
      "pass": number,
      "fail": number,
      "na": number
    },
    "detected_context": ProjectContext,
    "results": RuleResult[],
    "report": string
  }
```

### Contrato de integración con story-code-review (// satisface: AC-6)

```
Invocación desde story-code-review:
  Input JSON:  { "repo": "/ruta", "changed_files": ["src/auth.ts"] }
  Output JSON: { "status": "PASS|FAIL", "summary": {...}, "report": "...md..." }
```

---

## Flujos Clave

### Flujo 1: Modo autónomo Markdown // satisface: AC-1, AC-4
```
[Ingeniero] → security-audit --repo /ruta
  → SKILL.md lee parámetros
  → SKILL.md invoca context-detector → escribe project-context.json
  → SKILL.md lee security-checklist.md, filtra reglas por condición → escribe active-rules.json
  → SKILL.md invoca checklist-evaluator → escribe rule-results.json
  → SKILL.md invoca report-generator → escribe audit-report.md
  → SKILL.md imprime audit-report.md en stdout
```

### Flujo 2: Repositorio sin archivos fuente // satisface: AC-3
```
  → context-detector detecta source_files_found: false
  → SKILL.md marca todas las reglas como N/A con justificación "sin archivos fuente detectados"
  → report-generator genera reporte con todas las reglas N/A
  → SKILL.md finaliza con exit code 0
```

### Flujo 3: Característica no determinable // satisface: AC-2
```
  → context-detector no puede determinar "environment"
  → context-detector asume "production", marca environment: "manual_review_required"
  → El análisis continúa normalmente
  → report-generator incluye "environment: manual_review_required" en la sección de contexto detectado
```

### Flujo 4: Modo integrado con story-code-review // satisface: AC-4, AC-6
```
  → story-code-review pasa payload JSON {repo, changed_files}
  → SKILL.md detecta modo integrado (input es JSON)
  → Ejecuta flujo 1 limitado a changed_files
  → report-generator produce audit-report.json
  → SKILL.md retorna JSON {status, summary, report}
```

---

## Risks / Trade-offs

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Falsos negativos en detección de contexto (heurísticas imprecisas) | Media | Alto | Marcar como `manual_review_required` y documentar las heurísticas; permitir override manual |
| Tiempo de análisis excede 30s en repos grandes (>1000 archivos) | Media | Medio | Modo `--diff` limita análisis a archivos modificados; documentar límite en README |
| Falsos positivos en evaluación de reglas | Media | Medio | Incluir evidencia concreta (archivo + línea) para que el revisor humano confirme |
| Checklist desactualizado respecto a nuevas vulnerabilidades | Alta | Medio | Estructura extensible; documentar proceso de actualización en README; referenciar CWE/OWASP |
| El agente context-detector no encuentra el archivo de dependencias | Baja | Bajo | Degradar gracefully: continuar con las variables que sí pudo detectar, marcar el resto como `manual_review_required` |

**Comportamiento ante fallo de componente:**
- Si `context-detector` falla completamente: abortar con mensaje claro y sugerir verificación manual del repo.
- Si `checklist-evaluator` falla en una regla individual: marcar esa regla como N/A con justificación "error en evaluación" y continuar con las demás.
- Si `security-checklist.md` no existe: abortar con error claro: "Checklist no encontrado en assets/security-checklist.md".
- Si `.tmp/security-audit/` no puede crearse: abortar con error de permisos.

---

## Open Questions

Ninguna — todas las ambigüedades técnicas relevantes para la implementación han sido resueltas en este documento o registradas como trade-offs con mitigación.

---

## Registro de Cambios (CR)

Sin CRs detectados. Todos los criterios de aceptación tienen cobertura directa en este diseño.
