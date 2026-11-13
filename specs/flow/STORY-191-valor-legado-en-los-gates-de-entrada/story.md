---
alwaysApply: false
type: story
id: STORY-191
kind: feat
slug: STORY-191-valor-legado-en-los-gates-de-entrada
title: "Valor legado en los gates de entrada"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-188-la-planificacion-termina-en-plan-done
  - STORY-189-el-rework-vuelve-a-implement-todo
  - STORY-193-aviso-de-estados-legados-en-skill-preflight
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Valor legado en los gates de entrada

**Como** Solo Builder que actualiza agile-sddf a 6.0.0 con historias ya planificadas  
**Quiero** que `/story-implement` y `/story-implement-tasks` acepten `READY-FOR-IMPLEMENT/DONE` durante la ventana de transición, con un aviso, y la traten como `IMPLEMENT/TODO` si existe `implement-report.md` (ya se implementó y un gate la rechazó) o como `PLAN/DONE` si no  
**Para** no bloquear el trabajo planificado antes de actualizar

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Historia legada planificada
```gherkin
Dado un proyecto actualizado a 6.0.0 con una historia STORY-NNN en "READY-FOR-IMPLEMENT/DONE", sin "implement-report.md" ni "fix-directives.md"
Cuando el usuario ejecuta "/story-implement STORY-NNN"
Entonces "/story-implement" avisa del valor legado e indica hasta qué versión se acepta
  Y la trata como "PLAN/DONE"
  Y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
```

### AC-2 — Escenario con datos – Clasificación del valor legado
```gherkin
Escenario: READY-FOR-IMPLEMENT/DONE según sus artefactos
  Dado una historia STORY-NNN en "READY-FOR-IMPLEMENT/DONE"
    Y "implement-report.md" <implement-report.md>
    Y "fix-directives.md" <fix-directives.md>
  Cuando el usuario ejecuta "<ejecutor> STORY-NNN"
  Entonces el aviso del valor legado indica que se trata como "<equivalente>"
    Y el ejecutor <modo>
    Y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
Ejemplos:
  | ejecutor               | implement-report.md | fix-directives.md | equivalente    | modo                                                        |
  | /story-implement       | no existe           | no existe         | PLAN/DONE      | ejecuta la implementación inicial                           |
  | /story-implement       | existe              | existe            | IMPLEMENT/TODO | entra en modo rework                                        |
  | /story-implement-tasks | existe              | no existe         | IMPLEMENT/TODO | emite el aviso de IMPLEMENT/TODO sin fix-directives.md      |
  | /story-implement-tasks | no existe           | no existe         | PLAN/DONE      | ejecuta la implementación inicial                           |
```

### AC-3 — Escenario alternativo / error – Otro valor buffer no se acepta
```gherkin
Dado una historia STORY-NNN con "status: READY-FOR-DEV"
Cuando el usuario ejecuta "/story-implement STORY-NNN"
Entonces rechaza la entrada y lista los estados aceptados: "PLAN/DONE", "IMPLEMENT/TODO", "IMPLEMENT/IN-PROGRESS" y el valor legado "READY-FOR-IMPLEMENT/DONE"
  Pero no modifica "story.md"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Mención acotada:** en los `SKILL.md` de `story-implement` y `story-implement-tasks`, `READY-FOR-IMPLEMENT` solo aparece en el gate de entrada y su aviso, marcado como valor legado de la ventana de transición (CS-6). El resto del skill usa los estados nuevos.

- **CNF-2 — Evals primero:** los casos del valor legado (con y sin `implement-report.md`) se escriben en `evals/evals.json` de `story-implement` y `story-implement-tasks` antes de cambiar los `SKILL.md` (CS-7, principio 11 de la constitución).

- **CNF-3 — Sin migración automática:** el ejecutor no reescribe `status` al valor equivalente como paso aparte; la historia sale del valor legado con la transición normal a `IMPLEMENT/IN-PROGRESS`.

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- El `[WARNING]` de `/skill-preflight` para los status legados: STORY-193.
- Que `/epic-analyze` deje de emitir MAD-03 por el valor legado: STORY-192.
- Un `memory-system migrate` para los status legados: la épica decidió que los proyectos consumidores migran con el aviso de `skill-preflight` y edición manual.

## 📎 Notas / contexto adicional

- Cubre la parte de los ejecutores del criterio de salida **CS-4** de EPIC-029, la parte del ejecutor del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `story-implement` y `story-implement-tasks`.
- Depende de STORY-186 (regla y duración de la ventana), STORY-188 (entrada `PLAN/DONE`) y STORY-189 (entrada `IMPLEMENT/TODO`). Esas dos historias dejan `READY-FOR-IMPLEMENT/DONE` como entrada aceptada; esta lo convierte en alias con aviso.
- La fila con `implement-report.md` y sin `fix-directives.md` corresponde a un rechazo legado de verify o acceptance: antes de STORY-190 esos gates no escribían directivas. Por eso la regla usa `implement-report.md` y no `fix-directives.md` (nota «Decisiones tomadas» de la épica).
- A 2026-11-07, ningún `story.md` ni `epic.md` de este repo tiene `READY-FOR-*` en el frontmatter: el alias protege a los proyectos consumidores.
