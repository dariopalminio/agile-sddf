**Nombre del Sistema**: Agile SDDF (Spec-Driven Development Framework)
**Título del Documento**: Project Plan
**Versión**: 1.0
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

---

## Propuesta de Releases

### Release Walking Skeleton: Pipeline Funcional de Extremo a Extremo

**Objetivo:** Demostrar que el sistema funciona de principio a fin — capturar una intención de proyecto, especificar sus requisitos, planificar releases, mapear historias de usuario, crear una historia y evaluarla con FINVEST — usando exclusivamente templates dinámicos, sin lógica hardcodeada en los agentes.

- [ ] FEAT-001 - Captura de Intención Inicial
- [ ] FEAT-002 - Extracción Dinámica de Templates
- [ ] FEAT-003 - Especificación de Requisitos por Entrevista
- [ ] FEAT-004 - Planificación de Releases con Features FEAT-NNN
- [ ] FEAT-005 - User Story Mapping Interactivo
- [ ] FEAT-006 - Creación de Historias de Usuario
- [ ] FEAT-007 - Evaluación de Calidad con Rúbrica FINVEST

**Criterios de éxito:**
- [ ] El pipeline ProjectSpecFactory produce los 3 documentos canónicos (`project-intent.md`, `requirement-spec.md`, `project-plan.md`) en una sesión continua sin errores, con `Estado: Ready` en cada documento al finalizar.
- [ ] El skill `story-evaluation` aplica la rúbrica FINVEST y produce una decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) con score numérico Likert 1-5 por dimensión para cualquier historia de usuario válida.
- [ ] Modificar un comentario `<!-- -->` o header `##` en un template produce un cambio observable en las preguntas generadas por el agente sin modificar el SKILL.md del agente.

---

### Release 1: Pipeline Robusto y Ciclo de Calidad Completo

**Objetivo:** Hacer el pipeline resiliente ante interrupciones y errores de scope, cerrar el ciclo de calidad de historias de usuario con splitting y refinamiento iterativo, e integrar el story map como guía estructural en la planificación.

- [ ] FEAT-008 - Control WIP=1 en el Pipeline
- [ ] FEAT-009 - Retoma de Proyecto Interrumpido
- [ ] FEAT-010 - Gates de Revisión Humana entre Fases
- [ ] FEAT-011 - Integración Story Map en Planning
- [ ] FEAT-012 - División de Historias con 8 Patrones de Splitting
- [ ] FEAT-013 - Ciclo Iterativo de Refinamiento de Historias
- [ ] FEAT-014 - Búsqueda de Historias por Término

**Criterios de éxito:**
- [ ] El control WIP=1 impide la creación de múltiples proyectos activos sin confirmación explícita; ante un documento con `Estado: Doing`, el sistema presenta exactamente las opciones "Sobrescribir" y "Retomar".
- [ ] Al retomar un proyecto interrumpido, el agente no re-pregunta ninguna sección ya completada y reanuda desde la primera sección con contenido ausente o incompleto.
- [ ] El skill `story-refine` orquesta el ciclo creación → evaluación → split → mejora y activa el gate anti-bucle antes de cada iteración adicional, ofreciendo las tres salidas explícitas al usuario.

---

### Release 2: Ingeniería Inversa, Pipeline Orquestado y Meta-Framework

**Objetivo:** Ampliar el framework con análisis automático de repositorios existentes, la capacidad de ejecutar el pipeline completo en una sola sesión orquestada, el backlog de historias con trazabilidad bidireccional y las herramientas para crear y distribuir nuevas skills.

- [ ] FEAT-015 - Pipeline Completo en una Sola Sesión
- [ ] FEAT-016 - Backlog de Historias con Trazabilidad
- [ ] FEAT-017 - Ingeniería Inversa de Repositorios
- [ ] FEAT-018 - Análisis de Arquitectura Técnica del Repositorio
- [ ] FEAT-019 - Extracción de Features desde Perspectiva del Usuario
- [ ] FEAT-020 - Extracción de Reglas de Negocio desde el Código
- [ ] FEAT-021 - Reconstrucción del Mapa de Navegación
- [ ] FEAT-022 - Creación de Nuevas Skills con Ciclo Iterativo

**Criterios de éxito:**
- [ ] El skill `reverse-engineering` genera un `requirement-spec.md` completo a partir de un repositorio existente con al menos el 80% de secciones completadas automáticamente; las secciones sin datos suficientes se marcan como `<!-- PENDING MANUAL REVIEW -->`.
- [ ] El skill `project-flow` ejecuta las tres fases del pipeline en una sesión continua detectando automáticamente el estado actual y aplicando los gates de revisión sin intervención manual de configuración.

---

### Futuro: Diferenciación Avanzada y Distribución

**Objetivo:** Incorporar capacidades avanzadas de análisis incremental, scope acotado para ingeniería inversa, benchmarking comparativo de skills y empaquetado para distribución como extensión del meta-framework.

- [ ] FEAT-023 - Análisis con Scope Acotado (--focus)
- [ ] FEAT-024 - Modo Incremental de Actualización (--update)
- [ ] FEAT-025 - Benchmarking Comparativo de Versiones de Skills
- [ ] FEAT-026 - Empaquetado y Distribución de Skills

**Criterios de éxito:**
- [ ] El flag `--focus <path>` limita el análisis de ingeniería inversa al subdirectorio especificado, reduciendo el tiempo de análisis proporcionalmente al scope acotado.
- [ ] El comando `--update` re-analiza únicamente las secciones marcadas como `<!-- PENDING MANUAL REVIEW -->` y preserva verbatim el resto del documento existente.

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Total Features | 26 |
| Features en Walking Skeleton | 7 |
| Features en Release 1 | 7 |
| Features en Release 2 | 8 |
| Features en Futuro | 4 |
| Releases planificados | 4 |
