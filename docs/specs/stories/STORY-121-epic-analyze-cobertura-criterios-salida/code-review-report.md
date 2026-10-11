---
type: code-review-report
story: STORY-121
title: "Code Review Report: Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias"
review-status: approved
date: 2026-10-09
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-121

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-121 — Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-09 |

**Alcance revisado:** familia `SAL-` de `skills/epic-analyze/SKILL.md`, sección `cobertura-salida` y conteo `Contrato de salida` del template seed, evals TC-011…TC-018 y TC-028 (commit `555f706`) más los mundos ajustados de STORY-120, y las entradas de STORY-121 en `CHANGELOG.md` y `docs/domains/domain-epic-lifecycle.md`. El working tree mezcla en los mismos archivos los cambios de STORY-122 (familia `MAD-`). Solo se revisaron para confirmar que no rompen STORY-121, y no lo hacen.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

**max-severity: LOW · status: approved**. La familia `SAL-` se integra en el punto de extensión de STORY-120: el orden, el veredicto y el template por clave no cambian. Es fiel a D-1…D-9 y CR-005 recoge las desviaciones. `SKILL.md` tiene 335 líneas (< 500). No hay TODO, secretos, rutas absolutas ni dependencias nuevas, y las evals se commitearon antes que `SKILL.md` (principio 11).

| # | Severidad | Archivo:Línea | Hallazgo | Recomendación |
|---|-----------|---------------|----------|---------------|
| 1 | LOW | skills/epic-analyze/SKILL.md:196 | E1 para smokes casa `SMOKE-<N>` en cualquier línea del cuerpo, incluidos los bloques `gherkin` de ejemplo sobre otra épica. En EPIC-22, `SMOKE-1` sale cubierto solo por los ejemplos de STORY-121, lo que oculta un SAL-02. La regla es D-4 aplicada literalmente | Registrar un CR o una historia de seguimiento que endurezca E1 (excluir los bloques de código o las líneas que nombran otro `EPIC-NN`). Mientras tanto, anotarlo en Risks de `design.md` |
| 2 | LOW | skills/epic-analyze/SKILL.md:190 | No está definida la mezcla de encabezados con y sin `SMOKE-<N>`. La etiqueta implícita `SMOKE-<posición>` puede chocar con un ID explícito | Usar etiquetas implícitas solo si ningún encabezado tiene ID. En el caso mixto, asignar la primera posición libre y añadir la nota `/epic-format-validation` |
| 3 | LOW | skills/epic-analyze/SKILL.md:285 | No está fijado qué cuenta `t` en `Contrato de salida: <c>/<t>` cuando hay secciones ausentes, vacías o desactivadas, ni que todo desactivado da `0/0` | `t` = elementos de las secciones `presente`. Sin ninguna, `0/0 cubiertos` |
| 4 | LOW | skills/epic-analyze/SKILL.md:148-149 | La nota de historias `CANCELED` exige leer su cuerpo, aunque el texto dice que solo se lee el cuerpo del universo. La comparación de `status` no declara normalización | Aclarar que las `CANCELED` se leen solo para la nota y normalizar como en el Paso 5c |
| 5 | LOW | skills/epic-analyze/SKILL.md:85 | Ninguna eval prueba una inyección en el cuerpo de un `story.md`. La frontera entre una mención E1 y una orden al agente queda a juicio del agente | Añadir un eval de inyección indirecta y precisar que E1 acepta solo menciones declarativas |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

**max-severity: LOW · status: approved**

| Escenario / CNF | Instrucción que lo produce | Eval | Ejecución |
|---|---|---|---|
| AC-1: contrato cubierto, tabla sin hallazgos | SKILL.md Paso 5b y Paso 7 (`cobertura-salida`); sección del template | TC-011 | PASS |
| AC-2 fila 1: criterio sin cubrir → ERROR | Catálogo SAL-01 | TC-012 | PASS |
| AC-2 fila 2: `SMOKE-2` sin cubrir → WARNING | Catálogo SAL-02 | TC-013 | PASS |
| AC-2 fila 3: "Criterios de salida" ausente o vacía → ERROR | Estados `ausente`/`vacía`, regla del placeholder, SAL-03 | TC-014, TC-028 | PASS |
| AC-2 fila 4: "Smoke tests" vacía o ausente → ERROR | SAL-04 | TC-015 (solo la variante vacía) | PASS |
| CNF-1: evidencia citada | Tabla E1/E2 con formato de cita | TC-011, TC-016 | PASS |
| CNF-2: mismo reporte y veredicto, solo lectura | Paso 6 sin cambios; restricciones | `not_contains` de bloques FILE; TC-013 | PASS |
| CNF-3: idempotencia | Determinismo, sobrescritura completa, orden fijo de filas | TC-018, TC-008 | PASS |

| # | Severidad | Archivo:Línea | Hallazgo | Recomendación |
|---|-----------|---------------|----------|---------------|
| 6 | LOW | skills/epic-analyze/evals/evals.json (TC-015) | La variante "Smoke tests ausente" de AC-2 fila 4 no tiene caso propio | Añadir un caso sin el encabezado que espere `SAL-04` y ningún `SAL-02` |
| 7 | LOW | skills/epic-analyze/evals/evals.json (TC-011) | Las aserciones no ligan cada elemento con su historia ni con su tipo de evidencia: una asociación errónea seguiría pasando | Añadir aserciones de fila (`mención · story.md:16`, `AC-1 · story.md:13`) |
| 8 | LOW | skills/epic-analyze/SKILL.md:196 | Falso positivo de E1 en smokes, confirmado en la ejecución real sobre EPIC-22 (mismo hallazgo que el #1) | Decidirlo en el refinamiento. No bloquea |
| 9 | LOW | .tmp/skill-test-evals/epic-analyze/report-20261009.md | El reporte agregado marca TC-028 como ERROR, pero un run posterior (`runs/TC-028.txt`) pasa. El implement-report dice "21/21" y el inventario actual tiene 28 casos (incluye STORY-122) | Regenerar el reporte con `npm run test:eval -- epic-analyze` antes de VERIFY |

---

### Integración y Arquitectura (Integration-Reviewer)

**max-severity: LOW · status: approved**. La implementación cumple D-1…D-9, I-1…I-6, F-1…F-3 y CR-001…CR-005. Del contrato de STORY-120, D-7 (veredicto) e I-3 (retorno) no cambian. El orden pasa a `INT- < MAD- < SAL-`, que sigue siendo código ascendente. D-8 (template) y D-10 (cláusula de datos) se amplían correctamente. Los cambios en `sddf-commands-pipeline.md` y `domain-skills-map.md` son de STORY-120. `epic-template.md`, `epic-format-validation`, `story-template.md` y `package.json` no tienen cambios.

| # | Severidad | Archivo:Línea | Hallazgo | Recomendación |
|---|-----------|---------------|----------|---------------|
| 10 | LOW | skills/epic-analyze/SKILL.md:196 | Laguna de diseño de E1 frente a CNF-1 (mismo hallazgo que el #1). La implementación es conforme a D-4 | Registrar un CR en `design.md` o una historia de seguimiento |
| 11 | LOW | skills/epic-analyze/SKILL.md:190 | La asignación `SMOKE-<posición>` (implícito) con ≥ 2 encabezados sin ID no está en CR-005, aunque el implement-report dice que sí | Añadirla a CR-005 o crear un CR-006 |
| 12 | LOW | docs/domains/domain-skills-map.md:19 | La columna "Lee" de `epic-analyze` queda incompleta: faltan las secciones `criterios-salida`/`smoke-tests` y el `status` y el cuerpo de los `story.md` | Ampliarla, por ejemplo junto con STORY-122 |
| 13 | LOW | docs/domains/domain-epic-lifecycle.md:223 | La frase ampliada de §9 no estaba prevista en D-9. El cambio es correcto | Opcional: reflejarlo en D-9 |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (56 reglas evaluadas)

**max-severity: LOW · status: approved**. Todas las comprobaciones deterministas pasan sobre los archivos de la historia. El skill sigue siendo de solo lectura: la única escritura es `epic-analyze-report.md`. Solo lee el cuerpo de las historias del universo, y la cláusula `ai-untrusted-content-clause` está ampliada (D-7). No ejecuta salidas del LLM ni accede a la red.

| # | Severidad | Archivo:Línea | Hallazgo | Recomendación |
|---|-----------|---------------|----------|---------------|
| 14 | LOW | skills/epic-analyze/SKILL.md:85 (y template:47) | Las citas SAL van entre comillas invertidas simples, pero los criterios reales ya contienen comillas invertidas (EPIC-22 `epic.md:31-32`). Así el código en línea se cierra antes de tiempo y lo que sigue se renderiza como Markdown activo. Un `\|` sin escapar rompe la celda. Arrastra el hallazgo #11 de STORY-120 | Usar un delimitador más largo que la racha de comillas del texto, escapar `\|` y añadir un eval |
| 15 | LOW | skills/epic-analyze/evals/evals.json | No hay eval de inyección indirecta en el cuerpo de un `story.md` (mismo tema que el #5) | Añadir el eval y precisar E1 frente a líneas con forma de instrucción |

Fuera de alcance (no computa): el argumento Ruta (`SKILL.md:106`) sigue sin confinarse a `REPO_ROOT` (hallazgo #4 de STORY-120).

---

### Nota de Tamaño de Cambio

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban con severidad máxima LOW. Los 15 hallazgos son precisiones de determinismo, robustez y trazabilidad documental; ninguno es HIGH ni MEDIUM. Tres temas se repiten entre revisores y conviene llevarlos a una historia de seguimiento o a un CR:

1. **Falso positivo de E1 en smokes** (#1, #8, #10): el token `SMOKE-N` dentro de ejemplos `gherkin` cuenta como cobertura. Afecta al valor de la historia en épicas reales (EPIC-22) y requiere un cambio de diseño en D-4.
2. **Render inerte de citas** (#14): las comillas invertidas y `|` dentro de los criterios rompen el código en línea y las tablas. Arrastrado desde STORY-120.
3. **Eval de inyección indirecta** (#5, #15) y aserciones más fuertes en TC-011/TC-015 (#6, #7).

---

## Siguiente acción

- Pasar a `/story-verify STORY-121`. Antes, regenerar el reporte agregado de evals (`npm run test:eval -- epic-analyze`, hallazgo #9).
- Opcional: registrar los temas 1–3 de la decisión final como CR en `design.md` o como historia de seguimiento de EPIC-22, y completar CR-005 y `domain-skills-map.md` (#11, #12).

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | implement-report: 21/24 ✓, 0 ❌. El criterio "Build de CI pasa" requiere acceso a CI/CD y no es evaluable desde los artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Evals antes que `SKILL.md` (principio 11), español, UTF-8 sin BOM, `SKILL.md` < 500 líneas |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1 y las 4 filas de AC-2 con instrucción y eval que pasa |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-9, I-1…I-6 y contrato de STORY-120 conformes |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los cuatro informes tienen `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 21/21 tareas `[x]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | `story.md` → `CODE-REVIEW/DONE` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (Review status approved en `code-review-report.md`) | ✓ | — | `review-status: approved` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
