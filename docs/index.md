---
type: wiki
slug: index
title: "Índice de documentación"
date: 2026-08-29
status: IN-PROGRESS
substatus: IN-PROGRESS
parent: null
---

# 📚 Índice de documentación

> Este índice es el punto de entrada principal para LLMs y humanos.
> Lee este archivo primero para orientarte antes de abrir cualquier otro nodo.
> Formato de cada entrada: wikilink + link markdown a la ruta relativa + descripción.
> El slug del wikilink es el declarado en el frontmatter del documento (convención SDDF). La ruta relativa es
> navegable con Ctrl+clic en VS Code y en GitHub. Cuando un archivo no tiene frontmatter, se enlaza
> solo por ruta. Usa [Foam](https://foambubble.github.io/foam/) para visualizar el grafo.

---

## ⚖️ Políticas (docs/policies/)

Las `policies` son reglas organizativas y contienen restricciones `guardrails` que guían el comportamiento y las decisiones dentro de la organización para el desarrollo y los agentes.

Cargadas automáticamente en cada sesión vía prompt de sistema (`CLAUDE.md`, `AGENTS.md`).

- [[constitution]] — [constitution.md](policies/constitution.md) — Principios técnicos inamovibles, stack, estándares de construcción de skills
- [[definition-of-done]] — [definition-of-done-story.md](policies/definition-of-done-story.md) — Definition of Done por estado del workflow de historia
- [skill_creation_policy.md](policies/references/skill_creation_policy.md) — Política de creación de skills (referencia, sin frontmatter)

---

## 🗂️ Especificaciones (docs/specs/)

### L3 — Proyecto

`specs/01-projects/PROJ-01-agile-sddf/`

- [[PROJ-01-agile-sddf-project-intent]] — [project-intent.md](specs/01-projects/PROJ-01-agile-sddf/project-intent.md) — Intención inicial: problema, visión y alcance del framework
- [[PROJ-01-agile-sddf]] — [project.md](specs/01-projects/PROJ-01-agile-sddf/project.md) — Especificación de requisitos del proyecto
- [[project-plan]] — [project-plan.md](specs/01-projects/PROJ-01-agile-sddf/project-plan.md) — Plan de épicas y backlog de features · `IN-PROGRESS`
- [[story-map]] — [story-map.md](specs/01-projects/PROJ-01-agile-sddf/story-map.md) — Mapa de historias de usuario

También en ese directorio: [context-diagram.puml](specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml) — diagrama de contexto C4 (PlantUML, sin frontmatter).

### L2 — Épicas

`specs/02-epics/EPIC-NN-*/epic.md`. Las épicas recientes anidan sus documentos `plan-NN.md`
(planes de feature dentro de la épica).

- [[EPIC-00-estructura-base-y-mecanismo-de-templates]] — [epic.md](specs/02-epics/EPIC-00-estructura-base-y-mecanismo-de-templates/epic.md) — Estructura base y mecanismo de templates
- [[EPIC-01-features-spec-builder]] — [epic.md](specs/02-epics/EPIC-01-features-spec-builder/epic.md) — Features Spec Builder
- [[EPIC-02-project-spec-builder]] — [epic.md](specs/02-epics/EPIC-02-project-spec-builder/epic.md) — Project Spec Builder (pipeline de proyecto)
- [[EPIC-03-reverse-engineering]] — [epic.md](specs/02-epics/EPIC-03-reverse-engineering/epic.md) — Ingeniería inversa de proyectos existentes
- [[EPIC-04-refactor-features-spec-builder]] — [epic.md](specs/02-epics/EPIC-04-refactor-features-spec-builder/epic.md) — Consolidación y calidad del features spec builder
- [[EPIC-05-enhance-project-spec]] — [epic.md](specs/02-epics/EPIC-05-enhance-project-spec/epic.md) — Expansión del project spec
- [[EPIC-06-release-and-story-generator]] — [epic.md](specs/02-epics/EPIC-06-release-and-story-generator/epic.md) — Generador de releases e historias
- [[EPIC-07-publicacion-framework-npm]] — [epic.md](specs/02-epics/EPIC-07-publicacion-framework-npm/epic.md) — Publicación del framework como paquete npm
- [[EPIC-08-npm-install-locally]] — [epic.md](specs/02-epics/EPIC-08-npm-install-locally/epic.md) — Instalación local vía npm
- [[EPIC-09-docs-and-wiki-builders]] — [epic.md](specs/02-epics/EPIC-09-docs-and-wiki-builders/epic.md) — Docs & wiki builders
- [[EPIC-10-mejora-estructura-artefactos-nuevos-skills]] — [epic.md](specs/02-epics/EPIC-10-mejora-estructura-artefactos-nuevos-skills/epic.md) — Mejora en estructura de artefactos y nuevos skills
- [[EPIC-11-centralizar-templates]] — [epic.md](specs/02-epics/EPIC-11-centralizar-templates/epic.md) — Centralizar templates de spec en directorio compartido
- [[EPIC-12-story-sdd-workflow]] — [epic.md](specs/02-epics/EPIC-12-story-sdd-workflow/epic.md) — Comandos del flujo de story
- [[quality-gates-con-dod-en-story-workflow]] — [epic.md](specs/02-epics/EPIC-13-quality-gates-con-dod-en-story-workflow/epic.md) — EPIC-13: Quality gates con DoD en el story workflow · `DEFINITION`
- [[fabrica-de-skills]] — [epic.md](specs/02-epics/EPIC-14-fabrica-de-skills/epic.md) — EPIC-14: Fábrica de skills
- [[e2e-capability]] — [epic.md](specs/02-epics/EPIC-15-e2e-capability/epic.md) — EPIC-15: Skills de testing especializado y capacidad E2E

#### EPIC-16 — Enhancement and Security

- [[EPIC-16-enhancement-and-security]] — [epic.md](specs/02-epics/EPIC-16-enhancement-and-security/epic.md) — Mejoras y fortificación de skills
  - [[plan-01-root-folder-selection-to-installer]] — [plan-01](specs/02-epics/EPIC-16-enhancement-and-security/plan-01-root-folder-selection-to-installer.md) — Selección de carpeta raíz en el instalador
  - [[plan-02-integrate-story-testcases-in-story-plan]] — [plan-02](specs/02-epics/EPIC-16-enhancement-and-security/plan-02-Integrate-story-testcases-in-story-plan.md) — Integrar story-testcases en story-plan
  - [[plan-03-integrate-story-improve-in-story-specify]] — [plan-03](specs/02-epics/EPIC-16-enhancement-and-security/plan-03-integrate-story-improve-in-story-specify.md) — Integrar story-improve en story-specify
  - [[plan-04-add-and-improve-skills-readme]] — [plan-04](specs/02-epics/EPIC-16-enhancement-and-security/plan-04-add-and-improve-skills-readme.md) — Añadir y mejorar los README de skills
  - [[plan-05-extend-story-code-review-with-testcases]] — [plan-05](specs/02-epics/EPIC-16-enhancement-and-security/plan-05-extend-story-code-review-with-testcases.md) — Extender story-code-review con testcases e implement-report
  - [[plan-06-configure-story-verify-with-config-file]] — [plan-06](specs/02-epics/EPIC-16-enhancement-and-security/plan-06-configure-story-verify-with-config-file.md) — Configurar story-verify con `sddf.config.yaml`

#### EPIC-17 — Remediating and Improvement

- [[remediating-and-improvement]] — [epic.md](specs/02-epics/EPIC-17-remediating-and-improvement/epic.md) — Remediación de hallazgos y mejoras transversales · `IMPLEMENT`
  - [[plan-01-reduction-of-descriptions-context-cost]] — [plan-01](specs/02-epics/EPIC-17-remediating-and-improvement/plan-01-reduction-of-descriptions-context-cost.md) — Reducir el costo de contexto de las `description`
  - [[plan-02-fix-claude-md]] — [plan-02](specs/02-epics/EPIC-17-remediating-and-improvement/plan-02-fix-claude-md.md) — Corrección de `CLAUDE.md`
  - [[plan-03-clean]] — [plan-03](specs/02-epics/EPIC-17-remediating-and-improvement/plan-03-clean.md) — Limpieza de assets muertos y configuración legacy
  - [[plan-4-fix-story-code-review]] — [plan-04](specs/02-epics/EPIC-17-remediating-and-improvement/plan-04-fix-story-code-review.md) — Fix de inconsistencia interna en story-code-review
  - [[plan-5-normalize-skills-frontmatter]] — [plan-05](specs/02-epics/EPIC-17-remediating-and-improvement/plan-05-normalize-skills-frontmatter.md) — Normalizar el frontmatter de los skills
  - [[plan-6-centralizar-templates-compartidos]] — [plan-06](specs/02-epics/EPIC-17-remediating-and-improvement/plan-06-centralizar-templates-compartidos.md) — Centralizar templates compartidos (→ ADR-0001)
  - [[plan-7-invocacion-agentes-locales-de-skill]] — [plan-07](specs/02-epics/EPIC-17-remediating-and-improvement/plan-07-invocacion-agentes-locales-de-skill.md.md) — Contrato de invocación de agentes locales (→ ADR-0002)
  - [[plan-8-align-the-declared-multi-client-support]] — [plan-08](specs/02-epics/EPIC-17-remediating-and-improvement/plan-08-align-the-declared-multi-client-support.md) — Alinear el soporte multi-cliente declarado con el real
  - [[plan-09-state-machine-canonical-document]] — [plan-09](specs/02-epics/EPIC-17-remediating-and-improvement/plan-09-state-machine-canonical-document.md) — Documento canónico de la máquina de estados
  - [[plan-10-interactive-subagent-resilience]] — [plan-10](specs/02-epics/EPIC-17-remediating-and-improvement/plan-10-interactive-subagent-resilience.md) — Resiliencia de entrevistas multivuelta con subagentes
  - [[plan-11-fix-instalador-npm]] — [plan-11](specs/02-epics/EPIC-17-remediating-and-improvement/plan-11-fix-instalador-npm.md) — Fix del instalador npm (`--force`, sin prompt en postinstall)
  - [[plan-12-centralize-preflight-paragraph]] — [plan-12](specs/02-epics/EPIC-17-remediating-and-improvement/plan-12-centralize-preflight-paragraph.md) — Centralizar el párrafo de preflight
  - [[plan-13-remove-gem-and-rovo]] — [plan-13](specs/02-epics/EPIC-17-remediating-and-improvement/plan-13-remove-gem-and-rovo.md) — Eliminar `gem/` y `rovo/`
  - [[plan-14-evals-standardization]] — [plan-14](specs/02-epics/EPIC-17-remediating-and-improvement/plan-14-evals-standardization.md) — Estandarización del esquema de `evals.json`
  - [[plan-15-improve-invocation-in-story-implement]] — [plan-15](specs/02-epics/EPIC-17-remediating-and-improvement/plan-15-improve-invocation-in-story-implement.md) — Formalizar la invocación de `code_generators`
  - [[plan-16-agnostic-framework]] — [plan-16](specs/02-epics/EPIC-17-remediating-and-improvement/plan-16-agnostic-framework.md) — Desacoplar las referencias a `.claude/` de los skills
  - [[plan-17-generates-evals]] — [plan-17](specs/02-epics/EPIC-17-remediating-and-improvement/plan-17-generates-evals.md) — Generar `evals/evals.json` para skills

#### EPIC-18 — Workflow Hardening

- [[workflow-hardening]] — [epic.md](specs/02-epics/EPIC-18-workflow-hardening/epic.md) — Robustecer el flujo de story y release
  - [[plan-01-deliver-status]] — [plan-01](specs/02-epics/EPIC-18-workflow-hardening/plan-01-deliver-status.md) — Renombrar `INTEGRATION` → `DELIVER`
  - [[plan-02-epic-workflow-definition]] — [plan-02](specs/02-epics/EPIC-18-workflow-hardening/plan-02-epic-workflow-definition.md) — Definir el workflow canónico de épica/release
  - [[plan-03-lazy-assignment-of-feat-ids]] — [plan-03](specs/02-epics/EPIC-18-workflow-hardening/plan-03-lazy-assignment-of-feat-ids.md) — Asignación lazy de IDs de historia en dos fases
  - [[plan-04-doc-story-implement]] — [plan-04](specs/02-epics/EPIC-18-workflow-hardening/plan-04-doc-story-implement.md) — Mejorar la documentación de story-implement
  - [[plan-05-enhance-code-review]] — [plan-05](specs/02-epics/EPIC-18-workflow-hardening/plan-05-enhance-code-review.md) — Incorporar mejoras a story-code-review
  - [[plan-06-isolate-workspace-by-story]] — [plan-06](specs/02-epics/EPIC-18-workflow-hardening/plan-06-isolate-workspace-by-story.md) — Aislar el espacio de trabajo por historia
  - [[plan-07-fix_code_generators_of_story-implement]] — [plan-07](specs/02-epics/EPIC-18-workflow-hardening/plan-07-fix_code_generators_of_story-implement.md) — Corregir desincronización en `code_generators`
  - [[plan-08-move-skills-to-the-root]] — [plan-08](specs/02-epics/EPIC-18-workflow-hardening/plan-08-move-skills-to-the-root.md) — Actualizar rutas tras mover `skills/` y `agents/` a la raíz

### L1 — Historias de usuario

`specs/03-stories/STORY-NNN-*/story.md`.

> **Convención de directorio:** cada `STORY-NNN-*/` contiene `story.md` como nodo principal y, según la
> fase alcanzada, puede contener además `analyze.md`, `design.md`, `tasks.md`, `testcases.md`,
> `implement-report.md`, `code-review-report.md`, `verify-report.md`, `acceptance-report.md`,
> `fix-directives.md` o `finvest-evaluation-report.md`. Esos artefactos derivados no se enumeran aquí:
> se leen desde el directorio de la historia.

#### Pipeline de proyecto (EPIC-01 → EPIC-05)

- [[STORY-001-project-begin]] — [story.md](specs/03-stories/STORY-001-project-begin/story.md) — project-begin: captura de intención inicial del proyecto
- [[STORY-003-project-discovery]] — [story.md](specs/03-stories/STORY-003-project-discovery/story.md) — project-discovery: discovery de usuarios y especificación de requisitos
- [[STORY-004-project-planning]] — [story.md](specs/03-stories/STORY-004-project-planning/story.md) — project-planning: planificación de épicas y backlog
- [[STORY-005-project-story-mapping]] — [story.md](specs/03-stories/STORY-005-project-story-mapping/story.md) — project-story-mapping: user story mapping según Jeff Patton
- [[STORY-006-story-creation]] — [story.md](specs/03-stories/STORY-006-story-creation/story.md) — story-creation: crear historias de usuario
- [[STORY-007-story-evaluation]] — [story.md](specs/03-stories/STORY-007-story-evaluation/story.md) — story-evaluation: evaluación FINVEST de historias
- [[STORY-008-control-wip]] — [story.md](specs/03-stories/STORY-008-control-wip/story.md) — Control WIP=1: detección de proyecto activo
- [[STORY-010-gates-de-revision]] — [story.md](specs/03-stories/STORY-010-gates-de-revision/story.md) — Gates de revisión humana entre fases del pipeline
- [[STORY-011-project-planning-mejorado]] — [story.md](specs/03-stories/STORY-011-project-planning-mejorado/story.md) — project-planning mejorado: integración con story mapping
- [[STORY-012-story-split]] — [story.md](specs/03-stories/STORY-012-story-split/story.md) — story-split: dividir épicas en historias pequeñas
- [[STORY-013-story-refine]] — [story.md](specs/03-stories/STORY-013-story-refine/story.md) — story-refine: refinamiento iterativo de historias
- [[STORY-015-project-flow]] — [story.md](specs/03-stories/STORY-015-project-flow/story.md) — project-flow: orquestador del pipeline completo de proyecto

#### Ingeniería inversa (EPIC-03)

- [[STORY-017-reverse-engineering]] — [story.md](specs/03-stories/STORY-017-reverse-engineering/story.md) — reverse-engineering: skill orquestador de ingeniería inversa
- [[STORY-018-agente-reverse-engineer-architect]] — [story.md](specs/03-stories/STORY-018-agente-reverse-engineer-architect/story.md) — Agente reverse-engineer-architect
- [[STORY-019-agente-reverse-engineer-product-discovery]] — [story.md](specs/03-stories/STORY-019-agente-reverse-engineer-product-discovery/story.md) — Agente reverse-engineer-product-discovery
- [[STORY-020-agente-reverse-engineer-business-analyst]] — [story.md](specs/03-stories/STORY-020-agente-reverse-engineer-business-analyst/story.md) — Agente reverse-engineer-business-analyst
- [[STORY-021-agente-reverse-engineer-ux-flow-mapper]] — [story.md](specs/03-stories/STORY-021-agente-reverse-engineer-ux-flow-mapper/story.md) — Agente reverse-engineer-ux-flow-mapper
- [[STORY-022-agente-reverse-engineer-synthesizer]] — [story.md](specs/03-stories/STORY-022-agente-reverse-engineer-synthesizer/story.md) — Agente reverse-engineer-synthesizer
- [[STORY-023-scope-acotado-focus]] — [story.md](specs/03-stories/STORY-023-scope-acotado-focus/story.md) — Scope acotado: flag `--focus` para reverse-engineering
- [[STORY-024-modo-incremental-update]] — [story.md](specs/03-stories/STORY-024-modo-incremental-update/story.md) — Modo incremental: flag `--update` para reverse-engineering

#### Generadores de épica y story (EPIC-06)

- [[STORY-027-validacion-de-formato-de-release]] — [story.md](specs/03-stories/STORY-027-validacion-de-formato-de-release/story.md) — Validación de formato de release
- [[STORY-028-generar-releases]] — [story.md](specs/03-stories/STORY-028-generar-releases/story.md) — Generar releases desde el project-plan
- [[STORY-029-generar-stories]] — [story.md](specs/03-stories/STORY-029-generar-stories/story.md) — Generar stories desde un archivo de release
- [[STORY-030-soporte-atlassian-rovo]] — [story.md](specs/03-stories/STORY-030-soporte-atlassian-rovo/story.md) — Soporte Atlassian Rovo: agente story-creator *(retirado en plan-13 de EPIC-17)*
- [[STORY-032-soporte-atlassian-rovo-para-validar-release]] — [story.md](specs/03-stories/STORY-032-soporte-atlassian-rovo-para-validar-release/story.md) — Soporte Atlassian Rovo para validar release *(retirado)*
- [[STORY-033-soporte-atlassian-rovo-para-crear-epic-release]] — [story.md](specs/03-stories/STORY-033-soporte-atlassian-rovo-para-crear-epic-release/story.md) — Soporte Atlassian Rovo para crear epic release *(retirado)*
- [[STORY-034-rovo-agent-release-reverse-generator]] — [story.md](specs/03-stories/STORY-034-rovo-agent-release-reverse-generator/story.md) — Rovo agent: release reverse generator desde hijos *(retirado)*
- [[STORY-035-generar-stories-todos-releases]] — [story.md](specs/03-stories/STORY-035-generar-stories-todos-releases/story.md) — Generar stories de todos los releases en batch
- [[STORY-036-openspec-init-config]] — [story.md](specs/03-stories/STORY-036-openspec-init-config/story.md) — Inicializar la configuración de OpenSpec automáticamente
- [[STORY-037-generar-baseline-openspec-inversa]] — [story.md](specs/03-stories/STORY-037-generar-baseline-openspec-inversa/story.md) — Generar línea base de OpenSpec por ingeniería inversa

#### Empaquetado y distribución (EPIC-07 → EPIC-09)

- [[STORY-038-copy-templates-to-skills]] — [story.md](specs/03-stories/STORY-038-copy-templates-to-skills/story.md) — Copiar los templates a los skills correspondientes
- [[STORY-039-publicar-framework-en-npm]] — [story.md](specs/03-stories/STORY-039-publicar-framework-en-npm/story.md) — Publicar el framework en npm
- [[STORY-040-instalar-skills-via-postinstall]] — [story.md](specs/03-stories/STORY-040-instalar-skills-via-postinstall/story.md) — Instalar skills vía script de `postinstall`
- [[STORY-041-npm-install-locally]] — [story.md](specs/03-stories/STORY-041-npm-install-locally/story.md) — Instalación local con npm
- [[STORY-042-readme-builder]] — [story.md](specs/03-stories/STORY-042-readme-builder/story.md) — readme-builder: generación de `README.md`
- [[STORY-043-header-aggregation]] — [story.md](specs/03-stories/STORY-043-header-aggregation/story.md) — header-aggregation: metadata de estado en archivos spec
- [[STORY-044-directorio-docs-tipo-wiki]] — [story.md](specs/03-stories/STORY-044-directorio-docs-tipo-wiki/story.md) — Directorio `docs/` tipo wiki (este índice)
- [[STORY-046-publicar-npm-con-github-actions]] — [story.md](specs/03-stories/STORY-046-publicar-npm-con-github-actions/story.md) — CI/CD con GitHub Actions para publicar en npm
- [[STORY-087-error-in-npm-install-locally]] — [story.md](specs/03-stories/STORY-087-error-in-npm-install-locally/story.md) — `kind: fix` — error de `npm install agile-sddf` en Windows 11

#### Estructura de artefactos y templates (EPIC-10 → EPIC-11)

- [[STORY-047-skills-multicliente-rutas-relativas]] — [story.md](specs/03-stories/STORY-047-skills-multicliente-rutas-relativas/story.md) — Skills con templates multicliente y rutas relativas
- [[STORY-048-refactor-migrates-templates-to-assets]] — [story.md](specs/03-stories/STORY-048-refactor-migrates-templates-to-assets/story.md) — Refactor: migrar templates a `assets/` en los skills
- [[STORY-049-reading-of-sddf-root]] — [story.md](specs/03-stories/STORY-049-reading-of-sddf-root/story.md) — Lectura de `SDDF_ROOT` como ruta base de artefactos
- [[STORY-050-organizar-artefactos-en-directorio-propio]] — [story.md](specs/03-stories/STORY-050-organizar-artefactos-en-directorio-propio/story.md) — Organizar artefactos de spec en un directorio por workitem
- [[STORY-051-crear-release-por-preguntas-guiadas]] — [story.md](specs/03-stories/STORY-051-crear-release-por-preguntas-guiadas/story.md) — Crear un `epic.md` válido por preguntas guiadas
- [[STORY-052-generar-diagrama-contexto-c4]] — [story.md](specs/03-stories/STORY-052-generar-diagrama-contexto-c4/story.md) — Generar un diagrama de contexto C4 del proyecto
- [[STORY-053-centralizar-validacion-entorno-sddf]] — [story.md](specs/03-stories/STORY-053-centralizar-validacion-entorno-sddf/story.md) — Centralizar la validación de entorno con `skill-preflight`
- [[STORY-054-inicializar-entorno-sddf]] — [story.md](specs/03-stories/STORY-054-inicializar-entorno-sddf/story.md) — Inicializar el entorno SDDF con `sddf-init` · `BACKLOG`
- [[STORY-055-centralizar-templates-en-specs-templates]] — [story.md](specs/03-stories/STORY-055-centralizar-templates-en-specs-templates/story.md) — Centralizar templates de spec en directorio compartido
- [[STORY-056-project-policies]] — [story.md](specs/03-stories/STORY-056-project-policies/story.md) — Políticas de proyecto (`constitution.md`, DoD)

#### Story SDD workflow (EPIC-12)

- [[STORY-057-skill-para-diseno]] — [story.md](specs/03-stories/STORY-057-skill-para-diseno/story.md) — Skill de diseño (`story-design`)
- [[STORY-058-skill-para-tasking]] — [story.md](specs/03-stories/STORY-058-skill-para-tasking/story.md) — Skill de tasking (`story-tasking`)
- [[STORY-059-comando-de-analisis-transversal]] — [story.md](specs/03-stories/STORY-059-comando-de-analisis-transversal/story.md) — Análisis transversal (`story-analyze`)
- [[STORY-060-orquestacion-del-plan]] — [story.md](specs/03-stories/STORY-060-orquestacion-del-plan/story.md) — Orquestación del plan (`story-plan`)
- [[STORY-061-skill-de-implementacion-el-programador-autonomo]] — [story.md](specs/03-stories/STORY-061-skill-de-implementacion-el-programador-autonomo/story.md) — Skill de implementación: el programador autónomo (`story-implement`)
- [[STORY-062-status-management-on-workflow]] — [story.md](specs/03-stories/STORY-062-status-management-on-workflow/story.md) — Gestión de estados en el workflow
- [[STORY-063-reutilizar-directorio-como-historia-core]] — [story.md](specs/03-stories/STORY-063-reutilizar-directorio-como-historia-core/story.md) — Reutilizar el directorio original como historia core al dividir
- [[STORY-064-revision-codigo-multi-agente]] — [story.md](specs/03-stories/STORY-064-revision-codigo-multi-agente/story.md) — `story-code-review`: revisión multi-agente del código implementado
- [[STORY-065-revision-con-bloqueantes]] — [story.md](specs/03-stories/STORY-065-revision-con-bloqueantes/story.md) — `story-code-review`: instrucciones de corrección ante bloqueantes
- [[STORY-066-revision-validacion-precondiciones]] — [story.md](specs/03-stories/STORY-066-revision-validacion-precondiciones/story.md) — `story-code-review`: validar artefactos requeridos antes de revisar
- [[STORY-067-story-implement-continuar-parcial]] — [story.md](specs/03-stories/STORY-067-story-implement-continuar-parcial/story.md) — `story-implement`: continuar implementación parcial con fix-directives

#### Quality gates con DoD (EPIC-13)

- [[dod-plan-en-story-analyze]] — [story.md](specs/03-stories/STORY-068-dod-plan-en-story-analyze/story.md) — STORY-068: DoD PLAN en `story-analyze`
- [[dod-IMPLEMENT-en-story-implement]] — [story.md](specs/03-stories/STORY-069-dod-implementing-en-story-implement/story.md) — STORY-069: DoD IMPLEMENT en `story-implement`
- [[dod-code-review-en-story-code-review]] — [story.md](specs/03-stories/STORY-070-dod-code-review-en-story-code-review/story.md) — STORY-070: DoD CODE-REVIEW en `story-code-review` · `READY-FOR-VERIFY`
- [[STORY-071-skill-story-verify]] — [story.md](specs/03-stories/STORY-071-skill-story-verify/story.md) — Skill `story-verify`: orquestar la fase VERIFY · `READY-FOR-CODE-REVIEW`
- [[STORY-072-skill-story-acceptance]] — [story.md](specs/03-stories/STORY-072-skill-story-acceptance/story.md) — Skill `story-acceptance`: validación humana final antes de DELIVER
- [[STORY-073-skill-security-audit-condicional]] — [story.md](specs/03-stories/STORY-073-skill-security-audit-condicional/story.md) — Skill `security-audit`: auditoría de seguridad condicional

#### Integración y entrega (`story-integrate`)

- [[STORY-074-integrar-historia-batch-configurable]] — [story.md](specs/03-stories/STORY-074-integrar-historia-batch-configurable/story.md) — Integración batch configurable de historias · `READY-FOR-IMPLEMENT`
- [[STORY-075-integrar-historia-modo-manual-dryrun]] — [story.md](specs/03-stories/STORY-075-integrar-historia-modo-manual-dryrun/story.md) — Modos de ejecución manual y `--dry-run` · `READY-FOR-IMPLEMENT`
- [[STORY-076-integrar-historia-multi-modelo-entrega]] — [story.md](specs/03-stories/STORY-076-integrar-historia-multi-modelo-entrega/story.md) — Soporte multi-modelo de entrega (batch y continuous) · `READY-FOR-IMPLEMENT`

#### Fábrica de skills y ciclo TDD (EPIC-14 → EPIC-15)

- [[STORY-077-mejorar-historia-desde-reporte]] — [story.md](specs/03-stories/STORY-077-mejorar-historia-desde-reporte/story.md) — `story-improve`: mejora automática de historia desde reporte FINVEST · `IMPLEMENT`
- [[STORY-078-implement-tdd-fase-red]] — [story.md](specs/03-stories/STORY-078-implement-tdd-fase-red/story.md) — `story-implement` fase RED: validar configuración y generar pruebas · `VERIFY`
- [[STORY-079-story-testcases]] — [story.md](specs/03-stories/STORY-079-story-testcases/story.md) — `story-testcases`: generar `testcases.md` desde `story.md` y `design.md`
- [[STORY-080-skills-master]] — [story.md](specs/03-stories/STORY-080-skills-master/story.md) — `skill-master`: modos plan/build e independencia de SDDF · plan en [plan.md](specs/03-stories/STORY-080-skills-master/plan.md)
- [[STORY-081-implement-tdd-fase-green-refactor]] — [story.md](specs/03-stories/STORY-081-implement-tdd-fase-green-refactor/story.md) — `story-implement` fases GREEN y REFACTOR · `VERIFY`
- [[STORY-082-implement-tdd-modos-ejecucion]] — [story.md](specs/03-stories/STORY-082-implement-tdd-modos-ejecucion/story.md) — `story-implement`: modos interactivo y automático del ciclo TDD · `VERIFY`
- [[STORY-083-skill-test-evals]] — [story.md](specs/03-stories/STORY-083-skill-test-evals/story.md) — `skill-test-evals`: generar `evals/evals.json` desde cualquier fuente

#### En planificación (sin `story.md` todavía)

Estos directorios solo tienen documentos de plan, sin frontmatter — se enlazan por ruta:

- STORY-084-skill-verify — [plan-01](specs/03-stories/STORY-084-skill-verify/plan-01.md) · [plan-02](specs/03-stories/STORY-084-skill-verify/plan-02.md) · [plan-03](specs/03-stories/STORY-084-skill-verify/plan-03.md)
- STORY-085-integrar-config-sddf-init — [plan.md](specs/03-stories/STORY-085-integrar-config-sddf-init/plan.md) — Integrar `sddf.config.yaml` en el skill `sddf-init`

### Templates de spec

`specs/templates/` — fuente de verdad de la estructura de los artefactos generados. Su `slug:` es un
placeholder, por lo que se enlazan solo por ruta:

- [project-intent-template.md](specs/templates/project-intent-template.md) — Template de intención de proyecto
- [project-template.md](specs/templates/project-template.md) — Template de especificación de requisitos
- [project-plan-template.md](specs/templates/project-plan-template.md) — Template de plan de proyecto
- [epic-template.md](specs/templates/epic-template.md) — Template de épica
- [story-template.md](specs/templates/story-template.md) — Template de historia de usuario

---

## 📐 Decisiones de arquitectura (docs/adr/)

- [[adr-index]] — [README.md](adr/README.md) — Índice y convención de ADRs (los aceptados son inmutables)
- [[centralizar-templates-compartidos]] — [ADR-0001](adr/ADR-0001-centralizar-templates-compartidos.md) — Centralizar templates compartidos en `$SPECS_BASE/specs/templates/` · `ACCEPTED`
- [[invocacion-agentes-locales-de-skill]] — [ADR-0002](adr/ADR-0002-invocacion-agentes-locales-de-skill.md) — Contrato de invocación de agentes locales de skill · `ACCEPTED`
- [[workflow-canonico-story-y-epic]] — [ADR-0003](adr/ADR-0003-workflow-canonico-story-y-epic.md) — Workflows canónicos de story y épica en el pipeline SDDF · `ACCEPTED`
- [[nivel-l2-epic-y-directorios-numerados]] — [ADR-0004](adr/ADR-0004-nivel-l2-epic-y-directorios-numerados.md) — El nivel L2 es una épica, y los niveles viven en directorios numerados · `ACCEPTED`
- [[prefijo-story-para-el-nivel-l1]] — [ADR-0005](adr/ADR-0005-prefijo-story-para-el-nivel-l1.md) — El ID del nivel L1 se prefija con `STORY`; el tipo vive en el campo `kind` · `ACCEPTED`
- [adr-template.md](adr/adr-template.md) — Template para nuevos ADR (slug placeholder, sin wikilink)

## 📖 Guías y operación

### Guías (docs/guides/)

Las guías se dividen en guides (guías prácticas) y reference (documentación de referencia).

#### Metodología y proceso

- [[sdd]] — [sdd.md](guides/sdd.md) — Spec Driven Development (SDD): fundamentos del método
- [[specs-and-workflows]] — [specs_and_workflows.md](guides/specs_and_workflows.md) — Specs y workflows: contratos, trazabilidad, status y substatus
- [[state-machine]] — [state-machine.md](guides/state-machine.md) — Máquina de estados canónica del framework (story, project, épica) con diagramas Mermaid
- [[sddf-commands-pipeline]] — [sddf-commands-pipeline.md](guides/sddf-commands-pipeline.md) — Flujos principales SDDF: qué skill corre en cada fase
- [[extreme-agile]] — [extreme-agile.md](guides/extreme-agile.md) — Agilidad agéntica (Agentic Agile)
- [[flight-leves-model]] — [flight-leves-model.md](guides/flight-leves-model.md) — Modelo de Niveles de Vuelo (Flight Levels)
- [[branching-strategy-sddf-git-flow]] — [branching-strategy-sddf-git-flow.md](guides/branching-strategy-sddf-git-flow.md) — Modelo de branching SDDF git flow

#### Construcción de skills y agentes

- [[best-practices-for-skills]] — [best-practices-for-skills.md](guides/best-practices-for-skills.md) — Modelo de delegación, patrón `.tmp/<skill>/` y contrato de invocación de agentes locales (ADR-0002)
- [[best-practices-for-agents]] — [best-practices-for-agents.md](guides/best-practices-for-agents.md) — Buenas prácticas para agentes
- [[best-practices-for-commands]] — [best-practices-for-commands.md](guides/best-practices-for-commands.md) — Buenas prácticas para comandos de LLM clients
- [[harness-engineering]] — [harness-engineering.md](guides/harness-engineering.md) — Harness engineering: modelo de delegación y relaciones permitidas
- [[skill-structural-pattern]] — [skill-structural-pattern.md](guides/skill-structural-pattern.md) — Patrones estructurales de skills
- [[best-practices-for-system-prompt]] — [best-practices-for-system-prompt.md](guides/best-practices-for-system-prompt.md) — Mejores prácticas para el prompt de sistema y `AGENTS.md`

#### Testing

- [[best-practices-for-testing]] — [best-practices-for-testing.md](guides/best-practices-for-testing.md) — Pirámide de pruebas y prácticas generales de testing
- [[best-practices-for-skill-testing]] — [best-practices-for-skill-testing.md](guides/best-practices-for-skill-testing.md) — Pruebas de skills: `evals.json`, quality gates

#### Organización de artefactos

- [[organization-of-artifacts]] — [organization-of-artifacts.md](guides/organization-of-artifacts.md) — Reglas de la estrategia de organización de artefactos
- [[artifact-directory-migration]] — [artifact-directory-migration.md](guides/artifact-directory-migration.md) — Guía de migración a la estructura de directorios de artefactos
- [[root-folder-practices]] — [root-folder-practices.md](guides/root-folder-practices.md) — Prácticas de gestión del directorio raíz

> ℹ️ Estas 17 guías se borraron en `cb2e3e7` (2026-08-05) y `63fb587` (2026-08-26) y se restauraron
> desde el historial de `main` el 2026-08-29, con el contenido verbatim. El frontmatter de 6 de ellas
> se completó con `/header-aggregation` ese mismo día; las 18 tienen ahora `slug` único.
> Nota: `specs_and_workflows.md` conserva el nombre de archivo con guiones bajos, pero su slug es
> `specs-and-workflows` (kebab-case, como lo referencia [[workflow-canonico-story-y-epic]]).


### Runbooks (docs/runbooks/)

Los procedimientos, how-to suele ser más general, mientras que los runbooks son más específicos de operaciones (despliegues, recuperación):

- [[runbook-deployment-to-npm]] — [deployment-to-npm.md](runbooks/deployment-to-npm.md) — Runbook de despliegue del paquete en npm · `BACKLOG`
- [[docker-dev-container]] — [docker-dev-container.md](runbooks/docker-dev-container.md) — Entorno de desarrollo con Docker + VSCode Dev Containers · `BACKLOG`
- [docker-dev-container-with-security-scann.md](runbooks/docker-dev-container-with-security-scann.md) — Integrar Skill Shielder en `Dockerfile.dev` (sin frontmatter)

---

## 📊 Estado del grafo

| Métrica | Valor |
|---------|-------|
| Archivos `.md` en `docs/` | 258 |
| Rutas únicas enlazadas desde el índice | 170 |
| — L3 proyecto (4 `.md` + `context-diagram.puml`) | 5 |
| — L2 épicas (19 `epic.md` + 31 `plan-NN.md`) | 50 |
| — L1 historias (76 `story.md` + 5 planes) | 81 |
| — Templates de spec | 5 |
| — ADR (3 + índice + template) | 5 |
| — Políticas | 3 |
| — Guías (18) + runbooks (3) | 21 |
| Artefactos derivados no indexados (`design`, `tasks`, `analyze`, `*-report`, `testcases`) | 88 |
| Wikilinks | 157 |
| Wikilinks rotos (⚠️) | 0 |
| Entradas sin wikilink (archivo sin `slug:` usable) | 13 |
| Última actualización | 2026-08-29 |

---

*Generado por el skill `docs-wiki-builder`. Actualiza con `/docs-wiki-builder --update`.*
