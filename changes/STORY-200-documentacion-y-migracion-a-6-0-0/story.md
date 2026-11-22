---
alwaysApply: false
type: story
id: STORY-200
kind: chore
slug: STORY-200-documentacion-y-migracion-a-6-0-0
title: "Documentación y migración a 6.0.0"
status: IMPLEMENT
substatus: DONE
parent: EPIC-030-separar-changes-de-specs
created: 2026-11-18
updated: 2026-11-18
related:
  - EPIC-030-separar-changes-de-specs
---
[[EPIC-030-separar-changes-de-specs]]

# 📖 Historia: Documentación y migración a 6.0.0

**Como** Solo Builder que actualiza agile-sddf de 5.x a 6.0.0  
**Quiero** que `AGENTS.md`, la constitución, la arquitectura, los dominios, las guías, `README.md`, `REVIEW.md`, `specs/README.md` y el nuevo `changes/README.md` describan el layout de ADR-0023, una sección «Migración a 6.0.0» en la guía de migración y la entrada BREAKING de `CHANGELOG.md`  
**Para** migrar mi proyecto a mano sin perder work items ni aprender un layout que el framework ya no usa

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – guía de migración enlazada
```gherkin
Dado la entrada BREAKING de EPIC-030 en "CHANGELOG.md"
Cuando el usuario sigue su enlace
Entonces llega a la sección «Migración a 6.0.0» de "docs/guides/artifact-directory-migration.md"
  Y la sección indica cómo detectar el layout, mover "specs/flow/" y "specs/living/", detenerse ante colisiones y regenerar el índice
```

## 📎 Notas / contexto adicional

- Cubre **CS-8** de EPIC-030.
- ADR-0018 y ADR-0020 (PROPOSED) solo alinean sus rutas con `specs/`; su decisión de formato sigue en discusión.
- Implementada directamente en la sesión del 2026-11-18 que ejecutó el plan de EPIC-030, sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate: quedan pendientes `/story-code-review`, `/story-verify` y `/story-acceptance`.
