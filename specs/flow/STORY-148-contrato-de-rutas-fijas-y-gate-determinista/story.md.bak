---
alwaysApply: false
type: story
id: STORY-148
kind: feat
slug: STORY-148-contrato-de-rutas-fijas-y-gate-determinista
title: "Contrato de rutas fijas y gate determinista"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-21
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Contrato de rutas fijas y gate determinista

**Como** mantenedor de Agile-SDDF que migra los skills al layout fijo
**Quiero** sustituir el bloque `SDDF-ROOT-RESOLUTION: v1` por un contrato de layout fijo que solo resuelve `REPO_ROOT`, y que `verify:repository` lo valide en todos los skills
**Para** que cada skill migrado se compruebe de forma determinista y ninguno vuelva a introducir `SDDF_ROOT`, `root` o `SPECS_BASE` sin que falle el gate

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – skill con el contrato de layout fijo pasa el gate
```gherkin
Dado un skill cuyo "SKILL.md" declara el bloque del contrato de layout fijo
  Y el bloque solo resuelve "REPO_ROOT" y usa las rutas fijas "specs/flow/", "docs/templates/" y "docs/guardrails/"
Cuando se ejecuta "npm run verify:repository"
Entonces el chequeo de contrato de layout reporta el skill como conforme
  Y el gate termina en verde
```

### AC-2 — Escenario alternativo / error – skill con resolución legada
```gherkin
Dado un skill cuyo "SKILL.md" contiene "SDDF-ROOT-RESOLUTION: v1", "SPECS_BASE" o "SDDF_ROOT"
Cuando se ejecuta "npm run verify:repository"
Entonces el gate falla
  Y el mensaje nombra el skill y la línea con la referencia legada
  Pero las menciones de diagnóstico del layout legado en "skill-preflight" no se reportan como error
```

### AC-3 — Escenario alternativo – prueba unitaria del validador
```gherkin
Dado el validador que reemplaza a "scripts/audit-root-resolution.js"
Cuando se ejecuta "npm test"
Entonces existen pruebas que cubren un skill conforme, un skill con bloque legado y la excepción de "skill-preflight"
  Y todas pasan
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Determinismo:** el validador no depende de variables de entorno ni de `sddf.config.yaml`; mismo árbol de archivos, mismo resultado.
- **CNF-2 — Stack:** solo Node.js en JavaScript, sin dependencias nuevas.

## Fuera de alcance (Non-Goals)

- Migrar el contenido de cada skill: lo hacen STORY-150, STORY-151 y STORY-152. Esta historia define el contrato y el gate; mientras dure la migración el gate puede admitir una lista transitoria de skills pendientes, que debe quedar vacía al cerrar la épica.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-148 — Contrato de rutas fijas y gate determinista
Contribuye a CS-2, CS-3 y CS-12. Depende de STORY-147 (ADR). El script actual es `scripts/audit-root-resolution.js`; `verify:repository` se ejecuta con `node scripts/verify-repository.js`.
