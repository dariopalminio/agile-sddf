---
alwaysApply: false
type: story
id: STORY-199
kind: feat
slug: STORY-199-origen-del-rework-en-los-ejecutores
title: "Origen del rework en los ejecutores"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-189-rework-de-revision-a-implement-todo
  - STORY-190-directivas-de-correccion-desde-acceptance
  - STORY-198-directivas-de-correccion-desde-verify
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Origen del rework en los ejecutores

**Como** Solo Builder que retoma una historia rechazada  
**Quiero** que `/story-implement` y `/story-implement-tasks` anuncien qué gate abrió el rework según `based-on` de `fix-directives.md` y avisen si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`  
**Para** saber qué gate tengo que volver a pasar y detectar un rework que perdió sus directivas antes de implementar sin ellas

## ✅ Criterios de aceptación

### AC-1 — Escenario principal (con datos) – Anuncio del origen del rework
```gherkin
Escenario: El ejecutor nombra el gate de origen
  Dado una historia STORY-NNN en "IMPLEMENT/TODO" con "fix-directives.md" y "based-on: <reporte>"
  Cuando el usuario ejecuta "<ejecutor> STORY-NNN"
  Entonces el ejecutor anuncia que el rework viene de "<gate>" y entra en modo rework
Ejemplos:
  | ejecutor               | reporte              | gate             |
  | /story-implement       | verify-report.md     | story-verify     |
  | /story-implement-tasks | acceptance-report.md | story-acceptance |
```

### AC-2 — Escenario alternativo / error – IMPLEMENT/TODO sin fix-directives.md
```gherkin
Escenario: Ejecutor ante IMPLEMENT/TODO sin directivas
  Dado una historia STORY-NNN en "IMPLEMENT/TODO" sin "fix-directives.md"
  Cuando el usuario ejecuta "<ejecutor> STORY-NNN"
  Entonces el ejecutor avisa de que encontró "IMPLEMENT/TODO" sin "fix-directives.md" y continúa sin modo rework
    Pero no deduce el rework de "verify-report.md" ni de "acceptance-report.md"
Ejemplos:
  | ejecutor               |
  | /story-implement       |
  | /story-implement-tasks |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Señal única:** `fix-directives.md` sigue siendo la única señal de rework (ADR-0008, conservado por el ADR nuevo); el aviso no cambia esa regla ni bloquea la ejecución.

- **CNF-2 — Evals primero:** los casos del origen del rework y del aviso se escriben en `evals/evals.json` de `story-implement` y `story-implement-tasks` antes de cambiar sus `SKILL.md` (principio 11 de la constitución).

- **CNF-3 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que los ejecutores lean `verify-report.md` o `acceptance-report.md` (descartado por la épica).
- Escribir `fix-directives.md` desde verify y acceptance: STORY-198 y STORY-190.
- Que los ejecutores acepten `IMPLEMENT/TODO` como entrada: STORY-189.

## 📎 Notas / contexto adicional

- Derivada del split de STORY-190 (2026-11-13, patrón 4). Cubre la parte de **CS-3** que pide el aviso ante `IMPLEMENT/TODO` sin `fix-directives.md`.
- Depende de STORY-189, que hace que los ejecutores acepten `IMPLEMENT/TODO`. No depende de STORY-190 ni de STORY-198: los casos de `verify-report.md` y `acceptance-report.md` se prueban con un `fix-directives.md` de ejemplo, y `story-code-review` ya escribe `based-on: code-review-report.md`.
