---
name: story-verify
description: >-
  Genera verify-report.md ejecutando la fase VERIFY del pipeline SDD (detecta modo: unit/e2e/manual).
  Usar después de story-code-review antes de ACCEPTANCE.
  Invocar para "story-verify", "verificar historia", "ejecutar pruebas",
  "fase VERIFY" o "validar criterios de prueba".
triggers:
  - story-verify
  - /story-verify
  - verificar historia
  - ejecutar pruebas de historia
  - fase VERIFY
---

# Skill: `/story-verify`

## Objetivo

Orquesta la fase VERIFY del pipeline SDD: detecta el modo de ejecución (delegado, automatico-e2e, automatico-unit, manual), ejecuta o guía las pruebas, evalúa los criterios del DoD VERIFY, genera `verify-report.md` y actualiza el frontmatter de `story.md`.

## Posicionamiento

```
[story.md: CODE-REVIEW/DONE]          ← viene de story-code-review
     ↓
story-verify    ← aquí
     │   Al iniciar: story.md → VERIFY/IN-PROGRESS
     │   Si todos los criterios DoD pasan: → VERIFY/DONE
     │   Si criterios DoD fallan: → READY-FOR-IMPLEMENT/DONE
     │   Si estado incorrecto: → error, sin cambio
     ↓
[story.md: VERIFY/DONE]
```

## Entrada

- `$SPECS_BASE/specs/stories/<story-id>/story.md` — historia a verificar (precondición de estado)
- `$SPECS_BASE/policies/definition-of-done-story.md` — criterios DoD sección VERIFY (opcional; usa fallback genérico si no existe)
- `$SDDF_ROOT/sddf.config.yaml` — configuración de pruebas del proyecto (opcional; si existe y contiene tests `required: true`, tiene prioridad sobre la detección automática)
- Archivos de configuración de test en el directorio del proyecto (`pytest.ini`, `jest.config.*`, `playwright.config.*`, etc.) — para detección de modo automático (fallback cuando sddf.config.yaml no existe)
- `.tmp/story-verify/qa-input.json` / `qa-output.json` — canal de comunicación con el agente QA (solo modo manual)
- `assets/verify-report-template.md` — template del reporte

## Parámetros

- `--story <ID>` o primer argumento posicional: ID de la historia a verificar
- `--mode manual`: forzar modo interactivo aunque existan tests automáticos
- `--mode auto`: forzar ejecución automática (falla si no hay tests configurados)
- `--dry-run`: simula la ejecución sin escribir archivos ni ejecutar tests
- `--verbose`: muestra salida completa de los comandos de prueba

## Dependencias

- Skills: [`skill-preflight`]
- Agentes: [`agents/qa-engineer.agent.md`] (modo manual y e2e-assessment)
- Herramientas de testing (según modo detectado): `pytest`, `jest`, `vitest`, `go test`, `npx playwright`, `npx cypress`, `npx cucumber-js`
- Archivos de entrada: `$SPECS_BASE/policies/definition-of-done-story.md`, `assets/verify-report-template.md`

## Modos de ejecución

| Modo | Condición de activación | Prioridad |
|---|---|---|
| **config-driven** | `sddf.config.yaml` existe con al menos un test `required: true` en la sección `verify` | 0 (máxima) |
| **delegado** | Existe un skill con "test"/"testing" en `.claude/skills/` | 1 |
| **automatico-e2e** | Se detecta `playwright.config.*`, `cypress.config.*` o `features/*.feature` | 2 |
| **automatico-unit** | Se detecta `pytest.ini`, `jest.config.*`, `vitest.config.*`, `go.mod`+`*_test.go`, etc. | 3 |
| **manual** | Ninguna configuración de tests detectada | 4 (fallback) |

- **Manual** (`/story-verify <id>`): interactivo, pide confirmación antes de actualizar archivos.
- **Automático**: invocado por otro skill o con `--mode auto` — no pide confirmación.
- Override: `--mode manual` o `--mode auto` sobreescribe la detección automática.

## Restricciones / Reglas

- **No modifica código fuente:** solo escribe `verify-report.md` y actualiza el frontmatter de `story.md`.
- **No genera tests:** la generación de tests es responsabilidad de `story-implement-tasks`.
- **No revisa código:** eso corresponde a `story-code-review`.
- **No despliega:** el despliegue corresponde a `story-deploy`.
- **Idempotente:** ejecutable múltiples veces; sobreescribe `verify-report.md` preservando el historial de ejecuciones anteriores.
- **Precondición de estado:** solo ejecuta si `story.md` tiene `status: CODE-REVIEW/DONE` o `IMPLEMENT/DONE`; cualquier otro estado detiene la ejecución con error descriptivo sin modificar archivos.
- **DoD dinámico:** los criterios VERIFY se leen en runtime desde el DoD; nunca están hardcodeados en el skill.
- NO modifique ningún archivo existente en el código fuente (estamos verificando la implementación, no implementando los artefactos técnicos)
- NO genere código; estamos verificando la implementación, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

## Flujo de ejecución

### Paso 0 — Verificar entorno (skill-preflight)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No generar ningún archivo.

Usar `$SPECS_BASE` para todas las rutas en los pasos siguientes.

---

### Paso 1 — Resolver historia y verificar precondiciones

#### 1a. Resolver el story_id

Aceptar como argumento:
- `{story_id}` — identificador de la historia (ej. `FEAT-050`)
- `{story_path}` — ruta explícita al directorio de la historia (sobreescribe la resolución por glob)
- `--story <ID>` — forma larga del flag

Si no se proporcionó ningún argumento:
```
¿Qué historia deseas verificar?
Proporciona el ID (ej. FEAT-050) o la ruta completa al directorio.
```

#### 1b. Resolver el directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — primera coincidencia

Si no se encuentra:
```
❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/
```

#### 1c. Verificar existencia de story.md

Si falta `story.md`, detener con error descriptivo.

#### 1d. Verificar precondición de estado

Leer el frontmatter de `story.md` y verificar:

```
Precondición válida si:
  (status: CODE-REVIEW  AND substatus: DONE)            ← camino normal desde story-code-review
  OR
  (status: IMPLEMENT      AND substatus: DONE)       ← mínimo aceptable (AC-4)
```

Si la precondición NO se cumple:
```
❌ La historia {story_id} no está en un estado válido para VERIFY.

   Estado actual: status: {valor} / substatus: {valor}

   story-verify requiere uno de los siguientes estados:
   · CODE-REVIEW/DONE       → camino normal desde story-code-review
   · IMPLEMENT/DONE      → mínimo aceptable

   La historia {story_id} tiene status {status}/{substatus}.
   Ejecuta story-code-review antes de continuar.
```

Detener sin modificar ningún archivo.

Mostrar confirmación de inicio:
```
🚀 Iniciando verificación para: {story_id}
   Directorio: {ruta}
   Estado válido: {status}/{substatus} ✓
```

---

### Paso 2 — Actualizar story.md → VERIFY/IN-PROGRESS

Actualizar el frontmatter de `story.md`:
- `status: VERIFY`
- `substatus: IN-PROGRESS`
- `updated: {fecha actual}`

---

### Paso 3 — Cargar DoD VERIFY

Buscar `$SPECS_BASE/policies/definition-of-done-story.md`.

**Si el archivo no existe:**
```
⚠️ definition-of-done-story.md no encontrado — usando criterios mínimos genéricos:
   1. Todos los tests del proyecto pasan
   2. Sin defectos CRITICAL o HIGH sin resolver
```
Registrar `$DOD_VERIFY_CRITERIA = ["Todos los tests del proyecto pasan", "Sin defectos CRITICAL o HIGH sin resolver"]`.

**Si el archivo existe:**
1. Buscar el primer encabezado `###` cuyo texto contenga `VERIFY` (case-insensitive)
2. Si no se encuentra:
   ```
   ⚠️ Sección VERIFY no encontrada en DoD — usando criterios mínimos genéricos
   ```
3. Si se encuentra: extraer todas las líneas `- [ ] <texto>` como lista de criterios → `$DOD_VERIFY_CRITERIA`

Mostrar:
```
📋 DoD VERIFY: {N} criterios cargados    (si encontrado)
📋 DoD VERIFY: ⚠️ criterios mínimos     (si no encontrado)
```

---

### Paso 4 — Leer configuración de pruebas (sddf.config.yaml)

Buscar `sddf.config.yaml` en `$SDDF_ROOT`.

**Si el archivo NO existe:**
- Registrar `$CONFIG_VERIFY_FOUND = false`
- Continuar hacia Paso 5 (detección por archivos)

**Si el archivo existe:**

1. Leer `defaults.delivery-model` → `$DELIVERY_MODEL` (valores: `batch` | `continuous`; usar `batch` si el campo está ausente)
2. Leer la sección `verify` y construir `$TEST_EXECUTION_LIST`:
   - Para cada tipo de test en `verify` (unit, component, integration, contract, e2e, e2e-smoke, e2e-sanity, e2e-regression, e2e-file, performance, eval):
     - Si `required: true` → añadir a `$TEST_EXECUTION_LIST` con su `command` o `command_template`
3. Aplicar regla según `$DELIVERY_MODEL`:
   - Si `$DELIVERY_MODEL = batch` y existe `verify.e2e-regression` con `required: true` → asegurar que `e2e-regression` está en `$TEST_EXECUTION_LIST` (añadir si aún no está)
   - Si `$DELIVERY_MODEL = continuous` y existe `verify.e2e-sanity` con `required: true` → asegurar que `e2e-sanity` está en `$TEST_EXECUTION_LIST` (añadir si aún no está)
4. Si `$TEST_EXECUTION_LIST` está vacío (ningún test con `required: true`):
   ```
   ⚠️ sddf.config.yaml encontrado pero ninguna prueba marcada como required: true
      Pasando a modo de detección automática...
   ```
   → Registrar `$CONFIG_VERIFY_FOUND = false` y continuar hacia Paso 5
5. Si `$TEST_EXECUTION_LIST` tiene al menos un elemento:
   - Registrar `$CONFIG_VERIFY_FOUND = true`
   - Registrar `$MODO = config-driven`
   - Mostrar:
     ```
     📄 sddf.config.yaml encontrado — usando configuración de pruebas definida
        Delivery model: {$DELIVERY_MODEL}
        Pruebas a ejecutar ({N}): {lista de tipos separados por coma}
     ```

---

### Paso 5 — Detectar modo de ejecución

> **Solo ejecutar si `$CONFIG_VERIFY_FOUND = false`** — sddf.config.yaml no encontrado o sin pruebas requeridas configuradas.

Verificar si se pasó `--mode manual` o `--mode auto` (override explícito).

Si no hay override, detectar automáticamente en este orden (primera coincidencia gana):

#### 1. Modo delegado — skill de testing personalizado
Buscar en `.claude/skills/` un skill cuyo nombre contenga `test` o `testing`.
Si se encuentra → `$MODO = delegado`, `$SKILL_TESTING = <nombre del skill encontrado>`

#### 2. Modo automatico-e2e — frameworks E2E
Buscar cualquiera de:
- `playwright.config.ts`, `playwright.config.js`, `playwright.config.mjs`
- `cypress.config.ts`, `cypress.config.js`, `cypress.json`
- `cucumber.js`, `cucumber.cjs`, directorio `features/` con archivos `.feature`

Si se encuentra → `$MODO = automatico-e2e`, `$FRAMEWORK_E2E = <nombre detectado>`

#### 3. Modo automatico-unit — frameworks unit/integration
Buscar cualquiera de:
- `pytest.ini`, `setup.cfg` con `[tool:pytest]`, `pyproject.toml` con `[tool.pytest.ini_options]`
- `jest.config.js`, `jest.config.ts`, `jest.config.mjs`, campo `"jest"` en `package.json`
- `vitest.config.ts`, `vitest.config.js`
- `go.mod` con archivos `*_test.go`
- `.rspec`, `spec/` con `spec_helper.rb`
- `phpunit.xml`, `phpunit.xml.dist`

Si se encuentra → `$MODO = automatico-unit`, `$FRAMEWORK_UNIT = <nombre detectado>`

#### 4. Modo manual — sin configuración detectada
Si ninguna de las búsquedas anteriores produjo resultado → `$MODO = manual`

Mostrar:
```
🔍 Modo de ejecución detectado: {$MODO}
   Framework: {$FRAMEWORK_E2E | $FRAMEWORK_UNIT | qa-engineer.agent.md | $SKILL_TESTING}
```

---

### Paso 6 — Ejecutar pruebas según el modo

#### Modo: config-driven

Ejecutar cada test en `$TEST_EXECUTION_LIST` en el orden en que aparecen en la sección `verify` del config:

- Si el tipo tiene `command`: ejecutar el comando directamente.
- Si el tipo tiene `command_template` con `{{test_file_path}}`: deducir la ruta del archivo de test más relevante para la historia (buscando en el directorio del proyecto archivos de test asociados al story_id o módulo) y sustituir el placeholder antes de ejecutar.

Si la ejecución supera 30 segundos, mostrar progreso cada 15s:
```
⏳ Tests en ejecución [{tipo}]... ({N}s transcurridos)
```

Recopilar resultados acumulados de todas las ejecuciones:
- `$TOTAL_TESTS`, `$PASSED`, `$FAILED`, `$SKIPPED` — suma de todas las ejecuciones
- `$COVERAGE` — si algún runner lo reporta; usar el último valor disponible
- `$TEST_OUTPUT` — salida completa concatenada por tipo

Si un comando retorna código de error distinto de 0, registrar ese tipo como fallido pero continuar ejecutando los tipos restantes de `$TEST_EXECUTION_LIST`.

#### Modo: automatico-unit

Detectar el comando de prueba según el framework:

| Framework | Comando detectado |
|---|---|
| pytest | `python -m pytest` o `pytest` (si está en PATH) |
| jest | `npx jest` o `npm test` (si `scripts.test` existe en package.json) |
| vitest | `npx vitest run` |
| go test | `go test ./...` |
| rspec | `bundle exec rspec` |
| phpunit | `./vendor/bin/phpunit` |

Ejecutar el comando detectado.

Si la ejecución supera 30 segundos, mostrar progreso cada 15s:
```
⏳ Tests en ejecución... ({N}s transcurridos)
```

Recopilar resultados:
- `$TOTAL_TESTS`, `$PASSED`, `$FAILED`, `$SKIPPED`
- `$COVERAGE` (si el runner lo reporta)
- `$TEST_OUTPUT` (salida completa del runner)

#### Modo: automatico-e2e

Detectar el comando E2E:

| Framework | Comando |
|---|---|
| Playwright | `npx playwright test` |
| Cypress | `npx cypress run` |
| Cucumber | `npx cucumber-js` |

Ejecutar el comando. Mostrar progreso si supera 30s.

Mapear resultados a escenarios Gherkin de `story.md`:
- Si el nombre del test coincide con el título del AC → PASS/FAIL según resultado
- Si el AC no tiene test E2E correspondiente → registrar como SKIP con nota: "Sin cobertura E2E directa"

#### Modo: delegado

Invocar el skill de testing detectado: `/skill-name {story_id}`

Leer el output del skill invocado para construir los resultados.

#### Modo: manual

Preparar el directorio `.tmp/story-verify/` y verificar que puede crearse.

Si no puede crearse:
```
❌ No se puede crear el directorio .tmp/story-verify/ — verifique permisos.
   Abortando la ejecución del modo manual.
```

Si el directorio existe, proceder:

1. Leer los escenarios Gherkin de `story.md` (sección `## ✅ Criterios de aceptación`)
2. Escribir `.tmp/story-verify/qa-input.json`:
```json
{
  "story_id": "{story_id}",
  "story_title": "{story_title}",
  "mode": "manual",
  "scenarios": [/* extraídos de story.md */],
  "dod_criteria": [/* extraídos del DoD VERIFY */]
}
```
3. Invocar `agents/qa-engineer.agent.md` (modo manual)

   > **Mecanismo de invocación:** el agente local se lanza leyendo su archivo `agents/qa-engineer.agent.md` y creando un subagente `general-purpose` cuyo prompt es el contenido del archivo más el bloque de contexto con las variables resueltas. El subagente escribe en el `output:` declarado en su frontmatter y devuelve el control. Ver contrato completo en `docs/knowledge/guides/best-practices-for-skills.md` (ADR-0002).

4. Leer `.tmp/story-verify/qa-output.json` una vez el agente complete

---

### Paso 7 — Generar verify-report.md

#### 6a. Verificar si verify-report.md ya existe (idempotencia — AC-7)

Si `$STORY_DIR/verify-report.md` existe:
- Extraer el contenido de la sección `## Historial de Ejecuciones Anteriores`
- Registrar internamente como `$HISTORY_CONTENT`

Si no existe: `$HISTORY_CONTENT = "(sin ejecuciones anteriores)"`

#### 6b. Leer el template

Buscar en este orden:
1. `assets/verify-report-template.md` — ubicación canónica

Si ninguno existe, usar una estructura mínima integrada.

#### 6c. Construir el contenido del reporte

Completar los placeholders del template con los valores recopilados:

| Placeholder | Valor |
|---|---|
| `{story_id}` | ID de la historia |
| `{story_title}` | Título de la historia |
| `{date}` | Fecha actual (YYYY-MM-DD) |
| `{mode}` | Modo de ejecución detectado |
| `{dod_version}` | Fecha de la sección VERIFY del DoD |
| `{total_tests}` | Total de tests ejecutados |
| `{passed}` | Tests que pasaron |
| `{failed}` | Tests que fallaron |
| `{skipped}` | Tests omitidos |
| `{coverage}` | Cobertura (si disponible, sino "N/A") |
| `{unit_tests_check}` | `[x]` si se ejecutaron, `[ ]` si no |
| `{integration_tests_check}` | `[x]` si aplica |
| `{e2e_tests_check}` | `[x]` si modo e2e |
| `{performance_tests_check}` | `[ ]` (fuera del scope) |
| `{security_tests_check}` | `[ ]` (fuera del scope) |
| `{findings_by_severity}` | Findings ordenados CRITICAL→LOW, o "(Sin findings)" |
| `{coverage_analysis}` | Cobertura por módulo o "(No disponible en modo manual)" |
| `{dod_criteria_rows}` | Tabla evaluada de criterios DoD |
| `{dod_passed}` | Criterios que pasaron |
| `{dod_total}` | Total de criterios |
| `{recommendations}` | Lista priorizada de acciones |
| `{sign_off_critical}` | `[x]` si sin findings CRITICAL |
| `{sign_off_coverage}` | `[x]` si coverage >= 80% |
| `{sign_off_performance}` | `[ ]` (requiere evaluación manual) |
| `{history}` | `$HISTORY_CONTENT` |

#### 6d. Construcción de findings

Formato de cada finding (CRITICAL/HIGH/MEDIUM/LOW):

```markdown
### [{SEVERITY}] {title}
- **Location**: {location}
- **Steps to Reproduce**:
{steps_to_reproduce}
- **Expected**: {expected}
- **Actual**: {actual}
- **Impact**: {impact}
- **Fix**: {fix}
```

Si no hay findings: incluir `> Sin defectos encontrados en esta ejecución.`

#### 6e. Evaluación de criterios DoD VERIFY

Para cada criterio en `$DOD_VERIFY_CRITERIA`, evaluar contra los resultados:
- `✓` — evidencia clara de cumplimiento (ej. todos los tests pasan)
- `❌` — evidencia clara de incumplimiento (ej. tests fallidos, defecto CRITICAL sin resolver)
- `⚠️` — no evaluable desde los artefactos o requiere verificación manual

Calcular:
- `$DOD_OK` = criterios con `✓`
- `$DOD_ERROR` = criterios con `❌`
- `$VERIFY_RECHAZADO = true` si `$DOD_ERROR > 0` o si hay defectos CRITICAL o HIGH sin resolver

#### 6f. Añadir entrada al historial

Añadir al final del `$HISTORY_CONTENT` la entrada de esta ejecución:
```markdown
### Ejecución {N} — {date}
- **Modo**: {modo}
- **Resultado**: VERIFY-PASSED / VERIFY-REJECTED
- **Tests**: {passed}/{total} pasados, {failed} fallados
- **Findings**: {N} defectos ({CRITICAL} CRITICAL, {HIGH} HIGH)
```

#### 6g. Escribir verify-report.md

Escribir `$STORY_DIR/verify-report.md` con el contenido construido.

---

### Paso 8 — Transición de estado y resumen

#### 7a. Actualizar frontmatter de story.md

**Si `$VERIFY_RECHAZADO = false`** (todos los criterios DoD VERIFY pasan):
```
status: VERIFY
substatus: DONE
updated: {fecha}
```

**Si `$VERIFY_RECHAZADO = true`** (hay criterios DoD fallidos o defectos CRITICAL/HIGH):
```
status: READY-FOR-IMPLEMENT
substatus: DONE
updated: {fecha}
```

Mostrar en pantalla si hay rechazo:
```
⚠️ VERIFY RECHAZADO: se encontraron {N} defectos. Revisa verify-report.md para detalles.
```

#### 7b. Mostrar resumen final

```
─────────────────────────────────────────────────────────────
 Verificación: {story_id} — {story_title}
─────────────────────────────────────────────────────────────
 Modo de ejecución: {modo}
 Tests: {passed}/{total} pasados | {failed} fallados | {skipped} omitidos
 Cobertura: {coverage}
 Findings: {N_critical} CRITICAL | {N_high} HIGH | {N_medium} MEDIUM | {N_low} LOW
─────────────────────────────────────────────────────────────
 DoD VERIFY: {dod_ok}/{dod_total} criterios ✓
─────────────────────────────────────────────────────────────

📄 Reporte: {$STORY_DIR}/verify-report.md
📋 Estado story.md: VERIFY/DONE ✓         (si no bloqueado)
📋 Estado story.md: READY-FOR-IMPLEMENT/DONE (REJECTED) ⚠️     (si rechazado)

✅ Verificación completa                  (si no rechazado)
⚠️ VERIFY RECHAZADO: N defectos          (si rechazado)
```

## Salida

- `$SPECS_BASE/specs/stories/<story-id>/verify-report.md` — reporte de verificación con summary, findings por severidad, criterios DoD evaluados e historial de ejecuciones.
- `story.md` frontmatter actualizado:
  - `status: VERIFY / substatus: DONE` — si todos los criterios DoD VERIFY pasan
  - `status: READY-FOR-IMPLEMENT / substatus: DONE` — si hay criterios fallidos o defectos CRITICAL/HIGH sin resolver (REJECTED)
