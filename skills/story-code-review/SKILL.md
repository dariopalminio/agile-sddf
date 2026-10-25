---
name: story-code-review
description: >-
  Genera code-review-report.md con revisión multi-agente: 4 subagentes en paralelo (Inspector de
  Código, Guardián de Requisitos, Inspector de Integración, Auditor de Seguridad).
  Usar después de story-implement como quality gate antes de Done.
  Invocar para "code review", "revisar código", "story-code-review",
  "quality gate post-implement" o "validar implementación".
triggers:
  - "revisar código"
  - "code review"
  - "story-code-review"
  - "revisión multi-agente"
  - "quality gate post-implement"
  - "validar implementación"
---

# Skill: /story-code-review

## Objetivo

Quality gate formal entre la implementación y la marca final de Done. Compatible con `/story-implement` (TDD completo) y `/story-implement-tasks` (tarea a tarea). Lanza cuatro subagentes revisores en paralelo, consolida sus hallazgos y genera `code-review-report.md` con el veredicto.

**Qué hace este skill:**
- Verifica precondiciones antes de revisar (fail-fast ante artefactos faltantes)
- Limpia `.tmp/story-code-review/{story_id}/` para garantizar idempotencia
- Lanza cuatro subagentes revisores en paralelo con responsabilidades exclusivas
- Consolida los informes parciales y calcula la severidad máxima
- **Si `APPROVED`**: genera `code-review-report.md`, elimina `fix-directives.md` (si existe) y marca `story.md` como `CODE-REVIEW/DONE`
- **Si `NEEDS-CHANGES`**: genera `fix-directives.md` con `round: N` (ronda previa + 1), retrocede `story.md` a `READY-FOR-IMPLEMENT/DONE` y nombra al ejecutor de correcciones (`/story-implement`; `/story-implement-tasks` como alternativa si existe `tasks.md`)
- **Si `BLOCKED`**: genera el reporte, identifica a los revisores sin informe válido y deja `story.md` en `IMPLEMENT/DONE` para repetir la revisión; no genera `fix-directives.md`

**Qué NO hace este skill:**
- Ejecutar ni compilar código (opera sobre Markdown y texto plano únicamente)
- Aplicar automáticamente las correcciones de `fix-directives.md`
- Corregir el código implementado
- Escribir en `tasks.md` (ni añadir tareas de corrección ni marcarlas)
- Invocar automáticamente al ejecutor de correcciones

### Posicionamiento

```
[story.md: IMPLEMENT/DONE]              ← inicio (viene de /story-implement o /story-implement-tasks)
[story.md: CODE-REVIEW/IN-PROGRESS]     ← reanudación tras una interrupción
     ↓
story-code-review  → Quality gate: revisión multi-agente del código  ← aquí
     │   Al iniciar: story.md → CODE-REVIEW/IN-PROGRESS
     │   Al finalizar (APPROVED): story.md → CODE-REVIEW/DONE
     │   Al finalizar (NEEDS-CHANGES): story.md → READY-FOR-IMPLEMENT/DONE
     │   Al finalizar (BLOCKED): story.md → IMPLEMENT/DONE
     │       fix-directives.md (round N) = señal de rework → ejecutor: /story-implement
     │       (alternativa si existe tasks.md: /story-implement-tasks)
     ↓
[story.md: CODE-REVIEW/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story.md              → What: requisitos, criterios de aceptación, escenarios Gherkin  [Requerido]
design.md             → How: arquitectura, componentes, interfaces, decisiones técnicas [Requerido]
testcases.md          → Spec: tabla canónica de casos de prueba por tipo               [Opcional]
implement-report.md   → Done: código generado, archivos, estado por tarea              [Opcional]
code-review-report.md → Review: veredicto y hallazgos por dimensión  ← aquí
fix-directives.md     → Rework: instrucciones de corrección + ronda (señal de rework)  ← aquí (solo NEEDS-CHANGES)
```

---

## Entrada

Los siguientes artefactos se usan en `$STORY_DIR`. Solo `story.md` y `design.md` son requeridos para iniciar la ejecución. Los artefactos opcionales enriquecen el análisis cuando existen.

| Artefacto | Categoría | Justificación |
|---|---|---|
| `story.md` | **Requerido** | Fuente de criterios de aceptación — sin él, el Product-Owner-Reviewer no puede operar |
| `design.md` | **Requerido** | Fuente de arquitectura esperada — sin él, el Integration-Reviewer no puede operar |
| `implement-report.md` | Opcional | Evidencia de implementación producida por `/story-implement` o `/story-implement-tasks`; si no existe, los agentes verifican conformidad sin cruzar con tareas del reporte |
| `testcases.md` | Opcional | Especificación canónica de casos de prueba producida por `/story-testcases`; si existe, se incorpora al análisis de cobertura de ACs y trazabilidad de diseño |
| `tasks.md` | Opcional | El Tech-Lead-Reviewer puede revisar calidad sin lista de tareas; su presencia solo decide si se ofrece `/story-implement-tasks` como ejecutor alternativo (Paso 4g). Este skill nunca escribe en él |
| `constitution.md` | Opcional | Mejora la revisión pero no la bloquea si no existe |
| DoD de la etapa `code-review` (`dod-story-code-review.md`) | Opcional | Mismo caso que `constitution.md` |

> Para actualizar esta lista en el futuro, editar únicamente esta sección sin modificar el cuerpo del Paso 1.

---

## Parámetros

- `{story_id}` — identificador de la historia (ej. `STORY-064`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional)
- `--single-agent` — modo agente único para historias ≤3 archivos modificados (lanza solo el Tech-Lead-Reviewer)

---

## Precondiciones

- `story.md` debe estar en `IMPLEMENT/DONE` (inicio) o `CODE-REVIEW/IN-PROGRESS` (reanudación)
- `story.md` y `design.md` deben existir en `$STORY_DIR`
- `implement-report.md` y `testcases.md` son opcionales: si no existen, el skill continúa sin bloquear

---

## Dependencias

- Agentes locales: [`agents/tech-lead-reviewer.agent.md`, `agents/product-owner-reviewer.agent.md`, `agents/integration-reviewer.agent.md`, `agents/security-reviewer.agent.md`]

---

## DoD aplicable

| Elemento | Valor |
|---|---|
| Etapa | `code-review` |
| Archivo | `docs/guardrails/dod-story-code-review.md` |
| Override | `sddf.config.yaml › guardrails.dod.story.code-review` |
| Enforcement | el campo `enforcement` del frontmatter del archivo: `error` bloquea la transición; `warn` informa los criterios incumplidos sin bloquear |

Resolución (primera coincidencia):

1. `sddf.config.yaml › guardrails.dod.story.code-review` → `docs/guardrails/<slug>.md`
2. Convención: `docs/guardrails/dod-story-code-review.md`
3. Ninguno existe → emitir `⚠️ DoD de la etapa code-review no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic` y continuar sin validación DoD CODE-REVIEW.

Se carga **solo** ese archivo: sus criterios son todas sus líneas `- [ ]`. Es el quality gate de la revisión antes de escribir `CODE-REVIEW/DONE`; su ruta resuelta es `$DOD_PATH` para los agentes revisores.

## Modos de ejecución

- **Modo manual** (`/story-code-review {story_id}`): interactivo, muestra progreso de cada agente en tiempo real
- **Modo Agent** (invocado por orquestador): automático, reporta resultado consolidado al finalizar

El flujo por defecto es siempre el equipo de cuatro agentes. El flag `--single-agent` es la excepción para historias muy pequeñas.

---

## Restricciones / Reglas

| Evento | status | substatus |
|--------|--------|-----------|
| Precondición de inicio | `IMPLEMENT` | `DONE` |
| Precondición de reanudación | `CODE-REVIEW` | `IN-PROGRESS` |
| Al iniciar la revisión (Paso 1) | `CODE-REVIEW` | `IN-PROGRESS` |
| Finalización aprobada (Paso 6) | `CODE-REVIEW` | `DONE` |
| Finalización con bloqueantes (Paso 4g) | `READY-FOR-IMPLEMENT` | `DONE` |

- La ejecución es idempotente: `.tmp/story-code-review/{story_id}/` se limpia al inicio de cada ejecución
- `story-code-review` solo puede ejecutarse si `story.md` está en `IMPLEMENT/DONE` o `CODE-REVIEW/IN-PROGRESS`. Cualquier otro estado detiene la ejecución sin escrituras.
- NO modifique ningún archivo existente en el código fuente (estamos revisando el código de la implementación, no implementando los artefactos técnicos)
- NO genere código; estamos revisando la implementación, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.


### Paso 1 — Resolver input y verificar precondiciones

#### 1a. Argumentos aceptados

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas revisar?
Proporciona el ID (ej. STORY-064) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó: se acepta solo si, normalizada y relativa a `REPO_ROOT`, tiene la forma `specs/flow/STORY-NNN-<slug>/` (no `specs/flow/archive/…`) y contiene `story.md`. Si no:
   ```
   ❌ La ruta {story_path} no es una historia de specs/flow/ (se esperaba specs/flow/STORY-NNN-<slug>/)
   ```
   Detener la ejecución sin escribir ningún archivo.
2. Glob `specs/flow/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID seguido de guion (nunca se consulta el layout legado ni `specs/flow/archive/`)
3. Si no se encuentra:
   ```
   ❌ No se encontró la historia {story_id} en specs/flow/
   Verifica el ID o ejecuta /epic-generate-stories para generarla.
   ```
   Detener la ejecución.

#### 1c. Validar artefactos requeridos y detectar opcionales

**Artefactos requeridos** — comprobar simultáneamente la existencia de:
- `story.md`
- `design.md`

Acumular faltantes en una lista. Si la lista no está vacía, emitir **un único** mensaje de error y detener la ejecución **sin modificar ningún archivo**:

```
❌ Artefactos requeridos no encontrados en: <$STORY_DIR>/

   Faltantes:
   · <archivo-1>
   · <archivo-2>

Completa los artefactos faltantes y vuelve a ejecutar /story-code-review <story_id>.
```

**Artefactos opcionales** — detectar presencia y registrar internamente:
- Si existe `implement-report.md` → `$IMPL_REPORT_AVAILABLE = true`; si no → `$IMPL_REPORT_AVAILABLE = false`
- Si existe `testcases.md` → `$TESTCASES_AVAILABLE = true`; si no → `$TESTCASES_AVAILABLE = false`

Si los artefactos requeridos están presentes, continuar al paso 1d.

#### 1d. Verificar precondición de estado

Leer el frontmatter de `story.md` y admitir exactamente estas dos combinaciones:

- `IMPLEMENT/DONE`: inicio de una revisión.
- `CODE-REVIEW/IN-PROGRESS`: reanudación de una revisión interrumpida. Registrar `$REVIEW_ENTRY = resume` y repetir la revisión completa desde el Paso 2. Los informes parciales existentes no prueban que el código y el contexto sigan siendo los mismos.

Para `IMPLEMENT/DONE`, registrar `$REVIEW_ENTRY = start`.

**Si la precondición NO se cumple:**
```
❌ La historia <story_id> no está en un estado válido para revisar.

   Estado actual: status: <valor_actual> / substatus: <valor_actual>
   Estados admitidos: IMPLEMENT/DONE o CODE-REVIEW/IN-PROGRESS.

   Si la implementación está pendiente, ejecuta /story-implement {story_id}
   o /story-implement-tasks {story_id} si existe tasks.md.
```
Detener la ejecución **sin modificar ningún archivo**.

#### 1e. Actualizar frontmatter a CODE-REVIEW/IN-PROGRESS

Solo después de que los pasos 1c y 1d han pasado sin error:
- Si `$REVIEW_ENTRY = start`, actualizar el frontmatter de `story.md` a `status: CODE-REVIEW` y `substatus: IN-PROGRESS`.
- Si `$REVIEW_ENTRY = resume`, conservar `CODE-REVIEW/IN-PROGRESS` sin reescribir el frontmatter. Continuar con el Paso 2.

Mostrar confirmación de inicio:
```
🔍 <Iniciando | Reanudando> revisión de código para: <story_id>
   Directorio: <ruta_directorio>
   Artefactos requeridos: story.md ✓ | design.md ✓
   Artefactos opcionales: implement-report.md ✓/⏭️ | testcases.md ✓/⏭️
   Estado: <IMPLEMENT/DONE | CODE-REVIEW/IN-PROGRESS> ✓
```

---

### Paso 2 — Cargar contexto

#### 2a. Leer story.md

Extraer y registrar internamente:
- `story_id` del frontmatter
- `story_title`
- Criterios de aceptación numerados como AC-1, AC-2 … AC-N
- Todos los escenarios Gherkin (Dado/Cuando/Entonces o Given/When/Then)

#### 2b. Leer design.md

Extraer y registrar internamente:
- Componentes afectados y sus rutas de archivos
- Interfaces definidas y sus contratos

#### 2c. Leer implement-report.md (si disponible)

**Si `$IMPL_REPORT_AVAILABLE = true`:** leer `implement-report.md` y extraer:
- Lista de archivos generados por tarea (tests y código de producción) → registrar como `$IMPL_FILES`
- Tareas completadas y bloqueadas → registrar como `$IMPL_TASKS`

**Si `$IMPL_REPORT_AVAILABLE = false`:** registrar `$IMPL_FILES = []` y `$IMPL_TASKS = []`. No emitir error.

#### 2d. Localizar políticas del proyecto y extraer criterios DoD CODE-REVIEW

Buscar los siguientes archivos en el repositorio:
- `docs/constitution.md` (o ruta alternativa detectada). Si no existe, buscar la ruta heredada `docs/policies/constitution.md`; si existe, usarla y emitir `⚠️ policies/constitution.md está deprecado — muévelo a la raíz de docs/ (constitution.md)`
- El DoD de la etapa `code-review`, resuelto según `## DoD aplicable` (config → convención; por defecto `docs/guardrails/dod-story-code-review.md`)

Registrar las rutas resueltas como `$CONSTITUTION_PATH` y `$DOD_PATH`.

**Extracción de criterios DoD CODE-REVIEW:**

**Si `$DOD_PATH` está vacío o el archivo no existe:**
```
⚠️ DoD de la etapa code-review no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic
   Se omitirá la validación DoD CODE-REVIEW
```
Registrar internamente `$DOD_CODE_REVIEW_CRITERIA = []` y continuar.

**Si el archivo existe:** extraer todas sus líneas `- [ ] <texto>` y `- [x] <texto>`, con su número de línea en el archivo, como lista de criterios planos; registrar internamente como `$DOD_CODE_REVIEW_CRITERIA` y registrar su `enforcement` (`error` bloquea la aprobación; `warn` solo informa). Un criterio `Se cumple [[dod-story-implement]]` se evalúa contra el DoD de la etapa `implement`, resuelto con la misma precedencia.

#### 2e. Leer testcases.md (si disponible)

**Si `$TESTCASES_AVAILABLE = true`:** leer `testcases.md` y extraer:
- Tabla de casos de prueba (ID, Tipo, Escenario, Dado, Cuando, Entonces, Ref) → registrar como `$TESTCASES_DATA`
- Resumen de cobertura por tipo (UT/CT/IT/API/E2E/EV) → registrar como `$TESTCASES_SUMMARY`
- Checklist "Test Cases Progress" con estado de cada entrada (`[ ]`, `[x]`, `[!]`) → registrar como `$TESTCASES_PROGRESS`

**Si `$TESTCASES_AVAILABLE = false`:** registrar `$TESTCASES_DATA = []`. No emitir error.

Mostrar resumen de carga:
```
📋 Contexto cargado:
   ACs encontrados:          <N>
   Escenarios Gherkin:       <N>
   implement-report.md:      ✓ (<N> archivos implementados) | ⏭️ no disponible
   testcases.md:             ✓ (<N> casos de prueba) | ⏭️ no disponible
   constitution.md:          <ruta>
   DoD code-review:          <ruta>
   DoD CODE-REVIEW: <N criterios cargados | ⚠️ no encontrado>
```

---

### Paso 3 — Preparar ejecución paralela

#### 3a. Limpiar directorio temporal (idempotencia)

Eliminar el directorio `.tmp/story-code-review/{story_id}/` si existe y recrearlo vacío, tanto al iniciar como al reanudar. Lanzar de nuevo los cuatro revisores; no reutilizar informes parciales de la ejecución interrumpida.

Esto impide que un informe anterior, aunque parezca válido, se consolide con evidencia de una ejecución nueva (NF-2).

#### 3b. Lanzar cuatro agentes en paralelo

> **Mecanismo de invocación:** cada agente local se lanza leyendo su archivo `agents/<nombre>.agent.md` y creando un subagente `general-purpose` cuyo prompt es el contenido del archivo más el bloque de contexto con las variables resueltas. El subagente escribe en el `output:` declarado en su frontmatter y devuelve el control. Ver contrato completo en `docs/guides/best-practices-for-skills.md` (ADR-0002).

Lanzar simultáneamente los siguientes subagentes, pasando a cada agente:
- `$STORY_DIR`: ruta del directorio de la historia
- `$REPO_PATH`: ruta raíz del repositorio (`$REPO_ROOT`)
- `$CONSTITUTION_PATH`: ruta a constitution.md
- `$DOD_PATH`: ruta al DoD de la etapa code-review (`dod-story-code-review.md` o el override de `sddf.config.yaml`)
- `$IMPL_REPORT_AVAILABLE`: flag booleano de disponibilidad de implement-report.md
- `$TESTCASES_AVAILABLE`: flag booleano de disponibilidad de testcases.md
- `$IMPL_FILES`: lista de archivos implementados (extraída en el Paso 2c; puede estar vacía)

> **Principio compartido — Estándar de aprobación:** los cuatro agentes aplican el mismo criterio: aprobar cuando el cambio mejora claramente la salud del código, sin bloquear por preferencia personal ni por buscar la solución perfecta. El texto completo está duplicado en la sección "Estándar de aprobación" de cada `agents/*.agent.md` (los subagentes no heredan el contexto de este SKILL.md).

**Agente 1 — Tech-Lead-Reviewer** (`agents/tech-lead-reviewer.agent.md`):
- Revisa calidad, legibilidad, duplicación y seguridad del código fuente
- Output: `.tmp/story-code-review/{story_id}/tech-lead-report.md`

**Agente 2 — Product-Owner-Reviewer** (`agents/product-owner-reviewer.agent.md`):
- Verifica que cada escenario Gherkin tiene correspondencia en el código
- Output: `.tmp/story-code-review/{story_id}/product-owner-report.md`

**Agente 3 — Integration-Reviewer** (`agents/integration-reviewer.agent.md`):
- Valida que los componentes respetan la arquitectura de design.md
- Output: `.tmp/story-code-review/{story_id}/integration-report.md`

**Agente 4 — Security-Reviewer** (`agents/security-reviewer.agent.md`):
- Audita los archivos de la historia contra los checklists de seguridad que existan en el contexto de ejecución (`docs/policies/*security-checklist*.md`, o el checklist de un skill de seguridad instalado, que **lee** como fuente de reglas sin invocarlo); si no encuentra ninguno, aplica su baseline embebido
- Output: `.tmp/story-code-review/{story_id}/security-report.md`

Mostrar progreso:
```
⚙️  Agentes lanzados en paralelo...
   🔍 Tech-Lead-Reviewer     → analizando calidad de código
   📋 Product-Owner-Reviewer → verificando cobertura de requisitos
   🏗️  Integration-Reviewer   → validando integración con design.md
   🔒 Security-Reviewer      → auditando seguridad de los archivos de la historia
```

Esperar a que los cuatro finalicen antes de continuar.

---

### Paso 4 — Consolidar resultados (árbitro)

#### 4a. Leer los cuatro informes

Leer los archivos de `.tmp/story-code-review/{story_id}/`:
- `tech-lead-report.md`
- `product-owner-report.md`
- `integration-report.md`
- `security-report.md`

**Si algún informe de agente falta o tiene frontmatter inválido:** registrar el nombre del revisor en `$REVIEWERS_BLOCKED`. Ese informe no aporta severidad ni hallazgos. Un informe válido conserva sus hallazgos aunque otro revisor esté bloqueado. El frontmatter válido tiene delimitadores `---`, YAML legible, `status` conforme al contrato local del revisor y `max-severity` en `HIGH`, `MEDIUM`, `LOW`, `ninguna`. El informe de seguridad requiere además `checklist-sources` y `rules-evaluated` según su contrato. No inferir severidad de un informe inválido.

Del `security-report.md` válido, registrar además los campos `checklist-sources` y `rules-evaluated` de su frontmatter para el reporte final. Si está bloqueado, mostrar `no disponible` y `0` respectivamente, sin inventar evidencia de seguridad.

#### 4b. Calcular severidad máxima

Para cada informe válido de agente, leer el campo `max-severity` del frontmatter.

Orden de severidad: `HIGH > MEDIUM > LOW > ninguna`

```
max_severity = máxima severidad entre los informes válidos (o `ninguna` si no hay ninguno)
```

#### 4c. Derivar el veredicto

Hallazgo bloqueante = severidad `HIGH` o `MEDIUM`, según la misma regla de 4e y `{{TOTAL_BLOCKING}}`. Aplicar la precedencia G-05 de `docs/policies/validation-contract-policy.md`:

| Condición | `$VERDICT` |
|---|---|
| Algún hallazgo bloqueante en los informes válidos | `NEEDS-CHANGES` |
| Sin hallazgos bloqueantes y `$REVIEWERS_BLOCKED` no vacío | `BLOCKED` |
| Sin hallazgos bloqueantes y cuatro informes válidos | `APPROVED` |

Registrar internamente:
- `$VERDICT`: `APPROVED`, `NEEDS-CHANGES` o `BLOCKED`
- `$MAX_SEVERITY`: valor calculado solo de informes válidos
- `$REVIEWERS_BLOCKED`: revisores sin informe válido
- Hallazgos consolidados por dimensión (tabla con columnas: #, Archivo:Línea, Dimensión, Severidad, Hallazgo, Recomendación)

#### 4c.1. Evaluar criterios DoD CODE-REVIEW

**Si `$DOD_CODE_REVIEW_CRITERIA` está vacío** (no se cargó en el Paso 2d):
- Registrar `$DOD_CODE_REVIEW_RESULT = []`
- No modificar `$MAX_SEVERITY` ni `$VERDICT`
- Continuar al paso 4d

**Si `$DOD_CODE_REVIEW_CRITERIA` tiene criterios:**

Para cada criterio, evaluar semánticamente contra:
- El código revisado (inferido del implement-report y los informes de agentes)
- Los informes de los cuatro agentes (tech-lead-report, product-owner-report, integration-report, security-report)
- El contenido de `story.md` (criterios de aceptación, escenarios Gherkin)

Clasificar cada criterio como:
- `✓` — evidencia clara de cumplimiento en los artefactos revisados
- `❌ + severidad` — criterio claramente no cumplido; asignar severidad:
  - `HIGH`: criterios funcionales y de regresión (ej. "Gherkin pasan", "no hay regresiones")
  - `MEDIUM`: criterios de calidad de código (ej. "pasa el linter", "sin código comentado")
  - `LOW`: criterios de documentación opcionales
- `⚠️` — evidencia insuficiente o criterio no evaluable desde los artefactos disponibles (no bloquea)

**Regla de duda obligatoria:** ante incertidumbre, usar `⚠️` en lugar de `❌`.

**Criterios que requieren acceso a CI/CD o ejecución de tests:** clasificar siempre como `⚠️` con evidencia: `"Requiere acceso a CI/CD — no evaluable desde artefactos disponibles"`.

**Para cada hallazgo `❌`**, añadir a la tabla consolidada interna con:
- `Dimensión`: `DoD-CODE-REVIEW`
- `Archivo:Línea`: `<$DOD_PATH>:<número_de_línea>` (p. ej. `docs/guardrails/dod-story-code-review.md:14`)
- `Severidad`: valor asignado (HIGH/MEDIUM/LOW)
- `Hallazgo`: texto del criterio DoD
- `Acción requerida`: acción concreta derivada semánticamente del criterio

Registrar internamente `$DOD_CODE_REVIEW_RESULT` (tabla de criterio | resultado | severidad | evidencia).

**Recalcular `$MAX_SEVERITY` y `$VERDICT`** considerando todos los hallazgos (agentes válidos + DoD):
```
max_severity = máxima severidad entre hallazgos de agentes y hallazgos DoD
verdict = NEEDS-CHANGES si max_severity ∈ {HIGH, MEDIUM}
verdict = BLOCKED       si max_severity ∈ {LOW, ninguna} y $REVIEWERS_BLOCKED no está vacío
verdict = APPROVED      si max_severity ∈ {LOW, ninguna} y $REVIEWERS_BLOCKED está vacío
```

Registrar los valores actualizados como `$MAX_SEVERITY` y `$VERDICT`. Un hallazgo bloqueante tiene precedencia sobre revisores incompletos.

#### 4c.2. Verificación informativa de tamaño de cambio (no bloqueante)

Esta verificación es puramente informativa: **no participa en el cálculo de `$MAX_SEVERITY` ni `$VERDICT`** (ya cerrados en 4b/4c/4c.1).

1. Contar el número de archivos distintos en `$IMPL_FILES` (extraído en el Paso 2c desde `implement-report.md`). Registrar como `$CHANGED_FILES_COUNT`.
2. Si `$IMPL_FILES` está vacío (porque `implement-report.md` no estaba disponible), omitir esta verificación y registrar `$CHANGE_SIZE_NOTE = ""`.
3. Clasificar según umbrales:
   - `$CHANGED_FILES_COUNT ≤ 5` → sin nota (`$CHANGE_SIZE_NOTE = ""`)
   - `6 ≤ $CHANGED_FILES_COUNT ≤ 12` → `$CHANGE_SIZE_NOTE = "ℹ️ Nota informativa: tamaño de cambio aceptable (<N> archivos modificados) — sin acción requerida."`
   - `$CHANGED_FILES_COUNT > 12` → `$CHANGE_SIZE_NOTE = "⚠️ Nota informativa: tamaño de cambio elevado (<N> archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review."`

No se invoca `git diff` ni ningún comando nuevo: el conteo reutiliza `$IMPL_FILES`, ya disponible desde el Paso 2c y ya pasado al Security-Reviewer en el Paso 3b, manteniendo el orquestador sin lógica de Bash propia.

#### 4d. Bifurcación post-árbitro

**Si `$VERDICT = NEEDS-CHANGES`:** ejecutar los pasos 4e–4g y después el Paso 5, luego saltar al Paso 7.

**Si `$VERDICT = APPROVED`:** ejecutar el Paso 4h, después los Pasos 5–6, luego el Paso 7.

**Si `$VERDICT = BLOCKED`:** no ejecutar 4e–4h ni modificar `fix-directives.md`; generar el reporte en el Paso 5, restaurar `story.md` a `IMPLEMENT/DONE` en el Paso 6 y mostrar el resumen del Paso 7. La revisión se repite cuando estén disponibles los cuatro informes válidos.

#### 4e. [NEEDS-CHANGES] Construir lista blanca de archivos

Iterar los hallazgos consolidados filtrando solo los de `Severidad ∈ {HIGH, MEDIUM}`:

1. Para cada hallazgo bloqueante, extraer la parte de archivo de la columna `Archivo:Línea` (texto antes del primer `:`).
2. Si `Archivo:Línea` está vacío o ausente para un hallazgo, anotar `[archivo no especificado]` para ese hallazgo y excluirlo de la lista blanca sin fallar.
3. Deduplicar las rutas de archivo resultantes.
4. Para cada archivo único, registrar qué número(s) de hallazgo lo referencian: `hallazgo #N, #M`.

Registrar internamente como `$WHITELIST`: lista de `(archivo, [hallazgos])`.

#### 4f. [NEEDS-CHANGES] Calcular ronda y generar `fix-directives.md`

**4f.1 — Calcular la ronda de corrección (antes de instanciar el template):**

1. Si existe `$STORY_DIR/fix-directives.md` (rechazo anterior), leer el campo `round` de su frontmatter.
2. `$PREV_ROUND` = ese valor si es un entero ≥ 1; en cualquier otro caso (archivo inexistente, campo ausente, valor no entero como `abc`, `null` o `0`) → `$PREV_ROUND = 0`. No emitir error ni advertencia bloqueante: es una degradación controlada (archivos legados sin `round`).
3. `$ROUND = $PREV_ROUND + 1`.

> `story-code-review` es el **escritor único** de `round`: ningún otro skill lo crea, lo modifica ni lo completa. `round` cuenta las ejecuciones de este skill cerradas en `NEEDS-CHANGES` para la historia, sin más semántica.

**4f.2 — Instanciar el template:**

Leer `assets/fix-directives-template.md` como fuente de verdad de la estructura.

Completar el template con:
- Frontmatter: `story_id`, fecha actual, `$MAX_SEVERITY`, `round: $ROUND`
- Sección "Resumen de bloqueantes": título de la historia, severidad máxima, total de hallazgos HIGH/MEDIUM (incluyendo hallazgos DoD si los hay), `Ronda: $ROUND`
- Tabla "Instrucciones de corrección": una fila por hallazgo bloqueante (HIGH o MEDIUM) numeradas correlativamente, con columnas `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`
  - Hallazgos de agentes: `Dimensión` = dimensión del agente (code-quality, requirements-coverage, integration-architecture, security)
  - Hallazgos DoD: `Dimensión` = `DoD-CODE-REVIEW`, `Archivo:Línea` = `<$DOD_PATH>:<número_de_línea>` (p. ej. `docs/guardrails/dod-story-code-review.md:14`)
  - Todos los hallazgos se numeran correlativamente sin IDs duplicados (agentes → DoD)
- Sección "Lista blanca de archivos permitidos": una línea por archivo de `$WHITELIST` con sus referencias de hallazgo

Guardar en `$STORY_DIR/fix-directives.md`, sobreescribiendo si ya existe (la versión previa se reemplaza completa; solo `round` conserva continuidad).

Mostrar:
```
📋 Fix directives: <ruta>/fix-directives.md (ronda <N>)
```

#### 4g. [NEEDS-CHANGES] Retroceder story.md y determinar ejecutor

Actualizar el frontmatter de `story.md`:
- `status: READY-FOR-IMPLEMENT`
- `substatus: DONE`

Calcular `$TASKS_EXISTS = true` si existe `$STORY_DIR/tasks.md`, `false` si no. Este skill **no escribe** en ese archivo bajo ninguna condición: la señal de rework es la presencia de `fix-directives.md`, no una tarea.

Mostrar:
```
⚠️  Veredicto: NEEDS-CHANGES — story.md → READY-FOR-IMPLEMENT/DONE
🔁 Ronda de corrección: <N>
→ Ejecuta /story-implement <story_id>
   Alternativa (tasks.md presente): /story-implement-tasks <story_id>      (solo si $TASKS_EXISTS = true)
```

Ningún ejecutor se invoca automáticamente: la historia queda encolada en `READY-FOR-IMPLEMENT`.

#### 4h. [APPROVED] Limpiar fix-directives.md residual

Si existe `$STORY_DIR/fix-directives.md` (de una revisión anterior con bloqueantes), eliminarlo antes de continuar.

Mostrar (solo si se eliminó):
```
🗑️  fix-directives.md eliminado (revisión anterior superada)
```

---

### Paso 5 — Generar `code-review-report.md`

#### 5a. Leer template

Leer `assets/code-review-report-template.md` como fuente de verdad de la estructura del output.

#### 5b. Completar y guardar

Completar el template con:
- Frontmatter: `story_id`, `$VERDICT`, fecha actual, `$MAX_SEVERITY`
- Sección `## Veredicto`: primera sección tras el título. La línea `` **Veredicto:** `{{VERDICT}}` — {{VERDICT_REASON}} `` usa estos motivos:
  - `APPROVED`: `Sin hallazgos bloqueantes (severidad máxima: <LOW | ninguna>).`
  - `NEEDS-CHANGES`: `<N> hallazgo(s) bloqueante(s) (severidad máxima: <HIGH | MEDIUM>).` `<N>` cuenta los hallazgos `HIGH`/`MEDIUM` de agentes válidos y DoD.
  - `BLOCKED`: `Revisión incompleta: <nombres de los revisores sin informe válido>.`
  - `{{DECISION_RATIONALE}}` explica el resultado en una o dos frases, incluido el revisor bloqueado y la precedencia de `NEEDS-CHANGES` cuando corresponda.
- Sección Resumen: título de la historia, revisores (los cuatro), severidad máxima
  - `{{TESTCASES_STATUS}}`: `✓ analizado (<N> casos — UT:<N>/CT:<N>/IT:<N>/API:<N>/E2E:<N>/EV:<N>)` si `$TESTCASES_AVAILABLE = true`; o `⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica` si `$TESTCASES_AVAILABLE = false`
- Sección Hallazgos por dimensión: insertar **solo** la tabla de `## Hallazgos` de cada informe parcial válido en `{{TECH_LEAD_FINDINGS}}`, `{{PRODUCT_OWNER_FINDINGS}}`, `{{INTEGRATION_FINDINGS}}` y `{{SECURITY_FINDINGS}}`; nunca copiar su frontmatter ni `## Veredicto`. Para un revisor bloqueado, indicar `⚠️ Informe no disponible o frontmatter inválido: <revisor>` en su dimensión.
- Sección `### Seguridad (Security-Reviewer)` — `{{SECURITY_FINDINGS}}`: contenido de la sección "Hallazgos" de `security-report.md`, precedido por una línea `**Fuentes de checklist:** <checklist-sources> (<rules-evaluated> reglas evaluadas)` con los valores leídos en el Paso 4a
- Sección `### Cobertura de Casos de Prueba (testcases.md)` — `{{TESTCASES_COVERAGE_SECTION}}`:
  - **Si `$TESTCASES_AVAILABLE = false`:** `⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.`
  - **Si `$TESTCASES_AVAILABLE = true`:** extraer y mostrar los hallazgos de la sección "Hallazgos — Cobertura en testcases.md" del `product-owner-report.md` y los hallazgos de la sección "Hallazgos — Trazabilidad de diseño en testcases.md" del `integration-report.md`
  - Si alguno de esos informes está en `$REVIEWERS_BLOCKED`, indicar que su cobertura no pudo evaluarse; no atribuirle cobertura completa.
- Sección `### Nota de Tamaño de Cambio` — `{{CHANGE_SIZE_NOTE}}`: contenido de `$CHANGE_SIZE_NOTE` calculado en el Paso 4c.2; si está vacío, dejar la sección sin contenido visible (no mostrar el placeholder literal)
- Sección "Cumplimiento DoD — Fase CODE-REVIEW":
  - **Si `$DOD_CODE_REVIEW_CRITERIA` estaba vacío:** mostrar `⚠️ DoD CODE-REVIEW no encontrado — se omitió la validación. Verifica que existe el DoD de la etapa code-review (ver `## DoD aplicable`).`
  - **Si hay criterios evaluados:** completar tabla `| # | Criterio | Estado | Severidad | Evidencia |` con los resultados de `$DOD_CODE_REVIEW_RESULT` y línea de resumen `**Resumen:** N/Total criterios ✓`

Guardar en `$STORY_DIR/code-review-report.md`.

Mostrar:
```
📄 Reporte generado: <ruta>/code-review-report.md (verdict: <VERDICT>)
```

---

### Paso 6 — Actualizar frontmatter de `story.md`

**Solo si `$VERDICT = APPROVED`:**

Actualizar el frontmatter de `story.md`:
- `status: CODE-REVIEW`
- `substatus: DONE`

Mostrar:
```
📋 Estado story.md: CODE-REVIEW/DONE ✓
```

**Si `$VERDICT = NEEDS-CHANGES`:** el frontmatter ya fue actualizado a `READY-FOR-IMPLEMENT/DONE` en el Paso 4g. No ejecutar este paso.

**Si `$VERDICT = BLOCKED`:** actualizar el frontmatter a `IMPLEMENT/DONE` (volver al estado desde el que se inicia una revisión, también si esta ejecución era una reanudación). No crear `fix-directives.md` ni eliminar uno preexistente. Mostrar `📋 Estado story.md: IMPLEMENT/DONE — revisión bloqueada; vuelve a ejecutar /story-code-review <story_id> cuando se despeje el bloqueo`.

---

### Paso 7 — Mostrar resumen final

```
─────────────────────────────────────────────────────────────────────
 Code Review: <story_id> — <story_title>
─────────────────────────────────────────────────────────────────────
 Dimensión                  │ Severidad │ Hallazgos
─────────────────────────────────────────────────────────────────────
 Calidad de Código          │ <sev>     │ <N> hallazgos
 Cobertura de Requisitos    │ <sev>     │ <N> escenarios verificados
 Integración y Arquitectura │ <sev>     │ <N> hallazgos
 🔒 Seguridad               │ <sev>     │ <N> hallazgos (<N> reglas evaluadas)
 Cobertura testcases.md     │ <sev>/—   │ <N> casos analizados / ⏭️ omitido
 📦 Tamaño de cambio        │ <N> archivos │ <nota>                     (solo si $CHANGE_SIZE_NOTE no está vacío)
─────────────────────────────────────────────────────────────────────
 Severidad máxima: <max_severity>
 Veredicto:       APPROVED
─────────────────────────────────────────────────────────────────────

📄 Reporte: <ruta>/code-review-report.md
📋 Estado:  <story_id> → <nuevo_estado>
📋 DoD CODE-REVIEW: {N}/{Total} criterios ✓          (si DoD fue evaluado)
📋 DoD CODE-REVIEW: ⚠️ no evaluado (sección no encontrada)  (si DoD no disponible)

✅ Revisión aprobada — historia lista para verificación final
```

O si hay hallazgos criticos:

```
─────────────────────────────────────────────────────────────────────
 Code Review: <story_id> — <story_title>
─────────────────────────────────────────────────────────────────────
 Dimensión                  │ Severidad │ Hallazgos
─────────────────────────────────────────────────────────────────────
 Calidad de Código          │ <sev>     │ <N> hallazgos
 Cobertura de Requisitos    │ <sev>     │ <N> hallazgos
 Integración y Arquitectura │ <sev>     │ <N> hallazgos
 🔒 Seguridad               │ <sev>     │ <N> hallazgos (<N> reglas evaluadas)
 Cobertura testcases.md     │ <sev>/—   │ <N> casos analizados / ⏭️ omitido
 DoD CODE-REVIEW            │ <sev>     │ <N> criterios no cumplidos
 📦 Tamaño de cambio        │ <N> archivos │ <nota>                     (solo si $CHANGE_SIZE_NOTE no está vacío)
─────────────────────────────────────────────────────────────────────
 Severidad máxima: <max_severity>
 Veredicto:       NEEDS-CHANGES
─────────────────────────────────────────────────────────────────────

📋 Fix directives: <ruta>/fix-directives.md (ronda <N>)
📄 Reporte:        <ruta>/code-review-report.md
📋 Estado:         <story_id> → READY-FOR-IMPLEMENT/DONE
📋 DoD CODE-REVIEW: {N}/{Total} criterios ✓ | {N_error} criterios ❌

⚠️  Revisión completada con hallazgos críticos

<N> hallazgo(s) de severidad HIGH o MEDIUM requieren corrección.
Consulta fix-directives.md para las instrucciones de corrección.
🔁 Ronda de corrección: <N>
→ Ejecuta /story-implement {story_id}
   Alternativa (tasks.md presente): /story-implement-tasks {story_id}      (solo si $TASKS_EXISTS = true)
```

La línea de alternativa se omite por completo cuando `$TASKS_EXISTS = false`: no se menciona `/story-implement-tasks` para historias sin `tasks.md`. Al aprobar tras las correcciones, `/story-code-review` elimina `fix-directives.md` (Paso 4h).

Si `$VERDICT = BLOCKED`, mostrar `Veredicto: BLOCKED`, nombrar los revisores de `$REVIEWERS_BLOCKED`, indicar `story.md → IMPLEMENT/DONE` y sugerir `/story-code-review <story_id>` una vez despejado el bloqueo. No mostrar instrucciones de corrección.

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente. No generar archivos |
| Historia no encontrada | `❌ No se encontró la historia {story_id} en specs/flow/` | Detener. Sugerir `/epic-generate-stories` |
| Ruta explícita fuera de specs/flow/ | `❌ La ruta {story_path} no es una historia de specs/flow/ (se esperaba specs/flow/STORY-NNN-<slug>/)` | Detener sin escribir ningún archivo |
| `story.md` y/o `design.md` ausentes | `❌ Artefactos requeridos no encontrados en: <$STORY_DIR>/` (un único mensaje con la lista de faltantes) | Detener sin modificar ningún archivo |
| `story.md` no está en `IMPLEMENT/DONE` ni `CODE-REVIEW/IN-PROGRESS` (incluida una historia ya encolada en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md`) | `❌ La historia <story_id> no está en un estado válido para revisar.` | Detener sin modificar ningún archivo; no recalcular `round` ni eliminar `fix-directives.md` |
| `implement-report.md` o `testcases.md` ausentes | — (se registran como `⏭️` en el informe) | Continuar sin ese contexto |
| DoD de la etapa code-review ausente | `⚠️ DoD de la etapa code-review no encontrado …` | Advertir y continuar sin validación DoD |
| Informe de revisor ausente o con frontmatter inválido, sin otros hallazgos bloqueantes | `Veredicto: BLOCKED` con el nombre del revisor | Generar reporte y restaurar `IMPLEMENT/DONE`; no generar `fix-directives.md` |
| Hallazgo bloqueante sin `Archivo:Línea` (Paso 4e) | — (se anota `[archivo no especificado]`) | Excluirlo de la lista blanca y continuar |
| `fix-directives.md` previo con `round` ausente o ilegible (Paso 4f.1) | — (sin error ni advertencia: archivo legado) | `$PREV_ROUND = 0`: la cuenta de rondas se reinicia en 1 |

---

## Salida

| Artefacto | Condición |
|-----------|-----------|
| `specs/flow/<STORY-NNN>-<slug>/code-review-report.md` | Siempre |
| `specs/flow/<STORY-NNN>-<slug>/fix-directives.md` | Solo si `NEEDS-CHANGES`; incluye `round` (escritor único: este skill); es la señal de rework que consumen `story-implement` y `story-implement-tasks`. Se elimina en `APPROVED` |
| `.tmp/story-code-review/{story_id}/tech-lead-report.md` | Temporal (intermedio) |
| `.tmp/story-code-review/{story_id}/product-owner-report.md` | Temporal (intermedio) |
| `.tmp/story-code-review/{story_id}/integration-report.md` | Temporal (intermedio) |
| `.tmp/story-code-review/{story_id}/security-report.md` | Temporal (intermedio) |

Estado final de `story.md`:
- `CODE-REVIEW/DONE` si la revisión es aprobada
- `READY-FOR-IMPLEMENT/DONE` si hay hallazgos criticos (severidad HIGH o MEDIUM)
- `IMPLEMENT/DONE` si la revisión queda `BLOCKED` por un informe ausente o inválido, sin hallazgos bloqueantes

