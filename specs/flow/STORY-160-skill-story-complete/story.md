---
alwaysApply: false
type: story
id: STORY-160
kind: feat
slug: STORY-160-skill-story-complete
title: "Skill story-complete"
status: SPECIFY
substatus: DONE
parent: EPIC-27-completar-flujo-de-story
created: 2026-10-25
updated: 2026-10-25
related:
  - EPIC-27-completar-flujo-de-story
  - STORY-159-skill-story-delivery
---
[[EPIC-27-completar-flujo-de-story]]

# 📖 Historia: Skill story-complete

**Como** Solo Builder que terminó de desarrollar una historia con SDD flow-forward
**Quiero** archivarla con `/story-complete STORY-NNN` para que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/`
**Para** dejar `specs/flow/` solo con el trabajo activo y conservar la historia como registro histórico, con su historial de git intacto

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Archivado de una historia entregada
```gherkin
Dado una historia STORY-NNN en specs/flow/STORY-NNN-<slug>/ con status DELIVER y substatus DONE
  Y el directorio de la historia está versionado en git
Cuando el usuario ejecuta /story-complete STORY-NNN y confirma la acción
Entonces story.md queda con status: COMPLETED, substatus: DONE y updated: con la fecha de hoy
  Y el directorio se mueve con git mv a specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/, con la fecha de updated:
  Y specs/flow/STORY-NNN-<slug>/ ya no existe
  Y el skill informa la ruta final del archivo
```

### AC-2 — Escenario de error – Historia que no está entregada
```gherkin
Dado una historia STORY-NNN cuyo estado no es DELIVER/DONE (p. ej. ACCEPTANCE/DONE o DELIVER/IN-PROGRESS)
Cuando el usuario ejecuta /story-complete STORY-NNN
Entonces el skill rechaza la operación nombrando el estado actual
  Y sugiere ejecutar antes /story-delivery STORY-NNN
  Y no modifica ni mueve ningún archivo
```

### AC-3 — Escenario de error – Confirmación rechazada o destino ocupado
```gherkin
Dado una historia STORY-NNN en DELIVER/DONE
  Y el usuario rechaza la confirmación, o specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/ ya existe
Cuando el usuario ejecuta /story-complete STORY-NNN
Entonces el skill termina sin cambiar status ni updated: y sin mover el directorio
  Pero si el destino ya existía, el mensaje nombra la ruta en conflicto
```

### AC-4 — Escenario de dominio – Documentación de la transición
```gherkin
Dado el invariante 6 de §4 de docs/domains/domain-state-management.md
  Y la fila COMPLETED de docs/domains/domain-story-lifecycle.md, que hoy no declara escritor
Cuando se completa esta historia
Entonces ambos documentos declaran que story-complete escribe COMPLETED siempre con confirmación humana
  Y que el archivado en specs/flow/archive/ forma parte de esa transición
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Layout fijo:** `skills/story-complete/SKILL.md` declara `<!-- SDDF-FIXED-LAYOUT: v1 -->`, resuelve solo `REPO_ROOT` y respeta el formato de archivo de ADR-0016 (`specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`).
- **CNF-2 — Publicación:** `skills/story-complete` se agrega al arreglo `files` de `package.json`.
- **CNF-3 — Atomicidad:** si `git mv` falla, el skill restaura `story.md` a su contenido previo, o el diseño deja explícito el orden de escritura y movimiento que evita estados intermedios inconsistentes.
- **CNF-4 — Gate:** `npm run verify:repository` y `npm test` pasan sin errores.

## Fuera de alcance (Non-Goals)

- Marcar la línea de la historia en `epic.md` como F3 (`- [x]`). Esa transición es de `story-implement` / `story-implement-tasks`, según `epic-template.md`.
- Hacer commit, push o PR del movimiento.
- Reabrir historias archivadas o pasarlas a `CANCELED`.
- Archivar épicas.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `specs/flow/EPIC-27-completar-flujo-de-story/epic.md`
Feature origen: STORY-160 — Skill story-complete

- Depende de STORY-159: sin `story-delivery`, ninguna historia llega a `DELIVER/DONE` por un skill.
- Como el skill actualiza `updated:` a hoy antes de mover, la fecha del directorio archivado es, en la práctica, la fecha de ejecución.
- `scripts/migrate-specs-to-flow.js` ya implementa archivado con fecha durante la migración de EPIC-26; conviene revisarlo en `/story-design` para reutilizar la convención.
- **Pendiente de refinar:** comportamiento si el directorio de la historia no está versionado (`git mv` falla): ¿fallar cerrado o usar un movimiento simple?
