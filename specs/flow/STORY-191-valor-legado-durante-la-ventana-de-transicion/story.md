---
alwaysApply: false
type: story
id: STORY-191
kind: feat
slug: STORY-191-valor-legado-durante-la-ventana-de-transicion
title: "Valor legado durante la ventana de transición"
status: SPECIFY
substatus: TODO
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-188-la-planificacion-termina-en-plan-done
  - STORY-189-el-rework-vuelve-a-implement-todo
  - STORY-190-directivas-de-correccion-desde-verify-y-acceptance
  - STORY-193-aviso-de-estados-legados-en-skill-preflight
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Valor legado durante la ventana de transición

**Como** Solo Builder que actualiza agile-sddf a 6.0.0 con historias ya planificadas  
**Quiero** que `/story-implement` y `/story-implement-tasks` acepten `READY-FOR-IMPLEMENT/DONE` durante la ventana de transición, con un aviso, y la traten como `IMPLEMENT/TODO` si existe `implement-report.md` o como `PLAN/DONE` si no, y que `/skill-preflight` informe con un `[WARNING]` cada `story.md` o `epic.md` de `specs/flow/` (fuera de `archive/`) con un `status` legado, junto con el estado al que editarlo a mano, sin modificar ningún archivo  
**Para** no bloquear el trabajo planificado antes de actualizar y cerrar la ventana de transición sabiendo qué falta migrar

## ✅ Criterios de aceptación

### AC-1 — Escenario principal (con datos) – Los ejecutores clasifican el valor legado
```gherkin
Escenario: READY-FOR-IMPLEMENT/DONE según sus artefactos
  Dado un proyecto actualizado a 6.0.0 con una historia STORY-NNN en "READY-FOR-IMPLEMENT/DONE"
    Y "implement-report.md" <implement-report.md>
    Y "fix-directives.md" <fix-directives.md>
  Cuando el usuario ejecuta "<ejecutor> STORY-NNN"
  Entonces el ejecutor avisa del valor legado, indica hasta qué versión se acepta y que se trata como "<equivalente>"
    Y el ejecutor <modo>
    Y pasa "story.md" a "IMPLEMENT/IN-PROGRESS"
Ejemplos:
  | ejecutor               | implement-report.md | fix-directives.md | equivalente    | modo                                                        |
  | /story-implement       | no existe           | no existe         | PLAN/DONE      | ejecuta la implementación inicial                           |
  | /story-implement       | existe              | existe            | IMPLEMENT/TODO | entra en modo rework                                        |
  | /story-implement-tasks | existe              | no existe         | IMPLEMENT/TODO | emite el aviso de IMPLEMENT/TODO sin fix-directives.md      |
  | /story-implement-tasks | no existe           | no existe         | PLAN/DONE      | ejecuta la implementación inicial                           |
```

### AC-2 — Escenario con datos – skill-preflight indica el destino de cada work item legado
```gherkin
Escenario: Destino de la edición manual
  Dado un "<work item>" de "specs/flow/" con "status: <status legado>"
    Y "implement-report.md" <implement-report.md>
  Cuando el usuario ejecuta "/skill-preflight"
  Entonces emite un "[WARNING]" con la ruta del archivo, el status legado y el destino "<destino>"
    Y ningún archivo del proyecto cambia
Ejemplos:
  | work item | status legado       | implement-report.md | destino        |
  | story.md  | READY-FOR-IMPLEMENT | no existe           | PLAN/DONE      |
  | story.md  | READY-FOR-IMPLEMENT | existe              | IMPLEMENT/TODO |
  | story.md  | READY-FOR-DEV       | no existe           | PLAN/DONE      |
  | epic.md   | READY-FOR-DEV       | no aplica           | PLAN/DONE      |
  | epic.md   | READY-FOR-IMPLEMENT | no aplica           | PLAN/DONE      |
```

### AC-3 — Escenario alternativo / error – Fuera de la regla del valor legado
```gherkin
Escenario: Valores y archivos que la ventana no cubre
  Dado <situación>
  Cuando el usuario ejecuta "<comando>"
  Entonces <resultado>
    Pero no modifica ningún archivo
Ejemplos:
  | situación                                                                                           | comando                    | resultado                                                                                                                        |
  | una historia STORY-NNN con "status: READY-FOR-DEV"                                                  | /story-implement STORY-NNN | rechaza la entrada y lista los estados aceptados: "PLAN/DONE", "IMPLEMENT/TODO", "IMPLEMENT/IN-PROGRESS" y el valor legado "READY-FOR-IMPLEMENT/DONE" |
  | ningún work item activo con status legado y una historia de "specs/flow/archive/" en "READY-FOR-IMPLEMENT/DONE" | /skill-preflight           | no emite ningún "[WARNING]" de status legado                                                                                      |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Una sola regla:** ejecutores y `skill-preflight` aplican la misma regla del ADR de STORY-186: una historia es `IMPLEMENT/TODO` si tiene `implement-report.md` y `PLAN/DONE` si no; una épica, `PLAN/DONE`. Los mensajes citan el ADR y la versión en la que termina la ventana.

- **CNF-2 — Mención acotada:** en los `SKILL.md` de `story-implement` y `story-implement-tasks`, `READY-FOR-IMPLEMENT` solo aparece en el gate de entrada y su aviso, marcado como valor legado de la ventana de transición; en `skill-preflight`, solo en la señal de status legado (CS-6). El resto de cada skill usa los estados nuevos.

- **CNF-3 — Diagnóstico no bloqueante:** las señales de `skill-preflight` son `[WARNING]`, nunca `[ERROR]`, como las de layout legado (L1-L3). Un frontmatter ilegible no interrumpe el diagnóstico. `skill-preflight` no escribe en `specs/flow/` ni en ningún otro archivo del proyecto.

- **CNF-4 — Sin migración automática:** el ejecutor no reescribe `status` al valor equivalente como paso aparte; la historia sale del valor legado con la transición normal a `IMPLEMENT/IN-PROGRESS`.

- **CNF-5 — Evals primero:** los casos del valor legado (con y sin `implement-report.md`) se escriben en `evals/evals.json` de `story-implement`, `story-implement-tasks` y `skill-preflight` (historia con y sin `implement-report.md`, épica y archivo) antes de cambiar los `SKILL.md` (CS-7, principio 11 de la constitución).

- **CNF-6 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Que `/epic-analyze` deje de emitir MAD-03 por el valor legado: STORY-192.
- Un `memory-system migrate` para los status legados: la épica decidió que los proyectos consumidores migran con el aviso de `skill-preflight` y edición manual.
- Inspeccionar `specs/flow/archive/`, que es un registro histórico.

## 📎 Notas / contexto adicional

- Cubre la parte de los ejecutores y de `skill-preflight` del criterio de salida **CS-4** de EPIC-029, el **SMOKE-3** completo y la parte de **CS-7** que pide casos del valor legado en los evals de `story-implement`, `story-implement-tasks` y `skill-preflight`.
- **Reagrupación del 2026-11-13:** absorbe a STORY-193 (aviso de estados legados en `skill-preflight`). Se unen porque las dos aplican la misma regla del ADR sobre los mismos datos (`status` legado e `implement-report.md`) y juntas cubren el SMOKE-3 entero; separadas, la regla se diseñaba dos veces.
- Depende de STORY-186 (regla y duración de la ventana), STORY-188 (entrada `PLAN/DONE`), STORY-189 (entrada `IMPLEMENT/TODO`) y STORY-190 (aviso de `IMPLEMENT/TODO` sin `fix-directives.md`, que usa la fila 3 de AC-1). STORY-188 y STORY-189 dejan `READY-FOR-IMPLEMENT/DONE` como entrada aceptada; esta lo convierte en alias con aviso. La parte de `skill-preflight` solo depende de STORY-186 y puede implementarse primero.
- La fila con `implement-report.md` y sin `fix-directives.md` corresponde a un rechazo legado de verify o acceptance: antes de STORY-190 esos gates no escribían directivas. Por eso la regla usa `implement-report.md` y no `fix-directives.md` (nota «Decisiones tomadas» de la épica).
- Punto de inserción en `skill-preflight`: junto a las señales de layout legado de `skills/skill-preflight/SKILL.md` (tabla L1-L3, líneas 98-106), con el mismo formato de mensaje. Actualizar también `skills/skill-preflight/README.md`.
- A 2026-11-07, ningún `story.md` ni `epic.md` de este repo tiene `READY-FOR-*` en el frontmatter: el alias y el aviso protegen a los proyectos consumidores.
