---
type: finvest-evaluation
story-id: STORY-149
finvest-score: 4.10
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.10 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** practitioner que inicializa SDDF en un proyecto
> **Quiero** que `/sddf-init` cree `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` en la raíz y deje de escribir la clave `root` en `sddf.config.yaml`
> **Para** empezar a especificar con el layout fijo sin configurar nada, y sin duplicar estructura si mi proyecto aún usa `docs/specs/`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` presente; rol real, acción concreta y beneficio específico (arrancar sin configurar y sin duplicar estructura). |
| Criterios de aceptación | 5 | Sección con AC-1 principal y AC-2/AC-3 alternativos como subapartados `###`. |
| Escenarios Gherkin | 4 | 3 escenarios en bloques ` ```gherkin ` bien formados, con `Y`; no hay `Pero` ni Scenario Outline con `Ejemplos`, que son los requisitos del nivel 5. |

**F_score = (5 × 0.4) + (5 × 0.3) + (4 × 0.3) = 4.70 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Parte de la decisión de STORY-147 y la notas indican que la guía enlazada en AC-2 se completa en STORY-154 (hoy `docs/guides/artifact-directory-migration.md` existe, pero su contenido final depende de esa historia). El orden es flexible porque el aviso solo necesita la ruta. |
| **N** – Negociable | 3 | El qué y el por qué son claros; las rutas exactas y el `.gitkeep` están fijados por el ADR de la épica, dejando poco margen sobre el cómo. |
| **V** – Valiosa | 4 | Beneficio claro y observable para quien inicializa: layout listo sin configuración y sin estructura duplicada en proyectos legados. |
| **E** – Estimable | 4 | Cambio acotado en un skill existente (`skills/sddf-init`) con comportamiento idempotente y detección de `docs/specs/`; estimable con confianza. |
| **S** – Small | 3 | 3 escenarios con 15 pasos en total, pero cada uno de ≤ 6 pasos; tamaño razonable para una entrega. |
| **T** – Testeable | 4 | Condiciones verificables por inspección del filesystem y del `sddf.config.yaml`; cubre caso feliz, legado e idempotencia; CNF-2 exige evals. |

**INVEST_Score = (3 + 3 + 4 + 4 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.10 / 5.0

---

## Comentarios y Recomendaciones

Ninguna dimensión es crítica (score = 1). Recomendaciones no bloqueantes para las dimensiones con score ≤ 3:

- **F3 (4):** Añadir un `Pero` en AC-2 (por ejemplo, «Pero el resto del repositorio no se modifica») o convertir AC-3 en un Scenario Outline con `Ejemplos` (por ejemplo, carpetas ya existentes con y sin contenido) para alcanzar el nivel 5.
- **I (3):** Explicitar en Notas que el aviso de AC-2 solo exige la ruta de la guía y no su contenido final, de modo que la historia pueda cerrarse antes de STORY-154; o declarar la dependencia con STORY-147 en `related`.
- **N (3):** Mover la mención de `.gitkeep` desde el AC-1 a una nota de implementación, dejando en el criterio solo la existencia de los directorios.
- **S (3):** Mantener el alcance actual; si en planning crece la lógica de detección del layout legado, considerar separar AC-2 como historia hermana.
