---
type: finvest-evaluation
story-id: STORY-179
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-11-08
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** mantenedor de agile-sddf que revisa sus historias con `/story-code-review`
> **Quiero** un `REVIEW.md` en la raíz, hecho desde `docs/templates/REVIEW-template.md`, con las cuatro secciones de la convención (qué es importante en cada área del repo, tope de nits, qué no reportar y qué verificar siempre) y con las reglas propias del repo que hoy viven dentro de los agentes
> **Para** que la revisión juzgue con los riesgos reales de este repositorio: que deje de bloquear por ruido (fixtures con secretos falsos, copias de instalación, LOW repetidos entre rondas) y que no pase por alto los defectos que ya costaron rondas, como los caracteres invisibles o un ADR aceptado editado in place

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección de historia presente, con rol real (quien revisa con `/story-code-review`), acción concreta y beneficio con ejemplos observables (fixtures con secretos falsos, copias de instalación, LOW repetidos). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1), escenario con datos (AC-2) y escenario alternativo (AC-3), todos nombrados como subapartados. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` con `Dado/Cuando/Entonces/Y/Pero`, un Scenario Outline con tabla `Ejemplos` (AC-2) y un escenario alternativo con `Pero` (AC-3). |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Hay una dependencia blanda de STORY-178: CNF-1 pide la traducción de vocabulario «que fije el ADR» y las notas recomiendan implementar después. Está desacoplada, porque la propuesta de las notas de la épica sirve de valor provisional y el orden es flexible. |
| **N** – Negociable | 3 | Tiene el qué y el porqué, y deja a `design.md` decidir qué candidatos entran. Pero AC-2 fija de antemano en qué sección cae cada regla y AC-1 fija el tope en 5 LOW, lo que deja poco espacio para negociar el cómo. |
| **V** – Valiosa | 4 | El valor es claro y se apoya en evidencia observable (≈580 LOW en 55 de 71 reportes archivados; STORY-125 perdió una ronda por caracteres invisibles). No fija una métrica objetivo de reducción de ruido. |
| **E** – Estimable | 4 | Un solo archivo Markdown a partir de una plantilla existente, con borrador fuente referenciado (`mejora-015`, L60-L90) y rutas concretas de las reglas a copiar. Cualquier miembro del equipo lo estima con confianza. |
| **S** – Small | 2 | Contando las filas del Outline hay 9 instancias (AC-1, AC-3 y 7 filas de AC-2) y unos 30 pasos: la rúbrica literal daría 1. Pero las 7 filas son comprobaciones de ubicación sobre un mismo documento, y todo el trabajo es un archivo de unas 40 líneas. Se puntúa 2 y no 1 por ese motivo; con una lectura estricta del conteo, el veredicto pasaría a `SPLIT` (fila 3). |
| **T** – Testeable | 4 | AC-1 y AC-2 se verifican con búsquedas literales (secciones, orden, viñetas, ausencia de placeholders) y el Outline aporta datos concretos. AC-3 («cada ítem nombra una comprobación que `verify:repository` no ejecuta») exige juicio humano, así que no es del todo automatizable. |

**INVEST_Score = (3 + 3 + 4 + 4 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3):** la historia puede arrancar sin STORY-178, pero conviene fijar en `design.md` qué ocurre si el ADR ajusta la traducción de vocabulario. Por ejemplo, una nota que diga que `REVIEW.md` adopta la traducción del ADR y que la tabla de la épica es provisional. Así, el orden de entrega no bloquea la validación de CNF-1.

**N – Negociable (3):** para dejar más espacio de conversación, mueve a `design.md` el reparto exacto de las reglas candidatas (scripts que escriben fuera de `REPO_ROOT`, uso de `.agents` como destino, sobrescritura sin `--force`, artefactos generados). Deja en AC-2 solo las reglas que ya están cerradas.

**S – Small (2):** la historia es pequeña en esfuerzo, pero el conteo de escenarios es alto. Hay dos formas de reducirlo sin dividirla:
- Pasar las cuatro filas de «No reportar» y «Verificar siempre» a una sola aserción en AC-3, o
- Recortar el Outline a las reglas que no están ya cubiertas por una sección completa.

Si el equipo prefiere cerrar la historia con tamaño estricto, `/story-split` puede separar «reglas de Importante» de «reglas de No reportar / Verificar siempre».

**T – Testeable (4):** para que AC-3 sea automatizable, reformula «cada ítem nombra una comprobación que `verify:repository` no ejecuta» como una lista cerrada de ítems esperados en «Verificar siempre», comprobable por búsqueda literal. La parte «ninguna ruta citada deja de existir» ya se puede verificar con un script.
