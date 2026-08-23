---
type: guide
slug: sdd
title: "Spec Driven Development (SDD)"
date: 2026-05-01
status: null
substatus: null
parent: null
related:
  - extreme-agile
---
<!-- Referencias -->
[[extreme-agile]]


# Spec Driven Development (SDD)

## Qué es Spec Driven Development
Spec Driven Development propone, en esencia que la especificación preceda y guíe al código. No es un marco de trabajo ni una metodología prescriptiva como scrum. Es más bien un paradigma y enfoque de ingeniería de software donde la especificación declarativa se eleva a plano de control ejecutable y única fuente de verdad (SSOT), convirtiendo al código fuente en un artefacto secundario, efímero y continuamente regenerable mediante motores de IA y al desarrollo de software en desarrollo determinista más “desarrollo no determinista” asistido con IA y al humano en el centro. 


## SDD como Paradigma y enfoque

El Spec-Driven Development (SDD) es fundamentalmente un Paradigma de Arquitectura e Ingeniería de Software que se materializa en la práctica como un Enfoque de Desarrollo. 

1. **Es un Paradigma (Clasificación Principal)**: Representa un cambio fundamental en los modelos mentales de desarrollo y un salto de abstracción de quinta generación en la ingeniería de software. Invierte la autoridad del sistema: la especificación declarativa se convierte en el plano de control ejecutable y fuente única de verdad (SSOT), mientras que el código fuente se redefine como un subproducto efímero, derivado y regenerable ("Ambient Code") impulsado por motores como Gemini 2.5 Pro y GitHub Copilot.

2. **Es un Enfoque (Nivel Operativo)**: Constituye una filosofía de trabajo orientada a la intención ("intent-first") que contrasta directamente con la práctica improvisada del "vibe coding". Define la estrategia sobre cómo los ingenieros guían a los asistentes de IA según su madurez: desde 
       * **Spec-First:** Diseñar la especificación antes de programar.
       * **Spec-Anchored:** Mantener la especificación viva a lo largo del tiempo.
       * **Spec-as-Source:** Editar únicamente la especificación y nunca el código directamente.

3. **No es solo una Metodología**: Las metodologías (como Scrum o Kanban) prescriben marcos de trabajo y gestión, procesos (flujos, método o pasos secuenciales), ciclos de entrega (iteraciones), ceremonias (eventos o cadencias), roles organizacionales (responsabilidades), restricciones y buenas prácticas. SDD es agnóstico a la gestión; un equipo puede llevar un flujo Scrum sobre su backlog en Jira Software y aplicar SDD a nivel técnico sin modificar sus ceremonias (eventos).

## Principios de SDD

En SDD se busca seguir los siguientes principios:

1. La Especificación como Única Fuente de Verdad (SSOT)
       * **Intención declarativa sobre código:** El sistema se define mediante especificaciones estructuradas en lenguaje natural que expresan qué debe hacer el software, funcionando como la autoridad principal sobre el código.
       * **Código ejecutable y desechable ("Ambient Code"):** El código deja de ser el activo principal o intocable; se vuelve un producto secundario generado a demanda que puede regenerarse completamente si la especificación cambia.

2. **Desacoplamiento Estricto entre "Qué" y "Cómo"**
       * **Separación de responsabilidades:** La definición funcional y las intenciones del negocio se aíslan de las decisiones tecnológicas.
       * **Definición antes de implementación:** Se prohíbe introducir detalles técnicos o stacks de código en las fases iniciales de especificación (como /speckit.specify), derivando la arquitectura y tareas técnicas únicamente en pasos posteriores aprobados.

3. **Arquitectura Ejecutable y Detección Continua de Deriva (Drift Detection)**
       * **Gobernanza mecánicamente ejecutable:** Las reglas de arquitectura, fronteras y contratos no son sugerencias estáticas en documentos aislados; son verificables automáticamente.
       * **Control continuo de discrepancias:** El sistema incluye mecanismos de validación de esquemas y pruebas de contrato en tiempo de compilación y runtime para evitar que el comportamiento del software se desvíe de lo especificado.

4. **Elevación de la Autoridad Humana (Human-in-the-Loop)**
       * **Relocalización del criterio ingenieril:** Los desarrolladores delegan la escritura mecánica de código a motores de IA como GitHub Copilot y reubican su esfuerzo en gobernar el propósito, las políticas, los límites de seguridad y la semántica del dominio.
       * **Aprobación de cambios críticos:** La IA opera con autonomía acotada; las modificaciones que rompen retrocompatibilidad o alteran políticas clave requieren autorización humana explícita.

5. **Operación y Control de Versiones de Especificaciones (SpecOps)**
       * **Persistencia en el repositorio:** Las especificaciones se tratan con el mismo rigor que el código fuente, residiendo en el control de versiones (Git) y sujetas a revisión por pares, ramificación y trazabilidad.
       * **Gobernanza constitucional:** El desarrollo está acotado por un marco innegociable de principios y restricciones arquitectónicas (como constitution.md en GitHub Spec Kit) que audita cada plan e implementación antes de ser ejecutado.


## Mapeo de Componentes SDD

Mapeo de Componentes Operacionales de SDD:

1. **Specs de Requerimientos / Delta Specs: Control Plane & SSOT.** Define el "qué" funcional y la intención del negocio (spec.md). Vive en el repositorio. Traducción de historias de Jira Software o prompts hacia carpetas del repositorio (.specify/specs/, docs/specs, .specs).
2. **Specs de Guardrails y Gobernanza: Políticas de Arquitectura.** Reglas innegociables de calidad, límites de seguridad y patrones de diseño. Archivos de prompt de sistema, constitución y políticas (como .specify/memory/constitution.md, docs/policies, etc.) que audita cada decisión técnica.
3. **Orquestación de Specs (Toolkits): Orquestación de agentes, Workflow y Ciclo de Vida.** Herramientas SDD (toolkit, SDD harness, SDD CLI, etc.) que automatizan las actividades de SDD, pasos secuenciales y gestionan estados (Toolkit como GitHub Spec Kit, OpenSpec, etc.).
4. **Motor de Generación y Ejecución: Materialización Cognitiva.** Transforma la especificación y los guardrails en código ejecutable y pruebas. Son agent harness como GitHub Copilot (asistente de código), Claude, y Gemini 2.5 Pro (razonamiento arquitectónico); estos motores intermedian con los modelos de IA.
5. **Ambiente de código:** Es el producto o código fuente resultante de esa generación. Repositorio con src.


## Flujo de trabajo SDD

En SDD no existe un workflow estandarizado, ni un ciclo de vida prescriptivo. Cada orquestador de SDD puede definir su propio flujo de trabajo, pero todos comparten la misma filosofía: la especificación precede y guía a la implementación de código.

Por ejemplo el flujo más simple e inmaduro de SDD propuesto para intent-first con Spec-First es el conocido RPI (Research --> Plan --> Implement). Aquí el plan funciona como especificación y guía de implementación, pero no es una especificación formal ni ejecutable. En este flujo, la especificación se mantiene en un documento de texto plano (por ejemplo, un archivo Markdown) y el código se genera a partir de prompts improvisados.

Un workflow más genérico, maduro y completo de SDD es el flujo: Specify → Plan → Implement → Validate. En este flujo, la especificación es formal, ejecutable y versionada, y se puede mantener como historial o viva a lo largo del tiempo. La implementación se genera a partir de la especificación y se valida manualmente por un humano y mediante pruebas automáticas y revisiones de código.

El flujo Specify → Plan → Implement → Validate se puede resumir de la siguiente manera:
1. **Specify:** Escribir primero una especificación clara de lo que se quiere construir: objetivos, reglas de negocio, comportamiento, criterios de aceptación y requisitos, restricciones técnicas. Sin prescribir cómo se implementa.
2. **Plan:** Definir cómo se va a construir: arquitectura y diseño (tecnologías, modelos de datos, contratos, interfaces, error handling) y tareas.
3. **Implement:** Escribir el código siguiendo la especificación y el plan (validando mediante TDD y pruebas automáticas).
4. **Validate:** Verificar que la implementación cumple con la especificación sin errores (por ejemplo, mediante pruebas de aceptación automatizadas, revisiones de código y aceptación humana).

```
Human review           Human review           Human review        Automated + Human
       :                      :                      :                      :
       v                      v                      v                      v
+--------------+       +--------------+       +--------------+       +--------------+
|   Specify    | ----> |     Plan     | ----> |  Implement   | ----> |   Validate   |
| What to build|       | How to build |       |   Build it   |       |  Verify it   |
+--------------+       +--------------+       +--------------+       +--------------+
       ^                                                                    |
       |                                                                    |
       + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  +
                              Refine spec if needed
```

Con este enfoque se busca usar las especificaciones vivas como fuente de la verdad, tanto para humanos como para agentes de IA, para generar código robusto a partir de la spec, no de prompts improvisados.

Como lo resume GitHub en su documentación de Spec Kit: "En este nuevo mundo, mantener software significa evolucionar especificaciones. [...] El código es el enfoque de última milla."[1]

SDD no propone documentación extensiva estilo waterfall. Propone especificaciones vivas, ejecutables y versionadas que evolucionan con el código. Como GitHub lo describe: "Spec-Driven Development no se trata de escribir documentos de requisitos exhaustivos que nadie lee. Tampoco se trata de planificación waterfall."[1]

## Herramientas SDD de Orquestación de Specs (Toolkits)

El ecosistema de herramientas SDD está creciendo rápidamente:

- **OpenSpec:** OpenSpec es un framework de SDD ("capa de definición de requisitos"), para hacer Spec-anchored development, creado por Fission AI, publicado bajo licencia MIT. Su flujo principal es: /opsx:propose ──► /opsx:apply ──► /opsx:archive [2].

- **GitHub Spec Kit:** Toolkit open source que proporciona un flujo estructurado: Constitution → Specify → Plan → Tasks → Implement. Funciona con Copilot, Claude Code y otros [3].

- **Kiro (AWS):** IDE basado en VS Code, para Spec-first, con flujo integrado de Requirements → Design → Tasks.

- **BMAD Method:** Usa agentes virtuales (Analyst, Product Manager, Architect), para Spec-first, para generar PRDs y specs de arquitectura.

- **Open SPDD:** Enfoque Structured-Prompt-Driven Development (SPDD) enfatiza prompts estructurados para generar código a partir de specs. El departamento de TI interno de Thoughtworks utiliza LLMs para sus equipos y ha desarrollado un método y flujo de trabajo denominado Desarrollo Estructurado Guiado por Indicaciones (SPDD). El flujo de trabajo SPDD consta de los siguientes pasos: create initial requirements → clarify analysis → generate analysis context → generate structured prompt → generate code → generate unit test → integrate-build-and-deploy [4][5].

- **Superpowers:** Es un Claude Plugin de desarrollo low-code, para Spec-first, que se integra con OpenSpec para ejecutar el flujo SDD. Superpowers la de "capa de ingeniería de software" [6]. Es una metodología completa de desarrollo de software para tus agentes de codificación, construida sobre un conjunto de skills combinables y algunas instrucciones iniciales que garantizan que tu agente las utilice.

- **Gentle AI:** Proyecto open source que explora el uso de agentes de IA para generar código a partir de especificaciones [7]. Es un configurador de ecosistemas que toma cualquier agente de codificación de IA que utilices y lo potencia con memoria persistente, flujos de trabajo de desarrollo guiado por especificaciones (SDD), habilidades de codificación seleccionadas, servidores MCP, un selector de proveedores de IA, un perfil orientado a la enseñanza con permisos que priorizan la seguridad y asignación de modelos por fase para que cada paso de SDD pueda ejecutarse en un modelo diferente.

- **Agent Skills:** Las habilidades codifican los flujos de trabajo, los controles de calidad y las mejores prácticas que utilizan los ingenieros sénior al desarrollar software. Estas se empaquetan para que los agentes de IA las sigan de forma coherente en cada fase del desarrollo [8]. Skills para un flujo de trabajo completo de SDD: Define, Plan, Build, Verify, Review, Ship.

- **Spec-Driven Development Skill:** Skill que implementa un flujo de trabajo completo de SDD basado en especificaciones [9]. Compatible con Claude Code, Cursor, GitHub Copilot, JetBrains Junie, Windsurf y herramientas similares.

- **Predictable:** Plataforma de desarrollo de software, para spec-as-source/Spec-anchored development, que permite a los equipos de ingeniería crear, mantener y evolucionar especificaciones vivas y ejecutables, integrando flujos de trabajo SDD con herramientas de control de versiones y CI/CD.

- **Tessl Framework:** Explora el nivel spec-as-source con mapeo 1:1 entre specs y archivos de código.

- **Codeplain:** Plataforma de desarrollo de software, para spec-as-source, que permite a los equipos de ingeniería crear, mantener y evolucionar especificaciones vivas y ejecutables, integrando flujos de trabajo SDD con herramientas de control de versiones y CI/CD.

Referencias:
[1]: GitHub Blog - Spec-driven development with AI: github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai 
[2]: https://openspec.dev/
[3]: https://speckit.org/
[4]: https://martinfowler.com/articles/structured-prompt-driven/?shem=rimspwouoe
[5]: https://github.com/gszhangwei/open-spdd/tree/main
[6]: https://github.com/obra/superpowers
[7]: https://github.com/Gentleman-Programming/gentle-ai
[8]: https://github.com/addyosmani/agent-skills
[9]: https://github.com/mariano-aguero/spec-driven-development-skill


