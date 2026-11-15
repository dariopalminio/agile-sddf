---
type: finvest-evaluation
story-id: STORY-190
finvest-score: 4.00
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** APPROVED

## Historia evaluada

> **Como** Solo Builder que corrige una historia rechazada en VERIFY o en ACCEPTANCE
> **Quiero** que `/story-verify` y `/story-acceptance` con `NEEDS-CHANGES` escriban `fix-directives.md` desde una plantilla común en `docs/templates/fix-directives-template.md`, con `based-on` igual a su reporte y un `round` que continúe las rondas de rework de la historia, y que `/story-implement` y `/story-implement-tasks` anuncien qué gate abrió el rework y avisen si encuentran `IMPLEMENT/TODO` sin `fix-directives.md`
> **Para** que lo que rechazó el gate llegue al ejecutor como una corrección concreta, sin tener que leer el reporte, saber qué gate tengo que volver a pasar, y cerrar la deuda que registró ADR-0008

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol real, acciones concretas y beneficio observable. El `Quiero` junta dos pedidos (los gates escriben las directivas y los ejecutores anuncian el origen); eso pesa en S, no en el formato. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 principal, AC-2 alternativo y AC-3 de error como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Y/Cuando/Entonces/Pero`; AC-1 y AC-3 son Scenario Outline con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Depende de STORY-186 (SPECIFY/DONE; ADR-0022 todavía no existe en `docs/adr/`), que fija la fuente de la ronda anterior, la dimensión de verify y la lista blanca de acceptance. AC-1 necesita además STORY-189 (SPECIFY/DONE) para el estado `IMPLEMENT/TODO`. Las dependencias están declaradas y la plantilla puede avanzar con valores provisionales. |
| **N** – Negociable | 4 | Fija resultados observables (`based-on`, número de filas, `round`, aviso del ejecutor) y deja al ADR la fuente de la ronda y la lista blanca. La ruta de la plantilla y las copias semilla están decididas de antemano, pero responden a convenciones del repositorio. |
| **V** – Valiosa | 4 | Un rechazo de VERIFY o de ACCEPTANCE deja de perderse: llega al ejecutor como corrección concreta y el usuario sabe qué gate debe volver a pasar. Cubre CS-3 y SMOKE-4 de la épica y cierra la deuda de ADR-0008. |
| **E** – Estimable | 3 | El contrato actual de `story-code-review` sirve de base, pero el volumen es alto: plantilla nueva con tres copias semilla y registro en el README, dos escritores nuevos, `round` con tres escritores y cambios en dos ejecutores, con evals en cinco skills. La fuente de la ronda queda abierta hasta que se acepte el ADR. |
| **S** – Small | 1 ⚠️ | 6 escenarios contando las filas de Ejemplos (AC-1: 3, AC-2: 1, AC-3: 2), unos 16 pasos, 9 CNF y cambios en cinco `SKILL.md` con sus evals. Supera el umbral de épica de la rúbrica (≥ 6 escenarios, ≥ 11 pasos). Se decide aprobar igual. |
| **T** – Testeable | 4 | Los Outline tienen valores concretos (`based-on`, filas, `round: 2`, ejecutores). «La dimensión de verify que nombra el ADR» y «la fuente versionada que fija el ADR» solo se pueden comprobar cuando ADR-0022 exista. |

**INVEST_Score = (2 + 4 + 4 + 3 + 1 + 4) / 6 = 3.00 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 1 / 5 ⚠️ Se decide aprobar igual.
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.00 / 5.0

---

## Comentarios y Recomendaciones

- **S – Small (1) ⚠️:** la reagrupación del 2026-11-13 tiene sentido para la plantilla común y la regla de `round`, pero los ejecutores no diseñan ni la plantilla ni `round`: solo leen `based-on`, que ya escribe hoy `story-code-review`. Propuesta de `/story-split` que respeta el motivo de la reagrupación:
  - **Core (STORY-190):** plantilla común, escritores de verify y acceptance, y `round` continuo (AC-1 sin la última línea del `Entonces`, AC-2, CNF-1 a CNF-4, CNF-7 y CNF-8). Quedan 4 escenarios.
  - **Hermana (ejecutores):** el anuncio del origen del rework a partir de `based-on` y el aviso de `IMPLEMENT/TODO` sin `fix-directives.md` (AC-3, la última línea de AC-1 y CNF-5). Quedan 2 o 3 escenarios, y puede empezar en cuanto STORY-189 esté entregada, sin esperar a ADR-0022.
  - Para bajar más, se pueden fusionar las dos filas de verify de AC-1 en una con un defecto CRITICAL y un criterio del DoD fallido (2 filas esperadas).
- **I – Independencia (2):** no planificar hasta que ADR-0022 esté aceptado. Entonces, sustituir en AC-1, AC-2, CNF-2 y CNF-4 «lo que fija/nombra el ADR» por el valor concreto.
- **E – Estimable (3):** al planificar, separar en `tasks.md` la plantilla común con la no-regresión de `story-code-review` (CNF-7) de cada escritor nuevo, para estimar cada bloque por su cuenta.
- **Trazabilidad (fuera de FINVEST):** `related` incluye STORY-198 y STORY-199, que ya no existen ni en `specs/flow/` ni en `specs/flow/archive/` porque esta historia las absorbió. Conviene retirarlas o dejar que `/epic-refine` las marque como referencias rotas (MAD-02).

Se decide aprobar igual.
