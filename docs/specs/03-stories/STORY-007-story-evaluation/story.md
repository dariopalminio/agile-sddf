---
type: story
id: STORY-007
kind: feat
slug: STORY-007-story-evaluation
title: "story-evaluation Ã³ EvaluaciÃ³n FINVEST de historias"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-01-features-spec-builder
---

<!-- Referencias -->
[[EPIC-01-features-spec-builder]]

# Historia de Usuario

## ?? Historia: story-evaluation Ã³ EvaluaciÃ³n FINVEST de historias

**Como** desarrollador o PM que ha redactado una historia de usuario
**Quiero** ejecutar el skill `story-evaluation` sobre esa historia para obtener una evaluaciÃ³n de calidad
**Para** recibir un score Likert 1Ã³5 por cada dimensiÃ³n FINVEST, una decisiÃ³n accionable (APROBADA / REFINAR / RECHAZAR) y recomendaciones concretas para mejorarla

## ? Criterios de aceptaciÃ³n

### Escenario principal / EvaluaciÃ³n exitosa de historia aprobada
```gherkin
Dado que existe "docs/specs/stories/story-recuperar-contrasena.md" con Como/Quiero/Para y dos escenarios Gherkin bien definidos
Cuando el desarrollador ejecuta el skill "story-evaluation" sobre ese archivo
Entonces el skill muestra el score por dimensiÃ³n (F, I, N, V, E, S, T) con escala 1-5
  Y muestra un score global ponderado
  Y muestra la decisiÃ³n "APROBADA" con sugerencias de mejora opcionales
```

### Escenario alternativo / error Ã³ Historia con formato incorrecto
```gherkin
Dado que el archivo indicado no contiene la secciÃ³n Como/Quiero/Para
Cuando el skill evalÃºa la dimensiÃ³n F (Formato)
Entonces la dimensiÃ³n F recibe score 1
  Y la decisiÃ³n es "RECHAZAR" con indicaciÃ³n de secciones faltantes
```

### Requerimiento: finvest-evaluation-report.md como output
El skill genera un archivo finvest-evaluation-report.md en el mismo directorio de la historia. Si el archivo ya existe, sobreescribirlo (la evaluaciÃ³n mÃ¡s reciente siempre reemplaza la anterior).

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automÃ³ticamente desde el release: release-01-features-spec-builder.md
Feature origen: STORY-007 Ã³ story-evaluation (antes story-finvest-evaluation)
