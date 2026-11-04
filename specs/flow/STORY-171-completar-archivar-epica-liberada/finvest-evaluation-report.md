---
type: finvest-evaluation
story-id: STORY-171
finvest-score: 4.18
verdict: APPROVED
evaluated: 2026-10-29
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.18 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que liberó una épica con SDD flow-forward
> **Quiero** completarla con `/epic-complete EPIC-NN` tras verificar su operatividad post-despliegue
> **Para** que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/`, `specs/flow/` conserve solo el trabajo activo y la épica quede como registro histórico con su historial de git intacto

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` como en el template; rol real (Solo Builder que liberó una épica), acción concreta (`/epic-complete EPIC-NN` tras verificar la operatividad) y beneficio observable (épica archivada, `specs/flow/` solo con trabajo activo, historial de git intacto). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1), alternativo (AC-2) y de cancelación (AC-3), todos como subapartados `###` nombrados. |
| Escenarios Gherkin | 4 | Tres bloques ` ```gherkin ` bien formados con `Dado/Cuando/Entonces` y `Y`. Ningún escenario alternativo usa `Pero` ni hay Scenario Outline con `Ejemplos`, que el template propone. |

**F_score = (5 × 0.4) + (5 × 0.3) + (4 × 0.3) = 4.70 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Tras el split, la entrega depende de STORY-175 (ADR que admite épicas en `specs/flow/archive/`), que debe entregarse antes; y el estado `SHIP/DONE` lo produce `epic-ship` (STORY-170). Ambas dependencias quedan desacopladas para el desarrollo: las Notas declaran un `epic.md` fixture en `SHIP/DONE` y desarrollo en paralelo. Comparte el skill con STORY-172. |
| **N** – Negociable | 4 | Fija resultados (estado final, ruta de archivo, confirmación humana, sin commit) y deja abierto el cómo. CNF-1 menciona `git mv`, pero admite «equivalente que git reconozca como rename». |
| **V** – Valiosa | 4 | Valor claro y observable para el Solo Builder: cierra el ciclo de vida de la épica y deja `specs/flow/` limpio, como ya hace `/story-complete` con las historias. No define métrica cuantitativa. |
| **E** – Estimable | 4 | Con el gobierno (ADR y documentos de autoridad) movido a STORY-175, el alcance queda acotado al skill, sus evals y `package.json` (CS-12), con `/story-complete` como diseño a reutilizar. Persiste una ambigüedad menor: la nota de CS-19 y el mensaje de AC-2 admiten `COMPLETED/DONE` (y `CANCELED/DONE`), pero ningún escenario describe qué hace el skill con esos estados. |
| **S** – Small | 3 | Tres escenarios (principal, alternativo y cancelación) con 15 pasos en total; AC-1 concentra siete. Tamaño adecuado para una sola entrega tras el split. |
| **T** – Testeable | 4 | Happy path, alternativo y cancelación verificables con `git status` (rename) y el frontmatter. Quedan puntos poco precisos: «conserva legibles las fechas de cierre y la versión liberada» (AC-1) no dice qué campos; AC-3 no afirma que ningún archivo cambie; CNF-5 y CNF-6 no tienen umbral medible; no hay escenario para un destino de archivo que ya existe. |

**INVEST_Score = (3 + 4 + 4 + 4 + 3 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.18 / 5.0

---

## Comentarios y Recomendaciones

**I – Independencia (3):**
- Mantener explícito en Notas que AC-1, AC-2 y AC-3 se prueban con un `epic.md` fixture en `SHIP/DONE`, sin esperar a STORY-170 ni a STORY-175; solo la entrega (no el desarrollo) espera a STORY-175.
- Acordar con STORY-172 quién crea `skills/epic-complete/SKILL.md` y cómo se extiende, para evitar conflictos al compartir el skill.

**S – Small (3):**
- Mantener el tamaño actual; si se agregan escenarios para `COMPLETED/DONE` o destino existente (ver T), preferir un Scenario Outline a escenarios nuevos para no volver a crecer.

**Opcionales (dimensiones con score 4):**
- **Formato – Gherkin:** usar `Pero` en AC-2 (`Pero ningún archivo cambia ni se mueve`) o un Scenario Outline con `Ejemplos` de estados rechazados (`VALIDATE/DONE`, `SHIP/IN-PROGRESS`, `PLAN/DONE`).
- **E – Estimable:** resolver qué hace esta historia con `COMPLETED/DONE` (archivar sin cambiar status, como en `/story-complete`) y con `CANCELED/DONE` (rechazar hasta que STORY-172 se entregue o aceptarlo); hoy el mensaje de AC-2 los admite sin escenario que los describa.
- **T – Testeable:** precisar en AC-1 qué campos de `epic.md` conservan las fechas de cierre y la versión liberada; añadir `Y ningún archivo cambia ni se mueve` a AC-3; dar a CNF-5/CNF-6 un umbral verificable (por ejemplo, líneas máximas de `SKILL.md`); considerar un escenario de error para un destino `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` que ya existe.
