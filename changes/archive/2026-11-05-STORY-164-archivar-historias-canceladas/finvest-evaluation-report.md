---
type: finvest-evaluation
story-id: STORY-164
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-10-25
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que canceló una historia
> **Quiero** archivarla con `/story-complete STORY-NNN` en `specs/flow/archive/` sin que deje de figurar como `CANCELED`
> **Para** sacar de `specs/flow/` el trabajo que ya no se hará, sin que una historia cancelada se confunda con una entregada en el registro histórico

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección `# 📖 Historia` presente; rol real (Solo Builder que canceló una historia), acción concreta (archivar sin cambiar el status) y beneficio observable (`specs/flow/` sin trabajo descartado, cancelada distinguible de entregada). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1), escenario de error (AC-2) y escenario de dominio (AC-3), todos nombrados como `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin `; AC-1 y AC-2 son Outlines con tabla `Ejemplos`; AC-1 y AC-3 usan `Y` en el `Entonces`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | AC-1 y AC-2 extienden el skill `story-complete`, que aún no existe: lo crea STORY-160 (`SPECIFY/DONE`, no entregada). Solo AC-3 (ADR nuevo y documentación) puede avanzar en paralelo, como indica la nota de dependencia. La simulación es parcial. |
| **N** – Negociable | 3 | El qué y el por qué están claros y los mensajes se describen por su contenido («nombra el estado actual»), no por su texto literal. Pero AC-3, CNF-2 y CNF-3 fijan de antemano los archivos a tocar (ADR que reemplaza a ADR-0016, `AGENTS.md`, `docs/constitution.md`, dos documentos de dominio, `scripts/verify-fixed-layout.js`), lo que deja poco margen para negociar el cómo. |
| **V** – Valiosa | 4 | Valor claro y observable para el Solo Builder: `specs/flow/` muestra solo trabajo activo y el archivo distingue canceladas de entregadas. El invariante de conteo (CNF-4) hace verificable que no se pierde nada. |
| **E** – Estimable | 4 | Alcance acotado y conocido: una rama nueva en `story-complete`, la cadena `updated:` → `created:` → `date:` ya implementada en `archiveDate` (`scripts/migrate-specs-to-flow.js:76`, exportada), un ADR de reemplazo y actualizaciones de documentación. Incertidumbre menor en CNF-3 (ver comentarios). |
| **S** – Small | 3 | El conteo mecánico da 6 casos (3 + 2 filas de `Ejemplos` + 1 escenario) y 11 pasos, que caerían en la banda 1. Se puntúa 3 por criterio: las 3 filas de AC-1 son variantes de un mismo paso (elegir la fecha) y las 2 de AC-2 son guardas del mismo comando con 3 pasos. Hay tres comportamientos distintos: archivar, rechazar y documentar la regla. Es un caso nuevo de un skill existente, más pequeño que STORY-160. |
| **T** – Testeable | 4 | AC-1 y AC-2 son Outlines con datos concretos y resultados verificables de forma automática (ruta final, directorio ausente, frontmatter sin cambios, conteo invariante). AC-3 se verifica revisando documentos («describen la regla de archivo»), lo que es menos automatizable. |

**INVEST_Score = (2 + 3 + 4 + 4 + 3 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 3 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

### I – Independencia (2)

La dependencia de STORY-160 es real: sin el skill `story-complete` no hay dónde añadir el caso `CANCELED/DONE`. Dos formas de subirla a 3:

- En las notas, separar de forma explícita el trabajo que puede empezar ya (AC-3: ADR nuevo, `AGENTS.md`, `docs/constitution.md`, `docs/domains/`) del que espera a STORY-160 (AC-1 y AC-2).
- En `/story-testcases`, definir los casos de AC-1 y AC-2 sobre fixtures en un directorio temporal, sin depender del estado de STORY-160, para que las pruebas puedan escribirse en cuanto exista el esqueleto del skill.

### N – Negociable (3)

AC-3 y CNF-2 enumeran los documentos concretos a modificar. Es razonable porque el ADR es obligatorio (los ADR aceptados son inmutables), pero conviene expresar el resultado y dejar la lista de archivos para `/story-design`. Por ejemplo:

```gherkin
Entonces un ADR nuevo reemplaza a ADR-0016 (superseded-by) y admite en el archivo las historias COMPLETED y CANCELED
  Y ningún documento de autoridad (AGENTS.md, constitución, dominios) contradice la regla del ADR nuevo
```

### S – Small (3)

El tamaño es adecuado. Si en `/story-tasking` la estimación supera una entrega, la parte natural a separar es AC-3 (ADR y documentación), que además no depende de STORY-160.

### T – Testeable (4) — nota

- AC-3 usa como `Cuando` «se completa esta historia», que no es una acción observable. Para automatizarlo, conviene reformularlo como una comprobación: por ejemplo, que `npm run verify:repository` pase y que ADR-0016 tenga `superseded-by` apuntando a un ADR `accepted`.
- Los Outlines usan `Escenario:` con `Ejemplos`, igual que `story-template.md`. Un parser Gherkin estricto exige `Esquema del escenario:`; tenerlo en cuenta si se automatizan tal cual.

### E – Estimable (4) — nota sobre CNF-3

`scripts/verify-fixed-layout.js` no inspecciona hoy el `status` de las historias dentro de `specs/flow/archive/`. Ningún script de `scripts/` lo hace, salvo `migrate-specs-to-flow.js`. Por eso CNF-3 puede cumplirse sin cambios o exigir un check nuevo. Aclarar en `/story-design` cuál de las dos cosas pide la historia: «no rechaza» o «valida que solo haya `COMPLETED`/`CANCELED`».
