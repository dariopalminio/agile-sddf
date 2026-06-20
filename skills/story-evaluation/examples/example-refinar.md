# Ejemplo: Decisión Refinar

Este ejemplo muestra una historia que usa parcialmente el template — tiene las secciones principales y un escenario Gherkin en bloque de código, pero le faltan escenarios alternativos, el beneficio no es medible y la testeabilidad es limitada.

## Historia evaluada

---

## 📖 Historia

**Como** vendedor,
**Quiero** ver mis leads del mes con su estado actual,
**Para** hacer seguimiento de mis oportunidades de venta.

## ✅ Criterios de aceptación

- El vendedor ve únicamente los leads asignados a él en el mes en curso
- Cada lead muestra: nombre del contacto, empresa y estado (Nuevo / En contacto / Calificado)
- Si no hay leads asignados en el mes, se muestra el mensaje "No tenés leads asignados este mes"

```gherkin
Dado que soy un vendedor autenticado con 3 leads asignados en el mes actual
Cuando accedo al módulo de leads
Entonces veo una lista con los 3 leads
  Y cada fila muestra nombre del contacto, empresa y estado
```

---

## Evaluación FINVEST

### Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Sección `## 📖 Historia` con `Como/Quiero/Para` | 4 | Sección y cláusulas presentes; `Para hacer seguimiento de mis oportunidades de venta` es válido pero no cuantificado — falta métrica de negocio concreta |
| Sección `## ✅ Criterios de aceptación` con escenarios nombrados | 3 | Sección presente con 3 criterios reconocibles; falta estructura `###` con Escenario principal y Escenario alternativo nombrados |
| Gherkin en bloques ` ```gherkin ` | 3 | 1 escenario en bloque bien formado con `Dado/Cuando/Entonces` y `Y`; falta escenario alternativo (ej. sin leads en el mes) |

**F_score = (4 × 0.4) + (3 × 0.3) + (3 × 0.3) = 1.60 + 0.90 + 0.90 = 3.40 / 5.0**

✅ F_score = 3.40 ≥ 2.5 — Continúa a evaluación INVEST

### Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende del módulo de autenticación y de que existan leads en el sistema; ambas dependencias son desacoplables con datos seedeados |
| **N** – Negociable | 3 | Define el qué (lista con estado) y el para qué; no promueve conversación sobre columnas visibles, ordenamiento ni paginación |
| **V** – Valiosa | 3 | Valor claro para el vendedor pero no cuantificado — "hacer seguimiento" no expresa métrica observable |
| **E** – Estimable | 4 | Vista filtrada de lista es CRUD estándar; estimable con confianza por cualquier desarrollador con experiencia |
| **S** – Small | 3 | 1 escenario con 4 pasos, criterios bien definidos — historia pequeña pero con algo de complejidad de dominio |
| **T** – Testeable | 3 | 1 escenario Gherkin en bloque de código cubriendo el caso feliz con datos concretos; falta escenario alternativo (sin leads) |

**INVEST_Score = (3 + 3 + 3 + 4 + 3 + 3) / 6 = 19 / 6 = 3.17 / 5.0**

### Resultado Final

**F – Formato:** 3.40 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 3 / 5

**FINVEST Score:** (3.40 + 3.17) / 2 = **3.28 / 5.0**
**FINVEST Decisión:** 🟡 **Refinar**

### Comentarios y Recomendaciones

- **F – Formato (3.40):**
  - Agregar subapartados `###` dentro de `## ✅ Criterios de aceptación`: uno para "Escenario principal" y otro para "Escenario alternativo / error"
  - Agregar un segundo escenario Gherkin cubriendo el caso sin leads asignados en el mes
- **N – Negociable (3):** Dejar explícitamente abiertos puntos de diseño: ¿se pagina la lista?, ¿se pueden filtrar leads por estado?, ¿qué columnas son negociables?
- **V – Valiosa (3):** Conectar a una métrica observable. Ejemplo: "Para reducir el tiempo de búsqueda de leads activos de 5 minutos a menos de 30 segundos"
- **T – Testeable (3):** Agregar escenario alternativo en Gherkin:
  ```gherkin
  Dado que soy un vendedor autenticado sin leads asignados en el mes actual
  Cuando accedo al módulo de leads
  Entonces veo el mensaje "No tenés leads asignados este mes"
  ```
- **Acción:** Refinar con el PO en grooming. Foco en: definir métrica de valor, agregar escenario de borde y abrir puntos negociables de UI.
