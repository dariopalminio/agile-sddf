---
type: finvest-evaluation
story-id: STORY-157
finvest-score: 4.08
verdict: APPROVED
evaluated: 2026-10-22
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.08 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que dogfoodea el framework
> **Quiero** que los enlaces y wikilinks hacia las rutas movidas de `docs/specs/` queden reescritos y verificados tras la migración
> **Para** que el repo migrado tenga 0 enlaces rotos, historial rastreable por work item y el gate determinista en verde

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Sección `# 📖 Historia` presente, como en el template. Las tres cláusulas están completas: rol real (mantenedor), resultado concreto (enlaces reescritos y verificados) y un beneficio con metas observables (0 enlaces rotos, historial rastreable, gate en verde). |
| Criterios de aceptación | 5 | La sección está presente, con AC-1 (escenario principal) y AC-2 (escenario alternativo) nombrados como subapartados `###`. También incluye CNF, Non-Goals y Notas. |
| Escenarios Gherkin | 5 | Hay dos escenarios en bloques `gherkin` con `Dado/Cuando/Entonces`, `Y` (AC-1) y `Pero` (AC-2). |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Depende de STORY-153 (en `SPECIFY/DONE`, sin entregar): sin los work items en `specs/flow/` no hay nada que reescribir. También depende de STORY-148, porque el gate debe aceptar `specs/flow/`. Se puede simular en parte: el `--dry-run` de STORY-153 lista cada movimiento origen → destino, y ese mapa basta para preparar y probar la reescritura antes de que se muevan los work items. La dependencia está explícita en las Notas. |
| **N** – Negociable | 4 | Fija resultados (referencias en la ruta nueva, gate en verde, historial intacto) y no fija la técnica de reescritura. Las CNF solo restringen el stack y el carácter de un solo uso. |
| **V** – Valiosa | 4 | Valor claro y observable para el mantenedor: sin esta historia, el repo migrado queda con referencias rotas en skills, scripts, tests y documentación. Cierra CS-6, CS-10 y SMOKE-5 de EPIC-26. Es una chore de habilitación, sin métrica de negocio. |
| **E** – Estimable | 3 | Hay un inventario aproximado (~219 archivos) y el trabajo es mecánico, pero el alcance de la reescritura es ambiguo. En el filesystem: 4 ADR de `docs/adr/` (los aceptados son inmutables), `CHANGELOG.md` y unos 126 archivos de `docs/specs/` son históricos, frente a 76 activos en `skills/`, `scripts/` y `test/`. La historia no dice qué grupos se reescriben y cuáles se conservan. |
| **S** – Small | 3 | Dos escenarios con unos 8 pasos en total. El volumen de archivos es alto pero repetitivo. |
| **T** – Testeable | 3 | AC-2 es directamente verificable (`git log --follow`, diff vacío de `docs/requirements/`). AC-1 tiene un oráculo débil. `scripts/check-doc-links.js` solo revisa raíces activas (`README.md`, `SECURITY.md`, `docs/index.md`, `docs/constitution.md`, `docs/policies`, `docs/guardrails`, `docs/guides`, `docs/runbooks`). Excluye `docs/specs`, `docs/adr` y `CHANGELOG.md`, y no revisa `skills/`, `scripts/` ni `test/`. Un `npm run verify:repository` en verde no prueba que «cada referencia apunta a la ruta nueva». |

**INVEST_Score = (2 + 4 + 4 + 3 + 3 + 3) / 6 = 3.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 3 / 5
**T – Testeable:** 3 / 5

**FINVEST Score:** 4.08 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (2)**
- Mantén la precondición explícita y verifícala al inicio del planning (STORY-153 y STORY-148 en `COMPLETED`).
- Para empezar antes, diseña la reescritura a partir del mapa origen → destino que produce el `--dry-run` de STORY-153 y pruébala sobre un fixture, no sobre el árbol real.

**E – Estimable (3)**
- Define en Notas o en un Non-Goal qué grupos de archivos se reescriben: activos (`skills/`, `scripts/`, `test/`, `config/`, `docs/` vivos) frente a históricos (`docs/adr/`, `CHANGELOG.md`, cuerpo de work items archivados).
- Aclara cómo se tratan los ADR aceptados. Son inmutables (AGENTS.md), así que reescribir sus enlaces requiere una excepción explícita o dejarlos fuera del alcance.

**S – Small (3)**
- No hace falta ninguna acción. Si el diseño añade escenarios (por ejemplo, para referencias en tests o config), deja la historia en 3 escenarios como máximo y pasa el resto a tasks.

**T – Testeable (3)**
- Agrega a AC-1 un oráculo propio que no dependa del alcance del gate. Por ejemplo: «Y una búsqueda de `specs/epics` y `specs/stories` en las raíces activas no devuelve coincidencias». Así la condición queda booleana y automatizable.
- Alternativa: si se espera que el gate cubra `specs/flow/` o `skills/`, decláralo como precondición de STORY-148. Hoy `check-doc-links.js` excluye `docs/specs` como histórico.
