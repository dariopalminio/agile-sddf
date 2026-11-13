---
alwaysApply: false
type: story
id: STORY-187
kind: chore
slug: STORY-187-dominio-sin-estados-buffer
title: "Dominio sin estados buffer"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-195-requisitos-sin-estados-buffer
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Dominio sin estados buffer

**Como** Solo Builder que consulta `docs/domains/` para entender el ciclo de vida de historias y épicas  
**Quiero** que `domain.md`, `domain-state-management.md`, `domain-story-lifecycle.md` y `domain-epic-lifecycle.md` describan los workflows sin buffers del ADR, con el rework en `IMPLEMENT/TODO`, sin WIP para una cola y con `TODO` como «pendiente de iniciar» en cualquier estado activo  
**Para** que el ciclo de vida que aprendo en el dominio sea el mismo que escriben los skills en el frontmatter

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Los documentos de dominio declaran los workflows del ADR
```gherkin
Dado el ADR de workflows sin buffers con estado "ACCEPTED"
Cuando el lector abre "domain.md", "domain-story-lifecycle.md" y "domain-epic-lifecycle.md"
Entonces el workflow de historia es "SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED"
  Y el workflow de épica es "DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED"
  Y cada documento cita el ADR como fuente de los workflows
```

### AC-2 — Escenario alternativo – El rework vuelve a IMPLEMENT/TODO
```gherkin
Dado que "story-code-review", "story-verify" o "story-acceptance" devuelve "NEEDS-CHANGES"
Cuando el lector busca en "domain-story-lifecycle.md" y "domain-state-management.md" a qué estado vuelve la historia
Entonces encuentra "IMPLEMENT/TODO"
  Pero no un estado ni un substatus propio de rework
```

### AC-3 — Escenario alternativo – La cola de listos es una consulta, no un estado
```gherkin
Dado que el lector busca en "domain-state-management.md" qué historias están listas para implementar
Cuando lee la sección de flujo
Entonces encuentra la consulta "primero IMPLEMENT/TODO, después PLAN/DONE"
  Y "TODO" significa "pendiente de iniciar" en cualquier estado activo
  Pero no un estado propio, un gate ni un límite WIP para esa cola
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Coherencia con el ADR:** ningún documento añade decisiones que no estén en el ADR de STORY-186; si un documento necesita una regla nueva, se registra primero en el ADR.

- **CNF-2 — Sin valor legado en el dominio:** los cuatro documentos no mencionan `READY-FOR-IMPLEMENT` ni `READY-FOR-DEV`; la ventana de transición se describe en el ADR y en los skills que la aplican (CS-6).

- **CNF-3 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- `docs/architecture/state-machine.md`, `docs/domains/domain-skills-map.md`, NFR-006 y FR-043/044/045: los cubre STORY-195.
- `docs/architecture/sdcl-sddf.md`, el diagrama `flowchart-skill-story-flow-relationships.mermaid`, las guías de `docs/guides/`, `README.md` y `docs/product/objectives.md`: los cubre STORY-194.
- Cambiar el comportamiento de los skills: STORY-188 a STORY-193.
- Editar registros históricos (ADR-0003, ADR-0006, ADR-0008, `CHANGELOG.md`, las propuestas fechadas de `docs/product/roadmap.md`, `specs/flow/archive/`).

## 📎 Notas / contexto adicional

- Cubre el criterio de salida **CS-5** de EPIC-029 en lo que toca a `docs/domains/`, y la parte de **CS-6** de los cuatro documentos de dominio. El resto de CS-5 y CS-6 lo cubre STORY-195.
- Depende de STORY-186. Los workflows, el destino del rework y la consulta de la cola ya están fijados en EPIC-029, así que la redacción puede empezar antes. Lo que espera al ADR es su número para citarlo (AC-1) y el estado `ACCEPTED`.
- No depende de STORY-195: se pueden entregar en cualquier orden.
- Menciones de buffers a retirar (2026-11-13, `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"`): `domain-story-lifecycle.md` 14, `domain-epic-lifecycle.md` 11, `domain.md` 3 y `domain-state-management.md` 2. Además, `domain-state-management.md` define «Buffer» y un WIP limit por buffer, y `domain.md` define WIP «en un buffer» y la regla BR-004 con límites por buffer.
- El contrato de formato de líneas de la sección de historias (`domain-epic-lifecycle` §9, F1/F2/F3) no cambia.
- La constitución §9 solo limita `IN-PROGRESS` y no nombra los buffers: no necesita cambios (comprobar con `grep` al implementar).
- Historia dividida con `/story-split` (Patrón 3, por tipo de documento) a partir de la anterior `STORY-187-dominio-y-requisitos-sin-buffers`.
