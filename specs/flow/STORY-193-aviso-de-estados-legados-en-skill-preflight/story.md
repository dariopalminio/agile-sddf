---
alwaysApply: false
type: story
id: STORY-193
kind: feat
slug: STORY-193-aviso-de-estados-legados-en-skill-preflight
title: "Aviso de estados legados en skill-preflight"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-191-valor-legado-en-los-gates-de-entrada
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Aviso de estados legados en skill-preflight

**Como** Solo Builder que actualiza agile-sddf a 6.0.0  
**Quiero** que `/skill-preflight` informe con un `[WARNING]` cada `story.md` o `epic.md` de `specs/flow/` (fuera de `archive/`) con `status` `READY-FOR-IMPLEMENT` o `READY-FOR-DEV`, junto con el estado al que editarlo a mano, sin modificar ningún archivo  
**Para** cerrar la ventana de transición sabiendo qué falta migrar

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Historia legada sin implementación
```gherkin
Dado un proyecto actualizado a 6.0.0 con una historia STORY-NNN en "READY-FOR-IMPLEMENT/DONE", sin "implement-report.md"
Cuando el usuario ejecuta "/skill-preflight"
Entonces emite un "[WARNING]" con la ruta de su "story.md", el status legado y el estado destino "PLAN/DONE"
  Y ningún archivo del proyecto cambia
```

### AC-2 — Escenario con datos – Estado destino de cada work item legado
```gherkin
Escenario: Destino de la edición manual
  Dado un "<work item>" de "specs/flow/" con "status: <status legado>"
    Y "implement-report.md" <implement-report.md>
  Cuando el usuario ejecuta "/skill-preflight"
  Entonces el "[WARNING]" de ese archivo indica el destino "<destino>"
Ejemplos:
  | work item | status legado       | implement-report.md | destino        |
  | story.md  | READY-FOR-IMPLEMENT | no existe           | PLAN/DONE      |
  | story.md  | READY-FOR-IMPLEMENT | existe              | IMPLEMENT/TODO |
  | story.md  | READY-FOR-DEV       | no existe           | PLAN/DONE      |
  | epic.md   | READY-FOR-DEV       | no aplica           | PLAN/DONE      |
  | epic.md   | READY-FOR-IMPLEMENT | no aplica           | PLAN/DONE      |
```

### AC-3 — Escenario alternativo – Archivo y proyecto migrado
```gherkin
Dado que ningún "story.md" ni "epic.md" de "specs/flow/" fuera de "archive/" tiene un status legado
  Y "specs/flow/archive/" contiene una historia archivada en "READY-FOR-IMPLEMENT/DONE"
Cuando el usuario ejecuta "/skill-preflight"
Entonces no emite ningún "[WARNING]" de status legado
  Pero no modifica la historia archivada
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Diagnóstico no bloqueante:** las señales son `[WARNING]`, nunca `[ERROR]`, como las de layout legado (L1-L3). Un frontmatter ilegible no interrumpe el diagnóstico.

- **CNF-2 — Solo lectura:** `/skill-preflight` no escribe en `specs/flow/` ni en ningún otro archivo del proyecto.

- **CNF-3 — Evals primero:** los casos de status legado (historia con y sin `implement-report.md`, épica y archivo) se escriben en `skills/skill-preflight/evals/evals.json` antes de cambiar el `SKILL.md` (CS-7, principio 11 de la constitución).

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Migrar los status automáticamente o añadir un `memory-system migrate`: la épica decidió que los proyectos consumidores editan a mano.
- Que los ejecutores acepten el valor legado: STORY-191.
- Inspeccionar `specs/flow/archive/`, que es un registro histórico.

## 📎 Notas / contexto adicional

- Cubre la parte de `skill-preflight` del criterio de salida **CS-4** de EPIC-029, la parte de preflight del **SMOKE-3** y la parte de **CS-7** que pide casos del valor legado en los evals de `skill-preflight`.
- Punto de inserción: junto a las señales de layout legado de `skills/skill-preflight/SKILL.md` (tabla L1-L3, líneas 98-106), con el mismo formato de mensaje. Actualizar también `skills/skill-preflight/README.md`.
- La regla de destino es la del ADR de STORY-186: una historia pasa a `IMPLEMENT/TODO` si tiene `implement-report.md` y a `PLAN/DONE` si no; una épica, a `PLAN/DONE`. El mensaje cita el ADR y la versión en la que termina la ventana.
- Solo depende de STORY-186: se puede implementar en paralelo con STORY-188 a STORY-192.
