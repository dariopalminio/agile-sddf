---
alwaysApply: false
type: story
id: STORY-194
kind: chore
slug: STORY-194-adr-0023-aceptado
title: "Aceptar ADR-0023"
status: COMPLETED
substatus: DONE
parent: EPIC-030-separar-changes-de-specs
created: 2026-11-18
updated: 2026-11-22
related:
  - EPIC-030-separar-changes-de-specs
---
[[EPIC-030-separar-changes-de-specs]]

# 📖 Historia: Aceptar ADR-0023

**Como** mantenedor de agile-sddf que va a implementar las historias de EPIC-030  
**Quiero** ADR-0023 aceptado, con su árbol corregido (`docs/decisions/`), ADR-0019 marcado como `SUPERSEDED` con su nota de reemplazo y el índice de ADRs actualizado  
**Para** que las demás historias implementen una sola decisión de layout y ningún ADR aceptado se edite fuera de lo permitido

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – ADR-0023 reemplaza a ADR-0019
```gherkin
Dado que ADR-0023 está en "PROPOSED" y ADR-0019 en "ACCEPTED"
Cuando el mantenedor acepta ADR-0023
Entonces ADR-0023 tiene "status: ACCEPTED"
  Y ADR-0019 tiene "status: SUPERSEDED", "superseded-by: ADR-0023" y una nota "Superado por" bajo el título
  Y "docs/decisions/README.md" muestra ADR-0019 como "SUPERSEDED → ADR-0023" y ADR-0023 como "ACCEPTED"
```

## 📎 Notas / contexto adicional

- Cubre **CS-1** de EPIC-030.
- El cuerpo de ADR-0019 no cambia: solo `status`, `superseded-by` y la nota visible (regla de inmutabilidad de `docs/decisions/README.md`).
- Implementada directamente en la sesión del 2026-11-18 que ejecutó el plan de EPIC-030, sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate: quedan pendientes `/story-code-review`, `/story-verify` y `/story-acceptance`.
