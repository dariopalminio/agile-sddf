---
type: tasks
id: STORY-115
slug: STORY-115-scaffold-dos-niveles-y-capas-destino-tasks
title: "Tasks: Actualizar scaffolding de memory-system a specs/ de dos niveles"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-115
design: STORY-115
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-115-scaffold-dos-niveles-y-capas-destino
  - STORY-115-scaffold-dos-niveles-y-capas-destino-design
---

<!-- Referencias -->
[[STORY-115-scaffold-dos-niveles-y-capas-destino]] · [[STORY-115-scaffold-dos-niveles-y-capas-destino-design]]

> Orden: la línea base (grupo 1) confirma que STORY-108 está integrada (`SPECS_LAYERS` con claves `epics`/`stories` y semillas
> `specs/epics/.gitkeep` y `specs/stories/.gitkeep`) y registra si STORY-111 y STORY-114 ya lo están, porque D-2, D-5 y D-8 tienen
> reglas condicionales (reutilizar o crear mínimo). El árbol semilla (grupo 2) y el módulo de niveles heredados (grupo 3) preceden al
> motor (grupo 4). Las pruebas (grupo 5) pueden escribirse en RED antes de la tarea que cubren (TDD de `story-implement`). Los evals
> (T017) se escriben antes que el `SKILL.md` (T018), principio 11. La verificación (grupo 8) cierra. Los CR-001…CR-004 del diseño
> afectan a `story.md` y a los diseños de STORY-108/STORY-111, no son tareas de implementación. Todo archivo `.md`/`.json`/`.js`
> tocado se guarda en UTF-8 sin BOM con saltos `\n`.

## 1. Preparación — línea base

- [ ] T001 Ejecutar `npm test`, `npm run verify:eval-inventory`, `npm run verify:links` y `node scripts/audit-root-resolution.js` y guardar las salidas en `.tmp/story-implement/STORY-115/baseline.txt`; registrar en el mismo archivo: claves actuales de `SPECS_LAYERS` en `skills/memory-system/scripts/memory-system.js` y presencia de `assets/scaffold/specs/{epics,stories}/.gitkeep` (STORY-108 integrada; si no lo está, detener: el diseño la asume), existencia de `skills/memory-system/scripts/specs-3-levels.js` y de `skills/memory-system/examples/specs-3-levels/` (STORY-114), existencia de `skills/project-planning/assets/roadmap-template.md` (STORY-111), último ID `TC-NNN` de `skills/memory-system/evals/evals.json`, existencia de `docs/specs/01-projects/` en este repo y la salida de `git grep -n "specs-projects\|01-projects" -- skills/memory-system test` — Context, D-2, D-5, D-8, contratos #6, #9

## 2. Árbol semilla `skills/memory-system/assets/scaffold/`

- [ ] T002 Eliminar con `git rm` la semilla `skills/memory-system/assets/scaffold/specs/01-projects/.gitkeep` (y el directorio que queda vacío) — D-1, AC-1
- [ ] T003 [P] Crear `skills/memory-system/assets/scaffold/requirements/functional/.gitkeep` y `skills/memory-system/assets/scaffold/requirements/non-functional/.gitkeep` vacíos (0 bytes), sin `README.md` propio en las subcarpetas — D-1, AC-1, CNF-4
- [ ] T004 [P] Crear `skills/memory-system/assets/scaffold/product/roadmap.md` con el esquema de D-2: frontmatter `type: product` · `slug: roadmap` · `title: "Roadmap del producto"` · `status: IN-PROGRESS` · `substatus: TODO` · `parent: null` · `created: {date}` · `updated: {date}` (sin anotaciones `escritor:`), `# Roadmap del producto`, la cita `> …` del template de STORY-111 D-2, `## Épicas` con la única línea `[Por completar: foto de las épicas existentes; la escribe /project-planning al registrar la primera propuesta]` y el pie `Volver al mapa: [[index]].`; sin sección `## Propuesta (…)`. Si T001 registró `roadmap-template.md`, copiar de él literalmente la cita y los encabezados fijos — D-2, AC-1, AC-3, CNF-2, CNF-4
- [ ] T005 [P] Modificar `skills/memory-system/assets/scaffold/product/README.md`: "Convención de nombres" pasa a "cuatro documentos fijos, `vision.md`, `stakeholders.md`, `objectives.md` y `roadmap.md`; cualquier otro documento de contexto en kebab-case (`<tema>.md`)", y la "Regla" añade que `roadmap.md` es el plan de épicas mientras `specs/epics/` contiene las épicas materializadas — D-3, AC-1, CNF-1
- [ ] T006 [P] Modificar `skills/memory-system/assets/scaffold/specs/README.md`: "Convención de nombres" pasa a "dos niveles: épicas (L2) e historias (L1)" con el árbol `specs/epics/EPIC-NN-<slug>/epic.md` y `specs/stories/STORY-NNN-<slug>/story.md`, y una frase que remite visión, stakeholders, objetivos y roadmap a `product/` y los requisitos a `requirements/`, con `[[index]]` como único wikilink; sin ninguna mención a `01-projects/` — D-4, AC-1, CNF-1, CNF-3
- [ ] T007 [P] Modificar `skills/memory-system/assets/scaffold/constitution.md`, sección "Jerarquía de desarrollo": "Una épica (epic) contiene varias historias (story)", árbol de dos líneas `epic (specs/epics/…/epic.md)` → `story (specs/stories/…/story.md)` y una frase que remite el contexto del producto a `product/` y `requirements/`; no tocar `docs/constitution.md` ni `docs/specs/README.md` de este repo (STORY-116) — D-4, CNF-1, CNF-3

## 3. Módulo de niveles heredados `skills/memory-system/scripts/specs-3-levels.js`

- [ ] T008 Si T001 registró `specs-3-levels.js` (STORY-114 integrada), añadir y exportar `detectLegacyLevels(specsBase)`; si no, crear el módulo mínimo con el patrón de `dod-story.js` (solo `node:fs`/`node:path`, sin `require` del motor en tiempo de carga) que exporte `LEGACY_LEVELS = { projects: '01-projects', epics: '02-epics', stories: '03-stories' }` y `detectLegacyLevels`. Contrato: devuelve, en el orden de `Object.values(LEGACY_LEVELS)`, los nombres que existen como **directorio** en `<specsBase>/specs/` (`fs.statSync`, sin recorrer su contenido); `[]` si `specs/` no existe o no es legible; nunca escribe ni lanza por ausencia — D-5, Interfaces, F-4, AC-2, CNF-3

## 4. Motor `skills/memory-system/scripts/memory-system.js`

- [ ] T009 Cambiar `SPECS_LAYERS` a `{ epics: 'specs-epics', stories: 'specs-stories' }` (quitar la clave `'01-projects'`), de modo que `KNOWN_LAYERS` deje de incluir `specs-projects` por derivación; no tocar el fallback `specs-<x>` de `deriveLayer` ni `validateLayers` — D-6, CNF-3
- [ ] T010 En `scaffold()` hacer `require('./specs-3-levels.js')` y, después de calcular el perfil y antes de colocar semillas, si `specs` no está en `skipLayers` y `detectLegacyLevels(specsBase)` devuelve una lista no vacía, insertar como **primer** elemento de `result.warnings` el texto `estructura de specs/ de tres niveles detectada (<n1>/, <n2>/…): ejecuta /memory-system migrate --from=specs-3-levels`; también con `--dry-run`; sin cambios en `summary`, en la última línea ni en el exit code 0 de `runScaffold`, y sin crear, modificar, mover ni eliminar nada bajo los niveles viejos — D-5, F-2, Interfaces, AC-2
- [ ] T011 [P] En `skills/memory-system/assets/index-template.md` eliminar el bloque `### L3 — Proyecto (specs/01-projects/)` con su placeholder `{layer:specs-projects}`, sin alterar el resto de secciones — D-6, CNF-3

## 5. Pruebas en `test/memory-system.test.js`

- [ ] T012 Actualizar `S096-UT-001`: `product/` incluye `roadmap.md`; existen `specs/epics/.gitkeep`, `specs/stories/.gitkeep`, `requirements/functional/` y `requirements/non-functional/`; **no** existen `specs/01-projects`, `specs/02-epics` ni `specs/03-stories` (rutas construidas con `LEGACY_LEVELS` importado de `specs-3-levels.js`) — D-8, contrato #1, AC-1
- [ ] T013 [P] Actualizar el test del árbol semilla exacto (l. 550-575): `expected` sin `specs/01-projects/.gitkeep` y con `product/roadmap.md`, `requirements/functional/.gitkeep` y `requirements/non-functional/.gitkeep`, igual al árbol de "Esquema de datos"; y en `S096-UT-001b` añadir `assert.ok(!engine.KNOWN_LAYERS.includes('specs-projects'))` — D-8, contratos #1, #4, CNF-1, CNF-3
- [ ] T014 Añadir `S115-UT-001` (copia de `examples/sane` en `mkdtemp`; crear con `LEGACY_LEVELS` `docs/specs/<projects>/PROJ-01-demo/project.md`, `…/<epics>/EPIC-01-demo/epic.md` y `…/<stories>/STORY-001-demo/story.md`; `hashTree` de los tres directorios idéntico antes y después; stdout contiene `[WARNING] estructura de specs/ de tres niveles detectada (01-projects/, 02-epics/, 03-stories/): ejecuta /memory-system migrate --from=specs-3-levels`; `status` 0, igual al de una corrida sin esos directorios; la última línea casa `SCAFFOLD_SUMMARY`), `S115-UT-002` (solo `01-projects/` → el aviso nombra solo `01-projects/`; con `--dry-run` el aviso aparece y el árbol no cambia) y `S115-UT-003` (`--harness openspec` con `specs/01-projects/` en `SPECS_BASE` → sin `[WARNING] estructura`) — D-5, D-8, contrato #2, AC-2
- [ ] T015 [P] Añadir `S115-UT-004` (`examples/empty` → `scaffold`; reescribir `product/roadmap.md` con contenido propio; segundo `scaffold` → última línea empieza con `creados: 0 · sobrescritos: 0`, aparece `[PRESERVADO] product/roadmap.md` y el contenido es idéntico byte a byte) y `S115-UT-005` (encabezados `#`/`##` y pie de la semilla `product/roadmap.md` = encabezados no repetibles de `skills/project-planning/assets/roadmap-template.md`, excluido el bloque `## Propuesta (…)`; frontmatter con `type: product` y `slug: roadmap`; si el template no existe → `t.skip('roadmap-template.md pendiente de STORY-111')`) — D-2, D-8, contratos #3, #5, AC-3, CNF-2
- [ ] T016 [P] Añadir `S115-UT-006` (todo `.md` de `skills/memory-system/assets/scaffold/` no empieza con `EF BB BF` ni contiene `Ã` o `ðŸ`) y `S115-UT-007` (fixture temporal con `docs/specs/01-projects/PROJ-01-demo/project.md` → `index --dry-run` sale con 2, stderr nombra `specs-01-projects` y no se escribe nada) — D-6, D-8, contratos #6, #7, CNF-3, CNF-4

## 6. Evals, skill y reglas

- [ ] T017 En `skills/memory-system/evals/evals.json` (antes de tocar `SKILL.md`, principio 11): TC-007 añade `product/roadmap.md` a la lista de semillas `[CREADO]` de la descripción y a `expected.contains`, y `specs/01-projects` a `not_contains`; añadir el caso nuevo con el siguiente ID libre según T001 (`TC-025` si existen TC-023/TC-024; si no, `TC-023`): `scaffold` sobre `examples/specs-3-levels` contiene `[WARNING] estructura de specs/ de tres niveles detectada` y `migrate --from=specs-3-levels`, y no contiene `[SOBRESCRITO]` ni `Entorno inválido`; si la fixture no existe, crear la mínima `skills/memory-system/examples/specs-3-levels/` (`sddf.config.yaml` + `docs/specs/{01-projects/PROJ-01-demo/project.md, 02-epics/EPIC-01-demo/epic.md, 03-stories/STORY-001-demo/story.md}`); subir `version` (minor) — D-8, contrato #8, AC-1, AC-2
- [ ] T018 En `skills/memory-system/SKILL.md` (tras T017): "Qué hace este skill" (`scaffold` crea constitución, `product/*` incluido `roadmap.md`, `requirements/{functional,non-functional}/`, `specs/{epics,stories}/` y avisa con `[WARNING]` ante la estructura de tres niveles); contrato de salida de `scaffold` en el Paso 2 con la línea `[WARNING] estructura de specs/ de tres niveles detectada (…): ejecuta /memory-system migrate --from=specs-3-levels` antes del resumen; nueva regla **Estructura de tres niveles** junto a "Plantilla sin dueño instalado" (no bloquea; el skill reenvía el aviso tal cual); scaffold inline sin node (crea `requirements/functional/`, `requirements/non-functional/`, `specs/epics/`, `specs/stories/` con `.gitkeep` solo si faltaban y emite el mismo `[WARNING]` si existe algún nivel viejo); `## Salida` con `product/{README,vision,stakeholders,objectives,roadmap}.md`, `requirements/{functional,non-functional}/` y `specs/{epics,stories}/`. No cambiar el `description` del frontmatter (CR-004) y conservar intacto el bloque `SDDF-ROOT-RESOLUTION: v1` — D-7, CNF-1, AC-2
- [ ] T019 [P] En `skills/memory-system/references/memory-rules.md`: §2 "Capa" sin el mapeo `01-projects` → `specs-projects` y con la nota de que los niveles de tres niveles caen en el fallback `specs-<x>` (exit 2 en `index`) y que `scaffold` avisa; §3 sin `specs-projects` entre las capas conocidas; §5 tabla: fila de `product/` con `product/roadmap.md` (`product` / `roadmap`) y fila de `.gitkeep` con `specs/epics/.gitkeep`, `specs/stories/.gitkeep`, `requirements/functional/.gitkeep`, `requirements/non-functional/.gitkeep` ("solo si el directorio no existe"); §5 reglas: nueva viñeta **Estructura de tres niveles** con el texto exacto del aviso, no bloquea, exit 0, nada bajo los niveles viejos se toca y no aplica si el harness omite `specs` — D-6, D-7, CNF-1, CNF-3, AC-2

## 7. Release notes

- [ ] T020 En `CHANGELOG.md`, sección `[Unreleased]` (subsección `Changed`), agregar la entrada de STORY-115: `/memory-system scaffold` deja de crear `specs/01-projects/`, siembra `product/roadmap.md` y `requirements/{functional,non-functional}/`, avisa con `[WARNING]` (sin cambiar el exit code) ante la estructura de tres niveles remitiendo a `migrate --from=specs-3-levels`, y la capa de índice `specs-projects` se retira de `index`/`check` — D-1…D-7

## 8. Verificación

- [ ] T021 Ejecutar `npm test` y confirmar exit 0 con `S096-UT-001`, `S096-UT-001b`, el test del árbol semilla y `S115-UT-001…007` aprobados (o `S115-UT-005` omitido con motivo si STORY-111 no está integrada); comparar con la línea base de T001 — contratos #1–#7, CNF-1
- [ ] T022 Verificar `skills/memory-system/evals/evals.json` como JSON válido con IDs `TC-NNN` únicos, ejecutar `npm run verify:eval-inventory` (exit 0) y `npm run test:eval -- memory-system --dry-run` (planifica TC-007 y el caso nuevo); si se ejecutan los evals reales y alguno falla, ajustar el skill o el motor (no las aserciones) y repetir — contrato #8, AC-1, AC-2
- [ ] T023 Verificar CNF-3 y CNF-1 por grep: `git grep -n "specs-projects" -- skills test` solo devuelve la aserción negativa de `S096-UT-001b`; `git grep -n "01-projects" -- skills/memory-system` solo devuelve `scripts/specs-3-levels.js`, la fixture `examples/specs-3-levels/`, las evals del aviso/migrate y las notas de §2/§5 de `memory-rules.md` y del `SKILL.md`; `grep -n "roadmap.md\|requirements/functional/.gitkeep\|specs/epics/.gitkeep" skills/memory-system/references/memory-rules.md` nombra las mismas rutas que el árbol semilla — contratos #4, #6, CNF-1, CNF-3
- [ ] T024 [P] Ejecutar `node scripts/audit-root-resolution.js` (bloque `SDDF-ROOT-RESOLUTION: v1` intacto en `memory-system`), `npm run verify:links` y `npm run verify:syntax`, todos con exit 0, y verificar que ningún archivo creado o modificado empieza con los bytes `EF BB BF` ni contiene `Ã` / `ðŸ` — CNF-4, contrato #7
- [ ] T025 Índice del repo (contrato #9): solo si `docs/specs/01-projects/` ya no existe, ejecutar `node skills/memory-system/scripts/memory-system.js index --root docs` (exit 0) y confirmar que `docs/index.md` no contiene `L3 — Proyecto`; si aún existe, no regenerar y dejarlo anotado en `.tmp/story-implement/STORY-115/ac-manual.md` (riesgo documentado) — D-6, contrato #9, CNF-3
- [ ] T026 Validación manual de AC-1, AC-2 y AC-3 (F-1…F-3): en `.tmp/story-implement/STORY-115/manual/` ejecutar `/memory-system scaffold` sobre un directorio vacío (existen `docs/specs/{epics,stories}/`, `docs/product/{vision,stakeholders,objectives,roadmap}.md`, `docs/requirements/{functional,non-functional}/`; no existen los tres niveles viejos), editar `docs/product/roadmap.md` y repetir (última línea `creados: 0 · sobrescritos: 0 · …`, roadmap intacto), y sobre una copia de `examples/specs-3-levels` (aviso `[WARNING]` con `migrate --from=specs-3-levels`, exit 0, niveles viejos sin cambios); registrar el resultado en `.tmp/story-implement/STORY-115/ac-manual.md` — AC-1, AC-2, AC-3
