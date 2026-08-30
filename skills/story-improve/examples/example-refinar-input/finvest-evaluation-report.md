---
type: finvest-evaluation
story-id: STORY-075
finvest-score: 3.94
decision: REFINAR
evaluated: 2026-05-17
---

# Reporte FINVEST — STORY-075

```
┌──────────────────────────────────────────────────────────────────┐
│  STORY-075  story-integrate: Modos de ejecución (manual/dry-run)  │
├──────────────┬───────────────────────────────────────────────────┤
│  F_score     │  4.70                                             │
│  INVEST_Score│  3.17                                             │
│  FINVEST     │  3.94                                             │
│  Decisión    │  ⚠️ REFINAR                                       │
└──────────────┴───────────────────────────────────────────────────┘
```

## Resumen de scores

| Dimensión         | Score | Estado |
|-------------------|:-----:|--------|
| F – Formato       | 4.70  | ✅     |
| I – Independiente | 2     | ⚠️     |
| N – Negociable    | 3     | ⚠️     |
| V – Valiosa       | 4     | ✅     |
| E – Estimable     | 3     | ⚠️     |
| S – Small         | 3     | ✅     |
| T – Testeable     | 4     | ✅     |

## Detalle de evaluación

### F – Formato (4.70)

- **C1 (×0.4):** 5 — Como/Quiero/Para completo y bien formulado desde la perspectiva del usuario.
- **C2 (×0.3):** 5 — Sección `## ✅ Criterios de aceptación` con escenarios nombrados en subapartados `###`.
- **C3 (×0.3):** 4 — Dos escenarios Gherkin bien formados con `Dado/Cuando/Entonces` y `Y`.

`F_score = (5 × 0.4) + (5 × 0.3) + (4 × 0.3) = 2.0 + 1.5 + 1.2 = 4.70`

### I – Independiente (2)

Las notas declaran explícitamente: *"Precondición de implementación: STORY-074 debe estar completa para poder implementar los modos manual y dry-run."* Sin STORY-074, esta historia no puede entregar valor. No se describe ningún mecanismo de stub o interfaz provisional que permita desarrollarla en paralelo.

### N – Negociable (3)

La historia documenta el qué (modos manual/dry-run) pero las notas limitan el espacio de conversación al anclar la dependencia con STORY-074. El equipo no puede negociar el orden de implementación sin redefinir el scope.

### V – Valiosa (4)

Valor claro y observable: el developer puede verificar que story-integrate no ejecuta acciones destructivas en modo dry-run y puede operar manualmente cuando el modo automático no aplica.

### E – Estimable (3)

La lógica de los modos es conceptualmente simple (flag `--dry-run`, flag `--manual`), pero la incertidumbre sobre el contrato de STORY-074 impide estimar con precisión el esfuerzo de integración.

### S – Small (3)

Dos escenarios Gherkin con 5-6 pasos cada uno. Tamaño pequeño-ideal.

### T – Testeable (4)

Escenarios Gherkin con `Dado/Cuando/Entonces` bien formados y escenario alternativo de error. Automatizable con stubs.

## Comentarios y Recomendaciones

### I – Independencia

Definir en las "Notas / contexto adicional" de esta historia el contrato mínimo de integración con STORY-074: la interfaz o método que story-integrate-075 necesita consumir (ej. `IntegrationRunner.run(options)` con parámetros `dryRun: boolean` y `manual: boolean`). Con ese contrato documentado, esta historia puede desarrollarse con un stub de STORY-074 sin bloquearse. El Scenario Outline o los pasos Gherkin ya tienen valores concretos que facilitan el testing independiente con stubs.

### E – Estimable

Agregar en "Notas / contexto adicional" el comportamiento esperado del modo `--dry-run`: qué acciones se simulan, qué output produce (ej. lista de operaciones que se ejecutarían), y el límite de lo que excluye (ej. no escribe archivos, no ejecuta git). Con esa acotación, el equipo puede estimar el esfuerzo sin incertidumbre sobre el alcance del modo.

## Decisión

**⚠️ REFINAR** — FINVEST Score 3.94 < 4.0. La historia tiene formato sólido (F=4.70) y es testeable (T=4), pero la dependencia explícita con STORY-074 reduce I a 2 y limita la estimabilidad (E=3). Aplicar las recomendaciones de I y E para superar el umbral APROBADA.
