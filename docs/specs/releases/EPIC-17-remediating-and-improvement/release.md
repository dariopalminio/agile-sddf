---
alwaysApply: false
type: release
id: EPIC-17
slug: remediating-and-improvement
title: "Remediating and Improvement"
status: DEFINITION
substatus: IN-PROGRESS
parent: null
created: 2026-06-12
updated: 2026-06-12
related: []
---

# Release/Epic: Remediating and Improvement

## Descripción <!-- sección obligatoria-->
El framework tiene una arquitectura agéntica sólida con patrones probados
(preflight centralizado, anti-teléfono-descompuesto, template-as-source-of-truth),
pero viola sistemáticamente su propia constitución: cobertura de evals al 21%,
dos esquemas de evals incompatibles, el modelo de un solo nivel de delegación
incumplido en la práctica, y el CLAUDE.md con información falsa sobre el repo.
Este release remedia las violaciones más críticas a la constitución y establece
verificación automática como mecanismo de cumplimiento, alineando el framework
con su propio principio §3 ("obligar a demostrar, no declarar").

## Features <!-- sección obligatoria-->

- [x] plan-01 - **Reducción de costo de contexto de descriptions:** Remediar hallazgo A1 — Costo de contexto de las descriptions de skills. Recortar las 47 descriptions del system prompt de 22.017 a ≤12.000 chars siguiendo el patrón "cuándo invocarme" (qué + cuándo + triggers, ≤500 chars/skill).
- [ ] **Corrección de CLAUDE.md:** Actualizar la información falsa sobre la estructura del repo para que los agentes lean datos verídicos.
- [ ] **Estandarización del esquema de evals:** Unificar los dos esquemas incompatibles de evals.json en uno solo y migrar los evals existentes.
- [ ] **Cobertura mínima de evals en skills críticos:** Crear evals.json para los skills del pipeline principal que no tienen cobertura (79% sin evals).
- [ ] **Verificación automática de la constitución:** Implementar un skill o script que audite el cumplimiento de las reglas de la constitución de forma ejecutable.


## Riesgos <!-- sección opcional-->
- **Pérdida de triggering tras recorte de descriptions:** al acortar frases gatillo, algún skill podría dejar de dispararse en casos límite. **Mitigación:** conservar todas las frases gatillo existentes en la description; mover solo el contenido procedimental al body.
- **Regresión en evals al unificar schemas:** los evals existentes escritos en el schema antiguo pueden fallar al migrarse. **Mitigación:** ejecutar `/skill-test-evals` sobre cada skill migrado antes de cerrar la tarea.
- **CLAUDE.md desactualizado en el futuro:** la corrección puntual no garantiza que futuras edits mantengan la veracidad. **Mitigación:** añadir en `constitution.md` la regla "CLAUDE.md solo describe estructura verificable con el filesystem".

**Criterios de éxito:** <!-- sección opcional-->
- [ ] Total de chars en descriptions de los 47 skills ≤ 12.000 (script de medición pasa)
- [ ] Ningún skill supera 500 chars en su description
- [ ] Todos los skills del pipeline principal tienen `evals/evals.json` con al menos 1 caso
- [ ] `/skill-test-evals` ejecuta sin errores de schema sobre todos los evals migrados
- [ ] Todas las rutas y estructuras mencionadas en CLAUDE.md existen en el filesystem
- [ ] `constitution.md` incluye regla explícita sobre veracidad de CLAUDE.md

## Notas adicionales <!-- sección opcional-->
Este release tiene un plan de implementación detallado para la Feature 1 (reducción
de costo de contexto) documentado en
`C:\Users\Daro\.claude\plans\puedes-diagramar-un-listado-zazzy-scroll.md`.
El criterio de verificación del hallazgo A1 es ejecutable: el script PowerShell
de medición de chars puede correr en cualquier momento para medir cumplimiento.
Las Features 2–6 requieren un análisis previo de cada skill afectado antes de implementar.
