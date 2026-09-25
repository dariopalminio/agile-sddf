---
type: domain-context
slug: domain
title: "Agile SDDF — Contexto de dominio"
project: agile-sddf
version: "1.0"
status: draft
created: 2026-09-12
updated: 2026-09-12
---
# Agile SDDF — Contexto de dominio

> **Propósito:** cursor compacto y vivo para personas y agentes que trabajen en este repositorio.
> **Estado:** borrador inicial basado en fuentes versionadas; requiere revisión humana antes de
> convertir sus incertidumbres en reglas definitivas.
> **Cambios:** creación del contexto base y referencias de detalle existentes.
## Project Overview

**Nombre:** Agile SDDF — Agile Spec-Driven Development Framework (`agile-sddf`, npm 2.0.3).

**Descripción:** framework/harness AI-CLI multiagente que conduce el desarrollo de software desde
la intención hasta código y pruebas verificables mediante artefactos Markdown versionados, skills,
agentes, templates, scripts, trazabilidad y gates de calidad.

**Usuarios principales:** developers/builders individuales, equipos ágiles, Product Owners o
analistas, arquitectos de software, mantenedores del framework y agentes de IA consumidores.

**Objetivo de negocio:** ofrecer una alternativa profesional a los frameworks SDD actuales: un harness multi-agente que conduce el ciclo completo de desarrollo —de la intención al release— mediante artefactos versionados, gates de calidad y trazabilidad end-to-end, para que equipos y organizaciones adopten SDD sin sacrificar escalabilidad, auditoría ni gobernanza.

**Etapa:** framework en evolución continua. No usar los deadlines históricos ni los contadores de
work items como estado actual sin verificarlos en el filesystem.

**Fuentes de inicio:** `AGENTS.md`, `docs/constitution.md`,
`docs/specs/01-projects/PROJ-01-agile-sddf/project.md`, `package.json` y `docs/domains/`.

## Domain Boundaries
### Alcance operativo central

- Especificar, planificar y mantener work items de proyecto (L3), épica (L2) e historia (L1).
- Orquestar skills, agentes y quality gates para el ciclo SDD, incluido TDD, revisión,
  verificación y aceptación de historias.
- Persistir specs, políticas, ADRs, templates y documentación como conocimiento versionado del
  repositorio.
- Instalar la misma fuente de skills y agentes en runtimes compatibles.

### Alcance de soporte

- Scripts Node.js para CLI, instalación y postinstall; `sddf.config.yaml` para comandos de prueba,
  modelo de entrega y workers por stack.
- Documentación wiki, diagramas de contexto, ingeniería inversa de codebases y auditoría de seguridad.

### Fuera de alcance del core

- Motor propio de LLM, base de datos, autenticación/RBAC, dashboards o mensajería.
- Despliegue a producción de los proyectos generados.
- Workers específicos de React, NestJS, Playwright u otros stacks: viven fuera del core, normalmente
  en `agile-sddf-extension`.
- Integraciones/exportaciones nativas a Jira, Linear, Notion o herramientas equivalentes.

### Notas de frontera

- El repositorio es la fuente de verdad; `skills/` y `agents/` en la raíz son la fuente de
  distribución. `.claude/`, `.agents/` y `.github/` son destinos instalados.
- La persistencia del framework es el sistema de archivos. `.tmp/<skill-name>/` es comunicación
  temporal entre subagentes y no es un artefacto versionado.

## Terminology Glossary

| Término | Definición |
|---|---|
| **SDD / SDDF** | Spec-Driven Development / su framework ágil de soporte. |
| **Work item** | Unidad de trabajo identificable: Project, Epic o Story. |
| **L3 / L2 / L1** | Niveles Project / Epic / Story; estratégico, coordinación y operativo. |
| **Skill** | Instrucción Markdown especializada que orquesta una capacidad. |
| **Worker** | Skill sin interacción ni delegación, especializado por stack. |
| **Agente** | Procesador especializado en contexto aislado; un subagente no delega a otro. |
| **Artefacto** | Documento persistido que materializa conocimiento o trabajo. |
| **Template / seed** | Estructura de salida activa / copia distribuida en `assets/` de un skill. |
| **Frontmatter** | Metadatos YAML de trazabilidad y estado de un artefacto. |
| **Status / substatus** | Etapa del workflow / avance dentro de la etapa. |
| **Gate / DoD** | Control de transición / criterios verificables de terminado. |
| **WIP** | Límite de trabajo simultáneo en progreso o en un buffer. |
| **AC / TC** | Criterio de aceptación Gherkin / caso de prueba trazable. |
| **FINVEST** | Rúbrica de calidad de historias: Formato + INVEST. |
| **SDDF_ROOT / SPECS_BASE** | Override temporal / raíz resuelta por `SDDF_ROOT` válida → `sddf.config.yaml.root` válida → `docs`. |

## Entity Registry

| Entidad | Qué es | Atributos o relaciones esenciales |
|---|---|---|
| **Project** | Work item L3 y contexto fundacional. | `PROJ-*`; agrupa épicas; `project-intent.md`, `project.md`, `project-plan.md`. |
| **Epic** | Work item L2 que agrupa historias para un entregable. | `EPIC-*`; parent Project; `epic.md`. |
| **Story** | Work item L1 atómico que aporta valor. | `STORY-*`; parent Epic; `kind`; `story.md` y artefactos derivados. |
| **Artifact** | Unidad de conocimiento persistida en el repositorio. | Tipo, ruta, frontmatter y enlaces de trazabilidad. |
| **Skill** | Orquestador de una operación del framework. | Lee contexto/template, aplica precondiciones y produce artefactos. |
| **Agente / subagente** | Especialista al que un skill puede delegar una vez. | Devuelve resultados vía `.tmp/<skill-name>/`. |
| **Template** | Meta-artefacto que define la forma de una salida. | Seed local y copia activa central; se interpreta en runtime. |
| **Policy / DoD / ADR** | Artefactos normativos de gobernanza, calidad y decisiones. | El DoD actúa como gate; ADR aceptado es inmutable. |
| **Configuración SDDF** | Configuración operacional por proyecto. | `sddf.config.yaml`: delivery model, pruebas y workers. |

## State Models

- **Jerarquía documentada:** `Project (L3) → Epic (L2) → Story (L1)`.
- **Proyecto (flujo documentado):** `INTENT → REQUIREMENT → PLAN`, materializado por
  `project-intent.md → project.md → project-plan.md` y gates humanos.
- **Épica (flujo documentado):** `DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED`.
- **Historia (flujo documentado):** `SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`.
- **Substatus documentados:** `TODO`, `IN-PROGRESS`, `DONE`, `BLOCKED`. `BLOCKED` mantiene la etapa
  actual; los terminales requieren acción humana o CI/CD.

> **Cautela:** el repositorio contiene valores históricos y variaciones de `status`/`substatus`
> (por ejemplo, `READY`). No normalizarlos ni asumir que todo documento cumple el modelo hasta
> reconciliar las fuentes listadas en Open Questions.

## Relationship Map

| Desde | Relación | Hacia | Notas |
|---|---|---|---|
| Project | agrupa | Epic | Una épica debe referenciar un Project padre. |
| Epic | agrupa | Story | Una historia debe referenciar una Epic padre. |
| Work item | materializa | Artifact | Su directorio conserva la spec y los outputs de cada fase. |
| Skill | lee y produce | Artifact | Respeta template, precondiciones y estado de entrada. |
| Skill | delega a | Agente | Solo desde el orquestador y con un salto de profundidad. |
| Template | estructura | Artifact | La copia activa determina campos y secciones esperados. |
| Policy / DoD | gobierna | Transición | Un gate puede bloquear o devolver el work item a rework. |
| Configuración SDDF | selecciona | Worker y pruebas | Permite que el core siga siendo agnóstico al stack. |

## Flow Catalog

### Inicialización y diagnóstico de entorno

1. `sddf-init` prepara estructura y configuración de forma idempotente.
2. Cada skill resuelve localmente la raíz una vez y no continúa ante una fuente explícita inválida.
3. `skill-preflight` se invoca bajo demanda para diagnosticar la raíz, templates y estructura sin modificar el repositorio.

### Proyecto, épicas e historias

1. `project-begin → project-discovery → project-planning` produce los documentos fundacionales.
2. Las épicas se crean manualmente o desde el plan, se validan y generan historias trazables.
3. La historia recorre su lifecycle, produciendo diseño, tareas, casos de prueba, reportes y evidencia
   de aceptación según corresponda.
4. Fallos de review, verify o acceptance devuelven una historia a `READY-FOR-IMPLEMENT`; la señal de
   rework puede ser `fix-directives.md`.

### Distribución

1. npm distribuye `skills/`, `agents/`, `scripts/` y configuración declarada por `package.json`.
2. `agile-sddf install` copia las fuentes al runtime elegido: `.claude/`, `.agents/` o `.github/`.

## Business Rules

| ID | Regla | Aplica a |
|---|---|---|
| BR-001 | El repositorio versionado contiene la memoria operativa, specs, políticas y decisiones. | Todo el framework. |
| BR-002 | Todo skill aplica la precedencia `SDDF_ROOT` válida → `sddf.config.yaml.root` válida → `docs`; una fuente explícita inválida impide escribir. `skill-preflight` es diagnóstico bajo demanda. | Skills. |
| BR-003 | Las relaciones de nivel son Project → Epic → Story; no se permiten saltos de nivel en el modelo canónico. | Work items. |
| BR-004 | Debe verificarse WIP=1 antes de activar un nuevo ítem por nivel; los buffers de Epic y Story documentan además límites configurables. | Work items. |
| BR-005 | Los gates exigen precondiciones y DoD antes de una transición; rechazo o fallo produce bloqueo o rework. | Pipelines. |
| BR-006 | `DELIVER`, `SHIP` y `COMPLETED` no los escribe automáticamente un skill; son manuales o de CI/CD. | Transiciones terminales. |
| BR-007 | El tipo de una historia vive en `kind` (`feat`, `fix`, `chore`, `hotfix`), no en el prefijo `STORY-*`. | Stories. |
| BR-008 | Un ADR aceptado no se edita: un ADR nuevo lo reemplaza mediante `superseded-by`. | Decisiones de arquitectura. |
| BR-009 | La fuente de skills y agentes es la raíz del repositorio; las carpetas de runtime son salidas instaladas. | Distribución. |
| BR-010 | Los templates se resuelven como copia central activa → seed del skill con advertencia → error. | Generación de artefactos. |

## Integration Points

| Sistema | Propósito | Dirección |
|---|---|---|
| Claude Code, OpenCode, GitHub Copilot | Harnesses que ejecutan skills y agentes instalados. | Ambos |
| npm | Distribución del paquete `agile-sddf`. | Salida |
| Git / GitHub | Versionado, revisión y CI. | Ambos |
| GitHub Actions | Escaneo de seguridad de skills y Docker en este repositorio. | Entrada |
| `agile-sddf-extension` | Workers específicos por tecnología, instalados aparte. | Entrada |
| Docker / Dev Container | Entorno de desarrollo reproducible. | Soporte |

## User Roles

| Rol | Responsabilidad principal |
|---|---|
| Developer / Builder | Inicia y ejecuta el workflow en un proyecto. |
| Equipo ágil | Comparte backlog y adopta el proceso en uno o más runtimes. |
| Product Owner / Analista | Especifica, evalúa FINVEST y aprueba aceptación. |
| Arquitecto | Descubre requisitos, prioriza y diseña. |
| Mantenedor | Dogfooding, evolución del core, seguridad, evals y publicación npm. |
| Agente IA consumidor | Carga sólo el contexto necesario y genera artefactos conformes. |

## Stakeholder Map

No hay personas nombradas de forma fiable en las fuentes revisadas. Mantener los roles anteriores y
registrar nombres, intereses y momentos de involucramiento cuando el equipo los confirme.

## Detail Files

| Archivo | Contenido a cargar bajo demanda |
|---|---|
| `docs/domains/domain-work-item-hierarchy.md` | Modelo, parentesco e invariantes de Project/Epic/Story. |
| `docs/domains/domain-state-management.md` | Conceptos transversales de estados, transiciones, WIP y gates. |
| `docs/domains/domain-project-lifecycle.md` | Pipeline y gates del nivel L3. |
| `docs/domains/domain-epic-lifecycle.md` | Pipeline y gates del nivel L2. |
| `docs/domains/domain-story-lifecycle.md` | Pipeline, rework y gates del nivel L1. |
| `docs/domains/domain-knowledge-artifacts.md` | Modelo de artefactos, trazabilidad, policies, guardrails, DoD y templates. |
| `docs/constitution.md` | Principios técnicos y reglas vigentes (documento supremo de gobernanza). |
| `docs/guardrails/dod-story-<etapa>.md` | Criterios de terminado de cada etapa de historia: un transition guardrail por etapa (`specify` … `acceptance`) más `dod-story-release.md` (despliegue). |

## Open Questions

- [ ] ¿Cuál es la fuente canónica única para transiciones y valores de `status`/`substatus`? Los
  documentos de dominio y los artefactos existentes muestran variaciones históricas. — 2026-09-12
- [ ] ¿Debe aplicarse WIP=1 estrictamente a todos los niveles o sólo al nivel Project, dejando los
  buffers L2/L1 configurables? — 2026-09-12
- [ ] ¿Qué norma de padding de IDs es vigente? Hay modelos con `PROJ-NNN` y uso real `PROJ-01`. — 2026-09-12
- [ ] ¿La ubicación activa de templates es definitivamente `$SPECS_BASE/templates/`? ADR-0007 y el
  filesystem apuntan allí, mientras documentos históricos citan `$SPECS_BASE/specs/templates/`. — 2026-09-12
- [ ] ¿OpenSpec es legado retirado o capacidad soportada? README y documentos históricos difieren
  de la especificación actual. — 2026-09-12
- [ ] ¿Quiénes son los stakeholders nombrados y cuál es el estado actual del roadmap? — 2026-09-12

## Changelog

| Fecha | Resumen | Entidades añadidas | Reglas añadidas |
|---|---|---|---|
| 2026-09-12 | Bootstrap desde fuentes versionadas; se registraron divergencias para revisión. | Project, Epic, Story, Artifact, Skill, Agent, Template, Policy/DoD/ADR, Configuración. | BR-001 a BR-010. |
