---
alwaysApply: false
type: tasks
id: STORY-095
slug: STORY-095-memory-system-index-alias-tasks
title: "Tasks: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder"
date: 2026-09-20
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-095
design: STORY-095
related:
  - STORY-095-memory-system-index-alias
  - STORY-044-directorio-docs-tipo-wiki
  - STORY-043-header-aggregation
  - memory-system
---

<!-- Referencias -->
[[STORY-095-memory-system-index-alias]]
[[memory-system]]

> Trazabilidad: AC-n corresponde a los criterios numerados en design.md (7 ACs, 5 NFRs);
> D-n a las decisiones; F-n a los flujos; V-n a los contratos de verificación; CR-n a los
> cambios registrados. Orden: evals y fixtures (RED) → motor determinista → assets y
> referencias → SKILL.md → alias y header-aggregation → documentación → verificación.
> Regla del repositorio: los evals se escriben antes del SKILL.md (constitución, principio 11).

## 1. Evals y fixtures (fase RED)

- [ ] T001 Crear skills/memory-system/evals/evals.json con: caso happy-path `index` sobre
  el fixture sddf (la salida contiene `nodos indexados:` y el índice contiene `[[STORY-001-a]]`
  y `[[sdd]]`), caso `index --dry-run` (no escribe), caso sin modo (la salida contiene
  "Modo ensure aún no disponible" y "Modos disponibles: index") y caso fail-fast
  `--harness foo` (mensaje de valor no admitido) — AC-1, AC-4, AC-7, D-1, D-2, V-10.
- [ ] T002 [P] Crear los fixtures skills/memory-system/examples/sddf/ (docs/ con
  constitution.md, adr/ADR-0001-x.md con slug en frontmatter, guides/sdd.md sin slug,
  policies/README.md, templates/story-template.md con `[[placeholder]]`,
  specs/03-stories/STORY-001-a/{story.md,design.md}, una guía con `[[no-existe]]` y otra sin
  frontmatter), examples/openspec/ (openspec/specs/auth/spec.md,
  openspec/changes/add-login/proposal.md, docs/ mínimo) y examples/speckit/ (.specify/ y
  specs/001-x/spec.md) — AC-1, AC-4, AC-5, D-2, D-3.
- [ ] T003 [P] Reescribir skills/docs-wiki-builder/evals/evals.json con dos casos: sin
  argumentos (la salida contiene el aviso literal "⚠️ docs-wiki-builder está deprecado. Usa
  /memory-system index." y la invocación de `memory-system index`) y `--dry-run` (delega en
  `index --dry-run`) — AC-2, AC-6, D-5, V-4.
- [ ] T004 [P] Crear test/memory-system.test.js (node --test) sobre los fixtures de T002:
  precedencia de `detect` y exit 2 con `--harness foo`; slugs según D-3; exclusiones
  (templates/, design.md, index.md, pre-split/); `index` ×2 idéntico salvo `updated`;
  wikilink `[[no-existe]]` en "Nodos pendientes" con exit 0; fixture openspec indexa
  `[[auth]]` y `[[add-login]]` sin escribir bajo openspec/ (hashes) — AC-1, AC-4, AC-5,
  V-1, V-2, V-3, V-6, V-7, V-8.

## 2. Motor determinista (scripts/memory-system.js)

- [ ] T005 Crear skills/memory-system/scripts/memory-system.js con el esqueleto CLI
  (`<sub> --root --harness --dry-run`, exit 2 si la raíz no existe o el subcomando es
  desconocido), la tabla HARNESS_PROFILES de D-2 con `skipLayers` y `mappings` vacíos, y
  solo módulos `node:` — AC-4, NFR-2, NFR-3, D-1, D-2.
- [ ] T006 Implementar el subcomando `detect` (precedencia `--harness` > sddf.config.yaml >
  .specify/ > openspec/ > generic; exit 2 con valor no admitido) — AC-4, D-2, F-4.
- [ ] T007 Implementar el parser de frontmatter (subconjunto YAML: escalares, cadenas
  entrecomilladas, listas `- item`; sin bloque → `hasFrontmatter=false`) y el escáner de
  nodos indexables con las reglas de slug, título, capa y exclusiones de D-3, incluidas las
  raíces externas de solo lectura del harness — AC-1, AC-4, AC-5, D-3.
- [ ] T008 Implementar el subcomando `index`: leer assets/index-template.md en runtime,
  sustituir `{layer:<capa>}` (ordenadas por ruta normalizada, formato
  `- [[slug]] — [archivo](ruta) — título`, `_(sin artefactos)_` si vacía, `⚠️ sin
  frontmatter` cuando aplica), `{layer:external}`, `{stats}` y `{date}`; añadir la sección
  "Nodos pendientes" a partir de los wikilinks no resueltos (ignorando código inline, fences,
  `|alias` y `#anchor`); escribir index.md o imprimirlo con `--dry-run`; exit 2 ante
  placeholder desconocido o capa con nodos sin placeholder; última línea `nodos indexados: N ·
  sin frontmatter: M · nodos pendientes: K` — AC-1, AC-5, NFR-1, D-4.
- [ ] T009 Ejecutar `node --test test/memory-system.test.js` hasta verde (GREEN) y
  refactorizar sin cambiar contratos — V-1, V-2, V-3, V-6, V-7, V-8.

## 3. Assets y referencias del skill

- [ ] T010 [P] Crear skills/memory-system/assets/index-template.md a partir del docs/index.md
  vigente (secciones Gobernanza, Especificaciones L3/L2/L1, capas de soporte, Artefactos
  externos, Estado del grafo) con los placeholders de D-4 y el frontmatter `type: wiki`,
  `slug: index`, `updated: {date}` — AC-1, AC-5, D-4.
- [ ] T011 [P] Crear skills/memory-system/references/memory-rules.md (< 300 líneas) con las
  reglas de slug/título/capa/exclusiones de D-3 y la tabla HARNESS_PROFILES de D-2, para la
  degradación inline del SKILL.md y para su reutilización por STORY-097 — AC-1, AC-5, D-3.

## 4. SKILL.md de memory-system

- [ ] T012 Crear skills/memory-system/SKILL.md (< 500 líneas; frontmatter solo
  name/description con frases "memory-system", "índice de docs", "regenerar index.md",
  "wikilinks"; sin `triggers:`): Paso 0 con el bloque SDDF-ROOT-RESOLUTION v1 y CLI_ROOT;
  parámetros (`index`, `--harness`, `--dry-run`); rama sin modo con el mensaje literal de
  AC-7; invocación del motor por `scripts/memory-system.js`; resumen final; degradación
  inline si `node` no está en PATH enlazando references/memory-rules.md; sección "Modos
  previstos" que nombra scaffold/ensure/rebuild/check/migrate como pendientes de
  STORY-096…098 — AC-1, AC-4, AC-7, D-1, F-1, F-3.
- [ ] T013 Ejecutar `npm run test:eval -- memory-system` y ajustar SKILL.md hasta que los
  casos de T001 pasen — AC-1, AC-7, V-10.

## 5. Alias deprecado y header-aggregation

- [ ] T014 Reducir skills/docs-wiki-builder/SKILL.md al alias de D-5: description que empieza
  por "Deprecado desde 3.3.0, se elimina en 4.0.0", aviso literal, mapeo `--update` → index,
  `--dry-run` → index --dry-run, sin args → index, invocación de memory-system y ninguna
  lógica propia — AC-2, AC-6, NFR-5, D-5, F-2.
- [ ] T015 Eliminar skills/docs-wiki-builder/assets/wiki-index-template.md, retirar la entrada
  `docs-wiki-builder` de config/eval-exemptions.json y comprobar que `npm run
  verify:eval-inventory` pasa con el eval de T003 — AC-6, D-5, V-9.
- [ ] T016 [P] Añadir en skills/header-aggregation/SKILL.md la nota de D-6 (memory-system
  lee slug/title de este esquema; sigue siendo independiente; STORY-096 podrá invocarlo desde
  ensure --fix-frontmatter); sin cambios funcionales — AC-3, D-6.
- [ ] T017 Ejecutar `npm run test:eval -- docs-wiki-builder header-aggregation` y ajustar el
  alias hasta que pasen — AC-2, AC-3, V-4, V-5.

## 6. Documentación y trazabilidad

- [ ] T018 Actualizar docs/architecture/memory-system.md con la sección "10. Herramienta:
  skill memory-system" (modo index, detección de harness, reglas de D-3, calendario de
  deprecación, modos pendientes por historia) — NFR-4, D-7.
- [ ] T019 [P] Añadir a docs/guides/sddf-commands-pipeline.md la subsección "0. Memoria del
  proyecto" con `/memory-system index` y la nota de deprecación de docs-wiki-builder —
  NFR-4, D-7.
- [ ] T020 [P] Actualizar README.md (fila de comandos y nota de deprecación) y CHANGELOG.md
  3.3.0 (Added memory-system index; Deprecated docs-wiki-builder, eliminación en 4.0.0) —
  NFR-4, AC-6, D-7.
- [ ] T021 [P] Verificar con `ls skills/` si AGENTS.md, CLAUDE.md o
  docs/domains/domain-skills-map.md listan skills y, solo en ese caso, añadir memory-system
  y marcar docs-wiki-builder como deprecado — NFR-4, D-7.
- [ ] T022 Retroalimentar story.md con CR-001 (dependencia de Node ≥ 18 con degradación
  inline) y CR-003 (comparación con el índice manual por entradas, no por descripciones) —
  CR-001, CR-003.
- [ ] T023 Regenerar docs/index.md con `/memory-system index`, revisar el diff frente al
  índice manual (mismas entradas por slug y ruta) y anotar en el commit las descripciones
  manuales que se pierden — AC-1, D-7, CR-003.

## 7. Verificación de extremo a extremo

- [ ] T024 Ejecutar el guardrail gr-skill-creation-checklist sobre skills/memory-system y
  skills/docs-wiki-builder (bloques Python en 0, greps sin salida) — V-11.
- [ ] T025 Ejecutar la verificación sugerida de story.md: `grep docs-wiki-builder skills/`
  devuelve solo el alias; `/memory-system index` produce un índice con las mismas entradas
  que el manual; `/docs-wiki-builder` produce el mismo index.md con aviso;
  `header-aggregation` invocable sola — AC-1, AC-2, AC-3, V-4, V-5.
- [ ] T026 Ejecutar `npm run verify:links`, `npm run verify:eval-inventory`,
  `npm run verify:syntax` y `npm test`; registrar resultados en implement-report.md —
  NFR-4, V-9, V-12.
