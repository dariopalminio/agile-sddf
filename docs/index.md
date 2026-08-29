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

`specs/projects/PROJ-01-agile-sddf/`

- [[PROJ-01-agile-sddf-project-intent]] — [project-intent.md](specs/projects/PROJ-01-agile-sddf/project-intent.md) — Intención inicial: problema, visión y alcance del framework
- [[PROJ-01-agile-sddf]] — [project.md](specs/projects/PROJ-01-agile-sddf/project.md) — Especificación de requisitos del proyecto
- [[project-plan]] — [project-plan.md](specs/projects/PROJ-01-agile-sddf/project-plan.md) — Plan de releases y backlog de features · `IN-PROGRESS`
- [[story-map]] — [story-map.md](specs/projects/PROJ-01-agile-sddf/story-map.md) — Mapa de historias de usuario

También en ese directorio: [context-diagram.puml](specs/projects/PROJ-01-agile-sddf/context-diagram.puml) — diagrama de contexto C4 (PlantUML, sin frontmatter).

### L2 — Releases / Épicas

`specs/releases/EPIC-NN-*/release.md`. Las épicas recientes anidan sus documentos `plan-NN.md`
(planes de feature dentro de la épica).

- [[EPIC-00-estructura-base-y-mecanismo-de-templates]] — [release.md](specs/releases/EPIC-00-estructura-base-y-mecanismo-de-templates/release.md) — Estructura base y mecanismo de templates
- [[EPIC-01-features-spec-builder]] — [release.md](specs/releases/EPIC-01-features-spec-builder/release.md) — Features Spec Builder
- [[EPIC-02-project-spec-builder]] — [release.md](specs/releases/EPIC-02-project-spec-builder/release.md) — Project Spec Builder (pipeline de proyecto)
- [[EPIC-03-reverse-engineering]] — [release.md](specs/releases/EPIC-03-reverse-engineering/release.md) — Ingeniería inversa de proyectos existentes
- [[EPIC-04-refactor-features-spec-builder]] — [release.md](specs/releases/EPIC-04-refactor-features-spec-builder/release.md) — Consolidación y calidad del features spec builder
- [[EPIC-05-enhance-project-spec]] — [release.md](specs/releases/EPIC-05-enhance-project-spec/release.md) — Expansión del project spec
- [[EPIC-06-release-and-story-generator]] — [release.md](specs/releases/EPIC-06-release-and-story-generator/release.md) — Generador de releases e historias
- [[EPIC-07-publicacion-framework-npm]] — [release.md](specs/releases/EPIC-07-publicacion-framework-npm/release.md) — Publicación del framework como paquete npm
- [[EPIC-08-npm-install-locally]] — [release.md](specs/releases/EPIC-08-npm-install-locally/release.md) — Instalación local vía npm
- [[EPIC-09-docs-and-wiki-builders]] — [release.md](specs/releases/EPIC-09-docs-and-wiki-builders/release.md) — Docs & wiki builders
- [[EPIC-10-mejora-estructura-artefactos-nuevos-skills]] — [release.md](specs/releases/EPIC-10-mejora-estructura-artefactos-nuevos-skills/release.md) — Mejora en estructura de artefactos y nuevos skills
- [[EPIC-11-centralizar-templates]] — [release.md](specs/releases/EPIC-11-centralizar-templates/release.md) — Centralizar templates de spec en directorio compartido
- [[EPIC-12-story-sdd-workflow]] — [release.md](specs/releases/EPIC-12-story-sdd-workflow/release.md) — Comandos del flujo de story
- [[quality-gates-con-dod-en-story-workflow]] — [release.md](specs/releases/EPIC-13-quality-gates-con-dod-en-story-workflow/release.md) — EPIC-13: Quality gates con DoD en el story workflow · `DEFINITION`
- [[fabrica-de-skills]] — [release.md](specs/releases/EPIC-14-fabrica-de-skills/release.md) — EPIC-14: Fábrica de skills
- [[e2e-capability]] — [release.md](specs/releases/EPIC-15-e2e-capability/release.md) — EPIC-15: Skills de testing especializado y capacidad E2E

#### EPIC-16 — Enhancement and Security

- [[EPIC-16-enhancement-and-security]] — [release.md](specs/releases/EPIC-16-enhancement-and-security/release.md) — Mejoras y fortificación de skills
  - [[plan-01-root-folder-selection-to-installer]] — [plan-01](specs/releases/EPIC-16-enhancement-and-security/plan-01-root-folder-selection-to-installer.md) — Selección de carpeta raíz en el instalador
  - [[plan-02-integrate-story-testcases-in-story-plan]] — [plan-02](specs/releases/EPIC-16-enhancement-and-security/plan-02-Integrate-story-testcases-in-story-plan.md) — Integrar story-testcases en story-plan
  - [[plan-03-integrate-story-improve-in-story-specify]] — [plan-03](specs/releases/EPIC-16-enhancement-and-security/plan-03-integrate-story-improve-in-story-specify.md) — Integrar story-improve en story-specify
  - [[plan-04-add-and-improve-skills-readme]] — [plan-04](specs/releases/EPIC-16-enhancement-and-security/plan-04-add-and-improve-skills-readme.md) — Añadir y mejorar los README de skills
  - [[plan-05-extend-story-code-review-with-testcases]] — [plan-05](specs/releases/EPIC-16-enhancement-and-security/plan-05-extend-story-code-review-with-testcases.md) — Extender story-code-review con testcases e implement-report
  - [[plan-06-configure-story-verify-with-config-file]] — [plan-06](specs/releases/EPIC-16-enhancement-and-security/plan-06-configure-story-verify-with-config-file.md) — Configurar story-verify con `sddf.config.yaml`

#### EPIC-17 — Remediating and Improvement

- [[remediating-and-improvement]] — [release.md](specs/releases/EPIC-17-remediating-and-improvement/release.md) — Remediación de hallazgos y mejoras transversales · `IMPLEMENT`
  - [[plan-01-reduction-of-descriptions-context-cost]] — [plan-01](specs/releases/EPIC-17-remediating-and-improvement/plan-01-reduction-of-descriptions-context-cost.md) — Reducir el costo de contexto de las `description`
  - [[plan-02-fix-claude-md]] — [plan-02](specs/releases/EPIC-17-remediating-and-improvement/plan-02-fix-claude-md.md) — Corrección de `CLAUDE.md`
  - [[plan-03-clean]] — [plan-03](specs/releases/EPIC-17-remediating-and-improvement/plan-03-clean.md) — Limpieza de assets muertos y configuración legacy
  - [[plan-4-fix-story-code-review]] — [plan-04](specs/releases/EPIC-17-remediating-and-improvement/plan-04-fix-story-code-review.md) — Fix de inconsistencia interna en story-code-review
  - [[plan-5-normalize-skills-frontmatter]] — [plan-05](specs/releases/EPIC-17-remediating-and-improvement/plan-05-normalize-skills-frontmatter.md) — Normalizar el frontmatter de los skills
  - [[plan-6-centralizar-templates-compartidos]] — [plan-06](specs/releases/EPIC-17-remediating-and-improvement/plan-06-centralizar-templates-compartidos.md) — Centralizar templates compartidos (→ ADR-0001)
  - [[plan-7-invocacion-agentes-locales-de-skill]] — [plan-07](specs/releases/EPIC-17-remediating-and-improvement/plan-07-invocacion-agentes-locales-de-skill.md.md) — Contrato de invocación de agentes locales (→ ADR-0002)
  - [[plan-8-align-the-declared-multi-client-support]] — [plan-08](specs/releases/EPIC-17-remediating-and-improvement/plan-08-align-the-declared-multi-client-support.md) — Alinear el soporte multi-cliente declarado con el real
  - [[plan-09-state-machine-canonical-document]] — [plan-09](specs/releases/EPIC-17-remediating-and-improvement/plan-09-state-machine-canonical-document.md) — Documento canónico de la máquina de estados
  - [[plan-10-interactive-subagent-resilience]] — [plan-10](specs/releases/EPIC-17-remediating-and-improvement/plan-10-interactive-subagent-resilience.md) — Resiliencia de entrevistas multivuelta con subagentes
  - [[plan-11-fix-instalador-npm]] — [plan-11](specs/releases/EPIC-17-remediating-and-improvement/plan-11-fix-instalador-npm.md) — Fix del instalador npm (`--force`, sin prompt en postinstall)
  - [[plan-12-centralize-preflight-paragraph]] — [plan-12](specs/releases/EPIC-17-remediating-and-improvement/plan-12-centralize-preflight-paragraph.md) — Centralizar el párrafo de preflight
  - [[plan-13-remove-gem-and-rovo]] — [plan-13](specs/releases/EPIC-17-remediating-and-improvement/plan-13-remove-gem-and-rovo.md) — Eliminar `gem/` y `rovo/`
  - [[plan-14-evals-standardization]] — [plan-14](specs/releases/EPIC-17-remediating-and-improvement/plan-14-evals-standardization.md) — Estandarización del esquema de `evals.json`
  - [[plan-15-improve-invocation-in-story-implement]] — [plan-15](specs/releases/EPIC-17-remediating-and-improvement/plan-15-improve-invocation-in-story-implement.md) — Formalizar la invocación de `code_generators`
  - [[plan-16-agnostic-framework]] — [plan-16](specs/releases/EPIC-17-remediating-and-improvement/plan-16-agnostic-framework.md) — Desacoplar las referencias a `.claude/` de los skills
  - [[plan-17-generates-evals]] — [plan-17](specs/releases/EPIC-17-remediating-and-improvement/plan-17-generates-evals.md) — Generar `evals/evals.json` para skills

#### EPIC-18 — Workflow Hardening

- [[workflow-hardening]] — [release.md](specs/releases/EPIC-18-workflow-hardening/release.md) — Robustecer el flujo de story y release
  - [[plan-01-deliver-status]] — [plan-01](specs/releases/EPIC-18-workflow-hardening/plan-01-deliver-status.md) — Renombrar `INTEGRATION` → `DELIVER`
  - [[plan-02-epic-workflow-definition]] — [plan-02](specs/releases/EPIC-18-workflow-hardening/plan-02-epic-workflow-definition.md) — Definir el workflow canónico de épica/release
  - [[plan-03-lazy-assignment-of-feat-ids]] — [plan-03](specs/releases/EPIC-18-workflow-hardening/plan-03-lazy-assignment-of-feat-ids.md) — Asignación lazy de IDs `FEAT` en dos fases
  - [[plan-04-doc-story-implement]] — [plan-04](specs/releases/EPIC-18-workflow-hardening/plan-04-doc-story-implement.md) — Mejorar la documentación de story-implement
  - [[plan-05-enhance-code-review]] — [plan-05](specs/releases/EPIC-18-workflow-hardening/plan-05-enhance-code-review.md) — Incorporar mejoras a story-code-review
  - [[plan-06-isolate-workspace-by-story]] — [plan-06](specs/releases/EPIC-18-workflow-hardening/plan-06-isolate-workspace-by-story.md) — Aislar el espacio de trabajo por historia
  - [[plan-07-fix_code_generators_of_story-implement]] — [plan-07](specs/releases/EPIC-18-workflow-hardening/plan-07-fix_code_generators_of_story-implement.md) — Corregir desincronización en `code_generators`
  - [[plan-08-move-skills-to-the-root]] — [plan-08](specs/releases/EPIC-18-workflow-hardening/plan-08-move-skills-to-the-root.md) — Actualizar rutas tras mover `skills/` y `agents/` a la raíz

### L1 — Historias de usuario

`specs/stories/FEAT-NNN-*/story.md`.

> **Convención de directorio:** cada `FEAT-NNN-*/` contiene `story.md` como nodo principal y, según la
> fase alcanzada, puede contener además `analyze.md`, `design.md`, `tasks.md`, `testcases.md`,
> `implement-report.md`, `code-review-report.md`, `verify-report.md`, `acceptance-report.md`,
> `fix-directives.md` o `finvest-evaluation-report.md`. Esos artefactos derivados no se enumeran aquí:
> se leen desde el directorio de la historia.

#### Pipeline de proyecto (EPIC-01 → EPIC-05)

- [[FEAT-001-project-begin]] — [story.md](specs/stories/FEAT-001-project-begin/story.md) — project-begin: captura de intención inicial del proyecto
- [[FEAT-003-project-discovery]] — [story.md](specs/stories/FEAT-003-project-discovery/story.md) — project-discovery: discovery de usuarios y especificación de requisitos
- [[FEAT-004-project-planning]] — [story.md](specs/stories/FEAT-004-project-planning/story.md) — project-planning: planificación de releases y backlog
- [[FEAT-005-project-story-mapping]] — [story.md](specs/stories/FEAT-005-project-story-mapping/story.md) — project-story-mapping: user story mapping según Jeff Patton
- [[FEAT-006-story-creation]] — [story.md](specs/stories/FEAT-006-story-creation/story.md) — story-creation: crear historias de usuario
- [[FEAT-007-story-evaluation]] — [story.md](specs/stories/FEAT-007-story-evaluation/story.md) — story-evaluation: evaluación FINVEST de historias
- [[FEAT-008-control-wip]] — [story.md](specs/stories/FEAT-008-control-wip/story.md) — Control WIP=1: detección de proyecto activo
- [[FEAT-010-gates-de-revision]] — [story.md](specs/stories/FEAT-010-gates-de-revision/story.md) — Gates de revisión humana entre fases del pipeline
- [[FEAT-011-project-planning-mejorado]] — [story.md](specs/stories/FEAT-011-project-planning-mejorado/story.md) — project-planning mejorado: integración con story mapping
- [[FEAT-012-story-split]] — [story.md](specs/stories/FEAT-012-story-split/story.md) — story-split: dividir épicas en historias pequeñas
- [[FEAT-013-story-refine]] — [story.md](specs/stories/FEAT-013-story-refine/story.md) — story-refine: refinamiento iterativo de historias
- [[FEAT-015-project-flow]] — [story.md](specs/stories/FEAT-015-project-flow/story.md) — project-flow: orquestador del pipeline completo de proyecto

#### Ingeniería inversa (EPIC-03)

- [[FEAT-017-reverse-engineering]] — [story.md](specs/stories/FEAT-017-reverse-engineering/story.md) — reverse-engineering: skill orquestador de ingeniería inversa
- [[FEAT-018-agente-reverse-engineer-architect]] — [story.md](specs/stories/FEAT-018-agente-reverse-engineer-architect/story.md) — Agente reverse-engineer-architect
- [[FEAT-019-agente-reverse-engineer-product-discovery]] — [story.md](specs/stories/FEAT-019-agente-reverse-engineer-product-discovery/story.md) — Agente reverse-engineer-product-discovery
- [[FEAT-020-agente-reverse-engineer-business-analyst]] — [story.md](specs/stories/FEAT-020-agente-reverse-engineer-business-analyst/story.md) — Agente reverse-engineer-business-analyst
- [[FEAT-021-agente-reverse-engineer-ux-flow-mapper]] — [story.md](specs/stories/FEAT-021-agente-reverse-engineer-ux-flow-mapper/story.md) — Agente reverse-engineer-ux-flow-mapper
- [[FEAT-022-agente-reverse-engineer-synthesizer]] — [story.md](specs/stories/FEAT-022-agente-reverse-engineer-synthesizer/story.md) — Agente reverse-engineer-synthesizer
- [[FEAT-023-scope-acotado-focus]] — [story.md](specs/stories/FEAT-023-scope-acotado-focus/story.md) — Scope acotado: flag `--focus` para reverse-engineering
- [[FEAT-024-modo-incremental-update]] — [story.md](specs/stories/FEAT-024-modo-incremental-update/story.md) — Modo incremental: flag `--update` para reverse-engineering

#### Generadores de release y story (EPIC-06)

- [[FEAT-027-validacion-de-formato-de-release]] — [story.md](specs/stories/FEAT-027-validacion-de-formato-de-release/story.md) — Validación de formato de release
- [[FEAT-028-generar-releases]] — [story.md](specs/stories/FEAT-028-generar-releases/story.md) — Generar releases desde el project-plan
- [[FEAT-029-generar-stories]] — [story.md](specs/stories/FEAT-029-generar-stories/story.md) — Generar stories desde un archivo de release
- [[FEAT-030-soporte-atlassian-rovo]] — [story.md](specs/stories/FEAT-030-soporte-atlassian-rovo/story.md) — Soporte Atlassian Rovo: agente story-creator *(retirado en plan-13 de EPIC-17)*
- [[FEAT-032-soporte-atlassian-rovo-para-validar-release]] — [story.md](specs/stories/FEAT-032-soporte-atlassian-rovo-para-validar-release/story.md) — Soporte Atlassian Rovo para validar release *(retirado)*
- [[FEAT-033-soporte-atlassian-rovo-para-crear-epic-release]] — [story.md](specs/stories/FEAT-033-soporte-atlassian-rovo-para-crear-epic-release/story.md) — Soporte Atlassian Rovo para crear epic release *(retirado)*
- [[FEAT-034-rovo-agent-release-reverse-generator]] — [story.md](specs/stories/FEAT-034-rovo-agent-release-reverse-generator/story.md) — Rovo agent: release reverse generator desde hijos *(retirado)*
- [[FEAT-035-generar-stories-todos-releases]] — [story.md](specs/stories/FEAT-035-generar-stories-todos-releases/story.md) — Generar stories de todos los releases en batch
- [[FEAT-036-openspec-init-config]] — [story.md](specs/stories/FEAT-036-openspec-init-config/story.md) — Inicializar la configuración de OpenSpec automáticamente
- [[FEAT-037-generar-baseline-openspec-inversa]] — [story.md](specs/stories/FEAT-037-generar-baseline-openspec-inversa/story.md) — Generar línea base de OpenSpec por ingeniería inversa

#### Empaquetado y distribución (EPIC-07 → EPIC-09)

- [[FEAT-038-copy-templates-to-skills]] — [story.md](specs/stories/FEAT-038-copy-templates-to-skills/story.md) — Copiar los templates a los skills correspondientes
- [[FEAT-039-publicar-framework-en-npm]] — [story.md](specs/stories/FEAT-039-publicar-framework-en-npm/story.md) — Publicar el framework en npm
- [[FEAT-040-instalar-skills-via-postinstall]] — [story.md](specs/stories/FEAT-040-instalar-skills-via-postinstall/story.md) — Instalar skills vía script de `postinstall`
- [[FEAT-041-npm-install-locally]] — [story.md](specs/stories/FEAT-041-npm-install-locally/story.md) — Instalación local con npm
- [[FEAT-042-readme-builder]] — [story.md](specs/stories/FEAT-042-readme-builder/story.md) — readme-builder: generación de `README.md`
- [[FEAT-043-header-aggregation]] — [story.md](specs/stories/FEAT-043-header-aggregation/story.md) — header-aggregation: metadata de estado en archivos spec
- [[FEAT-044-directorio-docs-tipo-wiki]] — [story.md](specs/stories/FEAT-044-directorio-docs-tipo-wiki/story.md) — Directorio `docs/` tipo wiki (este índice)
- [[FEAT-046-publicar-npm-con-github-actions]] — [story.md](specs/stories/FEAT-046-publicar-npm-con-github-actions/story.md) — CI/CD con GitHub Actions para publicar en npm
- [[FIX-001-error-in-npm-install-locally]] — [story.md](specs/stories/FIX-001-error-in-npm-install-locally/story.md) — Fix: error de `npm install agile-sddf` en Windows 11

#### Estructura de artefactos y templates (EPIC-10 → EPIC-11)

- [[FEAT-047-skills-multicliente-rutas-relativas]] — [story.md](specs/stories/FEAT-047-skills-multicliente-rutas-relativas/story.md) — Skills con templates multicliente y rutas relativas
- [[FEAT-048-refactor-migrates-templates-to-assets]] — [story.md](specs/stories/FEAT-048-refactor-migrates-templates-to-assets/story.md) — Refactor: migrar templates a `assets/` en los skills
- [[FEAT-049-reading-of-sddf-root]] — [story.md](specs/stories/FEAT-049-reading-of-sddf-root/story.md) — Lectura de `SDDF_ROOT` como ruta base de artefactos
- [[FEAT-050-organizar-artefactos-en-directorio-propio]] — [story.md](specs/stories/FEAT-050-organizar-artefactos-en-directorio-propio/story.md) — Organizar artefactos de spec en un directorio por workitem
- [[FEAT-051-crear-release-por-preguntas-guiadas]] — [story.md](specs/stories/FEAT-051-crear-release-por-preguntas-guiadas/story.md) — Crear un `release.md` válido por preguntas guiadas
- [[FEAT-052-generar-diagrama-contexto-c4]] — [story.md](specs/stories/FEAT-052-generar-diagrama-contexto-c4/story.md) — Generar un diagrama de contexto C4 del proyecto
- [[FEAT-053-centralizar-validacion-entorno-sddf]] — [story.md](specs/stories/FEAT-053-centralizar-validacion-entorno-sddf/story.md) — Centralizar la validación de entorno con `skill-preflight`
- [[FEAT-054-inicializar-entorno-sddf]] — [story.md](specs/stories/FEAT-054-inicializar-entorno-sddf/story.md) — Inicializar el entorno SDDF con `sddf-init` · `BACKLOG`
- [[FEAT-055-centralizar-templates-en-specs-templates]] — [story.md](specs/stories/FEAT-055-centralizar-templates-en-specs-templates/story.md) — Centralizar templates de spec en directorio compartido
- [[FEAT-056-project-policies]] — [story.md](specs/stories/FEAT-056-project-policies/story.md) — Políticas de proyecto (`constitution.md`, DoD)

#### Story SDD workflow (EPIC-12)

- [[FEAT-057-skill-para-diseno]] — [story.md](specs/stories/FEAT-057-skill-para-diseno/story.md) — Skill de diseño (`story-design`)
- [[FEAT-058-skill-para-tasking]] — [story.md](specs/stories/FEAT-058-skill-para-tasking/story.md) — Skill de tasking (`story-tasking`)
- [[FEAT-059-comando-de-analisis-transversal]] — [story.md](specs/stories/FEAT-059-comando-de-analisis-transversal/story.md) — Análisis transversal (`story-analyze`)
- [[FEAT-060-orquestacion-del-plan]] — [story.md](specs/stories/FEAT-060-orquestacion-del-plan/story.md) — Orquestación del plan (`story-plan`)
- [[FEAT-061-skill-de-implementacion-el-programador-autonomo]] — [story.md](specs/stories/FEAT-061-skill-de-implementacion-el-programador-autonomo/story.md) — Skill de implementación: el programador autónomo (`story-implement`)
- [[FEAT-062-status-management-on-workflow]] — [story.md](specs/stories/FEAT-062-status-management-on-workflow/story.md) — Gestión de estados en el workflow
- [[FEAT-063-reutilizar-directorio-como-historia-core]] — [story.md](specs/stories/FEAT-063-reutilizar-directorio-como-historia-core/story.md) — Reutilizar el directorio original como historia core al dividir
- [[FEAT-064-revision-codigo-multi-agente]] — [story.md](specs/stories/FEAT-064-revision-codigo-multi-agente/story.md) — `story-code-review`: revisión multi-agente del código implementado
- [[FEAT-065-revision-con-bloqueantes]] — [story.md](specs/stories/FEAT-065-revision-con-bloqueantes/story.md) — `story-code-review`: instrucciones de corrección ante bloqueantes
- [[FEAT-066-revision-validacion-precondiciones]] — [story.md](specs/stories/FEAT-066-revision-validacion-precondiciones/story.md) — `story-code-review`: validar artefactos requeridos antes de revisar
- [[FEAT-067-story-implement-continuar-parcial]] — [story.md](specs/stories/FEAT-067-story-implement-continuar-parcial/story.md) — `story-implement`: continuar implementación parcial con fix-directives

#### Quality gates con DoD (EPIC-13)

- [[dod-plan-en-story-analyze]] — [story.md](specs/stories/FEAT-068-dod-plan-en-story-analyze/story.md) — FEAT-068: DoD PLAN en `story-analyze`
- [[dod-IMPLEMENT-en-story-implement]] — [story.md](specs/stories/FEAT-069-dod-implementing-en-story-implement/story.md) — FEAT-069: DoD IMPLEMENT en `story-implement`
- [[dod-code-review-en-story-code-review]] — [story.md](specs/stories/FEAT-070-dod-code-review-en-story-code-review/story.md) — FEAT-070: DoD CODE-REVIEW en `story-code-review` · `READY-FOR-VERIFY`
- [[FEAT-071-skill-story-verify]] — [story.md](specs/stories/FEAT-071-skill-story-verify/story.md) — Skill `story-verify`: orquestar la fase VERIFY · `READY-FOR-CODE-REVIEW`
- [[FEAT-072-skill-story-acceptance]] — [story.md](specs/stories/FEAT-072-skill-story-acceptance/story.md) — Skill `story-acceptance`: validación humana final antes de DELIVER
- [[FEAT-073-skill-security-audit-condicional]] — [story.md](specs/stories/FEAT-073-skill-security-audit-condicional/story.md) — Skill `security-audit`: auditoría de seguridad condicional

#### Integración y entrega (`story-integrate`)

- [[FEAT-074-integrar-historia-batch-configurable]] — [story.md](specs/stories/FEAT-074-integrar-historia-batch-configurable/story.md) — Integración batch configurable de historias · `READY-FOR-IMPLEMENT`
- [[FEAT-075-integrar-historia-modo-manual-dryrun]] — [story.md](specs/stories/FEAT-075-integrar-historia-modo-manual-dryrun/story.md) — Modos de ejecución manual y `--dry-run` · `READY-FOR-IMPLEMENT`
- [[FEAT-076-integrar-historia-multi-modelo-entrega]] — [story.md](specs/stories/FEAT-076-integrar-historia-multi-modelo-entrega/story.md) — Soporte multi-modelo de entrega (batch y continuous) · `READY-FOR-IMPLEMENT`

#### Fábrica de skills y ciclo TDD (EPIC-14 → EPIC-15)

- [[FEAT-077-mejorar-historia-desde-reporte]] — [story.md](specs/stories/FEAT-077-mejorar-historia-desde-reporte/story.md) — `story-improve`: mejora automática de historia desde reporte FINVEST · `IMPLEMENT`
- [[FEAT-078-implement-tdd-fase-red]] — [story.md](specs/stories/FEAT-078-implement-tdd-fase-red/story.md) — `story-implement` fase RED: validar configuración y generar pruebas · `VERIFY`
- [[FEAT-079-story-testcases]] — [story.md](specs/stories/FEAT-079-story-testcases/story.md) — `story-testcases`: generar `testcases.md` desde `story.md` y `design.md`
- [[FEAT-080-skills-master]] — [story.md](specs/stories/FEAT-080-skills-master/story.md) — `skill-master`: modos plan/build e independencia de SDDF · plan en [plan.md](specs/stories/FEAT-080-skills-master/plan.md)
- [[FEAT-081-implement-tdd-fase-green-refactor]] — [story.md](specs/stories/FEAT-081-implement-tdd-fase-green-refactor/story.md) — `story-implement` fases GREEN y REFACTOR · `VERIFY`
- [[FEAT-082-implement-tdd-modos-ejecucion]] — [story.md](specs/stories/FEAT-082-implement-tdd-modos-ejecucion/story.md) — `story-implement`: modos interactivo y automático del ciclo TDD · `VERIFY`
- [[FEAT-083-skill-test-evals]] — [story.md](specs/stories/FEAT-083-skill-test-evals/story.md) — `skill-test-evals`: generar `evals/evals.json` desde cualquier fuente

#### En planificación (sin `story.md` todavía)

Estos directorios solo tienen documentos de plan, sin frontmatter — se enlazan por ruta:

- FEAT-084-skill-verify — [plan-01](specs/stories/FEAT-084-skill-verify/plan-01.md) · [plan-02](specs/stories/FEAT-084-skill-verify/plan-02.md) · [plan-03](specs/stories/FEAT-084-skill-verify/plan-03.md)
- FEAT-085-integrar-config-sddf-init — [plan.md](specs/stories/FEAT-085-integrar-config-sddf-init/plan.md) — Integrar `sddf.config.yaml` en el skill `sddf-init`

### Templates de spec

`specs/templates/` — fuente de verdad de la estructura de los artefactos generados. Su `slug:` es un
placeholder, por lo que se enlazan solo por ruta:

- [project-intent-template.md](specs/templates/project-intent-template.md) — Template de intención de proyecto
- [project-template.md](specs/templates/project-template.md) — Template de especificación de requisitos
- [project-plan-template.md](specs/templates/project-plan-template.md) — Template de plan de proyecto
- [release-spec-template.md](specs/templates/release-spec-template.md) — Template de release / épica
- [story-template.md](specs/templates/story-template.md) — Template de historia de usuario

---

## 📐 Decisiones de arquitectura (docs/adr/)

- [[adr-index]] — [README.md](adr/README.md) — Índice y convención de ADRs (los aceptados son inmutables)
- [[centralizar-templates-compartidos]] — [ADR-0001](adr/ADR-0001-centralizar-templates-compartidos.md) — Centralizar templates compartidos en `$SPECS_BASE/specs/templates/` · `ACCEPTED`
- [[invocacion-agentes-locales-de-skill]] — [ADR-0002](adr/ADR-0002-invocacion-agentes-locales-de-skill.md) — Contrato de invocación de agentes locales de skill · `ACCEPTED`
- [[workflow-canonico-story-y-epic]] — [ADR-0003](adr/ADR-0003-workflow-canonico-story-y-epic.md) — Workflows canónicos de story y épica en el pipeline SDDF · `ACCEPTED`
- [adr-template.md](adr/adr-template.md) — Template para nuevos ADR (slug placeholder, sin wikilink)

## 📖 Guías y operación

### Guías (docs/guides/)

Las guías se dividen en guides (guías prácticas) y reference (documentación de referencia).

#### Metodología y proceso

- [[sdd]] — [sdd.md](guides/sdd.md) — Spec Driven Development (SDD): fundamentos del método
- [[specs-and-workflows]] — [specs_and_workflows.md](guides/specs_and_workflows.md) — Specs y workflows: contratos, trazabilidad, status y substatus
- [[state-machine]] — [state-machine.md](guides/state-machine.md) — Máquina de estados canónica del framework (story, project, release) con diagramas Mermaid
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
| — L2 releases (19 `release.md` + 31 `plan-NN.md`) | 50 |
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
