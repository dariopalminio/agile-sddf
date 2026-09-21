---
type: wiki
slug: index
title: "Índice de documentación"
status: IN-PROGRESS
substatus: IN-PROGRESS
parent: null
updated: 2026-09-21
---

# 📚 Índice de documentación

> Este índice es el punto de entrada principal para LLMs y humanos.
> Lee este archivo primero para orientarte antes de abrir cualquier otro nodo.
> Formato de cada entrada: wikilink + link markdown a la ruta relativa + título.
> El slug del wikilink es el declarado en el frontmatter del documento (convención SDDF) o, si no lo
> declara, el derivado del nombre del archivo o del directorio. Cuando un archivo no tiene frontmatter,
> se enlaza solo por ruta. Usa [Foam](https://foambubble.github.io/foam/) para visualizar el grafo.
>
> Generado por `memory-system index`: no edites las entradas a mano, regenera con `/memory-system index`.

---

## ⚖️ Gobernanza (constitución → policies → guardrails)

Tres capas con jerarquía explícita: la **constitución** es el documento supremo; las **policies** la desarrollan en reglas de gobernanza; los **guardrails** la hacen verificable como checklists que bloquean. Ante conflicto, prevalece la constitución.

### Raíz (constitución)

- [[constitution]] — [constitution.md](constitution.md) — Constitución del Proyecto

### Policies (policies/)

- [[policies-index]] — [README.md](policies/README.md) — Índice de Policies

### Guardrails (guardrails/)

- [[guardrails-index]] — [README.md](guardrails/README.md) — Índice de Guardrails
- [[dod-story-checklist]] — [dod-story-checklist.md](guardrails/dod-story-checklist.md) — Definition of Done — Story (transition guardrail)
- [gr-agent-creation-checklist.md](guardrails/gr-agent-creation-checklist.md) — Guardrail: Custom agent creation ⚠️ sin frontmatter
- [gr-ai-security-checklist.md](guardrails/gr-ai-security-checklist.md) — Guardrail: AI security check for agent-facing artefacts ⚠️ sin frontmatter
- [gr-code-security-checklist.md](guardrails/gr-code-security-checklist.md) — Guardrail: Code security check ⚠️ sin frontmatter
- [gr-skill-creation-checklist.md](guardrails/gr-skill-creation-checklist.md) — Guardrail: Agent Skill creation ⚠️ sin frontmatter

---

## 🎯 Producto y requisitos

### Producto (product/)

_(sin artefactos)_

### Requisitos (requirements/)

_(sin artefactos)_

---

## 🗂️ Especificaciones (specs/)

### L3 — Proyecto (specs/01-projects/)

- [[PROJ-01-agile-sddf-project-intent]] — [project-intent.md](specs/01-projects/PROJ-01-agile-sddf/project-intent.md) — Project Intent: Agile SDDF (Spec-Driven Development Framework)
- [[project-plan]] — [project-plan.md](specs/01-projects/PROJ-01-agile-sddf/project-plan.md) — Project Plan
- [[PROJ-01-agile-sddf]] — [project.md](specs/01-projects/PROJ-01-agile-sddf/project.md) — Especificación de Requisitos — Agile SDDF
- [[story-map]] — [story-map.md](specs/01-projects/PROJ-01-agile-sddf/story-map.md) — Story Map — Agile SDDF (Spec-Driven Development Framework)

### L2 — Épicas (specs/02-epics/)

- [[EPIC-00-estructura-base-y-mecanismo-de-templates]] — [epic.md](specs/02-epics/EPIC-00-estructura-base-y-mecanismo-de-templates/epic.md) — Release 00 — Estructura Base y Mecanismo de Templates
- [[EPIC-01-features-spec-builder]] — [epic.md](specs/02-epics/EPIC-01-features-spec-builder/epic.md) — Release 01 — Features Spec Builder
- [[EPIC-02-project-spec-builder]] — [epic.md](specs/02-epics/EPIC-02-project-spec-builder/epic.md) — Release 02 — Project Spec Builder (Pipeline de proyecto)
- [[EPIC-03-reverse-engineering]] — [epic.md](specs/02-epics/EPIC-03-reverse-engineering/epic.md) — Release 03 — Reverse Engineering (Ingeniería inversa)
- [[EPIC-04-refactor-features-spec-builder]] — [epic.md](specs/02-epics/EPIC-04-refactor-features-spec-builder/epic.md) — Release 04 — Refactor Features Spec Builder (Consolidación y calidad)
- [[EPIC-05-enhance-project-spec]] — [epic.md](specs/02-epics/EPIC-05-enhance-project-spec/epic.md) — Release 05 — Enhance Project Spec (Expansión project spec)
- [[EPIC-06-release-and-story-generator]] — [epic.md](specs/02-epics/EPIC-06-release-and-story-generator/epic.md) — Release 06 — Release & Story Generator
- [[EPIC-07-publicacion-framework-npm]] — [epic.md](specs/02-epics/EPIC-07-publicacion-framework-npm/epic.md) — Release 07 — Publicación del Framework SDDF como Paquete NPM
- [[EPIC-08-npm-install-locally]] — [epic.md](specs/02-epics/EPIC-08-npm-install-locally/epic.md) — Release 08 — Npm Install locally
- [[EPIC-09-docs-and-wiki-builders]] — [epic.md](specs/02-epics/EPIC-09-docs-and-wiki-builders/epic.md) — Release 09 — Docs and Wiki builders
- [[EPIC-10-mejora-estructura-artefactos-nuevos-skills]] — [epic.md](specs/02-epics/EPIC-10-mejora-estructura-artefactos-nuevos-skills/epic.md) — Mejora en estructura de artefactos y nuevos skills
- [[EPIC-11-centralizar-templates]] — [epic.md](specs/02-epics/EPIC-11-centralizar-templates/epic.md) — Centralizar templates de spec en directorio compartido
- [[EPIC-12-story-sdd-workflow]] — [epic.md](specs/02-epics/EPIC-12-story-sdd-workflow/epic.md) — Story SDD Workflow - comandos del flujo de story
- [[quality-gates-con-dod-en-story-workflow]] — [epic.md](specs/02-epics/EPIC-13-quality-gates-con-dod-en-story-workflow/epic.md) — Quality Gates con DoD en Story Workflow
- [[fabrica-de-skills]] — [epic.md](specs/02-epics/EPIC-14-fabrica-de-skills/epic.md) — Fábrica de Skills
- [[e2e-capability]] — [epic.md](specs/02-epics/EPIC-15-e2e-capability/epic.md) — Skills de Testing Especializado y E2E Capability
- [[EPIC-16-enhancement-and-security]] — [epic.md](specs/02-epics/EPIC-16-enhancement-and-security/epic.md) — enhancement and security improvements for skills (Safe Enhancement & Fortify Skills)
- [[plan-01-root-folder-selection-to-installer]] — [plan-01-root-folder-selection-to-installer.md](specs/02-epics/EPIC-16-enhancement-and-security/plan-01-root-folder-selection-to-installer.md) — Plan 01: Root Folder Selection for Installer
- [[plan-02-integrate-story-testcases-in-story-plan]] — [plan-02-Integrate-story-testcases-in-story-plan.md](specs/02-epics/EPIC-16-enhancement-and-security/plan-02-Integrate-story-testcases-in-story-plan.md) — Plan 02: Integrate story-testcases in story-plan
- [[plan-03-integrate-story-improve-in-story-specify]] — [plan-03-integrate-story-improve-in-story-specify.md](specs/02-epics/EPIC-16-enhancement-and-security/plan-03-integrate-story-improve-in-story-specify.md) — Plan 03: Integrate story-improve in story-specify
- [[plan-04-add-and-improve-skills-readme]] — [plan-04-add-and-improve-skills-readme.md](specs/02-epics/EPIC-16-enhancement-and-security/plan-04-add-and-improve-skills-readme.md) — Plan 04: Add and Improve Skills README
- [[plan-05-extend-story-code-review-with-testcases]] — [plan-05-extend-story-code-review-with-testcases.md](specs/02-epics/EPIC-16-enhancement-and-security/plan-05-extend-story-code-review-with-testcases.md) — Plan 05: Extender story-code-review con análisis de testcases.md e implement-report.md opcional
- [[plan-06-configure-story-verify-with-config-file]] — [plan-06-configure-story-verify-with-config-file.md](specs/02-epics/EPIC-16-enhancement-and-security/plan-06-configure-story-verify-with-config-file.md) — Plan 06: Configurar story-verify con sddf.config.yaml
- [[remediating-and-improvement]] — [epic.md](specs/02-epics/EPIC-17-remediating-and-improvement/epic.md) — Remediating and Improvement
- [[plan-01-reduction-of-descriptions-context-cost]] — [plan-01-reduction-of-descriptions-context-cost.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-01-reduction-of-descriptions-context-cost.md) — Remediar hallazgo A1 — Reducción de costo de contexto de descriptions — Feature del EPIC-17
- [[plan-02-fix-claude-md]] — [plan-02-fix-claude-md.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-02-fix-claude-md.md) — Corrección de CLAUDE.md — Feature del EPIC-17
- [[plan-03-clean]] — [plan-03-clean.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-03-clean.md) — Limpieza de assets muertos y configuración legacy — Feature del EPIC-17
- [[plan-4-fix-story-code-review]] — [plan-04-fix-story-code-review.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-04-fix-story-code-review.md) — Fix inconsistencia interna en story-code-review — Feature del EPIC-17
- [[plan-5-normalize-skills-frontmatter]] — [plan-05-normalize-skills-frontmatter.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-05-normalize-skills-frontmatter.md) — Normalizar zoo de frontmatter en skills — Feature del EPIC-17
- [[plan-6-centralizar-templates-compartidos]] — [plan-06-centralizar-templates-compartidos.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-06-centralizar-templates-compartidos.md) — Centralizar templates compartidos en `$SPECS_BASE/specs/templates/` — Feature del EPIC-17
- [[plan-7-invocacion-agentes-locales-de-skill]] — [plan-07-invocacion-agentes-locales-de-skill.md.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-07-invocacion-agentes-locales-de-skill.md.md) — Contrato explícito de invocación de agentes locales de skill — Feature del EPIC-17
- [[plan-8-align-the-declared-multi-client-support]] — [plan-08-align-the-declared-multi-client-support.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-08-align-the-declared-multi-client-support.md) — Alinear el soporte multi-cliente declarado con el real — Feature del EPIC-17
- [[plan-09-state-machine-canonical-document]] — [plan-09-state-machine-canonical-document.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-09-state-machine-canonical-document.md) — Documento canónico de la máquina de estados SDDF
- [[plan-10-interactive-subagent-resilience]] — [plan-10-interactive-subagent-resilience.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-10-interactive-subagent-resilience.md) — Resiliencia de entrevistas multivuelta (project-pm como subagente interactivo)
- [[plan-11-fix-instalador-npm]] — [plan-11-fix-instalador-npm.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-11-fix-instalador-npm.md) — Fix instalador npm — quitar prompt de postinstall y agregar --force para upgrades
- [[plan-12-centralize-preflight-paragraph]] — [plan-12-centralize-preflight-paragraph.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-12-centralize-preflight-paragraph.md) — Centralizar párrafo de preflight (STORY-053)
- [[plan-13-remove-gem-and-rovo]] — [plan-13-remove-gem-and-rovo.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-13-remove-gem-and-rovo.md) — Eliminar gem/ y rovo/ (STORY-054)
- [[plan-14-evals-standardization]] — [plan-14-evals-standardization.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-14-evals-standardization.md) — Estandarización del esquema de evals.json (STORY-055)
- [[plan-15-improve-invocation-in-story-implement]] — [plan-15-improve-invocation-in-story-implement.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-15-improve-invocation-in-story-implement.md) — Formalización de la invocación de code_generators en story-implement (ADR-0002)
- [[plan-16-agnostic-framework]] — [plan-16-agnostic-framework.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-16-agnostic-framework.md) — Desacoplar referencias `.claude/` de los skills SDDF (STORY-056)
- [[plan-17-generates-evals]] — [plan-17-generates-evals.md](specs/02-epics/EPIC-17-remediating-and-improvement/plan-17-generates-evals.md) — Generar evals/evals.json para dos skills (STORY-057)
- [[workflow-hardening]] — [epic.md](specs/02-epics/EPIC-18-workflow-hardening/epic.md) — Workflow Hardening — Robustecer el flujo de Story y Release
- [[plan-01-deliver-status]] — [plan-01-deliver-status.md](specs/02-epics/EPIC-18-workflow-hardening/plan-01-deliver-status.md) — Renombrar INTEGRATION → DELIVER en el workflow de story
- [[plan-02-epic-workflow-definition]] — [plan-02-epic-workflow-definition.md](specs/02-epics/EPIC-18-workflow-hardening/plan-02-epic-workflow-definition.md) — Definir workflow canónico de Épica/Release
- [[plan-03-lazy-assignment-of-feat-ids]] — [plan-03-lazy-assignment-of-feat-ids.md](specs/02-epics/EPIC-18-workflow-hardening/plan-03-lazy-assignment-of-feat-ids.md) — Asignación lazy de FEAT IDs (dos fases)
- [[plan-04-doc-story-implement]] — [plan-04-doc-story-implement.md](specs/02-epics/EPIC-18-workflow-hardening/plan-04-doc-story-implement.md) — Mejorar documentación de story-implement
- [[plan-05-enhance-code-review]] — [plan-05-enhance-code-review.md](specs/02-epics/EPIC-18-workflow-hardening/plan-05-enhance-code-review.md) — Incorporar mejoras a `story-code-review`
- [[plan-06-isolate-workspace-by-story]] — [plan-06-isolate-workspace-by-story.md](specs/02-epics/EPIC-18-workflow-hardening/plan-06-isolate-workspace-by-story.md) — Aislar espacio de trabajo por historia
- [[plan-07-fix_code_generators_of_story-implement]] — [plan-07-fix_code_generators_of_story-implement.md](specs/02-epics/EPIC-18-workflow-hardening/plan-07-fix_code_generators_of_story-implement.md) — Corregir desincronización en code_generators de story-implement
- [[plan-08-move-skills-to-the-root]] — [plan-08-move-skills-to-the-root.md](specs/02-epics/EPIC-18-workflow-hardening/plan-08-move-skills-to-the-root.md) — Actualizar rutas de origen tras mover `skills/` y `agents/` a la raíz
- [[EPIC-19-framework-consistency]] — [epic.md](specs/02-epics/EPIC-19-framework-consistency/epic.md) — Framework Consistency — Coherencia de vocabulario, instalación, seguridad y ciclo de corrección
- [[EPIC-20-memory-system]] — [epic.md](specs/02-epics/EPIC-20-memory-system/epic.md) — Memory System — Sistema de memoria unificado y agnóstico al harness

### L1 — Historias de usuario (specs/03-stories/)

> **Convención de directorio:** cada `STORY-NNN-*/` contiene `story.md` como nodo principal y, según la
> fase alcanzada, puede contener además `analyze.md`, `design.md`, `tasks.md`, `testcases.md`,
> `*-report.md`, `fix-directives.md` o `finvest-evaluation-report.md`. Esos artefactos derivados no se
> enumeran aquí: se leen desde el directorio de la historia. Los templates (`templates/`) tampoco se
> listan porque sus wikilinks son placeholders.

- [[STORY-001-project-begin]] — [story.md](specs/03-stories/STORY-001-project-begin/story.md) — project-begin � Captura de intenci�n inicial del proyecto
- [[STORY-003-project-discovery]] — [story.md](specs/03-stories/STORY-003-project-discovery/story.md) — project-discovery � Discovery de usuarios y especificaci�n de requisitos
- [[STORY-004-project-planning]] — [story.md](specs/03-stories/STORY-004-project-planning/story.md) — project-planning � Planificaci�n de releases y backlog
- [[STORY-005-project-story-mapping]] — [story.md](specs/03-stories/STORY-005-project-story-mapping/story.md) — project-story-mapping � User Story Mapping seg�n Jeff Patton
- [[STORY-006-story-creation]] — [story.md](specs/03-stories/STORY-006-story-creation/story.md) — story-creation � Crear historias de usuario
- [[STORY-007-story-evaluation]] — [story.md](specs/03-stories/STORY-007-story-evaluation/story.md) — story-evaluation ó Evaluación FINVEST de historias
- [[STORY-008-control-wip]] — [story.md](specs/03-stories/STORY-008-control-wip/story.md) — Control WIP=1 � Detecci�n de proyecto activo
- [[STORY-010-gates-de-revision]] — [story.md](specs/03-stories/STORY-010-gates-de-revision/story.md) — Gates de Revisi�n Humana entre fases del pipeline
- [[STORY-011-project-planning-mejorado]] — [story.md](specs/03-stories/STORY-011-project-planning-mejorado/story.md) — project-planning mejorado � Integraci�n con story mapping
- [[STORY-012-story-split]] — [story.md](specs/03-stories/STORY-012-story-split/story.md) — story-split ó Dividir ópicas en historias pequeóas
- [[STORY-013-story-refine]] — [story.md](specs/03-stories/STORY-013-story-refine/story.md) — story-refine � Refinamiento iterativo de historias de usuario
- [[STORY-015-project-flow]] — [story.md](specs/03-stories/STORY-015-project-flow/story.md) — project-flow � Orquestador del pipeline completo ProjectSpecFactory
- [[STORY-017-reverse-engineering]] — [story.md](specs/03-stories/STORY-017-reverse-engineering/story.md) — reverse-engineering � Skill orquestador de ingenier�a inversa
- [[STORY-018-agente-reverse-engineer-architect]] — [story.md](specs/03-stories/STORY-018-agente-reverse-engineer-architect/story.md) — Agente reverse-engineer-architect
- [[STORY-019-agente-reverse-engineer-product-discovery]] — [story.md](specs/03-stories/STORY-019-agente-reverse-engineer-product-discovery/story.md) — Agente reverse-engineer-product-discovery
- [[STORY-020-agente-reverse-engineer-business-analyst]] — [story.md](specs/03-stories/STORY-020-agente-reverse-engineer-business-analyst/story.md) — Agente reverse-engineer-business-analyst
- [[STORY-021-agente-reverse-engineer-ux-flow-mapper]] — [story.md](specs/03-stories/STORY-021-agente-reverse-engineer-ux-flow-mapper/story.md) — Agente reverse-engineer-ux-flow-mapper
- [[STORY-022-agente-reverse-engineer-synthesizer]] — [story.md](specs/03-stories/STORY-022-agente-reverse-engineer-synthesizer/story.md) — Agente reverse-engineer-synthesizer
- [[STORY-023-scope-acotado-focus]] — [story.md](specs/03-stories/STORY-023-scope-acotado-focus/story.md) — Scope acotado � Flag --focus para reverse-engineering
- [[STORY-024-modo-incremental-update]] — [story.md](specs/03-stories/STORY-024-modo-incremental-update/story.md) — Modo incremental � Flag --update para reverse-engineering
- [[STORY-027-validacion-de-formato-de-release]] — [story.md](specs/03-stories/STORY-027-validacion-de-formato-de-release/story.md) — Validaci�n de formato de Release
- [[STORY-028-generar-releases]] — [story.md](specs/03-stories/STORY-028-generar-releases/story.md) — Generar releases desde project-plan
- [[STORY-029-generar-stories]] — [story.md](specs/03-stories/STORY-029-generar-stories/story.md) — Generar stories desde archivo de release
- [[STORY-030-soporte-atlassian-rovo]] — [story.md](specs/03-stories/STORY-030-soporte-atlassian-rovo/story.md) — Soporte Atlassian Rovo � Agente story-creator
- [[STORY-032-soporte-atlassian-rovo-para-validar-release]] — [story.md](specs/03-stories/STORY-032-soporte-atlassian-rovo-para-validar-release/story.md) — Soporte Atlassian Rovo para Validar Release
- [[STORY-033-soporte-atlassian-rovo-para-crear-epic-release]] — [story.md](specs/03-stories/STORY-033-soporte-atlassian-rovo-para-crear-epic-release/story.md) — Soporte Atlassian Rovo para crear Epic Release
- [[STORY-034-rovo-agent-release-reverse-generator]] — [story.md](specs/03-stories/STORY-034-rovo-agent-release-reverse-generator/story.md) — Rovo Agent Release Reverse Generator from children
- [[STORY-035-generar-stories-todos-releases]] — [story.md](specs/03-stories/STORY-035-generar-stories-todos-releases/story.md) — Generar stories de todos los releases en batch
- [[STORY-036-openspec-init-config]] — [story.md](specs/03-stories/STORY-036-openspec-init-config/story.md) — Inicializar configuraci�n de OpenSpec autom�ticamente
- [[STORY-037-generar-baseline-openspec-inversa]] — [story.md](specs/03-stories/STORY-037-generar-baseline-openspec-inversa/story.md) — Generar l�nea base de OpenSpec mediante ingenier�a inversa
- [[STORY-038-copy-templates-to-skills]] — [story.md](specs/03-stories/STORY-038-copy-templates-to-skills/story.md) — Copiar los templates a los skills correspondientes
- [[STORY-039-publicar-framework-en-npm]] — [story.md](specs/03-stories/STORY-039-publicar-framework-en-npm/story.md) — Publicar framework en npm
- [[STORY-040-instalar-skills-via-postinstall]] — [story.md](specs/03-stories/STORY-040-instalar-skills-via-postinstall/story.md) — Instalar skills via postinstall (script)
- [[STORY-041-npm-install-locally]] — [story.md](specs/03-stories/STORY-041-npm-install-locally/story.md) — Npm Install locally
- [[STORY-042-readme-builder]] — [story.md](specs/03-stories/STORY-042-readme-builder/story.md) — README.md builder
- [[STORY-043-header-aggregation]] — [story.md](specs/03-stories/STORY-043-header-aggregation/story.md) — Encabezado de archivos spec con metadata de estado (header-aggregation)
- [[STORY-044-directorio-docs-tipo-wiki]] — [story.md](specs/03-stories/STORY-044-directorio-docs-tipo-wiki/story.md) — Directorio docs tipo wiki
- [[STORY-046-publicar-npm-con-github-actions]] — [story.md](specs/03-stories/STORY-046-publicar-npm-con-github-actions/story.md) — GitHub Actions CI/CD
- [[STORY-047-skills-multicliente-rutas-relativas]] — [story.md](specs/03-stories/STORY-047-skills-multicliente-rutas-relativas/story.md) — Skills con templates Multicliente
- [[STORY-048-refactor-migrates-templates-to-assets]] — [story.md](specs/03-stories/STORY-048-refactor-migrates-templates-to-assets/story.md) — Refactoring - Migraci�n de templates a assets en Skills
- [[STORY-049-reading-of-sddf-root]] — [story.md](specs/03-stories/STORY-049-reading-of-sddf-root/story.md) — Lectura de SDDF_ROOT como ruta base de artefactos en skills SDDF
- [[STORY-050-organizar-artefactos-en-directorio-propio]] — [story.md](specs/03-stories/STORY-050-organizar-artefactos-en-directorio-propio/story.md) — Organizar artefactos de spec en directorios propios por workitem
- [[STORY-051-crear-release-por-preguntas-guiadas]] — [story.md](specs/03-stories/STORY-051-crear-release-por-preguntas-guiadas/story.md) — Crear un release.md válido respondiendo preguntas guiadas por el template
- [[STORY-052-generar-diagrama-contexto-c4]] — [story.md](specs/03-stories/STORY-052-generar-diagrama-contexto-c4/story.md) — Generar un diagrama de contexto C4 del proyecto respondiendo preguntas o desde specs
- [[STORY-053-centralizar-validacion-entorno-sddf]] — [story.md](specs/03-stories/STORY-053-centralizar-validacion-entorno-sddf/story.md) — Centralizar la validación de entorno SDDF con skill-preflight
- [[STORY-054-inicializar-entorno-sddf]] — [story.md](specs/03-stories/STORY-054-inicializar-entorno-sddf/story.md) — Inicializar entorno SDDF con sddf-init
- [[STORY-055-centralizar-templates-en-specs-templates]] — [story.md](specs/03-stories/STORY-055-centralizar-templates-en-specs-templates/story.md) — Centralizar templates de spec en directorio compartido
- [[STORY-056-project-policies]] — [story.md](specs/03-stories/STORY-056-project-policies/story.md) — Project policies
- [[STORY-057-skill-para-diseno]] — [story.md](specs/03-stories/STORY-057-skill-para-diseno/story.md) — Skill para Diseño (story-design)
- [[STORY-058-skill-para-tasking]] — [story.md](specs/03-stories/STORY-058-skill-para-tasking/story.md) — Skill para Tasking (story-tasking)
- [[STORY-059-comando-de-analisis-transversal]] — [story.md](specs/03-stories/STORY-059-comando-de-analisis-transversal/story.md) — Comando de análisis transversal (story-analyze)
- [[STORY-060-orquestacion-del-plan]] — [story.md](specs/03-stories/STORY-060-orquestacion-del-plan/story.md) — Orquestación del plan (story-plan)
- [[STORY-061-skill-de-implementacion-el-programador-autonomo]] — [story.md](specs/03-stories/STORY-061-skill-de-implementacion-el-programador-autonomo/story.md) — Skill de implementación — El programador autónomo (story-implement)
- [[STORY-062-status-management-on-workflow]] — [story.md](specs/03-stories/STORY-062-status-management-on-workflow/story.md) — Status Management on Workflow
- [[STORY-063-reutilizar-directorio-como-historia-core]] — [story.md](specs/03-stories/STORY-063-reutilizar-directorio-como-historia-core/story.md) — Reutilizar directorio original como historia core al dividir
- [[STORY-064-revision-codigo-multi-agente]] — [story.md](specs/03-stories/STORY-064-revision-codigo-multi-agente/story.md) — Skill story-code-review: revisión multi-agente aprobada del código implementado
- [[STORY-065-revision-con-bloqueantes]] — [story.md](specs/03-stories/STORY-065-revision-con-bloqueantes/story.md) — Skill story-code-review: instrucciones de corrección cuando la revisión detecta bloqueantes
- [[STORY-066-revision-validacion-precondiciones]] — [story.md](specs/03-stories/STORY-066-revision-validacion-precondiciones/story.md) — Skill story-code-review: validación de artefactos requeridos antes de revisar
- [[STORY-067-story-implement-continuar-parcial]] — [story.md](specs/03-stories/STORY-067-story-implement-continuar-parcial/story.md) — skill story-implement: continuar implementación parcial con tareas pendientes y fix-directives
- [[dod-plan-en-story-analyze]] — [story.md](specs/03-stories/STORY-068-dod-plan-en-story-analyze/story.md) — DoD PLAN en story-analyze
- [[dod-IMPLEMENT-en-story-implement]] — [story.md](specs/03-stories/STORY-069-dod-implementing-en-story-implement/story.md) — DoD IMPLEMENT en story-implement
- [[dod-code-review-en-story-code-review]] — [story.md](specs/03-stories/STORY-070-dod-code-review-en-story-code-review/story.md) — DoD CODE-REVIEW en story-code-review
- [[STORY-071-skill-story-verify]] — [story.md](specs/03-stories/STORY-071-skill-story-verify/story.md) — Skill story-verify: Orquestar la fase VERIFY de pruebas de una historia
- [[STORY-072-skill-story-acceptance]] — [story.md](specs/03-stories/STORY-072-skill-story-acceptance/story.md) — Skill story-acceptance: Validación final humana de criterios de aceptación antes de DELIVER
- [[STORY-073-skill-security-audit-condicional]] — [story.md](specs/03-stories/STORY-073-skill-security-audit-condicional/story.md) — Construir skill `security-audit` para auditoría automática condicional de seguridad
- [[STORY-074-integrar-historia-batch-configurable]] — [story.md](specs/03-stories/STORY-074-integrar-historia-batch-configurable/story.md) — story-integrate: Integración batch configurable de historias
- [[STORY-075-integrar-historia-modo-manual-dryrun]] — [story.md](specs/03-stories/STORY-075-integrar-historia-modo-manual-dryrun/story.md) — story-integrate: Modos de ejecución manual y dry-run
- [[STORY-076-integrar-historia-multi-modelo-entrega]] — [story.md](specs/03-stories/STORY-076-integrar-historia-multi-modelo-entrega/story.md) — story-integrate: Soporte multi-modelo de entrega (batch y continuous)
- [[STORY-077-mejorar-historia-desde-reporte]] — [story.md](specs/03-stories/STORY-077-mejorar-historia-desde-reporte/story.md) — story-improve: Mejora automática de historia desde reporte FINVEST
- [[STORY-078-implement-tdd-fase-red]] — [story.md](specs/03-stories/STORY-078-implement-tdd-fase-red/story.md) — story-implement — Fase RED: validar configuración y generar pruebas
- [[STORY-079-story-testcases]] — [story.md](specs/03-stories/STORY-079-story-testcases/story.md) — story-testcases — generación de testcases.md desde story.md y design.md
- [plan.md](specs/03-stories/STORY-080-skills-master/plan.md) — plan ⚠️ sin frontmatter
- [[STORY-080-skills-master]] — [story.md](specs/03-stories/STORY-080-skills-master/story.md) — skill-master — refactorización de skill-tester-eval: modos plan/build, detección de lenguaje natural e independencia SDDF
- [[STORY-081-implement-tdd-fase-green-refactor]] — [story.md](specs/03-stories/STORY-081-implement-tdd-fase-green-refactor/story.md) — story-implement — Fases GREEN y REFACTOR: implementar código y refactorizar
- [[STORY-082-implement-tdd-modos-ejecucion]] — [story.md](specs/03-stories/STORY-082-implement-tdd-modos-ejecucion/story.md) — story-implement — modos interactivo y automático de ejecución del ciclo TDD
- [[STORY-083-skill-test-evals]] — [story.md](specs/03-stories/STORY-083-skill-test-evals/story.md) — skill-test-evals — generación de evals/evals.json para skills desde cualquier fuente
- [plan-01.md](specs/03-stories/STORY-084-skill-verify/plan-01.md) — Plan: Crear el skill skill-verify ⚠️ sin frontmatter
- [plan-02.md](specs/03-stories/STORY-084-skill-verify/plan-02.md) — Plan: Añadir modo benchmark a skill-verify ⚠️ sin frontmatter
- [plan-03.md](specs/03-stories/STORY-084-skill-verify/plan-03.md) — plan-03 ⚠️ sin frontmatter
- [[STORY-084-skill-verify]] — [story.md](specs/03-stories/STORY-084-skill-verify/story.md) — Unificar generación, ejecución y benchmark de evals en `skill-test-evals`
- [plan.md](specs/03-stories/STORY-085-integrar-config-sddf-init/plan.md) — Plan: Integrar sddf.config.yaml en el skill sddf-init ⚠️ sin frontmatter
- [[STORY-085-integrar-config-sddf-init]] — [story.md](specs/03-stories/STORY-085-integrar-config-sddf-init/story.md) — Mejora de experiencia de inicialización
- [plan-01-refactor-release-to-epic.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-01-refactor-release-to-epic.md) — PLAN: Renombrar el nivel L2 de `release` a `epic` ⚠️ sin frontmatter
- [plan-02-refactor-dev-levels.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-02-refactor-dev-levels.md) — PLAN: Reestructurar `docs/specs/` a niveles numerados (`01-projects/`, `02-epics/`, `03-stories/`) ⚠️ sin frontmatter
- [plan-03-refactor-feat-to-story.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-03-refactor-feat-to-story.md) — PLAN: Renombrar el prefijo de historias de `FEAT-NNN` a `STORY-NNN` ⚠️ sin frontmatter
- [plan-04-fix-insights.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-04-fix-insights.md) — Cierre de la migración release→epic / FEAT→STORY: alinear gate, evals y documentación normativa ⚠️ sin frontmatter
- [plan-05-findings-and-remediation-plan.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-05-findings-and-remediation-plan.md) — Revisión de STORY-086 — hallazgos y plan de remediación ⚠️ sin frontmatter
- [plan-06-update-project.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-06-update-project.md) — Plan — Reescribir `project.md` contra la realidad + runbook del proceso ⚠️ sin frontmatter
- [[STORY-086-refactor-release-to-epic]] — [story.md](specs/03-stories/STORY-086-refactor-release-to-epic/story.md) — Renombrar el nivel L2 de release a épica y numerar los directorios de specs
- [[STORY-087-error-in-npm-install-locally]] — [story.md](specs/03-stories/STORY-087-error-in-npm-install-locally/story.md) — Error en instalaci�n local de npm install agile-sddf en Windows 11
- [plan-01-decouple-security-audit.md](specs/03-stories/STORY-088-security-enhancement/plan-01-decouple-security-audit.md) — Desacoplar `story-code-review` del skill `security-audit` ⚠️ sin frontmatter
- [plan-02-security.md](specs/03-stories/STORY-088-security-enhancement/plan-02-security.md) — plan-02-security ⚠️ sin frontmatter
- [plan-04-fix-security-insights.md](specs/03-stories/STORY-088-security-enhancement/plan-04-fix-security-insights.md) — Cerrar los 8 hallazgos `(warn)` del `ai-security-checklist` ⚠️ sin frontmatter
- [[STORY-088-security-enhancement]] — [story.md](specs/03-stories/STORY-088-security-enhancement/story.md) — Mejoras de seguridad
- [plan.md](specs/03-stories/STORY-089-rechazo-nombra-ejecutor-correcciones/plan.md) — STORY-089 — Análisis y propuesta de cambio ⚠️ sin frontmatter
- [[STORY-089-rechazo-nombra-ejecutor-correcciones]] — [story.md](specs/03-stories/STORY-089-rechazo-nombra-ejecutor-correcciones/story.md) — Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md
- [[STORY-090-campos-declarados-nombran-su-escritor]] — [story.md](specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/story.md) — Todo campo declarado en un template nombra a su escritor
- [[STORY-091-story-implement-modo-rework]] — [story.md](specs/03-stories/STORY-091-story-implement-modo-rework/story.md) — story-implement toma de la cola una historia rechazada y corrige en modo rework
- [[STORY-092-reglas-robustez-modo-rework]] — [story.md](specs/03-stories/STORY-092-reglas-robustez-modo-rework/story.md) — El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro
- [[STORY-093-raiz-configurable-preflight-diagnostico]] — [story.md](specs/03-stories/STORY-093-raiz-configurable-preflight-diagnostico/story.md) — Resolver una raíz configurable y usar preflight como diagnóstico
- [insights.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/insights.md) — insights ⚠️ sin frontmatter
- [plan-01-fix-ci-security-audit.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-01-fix-ci-security-audit.md) — Plan 01 — Corregir la cobertura y el fallo de la CI de seguridad ⚠️ sin frontmatter
- [plan-02-fix-postinstall-target-validation.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-02-fix-postinstall-target-validation.md) — Plan 02 — Cerrar el traversal de `SDDF_TARGET` en `postinstall` ⚠️ sin frontmatter
- [plan-03-fix-evals-runner-false-greens.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-03-fix-evals-runner-false-greens.md) — Plan 03 — Cerrar falsos verdes del runner de evals ⚠️ sin frontmatter
- [plan-04-cerrar-hallazgos-pendientes-auditoria.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-04-cerrar-hallazgos-pendientes-auditoria.md) — Plan 04 — Cerrar los hallazgos pendientes de la auditoría ⚠️ sin frontmatter
- [plan-05-move-dod-story.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-05-move-dod-story.md) — Mover `dod-story.md` de `policies/` a `guardrails/dod-story-checklist.md` ⚠️ sin frontmatter
- [plan-06-constitution-as-root-in-docs.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-06-constitution-as-root-in-docs.md) — Constitución como raíz: mover `docs/policies/constitution.md` → `docs/constitution.md` ⚠️ sin frontmatter
- [[STORY-094-refactory-and-fixing-insights]] — [story.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/story.md) — Fix insight and Verificación de la instalación en Windows, macOS y Linux
- [[STORY-095-memory-system-index-alias]] — [story.md](specs/03-stories/STORY-095-memory-system-index-alias/story.md) — Crear el skill memory-system con el modo index y deprecar docs-wiki-builder
- [[STORY-096-memory-system-scaffold-ensure-rebuild]] — [story.md](specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/story.md) — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild
- [[STORY-097-memory-system-check-ci]] — [story.md](specs/03-stories/STORY-097-memory-system-check-ci/story.md) — Verificar la consistencia de la memoria con un modo check apto para CI
- [[STORY-098-memory-system-migrate-harness]] — [story.md](specs/03-stories/STORY-098-memory-system-migrate-harness/story.md) — Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate
- [[STORY-099-sddf-init-level-full]] — [story.md](specs/03-stories/STORY-099-sddf-init-level-full/story.md) — Inicializar la memoria completa desde sddf-init con el parámetro --level

---

## 🧭 Dominio y arquitectura

### Dominios (domains/)

- [README.md](domains/README.md) — Documentación de Dominios — Framework SDDF ⚠️ sin frontmatter
- [domain-epic-lifecycle.md](domains/domain-epic-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Epic (Epic Lifecycle) ⚠️ sin frontmatter
- [domain-knowledge-artifacts.md](domains/domain-knowledge-artifacts.md) — Documentación del Dominio: Artefactos de Conocimiento (Knowledge Artifacts) ⚠️ sin frontmatter
- [domain-project-lifecycle.md](domains/domain-project-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Project (Project Lifecycle) ⚠️ sin frontmatter
- [domain-skills-map.md](domains/domain-skills-map.md) — domain-skills-map ⚠️ sin frontmatter
- [domain-state-management.md](domains/domain-state-management.md) — Documentación del Dominio: Gestión de Estados (State Management) ⚠️ sin frontmatter
- [domain-story-lifecycle.md](domains/domain-story-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Story (Story Lifecycle) ⚠️ sin frontmatter
- [domain-work-item-hierarchy.md](domains/domain-work-item-hierarchy.md) — Documentación del Dominio: Jerarquía de Work Items (Work Item Hierarchy) ⚠️ sin frontmatter
- [[domain]] — [domain.md](domains/domain.md) — Agile SDDF — Contexto de dominio

### Arquitectura (architecture/)

- [[architecture-index]] — [README.md](architecture/README.md) — Índice de arquitectura del framework SDDF
- [[memory-system]] — [memory-system.md](architecture/memory-system.md) — Sistema de Memoria del Framework SDDF
- [sddf-architecture.md](architecture/sddf-architecture.md) — Arquitectura del Framework SDDF ⚠️ sin frontmatter
- [tech-stack.md](architecture/tech-stack.md) — Stack Tecnológico SDDF ⚠️ sin frontmatter

### Decisiones de arquitectura (adr/)

- [[centralizar-templates-compartidos]] — [ADR-0001-centralizar-templates-compartidos.md](adr/ADR-0001-centralizar-templates-compartidos.md) — Centralizar templates compartidos en $SPECS_BASE/specs/templates/
- [[invocacion-agentes-locales-de-skill]] — [ADR-0002-invocacion-agentes-locales-de-skill.md](adr/ADR-0002-invocacion-agentes-locales-de-skill.md) — Contrato de invocación de agentes locales de skill
- [[workflow-canonico-story-y-epic]] — [ADR-0003-workflow-canonico-story-y-epic.md](adr/ADR-0003-workflow-canonico-story-y-epic.md) — Workflows canónicos de Story y Epic en el pipeline SDDF
- [[nivel-l2-epic-y-directorios-numerados]] — [ADR-0004-nivel-l2-epic-y-directorios-numerados.md](adr/ADR-0004-nivel-l2-epic-y-directorios-numerados.md) — El nivel L2 es una épica, y los niveles viven en directorios numerados
- [[prefijo-story-para-el-nivel-l1]] — [ADR-0005-prefijo-story-para-el-nivel-l1.md](adr/ADR-0005-prefijo-story-para-el-nivel-l1.md) — El ID del nivel L1 se prefija con STORY; el tipo de trabajo vive en el campo kind
- [[migracion-retroactiva-de-estados-de-epica]] — [ADR-0006-migracion-retroactiva-de-estados-de-epica.md](adr/ADR-0006-migracion-retroactiva-de-estados-de-epica.md) — Workflows canónicos de Story y Epic, con migración retroactiva de los estados históricos
- [[templates-como-capa-propia]] — [ADR-0007-templates-como-capa-propia.md](adr/ADR-0007-templates-como-capa-propia.md) — Los templates son una capa propia, hermana de specs/
- [[rework-sin-estado-propio]] — [ADR-0008-rework-sin-estado-propio.md](adr/ADR-0008-rework-sin-estado-propio.md) — Rework sin estado propio: la señal es el artefacto de fallo
- [[perfiles-runtimes-e-instalacion-explicita]] — [ADR-0009-perfiles-runtimes-e-instalacion-explicita.md](adr/ADR-0009-perfiles-runtimes-e-instalacion-explicita.md) — Perfiles reproducibles, runtimes canónicos e instalación explícita
- [[specs-dentro-de-docs]] — [ADR-0010-specs-dentro-de-docs.md](adr/ADR-0010-specs-dentro-de-docs.md) — Mantener specs/ dentro de docs/ en lugar de la raíz
- [[adr-index]] — [README.md](adr/README.md) — Índice de Architecture Decision Records (ADRs)
- [adr-template.md](adr/adr-template.md) — <Título de la decisión> ⚠️ slug placeholder

---

## 📖 Guías y operación

### Guías (guides/)

- [[guides-index]] — [README.md](guides/README.md) — Índice de Guías
- [agent-harness-guide.md](guides/agent-harness-guide.md) — Guía de Agent Harness ⚠️ sin frontmatter
- [[artifact-directory-migration]] — [artifact-directory-migration.md](guides/artifact-directory-migration.md) — Guía de migración — nueva estructura de directorios de artefactos SDDF
- [[best-practices-for-agents]] — [best-practices-for-agents.md](guides/best-practices-for-agents.md) — Buenas prácticas para Agentes
- [[best-practices-for-commands]] — [best-practices-for-commands.md](guides/best-practices-for-commands.md) — Buenas prácticas para LLM Clients: Comandos
- [[best-practices-for-skill-testing]] — [best-practices-for-skill-testing.md](guides/best-practices-for-skill-testing.md) — Pruebas de skills
- [[best-practices-for-skills]] — [best-practices-for-skills.md](guides/best-practices-for-skills.md) — Buenas prácticas para LLM Clients: Skills
- [[best-practices-for-system-prompt]] — [best-practices-for-system-prompt.md](guides/best-practices-for-system-prompt.md) — Mejores prácticas para el prompt de sistema
- [[best-practices-for-testing]] — [best-practices-for-testing.md](guides/best-practices-for-testing.md) — Mejores Prácticas para Pruebas de Software
- [[branching-strategy-sddf-git-flow]] — [branching-strategy-sddf-git-flow.md](guides/branching-strategy-sddf-git-flow.md) — Modelo de Branching SDDF git flow
- [custom-agent-creation-guide.md](guides/custom-agent-creation-guide.md) — Guía de Creación de Custom Agents ⚠️ sin frontmatter
- [custom-skill-creation-guide.md](guides/custom-skill-creation-guide.md) — Guía de Creación de Skills Personalizados ⚠️ sin frontmatter
- [custom-system-prompt-guide.md](guides/custom-system-prompt-guide.md) — Guía para la creación de System Prompts (AGENTS.md, CLAUDE.md, etc.) ⚠️ sin frontmatter
- [[extreme-agile]] — [extreme-agile.md](guides/extreme-agile.md) — Agilidad Agentica (Agentic Agile)
- [[flight-leves-model]] — [flight-leves-model.md](guides/flight-leves-model.md) — Modelo de Niveles de Vuelo (Flight Levels Model)
- [[harness-engineering]] — [harness-eng-agents-orchestration.md](guides/harness-eng-agents-orchestration.md) — Harness Engineering: Orquestación de Skills y Agentes en Claude Code
- [harness-engineering-guide.md](guides/harness-engineering-guide.md) — Guía de Harness Engineering ⚠️ sin frontmatter
- [[organization-of-artifacts]] — [organization-of-artifacts.md](guides/organization-of-artifacts.md) — Reglas de la estrategia de organización de artefactos (SDDF)
- [[root-folder-practices]] — [root-folder-practices.md](guides/root-folder-practices.md) — Prácticas para resolver la raíz de artefactos SDDF
- [[sdd]] — [sdd.md](guides/sdd.md) — Spec Driven Development (SDD)
- [[sddf-commands-pipeline]] — [sddf-commands-pipeline.md](guides/sddf-commands-pipeline.md) — Flujos principales SDDF
- [[skill-structural-pattern]] — [skill-structural-pattern.md](guides/skill-structural-pattern.md) — Patrones estructurales de Skills (Skill Structural patterns)

### Runbooks (runbooks/)

- [[runbook-actualizar-spec-de-proyecto]] — [actualizar-spec-de-proyecto.md](runbooks/actualizar-spec-de-proyecto.md) — Runbook para actualizar la especificación de proyecto (project.md)
- [[runbook-deployment-to-npm]] — [deployment-to-npm.md](runbooks/deployment-to-npm.md) — Runbook para despliegue en npm
- [docker-dev-container-with-security-scann.md](runbooks/docker-dev-container-with-security-scann.md) — Integrar Skill Shielder en Dockerfile.dev ⚠️ sin frontmatter
- [[docker-dev-container]] — [docker-dev-container.md](runbooks/docker-dev-container.md) — Guía Completa: Entorno de Desarrollo React con Docker + VSCode Dev Containers

---

## 🔗 Artefactos externos

Nodos de otros harnesses (OpenSpec, Spec-kit) indexados en modo solo lectura; sus rutas son relativas a este directorio.

_(sin artefactos)_

---

## 📊 Estado del grafo

| Métrica | Valor |
|---------|-------|
| Nodos indexados | 228 |
| Nodos con frontmatter | 186 |
| Nodos sin frontmatter | 42 |
| Wikilinks pendientes | 30 |
| Enlaces locales, anchors y wikilinks de documentación activa | `node scripts/check-doc-links.js` |
| Última regeneración | ver `updated` en el frontmatter |

> El resultado de enlaces no se mantiene como un número manual: el checker lo genera y la CI lo exige.

---

*Generado por el skill `memory-system`. Regenera con `/memory-system index`.*

---

## ⚠️ Nodos pendientes

Wikilinks presentes en los nodos indexados cuyo slug no resuelve a ningún artefacto:

- [[ADR-0001-centralizar-templates-compartidos]] ⚠️ nodo pendiente
- [[ADR-0003]] ⚠️ nodo pendiente
- [[ADR-0003-workflow-canonico-story-y-epic]] ⚠️ nodo pendiente
- [[ADR-0004]] ⚠️ nodo pendiente
- [[ADR-0007]] ⚠️ nodo pendiente
- [[ADR-0009]] ⚠️ nodo pendiente
- [[EPIC-13-quality-gates-con-dod-en-story-workflow]] ⚠️ nodo pendiente
- [[EPIC-14-fabrica-de-skills]] ⚠️ nodo pendiente
- [[EPIC-17-remediating-and-improvement]] ⚠️ nodo pendiente
- [[STORY-068-dod-plan-en-story-analyze]] ⚠️ nodo pendiente
- [[STORY-069-dod-IMPLEMENT-en-story-implement]] ⚠️ nodo pendiente
- [[STORY-070-dod-code-review-en-story-code-review]] ⚠️ nodo pendiente
- [[STORY-078, STORY-079, STORY-080, STORY-081]] ⚠️ nodo pendiente
- [[STORY-089-story-fix-post-code-review]] ⚠️ nodo pendiente
- [[STORY-094-fixing-insights]] ⚠️ nodo pendiente
- [[definition-of-done]] ⚠️ nodo pendiente
- [[docs/domains/domain-knowledge-artifacts]] ⚠️ nodo pendiente
- [[docs/domains/domain-state-management]] ⚠️ nodo pendiente
- [[docs/domains/domain-work-item-hierarchy]] ⚠️ nodo pendiente
- [[project-template]] ⚠️ nodo pendiente
- [[release-spec-template]] ⚠️ nodo pendiente
- [[sddf-config]] ⚠️ nodo pendiente
- [[sddf.config.yaml]] ⚠️ nodo pendiente
- [[security-checklist]] ⚠️ nodo pendiente
- [[skill-preflight]] ⚠️ nodo pendiente
- [[slug]] ⚠️ nodo pendiente
- [[specs-and-workflows]] ⚠️ nodo pendiente
- [[specs_and_workflows]] ⚠️ nodo pendiente
- [[state-machine]] ⚠️ nodo pendiente
- [[story-template]] ⚠️ nodo pendiente
