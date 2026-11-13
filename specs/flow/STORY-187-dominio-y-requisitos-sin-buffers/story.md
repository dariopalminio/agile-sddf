---
alwaysApply: false
type: story
id: STORY-187
kind: chore
slug: STORY-187-dominio-y-requisitos-sin-buffers
title: "Dominio y requisitos sin buffers"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Dominio y requisitos sin buffers

**Como** Solo Builder que consulta la documentación de autoridad para entender el ciclo de vida de historias y épicas  
**Quiero** que `domain-state-management`, `domain-story-lifecycle`, `domain-epic-lifecycle`, `domain.md`, `domain-skills-map.md`, `state-machine.md`, NFR-006 y FR-043/044/045 describan los workflows del ADR, con las invariantes de rework apuntando a `IMPLEMENT/TODO`, sin invariantes ni gates de WIP para una cola y con `TODO` como «pendiente de iniciar» en cualquier estado activo  
**Para** que la documentación de autoridad no contradiga a los skills

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Los documentos de dominio declaran los workflows del ADR
```gherkin
Dado el ADR de workflows sin buffers con estado "ACCEPTED"
Cuando el lector abre "domain-state-management.md", "domain-story-lifecycle.md" y "domain-epic-lifecycle.md"
Entonces el workflow de historia es "SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED"
  Y el workflow de épica es "DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED"
  Y las invariantes de rework apuntan a "IMPLEMENT/TODO"
  Y ninguna invariante, gate ni objeto de valor define un WIP limit de cola
  Y "TODO" significa "pendiente de iniciar" en cualquier estado activo
  Y cada documento cita el ADR nuevo como fuente de los workflows
```

### AC-2 — Escenario con datos – Requisitos, mapa de skills y máquina de estados
```gherkin
Escenario: Documento sin buffers
  Dado el documento "<documento>"
  Cuando el lector busca "READY-FOR-IMPLEMENT" o "READY-FOR-DEV"
  Entonces no encuentra ninguna coincidencia
    Y el documento describe "<contenido>"
Ejemplos:
  | documento                                 | contenido                                                                   |
  | docs/architecture/state-machine.md        | las transiciones del ADR, con NEEDS-CHANGES de los tres gates a IMPLEMENT/TODO |
  | NFR-006                                   | status como etapa y substatus como progreso, sin estados buffer             |
  | FR-043                                    | NEEDS-CHANGES de la revisión → IMPLEMENT/TODO con fix-directives.md         |
  | FR-044                                    | NEEDS-CHANGES de verify → IMPLEMENT/TODO con fix-directives.md              |
  | FR-045                                    | NEEDS-CHANGES de acceptance → IMPLEMENT/TODO con fix-directives.md          |
  | docs/domains/domain-skills-map.md         | story-analyze escribe PLAN/DONE y los tres gates escriben IMPLEMENT/TODO    |
  | docs/domains/domain.md                    | el vocabulario de estados sin buffers                                       |
```

### AC-3 — Escenario alternativo – La cola de listos es una consulta, no un estado
```gherkin
Dado que el lector busca en "domain-state-management.md" qué historias están listas para implementar
Cuando lee la sección de flujo
Entonces encuentra la consulta "primero IMPLEMENT/TODO, después PLAN/DONE"
  Pero no un estado propio ni un límite WIP para esa cola
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Coherencia con el ADR:** ningún documento añade decisiones que no estén en el ADR de STORY-186; si un documento necesita una regla nueva, se registra primero en el ADR.

- **CNF-2 — Sin valor legado en la autoridad:** los documentos de dominio y de requisitos no mencionan `READY-FOR-IMPLEMENT` ni `READY-FOR-DEV`; la ventana de transición se describe en el ADR y en los skills que la aplican (CS-6).

- **CNF-3 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- `docs/architecture/sdcl-sddf.md`, el diagrama `flowchart-skill-story-flow-relationships.mermaid`, las guías de `docs/guides/`, `README.md` y `docs/product/objectives.md`: los cubre STORY-194.
- Cambiar el comportamiento de los skills: STORY-188 a STORY-193.
- Editar registros históricos (ADR-0003, ADR-0006, ADR-0008, `CHANGELOG.md`, las propuestas fechadas de `docs/product/roadmap.md`, `specs/flow/archive/`).

## 📎 Notas / contexto adicional

- Cubre el criterio de salida **CS-5** de EPIC-029 y la parte de **CS-6** que corresponde a `docs/domains/`, `docs/architecture/state-machine.md` y `docs/requirements/`.
- Depende de STORY-186: los documentos describen lo que decide el ADR.
- Archivos afectados (2026-11-13): `docs/domains/domain-state-management.md`, `domain-story-lifecycle.md`, `domain-epic-lifecycle.md`, `domain.md`, `domain-skills-map.md`; `docs/architecture/state-machine.md`; `docs/requirements/non-functional/NFR-006-control-de-ciclo-de-vida-con-status-substatus.md`; `docs/requirements/functional/FR-043-…`, `FR-044-…` y `FR-045-…`.
- El contrato de formato de líneas de la sección de historias (`domain-epic-lifecycle` §9, F1/F2/F3) no cambia.
- La constitución §9 solo limita `IN-PROGRESS` y no nombra los buffers: no necesita cambios (comprobar con `grep` al implementar).
