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
<!-- Referencias -->
[[quality-gates-con-dod-en-story-workflow]]

# ðŸ“– Historia: DoD CODE-REVIEW en story-code-review

**Como** tech lead o revisor que usa `/story-code-review` como quality gate  
**Quiero** que el skill lea la secciÃ³n "CODE-REVIEW" de `$SPECS_BASE/policies/dod-story.md` y valide esos criterios antes de determinar el `review-status` final  
**Para** que la decisiÃ³n de `approved`/`needs-changes` considere tambiÃ©n el cumplimiento del DoD y no solo los hallazgos de los agentes revisores

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ DoD CODE-REVIEW incluido en la decisiÃ³n final de review-status
```gherkin
Dado una historia en estado READY-FOR-CODE-REVIEW/DONE
  Y el archivo $SPECS_BASE/policies/dod-story.md existe con secciÃ³n "CODE-REVIEW"
  Y los tres agentes revisores retornan max-severity LOW o ninguna (approved)
Cuando story-code-review ejecuta el Paso 4c.1 (validaciÃ³n DoD)
  Y hay criterios DoD CODE-REVIEW no cumplidos con severidad HIGH o MEDIUM
Entonces review-status se actualiza a needs-changes
  Y code-review-report.md incluye secciÃ³n "Cumplimiento DoD â€” Fase CODE-REVIEW"
  Y fix-directives.md contiene los criterios DoD no cumplidos como hallazgos con DimensiÃ³n: DoD-CODE-REVIEW
```

### Escenario alternativo / error â€“ DoD CODE-REVIEW cumplido, aprobado pasa sin cambios
```gherkin
Dado que los tres agentes retornan approved
  Y todos los criterios DoD CODE-REVIEW estÃ¡n cumplidos
Cuando story-code-review ejecuta el Paso 4c.1
Entonces review-status permanece approved
  Y code-review-report.md incluye la secciÃ³n DoD con todos los criterios en âœ“
  Y story.md avanza a READY-FOR-VERIFY/DONE
```

### Escenario alternativo / error â€“ archivo DoD no encontrado o secciÃ³n ausente
```gherkin
Dado que $SPECS_BASE/policies/dod-story.md no existe
  O el archivo existe pero no contiene la secciÃ³n "CODE-REVIEW"
Cuando story-code-review carga contexto en el Paso 2d
Entonces el skill registra $DOD_CODE_REVIEW_CRITERIA como vacÃ­o
  Y emite una advertencia âš ï¸ en el resumen de carga
  Y continÃºa sin validar criterios DoD
  Pero no bloquea el review ni genera error fatal
```
### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos.

## âš™ï¸ Criterios no funcionales

* Lectura en runtime: el skill extrae la secciÃ³n CODE-REVIEW del archivo DoD real; si el DoD cambia, el resultado del review se adapta automÃ¡ticamente
* DegradaciÃ³n elegante: ausencia del archivo DoD o de la secciÃ³n CODE-REVIEW es `âš ï¸ WARNING`, no `âŒ ERROR` fatal
* Compatibilidad con flujo needs-changes: los hallazgos DoD se incorporan a fix-directives.md con la misma estructura que los hallazgos de agentes (columnas: `#`, `Archivo:LÃ­nea`, `DimensiÃ³n`, `Severidad`, `Hallazgo`, `AcciÃ³n requerida`)

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-13-quality-gates-con-dod-en-story-workflow  
Feature origen: STORY-070 â€” DoD CODE-REVIEW en story-code-review

**UbicaciÃ³n de los cambios en el skill:**
- Paso 2d (ampliado): ya resuelve `$DOD_PATH`; agregar extracciÃ³n de la secciÃ³n "CODE-REVIEW" como `$DOD_CODE_REVIEW_CRITERIA`
- Nuevo Paso 4c.1 (entre 4c y 4d): validar `$DOD_CODE_REVIEW_CRITERIA`, incorporar hallazgos a la tabla consolidada y ajustar `$REVIEW_STATUS` si hay HIGH/MEDIUM
- Paso 4f: los hallazgos DoD entran en fix-directives.md con `DimensiÃ³n: DoD-CODE-REVIEW`
- Paso 5b: incluir secciÃ³n "Cumplimiento DoD â€” Fase CODE-REVIEW" en code-review-report.md
- Paso 7: mostrar lÃ­nea `DoD CODE-REVIEW: N/Total criterios âœ“` en el resumen final
