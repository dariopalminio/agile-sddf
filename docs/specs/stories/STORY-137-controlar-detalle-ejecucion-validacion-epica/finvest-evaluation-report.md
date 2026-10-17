---
type: finvest-evaluation
story-id: STORY-137
finvest-score: 4.25
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** Solo Builder y mantenedor de Agile-SDDF que valida una épica antes de liberarla
> **Quiero** pedir la salida completa de los comandos de prueba y recibir un rechazo claro cuando fuerzo la ejecución automática sin pruebas configuradas
> **Para** diagnosticar por qué una épica queda BLOCKED sin repetir los comandos a mano

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real, la acción es concreta y el beneficio se puede observar: diagnosticar un BLOCKED sin repetir los comandos. |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación` con subapartados `###` nombrados: principal (AC-1), error (AC-2) y alternativo (AC-3). |
| Escenarios Gherkin | 5 | Tiene 3 bloques ` ```gherkin `, entre ellos un `Esquema del escenario` con tabla `Ejemplos` (AC-1) y un escenario de error con `Pero` (AC-2). |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Supera el gateway de formato (F_score ≥ 2.5). Se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Usa los comandos que ejecuta STORY-125 y la lectura de flags de STORY-126, y ninguna de las dos está entregada. La dependencia está declarada y se puede simular: las Notas proponen un validador stub de veredicto fijo y un comando de prueba falso con salida conocida. |
| **N** – Negociable | 4 | Fija resultados observables y deja abierto el cómo. Las Notas dejan explícitamente para el diseño cómo se detectan las «pruebas configuradas». Los nombres de los flags vienen de la tabla de EPIC-23, no son una decisión técnica nueva. |
| **V** – Valiosa | 4 | El valor es claro y se comprueba de forma cualitativa: el mantenedor diagnostica un BLOCKED desde la propia ejecución, y `--mode auto` nunca da un falso APPROVED cuando no hay pruebas. Además cierra CS-10 de EPIC-23. |
| **E** – Estimable | 4 | El trabajo es acotado: un flag de salida y una validación previa de la invocación. La única incertidumbre es el criterio de «pruebas configuradas», que ya figura como decisión de diseño con dos alternativas concretas. |
| **S** – Small | 2 | 4 escenarios contando las 2 filas del Outline (AC-1 ×2, AC-2, AC-3) y unos 12 pasos. Por la señal principal cae en «Grande» (4–5 escenarios), aunque cada escenario es simple y los tres tratan del manejo de flags. |
| **T** – Testeable | 4 | AC-1 trae datos en `Ejemplos` y se comprueba de forma objetiva comparando que los reportes con y sin `--verbose` sean idénticos. AC-2 y AC-3 se verifican con una instantánea del filesystem antes y después. Falta definir qué es «solo el resumen», así que la fila sin `--verbose` no se puede comparar con un valor exacto. |

**INVEST_Score = (3 + 4 + 4 + 4 + 2 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0
**FINVEST Decisión:** ✅ APROBADA

---

## Comentarios y Recomendaciones

### I – Independencia (3)

- Antes del diseño, declarar en **📎 Notas** qué entrega STORY-126 para leer los flags (por ejemplo, un objeto de opciones con `mode`, `dryRun` y `verbose`). Así esta historia se prueba contra ese contrato y no contra su implementación.

### S – Small (2)

- Si hace falta achicarla, AC-3 (`--dry-run --verbose`) puede pasar a una **Regla** en Notas («con `--dry-run`, `--verbose` no tiene comandos que mostrar»). Quedarían 3 escenarios contando las filas del Outline (S=3). Se mantuvo como escenario porque CS-10 exige que los flags se manejen bien también combinados.

### Observaciones adicionales (no bloqueantes)

- **T (AC-1):** definir qué contiene «el resumen» sin `--verbose` (por ejemplo, una línea por comando con su nombre y su resultado `OK`/`FAIL`). Así la fila `(ninguno)` se puede comparar con un valor exacto.
