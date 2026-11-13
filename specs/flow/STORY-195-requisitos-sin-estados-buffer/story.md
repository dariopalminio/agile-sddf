---
alwaysApply: false
type: story
id: STORY-195
kind: chore
slug: STORY-195-requisitos-sin-estados-buffer
title: "Requisitos y máquina de estados sin buffers"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-187-dominio-sin-estados-buffer
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Requisitos y máquina de estados sin buffers

**Como** Solo Builder que sigue una transición de estado desde el skill hasta su requisito  
**Quiero** que `state-machine.md`, `domain-skills-map.md`, NFR-006 y FR-043/044/045 describan las transiciones sin buffers del ADR, con el `NEEDS-CHANGES` de los tres gates llevando a `IMPLEMENT/TODO`  
**Para** que la máquina de estados, el mapa de skills y el requisito que consulto digan lo mismo que el frontmatter que escribe el skill

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – La máquina de estados declara las transiciones del ADR
```gherkin
Dado el ADR de workflows sin buffers con estado "ACCEPTED"
Cuando el lector abre "docs/architecture/state-machine.md"
Entonces las transiciones de historia y de épica son las del ADR
  Y el "NEEDS-CHANGES" de code-review, verify y acceptance lleva a "IMPLEMENT/TODO"
  Y el documento cita el ADR como fuente de las transiciones
```

### AC-2 — Escenario con datos – Requisitos y mapa de skills
```gherkin
Escenario: Documento alineado con el ADR
  Dado el documento "<documento>"
  Cuando el lector busca la transición que describe
  Entonces encuentra "<contenido>"
Ejemplos:
  | documento                         | contenido                                                                     |
  | FR-043, FR-044 y FR-045           | el NEEDS-CHANGES de su gate → IMPLEMENT/TODO con fix-directives.md             |
  | NFR-006                           | status como etapa y substatus como progreso, sin estados buffer               |
  | docs/domains/domain-skills-map.md | story-analyze escribe PLAN/DONE y los tres gates escriben IMPLEMENT/TODO      |
```

### AC-3 — Escenario alternativo – Sin valor legado en la autoridad
```gherkin
Dado los seis documentos de esta historia
Cuando el lector busca "READY-FOR-IMPLEMENT" o "READY-FOR-DEV"
Entonces no encuentra ninguna coincidencia
  Pero la ventana de transición del valor legado sigue descrita en el ADR
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Coherencia con el ADR:** ningún documento añade decisiones que no estén en el ADR de STORY-186; si un documento necesita una regla nueva, se registra primero en el ADR.

- **CNF-2 — Requisitos sin ventana de transición:** FR-043/044/045 y NFR-006 describen el comportamiento destino; la compatibilidad con `READY-FOR-IMPLEMENT/DONE` vive en el ADR y en los skills que la aplican (CS-6).

- **CNF-3 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- `domain.md`, `domain-state-management.md`, `domain-story-lifecycle.md` y `domain-epic-lifecycle.md`: los cubre STORY-187.
- `docs/architecture/sdcl-sddf.md`, el diagrama `flowchart-skill-story-flow-relationships.mermaid`, las guías de `docs/guides/`, `README.md` y `docs/product/objectives.md`: los cubre STORY-194.
- Cambiar el comportamiento de los skills: STORY-188 a STORY-193.
- Editar registros históricos (ADR-0003, ADR-0006, ADR-0008, `CHANGELOG.md`, las propuestas fechadas de `docs/product/roadmap.md`, `specs/flow/archive/`).

## 📎 Notas / contexto adicional

- Cubre la parte del criterio de salida **CS-5** de EPIC-029 que toca a `docs/architecture/state-machine.md`, `domain-skills-map.md` y `docs/requirements/`, y la parte de **CS-6** de esos documentos. El dominio lo cubre STORY-187.
- Depende de STORY-186: el texto de FR-043/044/045 sobre `fix-directives.md` (escritor, origen en `based-on`, `round`) sale del contrato que fija el ADR. `state-machine.md`, `domain-skills-map.md` y NFR-006 pueden redactarse con lo que ya fija EPIC-029.
- No depende de STORY-187: se pueden entregar en cualquier orden.
- Archivos afectados y menciones de buffers (2026-11-13, `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"`): `docs/architecture/state-machine.md` 11, `docs/domains/domain-skills-map.md` 1, `docs/requirements/non-functional/NFR-006-control-de-ciclo-de-vida-con-status-substatus.md` 2, `docs/requirements/functional/FR-043-revision-de-codigo-multi-agente-gate-del-dod-code.md`, `FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify.md` y `FR-045-aceptacion-humana-final-fase-acceptance.md` 1 cada uno.
- Historia derivada con `/story-split` (Patrón 3, por tipo de documento) de `STORY-187-dominio-y-requisitos-sin-buffers`.
