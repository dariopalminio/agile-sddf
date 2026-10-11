---
alwaysApply: false
type: design
id: STORY-117
slug: STORY-117-verificar-cierre-epic-21-design
title: "Design: Verificar sddf.config.yaml y los modos SDD sobre la estructura de dos niveles"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-117
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-117-verificar-cierre-epic-21
  - EPIC-21-colapsar-specs-dos-niveles
  - eliminar-specs-01-projects
  - STORY-113-project-flow-sin-01-projects
  - STORY-114-migrate-specs-3-levels
  - STORY-115-scaffold-dos-niveles-y-capas-destino
  - STORY-116-documentar-modelo-dos-niveles
---

<!-- Referencias -->
[[STORY-117-verificar-cierre-epic-21]] · [[EPIC-21-colapsar-specs-dos-niveles]] · [[eliminar-specs-01-projects]] · [[STORY-113-project-flow-sin-01-projects]] · [[STORY-114-migrate-specs-3-levels]] · [[STORY-115-scaffold-dos-niveles-y-capas-destino]] · [[STORY-116-documentar-modelo-dos-niveles]]

# Diseño técnico: verificación de cierre de EPIC-21

## Context

Es la última historia de [[EPIC-21-colapsar-specs-dos-niveles]]. Es una historia `chore` **sin código de producto**: no cambia
skills, agentes, scripts, `docs/` ni ningún `sddf.config.yaml`. Su salida es evidencia ejecutada en `verify-report.md` (CNF-2).
Este diseño define **qué** se verifica, **con qué comando**, **sobre qué estado**, **cómo se registra** y **a quién se atribuye un
fallo**. El orden lo fija `tasks.md`.

**Estado medido (2026-10-08, rama `epic/EPIC-21-colapsar-specs-dos-niveles`, antes de implementar STORY-104…116):**

| Pieza | Estado |
|---|---|
| Precondición | STORY-104…107 y 109…116 en `READY-FOR-IMPLEMENT/DONE`; STORY-108 en `PLAN/IN-PROGRESS`. Ninguna está aceptada. STORY-118 pertenece a la épica pero queda fuera del rango del "Dado" de AC-1. |
| `sddf.config.yaml` versionados | 10 (`git ls-files '*sddf.config.yaml'`): el de la raíz y los de las fixtures de `header-aggregation` y `memory-system`. Ninguno contiene `01-projects`, `02-epics` ni `03-stories` (`grep` sin coincidencias). |
| Motor de memoria | `skills/memory-system/scripts/memory-system.js`: `scaffold` crea la raíz si existe su padre; `check` sale con 1 si hay problemas y con 2 ante cualquier error; `check --json` emite `summary` por tipo y `problems[{kind, path, detail}]`. `migrate --from` hoy admite `dod-monolithic` y `epic-template-v1`; STORY-114 añade `specs-3-levels` (informe D-13: con `--dry-run` la última línea es `cambios pendientes: N`; exit 1 con `[NO MIGRADO]`). |
| `check --root docs` | Exit 1, `problemas: 56 (orphan 8 · broken-wikilink 48)`. 31 son `[[ADR-0013-eliminar-specs-01-projects]]` en historias de EPIC-21 (el slug real del ADR es `eliminar-specs-01-projects`; la propia `story.md` de esta historia lo contiene, en el cuerpo y en `related`); el resto son preexistentes: `[[STORY-100-slug]]` en EPIC-20, 3 templates en EPIC-17, `[[skill-preflight]]` en STORY-053, 3 ADR en STORY-103, 2 en STORY-118, 3 en `domains/`, 4 en ADR-0013 (los corrige STORY-116 D-9). Ningún ADR `ACCEPTED` tiene wikilinks rotos. Los 8 `orphan` son archivos sin frontmatter (incluido el insight de EPIC-21). |
| Referencias en `skills/` y `agents/` | 88 archivos con `specs/0N-…` (STORY-108…115 las retiran). La excepción legítima la definen STORY-114 CR-005 (lógica de migración) y STORY-115 contrato 6 (aviso de detección). |
| Infraestructura de pruebas | `package.json` **no tiene** `test:e2e:smoke` (la nota de la historia lo da por existente; solo lo nombra `verify.e2e*` de `sddf.config.yaml` con `required: false`). Sí existen `smoke:package` (`npm pack` + instalación con lifecycle desactivado), `test/memory-system.test.js` (fixtures copiadas a `mkdtemp`) y las fixtures `skills/memory-system/examples/empty` y, tras STORY-114, `examples/specs-3-levels`. Ver CR-004. |
| `story-verify` | Con `verify` configurado en `sddf.config.yaml` usa el modo config-driven (ejecuta `test:installer`, `test:eval:runner`, `audit-root-resolution`); `--mode manual` fuerza el modo guiado. Precondición: `IMPLEMENT/DONE` o `CODE-REVIEW/DONE`. El template del reporte tiene `Summary`, `Findings`, `Coverage Analysis`, `DoD VERIFY Criteria`, `Recommendations` e `Historial de Ejecuciones Anteriores`. |
| Instalación | `scripts/install.js` instala en `INIT_CWD` o `cwd`; runtime por defecto `claude-code` (`config/runtimes.json`), perfil `core`. `sddf-init --level full` compone `memory-system scaffold`. |

**Decisiones heredadas que esta historia debe tomar o aplicar:** STORY-116 CR-002 (política para "`memory-system check` devuelve
exit code 0" frente a registros con wikilinks rotos), STORY-114 CR-005 (excepción del grep para la lógica de migración), STORY-113
contrato 2 (búsqueda global de `01-projects` en `skills` y `agents`), STORY-116 Non-Goal (término "Intent-First" en `epic.md`).

Stack: Markdown + Node.js ≥ 18 (motor de memoria, instalador) + Git Bash/POSIX para el procedimiento. No hay `skills.plan` en
`sddf.config.yaml`: no aplican skills complementarios.

## Goals / Non-Goals

**Goals:**

- Cada criterio de salida de EPIC-21 y la ausencia de niveles numerados en los `sddf.config.yaml` versionados tienen una
  verificación con comando, salida y resultado en `verify-report.md`. // satisface: AC-1
- SMOKE-1…3 y los flujos Spec-First y Spec-Anchored se ejecutan sobre directorios temporales nuevos con el paquete empaquetado
  desde el árbol verificado. // satisface: AC-2, CNF-1
- Todo fallo queda registrado con evidencia y una historia responsable; la historia no pasa a ACCEPTANCE con fallos; tras una
  corrección solo se repiten las verificaciones cuya área cambió. // satisface: AC-3
- Toda la evidencia vive en `verify-report.md`; los logs completos son temporales en `.tmp/`. // satisface: CNF-2

**Non-Goals:**

- Modificar `sddf.config.yaml`, skills, agentes, scripts o documentación (incluidos `epic.md` y la propia `story.md`): los
  hallazgos se registran como CR o FAIL atribuido.
- Corregir lo que falle (Non-Goal de la historia) ni añadir un mecanismo de exclusión a `memory-system check`.
- Verificar Spec-as-Source como comportamiento (D-10).
- Crear un script o una suite e2e versionada (D-1). Publicar 4.0.0.

## Decisions

### D-1 — Vehículo: procedimiento de comandos registrado, sin script versionado // satisface: CNF-1, CNF-2, AC-1, AC-2

La verificación es un procedimiento de comandos POSIX (Git Bash en Windows) que `testcases.md` enumera y `verify-report.md` copia
literalmente, de modo que cualquiera puede repetirlo. Las partes deterministas (motor de memoria, `git`, `find`, `grep`) se
ejecutan como comandos; los flujos con skills interactivos se ejecutan en una sesión de Claude Code con un guion fijo (D-9).

**Alternativas rechazadas:**
- *Script versionado `scripts/verify-epic-21.js` + script npm:* añade código, pruebas y mantenimiento a una verificación de un solo
  uso; tras el cierre, SMOKE-1…3 ya quedan cubiertos como regresión por `S114-*`, `S115-*` y los evals `TC-007`/`TC-023` (P12).
- *`npm run test:e2e:smoke`:* no existe (CR-004).
- *Solo `node --test test/memory-system.test.js`:* prueba el motor en proceso sobre fixtures del árbol de trabajo, no el paquete
  instalado ni el nivel de épica. Puede ejecutarse como apoyo, no sustituye a V-13…V-15.

### D-2 — Fase: la ejecución ocurre en VERIFY con `/story-verify STORY-117 --mode manual` // satisface: CNF-2, AC-1, AC-2

- **IMPLEMENT** no produce cambios versionados: sus tareas preparan y comprueban la precondición (D-4) y dejan la historia en
  `IMPLEMENT/DONE`, el estado mínimo que admite `story-verify`. **CODE-REVIEW** no aplica (no hay diff de código).
- **VERIFY** ejecuta V-01…V-17 y escribe `verify-report.md`. Se fuerza `--mode manual` porque el modo config-driven ejecutaría las
  pruebas generales del repo (`test:installer`, `test:eval:runner`, …), que no son los criterios de cierre.
- Un `FAIL` deja la historia en VERIFY (rechazo de `story-verify`): no pasa a ACCEPTANCE (AC-3).

**Alternativas rechazadas:** producir la evidencia en IMPLEMENT con `story-implement-tasks` (la evidencia acabaría en
`implement-report.md`, contra CNF-2); modo config-driven (verifica lo que no pide la historia).

### D-3 — Formato de la evidencia en `verify-report.md` // satisface: CNF-2, AC-1, AC-3

Se usa el template de `story-verify` sin secciones nuevas:

| Sección del template | Contenido para esta historia |
|---|---|
| `Summary` | Total = verificaciones ejecutadas en esta ejecución; Passed/Failed; Skipped = `NO EJECUTADA` (D-9) y arrastradas `PASS` (D-12). Coverage: `N/A — verificación de cierre`. |
| `Coverage Analysis` | **Matriz de cierre de EPIC-21**: una fila por verificación con el esquema de "Esquema de datos". |
| `Findings` | Un hallazgo por `FAIL`, severidad `CRITICAL` (criterio de salida o smoke test), con evidencia, historia responsable y área. |
| `Recommendations` | Correcciones pendientes agrupadas por historia responsable; CR de este diseño aún abiertos. |
| `Historial de Ejecuciones Anteriores` | Ejecuciones previas con su SHA y su matriz resumida (base de D-12). |

Cada fila registra el comando exacto, el exit code y un **extracto** de la salida: las líneas que deciden el resultado (resumen del
motor, coincidencias del grep, conteos). El log completo se escribe en `.tmp/story-verify/STORY-117/evidence/V-NN.log`, que no se
versiona (contrato de `.tmp/`).

**Alternativas rechazadas:** un artefacto nuevo `closure-report.md` (contra CNF-2); pegar la salida completa (ruido; la salida
completa es reproducible con el comando registrado); añadir una sección al template de `story-verify` (cambia un skill, fuera de
alcance).

### D-4 — Estado verificado y precondición como compuerta // satisface: AC-1, AC-3, CNF-1

**P-0 (compuerta, antes de cualquier verificación):**

1. Rama `epic/EPIC-21-colapsar-specs-dos-niveles`, árbol limpio: `git status --porcelain` sin líneas fuera de `.tmp/`. Se registra
   `SHA = git rev-parse HEAD`.
2. Cada `story.md` de STORY-104…STORY-116 tiene `status` ∈ {`ACCEPTANCE` con `substatus: DONE`, `DELIVER`, `COMPLETED`}, o
   `CANCELED` (se registra como "no aplica" con su motivo). Se lee del frontmatter con
   `grep -m2 -E '^(status|substatus):' <specs-historias>/STORY-1{04..16}-*/story.md`, con la carpeta de historias vigente tras STORY-108.

Si P-0 falla, no se ejecuta ninguna verificación: el reporte registra P-0 `FAIL` con la lista de historias pendientes como
responsables. Interpretación de "en DONE": CR-003.

**Alternativas rechazadas:** verificar aunque falten historias (resultados sin valor que luego no se repetirían por D-12); exigir
solo `COMPLETED` (lo marca el humano tras DELIVER; bloquearía la verificación de cierre, que precede a publicar).

### D-5 — Búsqueda de rutas numeradas en `skills/` y `agents/` con lista de excepciones // satisface: AC-1

**Patrón:** `git grep -nE '(^|[^-[:alnum:]])(01-projects|02-epics|03-stories)' -- skills agents`. Detecta la carpeta en cualquier
forma (`specs/01-projects/`, `` `03-stories/STORY-…` ``, `'02-epics'`) y no confunde el slug del ADR `eliminar-specs-01-projects`
(precedido por `-`). Solo archivos versionados (`git grep`): excluye las copias instaladas (`.claude/` ignorado; `.github/skills` es
un enlace simbólico que `git grep` no sigue).

**Lista de excepciones** (lógica de migración y detección de `memory-system`, STORY-114 CR-005 y STORY-115 contrato 6):

| Ruta | Coincidencias admitidas |
|---|---|
| `skills/memory-system/scripts/specs-3-levels.js` | Todas (`LEGACY_LEVELS`, mapa de migración). |
| `skills/memory-system/scripts/memory-system.js` | Solo el aviso de estructura de tres niveles de `scaffold` y el registro del origen `specs-3-levels`. |
| `skills/memory-system/examples/specs-3-levels/**` | Todas (fixture de origen). |
| `skills/memory-system/evals/evals.json` | Solo en casos del modo `migrate --from=specs-3-levels` y del aviso de `scaffold`. |
| `skills/memory-system/SKILL.md`, `README.md`, `references/memory-rules.md` | Solo en la documentación del modo de migración y del aviso. |

**Resultado:** `PASS` si toda coincidencia cae en la lista y en su contexto admitido; la matriz registra las coincidencias admitidas
con su archivo y línea para que la revisión sea visible. Cualquier otra coincidencia es `FAIL` atribuido por el mapa de D-12.

**Alternativas rechazadas:** literal `specs/0N-` (no detecta `03-stories/` precedido de una variable o de `$SPECS_BASE/specs/`
partido en dos literales); palabra sin ancla (falsos positivos con el slug del ADR); sin lista de excepciones (el criterio fallaría
por diseño, STORY-114 CR-005). Que `epic.md` todavía no recoja la excepción es CR-001.

### D-6 — Criterios de salida en este repositorio (V-01…V-12) // satisface: AC-1

Se ejecutan en `REPO_ROOT` con el `SHA` de P-0. `ENGINE = node skills/memory-system/scripts/memory-system.js`.

| ID | Criterio | Comando | `PASS` si |
|---|---|---|---|
| V-01 | `docs/specs/01-projects/` no existe | `test ! -e docs/specs/01-projects; echo $?` | `0` |
| V-02 | `docs/specs/` contiene solo `epics/`, `stories/` (+ `README.md`) | `ls -A docs/specs` | exactamente `README.md`, `epics`, `stories` |
| V-03 | `product/` con los cuatro documentos | `ls docs/product/{vision,stakeholders,roadmap,story-map}.md` | exit 0 |
| V-04 | Diagrama de contexto | `test -f docs/architecture/c4/context-diagram.puml` | exit 0 |
| V-05 | `requirements/` poblado | `find docs/requirements/functional docs/requirements/non-functional -name '*.md' ! -name README.md` y `ls docs/requirements/srs-*.md` | ≥ 1 requisito en cada carpeta, o existe un `srs-*.md` |
| V-06 | Ningún skill ni agente referencia los niveles numerados | patrón de D-5 | D-5 |
| V-07 | Migración ya aplicada | `$ENGINE migrate --root docs --from specs-3-levels --dry-run` | exit 0 y última línea `cambios pendientes: 0` |
| V-08 | `memory-system check` exit 0 | `$ENGINE check --root docs; echo $?` | `0` (política: D-11) |
| V-09 | Épicas e historias navegables | `$ENGINE check --root docs --json` | ningún `problems[]` con `kind: broken-wikilink` cuyo `detail` empiece por `[[EPIC-` o `[[STORY-` |
| V-10 | `CHANGELOG.md` documenta el breaking change | extraer `## [Unreleased]` hasta el siguiente `## [` y buscar `BREAKING`, `4.0.0` y `artifact-directory-migration.md` | las tres presentes (contrato 5 de STORY-116) |
| V-11 | Los modos SDD funcionan con la nueva estructura | compuesto (D-10) | V-16 `PASS` y V-17 `PASS` |
| V-12 | Ningún `sddf.config.yaml` versionado con niveles numerados | `git ls-files -z -- 'sddf.config.yaml' '*/sddf.config.yaml' \| xargs -0 grep -nE '01-projects\|02-epics\|03-stories'` | exit 1 (sin coincidencias); sin excepciones |

**Alternativas rechazadas:** verificar V-07…V-09 con el motor instalado en un temporal (los criterios hablan de *este* repositorio);
dar V-02 por bueno con `find -type d` solamente (el criterio fija también el único archivo admitido).

### D-7 — Repositorios temporales con el paquete empaquetado // satisface: CNF-1, AC-2

- `npm pack` una sola vez en `REPO_ROOT` (con el `SHA` de P-0) → `$TGZ` en `.tmp/story-verify/STORY-117/`.
- Cada verificación V-13…V-17 crea su directorio con `mktemp -d` y `git init`; instala con
  `npm install --ignore-scripts --no-save "$TGZ"` y `npx agile-sddf install --target claude-code` (precedente:
  `scripts/smoke-package-install.js`). El motor se invoca desde la copia instalada
  (`.claude/skills/memory-system/scripts/memory-system.js`) y las fixtures se toman del paquete instalado
  (`node_modules/agile-sddf/skills/memory-system/examples/…`), nunca de `docs/` de este repo.
- Las verificaciones deterministas (V-13…V-15) usan un directorio cada una; V-16 y V-17 comparten el suyo porque el estado inicial
  de V-17 es el resultado de V-16 (D-9). Los directorios se borran al terminar salvo que haya `FAIL` (se conservan para diagnóstico
  y su ruta va al log).

**Alternativas rechazadas:** invocar el motor del árbol de trabajo (no prueba lo que se distribuye); `npx agile-sddf@latest` desde
el registro (4.0.0 no está publicada, Non-Goal); copiar `docs/` de este repo (rompe CNF-1).

### D-8 — Smoke tests deterministas (V-13…V-15) // satisface: AC-2, CNF-1

`ENGINE_T = node .claude/skills/memory-system/scripts/memory-system.js` dentro del temporal; `--date 2026-01-01` fija las fechas.

| ID | Estado inicial | Comando | `PASS` si |
|---|---|---|---|
| V-13 (SMOKE-1) | temporal con `git init`, sin `docs/` | `$ENGINE_T scaffold --root docs` | exit 0; `find docs/specs -mindepth 1 -maxdepth 1 -type d` = `epics`, `stories`; `find docs -type d -name '0[123]-*'` vacío; existen `docs/product/{vision,stakeholders,roadmap}.md` y los directorios `docs/requirements/{functional,non-functional}/` |
| V-14 (SMOKE-2) | copia de `examples/specs-3-levels/` del paquete | inventario previo `find docs -type f \| sort` → `before.txt`; `$ENGINE_T migrate --root docs --from specs-3-levels`; después `$ENGINE_T migrate … --dry-run` y `$ENGINE_T check --root docs --json` | migración exit 0 sin `[NO MIGRADO]`; no existen `docs/specs/{01-projects,02-epics,03-stories}`; el número de archivos bajo `specs/epics` + `specs/stories` es igual al de `02-epics` + `03-stories` en `before.txt` y cada ruta relativa se conserva; cada archivo de `01-projects/` en `before.txt` aparece en el informe (`[MOVIDO]`, o como origen de líneas `[CREADO]`/`[SOBRESCRITO]`/`[PRESERVADO]` seguidas de `[ELIMINADO]`); `summary.broken-wikilink` = 0; la repetición en seco termina en `cambios pendientes: 0` |
| V-15 (SMOKE-3) | copia nueva de la misma fixture | `parent`/`related` de cada `epic.md` y `story.md` → `fm-before.txt`; `migrate`; `$ENGINE_T index --root docs`; `check --json` | `index` exit 0 y `docs/index.md` contiene cada `[[EPIC-*]]` y `[[STORY-*]]` de la fixture; ningún `broken-wikilink` hacia `[[EPIC-`/`[[STORY-`; `parent`/`related` iguales a `fm-before.txt` salvo los slugs del mapa de reescritura de STORY-114 D-12, que aparecen reescritos de forma consistente |

"Ningún archivo se pierde" se verifica en lo estructural (conteo, rutas, informe sin `[NO MIGRADO]`); la conservación semántica del
contenido de `01-projects/` es responsabilidad probada de STORY-114 (`S114-IT-001`) y no se duplica aquí (P3).

**Alternativas rechazadas:** reutilizar el directorio de V-14 para V-15 (una falla de V-14 contaminaría V-15 y rompería CNF-1);
generar el repo de tres niveles con el `scaffold` de 3.3.1 (sale vacío: no ejercita la migración de contenido ni de wikilinks).

### D-9 — Flujos Spec-First y Spec-Anchored (V-16, V-17) // satisface: AC-2, CNF-1

Se ejecutan en una sesión interactiva de Claude Code abierta en el temporal de D-7, con un **guion fijo** que `testcases.md`
transcribe y `verify-report.md` copia: producto demo "todo-cli" (CLI de tareas en Node.js), una visión de un párrafo, un perfil de
stakeholder, dos FR (agregar tarea, listar tareas), un NFR (respuesta < 1 s con 1 000 tareas), una épica y una historia
("agregar tarea"). Ante cada pregunta de un skill se responde con el dato del guion o con la opción por defecto.

| ID | Estado inicial | Secuencia | `PASS` si (comprobaciones deterministas al terminar) |
|---|---|---|---|
| V-16 (Spec-First) | temporal + paquete instalado | `/sddf-init --level full` → `/project-flow` (Begin, Discovery, Planning) → `/epic-from-project-plan` → `/story-specify <EPIC-ID>` | `find . -path ./node_modules -prune -o -name '*0[123]-*' -print` vacío; existen `docs/product/{vision,stakeholders,roadmap}.md`, ≥ 1 `docs/requirements/functional/*.md` (o `srs-*.md`), ≥ 1 `docs/specs/epics/EPIC-*/epic.md` y ≥ 1 `docs/specs/stories/STORY-*/story.md`; `git status --porcelain --untracked-files=all` no lista archivos de artefactos fuera de `docs/{product,requirements,specs/epics,specs/stories,architecture,templates,guardrails}/`, `docs/index.md`, `docs/constitution.md`, `sddf.config.yaml`, `CLAUDE.md`/`AGENTS.md`, `.claude/`, `node_modules/` y `.tmp/` |
| V-17 (Spec-Anchored) | el temporal tal como lo deja V-16 | `/story-plan <STORY-ID>` → `/story-implement <STORY-ID> --auto` → `$ENGINE_T index --root docs` → `$ENGINE_T check --root docs` | `docs/specs/stories/<STORY-ID>-*/story.md` existe con `status` posterior a `READY-FOR-IMPLEMENT`; `docs/index.md` contiene `[[<STORY-ID>-…]]`; `check` exit 0 |

- V-17 depende de V-16: si V-16 falla, V-17 se registra `NO EJECUTADA (depende de V-16)` y no cuenta como `PASS`.
- La sesión se ejecuta una vez; la evidencia son las comprobaciones deterministas, no la transcripción (se guarda en `.tmp/`).

**Alternativas rechazadas:** `claude -p` sin interfaz (los skills de proyecto entrevistan con preguntas que no pueden responderse en
modo headless); `npm run test:eval -- <skill>` por skill (cada eval corre aislado sobre su fixture: no encadena el flujo ni parte
de `/sddf-init`; sirve de apoyo, no de evidencia de modo); una historia ya implementada copiada de una fixture para V-17 (no
prueba que la fase IMPLEMENT deje la especificación en su sitio, que es lo que define Spec-Anchored).

### D-10 — Criterio "los tres modos SDD" (V-11) y Spec-as-Source // satisface: AC-1, AC-2

V-11 es `PASS` si V-16 y V-17 son `PASS`. La matriz registra una subfila **V-11c Spec-as-Source: `N/A`** con la justificación de la
historia (no existe un flujo que edite solo la especificación y regenere el código, `docs/guides/sdd.md`) y la evidencia estructural
disponible: V-06 demuestra que ningún skill depende de las rutas numeradas. La matriz usa el término **Spec-First**
(`docs/guides/sdd.md`, `docs/constitution.md`) e indica que equivale al "Intent-First" de la épica.

**Alternativas rechazadas:** marcar V-11 `FAIL` por no ejecutar Spec-as-Source (contradice el Non-Goal y bloquearía la épica por un
comportamiento que no existe); omitir la subfila (ocultaría que el criterio tiene tres partes). La redacción de la épica es CR-002.

### D-11 — Política para "`memory-system check` devuelve exit code 0" (decide STORY-116 CR-002) // satisface: AC-1, AC-3

- **El criterio es absoluto:** V-08 es `PASS` solo con exit 0 sobre todo `docs/`. No se excluyen registros históricos ni se añade un
  mecanismo de exclusión al motor.
- **Si falla**, cada problema se atribuye por la regla de D-12 y la vía de corrección recomendada es **corregir el registro**:
  reescribir el wikilink al slug vigente (`[[ADR-0013-eliminar-specs-01-projects]]` → `[[eliminar-specs-01-projects]]`) o añadir
  el frontmatter que falta. Corregir un slug no altera el contenido decidido del registro. La única restricción de inmutabilidad
  del repo es la de los ADR `ACCEPTED`, y hoy ninguno tiene wikilinks rotos; si alguno apareciera, la corrección es un ADR nuevo o la
  reescritura del enlace en el documento que lo cita, nunca la edición del ADR.

**Alternativas rechazadas:** excluir registros cerrados del recuento de `check` (debilita el gate de CI y es una decisión del motor
fuera de esta épica); verificar contra línea base, como STORY-116 D-12 (no satisface el criterio literal de la épica).

Con la línea base medida, V-08 y V-09 fallarán salvo que antes del cierre se sanee la memoria (`[[STORY-100-slug]]` en EPIC-20 rompe
V-09). Ver CR-005.

### D-12 — Atribución de fallos y repetición tras corregir // satisface: AC-3

**Atribución** (la primera regla que aplica):

| Origen del fallo | Historia responsable |
|---|---|
| P-0 | La historia que no cumple la precondición |
| V-01, V-02, V-07 | STORY-108 (niveles) y STORY-114 (migración) |
| V-03, V-04 | STORY-104 (`vision`), STORY-105 (`stakeholders`), STORY-106 (`roadmap`), STORY-107 (`story-map`, diagrama) |
| V-05 | STORY-105 (requisitos migrados); si falta el SRS esperado, STORY-118 |
| V-06: coincidencia en `skills/project-begin`, `agents/project-pm*` | STORY-109 |
| V-06: `project-discovery`, `reverse-engineering`, `agents/reverse-engineer-*`, `agents/project-architect*`, `agents/project-ux*` | STORY-110 |
| V-06: `project-planning`, `epic-from-project-plan` | STORY-111 |
| V-06: `project-story-mapping`, `project-context-diagram`, `agents/project-story-mapper*` | STORY-112 |
| V-06: `project-flow`, `sddf-init`, `header-aggregation` | STORY-113 |
| V-06: `memory-system` fuera de la lista de excepciones | STORY-114 (migración) o STORY-115 (scaffold), según el archivo |
| V-06: cualquier otro skill o agente | STORY-108 |
| V-08, V-09: wikilink hacia un slug que retiró o renombró EPIC-21 (`PROJ-*`, documentos de `01-projects`, `ADR-0013-…`, `domain-project-lifecycle`) | La historia que retiró el nodo (STORY-104…108, STORY-114 en la migración, STORY-116 en documentación y ADR) |
| V-08, V-09: problema preexistente a EPIC-21 | Historia nueva en EPIC-21 de saneamiento de memoria (la propone el reporte) |
| V-10 | STORY-116 |
| V-12 | STORY-114 si es una fixture de migración; si no, la historia dueña del skill de la fixture |
| V-13 | STORY-115 |
| V-14, V-15 | STORY-114 |
| V-16 | El skill donde se rompe el flujo, por las filas de V-06; instalación o empaquetado: STORY-108 |
| V-17 | STORY-115 (`index`/`check`) o STORY-108 (rutas de `story-plan`/`story-implement`); si la causa no pertenece a EPIC-21, historia nueva fuera de la épica |

**Área** de cada verificación (archivos cuyo cambio obliga a repetirla):

| Verificaciones | Área |
|---|---|
| V-01…V-05 | `docs/specs/**`, `docs/product/**`, `docs/architecture/c4/**`, `docs/requirements/**` |
| V-06 | `skills/**`, `agents/**` |
| V-07…V-09 | `docs/**`, `skills/memory-system/**` |
| V-10 | `CHANGELOG.md`, `docs/guides/artifact-directory-migration.md` |
| V-12 | todo `sddf.config.yaml` versionado |
| V-13…V-15 | `skills/memory-system/**`, `scripts/install.js`, `config/**`, `package.json` |
| V-16 | `skills/{sddf-init,project-*,epic-from-project-plan,story-specify,story-creation,story-evaluation,story-split,story-improve,memory-system,sddf-constitution}/**`, `agents/**`, `scripts/install.js`, `config/**`, `package.json` |
| V-17 | área de V-16 + `skills/{story-plan,story-design,story-tasking,story-testcases,story-analyze,story-implement,story-implement-tasks}/**` |
| V-11 | se recalcula de V-16 y V-17 |

**Repetición:** en una ejecución posterior, `git diff --name-only <SHA anterior>..HEAD` decide: se repite toda verificación `FAIL`
o `NO EJECUTADA` y toda `PASS` cuya área interseca el diff; el resto se arrastra como `PASS` con el SHA en que pasó (columna `SHA`).
Si el diff toca `docs/specs/**` por la propia corrección de un registro, solo se repiten V-01, V-02 y V-07…V-09.

**Alternativas rechazadas:** repetir todo siempre (contradice AC-3 y obliga a repetir la sesión interactiva de V-16/V-17 por una
corrección documental); decidir el área a criterio en cada ejecución (no reproducible).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Reporte de verificación | crear (lo escribe `story-verify --mode manual`) | `docs/specs/<historias>/STORY-117-verificar-cierre-epic-21/verify-report.md` | AC-1, AC-2, AC-3, CNF-2 |
| Logs y transcripción | crear, efímero | `.tmp/story-verify/STORY-117/evidence/V-NN.log`, `.tmp/story-verify/STORY-117/*.tgz` | CNF-2 |
| Repositorios de prueba | crear y borrar, efímero | `mktemp -d` fuera del repo | CNF-1, AC-2 |
| Motor de memoria | reutilizar sin cambios | `skills/memory-system/scripts/memory-system.js` (y su copia instalada) | AC-1, AC-2 |
| Fixtures | reutilizar sin cambios | `skills/memory-system/examples/specs-3-levels/` (STORY-114) | AC-2 |
| Empaquetado e instalador | reutilizar sin cambios | `npm pack`, `scripts/cli.js install` | CNF-1 |
| Skills de flujo | reutilizar sin cambios | `sddf-init`, `project-flow`, `epic-from-project-plan`, `story-specify`, `story-plan`, `story-implement`, `story-verify` | AC-2 |

No se modifica ningún archivo versionado salvo `verify-report.md` y el frontmatter de `story.md` que escriben los skills del pipeline.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `memory-system.js scaffold --root <dir> [--date]` | Crea la raíz si existe el padre; exit 0; informe `[CREADO] <ruta>` y resumen | AC-2 |
| `memory-system.js migrate --root <dir> --from specs-3-levels [--dry-run]` | Informe D-13 de STORY-114; con `--dry-run` última línea `cambios pendientes: N`; exit 0 / 1 (`[NO MIGRADO]`) / 2 | AC-1, AC-2 |
| `memory-system.js index --root <dir>` | Regenera `<dir>/index.md`; exit 0 | AC-2 |
| `memory-system.js check --root <dir> [--json]` | Exit 0 sin problemas, 1 con problemas, 2 error; JSON `{ok, summary{kind:n}, problems[{kind,path,detail}]}` | AC-1, AC-2 |
| `npx agile-sddf install --target claude-code` | Copia skills y agentes a `<cwd>/.claude/` | CNF-1 |
| `/story-verify STORY-117 --mode manual` | Requiere `IMPLEMENT/DONE`; escribe `verify-report.md` y deja `VERIFY/DONE` o rechazo | AC-3, CNF-2 |

## Esquema de datos

**Fila de la matriz de cierre** (sección `Coverage Analysis`):

| Campo | Valores |
|---|---|
| `ID` | `P-0`, `V-01`…`V-17`, `V-11c` |
| `Criterio` | Texto del criterio de salida, smoke test o fila de AC-2 |
| `Estado inicial` | `REPO_ROOT@<SHA>` o descripción del temporal |
| `Comando` | Comando exacto (o secuencia de slash commands + referencia al guion) |
| `Exit` | Código de salida |
| `Extracto` | Líneas decisivas de la salida |
| `Resultado` | `PASS` · `FAIL` · `N/A` · `NO EJECUTADA` |
| `Responsable` | Historia de D-12 (solo `FAIL`/`NO EJECUTADA`) |
| `Área` | Referencia a la tabla de áreas de D-12 |
| `SHA` | SHA en que obtuvo el resultado (arrastre de D-12) |

**Log temporal:** `V-NN.log` con cabecera `# V-NN · <fecha> · SHA <sha> · cwd <ruta>`, el comando y la salida completa
(stdout + stderr).

## Flujos clave

### F-1 — Cierre con todo en verde (AC-1, AC-2)

P-0 `PASS` → V-01…V-10 y V-12 en `REPO_ROOT` → `npm pack` → V-13, V-14, V-15 (un temporal cada una) → V-16 → V-17 (mismo temporal)
→ V-11 compuesto → `story-verify` escribe la matriz con todo `PASS` (V-11c `N/A`) → `VERIFY/DONE` → ACCEPTANCE.

### F-2 — Una verificación falla (AC-3)

Se ejecutan todas las verificaciones posibles (salvo las dependientes, `NO EJECUTADA`) → cada `FAIL` va a `Findings` con su
responsable → `Recommendations` agrupa las correcciones → la historia queda en VERIFY. La corrección se hace en la historia
responsable o en una nueva.

### F-3 — Reverificación tras corregir (AC-3)

Nuevo `SHA` → P-0 → diff contra el SHA de la ejecución anterior → se repiten `FAIL`, `NO EJECUTADA` y las `PASS` con área tocada →
el resto se arrastra con su SHA → la ejecución anterior pasa al historial.

### F-4 — Degradación (P7)

- P-0 falla → ninguna verificación; reporte con P-0 `FAIL`.
- `npm pack` o la instalación fallan → V-13…V-17 `FAIL` atribuidas a STORY-108 (instalación) con el log; V-01…V-12 siguen siendo
  válidas.
- `specs-3-levels` no admitido por el motor (STORY-114 no integrada) → V-07, V-14 y V-15 `FAIL` con el mensaje de uso (exit 2),
  responsable STORY-114.
- La sesión interactiva se interrumpe → V-16/V-17 `NO EJECUTADA`; se repiten en la siguiente ejecución desde un temporal nuevo.
- Sin Git Bash en Windows → el procedimiento no se adapta a PowerShell; se ejecuta con Git Bash (requisito del procedimiento).

## Decisiones de complejidad justificada

- **Instalar desde un tarball** en lugar de usar el árbol de trabajo: es lo único que prueba el artefacto que se publicará como 4.0.0;
  cuesta un `npm pack` y una instalación por temporal, sin código nuevo.
- **Tabla de áreas** en lugar de "repetir lo afectado" a criterio: AC-3 exige no repetir lo que pasó, y sin una regla escrita esa
  decisión no es reproducible. Es una tabla, no un mecanismo.
- **Lista de excepciones de V-06**: sin ella el criterio de la épica es imposible de cumplir mientras exista la migración.
- Lo que **no** se añade: script de verificación, suite e2e, exclusiones en `check`, sección nueva en el template de `story-verify`.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Cobertura de los criterios de salida | La matriz tiene una fila por cada uno de los 11 criterios de salida de `epic.md` (V-01…V-11) más V-12, cada una con comando, exit, extracto y resultado | AC-1 |
| 2 | Config sin niveles numerados | V-12 con exit 1 de `grep` y la lista de archivos revisados | AC-1 |
| 3 | Las cinco filas de AC-2 | V-13…V-17 registradas con estado inicial, comando o secuencia y comprobaciones; V-16/V-17 con el guion | AC-2 |
| 4 | Reproducibilidad | Cada V-13…V-17 indica su temporal (`mktemp -d`), el `$TGZ` y el SHA; ningún comando lee `REPO_ROOT/docs` | CNF-1 |
| 5 | Fallo registrado y atribuido | Todo `FAIL` tiene hallazgo `CRITICAL` en `Findings` y `Responsable` según D-12; con algún `FAIL` la historia no queda en `VERIFY/DONE` | AC-3 |
| 6 | No repetición | En una segunda ejecución, las `PASS` arrastradas conservan su SHA y su área no interseca el diff | AC-3 |
| 7 | Evidencia en el artefacto estándar | `git status` tras VERIFY solo muestra `verify-report.md` y `story.md` de STORY-117 | CNF-2 |

## Risks / Trade-offs

- [V-08/V-09 fallan por registros preexistentes ajenos a EPIC-21] → La política es absoluta (D-11); el reporte propone la historia de
  saneamiento. Hacerla **antes** de verificar evita una segunda ejecución (CR-005).
- [V-16/V-17 dependen de un LLM y no son deterministas] → La evidencia son comprobaciones deterministas sobre el resultado; el guion
  fija las entradas. Una ejecución no reproduce byte a byte la anterior, pero sí el criterio.
- [Coste de la sesión interactiva] → Una sola vez por ejecución; solo se repite si su área cambia (D-12).
- [La lista de excepciones oculta una referencia indebida dentro de `memory-system`] → La matriz lista cada coincidencia admitida con
  archivo y línea; la revisión es visible en el reporte.
- [La fixture `specs-3-levels` no representa un repo real] → Es la fixture que fija STORY-114 con todos los documentos de
  `01-projects/`; la migración de este propio repo la cubren V-01…V-09.
- [`sddf.config.yaml` declara scripts npm inexistentes (`test:e2e:smoke`, `test:contract`, `test:performance`)] → Solo afectan a
  verificaciones opcionales del modo config-driven, que esta historia no usa; queda anotado en CR-004.

## Open Questions

Ninguna. Las ambigüedades se resolvieron en las decisiones y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: el criterio de salida "Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni
  `specs/03-stories/`" no admite la lógica de migración y detección de `memory-system` (STORY-114 CR-005). D-5 aplica la lista de
  excepciones.
- **Documento afectado**: epic.md (EPIC-21)
- **Acción requerida**: añadir al criterio "salvo la lógica de migración y detección de `memory-system`" antes del cierre. Si no se
  añade, la matriz deja constancia de que V-06 se evaluó con la lista de D-5.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: el criterio "Los tres modos SDD (Intent-First, Spec-Anchored, Spec-as-Source) funcionan" incluye un modo sin flujo
  ejecutable (Non-Goal de la historia) y usa "Intent-First" donde la guía y la constitución dicen Spec-First.
- **Documento afectado**: epic.md (EPIC-21)
- **Acción requerida**: reformular como "Spec-First y Spec-Anchored funcionan con la nueva estructura; Spec-as-Source es compatible en
  lo estructural". Mientras tanto rige D-10 (V-11 compuesto, V-11c `N/A`).

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: el "Dado" de AC-1 ("STORY-104 a STORY-116 están en DONE") usa un `substatus` como si fuera un estado, y deja fuera
  a STORY-118, que también pertenece a la épica.
- **Documento afectado**: story.md
- **Acción requerida**: precisar "en `ACCEPTANCE/DONE`, `DELIVER` o `COMPLETED` (o `CANCELED`)" y que STORY-118 no es precondición
  (V-05 admite `requirements/` fragmentado o un `srs-*.md`). D-4 ya aplica esta lectura.

### CR-004
- **Tipo**: dependencia
- **Descripción**: la nota "Infraestructura existente" cita `npm run test:e2e:smoke` y los fixtures de `examples/` como base; el script
  no existe en `package.json`. Las fixtures útiles son `examples/empty` y `examples/specs-3-levels` (STORY-114). `sddf.config.yaml`
  referencia además `test:e2e:*`, `test:contract` y `test:performance`, también inexistentes.
- **Documento afectado**: story.md
- **Acción requerida**: corregir la nota (D-1 descarta la automatización). Los scripts inexistentes de `sddf.config.yaml` quedan fuera
  de alcance (Non-Goal "Cambiar `sddf.config.yaml`"); se registran en `Recommendations` del reporte.

### CR-005
- **Tipo**: dependencia
- **Descripción**: con la línea base de 2026-10-08, V-08 y V-09 fallarían por 48 `broken-wikilink` y 8 `orphan`, la mayoría ajenos a
  EPIC-21 (EPIC-17, EPIC-20 `[[STORY-100-slug]]`, STORY-053, STORY-103, STORY-118, `domains/`, archivos sin frontmatter). Además, la
  propia `story.md` de esta historia enlaza `[[ADR-0013-eliminar-specs-01-projects]]` (cuerpo y `related`), que no resuelve: el slug
  del ADR es `eliminar-specs-01-projects`.
- **Documento afectado**: story.md, epic.md (EPIC-21)
- **Acción requerida**: (1) en story.md, reescribir el wikilink y la entrada de `related` a `eliminar-specs-01-projects`; (2) añadir a
  EPIC-21 una historia de saneamiento de memoria (wikilinks a slugs vigentes y frontmatter en los huérfanos, por D-11) para ejecutarla
  antes de esta verificación. Sin ella, V-08 y V-09 serán `FAIL` atribuidas a esa historia nueva y la épica no podrá cerrarse.
