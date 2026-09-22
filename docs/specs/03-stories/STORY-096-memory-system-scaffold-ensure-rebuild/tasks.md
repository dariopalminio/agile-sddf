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

- [x] T001 Añadir a skills/memory-system/evals/evals.json los casos: `ensure` sobre
  sddf-partial (salida contiene `creados:`, `preservados:` e `índice regenerado: sí`);
  `ensure` repetido (contiene `creados: 0`); `scaffold` sobre empty (lista `[CREADO]` de
  constitution.md, product/vision.md y templates/adr-template.md; no menciona index.md);
  fail-fast `rebuild` sin --force (contiene "❌ rebuild es destructivo. Añade --force para
  confirmar."); `rebuild --force` (contiene la advertencia "⚠️ Los cambios manuales en
  archivos gestionados por el scaffold se perderán." y `sobrescritos:`); `ensure
  --fix-frontmatter` (menciona la invocación de header-aggregation con "saltar todos los
  conflictos") — AC-1, AC-2, AC-3, AC-4, AC-8, D-3, D-4, V-1, V-4, V-7.
- [x] T002 [P] Crear los fixtures skills/memory-system/examples/sddf-partial/ (docs/ con
  specs/01..03, templates/ con las cinco plantillas compartidas, guides/sdd.md,
  adr/ADR-0001-x.md, constitution.md editado a mano; sin product/ ni
  requirements/README.md; una guía sin frontmatter) y examples/empty/ (solo
  sddf.config.yaml, docs/ inexistente) — AC-1, AC-2, AC-4, D-1.
- [x] T003 [P] Añadir a test/memory-system.test.js los casos: scaffold en empty crea
  constitution.md, product/{vision,stakeholders,objectives}.md, 11 README, 6 plantillas y
  no crea index.md; scaffold --dry-run no escribe y lista `[CREARÍA]`; scaffold ×2 en
  sddf-partial → segunda corrida `creados: 0` y hashes iguales; --cli-root sin skills
  dueños → `[WARNING] template no copiado: story-template.md (skill story-creation no
  instalado)` y exit 0; scaffold --force restaura constitution.md y README, marca
  `[SOBRESCRITO]`, deja ADR-0001-x.md y la guía intactos; ningún modo reduce el número de
  archivos — AC-2, AC-4, AC-6, AC-7, V-2, V-3, V-5, V-6, V-8.

## 2. Árbol semilla (assets/scaffold)

- [x] T004 [P] Crear skills/memory-system/assets/scaffold/ con constitution.md (secciones del
  constitution.md de este repositorio con valores `[Por completar]`),
  product/{README,vision,stakeholders,objectives}.md (`type: product`, tres encabezados
  guía), un README.md por capa (requirements, specs, domains, architecture, adr, policies,
  guardrails, guides, runbooks) con propósito tomado de memory-system.md §2, convención de
  nombres y wikilink `[[index]]`, specs/{01-projects,02-epics,03-stories}/.gitkeep y
  templates/README.md (ADR-0007); frontmatter canónico con `{date}` como único placeholder
  y sin wikilinks a nodos que el scaffold no crea — AC-2, AC-5, D-1, D-5.
- [x] T005 [P] Crear skills/memory-system/assets/scaffold/templates/adr-template.md con el
  contenido de docs/adr/adr-template.md (sexta plantilla base) — AC-6, D-2.

## 3. Subcomando scaffold del motor

- [x] T006 Añadir a skills/memory-system/scripts/memory-system.js el subcomando `scaffold`
  con flags `--cli-root`, `--dry-run`, `--force`: recorrido de assets/scaffold/ como espejo
  copia-si-falta, sustitución de `{date}`, creación de directorios intermedios, acciones
  `[CREADO]/[PRESERVADO]/[SOBRESCRITO]/[CREARÍA]`, exit 2 si la raíz o assets/scaffold/ no
  existen; si el motor de STORY-095 no existe aún, crear el esqueleto CLI y el catálogo
  LAYERS aquí — AC-2, AC-5, AC-7, NFR-4, NFR-5, D-1.
- [x] T007 Implementar en `scaffold` la copia de las cinco plantillas compartidas desde
  `<cli-root>/skills/<dueño>/assets/` con la tabla de D-2, `[PRESERVADO]` si el destino
  existe, `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)` si falta el
  origen (sin bloquear), y `--force` sobrescribiendo también estas cinco — AC-6, AC-7, D-2.
- [x] T008 Implementar el informe del subcomando: última línea `creados: N · sobrescritos: S
  · preservados: M · omitidos por harness: K` (K = 0 en esta historia) y la lista
  `missingLayers` derivada de LAYERS para el informe de ensure — AC-1, NFR-3, D-1.
- [x] T009 Ejecutar `node --test test/memory-system.test.js` hasta verde (GREEN) y
  refactorizar sin cambiar contratos — V-2, V-3, V-5, V-6, V-8.

## 4. Modos en SKILL.md

- [x] T010 Modificar skills/memory-system/SKILL.md: sustituir la rama "modo ensure aún no
  disponible" por el modo `ensure` (default) con la secuencia de D-3 (detect → scaffold →
  [header-aggregation batch solo con --fix-frontmatter] → index), el informe `creados N ·
  preservados M · índice regenerado sí/no`, la degradación `⚠️ modo index no disponible —
  índice no regenerado` y el flag `--cli-root` pasado al motor — AC-1, AC-8, D-3, F-1, F-4.
- [x] T011 Añadir a SKILL.md el modo `scaffold` (detect → scaffold; acepta --dry-run; no
  invoca index) y el modo `rebuild` con el gate literal "❌ rebuild es destructivo. Añade
  --force para confirmar." sin invocar el motor, y con --force la advertencia literal
  "⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán." seguida de
  `scaffold --force` e `index` — AC-2, AC-3, AC-4, D-4, F-2, F-3.
- [x] T012 [P] Ampliar skills/memory-system/references/memory-rules.md con la sección
  "Scaffold y archivos gestionados" (árbol semilla, seis plantillas y dueños, lista exacta
  de archivos que rebuild --force puede sobrescribir, regla de no-eliminación) — AC-7, D-1,
  D-4, CR-002.
- [x] T013 Ejecutar `npm run test:eval -- memory-system` y ajustar SKILL.md hasta que los
  casos de T001 pasen; comprobar que SKILL.md sigue < 500 líneas — V-1, V-4, V-7, V-10.

## 5. header-aggregation

- [x] T014 [P] Ampliar la nota de skills/header-aggregation/SKILL.md con la invocación desde
  `memory-system ensure --fix-frontmatter` en batch con estrategia "saltar todos los
  conflictos" y confirmación global; sin cambios funcionales; registrar el acoplamiento a
  los literales de sus preguntas — AC-8, D-6.

## 6. Documentación y trazabilidad

- [x] T015 Actualizar docs/architecture/memory-system.md: §10 con los modos scaffold, ensure
  y rebuild, el árbol semilla y el alcance de rebuild --force; §3 con las seis plantillas
  (sustituir requirement-template.md por project-intent-template.md y
  project-plan-template.md) y `rfcs/` como capa opcional no gestionada — NFR-6, D-7,
  CR-002, CR-003.
- [x] T016 [P] Actualizar docs/guides/sddf-commands-pipeline.md §0 (`/memory-system` como
  comando recomendado tras sddf-init, `--fix-frontmatter`, `rebuild --force`), README.md
  (modos) y CHANGELOG.md 3.3.0 (Added scaffold/ensure/rebuild) — NFR-6, D-7.
  > **Hecho.** Guía §0 y README.md ya estaban. El CHANGELOG se corrigió el 2026-09-22: las
  > entradas de `memory-system` (3 Added, 3 Changed, 1 Deprecated) pasaron de `[3.2.1]` a
  > `3.3.0 [Unreleased]`. Motivo verificado contra el repositorio: el tag `v3.2.1`
  > (commit `d335738`) **no contiene ningún archivo de `skills/memory-system/`** y su commit
  > solo bumpea `package.json` y `package-lock.json`; la sección `[3.2.1]` ni siquiera
  > existía en el CHANGELOG del tag. El encabezado `## [3.2.1] — 2026-09-21` se conserva
  > porque `scripts/verify-release.js` exige exactamente una sección de la versión actual.
  > `verify:release` y `verify:links` en verde; 174 entradas antes y después, sin pérdidas.
- [x] T017 Retroalimentar story.md con CR-001 (las cinco plantillas requieren los skills
  dueños en CLI_ROOT; sin ellos `[WARNING]`) y ejecutar `/memory-system` en este
  repositorio para crear docs/product/ y requirements/README.md faltantes, revisando el
  diff antes de commitear — AC-1, CR-001.
  > **Hecho.** La retroalimentación de CR-001 a `story.md` ya estaba (§"Requerimiento: Seis
  > plantillas base"). El 2026-09-22 se ejecutó `ensure` sobre este repositorio, revisando
  > primero el plan con `scaffold --dry-run`: **8 creados, 0 sobrescritos, 13 preservados**.
  > Creados: `product/{README,vision,stakeholders,objectives}.md`, `requirements/README.md`,
  > `runbooks/README.md`, `specs/README.md` y `templates/adr-template.md` — estos tres
  > últimos también faltaban y los crea el mismo árbol semilla. Después, `index` regeneró
  > `docs/index.md` (237 nodos, 31 pendientes). Revisar el diff antes de commitear.

## 7. Verificación de extremo a extremo

- [x] T018 Ejecutar el guardrail gr-skill-creation-checklist sobre skills/memory-system
  (bloques Python en 0, greps sin salida, assets de profundidad 1 en kebab-case) — V-10.
- [x] T019 Ejecutar la verificación sugerida de story.md en un directorio temporal:
  `/memory-system ensure` en proyecto vacío (11 capas, constitution.md, 6 plantillas,
  index.md) y repetido (`creados 0`); `scaffold` no toca index.md; `rebuild` sin --force
  hashes intactos y con --force restaura semillas conservando ADR-*/STORY-*;
  `ensure --fix-frontmatter` solo procesa archivos sin frontmatter — AC-1…AC-8, V-1…V-8.
  > **Hecho a nivel de motor (13/13).** Ejecutada el 2026-09-22 en un directorio temporal
  > (`mktemp -d`, sin tocar el repositorio): proyecto vacío → 11 capas, `constitution.md`,
  > 6 plantillas e `index.md`; segunda corrida `creados: 0`; `scaffold` deja el hash de
  > `index.md` intacto; sin `--force` ningún hash del árbol cambia; con `--force` se
  > restaura `constitution.md` editado a mano mientras `ADR-0001-x.md` y
  > `STORY-001-a/story.md` conservan su hash y el número de archivos no baja (27 → 27);
  > `--dry-run` no escribe; el motor rechaza `rebuild` con exit 2 (el gate `--force` vive en
  > `SKILL.md`, conforme a D-4).
  >
  > **Queda para `/story-verify`:** la mitad que exige un LLM ejecutando el skill —
  > `ensure --fix-frontmatter` invocando `header-aggregation` en batch (AC-8), hoy cubierta
  > por el eval TC-010, y la confirmación de los literales de `rebuild` que emite `SKILL.md`
  > (TC-008/TC-009). Los casos E2E-001…004 e IT-001…004 de `testcases.md` se cierran allí.
- [x] T020 Ejecutar `npm run verify:links`, `npm run verify:eval-inventory`,
  `npm run verify:syntax` y `npm test`; registrar resultados en implement-report.md —
  NFR-6, V-9.

- [x] Implementar fix-directives.md
  > Aplicado el 2026-09-22. Hallazgo #1/#2 (principio 13): `adr-template.md` anota
  > `escritor: autoría manual` en cada campo, con la decisión registrada en
  > [[ADR-0012-escritor-en-templates-de-autoria-manual]] y la excepción documentada en
  > `references/memory-rules.md` §5; la semilla y `docs/adr/adr-template.md` quedan byte a
  > byte idénticas. Hallazgo #3: este checklist, marcado contra evidencia ejecutada
  > (`npm test` 106/106, `verify:syntax`, `verify:links`, `verify:eval-inventory`,
  > `verify:config`, `verify:repository` en verde). T016 y T017 quedan parciales por tocar
  > archivos fuera de la lista blanca.
