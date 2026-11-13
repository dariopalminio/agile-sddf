---
alwaysApply: false
type: story
id: STORY-192
kind: feat
slug: STORY-192-epica-sin-ready-for-dev
title: "Épica sin READY-FOR-DEV"
status: SPECIFY
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-187-dominio-sin-estados-buffer
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: Épica sin READY-FOR-DEV

**Como** Solo Builder que planifica, refina y analiza una épica antes de que el PO la apruebe  
**Quiero** que los skills de épica dejen de nombrar los estados buffer y que `/epic-analyze` acepte, con un aviso, una historia hija que conserva el valor legado `READY-FOR-IMPLEMENT`  
**Para** que `/epic-analyze` me indique el paso real de aprobación (`PLAN/DONE`, editado a mano) y no marque como no clasificables las historias planificadas antes de 6.0.0

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – /epic-analyze usa el workflow sin buffers
```gherkin
Dado una épica EPIC-NN en "PLAN/IN-PROGRESS" con historias hijas en "SPECIFY/DONE", "PLAN/DONE" e "IMPLEMENT/TODO"
Cuando el usuario ejecuta "/epic-analyze EPIC-NN"
Entonces las tres historias se clasifican "lista", sin MAD-01 ni MAD-03
  Y el resumen indica "Madurez de historias hijas: 3/3"
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
  | READY-FOR-IMPLEMENT | se clasifica "lista", sin MAD-03, con una nota de valor legado que cita STORY-NNN y no cuenta para el veredicto |
  | READY-FOR-VERIFY    | se clasifica "no-clasificable" y genera MAD-03                                                                  |
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
- Menciones a retirar: el orden de madurez de las historias, el momento de uso del análisis y las historias de cierre SAL en `PLAN` o `READY-FOR-IMPLEMENT`. El orden de madurez queda `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`, más el terminal `CANCELED`.
- **Nota de valor legado (decidido con el usuario, 2026-11-13):** el aviso de AC-2 es una nota que no cuenta para el veredicto, como las notas SAL de `/epic-analyze`, y no un hallazgo WARNING nuevo. Así, una épica sana con historias planificadas antes de 6.0.0 no baja a `NEEDS-REFINEMENT` por el valor legado.
- Puntos de cambio (2026-11-13): `skills/epic-analyze/SKILL.md` (líneas 5, 12, 77, 236, 243 y 343) y `skills/epic-analyze/README.md` (líneas 20 y 30); `skills/epic-refine/SKILL.md:227` y `skills/epic-refine/references/sal-corrections.md` (líneas 63 y 127); `skills/epic-generate-all-stories/SKILL.md:227`.
- **Casos que no cambian:** `BACKLOG` sigue siendo `no-clasificable` con MAD-03, y ya tiene eval en `skills/epic-analyze/evals/evals.json`. Una historia de cierre en `IMPLEMENT` sigue fuera del alcance de la corrección SAL. Ninguno de los dos se repite como criterio.
- **Valor legado en `/epic-refine`:** la épica solo pide la regla del valor legado en `epic-analyze`, y CS-6 no permite nombrarlo en `epic-refine`. Al diseñar, decidir qué hace `/epic-refine` con una historia de cierre en `READY-FOR-IMPLEMENT` (por ejemplo, tratarla como un `status` fuera de la tabla) sin nombrar el valor.
- Evidencia de la épica: ningún archivo del historial de git tuvo nunca `status: READY-FOR-DEV` (`git log -G`), y ningún skill lo escribe (`skills/epic-analyze/SKILL.md:77`).
- **Dependencias:**
  - De STORY-186 se toma el ADR que se cita como fuente del workflow sin buffers. La decisión ya está en EPIC-029, así que los evals (CNF-3) y los cambios de texto pueden empezar antes de que se entregue el ADR. Solo hay que actualizar la cita cuando exista.
  - Con STORY-187 tiene que coincidir el orden de estados: `skills/epic-analyze/SKILL.md:236` declara el orden de madurez «según `domain-story-lifecycle` §4.1 y §5», y STORY-187 reescribe ese documento. Las dos historias tienen que terminar con el mismo orden.
  - Es independiente de STORY-188 a STORY-191.
