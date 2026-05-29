---
alwaysApply: false
type: release
id: EPIC-14
slug: fabrica-de-skills
title: "Fábrica de Skills"
status: DEFINITION
substatus: IN-PROGRESS
parent: PROJ-01-agile-sddf
created: 2026-05-28
updated: 2026-05-28
related:                              
  - PROJ-01-agile-sddf
---

[[FEAT-078, FEAT-079, FEAT-080, FEAT-081]]


# Release/Epic: Caso de uso de Fábrica de Skills

## Descripción
Fábrica de Skills es un pipeline para construir skills SDDF de forma reproducible, siguiendo el flujo especificar → diseñar (story-design) → implementar (story-implement) → verificar (story-verify). Integra BDD con escenarios Gherkin y el ciclo rojo‑verde‑refactor de Superpowers para garantizar calidad objetiva en cada skill producido. Son skills accesorios o complementarios a los skills principales story-implement, story-design y story-verify, que funcionan como orquestadores del proceso y son agnósticos a los skills particulares de diseño, implementación o verificación que se usen en cada fase. La fábrica de skills es solo un caso de uso del workflow para stack de skills. Esto se debe a que los skills principales del workflow (story-design, story-implement, story-verify) son orquestadores que detectan stack y skills complementarios a usar e invocan estos skills accesorios y complementarios de diseño, implementación o verificación según corresponda. Si un usuario los usa para desarrollar un sitio web react los skills principales invocarán skills accesorios de diseño, implementación y verificación específicos para react, si los usa para desarrollar un skill de análisis de sentimiento con python invocarán skills accesorios específicos para python, etc. La fábrica de skills es un caso de uso que sigue este mismo patrón: cada fase del pipeline de la fábrica de skills (diseñar, implementar, verificar) es orquestada por un skill principal (story-design, story-implement, story-verify) que invoca un skill accesorio/complementario específico para esa fase (design-skill-architecture, impl-skill-builder, test-skill-verify). De este modo, la fábrica de skills es un ejemplo concreto de cómo usar el workflow para stack de skills con orquestadores y skills accesorios. Estos skills complementarios son inspirados en los skills externos Superpowers (TDD aplicado a skills) y skill-creator (benchmarking, métricas).
La flexibilidad para elegir entre la versión «light» y la versión completa es clave para la adopción. La inspiración explícita en Superpowers y skill-creator, y la integración con su workflow de SPECIFYING → PLAN → READY‑FOR‑IMPLEMENT → IMPLEMENTING → CODE‑REVIEW → VERIFY → ACCEPTANCE, garantiza que la fábrica sea una extensión natural y no un artefacto aislado.

## Features
- [ ] FEAT-078 - **design-skill-architecture:** Es usado por el skill .claude\skills\story-design para generar `design.md` + `tasks.md` con estructura de carpetas, scripts sugeridos, referencias y evals a escribir. Solo apoya la especificación, no genera código ni el skill final. Es un skill complementario de soporte y conocimiento que asesora sobre cómo diseñar el skill, no lo implementa ni lo evalúa. El skill story-design funciona como orquestador del proceso, invocando design-skill-architecture para la fase de diseño. El skill design-skill-architecture estará declarada en un archivo de configuración docs\policies\sddf-config.yaml, el cual leerá el skill story-design para saber que existe y que debe invocarlo. El skill skill story-design debe ser agnóstico a los skills particulares que invocará para completar la tarea de especificación de diseño y tasking, de modo que en el futuro se puedan agregar otros skills de diseño o tasking sin modificar story-design, simplemente declarándolos en sddf-config.yaml y haciendo que story-design los invoque según corresponda (según diferentes stack de tecnología usados en diferentes proyectos).
- [ ] FEAT-079 - **impl-skill-builder:** Es usado por el skill .claude\skills\story-implement para implementar el skill con TDD obligatorio (ciclo RED → GREEN → REFACTOR usando pressure scenarios); produce `SKILL.md`, scripts y evals. Integra opcionalmente skill-creator para evaluaciones intermedias. Es un skill complementario de soporte/conocimiento y skill activo que asesora sobre cómo implementar el skill, no lo diseña ni lo evalúa. El skill story-implement funciona como orquestador del proceso, invocando impl-skill-builder para la fase de implementación. El skill impl-skill-builder estará declarado en un archivo de configuración docs\policies\sddf-config.yaml, el cual leerá el skill story-implement para saber que existe y que debe invocarlo. El skill story-implement debe ser agnóstico a los skills particulares que invocará para completar la tarea de implementación, de modo que en el futuro se puedan agregar otros skills de implementación (de react, angular, vue, etc.) sin modificar story-implement, simplemente declarándolos en sddf-config.yaml y haciendo que story-implement los invoque según corresponda (según diferentes stack de tecnología usados en diferentes proyectos).
- [ ] FEAT-080 - **test-skill-verify:** Es usado por el skill .claude\skills\story-verify para ejecutar benchmarks sobre el skill implementado; genera informe de tasa de acierto con comparativa `with_skill` vs `without_skill`; falla si la tasa de acierto es inferior al 95% o el costo es excesivo. Es un skill complementario de soporte y conocimiento que asesora sobre cómo verificar el skill, no lo diseña ni lo implementa. El skill story-verify funciona como orquestador del proceso, invocando test-skill-verify para la fase de verificación. El skill test-skill-verify estará declarado en un archivo de configuración docs\policies\sddf-config.yaml, el cual leerá el skill story-verify para saber que existe y que debe invocarlo. El skill story-verify debe ser agnóstico a los skills particulares que invocará para completar la tarea de verificación, de modo que en el futuro se puedan agregar otros skills de verificación sin modificar story-verify, simplemente declarándolos en sddf-config.yaml y haciendo que story-verify los invoque según corresponda (según diferentes stack de tecnología usados en diferentes proyectos).
- [ ] FEAT-081 - Un solo skill extra de la fábrica de skills es suficiente para construir un skill SDDF completo para equipos pequeños o para skills simples. La fábrica completa (con orquestadores, skills accesorios, configuración YAML, detección de stack, etc.) es compleja y puede ser excesiva para proyectos pequeños o para construir skills simples. Ofrecer una versión "light" con un solo skill skill-factory que integre diseño, implementación y verificación básicos, para quienes no necesiten la separación ni el TDD obligatorio. La fábrica completa sería para skills críticos o equipos grandes.

## Flujos Críticos / Smoke Tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### Escenario 1: design-skill-architecture apoya al skill story-design para el diseño
**DADO** una story.md con criterios de aceptación Gherkin válidos  
**Y** docs\policies\sddf-config.yaml configurado con design-skill-architecture declarado como skill de la fase de plan (diseño)
**CUANDO** se invoca el skill design-skill-architecture  
**ENTONCES** se obtiene el conocimiento necesario para que story-design genere design.md y tasks.md con estructura de carpetas, scripts sugeridos, referencias y evals propuestos para el skill design-skill-architecture

### Escenario 2: impl-skill-builder apoya al skill story-implement para completar la implementación y el ciclo TDD
**DADO** design.md y tasks.md generados por design-skill-architecture  
**Y** docs\policies\sddf-config.yaml configurado con impl-skill-builder declarado como skill de la fase de implementation
**CUANDO** se invoca el skill impl-skill-builder  
**ENTONCES** se ejecuta el ciclo RED‑GREEN‑REFACTOR, el pressure scenario falla en RED, pasa en GREEN, y sigue pasando tras el REFACTOR
**Y** se genera SKILL.md, scripts y evals para el skill implementado

### Escenario 3: test-skill-verify apoya al skill story-verify para generar informe de benchmark
**DADO** un skill implementado con evals/evals.json definidos  
**Y** docs\policies\sddf-config.yaml configurado con test-skill-verify declarado como skill de la fase de verificación
**CUANDO** se invoca el skill test-skill-verify  
**ENTONCES** se genera un informe con tasa de acierto ≥95% y una comparativa cuantitativa with_skill vs without_skill

## Requerimiento
La fábrica de skills debe cumplir las siguientes reglas de construcción:
- El skill impl-skill-builder proporciona las instrucciones para que el agente ejecute el ciclo TDD manualmente (siguiendo el método Superpowers). Incluye ejemplos de pressure scenarios, comandos para lanzar subagentes, y criterios para pasar de RED a GREEN.
- **Archivo de configuración con los skills disponibles:** debe existir un archivo de configuración (docs\policies\sddf-config.yaml) que declare los skills disponibles para cada fase del pipeline (plan, implementing, verify). Este archivo es leído por los orquestadores (story-design, story-implement, story-verify) para saber qué skills invocar en cada fase. Configuración externa – sddf-config.yaml es una buena práctica para declarar skills disponibles, evitando hardcodear dependencias en los orquestadores y permitiendo agregar o cambiar skills sin modificar código, solo actualizando la configuración.
- **Responsabilidad única (SRP):** cada skill resuelve una única etapa del pipeline (diseñar / construir / verificar). No se mezclan responsabilidades entre skills.
- **Autocontenida (meta-fábrica):** los skills de la fábrica pueden usarse para construir los propios skills de la fábrica. La fábrica es el primer caso de uso de sí misma.
- **TDD progresivo:** la adopción de BDD/TDD es opcional en el primer uso pero obligatoria para skills clasificados como críticos (aquellos con impacto en el pipeline principal de otro skill). La idea de que los skills críticos pasen por TDD (rojo‑verde‑refactor) es sólida y garantiza calidad objetiva. Un skill es crítico si (a) es invocado directamente por un orquestador (story-design, story-implement, story-verify) o (b) es dependencia de otro skill crítico. Todos los skills críticos deben pasar el ciclo TDD completo.
- **Arquitectura de orquestación:** separar orquestadores ya existentes (story-design, story-implement, story-verify) de skills accesorios (design-*, impl-*, test-*). Permite cambiar o añadir nuevos skills sin modificar los orquestadores, solo actualizando el archivo de configuración.
- **Agnosticismo tecnológico:** la fábrica está diseñada para funcionar con cualquier stack (React, Python, etc.) a través de skills accesorios específicos. Eso es muy potente.
- Los orquestadores detectan el stack (React, Python, etc.) mediante el archivo de constitución y el de configuración sddf-config.yaml.
- Los bucles de retroalimentación entre diferentes fases son implementados por los skills principales de fase no por los skills complementarios.
- Sugerencia: Añadir smoke tests más detallados, por ejemplo:
    - Escenario 4: Verificar que design-arch genera design.md y tasks.md con estructura válida (comprobación de campos obligatorios).
    -Escenario 5: Simular un pressure scenario simple (ej. un skill que debe devolver "hello world") y comprobar que impl-builder completa el ciclo TDD.
    - Escenario 6: Forzar una tasa de acierto artificialmente baja y verificar que test-bench falla con el mensaje adecuado.
- Incorporar un campo version en SKILL.md (siguiendo semver) y un mecanismo de changelog (CHANGELOG.md en el skill). La meta-fábrica podría leer la versión y decidir si debe reconstruir el skill o no.
- La story.md procesada por los skills principales son fuente de verdad y un contrato con escenarios Gherkin.

## Requerimientos no funcionales

- INSPIRACIÓN NO NEGOCIABLE: Analizar skills de referencias siguientes y tomar lo mejor de ambos skills para diseñar e implementar estos skills complementarios de la fábrica de skills: [Superpowers](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) y [Skill-creator](https://github.com/bobmatnyc/claude-mpm-skills/blob/main/universal/main/skill-creator/SKILL.md) para ser usado en mis skills customizados para mi workflow. 
