---
type: story
id: FEAT-024
slug: FEAT-024-modo-incremental-update
title: "Modo incremental � Flag --update para reverse-engineering"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: Modo incremental � Flag --update para reverse-engineering

**Como** developer que ya ejecut� ingenier�a inversa y tiene un `requirement-spec.md` con secciones marcadas como pendientes
**Quiero** usar el flag `--update` con el skill `reverse-engineering` para re-analizar �nicamente las secciones marcadas como `<!-- PENDING MANUAL REVIEW -->`
**Para** completar el documento de requisitos de forma incremental sin volver a analizar las secciones ya correctas

## ? Criterios de aceptaci�n

### Escenario principal � Re-an�lisis incremental de secciones pendientes
```gherkin
Dado que existe "docs/specs/projects/project.md" con tres secciones marcadas "<!-- PENDING MANUAL REVIEW -->"
Cuando el desarrollador ejecuta "/reverse-engineering --update"
Entonces el skill identifica las secciones marcadas y lanza el an�lisis solo sobre esas partes
  Y actualiza �nicamente las secciones pendientes en el documento existente
  Y preserva las secciones que ya estaban completas sin modificarlas
```

### Escenario alternativo / error � No hay secciones pendientes
```gherkin
Dado que "docs/specs/projects/project.md" no contiene ninguna secci�n "<!-- PENDING MANUAL REVIEW -->"
Cuando el desarrollador ejecuta "/reverse-engineering --update"
Entonces el skill informa "No se encontraron secciones pendientes. El documento ya est� completo."
  Pero no modifica el documento ni lanza an�lisis adicionales
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-03-reverse-engineering.md
Feature origen: FEAT-024 � Modo incremental (--update)
