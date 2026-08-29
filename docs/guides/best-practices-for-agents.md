---
type: guide
slug: best-practices-for-agents
title: "Buenas prácticas para Agentes"
date: 2026-03-26
status: null
substatus: null
parent: null
related:                                    # opcional, si tiene relación con otros nodos
  - best-practices-for-skills
  - best-practices-for-commands
---
<!-- Referencias -->
[[best-practices-for-commands]]
[[best-practices-for-skills]]

# Buenas prácticas para Agentes

Los agentes son asistentes de IA especializados que se pueden configurar para tareas y flujos de trabajo específicos. Los **agentes**, las **skills** y los **comandos** son elementos fundamentales para estructurar un el equipo de inteligencia artificial automatizado para Agile Spec-Driven Development Framework (SDDF). Aquí tienes la definición y el uso de agentes:

## Agentes

Los agentes funcionan como **pequeños empleados virtuales especializados** en tareas concretas dentro de un proyecto, como por ejemplo un agente que hace discovery, otro que redacta especificaciones o uno que diseña arquitectura. Técnicamente, son archivos de texto (Markdown) que contienen instrucciones de roly contexto específico sobre cómo deben actuar. Estos agentes pueden trabajar de forma autónoma, simultánea o en equipo, entregando resultados listos para usar.

### Ubicación de los agentes personalizados

Claude (Compatible con OpenCode) --> .claude/agents/docs-writer.agent.md
Github Copilot (en proyecto) --> .github/agents/docs-writer.agent.md
OpenCode (en proyecto) --> .opencode/agents/docs-writer.agent.md
OpenCode (global) --> ~/.config/opencode/agents/docs-writer.agent.md
OpenCode (Compatible con agentes de proyecto) --> .agents/agents/docs-writer.agent.md
OpenCode (Compatible con agentes de globales) --> ~/.agents/agents/docs-writer.agent.md

### Agentes personalizados (*.agent.md)

El archivo de agente personalizado puede tener un nombre como review.md pero se recomienda terminar en *.agent.md — Contratar a un especialista para un trabajo específico. A veces no se necesita un copiloto o agente generalista, sino un especialista. Un ingeniero de pruebas que solo escribe pruebas. Un revisor que solo revisa. Cada uno .agent.mddefine el rol, las herramientas permitidas y las reglas.

La información preliminar que importa (frontmatter) es:

```yaml
--- 
nombre:  'Ingeniero de pruebas' 
descripción:  'Escribe y mantiene pruebas para código .NET 8 y Angular 20. Se utiliza para la creación de pruebas unitarias, brechas de cobertura y refactorización de pruebas.' 
herramientas: [ 'leer' , 'editar' , 'buscar' , 'ejecutar pruebas' ] 
modelo: [ 'Claude Sonnet 4.6' , 'GPT-5.5' , 'Claude Opus 4.7' ] 
destino:  'vscode' 
usuario invocable:  verdadero 
transferencias: 
  -  etiqueta:  'Enviar al revisor de código' 
    agente:  code-reviewer 
    mensaje:  'Revisa las pruebas anteriores para la cobertura y los casos límite' 
    enviar:  falso 
---
```

Algunos campos en los que merece la pena detenerse:

* **tools:**— cada herramienta que enumeres agrega su descripción al mensaje del sistema. Un ingeniero de pruebas no necesita runCommandspara rm -rf. Sé tacaño.
* **model:** Como lista de prioridades, Copilot pasa a un segundo plano si su primera opción tiene un límite de solicitudes.
* **target:**— Las transferencias se comportan de manera diferente en VS Code, la CLI y el agente en la nube. Conéctese a su superficie principal.
* **user-invocable:** false— controla si el agente aparece en el menú desplegable de agentes (no en el /menú principal, que es para indicaciones y habilidades). Configúrelo falsepara los especialistas a los que solo desea que se pueda acceder como subagentes.
* **disable-model-invocation:** true— Campo independiente. Impide que el modelo invoque automáticamente a este agente como subagente. Úselo cuando un agente solo deba activarse ante una solicitud explícita del usuario.
* **agents:**— (optativo) lista de permitidos de los cuales este agente puede llamar como subagentes. ['*']para cualquiera, []prohibir la delegación.
* **handoffs.model:**— (optativo) especificar un modelo diferente para el agente objetivo (revisión de ruta a un modelo más económico, razonamiento a uno más robusto).
* **hooks:**— (optativo) Los agentes pueden definir ganchos con alcance en su metadato.

#### ¿Qué entra en el cuerpo?

Patrones de agente que funcionan:

1. Función clara : quién es el agente, qué hace y qué no hace. Por ejemplo: "Eres un ingeniero de pruebas que escribe pruebas para componentes de React, sigue estos ejemplos y nunca modifica el código fuente".
2. Los comandos ejecutablesnpm test aparecen dotnet buildprimero ;
3. Conocimiento del proyecto con versiones y ubicaciones exactas de archivos , no "los archivos de prueba", sinotests/Unit/*.Tests.cs
4. Ejemplos reales : muestra cómo debe ser un buen resultado, en código.
5. Límites de tres niveles : secciones explícitas de " hacer siempre / preguntar primero / nunca hacer"

Ejemplo de límites:

```
## Límites

**Siempre:** 

- Escribe las pruebas siguiendo el patrón AAA (Arrange/Act/Assert) 
- Utiliza los fixtures existentes antes de crear otros nuevos 
- Ejecuta el conjunto completo de pruebas después de generarlas

**Pregunta primero:** 

- Antes de añadir nuevas dependencias del framework de pruebas 
- Antes de modificar las pruebas en `tests/Integration/`

**Nunca:** 

- Modifique los archivos fuente de producción 
- Elimine las pruebas existentes, incluso si parecen obsoletas 
- Desactive u omita las pruebas para que "pasen"
```

#### Ejemplo de un excelente agente personalizado

A continuación se muestra un ejemplo para agregar una agent.mdpersona de documentación en su repositorio

```
---
name: docs-writer.agent
description: Expert technical writer for this project
---

You are an expert technical writer for this project.

## Your role
- You are fluent in Markdown and can read TypeScript code
- You write for a developer audience, focusing on clarity and practical examples
- Your task: read code from `src/` and generate or update documentation in `docs/`

## Project knowledge
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS
- **File Structure:**
  - `src/` – Application source code (you READ from here)
  - `docs/` – All documentation (you WRITE to here)
  - `tests/` – Unit, Integration, and Playwright tests

## Commands you can use
Build docs: `npm run docs:build` (checks for broken links)
Lint markdown: `npx markdownlint docs/` (validates your work)

## Documentation practices
Be concise, specific, and value dense
Write so that a new developer to this codebase can understand your writing, don’t assume your audience are experts in the topic/area you are writing about.

## Boundaries
- ✅ **Always do:** Write new files to `docs/`, follow the style examples, run markdownlint
- ⚠️ **Ask first:** Before modifying existing documents in a major way
- 🚫 **Never do:** Modify code in `src/`, edit config files, commit secrets
```

### Custom Agents en Github Copilot (Agentes personalizados)

Representan personas artificiales con tareas específicas. Pueden tener sus propias instrucciones, restricciones de herramientas y contexto personalizado. Existen de dos tipos:

* **Agentes personalizados:** Seleccionados manualmente desde un desplegable para proyectos o flujos que necesitan una persona específica (como un agente revisor de React o un auditor de seguridad).

* **Subagentes:** Invocados automáticamente por el agente principal para delegar trabajo en un contexto aislado, aunque no son configurados por el usuario directamente.

### Custom Agents en OpenCode

Hay dos tipos de agentes en OpenCode; agentes primarios y subagentes.

* **Agentes primarios** son los agentes principales que se invocan directamente por el usuario y que manejan su conversación principal. Se configuran con un archivo .agent.md en el repositorio o en la configuración del usuario. OpenCode viene con dos agentes principales integrados, Build y Plan. Bien mira estos a continuación.

* **Subagentes:** Los subagentes son asistentes especializados que los agentes principales pueden invocar para tareas específicas. También puedes invocarlos manualmente @ mencionándolos en tus mensajes. OpenCode viene con tres subagentes integrados, General, Explore y Scout. Veremos esto a continuación.



