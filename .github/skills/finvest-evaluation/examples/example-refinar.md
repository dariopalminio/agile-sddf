# Ejemplo: Decisión Refinar

Este ejemplo muestra una historia escrita sin usar el template (texto libre, sin secciones ni bloques gherkin), lo que baja el F_score pero no lo suficiente para rechazarla.

## Historia evaluada

---

**Como** vendedor,
**Quiero** ver mis leads del mes,
**Para** hacer seguimiento.

Criterios de aceptación:
- Que se listen los leads asignados a mí
- Que muestre el estado de cada lead

Escenario: Ver lista de leads
  Dado que soy un vendedor autenticado
  Cuando accedo al módulo de leads
  Entonces veo la lista de leads del mes actual

---

## Evaluación FINVEST

### Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Sección `## 📖 Historia` con `Como/Quiero/Para` | 3 | `Como/Quiero/Para` presente y legible, pero sin encabezado de sección `## 📖 Historia`; `Para hacer seguimiento` es genérico sin especificar el beneficio concreto |
| Sección `## ✅ Criterios de aceptación` con escenarios nombrados | 2 | Criterios presentes como lista libre; sin encabezado de sección ni escenarios nombrados con `###`; "estado de cada lead" no especifica qué estados |
| Gherkin en bloques ` ```gherkin ` | 2 | Gherkin presente pero fuera de bloque de código; solo cubre happy path sin alternativas ni `Y` |

**F_score = (3 × 0.4) + (2 × 0.3) + (2 × 0.3) = 1.2 + 0.6 + 0.6 = 2.4 / 5.0**

> **Nota:** F_score = 2.4 < 2.5 → Técnicamente rechazable por formato. Sin embargo, para ilustrar el caso "Refinar" ajustamos el ejemplo a un F_score frontera:

_(Versión ajustada con F_score = 2.5 — escenario con bloque de código mínimo)_

Si el escenario estuviera en un bloque ` ```gherkin ` (score 3 en C3):

**F_score = (3 × 0.4) + (2 × 0.3) + (3 × 0.3) = 1.2 + 0.6 + 0.9 = 2.7 / 5.0**

✅ F_score = 2.7 ≥ 2.5 — Continúa a evaluación INVEST

### Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Requiere módulo de autenticación y entidad Lead existente; desacoplado si se mockean datos |
| **N** – Negociable | 3 | Tiene el qué y el por qué; deja espacio limitado para negociar columnas, filtros, ordenamiento |
| **V** – Valiosa | 3 | Valor claro para el vendedor, pero no cuantificado (¿cuánto mejora la productividad?) |
| **E** – Estimable | 4 | Estimable con confianza moderada; depende de si el modelo Lead ya existe |
| **S** – Small | 4 | 1 escenario Gherkin, historia pequeña con pocos pasos |
| **T** – Testeable | 2 | Sin Gherkin en bloque de código; solo cubre happy path; no hay escenario de error ni datos límite |

**INVEST_Score = (3 + 3 + 3 + 4 + 4 + 2) / 6 = 19 / 6 = 3.2 / 5.0**

### Resultado Final

**F – Formato:** 2.7 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 4 / 5
**T – Testeable:** 2 / 5

**FINVEST Score:** (2.7 + 3.2) / 2 = **2.95 / 5.0**
**FINVEST Decisión:** 🟡 **Refinar**

### Comentarios y Recomendaciones

- **F – Formato (2.7):** Reescribir usando el template `story-gherkin-template.md`:
  - Agregar sección `## 📖 Historia` con `Como/Quiero/Para` más específico (ej. "Para priorizar mis llamadas del día")
  - Agregar sección `## ✅ Criterios de aceptación` con escenarios nombrados (`### Escenario principal`, `### Escenario alternativo`)
  - Mover el Gherkin a bloque ` ```gherkin ` con `Y` para condiciones adicionales
- **N – Negociable (3):** Explicitar qué aspectos son negociables: ¿columnas visibles?, ¿filtro por estado?, ¿paginación?
- **V – Valiosa (3):** Conectar a métrica de negocio (ej. "reducir tiempo de búsqueda de leads de 5 min a < 30 seg")
- **T – Testeable (2):** Agregar escenario alternativo: sin leads en el mes, leads de otro vendedor (no visibles)
- **Acción:** Refinar en grooming con el PO antes de entrar a sprint. Prioridad: Formato y Testeabilidad.
