# Story Map — Agile SDDF (Spec-Driven Development Framework)

**Fecha:** 2026-04-20
**Versión:** 2.0
**Estado:** Ready
**Generado por:** project-story-mapper

---

## Contexto del Proyecto

Agile SDDF es un framework AI-CLI multiagente que automatiza el ciclo completo de desarrollo de software — desde la intención inicial hasta la generación de código asistida por multi-agentes — usando exclusivamente archivos Markdown como lenguaje de definición. Resuelve la falta de metodología estructurada para trabajar con Spec-Driven Development (SDD) que sufren developers, builders, freelancers y equipos ágiles que usan IA, y que terminan usando Vibe Coding, GitHub Copilot, SpecKit u OpenSpec de forma artesanal sin trazabilidad ni consistencia. El framework opera en múltiples runtimes (Claude Code, GitHub Copilot, OpenCode) y tendrá una versión publicada en npm a fines de mayo 2026.

---

## Personas

| Persona | Rol | Objetivo Principal |
|---------|-----|-------------------|
| Developer / Builder Individual | Desarrollador o freelancer que usa un runtime de IA (Claude Code, GitHub Copilot, OpenCode) | Seguir un proceso reproducible de SDD desde la intención hasta el código generado, sin salir del CLI |
| Product Owner / Analista | Responsable de la calidad de las historias de usuario y la gestión del backlog | Garantizar que las historias cumplan la rúbrica FINVEST y que los releases tengan specs bien estructuradas antes de entrar al ciclo de desarrollo |
| Arquitecto de Software | Rol que conduce entrevistas de requisitos y planifica releases | Extraer features FEAT-NNN, planificar releases con criterio de valor/dependencias/riesgo, y documentar repositorios existentes mediante ingeniería inversa |

---

## Mapa de Historias (ASCII)

```
TIEMPO / JOURNEY DEL USUARIO →
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
BACKBONE (Actividades)    │ 1. Iniciar        │ 2. Descubrir      │ 3. Planificar     │ 4. Mapear         │ 5. Gestionar      │ 6. Evaluar        │ 7. Generar        │ 8. Publicar
                          │ Proyecto          │ Requisitos        │ Releases          │ Historias         │ Historias         │ Calidad           │ Releases y Stories│ Skills
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Releases 00–02            │ FEAT-001          │ FEAT-003          │ FEAT-004          │ FEAT-005          │ FEAT-006          │ FEAT-007          │ —                 │ —
(Base del Framework)      │ Capturar          │ Conducir          │ Extraer features  │ Conducir sesión   │ Crear historia    │ Evaluar con       │                   │
                          │ intención con     │ entrevista de     │ FEAT-NNN y        │ de story mapping  │ Como/Quiero/Para  │ rúbrica FINVEST   │                   │
                          │ entrevista guiada │ usuarios y        │ agrupar en        │ → story-map.md    │ + criterios       │ → decisión        │                   │
                          │ → project-        │ requisitos →      │ releases →        │ con mapa ASCII    │ Gherkin           │ APROBADA /        │                   │
                          │ intent.md         │ requirement-      │ project-plan.md   │                   │                   │ REFINAR /         │                   │
                          │ FEAT-002          │ spec.md           │                   │                   │ FEAT-012          │ RECHAZAR /        │                   │
                          │ Templates         │                   │ FEAT-008          │                   │ Dividir con 8     │ DIVIDIR           │                   │
                          │ dinámicos en      │                   │ Control WIP=1     │                   │ patrones de       │                   │                   │
                          │ runtime           │                   │ FEAT-010          │                   │ splitting         │                   │                   │
                          │                   │                   │ Gates de revisión │                   │                   │                   │                   │
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Releases 03–05            │ FEAT-015          │ FEAT-017–021      │ FEAT-011          │ —                 │ FEAT-013          │ —                 │ —                 │ —
(Ingeniería Inversa       │ Pipeline completo │ Ingeniería inversa│ Integración de    │                   │ Ciclo iterativo   │                   │                   │
 y Mejoras)               │ en una sola sesión│ con 4 agentes en  │ story-map.md como │                   │ de refinamiento   │                   │                   │
                          │ (project-flow)    │ paralelo →        │ guía estructural  │                   │ (creación →       │                   │                   │
                          │ con gates entre   │ requirement-      │ en planning       │                   │ evaluación →      │                   │                   │
                          │ etapas            │ spec.md           │                   │                   │ split → mejora)   │                   │                   │
                          │                   │ FEAT-023 --focus  │                   │                   │                   │                   │                   │
                          │                   │ FEAT-024 --update │                   │                   │                   │                   │                   │
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Release 06 (Doing)        │ —                 │ —                 │ —                 │ —                 │ —                 │ —                 │ FEAT-027          │ —
(Release & Story          │                   │                   │                   │                   │                   │                   │ Validar formato   │
 Generator)               │                   │                   │                   │                   │                   │                   │ de release spec   │
                          │                   │                   │                   │                   │                   │                   │ FEAT-028          │
                          │                   │                   │                   │                   │                   │                   │ Generar release   │
                          │                   │                   │                   │                   │                   │                   │ desde project-    │
                          │                   │                   │                   │                   │                   │                   │ plan.md           │
                          │                   │                   │                   │                   │                   │                   │ FEAT-029          │
                          │                   │                   │                   │                   │                   │                   │ Generar stories   │
                          │                   │                   │                   │                   │                   │                   │ desde release     │
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Releases 07–08            │ FEAT-009          │ —                 │ —                 │ —                 │ FEAT-014          │ FEAT-016          │ —                 │ FEAT-022
(Planificados)            │ Retoma de         │                   │                   │                   │ Búsqueda de       │ Backlog con       │                   │ Creación de
                          │ proyecto          │                   │                   │                   │ historias por     │ trazabilidad      │                   │ nuevas skills
                          │ interrumpido      │                   │                   │                   │ término           │ ST-00X            │                   │ FEAT-025
                          │                   │                   │                   │                   │                   │                   │                   │ Benchmarking
                          │                   │                   │                   │                   │                   │                   │                   │ FEAT-026
                          │                   │                   │                   │                   │                   │                   │                   │ Empaquetado
                          │                   │                   │                   │                   │                   │                   │                   │ .skill
```

---

## Backbone — Actividades del Usuario

| # | Actividad | Descripción |
|---|-----------|-------------|
| 1 | Iniciar Proyecto | El usuario captura la intención inicial del proyecto mediante una entrevista guiada que produce `project-intent.md` con control WIP=1 |
| 2 | Descubrir Requisitos | El usuario colabora con el sistema en la identificación de perfiles de usuario y la especificación completa de requisitos, produciendo `requirement-spec.md` |
| 3 | Planificar Releases | El sistema extrae features FEAT-NNN, las prioriza y las agrupa en releases incrementales produciendo `project-plan.md` |
| 4 | Mapear Historias | El usuario conduce una sesión de User Story Mapping para visualizar el viaje del usuario y trazar release slices, produciendo `story-map.md` |
| 5 | Gestionar Historias | El Product Owner crea, busca y divide historias de usuario en formato Como/Quiero/Para con criterios de aceptación Gherkin |
| 6 | Evaluar Calidad | El sistema evalúa historias con la rúbrica FINVEST y orquesta ciclos de refinamiento hasta lograr calidad suficiente |
| 7 | Generar Releases y Stories | El sistema genera documentos de release desde `project-plan.md` y crea historias de usuario a partir de cada release generado |
| 8 | Publicar Skills | El desarrollador crea, versiona, benchmarkea y empaqueta nuevas skills para extender el framework |

---

## Walking Skeleton

| Actividad | Implementación Mínima |
|-----------|----------------------|
| Iniciar Proyecto | Entrevista interactiva mínima que captura nombre, problema y visión → escribe `project-intent.md` con `Estado: Ready` (FEAT-001) |
| Descubrir Requisitos | Entrevista de usuarios y requisitos sección por sección del template → escribe `requirement-spec.md` con `Estado: Ready` (FEAT-003) |
| Planificar Releases | Extrae features FEAT-NNN desde `requirement-spec.md` y las agrupa en al menos 2 releases → escribe `project-plan.md` (FEAT-004) |
| Mapear Historias | Sesión interactiva que identifica personas, backbone de actividades y walking skeleton → escribe `story-map.md` con mapa ASCII (FEAT-005) |
| Gestionar Historias | Genera una historia completa en formato Como/Quiero/Para con mínimo 1 criterio de aceptación Gherkin → `story-{slug}.md` (FEAT-006) |
| Evaluar Calidad | Aplica rúbrica FINVEST a una historia y produce decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) con score numérico (FEAT-007) |
| Generar Releases y Stories | Valida formato de release spec y genera el primer `release-[ID].md` desde `project-plan.md` (FEAT-027, FEAT-028) |
| Publicar Skills | Captura intención de skill + redacta SKILL.md inicial que puede ejecutarse en Claude Code (FEAT-022) |

---

## User Tasks por Actividad

### Actividad 1 — Iniciar Proyecto

| Prioridad | Historia | FEAT | Release |
|-----------|----------|------|---------|
| Alta | Como Builder, quiero que el sistema detecte si hay un proyecto activo (Estado: Doing) y me ofrezca Sobrescribir o Retomar antes de crear uno nuevo | FEAT-008 | Release 02 |
| Alta | Como Builder, quiero que el sistema me haga preguntas guiadas para capturar nombre, problema, visión y criterios de éxito del proyecto | FEAT-001 | Release 02 |
| Alta | Como Builder, quiero que las preguntas del agente se deriven dinámicamente de los comentarios del template, sin lógica hardcodeada | FEAT-002 | Release 00 |
| Alta | Como Builder, quiero que el sistema ejecute las tres fases del pipeline en una sola sesión continua con gates de revisión entre cada etapa | FEAT-015 | Release 05 |
| Media | Como Builder, quiero retomar un proyecto interrumpido sin que el sistema me vuelva a preguntar lo que ya respondí | FEAT-009 | Release 07 |

### Actividad 2 — Descubrir Requisitos

| Prioridad | Historia | FEAT | Release |
|-----------|----------|------|---------|
| Alta | Como Arquitecto, quiero conducir una entrevista de descubrimiento de perfiles de usuario con sus dolores y necesidades | FEAT-003 | Release 02 |
| Alta | Como Arquitecto, quiero especificar requisitos funcionales y no funcionales sección por sección siguiendo el template de requisitos | FEAT-003 | Release 02 |
| Alta | Como Arquitecto, quiero analizar un repositorio existente con 4 agentes en paralelo para generar `requirement-spec.md` automáticamente | FEAT-017 | Release 03 |
| Alta | Como Arquitecto, quiero que los 4 agentes de análisis produzcan hallazgos clasificados como DIRECT / INFERRED / SUGGESTED | FEAT-018–021 | Release 03 |
| Media | Como Arquitecto, quiero limitar el análisis de ingeniería inversa a una ruta específica usando `--focus <path>` | FEAT-023 | Release 03 |
| Media | Como Arquitecto, quiero re-analizar solo las secciones marcadas como PENDING usando el flag `--update` | FEAT-024 | Release 03 |

### Actividad 3 — Planificar Releases

| Prioridad | Historia | FEAT | Release |
|-----------|----------|------|---------|
| Alta | Como Arquitecto, quiero que el sistema extraiga features FEAT-NNN desde `requirement-spec.md` y las priorice automáticamente | FEAT-004 | Release 02 |
| Alta | Como Arquitecto, quiero que el sistema agrupe features en releases incrementales con el primer release desplegable (3-5 features) | FEAT-004 | Release 02 |
| Alta | Como Builder, quiero confirmar o ajustar el plan de releases antes de que el documento avance a Estado: Ready | FEAT-010 | Release 02 |
| Media | Como Arquitecto, quiero que el sistema use `story-map.md` como guía estructural si existe, respetando el backbone como organizador | FEAT-011 | Release 05 |

### Actividad 4 — Mapear Historias

| Prioridad | Historia | FEAT | Release |
|-----------|----------|------|---------|
| Alta | Como Product Owner, quiero una sesión interactiva para identificar personas, backbone de actividades y walking skeleton | FEAT-005 | Release 05 |
| Alta | Como Product Owner, quiero trazar release slices horizontales sobre el mapa para cada release planificado | FEAT-005 | Release 05 |
| Media | Como Arquitecto, quiero que `story-map.md` se use como guía en la fase de Planning para agrupar features en releases | FEAT-011 | Release 05 |

### Actividad 5 — Gestionar Historias

| Prioridad | Historia | FEAT | Release |
|-----------|----------|------|---------|
| Alta | Como Product Owner, quiero generar historias completas en formato Como/Quiero/Para con criterios de aceptación Gherkin | FEAT-006 | Release 01 |
| Alta | Como Product Owner, quiero dividir historias grandes aplicando uno de los 8 patrones de splitting | FEAT-012 | Release 01 |
| Media | Como Product Owner, quiero buscar historias existentes por término o nombre de archivo sin recordar la ruta exacta | FEAT-014 | Release 07 |
| Media | Como Product Owner, quiero mantener un backlog de sesión con ID, archivo, origen y estado por historia (trazabilidad ST-00X) | FEAT-016 | Release 07 |

### Actividad 6 — Evaluar Calidad

| Prioridad | Historia | FEAT | Release |
|-----------|----------|------|---------|
| Alta | Como Product Owner, quiero evaluar una historia con la rúbrica FINVEST y obtener una decisión con score numérico por dimensión | FEAT-007 | Release 01 |
| Alta | Como Product Owner, quiero que el sistema orqueste un ciclo completo creación → evaluación → split → mejora con gate anti-bucle | FEAT-013 | Release 05 |
| Media | Como Product Owner, quiero que el sistema invoque al agente `story-product-owner` para mejorar la redacción antes de re-evaluar | FEAT-013 | Release 05 |
| Baja | Como Builder, quiero ejecutar benchmarks comparativos de versiones de skills con resultados en un viewer HTML | FEAT-025 | Release 08 |

### Actividad 7 — Generar Releases y Stories

| Prioridad | Historia | FEAT | Release |
|-----------|----------|------|---------|
| Alta | Como Arquitecto, quiero validar que un archivo de release cumple la estructura del template antes de usarlo para generar historias | FEAT-027 | Release 06 |
| Alta | Como Arquitecto, quiero generar un `release-[ID]-[Nombre].md` desde `project-plan.md` usando el template de release | FEAT-028 | Release 06 |
| Alta | Como Product Owner, quiero generar automáticamente `story-[ID]-[Nombre].md` por cada feature de un release dado | FEAT-029 | Release 06 |

### Actividad 8 — Publicar Skills

| Prioridad | Historia | FEAT | Release |
|-----------|----------|------|---------|
| Media | Como Builder, quiero crear nuevas skills con un ciclo guiado: captura de intención → SKILL.md → casos de prueba → review → mejora | FEAT-022 | Release 08 |
| Baja | Como Builder, quiero ejecutar casos de prueba en paralelo (con skill vs sin skill) y comparar resultados cuantitativos | FEAT-025 | Release 08 |
| Baja | Como Builder, quiero empaquetar una skill finalizada en un archivo `.skill` para distribuirla en otros entornos | FEAT-026 | Release 08 |

---

## Release Slices

| Release | Estado | Objetivo | Features incluidas |
|---------|--------|----------|--------------------|
| Release 00 — Estructura Base | Ready | Establecer estructura fundacional: directorios, templates dinámicos y entorno reproducible | FEAT-002 |
| Release 01 — Features Spec Builder | Ready | Ciclo completo de gestión de historias: creación, evaluación FINVEST y splitting | FEAT-006, FEAT-007, FEAT-012 |
| Release 02 — Project Spec Builder | Ready | Pipeline completo ProjectSpecFactory: captura de intención, discovery, planificación, WIP=1 y gates | FEAT-001, FEAT-003, FEAT-004, FEAT-008, FEAT-010 |
| Release 03 — Reverse Engineering | Ready | Análisis automático de repositorios existentes con 4 agentes paralelos + sintetizador, scope acotado e incremental | FEAT-017, FEAT-018, FEAT-019, FEAT-020, FEAT-021, FEAT-023, FEAT-024 |
| Release 04 — Refactor | Ready | Consolidación de calidad: renombrados, restricciones de input, ejemplos few-shot, sincronización multi-runtime | (mejoras de FEAT-006, FEAT-007, FEAT-012) |
| Release 05 — Enhance Project Spec | Ready | Pipeline orquestado en una sesión, story mapping, refinamiento iterativo, integración story map en planning | FEAT-005, FEAT-011, FEAT-013, FEAT-015 |
| Release 06 — Release & Story Generator | Doing | Automatizar generación de release specs y stories desde el plan | FEAT-027, FEAT-028, FEAT-029 |
| Release 07 — Robustez y Trazabilidad | Planificado | Retoma de proyectos interrumpidos, búsqueda de historias por término, backlog con trazabilidad ST-00X | FEAT-009, FEAT-014, FEAT-016 |
| Release 08 — Meta-Framework y Distribución | Planificado | Creación de nuevas skills con ciclo iterativo, benchmarking comparativo y empaquetado para npm | FEAT-022, FEAT-025, FEAT-026 |

---

## Notas y Decisiones

### Decisiones de diseño del mapa

- **Backbone ampliado a 8 actividades**: Se añade la Actividad 7 (Generar Releases y Stories) para reflejar las nuevas capacidades de Release 06 (FEAT-027–029), que cierran el ciclo desde el plan hasta el backlog de historias listo para desarrollo.

- **Actividad 8 (Publicar Skills) en el backbone**: El meta-framework de creación de skills es una capacidad diferenciadora clave del sistema. Sin ella, el framework no es extensible por la comunidad. Se mantiene en el backbone aunque su entrega sea en Release 08.

- **Releases 00–05 como base consolidada**: Los primeros 6 releases (00–05) están en estado Ready y representan el pipeline completo de especificación. Se agrupan en el mapa en dos bandas para mantener la legibilidad del ASCII.

- **Release 06 como slice actual**: Release 06 (Estado: Doing) es el slice de entrega activo. Completa el ciclo de artefactos: project-plan → release spec → stories.

- **Release 07 enfocado en robustez**: FEAT-009 (retoma), FEAT-014 (búsqueda) y FEAT-016 (trazabilidad) son capacidades de madurez del pipeline, no blockers del valor central — van en Release 07.

### Dependencias identificadas

- FEAT-028 (generate-release) depende de FEAT-027 (validación de formato) — la validación es prerequisito de la generación.
- FEAT-029 (generate-stories) depende de FEAT-028 (generate-release) y FEAT-006 (story-creation) — necesita el release generado y el template de historias.
- FEAT-011 (story map en planning) depende de FEAT-005 (story mapping) — deben estar en el mismo release o FEAT-011 después.
- FEAT-013 (story-refine) depende de FEAT-006, FEAT-007 y FEAT-012 — el ciclo completo requiere las tres capacidades base.
- FEAT-017–021 (reverse engineering) son un bloque cohesivo — un agente sintetizador sin los 4 agentes de análisis no tiene valor.
- FEAT-015 (project-flow) depende de FEAT-001, FEAT-003, FEAT-004, FEAT-009 y FEAT-010 — requiere el pipeline base completo.

### Riesgos

- **Compatibilidad multi-runtime** (Claude Code, GitHub Copilot, OpenCode) es un requisito transversal no negociable. Se recomienda validar en cada release contra los tres runtimes antes de marcar como Ready.
- **Deadline npm fines de mayo 2026**: con Release 06 en Doing y 2 releases más planificados (07 y 08), el scope de la publicación npm debe definirse explícitamente — probablemente Release 06 ó 07 como versión publicable.
- **FEAT-002 (extracción dinámica de templates)** es un enabler crítico transversal. Si falla, todos los agentes de entrevista fallan. Debe estar estabilizado desde Release 00.
- **Proyecto unipersonal**: con un solo desarrollador y deadline a fines de mayo, Release 08 (Meta-Framework) podría quedar fuera del scope de la versión npm inicial.
