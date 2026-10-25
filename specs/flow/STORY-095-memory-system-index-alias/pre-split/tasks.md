---
alwaysApply: false
type: tasks
id: STORY-095
slug: STORY-095-memory-system-unificado-tasks
title: "Tasks: Unificar la gestión de memoria en un skill memory-system con modos"
date: 2026-09-20
status: PLAN
substatus: DONE
parent: EPIC-19-framework-consistency
story: STORY-095
design: STORY-095
related:
  - STORY-095-memory-system-unificado
  - STORY-044-directorio-docs-tipo-wiki
  - STORY-043-header-aggregation
  - STORY-054-inicializar-entorno-sddf
  - memory-system
---

<!-- Referencias -->
[[STORY-095-memory-system-unificado]]
[[memory-system]]

> Trazabilidad: AC-n corresponde a los criterios numerados en design.md (18 ACs, 7 NFRs);
> D-n a las decisiones de design.md; F-n a sus flujos; V-n a los contratos de verificación;
> CR-n a los cambios registrados. Orden: evals y fixtures (RED) → motor determinista →
> assets del scaffold e índice → SKILL.md de memory-system → integraciones (alias,
> sddf-init, header-aggregation) → documentación → verificación de extremo a extremo.
> Regla del repositorio: los evals se escriben antes del SKILL.md (constitución, principio 11).

## 1. Evals y fixtures (fase RED)

- [ ] T001 Crear skills/memory-system/evals/evals.json con al menos un caso happy-path por
  modo (ensure, scaffold, index, check, migrate, rebuild --force), un caso fail-fast
  (rebuild sin --force → mensaje exacto y sin escrituras) y un caso de detección de harness
  con --harness openspec; los fragmentos `contains` deben incluir los mensajes literales de
  D-6 y el resumen `creados: N · preservados: M · omitidos por harness: K` — AC-2…AC-7,
  AC-9, AC-12, AC-13, V-2, V-3, V-5, V-6.
- [ ] T002 [P] Crear los fixtures skills/memory-system/examples/sddf-partial/ (docs/ con
  specs/ y templates/ pero sin product/ ni requirements/README.md),
  examples/speckit/ (.specify/memory/constitution.md + specs/001-x/spec.md, sin
  sddf.config.yaml), examples/openspec/ (openspec/specs/auth/spec.md +
  openspec/changes/add-login/proposal.md) y examples/generic/ (vacío); cada fixture
  incluye un archivo con wikilink roto y otro sin frontmatter para ejercitar check —
  AC-4, AC-5, AC-9, AC-13, D-2, D-5.
- [ ] T003 [P] Añadir a skills/docs-wiki-builder/evals/evals.json un caso mínimo que
  verifique el aviso literal "⚠️ docs-wiki-builder está deprecado. Usa /memory-system
  index." y la delegación a memory-system index, y otro para el mapeo --update → index —
  AC-1, AC-11, D-7, CR-008.
- [ ] T004 [P] Añadir a skills/sddf-init/evals/evals.json casos para --level minimal
  (omite 2b y 5), --level standard (default, sin cambios) y --level full (informe de
  sddf-init concatenado con el informe de scaffold) — AC-8, AC-16, D-8, V-8.
- [ ] T005 [P] Crear test/memory-system.test.js (node --test) que ejercite el script
  sobre los fixtures de T002: check exit 0/1/2 y JSON; scaffold copia-si-falta e
  idempotencia; index reproducible salvo `updated`; rebuild --force conserva ADR-*/STORY-*;
  ensure --harness openspec no escribe bajo openspec/ — AC-4, AC-7, AC-9, AC-12, AC-18,
  V-4, V-6, V-7, V-9.

## 2. Motor determinista (scripts/memory-system.js)

- [ ] T006 Crear skills/memory-system/scripts/memory-system.js con el esqueleto CLI:
  parseo de `<sub> --root --harness --json --dry-run --force`, resolución de raíz
  (`--root` obligatorio, exit 2 si no existe), catálogo LAYERS (11 capas + constitution.md
  + index.md) y tabla HARNESS_PROFILES de D-2; solo módulos `node:` (sin package.json) —
  AC-13, AC-14, NFR-3, NFR-7, D-1, D-2.
- [ ] T007 Implementar el subcomando `detect` con la precedencia `--harness` >
  sddf.config.yaml > .specify/ > openspec/ > generic, imprimiendo el harness detectado —
  AC-5, AC-13, D-2.
- [ ] T008 Implementar el escáner de artefactos y el parser de frontmatter (subconjunto
  YAML: escalares, cadenas entrecomilladas, listas `- item`) con las reglas de slug, título
  y exclusiones de D-4 (specs/.cache/, templates/, index.md, artefactos derivados de
  historia) y las raíces externas de solo lectura por harness — AC-9, AC-15, D-4.
- [ ] T009 Implementar el subcomando `scaffold`: recorre assets/scaffold/ (mirror
  copia-si-falta), aplica skipLayers y mappings del harness, rellena la fecha del
  frontmatter semilla, copia los 5 templates compartidos desde el assets/ de su skill dueño
  con `[WARNING]` no bloqueante si falta el dueño, soporta --dry-run (plan sin escribir) y
  --force (sobrescribe solo archivos semilla), e imprime `[CREADO]/[PRESERVADO]/[OMITIDO]`
  por archivo y la línea final `creados: N · preservados: M · omitidos por harness: K` —
  AC-3, AC-7, AC-14, NFR-2, NFR-4, D-3, D-6.
- [ ] T010 Implementar el subcomando `index`: lee assets/index-template.md en runtime,
  sustituye `{layer:<nombre>}`, `{layer:external}`, `{stats}` y `{date}` con nodos
  ordenados por ruta normalizada en formato `- [[slug]] — [archivo](ruta) — título`, marca
  `⚠️ sin frontmatter` / `⚠️ nodo pendiente`, escribe index.md completo (o muestra el plan
  con --dry-run) y falla con exit 2 si falta un placeholder de capa activa — AC-1, AC-15,
  NFR-1, D-4.
- [ ] T011 Implementar el subcomando `check` (solo lectura): familias missing-layer,
  orphan, invalid-frontmatter (type/slug/title; + id/status en project|epic|story) y
  broken-wikilink (ignorando `|alias`, `#anchor`, código inline y fences); informe textual
  agrupado o JSON con `harness`, `root`, `ok`, `summary`, `problems`; exit 1 con problemas,
  0 sin ellos, 2 ante error técnico — AC-4, AC-18, D-5.
- [ ] T012 Ejecutar `node --test test/memory-system.test.js` hasta que T005 pase en verde
  (fase GREEN) y refactorizar sin cambiar contratos — AC-12, V-4, V-6, V-7, V-9.

## 3. Assets del scaffold y del índice

- [ ] T013 [P] Crear el árbol skills/memory-system/assets/scaffold/ con constitution.md,
  product/vision.md, product/stakeholders.md, product/objectives.md, un README.md por cada
  una de las once capas y templates/README.md; cada semilla con frontmatter conforme al
  esquema canónico de header-aggregation (type, slug, title, status, substatus, parent,
  created, updated con placeholder de fecha) y contenido plantilla mínimo — AC-3, AC-14,
  D-3.
- [ ] T014 [P] Crear skills/memory-system/assets/scaffold/templates/adr-template.md
  tomando como base docs/adr/adr-template.md (sexta plantilla base) — AC-3, D-3, CR-003.
- [ ] T015 [P] Crear skills/memory-system/assets/index-template.md a partir del
  docs/index.md vigente (secciones Gobernanza, Especificaciones L3/L2/L1, capas de soporte,
  Artefactos externos, Estado del grafo) con los placeholders de D-4 y frontmatter
  `type: wiki`, `slug: index` — AC-15, D-4.
- [ ] T016 [P] Crear skills/memory-system/references/memory-rules.md (< 300 líneas) con las
  reglas de slug/título/exclusiones, la tabla de perfiles de harness y los campos
  verificados por check, para que SKILL.md la enlace desde los modos index y check — D-4,
  D-5, NFR-5.

## 4. SKILL.md de memory-system

- [ ] T017 Crear skills/memory-system/SKILL.md (< 500 líneas, frontmatter solo
  name/description con frases de invocación "memory-system", "scaffold de memoria",
  "verificar memoria", "índice de docs"; sin `triggers:`): Paso 0 con el bloque
  SDDF-ROOT-RESOLUTION v1 y resolución de CLI_ROOT, parámetros (modo default ensure,
  --harness, --json, --dry-run, --force, --fix-frontmatter, --yes), invocación del motor por
  ruta relativa scripts/memory-system.js y la degradación inline si `node` no está en PATH
  — AC-2…AC-7, AC-12, AC-13, D-1, D-6.
- [ ] T018 Documentar en SKILL.md las secuencias de los seis modos según la tabla de D-6:
  ensure (detect → scaffold → [header-aggregation batch "saltar conflictos" solo con
  --fix-frontmatter] → index, informe `creados N · preservados M · índice regenerado S/N`),
  scaffold, index, check (propaga exit code), migrate (plan con scaffold --dry-run →
  confirmación o --yes → scaffold) y rebuild (gate literal "❌ rebuild es destructivo. Añade
  --force para confirmar." y advertencia "⚠️ Los cambios manuales en archivos gestionados
  por el scaffold se perderán.") — AC-2, AC-5, AC-6, AC-7, AC-17, D-6, F-1, F-3, F-5.
- [ ] T019 Ejecutar los evals de T001 (`npm run test:eval -- memory-system`) y ajustar
  SKILL.md hasta que pasen — AC-12, V-2, V-3, V-5.

## 5. Integraciones: alias, sddf-init y header-aggregation

- [ ] T020 Reducir skills/docs-wiki-builder/SKILL.md a un alias: aviso literal de
  deprecación, mapeo de argumentos (--update → index, --dry-run → index --dry-run, sin
  args → index), invocación de memory-system y ninguna lógica propia; actualizar la
  description con la fecha de retirada (4.0.0) — AC-1, AC-11, NFR-6, D-7, F-4.
- [ ] T021 Eliminar skills/docs-wiki-builder/assets/wiki-index-template.md y retirar la
  entrada `docs-wiki-builder` de config/eval-exemptions.json; comprobar que
  `npm run verify:eval-inventory` pasa con el eval de T003 — AC-11, D-7, CR-008.
- [ ] T022 Modificar skills/sddf-init/SKILL.md: parámetro `--level minimal|standard|full`
  (default standard) con la tabla de pasos de D-8, Paso 5b "invocar memory-system scaffold
  --yes" solo en full, concatenación de su informe al informe final y ejemplo de salida;
  ningún otro paso cambia — AC-8, AC-16, D-8, CR-007.
- [ ] T023 [P] Añadir en skills/header-aggregation/SKILL.md la nota de que puede ser
  invocado por `memory-system ensure --fix-frontmatter` en modo batch y sigue siendo una
  utilidad independiente; sin cambios funcionales — AC-10, AC-17, D-9, CR-002.
- [ ] T024 Ejecutar los evals de T003 y T004 (`npm run test:eval -- docs-wiki-builder
  sddf-init`) y ajustar hasta que pasen — AC-1, AC-8, V-1, V-8.

## 6. Documentación y trazabilidad

- [ ] T025 Actualizar docs/architecture/memory-system.md: sección "10. Herramienta: skill
  memory-system" (modos, harness, reglas de slug, campos verificados por check, alcance de
  rebuild --force), lista de templates/ alineada con las seis plantillas, invariante 2
  alineado con check y `rfcs/` marcada como capa opcional no gestionada — NFR-5, D-10,
  CR-003, CR-004, CR-006.
- [ ] T026 [P] Añadir a docs/guides/sddf-commands-pipeline.md la subsección "0. Memoria
  del proyecto" con `sddf-init --level full`, `memory-system ensure|check` y la nota de
  deprecación de docs-wiki-builder — NFR-5, D-10.
- [ ] T027 [P] Actualizar README.md (fila de comandos para memory-system, nota de
  deprecación) y CHANGELOG.md 3.3.0 (Added memory-system, Changed sddf-init --level,
  Deprecated docs-wiki-builder con eliminación en 4.0.0) — NFR-5, AC-11, D-10.
- [ ] T028 [P] Verificar con `ls skills/` si AGENTS.md, CLAUDE.md o
  docs/domains/domain-skills-map.md listan skills y, solo en ese caso, añadir memory-system
  y marcar docs-wiki-builder como deprecado — NFR-5, D-10.
- [ ] T029 Retroalimentar story.md con los CR-001, CR-002, CR-003, CR-005 y CR-007
  (dependencia de Node ≥ 18, flag --fix-frontmatter en memory-system, enumeración de las
  seis plantillas, Non-Goal de reorganización de archivos, semántica de --level) — CR-001,
  CR-002, CR-003, CR-005, CR-007.
- [ ] T030 Regenerar docs/index.md ejecutando `/memory-system index` y revisar el diff
  frente al índice manual vigente (mismas entradas, mismo formato) — AC-15, V-1.

## 7. Verificación de extremo a extremo

- [ ] T031 Ejecutar el guardrail gr-skill-creation-checklist sobre skills/memory-system,
  skills/docs-wiki-builder y skills/sddf-init (ambos bloques Python en 0, greps sin salida)
  — V-11.
- [ ] T032 Ejecutar en un directorio temporal la secuencia de verificación sugerida en
  story.md: `/memory-system ensure` en proyecto vacío (11 capas, constitution.md, 6
  plantillas, index.md) → `check` exit 0 → romper un wikilink → `check` exit 1 →
  `/docs-wiki-builder` produce el mismo index.md con aviso → `/sddf-init --level full` ≡
  `sddf-init` + `scaffold` → `migrate --harness speckit` propone sin escribir →
  `header-aggregation` invocable sola — AC-1…AC-10, V-1…V-10.
- [ ] T033 Ejecutar `npm run verify:links`, `npm run verify:eval-inventory`,
  `npm run verify:syntax` y `npm test`; registrar resultados en implement-report.md —
  NFR-5, V-12.
