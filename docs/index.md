---
type: wiki
slug: index
title: "Índice de documentación"
status: IN-PROGRESS
substatus: IN-PROGRESS
parent: null
updated: 2026-11-18
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
- [[validation-contract-policy]] — [validation-contract-policy.md](policies/validation-contract-policy.md) — Política de contrato de validación

### Guardrails (guardrails/)

- [[guardrails-index]] — [README.md](guardrails/README.md) — Índice de Guardrails
- [[dod-epic-ship]] — [dod-epic-ship.md](guardrails/dod-epic-ship.md) — DoD SHIP — Epic (transition guardrail)
- [[dod-epic-validate]] — [dod-epic-validate.md](guardrails/dod-epic-validate.md) — DoD VALIDATE — Epic (transition guardrail)
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

- [[PROJ-01-agile-sddf]] — [PROJ-01-agile-sddf.md](product/PROJ-01-agile-sddf.md) — Redirección de PROJ-01-agile-sddf
- [[product-index]] — [README.md](product/README.md) — Producto
- [[objectives]] — [objectives.md](product/objectives.md) — Objetivos
- [[person-users]] — [person-users.md](product/person-users.md) — Persona de usuario
- [[roadmap]] — [roadmap.md](product/roadmap.md) — Roadmap del producto
- [[stakeholders]] — [stakeholders.md](product/stakeholders.md) — Stakeholders
- [[story-map]] — [story-map.md](product/story-map.md) — Story Map — Agile SDDF (Spec-Driven Development Framework)
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
- [[requirements-catalog]] — [index.md](requirements/index.md) — Catálogo de requisitos
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

## 🗂️ Work items (changes/)

- [[changes-index]] — [README.md](../changes/README.md) — Flujo de cambios

### Épicas

- [[EPIC-030-separar-changes-de-specs]] — [epic.md](../changes/archive/2026-11-22-EPIC-030-separar-changes-de-specs/epic.md) — Separar changes/ de la especificación viva

### Historias de usuario

> **Convención de directorio:** cada `STORY-NNN-*/` contiene `story.md` como nodo principal y, según la
> fase alcanzada, puede contener además `analyze.md`, `design.md`, `tasks.md`, `testcases.md`,
> `*-report.md`, `fix-directives.md` o `finvest-evaluation-report.md`. Esos artefactos derivados no se
> enumeran aquí: se leen desde el directorio de la historia. Los templates (`templates/`) tampoco se
> listan porque sus wikilinks son placeholders.

- [[STORY-194-adr-0023-aceptado]] — [story.md](../changes/archive/2026-11-22-STORY-194-adr-0023-aceptado/story.md) — Aceptar ADR-0023
- [[STORY-195-contrato-de-layout-con-changes]] — [story.md](../changes/archive/2026-11-22-STORY-195-contrato-de-layout-con-changes/story.md) — Contrato de layout y gate determinista con changes/
- [[STORY-196-scripts-y-mudanza-a-changes]] — [story.md](../changes/archive/2026-11-22-STORY-196-scripts-y-mudanza-a-changes/story.md) — Scripts deterministas y mudanza a changes/
- [[STORY-197-skills-de-especificacion-y-epica]] — [story.md](../changes/archive/2026-11-22-STORY-197-skills-de-especificacion-y-epica/story.md) — Skills de especificación y épica sobre changes/
- [[STORY-198-skills-de-planning-a-entrega]] — [story.md](../changes/archive/2026-11-22-STORY-198-skills-de-planning-a-entrega/story.md) — Skills de planning a entrega sobre changes/
- [[STORY-199-sddf-init-y-preflight-adr-0023]] — [story.md](../changes/archive/2026-11-22-STORY-199-sddf-init-y-preflight-adr-0023/story.md) — sddf-init y skill-preflight con el layout de ADR-0023
- [[STORY-200-documentacion-y-migracion-a-6-0-0]] — [story.md](../changes/archive/2026-11-22-STORY-200-documentacion-y-migracion-a-6-0-0/story.md) — Documentación y migración a 6.0.0

### Épicas e historias archivadas (archive/)

- [[EPIC-00-estructura-base-y-mecanismo-de-templates]] — [epic.md](../changes/archive/2026-04-09-EPIC-00-estructura-base-y-mecanismo-de-templates/epic.md) — Release 00 — Estructura Base y Mecanismo de Templates
- [[EPIC-01-features-spec-builder]] — [epic.md](../changes/archive/2026-04-09-EPIC-01-features-spec-builder/epic.md) — Release 01 — Features Spec Builder
- [[EPIC-02-project-spec-builder]] — [epic.md](../changes/archive/2026-04-16-EPIC-02-project-spec-builder/epic.md) — Release 02 — Project Spec Builder (Pipeline de proyecto)
- [[EPIC-03-reverse-engineering]] — [epic.md](../changes/archive/2026-04-16-EPIC-03-reverse-engineering/epic.md) — Release 03 — Reverse Engineering (Ingeniería inversa)
- [[EPIC-04-refactor-features-spec-builder]] — [epic.md](../changes/archive/2026-04-17-EPIC-04-refactor-features-spec-builder/epic.md) — Release 04 — Refactor Features Spec Builder (Consolidación y calidad)
- [[EPIC-05-enhance-project-spec]] — [epic.md](../changes/archive/2026-04-18-EPIC-05-enhance-project-spec/epic.md) — Release 05 — Enhance Project Spec (Expansión project spec)
- [[EPIC-06-release-and-story-generator]] — [epic.md](../changes/archive/2026-04-20-EPIC-06-release-and-story-generator/epic.md) — Release 06 — Release & Story Generator
- [[EPIC-07-publicacion-framework-npm]] — [epic.md](../changes/archive/2026-04-20-EPIC-07-publicacion-framework-npm/epic.md) — Release 07 — Publicación del Framework SDDF como Paquete NPM
- [[EPIC-08-npm-install-locally]] — [epic.md](../changes/archive/2026-04-20-EPIC-08-npm-install-locally/epic.md) — Release 08 — Npm Install locally
- [[STORY-001-project-begin]] — [story.md](../changes/archive/2026-04-22-STORY-001-project-begin/story.md) — project-begin — Captura de intención inicial del proyecto
- [[STORY-003-project-discovery]] — [story.md](../changes/archive/2026-04-22-STORY-003-project-discovery/story.md) — project-discovery — Discovery de usuarios y especificación de requisitos
- [[STORY-004-project-planning]] — [story.md](../changes/archive/2026-04-22-STORY-004-project-planning/story.md) — project-planning — Planificación de releases y backlog
- [[STORY-005-project-story-mapping]] — [story.md](../changes/archive/2026-04-22-STORY-005-project-story-mapping/story.md) — project-story-mapping — User Story Mapping según Jeff Patton
- [[STORY-006-story-creation]] — [story.md](../changes/archive/2026-04-22-STORY-006-story-creation/story.md) — story-creation — Crear historias de usuario
- [[STORY-007-story-evaluation]] — [story.md](../changes/archive/2026-04-22-STORY-007-story-evaluation/story.md) — story-evaluation ó Evaluación FINVEST de historias
- [[STORY-008-control-wip]] — [story.md](../changes/archive/2026-04-22-STORY-008-control-wip/story.md) — Control WIP=1 — Detección de proyecto activo
- [[STORY-010-gates-de-revision]] — [story.md](../changes/archive/2026-04-22-STORY-010-gates-de-revision/story.md) — Gates de Revisión Humana entre fases del pipeline
- [[STORY-011-project-planning-mejorado]] — [story.md](../changes/archive/2026-04-22-STORY-011-project-planning-mejorado/story.md) — project-planning mejorado — Integración con story mapping
- [[STORY-012-story-split]] — [story.md](../changes/archive/2026-04-22-STORY-012-story-split/story.md) — story-split ó Dividir ópicas en historias pequeóas
- [[STORY-013-story-refine]] — [story.md](../changes/archive/2026-04-22-STORY-013-story-refine/story.md) — story-refine — Refinamiento iterativo de historias de usuario
- [[STORY-015-project-flow]] — [story.md](../changes/archive/2026-04-22-STORY-015-project-flow/story.md) — project-flow — Orquestador del pipeline completo ProjectSpecFactory
- [[STORY-017-reverse-engineering]] — [story.md](../changes/archive/2026-04-22-STORY-017-reverse-engineering/story.md) — reverse-engineering — Skill orquestador de ingeniería inversa
- [[STORY-018-agente-reverse-engineer-architect]] — [story.md](../changes/archive/2026-04-22-STORY-018-agente-reverse-engineer-architect/story.md) — Agente reverse-engineer-architect
- [[STORY-019-agente-reverse-engineer-product-discovery]] — [story.md](../changes/archive/2026-04-22-STORY-019-agente-reverse-engineer-product-discovery/story.md) — Agente reverse-engineer-product-discovery
- [[STORY-020-agente-reverse-engineer-business-analyst]] — [story.md](../changes/archive/2026-04-22-STORY-020-agente-reverse-engineer-business-analyst/story.md) — Agente reverse-engineer-business-analyst
- [[STORY-021-agente-reverse-engineer-ux-flow-mapper]] — [story.md](../changes/archive/2026-04-22-STORY-021-agente-reverse-engineer-ux-flow-mapper/story.md) — Agente reverse-engineer-ux-flow-mapper
- [[STORY-022-agente-reverse-engineer-synthesizer]] — [story.md](../changes/archive/2026-04-22-STORY-022-agente-reverse-engineer-synthesizer/story.md) — Agente reverse-engineer-synthesizer
- [[STORY-023-scope-acotado-focus]] — [story.md](../changes/archive/2026-04-22-STORY-023-scope-acotado-focus/story.md) — Scope acotado — Flag --focus para reverse-engineering
- [[STORY-024-modo-incremental-update]] — [story.md](../changes/archive/2026-04-22-STORY-024-modo-incremental-update/story.md) — Modo incremental — Flag --update para reverse-engineering
- [[STORY-027-validacion-de-formato-de-release]] — [story.md](../changes/archive/2026-04-22-STORY-027-validacion-de-formato-de-release/story.md) — Validación de formato de Release
- [[STORY-028-generar-releases]] — [story.md](../changes/archive/2026-04-22-STORY-028-generar-releases/story.md) — Generar releases desde project-plan
- [[STORY-029-generar-stories]] — [story.md](../changes/archive/2026-04-22-STORY-029-generar-stories/story.md) — Generar stories desde archivo de release
- [[STORY-030-soporte-atlassian-rovo]] — [story.md](../changes/archive/2026-04-22-STORY-030-soporte-atlassian-rovo/story.md) — Soporte Atlassian Rovo — Agente story-creator
- [[STORY-032-soporte-atlassian-rovo-para-validar-release]] — [story.md](../changes/archive/2026-04-22-STORY-032-soporte-atlassian-rovo-para-validar-release/story.md) — Soporte Atlassian Rovo para Validar Release
- [[STORY-033-soporte-atlassian-rovo-para-crear-epic-release]] — [story.md](../changes/archive/2026-04-22-STORY-033-soporte-atlassian-rovo-para-crear-epic-release/story.md) — Soporte Atlassian Rovo para crear Epic Release
- [[STORY-034-rovo-agent-release-reverse-generator]] — [story.md](../changes/archive/2026-04-22-STORY-034-rovo-agent-release-reverse-generator/story.md) — Rovo Agent Release Reverse Generator from children
- [[STORY-035-generar-stories-todos-releases]] — [story.md](../changes/archive/2026-04-22-STORY-035-generar-stories-todos-releases/story.md) — Generar stories de todos los releases en batch
- [[STORY-036-openspec-init-config]] — [story.md](../changes/archive/2026-04-23-STORY-036-openspec-init-config/story.md) — Inicializar configuración de OpenSpec automáticamente
- [[STORY-037-generar-baseline-openspec-inversa]] — [story.md](../changes/archive/2026-04-23-STORY-037-generar-baseline-openspec-inversa/story.md) — Generar línea base de OpenSpec mediante ingeniería inversa
- [[STORY-038-copy-templates-to-skills]] — [story.md](../changes/archive/2026-04-23-STORY-038-copy-templates-to-skills/story.md) — Copiar los templates a los skills correspondientes
- [[STORY-039-publicar-framework-en-npm]] — [story.md](../changes/archive/2026-04-23-STORY-039-publicar-framework-en-npm/story.md) — Publicar framework en npm
- [[STORY-040-instalar-skills-via-postinstall]] — [story.md](../changes/archive/2026-04-23-STORY-040-instalar-skills-via-postinstall/story.md) — Instalar skills via postinstall (script)
- [[STORY-041-npm-install-locally]] — [story.md](../changes/archive/2026-04-23-STORY-041-npm-install-locally/story.md) — Npm Install locally
- [[EPIC-09-docs-and-wiki-builders]] — [epic.md](../changes/archive/2026-04-25-EPIC-09-docs-and-wiki-builders/epic.md) — Release 09 — Docs and Wiki builders
- [[STORY-042-readme-builder]] — [story.md](../changes/archive/2026-04-25-STORY-042-readme-builder/story.md) — README.md builder
- [[STORY-043-header-aggregation]] — [story.md](../changes/archive/2026-04-25-STORY-043-header-aggregation/story.md) — Encabezado de archivos spec con metadata de estado (header-aggregation)
- [[STORY-087-error-in-npm-install-locally]] — [story.md](../changes/archive/2026-04-25-STORY-087-error-in-npm-install-locally/story.md) — Error en instalación local de npm install agile-sddf en Windows 11
- [[STORY-047-skills-multicliente-rutas-relativas]] — [story.md](../changes/archive/2026-04-26-STORY-047-skills-multicliente-rutas-relativas/story.md) — Skills con templates Multicliente
- [[STORY-044-directorio-docs-tipo-wiki]] — [story.md](../changes/archive/2026-04-27-STORY-044-directorio-docs-tipo-wiki/story.md) — Directorio docs tipo wiki
- [[STORY-046-publicar-npm-con-github-actions]] — [story.md](../changes/archive/2026-04-27-STORY-046-publicar-npm-con-github-actions/story.md) — GitHub Actions CI/CD
- [[STORY-048-refactor-migrates-templates-to-assets]] — [story.md](../changes/archive/2026-04-27-STORY-048-refactor-migrates-templates-to-assets/story.md) — Refactoring - Migración de templates a assets en Skills
- [[STORY-049-reading-of-sddf-root]] — [story.md](../changes/archive/2026-05-01-STORY-049-reading-of-sddf-root/story.md) — Lectura de SDDF_ROOT como ruta base de artefactos en skills SDDF
- [[STORY-050-organizar-artefactos-en-directorio-propio]] — [story.md](../changes/archive/2026-05-01-STORY-050-organizar-artefactos-en-directorio-propio/story.md) — Organizar artefactos de spec en directorios propios por workitem
- [[STORY-051-crear-release-por-preguntas-guiadas]] — [story.md](../changes/archive/2026-05-01-STORY-051-crear-release-por-preguntas-guiadas/story.md) — Crear un release.md válido respondiendo preguntas guiadas por el template
- [[STORY-052-generar-diagrama-contexto-c4]] — [story.md](../changes/archive/2026-05-01-STORY-052-generar-diagrama-contexto-c4/story.md) — Generar un diagrama de contexto C4 del proyecto respondiendo preguntas o desde specs
- [[STORY-053-centralizar-validacion-entorno-sddf]] — [story.md](../changes/archive/2026-05-02-STORY-053-centralizar-validacion-entorno-sddf/story.md) — Centralizar la validación de entorno SDDF con skill-preflight
- [[STORY-054-inicializar-entorno-sddf]] — [story.md](../changes/archive/2026-05-02-STORY-054-inicializar-entorno-sddf/story.md) — Inicializar entorno SDDF con sddf-init
- [[STORY-055-centralizar-templates-en-specs-templates]] — [story.md](../changes/archive/2026-05-02-STORY-055-centralizar-templates-en-specs-templates/story.md) — Centralizar templates de spec en directorio compartido
- [[STORY-056-project-policies]] — [story.md](../changes/archive/2026-05-06-STORY-056-project-policies/story.md) — Project policies
- [[STORY-057-skill-para-diseno]] — [story.md](../changes/archive/2026-05-06-STORY-057-skill-para-diseno/story.md) — Skill para Diseño (story-design)
- [[STORY-058-skill-para-tasking]] — [story.md](../changes/archive/2026-05-06-STORY-058-skill-para-tasking/story.md) — Skill para Tasking (story-tasking)
- [[STORY-059-comando-de-analisis-transversal]] — [story.md](../changes/archive/2026-05-06-STORY-059-comando-de-analisis-transversal/story.md) — Comando de análisis transversal (story-analyze)
- [[STORY-060-orquestacion-del-plan]] — [story.md](../changes/archive/2026-05-06-STORY-060-orquestacion-del-plan/story.md) — Orquestación del plan (story-plan)
- [[STORY-061-skill-de-implementacion-el-programador-autonomo]] — [story.md](../changes/archive/2026-05-06-STORY-061-skill-de-implementacion-el-programador-autonomo/story.md) — Skill de implementación — El programador autónomo (story-implement)
- [[STORY-062-status-management-on-workflow]] — [story.md](../changes/archive/2026-05-09-STORY-062-status-management-on-workflow/story.md) — Status Management on Workflow
- [[STORY-063-reutilizar-directorio-como-historia-core]] — [story.md](../changes/archive/2026-05-09-STORY-063-reutilizar-directorio-como-historia-core/story.md) — Reutilizar directorio original como historia core al dividir
- [[STORY-064-revision-codigo-multi-agente]] — [story.md](../changes/archive/2026-05-09-STORY-064-revision-codigo-multi-agente/story.md) — Skill story-code-review: revisión multi-agente aprobada del código implementado
- [[STORY-065-revision-con-bloqueantes]] — [story.md](../changes/archive/2026-05-09-STORY-065-revision-con-bloqueantes/story.md) — Skill story-code-review: instrucciones de corrección cuando la revisión detecta bloqueantes
- [[STORY-066-revision-validacion-precondiciones]] — [story.md](../changes/archive/2026-05-09-STORY-066-revision-validacion-precondiciones/story.md) — Skill story-code-review: validación de artefactos requeridos antes de revisar
- [[STORY-067-story-implement-continuar-parcial]] — [story.md](../changes/archive/2026-05-09-STORY-067-story-implement-continuar-parcial/story.md) — skill story-implement: continuar implementación parcial con tareas pendientes y fix-directives
- [[dod-plan-en-story-analyze]] — [story.md](../changes/archive/2026-05-13-STORY-068-dod-plan-en-story-analyze/story.md) — DoD PLAN en story-analyze
- [[dod-IMPLEMENT-en-story-implement]] — [story.md](../changes/archive/2026-05-13-STORY-069-dod-implementing-en-story-implement/story.md) — DoD IMPLEMENT en story-implement
- [[dod-code-review-en-story-code-review]] — [story.md](../changes/archive/2026-05-13-STORY-070-dod-code-review-en-story-code-review/story.md) — DoD CODE-REVIEW en story-code-review
- [[STORY-071-skill-story-verify]] — [story.md](../changes/archive/2026-05-14-STORY-071-skill-story-verify/story.md) — Skill story-verify: Orquestar la fase VERIFY de pruebas de una historia
- [[STORY-073-skill-security-audit-condicional]] — [story.md](../changes/archive/2026-05-15-STORY-073-skill-security-audit-condicional/story.md) — Construir skill `security-audit` para auditoría automática condicional de seguridad
- [[STORY-072-skill-story-acceptance]] — [story.md](../changes/archive/2026-05-16-STORY-072-skill-story-acceptance/story.md) — Skill story-acceptance: Validación final humana de criterios de aceptación antes de DELIVER
- [[STORY-074-integrar-historia-batch-configurable]] — [story.md](../changes/archive/2026-05-17-STORY-074-integrar-historia-batch-configurable/story.md) — story-integrate: Integración batch configurable de historias
- [[STORY-075-integrar-historia-modo-manual-dryrun]] — [story.md](../changes/archive/2026-05-17-STORY-075-integrar-historia-modo-manual-dryrun/story.md) — story-integrate: Modos de ejecución manual y dry-run
- [[STORY-076-integrar-historia-multi-modelo-entrega]] — [story.md](../changes/archive/2026-05-17-STORY-076-integrar-historia-multi-modelo-entrega/story.md) — story-integrate: Soporte multi-modelo de entrega (batch y continuous)
- [[STORY-077-mejorar-historia-desde-reporte]] — [story.md](../changes/archive/2026-05-17-STORY-077-mejorar-historia-desde-reporte/story.md) — story-improve: Mejora automática de historia desde reporte FINVEST
- [[fabrica-de-skills]] — [epic.md](../changes/archive/2026-05-28-EPIC-14-fabrica-de-skills/epic.md) — Fábrica de Skills
- [[STORY-079-story-testcases]] — [story.md](../changes/archive/2026-05-29-STORY-079-story-testcases/story.md) — story-testcases — generación de testcases.md desde story.md y design.md
- [[STORY-078-implement-tdd-fase-red]] — [story.md](../changes/archive/2026-05-30-STORY-078-implement-tdd-fase-red/story.md) — story-implement — Fase RED: validar configuración y generar pruebas
- [[STORY-080-plan]] — [plan.md](../changes/archive/2026-05-30-STORY-080-skills-master/plan.md) — Plan: Renombrar skill-creator a skill-master
- [[STORY-080-skills-master]] — [story.md](../changes/archive/2026-05-30-STORY-080-skills-master/story.md) — skill-master — refactorización de skill-tester-eval: modos plan/build, detección de lenguaje natural e independencia SDDF
- [[STORY-081-implement-tdd-fase-green-refactor]] — [story.md](../changes/archive/2026-05-30-STORY-081-implement-tdd-fase-green-refactor/story.md) — story-implement — Fases GREEN y REFACTOR: implementar código y refactorizar
- [[STORY-082-implement-tdd-modos-ejecucion]] — [story.md](../changes/archive/2026-05-30-STORY-082-implement-tdd-modos-ejecucion/story.md) — story-implement — modos interactivo y automático de ejecución del ciclo TDD
- [[STORY-083-skill-test-evals]] — [story.md](../changes/archive/2026-05-30-STORY-083-skill-test-evals/story.md) — skill-test-evals — generación de evals/evals.json para skills desde cualquier fuente
- [[plan-01]] — [plan-01.md](../changes/archive/2026-05-30-STORY-084-skill-verify/plan-01.md) — Plan: Crear el skill skill-verify
- [[plan-02]] — [plan-02.md](../changes/archive/2026-05-30-STORY-084-skill-verify/plan-02.md) — Plan: Añadir modo benchmark a skill-verify
- [[STORY-084-plan-03]] — [plan-03.md](../changes/archive/2026-05-30-STORY-084-skill-verify/plan-03.md) — Plan: Unificar skill-verify en skill-test-evals
- [[STORY-084-skill-verify]] — [story.md](../changes/archive/2026-05-30-STORY-084-skill-verify/story.md) — Unificar generación, ejecución y benchmark de evals en `skill-test-evals`
- [[plan-integrar-config-sddf-init]] — [plan.md](../changes/archive/2026-05-30-STORY-085-integrar-config-sddf-init/plan.md) — Plan: Integrar sddf.config.yaml en el skill sddf-init
- [[STORY-085-integrar-config-sddf-init]] — [story.md](../changes/archive/2026-05-30-STORY-085-integrar-config-sddf-init/story.md) — Mejora de experiencia de inicialización
- [[e2e-capability]] — [epic.md](../changes/archive/2026-05-31-EPIC-15-e2e-capability/epic.md) — Skills de Testing Especializado y E2E Capability
- [[EPIC-16-enhancement-and-security]] — [epic.md](../changes/archive/2026-06-05-EPIC-16-enhancement-and-security/epic.md) — enhancement and security improvements for skills (Safe Enhancement & Fortify Skills)
- [[plan-01-root-folder-selection-to-installer]] — [plan-01-root-folder-selection-to-installer.md](../changes/archive/2026-06-05-EPIC-16-enhancement-and-security/plan-01-root-folder-selection-to-installer.md) — Plan 01: Root Folder Selection for Installer
- [[plan-02-integrate-story-testcases-in-story-plan]] — [plan-02-Integrate-story-testcases-in-story-plan.md](../changes/archive/2026-06-05-EPIC-16-enhancement-and-security/plan-02-Integrate-story-testcases-in-story-plan.md) — Plan 02: Integrate story-testcases in story-plan
- [[plan-03-integrate-story-improve-in-story-specify]] — [plan-03-integrate-story-improve-in-story-specify.md](../changes/archive/2026-06-05-EPIC-16-enhancement-and-security/plan-03-integrate-story-improve-in-story-specify.md) — Plan 03: Integrate story-improve in story-specify
- [[plan-04-add-and-improve-skills-readme]] — [plan-04-add-and-improve-skills-readme.md](../changes/archive/2026-06-05-EPIC-16-enhancement-and-security/plan-04-add-and-improve-skills-readme.md) — Plan 04: Add and Improve Skills README
- [[plan-05-extend-story-code-review-with-testcases]] — [plan-05-extend-story-code-review-with-testcases.md](../changes/archive/2026-06-05-EPIC-16-enhancement-and-security/plan-05-extend-story-code-review-with-testcases.md) — Plan 05: Extender story-code-review con análisis de testcases.md e implement-report.md opcional
- [[plan-06-configure-story-verify-with-config-file]] — [plan-06-configure-story-verify-with-config-file.md](../changes/archive/2026-06-05-EPIC-16-enhancement-and-security/plan-06-configure-story-verify-with-config-file.md) — Plan 06: Configurar story-verify con sddf.config.yaml
- [[workflow-hardening]] — [epic.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/epic.md) — Workflow Hardening — Robustecer el flujo de Story y Release
- [[plan-01-deliver-status]] — [plan-01-deliver-status.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/plan-01-deliver-status.md) — Renombrar INTEGRATION → DELIVER en el workflow de story
- [[plan-02-epic-workflow-definition]] — [plan-02-epic-workflow-definition.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/plan-02-epic-workflow-definition.md) — Definir workflow canónico de Épica/Release
- [[plan-03-lazy-assignment-of-feat-ids]] — [plan-03-lazy-assignment-of-feat-ids.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/plan-03-lazy-assignment-of-feat-ids.md) — Asignación lazy de FEAT IDs (dos fases)
- [[plan-04-doc-story-implement]] — [plan-04-doc-story-implement.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/plan-04-doc-story-implement.md) — Mejorar documentación de story-implement
- [[plan-05-enhance-code-review]] — [plan-05-enhance-code-review.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/plan-05-enhance-code-review.md) — Incorporar mejoras a `story-code-review`
- [[plan-06-isolate-workspace-by-story]] — [plan-06-isolate-workspace-by-story.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/plan-06-isolate-workspace-by-story.md) — Aislar espacio de trabajo por historia
- [[plan-07-fix_code_generators_of_story-implement]] — [plan-07-fix_code_generators_of_story-implement.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/plan-07-fix_code_generators_of_story-implement.md) — Corregir desincronización en code_generators de story-implement
- [[plan-08-move-skills-to-the-root]] — [plan-08-move-skills-to-the-root.md](../changes/archive/2026-06-14-EPIC-18-workflow-hardening/plan-08-move-skills-to-the-root.md) — Actualizar rutas de origen tras mover `skills/` y `agents/` a la raíz
- [[EPIC-10-mejora-estructura-artefactos-nuevos-skills]] — [epic.md](../changes/archive/2026-08-30-EPIC-10-mejora-estructura-artefactos-nuevos-skills/epic.md) — Mejora en estructura de artefactos y nuevos skills
- [[EPIC-11-centralizar-templates]] — [epic.md](../changes/archive/2026-08-30-EPIC-11-centralizar-templates/epic.md) — Centralizar templates de spec en directorio compartido
- [[EPIC-12-story-sdd-workflow]] — [epic.md](../changes/archive/2026-08-30-EPIC-12-story-sdd-workflow/epic.md) — Story SDD Workflow - comandos del flujo de story
- [[quality-gates-con-dod-en-story-workflow]] — [epic.md](../changes/archive/2026-08-30-EPIC-13-quality-gates-con-dod-en-story-workflow/epic.md) — Quality Gates con DoD en Story Workflow
- [[remediating-and-improvement]] — [epic.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/epic.md) — Remediating and Improvement
- [[plan-01-reduction-of-descriptions-context-cost]] — [plan-01-reduction-of-descriptions-context-cost.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-01-reduction-of-descriptions-context-cost.md) — Remediar hallazgo A1 — Reducción de costo de contexto de descriptions — Feature del EPIC-17
- [[plan-02-fix-claude-md]] — [plan-02-fix-claude-md.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-02-fix-claude-md.md) — Corrección de CLAUDE.md — Feature del EPIC-17
- [[plan-03-clean]] — [plan-03-clean.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-03-clean.md) — Limpieza de assets muertos y configuración legacy — Feature del EPIC-17
- [[plan-4-fix-story-code-review]] — [plan-04-fix-story-code-review.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-04-fix-story-code-review.md) — Fix inconsistencia interna en story-code-review — Feature del EPIC-17
- [[plan-5-normalize-skills-frontmatter]] — [plan-05-normalize-skills-frontmatter.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-05-normalize-skills-frontmatter.md) — Normalizar zoo de frontmatter en skills — Feature del EPIC-17
- [[plan-6-centralizar-templates-compartidos]] — [plan-06-centralizar-templates-compartidos.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-06-centralizar-templates-compartidos.md) — Centralizar templates compartidos en `$SPECS_BASE/specs/templates/` — Feature del EPIC-17
- [[plan-7-invocacion-agentes-locales-de-skill]] — [plan-07-invocacion-agentes-locales-de-skill.md.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-07-invocacion-agentes-locales-de-skill.md.md) — Contrato explícito de invocación de agentes locales de skill — Feature del EPIC-17
- [[plan-8-align-the-declared-multi-client-support]] — [plan-08-align-the-declared-multi-client-support.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-08-align-the-declared-multi-client-support.md) — Alinear el soporte multi-cliente declarado con el real — Feature del EPIC-17
- [[plan-09-state-machine-canonical-document]] — [plan-09-state-machine-canonical-document.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-09-state-machine-canonical-document.md) — Documento canónico de la máquina de estados SDDF
- [[plan-10-interactive-subagent-resilience]] — [plan-10-interactive-subagent-resilience.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-10-interactive-subagent-resilience.md) — Resiliencia de entrevistas multivuelta (project-pm como subagente interactivo)
- [[plan-11-fix-instalador-npm]] — [plan-11-fix-instalador-npm.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-11-fix-instalador-npm.md) — Fix instalador npm — quitar prompt de postinstall y agregar --force para upgrades
- [[plan-12-centralize-preflight-paragraph]] — [plan-12-centralize-preflight-paragraph.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-12-centralize-preflight-paragraph.md) — Centralizar párrafo de preflight (STORY-053)
- [[plan-13-remove-gem-and-rovo]] — [plan-13-remove-gem-and-rovo.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-13-remove-gem-and-rovo.md) — Eliminar gem/ y rovo/ (STORY-054)
- [[plan-14-evals-standardization]] — [plan-14-evals-standardization.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-14-evals-standardization.md) — Estandarización del esquema de evals.json (STORY-055)
- [[plan-15-improve-invocation-in-story-implement]] — [plan-15-improve-invocation-in-story-implement.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-15-improve-invocation-in-story-implement.md) — Formalización de la invocación de code_generators en story-implement (ADR-0002)
- [[plan-16-agnostic-framework]] — [plan-16-agnostic-framework.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-16-agnostic-framework.md) — Desacoplar referencias `.claude/` de los skills SDDF (STORY-056)
- [[plan-17-generates-evals]] — [plan-17-generates-evals.md](../changes/archive/2026-08-30-EPIC-17-remediating-and-improvement/plan-17-generates-evals.md) — Generar evals/evals.json para dos skills (STORY-057)
- [[plan-01-refactor-release-to-epic]] — [plan-01-refactor-release-to-epic.md](../changes/archive/2026-08-30-STORY-086-refactor-release-to-epic/plan-01-refactor-release-to-epic.md) — PLAN: Renombrar el nivel L2 de `release` a `epic`
- [[plan-02-refactor-dev-levels]] — [plan-02-refactor-dev-levels.md](../changes/archive/2026-08-30-STORY-086-refactor-release-to-epic/plan-02-refactor-dev-levels.md) — PLAN: Reestructurar `docs/specs/` a niveles numerados (`01-projects/`, `02-epics/`, `03-stories/`)
- [[plan-03-refactor-feat-to-story]] — [plan-03-refactor-feat-to-story.md](../changes/archive/2026-08-30-STORY-086-refactor-release-to-epic/plan-03-refactor-feat-to-story.md) — PLAN: Renombrar el prefijo de historias de `FEAT-NNN` a `STORY-NNN`
- [[plan-04-fix-insights]] — [plan-04-fix-insights.md](../changes/archive/2026-08-30-STORY-086-refactor-release-to-epic/plan-04-fix-insights.md) — Cierre de la migración release→epic / FEAT→STORY: alinear gate, evals y documentación normativa
- [[plan-05-findings-and-remediation-plan]] — [plan-05-findings-and-remediation-plan.md](../changes/archive/2026-08-30-STORY-086-refactor-release-to-epic/plan-05-findings-and-remediation-plan.md) — Revisión de STORY-086 — hallazgos y plan de remediación
- [[plan-06-update-project]] — [plan-06-update-project.md](../changes/archive/2026-08-30-STORY-086-refactor-release-to-epic/plan-06-update-project.md) — Plan — Reescribir `project.md` contra la realidad + runbook del proceso
- [[STORY-086-refactor-release-to-epic]] — [story.md](../changes/archive/2026-08-30-STORY-086-refactor-release-to-epic/story.md) — Renombrar el nivel L2 de release a épica y numerar los directorios de specs
- [[plan-01-decouple-security-audit]] — [plan-01-decouple-security-audit.md](../changes/archive/2026-09-10-STORY-088-security-enhancement/plan-01-decouple-security-audit.md) — Desacoplar `story-code-review` del skill `security-audit`
- [[STORY-088-plan-02-security]] — [plan-02-security.md](../changes/archive/2026-09-10-STORY-088-security-enhancement/plan-02-security.md) — Plan: Implementar SECURITY.md
- [[plan-04-fix-security-insights]] — [plan-04-fix-security-insights.md](../changes/archive/2026-09-10-STORY-088-security-enhancement/plan-04-fix-security-insights.md) — Cerrar los 8 hallazgos `(warn)` del `ai-security-checklist`
- [[STORY-088-security-enhancement]] — [story.md](../changes/archive/2026-09-10-STORY-088-security-enhancement/story.md) — Mejoras de seguridad
- [[STORY-090-campos-declarados-nombran-su-escritor]] — [story.md](../changes/archive/2026-09-11-STORY-090-campos-declarados-nombran-su-escritor/story.md) — Todo campo declarado en un template nombra a su escritor
- [[EPIC-19-framework-consistency]] — [epic.md](../changes/archive/2026-09-12-EPIC-19-framework-consistency/epic.md) — Framework Consistency — Coherencia de vocabulario, instalación, seguridad y ciclo de corrección
- [[plan-rechazo-nombra-ejecutor-correcciones]] — [plan.md](../changes/archive/2026-09-12-STORY-089-rechazo-nombra-ejecutor-correcciones/plan.md) — STORY-089 — Análisis y propuesta de cambio
- [[STORY-089-rechazo-nombra-ejecutor-correcciones]] — [story.md](../changes/archive/2026-09-12-STORY-089-rechazo-nombra-ejecutor-correcciones/story.md) — Un code review rechazado nombra al ejecutor de correcciones y no depende de tasks.md
- [[STORY-091-story-implement-modo-rework]] — [story.md](../changes/archive/2026-09-12-STORY-091-story-implement-modo-rework/story.md) — story-implement toma de la cola una historia rechazada y corrige en modo rework
- [[STORY-092-reglas-robustez-modo-rework]] — [story.md](../changes/archive/2026-09-12-STORY-092-reglas-robustez-modo-rework/story.md) — El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro
- [[STORY-093-raiz-configurable-preflight-diagnostico]] — [story.md](../changes/archive/2026-09-12-STORY-093-raiz-configurable-preflight-diagnostico/story.md) — Resolver una raíz configurable y usar preflight como diagnóstico
- [[STORY-094-insights]] — [insights.md](../changes/archive/2026-09-13-STORY-094-refactory-and-fixing-insights/insights.md) — Insights de refactorización y correcciones
- [[plan-01-fix-ci-security-audit]] — [plan-01-fix-ci-security-audit.md](../changes/archive/2026-09-13-STORY-094-refactory-and-fixing-insights/plan-01-fix-ci-security-audit.md) — Plan 01 — Corregir la cobertura y el fallo de la CI de seguridad
- [[plan-02-fix-postinstall-target-validation]] — [plan-02-fix-postinstall-target-validation.md](../changes/archive/2026-09-13-STORY-094-refactory-and-fixing-insights/plan-02-fix-postinstall-target-validation.md) — Plan 02 — Cerrar el traversal de `SDDF_TARGET` en `postinstall`
- [[plan-03-fix-evals-runner-false-greens]] — [plan-03-fix-evals-runner-false-greens.md](../changes/archive/2026-09-13-STORY-094-refactory-and-fixing-insights/plan-03-fix-evals-runner-false-greens.md) — Plan 03 — Cerrar falsos verdes del runner de evals
- [[plan-04-cerrar-hallazgos-pendientes-auditoria]] — [plan-04-cerrar-hallazgos-pendientes-auditoria.md](../changes/archive/2026-09-13-STORY-094-refactory-and-fixing-insights/plan-04-cerrar-hallazgos-pendientes-auditoria.md) — Plan 04 — Cerrar los hallazgos pendientes de la auditoría
- [[plan-05-move-dod-story]] — [plan-05-move-dod-story.md](../changes/archive/2026-09-13-STORY-094-refactory-and-fixing-insights/plan-05-move-dod-story.md) — Mover `dod-story.md` de `policies/` a `guardrails/dod-story-checklist.md`
- [[plan-06-constitution-as-root-in-docs]] — [plan-06-constitution-as-root-in-docs.md](../changes/archive/2026-09-13-STORY-094-refactory-and-fixing-insights/plan-06-constitution-as-root-in-docs.md) — Constitución como raíz: mover `docs/policies/constitution.md` → `docs/constitution.md`
- [[STORY-094-refactory-and-fixing-insights]] — [story.md](../changes/archive/2026-09-13-STORY-094-refactory-and-fixing-insights/story.md) — Fix insight and Verificación de la instalación en Windows, macOS y Linux
- [[EPIC-20-memory-system]] — [epic.md](../changes/archive/2026-09-20-EPIC-20-memory-system/epic.md) — Memory System — Sistema de memoria unificado y agnóstico al harness
- [[STORY-095-memory-system-index-alias]] — [story.md](../changes/archive/2026-09-21-STORY-095-memory-system-index-alias/story.md) — Crear el skill memory-system con el modo index y deprecar docs-wiki-builder
- [[STORY-096-memory-system-scaffold-ensure-rebuild]] — [story.md](../changes/archive/2026-09-23-STORY-096-memory-system-scaffold-ensure-rebuild/story.md) — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild
- [[STORY-097-memory-system-check-ci]] — [story.md](../changes/archive/2026-09-23-STORY-097-memory-system-check-ci/story.md) — Verificar la consistencia de la memoria con un modo check apto para CI
- [[STORY-100-restaurar-documentos-canonicos-estados]] — [story.md](../changes/archive/2026-09-23-STORY-100-restaurar-documentos-canonicos-estados/story.md) — Restaurar los documentos canónicos de la máquina de estados borrados sin repuntar sus citas
- [[STORY-098-memory-system-migrate-harness]] — [story.md](../changes/archive/2026-09-24-STORY-098-memory-system-migrate-harness/story.md) — Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate
- [[STORY-099-sddf-init-level-full]] — [story.md](../changes/archive/2026-09-24-STORY-099-sddf-init-level-full/story.md) — Inicializar la memoria completa desde sddf-init con el parámetro --level
- [[STORY-101-dod-story-por-etapa]] — [story.md](../changes/archive/2026-09-24-STORY-101-dod-story-por-etapa/story.md) — Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill
- [[STORY-102-renombrar-skill-sddf-constitution]] — [story.md](../changes/archive/2026-09-26-STORY-102-renombrar-skill-sddf-constitution/story.md) — Renombrar el skill project-policies-generation como sddf-constitution
- [epic-template.md](../changes/archive/2026-10-07-STORY-103-replace-the-epic-template/epic-template.md) — <título de la épica> ⚠️ slug placeholder
- [[STORY-103-replace-the-epic-template]] — [story.md](../changes/archive/2026-10-07-STORY-103-replace-the-epic-template/story.md) — Reemplazar el template de Epic por la versión minimalista y output-oriented
- [[STORY-120-epic-analyze-integridad-historias]] — [story.md](../changes/archive/2026-10-08-STORY-120-epic-analyze-integridad-historias/story.md) — Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo
- [[STORY-121-epic-analyze-cobertura-criterios-salida]] — [story.md](../changes/archive/2026-10-09-STORY-121-epic-analyze-cobertura-criterios-salida/story.md) — Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias
- [[STORY-122-epic-analyze-madurez-historias-hijas]] — [story.md](../changes/archive/2026-10-09-STORY-122-epic-analyze-madurez-historias-hijas/story.md) — Señalar historias hijas no especificadas o con referencias rotas al analizar una épica
- [[STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo]] — [story.md](../changes/archive/2026-10-09-STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo/story.md) — Reubicar las secciones restantes de project.md y eliminarlo
- [[STORY-104-migrar-project-intent-a-vision]] — [story.md](../changes/archive/2026-10-10-STORY-104-migrar-project-intent-a-vision/story.md) — Migrar project-intent.md a product/vision.md
- [[STORY-105-migrar-stakeholders-y-requisitos]] — [story.md](../changes/archive/2026-10-10-STORY-105-migrar-stakeholders-y-requisitos/story.md) — Migrar project.md a product/stakeholders.md y requirements/
- [[STORY-106-migrar-plan-a-roadmap]] — [story.md](../changes/archive/2026-10-10-STORY-106-migrar-plan-a-roadmap/story.md) — Migrar project-plan.md a product/roadmap.md
- [[STORY-107-migrar-story-map-y-diagrama-contexto]] — [story.md](../changes/archive/2026-10-10-STORY-107-migrar-story-map-y-diagrama-contexto/story.md) — Migrar story-map.md y context-diagram.puml
- [[STORY-108-renombrar-specs-sin-prefijos]] — [story.md](../changes/archive/2026-10-10-STORY-108-renombrar-specs-sin-prefijos/story.md) — Renombrar specs/02-epics/ → specs/epics/ y specs/03-stories/ → specs/stories/
- [[STORY-109-project-begin-escribe-vision]] — [story.md](../changes/archive/2026-10-10-STORY-109-project-begin-escribe-vision/story.md) — project-begin escribe la intención en product/vision.md
- [[STORY-110-discovery-escribe-stakeholders-y-requisitos]] — [story.md](../changes/archive/2026-10-10-STORY-110-discovery-escribe-stakeholders-y-requisitos/story.md) — project-discovery y reverse-engineering escriben stakeholders y requisitos individuales
- [[STORY-119-story-plan-un-subagente-por-paso]] — [story.md](../changes/archive/2026-10-10-STORY-119-story-plan-un-subagente-por-paso/story.md) — Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens
- [[STORY-119-testing-report-01]] — [testing-report-01.md](../changes/archive/2026-10-10-STORY-119-story-plan-un-subagente-por-paso/testing-report-01.md) — Testing de STORY-119: Prueba 1
- [[STORY-119-testing-report-02]] — [testing-report-02.md](../changes/archive/2026-10-10-STORY-119-story-plan-un-subagente-por-paso/testing-report-02.md) — Testing de STORY-119: Prueba 2
- [[STORY-111-planning-escribe-roadmap]] — [story.md](../changes/archive/2026-10-11-STORY-111-planning-escribe-roadmap/story.md) — project-planning escribe en product/roadmap.md y epic-from-project-plan lee de allí
- [[STORY-112-story-map-y-diagrama-en-sus-capas]] — [story.md](../changes/archive/2026-10-11-STORY-112-story-map-y-diagrama-en-sus-capas/story.md) — project-story-mapping y project-context-diagram escriben en product/ y architecture/c4/
- [[STORY-113-project-flow-sin-01-projects]] — [story.md](../changes/archive/2026-10-11-STORY-113-project-flow-sin-01-projects/story.md) — project-flow, sddf-init y header-aggregation sin specs/01-projects/
- [[STORY-114-migrate-specs-3-levels]] — [story.md](../changes/archive/2026-10-11-STORY-114-migrate-specs-3-levels/story.md) — Implementar memory-system migrate --from=specs-3-levels
- [[STORY-115-scaffold-dos-niveles-y-capas-destino]] — [story.md](../changes/archive/2026-10-11-STORY-115-scaffold-dos-niveles-y-capas-destino/story.md) — Actualizar scaffolding de memory-system a specs/ de dos niveles
- [[STORY-116-documentar-modelo-dos-niveles]] — [story.md](../changes/archive/2026-10-11-STORY-116-documentar-modelo-dos-niveles/story.md) — Actualizar documentación canónica al modelo de dos niveles
- [[STORY-118-requirements-srs-unico-primero]] — [story.md](../changes/archive/2026-10-13-STORY-118-requirements-srs-unico-primero/story.md) — Adoptar la estrategia 'SRS único primero, fragmentación cuando duela' en requirements/
- [[STORY-129-migrar-analizadores-de-reverse-engineering]] — [story.md](../changes/archive/2026-10-16-STORY-129-migrar-analizadores-de-reverse-engineering/story.md) — Migrar analizadores de reverse-engineering
- [[STORY-131-partir-project-pm-en-roles-locales]] — [story.md](../changes/archive/2026-10-16-STORY-131-partir-project-pm-en-roles-locales/story.md) — Partir project-pm en roles locales
- [[STORY-132-partir-project-architect-en-roles-locales]] — [story.md](../changes/archive/2026-10-16-STORY-132-partir-project-architect-en-roles-locales/story.md) — Partir project-architect en roles locales
- [[STORY-133-mover-project-ux-a-rol-local-de-project-discovery]] — [story.md](../changes/archive/2026-10-16-STORY-133-mover-project-ux-a-rol-local-de-project-discovery/story.md) — Mover project-ux a rol local de project-discovery
- [[STORY-134-migrar-project-story-mapper-a-rol-local]] — [story.md](../changes/archive/2026-10-16-STORY-134-migrar-project-story-mapper-a-rol-local/story.md) — Migrar project-story-mapper a rol local
- [[STORY-135-migrar-story-product-owner-a-rol-local]] — [story.md](../changes/archive/2026-10-16-STORY-135-migrar-story-product-owner-a-rol-local/story.md) — Migrar story-product-owner a rol local
- [[STORY-146-skill-story-fix-plan]] — [story.md](../changes/archive/2026-10-17-STORY-146-skill-story-fix-plan/story.md) — Skill `story-fix-plan`: corregir el plan de una historia desde `analyze.md`
- [[STORY-138-contrato-de-validacion]] — [story.md](../changes/archive/2026-10-18-STORY-138-contrato-de-validacion/story.md) — Contrato de validación
- [[STORY-140-alinear-story-evaluation]] — [story.md](../changes/archive/2026-10-18-STORY-140-alinear-story-evaluation/story.md) — Alinear story-evaluation
- [[STORY-141-alinear-story-code-review]] — [story.md](../changes/archive/2026-10-18-STORY-141-alinear-story-code-review/story.md) — Alinear story-code-review
- [[STORY-142-alinear-story-verify]] — [story.md](../changes/archive/2026-10-18-STORY-142-alinear-story-verify/story.md) — Alinear story-verify
- [[STORY-144-alinear-story-analyze]] — [story.md](../changes/archive/2026-10-18-STORY-144-alinear-story-analyze/story.md) — Alinear story-analyze
- [[EPIC-25-unificar-contrato-de-validaciones-en-skills]] — [epic.md](../changes/archive/2026-10-19-EPIC-25-unificar-contrato-de-validaciones-en-skills/epic.md) — Unificar contrato de validaciones en skills
- [[STORY-139-alinear-epic-analyze]] — [story.md](../changes/archive/2026-10-19-STORY-139-alinear-epic-analyze/story.md) — Alinear epic-analyze
- [[STORY-143-validacion-end-to-end]] — [story.md](../changes/archive/2026-10-20-STORY-143-validacion-end-to-end/story.md) — Validación end-to-end
- [[STORY-145-alinear-story-acceptance]] — [story.md](../changes/archive/2026-10-20-STORY-145-alinear-story-acceptance/story.md) — Alinear story-acceptance
- [[EPIC-23-completar-flujo-de-epic]] — [epic.md](../changes/archive/2026-11-04-EPIC-23-completar-flujo-de-epic/epic.md) — Completar flujo de epic
- [[EPIC-23-completar-flujo-de-epic-release-notes]] — [release-notes.md](../changes/archive/2026-11-04-EPIC-23-completar-flujo-de-epic/release-notes.md) — Notas de versión: Completar flujo de epic
- [[EPIC-23-report-SMOKE-5-20261104]] — [report-SMOKE-5-20261104.md](../changes/archive/2026-11-04-EPIC-23-completar-flujo-de-epic/report-SMOKE-5-20261104.md) — Smoke report: SMOKE-5 de EPIC-23
- [[STORY-124-validar-preparacion-estructural-epica]] — [story.md](../changes/archive/2026-11-04-STORY-124-validar-preparacion-estructural-epica/story.md) — Validar la preparación estructural de una épica
- [[STORY-125-validar-evidencia-operativa-epica]] — [story.md](../changes/archive/2026-11-04-STORY-125-validar-evidencia-operativa-epica/story.md) — Validar la evidencia operativa de una épica
- [[STORY-126-operar-validacion-epica-segura]] — [story.md](../changes/archive/2026-11-04-STORY-126-operar-validacion-epica-segura/story.md) — Operar la validación de épicas de manera segura
- [[STORY-127-integrar-adoptar-gateway-epica]] — [story.md](../changes/archive/2026-11-04-STORY-127-integrar-adoptar-gateway-epica/story.md) — Integrar y documentar el gateway de validación de épicas
- [[STORY-128-evaluar-validacion-epica-repetible]] — [story.md](../changes/archive/2026-11-04-STORY-128-evaluar-validacion-epica-repetible/story.md) — Evaluar la validación de épicas de forma repetible
- [[STORY-137-controlar-detalle-ejecucion-validacion-epica]] — [story.md](../changes/archive/2026-11-04-STORY-137-controlar-detalle-ejecucion-validacion-epica/story.md) — Controlar el detalle y los límites de la ejecución de la validación de épicas
- [[STORY-165-corregir-indice-y-enlaces-epica]] — [story.md](../changes/archive/2026-11-04-STORY-165-corregir-indice-y-enlaces-epica/story.md) — Skill epic-refine (Core): corregir índice y enlaces de una épica
- [report-20261101.md](../changes/archive/2026-11-04-STORY-166-veredicto-de-epic-format-validation/report-20261101.md) — Eval Report: epic-format-validation ⚠️ sin frontmatter
- [[STORY-166-veredicto-de-epic-format-validation]] — [story.md](../changes/archive/2026-11-04-STORY-166-veredicto-de-epic-format-validation/story.md) — Veredicto de epic-format-validation
- [bug-fix-01.md](../changes/archive/2026-11-04-STORY-167-skill-epic-improve/bug-fix-01.md) — Plan de solución — bug `epic-improve` (eval TC-002 FAIL) ⚠️ sin frontmatter
- [[STORY-167-skill-epic-improve]] — [story.md](../changes/archive/2026-11-04-STORY-167-skill-epic-improve/story.md) — Skill epic-improve
- [[STORY-168-skill-epic-track-progress]] — [story.md](../changes/archive/2026-11-04-STORY-168-skill-epic-track-progress/story.md) — Skill epic-track-progress
- [[STORY-169-suites-de-integracion-y-regresion-de-la-epica]] — [story.md](../changes/archive/2026-11-04-STORY-169-suites-de-integracion-y-regresion-de-la-epica/story.md) — Suites de integración y regresión de la épica
- [[STORY-170-skill-epic-ship]] — [story.md](../changes/archive/2026-11-04-STORY-170-skill-epic-ship/story.md) — Skill epic-ship
- [[STORY-171-completar-archivar-epica-liberada]] — [story.md](../changes/archive/2026-11-04-STORY-171-completar-archivar-epica-liberada/story.md) — Skill epic-complete (Core) — completar y archivar una épica liberada
- [[STORY-172-skill-epic-complete-archivar-epicas-canceladas]] — [story.md](../changes/archive/2026-11-04-STORY-172-skill-epic-complete-archivar-epicas-canceladas/story.md) — Skill epic-complete — archivar épicas canceladas
- [[STORY-173-cubrir-criterios-salida-epica]] — [story.md](../changes/archive/2026-11-04-STORY-173-cubrir-criterios-salida-epica/story.md) — Skill epic-refine: asignar la cobertura de criterios de salida
- [[STORY-174-corregir-referencias-obsoletas-tras-split]] — [story.md](../changes/archive/2026-11-04-STORY-174-corregir-referencias-obsoletas-tras-split/story.md) — Skill epic-refine: corregir referencias obsoletas tras un split
- [[STORY-175-admitir-epicas-archivadas-en-layout]] — [story.md](../changes/archive/2026-11-04-STORY-175-admitir-epicas-archivadas-en-layout/story.md) — Admitir épicas archivadas en el layout fijo con un ADR nuevo
- [[EPIC-21-colapsar-specs-dos-niveles]] — [epic.md](../changes/archive/2026-11-05-EPIC-21-colapsar-specs-dos-niveles/epic.md) — Colapsar specs/ a dos niveles y eliminar 01-projects/
- [[insight-colapsar-specs-dos-niveles]] — [insight-colapsar-specs-dos-niveles.md](../changes/archive/2026-11-05-EPIC-21-colapsar-specs-dos-niveles/insight-colapsar-specs-dos-niveles.md) — Cambio sugerido: Colapsar specs a dos niveles y eliminar 01-projects
- [[EPIC-21-colapsar-specs-dos-niveles-test-cases]] — [test-cases.md](../changes/archive/2026-11-05-EPIC-21-colapsar-specs-dos-niveles/test-cases.md) — Test Cases: Colapsar specs/ a dos niveles y eliminar 01-projects/
- [[EPIC-22-epic-analyze]] — [epic.md](../changes/archive/2026-11-05-EPIC-22-epic-analyze/epic.md) — Skill `epic-analyze`: análisis de una épica antes de desarrollarla
- [[EPIC-24-agentes-locales-por-skill]] — [epic.md](../changes/archive/2026-11-05-EPIC-24-agentes-locales-por-skill/epic.md) — Mover agentes globales a agentes locales por skill
- [[EPIC-26-layout-y-flow-forward-mejorado]] — [epic.md](../changes/archive/2026-11-05-EPIC-26-layout-y-flow-forward-mejorado/epic.md) — Layout y flow-forward mejorado
- [report-SMOKE-1-20261025.md](../changes/archive/2026-11-05-EPIC-26-layout-y-flow-forward-mejorado/report-SMOKE-1-20261025.md) — Eval Report: story-specify ⚠️ sin frontmatter
- [report-SMOKE-2-20261025.md](../changes/archive/2026-11-05-EPIC-26-layout-y-flow-forward-mejorado/report-SMOKE-2-20261025.md) — Eval Report: epic-creation ⚠️ sin frontmatter
- [report-SMOKE-3-20261025.md](../changes/archive/2026-11-05-EPIC-26-layout-y-flow-forward-mejorado/report-SMOKE-3-20261025.md) — Eval Report: sddf-init ⚠️ sin frontmatter
- [report-SMOKE-6-20261025.md](../changes/archive/2026-11-05-EPIC-26-layout-y-flow-forward-mejorado/report-SMOKE-6-20261025.md) — Eval Report: sddf-init ⚠️ sin frontmatter
- [[EPIC-27-completar-flujo-de-story]] — [epic.md](../changes/archive/2026-11-05-EPIC-27-completar-flujo-de-story/epic.md) — Completar flujo de story
- [plan.md](../changes/archive/2026-11-05-STORY-130-renombrar-skill-story-improve-a-story-refine/plan.md) — Plan — Renombrar el skill `story-improve` a `story-refine` ⚠️ sin frontmatter
- [[STORY-130-renombrar-skill-story-improve-a-story-refine]] — [story.md](../changes/archive/2026-11-05-STORY-130-renombrar-skill-story-improve-a-story-refine/story.md) — Renombrar skill `story-improve` a `story-refine`
- [[STORY-147-adr-del-layout-fijo-de-tres-raices]] — [story.md](../changes/archive/2026-11-05-STORY-147-adr-del-layout-fijo-de-tres-raices/story.md) — ADR del layout fijo de tres raíces
- [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] — [story.md](../changes/archive/2026-11-05-STORY-148-contrato-de-rutas-fijas-y-gate-determinista/story.md) — Contrato de rutas fijas y gate determinista
- [[STORY-149-sddf-init-crea-el-nuevo-layout]] — [story.md](../changes/archive/2026-11-05-STORY-149-sddf-init-crea-el-nuevo-layout/story.md) — sddf-init crea el nuevo layout
- [[STORY-150-migrar-skills-especificacion-specs-flow]] — [story.md](../changes/archive/2026-11-05-STORY-150-migrar-skills-especificacion-specs-flow/story.md) — Migrar los skills de especificación a specs/flow
- [[STORY-151-migrar-los-skills-de-epica-a-specs-flow]] — [story.md](../changes/archive/2026-11-05-STORY-151-migrar-los-skills-de-epica-a-specs-flow/story.md) — Migrar los skills de épica a specs/flow
- [[STORY-152-migrar-los-skills-de-proyecto-y-transversales]] — [story.md](../changes/archive/2026-11-05-STORY-152-migrar-los-skills-de-proyecto-y-transversales/story.md) — Migrar los skills de proyecto y transversales
- [[STORY-153-migrar-work-items-specs-flow]] — [story.md](../changes/archive/2026-11-05-STORY-153-migrar-work-items-specs-flow/story.md) — Migrar y archivar los work items a specs/flow
- [[STORY-154-documentar-el-nuevo-layout]] — [story.md](../changes/archive/2026-11-05-STORY-154-documentar-el-nuevo-layout/story.md) — Documentar el nuevo layout
- [[STORY-155-migrar-skills-planning-specs-flow]] — [story.md](../changes/archive/2026-11-05-STORY-155-migrar-skills-planning-specs-flow/story.md) — Migrar los skills de planning a specs/flow
- [[STORY-156-migrar-skills-implementacion-specs-flow]] — [story.md](../changes/archive/2026-11-05-STORY-156-migrar-skills-implementacion-specs-flow/story.md) — Migrar los skills de implementación a specs/flow
- [[STORY-157-reparar-enlaces-tras-migracion]] — [story.md](../changes/archive/2026-11-05-STORY-157-reparar-enlaces-tras-migracion/story.md) — Reparar enlaces y validar el gate tras la migración
- [[STORY-158-migrar-skills-verificacion-specs-flow]] — [story.md](../changes/archive/2026-11-05-STORY-158-migrar-skills-verificacion-specs-flow/story.md) — Migrar los skills de revisión, verificación y aceptación a specs/flow
- [[STORY-159-story-delivery-interactivo]] — [story.md](../changes/archive/2026-11-05-STORY-159-story-delivery-interactivo/story.md) — story-delivery interactivo en modelo batch
- [[STORY-160-completar-y-archivar-historia-entregada]] — [story.md](../changes/archive/2026-11-05-STORY-160-completar-y-archivar-historia-entregada/story.md) — Skill story-complete: completar y archivar una historia entregada
- [[STORY-161-estrategia-de-instalacion]] — [story.md](../changes/archive/2026-11-05-STORY-161-estrategia-de-instalacion/story.md) — Estrategia de instalación
- [[STORY-162-story-delivery-modelo-continuous]] — [story.md](../changes/archive/2026-11-05-STORY-162-story-delivery-modelo-continuous/story.md) — story-delivery en modelo continuous
- [[STORY-163-story-delivery-dry-run-y-force]] — [story.md](../changes/archive/2026-11-05-STORY-163-story-delivery-dry-run-y-force/story.md) — story-delivery: --dry-run y --force
- [[STORY-164-archivar-historias-canceladas]] — [story.md](../changes/archive/2026-11-05-STORY-164-archivar-historias-canceladas/story.md) — Skill story-complete: archivar historias canceladas
- [[plan-cerrar-epica-segun-dod-proyecto]] — [plan.md](../changes/archive/2026-11-05-STORY-176-cerrar-epica-segun-dod-proyecto/plan.md) — Plan: cerrar una épica según el DoD del proyecto, sin asumir stack ni release
- [[STORY-176-cerrar-epica-segun-dod-proyecto]] — [story.md](../changes/archive/2026-11-05-STORY-176-cerrar-epica-segun-dod-proyecto/story.md) — Cerrar una épica según el DoD del proyecto, sin asumir stack ni release
- [[BUG-002-story-implement-omite-pruebas-tdd]] — [bug.md](../changes/archive/2026-11-08-BUG-002-story-implement-omite-pruebas-tdd/bug.md) — story-implement no ejecuta las pruebas del ciclo TDD
- [[plan-02-story-implement-lee-comandos-de-verify]] — [plan.md](../changes/archive/2026-11-08-BUG-002-story-implement-omite-pruebas-tdd/plan.md) — Reparación BUG-002 — story-implement lee los comandos de prueba de verify y registra los tipos no ejecutados
- [[BUG-001-archivado-genera-enlaces-rotos]] — [bug.md](../changes/archive/2026-11-12-BUG-001-archivado-genera-enlaces-rotos/bug.md) — Archivado genera enlaces rotos
- [[plan-01-actualizar-referencias-al-archivar]] — [plan.md](../changes/archive/2026-11-12-BUG-001-archivado-genera-enlaces-rotos/plan.md) — Reparación BUG-001 — Actualizar referencias en documentación activa al archivar
- [[EPIC-28-calibrar-story-code-review-con-review-md]] — [epic.md](../changes/archive/2026-11-12-EPIC-28-calibrar-story-code-review-con-review-md/epic.md) — Calibrar story-code-review con REVIEW.md
- [[EPIC-28-calibrar-story-code-review-con-review-md-test-evidences]] — [tests-evidence.md](../changes/archive/2026-11-12-EPIC-28-calibrar-story-code-review-con-review-md/tests-evidence.md) — Test evidences: Calibrar story-code-review con REVIEW.md
- [[STORY-177-corregir-rutas-story-code-review]] — [story.md](../changes/archive/2026-11-12-STORY-177-corregir-rutas-story-code-review/story.md) — Corregir rutas de story-code-review
- [[STORY-178-adr-guia-de-revision]] — [story.md](../changes/archive/2026-11-12-STORY-178-adr-guia-de-revision/story.md) — ADR de la guía de revisión
- [[STORY-179-review-md-de-agile-sddf]] — [story.md](../changes/archive/2026-11-12-STORY-179-review-md-de-agile-sddf/story.md) — REVIEW.md de agile-sddf
- [[STORY-180-story-code-review-lee-review-md]] — [story.md](../changes/archive/2026-11-12-STORY-180-story-code-review-lee-review-md/story.md) — story-code-review lee REVIEW.md
- [[STORY-181-hallazgos-preexistentes]] — [story.md](../changes/archive/2026-11-12-STORY-181-hallazgos-preexistentes/story.md) — Hallazgos preexistentes
- [[STORY-182-verificar-y-deduplicar-hallazgos]] — [story.md](../changes/archive/2026-11-12-STORY-182-verificar-y-deduplicar-hallazgos/story.md) — Verificación y deduplicación de hallazgos del árbitro
- [[STORY-183-dod-code-review-sin-criterios-circulares]] — [story.md](../changes/archive/2026-11-12-STORY-183-dod-code-review-sin-criterios-circulares/story.md) — DoD CODE-REVIEW sin criterios circulares
- [[STORY-184-review-md-semilla-para-proyectos-consumidores]] — [story.md](../changes/archive/2026-11-12-STORY-184-review-md-semilla-para-proyectos-consumidores/story.md) — REVIEW.md semilla para proyectos consumidores
- [[STORY-185-tope-de-low-y-arrastres]] — [story.md](../changes/archive/2026-11-12-STORY-185-tope-de-low-y-arrastres/story.md) — Tope de LOW por revisor y sin arrastres entre rondas
- [[BUG-003-epic-analyze-ignora-cs-por-id]] — [bug.md](../changes/archive/2026-11-13-BUG-003-epic-analyze-ignora-cs-por-id/bug.md) — epic-analyze no acepta CS-N por ID y altera el texto citado de un criterio
- [[plan-03-epic-analyze-acepta-cs-por-id]] — [plan.md](../changes/archive/2026-11-13-BUG-003-epic-analyze-ignora-cs-por-id/plan.md) — Reparación BUG-003 — epic-analyze acepta CS-<id> por ID y cita el criterio literal
- [[EPIC-029-eliminar-estados-buffer]] — [epic.md](../changes/archive/2026-11-15-EPIC-029-eliminar-estados-buffer/epic.md) — Eliminar estados buffer
- [[STORY-186-adr-de-workflows-sin-estados-buffer]] — [story.md](../changes/archive/2026-11-15-STORY-186-adr-de-workflows-sin-estados-buffer/story.md) — ADR de workflows sin estados buffer
- [[STORY-187-dominio-y-requisitos-sin-buffers]] — [story.md](../changes/archive/2026-11-15-STORY-187-dominio-y-requisitos-sin-buffers/story.md) — Dominio, requisitos y máquina de estados sin buffers
- [[STORY-188-la-planificacion-termina-en-plan-done]] — [story.md](../changes/archive/2026-11-15-STORY-188-la-planificacion-termina-en-plan-done/story.md) — La planificación termina en PLAN/DONE
- [[STORY-189-el-rework-vuelve-a-implement-todo]] — [story.md](../changes/archive/2026-11-15-STORY-189-el-rework-vuelve-a-implement-todo/story.md) — El rework de los tres gates vuelve a IMPLEMENT/TODO
- [[STORY-190-directivas-de-correccion-desde-verify-y-acceptance]] — [story.md](../changes/archive/2026-11-15-STORY-190-directivas-de-correccion-desde-verify-y-acceptance/story.md) — Directivas de corrección desde verify y acceptance
- [[STORY-191-valor-legado-durante-la-ventana-de-transicion]] — [story.md](../changes/archive/2026-11-15-STORY-191-valor-legado-durante-la-ventana-de-transicion/story.md) — Valor legado durante la ventana de transición
- [[STORY-192-epica-sin-ready-for-dev]] — [story.md](../changes/archive/2026-11-15-STORY-192-epica-sin-ready-for-dev/story.md) — Épica sin READY-FOR-DEV
- [[STORY-193-guias-readme-y-ejemplos-sin-buffers]] — [story.md](../changes/archive/2026-11-15-STORY-193-guias-readme-y-ejemplos-sin-buffers/story.md) — Guías, README y ejemplos sin buffers

---

## 🧭 Dominio y arquitectura

### Dominios (domains/)

- [[domains-index]] — [README.md](domains/README.md) — Documentación de Dominios — Framework SDDF
- [[domain-epic-lifecycle]] — [domain-epic-lifecycle.md](domains/domain-epic-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Epic (Epic Lifecycle)
- [[domain-foundational-docs-lifecycle]] — [domain-foundational-docs-lifecycle.md](domains/domain-foundational-docs-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de la Documentación Fundacional (Foundational Docs Lifecycle)
- [[domain-knowledge-artifacts]] — [domain-knowledge-artifacts.md](domains/domain-knowledge-artifacts.md) — Documentación del Dominio: Artefactos de Conocimiento (Knowledge Artifacts)
- [[domain-project-lifecycle]] — [domain-project-lifecycle.md](domains/domain-project-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Project (Project Lifecycle)
- [[domain-skills-map]] — [domain-skills-map.md](domains/domain-skills-map.md) — Mapa de skills por nivel del pipeline
- [[domain-state-management]] — [domain-state-management.md](domains/domain-state-management.md) — Documentación del Dominio: Gestión de Estados (State Management)
- [[domain-story-lifecycle]] — [domain-story-lifecycle.md](domains/domain-story-lifecycle.md) — Documentación del Dominio: Ciclo de Vida de Story (Story Lifecycle)
- [[domain-work-item-hierarchy]] — [domain-work-item-hierarchy.md](domains/domain-work-item-hierarchy.md) — Documentación del Dominio: Jerarquía de Work Items
- [[domain]] — [domain.md](domains/domain.md) — Agile SDDF — Contexto de dominio

### Arquitectura (architecture/)

- [[architecture-index]] — [README.md](architecture/README.md) — Índice de arquitectura del framework SDDF
- [[memory-system]] — [memory-system.md](architecture/memory-system.md) — Sistema de Memoria del Framework SDDF
- [[sequence-npm-run-test-eval-simple]] — [npm-run-test-eval-system.md](architecture/npm-run-test-eval-system.md) — Secuencia simplificada: npm run test:eval
- [[sdcl-sddf]] — [sdcl-sddf.md](architecture/sdcl-sddf.md) — Correspondencia SDLC clásico ↔ SDDF
- [[sddf-architecture]] — [sddf-architecture.md](architecture/sddf-architecture.md) — Arquitectura del Framework SDDF
- [[state-machine]] — [state-machine.md](architecture/state-machine.md) — Máquina de estados del framework SDDF
- [[tech-stack]] — [tech-stack.md](architecture/tech-stack.md) — Stack Tecnológico SDDF

### Decisiones de arquitectura (decisions/)

- [[usar-madr-para-decisiones]] — [ADR-0000-usar-madr-para-decisiones.md](decisions/ADR-0000-usar-madr-para-decisiones.md) — Usar Markdown Architectural Decision Records
- [[centralizar-templates-compartidos]] — [ADR-0001-centralizar-templates-compartidos.md](decisions/ADR-0001-centralizar-templates-compartidos.md) — Centralizar templates compartidos en $SPECS_BASE/specs/templates/
- [[invocacion-agentes-locales-de-skill]] — [ADR-0002-invocacion-agentes-locales-de-skill.md](decisions/ADR-0002-invocacion-agentes-locales-de-skill.md) — Contrato de invocación de agentes locales de skill
- [[workflow-canonico-story-y-epic]] — [ADR-0003-workflow-canonico-story-y-epic.md](decisions/ADR-0003-workflow-canonico-story-y-epic.md) — Workflows canónicos de Story y Epic en el pipeline SDDF
- [[nivel-l2-epic-y-directorios-numerados]] — [ADR-0004-nivel-l2-epic-y-directorios-numerados.md](decisions/ADR-0004-nivel-l2-epic-y-directorios-numerados.md) — El nivel L2 es una épica, y los niveles viven en directorios numerados
- [[prefijo-story-para-el-nivel-l1]] — [ADR-0005-prefijo-story-para-el-nivel-l1.md](decisions/ADR-0005-prefijo-story-para-el-nivel-l1.md) — El ID del nivel L1 se prefija con STORY; el tipo de trabajo vive en el campo kind
- [[migracion-retroactiva-de-estados-de-epica]] — [ADR-0006-migracion-retroactiva-de-estados-de-epica.md](decisions/ADR-0006-migracion-retroactiva-de-estados-de-epica.md) — Workflows canónicos de Story y Epic, con migración retroactiva de los estados históricos
- [[templates-como-capa-propia]] — [ADR-0007-templates-como-capa-propia.md](decisions/ADR-0007-templates-como-capa-propia.md) — Los templates son una capa propia, hermana de specs/
- [[rework-sin-estado-propio]] — [ADR-0008-rework-sin-estado-propio.md](decisions/ADR-0008-rework-sin-estado-propio.md) — Rework sin estado propio: la señal es el artefacto de fallo
- [[perfiles-runtimes-e-instalacion-explicita]] — [ADR-0009-perfiles-runtimes-e-instalacion-explicita.md](decisions/ADR-0009-perfiles-runtimes-e-instalacion-explicita.md) — Perfiles reproducibles, runtimes canónicos e instalación explícita
- [[specs-dentro-de-docs]] — [ADR-0010-specs-dentro-de-docs.md](decisions/ADR-0010-specs-dentro-de-docs.md) — Mantener specs/ dentro de docs/ en lugar de la raíz
- [[archivos-canonicos-por-tipo]] — [ADR-0011-archivos-canonicos-por-tipo.md](decisions/ADR-0011-archivos-canonicos-por-tipo.md) — Los archivos canónicos de work items se nombran por tipo (epic.md, story.md)
- [[escritor-en-templates-de-autoria-manual]] — [ADR-0012-escritor-en-templates-de-autoria-manual.md](decisions/ADR-0012-escritor-en-templates-de-autoria-manual.md) — Los templates de autoría manual anotan `escritor: autoría manual` en línea completa
- [[asegurar-dos-niveles-de-flujo-epics-stories]] — [ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories.md](decisions/ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories.md) — Asegurar dos niveles de flujo como epics y stories
- [[ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories]] — [ADR-0013-eliminar-specs-01-projects.md](decisions/ADR-0013-eliminar-specs-01-projects.md) — Asegurar dos niveles de flujo como epics y stories
- [[skills-independientes]] — [ADR-0014-skills-independientes.md](decisions/ADR-0014-skills-independientes.md) — Independencia de skills y agentes: sin dependencia de skills hacia `agents/`
- [[contrato-de-validacion]] — [ADR-0015-contrato-de-validacion.md](decisions/ADR-0015-contrato-de-validacion.md) — Contrato común de validación para los skills de gate
- [[layout-fijo-de-tres-raices]] — [ADR-0016-layout-fijo-de-tres-raices.md](decisions/ADR-0016-layout-fijo-de-tres-raices.md) — Layout fijo de tres raíces: docs/, specs/ y workflow/
- [[layout-fijo-con-archivo-de-historias-canceladas]] — [ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md](decisions/ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) — Layout fijo de tres raíces con archivo de historias completadas y canceladas
- [[adoptar-cucumber-para-specs-living]] — [ADR-0018-adoptar-cucumber-para-specs-living.md](decisions/ADR-0018-adoptar-cucumber-para-specs-living.md) — Adoptar Cucumber (Gherkin en archivos .feature) para specs/
- [[layout-fijo-con-archivo-de-epicas]] — [ADR-0019-layout-fijo-con-archivo-de-epicas.md](decisions/ADR-0019-layout-fijo-con-archivo-de-epicas.md) — Layout fijo de tres raíces con archivo de historias y épicas cerradas
- [[contratos-centralizados-para-spec-living]] — [ADR-0020-contratos-centralizados-para-spec-living.md](decisions/ADR-0020-contratos-centralizados-para-spec-living.md) — Contratos centralizados en OpenAPI/AsyncAPI para specs/
- [[guia-de-revision-review-md]] — [ADR-0021-guia-de-revision-review-md.md](decisions/ADR-0021-guia-de-revision-review-md.md) — Guía de revisión por proyecto en REVIEW.md
- [[workflows-sin-estados-buffer]] — [ADR-0022-workflows-sin-estados-buffer.md](decisions/ADR-0022-workflows-sin-estados-buffer.md) — Workflows de Story y Epic sin estados buffer
- [[separar-changes-de-specs]] — [ADR-0023-separar-changes-de-specs.md](decisions/ADR-0023-separar-changes-de-specs.md) — Separar los cambios en curso de la especificación viva
- [[adr-index]] — [README.md](decisions/README.md) — Índice de Architecture Decision Records (ADRs)
- [adr-template.md](decisions/adr-template.md) — <Título de la decisión> ⚠️ slug placeholder

---

## 📖 Guías y operación

### Guías (guides/)

- [[guides-index]] — [README.md](guides/README.md) — Índice de Guías
- [[agent-harness-guide]] — [agent-harness-guide.md](guides/agent-harness-guide.md) — Guía de Agent Harness
- [[artifact-directory-migration]] — [artifact-directory-migration.md](guides/artifact-directory-migration.md) — Guía de migración de la estructura de artefactos SDDF
- [[best-practices-for-agents]] — [best-practices-for-agents.md](guides/best-practices-for-agents.md) — Buenas prácticas para Agentes
- [[best-practices-for-commands]] — [best-practices-for-commands.md](guides/best-practices-for-commands.md) — Buenas prácticas para LLM Clients: Comandos
- [[best-practices-for-skill-testing]] — [best-practices-for-skill-testing.md](guides/best-practices-for-skill-testing.md) — Pruebas de skills
- [[best-practices-for-skills]] — [best-practices-for-skills.md](guides/best-practices-for-skills.md) — Buenas prácticas para LLM Clients: Skills
- [[best-practices-for-system-prompt]] — [best-practices-for-system-prompt.md](guides/best-practices-for-system-prompt.md) — Mejores prácticas para el prompt de sistema
- [[best-practices-for-testing]] — [best-practices-for-testing.md](guides/best-practices-for-testing.md) — Mejores Prácticas para Pruebas de Software
- [[branching-strategy-sddf-git-flow]] — [branching-strategy-sddf-git-flow.md](guides/branching-strategy-sddf-git-flow.md) — Modelo de Branching SDDF git flow
- [[contract-testing]] — [contract-testing.md](guides/contract-testing.md) — Guía Ejecutiva: Contract Testing y Contratos Centralizados
- [[custom-agent-creation-guide]] — [custom-agent-creation-guide.md](guides/custom-agent-creation-guide.md) — Guía de Creación de Custom Agents
- [[custom-skill-creation-guide]] — [custom-skill-creation-guide.md](guides/custom-skill-creation-guide.md) — Guía de Creación de Skills Personalizados
- [[custom-system-prompt-guide]] — [custom-system-prompt-guide.md](guides/custom-system-prompt-guide.md) — Guía para la creación de System Prompts (AGENTS.md, CLAUDE.md, etc.)
- [[descubrir-features-y-capabilities]] — [descubrir-features-y-capabilities.md](guides/descubrir-features-y-capabilities.md) — Descubrir features y agruparlas en capabilities
- [[extreme-agile]] — [extreme-agile.md](guides/extreme-agile.md) — Agilidad Agentica (Agentic Agile)
- [[flight-leves-model]] — [flight-leves-model.md](guides/flight-leves-model.md) — Modelo de Niveles de Vuelo (Flight Levels Model)
- [[harness-engineering]] — [harness-eng-agents-orchestration.md](guides/harness-eng-agents-orchestration.md) — Harness Engineering: Orquestación de Skills y Agentes en Claude Code
- [[harness-engineering-guide]] — [harness-engineering-guide.md](guides/harness-engineering-guide.md) — Guía de Harness Engineering
- [[organization-of-artifacts]] — [organization-of-artifacts.md](guides/organization-of-artifacts.md) — Reglas de la estrategia de organización de artefactos (SDDF)
- [process-for-bug-fixing.md](guides/process-for-bug-fixing.md) — process-for-bug-fixing ⚠️ sin frontmatter
- [[process-for-epic-development]] — [process-for-epic-development.md](guides/process-for-epic-development.md) — El Pipeline Completo de Desarrollo de una Épica
- [[process-for-story-implement]] — [process-for-story-implement.md](guides/process-for-story-implement.md) — El Pipeline Completo de Implementación de una Historia
- [[root-folder-practices]] — [root-folder-practices.md](guides/root-folder-practices.md) — Raíces del repositorio y layout fijo SDDF
- [[sdd-with-bcdd]] — [sdd-with-bcdd.md](guides/sdd-with-bcdd.md) — SDD con Behavior & Contract-Driven Development (BCDD)
- [[sdd]] — [sdd.md](guides/sdd.md) — Spec Driven Development (SDD)
- [[sddf-commands-pipeline]] — [sddf-commands-pipeline.md](guides/sddf-commands-pipeline.md) — Flujos principales SDDF
- [[skill-structural-pattern]] — [skill-structural-pattern.md](guides/skill-structural-pattern.md) — Patrones estructurales de Skills (Skill Structural patterns)
- [[specs-and-workflows]] — [specs-and-workflows.md](guides/specs-and-workflows.md) — Specs y Workflows

### Runbooks (runbooks/)

- [[runbooks-index]] — [README.md](runbooks/README.md) — Runbooks
- [[runbook-actualizar-spec-de-proyecto]] — [actualizar-spec-de-proyecto.md](runbooks/actualizar-spec-de-proyecto.md) — Runbook para actualizar la especificación de proyecto (project.md)
- [[docker-dev-container-with-security-scann]] — [docker-dev-container-with-security-scann.md](runbooks/docker-dev-container-with-security-scann.md) — Integrar Skill Shielder en Dockerfile.dev
- [[docker-dev-container]] — [docker-dev-container.md](runbooks/docker-dev-container.md) — Guía Completa: Entorno de Desarrollo React con Docker + VSCode Dev Containers
- [[runbook-graphify]] — [graphify.md](runbooks/graphify.md) — Runbook: Graphify
- [[runbook-deployment-to-npm]] — [runbook-deployment-to-npm.md](runbooks/runbook-deployment-to-npm.md) — Runbook para despliegue en npm
- [[runbook-tokenmeter]] — [tokenmeter.md](runbooks/tokenmeter.md) — Runbook: Tokenmeter

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
| Nodos indexados | 482 |
| Nodos con frontmatter | 474 |
| Nodos sin frontmatter | 8 |
| Wikilinks pendientes | 1 |
| Enlaces locales, anchors y wikilinks de documentación activa | `node scripts/check-doc-links.js` |
| Última regeneración | ver `updated` en el frontmatter |

> El resultado de enlaces no se mantiene como un número manual: el checker lo genera y la CI lo exige.

---

*Generado por el skill `memory-system`. Regenera con `/memory-system index`.*

---

## ⚠️ Nodos pendientes

Wikilinks presentes en los nodos indexados cuyo slug no resuelve a ningún artefacto:

- [[plan-07-renombrar-skill-story-improve-a-story-refine]] ⚠️ nodo pendiente
