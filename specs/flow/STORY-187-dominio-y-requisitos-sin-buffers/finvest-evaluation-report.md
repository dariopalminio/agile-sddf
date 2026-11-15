---
type: finvest-evaluation
story-id: STORY-187
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-11-13
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que consulta el dominio, la máquina de estados y los requisitos para entender el ciclo de vida de historias y épicas
> **Quiero** que `domain.md`, `domain-state-management.md`, `domain-story-lifecycle.md`, `domain-epic-lifecycle.md`, `domain-skills-map.md`, `state-machine.md`, NFR-006 y FR-043/044/045 describan los workflows sin buffers del ADR, con el rework de los tres gates en `IMPLEMENT/TODO`, sin WIP para una cola y con `TODO` como «pendiente de iniciar» en cualquier estado activo
> **Para** que el ciclo de vida que aprendo en la documentación de autoridad sea el mismo que escriben los skills en el frontmatter

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia:` y las tres cláusulas completas: rol real (lector de la documentación de autoridad), acción concreta sobre diez documentos y beneficio observable (lo que dice la documentación coincide con lo que escriben los skills). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 escenario principal, AC-2 escenario con datos y AC-3 escenario alternativo, todos como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Tres bloques `gherkin` con `Dado/Cuando/Entonces/Y`; AC-2 es un Scenario Outline con tabla `Ejemplos` y AC-3 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Depende de STORY-186 (hoy `SPECIFY/DONE`, el ADR aún no existe en `docs/adr/`), pero de forma desacoplada: los workflows, el destino del rework y la consulta de la cola ya están fijados en EPIC-029. Esperan al ADR su número (AC-1), su `ACCEPTED` y el contrato de `fix-directives.md` que describen FR-043/044/045. Coordina con STORY-192 el orden de madurez de `domain-story-lifecycle` §4.1 y §5. |
| **N** – Negociable | 4 | Fija resultados observables (workflows, destino del rework por documento, consulta de la cola) y deja abierta la redacción y reorganización de cada documento. CNF-1 remite cualquier regla nueva al ADR en lugar de decidirla aquí. |
| **V** – Valiosa | 3 | Valor claro para quien aprende el ciclo de vida en la documentación de autoridad, pero cualitativo: el beneficio es que el texto deje de contradecir a los skills. |
| **E** – Estimable | 4 | Diez documentos Markdown con 47 menciones de buffers contadas por archivo en Notas (verificado: los conteos coinciden con el `grep` actual), más las definiciones de «Buffer», WIP por buffer y BR-004. El contenido destino está en la épica. |
| **S** – Small | 2 | Siete casos (AC-1, las 5 filas de AC-2 y AC-3) y unos 13 pasos, con una tabla de 5 filas. Por la señal primaria (≥ 6 casos) correspondería 1, pero las cinco filas son una sola regla (el `NEEDS-CHANGES` vuelve a `IMPLEMENT/TODO`) aplicada a cada documento con una sola verificación (CNF-3), y la reagrupación con STORY-195 está justificada en Notas. Mismo criterio que STORY-197. |
| **T** – Testeable | 4 | Los workflows de AC-1 son cadenas exactas y CNF-3 da una comprobación objetiva (`grep -c` = 0 en cada documento). Las filas de AC-2 y AC-3 son paráfrasis que se verifican leyendo una sección, no con un comando. |

**INVEST_Score = (3 + 4 + 3 + 4 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

- **I – Independencia (3):** al planificar, redactar primero lo que ya fija EPIC-029 (workflows, destino del rework, consulta de la cola, retiro de «Buffer» y BR-004) y dejar para el final la cita del ADR y la descripción de `fix-directives.md` en FR-043/044/045, cuando STORY-186 esté `ACCEPTED`.
- **V – Valiosa (3):** CNF-3 ya da un indicador cuantitativo (de 47 a 0 menciones de `READY-FOR-IMPLEMENT`/`READY-FOR-DEV` en los diez documentos). Citarlo en el `Para` haría el valor medible.
- **S – Small (2):** la historia queda en el límite. Para bajar casos sin volver a dividirla, AC-2 puede agrupar `domain-story-lifecycle.md`, `domain-state-management.md` y `state-machine.md` en una fila (las tres dicen lo mismo: el `NEEDS-CHANGES` de un gate vuelve a `IMPLEMENT/TODO`), con lo que quedan cinco casos. Si durante el planning el volumen supera lo previsto, el corte natural es el de la reagrupación: `docs/domains/` por un lado y `state-machine.md` + `docs/requirements/` por otro.
- **T – Testeable (4):** en AC-2, nombrar la sección de cada documento donde se busca la transición (como hace AC-3 con «la sección de flujo») haría que cada fila se verifique sin leer el documento entero.
- **Coherencia del índice:** `related` sigue listando STORY-195, que ahora está `CANCELED/DONE` con `parent: null`. Es correcto como traza de la reagrupación, pero conviene que `/epic-analyze` lo confirme y que STORY-195 se archive con `/story-complete`.
