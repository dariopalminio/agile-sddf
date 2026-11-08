---
alwaysApply: false
type: story
id: STORY-182
kind: feat
slug: STORY-182-verificacion-deduplicacion-y-tope-de-ruido
title: "Verificación, deduplicación y tope de ruido"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-08
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
  - STORY-180-story-code-review-lee-review-md
  - STORY-181-hallazgos-preexistentes
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: Verificación, deduplicación y tope de ruido

**Como** Solo Builder que lee `code-review-report.md` para decidir si corrige o avanza  
**Quiero** que el árbitro de `/story-code-review` no trate como bloqueante un HIGH o MEDIUM sin `Archivo:Línea` y escenario de fallo concreto, que fusione los hallazgos repetidos entre revisores, que limite los LOW por revisor y que no repita LOW de rondas anteriores en líneas que el rework no tocó  
**Para** que el informe tenga señal y un falso positivo no me cueste una ronda completa de corrección

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Un bloqueante sin evidencia no bloquea
```gherkin
Dado una historia STORY-NNN en revisión
  Y un revisor reporta un hallazgo MEDIUM sin "Archivo:Línea" o sin escenario de fallo concreto
Cuando el árbitro consolida los informes
Entonces el hallazgo figura en el informe como no verificado
  Y no cuenta para "max-severity" ni cambia el veredicto
  Y no entra en "fix-directives.md"
```

### AC-2 — Escenario principal – Un hallazgo repetido aparece una vez
```gherkin
Dado que el Tech-Lead-Reviewer y el Security-Reviewer reportan el mismo defecto en el mismo "Archivo:Línea"
Cuando el árbitro consolida los informes
Entonces el hallazgo aparece una sola vez en "code-review-report.md" y en "fix-directives.md"
  Y cita a los dos revisores
  Y conserva la severidad más alta de las dos
```

### AC-3 — Escenario con datos – Tope de LOW por revisor
```gherkin
Escenario: Tope de LOW
  Dado un revisor que reporta 12 hallazgos LOW
    Y la guía de revisión "<guía>"
  Cuando el árbitro consolida los informes
  Entonces el informe muestra como máximo <tope> LOW de ese revisor
    Y indica cuántos LOW se omitieron
Ejemplos:
  | guía                                   | tope |
  | REVIEW.md con "Tope de nits" de 3 LOW  | 3    |
  | REVIEW.md sin tope declarado           | 5    |
  | sin REVIEW.md                          | 5    |
```

### AC-4 — Escenario alternativo – LOW arrastrados entre rondas
```gherkin
Dado una historia STORY-NNN en su segunda ronda de revisión
  Y un LOW del "code-review-report.md" de la ronda anterior en una línea que el rework no tocó
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces ese LOW no se repite en el nuevo informe
  Pero un HIGH o MEDIUM sin corregir de la ronda anterior sí se repite
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Contrato del informe:** los valores de `verdict` y el significado de `max-severity` no cambian; la consolidación cambia qué hallazgos cuentan, no el formato (CS-2, CS-4).
- **CNF-2 — Evals primero:** el caso «tope de LOW» y un caso de hallazgo duplicado se escriben en `skills/story-code-review/evals/evals.json` antes de cambiar el skill (CS-8).
- **CNF-3 — Exigencia de evidencia en los revisores:** los cuatro agentes piden `Archivo:Línea` y escenario de fallo para HIGH/MEDIUM, para que el árbitro no tenga que degradar hallazgos válidos mal redactados.

## Fuera de alcance (Non-Goals)

- La categoría PREEXISTENTE: STORY-181.
- Los hallazgos que crea el propio DoD CODE-REVIEW: STORY-183.

## 📎 Notas / contexto adicional

- Cubre **CS-4** de EPIC-28 (verificación, deduplicación y tope de LOW).
- **Línea base (2026-11-07):** ≈580 LOW en 55 de los 71 `code-review-report.md` archivados (media ≈10, máximo 21). En STORY-125, 20 LOW se arrastraron entre rondas y uno se duplicó entre revisores.
- **Punto de inserción:** Paso 4 (árbitro) de `skills/story-code-review/SKILL.md`, entre la lectura de informes (4a) y el cálculo de severidad (4b). El tope por defecto de 5 LOW coincide con el de `docs/templates/REVIEW-template.md` («Tope de nits»).
- **Tamaño:** cuatro reglas del árbitro en una historia. Si `/story-evaluation` la marca como grande, el corte natural es (AC-1, AC-2) por un lado y (AC-3, AC-4) por otro.
- Implementar después de STORY-180, que hace llegar `REVIEW.md` al árbitro.
