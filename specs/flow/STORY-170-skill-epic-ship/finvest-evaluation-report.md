---
type: finvest-evaluation
story-id: STORY-170
finvest-score: 4.17
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.17 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder con una épica validada
> **Quiero** ejecutar `/epic-ship EPIC-NN` para que lea el valor entregado por las historias, actualice `CHANGELOG.md`, redacte las notas de versión para stakeholders en `release-notes.md` y me muestre los pasos de liberación que ejecuto a mano
> **Para** preparar una versión documentada sin redactarla yo y dejar la épica en `SHIP/DONE` cuando confirmo que la liberé

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` presente como en el template; rol real (Solo Builder con épica validada), acción concreta y beneficio observable (versión documentada sin redacción manual). El `Quiero` es extenso porque enumera tres salidas, pero todas son resultados observables, no implementación. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1), alternativo (AC-2), de rechazo (AC-3) y una regla transversal (AC-4), todos como subapartados `###` nombrados. |
| Escenarios Gherkin | 5 | Cuatro bloques ` ```gherkin ` con `Dado/Cuando/Entonces/Y` y un escenario alternativo con `Pero` (AC-2). |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Consume `epic-validate-report.md`, que produce `epic-validate` (STORY-124 a STORY-128, en `SPECIFY/DONE`, sin skill en `skills/`). La dependencia es desacoplable con un reporte fixture. Comparte con STORY-171 la edición de `domain-epic-lifecycle` y `domain-state-management` (CS-20), lo que exige coordinar el orden. |
| **N** – Negociable | 4 | Fija los resultados (archivos de salida, gate humano, ausencia de operaciones de git) y deja abierto el cómo: formato de las notas, estructura del skill y reutilización de `/doc-release-notes`. |
| **V** – Valiosa | 4 | Valor claro y observable para el Solo Builder: obtiene `CHANGELOG.md` y `release-notes.md` sin redactarlos y cierra el gate `VALIDATE → SHIP` con confirmación explícita. No define una métrica cuantitativa. |
| **E** – Estimable | 3 | Estimable en talla gruesa, con incertidumbre: no dice de dónde lee las historias (¿incluye las archivadas en `specs/flow/archive/`?), no define la estructura de `release-notes.md` (¿template en `assets/`?) y CNF-1 menciona un «modo automático» que ningún escenario describe. Además suma dos documentos de dominio, evals y el registro en `package.json`. |
| **S** – Small | 2 | Cuatro escenarios con unos 19 pasos (AC-1 tiene seis), más trabajo fuera de los AC: ajuste de dos documentos de dominio (CS-20), `evals/evals.json` y `package.json` (CS-12). La propia nota de la historia pide evaluar si conviene separar el ajuste de dominio. |
| **T** – Testeable | 4 | Happy path, alternativo con `Pero` y rechazo, todos verificables; AC-4 es comprobable con `git log` y `git status`. Faltan escenarios para la idempotencia (CNF-2) y para el contenido mínimo de las entradas (AC-1 solo dice «con las historias de la épica»). |

**INVEST_Score = (3 + 4 + 4 + 3 + 2 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.17 / 5.0

---

## Comentarios y Recomendaciones

La historia supera el umbral con poco margen (4.17). Las recomendaciones de abajo no bloquean la aprobación, pero conviene resolverlas antes de `/story-plan` o durante `/story-design`.

### I – Independencia (3)
- Declarar en las notas que las pruebas y los evals usan un `epic-validate-report.md` fixture con `verdict: APPROVED`, para que la historia avance sin esperar a que exista `skills/epic-validate/`.
- Acordar con STORY-171 quién edita primero `domain-epic-lifecycle` y `domain-state-management`, o pasar esa edición a una historia propia (ver S).

### E – Estimable (3)
- Indicar de dónde sale el «valor entregado»: las historias con `parent: EPIC-NN` en `specs/flow/` y en `specs/flow/archive/`, y con qué estado (¿solo `COMPLETED`/`DELIVER`?).
- Decidir si `release-notes.md` se genera desde un template en `skills/epic-ship/assets/` y qué secciones mínimas lleva.
- Aclarar el «modo automático» de CNF-1: si existe, agregar un escenario (sin confirmación → la épica no cambia de estado); si no, quitar la mención.

### S – Small (2)
- Separar la parte de CS-20 (documentar en `domain-epic-lifecycle` y `domain-state-management` que `epic-ship` escribe `SHIP` con confirmación humana) en una historia de documentación, posiblemente compartida con STORY-171. Esto deja la historia solo con el skill, sus evals y su registro en `package.json`.
- Opcional: llevar a AC-1 la confirmación humana como un `Cuando` explícito en lugar de un `Y` dentro del `Entonces`, para que AC-1 y AC-2 sean simétricos y más cortos.

### T – Testeable (4, mejora opcional)
- Agregar un escenario de idempotencia: «Dado que `CHANGELOG.md` ya tiene la entrada de EPIC-NN, cuando se reejecuta `/epic-ship EPIC-NN`, entonces la entrada no se duplica».
- Precisar en AC-1 qué contiene cada entrada de `CHANGELOG.md` (por ejemplo, ID y título de cada historia hija) para poder verificarla objetivamente.
