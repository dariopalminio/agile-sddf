---
alwaysApply: false
type: story
id: STORY-198
kind: feat
slug: STORY-198-directivas-de-correccion-desde-verify
title: "Directivas de corrección desde verify"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-190-directivas-de-correccion-desde-acceptance
  - STORY-197-rechazos-de-verify-y-acceptance-a-implement-todo
  - STORY-199-origen-del-rework-en-los-ejecutores
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Directivas de corrección desde verify

**Como** Solo Builder que corrige una historia rechazada en VERIFY  
**Quiero** que `/story-verify` con `NEEDS-CHANGES` escriba `fix-directives.md` desde la plantilla común, con `based-on: verify-report.md` y una fila por cada defecto CRITICAL o HIGH abierto y por cada criterio del DoD VERIFY fallido  
**Para** que el ejecutor reciba qué tests o criterios fallaron y los corrija sin tener que leer `verify-report.md`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Rework por verificación con directivas
```gherkin
Dado una historia STORY-NNN en "CODE-REVIEW/DONE" con un test del proyecto que falla
Cuando "/story-verify STORY-NNN" emite "NEEDS-CHANGES"
  Y luego el usuario ejecuta "/story-implement STORY-NNN"
Entonces junto a "story.md" queda "fix-directives.md" con "based-on: verify-report.md"
  Y "/story-implement" entra en modo rework con esas directivas
  Pero no exige escribir un test nuevo para la fila de verify, porque el test que falla ya existe
```

### AC-2 — Escenario con datos – Filas de un rechazo de verify
```gherkin
Escenario: Hallazgos de verify que entran en fix-directives.md
  Dado una historia STORY-NNN en "CODE-REVIEW/DONE"
    Y "/story-verify STORY-NNN" encuentra <hallazgos>
  Cuando "/story-verify" emite "NEEDS-CHANGES"
  Entonces "fix-directives.md" tiene <filas> fila(s) en "Instrucciones de corrección", todas con la dimensión de verify que nombra el ADR
Ejemplos:
  | hallazgos                                                           | filas |
  | un defecto CRITICAL, un defecto HIGH y dos MEDIUM abiertos          | 2     |
  | el criterio DoD VERIFY "Todos los tests del proyecto pasan" fallido | 1     |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Plantilla única:** `/story-verify` usa la plantilla común `docs/templates/fix-directives-template.md` que crea STORY-190 y lleva en `assets/` una copia semilla con el mismo contenido.

- **CNF-2 — round continuo:** `/story-verify` numera `round` con todas las rondas de rework de la historia, leyendo la ronda anterior de la fuente versionada que fija el ADR, igual que los otros dos gates.

- **CNF-3 — Evals primero:** los casos de `fix-directives.md` se escriben en `evals/evals.json` de `story-verify` (parte de CS-7) antes de cambiar su `SKILL.md` (principio 11 de la constitución).

- **CNF-4 — Reporte sin cambios:** el formato de `verify-report.md` no cambia.

- **CNF-5 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que los ejecutores lean `verify-report.md` (descartado por la épica).
- Los defectos MEDIUM y LOW: no bloquean y no entran en `fix-directives.md`.
- Las directivas de aceptación, la plantilla común y el `round` continuo de `story-code-review`: STORY-190.
- El destino `IMPLEMENT/TODO` del rechazo de verify: STORY-197.
- El anuncio del origen del rework en los ejecutores: STORY-199.

## 📎 Notas / contexto adicional

- Derivada del split de STORY-190 (2026-11-13, patrón 4). Cubre la parte de **CS-3** y **CS-7** que corresponde a `story-verify`.
- Depende de STORY-186 (ADR-0022): fija el nombre de la dimensión de verify y la fuente de la ronda anterior. La planificación espera a que el ADR esté aceptado.
- Orden sugerido: después de STORY-190, que crea la plantilla común en `docs/templates/`. Si se implementa antes, esta historia la crea.
- AC-1 necesita que `/story-verify` deje la historia en `IMPLEMENT/TODO` (STORY-197) y que el ejecutor acepte ese estado (STORY-189).
