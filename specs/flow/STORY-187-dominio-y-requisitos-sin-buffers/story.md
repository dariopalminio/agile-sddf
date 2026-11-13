---
alwaysApply: false
type: story
id: STORY-187
kind: chore
slug: STORY-187-dominio-y-requisitos-sin-buffers
title: "Dominio, requisitos y máquina de estados sin buffers"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-192-epica-sin-ready-for-dev
  - STORY-195-requisitos-sin-estados-buffer
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Dominio, requisitos y máquina de estados sin buffers

**Como** Solo Builder que consulta el dominio, la máquina de estados y los requisitos para entender el ciclo de vida de historias y épicas  
**Quiero** que `domain.md`, `domain-state-management.md`, `domain-story-lifecycle.md`, `domain-epic-lifecycle.md`, `domain-skills-map.md`, `state-machine.md`, NFR-006 y FR-043/044/045 describan los workflows sin buffers del ADR, con el rework de los tres gates en `IMPLEMENT/TODO`, sin WIP para una cola y con `TODO` como «pendiente de iniciar» en cualquier estado activo  
**Para** que el ciclo de vida que aprendo en la documentación de autoridad sea el mismo que escriben los skills en el frontmatter

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Los documentos declaran los workflows del ADR
```gherkin
Dado el ADR de workflows sin buffers con estado "ACCEPTED"
Cuando el lector abre "domain.md", "domain-story-lifecycle.md", "domain-epic-lifecycle.md" y "docs/architecture/state-machine.md"
Entonces el workflow de historia es "SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED"
  Y el workflow de épica es "DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED"
  Y cada documento cita el ADR como fuente de los workflows y las transiciones
```

### AC-2 — Escenario con datos – Rework y transiciones alineados con el ADR
```gherkin
Escenario: Documento alineado con el ADR
  Dado el documento "<documento>"
  Cuando el lector busca la transición que describe
  Entonces encuentra "<contenido>"
Ejemplos:
  | documento                                                 | contenido                                                                          |
  | domain-story-lifecycle.md y domain-state-management.md    | el NEEDS-CHANGES de un gate vuelve a IMPLEMENT/TODO, sin estado ni substatus de rework |
  | docs/architecture/state-machine.md                        | el NEEDS-CHANGES de code-review, verify y acceptance lleva a IMPLEMENT/TODO         |
  | FR-043, FR-044 y FR-045                                   | el NEEDS-CHANGES de su gate → IMPLEMENT/TODO con fix-directives.md                  |
  | NFR-006                                                   | status como etapa y substatus como progreso, sin estados buffer                    |
  | docs/domains/domain-skills-map.md                         | story-analyze escribe PLAN/DONE y los tres gates escriben IMPLEMENT/TODO           |
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

- **CNF-2 — Sin valor legado en la autoridad:** ninguno de los documentos de esta historia menciona `READY-FOR-IMPLEMENT` ni `READY-FOR-DEV`. FR-043/044/045 y NFR-006 describen el comportamiento destino; la ventana de transición se describe en el ADR y en los skills que la aplican (CS-6).

- **CNF-3 — Verificación por búsqueda:** el `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` de cada documento de esta historia devuelve 0; es la evidencia principal de la historia, junto con la lectura de AC-1 a AC-3.

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- `docs/architecture/sdcl-sddf.md`, el diagrama `flowchart-skill-story-flow-relationships.mermaid`, las guías de `docs/guides/`, `README.md` y `docs/product/objectives.md`: los cubre STORY-194.
- Cambiar el comportamiento de los skills: STORY-188 a STORY-192.
- Editar registros históricos (ADR-0003, ADR-0006, ADR-0008, `CHANGELOG.md`, las propuestas fechadas de `docs/product/roadmap.md`, `specs/flow/archive/`).

## 📎 Notas / contexto adicional

- Cubre el criterio de salida **CS-5** de EPIC-029 y la parte de **CS-6** que corresponde a `docs/domains/`, `docs/architecture/state-machine.md` y `docs/requirements/`.
- **Reagrupación del 2026-11-13:** absorbe a STORY-195 (requisitos y máquina de estados), que se había separado de esta con `/story-split` (Patrón 3, por tipo de documento). Se vuelven a unir porque comparten la misma verificación (CNF-3 y el `grep` de CS-6), el mismo ADR de referencia y el mismo tipo de cambio (texto de autoridad), y separarlas duplicaba el ciclo de planificación, revisión y verify sin reducir riesgo.
- Depende de STORY-186. Los workflows, el destino del rework y la consulta de la cola ya están fijados en EPIC-029, así que la redacción puede empezar antes. Lo que espera al ADR es su número para citarlo (AC-1), el estado `ACCEPTED` y el contrato de `fix-directives.md` (escritor, origen en `based-on`, `round`) que describen FR-043/044/045.
- Menciones de buffers a retirar (2026-11-13, `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"`): `domain-story-lifecycle.md` 14, `domain-epic-lifecycle.md` 11, `docs/architecture/state-machine.md` 11, `domain.md` 3, `domain-state-management.md` 2, `NFR-006-control-de-ciclo-de-vida-con-status-substatus.md` 2, `domain-skills-map.md` 1 y `FR-043-revision-de-codigo-multi-agente-gate-del-dod-code.md`, `FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify.md` y `FR-045-aceptacion-humana-final-fase-acceptance.md` 1 cada uno. Además, `domain-state-management.md` define «Buffer» y un WIP limit por buffer, y `domain.md` define WIP «en un buffer» y la regla BR-004 con límites por buffer.
- El contrato de formato de líneas de la sección de historias (`domain-epic-lifecycle` §9, F1/F2/F3) no cambia.
- La constitución §9 solo limita `IN-PROGRESS` y no nombra los buffers: no necesita cambios (comprobar con `grep` al implementar).
- Coordinación con STORY-192: `skills/epic-analyze/SKILL.md` declara el orden de madurez «según `domain-story-lifecycle` §4.1 y §5»; las dos historias tienen que terminar con el mismo orden de estados.
- Historia de documentación (`kind: chore`): su verificación es la lectura y el `grep`, no un ciclo TDD.
