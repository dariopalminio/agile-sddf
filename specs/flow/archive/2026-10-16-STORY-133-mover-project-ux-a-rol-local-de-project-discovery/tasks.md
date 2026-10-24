---
type: tasks
id: STORY-133
slug: STORY-133-mover-project-ux-a-rol-local-de-project-discovery-tasks
title: "Tasks: Mover project-ux a rol local de project-discovery"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-133
design: STORY-133
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-133-mover-project-ux-a-rol-local-de-project-discovery
  - STORY-133-mover-project-ux-a-rol-local-de-project-discovery-design
---

<!-- Referencias -->
[[STORY-133-mover-project-ux-a-rol-local-de-project-discovery]] · [[STORY-133-mover-project-ux-a-rol-local-de-project-discovery-design]]

> Orden: línea base → rol local → orquestador `project-discovery` → evals → verificación → entorno local.
> T001 bloquea toda la historia: si alguna precondición P-1…P-7 de D-8 falla, no se edita ningún archivo (WIP = 1, orden 131 → 132 → 133).
> T002 mueve el archivo **sin editarlo**, para que git detecte el renombrado, y las ediciones de `discovery-ux.md` van en T003.
> En el rol se conservan literales `## Entrada y salida` y `## Hallazgos requeridos`, encabezados incluidos; solo cambian el
> frontmatter (D-2) y las tres frases de D-3. Las ediciones de `SKILL.md` reemplazan la frase o la línea completa por el texto
> final de D-6, aunque STORY-131 o STORY-132 la hayan redactado con otras palabras. Todo archivo creado o modificado se guarda
> en UTF-8 sin BOM.

## 1. Línea base

- [x] T001 Verificar las precondiciones P-1…P-7 de D-8 sobre la rama actual: P-1 `git ls-files skills/project-discovery/assets/agents` lista exactamente `discovery-architect.md` y `discovery-pm.md`; P-2 `git ls-files agents/project-pm.agent.md agents/project-architect.agent.md` sin salida; P-3 `git ls-files agents/project-ux.agent.md` lista el archivo y `wc -l` da 29; P-4 las rutas `assets/agents/discovery-pm.md` y `assets/agents/discovery-architect.md` aparecen dentro del Paso 0 de `skills/project-discovery/SKILL.md`; P-5 `grep -c "UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md" skills/project-discovery/SKILL.md` da 1; P-6 los IDs de `skills/project-discovery/evals/evals.json`, leídos con `node -e`, son exactamente TC-001…TC-010; P-7 `git grep -n "project-pm\|project-architect" -- skills/project-begin/evals skills/project-discovery/evals skills/project-planning/evals` sin salida. Si alguna falla, detener la historia, informar qué pieza no coincide y no editar nada — D-8, contrato 0, AC-1, AC-2, AC-3

## 2. Rol local `discovery-ux`

- [x] T002 Ejecutar `git mv agents/project-ux.agent.md skills/project-discovery/assets/agents/discovery-ux.md`, sin modificar el contenido en este paso (requiere T001) — D-1, AC-1, AC-2
- [x] T003 En `skills/project-discovery/assets/agents/discovery-ux.md`: sustituir el frontmatter (l.1-13) por el de I-1 (`alwaysApply: false`, `name: discovery-ux`, `description: Rol entrevistador del skill project-discovery: refina perfiles, journeys, usabilidad y navegación con el usuario. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.`, `role: UX Designer — Discovery`), retirando `tools:` y `model:` y sin añadir `output:`; en la intro (hoy l.15), añadir «Actúas en el estado **Discovery** del skill `project-discovery`.» tras «Eres un UX Designer especializado en investigación de usuarios y flujos verificables.», conservar «Recibes rutas resueltas y no delegas trabajo» y añadir la frase de D-3.2 «Las restricciones de escritura de este rol rigen mientras lo ejecutas; después, el flujo del skill retoma el control y materializa solo tras su gate.»; en el párrafo final (hoy l.28) cambiar solo «sin wireframes ni instrucciones para otros agentes» por «sin wireframes ni instrucciones para otros roles»; `## Entrada y salida` y `## Hallazgos requeridos` quedan literales; no añadir el protocolo de resiliencia de `discovery-pm` (unas 24 líneas) (requiere T002) — D-2, D-3, I-1, I-2, I-4, AC-1, CNF-1

## 3. Orquestador `project-discovery`

- [x] T004 En `skills/project-discovery/SKILL.md`, aplicar los textos finales de D-6: Dependencias, reemplazar la línea de roles y agente que dejó STORY-132 por «Roles locales `assets/agents/discovery-pm.md`, `assets/agents/discovery-architect.md` y `assets/agents/discovery-ux.md` (los lee esta sesión).», sin tocar la línea de `references/layer-materialization.md`; Restricciones, reemplazar la frase de rutas resueltas por «Los roles reciben rutas ya resueltas; ninguno resuelve la raíz ni lanza subagentes.» (requiere T003) — D-6, AC-2, CNF-1
- [x] T005 En `skills/project-discovery/SKILL.md`, añadir `assets/agents/discovery-ux.md` a la lista de roles locales del Paso 0 que dejaron STORY-131 y STORY-132, con el mismo error I-3 (`❌ Rol local no encontrado: assets/agents/discovery-ux.md (skill project-discovery). Reinstala el skill; no se modificó ningún archivo.`); si faltan varios roles, una línea I-3 por rol ausente y terminar sin validar la visión, limpiar ni crear `.tmp/project-discovery/`, preguntar ni escribir en `$SPECS_BASE`; conservar la frase «no se buscan roles fuera del directorio de este skill» y la comprobación única al final del Paso 0 (requiere T004) — D-5, I-3, F-2, AC-3
- [x] T006 En `skills/project-discovery/SKILL.md`, renombrar el Paso 5 a «Paso 5 — Hallazgos UX con el rol `discovery-ux`» y sustituir su texto: la sesión lee `assets/agents/discovery-ux.md` (relativo al directorio del skill) y sigue sus instrucciones con `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH` y `$OUTPUT_PATH = $UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md` (definición que se conserva literal), refinando con el usuario perfiles, journeys y navegación; añadir «Esta sesión conduce el refinamiento UX con el usuario; no lances un subagente para este paso»; no citar ninguna sección `## Estado …` del rol; eliminar toda invocación de `project-ux` (requiere T005) — D-4, I-2, I-4, F-1, F-3, AC-1, AC-2, CNF-1
- [x] T007 En `skills/project-discovery/SKILL.md`, Paso 6, reemplazar la cláusula de fallo («Si el rol o el agente de UX fallan, o falta el manifiesto, …» o su redacción equivalente) por «Si algún rol falla o falta el manifiesto, …», sin cambiar el resto de la frase; si el Paso 4 conserva «… no invoca otros agentes.», cambiarlo por «… no lanza subagentes.»; los pasos 7 y 8 no cambian (requiere T006) — D-6, F-4, AC-2, CNF-1

## 4. Evals

- [x] T008 En `skills/project-discovery/evals/evals.json`: en TC-007 y TC-009 cambiar solo `input.context` «el agente de UX devuelve sus hallazgos» → «existe `discovery-ux.md` y el usuario responde el refinamiento UX», sin tocar `expected`; añadir tras TC-010, con el mismo formato multilínea y `threshold: 1.0`, TC-011 (`happy-path`, contexto de D-7 con `vision.md` en `DONE`, requisitos vacíos, los dos templates, los roles `discovery-pm.md`, `discovery-architect.md` y `discovery-ux.md` en `skills/project-discovery/assets/agents/`, sin `agents/project-ux.agent.md`, el usuario responde el refinamiento UX y elige `Confirmar`; `contains` `discovery-ux.md` y `.tmp/project-discovery/ux-findings.md`; `not_contains` `agents/project-ux` y `project-ux.agent.md`) y TC-012 (`fail-fast`, `vision.md` en `DONE`, templates y roles `discovery-pm.md` y `discovery-architect.md` presentes, sin `skills/project-discovery/assets/agents/discovery-ux.md`; `contains` `❌ Rol local no encontrado` y `assets/agents/discovery-ux.md`; `not_contains` `agents/project-ux`, `discovery-summary.md` y `Confirmar`); TC-001…TC-006, TC-008 y TC-010 sin cambios; escribir `project-ux` literal en el archivo (regla de escape de D-7) y confirmar que `git grep -n "project-ux" -- skills/project-discovery/evals` no devuelve nada (requiere T001) — D-7, AC-1, AC-2, AC-3

## 5. Verificación de criterios de aceptación

- [x] T009 [P] Verificar contratos 1 y 2: `git ls-files skills/project-discovery/assets/agents/discovery-ux.md` lista el archivo, `git ls-files agents/project-ux.agent.md` no devuelve nada y `git ls-files skills/project-discovery/assets/agents` lista exactamente `discovery-architect.md`, `discovery-pm.md` y `discovery-ux.md` — AC-1, AC-2
- [x] T010 [P] Verificar contrato 3: `git grep -n "project-ux" -- skills agents config test` no devuelve nada — AC-2
- [x] T011 [P] Verificar contrato 4: `grep -n "agents/" skills/project-discovery/SKILL.md | grep -v "assets/agents/"` no devuelve nada, y `grep -niE "(^|[^b])agentes?\b" skills/project-discovery/SKILL.md` no devuelve nada — AC-2, CNF-1
- [x] T012 [P] Verificar contrato 5 y la estructura de AC-3: `grep -n "assets/agents/discovery-ux.md" skills/project-discovery/SKILL.md` aparece en Dependencias, Paso 0 y Paso 5; `grep -c "UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md" skills/project-discovery/SKILL.md` da 1; el mensaje `❌ Rol local no encontrado` del Paso 0 cubre `assets/agents/discovery-ux.md` — AC-1, AC-3
- [x] T013 [P] Verificar contratos 6 y 7: `git diff -M main -- agents/project-ux.agent.md skills/project-discovery/assets/agents/discovery-ux.md` muestra el renombrado con cambios limitados al frontmatter (D-2) y a las tres frases de D-3, con `## Entrada y salida` y `## Hallazgos requeridos` intactos; `grep -E "^(tools|model):" skills/project-discovery/assets/agents/discovery-ux.md` no devuelve nada — D-2, D-3, AC-1, CNF-1
- [x] T014 [P] Verificar contrato 8: los tres primeros bytes de `discovery-ux.md`, `skills/project-discovery/SKILL.md` y `skills/project-discovery/evals/evals.json` no son `EF BB BF`, y `grep -lE "Ã|ðŸ"` sobre ellos devuelve vacío — AC-1
- [x] T015 [P] Verificar contrato 9: `node -e "JSON.parse(require('fs').readFileSync('skills/project-discovery/evals/evals.json','utf8'))"` termina sin error, los IDs son exactamente TC-001…TC-012 y el `not_contains` de TC-011, una vez parseado, contiene `agents/project-ux` — D-7, AC-2
- [x] T016 Ejecutar `npm run verify:repository` y confirmar exit 0 (incluye los tests de instalación, el smoke del tarball y la auditoría de skills/agentes, que comparan `agents/` de forma dinámica); si falla, corregir antes de cerrar (requiere T009–T015) — contrato 11, AC-1, AC-2
- [x] T017 Dejar indicado en `implement-report.md` que el contrato 10 (`npm run test:eval -- project-discovery`, TC-001…TC-012 en verde) queda a ejecución manual del humano, según `AGENTS.md`; recordar la mitigación de Risks: si un TC-001…TC-006 falla porque el runner asume que falta `discovery-ux.md`, añadir «existen los roles locales» a su `input.context` sin tocar `expected` — contrato 10, AC-1, AC-2, AC-3

## 6. Entorno local de dogfooding

- [x] T018 Reinstalar con `npx agile-sddf install --target claude-code --force`, borrar a mano la copia no versionada `.claude/agents/project-ux.agent.md` y comprobar que existe `.claude/skills/project-discovery/assets/agents/discovery-ux.md` — Risks «Entorno local», AC-1
