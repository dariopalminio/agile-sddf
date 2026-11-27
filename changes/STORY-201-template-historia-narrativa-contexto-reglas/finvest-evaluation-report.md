---
type: finvest-evaluation
story-id: STORY-201
finvest-score: 4.05
verdict: APPROVED
evaluated: 2026-11-27
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.05 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que especifica historias con agile-sddf
> **Quiero** que el template de historia tenga una sección de narrativa, una de contexto y valor y una de reglas de negocio trazadas a los AC
> **Para** que cada historia generada explique por qué importa y declare sus reglas transversales una sola vez, sin repetirlas en cada escenario

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | Encabezado `# 📖 Historia:` según el template vigente y las tres cláusulas completas, con un rol real. El `Quiero` describe el artefacto (el template con tres secciones) más que una acción del usuario, y el `Para` es cualitativo. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con `### AC-1` (principal), `### AC-2` (alternativo) y `### AC-3` (compatibilidad), todos con nombre. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces`; AC-2 incluye `Pero`. |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | No depende de ninguna historia pendiente ni de una épica. Toca la documentación de varios skills consumidores (AC-3), pero ninguno la bloquea. |
| **N** – Negociable | 3 | El qué y el por qué están claros, pero AC-1 fija los siete encabezados literales y las Notas traen el template completo como ejemplo: queda poco margen para negociar la forma. Es razonable, porque el entregable es el propio template. |
| **V** – Valiosa | 3 | El valor para quien redacta historias es claro (contexto explícito, reglas declaradas una vez), pero es subjetivo y no hay ninguna métrica que lo observe. |
| **E** – Estimable | 4 | Editar los dos templates es trivial. AC-3 añade una revisión acotada de seis skills ya identificados en las Notas, lo que permite una estimación confiable. |
| **S** – Small | 3 | Tres escenarios (rango ideal), pero 15 pasos en total y un AC-3 que abarca la documentación de cinco skills. Está en el límite superior de «pequeña». |
| **T** – Testeable | 4 | AC-1 se verifica con un `diff` y la lista de encabezados, y AC-3 con el código de salida del gate. El último paso de AC-3 («la documentación … reconoce ambos encabezados») no tiene una comprobación objetiva definida, y AC-2 depende de una ejecución del LLM. |

**INVEST_Score = (4 + 3 + 3 + 4 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 4.60 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.05 / 5.0

---

## Comentarios y Recomendaciones

**N – Negociable (3):**
- Deja el ejemplo completo de las Notas como referencia de diseño, no como contrato, y que AC-1 verifique solo lo esencial: orden de secciones, secciones optativas marcadas *(si aplica)* y trazabilidad `→ cubierta por`.

**V – Valiosa (3):**
- Añade un indicador observable al `Para`, por ejemplo: «… sin repetirlas en cada escenario, de modo que `/story-design` y `/story-testcases` encuentren las reglas transversales en una sola sección».

**S – Small (3):**
- Si al planificar AC-3 la actualización de los consumidores resulta más grande de lo previsto, sepárala en una historia hermana («Compatibilidad de skills consumidores con los encabezados nuevos») con `/story-split`.

**Inconsistencias detectadas en la historia (no afectan al veredicto, conviene corregirlas antes de planificar):**
1. **Bloque de código anidado roto:** el ejemplo de las Notas abre ` ```markdown ` y contiene bloques ` ```gherkin `. El primer ` ``` ` interno cierra el bloque exterior, de modo que el resto del ejemplo se renderiza como Markdown activo, con encabezados `##` reales dentro de la sección de Notas. Un skill que localiza secciones por encabezado (por ejemplo `epic-refine` con `## 📎 Notas` o `story-acceptance` con `## ✅ Criterios de aceptación`) podría confundirse con esos encabezados. Usa una valla exterior de cuatro acentos graves (` ```` `) o de tildes (`~~~`).
2. **Guion vs. raya en los AC:** las Notas deciden «unificar a `-`», pero AC-1 no lo verifica. La propia historia y el `### AC-<k+1> — …` que genera `epic-refine` (`skills/epic-refine/references/sal-corrections.md:83`) siguen con `—`. Añade a AC-1 un paso como `Y los encabezados de AC del template siguen el formato "### AC-<n> - …"` y decide si `epic-refine` se alinea.
3. **Espacio doble en un encabezado:** el ejemplo escribe `## 🔗 Notas adicionales (Dependencias, supuestos y notas)  *(si aplica)*` con dos espacios, mientras AC-1 exige un solo espacio. Unifica a uno.
4. **Paso verificable en AC-3:** reemplaza «reconoce tanto el encabezado anterior como el nuevo» por una comprobación objetiva, por ejemplo «cada skill listado nombra ambos encabezados o busca por el prefijo común».
