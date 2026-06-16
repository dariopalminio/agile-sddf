---
name: story-code-review
description: >-
  Genera code-review-report.md con revisión multi-agente: 3 subagentes (Inspector de Código,
  Guardián de Requisitos, Inspector de Integración) + skill security-audit en paralelo.
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

Quality gate formal entre la implementación y la marca final de Done. Compatible con `/story-implement` (TDD completo) y `/story-implement-tasks` (tarea a tarea). Lanza tres subagentes revisores en paralelo, consolida sus hallazgos y genera `code-review-report.md` con la decisión final.

**Qué hace este skill:**
- Verifica precondiciones antes de revisar (fail-fast ante artefactos faltantes)
- Limpia `.tmp/story-code-review/` para garantizar idempotencia
- Lanza tres subagentes revisores en paralelo con responsabilidades exclusivas
- Consolida los informes parciales y calcula la severidad máxima
- **Si `approved`**: genera `code-review-report.md`, elimina `fix-directives.md` (si existe) y marca `story.md` como `CODE-REVIEW/DONE`
- **Si `needs-changes`**: genera `fix-directives.md`, agrega tarea "Implementar fix-directives.md" en `tasks.md` y retrocede `story.md` a `READY-FOR-IMPLEMENT/DONE`

**Qué NO hace este skill:**
- Ejecutar ni compilar código (opera sobre Markdown y texto plano únicamente)
- Aplicar automáticamente las correcciones de `fix-directives.md`
- Corregir el código implementado

### Posicionamiento

```
[story.md: IMPLEMENT/DONE]   ← precondición requerida (viene de /story-implement o /story-implement-tasks)
     ↓
story-code-review  → Quality gate: revisión multi-agente del código  ← aquí
     │   Al iniciar: story.md → CODE-REVIEW/IN-PROGRESS
     │   Al finalizar (approved): story.md → CODE-REVIEW/DONE
     │   Al finalizar (needs-changes): story.md → READY-FOR-IMPLEMENT/DONE
     ↓
[story.md: CODE-REVIEW/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story.md              → What: requisitos, criterios de aceptación, escenarios Gherkin  [Requerido]
design.md             → How: arquitectura, componentes, interfaces, decisiones técnicas [Requerido]
testcases.md          → Spec: tabla canónica de casos de prueba por tipo               [Opcional]
implement-report.md   → Done: código generado, archivos, estado por tarea              [Opcional]
code-review-report.md → Review: hallazgos por dimensión, decisión final  ← aquí
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
| `tasks.md` | Opcional | El Tech-Lead-Reviewer puede revisar calidad sin lista de tareas |
| `constitution.md` | Opcional | Mejora la revisión pero no la bloquea si no existe |
| `definition-of-done-story.md` | Opcional | Mismo caso que `constitution.md` |

> Para actualizar esta lista en el futuro, editar únicamente esta sección sin modificar el cuerpo del Paso 1.

---

## Parámetros

- `{story_id}` — identificador de la historia (ej. `FEAT-064`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional)
- `--single-agent` — modo agente único para historias ≤3 archivos modificados (lanza solo el Tech-Lead-Reviewer)

---

## Precondiciones

- `story.md` debe tener `status: IMPLEMENT` y `substatus: DONE`
- `story.md` y `design.md` deben existir en `$STORY_DIR`
- `implement-report.md` y `testcases.md` son opcionales: si no existen, el skill continúa sin bloquear

---

## Dependencias

- Skills: [`skill-preflight`, `security-audit`]
- Agentes: [`tech-lead-reviewer`], [`product-owner-reviewer`], [`integration-reviewer`]

---

## Modos de ejecución

- **Modo manual** (`/story-code-review {story_id}`): interactivo, muestra progreso de cada agente en tiempo real
- **Modo Agent** (invocado por orquestador): automático, reporta resultado consolidado al finalizar

El flujo por defecto es siempre el equipo de tres agentes. El flag `--single-agent` es la excepción para historias muy pequeñas.

---

## Restricciones / Reglas

| Evento | status | substatus |
|--------|--------|-----------|
| Precondición requerida para ejecutar | `IMPLEMENT` | `DONE` |
| Al iniciar la revisión (Paso 1) | `CODE-REVIEW` | `IN-PROGRESS` |
| Finalización aprobada (Paso 6) | `CODE-REVIEW` | `DONE` |
| Finalización con bloqueantes (Paso 4g) | `READY-FOR-IMPLEMENT` | `DONE` |

- La ejecución es idempotente: `.tmp/story-code-review/` se limpia al inicio de cada ejecución
- `story-code-review` solo puede ejecutarse si `story.md` tiene `status: IMPLEMENT` + `substatus: DONE`. Si la precondición no se cumple, la ejecución se detiene con error descriptivo.
- NO modifique ningún archivo existente en el código fuente (estamos revisando el código de la implementación, no implementando los artefactos técnicos)
- NO genere código; estamos revisando la implementación, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 1 — Resolver input y verificar precondiciones

#### 1a. Argumentos aceptados

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas revisar?
Proporciona el ID (ej. FEAT-064) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID
3. Si no se encuentra:
   ```
   ❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/
   Verifica el ID o ejecuta /release-generate-stories para generarla.
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

Leer el frontmatter de `story.md` y verificar `status: IMPLEMENT` y `substatus: DONE`.

**Si la precondición NO se cumple:**
```
❌ La historia <story_id> no está en estado IMPLEMENT/DONE.

   Estado actual: status: <valor_actual> / substatus: <valor_actual>

   story-code-review requiere que /story-implement o /story-implement-tasks haya completado exitosamente.
   Sugerencia: ejecuta /story-implement {story_id} o /story-implement-tasks {story_id} para completar la implementación.
```
Detener la ejecución **sin modificar ningún archivo**.

#### 1e. Actualizar frontmatter a CODE-REVIEW/IN-PROGRESS

Solo después de que los pasos 1c y 1d han pasado sin error, actualizar el frontmatter de `story.md`:
- `status: CODE-REVIEW`
- `substatus: IN-PROGRESS`

Mostrar confirmación de inicio:
```
🔍 Iniciando revisión de código para: <story_id>
   Directorio: <ruta_directorio>
   Artefactos requeridos: story.md ✓ | design.md ✓
   Artefactos opcionales: implement-report.md ✓/⏭️ | testcases.md ✓/⏭️
   Estado: IMPLEMENT/DONE ✓
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
- `docs/policies/constitution.md` (o ruta alternativa detectada)
- `docs/policies/definition-of-done-story.md` (o ruta alternativa detectada)

Registrar las rutas resueltas como `$CONSTITUTION_PATH` y `$DOD_PATH`.

**Extracción de criterios DoD CODE-REVIEW:**

**Si `$DOD_PATH` está vacío o el archivo no existe:**
```
⚠️ definition-of-done-story.md no encontrado — se omitirá la validación DoD CODE-REVIEW
```
Registrar internamente `$DOD_CODE_REVIEW_CRITERIA = []` y continuar.

**Si el archivo existe:**
1. Buscar el primer encabezado h3 (`###`) cuyo texto contenga, case-insensitive, alguno de los términos: `CODE-REVIEW`, `CODE REVIEW`, `REVISIÓN DE CÓDIGO` o `REVISION DE CODIGO`
2. Registrar en log el encabezado encontrado
3. **Si no se encuentra ningún encabezado coincidente:**
   ```
   ⚠️ Sección CODE-REVIEW no encontrada en DoD — se omitirá la validación DoD CODE-REVIEW
   ```
   Registrar internamente `$DOD_CODE_REVIEW_CRITERIA = []` y continuar.
4. **Si se encontró la sección:** extraer todas las líneas `- [ ] <texto>` y `- [x] <texto>` dentro de esa sección, con su número de línea en el archivo, como lista de criterios planos; registrar internamente como `$DOD_CODE_REVIEW_CRITERIA`

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
   definition-of-done-story.md:    <ruta>
   DoD CODE-REVIEW: <N criterios cargados | ⚠️ no encontrado>
```

---

### Paso 3 — Preparar ejecución paralela

#### 3a. Limpiar directorio temporal (idempotencia)

Eliminar el directorio `.tmp/story-code-review/` si existe y recrearlo vacío.

Esto garantiza que ejecuciones repetidas del skill producen el mismo resultado (NF-2).

#### 3b. Lanzar cuatro participantes en paralelo

> **Mecanismo de invocación:** cada agente local se lanza leyendo su archivo `agents/<nombre>.agent.md` y creando un subagente `general-purpose` cuyo prompt es el contenido del archivo más el bloque de contexto con las variables resueltas. El subagente escribe en el `output:` declarado en su frontmatter y devuelve el control. Ver contrato completo en `docs/knowledge/guides/best-practices-for-skills.md` (ADR-0002).

Lanzar simultáneamente los siguientes subagentes y skill, pasando a cada agente:
- `$STORY_DIR`: ruta del directorio de la historia
- `$CONSTITUTION_PATH`: ruta a constitution.md
- `$DOD_PATH`: ruta a definition-of-done-story.md
- `$IMPL_REPORT_AVAILABLE`: flag booleano de disponibilidad de implement-report.md
- `$TESTCASES_AVAILABLE`: flag booleano de disponibilidad de testcases.md

> **Principio compartido — Estándar de aprobación:** los tres agentes aplican el mismo criterio: aprobar cuando el cambio mejora claramente la salud del código, sin bloquear por preferencia personal ni por buscar la solución perfecta. El texto completo está duplicado en la sección "Estándar de aprobación" de cada `agents/*.agent.md` (los subagentes no heredan el contexto de este SKILL.md).

**Agente 1 — Tech-Lead-Reviewer** (`agents/tech-lead-reviewer.agent.md`):
- Revisa calidad, legibilidad, duplicación y seguridad del código fuente
- Output: `.tmp/story-code-review/tech-lead-report.md`

**Agente 2 — Product-Owner-Reviewer** (`agents/product-owner-reviewer.agent.md`):
- Verifica que cada escenario Gherkin tiene correspondencia en el código
- Output: `.tmp/story-code-review/product-owner-report.md`

**Agente 3 — Integration-Reviewer** (`agents/integration-reviewer.agent.md`):
- Valida que los componentes respetan la arquitectura de design.md
- Output: `.tmp/story-code-review/integration-report.md`

**Participante 4 — Security-Audit** (skill `security-audit`):
- Invocación: `security-audit --repo $SDDF_ROOT --story $STORY_DIR`
- Resuelve archivos modificados por la historia via git diff o tasks.md (delegado al skill)
- Output: `.tmp/security-audit/audit-report.md`

Mostrar progreso:
```
⚙️  Agentes lanzados en paralelo...
   🔍 Tech-Lead-Reviewer     → analizando calidad de código
   📋 Product-Owner-Reviewer → verificando cobertura de requisitos
   🏗️  Integration-Reviewer   → validando integración con design.md
   🔒 Security-Audit         → analizando archivos modificados
```

Esperar a que los cuatro finalicen antes de continuar.

---

### Paso 4 — Consolidar resultados (árbitro)

#### 4a. Leer los cuatro informes

Leer los archivos de `.tmp/story-code-review/`:
- `tech-lead-report.md`
- `product-owner-report.md`
- `integration-report.md`

**Si algún informe de agente falta o tiene frontmatter inválido:**
Asumir `max-severity: HIGH` para ese agente (fail-safe).

Leer `.tmp/security-audit/audit-report.md` y determinar `$SECURITY_STATUS`:
- Si el archivo **no existe** o contiene `source_files_found: false` → registrar `$SECURITY_STATUS = skipped`
- Si el archivo existe y contiene `status: PASS` → registrar `$SECURITY_STATUS = pass`
- Si el archivo existe y contiene `status: FAIL` → registrar `$SECURITY_STATUS = fail`

#### 4b. Calcular severidad máxima

Para cada informe de agente, leer el campo `max-severity` del frontmatter.

Incluir la severidad de security-audit según `$SECURITY_STATUS`:
- `$SECURITY_STATUS = fail` → contribuye como `HIGH` al cálculo
- `$SECURITY_STATUS = pass` → sin contribución a la severidad
- `$SECURITY_STATUS = skipped` → sin contribución a la severidad

Orden de severidad: `HIGH > MEDIUM > LOW > ninguna`

```
max_severity = máxima severidad entre los cuatro participantes (tres agentes + security-audit)
```

#### 4c. Derivar review-status

```
review-status = approved      si max_severity ∈ {LOW, ninguna}
review-status = needs-changes  si max_severity ∈ {HIGH, MEDIUM}
```

Registrar internamente:
- `$REVIEW_STATUS`: `approved` o `needs-changes`
- `$MAX_SEVERITY`: valor calculado (considera los cuatro participantes)
- `$SECURITY_STATUS`: `pass`, `fail` o `skipped`
- Hallazgos consolidados por dimensión (tabla con columnas: #, Archivo:Línea, Dimensión, Severidad, Hallazgo, Recomendación)

#### 4c.1. Evaluar criterios DoD CODE-REVIEW

**Si `$DOD_CODE_REVIEW_CRITERIA` está vacío** (no se cargó en el Paso 2d):
- Registrar `$DOD_CODE_REVIEW_RESULT = []`
- No modificar `$MAX_SEVERITY` ni `$REVIEW_STATUS`
- Continuar al paso 4d

**Si `$DOD_CODE_REVIEW_CRITERIA` tiene criterios:**

Para cada criterio, evaluar semánticamente contra:
- El código revisado (inferido del implement-report y los informes de agentes)
- Los informes de los tres agentes (tech-lead-report, product-owner-report, integration-report)
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
- `Archivo:Línea`: `docs/policies/definition-of-done-story.md:<número_de_línea>`
- `Severidad`: valor asignado (HIGH/MEDIUM/LOW)
- `Hallazgo`: texto del criterio DoD
- `Acción requerida`: acción concreta derivada semánticamente del criterio

Registrar internamente `$DOD_CODE_REVIEW_RESULT` (tabla de criterio | resultado | severidad | evidencia).

**Recalcular `$MAX_SEVERITY` y `$REVIEW_STATUS`** considerando todos los hallazgos (agentes + DoD):
```
max_severity = máxima severidad entre hallazgos de agentes y hallazgos DoD
review-status = approved      si max_severity ∈ {LOW, ninguna}
review-status = needs-changes  si max_severity ∈ {HIGH, MEDIUM}
```

Registrar los valores actualizados como `$MAX_SEVERITY` y `$REVIEW_STATUS`.

#### 4c.2. Verificación informativa de tamaño de cambio (no bloqueante)

Esta verificación es puramente informativa: **no participa en el cálculo de `$MAX_SEVERITY` ni `$REVIEW_STATUS`** (ya cerrados en 4b/4c/4c.1).

1. Contar el número de archivos distintos en `$IMPL_FILES` (extraído en el Paso 2c desde `implement-report.md`). Registrar como `$CHANGED_FILES_COUNT`.
2. Si `$IMPL_FILES` está vacío (porque `implement-report.md` no estaba disponible), omitir esta verificación y registrar `$CHANGE_SIZE_NOTE = ""`.
3. Clasificar según umbrales:
   - `$CHANGED_FILES_COUNT ≤ 5` → sin nota (`$CHANGE_SIZE_NOTE = ""`)
   - `6 ≤ $CHANGED_FILES_COUNT ≤ 12` → `$CHANGE_SIZE_NOTE = "ℹ️ Nota informativa: tamaño de cambio aceptable (<N> archivos modificados) — sin acción requerida."`
   - `$CHANGED_FILES_COUNT > 12` → `$CHANGE_SIZE_NOTE = "⚠️ Nota informativa: tamaño de cambio elevado (<N> archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review."`

No se invoca `git diff` ni ningún comando nuevo: el conteo reutiliza `$IMPL_FILES`, ya disponible desde el Paso 2c, evitando duplicar lo que `security-audit` resuelve internamente y manteniendo el orquestador sin lógica de Bash propia.

#### 4d. Bifurcación post-árbitro

**Si `$REVIEW_STATUS = needs-changes`:** ejecutar los pasos 4e–4g y después el Paso 5, luego saltar al Paso 7.

**Si `$REVIEW_STATUS = approved`:** ejecutar el Paso 4h, después los Pasos 5–6, luego el Paso 7.

#### 4e. [needs-changes] Construir lista blanca de archivos

Iterar los hallazgos consolidados filtrando solo los de `Severidad ∈ {HIGH, MEDIUM}`:

1. Para cada hallazgo bloqueante, extraer la parte de archivo de la columna `Archivo:Línea` (texto antes del primer `:`).
2. Si `Archivo:Línea` está vacío o ausente para un hallazgo, anotar `[archivo no especificado]` para ese hallazgo y excluirlo de la lista blanca sin fallar.
3. Deduplicar las rutas de archivo resultantes.
4. Para cada archivo único, registrar qué número(s) de hallazgo lo referencian: `hallazgo #N, #M`.

Registrar internamente como `$WHITELIST`: lista de `(archivo, [hallazgos])`.

#### 4f. [needs-changes] Generar `fix-directives.md`

Leer `assets/fix-directives-template.md` como fuente de verdad de la estructura.

Completar el template con:
- Frontmatter: `story_id`, fecha actual, `$MAX_SEVERITY`
- Sección "Resumen de bloqueantes": título de la historia, severidad máxima, total de hallazgos HIGH/MEDIUM (incluyendo hallazgos DoD si los hay)
- Tabla "Instrucciones de corrección": una fila por hallazgo bloqueante (HIGH o MEDIUM) numeradas correlativamente, con columnas `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`
  - Hallazgos de agentes: `Dimensión` = nombre del agente (code-quality, requirements-coverage, integration-architecture)
  - Hallazgos DoD: `Dimensión` = `DoD-CODE-REVIEW`, `Archivo:Línea` = `docs/policies/definition-of-done-story.md:<número_de_línea>`
  - Hallazgos de security-audit (si `$SECURITY_STATUS = fail`): `Dimensión` = `security-audit`; `Archivo:Línea` = valor del campo en `audit-report.md` cuando esté disponible, o `audit-report.md` cuando no haya ubicación específica
  - Todos los hallazgos se numeran correlativamente sin IDs duplicados (agentes → DoD → security-audit)
- Sección "Lista blanca de archivos permitidos": una línea por archivo de `$WHITELIST` con sus referencias de hallazgo

Guardar en `$STORY_DIR/fix-directives.md`, sobreescribiendo si ya existe.

Mostrar:
```
📋 Fix directives: <ruta>/fix-directives.md
```

#### 4g. [needs-changes] Registrar tarea en `tasks.md` y retroceder story.md

**4g.1 — Agregar tarea en `tasks.md`:**

Si existe `$STORY_DIR/tasks.md`, agregar al final del archivo la siguiente línea:

```
- [ ] Implementar fix-directives.md
```

Si `tasks.md` no existe, omitir este sub-paso sin error.

Mostrar:
```
📝 Tarea agregada en tasks.md: "Implementar fix-directives.md"
```

**4g.2 — Retroceder story.md a READY-FOR-IMPLEMENT/DONE:**

Actualizar el frontmatter de `story.md`:
- `status: READY-FOR-IMPLEMENT`
- `substatus: DONE`

Mostrar:
```
⚠️  Review: needs-changes — story.md → READY-FOR-IMPLEMENT/DONE
→ Revisa: <ruta>/fix-directives.md
```

#### 4h. [approved] Limpiar fix-directives.md residual

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
- Frontmatter: `story_id`, `$REVIEW_STATUS`, fecha actual, `$MAX_SEVERITY`
- Sección Resumen: título de la historia, revisores, severidad máxima
  - `{{TESTCASES_STATUS}}`: `✓ analizado (<N> casos — UT:<N>/CT:<N>/IT:<N>/API:<N>/E2E:<N>/EV:<N>)` si `$TESTCASES_AVAILABLE = true`; o `⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica` si `$TESTCASES_AVAILABLE = false`
- Sección Hallazgos por dimensión: contenido de cada informe parcial
- Sección `### Cobertura de Casos de Prueba (testcases.md)` — `{{TESTCASES_COVERAGE_SECTION}}`:
  - **Si `$TESTCASES_AVAILABLE = false`:** `⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.`
  - **Si `$TESTCASES_AVAILABLE = true`:** extraer y mostrar los hallazgos de la sección "Hallazgos — Cobertura en testcases.md" del `product-owner-report.md` y los hallazgos de la sección "Hallazgos — Trazabilidad de diseño en testcases.md" del `integration-report.md`
- Sección `### Nota de Tamaño de Cambio` — `{{CHANGE_SIZE_NOTE}}`: contenido de `$CHANGE_SIZE_NOTE` calculado en el Paso 4c.2; si está vacío, dejar la sección sin contenido visible (no mostrar el placeholder literal)
- Sección Decisión final: `$REVIEW_STATUS` con justificación
- Sección `## Security Audit` (inyectada dinámicamente, después de los hallazgos de los tres revisores):
  - **Si `$SECURITY_STATUS = pass`:** mostrar `✅ Security Audit: PASS` y resumen de reglas evaluadas (evaluated/pass/fail/na extraídos de `audit-report.md`)
  - **Si `$SECURITY_STATUS = fail`:** mostrar `❌ Security Audit: FAIL`, resumen de reglas y listado de hallazgos FAIL con archivo, descripción y recomendación
  - **Si `$SECURITY_STATUS = skipped`:** mostrar `⏭️ Security Audit: omitido — no se detectaron archivos fuente modificados`
- Sección "Cumplimiento DoD — Fase CODE-REVIEW":
  - **Si `$DOD_CODE_REVIEW_CRITERIA` estaba vacío:** mostrar `⚠️ DoD CODE-REVIEW no encontrado — se omitió la validación. Verifica que $SPECS_BASE/policies/definition-of-done-story.md contiene la sección "CODE-REVIEW".`
  - **Si hay criterios evaluados:** completar tabla `| # | Criterio | Estado | Severidad | Evidencia |` con los resultados de `$DOD_CODE_REVIEW_RESULT` y línea de resumen `**Resumen:** N/Total criterios ✓`

Guardar en `$STORY_DIR/code-review-report.md`.

Mostrar:
```
📄 Reporte generado: <ruta>/code-review-report.md
```

---

### Paso 6 — Actualizar frontmatter de `story.md`

**Solo si `$REVIEW_STATUS = approved`:**

Actualizar el frontmatter de `story.md`:
- `status: CODE-REVIEW`
- `substatus: DONE`

Mostrar:
```
📋 Estado story.md: CODE-REVIEW/DONE ✓
```

**Si `$REVIEW_STATUS = needs-changes`:** el frontmatter ya fue actualizado a `READY-FOR-IMPLEMENT/DONE` en el Paso 4g.2. No ejecutar este paso.

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
 Cobertura testcases.md     │ <sev>/—   │ <N> casos analizados / ⏭️ omitido
 🔒 Security Audit          │ PASS      │ <N> reglas evaluadas          (si ejecutó y pasó)
 🔒 Security Audit          │ FAIL      │ <N> hallazgos de seguridad    (si ejecutó y falló)
 🔒 Security Audit          │ —         │ omitido                       (si skipped)
 📦 Tamaño de cambio        │ <N> archivos │ <nota>                     (solo si $CHANGE_SIZE_NOTE no está vacío)
─────────────────────────────────────────────────────────────────────
 Severidad máxima: <max_severity>
 Review status:   <review_status>
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
 Cobertura testcases.md     │ <sev>/—   │ <N> casos analizados / ⏭️ omitido
 DoD CODE-REVIEW            │ <sev>     │ <N> criterios no cumplidos
 🔒 Security Audit          │ FAIL      │ <N> hallazgos de seguridad    (si ejecutó y falló)
 🔒 Security Audit          │ —         │ omitido                       (si skipped)
 📦 Tamaño de cambio        │ <N> archivos │ <nota>                     (solo si $CHANGE_SIZE_NOTE no está vacío)
─────────────────────────────────────────────────────────────────────
 Severidad máxima: <max_severity>
 Review status:   needs-changes
─────────────────────────────────────────────────────────────────────

📋 Fix directives: <ruta>/fix-directives.md
📄 Reporte:        <ruta>/code-review-report.md
📋 Estado:         <story_id> → READY-FOR-IMPLEMENT/DONE
📋 DoD CODE-REVIEW: {N}/{Total} criterios ✓ | {N_error} criterios ❌

⚠️  Revisión completada con hallazgos críticos

<N> hallazgo(s) de severidad HIGH o MEDIUM requieren corrección.
Consulta fix-directives.md para las instrucciones de corrección.
Ejecuta /story-code-review {story_id} nuevamente tras corregir los hallazgos.
```

---

## Salida

| Artefacto | Condición |
|-----------|-----------|
| `$SPECS_BASE/specs/stories/FEAT-NNN/code-review-report.md` | Siempre |
| `$SPECS_BASE/specs/stories/FEAT-NNN/fix-directives.md` | Solo si `needs-changes` |
| `.tmp/story-code-review/tech-lead-report.md` | Temporal (intermedio) |
| `.tmp/story-code-review/product-owner-report.md` | Temporal (intermedio) |
| `.tmp/story-code-review/integration-report.md` | Temporal (intermedio) |
| `.tmp/security-audit/audit-report.md` | Temporal (si `$SECURITY_STATUS ≠ skipped`) |

Estado final de `story.md`:
- `CODE-REVIEW/DONE` si la revisión es aprobada
- `READY-FOR-IMPLEMENT/DONE` si hay hallazgos criticos (severidad HIGH o MEDIUM)
