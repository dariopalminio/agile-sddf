---
type: code-review-report
story: STORY-099
title: "Code Review Report: Inicializar la memoria completa desde sddf-init con el parámetro --level"
review-status: approved
date: 2026-09-24
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

<!-- Referencias -->
[[STORY-099-sddf-init-level-full]]

# Code Review Report: STORY-099

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-099 — Inicializar la memoria completa desde sddf-init con el parámetro --level |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (11 casos — UT:0/CT:0/IT:3/API:0/E2E:2/EV:6) |
| Fecha | 2026-09-24 |

Alcance revisado: solo los cambios de STORY-099 (`git diff HEAD -- skills/sddf-init/` y las partes sobre `--level` de la guía, el README y el CHANGELOG). Los cambios de STORY-098 que siguen sin commit en el working tree no se atribuyen a esta historia.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

Sin hallazgos de seguridad, performance ni dependencias (`package.json` no cambia). La composición inline `sddf-init` → `memory-system` respeta la regla de cadenas cortas de `constitution.md` §4. La guía, el README y el CHANGELOG son coherentes con el SKILL.md.

| # | Archivo:Línea | Severidad | Hallazgo | Recomendación |
|---|---|---|---|---|
| 1 | `skills/sddf-init/SKILL.md:250-270` | LOW | El texto fija las cifras del motor de `memory-system` (`creados: 19 · preservados: 5`, `preservados: 24`). Si cambian las semillas, se desactualizan sin que falle ningún eval. | Presentarlas como ilustrativas ("p. ej.") o no fijar los números. |
| 2 | `skills/sddf-init/SKILL.md:42, 219-220` | LOW | La tabla dice que `standard` es idéntico a invocar sin `--level`, pero con `--level standard` explícito el cierre añade `(nivel standard)`. "Exactamente el anterior" es ambiguo. | Aclarar que el comportamiento es idéntico y que solo el cierre difiere cuando el flag es explícito. |
| 3 | `skills/sddf-init/SKILL.md:45-50` | LOW | La validación no define qué pasa con `--level` sin valor, repetido o con la forma `--level=full`. | Tratar esos casos como valor no admitido, o admitir explícitamente `--level=<v>`. |
| 4 | `skills/sddf-init/SKILL.md:175-177` | LOW | Se pasa `scaffold --yes`, pero `memory-system` documenta que `--yes` solo lo usa `migrate` (en `scaffold` no tiene efecto). | Anotar que `--yes` no tiene efecto en `scaffold` y solo asegura que no haya preguntas. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

- **Escenario principal (`--level full`):** ✓ E2E-001 real (listado y contenido idénticos byte a byte a `sddf-init` + `scaffold`) y TC-007.
- **Escenario alternativo (sin `--level` / `standard` / `minimal`):** ✓ E2E-002 real y TC-001..TC-006.
- **Requerimiento "Niveles":** ✓ fail-fast (TC-009), orden 5 → 5b (CR-002, IT-003 real) y default `standard`.
- **Requerimiento "Cambio mínimo" (AC-4):** ✓ diff contra HEAD solo aditivo; los Pasos 1, 2, 2b, 3 y 4 y la tabla de templates están intactos.
- **NFR:** ✓ compatibilidad, idempotencia (dos corridas reales), trazabilidad (bloques separados) y documentación.

| # | Archivo:Línea | Severidad | Hallazgo | Recomendación |
|---|---|---|---|---|
| 5 | `skills/sddf-init/evals/evals.json` | LOW | `--level standard` explícito no tiene eval propio y la E2E-002 real no lo mostró. | Añadir un TC para `--level standard` explícito. |
| 6 | `testcases.md` (IT-002) | LOW | La degradación sin `memory-system` solo se verificó con TC-008, que es simulado por el LLM. | Ejecutarla de verdad en VERIFY, en un directorio sin `memory-system` instalado. |

---

### Integración y Arquitectura (Integration-Reviewer)

El diseño D-1..D-6 y CR-001..CR-004 está reflejado en la implementación. La integración con el `skills/memory-system/SKILL.md` actual es correcta en cinco puntos:
- `scaffold` acepta `--yes`;
- se usa el mismo contrato de raíz v1;
- el formato del informe coincide (`harness`, `capas faltantes`, las marcas, la línea `✅` y el resumen de cinco cifras);
- las cifras 19/5 y 24 cuadran con el árbol semilla actual;
- el Paso 5b degrada a `standard` si `memory-system` no está instalado.

| # | Archivo:Línea | Severidad | Hallazgo | Recomendación |
|---|---|---|---|---|
| 7 | `skills/sddf-init/SKILL.md:162-163` | LOW | El Paso 5 dice "continuar al Paso 6", pero en `full` el siguiente es el 5b. | Decir "continuar al Paso 5b (solo `full`) o al Paso 6". |
| 8 | `design.md` (F-1, D-2) | LOW | Dice que el scaffold crea solo `adr-template.md`; hoy crea cuatro plantillas más y `templates/README.md`. | Actualizar F-1 y D-2 o remitir a CR-004. |
| 9 | `skills/sddf-init/SKILL.md` (ejemplo `full`) | LOW | Puede aparecer una línea `harness:` duplicada (la del `detect` y la del motor); el ejemplo muestra una sola. | Documentar que se concatena tal cual o deduplicar esa línea. |
| 10 | `README.md:248` | LOW | Dice "seis plantillas" cuando son nueve. Texto previo de STORY-096, fuera del diff de esta historia. | Corregirlo en la historia que es dueña de ese texto. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-ai-security-checklist.md`, `docs/guardrails/gr-code-security-checklist.md`, `.claude/skills/security-audit/assets/security-checklist.md`, `.claude/skills/security-audit/assets/ai-security-checklist.md` (36 reglas evaluadas)

Focos revisados sin hallazgo:
- **Paso 5b sin confirmación:** `scaffold` solo copia lo que falta, confina las escrituras a `SPECS_BASE` y la invocación está fijada, sin `--force`/`rebuild`. Además, `full` es un opt-in explícito.
- **Composición inline:** lee solo un skill del framework en `CLI_ROOT`.
- **Validación de `--level`:** ocurre antes del Paso 1 y termina sin escrituras.
- **Checks deterministas:** `ai-*`/`sec-*` limpios; sin secretos, caracteres ocultos, `http://` ni rutas al directorio home.

| # | Archivo:Línea | Severidad | Hallazgo | Recomendación |
|---|---|---|---|---|
| 11 | `skills/sddf-init/SKILL.md:45` | LOW | No se define el comportamiento de `--level` sin valor, repetido o con otras mayúsculas (`FULL`). El peor caso ejecuta `standard`/`full`, que no destruyen nada. | Tratarlo como valor no admitido: mismo `❌` y sin escrituras (coincide con #3). |

---

### Nota de Tamaño de Cambio

---

### Cobertura de Casos de Prueba (testcases.md)

**Cobertura (Product-Owner-Reviewer):** los 2 escenarios Gherkin tienen E2E 1-a-1 (E2E-001, E2E-002, ambos `[x]` con ejecución real). EV-001..EV-006 están en `[x]` (evals 10/10) e IT-001 e IT-003 en `[x]`. **IT-002** sigue `[ ]`: solo lo cubre el eval simulado TC-008. No hay entradas `[!]`. AC-4 se verifica revisando el diff, como justifica `testcases.md`. Hay dos observaciones LOW: `--level standard` explícito no tiene caso propio, y los AC-1..AC-4 están numerados en `design.md`, no en `story.md`.

**Trazabilidad de diseño (Integration-Reviewer):** todas las referencias D-N, F-N y CR-N de `testcases.md` existen en `design.md`, y los tres IT tienen referencia de diseño. Hay dos observaciones LOW: E2E-001 espera "6 plantillas" en `templates/`, pero hoy son 9 más `README.md`; e IT-002 sigue sin marcar.

---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban con severidad máxima LOW: 11 hallazgos LOW, ninguno HIGH ni MEDIUM, y los 9 criterios DoD CODE-REVIEW en ✓. La implementación cumple los dos escenarios Gherkin, los dos requerimientos y los cuatro NFR, con evidencia real (E2E en directorios temporales y evals 10/10). Los hallazgos son de precisión en el texto y se pueden resolver como mejoras opcionales.

---

## Siguiente acción

Ejecutar `/story-verify STORY-099`. De forma opcional y no bloqueante:
- aplicar las mejoras de redacción #2, #3/#11 y #7 en `skills/sddf-init/SKILL.md`;
- ejecutar de verdad IT-002 durante VERIFY;
- añadir un eval para `--level standard` explícito (#5).

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | DoD IMPLEMENT satisfactorio (`docs/guardrails/dod-story-checklist.md:141`) | ✓ | — | `implement-report.md`: ningún ❌; los ⚠️ (linter, CI remoto, checklists de seguridad) quedan cubiertos por esta revisión |
| 2 | Estándares del proyecto (`constitution.md`) (`:142`) | ✓ | — | Tech-Lead: la composición inline cumple §4; idioma y estructura del skill correctos |
| 3 | Cada escenario Gherkin tiene correspondencia en el código (`:143`) | ✓ | — | Product-Owner: los 2 escenarios están cubiertos en SKILL.md, evals y E2E real |
| 4 | Los componentes respetan la arquitectura de `design.md` (`:144`) | ✓ | — | Integration: D-1..D-6 y CR-001..CR-004 reflejados |
| 5 | Sin hallazgo bloqueante HIGH o MEDIUM (`:145`) | ✓ | — | Severidad máxima LOW en los cuatro informes |
| 6 | Sin tareas pendientes en `tasks.md` (`:146`) | ✓ | — | T001..T013 en `[x]` |
| 7 | Frontmatter de `story.md` completo, con status y substatus actualizados (`:147`) | ✓ | — | Se actualiza a `CODE-REVIEW/DONE` en este paso |
| 8 | `code-review-report.md` creado o actualizado (`:148`) | ✓ | — | Este documento |
| 9 | Revisión aprobada (`:149`) | ✓ | — | review-status: approved |

**Resumen:** 9/9 criterios ✓
