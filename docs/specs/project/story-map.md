# Story Map — Agile SDDF (Spec-Driven Development Framework)

**Fecha:** 2026-04-20
**Versión:** 1.0
**Estado:** Ready
**Generado por:** project-story-mapper

---

## Contexto del Proyecto

Agile SDDF es un framework CLI multiagente que automatiza el ciclo completo de especificación de proyectos software — desde la intención inicial hasta el backlog planificado — usando exclusivamente archivos Markdown como lenguaje de definición. Resuelve la falta de proceso estructurado y reproducible que sufren builders, freelancers y equipos ágiles al transformar ideas en especificaciones de calidad con IA.

---

## Personas

| Persona | Rol | Objetivo Principal |
|---------|-----|-------------------|
| Builder / Developer Individual | Desarrollador o freelancer que usa Claude Code u otro runtime de IA | Estructurar su proceso de especificación de forma ágil sin overhead metodológico, invocando skills desde el CLI |
| Product Owner / Analista | Responsable de la calidad de las historias de usuario | Garantizar que las historias cumplan la rúbrica FINVEST antes de entrar al sprint usando skills de evaluación y refinamiento |
| Arquitecto de Software | Rol que conduce entrevistas de requisitos y planifica releases | Extraer features FEAT-NNN desde el repositorio y planificar releases con criterio de valor, dependencias, riesgo y esfuerzo |

---

## Mapa de Historias (ASCII)

```
TIEMPO / JOURNEY DEL USUARIO →
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
BACKBONE (Actividades)   │ 1. Iniciar       │ 2. Descubrir      │ 3. Planificar     │ 4. Mapear         │ 5. Gestionar      │ 6. Evaluar        │ 7. Publicar
                         │ Proyecto         │ Requisitos        │ Releases          │ Historias         │ Historias         │ Calidad           │ Skills
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
WALKING SKELETON (MVP)   │ Capturar         │ Conducir          │ Extraer features  │ Conducir sesión   │ Crear historia    │ Evaluar historia  │ —
                         │ intención con    │ entrevista de     │ FEAT-NNN y        │ de story mapping  │ en formato        │ con rúbrica       │
                         │ entrevista guiada│ usuarios y        │ agrupar en        │ y generar         │ Como/Quiero/Para  │ FINVEST y         │
                         │ → project-       │ requisitos →      │ releases →        │ story-map.md      │ + criterios       │ decidir           │
                         │ intent.md        │ requirement-      │ project-plan.md   │ con mapa ASCII    │ Gherkin           │ APROBADA /        │
                         │                  │ spec.md           │                   │                   │                   │ REFINAR /         │
                         │                  │                   │                   │                   │                   │ RECHAZAR /        │
                         │                  │                   │                   │                   │                   │ DIVIDIR           │
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Release 1                │ Control WIP=1:   │ Retoma de         │ Integración de    │ Integración del   │ Búsqueda de       │ Ciclo iterativo   │ —
                         │ detectar doc     │ proyecto          │ story-map.md como │ story map como    │ historias por     │ de refinamiento   │
                         │ en Estado: Doing │ interrumpido      │ guía estructural  │ guía en Planning  │ término o nombre  │ (creación →       │
                         │ y ofrecer        │ sin re-preguntar  │ en project-       │                   │ de archivo        │ evaluación →      │
                         │ Sobrescribir /   │ secciones         │ planning          │                   │                   │ split → mejora)   │
                         │ Retomar          │ completadas       │                   │                   │                   │                   │
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Release 2                │ Pipeline         │ Ingeniería inversa│ Gates de revisión │ —                 │ División de       │ Backlog de        │ Creación de
                         │ completo en una  │ de repositorios   │ humana entre      │                   │ historias con     │ historias con     │ nuevas skills
                         │ sola sesión      │ existentes:       │ fases del         │                   │ 8 patrones de     │ trazabilidad      │ con ciclo
                         │ (project-flow)   │ 4 agentes en      │ pipeline con      │                   │ splitting         │ de origen         │ iterativo
                         │ con gates entre  │ paralelo →        │ confirmación      │                   │                   │ (IDs ST-00X)      │
                         │ etapas           │ requirement-      │ explícita         │                   │                   │                   │
                         │                  │ spec.md           │                   │                   │                   │                   │
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Futuro                   │ —                │ Modo incremental  │ —                 │ —                 │ —                 │ Benchmarking      │ Empaquetado
                         │                  │ --update para     │                   │                   │                   │ comparativo de    │ y distribución
                         │                  │ re-analizar solo  │                   │                   │                   │ versiones de      │ de skills
                         │                  │ secciones PENDING │                   │                   │                   │ skills (HTML      │ como archivo
                         │                  │ + análisis con    │                   │                   │                   │ viewer)           │ .skill
                         │                  │ --focus <path>    │                   │                   │                   │                   │
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
| 7 | Publicar Skills | El desarrollador crea, versiona, benchmarks y empaqueta nuevas skills para extender el framework |

---

## Walking Skeleton

| Actividad | Implementación Mínima |
|-----------|----------------------|
| Iniciar Proyecto | Entrevista interactiva mínima que captura nombre, problema y visión → escribe `project-intent.md` con `Estado: Ready` |
| Descubrir Requisitos | Entrevista de usuarios y requisitos sección por sección del template → escribe `requirement-spec.md` con `Estado: Ready` |
| Planificar Releases | Extrae features FEAT-NNN desde `requirement-spec.md` y las agrupa en al menos 2 releases → escribe `project-plan.md` |
| Mapear Historias | Sesión interactiva que identifica personas, backbone de actividades y walking skeleton → escribe `story-map.md` con mapa ASCII |
| Gestionar Historias | Genera una historia completa en formato Como/Quiero/Para con mínimo 1 criterio de aceptación Gherkin → `story-{slug}.md` |
| Evaluar Calidad | Aplica rúbrica FINVEST a una historia y produce decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) con score numérico |
| Publicar Skills | Captura intención de skill + redacta SKILL.md inicial que puede ejecutarse en Claude Code |

---

## User Tasks por Actividad

### Actividad 1 — Iniciar Proyecto

| Prioridad | Historia | Release |
|-----------|----------|---------|
| Alta | Como Builder, quiero que el sistema me haga preguntas guiadas para capturar nombre, problema, visión y criterios de éxito del proyecto | Walking Skeleton |
| Alta | Como Builder, quiero que el sistema detecte si hay un proyecto activo (Estado: Doing) y me ofrezca Sobrescribir o Retomar antes de crear uno nuevo | Release 1 |
| Alta | Como Builder, quiero que el sistema ejecute las tres fases del pipeline en una sola sesión continua con gates de revisión entre cada etapa | Release 2 |
| Media | Como Builder, quiero que las preguntas del agente se deriven dinámicamente de los comentarios del template, sin lógica hardcodeada | Walking Skeleton |

### Actividad 2 — Descubrir Requisitos

| Prioridad | Historia | Release |
|-----------|----------|---------|
| Alta | Como Arquitecto, quiero conducir una entrevista de descubrimiento de perfiles de usuario con sus dolores y necesidades | Walking Skeleton |
| Alta | Como Arquitecto, quiero especificar requisitos funcionales y no funcionales sección por sección siguiendo el template de requisitos | Walking Skeleton |
| Alta | Como Builder, quiero retomar un proyecto interrumpido sin que el sistema me vuelva a preguntar lo que ya respondí | Release 1 |
| Alta | Como Arquitecto, quiero analizar un repositorio existente con 4 agentes en paralelo para generar `requirement-spec.md` automáticamente | Release 2 |
| Media | Como Arquitecto, quiero re-analizar solo las secciones marcadas como PENDING usando el flag `--update` | Futuro |
| Media | Como Arquitecto, quiero limitar el análisis de ingeniería inversa a una ruta específica usando `--focus <path>` | Futuro |

### Actividad 3 — Planificar Releases

| Prioridad | Historia | Release |
|-----------|----------|---------|
| Alta | Como Arquitecto, quiero que el sistema extraiga features FEAT-NNN desde `requirement-spec.md` y las priorice automáticamente | Walking Skeleton |
| Alta | Como Arquitecto, quiero que el sistema agrupe features en releases incrementales con MVP en Release 1 (3-5 features, desplegable) | Walking Skeleton |
| Alta | Como Builder, quiero confirmar o ajustar el plan de releases antes de que el documento avance a Estado: Ready | Release 1 |
| Media | Como Arquitecto, quiero que el sistema use `story-map.md` como guía estructural si existe, respetando el backbone como organizador | Release 1 |

### Actividad 4 — Mapear Historias

| Prioridad | Historia | Release |
|-----------|----------|---------|
| Alta | Como Product Owner, quiero una sesión interactiva para identificar personas, backbone de actividades y walking skeleton | Walking Skeleton |
| Alta | Como Product Owner, quiero trazar release slices horizontales sobre el mapa para cada release planificado | Walking Skeleton |
| Media | Como Arquitecto, quiero que `story-map.md` se use como guía en la fase de Planning para agrupar features en releases | Release 1 |

### Actividad 5 — Gestionar Historias

| Prioridad | Historia | Release |
|-----------|----------|---------|
| Alta | Como Product Owner, quiero generar historias completas en formato Como/Quiero/Para con criterios de aceptación Gherkin | Walking Skeleton |
| Alta | Como Product Owner, quiero dividir historias grandes aplicando uno de los 8 patrones de splitting | Release 1 |
| Media | Como Product Owner, quiero buscar historias existentes por término o nombre de archivo sin recordar la ruta exacta | Release 1 |
| Media | Como Product Owner, quiero mantener un backlog de sesión con ID, archivo, origen y estado por historia (trazabilidad ST-00X) | Release 2 |

### Actividad 6 — Evaluar Calidad

| Prioridad | Historia | Release |
|-----------|----------|---------|
| Alta | Como Product Owner, quiero evaluar una historia con la rúbrica FINVEST y obtener una decisión con score numérico por dimensión | Walking Skeleton |
| Alta | Como Product Owner, quiero que el sistema orqueste un ciclo completo creación → evaluación → split → mejora con gate anti-bucle | Release 1 |
| Media | Como Product Owner, quiero que el sistema invoque al agente `story-product-owner` para mejorar la redacción antes de re-evaluar | Release 1 |
| Baja | Como Builder, quiero ejecutar benchmarks comparativos de versiones de skills con resultados en un viewer HTML | Futuro |

### Actividad 7 — Publicar Skills

| Prioridad | Historia | Release |
|-----------|----------|---------|
| Media | Como Builder, quiero crear nuevas skills con un ciclo: captura de intención → SKILL.md → casos de prueba → review → mejora | Release 2 |
| Baja | Como Builder, quiero ejecutar casos de prueba en paralelo (con skill vs sin skill) y comparar resultados cuantitativos | Futuro |
| Baja | Como Builder, quiero empaquetar una skill finalizada en un archivo `.skill` para distribuirla en otros entornos | Futuro |

---

## Release Slices

| Release | Objetivo | Historias incluidas |
|---------|----------|---------------------|
| Walking Skeleton | Demostrar el flujo completo de extremo a extremo: capturar intención → especificar requisitos → planificar releases → mapear historias → crear y evaluar una historia | FR-001 (project-begin), FR-002 (project-discovery), FR-003 (project-planning), FR-009 (story-mapping), FR-011 (story-creation), FR-012 (story-evaluation), FR-008 (extracción dinámica de templates) |
| Release 1 | Hacer el pipeline robusto y retomable: WIP=1, retoma de sesiones interrumpidas, ciclo completo de refinamiento de historias, integración story map → planning | FR-005 (retoma), FR-006 (WIP=1), FR-007 (gates de revisión), FR-010 (story map como guía), FR-013 (story split), FR-014 (story-refine con gate anti-bucle), FR-015 (búsqueda de historias) |
| Release 2 | Ampliar con pipeline completo en una sesión, ingeniería inversa de repositorios existentes y meta-framework de creación de skills | FR-004 (project-flow), FR-016 (backlog con trazabilidad), FR-017 (reverse-engineering), FR-018 (análisis arquitectura), FR-019 (extracción features), FR-020 (reglas de negocio), FR-021 (mapa de navegación), FR-024 (skill-creator) |
| Futuro | Diferenciación avanzada: análisis incremental, scope acotado, benchmarking de skills, empaquetado y distribución | FR-022 (--focus), FR-023 (--update), FR-025 (benchmarking), FR-026 (empaquetado .skill) |

---

## Notas y Decisiones

### Decisiones de diseño del mapa

- **Walking Skeleton genuinamente mínimo**: El esqueleto incluye los 7 flujos principales end-to-end pero en su forma más básica — sin WIP=1, sin retoma, sin ingeniería inversa, sin pipeline orquestado. Es suficiente para demostrar que el sistema funciona de principio a fin.

- **Actividad 7 (Publicar Skills) en el backbone**: Aunque es la actividad menos frecuente del usuario, el meta-framework de creación de skills es una capacidad diferenciadora clave del sistema y justifica su presencia en el backbone. Sin ella, el sistema no es extensible.

- **Release 1 enfocado en robustez**: El usuario confirmó que Release 1 debe hacer el pipeline resiliente (WIP, retoma, gates) y cerrar el ciclo de calidad de historias. Es la validación de la propuesta de valor central.

- **Ingeniería inversa en Release 2**: Los skills FR-017 a FR-021 son de alto valor pero no son prerequisito para el flujo principal — van en Release 2 sin bloquear la entrega de valor de Release 1.

### Dependencias identificadas

- `FR-010` (story map como guía en Planning) depende de `FR-009` (story mapping) — deben ir en el mismo release o FR-010 después.
- `FR-014` (story-refine) depende de `FR-011`, `FR-012` y `FR-013` — el ciclo completo requiere las tres capacidades base.
- `FR-017` a `FR-021` (reverse engineering) son un bloque cohesivo que debe entregarse junto — un agente sintetizador sin los 4 agentes de análisis no tiene valor.

### Riesgos

- La compatibilidad multi-runtime (NFR-001) no está mapeada como actividad del backbone porque es un requisito transversal de todos los skills, no una actividad del usuario. Se recomienda validar compatibilidad en cada release.
- El skill `project-flow` (FR-004) que orquesta el pipeline completo en una sesión tiene mayor complejidad de implementación que los skills individuales — se ubica en Release 2 para mitigar riesgo.
- La extracción dinámica de templates en runtime (FR-008) es un enabler del Walking Skeleton. Si falla, todos los agentes de entrevista fallan. Prioridad crítica.
