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

> **Nota (2026-08-30):** el skill `readme-builder` que esta historia entregÃ³ ya no vive en este
> repositorio; se moviÃ³ al repositorio de extensiones
> [`agile-sddf-extension`](https://github.com/dariopalminio/agile-sddf-extension). La historia se
> conserva como registro del trabajo realizado.

# Historia de Usuario

## ?? Historia: README.md builder

**Como** desarrollador o tech lead que usa SDDF para especificar un proyecto
**Quiero** ejecutar el skill `readme-builder` para generar un README.md completo y actualizado
**Para** tener documentaciï¿½n pï¿½blica del proyecto lista para publicar sin redactarla manualmente desde cero

## ? Criterios de aceptaciï¿½n

### Escenario principal ï¿½ Generaciï¿½n de README desde artefactos existentes
```gherkin
Dado que el proyecto tiene al menos un artefacto de especificaciï¿½n disponible (project-intent.md, requirement-spec.md o project-plan.md)
  Y el directorio raï¿½z del proyecto no tiene un README.md previo
Cuando el usuario ejecuta el skill `readme-builder`
Entonces el skill genera un archivo README.md en la raï¿½z del proyecto
  Y el contenido incluye secciones derivadas de los artefactos disponibles (visiï¿½n, descripciï¿½n, instalaciï¿½n, uso)
  Y el formato sigue el template especï¿½fico de README del skill
```

### Escenario alternativo / error ï¿½ README.md ya existe
```gherkin
Dado que ya existe un README.md en la raï¿½z del proyecto
Cuando el usuario ejecuta el skill `readme-builder`
Entonces el skill informa que existe un README.md previo 
  Y muestra las opciones disponibles de mejorarlo, 
  Y pregunta si desea sobreescribir el README.md existente, generar un nuevo README con un nombre diferente (ej. README-new.md) o cancelar la operaciï¿½n
  Pero no sobreescribe el README.md existente sin confirmaciï¿½n explï¿½cita del usuario
```

### Escenario alternativo / error ï¿½ No hay artefactos de especificaciï¿½n disponibles
```gherkin
Dado que el proyecto no tiene ningï¿½n artefacto de especificaciï¿½n (project-intent.md, requirement-spec.md, project-plan.md)
Cuando el usuario ejecuta el skill `readme-builder`
Entonces se buscan archivos de clientes llms como AGENTS.md, CLAUDE.md, .specify\memory\constitution.md  para generar el README
  Y si se encuentran, se genera el README.md usando la informaciï¿½n disponible en esos archivos
  Pero si no se encuentran artefactos de especificaciï¿½n ni archivos de plan de LLM se revisa todo el proyecto haciendo ingenierï¿½a inversa para extraer informaciï¿½n relevante para el README
  Y genera el README.md con la informaciï¿½n extraï¿½da aunque no se encuentren artefactos de especificaciï¿½n formales
  Pero si no se encuentra ninguna informaciï¿½n relevante para generar el README,
  el skill muestra el mensaje "No se encontraron artefactos de especificaciï¿½n para generar el README"
  Y sugiere ejecutar primero `/project-discovery` para crear los artefactos base
```

### Requirement: Template de README.md
El skill tiene el template guardado internamente en el folder de templates `<skill-name>\templates\readme-template.md` y lo utiliza para generar el README.md a partir de los artefactos de especificaciï¿½n disponibles.
El `<skill-name>\templates\readme-template.md` sigue el siguiente template: `docs\specs\templates\readme-template.md`.

### Requirement: Template es solo lectura y fuente de verdad para el formato del README.md generado
El template SHALL ser un archivo de solo lectura que no se modifica durante la ejecuciï¿½n del skill. El template es la fuente de verdad para el formato del README.md generado, no el cï¿½digo del skill.

### Requirement: Interpretaciï¿½n del template en tiempo de ejecuciï¿½n (Template as runtime source-of-truth)
El skill interpreta el template de README.md como la fuente de verdad para el formato del README generado. El template define la estructura, secciones y formato del README.md generado. El skill rellena el template con la informaciï¿½n extraï¿½da de los artefactos de especificaciï¿½n para generar el README.md final. Si el template cambia, el README.md generado cambiarï¿½ automï¿½ticamente sin necesidad de modificar el cï¿½digo del skill, ya que el template es la fuente de verdad para el formato del README.md generado.
 **Preguntas derivadas del template**: nunca hardcodees preguntas; si el template evoluciona, vos evolucionï¿½s con ï¿½l. 

### Requirement: Output del README.md generado
El output siempre se escribe en `README.md` en la raï¿½z del proyecto, nunca sobre el template.
**Paso 3: Extraer secciones del template en runtime**
A partir del template leï¿½do, se extrae dinï¿½micamente:
- Cada header `##` y `###` como el nombre de la secciï¿½n o subsecciï¿½n objetivo
- El comentario `<!-- -->` inmediatamente siguiente como guï¿½a para formular las preguntas y completar el contenido
- Si es necesario derivar preguntas: **Deriva la pregunta del comentario** `<!-- -->` de esa secciï¿½n ï¿½ reformï¿½lalo como pregunta directa al usuario

### Requirement: inspiraciï¿½n para estructura del skill
Para planificar e idear el skill puedes inspirarte en los siguientes skills: `/readme-creator` (https://skills.sh/mblode/agent-skills/readme-creator), `readme-blueprint-generator` (https://skills.sh/github/awesome-copilot/readme-blueprint-generator).

### Requirement: Asistente para la creaciï¿½n del skill y mejores prï¿½cticas
Puedes apoyarte en el skill creator (`skill-master`), .claude\skills\skill-master,  para planificar y crear el skill, siguiendo las mejores prï¿½cticas.

## ?? Notas / contexto adicional

Generado automï¿½ticamente desde el release: release-09-docs-and-wiki-builders.md
Feature origen: STORY-042 ï¿½ README.md builder
Dependencias declaradas: STORY-001, STORY-003, STORY-004
El skill debe analizar el proyecto actual si no encuentra artefactos en rutas esperadas.
