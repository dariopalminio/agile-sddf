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
<!-- Referencias -->
[[quality-gates-con-dod-en-story-workflow]]

# ðŸ“– Historia: DoD IMPLEMENT en story-implement

**Como** desarrollador que usa `/story-implement` para generar cÃ³digo tarea por tarea  
**Quiero** que el skill lea la secciÃ³n "IMPLEMENT" de `$SPECS_BASE/policies/dod-story.md` y valide que la implementaciÃ³n cumple esos criterios antes de cerrar  
**Para** garantizar que el cÃ³digo generado cumple los estÃ¡ndares mÃ­nimos de la fase antes de avanzar a revisiÃ³n

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ story-implement valida DoD IMPLEMENT y lo incluye en el reporte
```gherkin
Dado una historia con todas las tareas completadas en story-implement
  Y el archivo $SPECS_BASE/policies/dod-story.md existe con secciÃ³n "IMPLEMENT"
Cuando story-implement ejecuta el Paso 4 (generar reporte final)
Entonces implement-report.md incluye una secciÃ³n "Cumplimiento DoD â€” Fase IMPLEMENT"
  Y esa secciÃ³n contiene una tabla con cada criterio y su estado âœ“ o âŒ
  Y si no hay DoD-ERRORs, story.md avanza a READY-FOR-CODE-REVIEW/DONE
```

### Escenario alternativo / error â€“ DoD-ERRORs bloquean transiciÃ³n a READY-FOR-CODE-REVIEW
```gherkin
Dado que story-implement detecta criterios DoD IMPLEMENT con severidad ERROR no cumplidos
Cuando story-implement evalÃºa el DoD en el sub-paso 4g (antes de actualizar el estado)
Entonces story.md permanece en IMPLEMENT/IN-PROGRESS
  Y implement-report.md documenta los criterios DoD fallidos con evidencia esperada
  Y el resumen final muestra los criterios DoD pendientes
```

### Escenario alternativo / error â€“ archivo DoD no encontrado o secciÃ³n ausente
```gherkin
Dado que $SPECS_BASE/policies/dod-story.md no existe
  O el archivo existe pero no contiene la secciÃ³n "IMPLEMENT"
Cuando story-implement carga contexto en el sub-paso 2f
Entonces el skill emite una advertencia âš ï¸ indicando que el DoD no fue encontrado
  Y continÃºa la implementaciÃ³n sin validar criterios DoD
  Pero no bloquea el pipeline ni genera error fatal
```

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos.

## âš™ï¸ Criterios no funcionales

* Lectura en runtime: el skill lee la secciÃ³n DoD del archivo real en cada ejecuciÃ³n
* DegradaciÃ³n elegante: ausencia del archivo DoD o de la secciÃ³n IMPLEMENT es `âš ï¸ WARNING`, no `âŒ ERROR` fatal
* No interfiere con el ciclo TDD del Paso 3: la validaciÃ³n DoD ocurre en el Paso 4, despuÃ©s de implementar todas las tareas

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-13-quality-gates-con-dod-en-story-workflow  
Feature origen: STORY-069 â€” DoD IMPLEMENT en story-implement

**UbicaciÃ³n de los cambios en el skill:**
- Sub-paso `2f` en Paso 2: leer `$SPECS_BASE/policies/dod-story.md`, extraer secciÃ³n "IMPLEMENT", registrar como `$DOD_IMPLEMENT_CRITERIA`
- Sub-paso `4g` en Paso 4 (antes de 4b): validar cada criterio DoD contra evidencia en implement-report.md y cÃ³digo generado
- Paso 4a: incluir secciÃ³n "Cumplimiento DoD â€” Fase IMPLEMENT" en implement-report.md
- Paso 4b: condicionar transiciÃ³n a READY-FOR-CODE-REVIEW/DONE al resultado del sub-paso 4g
- Resumen final: mostrar lÃ­nea `DoD IMPLEMENT: N/Total criterios âœ“`
