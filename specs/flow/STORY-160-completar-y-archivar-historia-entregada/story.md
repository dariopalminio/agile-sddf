---
alwaysApply: false
type: story
id: STORY-160
kind: feat
slug: STORY-160-completar-y-archivar-historia-entregada
title: "Skill story-complete: completar y archivar una historia entregada"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-27-completar-flujo-de-story
created: 2026-10-25
updated: 2026-10-26
related:
  - EPIC-27-completar-flujo-de-story
  - STORY-159-story-delivery-interactivo
  - STORY-164-archivar-historias-canceladas
---
[[EPIC-27-completar-flujo-de-story]]

# 📖 Historia: Skill story-complete: completar y archivar una historia entregada

**Como** Solo Builder que entregó una historia con SDD flow-forward
**Quiero** completarla y archivarla con `/story-complete STORY-NNN` para que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/`
**Para** dejar `specs/flow/` solo con el trabajo activo y conservar la historia entregada como registro histórico, con su historial de git intacto

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Archivado de una historia entregada
```gherkin
Escenario: Archivado de una historia entregada
  Dado una historia STORY-NNN en specs/flow/STORY-NNN-<slug>/ con status <status inicial> y substatus DONE
  Cuando el usuario ejecuta /story-complete STORY-NNN y confirma la acción
  Entonces story.md queda en COMPLETED/DONE y su updated: <updated>
    Y la historia queda en specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/, con la fecha de updated: (o created: si falta), y git log --follow muestra sus commits previos
    Y specs/flow/STORY-NNN-<slug>/ ya no existe y el skill informa la ruta final
Ejemplos:
  | status inicial | updated                                   |
  | DELIVER        | se actualiza a la fecha de hoy            |
  | COMPLETED      | no cambia: el frontmatter no se reescribe |
```

### AC-2 — Escenario de error – Historia que no puede completarse
```gherkin
Escenario: Rechazo de una historia que no puede completarse
  Dado una historia STORY-NNN en la situación <situación>
  Cuando el usuario ejecuta /story-complete STORY-NNN
  Entonces el skill rechaza la operación con <mensaje> y no modifica ni mueve ningún archivo
Ejemplos:
  | situación                                 | mensaje                                                               |
  | no existe specs/flow/STORY-NNN-*/         | nombra la ruta buscada                                                |
  | status ACCEPTANCE y substatus DONE        | nombra el estado actual y sugiere ejecutar antes /story-delivery      |
  | status DELIVER y substatus IN-PROGRESS    | nombra el estado actual y sugiere ejecutar antes /story-delivery      |
  | status CANCELED y substatus DONE          | nombra el estado actual e indica que ADR-0016 no admite su archivado  |
```

### AC-3 — Escenario de error – Operación abortada sin efectos
```gherkin
Escenario: Operación abortada sin efectos
  Dado una historia STORY-NNN en <estado> que cumple la condición de AC-1
  Cuando el usuario ejecuta /story-complete STORY-NNN y se da la condición <condición>
  Entonces el skill termina sin cambiar status ni updated:, sin mover el directorio y con <mensaje>
Ejemplos:
  | estado         | condición                                                           | mensaje                       |
  | DELIVER/DONE   | el usuario rechaza la confirmación                                  | informa que no hubo cambios   |
  | DELIVER/DONE   | specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/ ya existe         | nombra la ruta en conflicto   |
  | COMPLETED/DONE | el frontmatter no tiene updated: ni created: válidos                | nombra los campos buscados    |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Layout fijo:** `skills/story-complete/SKILL.md` declara `<!-- SDDF-FIXED-LAYOUT: v1 -->`, resuelve solo `REPO_ROOT` y respeta el formato y la regla de admisión de ADR-0016 (`specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`, solo historias `COMPLETED`).
- **CNF-2 — Publicación:** `skills/story-complete` se agrega al arreglo `files` de `package.json`.
- **CNF-3 — Historial conservado:** el movimiento al archivo preserva el historial de git del directorio (p. ej. con `git mv`); el mecanismo concreto se decide en `/story-design`.
- **CNF-4 — Atomicidad:** si el movimiento falla, el skill restaura `story.md` a su contenido previo, o el diseño deja explícito el orden de escritura y movimiento que evita estados intermedios inconsistentes. En todos los escenarios, el total de historias activas + archivadas es igual al previo a la ejecución.
- **CNF-5 — Búsqueda determinista:** la historia se localiza por nombre de directorio (`specs/flow/STORY-NNN-*/`) solo en el primer nivel de `specs/flow/`, nunca dentro de `specs/flow/archive/`; si hay más de una coincidencia, el skill falla cerrado nombrándolas.
- **CNF-6 — Documentación de dominio:** `docs/domains/domain-state-management.md` (invariante 6 de §4) y la fila `COMPLETED` de `docs/domains/domain-story-lifecycle.md` declaran que `story-complete` escribe `COMPLETED` desde `DELIVER/DONE`, siempre con confirmación humana, y que archiva sin cambiar el status las historias `COMPLETED/DONE`.
- **CNF-7 — Gate:** `npm run verify:repository` y `npm test` pasan sin errores.

## Fuera de alcance (Non-Goals)

- Archivar historias `CANCELED`, aceptar `date:` como fecha de archivo y reemplazar ADR-0016: lo cubre STORY-164.
- Marcar la línea de la historia en `epic.md` como F3 (`- [x]`). Esa transición es de `story-implement` / `story-implement-tasks`, según `epic-template.md`.
- Hacer commit, push o PR del movimiento.
- Reabrir historias archivadas o pasarlas a `CANCELED`.
- Archivar épicas.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `specs/flow/EPIC-27-completar-flujo-de-story/epic.md`
Feature origen: STORY-160 — Skill story-complete

- **Split (2026-10-25):** dividida con `/story-split` (patrón 2, variaciones de reglas de negocio) siguiendo el plan de `finvest-evaluation-report.md`. Esta historia core respeta ADR-0016 tal como está; el archivado de historias `CANCELED` y el ADR que reemplaza a ADR-0016 pasaron a STORY-164.
- Depende de STORY-159 solo para que una historia llegue a `DELIVER/DONE` por un skill. Para probar la fila `DELIVER` antes de que exista STORY-159, basta con fijar `status: DELIVER` / `substatus: DONE` a mano en una historia de fixture.
- Solo desde `DELIVER/DONE` el skill cambia el status: escribe `COMPLETED` y actualiza `updated:` a hoy antes de mover, así que la fecha del directorio archivado es, en la práctica, la fecha de ejecución. Para las historias que ya estaban en `COMPLETED/DONE`, la fecha sale de la cadena `updated:` → `created:` de ADR-0016.
- `scripts/migrate-specs-to-flow.js` ya implementa el archivado con fecha durante la migración de EPIC-26 (`archiveDate`) y bloquea historias sin fecha válida; conviene revisarlo en `/story-design` para reutilizarlo.
- **Pendiente de refinar:** comportamiento si el directorio de la historia no está versionado (el movimiento con git falla): ¿fallar cerrado o usar un movimiento simple?
- **Contrato de salida de la épica:** esta historia contribuye a cumplir:
  - **CS-1** — `skills/story-delivery/SKILL.md` y `skills/story-complete/SKILL.md` existen, declaran `<!-- SDDF-FIXED-LAYOUT: v1 -->` y están incluidos en el arreglo `files` de `package.json`.
  - **CS-3** — `story-complete` rechaza una historia que no esté en `DELIVER/DONE`, `COMPLETED/DONE` ni `CANCELED/DONE` y archiva las que sí lo están en `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`: las `DELIVER` pasan a `status: COMPLETED` y las `CANCELED` conservan su status. El total de historias activas + archivadas no cambia.
  - **CS-5** — `domain-state-management` y `domain-story-lifecycle` documentan que `story-delivery` y `story-complete` escriben `DELIVER` y `COMPLETED` con confirmación humana, y un ADR nuevo reemplaza a ADR-0016 para admitir historias `CANCELED` en `specs/flow/archive/`.
  - **CS-6** — `npm run verify:repository` y `npm test` pasan sin errores.
