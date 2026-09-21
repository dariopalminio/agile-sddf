---
alwaysApply: false
type: tasks
id: STORY-096
slug: STORY-096-memory-system-scaffold-ensure-rebuild-tasks
title: "Tasks: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
date: 2026-09-20
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-096
design: STORY-096
related:
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-095-memory-system-index-alias
  - STORY-043-header-aggregation
  - memory-system
---

<!-- Referencias -->
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[memory-system]]

> Trazabilidad: AC-n corresponde a los criterios numerados en design.md (8 ACs, 6 NFRs);
> D-n a las decisiones; F-n a los flujos; V-n a los contratos de verificación; CR-n a los
> cambios registrados. Orden: evals y fixtures (RED) → árbol semilla → subcomando scaffold
> del motor → modos en SKILL.md → header-aggregation → documentación → verificación.
> Precondición: skill memory-system de STORY-095 (motor con detect/index, HARNESS_PROFILES,
> LAYERS); si no existe, T006 crea el motor mínimo y ensure/rebuild omiten index con aviso.

## 1. Evals y fixtures (fase RED)

- [ ] T001 Añadir a skills/memory-system/evals/evals.json los casos: `ensure` sobre
  sddf-partial (salida contiene `creados:`, `preservados:` e `índice regenerado: sí`);
  `ensure` repetido (contiene `creados: 0`); `scaffold` sobre empty (lista `[CREADO]` de
  constitution.md, product/vision.md y templates/adr-template.md; no menciona index.md);
  fail-fast `rebuild` sin --force (contiene "❌ rebuild es destructivo. Añade --force para
  confirmar."); `rebuild --force` (contiene la advertencia "⚠️ Los cambios manuales en
  archivos gestionados por el scaffold se perderán." y `sobrescritos:`); `ensure
  --fix-frontmatter` (menciona la invocación de header-aggregation con "saltar todos los
  conflictos") — AC-1, AC-2, AC-3, AC-4, AC-8, D-3, D-4, V-1, V-4, V-7.
- [ ] T002 [P] Crear los fixtures skills/memory-system/examples/sddf-partial/ (docs/ con
  specs/01..03, templates/ con las cinco plantillas compartidas, guides/sdd.md,
  adr/ADR-0001-x.md, constitution.md editado a mano; sin product/ ni
  requirements/README.md; una guía sin frontmatter) y examples/empty/ (solo
  sddf.config.yaml, docs/ inexistente) — AC-1, AC-2, AC-4, D-1.
- [ ] T003 [P] Añadir a test/memory-system.test.js los casos: scaffold en empty crea
  constitution.md, product/{vision,stakeholders,objectives}.md, 11 README, 6 plantillas y
  no crea index.md; scaffold --dry-run no escribe y lista `[CREARÍA]`; scaffold ×2 en
  sddf-partial → segunda corrida `creados: 0` y hashes iguales; --cli-root sin skills
  dueños → `[WARNING] template no copiado: story-template.md (skill story-creation no
  instalado)` y exit 0; scaffold --force restaura constitution.md y README, marca
  `[SOBRESCRITO]`, deja ADR-0001-x.md y la guía intactos; ningún modo reduce el número de
  archivos — AC-2, AC-4, AC-6, AC-7, V-2, V-3, V-5, V-6, V-8.

## 2. Árbol semilla (assets/scaffold)

- [ ] T004 [P] Crear skills/memory-system/assets/scaffold/ con constitution.md (secciones del
  constitution.md de este repositorio con valores `[Por completar]`),
  product/{README,vision,stakeholders,objectives}.md (`type: product`, tres encabezados
  guía), un README.md por capa (requirements, specs, domains, architecture, adr, policies,
  guardrails, guides, runbooks) con propósito tomado de memory-system.md §2, convención de
  nombres y wikilink `[[index]]`, specs/{01-projects,02-epics,03-stories}/.gitkeep y
  templates/README.md (ADR-0007); frontmatter canónico con `{date}` como único placeholder
  y sin wikilinks a nodos que el scaffold no crea — AC-2, AC-5, D-1, D-5.
- [ ] T005 [P] Crear skills/memory-system/assets/scaffold/templates/adr-template.md con el
  contenido de docs/adr/adr-template.md (sexta plantilla base) — AC-6, D-2.

## 3. Subcomando scaffold del motor

- [ ] T006 Añadir a skills/memory-system/scripts/memory-system.js el subcomando `scaffold`
  con flags `--cli-root`, `--dry-run`, `--force`: recorrido de assets/scaffold/ como espejo
  copia-si-falta, sustitución de `{date}`, creación de directorios intermedios, acciones
  `[CREADO]/[PRESERVADO]/[SOBRESCRITO]/[CREARÍA]`, exit 2 si la raíz o assets/scaffold/ no
  existen; si el motor de STORY-095 no existe aún, crear el esqueleto CLI y el catálogo
  LAYERS aquí — AC-2, AC-5, AC-7, NFR-4, NFR-5, D-1.
- [ ] T007 Implementar en `scaffold` la copia de las cinco plantillas compartidas desde
  `<cli-root>/skills/<dueño>/assets/` con la tabla de D-2, `[PRESERVADO]` si el destino
  existe, `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)` si falta el
  origen (sin bloquear), y `--force` sobrescribiendo también estas cinco — AC-6, AC-7, D-2.
- [ ] T008 Implementar el informe del subcomando: última línea `creados: N · sobrescritos: S
  · preservados: M · omitidos por harness: K` (K = 0 en esta historia) y la lista
  `missingLayers` derivada de LAYERS para el informe de ensure — AC-1, NFR-3, D-1.
- [ ] T009 Ejecutar `node --test test/memory-system.test.js` hasta verde (GREEN) y
  refactorizar sin cambiar contratos — V-2, V-3, V-5, V-6, V-8.

## 4. Modos en SKILL.md

- [ ] T010 Modificar skills/memory-system/SKILL.md: sustituir la rama "modo ensure aún no
  disponible" por el modo `ensure` (default) con la secuencia de D-3 (detect → scaffold →
  [header-aggregation batch solo con --fix-frontmatter] → index), el informe `creados N ·
  preservados M · índice regenerado sí/no`, la degradación `⚠️ modo index no disponible —
  índice no regenerado` y el flag `--cli-root` pasado al motor — AC-1, AC-8, D-3, F-1, F-4.
- [ ] T011 Añadir a SKILL.md el modo `scaffold` (detect → scaffold; acepta --dry-run; no
  invoca index) y el modo `rebuild` con el gate literal "❌ rebuild es destructivo. Añade
  --force para confirmar." sin invocar el motor, y con --force la advertencia literal
  "⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán." seguida de
  `scaffold --force` e `index` — AC-2, AC-3, AC-4, D-4, F-2, F-3.
- [ ] T012 [P] Ampliar skills/memory-system/references/memory-rules.md con la sección
  "Scaffold y archivos gestionados" (árbol semilla, seis plantillas y dueños, lista exacta
  de archivos que rebuild --force puede sobrescribir, regla de no-eliminación) — AC-7, D-1,
  D-4, CR-002.
- [ ] T013 Ejecutar `npm run test:eval -- memory-system` y ajustar SKILL.md hasta que los
  casos de T001 pasen; comprobar que SKILL.md sigue < 500 líneas — V-1, V-4, V-7, V-10.

## 5. header-aggregation

- [ ] T014 [P] Ampliar la nota de skills/header-aggregation/SKILL.md con la invocación desde
  `memory-system ensure --fix-frontmatter` en batch con estrategia "saltar todos los
  conflictos" y confirmación global; sin cambios funcionales; registrar el acoplamiento a
  los literales de sus preguntas — AC-8, D-6.

## 6. Documentación y trazabilidad

- [ ] T015 Actualizar docs/architecture/memory-system.md: §10 con los modos scaffold, ensure
  y rebuild, el árbol semilla y el alcance de rebuild --force; §3 con las seis plantillas
  (sustituir requirement-template.md por project-intent-template.md y
  project-plan-template.md) y `rfcs/` como capa opcional no gestionada — NFR-6, D-7,
  CR-002, CR-003.
- [ ] T016 [P] Actualizar docs/guides/sddf-commands-pipeline.md §0 (`/memory-system` como
  comando recomendado tras sddf-init, `--fix-frontmatter`, `rebuild --force`), README.md
  (modos) y CHANGELOG.md 3.3.0 (Added scaffold/ensure/rebuild) — NFR-6, D-7.
- [ ] T017 Retroalimentar story.md con CR-001 (las cinco plantillas requieren los skills
  dueños en CLI_ROOT; sin ellos `[WARNING]`) y ejecutar `/memory-system` en este
  repositorio para crear docs/product/ y requirements/README.md faltantes, revisando el
  diff antes de commitear — AC-1, CR-001.

## 7. Verificación de extremo a extremo

- [ ] T018 Ejecutar el guardrail gr-skill-creation-checklist sobre skills/memory-system
  (bloques Python en 0, greps sin salida, assets de profundidad 1 en kebab-case) — V-10.
- [ ] T019 Ejecutar la verificación sugerida de story.md en un directorio temporal:
  `/memory-system ensure` en proyecto vacío (11 capas, constitution.md, 6 plantillas,
  index.md) y repetido (`creados 0`); `scaffold` no toca index.md; `rebuild` sin --force
  hashes intactos y con --force restaura semillas conservando ADR-*/STORY-*;
  `ensure --fix-frontmatter` solo procesa archivos sin frontmatter — AC-1…AC-8, V-1…V-8.
- [ ] T020 Ejecutar `npm run verify:links`, `npm run verify:eval-inventory`,
  `npm run verify:syntax` y `npm test`; registrar resultados en implement-report.md —
  NFR-6, V-9.
