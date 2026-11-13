---
alwaysApply: false
type: story
id: STORY-192
kind: feat
slug: STORY-192-epica-sin-ready-for-dev
title: "Épica sin READY-FOR-DEV"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Épica sin READY-FOR-DEV

**Como** Solo Builder que planifica, refina y analiza una épica antes de que el PO la apruebe  
**Quiero** que `/epic-analyze`, `/epic-refine` y `/epic-generate-all-stories` dejen de nombrar `READY-FOR-DEV` y `READY-FOR-IMPLEMENT` (orden de madurez de historias, momento de uso, historias de cierre SAL), que `/epic-analyze` trate una historia legada en `READY-FOR-IMPLEMENT` como posterior a `SPECIFY`, con un aviso, en lugar de clasificarla `no-clasificable` (MAD-03), y que la aprobación de la épica por el PO se registre a mano como `PLAN/DONE`  
**Para** que el workflow de épica sea `DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – /epic-analyze usa el workflow sin buffers
```gherkin
Dado una épica EPIC-NN en "PLAN/IN-PROGRESS" con historias hijas en "SPECIFY", "PLAN/DONE" e "IMPLEMENT/TODO"
Cuando el usuario ejecuta "/epic-analyze EPIC-NN"
Entonces la madurez de las historias sigue el orden "SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED"
  Y ninguna de las tres historias genera MAD-03
  Y el siguiente paso indica que el PO aprueba la épica editando a mano su estado a "PLAN/DONE"
  Pero "/epic-analyze" no escribe "status" ni "substatus" de la épica
```

### AC-2 — Escenario alternativo – Historia legada en READY-FOR-IMPLEMENT
```gherkin
Escenario: Status legado de una historia hija
  Dado una épica EPIC-NN con una historia hija STORY-NNN en "<status>"
  Cuando el usuario ejecuta "/epic-analyze EPIC-NN"
  Entonces STORY-NNN <clasificación>
Ejemplos:
  | status              | clasificación                                                                 |
  | READY-FOR-IMPLEMENT | se clasifica como posterior a SPECIFY, con un aviso de valor legado y sin MAD-03 |
  | READY-FOR-VERIFY    | se clasifica no-clasificable y genera MAD-03                                  |
  | BACKLOG             | se clasifica no-clasificable y genera MAD-03                                  |
```

### AC-3 — Escenario con datos – /epic-refine replanifica las historias de cierre en PLAN
```gherkin
Escenario: Historia de cierre SAL según su estado
  Dado una historia de cierre SAL en "<status>"
  Cuando "/epic-refine" aplica la corrección SAL
  Entonces la corrección <efecto>
Ejemplos:
  | status    | efecto                                                                  |
  | SPECIFY   | se aplica sin línea "Replanifica:"                                       |
  | PLAN      | se aplica y el resumen final añade "Replanifica: /story-plan STORY-NNN"  |
  | IMPLEMENT | queda fuera de alcance                                                  |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Mención acotada:** en `epic-analyze`, `READY-FOR-IMPLEMENT` solo aparece en la regla del valor legado y sus evals (CS-6). `epic-refine`, `sal-corrections.md` y `epic-generate-all-stories` no nombran ningún buffer.

- **CNF-2 — Aprobación humana:** ningún skill escribe `PLAN/DONE` en un `epic.md`; la aprobación del PO sigue siendo una edición manual.

- **CNF-3 — Evals primero:** el caso de la historia legada se escribe en `skills/epic-analyze/evals/evals.json` antes de cambiar el `SKILL.md` (principio 11 de la constitución).

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Un skill que apruebe la épica o escriba `PLAN/DONE` en `epic.md`.
- Los documentos de dominio de la épica (`domain-epic-lifecycle`): STORY-187.
- El aviso de `skill-preflight` para un `epic.md` en `READY-FOR-DEV`: STORY-193.

## 📎 Notas / contexto adicional

- Cubre la parte de `epic-analyze` del criterio de salida **CS-4** de EPIC-029 (no emite MAD-03 por el valor legado) y la parte de **CS-6** que corresponde a los skills de épica.
- Puntos de cambio (2026-11-13): `skills/epic-analyze/SKILL.md` (líneas 5, 12, 77, 236, 243 y 343) y `skills/epic-analyze/README.md`; `skills/epic-refine/SKILL.md:227` y `skills/epic-refine/references/sal-corrections.md` (líneas 63 y 127); `skills/epic-generate-all-stories/SKILL.md:227`.
- **Valor legado en `/epic-refine`:** la épica solo pide la regla del valor legado en `epic-analyze`, y CS-6 no permite nombrarlo en `epic-refine`. Al diseñar, decidir qué hace `/epic-refine` con una historia de cierre en `READY-FOR-IMPLEMENT` (por ejemplo, tratarla como un `status` fuera de la tabla) sin nombrar el valor.
- Evidencia de la épica: ningún archivo del historial de git tuvo nunca `status: READY-FOR-DEV` (`git log -G`), y ningún skill lo escribe (`skills/epic-analyze/SKILL.md:77`).
- Depende de STORY-186. Es independiente de STORY-188 a STORY-191.
