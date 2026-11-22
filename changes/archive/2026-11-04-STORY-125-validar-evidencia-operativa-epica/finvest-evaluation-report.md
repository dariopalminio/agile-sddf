---
type: finvest-evaluation
story-id: STORY-125
finvest-score: 4.17
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **STORY-125 — Validar la evidencia operativa de una épica**
>
> **Como** Solo Builder y mantenedor de Agile-SDDF que debe confirmar que una épica funciona antes de liberarla
> **Quiero** incorporar al veredicto la evidencia de smoke tests, verificación de release y DoD aplicable
> **Para** evitar liberar una épica cuyo comportamiento operativo o controles de calidad fallan
>
> Criterios: AC-1 (Scenario Outline: evidencia aprobada según `--mode auto|manual`, 3 filas), AC-2 (comprobación configurada fallida → BLOCKED), AC-3 (controles opcionales no configurados → omitidos con advertencia).

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` como en el template; rol real, acción concreta y beneficio claro. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con subapartados `###` nombrados: principal (AC-1) y dos alternativos (AC-2, AC-3). |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` bien formados; AC-1 es un `Esquema del escenario` con tabla `Ejemplos` y AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se continúa con la evaluación INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Sigue dependiendo de STORY-124 y ahora también de STORY-126 (selección de modo), ninguna entregada. Pero las dependencias están desacopladas: el `Dado` parte de un resultado («validación estructural APPROVED») y las Notas explican cómo simular ambas con un reporte de prueba y con el modo como parámetro. |
| **N** – Negociable | 4 | Describe resultados y reglas de negocio (fuente de evidencia por modo, DoD solo si existe). El `Cuando` de AC-1 fija los nombres `--mode auto` / `--mode manual`, mientras STORY-126 deja la mecánica de los modos para el diseño. Es una tensión menor de coordinación, no una solución técnica impuesta. |
| **V** – Valiosa | 4 | Valor claro y observable: ninguna épica con una comprobación operativa fallida se libera. |
| **E** – Estimable | 3 | Mejoró: la fuente de evidencia de cada modo y el alcance del DoD ya están definidos. Queda una incertidumbre: qué significa «ejecutar» en `--mode auto` un `SMOKE-N` escrito como Gherkin en lenguaje natural dentro de `epic.md` (que el agente interprete los pasos o que haya un comando asociado), y qué pasa con un smoke test que no se puede automatizar. |
| **S** – Small | 2 | 5 escenarios contando las filas del Outline (3 en AC-1, AC-2 y AC-3) y unos 18 pasos con varios `Y`. Es una historia grande: la incorporación del modo manual (dos fuentes de evidencia) la hizo crecer, como se esperaba. |
| **T** – Testeable | 4 | Cubre el caso feliz por modo, el fallo y la omisión, con resultados observables (veredicto, registro por `SMOKE-N` con su fuente, advertencia). AC-2 sigue enumerando tres tipos de comprobación en un solo escenario, y la confirmación manual exige simular la entrada del mantenedor en las pruebas. |

**INVEST_Score = (3 + 4 + 4 + 3 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** (5.00 + 3.33) / 2 = 4.17 / 5.0
**FINVEST Decisión:** ✅ **APROBADA**

> La aprobación se apoya sobre todo en el formato (5.00); el INVEST queda en 3.33, con S = 2. Conviene tener en cuenta las recomendaciones de abajo durante `story-plan`.

---

## Comentarios y Recomendaciones

### S – Small (2)
- **Separar la evidencia del modo manual, si el diseño la encarece.** Las filas `manual` de AC-1 (reporte existente y confirmación manual) forman un bloque coherente que puede pasar a una historia hermana («Validar la evidencia operativa con confirmación humana»). STORY-125 se quedaría con `auto`, AC-2 y AC-3: 3 escenarios, S ≈ 3. Hazlo si `story-design` o `story-tasking` muestran que la búsqueda de reportes por historia dueña y la interacción con el mantenedor suman más tareas que la ejecución automática.

### E – Estimable (3)
- **Definir «ejecutar un SMOKE-N» en `--mode auto`.** Añade una `Regla:` que diga si el agente interpreta y ejecuta los pasos del Gherkin de `epic.md` o si cada smoke test declara un comando o procedimiento verificable. Define también qué se registra cuando un smoke test no se puede ejecutar sin intervención humana (por ejemplo, «no ejecutable en auto → BLOCKED con motivo», o «→ se requiere `--mode manual`»).
- **Concretar el vínculo SMOKE-N → reporte en `--mode manual`.** Indica que la historia dueña se identifica por la cita del `SMOKE-N` en sus Notas (convención de EPIC-23) y qué campo del reporte se lee como «aprobado».

### I – Independencia (3)
- **Alinear STORY-126 con los nombres de modo.** Esta historia ya usa `--mode auto` y `--mode manual`; STORY-126 los deja para el diseño. Actualiza STORY-126 para que adopte esos nombres o para que cite a STORY-125 como fuente de la semántica de evidencia por modo. Así se evita que el diseño de STORY-126 los redefina.
- **Orden de planificación:** con WIP = 1 por nivel, planifica STORY-125 después de STORY-124 y, si no se separa el modo manual, junto con el diseño de STORY-126 o después de él.

### Observaciones
- El frontmatter de `story.md` ya tenía `status: SPECIFY` / `substatus: DONE`; la decisión APROBADA lo confirma y no hace falta escribir.
- `story.md.bak` y `story-improvement-log.md` siguen en el directorio. `git` no ignora `story.md.bak`, así que hay que decidir si se versiona.
