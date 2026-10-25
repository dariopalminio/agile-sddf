---
type: finvest-evaluation
story-id: STORY-126
finvest-score: 4.25
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **STORY-126 — Operar la validación de épicas de manera segura**
>
> **Como** Solo Builder y mantenedor de Agile-SDDF que revisa la preparación de una épica
> **Quiero** ejecutar la validación en modos manual, automático y de previsualización sin efectos inesperados
> **Para** revisar una épica sin riesgo de escrituras y usar el mismo veredicto como gate automatizado y reproducible
>
> Criterios: AC-1 (Esquema del escenario: resultado según modo y veredicto), AC-2 (previsualización `--dry-run` sin escrituras), AC-3 (error: modo no reconocido), AC-4 (regresión: repetición sin efectos colaterales). CNF-1 (idempotencia), CNF-2 (escritura mínima). Cubre CS-7 y contribuye a CS-10 de EPIC-23.

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` igual que el template. Rol real (mantenedor que revisa una épica), acción concreta (tres formas de ejecución sin efectos inesperados) y un `Para` con dos beneficios observables: revisar sin riesgo de escrituras y usar el veredicto como gate automatizado. Corrige el `Para` débil de la evaluación anterior. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con cuatro subapartados `###` nombrados: escenario principal (AC-1), alternativo (AC-2), de error (AC-3) y de regresión (AC-4). Cubre el escenario de error que faltaba. |
| Escenarios Gherkin | 5 | Cuatro bloques ` ```gherkin ` con `Dado/Cuando/Entonces`, pasos `Y` en todos y `Pero` en AC-2 y AC-3. AC-1 es un `Esquema del escenario` con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se continúa con la evaluación INVEST.

> Nota menor de formato (no afecta el score): la sección opcional se titula `## 🚫 Fuera de alcance`, mientras que el template la llama `## Fuera de alcance (Non-Goals)`.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Consume el veredicto de STORY-124 y la selección de evidencia de STORY-125, que no están entregadas. La dependencia está declarada y desacoplada: las Notas indican que se puede desarrollar con un validador stub que devuelva APPROVED o BLOCKED fijo. Corresponde al nivel 3 (dependencias mockeables, orden flexible). |
| **N** – Negociable | 4 | Fija el qué (modos, efectos, resultado observable) y deja el cómo para el diseño: «el mecanismo concreto (código de salida, línea final de estado u otro) se decide en el diseño». Los nombres de flags vienen de EPIC-23 y STORY-125, no son una decisión técnica nueva. |
| **V** – Valiosa | 4 | Valor claro y observable para el mantenedor: previsualizar sin escrituras y usar el mismo veredicto como gate automatizado. Cierra CS-7 de la épica. No hay métrica cuantitativa, pero el beneficio se verifica de forma cualitativa. |
| **E** – Estimable | 4 | Las incertidumbres anteriores quedaron resueltas. «Regla — Resultado observable» define éxito/fallo. «Regla — Contenido equivalente» define que solo puede variar la fecha. El modo por defecto sin `--mode` sale de la tabla de flags de EPIC-23, y la semántica de evidencia por modo se delega a STORY-125. Cualquier miembro con experiencia en el harness puede estimarla. |
| **S** – Small | 2 | 5 escenarios contando las 2 filas del Outline (AC-1 ×2, AC-2, AC-3, AC-4) y unos 17 pasos en total. Cae en «Grande» (4–5 escenarios) por la señal primaria, aunque los pasos superan el umbral de 11. Reúne tres preocupaciones: selección de modo + resultado, previsualización e idempotencia. |
| **T** – Testeable | 4 | AC-1 tiene datos concretos en `Ejemplos`. AC-2, AC-3 y AC-4 se verifican de forma objetiva (snapshot del filesystem antes/después, diff del reporte salvo la fecha, ausencia de ejecución de comandos). La fila `manual / BLOCKED / fallo` exige un modo interactivo, y el escenario no dice cómo se aporta la respuesta humana en una prueba automatizada, así que esa fila queda a medio camino de lo directamente automatizable. |

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

**FINVEST Score:** (5.00 + 3.50) / 2 = **4.25 / 5.0**
**FINVEST Decisión:** ✅ **APROBADA**

Ninguna dimensión tiene score 1, así que no aplica RECHAZAR ni DIVIDIR automático.

---

## Comentarios y Recomendaciones

### I – Independencia (3)

- **Recomendación:** Llevar el stub al Gherkin, no solo a las Notas. Por ejemplo, en AC-1: `Dado un validador que devuelve el veredicto <veredicto>` en lugar de `Dado una épica existente cuya validación resulta <veredicto>`. Así queda explícito que las pruebas de esta historia no requieren STORY-124 ni STORY-125 entregadas.

### S – Small (2)

- **Recomendación:** La historia está en el límite superior de lo aceptable. Si al planificar el diseño o el tasking se ve que excede una iteración, conviene separar AC-4 + CNF-1 (idempotencia y orden determinista de hallazgos) en una historia hermana: es una preocupación transversal que puede entregarse después de los modos. Hasta entonces, se puede mantener unida porque los cuatro escenarios comparten el mismo punto de entrada y el mismo stub.
- Alternativa: ejecutar `/story-split STORY-126` con el patrón «reglas de negocio / variaciones de operación».

### T – Testeable (4)

- **Recomendación:** En las Notas o en AC-1, indicar cómo se simula la confirmación humana del modo manual en una prueba (respuesta preconfigurada o entrada simulada), o cambiar la fila manual por un caso donde la confirmación no es necesaria para el resultado. Así la tabla `Ejemplos` queda totalmente automatizable.
- Opcional: completar las combinaciones de la tabla (`auto / BLOCKED / fallo`, `manual / APPROVED / éxito`) si el diseño las trata por caminos distintos. Agrega filas y empeora S, así que solo vale si aportan cobertura real.

### Formato (nota menor)

- Renombrar `## 🚫 Fuera de alcance` a `## Fuera de alcance (Non-Goals)` para alinearse literalmente con `story-template.md`.
