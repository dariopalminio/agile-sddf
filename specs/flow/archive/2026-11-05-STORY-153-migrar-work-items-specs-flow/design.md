---
alwaysApply: false
type: design
id: STORY-153
slug: STORY-153-migrar-work-items-specs-flow-design
title: "Design: Migrar y archivar los work items a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-153
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-153-migrar-work-items-specs-flow
  - EPIC-26-layout-y-flow-forward-mejorado
  - STORY-157
---

<!-- Referencias -->
[[STORY-153-migrar-work-items-specs-flow]] · [[EPIC-26-layout-y-flow-forward-mejorado]] · [[STORY-147-adr-del-layout-fijo-de-tres-raices]]

## Context

La historia es un `chore` de un solo uso: un script Node.js mueve con `git mv` los work items de `docs/specs/` al layout fijo de ADR-0016 (`specs/flow/`, `specs/flow/archive/`). No reescribe enlaces (STORY-157), no documenta el layout (STORY-154) y no toca skills.

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `docs/specs/` | Tres entradas: `epics/`, `stories/` y `README.md` (versionado). Sin archivos ignorados (`git status --ignored` vacío) ni `.cache/`. 659 archivos versionados. |
| `docs/specs/epics/` | 27 directorios `EPIC-NN-<slug>/`, todos con `epic.md`; ningún archivo suelto. |
| `docs/specs/stories/` | 149 directorios `STORY-NNN-<slug>/`, todos con `story.md`; ningún archivo suelto; sin IDs duplicados. |
| `status:` de los `story.md` | 98 `COMPLETED`, 11 `CANCELED`, 40 en otros estados (`BACKLOG`, `SPECIFY`, `PLAN`, `READY-FOR-IMPLEMENT`, `IMPLEMENT`, `READY-FOR-CODE-REVIEW`, `CODE-REVIEW`, `READY-FOR-VERIFY`, `VERIFY`). Siempre sin comillas. |
| Fechas del frontmatter | 107 stories tienen `created:` y `updated:`. **42 no tienen ninguno de los dos**: solo `date:` (STORY-001 a STORY-049 y STORY-087); 37 de ellas son `COMPLETED`. Todas las fechas cumplen `YYYY-MM-DD`. Ver CR-001. |
| `docs/specs/README.md` | Wiki `slug: specs-index`, describe `specs/epics/` y `specs/stories/`; `docs/index.md:154` lo enlaza. La historia no dice adónde va. Ver CR-002. |
| `git mv` (probado en un repo temporal) | Mueve un directorio con archivos modificados (conserva la modificación) y con archivos sin versionar (se mueven en disco y siguen sin versionar). Falla con `source directory is empty` si el directorio no tiene ningún archivo versionado. Falla si el directorio padre del destino no existe. **Si el destino ya existe y es un directorio, anida el origen dentro de él** sin error. |
| `scripts/migrate-finvest-field.js` | Precedente de migración única (STORY-090): CommonJS, `#!/usr/bin/env node`, JSDoc de cabecera con uso y regla por caso, `--dry-run`, tabla y resumen por consola, exit 0/1, sin dependencias. |
| `scripts/check-doc-links.js` | Exporta funciones y deriva `REPO_ROOT` de `path.resolve(__dirname, '..')`; `docs/specs` está en `HISTORICAL_EXCLUSIONS`; el índice de slugs recorre solo `docs/`. |
| `test/epic-template.test.js` | Precedente de prueba de una migración: líneas `[MIGRARÍA]` / `[MIGRADO]` / `[SIN CAMBIOS]` y segunda pasada sin cambios. |
| `package.json` | `files` incluye `scripts/` (el script se publica, como `migrate-finvest-field.js`); `npm test` = `node --test test`; `verify:syntax` recorre `scripts/` y `test/`. Única dependencia: `fs-extra`. |
| `docs/index.md` | 162 enlaces/wikilinks hacia `specs/epics/…` y `specs/stories/…`: quedarán rotos tras el movimiento hasta STORY-157. |
| `sddf.config.yaml` | Declara `root: docs`. Ninguna historia de EPIC-26 asume su retiro en este repo (STORY-149 lo excluye «hasta STORY-153»; STORY-153 no lo menciona). Ver CR-003. |
| Designs de STORY-150, 151 y 152 | «No reinstalar las copias de runtime (`.claude/`) antes de STORY-153». |

Stakeholders: el mantenedor que ejecuta la migración y STORY-157, que parte del árbol migrado.

## Goals / Non-Goals

**Goals:**
- Crear `scripts/migrate-specs-to-flow.js`, una migración única que calcula un plan de movimientos y lo aplica con `git mv` // satisface: AC-1, CNF-1, CNF-2, CNF-3
- Épicas → `specs/flow/EPIC-NN-<slug>/`; stories `COMPLETED` → `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`; el resto → `specs/flow/STORY-NNN-<slug>/`; `docs/specs/` deja de existir // satisface: AC-1
- `--dry-run` que lista cada movimiento sin escribir y una segunda pasada sin cambios // satisface: AC-2
- Comprobar que activas + archivadas = total previo // satisface: AC-1
- Crear `test/migrate-specs-to-flow.test.js` con fixtures en repos git temporales // satisface: AC-1, AC-2
- Ejecutar la migración sobre este repo y dejar los movimientos en el índice de git // satisface: AC-1, CNF-3

**Non-Goals:**
- Reescribir enlaces y wikilinks, cambiar `HISTORICAL_EXCLUSIONS` de `check-doc-links.js` o dejar `verify:repository` en verde (STORY-157)
- Verificar con `git log --follow` (STORY-157); aquí solo se garantiza que los movimientos son renombres de git
- Actualizar el contenido de `docs/specs/README.md`, `AGENTS.md` o guías (STORY-154; ver CR-002)
- Retirar `root: docs` de `sddf.config.yaml` (ver CR-003)
- Archivar épicas o stories `CANCELED`, escribir eventos, logs o `workflow/log.jsonl` (épica de Workflow; CNF-1)
- Mover o modificar `docs/requirements/` (CNF-4)
- Hacer commit: los movimientos quedan en el índice; el commit lo hace el mantenedor

## Decisions

### D-1 — Script único `scripts/migrate-specs-to-flow.js` con funciones exportadas // satisface: AC-1, AC-2, CNF-1, CNF-2

| Aspecto | Valor |
|---|---|
| Archivo | `scripts/migrate-specs-to-flow.js` (CommonJS, `#!/usr/bin/env node`, `'use strict'`) |
| Uso | `node scripts/migrate-specs-to-flow.js [--dry-run]`; cualquier otro argumento → `[ERROR] argumento no reconocido: <arg>` y exit 1 |
| Raíz | `REPO_ROOT = path.resolve(__dirname, '..')` en modo CLI; no lee `process.cwd()`, `process.env` ni `sddf.config.yaml` |
| Dependencias | solo `fs`, `path` y `child_process` de Node (sin `fs-extra`; CNF-2) |
| Cabecera | JSDoc con propósito, «un solo uso — STORY-153», reglas de destino (D-3, D-4), uso y exit codes (precedente `migrate-finvest-field.js`) |
| Exportaciones | `planMigration`, `runMigration`, `archiveDate` (para la prueba); `main()` solo si `require.main === module` |
| Salida | consola únicamente; no crea archivos de log, reportes ni eventos (CNF-1) |

Derivar la raíz de `__dirname` hace que el script sea «solo de este repo»: instalado como dependencia, `node_modules/agile-sddf/docs/specs/` no existe y el script termina sin cambios (D-7).

**Alternativas rechazadas:**
- **Skill `/migrate-layout` o subcomando de `agile-sddf`:** reutilizable y expuesto a proyectos instalados; lo prohíben CNF-1, CS-11 y el Non-Goal «migrar proyectos instalados».
- **Comandos `git mv` a mano o un script de shell:** no reproducible, sin `--dry-run` ni idempotencia (AC-2) y fuera del stack (CNF-2).
- **Ubicarlo fuera de `scripts/` (p. ej. `.tmp/`):** `.tmp/` no se versiona y CS-7 exige poder re-ejecutarlo; otra carpeta nueva rompe la convención de `verify:syntax` (`scripts/`, `test/`).

### D-2 — Inventario de work items y reglas de reconocimiento // satisface: AC-1

`planMigration` lee `docs/specs/` y clasifica cada entrada:

| Entrada | Reconocida si | Si no |
|---|---|---|
| `docs/specs/epics/<nombre>/` | `<nombre>` cumple `^EPIC-\d{2}-.+$` y contiene `epic.md` | bloqueo `entrada no reconocida` |
| `docs/specs/stories/<nombre>/` | `<nombre>` cumple `^STORY-\d{3}-.+$` y contiene `story.md` | bloqueo `entrada no reconocida` |
| `docs/specs/README.md` | siempre | — |
| cualquier otra entrada en `docs/specs/`, `epics/` o `stories/` (archivo, directorio o enlace) | nunca | bloqueo `entrada no reconocida` |

Fallar ante lo desconocido garantiza que, al final, `docs/specs/` quede vacío y pueda eliminarse sin borrar nada (D-6). El orden del plan es alfabético por origen (determinista).

**Alternativas rechazadas:**
- **Mover lo desconocido a una carpeta `specs/flow/misc/`:** inventa una convención que ADR-0016 no define.
- **Ignorar lo desconocido y borrar `docs/specs/` con `rm -r`:** pérdida silenciosa de datos.

### D-3 — Destino por tipo de work item // satisface: AC-1, CNF-2

| Origen | Condición | Destino |
|---|---|---|
| `docs/specs/epics/EPIC-NN-<slug>/` | siempre (las épicas no se archivan) | `specs/flow/EPIC-NN-<slug>/` |
| `docs/specs/stories/STORY-NNN-<slug>/` | `status` = `COMPLETED` | `specs/flow/archive/<fecha>-STORY-NNN-<slug>/` (fecha según D-4) |
| `docs/specs/stories/STORY-NNN-<slug>/` | cualquier otro `status` (incluido `CANCELED`) | `specs/flow/STORY-NNN-<slug>/` |
| `docs/specs/README.md` | — | `specs/README.md` (ver CR-002) |

Lectura del `status`: frontmatter entre la primera línea `---` y la siguiente; líneas `clave: valor`; se toleran BOM, CRLF y comillas simples o dobles alrededor del valor; comparación exacta con `COMPLETED` tras `trim`. Un `story.md` sin frontmatter o sin `status:` → bloqueo `<origen>: sin status en el frontmatter`. El nombre del directorio se conserva tal cual (`STORY-NNN-<slug>`, ADR-0016 D-4); no se lee el `slug:` del frontmatter.

**Alternativas rechazadas:**
- **Parser YAML (`js-yaml`) o `fs-extra`:** dependencia nueva para leer tres claves planas (CNF-2).
- **Tratar estados desconocidos como bloqueo:** la regla de la historia es binaria (`COMPLETED` o no); cualquier otro valor queda activo, lo que no pierde nada.

### D-4 — Fecha del prefijo de archivo: `updated:` → `created:` → `date:` // satisface: AC-1

`archiveDate(frontmatter) → 'YYYY-MM-DD' | null`: devuelve el primer valor presente y válido de `updated:`, `created:` y, solo si faltan ambos, `date:`. Válido = cumple `^\d{4}-\d{2}-\d{2}$`. Si no hay ninguno válido → bloqueo `<origen>: COMPLETED sin fecha válida (updated/created/date)`.

El tercer nivel cubre las 37 stories `COMPLETED` que solo tienen `date:` (Context). La historia nombra solo `updated:` y `created:`; la extensión se registra en CR-001.

**Alternativas rechazadas:**
- **Bloquear esas 37 stories y editar su frontmatter antes de migrar:** modifica 37 work items cerrados para un dato que ya tienen (`date:`) y mezcla ediciones de contenido con renombres, lo que debilita la detección de renombres de git (CNF-3).
- **Usar la fecha del último commit (`git log -1`):** depende del historial, no del documento; deja de ser reproducible si se reescribe el historial y no es lo que fija la épica.
- **Usar la fecha de ejecución:** no reproducible (CS-7).

### D-5 — Guardias antes de mover: el plan se valida completo // satisface: AC-1, AC-2, CNF-3

`planMigration` devuelve `bloqueos` y `runMigration` no ejecuta ningún `git mv` si hay al menos uno. Bloqueos, además de los de D-2, D-3 y D-4:

| Guardia | Comprobación | Mensaje |
|---|---|---|
| Repositorio git | `git rev-parse --show-toplevel` resuelve a `repoRoot` | `[BLOQUEO] <repoRoot> no es la raíz de un repositorio git` |
| Origen versionado | `git ls-files -- <origen>` no vacío para cada directorio | `[BLOQUEO] <origen>: sin archivos versionados (git mv fallaría)` |
| Destino libre | el destino no existe en disco | `[BLOQUEO] <destino> ya existe (git mv anidaría el origen)` |
| Destinos únicos | ningún destino se repite en el plan | `[BLOQUEO] destino duplicado: <destino>` |

Archivos modificados o sin versionar dentro de un directorio con archivos versionados **no bloquean**: `git mv` los mueve con el directorio (Context). Se informan como `[AVISO] <origen>: N archivo(s) con cambios locales o sin versionar se mueven sin versionar/sin commitear`, a partir de `git status --porcelain --untracked-files=all -- docs/specs`.

**Alternativas rechazadas:**
- **Exigir árbol limpio en `docs/specs/`:** bloquea la ejecución por `tasks.md` de la propia STORY-153 o por `.bak` sin versionar, que `git mv` mueve sin problema.
- **Validar sobre la marcha (mover y fallar al primer error):** deja migraciones parciales por errores detectables de antemano.

### D-6 — Ejecución: crear padres, `git mv`, eliminar directorios vacíos, comprobar totales // satisface: AC-1, CNF-3

Orden de `runMigration({ repoRoot, dryRun: false })` con un plan sin bloqueos:

1. Crear `specs/flow/archive/` con `fs.mkdirSync(…, { recursive: true })` (crea también `specs/` y `specs/flow/`). Es la única escritura fuera de `git mv`.
2. Para cada movimiento, en orden: `spawnSync('git', ['mv', origen, destino], { cwd: repoRoot })` con argumentos en arreglo (sin shell); imprimir `[MOVIDO] <origen> → <destino>`.
3. Eliminar con `fs.rmdirSync` (no recursivo) `docs/specs/epics/`, `docs/specs/stories/` y `docs/specs/`. Si alguno no está vacío, `rmdirSync` falla → `[ERROR] <dir> no quedó vacío` y exit 1 (nunca `rm -r`).
4. Post-condición de totales (D-8). Si no se cumple → `[ERROR]` y exit 1.

Las rutas de `git mv` son relativas a `repoRoot` y con `/` (portables en Windows y Linux).

**Alternativas rechazadas:**
- **`fs.renameSync` + `git add -A`:** `git add -A` captura cambios ajenos a la migración; `git mv` restringe el índice a los renombres.
- **Un solo `git mv docs/specs/stories/* …` por lotes:** destinos distintos por story (activa o archivada con fecha) impiden agrupar.
- **`rm -r docs/specs/` al final:** podría borrar contenido no detectado; `rmdirSync` falla de forma segura.

### D-7 — Idempotencia y `--dry-run` // satisface: AC-2

| Estado del repo | Resultado | Escrituras | Exit |
|---|---|---|---|
| `docs/specs/` no existe | `[SIN CAMBIOS] docs/specs/ no existe: nada que migrar` | ninguna (tampoco crea `specs/flow/archive/`) | 0 |
| `docs/specs/` existe, `--dry-run` | una línea `[MOVERÍA] <origen> → <destino>` por movimiento, luego bloqueos, avisos y resumen con `(dry-run)` | ninguna | 0 sin bloqueos; 1 con bloqueos |
| `docs/specs/` existe, sin flag | D-6 | `git mv`, `mkdir`, `rmdir` | 0 / 1 |

La idempotencia se apoya en el estado y no en un registro: el plan se recalcula siempre desde `docs/specs/`. Una ejecución interrumpida a mitad (error de `git mv`) se reanuda ejecutando de nuevo: los orígenes ya movidos ya no aparecen y sus destinos ya existen solo para ellos.

**Alternativas rechazadas:**
- **Archivo de marca «ya migrado»:** un artefacto extra que CNF-1 prohíbe y que puede desincronizarse del árbol.
- **Detectar migración comprobando `specs/flow/`:** `specs/flow/` puede existir antes (lo crea `/sddf-init`, STORY-149) sin que `docs/specs/` se haya migrado.

### D-8 — Conservación del total de stories // satisface: AC-1

Antes de mover, el plan registra `totalPrevio` = número de directorios `STORY-*` en `docs/specs/stories/`. Tras D-6, `runMigration` cuenta `activas` = directorios `^STORY-\d{3}-` en `specs/flow/` y `archivadas` = directorios `^\d{4}-\d{2}-\d{2}-STORY-\d{3}-` en `specs/flow/archive/`, y exige `activas + archivadas = totalPrevio + preexistentes`, donde `preexistentes` son las stories que ya estaban en `specs/flow/` o `archive/` antes de ejecutar (0 en este repo). El resumen imprime los tres números.

En `--dry-run` el resumen imprime los totales planificados (`épicas`, `activas`, `archivadas`, `total previo`).

**Alternativas rechazadas:**
- **Confiar en el número de `git mv` exitosos:** no detecta un directorio anidado por error ni stories preexistentes duplicadas.

### D-9 — Formato de salida y exit codes // satisface: AC-1, AC-2

Prefijos de línea (convención de `test/epic-template.test.js` y `migrate-finvest-field.js`): `[MOVERÍA]`, `[MOVIDO]`, `[SIN CAMBIOS]`, `[AVISO]`, `[BLOQUEO]`, `[ERROR]`. Bloque final:

```
── Resumen [(dry-run)] ─────────────
  Épicas:             <n>
  Stories activas:    <n>
  Stories archivadas: <n>
  Total previo:       <n>
  Bloqueos:           <n>
────────────────────────────────────
```

Exit 0 sin bloqueos ni errores; exit 1 en cualquier otro caso. `runMigration` devuelve `{ lines, exitCode, plan }` y `main()` solo imprime `lines` y llama a `process.exit(exitCode)`.

### D-10 — Prueba automatizada con repos git temporales // satisface: AC-1, AC-2, CNF-2

`test/migrate-specs-to-flow.test.js` (`node:test`, `node:assert/strict`, `fs.mkdtempSync(os.tmpdir())`, `git init` + `git commit` con `user.name`/`user.email` locales al fixture). Llama a `runMigration({ repoRoot: <fixture>, dryRun })`; nunca opera sobre el repo real. Escenarios: ver `## Contratos de verificación`.

**Alternativas rechazadas:**
- **Solo verificación manual sobre el repo real:** AC-2 (dry-run sin escrituras, segunda pasada sin cambios) y los bloqueos de D-5 no son repetibles sin fixtures.
- **Simular `git` con un stub:** el riesgo principal está en el comportamiento real de `git mv` (anidar, padres, sin versionar); el stub lo ocultaría.

### D-11 — Secuencia de corte en este repo // satisface: AC-1, CNF-3, CNF-4

La ejecución real sobre el repo es la **última tarea de implementación** y sigue este orden:

1. `node scripts/migrate-specs-to-flow.js --dry-run` → revisar movimientos, bloqueos y totales (esperado al 2026-10-22: 27 épicas, 51 activas, 98 archivadas, total previo 149; los números reales son los del dry-run).
2. `node scripts/migrate-specs-to-flow.js` → exit 0.
3. Segunda ejecución → `[SIN CAMBIOS]`, exit 0, `git status --porcelain` idéntico antes y después.
4. Reinstalar las copias de runtime desde las fuentes ya migradas (`node scripts/cli.js install --force`) para que los skills de la sesión dejen de resolver `docs/specs/` (designs de STORY-150 a STORY-152).
5. Escribir los artefactos posteriores de la historia (`implement-report.md`, etc.) en `specs/flow/STORY-153-migrar-work-items-specs-flow/` y comprobar que `docs/specs/` no se recreó.

La propia STORY-153 (en `IMPLEMENT`) y EPIC-26 se mueven a `specs/flow/` en el paso 2; no se tratan como caso especial.

**Alternativas rechazadas:**
- **Migrar al principio de la implementación:** las copias de runtime instaladas aún resuelven `docs/specs/` y recrearían `docs/specs/stories/STORY-153-…/` al escribir `tasks.md` o el reporte.
- **Excluir STORY-153 o EPIC-26 del movimiento:** deja `docs/specs/` vivo e incumple CS-4.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Migración única de work items | crear | `scripts/migrate-specs-to-flow.js` | AC-1, AC-2, CNF-1, CNF-2, CNF-3 |
| Prueba de la migración | crear | `test/migrate-specs-to-flow.test.js` | AC-1, AC-2 |
| Work items del repo | mover (`git mv`, resultado de ejecutar el script) | `docs/specs/**` → `specs/flow/**`, `specs/README.md` | AC-1, CNF-3, CNF-4 |
| Copias de runtime | reinstalar (no versionadas) | `.claude/` y demás destinos de `config/runtimes.json` | AC-1 (D-11) |

No se modifica `package.json` (el script no se expone como comando npm: un solo uso), ni `sddf.config.yaml`, ni `docs/requirements/`.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| CLI | `node scripts/migrate-specs-to-flow.js [--dry-run]` → salida D-9, exit 0/1 | AC-1, AC-2 |
| `planMigration({ repoRoot: string }) → Plan` | solo lectura (fs + `git rev-parse`, `git ls-files`, `git status`); nunca escribe | AC-1, AC-2 |
| `runMigration({ repoRoot: string, dryRun: boolean }) → { lines: string[], exitCode: 0 \| 1, plan: Plan }` | con `dryRun` o con bloqueos no escribe; si no, aplica D-6 | AC-1, AC-2 |
| `archiveDate(frontmatter: Record<string,string>) → string \| null` | pura; D-4 | AC-1 |
| Invocación de git | `spawnSync('git', [subcomando, ...args], { cwd: repoRoot, encoding: 'utf8' })`, sin shell | AC-1, CNF-3 |

## Esquema de datos // satisface: AC-1, AC-2

```yaml
Plan:
  docsSpecsExists: boolean        # false → [SIN CAMBIOS]
  moves:                          # orden alfabético por from
    - kind: epic | story-active | story-archived | index
      from: string                # relativo a repoRoot, separador '/'
      to: string
      date: string | null         # solo story-archived (D-4)
  blockers: [string]              # líneas [BLOQUEO] sin prefijo
  warnings: [string]              # líneas [AVISO] sin prefijo
  totals:
    epics: number
    active: number
    archived: number
    previous: number              # STORY-* en docs/specs/stories/
    preexisting: number           # STORY-* ya presentes en specs/flow/ y archive/
```

## Flujos clave

**AC-1 — migrar y archivar:**
1. `main` → `runMigration({ repoRoot, dryRun: false })` → `planMigration`.
2. `planMigration`: guardia git (D-5) → inventario (D-2) → por story, leer frontmatter, destino (D-3) y fecha (D-4) → guardias de origen y destino (D-5) → totales.
3. Sin bloqueos → D-6 (mkdir, `git mv` ×N, `rmdir` ×3, post-condición D-8) → resumen → exit 0.

**AC-2 — dry-run:** mismo plan; imprime `[MOVERÍA]` por movimiento y el resumen `(dry-run)`; ninguna llamada a `mkdirSync`, `git mv` ni `rmdirSync`.

**AC-2 — segunda pasada:** `docs/specs/` no existe → `[SIN CAMBIOS]`, exit 0, sin escrituras.

**Degradación (P7):** error de `git mv` en el movimiento k → `[ERROR] git mv <from> → <to>: <stderr>`, se detiene, imprime cuántos se movieron y exit 1; los movimientos 1..k-1 quedan en el índice y una nueva ejecución reanuda desde el estado actual (D-7). Un fallo de `rmdirSync` o de la post-condición no deshace movimientos: los reporta para revisión manual.

## Risks / Trade-offs

- **[Riesgo] Gate rojo entre STORY-153 y STORY-157:** `docs/index.md` tiene 162 enlaces y wikilinks a `specs/epics/…` y `specs/stories/…`, y el índice de slugs de `check-doc-links.js` solo recorre `docs/`; tras mover, `verify:links` (y por tanto `verify:repository`) falla → esperado por la historia («los enlaces quedan por reescribir»). Mitigación: ejecutar STORY-157 a continuación; en STORY-153 se verifican `npm test`, `verify:syntax` y los contratos de abajo, y se registra el fallo de enlaces en `implement-report.md` como conocido.
- **[Riesgo] Detección de renombres de git (CNF-3):** un work item movido con cambios locales grandes puede no detectarse como renombre → los cambios locales se reportan como `[AVISO]` (D-5); se recomienda commitear antes de migrar. La verificación con `git log --follow` es de STORY-157.
- **[Riesgo] Copias de runtime desactualizadas:** escriben en `docs/specs/` si se usan tras migrar sin reinstalar → D-11 paso 4 y comprobación del paso 5.
- **[Trade-off] Script publicado en npm:** `scripts/` está en `files`; como en `migrate-finvest-field.js`, se acepta. La raíz derivada de `__dirname` impide que actúe sobre un proyecto consumidor (D-1).
- **[Trade-off] Fallback `date:`:** se aparta de la redacción literal de AC-1 para 37 stories (CR-001).
- **[Limitación] Windows y mayúsculas:** los destinos solo cambian de directorio padre y añaden prefijo de fecha; no hay renombres que difieran solo en mayúsculas.

## Decisiones de complejidad justificada

- **Plan validado completo antes de mover (D-5):** la versión simple (mover y fallar) deja estados parciales ante errores previsibles (destino existente, directorio sin versionar, fecha ausente); validar primero es una pasada de lectura más.
- **Guardia de destino existente:** necesaria porque `git mv` anida el origen dentro de un destino existente sin error (comportamiento comprobado).
- **Post-condición de totales (D-8):** AC-1 la exige explícitamente; es un conteo, no un mecanismo nuevo.
- **Funciones exportadas en lugar de un script plano:** permiten D-10 sin lanzar procesos hijos sobre el repo real; mismo patrón que `check-doc-links.js`.
- **Sin parser YAML ni registro de estado:** tres claves planas y la existencia de `docs/specs/` bastan (KISS/YAGNI).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Épica → `specs/flow/EPIC-NN-<slug>/`; story `COMPLETED` con `updated:` → `archive/<updated>-STORY-…/`; story `CANCELED` y story en `IMPLEMENT` → `specs/flow/STORY-…/`; `docs/specs/` no existe; totales iguales | test (fixture con 2 épicas, 4 stories y `README.md`) | AC-1 |
| 2 | Fallback de fecha: sin `updated:` usa `created:`; sin ambos usa `date:`; sin ninguno → bloqueo y ningún movimiento | test (`archiveDate` + fixture) | AC-1 |
| 3 | Los movimientos son renombres en el índice: `git status --porcelain` del fixture muestra solo entradas `R` | test | AC-1, CNF-3 |
| 4 | `--dry-run` lista un `[MOVERÍA] <origen> → <destino>` por movimiento y el árbol queda idéntico (`git status --porcelain` y listado recursivo iguales antes y después) | test | AC-2 |
| 5 | Segunda ejecución sobre el fixture migrado → `[SIN CAMBIOS]`, exit 0, árbol idéntico | test | AC-2 |
| 6 | Bloqueos sin movimientos parciales: destino existente, entrada no reconocida, directorio sin archivos versionados → exit 1 y `docs/specs/` intacto | test (un caso por bloqueo) | AC-1 |
| 7 | Archivo sin versionar dentro de una story se mueve con ella y genera `[AVISO]` | test | AC-1, CNF-3 |
| 8 | Sin artefactos extra: tras migrar el fixture no existen archivos fuera de los destinos del plan (sin logs ni eventos) | test | CNF-1 |
| 9 | Sin dependencias nuevas: `package.json` sin cambios en `dependencies`; el script solo requiere módulos de Node | `git diff package.json` vacío; revisión de `require` | CNF-2 |
| 10 | Repo real: dry-run, ejecución y segunda pasada según D-11; `test ! -e docs/specs`; `ls specs/flow \| grep -c '^EPIC-'` = épicas del dry-run; `ls specs/flow/archive \| wc -l` = archivadas del dry-run; activas + archivadas = total previo | comandos manuales; salida en `implement-report.md` | AC-1, AC-2 |
| 11 | `docs/requirements/` intacto | `git status --porcelain -- docs/requirements` vacío | CNF-4 |
| 12 | `npm test` y `npm run verify:syntax` en verde | comandos | AC-1, AC-2 |

## Open Questions

Ninguna bloqueante: las ambigüedades detectadas se resolvieron en D-4, D-3 y Non-Goals, y se registran como CR para retroalimentar la historia y las historias vecinas.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-1 y la épica fijan la fecha de archivo con `updated:` o, si falta, `created:`. 37 stories `COMPLETED` (STORY-001 a STORY-049 y STORY-087) no tienen ninguno de los dos; solo `date:`. Con la regla literal, la migración no podría archivarlas.
- **Documento afectado**: story.md (AC-1), epic.md (Notas, «Fecha del prefijo de archivo») y ADR-0016 de STORY-147 (D-3)
- **Acción requerida**: el diseño adopta `updated:` → `created:` → `date:` (D-4). Actualizar AC-1 de story.md y la nota de la épica con el tercer nivel, e incluirlo en ADR-0016 al implementar STORY-147 (aún no creado).

### CR-002
- **Tipo**: dependencia
- **Descripción**: `docs/specs/README.md` (versionado, `slug: specs-index`, enlazado desde `docs/index.md`) no es un work item y la historia no dice adónde va; para que `docs/specs/` deje de existir hay que moverlo o borrarlo. Su contenido describe el layout retirado (`specs/epics/`, `specs/stories/`).
- **Documento afectado**: design.md (D-3), STORY-154 y STORY-157
- **Acción requerida**: se mueve con `git mv` a `specs/README.md` (índice de la raíz `specs/`, fuera de `specs/flow/` para que esta contenga solo work items). Reescribir su contenido al layout fijo en STORY-154 y reparar el enlace de `docs/index.md:154` en STORY-157.

### CR-003
- **Tipo**: dependencia
- **Descripción**: `sddf.config.yaml` de este repo conserva `root: docs`. STORY-149 lo excluye «hasta STORY-153», pero STORY-153 no lo incluye y ninguna otra historia de EPIC-26 lo asume. Tras la migración la clave es inerte (los skills migrados no la leen, CS-3) pero contradice ADR-0016.
- **Documento afectado**: STORY-157 (cierre de CS-3) o STORY-154
- **Acción requerida**: no se toca en STORY-153 (el script solo mueve, CNF-1). Asignar el retiro de `root: docs` (y de su comentario) del `sddf.config.yaml` del repo a STORY-157, que comprueba CS-3 al cierre.
