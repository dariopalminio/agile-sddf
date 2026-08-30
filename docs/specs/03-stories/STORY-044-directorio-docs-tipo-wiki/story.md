---
type: story
id: STORY-044
kind: feat
slug: STORY-044-directorio-docs-tipo-wiki
title: "Directorio docs tipo wiki"
date: 2026-04-27
status: COMPLETED
substatus: READY
parent: EPIC-09-docs-and-wiki-builders
---

<!-- Referencias -->
[[EPIC-09-docs-and-wiki-builders]]

# ?? Historia: Directorio docs tipo wiki

**Como** desarrollador o PM que mantiene la documentaci�n de un proyecto usando SDDF
**Quiero** un SKILL para reorganizar el directorio `docs/` como una wiki navegable con un �ndice central y wikilinks internos
**Para** que tanto el equipo como los LLMs (Claude, Copilot, Opencode) puedan acceder a la documentaci�n de forma eficiente sin leer todos los archivos a la vez y mantener un esquema com�n a todos.

## ? Criterios de aceptaci�n

### Escenario principal � Estructura wiki creada con �ndice navegable
```gherkin
Dado que el proyecto tiene artefactos de desarrollo en docs/ (specs, releases, stories)
Cuando el skill reorganiza el directorio docs/ en estructura wiki
Entonces existe un archivo docs/index.md que enlaza a todos los nodos principales de la wiki
  Y existe un subdirectorio docs/specs/ con los artefactos de especificaci�n
  Y existe un subdirectorio docs/wiki/ para art�culos de conocimiento profundo
  Y los links internos entre nodos usan la sintaxis [[slug]] (wikilinks)
```

### Escenario principal � LLM usa el �ndice como punto de entrada
```gherkin
Dado que el directorio docs/ tiene la estructura wiki con un docs/index.md
Cuando un LLM necesita informaci�n del proyecto
Entonces puede leer solo docs/index.md para obtener el mapa de la documentaci�n
  Y decide qu� nodos abrir bas�ndose en el �ndice sin leer todos los archivos
  Y la recuperaci�n de informaci�n es O(�ndice) y no O(todos-los-archivos)
```

### Escenario alternativo / error � El directorio docs/ ya existe con estructura no wiki
```gherkin
Dado que docs/ ya existe pero no sigue la estructura wiki (sin index.md, sin subdirectorios estandarizados)
Cuando el skill intenta reorganizar la estructura
Entonces el skill muestra un resumen de los cambios propuestos antes de ejecutarlos
  Y solicita confirmaci�n del usuario antes de mover o renombrar archivos existentes
  Pero no elimina ning�n archivo existente sin confirmaci�n expl�cita
```

### Escenario alternativo / error � Wikilinks apuntan a nodos inexistentes
```gherkin
Dado que el �ndice generado contiene wikilinks a nodos que a�n no existen
Cuando se valida la integridad del �ndice
Entonces el skill marca los wikilinks rotos con un indicador visual (ej. [[slug]] ? ?? nodo pendiente)
  Y genera el �ndice de todas formas sin bloquear la operaci�n
```

### Requirement: Links internos con wikilinks
Los links internos usan la sintaxis [[slug]] (wikilinks). 

### Requirement: �ndice como mapa de la documentaci�n
El �ndice (index.md) es el cursor principal para los LLMs: se lee primero en cada operaci�n para decidir qu� nodos abrir, haciendo la recuperaci�n O(�ndice) y no O(todos-los-archivos).

### Requirement: Manejo de archivos existentes
El skill no elimina existentes y propone moverlos si es necesario con confirmaci�n expl�cita. Si el directorio docs/ ya existe con una estructura no wiki, el skill muestra un resumen de los cambios propuestos antes de ejecutarlos y solicita confirmaci�n del usuario antes de mover o renombrar archivos existentes.

### Requirement: Estructura de directorios
La estructura propuesta es:
```
docs/
+-- index.md                         # Mapa principal de la wiki (�ndice)
+-- specs/                           # Artefactos de especificaci�n SDDF
�   +-- project/                     # Nivel L3 (Project)
�   +-- releases/                    # Nivel L2 (Release)
�   +-- stories/                     # Nivel L1 (User Stories / Feats)
�   +-- templates/                   # Plantillas para nuevos nodos (opcional)
+-- wiki/
    +-- constitution/              # Reglas y principios fundamentales del proyecto
    �   +-- index.md               # (opcional) resumen de la constituci�n
    �   +-- constitution.md        # (archivo �nico) estilo speckit
    �   +-- amendments.md          # (opcional) hist�rico de cambios
    +-- architecture/              # Decisiones t�cnicas, diagramas, stack
    �   +-- c4/                    # Diagramas C4 (context, containers, components, code)
    �   +-- sequence/              # Diagramas de secuencia
    �   +-- tech-stack.md          # Stack de desarrollo (lenguajes, frameworks, herramientas)
    �   +-- principles.md          # Principios de desarrollo (SOLID, DRY, convenciones, etc.)
    +-- process/                   # Reglas y gu�as del proceso de desarrollo
    �   +-- definition-of-done-story.md  # DoD (opcional)
    �   +-- definition-of-ready.md # DoR (opcional)
    �   +-- branching-strategy.md  # (si quieres documentar la estrategia Git)
    �   +-- code-review-guidelines.md
    +-- ux/                        # Decisiones y gu�as de UX/UI
    +-- guides/             # art�culos y guias te�ricas (como metodolog�as �giles, mejores pr�cticas, etc.)
    �   +-- extreme-agile.md
    �
    +-- how-to/                    # Gu�as pr�cticas (como docker-dev-container)
        +-- setup-dev-container.md
```

### Requirement: Normalizar encabezados frontmatter
A�adir el bloque frontmatter como placeholder en la cabecera de cada template (project-intent-template.md, etc.). 
El skill lo rellena como parte del proceso normal de "completar el template".
Ventajas: el template define el contrato completo incluyendo metadatos.
Solo se modifican los templates (menos archivos, cambio m�s localizado)
El frontmatter queda visible en el template � f�cil de entender y mantener
No hay que a�adir l�gica en SKILL.md � el skill ya "rellena el template" por naturaleza
Si el schema cambia, solo se actualiza el template correspondiente
La soluci�n es un enfoque mixto � Opci�n B para los 7 con template + Opci�n A para los 3 con agentes.

## ?? Criterios no funcionales

* Trazabilidad: cada nodo debe tener un slug �nico y metadata clara para su identificaci�n
* Compatibilidad: la estructura wiki debe coexistir con los archivos existentes sin p�rdida de informaci�n ni eliminaci�n de archivos sin confirmaci�n expl�cita.

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-09-docs-and-wiki-builders.md
Feature origen: STORY-044 � Directorio docs tipo wiki
Dependencias declaradas: STORY-001, STORY-003, STORY-004
Patr�n de referencia: LLM Wiki - Karpathy. El �ndice (index.md) act�a como cursor principal para los LLMs: se lee primero en cada operaci�n para decidir qu� nodos abrir, haciendo la recuperaci�n O(�ndice) y no O(todos-los-archivos).
Cada nodo documento es un archivo markdown con frontmatter YAML. La fuente de verdad son archivos dentro del mismo repositorio.
Visualizaci�n del grafo con Foam: Para ver el grafo visual de tu wiki, instal� la extensi�n Foam en Visual Studio Code.
Este skill implementa el patr�n LLM Wiki - Karpathy: una base de conocimiento persistente y auto-compilada donde el LLM es tanto el escritor (el humano tambi�n escribe) como el lector. La clave est� en que Claude lee el �ndice primero en cada operaci�n, haciendo que la recuperaci�n sea O(�ndice) y no O(todos-los-archivos). Las referencias cruzadas son bidireccionales y se verifican en cada ingest.
Ventajas para LLMs (Claude, Copilot, etc.)
El �ndice (index.md) es el primer archivo que el LLM debe leer (se lo puedes pasar directamente o configurar como entrada inicial). El LLM obtiene el mapa completo sin tener que escanear todo el docs/.
Los wikilinks [[slug]] permiten al LLM decidir qu� nodos abrir a continuaci�n (similar a c�mo navega un humano).
Cada nodo tiene metadatos estructurados (frontmatter) que el LLM puede interpretar f�cilmente para filtrar por tipo, estado, etc.
La separaci�n specs/ (artefactos SDDF) y wiki/ (conocimiento) evita mezclar especificaciones operativas con documentaci�n te�rica, pero ambas son igualmente accesibles.
