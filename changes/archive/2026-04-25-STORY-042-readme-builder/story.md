---
type: story
id: STORY-042
kind: feat
slug: STORY-042-readme-builder
title: "README.md builder"
date: 2026-04-25
status: COMPLETED
substatus: READY
parent: EPIC-09-docs-and-wiki-builders
---

<!-- Referencias -->
[[EPIC-09-docs-and-wiki-builders]]

> **Nota (2026-08-30):** el skill `readme-builder` que esta historia entregó ya no vive en este
> repositorio; se movió al repositorio de extensiones
> [`agile-sddf-extension`](https://github.com/dariopalminio/agile-sddf-extension). La historia se
> conserva como registro del trabajo realizado.

# Historia de Usuario

## 📖 Historia: README.md builder

**Como** desarrollador o tech lead que usa SDDF para especificar un proyecto
**Quiero** ejecutar el skill `readme-builder` para generar un README.md completo y actualizado
**Para** tener documentación pública del proyecto lista para publicar sin redactarla manualmente desde cero

## ✅ Criterios de aceptación

### Escenario principal – Generación de README desde artefactos existentes
```gherkin
Dado que el proyecto tiene al menos un artefacto de especificación disponible (project-intent.md, requirement-spec.md o project-plan.md)
  Y el directorio raíz del proyecto no tiene un README.md previo
Cuando el usuario ejecuta el skill `readme-builder`
Entonces el skill genera un archivo README.md en la raíz del proyecto
  Y el contenido incluye secciones derivadas de los artefactos disponibles (visión, descripción, instalación, uso)
  Y el formato sigue el template específico de README del skill
```

### Escenario alternativo / error – README.md ya existe
```gherkin
Dado que ya existe un README.md en la raíz del proyecto
Cuando el usuario ejecuta el skill `readme-builder`
Entonces el skill informa que existe un README.md previo 
  Y muestra las opciones disponibles de mejorarlo, 
  Y pregunta si desea sobreescribir el README.md existente, generar un nuevo README con un nombre diferente (ej. README-new.md) o cancelar la operación
  Pero no sobreescribe el README.md existente sin confirmación explícita del usuario
```

### Escenario alternativo / error – No hay artefactos de especificación disponibles
```gherkin
Dado que el proyecto no tiene ningún artefacto de especificación (project-intent.md, requirement-spec.md, project-plan.md)
Cuando el usuario ejecuta el skill `readme-builder`
Entonces se buscan archivos de clientes llms como AGENTS.md, CLAUDE.md, .specify\memory\constitution.md  para generar el README
  Y si se encuentran, se genera el README.md usando la información disponible en esos archivos
  Pero si no se encuentran artefactos de especificación ni archivos de plan de LLM se revisa todo el proyecto haciendo ingeniería inversa para extraer información relevante para el README
  Y genera el README.md con la información extraída aunque no se encuentren artefactos de especificación formales
  Pero si no se encuentra ninguna información relevante para generar el README,
  el skill muestra el mensaje "No se encontraron artefactos de especificación para generar el README"
  Y sugiere ejecutar primero `/project-discovery` para crear los artefactos base
```

### Requirement: Template de README.md
El skill tiene el template guardado internamente en el folder de templates `<skill-name>\templates\readme-template.md` y lo utiliza para generar el README.md a partir de los artefactos de especificación disponibles.
El `<skill-name>\templates\readme-template.md` sigue el siguiente template: `docs\specs\templates\readme-template.md`.

### Requirement: Template es solo lectura y fuente de verdad para el formato del README.md generado
El template SHALL ser un archivo de solo lectura que no se modifica durante la ejecución del skill. El template es la fuente de verdad para el formato del README.md generado, no el código del skill.

### Requirement: Interpretación del template en tiempo de ejecución (Template as runtime source-of-truth)
El skill interpreta el template de README.md como la fuente de verdad para el formato del README generado. El template define la estructura, secciones y formato del README.md generado. El skill rellena el template con la información extraída de los artefactos de especificación para generar el README.md final. Si el template cambia, el README.md generado cambiará automáticamente sin necesidad de modificar el código del skill, ya que el template es la fuente de verdad para el formato del README.md generado.
 **Preguntas derivadas del template**: nunca hardcodees preguntas; si el template evoluciona, vos evolucionás con él. 

### Requirement: Output del README.md generado
El output siempre se escribe en `README.md` en la raíz del proyecto, nunca sobre el template.
**Paso 3: Extraer secciones del template en runtime**
A partir del template leído, se extrae dinámicamente:
- Cada header `##` y `###` como el nombre de la sección o subsección objetivo
- El comentario `<!-- -->` inmediatamente siguiente como guía para formular las preguntas y completar el contenido
- Si es necesario derivar preguntas: **Deriva la pregunta del comentario** `<!-- -->` de esa sección — reformúlalo como pregunta directa al usuario

### Requirement: inspiración para estructura del skill
Para planificar e idear el skill puedes inspirarte en los siguientes skills: `/readme-creator` (https://skills.sh/mblode/agent-skills/readme-creator), `readme-blueprint-generator` (https://skills.sh/github/awesome-copilot/readme-blueprint-generator).

### Requirement: Asistente para la creación del skill y mejores prácticas
Puedes apoyarte en el skill creator (`skill-master`), .claude\skills\skill-master,  para planificar y crear el skill, siguiendo las mejores prácticas.

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-09-docs-and-wiki-builders.md
Feature origen: STORY-042 — README.md builder
Dependencias declaradas: STORY-001, STORY-003, STORY-004
El skill debe analizar el proyecto actual si no encuentra artefactos en rutas esperadas.
