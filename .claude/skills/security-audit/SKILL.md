---
name: security-audit
description: >-
  Genera audit-report.md con auditoría automática de seguridad (checklist OWASP + evidencias).
  Usar antes de merge/deploy o como componente de story-code-review.
  Invocar para "security audit", "auditoría de seguridad", "security-audit",
  "checklist de seguridad", "OWASP checklist" o "vulnerabilidades".
triggers:
  - security audit
  - auditoría de seguridad
  - revisar seguridad
  - security-audit
  - checklist de seguridad
  - vulnerability check
  - OWASP review
---

# Skill: `/security-audit`

Auditoría automática condicional de seguridad de repositorios de código. Detecta el contexto tecnológico del proyecto, evalúa las reglas del checklist que aplican a ese contexto y genera un reporte con hallazgos, evidencias y recomendaciones.

## Posicionamiento

```
[Ingeniero o story-code-review]
       ↓
security-audit  ← entry point
  └── agents/context-detector.agent.md    → .tmp/security-audit/project-context.json
  └── assets/security-checklist.md        → .tmp/security-audit/active-rules.json  (filtra el orquestador)
  └── agents/checklist-evaluator.agent.md → .tmp/security-audit/rule-results.json
  └── agents/report-generator.agent.md    → .tmp/security-audit/audit-report.md / audit-report.json
       ↓
[Reporte Markdown en stdout / JSON retornado al invocador]
```

**Qué hace este skill:**
- Detecta el stack tecnológico del repositorio mediante análisis estático de patrones
- Filtra las reglas del checklist cuya condición aplica al contexto detectado
- Evalúa cada regla activa y asigna estado PASS / FAIL / N/A con evidencia concreta
- Genera un reporte estructurado en Markdown y opcionalmente en JSON

**Qué NO hace este skill:**
- Ejecutar código del repositorio auditado (solo análisis estático)
- Corregir vulnerabilidades detectadas automáticamente
- Integrar con herramientas SAST externas (Snyk, SonarQube, Semgrep)

---

## Objetivo

Automatizar la evaluación de seguridad de un repositorio de código mediante un checklist condicional extensible, garantizando que solo se evalúan las reglas relevantes al stack del proyecto y generando un reporte accionable con evidencias de código y recomendaciones técnicas.

---

## Entrada

- `$REPO_PATH`: ruta al directorio del repositorio a auditar
- `$CHANGED_FILES` (opcional): lista de archivos modificados en un PR (modo diff)
- `assets/security-checklist.md`: checklist con las reglas organizadas en grupos (fuente de verdad dinámica — se lee en runtime)

---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `--repo <ruta>` | requerido | Ruta absoluta al repositorio a auditar |
| `--output json` | opcional | Genera salida en JSON además de Markdown |
| `--scope release` | opcional | Marca la auditoría como Release Readiness; agrega sección de veredicto de lanzamiento en el reporte |
| `--files <f1,f2,...>` | opcional | Lista inline de archivos separados por coma a auditar (alternativa a --diff sin necesitar crear un JSON) |
| `--story <story-dir>` | opcional | Ruta al directorio de la historia; el skill resuelve automáticamente los archivos cambiados via git diff o tasks.md |
| `--diff <archivo.json>` | opcional (legacy) | Lista de archivos a analizar desde un JSON (modo diff acotado — compatibilidad con story-code-review) |
| payload JSON `{repo, changed_files}` | modo integrado | Invocación desde story-code-review |

**Ejemplos:**
```
# Auditoría completa del proyecto
/security-audit --repo /ruta/al/proyecto

# Auditoría de Release Readiness (completa + veredicto de release)
/security-audit --repo /ruta/al/proyecto --scope release

# Auditoría de Release con salida JSON para CI/CD
/security-audit --repo /ruta/al/proyecto --scope release --output json

# Auditoría de historia — archivos inline (sin crear JSON)
/security-audit --repo /ruta/al/proyecto --files src/auth.ts,src/api/routes.ts,src/middleware/jwt.ts

# Auditoría de historia — resolución automática desde directorio de historia
/security-audit --repo /ruta/al/proyecto --story docs/specs/stories/FEAT-071-skill-story-verify

# Combinación: release scope + archivos acotados (hotfix previo a release)
/security-audit --repo /ruta/al/proyecto --scope release --files src/auth.ts,src/db/migrations/001.sql
```

Invocación integrada (desde story-code-review):
```json
{ "repo": "/ruta/al/proyecto", "changed_files": ["src/auth.ts", "src/api/routes.ts"] }
```

---

## Dependencias

- Skills: [`skill-preflight`]
- Agentes locales: [`agents/context-detector.agent.md`, `agents/checklist-evaluator.agent.md`, `agents/report-generator.agent.md`]
- Assets: [`assets/security-checklist.md`] — reglas organizadas en grupos; si no existe, el skill aborta con error claro

---

## Modos de ejecución

| Modo | Señal de detección | Alcance | Salida |
|---|---|---|---|
| Full | `--repo <ruta>` sin flags de archivos ni scope | Todo el proyecto | stdout Markdown |
| Full JSON | `--repo <ruta> --output json` | Todo el proyecto | stdout JSON |
| **Release** | `--repo <ruta> --scope release` | Todo el proyecto + sección Release Readiness | stdout Markdown |
| **Story** | `--repo <ruta> --story <story-dir>` | Archivos de la historia (auto-detectados) | stdout Markdown |
| **Files** | `--repo <ruta> --files <f1,f2,...>` | Archivos indicados inline | stdout Markdown |
| Diff (legacy) | `--repo <ruta> --diff <archivo.json>` | Archivos del JSON | stdout Markdown |
| Integrado | Input es objeto JSON `{repo, changed_files}` | Archivos indicados | JSON `{status, summary, report}` |

`--scope release` puede combinarse con cualquier modo (ej. `--scope release --files ...` para hotfix previo a release).

- **Modo manual** (`/security-audit --repo ...`): interactivo, imprime el reporte en stdout.
- **Modo Agent** (invocado por orquestador): automático, retorna JSON al invocador.

---

## Restricciones / Reglas

- **Nunca ejecutar código del repositorio auditado** — solo búsqueda de patrones en texto
- **El checklist es la fuente de verdad** — leer `assets/security-checklist.md` en runtime; no hardcodear reglas en la lógica del skill
- **Safe-by-default ante incertidumbre** — si una variable de contexto no puede determinarse, asumir el valor más conservador (`environment = "production"`, booleanos → `false`) y marcar `manual_review_required` en el reporte
- **Fail-fast ante dependencias faltantes** — si `assets/security-checklist.md` no existe o `.tmp/security-audit/` no puede crearse, abortar con mensaje claro
- **Idempotencia** — el directorio `.tmp/security-audit/` se recrea en cada ejecución; no hay estado persistente entre ejecuciones
- NO genere código; estamos auditando seguridad, no implementando los artefactos técnicos
- NO modifique ningún archivo que no sean los archivos de salida bajo `.tmp/security-audit/` y el archivo `audit-report.md` (nunca escribir en los assets ni en los agentes)

---

## Flujo de ejecución

### 0. Preflight

Invocar `skill-preflight`. Si retorna error bloqueante, detener la ejecución.

### 1. Cargar contexto

1. Identificar el modo de ejecución por los parámetros recibidos (ver tabla en "Modos de ejecución")
2. Registrar internamente las variables de sesión:
   - `$REPO_PATH` → valor de `--repo` o campo `repo` del payload JSON
   - `$OUTPUT_FORMAT` → `json` si `--output json`, sino `markdown`
   - `$AUDIT_SCOPE` → `release` si `--scope release`, sino `full`
   - `$CHANGED_FILES` → lista de archivos (ver resolución por modo abajo), o `null` para auditoría completa
   - `$EXECUTION_MODE` → `full | release | story | files | diff | integrated`
3. Si no se proporcionó `--repo` ni payload JSON, preguntar: `¿Qué repositorio deseas auditar?`
4. **Resolver `$CHANGED_FILES` según el modo:**
   - **`--files <f1,f2,...>`**: parsear la cadena separada por comas → lista de archivos. Verificar que cada archivo existe bajo `$REPO_PATH`; advertir (no abortar) si alguno no se encuentra.
   - **`--story <story-dir>`**: resolución en dos pasos (el primero que produzca resultados gana):
     1. **git diff** — intentar `git diff main...HEAD --name-only` desde `$REPO_PATH` y filtrar los archivos que pertenecen al alcance de la historia. Si produce al menos 1 archivo → usar esa lista.
     2. **tasks.md** — leer `<story-dir>/tasks.md` y extraer rutas de archivo mencionadas en tareas completadas (`[x]`) mediante regex de rutas relativas (ej. `src/`, `.ts`, `.py`, `.js`).
     3. Si ninguno produce archivos → abortar con: `❌ No se pudieron resolver archivos de la historia. Usa --files para especificarlos manualmente.`
   - **`--diff <archivo.json>`** (legacy): leer el JSON y parsear la lista — comportamiento existente.
   - **Payload JSON `{repo, changed_files}`**: usar `changed_files` directamente — comportamiento existente.
   - **Sin flag de archivos**: `$CHANGED_FILES = null` → análisis completo del repositorio.
5. Mostrar mensaje de inicio según el modo:
   - Full: `🔍 Auditoría completa del repositorio: <repo>`
   - Release: `🚀 Auditoría de Release Readiness: <repo>`
   - Story: `📖 Auditoría de historia: <story-dir> (<N> archivos detectados)`
   - Files: `📂 Auditoría acotada: <N> archivos indicados`
6. Crear el directorio `.tmp/security-audit/` si no existe — abortar con error si no puede crearse
7. Leer `assets/security-checklist.md` — abortar con error si no existe:
   ```
   ❌ Checklist no encontrado en assets/security-checklist.md
   ```

### 2. Proceso principal

**2a. Detección de contexto del repositorio**

Invocar `agents/context-detector.agent.md` pasando `$REPO_PATH` y `$CHANGED_FILES`.
El agente escribe `.tmp/security-audit/project-context.json`.
Si el agente falla completamente (no escribe el archivo), abortar con error descriptivo y detener.

**2b. Filtrado del checklist por condición**

Para cada regla de `assets/security-checklist.md`:
- Parsear `**Condición:** <expresión>` y evaluar la expresión lógica (AND, OR, NOT) contra `project-context.json`
- Si una variable tiene valor `"manual_review_required"`, tratarla como `true` (conservador)
- Si `source_files_found: false` en el contexto, marcar todas las reglas como `N/A` directamente

Escribir `.tmp/security-audit/active-rules.json` con las reglas cuya condición es `true`.
Mostrar resumen: `📋 Checklist: <N_total> reglas | <N_activas> activas | <N_omitidas> omitidas`

**2c. Evaluación de reglas**

Invocar `agents/checklist-evaluator.agent.md` con referencias a `project-context.json` y `active-rules.json`.
El agente escribe `.tmp/security-audit/rule-results.json`.

**2d. Generación del reporte**

Invocar `agents/report-generator.agent.md` pasando `$OUTPUT_FORMAT`, `$AUDIT_SCOPE` y `$CHANGED_FILES`.
El agente escribe `.tmp/security-audit/audit-report.md` (siempre) y `audit-report.json` (si `$OUTPUT_FORMAT = json`).

### 3. Manejo de errores

| Situación | Comportamiento |
|---|---|
| `assets/security-checklist.md` no encontrado | Abortar con error claro; sugerir verificación de ruta |
| `context-detector` falla completamente | Abortar con error; sugerir verificación de `$REPO_PATH` |
| Una regla individual falla en evaluación | Marcar esa regla como N/A con justificación "error en evaluación"; continuar |
| `source_files_found: false` | Marcar todas las reglas N/A; mensaje: "No se encontraron archivos fuente reconocidos"; exit 0 |
| Variable de contexto no determinable | Asumir safe-default + marcar `manual_review_required` en reporte; no interrumpir |
| `.tmp/security-audit/` no puede crearse | Abortar con error de permisos |

### 4. Fin de proceso

Retornar el resultado según el modo detectado en el Paso 1:

- **Modo autónomo Markdown / Diff:** leer `audit-report.md` e imprimir en stdout
- **Modo autónomo JSON:** leer `audit-report.json` e imprimir en stdout
- **Modo integrado:** retornar objeto JSON `{status, summary, report}` al invocador

---

## Salida

| Artefacto | Cuándo | Descripción |
|---|---|---|
| `.tmp/security-audit/project-context.json` | Siempre | Contexto detectado: variables booleanas + lenguajes + notas |
| `.tmp/security-audit/active-rules.json` | Siempre | Reglas del checklist cuya condición aplica al proyecto |
| `.tmp/security-audit/rule-results.json` | Siempre | PASS / FAIL / N/A con evidencia (archivo, línea, fragmento) por regla |
| `.tmp/security-audit/audit-report.md` | Siempre | Reporte Markdown: resumen ejecutivo + contexto + tabla de reglas + detalle de FAILs |
| `.tmp/security-audit/audit-report.json` | Solo `--output json` o modo integrado | JSON `{status, summary, detected_context, results, report}` |

**Contrato de retorno en modo integrado:**
```json
{
  "status": "PASS | FAIL",
  "summary": { "evaluated": 12, "pass": 9, "fail": 2, "na": 1 },
  "report": "<contenido Markdown del audit-report>"
}
```
