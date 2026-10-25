---
alwaysApply: false
type: story
id: STORY-148
kind: feat
slug: STORY-148-contrato-de-rutas-fijas-y-gate-determinista
title: "Contrato de rutas fijas y gate determinista"
status: VERIFY
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-25
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Contrato de rutas fijas y gate determinista

**Como** mantenedor de Agile-SDDF que migra los skills al layout fijo
**Quiero** que `verify:repository` detecte de forma determinista cualquier skill que no cumpla el contrato de layout fijo (que solo resuelve `REPO_ROOT`) o que conserve la resolución legada
**Para** que el 100 % de las referencias legadas a `SDDF_ROOT`, `root` y `SPECS_BASE` en los skills quede detectado por el gate y se cumplan CS-2, CS-3 y CS-12 de la épica sin revisión manual

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

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Determinismo:** el validador no depende de variables de entorno ni de `sddf.config.yaml`; mismo árbol de archivos, mismo resultado.
- **CNF-2 — Stack:** solo Node.js en JavaScript, sin dependencias nuevas.
- **CNF-3 — Pruebas unitarias del validador:** `npm test` incluye pruebas que cubren un skill conforme, un skill con bloque legado y la excepción de `skill-preflight`, todas en verde.

## Fuera de alcance (Non-Goals)

- Migrar el contenido de cada skill: lo hacen STORY-149 (`sddf-init`), STORY-150, STORY-151, STORY-152, STORY-155, STORY-156 y STORY-158. Esta historia define el contrato y el gate; mientras dure la migración el gate puede admitir una lista transitoria de skills pendientes, que debe quedar vacía al cerrar la épica (lo verifica el AC-3 de cierre de STORY-157).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-148 — Contrato de rutas fijas y gate determinista
Contribuye a CS-2, CS-3 y CS-12. El script actual es `scripts/audit-root-resolution.js`; `verify:repository` se ejecuta con `node scripts/verify-repository.js`.

**Independencia (STORY-147 y migración):**
- Precondición: el ADR de STORY-147 debe estar `ACCEPTED` antes de iniciar, porque fija el layout y el marcador del contrato que el validador reconoce.
- Desacople respecto de las historias de migración (STORY-149, STORY-150, STORY-151, STORY-152, STORY-155, STORY-156 y STORY-158): el validador se prueba con fixtures de skills (conforme, legado, `skill-preflight`) y no necesita que esas historias estén entregadas. Mientras duren las migraciones, una lista transitoria explícita de skills pendientes se excluye del chequeo; cada una de esas historias retira de la lista los skills que migra, y la lista debe quedar vacía al cerrar la épica (STORY-157, AC-3).

**Alcance mínimo del contrato (para estimar):**
- Un `SKILL.md` es conforme cuando (a) declara el bloque del contrato de layout fijo, cuyo marcador y texto fija el ADR de STORY-147, (b) resuelve solo `REPO_ROOT` y (c) no contiene `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE` ni `SDDF_ROOT`, salvo las menciones de diagnóstico del layout legado en `skill-preflight`.
- Las rutas fijas que el contrato admite son `specs/flow/`, `docs/templates/` y `docs/guardrails/`.
- El validador reemplaza a `scripts/audit-root-resolution.js`: se actualizan sus referencias en `scripts/verify-repository.js`, `sddf.config.yaml` (`verify.integration`) y `test/profile-contract.test.js`, y el script legado se elimina.
- Los detalles de la redacción exacta del mensaje de error y la estructura interna del validador quedan abiertos a negociación con el equipo.
