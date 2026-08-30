---
alwaysApply: false
type: story
id: STORY-069
kind: feat
slug: dod-IMPLEMENT-en-story-implement
title: "DoD IMPLEMENT en story-implement"
status: COMPLETED
substatus: DONE
parent: EPIC-13-quality-gates-con-dod-en-story-workflow
created: 2026-05-13
updated: 2026-05-13
related:
  - EPIC-13-quality-gates-con-dod-en-story-workflow
---
**FINVEST Score:** —
**FINVEST Decisión:** —
---
<!-- Referencias -->
[[EPIC-13-quality-gates-con-dod-en-story-workflow]]

# 📖 Historia: DoD IMPLEMENT en story-implement

**Como** desarrollador que usa `/story-implement` para generar código tarea por tarea  
**Quiero** que el skill lea la sección "IMPLEMENT" de `$SPECS_BASE/policies/definition-of-done-story.md` y valide que la implementación cumple esos criterios antes de cerrar  
**Para** garantizar que el código generado cumple los estándares mínimos de la fase antes de avanzar a revisión

## ✅ Criterios de aceptación

### Escenario principal – story-implement valida DoD IMPLEMENT y lo incluye en el reporte
```gherkin
Dado una historia con todas las tareas completadas en story-implement
  Y el archivo $SPECS_BASE/policies/definition-of-done-story.md existe con sección "IMPLEMENT"
Cuando story-implement ejecuta el Paso 4 (generar reporte final)
Entonces implement-report.md incluye una sección "Cumplimiento DoD — Fase IMPLEMENT"
  Y esa sección contiene una tabla con cada criterio y su estado ✓ o ❌
  Y si no hay DoD-ERRORs, story.md avanza a READY-FOR-CODE-REVIEW/DONE
```

### Escenario alternativo / error – DoD-ERRORs bloquean transición a READY-FOR-CODE-REVIEW
```gherkin
Dado que story-implement detecta criterios DoD IMPLEMENT con severidad ERROR no cumplidos
Cuando story-implement evalúa el DoD en el sub-paso 4g (antes de actualizar el estado)
Entonces story.md permanece en IMPLEMENT/IN-PROGRESS
  Y implement-report.md documenta los criterios DoD fallidos con evidencia esperada
  Y el resumen final muestra los criterios DoD pendientes
```

### Escenario alternativo / error – archivo DoD no encontrado o sección ausente
```gherkin
Dado que $SPECS_BASE/policies/definition-of-done-story.md no existe
  O el archivo existe pero no contiene la sección "IMPLEMENT"
Cuando story-implement carga contexto en el sub-paso 2f
Entonces el skill emite una advertencia ⚠️ indicando que el DoD no fue encontrado
  Y continúa la implementación sin validar criterios DoD
  Pero no bloquea el pipeline ni genera error fatal
```

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos.

## ⚙️ Criterios no funcionales

* Lectura en runtime: el skill lee la sección DoD del archivo real en cada ejecución
* Degradación elegante: ausencia del archivo DoD o de la sección IMPLEMENT es `⚠️ WARNING`, no `❌ ERROR` fatal
* No interfiere con el ciclo TDD del Paso 3: la validación DoD ocurre en el Paso 4, después de implementar todas las tareas

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-13-quality-gates-con-dod-en-story-workflow  
Feature origen: STORY-069 — DoD IMPLEMENT en story-implement

**Ubicación de los cambios en el skill:**
- Sub-paso `2f` en Paso 2: leer `$SPECS_BASE/policies/definition-of-done-story.md`, extraer sección "IMPLEMENT", registrar como `$DOD_IMPLEMENT_CRITERIA`
- Sub-paso `4g` en Paso 4 (antes de 4b): validar cada criterio DoD contra evidencia en implement-report.md y código generado
- Paso 4a: incluir sección "Cumplimiento DoD — Fase IMPLEMENT" en implement-report.md
- Paso 4b: condicionar transición a READY-FOR-CODE-REVIEW/DONE al resultado del sub-paso 4g
- Resumen final: mostrar línea `DoD IMPLEMENT: N/Total criterios ✓`
