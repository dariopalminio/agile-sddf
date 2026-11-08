---
alwaysApply: false
type: story
id: STORY-185
kind: feat
slug: STORY-185-tope-de-low-y-arrastres
title: "Tope de LOW por revisor y sin arrastres entre rondas"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-08
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-182-verificar-y-deduplicar-hallazgos
  - STORY-178-adr-guia-de-revision
  - STORY-180-story-code-review-lee-review-md
  - STORY-181-hallazgos-preexistentes
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: Tope de LOW por revisor y sin arrastres entre rondas

**Como** Solo Builder que lee `code-review-report.md` para decidir si corrige o avanza  
**Quiero** que el árbitro de `/story-code-review` limite los LOW por revisor y, cuando la revisión anterior guardó sus huellas, no repita los LOW de líneas que el rework no tocó\
**Para** que el informe conserve señal y no me obligue a releer los mismos nits en cada ronda

## ✅ Criterios de aceptación

### AC-1 — Escenario con datos – Tope de LOW por revisor
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

### AC-2 — Escenarios alternativos – LOW arrastrados entre rondas con registro previo
```gherkin
Escenario: La revisión anterior guardó las huellas de sus LOW
  Dado que la revisión anterior de STORY-NNN guardó "code-review-lows.json"
    Y un LOW anterior reaparece en una línea cuyo contenido no cambió
    Y otro LOW anterior reaparece en una línea que el rework modificó
    Y siguen pendientes un HIGH y un MEDIUM de la ronda anterior
  Cuando el usuario ejecuta "/story-code-review STORY-NNN"
  Entonces el LOW de la línea sin cambios no se muestra en el nuevo informe
    Y el LOW de la línea modificada se vuelve a evaluar, sujeto al tope por revisor
    Y el HIGH y el MEDIUM pendientes se muestran
    Y al cerrar la ronda se guardan en "code-review-lows.json" las huellas de los LOW mostrados y de los omitidos por arrastre con ubicación comprobable

Escenario: Informe legado sin registro de LOW
  Dado que STORY-NNN tiene un informe de revisión anterior pero no "code-review-lows.json"
  Cuando el usuario ejecuta "/story-code-review STORY-NNN"
  Entonces los LOW de esta ronda se muestran sujetos al tope por revisor
    Y el nuevo informe avisa "arrastre no comprobado"
    Y al cerrar la ronda se guardan las huellas de los LOW mostrados con ubicación comprobable en "code-review-lows.json" para la próxima ronda
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Contrato del informe:** los valores de `verdict` y el significado de `max-severity` no cambian; el tope y la omisión de arrastres cambian qué LOW se muestran, no el formato (CS-2, CS-4).
- **CNF-2 — Evals primero:** el caso «tope de LOW» y un caso de LOW arrastrado entre rondas con registro previo se escriben en `skills/story-code-review/evals/evals.json` antes de cambiar el skill (CS-8).

## Fuera de alcance (Non-Goals)

- La verificación de evidencia de HIGH/MEDIUM y la deduplicación entre revisores: STORY-182.
- La categoría PREEXISTENTE: STORY-181.
- Los hallazgos que crea el propio DoD CODE-REVIEW: STORY-183.

## 📎 Notas / contexto adicional

- Cubre la parte de **control de ruido** de **CS-4** de EPIC-28 (tope de LOW y arrastres entre rondas). Nace de dividir la STORY-182 original (patrón 4, complejidad de criterios de aceptación).
- **Línea base (2026-11-07):** ≈580 LOW en 55 de los 71 `code-review-report.md` archivados (media ≈10, máximo 21). En STORY-125, 20 LOW se arrastraron entre rondas.
- **Tope por defecto:** 5 LOW por revisor, que coincide con el «Tope de nits» de `docs/templates/REVIEW-template.md`; el éxito se mide por ese tope, no por un mecanismo concreto.
- **Alcance de AC-2:** la omisión por arrastre solo se aplica si la revisión anterior guardó `code-review-lows.json`. El contenido de una línea «no tocada por el rework» debe coincidir con la huella registrada. Un informe legado sin registro no prueba el estado anterior del código: no se reconstruyen huellas históricas ni se atribuye una comparación retroactiva. Ese informe solo permite reconocer el caso legado antes de sobrescribirlo.
- **Registro de cada ronda:** al cerrar se guardan las huellas de los LOW visibles y de los omitidos por arrastre cuya ubicación y archivo se pueden leer; los demás no se omiten por arrastre en la próxima ronda. Los omitidos solo por el tope no se registran como vistos. El registro nuevo permite comparar en la siguiente ronda, incluso si la actual partió de un informe legado.
- **Orden de selección:** primero se omiten los LOW cuyo arrastre se comprobó con el registro previo; después se muestran los primeros LOW restantes de cada revisor hasta su tope, según el orden de su informe. Los arrastrados no consumen cupo ni cuentan como omitidos por tope. Un LOW sin ubicación comparable se muestra si cabe en el tope.
- **Punto de inserción:** Paso 4 (árbitro) de `skills/story-code-review/SKILL.md`, entre la lectura de informes (4a) y el cálculo de severidad (4b).
- **Dependencias:** implementar después de STORY-180 es el orden recomendado, no una precondición: el tope por defecto y AC-2 funcionan sin `REVIEW.md`, y el tope declarado se prueba con un fixture. Es independiente de STORY-182, que puede implementarse antes, después o en paralelo; si ambas editan el Paso 4, integrar el control de LOW después de la verificación y fusión de hallazgos.
