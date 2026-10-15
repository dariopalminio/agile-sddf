---
type: tasks
id: STORY-131
slug: STORY-131-partir-project-pm-en-roles-locales-tasks
title: "Tasks: Partir project-pm en roles locales"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
story: STORY-131
design: STORY-131
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-131-partir-project-pm-en-roles-locales
  - STORY-131-partir-project-pm-en-roles-locales-design
---

<!-- Referencias -->
[[STORY-131-partir-project-pm-en-roles-locales]] · [[STORY-131-partir-project-pm-en-roles-locales-design]]

> Orden: línea base → roles locales → orquestador `project-begin` → orquestador `project-discovery` → textos de soporte → evals → verificación → entorno local.
> T002 crea `discovery-pm.md` leyendo el original **antes** del `git mv` de T003; T003 mueve el archivo **sin editarlo**, para que git
> detecte el renombrado, y las ediciones de `begin-intent.md` van en T004. En los roles se conservan literales los encabezados y el texto
> de las secciones, salvo los tres ajustes de D-3 (CNF-1). Todo archivo creado o modificado se guarda en UTF-8 sin BOM.

## 1. Línea base

- [ ] T001 Verificar el estado de partida del Context de `design.md`: `git ls-files agents/project-pm.agent.md` lista el archivo y `wc -l` da 57; `git ls-files skills/project-begin/assets/agents skills/project-discovery/assets/agents` no devuelve nada; `cmp docs/templates/vision-template.md skills/project-begin/assets/vision-template.md` no devuelve nada; si algo difiere, detener la historia e informar qué pieza no coincide — D-1, D-6, AC-1

## 2. Roles locales

- [ ] T002 Crear `skills/project-discovery/assets/agents/discovery-pm.md` desde `agents/project-pm.agent.md`: frontmatter de I-1 (`alwaysApply: false`, `name: discovery-pm`, `description: Rol entrevistador del skill project-discovery: conduce el discovery de usuarios y refina el alcance. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.`, `role: Product Manager — Discovery`), sin `tools:` ni `model:`; intro (hoy l.14) con «Actúas en el estado **Discovery** del skill `project-discovery`», conservando «Las rutas siempre llegan resueltas desde el skill orquestador: no las derives»; copiar literal `## Principios de PM`, `## Protocolo de Resiliencia para Entrevistas Multivuelta` (paso 1 con «Usa `AskUserQuestion`, si el runtime la ofrece, para preguntas con opciones…») y `## Estado Discovery — Discovery de usuarios y refinamiento` completo; no incluir `## Estado Visión` — D-1, D-2, D-3, I-1, I-2, AC-1, CNF-1, CNF-2
- [ ] T003 Crear `skills/project-begin/assets/agents/` y ejecutar `git mv agents/project-pm.agent.md skills/project-begin/assets/agents/begin-intent.md`, sin modificar el contenido en este paso (requiere T002) — D-1, AC-1, AC-2
- [ ] T004 En `skills/project-begin/assets/agents/begin-intent.md`: sustituir el frontmatter por el de I-1 (`alwaysApply: false`, `name: begin-intent`, `description: Rol entrevistador del skill project-begin: captura y refina la visión del producto. Lo lee y ejecuta la sesión del skill; no se invoca como subagente.`, `role: Product Manager — Visión`), retirando `tools:` y `model:`; intro con «Actúas en el estado **Visión** del skill `project-begin`», conservando la frase de rutas resueltas; Protocolo, paso 1, con «si el runtime la ofrece» (D-3.2); `## Estado Visión`, paso 6, con «devuelve el control al flujo del skill» (D-3.3); borrar la sección `## Estado Discovery` completa — D-2, D-3, I-1, I-2, I-4, AC-1, CNF-1, CNF-2

## 3. Orquestador `project-begin`

- [ ] T005 En `skills/project-begin/SKILL.md`, aplicar los textos de D-6: `description` (l.4) «mediante una entrevista de intención con project-pm» → «mediante una entrevista de intención que conduce la sesión con su rol local begin-intent», sin tocar el resto ni `triggers`; Objetivo (l.18) «con el agente `project-pm`» → «siguiendo el rol local `assets/agents/begin-intent.md`»; Objetivo (l.24) → «Conduce la entrevista y la escritura inicial con el rol `begin-intent`»; Dependencias (l.41) → «Rol local: `assets/agents/begin-intent.md` (entrevistador, lo lee esta sesión)» — D-6, AC-1
- [ ] T006 En `skills/project-begin/SKILL.md`, añadir al final del Paso 0, después de resolver `SPECS_BASE` y antes del Paso 1, la comprobación de D-5: verificar que existe `assets/agents/begin-intent.md` (relativo al directorio del skill); si falta, emitir I-3 (`❌ Rol local no encontrado: assets/agents/begin-intent.md (skill project-begin). Reinstala el skill; no se modificó ningún archivo.`) y terminar sin resolver el template, preguntar, escribir ni crear `.tmp/`; redactar la ausencia de fallback como «no se buscan roles fuera del directorio de este skill», sin nombrar la carpeta global (requiere T005) — D-5, I-3, F-2, AC-2
- [ ] T007 En `skills/project-begin/SKILL.md`, renombrar el Paso 3 a «Paso 3 — Entrevista con el rol `begin-intent`»: la sesión lee `assets/agents/begin-intent.md` y sigue su `## Estado Visión` con `$TEMPLATE_PATH`, `$VISION_PATH`, `$MODE` y `$PENDING_SECTIONS` ya resueltos; conservar el bloque actual de parametrización (dos fases, 3–4 preguntas, `full`/`resume`, escritura, resiliencia) y añadir «Esta sesión conduce la entrevista; no lances un subagente para este paso»; en el Paso 1 (l.83) cambiar «el agente no la reconstruye» por «el rol no la reconstruye», para que no quede un agente inexistente (requiere T006) — D-4, I-2, I-4, F-1, AC-1

## 4. Orquestador `project-discovery`

- [ ] T008 En `skills/project-discovery/SKILL.md`, aplicar los textos de D-6: Dependencias (l.27) → «Rol local `assets/agents/discovery-pm.md` (entrevistador, lo lee esta sesión). Agentes `project-ux` y `project-architect`, invocados secuencialmente por esta sesión»; Restricciones (l.35) → «El rol y los agentes reciben rutas ya resueltas; ninguno resuelve la raíz ni delega en otro agente» — D-6, AC-1
- [ ] T009 En `skills/project-discovery/SKILL.md`, añadir al final del Paso 0, antes del Paso 1, la comprobación de D-5 sobre `assets/agents/discovery-pm.md`, redactada como una lista de roles locales que STORY-132 y STORY-133 puedan ampliar; si falta, emitir I-3 (`❌ Rol local no encontrado: assets/agents/discovery-pm.md (skill project-discovery). Reinstala el skill; no se modificó ningún archivo.`) y terminar sin validar la visión, limpiar `.tmp/project-discovery/proposal/`, preguntar ni escribir; misma frase de ausencia de fallback que T006 (requiere T008) — D-5, I-3, F-3, AC-1
- [ ] T010 En `skills/project-discovery/SKILL.md`, reescribir el Paso 4 (l.71): definir `$DISCOVERY_SUMMARY_PATH = .tmp/project-discovery/discovery-summary.md`; la sesión lee `assets/agents/discovery-pm.md` y sigue su `## Estado Discovery` con `$VISION_PATH`, `$STAKEHOLDERS_PATH` y `$OUTPUT_PATH = $DISCOVERY_SUMMARY_PATH`; añadir «Esta sesión conduce la entrevista; no lances un subagente para este paso» y conservar que el rol escribe solo el resumen; los pasos 5–8 no cambian y siguen invocando `project-ux` y `project-architect` (requiere T009) — D-4, I-2, I-4, F-3, AC-1

## 5. Textos de soporte

- [ ] T011 [P] En `skills/project-begin/README.md:9`, cambiar «con el agente `project-pm`» por «con su rol local de entrevista `begin-intent`, que conduce la propia sesión del skill»; no tocar el resto del README — D-6, AC-1
- [ ] T012 [P] En `skills/project-begin/assets/vision-template.md` y `docs/templates/vision-template.md`, editar igual los comentarios `# escritor:`: `(project-pm)` → `(rol begin-intent)` en las líneas que lo contienen (hoy l.2–5, l.7 y l.8, como indica D-6); l.6 → `# escritor: project-begin (rol begin-intent: IN-PROGRESS · DONE tras confirmar)`; confirmar con `cmp` que los dos archivos siguen idénticos (contrato 7) — D-6, CR-001, AC-1
- [ ] T013 [P] En `docs/guides/harness-eng-agents-orchestration.md`, reemplazar solo el párrafo de la l.182 («Excepción documentada — Subagente interactivo») por el texto literal de D-7 («Excepción en retirada — Subagentes interactivos: …»), sin nombrar a los entrevistadores pendientes; no tocar el resto de la guía (requiere T003) — D-7, CR-002, AC-1

## 6. Evals

- [ ] T014 [P] En `skills/project-begin/evals/evals.json`, añadir tras TC-006, con el mismo formato multilínea y `threshold: 1.0`, los casos de D-8: TC-007 (`fail-fast`, contexto «Existen `docs/templates/vision-template.md` y `docs/product/vision.md` con `substatus: TODO`. No existe `skills/project-begin/assets/agents/begin-intent.md`.», `contains` `❌ Rol local no encontrado` y `assets/agents/begin-intent.md`, `not_contains` `agents/project-p\u006d` y `substatus: IN-PROGRESS`) y TC-008 (`happy-path`, contexto de D-8 con `Confirmar`, `contains` `begin-intent.md`, `substatus: DONE` y `/project-discovery`, `not_contains` `agents/project-p\u006d` y `project-p\u006d.agent.md`); TC-001…TC-006 sin cambios; validar que el JSON parsea con `node -e "JSON.parse(require('fs').readFileSync('skills/project-begin/evals/evals.json','utf8'))"`; escribir `project-p\u006d` literal en el archivo (regla de escape de D-8, CR-003) y confirmar que `git grep -n "project-pm" -- skills/project-begin/evals` no devuelve nada — D-8, CR-003, AC-1, AC-2
- [ ] T015 [P] En `skills/project-discovery/evals/evals.json`, añadir tras TC-006, con el mismo formato y `threshold: 1.0`, los casos de D-8: TC-007 (`happy-path`, contexto de D-8 con `vision.md` en `DONE`, el rol `discovery-pm.md` presente, sin `agents/project-p\u006d.agent.md` y con UX y arquitectura devolviendo resultados; `contains` `discovery-pm.md` y `.tmp/project-discovery/discovery-summary.md`, `not_contains` `agents/project-p\u006d`) y TC-008 (`fail-fast`, sin `skills/project-discovery/assets/agents/discovery-pm.md`; `contains` `❌ Rol local no encontrado` y `assets/agents/discovery-pm.md`, `not_contains` `agents/project-p\u006d`, `discovery-summary.md` y `Confirmar`); TC-001…TC-006 sin cambios; validar que el JSON parsea; escribir `project-p\u006d` literal en el archivo (regla de escape de D-8, CR-003) y confirmar que `git grep -n "project-pm" -- skills/project-discovery/evals` no devuelve nada — D-8, CR-003, AC-1, AC-2

## 7. Verificación de criterios de aceptación

- [ ] T016 [P] Verificar AC-1 (contratos 1 y 2): `git ls-files skills/project-begin/assets/agents skills/project-discovery/assets/agents` lista exactamente `begin-intent.md` y `discovery-pm.md`, y `git ls-files agents/project-pm.agent.md` no devuelve nada — AC-1, AC-2
- [ ] T017 [P] Verificar AC-1 y AC-2 (contrato 3): `git grep -n "project-pm" -- skills docs/templates/vision-template.md docs/guides/harness-eng-agents-orchestration.md` no devuelve nada, y `grep -n "agents/" skills/project-begin/SKILL.md skills/project-discovery/SKILL.md | grep -v "assets/agents/"` no devuelve nada — AC-1, AC-2
- [ ] T018 [P] Verificar CNF-1 (contrato 4): `grep -c "^## Principios de PM$\|^## Protocolo de Resiliencia para Entrevistas Multivuelta$"` da 2 en cada rol; `grep -l "^## Estado Visión"` sobre los dos roles lista solo `begin-intent.md` y `grep -l "^## Estado Discovery"` lista solo `discovery-pm.md` — CNF-1
- [ ] T019 [P] Verificar CNF-1 (contrato 5): `git diff -M main -- agents skills/project-begin/assets/agents skills/project-discovery/assets/agents` muestra el renombrado `project-pm.agent.md` → `begin-intent.md` y el archivo nuevo `discovery-pm.md`, con cambios limitados al frontmatter (D-2), los tres ajustes de D-3 y la sección de estado retirada en cada rol — CNF-1
- [ ] T020 [P] Verificar CNF-2 (contrato 6): `wc -l` de `begin-intent.md` y de `discovery-pm.md` da menos de 57 en cada uno, y ninguno conserva `tools:` ni `model:` en el frontmatter — CNF-2
- [ ] T021 [P] Verificar codificación: los tres primeros bytes de los dos roles, los dos `SKILL.md`, `skills/project-begin/README.md`, los dos `vision-template.md`, la guía de orquestación y los dos `evals.json` no son `EF BB BF`, y `grep -lE "Ã|ðŸ"` sobre ellos devuelve vacío — CNF-1
- [ ] T022 Ejecutar `npm run verify:repository` y confirmar exit 0 (incluye `test/install.test.js`, el smoke del tarball y la auditoría de skills/agentes con 9 archivos en `agents/`); si falla, corregir antes de cerrar (requiere T016–T021) — contrato 9, AC-1
- [ ] T023 Dejar indicado en `implement-report.md` que el contrato 8 (`npm run test:eval -- project-begin` y `npm run test:eval -- project-discovery`, TC-001…TC-008 en verde) queda a ejecución manual del humano, según `AGENTS.md`; recordar la mitigación de Risks: si un TC-001…TC-006 falla porque el runner asume que falta el rol, añadir «existe el rol local» a su `input.context` sin tocar `expected` — contrato 8, AC-1, AC-2

## 8. Entorno local de dogfooding

- [ ] T024 Reinstalar con `npx agile-sddf install --target claude-code --force` y borrar a mano la copia no versionada `.claude/agents/project-pm.agent.md`; comprobar que existen `.claude/skills/project-begin/assets/agents/begin-intent.md` y `.claude/skills/project-discovery/assets/agents/discovery-pm.md` — Risks «Entorno local», AC-1
