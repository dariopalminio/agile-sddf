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

Los **agentes**, las **skills** y los **comandos** son elementos fundamentales para estructurar un el equipo de inteligencia artificial automatizado para Agile Spec-Driven Development Framework (SDDF). Aquí tienes la definición y el uso de agentes:

## Agentes

Los agentes funcionan como **pequeños empleados virtuales especializados** en tareas concretas dentro de un proyecto, como por ejemplo un agente que hace discovery, otro que redacta especificaciones o uno que diseña arquitectura. Técnicamente, son archivos de texto (Markdown) que contienen instrucciones de roly contexto específico sobre cómo deben actuar. Estos agentes pueden trabajar de forma autónoma, simultánea o en equipo, entregando resultados listos para usar.

### Agentes personalizados (*.agent.md)

El archivo de agente personalizado debe terminar en *.agent.md — Contratar a un especialista para un trabajo específico. A veces no se necesita un copiloto o agente generalista, sino un especialista. Un ingeniero de pruebas que solo escribe pruebas. Un revisor que solo revisa. Cada uno .agent.mddefine el rol, las herramientas permitidas y las reglas.

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

### Custom Agents en Github Copilot (Agentes personalizados)

Representan personas artificiales con tareas específicas. Pueden tener sus propias instrucciones, restricciones de herramientas y contexto personalizado. Existen de dos tipos:

* **Agentes personalizados:** Seleccionados manualmente desde un desplegable para proyectos o flujos que necesitan una persona específica (como un agente revisor de React o un auditor de seguridad).

* **Subagentes:** Invocados automáticamente por el agente principal para delegar trabajo en un contexto aislado, aunque no son configurados por el usuario directamente.

