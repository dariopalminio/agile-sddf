---
alwaysApply: false
type: story
id: STORY-190
kind: feat
slug: STORY-190-directivas-de-correccion-desde-acceptance
title: "Directivas de corrección desde acceptance"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-189-rework-de-revision-a-implement-todo
  - STORY-197-rechazos-de-verify-y-acceptance-a-implement-todo
  - STORY-198-directivas-de-correccion-desde-verify
  - STORY-199-origen-del-rework-en-los-ejecutores
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Directivas de corrección desde acceptance

**Como** Solo Builder que corrige una historia rechazada en ACCEPTANCE  
**Quiero** que `/story-acceptance` con `NEEDS-CHANGES` escriba `fix-directives.md` desde una plantilla común en `docs/templates/fix-directives-template.md`, con `based-on: acceptance-report.md`, una fila por criterio rechazado y un `round` que continúe las rondas de rework de la historia  
**Para** que un criterio rechazado por el validador llegue al ejecutor como una corrección que exige su test, y se cierre la deuda que registró ADR-0008

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Rework por aceptación con directivas
```gherkin
Dado una historia STORY-NNN en "VERIFY/DONE"
Cuando el validador rechaza un criterio con una observación en "/story-acceptance STORY-NNN"
  Y luego el usuario ejecuta "/story-implement STORY-NNN"
Entonces junto a "story.md" queda "fix-directives.md" con "based-on: acceptance-report.md"
  Y "fix-directives.md" tiene una fila por criterio rechazado, con la dimensión "requirements-coverage" y la observación del validador
  Y "/story-implement" entra en modo rework y exige un test del criterio rechazado antes de corregir el código
```

### AC-2 — Escenario alternativo – round continúa entre gates
```gherkin
Dado una historia STORY-NNN cuya ronda de rework 1 la abrió "/story-code-review"
  Y "/story-code-review" aprobó la corrección y borró "fix-directives.md"
Cuando "/story-acceptance STORY-NNN" emite "NEEDS-CHANGES"
Entonces el nuevo "fix-directives.md" tiene "round: 2"
  Y la ronda anterior se leyó de la fuente versionada que fija el ADR
  Pero "round" no vuelve a 1 porque "/story-code-review" haya aprobado entre medias
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Plantilla única:** `docs/templates/fix-directives-template.md` es la fuente de la estructura, con `based-on` según el gate. `story-code-review` y `story-acceptance` llevan en `assets/` una copia semilla con el mismo contenido, y `docs/templates/README.md` la registra. La plantilla recoge lo que fijó EPIC-28: PREEXISTENTE y `no verificado` no entran, y un hallazgo fusionado entra una vez con `Reportado por:`.

- **CNF-2 — round con varios escritores:** `story-code-review` deja de ser el escritor único de `round`. Tanto él como `story-acceptance` leen la ronda anterior de la fuente versionada que fija el ADR, así que `round` cuenta todas las rondas de rework de la historia.

- **CNF-3 — Lista blanca de acceptance:** un rechazo de aceptación no tiene archivo de origen; su lista blanca sigue la regla del ADR. Una lista vacía no es un error.

- **CNF-4 — Evals primero:** los casos de `fix-directives.md` se escriben en `evals/evals.json` de `story-acceptance` (parte de CS-7), y los del `round` continuo en los de `story-code-review`, antes de cambiar sus `SKILL.md` (principio 11 de la constitución).

- **CNF-5 — Sin regresión en la revisión:** con la plantilla común, `story-code-review` sigue escribiendo `based-on: code-review-report.md` y las mismas filas, y sigue borrando el archivo al aprobar.

- **CNF-6 — Reporte sin cambios:** el formato de `acceptance-report.md` no cambia.

- **CNF-7 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que los ejecutores lean `acceptance-report.md` (descartado por la épica: tres formatos distintos, que conservan `NEEDS-CHANGES` después de corregir hasta que el gate vuelve a ejecutarse).
- Cambiar qué hallazgos de `story-code-review` entran en `fix-directives.md` (fijado en EPIC-28).
- Las directivas de `story-verify`: STORY-198.
- El anuncio del origen del rework y el aviso ante `IMPLEMENT/TODO` sin directivas en los ejecutores: STORY-199.
- El destino `IMPLEMENT/TODO` de los rechazos: STORY-189 (revisión) y STORY-197 (verify y acceptance).

## 📎 Notas / contexto adicional

- Historia core del split de STORY-190 (2026-11-13, patrón 4); antes `STORY-190-directivas-de-correccion-desde-verify-y-acceptance`. Las otras partes son STORY-198 (verify) y STORY-199 (ejecutores).
- Cubre el **SMOKE-4** de EPIC-029, y la parte de **CS-3** y **CS-7** que corresponde a la plantilla común, a `round` y a `story-acceptance`.
- Depende de STORY-186 (ADR-0022), que fija la fuente de la ronda anterior y la lista blanca de acceptance. La planificación espera a que el ADR esté aceptado. AC-1 también necesita STORY-197 (acceptance deja `IMPLEMENT/TODO`) y STORY-189 (el ejecutor acepta ese estado).
- El contrato actual vive en `skills/story-code-review/assets/fix-directives-template.md` (`based-on: code-review-report.md` fijo) y en el Paso 4f de `skills/story-code-review/SKILL.md`, que hoy declara a `story-code-review` escritor único de `round`.
- El ciclo de corrección de la plantilla manda volver a `/story-code-review` tras corregir. Sigue siendo válido para los tres orígenes, porque todo rework vuelve a pasar por la revisión.
- La dimensión `requirements-coverage` ya activa en el ejecutor la regla de evidencia que exige un test antes de corregir, así que esta historia no cambia esa regla.
