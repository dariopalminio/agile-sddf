---
alwaysApply: false
type: tasks
id: STORY-177
slug: STORY-177-corregir-rutas-story-code-review-tasks
title: "Tasks: Corregir rutas de story-code-review"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-177
design: STORY-177
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-177-corregir-rutas-story-code-review
  - STORY-177-corregir-rutas-story-code-review-design
---

<!-- Referencias -->
[[STORY-177-corregir-rutas-story-code-review]] · [[STORY-177-corregir-rutas-story-code-review-design]]

> Alcance: solo la fuente `skills/story-code-review/` y `test/`. Las copias instaladas en `.claude/skills/` y demás runtimes no se tocan: son salida de `agile-sddf install` (design.md, Non-Goals).

## 1. Precondición y pruebas primero (RED)

- [x] T001 Comprobar el estado de partida que cita design.md (Context): último caso de `skills/story-code-review/evals/evals.json` es TC-023; el Paso 3b de `skills/story-code-review/SKILL.md` (bloque de contexto en las líneas 330-337, Agentes 1-4 en las líneas 343-355) y las líneas de ruta de los cuatro agentes (`tech-lead-reviewer.agent.md:6,10,73,100`, `product-owner-reviewer.agent.md:7,11,78,127`, `integration-reviewer.agent.md:7,11,83,135`, `security-reviewer.agent.md:7,11,32,54,138,184`); existen `docs/guardrails/gr-code-security-checklist.md` y `docs/guardrails/gr-ai-security-checklist.md`, y no existe ningún `docs/policies/*security-checklist*.md`. Si alguna línea se desplazó, anotar la nueva ubicación y anclar los cambios a la sección, no al número. Hecho: se conocen el primer ID libre (TC-024) y la ubicación real de cada punto de cambio.
- [x] T002 Añadir a `evals.json` los casos TC-024 `informes-parciales-en-directorio-de-historia` (AC-1) y TC-025 `checklist-de-guardrails-sin-enlace-en-constitucion` (AC-2), con el formato de simulación de TC-001 a TC-023 y exactamente los inputs, `contains` y `not_contains` de D-4. En TC-025, `agent_results` no incluye `security_checklist_sources` (C-6, D-4). Depende de T001. Hecho: `npm run verify:eval-inventory` acepta los dos IDs y no hay duplicados.
- [x] T003 Reescribir en `evals.json` la descripción de TC-008 como «un proyecto sin archivos `docs/guardrails/gr-*security*` ni skill de seguridad instalado», conservando `id`, `name`, input y expectativas (`baseline`, `(verdict: APPROVED)`, `CODE-REVIEW`, `DONE`) (C-6, D-4, AC-3). Depende de T002 (mismo archivo). Hecho: `evals.json` no contiene `docs/policies` y el diff de TC-008 solo toca la descripción.
- [x] T004 [P] Crear `test/story-code-review-paths.test.js` con `node:test`, leyendo los archivos como `test/verify-fixed-layout.test.js`, con las cuatro aserciones de D-5: (1) el `output:` del frontmatter de cada agente es exactamente `.tmp/story-code-review/{story_id}/<rol>-report.md` para `<rol>` ∈ {`tech-lead`, `product-owner`, `integration`, `security`}; (2) ni `SKILL.md` ni los cuatro agentes contienen una ruta `.tmp/story-code-review/<nombre>-report.md` sin el segmento `{story_id}/`; (3) ninguno contiene `docs/policies/*security-checklist`; (4) `SKILL.md` y `security-reviewer.agent.md` contienen `docs/guardrails/gr-*security*.md` (C-7, CNF-1). Hecho: `node --test test/story-code-review-paths.test.js` falla con el código actual en las cuatro aserciones (RED).

## 2. Orquestador story-code-review (componente central)

- [x] T005 Añadir `$STORY_ID` al bloque de contexto del Paso 3b de `skills/story-code-review/SKILL.md`, con el `id` del frontmatter de `story.md` como valor (ej. `STORY-177`), sin cambiar el resto de variables (C-1, I-1, D-1, AC-1). Hecho: los cuatro agentes reciben `$STORY_ID` en el mismo bloque.
- [x] T006 Reescribir la descripción del Agente 4 (Auditor de Seguridad) en el Paso 3b de `SKILL.md`: las fuentes del proyecto son el glob `docs/guardrails/gr-*security*.md` unido a los checklists enlazados desde la constitución o el DoD, deduplicados por ruta; después, el skill de seguridad instalado y, por último, el baseline embebido. Se elimina toda mención a `docs/policies/` (C-1, I-3, D-2, AC-2, CNF-1). Depende de T005 (mismo archivo). Hecho: la descripción nombra `docs/guardrails/gr-*security*.md` y no `docs/policies/*security-checklist*.md`.
- [x] T007 Añadir al mensaje de progreso del Paso 3b, tras las cuatro líneas de agentes, la línea `   📁 Informes parciales → .tmp/story-code-review/{story_id}/` (C-1, I-6, AC-1). Depende de T006 (mismo archivo). Hecho: los Pasos 3a y 4a y `## Salida` quedan sin cambios (`git diff` solo muestra el Paso 3b).

## 3. Revisores: ruta del informe parcial y fuentes de seguridad

- [x] T008 [P] Actualizar `skills/story-code-review/agents/tech-lead-reviewer.agent.md` en los cinco puntos de I-2: `description` y `output:` del frontmatter con `.tmp/story-code-review/{story_id}/tech-lead-report.md`; «Contexto recibido» con `$STORY_ID` y la aclaración de que `{story_id}` es `$STORY_ID`; `## Output requerido` y la regla «No escribir nada fuera de…» con la misma cadena literal. Añadir la degradación de F-3: si `$STORY_ID` falta o está vacío, el revisor no escribe ningún archivo y devuelve el control; no crea el directorio (C-2, I-1, I-2, D-1, AC-1, CNF-1). Hecho: `.tmp/story-code-review/tech-lead-report.md` ya no aparece en el archivo.
- [x] T009 [P] Aplicar los mismos cambios de T008 a `skills/story-code-review/agents/product-owner-reviewer.agent.md` con `<rol>` = `product-owner` (C-3, I-2, AC-1, CNF-1). Hecho: `.tmp/story-code-review/product-owner-report.md` ya no aparece en el archivo.
- [x] T010 [P] Aplicar los mismos cambios de T008 a `skills/story-code-review/agents/integration-reviewer.agent.md` con `<rol>` = `integration` (C-4, I-2, AC-1, CNF-1). Hecho: `.tmp/story-code-review/integration-report.md` ya no aparece en el archivo.
- [x] T011 [P] Aplicar los mismos cambios de T008 a `skills/story-code-review/agents/security-reviewer.agent.md` con `<rol>` = `security`, incluida la ruta de la misión (línea 32) (C-5, I-2, AC-1, CNF-1). Hecho: `.tmp/story-code-review/security-report.md` ya no aparece en el archivo.
- [x] T012 Reescribir el descubrimiento de fuentes del Paso 2a de `security-reviewer.agent.md`: glob `docs/guardrails/gr-*security*.md` bajo `$REPO_PATH`, unido a las rutas de checklist de seguridad enlazadas desde `$CONSTITUTION_PATH` o `$DOD_PATH` que existan, deduplicado por ruta relativa a `$REPO_PATH`; cada fuente usada se lista una vez en `checklist-sources`. Un checklist ilegible o sin líneas `- [ ]` se descarta sin error. Los Pasos 2b y 2c y el formato de `checklist-sources` no cambian (C-5, I-3, I-5, D-2, F-3, AC-2, AC-3, CNF-1). Depende de T011 (mismo archivo). Hecho: el Paso 2a no menciona `docs/policies/`, y en este repo resolvería exactamente los dos checklists de `docs/guardrails/`.
- [x] T013 Generalizar en el Paso 2a de `security-reviewer.agent.md` el formato de línea de regla según I-4: `- [ ] <regla> — <método>: \`<rule-id>\` (error|warn)` con cualquier método (`grep`, `git ls-files`, `git check-ignore`, `python`…); una línea `- [ ] <regla>` sin método, id ni peso es regla semántica con id `<archivo>:<línea>` y severidad `LOW`; para los patrones, el revisor usa la definición del check del `rule-id` en la sección de validación del checklist, si existe, y si no, la prosa de la regla. La tabla de normalización de severidad del Paso 4 no cambia (C-5, I-4, D-3, AC-2). Depende de T012 (mismo archivo). Hecho: cada forma de línea de `gr-code-security-checklist.md` y `gr-ai-security-checklist.md` (incluidas las líneas 63-69 de este) encaja en una de las dos formas de I-4.

## 4. Verificación (GREEN)

- [x] T014 Ejecutar `node --test test/story-code-review-paths.test.js`: pasan las cuatro aserciones (contratos de verificación 1, 2 y 6; AC-1, CNF-1). Depende de T005-T013. Hecho: salida en verde copiada a `implement-report.md`.
- [x] T015 [P] Ejecutar `grep -rn "policies/\*security" skills/story-code-review/` y `grep -rnE "\.tmp/story-code-review/[a-z-]+-report\.md" skills/story-code-review/`: el primero no devuelve nada y el segundo solo devuelve rutas con `{story_id}/` o con un ID concreto en `evals.json` (contratos 2 y 6; CNF-1). Hecho: resultados registrados en `implement-report.md`.
- [x] T016 [P] Revisar a mano el Paso 2a de `security-reviewer.agent.md` contra los escenarios: AC-2 (solo `gr-code-security-checklist.md`, sin enlace en `constitution.md`) resuelve esa fuente por glob y no cae al baseline; AC-3 (sin `gr-*security*` ni skill instalado) llega al Paso 2c y declara `checklist-sources: [baseline-embebido]`; F-3 (`$STORY_ID` vacío) no escribe ningún archivo en ninguno de los cuatro agentes (contratos 4 y 5). Hecho: cada escenario tiene en `implement-report.md` la línea del agente que lo resuelve.
- [x] T017 Ejecutar `npm test` y `npm run verify:repository`; comprobar que los archivos modificados y creados son UTF-8 sin BOM (bytes iniciales distintos de `EF BB BF`) y que no contienen U+FEFF literal (contrato 7; CNF-2). Depende de T014. Hecho: ambos comandos en verde y salida resumida en `implement-report.md`.
- [x] T018 Registrar en `implement-report.md` el comando de evals `npm run test:eval -- story-code-review --only TC-008,TC-024,TC-025` (contratos 3, 4 y 5; AC-1, AC-2, AC-3) para que el humano decida si lo ejecuta; no ejecutarlo sin su indicación (AGENTS.md: evals a criterio humano). Hecho: el informe muestra el resultado o «no ejecutado, a criterio humano».
