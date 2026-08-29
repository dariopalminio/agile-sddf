---
alwaysApply: false
type: story
id: FEAT-068
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
**FINVEST Score:** —
**FINVEST Decisión:** —
---
<!-- Referencias -->
[[EPIC-13-quality-gates-con-dod-en-story-workflow]]

# 📖 Historia: DoD PLAN en story-analyze

**Como** practitioner SDD que usa el pipeline de historias  
**Quiero** que `/story-analyze` lea la sección fr la fase "PLAN" de `$SPECS_BASE/policies/definition-of-done-story.md` y valide que los artefactos cumplen esos criterios  
**Para** no avanzar una historia a `READY-FOR-IMPLEMENT` cuando los artefactos de planning no cumplen el estándar de calidad de la fase

## ✅ Criterios de aceptación

### Escenario principal – story-analyze valida criterios DoD PLAN y los reporta en analyze.md
```gherkin
Dado una historia en estado PLANNING/IN-PROGRESS
  Y los artefactos story.md, design.md y tasks.md presentes en el directorio
  Y el archivo $SPECS_BASE/policies/definition-of-done-story.md existe con sección "PLAN"
Cuando ejecuto /story-analyze FEAT-NNN
Entonces analyze.md incluye una sección "Cumplimiento DoD — Fase PLAN"
  Y esa sección contiene una tabla con cada criterio DoD y su estado ✓ o ❌
  Y si todos los criterios están cumplidos, story.md avanza a READY-FOR-IMPLEMENT/DONE
```

### Escenario alternativo / error – criterios DoD PLAN no cumplidos bloquean la transición
```gherkin
Dado que story-analyze detecta uno o más criterios DoD PLAN con severidad ERROR no cumplidos
Cuando story-analyze completa el análisis en el Paso 6
Entonces story.md NO se actualiza a READY-FOR-IMPLEMENT
  Pero analyze.md se guarda con los criterios fallidos documentados
  Y el resumen final muestra los criterios DoD pendientes de cumplir
```

### Escenario alternativo / error – archivo DoD no encontrado o sección ausente
```gherkin
Dado que $SPECS_BASE/policies/definition-of-done-story.md no existe
  O el archivo existe pero no contiene la sección "PLAN"
Cuando ejecuto /story-analyze FEAT-NNN
Entonces el skill emite una advertencia ⚠️ indicando que el DoD no fue encontrado
  Y continúa la ejecución sin validar criterios DoD
  Pero no bloquea ni genera error fatal
```

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos.

## ⚙️ Criterios no funcionales

* Lectura en runtime: el skill lee la sección DoD del archivo real en cada ejecución; si el contenido del DoD cambia, el skill se adapta sin modificar su código
* Degradación elegante: ausencia del archivo DoD o de la sección PLAN es `⚠️ WARNING`, no `❌ ERROR` fatal

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-13-quality-gates-con-dod-en-story-workflow  
Feature origen: FEAT-068 — DoD PLAN en story-analyze

**Ubicación de los cambios en el skill:**
- Sub-paso `1g` en Paso 1: localizar y leer `$SPECS_BASE/policies/definition-of-done-story.md`, extraer sección "PLAN"
- Correlación 5 en Paso 6: validar cada criterio DoD contra evidencia en story.md, design.md, tasks.md
- Paso 8: incluir sección "Cumplimiento DoD — Fase PLAN" en analyze.md
- Paso 9: considerar DoD-ERRORs como bloqueantes para la transición a READY-FOR-IMPLEMENT
- Paso 10: mostrar línea `DoD PLAN: N/Total criterios ✓` en el resumen interactivo
