---
alwaysApply: false
---
**Título**: Encabezado de archivos spec con metadata de estado
**Versión**: 1.0
**Estado**: Doing
**Fecha**: 2026-04-25
**FINVEST Score:** —
**FINVEST Decisión:** —
---

# Historia de Usuario

## 📖 Historia: Encabezado de archivos spec con metadata de estado

**Como** tech lead o PM que gestiona múltiples artefactos de especificación en un proyecto SDDF
**Quiero** que cada archivo de spec tenga un encabezado YAML estandarizado con campos de estado y trazabilidad
**Para** poder navegar y enlazar nodos de documentación de forma consistente y rastrear el estado de cada artefacto sin abrir el contenido completo

## ✅ Criterios de aceptación

### Escenario principal – Encabezado YAML añadido a un archivo de spec
```gherkin
Dado que existe un archivo de especificación (ej. project-intent.md) sin encabezado YAML
Cuando el skill añade el encabezado estandarizado al archivo
Entonces el archivo comienza con un bloque YAML frontmatter con los campos definidos (título, versión, estado, fecha, y campos de trazabilidad)
  Y el contenido existente del archivo se preserva intacto después del bloque YAML
  Y el campo "estado" tiene un valor válido del conjunto definido (ej. Draft, Doing, Done)
```

### Escenario principal – Encabezado aplicado a todos los tipos de artefactos soportados
```gherkin
Dado que el proyecto tiene archivos de tipo project-intent.md, requirement-spec.md, project-plan.md, release*.md y story*.md
Cuando se solicita añadir encabezados a todos los artefactos
Entonces cada archivo recibe su encabezado YAML con los campos estandarizados
  Y los campos de linkeo entre nodos apuntan a los artefactos relacionados correctamente
```

### Escenario alternativo / error – Archivo ya tiene encabezado YAML
```gherkin
Dado que un archivo de spec ya tiene un bloque YAML frontmatter al inicio
Cuando el skill intenta añadir el encabezado estandarizado
Entonces el skill detecta el encabezado existente e informa al usuario
  Pero no sobreescribe ni duplica el bloque existente sin confirmación
```

### Escenario alternativo / error – Campos de trazabilidad con referencia inválida
```gherkin
Dado que el encabezado incluye un campo de linkeo que apunta a un artefacto que no existe
Cuando se valida el encabezado generado
Entonces el skill advierte sobre la referencia inválida
  Y genera el encabezado con la referencia marcada como "[pendiente]" en lugar de fallar
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-09-docs-and-wiki-builders.md
Feature origen: FEAT-043 — Encabezado de archivos spec con metadata de estado
Dependencias declaradas: FEAT-008
Los campos estandarizados deben ser compatibles con el patrón LLM Wiki para que los LLMs puedan leer el índice primero sin procesar el contenido completo.
