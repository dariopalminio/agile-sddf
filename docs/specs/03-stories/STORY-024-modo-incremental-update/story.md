---
type: story
id: STORY-024
kind: feat
slug: STORY-024-modo-incremental-update
title: "Modo incremental ï¿½ Flag --update para reverse-engineering"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: Modo incremental ï¿½ Flag --update para reverse-engineering

**Como** developer que ya ejecutï¿½ ingenierï¿½a inversa y tiene un `requirement-spec.md` con secciones marcadas como pendientes
**Quiero** usar el flag `--update` con el skill `reverse-engineering` para re-analizar ï¿½nicamente las secciones marcadas como `<!-- PENDING MANUAL REVIEW -->`
**Para** completar el documento de requisitos de forma incremental sin volver a analizar las secciones ya correctas

## ? Criterios de aceptaciï¿½n

### Escenario principal ï¿½ Re-anï¿½lisis incremental de secciones pendientes
```gherkin
Dado que existe "docs/specs/projects/project.md" con tres secciones marcadas "<!-- PENDING MANUAL REVIEW -->"
Cuando el desarrollador ejecuta "/reverse-engineering --update"
Entonces el skill identifica las secciones marcadas y lanza el anï¿½lisis solo sobre esas partes
  Y actualiza ï¿½nicamente las secciones pendientes en el documento existente
  Y preserva las secciones que ya estaban completas sin modificarlas
```

### Escenario alternativo / error ï¿½ No hay secciones pendientes
```gherkin
Dado que "docs/specs/projects/project.md" no contiene ninguna secciï¿½n "<!-- PENDING MANUAL REVIEW -->"
Cuando el desarrollador ejecuta "/reverse-engineering --update"
Entonces el skill informa "No se encontraron secciones pendientes. El documento ya estï¿½ completo."
  Pero no modifica el documento ni lanza anï¿½lisis adicionales
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automï¿½ticamente desde el release: release-03-reverse-engineering.md
Feature origen: STORY-024 ï¿½ Modo incremental (--update)
