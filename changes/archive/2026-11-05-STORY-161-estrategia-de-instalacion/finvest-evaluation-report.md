---
type: finvest-evaluation
story-id: STORY-161
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-10-25
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** usuario de `agile-sddf install` que trabaja solo con historias, sin épicas
> **Quiero** elegir entre la estrategia `full` (épica + story, incluye los skills `epic-*`) y `story` (sin los skills `epic-*`) al instalar
> **Para** instalar solo el flujo que voy a usar y no cargar mi runtime con skills de épica que nunca invocaré

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Rol real, acción concreta y beneficio claro; sigue el encabezado `# 📖 Historia` del template. |
| Criterios de aceptación | 5 | Sección presente con AC-1 (principal), AC-2 (alternativo) y AC-3 (error) nombrados como subapartados. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin `, con `Y`, `Pero` y Scenario Outline con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Depende solo del instalador existente (`scripts/cli.js`, `scripts/install.js`); no requiere otras historias de EPIC-27 para entregarse. |
| **N** – Negociable | 3 | El qué y el por qué están claros, pero los nombres de flag y valores (`--strategy full\|story`) y el contenido de las pruebas (CNF-4) ya están decididos. |
| **V** – Valiosa | 4 | Valor claro y cualitativo: runtime sin skills `epic-*` que no se usarán. Sin métrica cuantitativa. |
| **E** – Estimable | 4 | Cambio acotado a CLI + filtro por prefijo; queda una duda abierta sobre agentes locales por runtime (nota de contexto). |
| **S** – Small | 2 | 5 escenarios/filas (AC-1, 3 filas de AC-2, AC-3) y varios `Y`: al límite superior de tamaño razonable. |
| **T** – Testeable | 5 | Condiciones booleanas, tabla de `Ejemplos` con datos concretos y código de salida verificable. |

**INVEST_Score = (4 + 3 + 4 + 4 + 2 + 5) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.33 / 5.0

---

## Comentarios y Recomendaciones

**N – Negociable (3):** la historia fija flags, valores y la redacción exacta de pruebas. Recomendación: en `/story-design` tratar `--strategy` y los textos de resumen como propuesta negociable, y expresar CNF-4 por cobertura (casos a cubrir) en lugar de enumerar pruebas concretas.

**S – Small (2):** AC-2 es un Scenario Outline de 3 filas que, sumado a AC-1 y AC-3, llega a 5 escenarios. Recomendación: si el diseño la revela más grande de lo previsto, separar la selección interactiva (fila "con TTY" de AC-2) en una historia propia; el filtrado `story`/`full` y la validación quedarían en esta. No bloquea la aprobación (S ≠ 1).

**Pendiente abierto:** la nota sobre `--force` con estrategia `story` sobre un destino que ya tiene skills `epic-*` queda como propuesta (fuera de alcance); confirmarla en `/story-design` y trasladarla a Non-Goals, junto con la revisión de agentes locales por runtime.
