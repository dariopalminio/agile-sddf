---
type: story
id: FEAT-000
slug: FEAT-000-missing-artifacts
title: "Ejemplo: Historia con artefactos faltantes"
status: IMPLEMENT
substatus: DONE
parent: EPIC-00-example
created: 2026-05-09
updated: 2026-05-09
---

# Historia: Ejemplo de precondición fallida

**Como** desarrollador
**Quiero** ejecutar story-code-review sin tener design.md ni implement-report.md
**Para** verificar que el skill detecta los faltantes y muestra un error claro

## ✅ Criterios de aceptación

### Escenario – Artefactos ausentes
```gherkin
Dado que falta "design.md" e "implement-report.md" en el directorio de la historia
Cuando ejecuto "/story-code-review FEAT-000"
Entonces el skill muestra el error con ambos faltantes listados
  Y detiene la ejecución sin generar ningún output parcial
```
