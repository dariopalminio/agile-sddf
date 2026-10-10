---
type: wiki
slug: index
title: "Índice de documentación"
status: IN-PROGRESS
substatus: IN-PROGRESS
parent: null
updated: 2026-10-10
---

# 📚 Índice de documentación

> Este índice es el punto de entrada principal para LLMs y humanos.
> Lee este archivo primero para orientarte antes de abrir cualquier otro nodo.
> Formato de cada entrada: wikilink + link markdown a la ruta relativa + título.
> El slug del wikilink es el declarado en el frontmatter del documento (convención SDDF) o, si no lo
> declara, el derivado del nombre del archivo o del directorio. Cuando un archivo no tiene frontmatter,
> se enlaza solo por ruta. Usa foam (foambubble.github.io/foam) para visualizar el grafo.
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
- [[dod-story-acceptance]] — [dod-story-acceptance.md](guardrails/dod-story-acceptance.md) — DoD ACCEPTANCE — Story (transition guardrail)
- [[dod-story-checklist]] — [dod-story-checklist.md](guardrails/dod-story-checklist.md) — DoD Story (deprecado)
- [[dod-story-code-review]] — [dod-story-code-review.md](guardrails/dod-story-code-review.md) — DoD CODE-REVIEW — Story (transition guardrail)
- [[dod-story-deliver]] — [dod-story-deliver.md](guardrails/dod-story-deliver.md) — Criterios de despliegue en producción (content guardrail)
- [[dod-story-implement]] — [dod-story-implement.md](guardrails/dod-story-implement.md) — DoD IMPLEMENT — Story (transition guardrail)
- [[dod-story-plan]] — [dod-story-plan.md](guardrails/dod-story-plan.md) — DoD PLAN — Story (transition guardrail)
- [[dod-story-specify]] — [dod-story-specify.md](guardrails/dod-story-specify.md) — DoD SPECIFY — Story (transition guardrail)
- [[dod-story-verify]] — [dod-story-verify.md](guardrails/dod-story-verify.md) — DoD VERIFY — Story (transition guardrail)
- [[gr-agent-creation-checklist]] — [gr-agent-creation-checklist.md](guardrails/gr-agent-creation-checklist.md) — Guardrail: Custom agent creation
- [[gr-ai-security-checklist]] — [gr-ai-security-checklist.md](guardrails/gr-ai-security-checklist.md) — Guardrail: AI security check for agent-facing artefacts
- [[gr-code-security-checklist]] — [gr-code-security-checklist.md](guardrails/gr-code-security-checklist.md) — Guardrail: Code security check
- [[gr-skill-creation-checklist]] — [gr-skill-creation-checklist.md](guardrails/gr-skill-creation-checklist.md) — Guardrail: Agent Skill creation

---

## 🎯 Producto y requisitos

### Producto (product/)

- [[product-index]] — [README.md](product/README.md) — Producto
- [[objectives]] — [objectives.md](product/objectives.md) — Objetivos
- [[roadmap]] — [roadmap.md](product/roadmap.md) — Roadmap del producto
- [[stakeholders]] — [stakeholders.md](product/stakeholders.md) — Stakeholders
- [[vision]] — [vision.md](product/vision.md) — Visión del producto

### Requisitos (requirements/)

- [[requirements-index]] — [README.md](requirements/README.md) — Requisitos
- [[FR-001-inicializacion-del-entorno-sddf]] — [FR-001-inicializacion-del-entorno-sddf.md](requirements/functional/FR-001-inicializacion-del-entorno-sddf.md) — Inicialización del entorno SDDF
- [[FR-002-protocolo-de-verificacion-de-entorno-como-paso-0]] — [FR-002-protocolo-de-verificacion-de-entorno-como-paso-0.md](requirements/functional/FR-002-protocolo-de-verificacion-de-entorno-como-paso-0.md) — Protocolo de verificación de entorno como Paso 0
- [[FR-003-raiz-de-artefactos-configurable]] — [FR-003-raiz-de-artefactos-configurable.md](requirements/functional/FR-003-raiz-de-artefactos-configurable.md) — Raíz de artefactos configurable
- [[FR-004-organizacion-de-artefactos-por-work-item]] — [FR-004-organizacion-de-artefactos-por-work-item.md](requirements/functional/FR-004-organizacion-de-artefactos-por-work-item.md) — Organización de artefactos por work item
- [[FR-005-templates-centralizados-como-fuente-unica]] — [FR-005-templates-centralizados-como-fuente-unica.md](requirements/functional/FR-005-templates-centralizados-como-fuente-unica.md) — Templates centralizados como fuente única
- [[FR-006-extraccion-dinamica-de-secciones-de-templates-en]] — [FR-006-extraccion-dinamica-de-secciones-de-templates-en.md](requirements/functional/FR-006-extraccion-dinamica-de-secciones-de-templates-en.md) — Extracción dinámica de secciones de templates en runtime
- [[FR-007-configuracion-operacional-por-stack-tecnologico]] — [FR-007-configuracion-operacional-por-stack-tecnologico.md](requirements/functional/FR-007-configuracion-operacional-por-stack-tecnologico.md) — Configuración operacional por stack tecnológico
- [[FR-008-captura-de-intencion-inicial-del-proyecto]] — [FR-008-captura-de-intencion-inicial-del-proyecto.md](requirements/functional/FR-008-captura-de-intencion-inicial-del-proyecto.md) — Captura de intención inicial del proyecto
- [[FR-009-discovery-de-usuarios-y-especificacion-de]] — [FR-009-discovery-de-usuarios-y-especificacion-de.md](requirements/functional/FR-009-discovery-de-usuarios-y-especificacion-de.md) — Discovery de usuarios y especificación de requisitos
- [[FR-010-planificacion-de-proyecto-con-epicas-y-backlog]] — [FR-010-planificacion-de-proyecto-con-epicas-y-backlog.md](requirements/functional/FR-010-planificacion-de-proyecto-con-epicas-y-backlog.md) — Planificación de proyecto con épicas y backlog
- [[FR-011-ejecucion-del-pipeline-de-proyecto-en-una-sola]] — [FR-011-ejecucion-del-pipeline-de-proyecto-en-una-sola.md](requirements/functional/FR-011-ejecucion-del-pipeline-de-proyecto-en-una-sola.md) — Ejecución del pipeline de proyecto en una sola sesión
- [[FR-012-sesion-interactiva-de-user-story-mapping]] — [FR-012-sesion-interactiva-de-user-story-mapping.md](requirements/functional/FR-012-sesion-interactiva-de-user-story-mapping.md) — Sesión interactiva de User Story Mapping
- [[FR-013-integracion-del-story-map-como-guia-de]] — [FR-013-integracion-del-story-map-como-guia-de.md](requirements/functional/FR-013-integracion-del-story-map-como-guia-de.md) — Integración del story map como guía de planificación
- [[FR-014-generacion-del-diagrama-de-contexto-c4]] — [FR-014-generacion-del-diagrama-de-contexto-c4.md](requirements/functional/FR-014-generacion-del-diagrama-de-contexto-c4.md) — Generación del diagrama de contexto C4
- [[FR-015-generacion-de-politicas-de-proyecto]] — [FR-015-generacion-de-politicas-de-proyecto.md](requirements/functional/FR-015-generacion-de-politicas-de-proyecto.md) — Generación de políticas de proyecto
- [[FR-016-control-de-work-in-progress-wip-1-por-nivel]] — [FR-016-control-de-work-in-progress-wip-1-por-nivel.md](requirements/functional/FR-016-control-de-work-in-progress-wip-1-por-nivel.md) — Control de Work-In-Progress (WIP = 1) por nivel
- [[FR-017-gates-de-revision-humana-entre-fases]] — [FR-017-gates-de-revision-humana-entre-fases.md](requirements/functional/FR-017-gates-de-revision-humana-entre-fases.md) — Gates de revisión humana entre fases
- [[FR-018-generacion-de-la-especificacion-desde-codigo]] — [FR-018-generacion-de-la-especificacion-desde-codigo.md](requirements/functional/FR-018-generacion-de-la-especificacion-desde-codigo.md) — Generación de la especificación desde código existente
- [[FR-019-analisis-de-arquitectura-tecnica-del-repositorio]] — [FR-019-analisis-de-arquitectura-tecnica-del-repositorio.md](requirements/functional/FR-019-analisis-de-arquitectura-tecnica-del-repositorio.md) — Análisis de arquitectura técnica del repositorio
- [[FR-020-extraccion-de-features-desde-la-perspectiva-del]] — [FR-020-extraccion-de-features-desde-la-perspectiva-del.md](requirements/functional/FR-020-extraccion-de-features-desde-la-perspectiva-del.md) — Extracción de features desde la perspectiva del usuario
- [[FR-021-extraccion-de-reglas-de-negocio-desde-el-codigo]] — [FR-021-extraccion-de-reglas-de-negocio-desde-el-codigo.md](requirements/functional/FR-021-extraccion-de-reglas-de-negocio-desde-el-codigo.md) — Extracción de reglas de negocio desde el código
- [[FR-022-reconstruccion-del-mapa-de-navegacion-y-flujos-de]] — [FR-022-reconstruccion-del-mapa-de-navegacion-y-flujos-de.md](requirements/functional/FR-022-reconstruccion-del-mapa-de-navegacion-y-flujos-de.md) — Reconstrucción del mapa de navegación y flujos de usuario
- [[FR-023-analisis-con-scope-acotado]] — [FR-023-analisis-con-scope-acotado.md](requirements/functional/FR-023-analisis-con-scope-acotado.md) — Análisis con scope acotado
- [[FR-024-modo-incremental-de-actualizacion]] — [FR-024-modo-incremental-de-actualizacion.md](requirements/functional/FR-024-modo-incremental-de-actualizacion.md) — Modo incremental de actualización
- [[FR-025-creacion-interactiva-de-una-epica]] — [FR-025-creacion-interactiva-de-una-epica.md](requirements/functional/FR-025-creacion-interactiva-de-una-epica.md) — Creación interactiva de una épica
- [[FR-026-generacion-de-epicas-desde-el-plan-de-proyecto]] — [FR-026-generacion-de-epicas-desde-el-plan-de-proyecto.md](requirements/functional/FR-026-generacion-de-epicas-desde-el-plan-de-proyecto.md) — Generación de épicas desde el plan de proyecto
- [[FR-027-validacion-de-formato-de-epica-gate]] — [FR-027-validacion-de-formato-de-epica-gate.md](requirements/functional/FR-027-validacion-de-formato-de-epica-gate.md) — Validación de formato de épica (gate)
- [[FR-028-generacion-de-historias-desde-una-epica]] — [FR-028-generacion-de-historias-desde-una-epica.md](requirements/functional/FR-028-generacion-de-historias-desde-una-epica.md) — Generación de historias desde una épica
- [[FR-029-generacion-de-historias-de-todas-las-epicas-en]] — [FR-029-generacion-de-historias-de-todas-las-epicas-en.md](requirements/functional/FR-029-generacion-de-historias-de-todas-las-epicas-en.md) — Generación de historias de todas las épicas en batch
- [[FR-030-creacion-de-historias-de-usuario]] — [FR-030-creacion-de-historias-de-usuario.md](requirements/functional/FR-030-creacion-de-historias-de-usuario.md) — Creación de historias de usuario
- [[FR-031-evaluacion-de-calidad-con-rubrica-finvest]] — [FR-031-evaluacion-de-calidad-con-rubrica-finvest.md](requirements/functional/FR-031-evaluacion-de-calidad-con-rubrica-finvest.md) — Evaluación de calidad con rúbrica FINVEST
- [[FR-032-division-de-historias-grandes-story-splitting]] — [FR-032-division-de-historias-grandes-story-splitting.md](requirements/functional/FR-032-division-de-historias-grandes-story-splitting.md) — División de historias grandes (story splitting)
- [[FR-033-mejora-automatica-de-una-historia-desde-su-reporte]] — [FR-033-mejora-automatica-de-una-historia-desde-su-reporte.md](requirements/functional/FR-033-mejora-automatica-de-una-historia-desde-su-reporte.md) — Mejora automática de una historia desde su reporte de evaluación
- [[FR-034-orquestacion-del-ciclo-de-especificacion-con-gate]] — [FR-034-orquestacion-del-ciclo-de-especificacion-con-gate.md](requirements/functional/FR-034-orquestacion-del-ciclo-de-especificacion-con-gate.md) — Orquestación del ciclo de especificación con gate anti-bucle
- [[FR-035-diseno-tecnico-de-la-historia]] — [FR-035-diseno-tecnico-de-la-historia.md](requirements/functional/FR-035-diseno-tecnico-de-la-historia.md) — Diseño técnico de la historia
- [[FR-036-descomposicion-en-tareas-atomicas]] — [FR-036-descomposicion-en-tareas-atomicas.md](requirements/functional/FR-036-descomposicion-en-tareas-atomicas.md) — Descomposición en tareas atómicas
- [[FR-037-generacion-de-casos-de-prueba-tipificados]] — [FR-037-generacion-de-casos-de-prueba-tipificados.md](requirements/functional/FR-037-generacion-de-casos-de-prueba-tipificados.md) — Generación de casos de prueba tipificados
- [[FR-038-analisis-transversal-de-coherencia-gate-del-dod]] — [FR-038-analisis-transversal-de-coherencia-gate-del-dod.md](requirements/functional/FR-038-analisis-transversal-de-coherencia-gate-del-dod.md) — Análisis transversal de coherencia (gate del DoD PLAN)
- [[FR-039-orquestacion-de-la-fase-de-planning]] — [FR-039-orquestacion-de-la-fase-de-planning.md](requirements/functional/FR-039-orquestacion-de-la-fase-de-planning.md) — Orquestación de la fase de planning
- [[FR-040-implementacion-guiada-por-tdd]] — [FR-040-implementacion-guiada-por-tdd.md](requirements/functional/FR-040-implementacion-guiada-por-tdd.md) — Implementación guiada por TDD
- [[FR-041-modos-de-ejecucion-y-reanudacion-de-la]] — [FR-041-modos-de-ejecucion-y-reanudacion-de-la.md](requirements/functional/FR-041-modos-de-ejecucion-y-reanudacion-de-la.md) — Modos de ejecución y reanudación de la implementación
- [[FR-042-implementacion-tarea-por-tarea]] — [FR-042-implementacion-tarea-por-tarea.md](requirements/functional/FR-042-implementacion-tarea-por-tarea.md) — Implementación tarea por tarea
- [[FR-043-revision-de-codigo-multi-agente-gate-del-dod-code]] — [FR-043-revision-de-codigo-multi-agente-gate-del-dod-code.md](requirements/functional/FR-043-revision-de-codigo-multi-agente-gate-del-dod-code.md) — Revisión de código multi-agente (gate del DoD CODE-REVIEW)
- [[FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify]] — [FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify.md](requirements/functional/FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify.md) — Verificación por ejecución de pruebas (fase VERIFY)
- [[FR-045-aceptacion-humana-final-fase-acceptance]] — [FR-045-aceptacion-humana-final-fase-acceptance.md](requirements/functional/FR-045-aceptacion-humana-final-fase-acceptance.md) — Aceptación humana final (fase ACCEPTANCE)
- [[FR-046-gestion-de-estados-a-lo-largo-del-workflow]] — [FR-046-gestion-de-estados-a-lo-largo-del-workflow.md](requirements/functional/FR-046-gestion-de-estados-a-lo-largo-del-workflow.md) — Gestión de estados a lo largo del workflow
- [[FR-047-estandarizacion-de-frontmatter-en-documentos-de]] — [FR-047-estandarizacion-de-frontmatter-en-documentos-de.md](requirements/functional/FR-047-estandarizacion-de-frontmatter-en-documentos-de.md) — Estandarización de frontmatter en documentos de spec
- [[FR-048-generacion-del-indice-wiki-de-documentacion]] — [FR-048-generacion-del-indice-wiki-de-documentacion.md](requirements/functional/FR-048-generacion-del-indice-wiki-de-documentacion.md) — Generación del índice wiki de documentación
- [[FR-050-auditoria-de-seguridad-condicional]] — [FR-050-auditoria-de-seguridad-condicional.md](requirements/functional/FR-050-auditoria-de-seguridad-condicional.md) — Auditoría de seguridad condicional
- [[FR-051-distribucion-del-framework-como-paquete-npm]] — [FR-051-distribucion-del-framework-como-paquete-npm.md](requirements/functional/FR-051-distribucion-del-framework-como-paquete-npm.md) — Distribución del framework como paquete npm
- [[FR-052-instalacion-automatica-tras-npm-install]] — [FR-052-instalacion-automatica-tras-npm-install.md](requirements/functional/FR-052-instalacion-automatica-tras-npm-install.md) — Instalación automática tras `npm install`
- [[FR-053-instalacion-interactiva-con-seleccion-de-runtime]] — [FR-053-instalacion-interactiva-con-seleccion-de-runtime.md](requirements/functional/FR-053-instalacion-interactiva-con-seleccion-de-runtime.md) — Instalación interactiva con selección de runtime
- [[FR-054-publicacion-automatizada-desde-ci]] — [FR-054-publicacion-automatizada-desde-ci.md](requirements/functional/FR-054-publicacion-automatizada-desde-ci.md) — Publicación automatizada desde CI
- [[NFR-001-compatibilidad-multi-runtime-por-instalacion-no]] — [NFR-001-compatibilidad-multi-runtime-por-instalacion-no.md](requirements/non-functional/NFR-001-compatibilidad-multi-runtime-por-instalacion-no.md) — Compatibilidad multi-runtime por instalación, no por duplicación
- [[NFR-002-independencia-del-cliente-de-ia-en-el-texto-de-los]] — [NFR-002-independencia-del-cliente-de-ia-en-el-texto-de-los.md](requirements/non-functional/NFR-002-independencia-del-cliente-de-ia-en-el-texto-de-los.md) — Independencia del cliente de IA en el texto de los skills
- [[NFR-003-markdown-como-lenguaje-de-definicion]] — [NFR-003-markdown-como-lenguaje-de-definicion.md](requirements/non-functional/NFR-003-markdown-como-lenguaje-de-definicion.md) — Markdown como lenguaje de definición
- [[NFR-004-superficie-ejecutable-minima-en-node-js]] — [NFR-004-superficie-ejecutable-minima-en-node-js.md](requirements/non-functional/NFR-004-superficie-ejecutable-minima-en-node-js.md) — Superficie ejecutable mínima en Node.js
- [[NFR-005-sistema-de-archivos-como-unica-capa-de]] — [NFR-005-sistema-de-archivos-como-unica-capa-de.md](requirements/non-functional/NFR-005-sistema-de-archivos-como-unica-capa-de.md) — Sistema de archivos como única capa de persistencia
- [[NFR-006-control-de-ciclo-de-vida-con-status-substatus]] — [NFR-006-control-de-ciclo-de-vida-con-status-substatus.md](requirements/non-functional/NFR-006-control-de-ciclo-de-vida-con-status-substatus.md) — Control de ciclo de vida con `status` + `substatus`
- [[NFR-007-limite-de-trabajo-en-curso-por-nivel]] — [NFR-007-limite-de-trabajo-en-curso-por-nivel.md](requirements/non-functional/NFR-007-limite-de-trabajo-en-curso-por-nivel.md) — Límite de trabajo en curso por nivel
- [[NFR-008-gates-secuenciales-con-precondiciones-explicitas]] — [NFR-008-gates-secuenciales-con-precondiciones-explicitas.md](requirements/non-functional/NFR-008-gates-secuenciales-con-precondiciones-explicitas.md) — Gates secuenciales con precondiciones explícitas
- [[NFR-009-metadatos-de-trazabilidad-en-todos-los-documentos]] — [NFR-009-metadatos-de-trazabilidad-en-todos-los-documentos.md](requirements/non-functional/NFR-009-metadatos-de-trazabilidad-en-todos-los-documentos.md) — Metadatos de trazabilidad en todos los documentos generados
- [[NFR-010-navegacion-por-indice-y-wikilinks]] — [NFR-010-navegacion-por-indice-y-wikilinks.md](requirements/non-functional/NFR-010-navegacion-por-indice-y-wikilinks.md) — Navegación por índice y wikilinks
- [[NFR-011-niveles-de-confianza-explicitos-en-contenido]] — [NFR-011-niveles-de-confianza-explicitos-en-contenido.md](requirements/non-functional/NFR-011-niveles-de-confianza-explicitos-en-contenido.md) — Niveles de confianza explícitos en contenido inferido
- [[NFR-012-output-parcial-ante-datos-insuficientes]] — [NFR-012-output-parcial-ante-datos-insuficientes.md](requirements/non-functional/NFR-012-output-parcial-ante-datos-insuficientes.md) — Output parcial ante datos insuficientes
- [[NFR-013-composicion-inline-y-un-solo-salto-de-delegacion]] — [NFR-013-composicion-inline-y-un-solo-salto-de-delegacion.md](requirements/non-functional/NFR-013-composicion-inline-y-un-solo-salto-de-delegacion.md) — Composición inline y un solo salto de delegación
- [[NFR-014-contrato-tmp-skill-name-contra-el-telefono]] — [NFR-014-contrato-tmp-skill-name-contra-el-telefono.md](requirements/non-functional/NFR-014-contrato-tmp-skill-name-contra-el-telefono.md) — Contrato `.tmp/<skill-name>/` contra el «teléfono descompuesto»
- [[NFR-015-templates-y-assets-como-contrato-de-interfaz]] — [NFR-015-templates-y-assets-como-contrato-de-interfaz.md](requirements/non-functional/NFR-015-templates-y-assets-como-contrato-de-interfaz.md) — Templates y assets como contrato de interfaz
- [[NFR-016-casos-de-prueba-declarados-por-skill]] — [NFR-016-casos-de-prueba-declarados-por-skill.md](requirements/non-functional/NFR-016-casos-de-prueba-declarados-por-skill.md) — Casos de prueba declarados por skill
- [[NFR-017-definition-of-done-como-gate-ejecutable]] — [NFR-017-definition-of-done-como-gate-ejecutable.md](requirements/non-functional/NFR-017-definition-of-done-como-gate-ejecutable.md) — Definition of Done como gate ejecutable
- [[NFR-018-verificacion-demostrada-no-declarada]] — [NFR-018-verificacion-demostrada-no-declarada.md](requirements/non-functional/NFR-018-verificacion-demostrada-no-declarada.md) — Verificación demostrada, no declarada
- [[NFR-019-escaneo-de-seguridad-de-skills-en-ci]] — [NFR-019-escaneo-de-seguridad-de-skills-en-ci.md](requirements/non-functional/NFR-019-escaneo-de-seguridad-de-skills-en-ci.md) — Escaneo de seguridad de skills en CI
- [[NFR-020-ausencia-de-secretos-en-el-paquete-distribuido]] — [NFR-020-ausencia-de-secretos-en-el-paquete-distribuido.md](requirements/non-functional/NFR-020-ausencia-de-secretos-en-el-paquete-distribuido.md) — Ausencia de secretos en el paquete distribuido
- [[NFR-021-limite-de-preguntas-por-ronda-de-entrevista]] — [NFR-021-limite-de-preguntas-por-ronda-de-entrevista.md](requirements/non-functional/NFR-021-limite-de-preguntas-por-ronda-de-entrevista.md) — Límite de preguntas por ronda de entrevista
- [[NFR-022-flags-para-modos-alternativos-de-ejecucion]] — [NFR-022-flags-para-modos-alternativos-de-ejecucion.md](requirements/non-functional/NFR-022-flags-para-modos-alternativos-de-ejecucion.md) — Flags para modos alternativos de ejecución
- [[NFR-023-idempotencia-declarada-de-los-skills-de]] — [NFR-023-idempotencia-declarada-de-los-skills-de.md](requirements/non-functional/NFR-023-idempotencia-declarada-de-los-skills-de.md) — Idempotencia declarada de los skills de inicialización
- [[NFR-024-entorno-de-desarrollo-reproducible-con-docker]] — [NFR-024-entorno-de-desarrollo-reproducible-con-docker.md](requirements/non-functional/NFR-024-entorno-de-desarrollo-reproducible-con-docker.md) — Entorno de desarrollo reproducible con Docker

---

## 🗂️ Especificaciones (specs/)

- [[specs-index]] — [README.md](specs/README.md) — Especificaciones

### L3 — Proyecto (specs/01-projects/)

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
- [[EPIC-21-colapsar-specs-dos-niveles]] — [epic.md](specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md) — Colapsar specs/ a dos niveles y eliminar 01-projects/
- [insight-colapsar-specs-dos-niveles.md](specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/insight-colapsar-specs-dos-niveles.md) — 📊 Cambio sugerido: Colapsar specs a dos niveles y eliminar 01-projects ⚠️ sin frontmatter
- [[EPIC-22-epic-analyze]] — [epic.md](specs/02-epics/EPIC-22-epic-analyze/epic.md) — Skill `epic-analyze`: análisis de una épica antes de desarrollarla

### L1 — Historias de usuario (specs/03-stories/)

> **Convención de directorio:** cada `STORY-NNN-*/` contiene `story.md` como nodo principal y, según la
> fase alcanzada, puede contener además `analyze.md`, `design.md`, `tasks.md`, `testcases.md`,
> `*-report.md`, `fix-directives.md` o `finvest-evaluation-report.md`. Esos artefactos derivados no se
> enumeran aquí: se leen desde el directorio de la historia. Los templates (`templates/`) tampoco se
> listan porque sus wikilinks son placeholders.

- [[STORY-001-project-begin]] — [story.md](specs/03-stories/STORY-001-project-begin/story.md) — project-begin — Captura de intención inicial del proyecto
- [[STORY-003-project-discovery]] — [story.md](specs/03-stories/STORY-003-project-discovery/story.md) — project-discovery — Discovery de usuarios y especificación de requisitos
- [[STORY-004-project-planning]] — [story.md](specs/03-stories/STORY-004-project-planning/story.md) — project-planning — Planificación de releases y backlog
- [[STORY-005-project-story-mapping]] — [story.md](specs/03-stories/STORY-005-project-story-mapping/story.md) — project-story-mapping — User Story Mapping según Jeff Patton
- [[STORY-006-story-creation]] — [story.md](specs/03-stories/STORY-006-story-creation/story.md) — story-creation — Crear historias de usuario
- [[STORY-007-story-evaluation]] — [story.md](specs/03-stories/STORY-007-story-evaluation/story.md) — story-evaluation ó Evaluación FINVEST de historias
- [[STORY-008-control-wip]] — [story.md](specs/03-stories/STORY-008-control-wip/story.md) — Control WIP=1 — Detección de proyecto activo
- [[STORY-010-gates-de-revision]] — [story.md](specs/03-stories/STORY-010-gates-de-revision/story.md) — Gates de Revisión Humana entre fases del pipeline
- [[STORY-011-project-planning-mejorado]] — [story.md](specs/03-stories/STORY-011-project-planning-mejorado/story.md) — project-planning mejorado — Integración con story mapping
- [[STORY-012-story-split]] — [story.md](specs/03-stories/STORY-012-story-split/story.md) — story-split ó Dividir ópicas en historias pequeóas
- [[STORY-013-story-refine]] — [story.md](specs/03-stories/STORY-013-story-refine/story.md) — story-refine — Refinamiento iterativo de historias de usuario
- [[STORY-015-project-flow]] — [story.md](specs/03-stories/STORY-015-project-flow/story.md) — project-flow — Orquestador del pipeline completo ProjectSpecFactory
- [[STORY-017-reverse-engineering]] — [story.md](specs/03-stories/STORY-017-reverse-engineering/story.md) — reverse-engineering — Skill orquestador de ingeniería inversa
- [[STORY-018-agente-reverse-engineer-architect]] — [story.md](specs/03-stories/STORY-018-agente-reverse-engineer-architect/story.md) — Agente reverse-engineer-architect
- [[STORY-019-agente-reverse-engineer-product-discovery]] — [story.md](specs/03-stories/STORY-019-agente-reverse-engineer-product-discovery/story.md) — Agente reverse-engineer-product-discovery
- [[STORY-020-agente-reverse-engineer-business-analyst]] — [story.md](specs/03-stories/STORY-020-agente-reverse-engineer-business-analyst/story.md) — Agente reverse-engineer-business-analyst
- [[STORY-021-agente-reverse-engineer-ux-flow-mapper]] — [story.md](specs/03-stories/STORY-021-agente-reverse-engineer-ux-flow-mapper/story.md) — Agente reverse-engineer-ux-flow-mapper
- [[STORY-022-agente-reverse-engineer-synthesizer]] — [story.md](specs/03-stories/STORY-022-agente-reverse-engineer-synthesizer/story.md) — Agente reverse-engineer-synthesizer
- [[STORY-023-scope-acotado-focus]] — [story.md](specs/03-stories/STORY-023-scope-acotado-focus/story.md) — Scope acotado — Flag --focus para reverse-engineering
- [[STORY-024-modo-incremental-update]] — [story.md](specs/03-stories/STORY-024-modo-incremental-update/story.md) — Modo incremental — Flag --update para reverse-engineering
- [[STORY-027-validacion-de-formato-de-release]] — [story.md](specs/03-stories/STORY-027-validacion-de-formato-de-release/story.md) — Validación de formato de Release
- [[STORY-028-generar-releases]] — [story.md](specs/03-stories/STORY-028-generar-releases/story.md) — Generar releases desde project-plan
- [[STORY-029-generar-stories]] — [story.md](specs/03-stories/STORY-029-generar-stories/story.md) — Generar stories desde archivo de release
- [[STORY-030-soporte-atlassian-rovo]] — [story.md](specs/03-stories/STORY-030-soporte-atlassian-rovo/story.md) — Soporte Atlassian Rovo — Agente story-creator
- [[STORY-032-soporte-atlassian-rovo-para-validar-release]] — [story.md](specs/03-stories/STORY-032-soporte-atlassian-rovo-para-validar-release/story.md) — Soporte Atlassian Rovo para Validar Release
- [[STORY-033-soporte-atlassian-rovo-para-crear-epic-release]] — [story.md](specs/03-stories/STORY-033-soporte-atlassian-rovo-para-crear-epic-release/story.md) — Soporte Atlassian Rovo para crear Epic Release
- [[STORY-034-rovo-agent-release-reverse-generator]] — [story.md](specs/03-stories/STORY-034-rovo-agent-release-reverse-generator/story.md) — Rovo Agent Release Reverse Generator from children
- [[STORY-035-generar-stories-todos-releases]] — [story.md](specs/03-stories/STORY-035-generar-stories-todos-releases/story.md) — Generar stories de todos los releases en batch
- [[STORY-036-openspec-init-config]] — [story.md](specs/03-stories/STORY-036-openspec-init-config/story.md) — Inicializar configuración de OpenSpec automáticamente
- [[STORY-037-generar-baseline-openspec-inversa]] — [story.md](specs/03-stories/STORY-037-generar-baseline-openspec-inversa/story.md) — Generar línea base de OpenSpec mediante ingeniería inversa
- [[STORY-038-copy-templates-to-skills]] — [story.md](specs/03-stories/STORY-038-copy-templates-to-skills/story.md) — Copiar los templates a los skills correspondientes
- [[STORY-039-publicar-framework-en-npm]] — [story.md](specs/03-stories/STORY-039-publicar-framework-en-npm/story.md) — Publicar framework en npm
- [[STORY-040-instalar-skills-via-postinstall]] — [story.md](specs/03-stories/STORY-040-instalar-skills-via-postinstall/story.md) — Instalar skills via postinstall (script)
- [[STORY-041-npm-install-locally]] — [story.md](specs/03-stories/STORY-041-npm-install-locally/story.md) — Npm Install locally
- [[STORY-042-readme-builder]] — [story.md](specs/03-stories/STORY-042-readme-builder/story.md) — README.md builder
- [[STORY-043-header-aggregation]] — [story.md](specs/03-stories/STORY-043-header-aggregation/story.md) — Encabezado de archivos spec con metadata de estado (header-aggregation)
- [[STORY-044-directorio-docs-tipo-wiki]] — [story.md](specs/03-stories/STORY-044-directorio-docs-tipo-wiki/story.md) — Directorio docs tipo wiki
- [[STORY-046-publicar-npm-con-github-actions]] — [story.md](specs/03-stories/STORY-046-publicar-npm-con-github-actions/story.md) — GitHub Actions CI/CD
- [[STORY-047-skills-multicliente-rutas-relativas]] — [story.md](specs/03-stories/STORY-047-skills-multicliente-rutas-relativas/story.md) — Skills con templates Multicliente
- [[STORY-048-refactor-migrates-templates-to-assets]] — [story.md](specs/03-stories/STORY-048-refactor-migrates-templates-to-assets/story.md) — Refactoring - Migración de templates a assets en Skills
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
- [[plan-01]] — [plan-01.md](specs/03-stories/STORY-084-skill-verify/plan-01.md) — Plan: Crear el skill skill-verify
- [[plan-02]] — [plan-02.md](specs/03-stories/STORY-084-skill-verify/plan-02.md) — Plan: Añadir modo benchmark a skill-verify
- [plan-03.md](specs/03-stories/STORY-084-skill-verify/plan-03.md) — plan-03 ⚠️ sin frontmatter
- [[STORY-084-skill-verify]] — [story.md](specs/03-stories/STORY-084-skill-verify/story.md) — Unificar generación, ejecución y benchmark de evals en `skill-test-evals`
- [[plan-integrar-config-sddf-init]] — [plan.md](specs/03-stories/STORY-085-integrar-config-sddf-init/plan.md) — Plan: Integrar sddf.config.yaml en el skill sddf-init
- [[STORY-085-integrar-config-sddf-init]] — [story.md](specs/03-stories/STORY-085-integrar-config-sddf-init/story.md) — Mejora de experiencia de inicialización
- [[plan-01-refactor-release-to-epic]] — [plan-01-refactor-release-to-epic.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-01-refactor-release-to-epic.md) — PLAN: Renombrar el nivel L2 de `release` a `epic`
- [[plan-02-refactor-dev-levels]] — [plan-02-refactor-dev-levels.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-02-refactor-dev-levels.md) — PLAN: Reestructurar `docs/specs/` a niveles numerados (`01-projects/`, `02-epics/`, `03-stories/`)
- [[plan-03-refactor-feat-to-story]] — [plan-03-refactor-feat-to-story.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-03-refactor-feat-to-story.md) — PLAN: Renombrar el prefijo de historias de `FEAT-NNN` a `STORY-NNN`
- [[plan-04-fix-insights]] — [plan-04-fix-insights.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-04-fix-insights.md) — Cierre de la migración release→epic / FEAT→STORY: alinear gate, evals y documentación normativa
- [[plan-05-findings-and-remediation-plan]] — [plan-05-findings-and-remediation-plan.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-05-findings-and-remediation-plan.md) — Revisión de STORY-086 — hallazgos y plan de remediación
- [[plan-06-update-project]] — [plan-06-update-project.md](specs/03-stories/STORY-086-refactor-release-to-epic/plan-06-update-project.md) — Plan — Reescribir `project.md` contra la realidad + runbook del proceso
- [[STORY-086-refactor-release-to-epic]] — [story.md](specs/03-stories/STORY-086-refactor-release-to-epic/story.md) — Renombrar el nivel L2 de release a épica y numerar los directorios de specs
- [[STORY-087-error-in-npm-install-locally]] — [story.md](specs/03-stories/STORY-087-error-in-npm-install-locally/story.md) — Error en instalación local de npm install agile-sddf en Windows 11
- [[plan-01-decouple-security-audit]] — [plan-01-decouple-security-audit.md](specs/03-stories/STORY-088-security-enhancement/plan-01-decouple-security-audit.md) — Desacoplar `story-code-review` del skill `security-audit`
- [plan-02-security.md](specs/03-stories/STORY-088-security-enhancement/plan-02-security.md) — plan-02-security ⚠️ sin frontmatter
- [[plan-04-fix-security-insights]] — [plan-04-fix-security-insights.md](specs/03-stories/STORY-088-security-enhancement/plan-04-fix-security-insights.md) — Cerrar los 8 hallazgos `(warn)` del `ai-security-checklist`
- [[STORY-088-security-enhancement]] — [story.md](specs/03-stories/STORY-088-security-enhancement/story.md) — Mejoras de seguridad
- [[plan-rechazo-nombra-ejecutor-correcciones]] — [plan.md](specs/03-stories/STORY-089-rechazo-nombra-ejecutor-correcciones/plan.md) — STORY-089 — Análisis y propuesta de cambio
- [[STORY-089-rechazo-nombra-ejecutor-correcciones]] — [story.md](specs/03-stories/STORY-089-rechazo-nombra-ejecutor-correcciones/story.md) — Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md
- [[STORY-090-campos-declarados-nombran-su-escritor]] — [story.md](specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/story.md) — Todo campo declarado en un template nombra a su escritor
- [[STORY-091-story-implement-modo-rework]] — [story.md](specs/03-stories/STORY-091-story-implement-modo-rework/story.md) — story-implement toma de la cola una historia rechazada y corrige en modo rework
- [[STORY-092-reglas-robustez-modo-rework]] — [story.md](specs/03-stories/STORY-092-reglas-robustez-modo-rework/story.md) — El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro
- [[STORY-093-raiz-configurable-preflight-diagnostico]] — [story.md](specs/03-stories/STORY-093-raiz-configurable-preflight-diagnostico/story.md) — Resolver una raíz configurable y usar preflight como diagnóstico
- [insights.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/insights.md) — insights ⚠️ sin frontmatter
- [[plan-01-fix-ci-security-audit]] — [plan-01-fix-ci-security-audit.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-01-fix-ci-security-audit.md) — Plan 01 — Corregir la cobertura y el fallo de la CI de seguridad
- [[plan-02-fix-postinstall-target-validation]] — [plan-02-fix-postinstall-target-validation.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-02-fix-postinstall-target-validation.md) — Plan 02 — Cerrar el traversal de `SDDF_TARGET` en `postinstall`
- [[plan-03-fix-evals-runner-false-greens]] — [plan-03-fix-evals-runner-false-greens.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-03-fix-evals-runner-false-greens.md) — Plan 03 — Cerrar falsos verdes del runner de evals
- [[plan-04-cerrar-hallazgos-pendientes-auditoria]] — [plan-04-cerrar-hallazgos-pendientes-auditoria.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-04-cerrar-hallazgos-pendientes-auditoria.md) — Plan 04 — Cerrar los hallazgos pendientes de la auditoría
- [[plan-05-move-dod-story]] — [plan-05-move-dod-story.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-05-move-dod-story.md) — Mover `dod-story.md` de `policies/` a `guardrails/dod-story-checklist.md`
- [[plan-06-constitution-as-root-in-docs]] — [plan-06-constitution-as-root-in-docs.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/plan-06-constitution-as-root-in-docs.md) — Constitución como raíz: mover `docs/policies/constitution.md` → `docs/constitution.md`
- [[STORY-094-refactory-and-fixing-insights]] — [story.md](specs/03-stories/STORY-094-refactory-and-fixing-insights/story.md) — Fix insight and Verificación de la instalación en Windows, macOS y Linux
- [[STORY-095-memory-system-index-alias]] — [story.md](specs/03-stories/STORY-095-memory-system-index-alias/story.md) — Crear el skill memory-system con el modo index y deprecar docs-wiki-builder
- [[STORY-096-memory-system-scaffold-ensure-rebuild]] — [story.md](specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/story.md) — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild
- [[STORY-097-memory-system-check-ci]] — [story.md](specs/03-stories/STORY-097-memory-system-check-ci/story.md) — Verificar la consistencia de la memoria con un modo check apto para CI
- [[STORY-098-memory-system-migrate-harness]] — [story.md](specs/03-stories/STORY-098-memory-system-migrate-harness/story.md) — Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate
- [[STORY-099-sddf-init-level-full]] — [story.md](specs/03-stories/STORY-099-sddf-init-level-full/story.md) — Inicializar la memoria completa desde sddf-init con el parámetro --level
- [[STORY-100-restaurar-documentos-canonicos-estados]] — [story.md](specs/03-stories/STORY-100-restaurar-documentos-canonicos-estados/story.md) — Restaurar los documentos canónicos de la máquina de estados borrados sin repuntar sus citas
- [[STORY-101-dod-story-por-etapa]] — [story.md](specs/03-stories/STORY-101-dod-story-por-etapa/story.md) — Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill
- [[STORY-102-renombrar-skill-sddf-constitution]] — [story.md](specs/03-stories/STORY-102-renombrar-skill-sddf-constitution/story.md) — Renombrar el skill project-policies-generation como sddf-constitution
- [epic-template.md](specs/03-stories/STORY-103-replace-the-epic-template/epic-template.md) — <título de la épica> ⚠️ slug placeholder
- [[STORY-103-replace-the-epic-template]] — [story.md](specs/03-stories/STORY-103-replace-the-epic-template/story.md) — Reemplazar el template de Epic por la versión minimalista y output-oriented
- [[STORY-104-migrar-project-intent-a-vision]] — [story.md](specs/03-stories/STORY-104-migrar-project-intent-a-vision/story.md) — Migrar project-intent.md a product/vision.md
- [[STORY-105-migrar-stakeholders-y-requisitos]] — [story.md](specs/03-stories/STORY-105-migrar-stakeholders-y-requisitos/story.md) — Migrar project.md a product/stakeholders.md y requirements/
- [[STORY-106-migrar-plan-a-roadmap]] — [story.md](specs/03-stories/STORY-106-migrar-plan-a-roadmap/story.md) — Migrar project-plan.md a product/roadmap.md
- [[STORY-107-migrar-story-map-y-diagrama-contexto]] — [story.md](specs/03-stories/STORY-107-migrar-story-map-y-diagrama-contexto/story.md) — Migrar story-map.md y context-diagram.puml
- [[STORY-108-renombrar-specs-sin-prefijos]] — [story.md](specs/03-stories/STORY-108-renombrar-specs-sin-prefijos/story.md) — Renombrar specs/02-epics/ → specs/epics/ y specs/03-stories/ → specs/stories/
- [[STORY-109-project-begin-escribe-vision]] — [story.md](specs/03-stories/STORY-109-project-begin-escribe-vision/story.md) — project-begin escribe la intención en product/vision.md
- [[STORY-110-discovery-escribe-stakeholders-y-requisitos]] — [story.md](specs/03-stories/STORY-110-discovery-escribe-stakeholders-y-requisitos/story.md) — project-discovery y reverse-engineering escriben stakeholders y requisitos individuales
- [[STORY-111-planning-escribe-roadmap]] — [story.md](specs/03-stories/STORY-111-planning-escribe-roadmap/story.md) — project-planning escribe en product/roadmap.md y epic-from-project-plan lee de allí
- [[STORY-112-story-map-y-diagrama-en-sus-capas]] — [story.md](specs/03-stories/STORY-112-story-map-y-diagrama-en-sus-capas/story.md) — project-story-mapping y project-context-diagram escriben en product/ y architecture/c4/
- [[STORY-113-project-flow-sin-01-projects]] — [story.md](specs/03-stories/STORY-113-project-flow-sin-01-projects/story.md) — project-flow, sddf-init y header-aggregation sin specs/01-projects/
- [[STORY-114-migrate-specs-3-levels]] — [story.md](specs/03-stories/STORY-114-migrate-specs-3-levels/story.md) — Implementar memory-system migrate --from=specs-3-levels
- [[STORY-115-scaffold-dos-niveles-y-capas-destino]] — [story.md](specs/03-stories/STORY-115-scaffold-dos-niveles-y-capas-destino/story.md) — Actualizar scaffolding de memory-system a specs/ de dos niveles
- [[STORY-116-documentar-modelo-dos-niveles]] — [story.md](specs/03-stories/STORY-116-documentar-modelo-dos-niveles/story.md) — Actualizar documentación canónica al modelo de dos niveles
- [[STORY-117-verificar-cierre-epic-21]] — [story.md](specs/03-stories/STORY-117-verificar-cierre-epic-21/story.md) — Verificar sddf.config.yaml y los modos SDD sobre la estructura de dos niveles
- [[STORY-118-requirements-srs-unico-primero]] — [story.md](specs/03-stories/STORY-118-requirements-srs-unico-primero/story.md) — Adoptar la estrategia 'SRS único primero, fragmentación cuando duela' en requirements/
- [[STORY-119-story-plan-un-subagente-por-paso]] — [story.md](specs/03-stories/STORY-119-story-plan-un-subagente-por-paso/story.md) — Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens
- [testing-report-01.md](specs/03-stories/STORY-119-story-plan-un-subagente-por-paso/testing-report-01.md) — Testing de STORY-119: Prueba 1 ⚠️ sin frontmatter
- [testing-report-02.md](specs/03-stories/STORY-119-story-plan-un-subagente-por-paso/testing-report-02.md) — Testing de STORY-119: Prueba 2 ⚠️ sin frontmatter
- [[STORY-120-epic-analyze-integridad-historias]] — [story.md](specs/03-stories/STORY-120-epic-analyze-integridad-historias/story.md) — Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo
- [[STORY-121-epic-analyze-cobertura-criterios-salida]] — [story.md](specs/03-stories/STORY-121-epic-analyze-cobertura-criterios-salida/story.md) — Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias
- [[STORY-122-epic-analyze-madurez-historias-hijas]] — [story.md](specs/03-stories/STORY-122-epic-analyze-madurez-historias-hijas/story.md) — Señalar historias hijas no especificadas o con referencias rotas al analizar una épica
- [[STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo]] — [story.md](specs/03-stories/STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo/story.md) — Reubicar las secciones restantes de project.md y eliminarlo

---

## 🧭 Dominio y arquitectura

### Dominios (domains/)

- [[domains-index]] — [README.md](domains/README.md) — Documentación de Dominios — Framework SDDF
- [[domain-epic-lifecycle]] — [domain-epic-lifecycle.md](domains/domain-epic-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Epic (Epic Lifecycle)
- [[domain-knowledge-artifacts]] — [domain-knowledge-artifacts.md](domains/domain-knowledge-artifacts.md) — Documentación del Dominio: Artefactos de Conocimiento (Knowledge Artifacts)
- [[domain-project-lifecycle]] — [domain-project-lifecycle.md](domains/domain-project-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Project (Project Lifecycle)
- [[domain-skills-map]] — [domain-skills-map.md](domains/domain-skills-map.md) — Mapa de skills por nivel del pipeline
- [[domain-state-management]] — [domain-state-management.md](domains/domain-state-management.md) — Documentación del Dominio: Gestión de Estados (State Management)
- [[domain-story-lifecycle]] — [domain-story-lifecycle.md](domains/domain-story-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Story (Story Lifecycle)
- [[domain-work-item-hierarchy]] — [domain-work-item-hierarchy.md](domains/domain-work-item-hierarchy.md) — Documentación del Dominio: Jerarquía de Work Items (Work Item Hierarchy)
- [[domain]] — [domain.md](domains/domain.md) — Agile SDDF — Contexto de dominio

### Arquitectura (architecture/)

- [[architecture-index]] — [README.md](architecture/README.md) — Índice de arquitectura del framework SDDF
- [[memory-system]] — [memory-system.md](architecture/memory-system.md) — Sistema de Memoria del Framework SDDF
- [[sdcl-sddf]] — [sdcl-sddf.md](architecture/sdcl-sddf.md) — Correspondencia SDLC clásico ↔ SDDF
- [[sddf-architecture]] — [sddf-architecture.md](architecture/sddf-architecture.md) — Arquitectura del Framework SDDF
- [[state-machine]] — [state-machine.md](architecture/state-machine.md) — Máquina de estados del framework SDDF
- [[tech-stack]] — [tech-stack.md](architecture/tech-stack.md) — Stack Tecnológico SDDF

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
- [[archivos-canonicos-por-tipo]] — [ADR-0011-archivos-canonicos-por-tipo.md](adr/ADR-0011-archivos-canonicos-por-tipo.md) — Los archivos canónicos de work items se nombran por tipo (story.md, epic.md, project.md)
- [[escritor-en-templates-de-autoria-manual]] — [ADR-0012-escritor-en-templates-de-autoria-manual.md](adr/ADR-0012-escritor-en-templates-de-autoria-manual.md) — Los templates de autoría manual anotan `escritor: autoría manual` en línea completa
- [[eliminar-specs-01-projects]] — [ADR-0013-eliminar-specs-01-projects.md](adr/ADR-0013-eliminar-specs-01-projects.md) — Eliminar `specs/01-projects/` y migrar su contenido a `product/` y `requirements/`
- [[adr-index]] — [README.md](adr/README.md) — Índice de Architecture Decision Records (ADRs)
- [adr-template.md](adr/adr-template.md) — <Título de la decisión> ⚠️ slug placeholder

---

## 📖 Guías y operación

### Guías (guides/)

- [[guides-index]] — [README.md](guides/README.md) — Índice de Guías
- [[agent-harness-guide]] — [agent-harness-guide.md](guides/agent-harness-guide.md) — Guía de Agent Harness
- [[artifact-directory-migration]] — [artifact-directory-migration.md](guides/artifact-directory-migration.md) — Guía de migración — nueva estructura de directorios de artefactos SDDF
- [[best-practices-for-agents]] — [best-practices-for-agents.md](guides/best-practices-for-agents.md) — Buenas prácticas para Agentes
- [[best-practices-for-commands]] — [best-practices-for-commands.md](guides/best-practices-for-commands.md) — Buenas prácticas para LLM Clients: Comandos
- [[best-practices-for-skill-testing]] — [best-practices-for-skill-testing.md](guides/best-practices-for-skill-testing.md) — Pruebas de skills
- [[best-practices-for-skills]] — [best-practices-for-skills.md](guides/best-practices-for-skills.md) — Buenas prácticas para LLM Clients: Skills
- [[best-practices-for-system-prompt]] — [best-practices-for-system-prompt.md](guides/best-practices-for-system-prompt.md) — Mejores prácticas para el prompt de sistema
- [[best-practices-for-testing]] — [best-practices-for-testing.md](guides/best-practices-for-testing.md) — Mejores Prácticas para Pruebas de Software
- [[branching-strategy-sddf-git-flow]] — [branching-strategy-sddf-git-flow.md](guides/branching-strategy-sddf-git-flow.md) — Modelo de Branching SDDF git flow
- [[custom-agent-creation-guide]] — [custom-agent-creation-guide.md](guides/custom-agent-creation-guide.md) — Guía de Creación de Custom Agents
- [[custom-skill-creation-guide]] — [custom-skill-creation-guide.md](guides/custom-skill-creation-guide.md) — Guía de Creación de Skills Personalizados
- [[custom-system-prompt-guide]] — [custom-system-prompt-guide.md](guides/custom-system-prompt-guide.md) — Guía para la creación de System Prompts (AGENTS.md, CLAUDE.md, etc.)
- [[extreme-agile]] — [extreme-agile.md](guides/extreme-agile.md) — Agilidad Agentica (Agentic Agile)
- [[flight-leves-model]] — [flight-leves-model.md](guides/flight-leves-model.md) — Modelo de Niveles de Vuelo (Flight Levels Model)
- [[harness-engineering]] — [harness-eng-agents-orchestration.md](guides/harness-eng-agents-orchestration.md) — Harness Engineering: Orquestación de Skills y Agentes en Claude Code
- [[harness-engineering-guide]] — [harness-engineering-guide.md](guides/harness-engineering-guide.md) — Guía de Harness Engineering
- [[organization-of-artifacts]] — [organization-of-artifacts.md](guides/organization-of-artifacts.md) — Reglas de la estrategia de organización de artefactos (SDDF)
- [[root-folder-practices]] — [root-folder-practices.md](guides/root-folder-practices.md) — Prácticas para resolver la raíz de artefactos SDDF
- [[sdd]] — [sdd.md](guides/sdd.md) — Spec Driven Development (SDD)
- [[sddf-commands-pipeline]] — [sddf-commands-pipeline.md](guides/sddf-commands-pipeline.md) — Flujos principales SDDF
- [[skill-structural-pattern]] — [skill-structural-pattern.md](guides/skill-structural-pattern.md) — Patrones estructurales de Skills (Skill Structural patterns)
- [[specs-and-workflows]] — [specs-and-workflows.md](guides/specs-and-workflows.md) — Specs y Workflows

### Runbooks (runbooks/)

- [[runbooks-index]] — [README.md](runbooks/README.md) — Runbooks
- [[runbook-actualizar-spec-de-proyecto]] — [actualizar-spec-de-proyecto.md](runbooks/actualizar-spec-de-proyecto.md) — Runbook para actualizar la especificación de proyecto (project.md)
- [[docker-dev-container-with-security-scann]] — [docker-dev-container-with-security-scann.md](runbooks/docker-dev-container-with-security-scann.md) — Integrar Skill Shielder en Dockerfile.dev
- [[docker-dev-container]] — [docker-dev-container.md](runbooks/docker-dev-container.md) — Guía Completa: Entorno de Desarrollo React con Docker + VSCode Dev Containers
- [graphify.md](runbooks/graphify.md) — Runbook: Graphify ⚠️ sin frontmatter
- [[runbook-deployment-to-npm]] — [runbook-deployment-to-npm.md](runbooks/runbook-deployment-to-npm.md) — Runbook para despliegue en npm
- [tokenmeter.md](runbooks/tokenmeter.md) — Runbook: Tokenmeter ⚠️ sin frontmatter

---

## 🔗 Artefactos externos

Nodos de otros harnesses (OpenSpec, Spec-kit) indexados en modo solo lectura; sus rutas son relativas a este directorio.
El motor los agrupa con un subtítulo por origen (`OpenSpec — specs`, `OpenSpec — changes`, `Speckit — features`,
`Mapeados desde el harness`). Un slug externo que coincide con el de un nodo propio se indexa con sufijo `-external`.
Las capas que el harness ya modela (p. ej. `specs/` en Speckit y OpenSpec) aparecen como `_(gestionado por el harness)_`.

_(sin artefactos externos)_

---

## 📊 Estado del grafo

| Métrica | Valor |
|---------|-------|
| Nodos indexados | 356 |
| Nodos con frontmatter | 347 |
| Nodos sin frontmatter | 9 |
| Wikilinks pendientes | 15 |
| Enlaces locales, anchors y wikilinks de documentación activa | `node scripts/check-doc-links.js` |
| Última regeneración | ver `updated` en el frontmatter |

> El resultado de enlaces no se mantiene como un número manual: el checker lo genera y la CI lo exige.

---

*Generado por el skill `memory-system`. Regenera con `/memory-system index`.*

---

## ⚠️ Nodos pendientes

Wikilinks presentes en los nodos indexados cuyo slug no resuelve a ningún artefacto:

- [[ADR-0001]] ⚠️ nodo pendiente
- [[ADR-0003-workflow-canonico-story-y-epic]] ⚠️ nodo pendiente
- [[ADR-0007]] ⚠️ nodo pendiente
- [[ADR-0007-templates-como-capa-propia]] ⚠️ nodo pendiente
- [[ADR-0010]] ⚠️ nodo pendiente
- [[ADR-0010-specs-dentro-de-docs]] ⚠️ nodo pendiente
- [[ADR-0011]] ⚠️ nodo pendiente
- [[ADR-0011-archivos-canonicos-por-tipo]] ⚠️ nodo pendiente
- [[ADR-0013-eliminar-specs-01-projects]] ⚠️ nodo pendiente
- [[STORY-100-slug]] ⚠️ nodo pendiente
- [[project-template]] ⚠️ nodo pendiente
- [[release-spec-template]] ⚠️ nodo pendiente
- [[security-checklist]] ⚠️ nodo pendiente
- [[skill-preflight]] ⚠️ nodo pendiente
- [[story-template]] ⚠️ nodo pendiente
