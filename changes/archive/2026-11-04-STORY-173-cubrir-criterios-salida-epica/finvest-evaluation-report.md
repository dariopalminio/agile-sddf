---
type: finvest-evaluation
story-id: STORY-173
finvest-score: 4.02
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.02 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Product Owner
> **Quiero** que `/epic-refine EPIC-NN` asigne cada criterio de salida o smoke test sin cobertura a una única historia que ya lo verifica parcialmente
> **Para** que la épica supere el análisis de criterios de salida sin elegir ni editar a mano la historia dueña, y sin repartir citas que falseen la cobertura.

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` presente; rol real (PO), acción concreta (asignar la cobertura a una única historia) y beneficio observable (superar SAL-01/SAL-02 sin edición manual ni citas falsas). Detalle menor: los AC hablan del «mantenedor» y no del PO. |
| Criterios de aceptación | 5 | `## ✅ Criterios de aceptación` con AC-1 (escenario principal) y AC-2 (escenario alternativo) nombrados como `###`. |
| Escenarios Gherkin | 4 | Dos bloques ` ```gherkin ` bien formados con `Dado/Y/Cuando/Entonces`. Sin `Pero` ni Scenario Outline. |

**F_score = (5 × 0.4) + (5 × 0.3) + (4 × 0.3) = 4.70 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Amplía el skill `epic-refine`, que crea STORY-165 (hoy en `SPECIFY/DONE`, sin implementar; `skills/epic-refine/` no existe). Reutiliza su plan de cambios, sus backups y `epic-refine-report.md`. La lógica SAL se puede diseñar por separado, pero no se puede entregar antes. Es independiente de STORY-174. |
| **N** – Negociable | 4 | Fija la regla de negocio (historia de cierre, derivación al PO) y deja el cómo en una «propuesta no vinculante» para `story-design`. Los CNF-4 (`references/`, < 500 líneas) y «usar skill-master» acotan algo la solución. |
| **V** – Valiosa | 4 | Valor claro y observable: el PO no elige ni edita a mano la historia dueña y la épica supera SAL-01/SAL-02 en `epic-analyze`. CNF-2 protege la confiabilidad de la cobertura. |
| **E** – Estimable | 3 | La regla central («la historia sin dependientes en el índice de `epic.md`») depende de una notación que no existe: el índice de EPIC-23 y `epic-template.md` no declaran dependencias entre historias (son líneas `- [ ] STORY-NNN — …`). Además, el diseño depende de las decisiones de STORY-165. |
| **S** – Small | 3 | 2 escenarios (7 + 5 pasos) y un alcance acotado a SAL-01/SAL-02 con evidencia `parcial`. Tamaño ideal. |
| **T** – Testeable | 4 | Ambos AC tienen salidas concretas y verificables (qué `story.md` cita `CS-1`, la línea literal en `epic-refine-report.md`). Hay huecos: SAL-02 (`SMOKE-<N>`) y los empates («ninguna o varias cumplen la regla») no tienen escenario, y AC-1 no comprueba que se cumpla CNF-2. |

**INVEST_Score = (2 + 4 + 4 + 3 + 3 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.02 / 5.0

---

## Comentarios y Recomendaciones

La historia queda aprobada con un margen mínimo (4.02). Conviene atender las recomendaciones de E e I y la tensión entre AC-1 y CNF-2 antes de `/story-plan`, porque afectan al diseño.

### I – Independencia (2)

- Se acepta la dependencia de STORY-165 porque la historia nace de un split, pero hay que dejarla explícita: en `## 📎 Notas`, indicar qué artefacto de STORY-165 se reutiliza (plan de cambios, formato de backup, secciones de `epic-refine-report.md`). Así `story-design` puede trabajar contra ese contrato aunque STORY-165 no esté implementada.
- Planificar STORY-173 solo después de que STORY-165 llegue al menos a `PLAN/DONE`, para no diseñar sobre un skill cuyo contrato puede cambiar.

### E – Estimable (3)

- **Definir de dónde sale la relación «tiene dependientes».** El índice de `epic.md` no declara dependencias, así que la regla de la historia de cierre no se puede evaluar con lo que hay. Elegir una fuente y escribirla en `## 📎 Notas`, por ejemplo:
  - una notación en las líneas del índice (`— depende de STORY-NNN`), que tendría que añadirse también a `epic-template.md`, o
  - el campo `related` de los `story.md`, o
  - una regla sin dependencias (ej. la de mayor `STORY-NNN`, o la última del índice).
- Si la fuente obliga a cambiar `epic-template.md` o `epic-format-validation`, decidir si entra en esta historia o en otra.

### S – Small (3)

- El tamaño es adecuado. No añadir escenarios para SAL-02 si eso obliga a un Scenario Outline grande; basta con una tabla corta (ver T).

### T – Testeable (4)

- **Tensión entre AC-1 y CNF-2.** CNF-2 prohíbe escribir una cita E1 en una historia que no verifica el criterio completo, pero AC-1 hace que STORY-302, que solo aporta evidencia `parcial`, cite `CS-1`. Con eso, `epic-analyze` la daría por cubierta. Según `## 📎 Notas`, para cumplir CNF-2 hay que añadir un AC de cierre global, pero eso está como propuesta no vinculante. Añadir a AC-1 un paso observable, por ejemplo:
  `Y el "story.md" de "STORY-302" incluye un AC cuyo "Entonces" afirma el resultado completo de "CS-1"`
- Cubrir SAL-02 sin agrandar la historia: convertir AC-1 en un Scenario Outline con dos filas (`CS-1` / SAL-01 y `SMOKE-1` / SAL-02).
- Añadir a AC-2 (con `Pero`) o a un AC-3 breve el caso en que varias o ninguna historia con evidencia `parcial` cumplen la regla de cierre. El hallazgo va al PO, y es la regla de negocio más propensa a errores.

### F – Formato (4.70)

- Unificar el rol: la historia habla del «Product Owner» y los AC del «mantenedor». Usar el mismo actor en ambos sitios.
