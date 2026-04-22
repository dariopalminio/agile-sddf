**Nombre del Sistema**: Agile SDDF (Spec-Driven Development Framework)
**Título del Documento**: Project Plan
**Versión**: 2.0
**Estado**: Doing
**Fecha**: 2026-04-20
**Generado por**: project-architect

---

## Objetivo

Automatizar el ciclo completo de especificación de proyectos software — desde la intención inicial hasta el backlog planificado de historias de usuario — mediante un framework CLI multiagente declarativo basado exclusivamente en archivos Markdown, con control de WIP, trazabilidad completa y compatibilidad con múltiples runtimes de IA.

---

## Backlog de Features

- [ ] **FEAT-001: Captura de Intención Inicial** — El sistema conduce una entrevista guiada para capturar nombre, problema, visión, criterios de éxito y restricciones del proyecto, escribiendo el resultado en `project-intent.md`. _(deps: —)_
- [ ] **FEAT-002: Extracción Dinámica de Templates** — Los agentes leen los headers `##` y comentarios `<!-- -->` de los templates en runtime para derivar preguntas y completar secciones, sin lógica hardcodeada. _(deps: —)_
- [ ] **FEAT-003: Especificación de Requisitos por Entrevista** — El sistema conduce una entrevista de descubrimiento de perfiles de usuario y especificación de requisitos funcionales y no funcionales sección por sección, escribiendo el resultado en `requirement-spec.md`. _(deps: FEAT-001, FEAT-002)_
- [ ] **FEAT-004: Planificación de Releases con Features FEAT-NNN** — El sistema extrae features atómicas con IDs FEAT-NNN desde `requirement-spec.md`, las prioriza y las agrupa en releases incrementales, escribiendo el resultado en `project-plan.md`. _(deps: FEAT-003)_
- [ ] **FEAT-005: User Story Mapping Interactivo** — El sistema conduce una sesión colaborativa para identificar personas, construir el backbone de actividades, definir el walking skeleton y trazar release slices, escribiendo el resultado en `story-map.md`. _(deps: FEAT-003)_
- [ ] **FEAT-006: Creación de Historias de Usuario** — El sistema genera historias completas en formato Como/Quiero/Para con criterios de aceptación Gherkin (mínimo 1 escenario principal y 1 alternativo), guardando el resultado en `story-{slug}.md`. _(deps: —)_
- [ ] **FEAT-007: Evaluación de Calidad con Rúbrica FINVEST** — El sistema evalúa historias de usuario aplicando la rúbrica FINVEST (Formato + INVEST) con scores Likert 1-5 por dimensión y produce una decisión APROBADA / REFINAR / RECHAZAR / DIVIDIR. _(deps: FEAT-006)_
- [ ] **FEAT-008: Control WIP=1 en el Pipeline** — El sistema detecta documentos con `Estado: Doing` al inicio de cada pipeline y ofrece exactamente dos opciones al usuario: Sobrescribir o Retomar, sin permitir proyectos activos simultáneos. _(deps: FEAT-001)_
- [ ] **FEAT-009: Retoma de Proyecto Interrumpido** — El sistema detecta automáticamente el campo `Estado` de los documentos existentes y reanuda el trabajo desde la sección incompleta sin re-preguntar secciones ya completadas. _(deps: FEAT-008)_
- [ ] **FEAT-010: Gates de Revisión Humana entre Fases** — El sistema presenta un resumen del documento generado y solicita confirmación del usuario antes de avanzar a la siguiente fase; el documento avanza a `Estado: Ready` solo tras confirmación. _(deps: FEAT-003, FEAT-004)_
- [ ] **FEAT-011: Integración Story Map en Planning** — El sistema detecta si existe `story-map.md` durante la fase de Planning y lo usa como guía estructural para agrupar features en releases respetando el backbone. _(deps: FEAT-004, FEAT-005)_
- [ ] **FEAT-012: División de Historias con 8 Patrones de Splitting** — El sistema divide historias grandes en historias más pequeñas e independientes aplicando uno de los 8 patrones de splitting (pasos de flujo, variaciones de reglas, datos, complejidad, esfuerzo, dependencias externas, DevOps, TADs). _(deps: FEAT-006)_
- [ ] **FEAT-013: Ciclo Iterativo de Refinamiento de Historias** — El sistema orquesta el ciclo completo creación → evaluación → split → mejora con gate anti-bucle que solicita confirmación antes de reiterar y ofrece tres salidas explícitas. _(deps: FEAT-006, FEAT-007, FEAT-012)_
- [ ] **FEAT-014: Búsqueda de Historias por Término** — El sistema permite invocar skills de historia con un término corto, busca automáticamente en `docs/specs/stories/` el archivo correspondiente y solicita selección si hay múltiples coincidencias. _(deps: FEAT-006)_
- [ ] **FEAT-015: Pipeline Completo en una Sola Sesión** — El skill `project-flow` ejecuta las tres fases (Begin Intention → Discovery → Planning) en una sesión continua con detección automática del estado actual del pipeline y gates entre etapas. _(deps: FEAT-001, FEAT-003, FEAT-004, FEAT-009, FEAT-010)_
- [ ] **FEAT-016: Backlog de Historias con Trazabilidad** — El sistema mantiene un registro de backlog de sesión con ID, archivo, origen (original o derivado de split), estado y decisión FINVEST, con trazabilidad mediante IDs únicos ST-00X. _(deps: FEAT-007, FEAT-012)_
- [ ] **FEAT-017: Ingeniería Inversa de Repositorios** — El sistema analiza un repositorio existente mediante 4 agentes especializados en paralelo y un agente sintetizador para generar automáticamente `requirement-spec.md`, marcando secciones sin datos como `<!-- PENDING MANUAL REVIEW -->`. _(deps: FEAT-002)_
- [ ] **FEAT-018: Análisis de Arquitectura Técnica del Repositorio** — El agente `reverse-engineer-architect` detecta stack tecnológico, dependencias, frameworks, patrones arquitectónicos y puntos de integración con niveles de confianza DIRECT / INFERRED / SUGGESTED. _(deps: FEAT-017)_
- [ ] **FEAT-019: Extracción de Features desde Perspectiva del Usuario** — El agente `reverse-engineer-product-discovery` analiza rutas, endpoints, textos de UI y componentes del repositorio para producir un inventario de features agrupado por dominio de negocio. _(deps: FEAT-017)_
- [ ] **FEAT-020: Extracción de Reglas de Negocio desde el Código** — El agente `reverse-engineer-business-analyst` analiza validaciones, permisos, workflows y lógica condicional del repositorio para producir un catálogo de reglas de negocio clasificadas por tipo. _(deps: FEAT-017)_
- [ ] **FEAT-021: Reconstrucción del Mapa de Navegación** — El agente `reverse-engineer-ux-flow-mapper` mapea la estructura de navegación del repositorio (rutas, pantallas, guards, flujos) y produce un árbol ASCII compatible con el template de requisitos. _(deps: FEAT-017)_
- [ ] **FEAT-022: Creación de Nuevas Skills con Ciclo Iterativo** — El sistema permite crear nuevas skills mediante el ciclo: captura de intención → redacción del SKILL.md → generación de casos de prueba → ejecución paralela → review del usuario → mejora hasta satisfacción. _(deps: —)_
- [ ] **FEAT-023: Análisis con Scope Acotado (--focus)** — El sistema permite limitar el análisis de ingeniería inversa a una ruta específica del repositorio usando el flag `--focus <path>`. _(deps: FEAT-017)_
- [ ] **FEAT-024: Modo Incremental de Actualización (--update)** — El sistema re-analiza solo las secciones marcadas como `<!-- PENDING MANUAL REVIEW -->` en el documento existente, preservando verbatim las secciones ya completas. _(deps: FEAT-017)_
- [ ] **FEAT-025: Benchmarking Comparativo de Versiones de Skills** — El sistema ejecuta casos de prueba en paralelo (con skill vs sin skill), gradea resultados contra aserciones y genera un viewer HTML para comparación cualitativa y cuantitativa. _(deps: FEAT-022)_
- [ ] **FEAT-026: Empaquetado y Distribución de Skills** — El sistema permite empaquetar una skill finalizada en un archivo `.skill` para distribuirla e instalarla en otros entornos. _(deps: FEAT-022)_
- [ ] **FEAT-027: Validación de Formato de Release** — El sistema valida que un archivo de especificación de release cumple la estructura obligatoria del template `release-spec-template.md`, produciendo resultado APROBADO, REFINAR o RECHAZADO. _(deps: FEAT-004)_
- [ ] **FEAT-028: Generación de Especificaciones de Release** — El skill `releases-from-project-plan` crea `release-[ID]-[Nombre].md` a partir de `project-plan.md` usando el template `release-spec-template.md`. _(deps: FEAT-004, FEAT-027)_
- [ ] **FEAT-029: Generación de Historias desde Release** — El skill `release-generate-stories` crea `story-[ID]-[Nombre].md` a partir del archivo de release usando el template `story-gherkin-template.md`. _(deps: FEAT-028, FEAT-006)_
- [ ] **FEAT-030: **Soporte Atlassian Rovo**: Agente `story-creator-agent.md` para el runtime Rovo. _(deps: FEAT-006)_
- [ ] **FEAT-031: Soporte Atlassian Rovo expandido** — Agente `story-creator-agent.md` actualizado para operar con el conjunto completo de skills (creation, evaluation, split) en el runtime Rovo. _(deps: FEAT-030)_
- [ ] **FEAT-032: Soporte Atlassian Rovo para Validar Release** — Agente `release-validator-agent.md` para el runtime Rovo. _(deps: FEAT-027, FEAT-030)_
- [ ] **FEAT-033: Soporte Atlassian Rovo para crear Epic Release** — Agente `release-creator-agent.md` para el runtime Rovo. _(deps: FEAT-027, FEAT-030)_
- [ ] **FEAT-034: Rovo Agent: Release Reverse Generator from children** — Agente `release-reverse-generator.md` para el runtime Rovo. _(deps: FEAT-027, FEAT-030)

---

## Propuesta de Releases

### Release 00 — Estructura Base y Mecanismo de Templates

**Objetivo:** Establecer la estructura fundacional del framework: convenciones de directorios, configuración de entornos reproducibles y el mecanismo de extracción dinámica de templates que habilita a todos los agentes a generar preguntas contextuales en runtime sin lógica hardcodeada.

- [ ] FEAT-002 - Extracción Dinámica de Templates

**Ítems de soporte (sin FEAT propio):**
- Estructura inicial de directorios `.claude/skills/`, `.claude/agents/`, `docs/specs/`
- Convenciones CLAUDE.md y AGENTS.md del framework
- Configuración de entorno Docker con imagen `debian:bookworm-slim`
- Soporte multi-runtime inicial: Claude Code (`.claude/`), GitHub Copilot (`.github/`), Codex/Cursor (`.agents/`)

**Criterios de éxito:**
- [ ] Modificar un comentario `<!-- -->` o header `##` en un template produce un cambio observable en las preguntas generadas por el agente sin modificar el SKILL.md del agente.
- [ ] El entorno Docker permite reproducir el entorno de desarrollo sin dependencias locales.

---

### Release 01 — Features Spec Builder

**Estado:** Ready | **Fecha:** 2026-04-09

**Objetivo:** Primera versión funcional del framework. Establece el ciclo completo de gestión de historias de usuario: creación, evaluación de calidad con FINVEST y división de épicas, demostrando que el ciclo puede automatizarse con skills Markdown y agentes de IA, sin código ejecutable propio.

- [ ] FEAT-006 - Creación de Historias de Usuario
- [ ] FEAT-007 - Evaluación de Calidad con Rúbrica FINVEST
- [ ] FEAT-012 - División de Historias con 8 Patrones de Splitting

**Ítems de soporte (sin FEAT propio):**
- Agente `story-creator-agent.md` para el runtime Atlassian Rovo
- Template `story-gherkin-template.md` para historias de usuario

**Criterios de éxito:**
- [ ] El skill `story-creation` genera una historia en formato Como/Quiero/Para con al menos 1 escenario principal y 1 alternativo en Gherkin para cualquier input de usuario válido.
- [ ] El skill `story-evaluation` aplica la rúbrica FINVEST y produce una decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) con score numérico Likert 1-5 por dimensión.
- [ ] El skill `story-split` divide una historia grande en historias más pequeñas aplicando uno de los 8 patrones de splitting.

---

### Release 02 — Project Spec Builder

**Estado:** Ready | **Fecha:** 2026-04-16

**Objetivo:** Incorporar el pipeline completo de especificación de proyectos (ProjectSpecFactory): captura de intención, discovery de usuarios, especificación de requisitos y planificación de releases. Se añaden tres agentes especializados y el control WIP=1 para impedir proyectos activos simultáneos.

- [ ] FEAT-001 - Captura de Intención Inicial
- [ ] FEAT-003 - Especificación de Requisitos por Entrevista
- [ ] FEAT-004 - Planificación de Releases con Features FEAT-NNN
- [ ] FEAT-008 - Control WIP=1 en el Pipeline
- [ ] FEAT-010 - Gates de Revisión Humana entre Fases

**Ítems de soporte (sin FEAT propio):**
- Agentes `project-pm`, `project-architect`, `project-ux`
- Templates canónicos: `project-intent-template.md`, `requirement-spec-template.md`, `project-plan-template.md`
- Soporte Google Gemini Gems: prompts en `gem/prompts/`
- Documentos de ejemplo del pipeline aplicado al propio proyecto SDDF

**Criterios de éxito:**
- [ ] El pipeline ProjectSpecFactory produce los 3 documentos canónicos (`project-intent.md`, `requirement-spec.md`, `project-plan.md`) en una sesión continua sin errores, con `Estado: Ready` en cada documento al finalizar.
- [ ] El control WIP=1 impide la creación de múltiples proyectos activos sin confirmación explícita; ante un documento con `Estado: Doing`, el sistema presenta exactamente las opciones "Sobrescribir" y "Retomar".

---

### Release 03 — Reverse Engineering

**Estado:** Ready | **Fecha:** 2026-04-16

**Objetivo:** Añadir la capacidad de ingeniería inversa: dado un repositorio existente, el sistema genera automáticamente un `requirement-spec.md` completo mediante análisis paralelo de 4 agentes especializados y un sintetizador. Incluye soporte de scope acotado (`--focus`) y modo incremental (`--update`).

- [ ] FEAT-017 - Ingeniería Inversa de Repositorios
- [ ] FEAT-018 - Análisis de Arquitectura Técnica del Repositorio
- [ ] FEAT-019 - Extracción de Features desde Perspectiva del Usuario
- [ ] FEAT-020 - Extracción de Reglas de Negocio desde el Código
- [ ] FEAT-021 - Reconstrucción del Mapa de Navegación
- [ ] FEAT-023 - Análisis con Scope Acotado (--focus)
- [ ] FEAT-024 - Modo Incremental de Actualización (--update)

**Ítems de soporte (sin FEAT propio):**
- Agente `reverse-engineer-synthesizer` (fusión de outputs en `requirement-spec.md`)
- Niveles de confianza DIRECT / INFERRED / SUGGESTED en hallazgos
- Archivos intermedios `.tmp/rfc-*.md`
- `requirement-spec-template.md` actualizado con campo "Es un"

**Criterios de éxito:**
- [ ] El skill `reverse-engineering` genera un `requirement-spec.md` completo a partir de un repositorio existente con al menos el 80% de secciones completadas automáticamente; las secciones sin datos suficientes se marcan como `<!-- PENDING MANUAL REVIEW -->`.
- [ ] El flag `--focus <path>` limita el análisis al subdirectorio especificado.
- [ ] El flag `--update` re-analiza únicamente las secciones marcadas como `<!-- PENDING MANUAL REVIEW -->` y preserva verbatim el resto del documento existente.

---

### Release 04 — Refactor Features Spec Builder

**Estado:** Ready | **Fecha:** 2026-04-17

**Objetivo:** Release de consolidación y calidad. Se renombran skills para mayor consistencia semántica, se refuerzan las restricciones de input, se mejoran los ejemplos few-shot y se amplía el soporte multi-runtime. No añade nuevas funcionalidades sino que afina las herramientas existentes para producir evaluaciones más precisas y reducir errores de uso.

**Mejoras sobre features existentes:**
- Mejora de FEAT-007: renombrado `story-finvest-evaluation` → `story-evaluation`, gate explícito para imágenes adjuntas, actualización de `example-refinar.md` para representar con mayor fidelidad el caso INVEST aceptable con formato parcial.
- Mejora de FEAT-006 y FEAT-012: sincronización de skills `story-creation` y `story-split` entre `.claude/skills/`, `.agents/skills/` y `.github/skills/` para garantizar paridad entre runtimes.

**Ítems de soporte (sin FEAT propio):**
- Agente `story-creator-agent.md` actualizado para operar con el conjunto completo de skills en Atlassian Rovo
- README y CLAUDE.md revisados para reflejar la arquitectura definitiva del módulo de gestión de historias

**Criterios de éxito:**
- [ ] El skill `story-evaluation` rechaza imágenes adjuntas con un mensaje explícito solicitando el texto de la historia.
- [ ] Los tres skills de historia (`story-creation`, `story-evaluation`, `story-split`) producen resultados idénticos independientemente del runtime usado (Claude Code, GitHub Copilot, Codex/Cursor).

---

### Release 05 — Enhance Project Spec

**Estado:** Ready | **Fecha:** 2026-04-18

**Objetivo:** Expandir el pipeline de especificación con orquestación de sesión completa, story mapping según Jeff Patton como fase pre-planning, refinamiento iterativo de historias con gate anti-bucle, y centralización de templates compartidos. También incluye la primera auto-especificación del framework mediante ingeniería inversa.

- [ ] FEAT-005 - User Story Mapping Interactivo
- [ ] FEAT-011 - Integración Story Map en Planning
- [ ] FEAT-013 - Ciclo Iterativo de Refinamiento de Historias
- [ ] FEAT-015 - Pipeline Completo en una Sola Sesión

**Ítems de soporte (sin FEAT propio):**
- Agentes `project-story-mapper` y `story-product-owner`
- Centralización de templates compartidos en `docs/specs/templates/`
- Limpieza de directorios legacy `.agents/` y `.github/` desactualizados
- Auto-especificación del framework SDDF: `docs/specs/project/requirement-spec.md` generado por `/reverse-engineering` con 30 FRs, 13 NFRs, árbol de navegación ASCII y gaps identificados

**Criterios de éxito:**
- [ ] El skill `project-flow` ejecuta las tres fases del pipeline en una sesión continua detectando automáticamente el estado actual y aplicando los gates de revisión sin intervención manual.
- [ ] El skill `project-story-mapping` produce `story-map.md` con backbone, walking skeleton y al menos 2 release slices a partir de `requirement-spec.md`.
- [ ] El skill `story-refine` orquesta el ciclo creación → evaluación → split → mejora y activa el gate anti-bucle antes de cada iteración adicional, ofreciendo las tres salidas explícitas al usuario.

---

### Release 06 — Release & Story Generator & Soporte Atlassian Rovo

**Estado:** Doing | **Fecha:** 2026-04-20

**Objetivo:** Automatizar la creación de los dos artefactos clave posteriores al planning: el documento de release (a partir de `project-plan.md`) y las historias de usuario derivadas (a partir del release generado), cerrando el ciclo desde el plan hasta el backlog de historias listo para desarrollo.

- [ ] FEAT-027 - Validación de Formato de Release
- [ ] FEAT-028 - Generación de Especificaciones de Release
- [ ] FEAT-029 - Generación de Historias desde Release

**Criterios de éxito:**
- [ ] El skill `release-format-validation` produce APROBADO, REFINAR (con lista de secciones faltantes) o RECHAZADO para cualquier archivo de release dado.
- [ ] El skill `generate-release` produce un `release-[ID]-[Nombre].md` válido que supera la validación de formato a partir de la información de `project-plan.md`.
- [ ] El skill `generate-stories` produce al menos una `story-[ID]-[Nombre].md` por feature del release, con formato Como/Quiero/Para y criterios Gherkin, que supera la evaluación FINVEST con decisión APROBADA.

---

### Release 07 — Robustez y Trazabilidad (Planificado)

**Objetivo:** Completar la resiliencia del pipeline ante interrupciones, añadir búsqueda de historias por término y establecer trazabilidad bidireccional del backlog con IDs únicos ST-00X.

- [ ] FEAT-009 - Retoma de Proyecto Interrumpido
- [ ] FEAT-014 - Búsqueda de Historias por Término
- [ ] FEAT-016 - Backlog de Historias con Trazabilidad

**Criterios de éxito:**
- [ ] Al retomar un proyecto interrumpido, el agente no re-pregunta ninguna sección ya completada y reanuda desde la primera sección con contenido ausente o incompleto.
- [ ] El sistema encuentra el archivo de historia correcto con un término corto y solicita selección cuando hay múltiples coincidencias.
- [ ] El backlog de sesión mantiene IDs únicos ST-00X con origen (original / split), estado y decisión FINVEST para cada historia.

---

### Release 08 — Meta-Framework y Distribución (Planificado)

**Objetivo:** Incorporar las herramientas para crear, benchmarkear y distribuir nuevas skills, convirtiendo al framework en un meta-framework extensible por la comunidad.

- [ ] FEAT-022 - Creación de Nuevas Skills con Ciclo Iterativo
- [ ] FEAT-025 - Benchmarking Comparativo de Versiones de Skills
- [ ] FEAT-026 - Empaquetado y Distribución de Skills

**Criterios de éxito:**
- [ ] El sistema `skill-creator` permite crear una nueva skill completa (SKILL.md + casos de prueba) en una sesión guiada.
- [ ] El benchmarking ejecuta casos de prueba en paralelo (con skill vs sin skill) y genera un viewer HTML con comparación cualitativa y cuantitativa.
- [ ] Una skill empaquetada como `.skill` puede instalarse en otro entorno con un único comando.

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Total Features | 29 |
| Features en Release 00 | 1 |
| Features en Release 01 | 3 |
| Features en Release 02 | 5 |
| Features en Release 03 | 7 |
| Features en Release 04 | 0 (calidad) |
| Features en Release 05 | 4 |
| Features en Release 06 | 3 |
| Features en Release 07 | 3 |
| Features en Release 08 | 3 |
| Releases planificados | 9 |
