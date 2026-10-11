---
alwaysApply: false
type: tasks
id: STORY-102
slug: STORY-102-renombrar-skill-sddf-constitution-tasks
title: "Tasks: Renombrar el skill project-policies-generation como sddf-constitution"
date: 2026-09-26
status: PLAN
substatus: DONE
parent: EPIC-12-story-sdd-workflow
story: STORY-102
design: STORY-102
related:
  - STORY-102-renombrar-skill-sddf-constitution
  - EPIC-12-story-sdd-workflow
  - STORY-056-project-policies
---

<!-- Referencias -->
[[STORY-102-renombrar-skill-sddf-constitution]]
[[EPIC-12-story-sdd-workflow]]
[[STORY-056-project-policies]]

> Trazabilidad: AC-1/AC-2 corresponden a los escenarios de `story.md`; D-01 a D-04 a
> las decisiones de `design.md`. Orden: inventario → identidad fuente → integraciones y
> documentación → verificación. No se modifican las copias de runtime ni el historial permitido.

## 1. Preparación y límites de la migración

- [x] T001 Inventariar antes del cambio las superficies operativas definidas en D-02 y registrar la
  allowlist histórica de D-03 para que la verificación no trate como alias las referencias de
  migración, `CHANGELOG.md` o `docs/specs/**`. (AC-2, D-03)

- [x] T002 Trasladar el árbol completo `skills/project-policies-generation/` a
  `skills/sddf-constitution/`, incluido el README no trackeado, assets y ejemplos; confirmar que no
  queda una segunda carpeta fuente con el nombre retirado. (AC-1, D-01, CNF-02)

## 2. Identidad y contrato del skill renombrado

- [x] T003 Actualizar `skills/sddf-constitution/SKILL.md` y su README con el nombre, título,
  descripción e invocación `sddf-constitution`; retirar la clave `triggers` no admitida y cualquier
  alias público anterior, sin alterar el flujo funcional ni los assets del skill. (AC-1, D-01, CNF-02)

- [x] T004 [P] Cambiar en `config/eval-exemptions.json` la exención temporal desde
  `project-policies-generation` hacia `sddf-constitution`, conservando su owner, motivo y fecha de
  revisión. (AC-1, D-02, D-04)

## 3. Integraciones y documentación operativas

- [x] T005 Actualizar el contrato de `skills/sddf-init`: prompt, invocación inline, siguiente paso e
  informes `[OMITIDO]` en `SKILL.md` y README; cambiar primero la expectativa TC-006 de
  `evals/evals.json` para que cubra el literal nuevo. (AC-2, D-02)

- [x] T006 [P] Sustituir por `/sddf-constitution` los avisos accionables de ausencia de gobernanza
  en `skills/story-design/SKILL.md`, conservando el comportamiento de recuperación descrito. (AC-2, D-02)

- [x] T007 [P] Actualizar las superficies de ayuda de uso actual: `README.md`,
  `docs/guides/sddf-commands-pipeline.md` y `docs/guardrails/README.md`; no editar las referencias
  históricas admitidas por D-03. (AC-2, D-02, D-03, CNF-01)

## 4. Verificación de identidad, preservación y distribución

- [x] T008 Verificar que el árbol nuevo conserva todos los assets de constitución y DoD, ejemplos y
  protecciones de escritura, y que las superficies operativas de T003–T007 no ofrecen el identificador
  retirado; aplicar la allowlist de T001 en vez de exigir cero coincidencias globales. (AC-1, AC-2, D-01, D-03)

- [x] T009 Ejecutar `npm run verify:eval-inventory`, `npm run test:eval -- sddf-init --dry-run`,
  `npm run test:installer`, `npm run smoke:package` y `npm run verify:repository`; confirmar en una
  instalación limpia que el inventario distribuido contiene `sddf-constitution` y no el directorio
  retirado. Reportar por separado cualquier fallo preexistente o ajeno al renombre. (AC-1, AC-2, D-04)
