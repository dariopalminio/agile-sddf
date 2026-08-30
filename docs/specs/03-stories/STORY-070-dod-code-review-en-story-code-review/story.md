---
alwaysApply: false
type: story
id: STORY-070
kind: feat
slug: dod-code-review-en-story-code-review
title: "DoD CODE-REVIEW en story-code-review"
status: READY-FOR-VERIFY
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

# 📖 Historia: DoD CODE-REVIEW en story-code-review

**Como** tech lead o revisor que usa `/story-code-review` como quality gate  
**Quiero** que el skill lea la sección "CODE-REVIEW" de `$SPECS_BASE/policies/definition-of-done-story.md` y valide esos criterios antes de determinar el `review-status` final  
**Para** que la decisión de `approved`/`needs-changes` considere también el cumplimiento del DoD y no solo los hallazgos de los agentes revisores

## ✅ Criterios de aceptación

### Escenario principal – DoD CODE-REVIEW incluido en la decisión final de review-status
```gherkin
Dado una historia en estado READY-FOR-CODE-REVIEW/DONE
  Y el archivo $SPECS_BASE/policies/definition-of-done-story.md existe con sección "CODE-REVIEW"
  Y los tres agentes revisores retornan max-severity LOW o ninguna (approved)
Cuando story-code-review ejecuta el Paso 4c.1 (validación DoD)
  Y hay criterios DoD CODE-REVIEW no cumplidos con severidad HIGH o MEDIUM
Entonces review-status se actualiza a needs-changes
  Y code-review-report.md incluye sección "Cumplimiento DoD — Fase CODE-REVIEW"
  Y fix-directives.md contiene los criterios DoD no cumplidos como hallazgos con Dimensión: DoD-CODE-REVIEW
```

### Escenario alternativo / error – DoD CODE-REVIEW cumplido, aprobado pasa sin cambios
```gherkin
Dado que los tres agentes retornan approved
  Y todos los criterios DoD CODE-REVIEW están cumplidos
Cuando story-code-review ejecuta el Paso 4c.1
Entonces review-status permanece approved
  Y code-review-report.md incluye la sección DoD con todos los criterios en ✓
  Y story.md avanza a READY-FOR-VERIFY/DONE
```

### Escenario alternativo / error – archivo DoD no encontrado o sección ausente
```gherkin
Dado que $SPECS_BASE/policies/definition-of-done-story.md no existe
  O el archivo existe pero no contiene la sección "CODE-REVIEW"
Cuando story-code-review carga contexto en el Paso 2d
Entonces el skill registra $DOD_CODE_REVIEW_CRITERIA como vacío
  Y emite una advertencia ⚠️ en el resumen de carga
  Y continúa sin validar criterios DoD
  Pero no bloquea el review ni genera error fatal
```
### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos.

## ⚙️ Criterios no funcionales

* Lectura en runtime: el skill extrae la sección CODE-REVIEW del archivo DoD real; si el DoD cambia, el resultado del review se adapta automáticamente
* Degradación elegante: ausencia del archivo DoD o de la sección CODE-REVIEW es `⚠️ WARNING`, no `❌ ERROR` fatal
* Compatibilidad con flujo needs-changes: los hallazgos DoD se incorporan a fix-directives.md con la misma estructura que los hallazgos de agentes (columnas: `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`)

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-13-quality-gates-con-dod-en-story-workflow  
Feature origen: STORY-070 — DoD CODE-REVIEW en story-code-review

**Ubicación de los cambios en el skill:**
- Paso 2d (ampliado): ya resuelve `$DOD_PATH`; agregar extracción de la sección "CODE-REVIEW" como `$DOD_CODE_REVIEW_CRITERIA`
- Nuevo Paso 4c.1 (entre 4c y 4d): validar `$DOD_CODE_REVIEW_CRITERIA`, incorporar hallazgos a la tabla consolidada y ajustar `$REVIEW_STATUS` si hay HIGH/MEDIUM
- Paso 4f: los hallazgos DoD entran en fix-directives.md con `Dimensión: DoD-CODE-REVIEW`
- Paso 5b: incluir sección "Cumplimiento DoD — Fase CODE-REVIEW" en code-review-report.md
- Paso 7: mostrar línea `DoD CODE-REVIEW: N/Total criterios ✓` en el resumen final
