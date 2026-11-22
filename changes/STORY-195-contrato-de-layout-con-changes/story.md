---
alwaysApply: false
type: story
id: STORY-195
kind: chore
slug: STORY-195-contrato-de-layout-con-changes
title: "Contrato de layout y gate determinista con changes/"
status: IMPLEMENT
substatus: DONE
parent: EPIC-030-separar-changes-de-specs
created: 2026-11-18
updated: 2026-11-18
related:
  - EPIC-030-separar-changes-de-specs
---
[[EPIC-030-separar-changes-de-specs]]

# 📖 Historia: Contrato de layout y gate determinista con changes/

**Como** mantenedor de agile-sddf  
**Quiero** que el bloque `SDDF-FIXED-LAYOUT` de los 43 skills nombre `changes/`, `changes/archive/` y `specs/` y que `scripts/verify-fixed-layout.js` exija `changes/` y rechace `specs/flow` y `specs/living` fuera de la región de diagnóstico  
**Para** que ningún skill vuelva a leer o escribir work items en las rutas retiradas

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – el gate exige changes/
```gherkin
Dado un SKILL.md cuyo bloque de contrato no nombra "changes/"
Cuando se ejecuta "node scripts/verify-fixed-layout.js"
Entonces el gate informa que el bloque del contrato no declara "changes/"
```

### AC-2 — Escenario alternativo – ruta retirada fuera de la región
```gherkin
Dado un SKILL.md que nombra "specs/flow" fuera de la región SDDF-LEGACY-DIAGNOSTIC
Cuando se ejecuta "node scripts/verify-fixed-layout.js"
Entonces el gate informa una referencia legada con su línea
  Pero la región de diagnóstico de "skill-preflight" y "sddf-init" queda exenta
```

## 📎 Notas / contexto adicional

- Cubre **CS-2** de EPIC-030.
- Implementada directamente en la sesión del 2026-11-18 que ejecutó el plan de EPIC-030, sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate: quedan pendientes `/story-code-review`, `/story-verify` y `/story-acceptance`.
