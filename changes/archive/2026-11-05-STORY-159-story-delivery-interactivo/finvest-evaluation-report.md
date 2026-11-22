---
type: finvest-evaluation
story-id: STORY-159
finvest-score: 4.33
verdict: APPROVED
evaluated: 2026-10-25
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.33 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que tiene una historia aceptada en el flujo SDD flow-forward con `delivery-model: batch`
> **Quiero** ejecutar `/story-delivery STORY-NNN` para verificar criterio por criterio el DoD de `docs/guardrails/dod-story-deliver.md` y llevar la historia a `DELIVER/DONE` con mi confirmación
> **Para** registrar que el incremento está listo para producción con evidencia del DoD, sin editar el frontmatter a mano ni saltarme los criterios de entrega

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` igual al template. Rol real y acotado (Solo Builder en `batch`), acción concreta (`/story-delivery STORY-NNN` con confirmación) y beneficio observable (incremento registrado como listo para producción con evidencia del DoD). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1), escenario de error (AC-2) y escenario de dominio (AC-3), todos como subapartados `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`. AC-2 es un Scenario Outline con tabla `Ejemplos` y AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Todo lo que necesita ya existe: `defaults.delivery-model: batch` en `sddf.config.yaml` y `docs/guardrails/dod-story-deliver.md`. STORY-162 y STORY-163 extienden esta historia y STORY-160 depende de ella, no al revés. Lo único compartido es el ajuste de los documentos de dominio con STORY-160, y ya está señalado en las Notas. |
| **N** – Negociable | 4 | Fija resultados, no soluciones. Las decisiones que estaban abiertas quedaron en Fuera de alcance (override, `delivery-model` ausente) o se resolvieron como propuesta negociable con alternativa («no aplica en batch» frente al tarball de `npm pack`). La forma de evidenciar cada criterio queda como orientación para el diseño. «Byte a byte» se movió a CNF-3. |
| **V** – Valiosa | 4 | Valor claro y observable: cierra el tramo ACCEPTANCE → DELIVER del flujo con evidencia del DoD y sin editar el YAML a mano. Es un valor cualitativo; no tiene métrica cuantitativa. |
| **E** – Estimable | 4 | Ya se puede estimar con confianza (talla S/M). La contradicción entre el DoD y `batch` está resuelta en AC-1. Las Notas clasifican cómo se evidencia cada criterio: por comando, leyendo artefactos o con confirmación humana. AC-3 nombra los tres documentos y sus ubicaciones exactas, todas verificadas en el repo. Queda poca incertidumbre: elegir entre «no aplica» y `npm pack`. |
| **S** – Small | 2 | 3 escenarios, más 2 filas adicionales de `Ejemplos`: 5 casos en total, en la banda 4–5. Suman unos 16 pasos. Además del skill nuevo, toca tres documentos de dominio y `package.json`. Bajó claramente respecto de la versión anterior (7 casos, unos 28 pasos) y no llega al umbral de split (≥ 6 casos). |
| **T** – Testeable | 4 | AC-1 define la evidencia de forma verificable (✅/❌/«no aplica en batch» más el comando o archivo). AC-2 es un Outline con datos concretos y un resultado comprobable («`story.md` no cambia»). AC-3 se puede comprobar leyendo los documentos. Queda una limitación: los valores de `motivo` describen el contenido, no son mensajes exactos, y «build de CI pasa» depende de una confirmación humana. |

**INVEST_Score = (4 + 4 + 4 + 4 + 2 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.33 / 5.0

---

## Comentarios y Recomendaciones

### S – Small (2)

- **No hace falta otro split:** S = 2 no es crítico y la historia ya pasó por dos patrones de Lawrence. Separar AC-3 en una historia aparte no conviene, porque el cambio de dominio es lo que autoriza al skill a escribir `DELIVER` y entregarlo sin él dejaría el dominio incoherente.
- **Controlar el tamaño en `story-tasking`:** agrupar las tareas en tres bloques independientes (skill + AC-1/AC-2, documentos de dominio para AC-3, publicación en CNF-2). Si el diseño elige verificar el criterio de instalación con el tarball de `npm pack` en lugar de «no aplica en batch», revisar el tamaño: suma ejecución de comandos y limpieza.

### Otras observaciones (score > 3)

- **E / AC-3:** la nota sobre `docs/domains/domain.md` menciona, además de BR-006, el resumen de substatus («los terminales requieren acción humana o CI/CD», línea 109), pero AC-3 solo exige que lo declaren «los tres documentos». Conviene que el `Entonces` (o un `Y`) incluya también ese resumen, para que la verificación no lo pase por alto. La fila DELIVER de `domain-story-lifecycle.md` también tiene la columna de escritor «Humano / CI-CD», que debe incluir a `story-delivery`.
- **T / AC-2:** en el diseño, fijar el texto o el patrón de cada `motivo` (p. ej. «estado actual: VERIFY/DONE; se requiere ACCEPTANCE/DONE») para que el Outline se pueda automatizar con comparación exacta.
- **T / AC-1:** aclarar en el diseño cómo se presenta el criterio «El build de CI pasa sin errores»: ¿confirmación humana con una marca distinta de ✅/❌, o como resultado de `npm run verify:repository`?
- **I:** mantener la coordinación con STORY-160 indicada en las Notas: esta historia deja `COMPLETED` sin escritor y STORY-160 lo autoriza, sin volver a reescribir el mismo invariante.
