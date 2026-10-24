---
type: finvest-evaluation
story-id: STORY-129
finvest-score: 4.25
decision: APROBADA
evaluated: 2026-10-14
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que distribuye el skill `reverse-engineering`
> **Quiero** que los cinco analizadores `reverse-engineer-*` vivan como subagentes locales en `skills/reverse-engineering/assets/agents/`
> **Para** que el skill funcione de forma autocontenida, sin depender de la carpeta global `agents/`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` según template; rol real (mantenedor que distribuye el skill), acción concreta y beneficio verificable (skill autocontenido). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con `AC-1 — Escenario principal` y `AC-2 — Escenario alternativo / error` como subapartados `###`. |
| Escenarios Gherkin | 5 | 2 escenarios en bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`; el alternativo usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Gateway superado (F_score ≥ 2.5) — se evalúan las dimensiones INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Es la primera del orden sugerido por EPIC-24 y no depende de otra historia no entregada; el mecanismo de invocación local ya está decidido (ADR-0002, ADR-0014). Solo STORY-136 depende de ella, no al revés. |
| **N** – Negociable | 3 | El qué y el por qué están claros, pero el `Quiero` fija la ruta física (`assets/agents/`), lo que deja poco margen para negociar el cómo dentro de la historia. |
| **V** – Valiosa | 3 | Valor claro para el mantenedor (skill autocontenido, desbloquea el retiro de `agents/`), pero es un beneficio de arquitectura de distribución sin efecto observable para quien adopta el framework expresado en la historia. |
| **E** – Estimable | 4 | Alcance acotado y conocido: 5 archivos existentes en `agents/` a mover, ajustar `SKILL.md`, la validación de presencia (AC-2) y `evals.json`. Incertidumbre menor: no hay precedente de `skills/*/assets/agents/` en el repo y `skills/reverse-engineering/assets/` hoy está vacío. |
| **S** – Small | 3 | 2 escenarios, 9 pasos en total, 1 escenario alternativo claro — tamaño ideal para una iteración. |
| **T** – Testeable | 4 | Happy path + error con `Pero`; resultados observables (rutas de `.tmp/`, ausencia de `reverse-engineer-*` en `agents/`, mensaje de subagente faltante). Comprobar "en paralelo" y "antes de lanzar analizadores" requiere eval o inspección de la ejecución, no una aserción booleana directa. |

**INVEST_Score = (4 + 3 + 3 + 4 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0
**FINVEST Decisión:** APROBADA

---

## Comentarios y Recomendaciones

Ninguna dimensión es crítica (score = 1). Las recomendaciones siguientes son opcionales y no bloquean la aprobación.

- **N – Negociable (3):** la ruta `skills/reverse-engineering/assets/agents/` ya está decidida por la épica/ADR-0014, así que la rigidez está justificada. Para dejar el `Quiero` centrado en el resultado, se puede reformular como "que los cinco analizadores `reverse-engineer-*` se empaqueten dentro del propio skill como subagentes locales" y mover la ruta exacta a 📎 Notas citando ADR-0014.
- **V – Valiosa (3):** expresar el beneficio para quien adopta el framework, no solo para el mantenedor. Ejemplo de `Para`: "para que quien instale solo `reverse-engineering` con `agile-sddf install` pueda usarlo sin depender de la carpeta global `agents/`". Opcionalmente, mencionar en Notas que esta historia es prerrequisito de STORY-136 (retiro de `agents/`).
- **S – Small (3):** el tamaño es el ideal; mantenerlo. Evitar agregar escenarios nuevos (por ejemplo, de instalación) y tratar la actualización de `evals.json` como tarea de implementación, no como criterio de aceptación adicional.
- **Observación adicional (T):** en AC-1, `Y agents/ ya no contiene ningún archivo reverse-engineer-*` es más un resultado de la migración que una precondición. Puede quedar como `Dado`, pero si se mueve a `Entonces` (o a un CNF verificable con `ls agents/`) se gana claridad para el eval.
- **Formato (opcional):** se puede añadir `## Fuera de alcance` aclarando que eliminar la carpeta `agents/` y su entrada en `package.json` → `files` corresponde a STORY-136.
