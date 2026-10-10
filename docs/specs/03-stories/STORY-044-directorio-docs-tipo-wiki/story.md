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

# 📖 Historia: Directorio docs tipo wiki

**Como** desarrollador o PM que mantiene la documentación de un proyecto usando SDDF
**Quiero** un SKILL para reorganizar el directorio `docs/` como una wiki navegable con un índice central y wikilinks internos
**Para** que tanto el equipo como los LLMs (Claude, Copilot, Opencode) puedan acceder a la documentación de forma eficiente sin leer todos los archivos a la vez y mantener un esquema común a todos.

## ✅ Criterios de aceptación

### Escenario principal – Estructura wiki creada con índice navegable
```gherkin
Dado que el proyecto tiene artefactos de desarrollo en docs/ (specs, releases, stories)
Cuando el skill reorganiza el directorio docs/ en estructura wiki
Entonces existe un archivo docs/index.md que enlaza a todos los nodos principales de la wiki
  Y existe un subdirectorio docs/specs/ con los artefactos de especificación
  Y existe un subdirectorio docs/wiki/ para artículos de conocimiento profundo
  Y los links internos entre nodos usan la sintaxis [[slug]] (wikilinks)
```

### Escenario principal – LLM usa el índice como punto de entrada
```gherkin
Dado que el directorio docs/ tiene la estructura wiki con un docs/index.md
Cuando un LLM necesita información del proyecto
Entonces puede leer solo docs/index.md para obtener el mapa de la documentación
  Y decide qué nodos abrir basándose en el índice sin leer todos los archivos
  Y la recuperación de información es O(índice) y no O(todos-los-archivos)
```

### Escenario alternativo / error – El directorio docs/ ya existe con estructura no wiki
```gherkin
Dado que docs/ ya existe pero no sigue la estructura wiki (sin index.md, sin subdirectorios estandarizados)
Cuando el skill intenta reorganizar la estructura
Entonces el skill muestra un resumen de los cambios propuestos antes de ejecutarlos
  Y solicita confirmación del usuario antes de mover o renombrar archivos existentes
  Pero no elimina ningún archivo existente sin confirmación explícita
```

### Escenario alternativo / error – Wikilinks apuntan a nodos inexistentes
```gherkin
Dado que el índice generado contiene wikilinks a nodos que aún no existen
Cuando se valida la integridad del índice
Entonces el skill marca los wikilinks rotos con un indicador visual (ej. [[slug]] → ⚠️ nodo pendiente)
  Y genera el índice de todas formas sin bloquear la operación
```

### Requirement: Links internos con wikilinks
Los links internos usan la sintaxis `[[slug]]` (wikilinks). 

### Requirement: Índice como mapa de la documentación
El índice (index.md) es el cursor principal para los LLMs: se lee primero en cada operación para decidir qué nodos abrir, haciendo la recuperación O(índice) y no O(todos-los-archivos).

### Requirement: Manejo de archivos existentes
El skill no elimina existentes y propone moverlos si es necesario con confirmación explícita. Si el directorio docs/ ya existe con una estructura no wiki, el skill muestra un resumen de los cambios propuestos antes de ejecutarlos y solicita confirmación del usuario antes de mover o renombrar archivos existentes.

### Requirement: Estructura de directorios
La estructura propuesta es:
```
docs/
+-- index.md                         # Mapa principal de la wiki (índice)
+-- specs/                           # Artefactos de especificación SDDF
│   +-- project/                     # Nivel L3 (Project)
│   +-- releases/                    # Nivel L2 (Release)
│   +-- stories/                     # Nivel L1 (User Stories / Feats)
│   +-- templates/                   # Plantillas para nuevos nodos (opcional)
+-- wiki/
    +-- constitution/              # Reglas y principios fundamentales del proyecto
    │   +-- index.md               # (opcional) resumen de la constitución
    │   +-- constitution.md        # (archivo único) estilo speckit
    │   +-- amendments.md          # (opcional) histórico de cambios
    +-- architecture/              # Decisiones técnicas, diagramas, stack
    │   +-- c4/                    # Diagramas C4 (context, containers, components, code)
    │   +-- sequence/              # Diagramas de secuencia
    │   +-- tech-stack.md          # Stack de desarrollo (lenguajes, frameworks, herramientas)
    │   +-- principles.md          # Principios de desarrollo (SOLID, DRY, convenciones, etc.)
    +-- process/                   # Reglas y guías del proceso de desarrollo
    │   +-- dod-story.md  # DoD (opcional)
    │   +-- definition-of-ready.md # DoR (opcional)
    │   +-- branching-strategy.md  # (si quieres documentar la estrategia Git)
    │   +-- code-review-guidelines.md
    +-- ux/                        # Decisiones y guías de UX/UI
    +-- guides/             # artículos y guias teóricas (como metodologías ágiles, mejores prácticas, etc.)
    │   +-- extreme-agile.md
    │
    +-- how-to/                    # Guías prácticas (como docker-dev-container)
        +-- setup-dev-container.md
```

### Requirement: Normalizar encabezados frontmatter
Añadir el bloque frontmatter como placeholder en la cabecera de cada template (project-intent-template.md, etc.). 
El skill lo rellena como parte del proceso normal de "completar el template".
Ventajas: el template define el contrato completo incluyendo metadatos.
Solo se modifican los templates (menos archivos, cambio más localizado)
El frontmatter queda visible en el template — fácil de entender y mantener
No hay que añadir lógica en SKILL.md — el skill ya "rellena el template" por naturaleza
Si el schema cambia, solo se actualiza el template correspondiente
La solución es un enfoque mixto — Opción B para los 7 con template + Opción A para los 3 con agentes.

## ⚙️ Criterios no funcionales

* Trazabilidad: cada nodo debe tener un slug único y metadata clara para su identificación
* Compatibilidad: la estructura wiki debe coexistir con los archivos existentes sin pérdida de información ni eliminación de archivos sin confirmación explícita.

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-09-docs-and-wiki-builders.md
Feature origen: STORY-044 — Directorio docs tipo wiki
Dependencias declaradas: STORY-001, STORY-003, STORY-004
Patrón de referencia: LLM Wiki - Karpathy. El índice (index.md) actúa como cursor principal para los LLMs: se lee primero en cada operación para decidir qué nodos abrir, haciendo la recuperación O(índice) y no O(todos-los-archivos).
Cada nodo documento es un archivo markdown con frontmatter YAML. La fuente de verdad son archivos dentro del mismo repositorio.
Visualización del grafo con Foam: Para ver el grafo visual de tu wiki, instalá la extensión Foam en Visual Studio Code.
Este skill implementa el patrón LLM Wiki - Karpathy: una base de conocimiento persistente y auto-compilada donde el LLM es tanto el escritor (el humano también escribe) como el lector. La clave está en que Claude lee el índice primero en cada operación, haciendo que la recuperación sea O(índice) y no O(todos-los-archivos). Las referencias cruzadas son bidireccionales y se verifican en cada ingest.
Ventajas para LLMs (Claude, Copilot, etc.)
El índice (index.md) es el primer archivo que el LLM debe leer (se lo puedes pasar directamente o configurar como entrada inicial). El LLM obtiene el mapa completo sin tener que escanear todo el docs/.
Los wikilinks `[[slug]]` permiten al LLM decidir qué nodos abrir a continuación (similar a cómo navega un humano).
Cada nodo tiene metadatos estructurados (frontmatter) que el LLM puede interpretar fácilmente para filtrar por tipo, estado, etc.
La separación specs/ (artefactos SDDF) y wiki/ (conocimiento) evita mezclar especificaciones operativas con documentación teórica, pero ambas son igualmente accesibles.
