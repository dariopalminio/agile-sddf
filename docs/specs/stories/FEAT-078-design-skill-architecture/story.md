---
alwaysApply: false
type: story
id: FEAT-078
slug: design-skill-architecture
title: "design-skill-architecture"
status: SPECIFYING
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
created: 2026-05-28
updated: 2026-05-29
related:
  - EPIC-14-fabrica-de-skills
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]

# 📖 Historia: design-skill-architecture

**Como** desarrollador o practitioner de SDDF que quiere construir un nuevo skill y usa story-design para diseñar una story.md con criterios de aceptación claros y bien definidos (con Gherkin), 
**Quiero** invocar el skill story-design y que este lea la configuración y cargue las referencias de design-skill-architecture en su contexto  
**Para** obtener un design.md y un tasks.md con la arquitectura completa del skill (estructura de carpetas, scripts, referencias y evals) antes de escribir una sola línea de código

## ✅ Criterios de aceptación

### Escenario principal – Generación enriquecida con guías de skill
```gherkin
Dado que existe una story.md con criterios de aceptación Gherkin válidos para el skill a construir
  Y el entorno SDDF supera el preflight (SPECS_BASE resuelto, templates disponibles)
  Y design-skill-architecture está declarado en sddf-config.yaml bajo plan.skills con type: reference
Cuando el usuario invoca el skill story-design con el ID de la historia
Entonces story-design carga los archivos de references/ de design-skill-architecture en su contexto
  Y el design.md generado incluye secciones específicas de skill: estructura de carpetas propuesta para el nuevo skill, frontmatter YAML sugerido para SKILL.md, scripts sugeridos y evals a escribir
  Y el tasks.md generado incluye fases TDD (RED/GREEN/REFACTOR) explícitamente anotadas en las tareas (setup → evals/RED → SKILL.md/GREEN → assets → REFACTOR → integración)
```

### Escenario alternativo – Config ausente o skill no declarado (degradación gradual)
```gherkin
Dado que design-skill-architecture no está declarado en sddf-config.yaml
  O sddf-config.yaml no existe en el proyecto
Cuando el usuario invoca story-design sobre una historia de skill SDDF
Entonces story-design emite ⚠️ indicando que sddf-config.yaml no fue encontrado o no contiene skills para la fase plan
  Y genera un design.md estándar sin secciones específicas de skill SDDF
  Pero no interrumpe el flujo — la generación continúa sin los enriquecimientos especializados
```

### Escenario alternativo – Referencias parcialmente faltantes (degradación gradual)
```gherkin
Dado que design-skill-architecture está declarado en sddf-config.yaml con references_path
  Pero uno o más archivos de references/ no existen (borrados o incompletos)
Cuando el usuario invoca story-design sobre una historia de skill SDDF
Entonces story-design emite ⚠️ por cada referencia faltante y continúa con las referencias disponibles
  Y el design.md generado incorpora las guías de skill que sí pudieron cargarse
  Pero no interrumpe el flujo ni genera error fatal por referencias opcionales faltantes
```

### Escenario con datos – Tipos de skills soportados
```gherkin
Escenario: story-design genera estructura de carpetas para distintos tipos de skill
  Dado que design-skill-architecture está cargado como referencia por story-design
    Y existe una story.md para el skill "<tipo-skill>"
  Cuando story-design genera design.md usando las referencias de design-skill-architecture
  Entonces design.md propone la estructura correcta con scripts "<scripts>"
Ejemplos:
  | tipo-skill           | scripts                             |
  | skill-orquestador    | orchestrate.sh                      |
  | skill-con-subagentes | delegate.sh, aggregate-results.sh   |
  | skill-validador      | validate.sh, report.sh              |
```

## Requerimiento: estrategia híbrida de carga de skills complementarios

Buscar una estrategia híbrida en que un skill principal carga skills complementarios para dar: contexto enriquecido para todos los casos y delegación bajo demanda para tareas altamente especializadas. Así evitas hardcodear comportamientos y se mantiene la fábrica extensible. Un modelo híbrido cuyo mecanismo es que el skill principal carga todas las referencias (`<nombre-skill>/references`) de los skills complementarios (mediante archivo de configuración) y además puede invocar a aquellos que tengan la capacidad de delegación. Así la mayoría de los casos: se enriquece el contexto con guías ("Guías de referencia: `<nombre-skill>`") y, si existe un skill especializado, se lo invoca para tareas pesadas.

## Requerimiento: template como fuente de la verdad

El template base de skill es el siguiente: `.claude\skills\skill-master\assets\skill-template.md`

## Requerimiento: reglas de construcción de la fábrica de skills

La fábrica de skills debe cumplir las siguientes reglas de construcción:
- **Idea de flujo:** story como input → story-design (orquestador) → lee sddf-config.yaml → carga referencias de design-skill-architecture → genera design.md + tasks.md enriquecido con guías de skill
- **Archivo de configuración con los skills disponibles:** debe existir un archivo de configuración (`docs/policies/sddf-config.yaml`) que declare los skills disponibles para cada fase del pipeline (plan, implementing, verify). Este archivo es leído por los orquestadores (story-design, story-implement, story-verify) para saber qué skills cargar en cada fase. Configuración externa — sddf-config.yaml es una buena práctica para declarar skills disponibles, evitando hardcodear dependencias en los orquestadores y permitiendo agregar o cambiar skills sin modificar código, solo actualizando la configuración.
- **Responsabilidad única (SRP):** cada skill resuelve una única etapa del pipeline (diseñar / construir / verificar). No se mezclan responsabilidades entre skills.
- **Autocontenida (meta-fábrica):** los skills de la fábrica pueden usarse para construir los propios skills de la fábrica. La fábrica es el primer caso de uso de sí misma.
- **Arquitectura de orquestación:** separar orquestadores ya existentes (story-design) de skills accesorios (design-*). Permite cambiar o añadir nuevos skills sin modificar los orquestadores, solo actualizando el archivo de configuración.
- **Agnosticismo tecnológico:** la fábrica está diseñada para funcionar con cualquier stack (React, Python, etc.) a través de skills accesorios específicos. Eso es muy potente.
- Los orquestadores detectan el stack (React, Python, etc.) mediante el archivo de constitución y el de configuración sddf-config.yaml.
- Los bucles de retroalimentación entre diferentes fases son implementados por los skills principales de fase, no por los skills complementarios.
- Incorporar un campo `version` en SKILL.md (siguiendo semver) y un mecanismo de changelog (CHANGELOG.md en el skill). La meta-fábrica podría leer la versión y decidir si debe reconstruir el skill o no.
- La story.md procesada por los skills principales son fuente de verdad y un contrato con escenarios Gherkin.
- El template de skill base está en `.claude\skills\skill-master\assets\skill-template.md`
- **Skill nuevo:** design-skill-architecture (`type: reference` — aporta guías al orquestador)
- **Skill a editar:** `.claude\skills\story-design` (Paso 3b: carga de referencias desde sddf-config.yaml)

## Requerimientos no funcionales

- **INSPIRACIÓN NO NEGOCIABLE:** Analizar skills de referencias siguientes y tomar lo mejor de ambos skills para diseñar e implementar estos skills complementarios de la fábrica de skills: [Superpowers](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) y [skill-master](https://github.com/bobmatnyc/claude-mpm-skills/blob/main/universal/main/skill-master/SKILL.md) para ser usado en mis skills customizados para mi workflow.

## ⚙️ Criterios no funcionales

* **Rendimiento:** story-design completa la generación (incluyendo la carga de referencias) en menos de 30 segundos para una story.md estándar
* **Calidad de output:** el design.md generado con referencias cargadas incluye secciones específicas de skill SDDF que no aparecerían sin las referencias; cubre cada criterio de aceptación de la story con al menos un elemento de diseño (trazabilidad AC → diseño)
* **Idempotencia:** el comportamiento de sobreescritura de design.md y tasks.md está controlado por story-design (que pregunta antes de sobreescribir); no se sobreescribe silenciosamente

## 📎 Notas / contexto adicional

- **Solo especifica**: no genera el SKILL.md final ni scripts ejecutables — eso lo hace `impl-skill-builder`.
- Inspiración: toma los principios de `skill-master` (estructura de evals), `Superpowers` (pressure scenarios en TDD) y `.claude\skills\skill-master`.
- Generado desde: EPIC-14-fabrica-de-skills | Feature: FEAT-078 — design-skill-architecture
- **design-skill-architecture:** Skill de tipo `reference` cuyas guías story-design carga en su contexto para enriquecer la generación de `design.md` + `tasks.md` cuando la historia describe la construcción de un skill SDDF. Solo apoya la especificación mediante guías; no genera código ni el skill final, no lo implementa ni lo evalúa. El skill story-design funciona como orquestador del proceso, cargando las referencias de design-skill-architecture para la fase de diseño. El skill design-skill-architecture está declarado en `docs/policies/sddf-config.yaml`, el cual lee story-design para saber que existen sus referencias y debe cargarlas en contexto. story-design debe ser agnóstico a los skills complementarios que usará, de modo que en el futuro se puedan agregar otros skills de diseño sin modificar story-design, simplemente declarándolos en sddf-config.yaml.
