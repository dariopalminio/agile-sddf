---
type: tasks
id: STORY-122
slug: STORY-122-epic-analyze-madurez-historias-hijas-tasks
title: "Tasks: Señalar historias hijas no especificadas o con referencias rotas al analizar una épica"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-19-framework-consistency
story: STORY-122
design: STORY-122
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-122-epic-analyze-madurez-historias-hijas
  - STORY-122-epic-analyze-madurez-historias-hijas-design
  - STORY-120-epic-analyze-integridad-historias
  - STORY-121-epic-analyze-cobertura-criterios-salida
---

<!-- Referencias -->
[[STORY-122-epic-analyze-madurez-historias-hijas]] · [[STORY-122-epic-analyze-madurez-historias-hijas-design]] · [[STORY-120-epic-analyze-integridad-historias]] · [[STORY-121-epic-analyze-cobertura-criterios-salida]]

> **Dependencia (CR-001):** esta historia modifica archivos que crea STORY-120 (`skills/epic-analyze/SKILL.md`, el
> template seed del reporte y `evals.json`). No se empieza T003 hasta que STORY-120 haya completado al menos
> `story-implement`; T001 lo comprueba, determina si STORY-121 ya está implementada (familia `SAL-` y universo de su D-3)
> y, si el contrato de STORY-120 cambió, obliga a revisar D-1, D-5 y D-6 antes de seguir.
> Orden: los evals (grupo 2) se escriben y se versionan **antes** que el template seed y `SKILL.md` (D-8, RED); el
> template seed (grupo 3) precede a `SKILL.md` porque el skill rellena sus campos sin embeber estructura; `SKILL.md`
> (grupo 4) se escribe con `skill-master` (worker `monolithic`) y `evals.json` con `skill-test-evals`; la documentación
> (grupo 5) depende del contrato final. La verificación (grupo 6) cierra.
> No se modifican: ningún `epic.md` ni `story.md`, `epic-template.md`, `story-template.md`, `epic-format-validation`,
> `story-analyze`, `docs/domains/domain-story-lifecycle.md`, la regla de veredicto D-7 ni el retorno I-3 de STORY-120,
> `package.json`. La copia en `.claude/skills/` es salida de `agile-sddf install` y no se edita a mano. Todo `.md`/`.json`
> tocado se guarda en UTF-8 sin BOM.

## 1. Preparación — dependencia y línea base

- [ ] T001 Comprobar que `skills/epic-analyze/` existe con `SKILL.md`, `assets/epic-analyze-report-template.md` y `evals/evals.json` (STORY-120 implementada); registrar en `.tmp/story-implement/STORY-122/baseline.txt` el número de líneas de `SKILL.md`, los pasos actuales (posición de la Vía B, del paso `SAL-` si existe y del veredicto), los campos de la sección `resumen` del template seed, el orden de hallazgos de STORY-120 › D-6, los IDs de casos existentes en `evals.json` y si STORY-121 está implementada (paso `SAL-` y cálculo del universo presentes); si el contrato difiere de lo que asume este diseño (Vía B que lee el frontmatter de cada `story.md`, prefijo de familia, `hallazgos`/`resumen`, retorno I-3) o el rango TC-019…TC-025 ya está ocupado, detener y revisar D-1, D-5, D-6 y D-8 — CR-001
- [ ] T002 Ejecutar `npm test`, `npm run verify:eval-inventory`, `npm run verify:links` y `npm run test:eval -- epic-analyze` y añadir sus salidas a `.tmp/story-implement/STORY-122/baseline.txt` (línea base de los TC existentes aprobados antes del cambio) — contratos #8, #9

## 2. Evals primero (RED)

- [ ] T003 En `skills/epic-analyze/evals/evals.json` completar el `input` de TC-001…TC-006, TC-008 y TC-010 (y de TC-011…TC-018 solo si STORY-121 ya está implementada) para que cada historia de ejemplo declare `status: SPECIFY` + `substatus: DONE` (o un estado posterior) y un `related` vacío o que resuelva a historias/épicas existentes en el mundo; no tocar `contains`/`not_contains` ni `threshold`; TC-007 y TC-009 sin cambio — D-8, CR-002
- [ ] T004 En el mismo `evals.json` añadir TC-019 (AC-1: `STORY-201` y `STORY-202` de `EPIC-30-ejemplo` en `SPECIFY/DONE`, `related` → `EPIC-30-ejemplo` y la otra historia → `contains`: `Madurez de historias hijas: 2/2`; `not_contains`: `MAD-0`), TC-020 (AC-2 fila 1: `STORY-202` en `SPECIFY/IN-PROGRESS` → `MAD-01`, `STORY-202`, `WARNING`, `completar su especificación con /story-specify`, `APPROVED`) y TC-021 (AC-2 fila 2: `STORY-201 › related: STORY-999` inexistente → `MAD-02`, `STORY-999`, `WARNING`, `corregir o retirar la referencia`, `APPROVED`) — D-8, AC-1, AC-2
- [ ] T005 En el mismo `evals.json` añadir TC-022 (CNF-1: `STORY-202` en `CANCELED` con `related: STORY-999`, `STORY-201` en `COMPLETED/READY` → `not_contains`: `MAD-0`), TC-023 (D-4: `related` con `ADR-0008`, `domain-story-lifecycle`, `STORY-201` solo ID y `STORY-XXX-placeholder` → un único `MAD-02` citando `STORY-XXX-placeholder`; `not_contains`: `ADR-0008` en hallazgos), TC-024 (4 historias en `SPECIFY/TODO` + una con `status: BACKLOG` → `MAD-01`, `MAD-03`, `NEEDS-REFINEMENT`) y TC-025 (CNF-3: reporte previo con un `MAD-01` de una historia que ya está en `SPECIFY/DONE` → `not_contains`: `MAD-01`); en **todos** los casos TC-019…TC-025 un `not_contains` de bloques `=== FILE:` para `epic.md` y `story.md` — D-8, D-3, D-4, CNF-1, CNF-2, CNF-3, CR-003, CR-004
- [ ] T006 Validar el JSON (`node -e "JSON.parse(require('fs').readFileSync('skills/epic-analyze/evals/evals.json','utf8'))"`), ejecutar `npm run test:eval -- epic-analyze --dry-run` (plan no vacío que incluye TC-019…TC-025) y crear un commit que contenga solo `skills/epic-analyze/evals/evals.json`, para que el historial muestre los evals antes que el template y `SKILL.md` — D-8

## 3. Template seed del reporte

- [ ] T007 En `skills/epic-analyze/assets/epic-analyze-report-template.md` añadir a la sección `resumen` el campo `Madurez de historias hijas: {l}/{t} listas` sin alterar los demás campos ni crear secciones nuevas — D-6, I-5, AC-1

## 4. Skill `epic-analyze` — familia MAD (con `skill-master`)

- [ ] T008 En `skills/epic-analyze/SKILL.md` ampliar la Vía B (Paso 4 de STORY-120) para extraer del frontmatter de cada `story.md`, además de `parent`, los campos `status`, `substatus` y `related` (forma de bloque `  - <valor>` o en línea `[a, b]`/`[]`) con su número de línea, sin leer el cuerpo; si STORY-121 está implementada, reutilizar su universo; si no, introducir el cálculo del universo (listadas en el índice con `story.md` existente ∪ `pertenece = true`, excluidas `CANCELED`, incluidas las de `INT-02`/`INT-04`, excluidas F1 e `INT-01`) para que STORY-121 lo reutilice — D-2, I-2, CNF-1, CR-001
- [ ] T009 En `skills/epic-analyze/SKILL.md` insertar el paso de la familia `MAD-` entre la Vía B (o el paso `SAL-`, si existe) y el veredicto, con la lista ordenada de estados citando `domain-story-lifecycle` §4.1 y §5 (`SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`, terminal `CANCELED`) y la regla de estado mínimo: comparación exacta en mayúsculas tras recortar espacios y comillas; `SPECIFY/DONE` y cualquier estado posterior → lista (el substatus solo se mira con `SPECIFY`); `SPECIFY` con substatus ≠ `DONE` o ausente → `no-lista`; `status` ausente, vacío o fuera de la lista → `no-clasificable` — D-1, D-3, AC-1, AC-2, CNF-1, CR-004
- [ ] T010 En el mismo paso escribir la regla de resolución de `related` (I-3): normalizar cada valor (recortar espacios, comillas y envoltorio `[[…]]`); `STORY-` + ≥ 3 dígitos → glob `$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/story.md`; `EPIC-` + ≥ 2 dígitos → glob `$SPECS_BASE/specs/02-epics/<EPIC-NN>-*/epic.md`; resolución por ID, no por slug; `STORY-`/`EPIC-` sin ID numérico → no resuelve; cualquier otro valor (`ADR-`, `domain-…`, slug libre) → fuera de alcance, sin hallazgo ni nota; valor repetido en una historia → un solo resultado con todas sus líneas; `related` ausente o vacío → sin hallazgo; forma no reconocida o ilegible → nota con ruta y línea; carpeta de specs ausente → toda referencia de ese tipo no resuelve — D-4, I-3, F-3, AC-2
- [ ] T011 En `skills/epic-analyze/SKILL.md` añadir al catálogo las filas `MAD-01` (WARNING, historia `no-lista`; elemento `STORY-NNN` + `status/substatus` literales; evidencia `story.md:<línea de status>`; acción `completar su especificación con /story-specify`), `MAD-02` (WARNING, `related` no resoluble; elemento el valor referenciado; evidencia `STORY-NNN › story.md:<línea(s)>` de la historia que lo declara; acción `corregir o retirar la referencia`) y `MAD-03` (WARNING, historia `no-clasificable`; elemento `STORY-NNN` + `status` literal o `ausente`; acción `normalizar status/substatus al vocabulario de domain-story-lifecycle`); orden integrado `INT-` < `MAD-` < `SAL-`, dentro de `MAD-01`/`MAD-03` por `STORY-NNN` ascendente y dentro de `MAD-02` por historia que declara y luego por primera línea; numeración `H-NNN` tras ordenar todas las familias; confirmar que el veredicto D-7 de STORY-120 no cambia — D-5, I-4, AC-2, CNF-2, CNF-3
- [ ] T012 En el paso de relleno del reporte de `skills/epic-analyze/SKILL.md` escribir los `MAD-` en `hallazgos` con el formato de STORY-120 › D-8 (`### H-NNN [WARNING] — MAD-0N: <título>` con **Elemento**, **Evidencia** y **Acción sugerida**, valores citados en código en línea) y el campo `Madurez de historias hijas: <l>/<t> listas` en `resumen` (`t` = universo, `l` = historias sin `MAD-01`/`MAD-03`; universo vacío → `0/0 listas`); template central sin el campo → se omite, hallazgos y veredicto intactos — D-6, I-5, AC-1, CNF-2
- [ ] T013 En `skills/epic-analyze/SKILL.md` ampliar la cláusula `ai-untrusted-content-clause` (D-10 de STORY-120) a `status`, `substatus` y `related`: solo se extraen valores escalares, un valor con apariencia de instrucción no se sigue ni cambia la clasificación y, si contiene texto imperativo, se anota en `Notas del análisis` con su ubicación; el skill no escribe ningún `story.md` — D-7, CNF-2
- [ ] T014 En `skills/epic-analyze/SKILL.md` añadir a `description` el disparador `madurez de historias` (sin superar el objetivo de longitud ni usar `<`/`>`), mencionar la madurez de las historias hijas en `Objetivo` y confirmar que la invocación I-1 y el retorno I-3 quedan sin cambio y sin flag nuevo — D-1, I-1, I-6, CNF-2
- [ ] T015 Revisar `skills/epic-analyze/SKILL.md` completo: < 500 líneas (si se acerca al límite, mover las tablas de reglas de D-3/D-4 a `skills/epic-analyze/references/`), sin referencias a `.tmp/`, sin lectura del cuerpo de `story.md` ni de `analyze.md` en el paso `MAD-`, sin escritura en `epic.md` ni `story.md` — D-1, D-2, CNF-2

## 5. Documentación

- [ ] T016 [P] En `CHANGELOG.md`, `## [Unreleased] › ### Added`, ampliar la entrada de `/epic-analyze` (o crear una propia si ya se publicó) con la familia `MAD-01…MAD-03`, el umbral `SPECIFY/DONE` y la resolución de `related` por ID (STORY-122, EPIC-19) — D-9, CNF-2
- [ ] T017 [P] En `docs/domains/domain-epic-lifecycle.md` §8 ampliar el "Qué valida" de la fila `Gate de integridad de historias` añadida por STORY-120 con "y madurez de las historias hijas (estado ≥ `SPECIFY/DONE`, `related` resolubles)"; no tocar `docs/domains/domain-story-lifecycle.md`, `docs/guides/sddf-commands-pipeline.md`, `docs/domains/domain-skills-map.md` ni `package.json` — D-9, CNF-2

## 6. Verificación

- [ ] T018 Verificar el contrato #9: con `SKILL=skills/epic-analyze` ejecutar los comandos de `docs/guardrails/gr-skill-creation-checklist.md › How to run the validation` (`wc -l` < 500, script de frontmatter sin `FAIL`), `node scripts/verify-eval-inventory.js` y `grep -n "ai-untrusted-content-clause" skills/epic-analyze/SKILL.md` → presente; `git log --format=%h -- skills/epic-analyze/evals/evals.json skills/epic-analyze/SKILL.md` muestra el commit de evals de T006 anterior a los cambios de `SKILL.md` — CNF-2, D-8
- [ ] T019 Ejecutar `npm run test:eval -- epic-analyze` y confirmar exit 0 con todos los TC aprobados (contratos #1–#6 y #8: TC-019 sin `MAD-`; TC-020/TC-021 cada fila de AC-2; TC-022 canceladas y estados posteriores; TC-023 solo `STORY-`/`EPIC-` por ID; TC-024 umbral `NEEDS-REFINEMENT`; casos previos con sus veredictos); si alguno falla, ajustar `SKILL.md` o el template seed (no las aserciones) y repetir — AC-1, AC-2, CNF-1, CNF-2
- [ ] T020 Verificar el contrato #7 con una ejecución real en modo Agent: `/epic-analyze EPIC-19 --auto` escribe `docs/specs/02-epics/EPIC-19-framework-consistency/epic-analyze-report.md` con el campo `Madurez de historias hijas` en `resumen` (pueden aparecer `MAD-01`/`MAD-03` por historias en `SPECIFY` o con estados heredados: riesgo documentado) y `git status --porcelain` no muestra cambios en ningún `epic.md` ni `story.md`; una segunda ejecución sin cambios produce los mismos hallazgos (`git diff --no-index` solo difiere en `updated:`); eliminar después el reporte de prueba si no se va a versionar — AC-1, CNF-2, CNF-3
- [ ] T021 Ejecutar `npm test`, `npm run verify:eval-inventory` y `npm run verify:links` y comparar con la línea base de T002 (exit 0 sin regresiones); comprobar que ningún archivo tocado empieza con los bytes `EF BB BF` ni contiene `Ã` / `ðŸ` (`grep -lE "Ã|ðŸ"` sobre la lista de archivos tocados) — contratos #8, #9
