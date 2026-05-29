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
updated: 2026-05-28
related:
  - EPIC-14-fabrica-de-skills
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]

# 📖 Historia: design-skill-architecture

**Como** desarrollador o practitioner de SDDF que quiere construir un nuevo skill y usa story-design para diseñar una story.md con criterios de aceptación claros y bien definidos (con gherkin), 
**Quiero** invocar el skill story-design y que este lea la configuración e invoque al skill design-skill-architecture (nobre obtenido de un archivo de configuración) con una story.md de entrada  
**Para** obtener un design.md y un tasks.md con la arquitectura completa del skill (estructura de carpetas, scripts, referencias y evals) antes de escribir una sola línea de código

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de artefactos de diseño
```gherkin
Dado que existe una story.md con criterios de aceptación Gherkin válidos para el skill a construir
  Y el entorno SDDF supera el preflight (SPECS_BASE resuelto, templates disponibles)
Cuando el usuario invoca el skill design-skill-architecture con la ruta de la story.md
Entonces se genera design.md en el directorio de la historia con la estructura de carpetas propuesta para el nuevo skill
  Y se genera tasks.md con una secuencia ordenada de tareas atómicas (setup → SKILL.md → scripts → references → evals)
  Y design.md incluye al menos: propuesta de frontmatter del SKILL.md, scripts sugeridos, referencias a documentar y casos de prueba (evals) a escribir
  Y tasks.md referencia explícitamente el ciclo TDD (RED/GREEN/REFACTOR) en las tareas de implementación
```

### Escenario alternativo – Story sin criterios de aceptación Gherkin
```gherkin
Dado una story.md que no contiene ningún bloque Gherkin (Dado/Cuando/Entonces)
Cuando el usuario invoca el skill design-skill-architecture
Entonces el skill muestra un mensaje de advertencia indicando que la story carece de criterios de aceptación Gherkin
  Y sugiere completar la sección de criterios de aceptación antes de continuar
  Pero no genera archivos de output parciales
```

### Escenario alternativo – Story no encontrada
```gherkin
Dado una ruta de story.md que no existe en el sistema de archivos
Cuando el usuario invoca el skill design-skill-architecture con esa ruta
Entonces el skill muestra el mensaje "No se encontró el archivo story.md en: <ruta>"
  Y detiene la ejecución sin generar ningún archivo
```

### Escenario con datos – Tipos de skills soportados
```gherkin
Escenario: design-skill-architecture genera estructura para distintos tipos de skill
  Dado que existe una story.md para el skill "<tipo-skill>"
  Cuando se invoca design-skill-architecture
  Entonces design.md propone la estructura correcta con scripts "<scripts>"
Ejemplos:
  | tipo-skill           | scripts                             |
  | skill-orquestador    | orchestrate.sh                      |
  | skill-con-subagentes | delegate.sh, aggregate-results.sh   |
  | skill-validador      | validate.sh, report.sh              |
```
## Requerimiento: estrategia híbrida de carga de skills complementarios

Buscar una estrategia híbrida en que un skill principal carga skills complementarios para dar: contexto enriquecido para todos los casos y delegación bajo demanda para tareas altamente especializadas. Así evitas hardcodear comportamientos y se mantiene la fábrica extensible. Un modelo híbrido cuyo mecanismo es que el skill principal carga todas las referencias (<nombre-skill>/references) de los skills complementarios (mediante archivo de configuración) y además puede invocar a aquellos que tengan la capacidad de delegación. Así la mayoría de los casos:se enriquece el contexto con guías ("Guías de referencia: <nombre-skill>") y, si existe un skill especializado, lo invocas para tareas pesadas.

## Requerimiento: template como fuente de la verdad

El template base de skill es el siguiente: .claude\skills\skill-creator\assets\skill-template.md

## Requerimiento: reglas de construcción de la fábrica de skills
La fábrica de skills debe cumplir las siguientes reglas de construcción:
- Idea de flujo: story como input → story-design (orquestador) → lee sddf-config.yaml → invoca design-skill-architecture → genera design.md + tasks.md
- **Archivo de configuración con los skills disponibles:** debe existir un archivo de configuración (docs\policies\sddf-config.yaml) que declare los skills disponibles para cada fase del pipeline (plan, implementing, verify). Este archivo es leído por los orquestadores (story-design, story-implement, story-verify) para saber qué skills invocar en cada fase. Configuración externa – sddf-config.yaml es una buena práctica para declarar skills disponibles, evitando hardcodear dependencias en los orquestadores y permitiendo agregar o cambiar skills sin modificar código, solo actualizando la configuración.
- **Responsabilidad única (SRP):** cada skill resuelve una única etapa del pipeline (diseñar / construir / verificar). No se mezclan responsabilidades entre skills.
- **Autocontenida (meta-fábrica):** los skills de la fábrica pueden usarse para construir los propios skills de la fábrica. La fábrica es el primer caso de uso de sí misma.
- **Arquitectura de orquestación:** separar orquestadores ya existentes (story-design) de skills accesorios (design-*). Permite cambiar o añadir nuevos skills sin modificar los orquestadores, solo actualizando el archivo de configuración.
- **Agnosticismo tecnológico:** la fábrica está diseñada para funcionar con cualquier stack (React, Python, etc.) a través de skills accesorios específicos. Eso es muy potente.
- Los orquestadores detectan el stack (React, Python, etc.) mediante el archivo de constitución y el de configuración sddf-config.yaml.
- Los bucles de retroalimentación entre diferentes fases son implementados por los skills principales de fase no por los skills complementarios.
- Incorporar un campo version en SKILL.md (siguiendo semver) y un mecanismo de changelog (CHANGELOG.md en el skill). La meta-fábrica podría leer la versión y decidir si debe reconstruir el skill o no.
- La story.md procesada por los skills principales son fuente de verdad y un contrato con escenarios Gherkin.
- El template de skill base está en .claude\skills\skill-creator\assets\skill-template.md
- Skill nuevo: design-skill-architecture
- Skill a editar: .claude\skills\story-design

## Requerimientos no funcionales

- INSPIRACIÓN NO NEGOCIABLE: Analizar skills de referencias siguientes y tomar lo mejor de ambos skills para diseñar e implementar estos skills complementarios de la fábrica de skills: [Superpowers](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) y [Skill-creator](https://github.com/bobmatnyc/claude-mpm-skills/blob/main/universal/main/skill-creator/SKILL.md) para ser usado en mis skills customizados para mi workflow. 

## ⚙️ Criterios no funcionales

* Rendimiento: el skill completa la generación en menos de 30 segundos para una story.md estándar
* Calidad de output: design.md debe cubrir cada criterio de aceptación de la story con al menos un elemento de diseño (trazabilidad AC → diseño)
* Idempotencia: si design.md y tasks.md ya existen, el skill pregunta antes de sobreescribir; no sobreescribe silenciosamente

## 📎 Notas / contexto adicional

- **Solo especifica**: no genera el SKILL.md final ni scripts ejecutables — eso lo hace `impl-skill-builder`.
- Inspiración: toma los principios de `skill-creator` (estructura de evals), `Superpowers` (pressure scenarios en TDD) y .claude\skills\skill-creator.
- Reutiliza código desde .claude\skills\skill-creator para análisis de story.md y generación de tareas, pero con una lógica de diseño más robusta y orientada a la arquitectura del skill completo.
- Reutiliza código desde .claude\skills\skill-creator para manejo de template.
- Generado desde: EPIC-14-fabrica-de-skills | Feature: FEAT-078 — design-skill-architecture
- **design-skill-architecture:** Es usado por el skill .claude\skills\story-design para generar `design.md` + `tasks.md` con estructura de carpetas, scripts sugeridos, referencias y evals a escribir. Solo apoya la especificación, no genera código ni el skill final. Es un skill complementario de soporte y conocimiento que asesora sobre cómo diseñar el skill, no lo implementa ni lo evalúa. El skill story-design funciona como orquestador del proceso, invocando design-skill-architecture para la fase de diseño. El skill design-skill-architecture estará declarada en un archivo de configuración docs\policies\sddf-config.yaml, el cual leerá el skill story-design para saber que existe y que debe invocarlo. El skill skill story-design debe ser agnóstico a los skills particulares que invocará para completar la tarea de especificación de diseño y tasking, de modo que en el futuro se puedan agregar otros skills de diseño o tasking sin modificar story-design, simplemente declarándolos en sddf-config.yaml y haciendo que story-design los invoque según corresponda (según diferentes stack de tecnología usados en diferentes proyectos).


