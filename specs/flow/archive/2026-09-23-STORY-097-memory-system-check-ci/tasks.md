---
alwaysApply: false
type: tasks
id: STORY-097
slug: STORY-097-memory-system-check-ci-tasks
title: "Tasks: Verificar la consistencia de la memoria con un modo check apto para CI"
date: 2026-09-20
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-097
design: STORY-097
related:
  - STORY-097-memory-system-check-ci
  - STORY-095-memory-system-index-alias
  - memory-system
---

<!-- Referencias -->
[[STORY-097-memory-system-check-ci]]
[[memory-system]]

> Trazabilidad: AC-n corresponde a los criterios numerados en design.md (4 ACs, 5 NFRs);
> D-n a las decisiones; F-n a los flujos; V-n a los contratos de verificación; CR-n a los
> cambios registrados. Orden: evals y fixtures (RED) → evaluadores y subcomando check en el
> motor → modo check en SKILL.md → documentación y corrección de la memoria del repo →
> verificación. Precondición: motor de STORY-095 (escáner, parser, LAYERS, HARNESS_PROFILES);
> si no existe, T004 lo crea mínimo y STORY-095 lo hereda.

## 1. Evals y fixtures (fase RED)

- [x] T001 Añadir a skills/memory-system/evals/evals.json los casos: `check` sobre
  examples/broken (salida contiene `[missing-layer]`, `[orphan]`, `[invalid-frontmatter]`,
  `[broken-wikilink]` y `problemas: 4`; exit 1); `check --json` sobre broken (salida contiene
  `"ok": false` y `"broken-wikilink"`); `check` sobre examples/sddf sano (contiene
  `problemas: 0`; exit 0); fail-fast `check --root no-existe` (stderr contiene `raíz
  inexistente`; exit 2) — AC-1, AC-2, AC-4, D-4, D-5, V-11.
- [x] T002 [P] Crear el fixture skills/memory-system/examples/broken/ con exactamente un
  problema por familia (sin `product/`; `guides/notas.md` sin frontmatter;
  `adr/ADR-0003-x.md` sin `title`; `guides/sdd.md` con `[[no-existe]]`) y los casos de falso
  positivo (`` `[[en-codigo]]` `` inline, fence con `[[en-fence]]`, `[[sdd|Alias]]`,
  `[[sdd#sec]]`, `templates/story-template.md` con `[[<slug>]]`, `guides/guia.md` con
  frontmatter sin `id`) — AC-3, D-2, D-3.
- [x] T003 [P] Añadir a test/memory-system.test.js los casos: broken → 4 problemas (uno por
  kind), exit 1, hashes intactos; sddf sano → `ok: true`, exit 0; `--json` parseable con las
  cinco claves y `problems` ordenado por (kind, path, detail); corregir `[[no-existe]]` en
  copia temporal → `ok: true`; falsos positivos → 0 `broken-wikilink`; guía sin `id` no es
  `invalid-frontmatter` pero historia sin `status` sí; perfil con `skipLayers: ['specs']` no
  reporta `specs/`; dos ejecuciones → stdout idéntico; `--root no-existe` y `--harness foo`
  → exit 2, stderr con mensaje, stdout `{ "ok": false, "error": … }` con `--json`; `check`
  sobre `docs/` de este repo < 5 s — AC-1…AC-4, NFR-1, NFR-2, V-1…V-10.

## 2. Motor: evaluadores y subcomando check

- [x] T004 Añadir a skills/memory-system/scripts/memory-system.js la constante
  `REQUIRED_FIELDS = { all: [type, slug, title], specs: [id, status] }` y fijar la extracción
  de wikilinks compartida con `index` según D-2 (eliminar fences y código inline, capturar
  `[[…]]`, recortar `|alias` y `#ancla`, descartar vacíos y `<…>`); si el motor de STORY-095
  no existe aún, crear el esqueleto CLI, el escáner y el parser mínimos — AC-3, D-1, D-2,
  D-3, CR-002.
- [x] T005 Implementar los cuatro evaluadores puros `(ctx) → Problem[]`: `missingLayers`
  (LAYERS menos `profile.skipLayers`), `orphans`, `invalidFrontmatter` (un problema por campo
  ausente, `detail: "falta <campo>"`), `brokenWikilinks` (un problema por ocurrencia, `detail:
  "[[slug]] no resuelve"`, contra el `slugSet` que incluye raíces externas); ordenar por
  (kind, path, detail) — AC-1, AC-3, NFR-1, D-1.
- [x] T006 Implementar el subcomando `check` con flags `--json` y `--harness`: detect →
  escaneo único → evaluadores → salida textual agrupada por familia con la línea final
  `problemas: N (kind n · …)` o JSON único `{ harness, root, ok, summary, problems }` con
  claves en orden estable; `path` relativo con `/`; exit 0/1; errores técnicos → stderr,
  exit 2 y, con `--json`, stdout `{ "ok": false, "error" }`; nada más en stdout con `--json`
  — AC-1, AC-2, AC-4, NFR-1, NFR-4, D-4, F-1, F-3.
- [x] T007 Ejecutar `node --test test/memory-system.test.js` hasta verde (GREEN), medir el
  tiempo sobre `docs/` de este repositorio (< 5 s) y refactorizar sin cambiar contratos —
  NFR-2, V-1…V-10.

## 3. Modo check en SKILL.md y referencias

- [x] T008 Añadir a skills/memory-system/SKILL.md el modo `check [--json] [--harness h]`:
  invocación del motor, reenvío de stdout tal cual, propagación del exit code, y la
  degradación inline sin `node` (cuatro reglas desde references/memory-rules.md, informe
  textual y aviso "⚠️ node no disponible — sin exit code; no usar en CI") — AC-1, AC-2, NFR-3,
  D-5, F-4.
- [x] T009 [P] Ampliar skills/memory-system/references/memory-rules.md con la sección "Check"
  (cuatro familias y sus reglas, `REQUIRED_FIELDS`, reglas de extracción de wikilinks de D-2,
  esquema JSON y exit codes) — AC-3, D-2, D-3, D-4.
- [x] T010 Ejecutar `npm run test:eval -- memory-system` y ajustar SKILL.md hasta que los
  casos de T001 pasen; comprobar que SKILL.md sigue < 500 líneas — V-11.

## 4. Documentación y memoria del repositorio

- [x] T011 Actualizar docs/architecture/memory-system.md: §10 con el modo `check` (familias,
  esquema JSON, exit codes) y §7 invariante 2 reescrito como "`type`, `slug`, `title` (+ `id`,
  `status` en specs); esquema completo en `header-aggregation`" — NFR-5, D-6, CR-001.
- [x] T012 [P] Añadir a docs/guides/sddf-commands-pipeline.md §0 el ejemplo de gate CI
  (`node .claude/skills/memory-system/scripts/memory-system.js check --root docs --json`) y
  la nota de complementariedad con `npm run verify:links`; actualizar README.md y
  CHANGELOG.md 3.3.0 (Added check) — NFR-5, D-5, D-6, CR-003.
- [x] T013 Ejecutar `check` sobre `docs/` de este repositorio, corregir solo frontmatter
  faltante y wikilinks rotos evidentes, registrar en implement-report.md los problemas
  restantes como deuda y volver a ejecutar hasta que la lista sea la aceptada — AC-1, D-6.

## 5. Verificación de extremo a extremo

- [x] T014 Ejecutar el guardrail gr-skill-creation-checklist sobre skills/memory-system
  (bloques Python en 0, greps sin salida) — V-12.
- [x] T015 Ejecutar la verificación sugerida de story.md: `check` en este repositorio sin
  falsos positivos; romper un wikilink en una guía → exit 1 y problema en `--json`; ningún
  hash de `docs/` cambia tras `check` — AC-1, AC-2, AC-4, V-1, V-4.
- [x] T016 Ejecutar `npm run verify:links`, `npm run verify:eval-inventory`,
  `npm run verify:syntax` y `npm test`; registrar resultados en implement-report.md —
  NFR-5, V-12.

- [x] Implementar fix-directives.md
