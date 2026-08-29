---
type: story
id: FEAT-010
slug: FEAT-010-gates-de-revision
title: "Gates de Revisión Humana entre fases del pipeline"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-02-project-spec-builder
---

<!-- Referencias -->
[[EPIC-02-project-spec-builder]]

# Historia de Usuario

## ?? Historia: Gates de Revisión Humana entre fases del pipeline

**Como** developer que usa el pipeline ProjectSpecFactory para especificar un proyecto
**Quiero** que el framework presente un resumen del documento generado y solicite mi confirmación antes de avanzar a la siguiente fase
**Para** mantener control sobre la calidad de cada artefacto y poder corregir antes de que el error se propague a las fases siguientes

## ? Criterios de aceptación

### Escenario principal – Gate de revisión al finalizar project-begin
```gherkin
Dado que el agente ha completado la entrevista y generado el borrador de "project-intent.md"
Cuando el agente presenta el resumen del documento al desarrollador
Entonces el agente solicita confirmación: "¿Está correcto este documento? (s/n)"
  Y solo avanza el Estado a Ready si el desarrollador confirma
  Y si el desarrollador responde no, el agente propone ajustes antes de finalizar
```

### Escenario alternativo / error – Developer rechaza el documento generado
```gherkin
Dado que el agente presenta el resumen de "project-intent.md"
Cuando el desarrollador responde "no" a la confirmación
Entonces el agente solicita las correcciones necesarias
  Y regenera las secciones indicadas antes de volver a presentar el documento
  Pero no avanza el Estado a Ready hasta recibir confirmación explícita
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-02-project-spec-builder.md
Feature origen: FEAT-010 — Gates de Revisión Humana
