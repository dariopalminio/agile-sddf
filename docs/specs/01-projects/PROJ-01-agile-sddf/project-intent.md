---
type: project
id: PROJ-01
slug: PROJ-01-agile-sddf-project-intent
title: "Project Intent: Agile SDDF (Spec-Driven Development Framework)"
date: 2026-04-20
status: COMPLETED
substatus: READY
parent: null
---

# Project Intent: Agile SDDF (Spec-Driven Development Framework)

## Definición del Problema

Los developers que trabajan con IA para desarrollar software carecen de una metodología estructurada para aplicar Spec-Driven Development (SDD). El resultado es el uso de prompts ad-hoc (Vibe Coding), herramientas como SpecKit u OpenSpec de forma artesanal, o asistentes como GitHub Copilot sin ningún marco de trabajo que garantice consistencia, trazabilidad ni calidad entre etapas.

El impacto concreto es alto retrabajo en implementación por specs mal definidas, ausencia de un proceso repetible desde la intención inicial hasta el código generado, y falta de cobertura de la etapa upstream del proyecto (inicio de proyecto, gestión de releases, backlog estructurado).

## Visión (elevator pitch)

- **Para:** developers, builders, freelancers y equipos ágiles que usan IA para acelerar el desarrollo de software
- **Quiénes:** carecen de metodología estructurada para trabajar con SDD y terminan usando prompts ad-hoc o herramientas como SpecKit/OpenSpec de forma artesanal, sin trazabilidad ni consistencia entre etapas
- **Nuestro producto:** Agile SDDF (Spec-Driven Development Framework)
- **Es un:** software AI-CLI tipo framework de automatización y framework metodológico
- **Que provee:** un workflow ágil y secuencial que cubre el ciclo completo desde la intención del proyecto hasta la generación de código asistida por multi-agentes, con control de WIP, puntos de revisión humana y trazabilidad en cada etapa
- **A diferencia de:** Vibe Coding ad-hoc, GitHub Copilot sin estructura, SpecKit/OpenSpec artesanal, o frameworks rígidos que no se adaptan al contexto del proyecto
- **Nuestro producto:** es el único framework que extrae dinámicamente la estructura de templates en runtime para generar preguntas y comandos contextuales, cubre la etapa upstream de inicio y gestión de releases, y opera en múltiples runtimes de IA (Claude, GitHub Copilot, OpenCode) sin modificar código subyacente.

## Beneficios Clave

- Specs trazables que reducen el retrabajo en implementación: cada decisión de negocio se rastrea hasta el código generado
- Cobertura completa del ciclo upstream: inicio de proyecto, gestión de releases y especificación de features en un solo framework estructurado
- Multi-runtime: funciona con Claude Code, GitHub Copilot y OpenCode, sin dependencia de un proveedor de IA específico
- Workflow repetible y consistente: el mismo proceso predecible sin importar el proyecto, eliminando la variabilidad de los prompts ad-hoc

## Criterios de Éxito

- [ ] Un developer puede completar un proyecto desde cero hasta código generado de forma completamente asistida, sin salir del framework
- [ ] El framework está disponible como paquete publicado en npm con una versión desplegable antes del 31 de mayo de 2026
- [ ] El framework opera correctamente en los tres runtimes objetivo: Claude Code, GitHub Copilot y OpenCode

## Restricciones

- **Technical**: Implementación basada en Markdown + agentes + skills. Debe ser compatible y funcional con Claude Code, GitHub Copilot y OpenCode (multi-runtime es un requisito no negociable). Sin dependencia de servidor; ejecución local vía CLI. Publicación como paquete npm.
- **Time**: Deadline fines de mayo 2026 para versión desplegable en npm.
- **Resources**: Proyecto unipersonal (un solo developer). Sin presupuesto de infraestructura declarado.

## Fuera de alcance (Non-Goals)

- [inferido] Ejecución automática de tests y cobertura de QA automatizada (fuera del ciclo actual del framework)
- [inferido] Deployment a producción de los proyectos generados (el framework asiste hasta la generación de código, no el deploy del producto resultante)
- [inferido] Gestión de infraestructura o DevOps (IaC, CI/CD pipelines del proyecto generado)
- [inferido] Interfaz visual o UI gráfica para el framework (el canal es exclusivamente CLI/Markdown)
- [inferido] Integración nativa con herramientas de gestión de proyectos como Jira, Linear o Trello en esta versión
- [inferido] Soporte para lenguajes o stacks específicos de forma hardcodeada (el framework es agnóstico al stack del proyecto generado)
