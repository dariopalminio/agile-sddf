---
type: story
id: FEAT-043
slug: FEAT-043-header-aggregation
title: "Encabezado de archivos spec con metadata de estado (header-aggregation)"
date: 2026-04-25
status: COMPLETED
substatus: READY
parent: EPIC-09-docs-and-wiki-builders
tags: [spec, story]
---
<!-- Referencias -->
[[EPIC-09-docs-and-wiki-builders]]

# ?? Historia: Encabezado de archivos spec con metadata de estado (header-aggregation)

**Como** tech lead o PM que gestiona m�ltiples artefactos de especificaci�n en un proyecto SDDF
**Quiero** que cada archivo de spec tenga un encabezado YAML estandarizado con campos de estado y trazabilidad y tener un skill que pueda a�adir este encabezado autom�ticamente a los archivos existentes
**Para** poder navegar y enlazar nodos de documentaci�n de forma consistente y rastrear el estado de cada artefacto sin abrir el contenido completo

## ? Criterios de aceptaci�n

### Escenario principal � Encabezado YAML a�adido a un archivo de spec
```gherkin
Dado que existe un skill llamado header-aggregation
Y el skill es invocado para a�adir un encabezado a un archivo de especificaci�n espec�fico (ej. project-intent.md)
Y que existe un archivo de especificaci�n (ej. project-intent.md) sin encabezado YAML
Cuando el skill a�ade el encabezado estandarizado al archivo
Entonces el archivo comienza con un bloque YAML frontmatter con los campos definidos (t�tulo, versi�n, estado, fecha, y campos de trazabilidad)
  Y el contenido existente del archivo se preserva intacto despu�s del bloque YAML
  Y el campo "estado" tiene un valor v�lido del conjunto definido (ej. Draft, IN‑PROGRESS, Done)
```

### Escenario principal � Encabezado aplicado a todos los tipos de artefactos soportados
```gherkin
Dado que existe un skill llamado header-aggregation
Y que el proyecto tiene archivos de tipo project-intent.md, requirement-spec.md, project-plan.md, release*.md y story*.md
Cuando se solicita a�adir encabezados a todos los artefactos
Entonces cada archivo recibe su encabezado YAML con los campos estandarizados
  Y los campos de linkeo entre nodos apuntan a los artefactos relacionados correctamente
```

### Escenario alternativo / error � Archivo ya tiene encabezado YAML
```gherkin
Dado que existe un skill llamado header-aggregation
Y que un archivo de spec ya tiene un bloque YAML frontmatter al inicio
Cuando el skill intenta a�adir el encabezado estandarizado
Entonces el skill detecta el encabezado existente 
  Y redacta el nuevo encabezado propuesto combinando los campos nuevos con los existentes sin perder informaci�n
  Y muestra un resumen de los cambios propuestos al usuario para revisi�n
  E informa al usuario
  Y pregunta si quiere sobreescribir el encabezado existente, combinarlo con el nuevo o mantener el existente sin cambios
  Pero no sobreescribe ni duplica el bloque existente sin confirmaci�n
```

### Escenario alternativo / error � Campos de trazabilidad con referencia inv�lida
```gherkin
Dado que existe un skill llamado header-aggregation
Y que el encabezado incluye un campo de linkeo que apunta a un artefacto que no existe
Cuando se valida el encabezado generado
Entonces el skill advierte sobre la referencia inv�lida
  Y genera el encabezado con la referencia marcada como "[pendiente]" en lugar de fallar
```

### Requirement: Encabezados y formato de nodos
Cada nodo es un archivo markdown con frontmatter YAML y un encabezado siguiendo el siguiente template:
---
type: [ release | story | project | wiki ]
date: 2026-04-10
slug: FEAT-043-header-aggregation
title: "Infraestructura de captura de emails: Brevo + n8n + Nginx"
tags: [ spec, release ]
status: [ BACKLOG | IN-PROGRESS | COMPLETED ]
substatus: [ null | IN‑PROGRESS | READY ]
parent: [ slug del nodo padre, si aplica ]
related:
  - [ slug de nodo relacionado ]
sources:
  - jira: PROJ-123
  - repo: .claude/plans/slug.md
  - notion: email-strategy
---

### Requirement: Forma de invocaci�n del skill
El skill puede ser invocado para a�adir encabezados a un solo archivo (nombre de archivo o con ruta relativa o absoluta) o a todos los archivos de un directorio (ruta relativa o absoluta).

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-09-docs-and-wiki-builders.md
Feature origen: FEAT-043 � Encabezado de archivos spec con metadata de estado
Dependencias declaradas: FEAT-008
Los campos estandarizados deben ser compatibles con el patr�n LLM Wiki para que los LLMs puedan leer el �ndice primero sin procesar el contenido completo.
