---
alwaysApply: false
---
**Título**: Directorio docs tipo wiki
**Versión**: 1.0
**Estado**: Doing
**Fecha**: 2026-04-25
**FINVEST Score:** —
**FINVEST Decisión:** —
---

# Historia de Usuario

## 📖 Historia: Directorio docs tipo wiki

**Como** desarrollador o PM que mantiene la documentación de un proyecto usando SDDF
**Quiero** reorganizar el directorio `docs/` como una wiki navegable con un índice central y wikilinks internos
**Para** que tanto el equipo como los LLMs (Claude, Copilot, Opencode) puedan acceder a la documentación de forma eficiente sin leer todos los archivos a la vez

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

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-09-docs-and-wiki-builders.md
Feature origen: FEAT-044 — Directorio docs tipo wiki
Dependencias declaradas: FEAT-001, FEAT-003, FEAT-004
Patrón de referencia: LLM Wiki - Karpathy. El índice (index.md) actúa como cursor principal para los LLMs: se lee primero en cada operación para decidir qué nodos abrir, haciendo la recuperación O(índice) y no O(todos-los-archivos).
Cada nodo documento es un archivo markdown con frontmatter YAML. La fuente de verdad son archivos dentro del mismo repositorio.
