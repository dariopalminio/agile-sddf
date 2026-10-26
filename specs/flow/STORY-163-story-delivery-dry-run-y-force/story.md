---
alwaysApply: false
type: story
id: STORY-163
kind: feat
slug: STORY-163-story-delivery-dry-run-y-force
title: "story-delivery: --dry-run y --force"
status: IMPLEMENT
substatus: DONE
parent: EPIC-27-completar-flujo-de-story
created: 2026-10-25
updated: 2026-10-25
related:
  - EPIC-27-completar-flujo-de-story
  - STORY-159-story-delivery-interactivo
  - STORY-162-story-delivery-modelo-continuous
---
[[EPIC-27-completar-flujo-de-story]]

# 📖 Historia: story-delivery: --dry-run y --force

**Como** Solo Builder que usa `/story-delivery` en el flujo SDD flow-forward
**Quiero** previsualizar la entrega con `--dry-run` y forzarla con `--force` cuando el estado previo o el DoD la bloquean
**Para** decidir la entrega sabiendo qué pasaría antes de escribir nada y, si la fuerzo, dejar trazado qué se omitió

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Previsualización sin efectos
```gherkin
Escenario: --dry-run evalúa sin escribir
  Dado una historia STORY-NNN en "<estado>" con el DoD "<dod>"
  Cuando el usuario ejecuta /story-delivery STORY-NNN --dry-run
  Entonces el skill muestra la evaluación del DoD y "<accion>"
    Y ningún archivo del repositorio cambia
Ejemplos:
  | estado          | dod        | accion                                     |
  | ACCEPTANCE/DONE | cumplido   | que escribiría DELIVER/DONE                |
  | VERIFY/DONE     | incumplido | el bloqueo y que --force permitiría seguir |
```

### AC-2 — Escenario alternativo – Entrega forzada con override registrado
```gherkin
Dado una historia STORY-NNN en VERIFY/DONE con criterios del DoD de DELIVER incumplidos
Cuando el usuario ejecuta /story-delivery STORY-NNN --force y confirma la entrega
Entonces story.md queda con status: DELIVER, substatus: DONE y updated: con la fecha de hoy
  Y se crea delivery-report.md en la carpeta de la historia con el estado previo, los criterios incumplidos y la fecha del override
```

### AC-3 — Escenario de error – Bloqueo sin --force sugiere el override
```gherkin
Dado una historia STORY-NNN bloqueada por su estado previo o por el DoD
Cuando el usuario ejecuta /story-delivery STORY-NNN sin --force
Entonces el skill informa el motivo del bloqueo y sugiere --force
  Pero no lo sugiere cuando el motivo es que el usuario rechazó la confirmación
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Dry-run sin efectos:** `--dry-run` no crea, modifica ni borra ningún archivo, tampoco en `.tmp/`.
- **CNF-2 — Confirmación humana siempre:** `--force` omite el gate del estado previo y del DoD, pero no la confirmación humana del paso irreversible.
- **CNF-3 — Gate:** `npm run verify:repository` y `npm test` pasan sin errores.

## Fuera de alcance (Non-Goals)

- Combinar `--dry-run` y `--force` en una misma ejecución más allá de previsualizar (con `--dry-run` nunca se escribe).
- El modelo `continuous` y el `delivery-model` ausente (STORY-162).
- Auditar o revertir overrides previos.
- Generar `delivery-report.md` en entregas sin `--force` (la entrega normal solo cambia el frontmatter, STORY-159).

## 📎 Notas / contexto adicional

**Contexto del split (`/story-split`, 2026-10-25):** historia hermana del split de STORY-159, separada con el Patrón 4 (complejidad de criterios de aceptación) según el plan de `finvest-evaluation-report.md`: los modos no interactivos (`--dry-run`, `--force`), el CNF de dry-run sin efectos y el registro del override. Extiende el skill `story-delivery` que crea STORY-159; implementarla después de esa historia.

- **Decisión confirmada (2026-10-25):** el override se registra en un `delivery-report.md` en la carpeta de la historia, y solo se genera con `--force`. Se descartó una sección en `story.md` porque el template asigna el cuerpo a story-creation, story-refine y story-split, y los skills que transicionan estado solo escriben el frontmatter. Sigue el patrón de los reportes de los demás gates (`verify-report.md`, `acceptance-report.md`) y se archiva con la historia (STORY-160).
- Según la épica (`specs/flow/EPIC-27-completar-flujo-de-story/epic.md`), `--force` escribe `DELIVER/DONE` sin importar el estado previo ni el DoD; el dominio exige igualmente la confirmación humana (STORY-159, AC-3).
