---
alwaysApply: false
type: story
id: STORY-084
kind: feat
slug: STORY-084-skill-verify
title: "Unificar generación, ejecución y benchmark de evals en `skill-test-evals`"
status: CANCELED
substatus: DONE
parent: 
created: 2026-05-30
updated: 2026-05-30
related:
---
[[]]

# Historia de Usuario

**Título:** Unificar generación, ejecución y benchmark de evals en `skill-test-evals`

**Como** desarrollador que trabaja con skills SDDF,  
**Quiero** que `skill-test-evals` sea el único punto de entrada para generar, ejecutar y benchmarkear evals,  
**Para** completar el ciclo TDD sin tener que recordar ni alternar entre `skill-test-evals` y `skill-verify`.

---

## Criterios de aceptación

1. **Generar evals**  
   `/skill-test-evals {descripción|skill}` crea `evals/evals.json` y, si es descripción libre, también un skeleton de `SKILL.md`.

2. **Ejecutar evals**  
   `/skill-test-evals evals {skill}` ejecuta los casos TC-NNN y devuelve un informe pass/fail.

3. **Benchmark**  
   `/skill-test-evals benchmark {skill}` corre cada caso N veces y devuelve métricas estadísticas (mean/stddev de pass_rate, duración y tokens).

4. **Eliminar duplicidad**  
   `skill-verify` deja de existir; sus referencias en `skill-master`, `package.json` y documentación se actualizan a `skill-test-evals`.

5. **Sin regresiones**  
   La generación actual de evals sigue funcionando igual.

Nota de cancelación: esta historia se canceló en este repositorio porque se implementa en otro repositorio externo: agile-sddf-extension