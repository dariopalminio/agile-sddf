---
type: finvest-evaluation
story-id: STORY-169
finvest-score: 4.08
verdict: SPLIT
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `SPLIT` — S – Small = 1: historia demasiado grande para una sola entrega

## Historia evaluada

> **Como** Solo Builder que valida una épica antes de liberarla
> **Quiero** que `/epic-validate --mode auto` ejecute, en el entorno desde el que lo invoco, las suites de nivel épica declaradas en `verify` de `sddf.config.yaml` (integración, E2E y regresión completa), compruebe el DoD de validación de épica (`docs/guardrails/dod-epic-validate.md`) si existe e incorpore ambos resultados al veredicto
> **Para** certificar que el conjunto de historias funciona como un release unificado

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` presente. El rol es real (Solo Builder), la acción es concreta y el beneficio es claro. El `Quiero` ahora une dos acciones: ejecutar suites y comprobar el DoD. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con un escenario principal (AC-1), uno alternativo y de error (AC-2), una regla de precedencia (AC-3) y la comprobación del DoD (AC-4), todos como subapartados `###`. |
| Escenarios Gherkin | 5 | Cuatro bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces`. AC-2 y AC-4 son `Esquema del escenario` con tabla `Ejemplos` de valores concretos. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Sube desde 2. `related` incluye STORY-124, 125, 126 y 137, y las Notas declaran los prerrequisitos. También indican que la historia se puede desarrollar con un stub del resto de la evidencia y con `--mode` como parámetro de entrada. Sigue extendiendo un skill que no existe (`skills/epic-validate/` no está en `skills/`; STORY-124 y STORY-126 están en `SPECIFY/DONE`), pero la dependencia se puede simular. |
| **N** – Negociable | 4 | Describe resultados observables (qué registra el reporte y qué veredicto sale) sin imponer cómo implementarlo. La lista fija de claves y la definición de «no ejecutable» son decisiones registradas, no especificación de solución. |
| **V** – Valiosa | 4 | El valor es claro y observable para quien libera la épica: el veredicto pasa a reflejar el comportamiento conjunto de las historias. Cubre CS-11. |
| **E** – Estimable | 3 | La parte de suites ya es estimable: la lista de claves es fija, el skill no controla el entorno y «no ejecutable» tiene una definición observable (script npm ausente o código 127). La parte del DoD añade incertidumbre: (a) la propia nota «Solapamiento con STORY-125» dice que falta reconciliar con CS-4 para que el DoD se evalúe una sola vez, así que no se sabe si este alcance queda aquí o en STORY-125; (b) no está definido cómo se determina que un criterio del checklist «tiene evidencia». |
| **S** – Small | 1 ⚠️ | Hay 10 escenarios contando las filas de los Esquemas (AC-1: 1, AC-2: 4, AC-3: 1, AC-4: 4) y unos 25 pasos, con dos tablas de 4 filas. Las tres señales de la rúbrica caen en «Épica / Demasiado grande». Además, el refinamiento amplió el alcance: el `Quiero` añadió la comprobación del DoD, que no forma parte de CS-11. |
| **T** – Testeable | 4 | Los escenarios son automatizables: códigos de salida, scripts ausentes de `package.json` y veredictos exactos. Ya no hay contradicción con CNF-2 (la fila 3 de AC-2 la cubre) y AC-3 cumple G-05. Faltan dos cosas: la regla «una clave ausente de `verify` se registra como omitida con advertencia» no tiene escenario, y «con su evidencia» (AC-4) no dice qué se registra exactamente. |

**INVEST_Score = (3 + 4 + 4 + 3 + 1 + 4) / 6 = 3.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 1 / 5 ⚠️
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.08 / 5.0

---

## Comentarios y Recomendaciones

> El FINVEST (4.08) superaría el umbral de `APPROVED`, pero S = 1 activa la fila 3 del Paso 4 antes que cualquier fila de score. El tamaño no se debe solo a haber pasado a Esquemas de escenario: la comprobación del DoD (AC-4) es un alcance nuevo con su propia matriz de veredictos.

### S – Small (1) ⚠️
- Dividir con `/story-split` siguiendo el eje que ya proponen las Notas («ejecución de suites / comprobación del DoD»):
  1. **STORY-169 (core) — Ejecutar las suites de nivel épica y reflejarlas en el veredicto:** AC-1, AC-2, AC-3, CNF-1 (solo suites), CNF-2 y CNF-3. Cubre CS-11.
  2. **Hermana — Comprobar `dod-epic-validate.md` en `/epic-validate`:** AC-4 y la parte de CNF-1 que trata el DoD. Antes de planificarla, reconciliarla con STORY-125 (CS-4); ver E.
- La core quedaría con 6 escenarios (1 + 4 + 1), justo en el límite de S = 1. Para bajarla a S = 2, quitar la fila 4 de AC-2 (`e2e-regression` opcional que sale con 1 → `NEEDS-CHANGES`) y expresar esa regla en una línea `Regla:` o en CNF-2 («una suite opcional que se ejecuta y falla cuenta como fallida»). Otra opción es fusionar AC-3 con AC-2 como una fila de dos suites, si el equipo prefiere mantener todo en el Esquema.

### I – Independencia (3)
- Mantener el stub de evidencia que propone AC-1. En la historia hermana del DoD, declarar a STORY-125 como prerrequisito o como dueña del DoD según cómo se reconcilie, para que las dos no implementen la misma comprobación.

### E – Estimable (3)
- Resolver el solapamiento con STORY-125 antes de mover cualquiera de las dos a `PLAN`. Hay dos opciones: (a) STORY-125 deja de evaluar el DoD y remite a la historia hermana, o (b) el DoD vuelve a STORY-125 con el archivo `dod-epic-validate.md` y el vocabulario vigente, y esta historia se queda solo con las suites. Hay que registrar la decisión en EPIC-23.
- Definir de forma observable qué significa que un criterio del DoD «tiene evidencia». Por ejemplo: la casilla está marcada en el checklist, existe un artefacto citado, o el criterio remite a una suite o comando cuyo resultado ya está en el reporte.

### T – Testeable (4)
- Añadir una fila o un escenario para «clave de nivel épica ausente de `verify` → omitida con advertencia» (la decisión ya está en Notas, pero no tiene AC).
- En AC-4, precisar qué se registra como «evidencia» (ruta del artefacto, comando, o línea del checklist) para que la comprobación sea exacta.
