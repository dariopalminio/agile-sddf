---
alwaysApply: false
type: story
id: STORY-068
kind: feat
slug: dod-plan-en-story-analyze
title: "DoD PLAN en story-analyze"
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

# ðŸ“– Historia: DoD PLAN en story-analyze

**Como** practitioner SDD que usa el pipeline de historias  
**Quiero** que `/story-analyze` lea la secciÃ³n fr la fase "PLAN" de `$SPECS_BASE/policies/dod-story.md` y valide que los artefactos cumplen esos criterios  
**Para** no avanzar una historia a `READY-FOR-IMPLEMENT` cuando los artefactos de planning no cumplen el estÃ¡ndar de calidad de la fase

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ story-analyze valida criterios DoD PLAN y los reporta en analyze.md
```gherkin
Dado una historia en estado PLANNING/IN-PROGRESS
  Y los artefactos story.md, design.md y tasks.md presentes en el directorio
  Y el archivo $SPECS_BASE/policies/dod-story.md existe con secciÃ³n "PLAN"
Cuando ejecuto /story-analyze STORY-NNN
Entonces analyze.md incluye una secciÃ³n "Cumplimiento DoD â€” Fase PLAN"
  Y esa secciÃ³n contiene una tabla con cada criterio DoD y su estado âœ“ o âŒ
  Y si todos los criterios estÃ¡n cumplidos, story.md avanza a READY-FOR-IMPLEMENT/DONE
```

### Escenario alternativo / error â€“ criterios DoD PLAN no cumplidos bloquean la transiciÃ³n
```gherkin
Dado que story-analyze detecta uno o mÃ¡s criterios DoD PLAN con severidad ERROR no cumplidos
Cuando story-analyze completa el anÃ¡lisis en el Paso 6
Entonces story.md NO se actualiza a READY-FOR-IMPLEMENT
  Pero analyze.md se guarda con los criterios fallidos documentados
  Y el resumen final muestra los criterios DoD pendientes de cumplir
```

### Escenario alternativo / error â€“ archivo DoD no encontrado o secciÃ³n ausente
```gherkin
Dado que $SPECS_BASE/policies/dod-story.md no existe
  O el archivo existe pero no contiene la secciÃ³n "PLAN"
Cuando ejecuto /story-analyze STORY-NNN
Entonces el skill emite una advertencia âš ï¸ indicando que el DoD no fue encontrado
  Y continÃºa la ejecuciÃ³n sin validar criterios DoD
  Pero no bloquea ni genera error fatal
```

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos.

## âš™ï¸ Criterios no funcionales

* Lectura en runtime: el skill lee la secciÃ³n DoD del archivo real en cada ejecuciÃ³n; si el contenido del DoD cambia, el skill se adapta sin modificar su cÃ³digo
* DegradaciÃ³n elegante: ausencia del archivo DoD o de la secciÃ³n PLAN es `âš ï¸ WARNING`, no `âŒ ERROR` fatal

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-13-quality-gates-con-dod-en-story-workflow  
Feature origen: STORY-068 â€” DoD PLAN en story-analyze

**UbicaciÃ³n de los cambios en el skill:**
- Sub-paso `1g` en Paso 1: localizar y leer `$SPECS_BASE/policies/dod-story.md`, extraer secciÃ³n "PLAN"
- CorrelaciÃ³n 5 en Paso 6: validar cada criterio DoD contra evidencia en story.md, design.md, tasks.md
- Paso 8: incluir secciÃ³n "Cumplimiento DoD â€” Fase PLAN" en analyze.md
- Paso 9: considerar DoD-ERRORs como bloqueantes para la transiciÃ³n a READY-FOR-IMPLEMENT
- Paso 10: mostrar lÃ­nea `DoD PLAN: N/Total criterios âœ“` en el resumen interactivo
