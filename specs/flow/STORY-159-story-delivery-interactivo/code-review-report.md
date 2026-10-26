---
type: code-review-report
story: STORY-159
title: "Code Review Report: story-delivery interactivo en modelo batch"
verdict: APPROVED
date: 2026-10-26
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-159

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informe válido y ninguno reporta hallazgos HIGH ni MEDIUM. Los criterios del DoD de la etapa code-review no producen hallazgos `❌`; el criterio sobre tareas pendientes en `tasks.md` queda en `⚠️` por T022 (ejecución de evals diferida por decisión humana) y debe resolverse antes de ACCEPTANCE.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-159 — story-delivery interactivo en modelo batch |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-26 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-delivery/SKILL.md:1-526 | El SKILL.md mide 526 líneas y `gr-skill-creation-checklist` fija `< 500 líneas` (error). Al cerrar STORY-159 medía 333 líneas (implement-report); el exceso proviene de las extensiones posteriores (STORY-162 `continuous`, STORY-163 `--dry-run`/`--force`) ya presentes en el archivo revisado. `verify:repository` no lo comprueba y otros skills (story-verify 602, story-implement 1259) lo superan, por lo que no bloquea esta historia. | Planificar una poda o mover detalle (p. ej. mensajes de salida repetidos en `## Salida` y Paso 7) a `references/` enlazado con «leer cuando» en una historia de mantenimiento. |
| LOW | skills/story-delivery/SKILL.md:3-8 | El `description` mide 614 caracteres; el presupuesto de metadatos es 500 (objetivo 350, regla `skill-description-budget`, warn). Era de 351 al implementar STORY-159 y creció con STORY-162/163. Incluye parte del «cómo» (flags y comportamiento de `--force`) en lugar de solo «cuándo invocar». | Recortar el `description` a «cuándo invocar» + frases disparadoras y dejar el detalle de flags en el cuerpo. |
| LOW | skills/story-delivery/SKILL.md:135-137 | El bloque de layout dice «El layout no es configurable (ADR-0016)», pero ADR-0016 está reemplazado por ADR-0017 (AGENTS.md). Es el texto idéntico que replican otros skills (story-acceptance, story-verify), exigido por `verify-fixed-layout`. | Actualizar la referencia a ADR-0017 en todos los skills a la vez, en una historia de mantenimiento; no hacerlo solo aquí para no divergir del bloque canónico. |
| LOW | skills/story-delivery/SKILL.md:330 | El método `comando` decide en runtime si un comando citado en el DoD es «de verificación» mediante juicio del agente, sin lista de permitidos. Está mitigado (se muestra antes, se excluyen `npm publish`/`git push`/`npm pack` sin `--dry-run`, la salida es dato no confiable, el permiso de ejecución del runtime sigue activo), pero sigue siendo una heurística. | Opcional: documentar en `docs/guides/` una lista de comandos de verificación admitidos si un DoD consumidor cita comandos más amplios. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-delivery/evals/evals.json:7 | Todos los escenarios de STORY-159 (AC-1, AC-2 con sus tres filas, AC-3 y CNF) tienen correspondencia observable. Sin embargo, no hay ningún eval que ejercite el comportamiento "no se pregunta" de AC-2 fila 2 en el criterio de confirmación humana (TC-003 usa respuestas `s,s` y valida solo la ausencia de la pregunta final). | Opcional. Mantener tal cual: la ausencia de la pregunta final está cubierta por `not_contains: "¿Confirmas la entrega"`. |
| LOW | specs/flow/STORY-159-story-delivery-interactivo/tasks.md:60 | T022 (ejecución de los evals TC-001…TC-006) sigue `[~]`: AC-1, AC-2 y CNF-3 no tienen evidencia de ejecución. Es una decisión humana documentada y no se penaliza. | Ejecutar `npm run test:eval -- story-delivery` y marcar T022 `[x]` antes de ACCEPTANCE. |
| LOW | skills/story-delivery/SKILL.md:1 | El `SKILL.md` ya incorpora los alcances de STORY-162 (`continuous`) y STORY-163 (`--dry-run`/`--force`), y `evals.json` pasa a v1.2.0 con TC-007…TC-016. Los TC-001…TC-006 de STORY-159 siguen coherentes con el comportamiento actual (p. ej. TC-005 espera ahora el mensaje de `delivery-model` inválido). Es un solapamiento de alcance entre historias hermanas, no un defecto de cobertura. | Informativo. Sin acción. |

Verificación de AC-3: `domain-state-management.md` (invariante 6 de §4 y §5.2), `domain-story-lifecycle.md` (fila `DELIVER`) y `domain.md` (BR-006 y resumen de substatus) declaran que `story-delivery` escribe `DELIVER` con confirmación humana. `SHIP` sigue sin skill escritor; `COMPLETED` de story lo atribuyen hoy a `story-complete` (STORY-160), coherente con la nota de coordinación de la historia.

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-delivery/assets/delivery-report-template.md:1 | El directorio `skills/story-delivery/assets/` y su template no figuran en la tabla «Componentes afectados» de `design.md` de STORY-159 (sí en STORY-163 design, C-2). Es un componente no documentado respecto al diseño de esta historia; no afecta el paquete (`files` cubre `skills/`). | Aceptable: lo documenta el design de STORY-163. Opcional: nota en `design.md` de STORY-159 indicando que `assets/` proviene de STORY-163. |
| LOW | skills/story-delivery/SKILL.md:19-26,120 | El comportamiento versionado difiere del de `design.md` STORY-159 (D-2 solo `batch` con fail-closed ante otro valor; D-6 sin `delivery-report.md`; contrato TC-005 = `continuous` falla cerrado; `evals.json` tiene 16 casos frente a TC-001…TC-006). Está superado por STORY-162 y STORY-163 (el design de 163 revierte D-6 explícitamente solo para `--force`). El mensaje de modelo no soportado también cambió respecto a la interfaz de D-2. | Sin acción funcional. Opcional: anotar en `design.md` de STORY-159 que D-2 y D-6 fueron reemplazados por STORY-162/163 para evitar confusión en futuras revisiones. |
| LOW | skills/story-delivery/SKILL.md:44,475 | Texto desactualizado: «/story-complete → cierre y archivado (STORY-160)» y «mientras no exista, el cierre a COMPLETED es manual», pero `skills/story-complete/` ya existe y `domain-state-management.md`/`state-machine.md` lo documentan como escritor de `COMPLETED`. | Actualizar el mensaje de siguiente paso a `/story-complete {story_id}` sin la salvedad. |
| LOW | skills/story-delivery/SKILL.md:137 | El Paso 0 cita «El layout no es configurable (ADR-0016)», ADR reemplazado por ADR-0017. Es el bloque idéntico al de los demás skills (D-10; `story-acceptance` y `story-verify` lo repiten), por lo que no es una desviación propia de este skill. | Informativo: corregir de forma transversal en todos los skills, no solo aquí. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (63 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/story-delivery/SKILL.md:330 | gr-ai semantica (comandos que el agente ejecuta; irreversible gated); SEC-063 (condicion plausible, sin input de red) | La decision de ejecutar un comando de evidencia del DoD en modo `interactivo`/`forzado` se apoya en un criterio cualitativo ("si el texto citado podria escribir, publicar o desplegar") con ejemplos, sin lista cerrada de comandos permitidos y sin pedir confirmacion humana por comando antes de ejecutar. Tampoco indica rechazar comandos compuestos (`&&`, `;`, `|`, `>`, sustitucion `$(...)`), de modo que un criterio editado como `` `npm test && <otro>` `` podria pasar la comprobacion. El DoD es un archivo versionado del repo (y su ruta puede sobrescribirse por config), y el propio skill lo declara dato no confiable. En `--dry-run` la unica condicion adicional es la presencia del texto `--dry-run`, que no garantiza que el comando no escriba. | Anadir una lista cerrada (p. ej. `npm test`, `npm run <script> --dry-run`, `npm pack --dry-run`, `git status`/`git diff` de solo lectura) y tratar como `confirmación` todo comando fuera de ella o que contenga metacaracteres de shell. Opcionalmente pedir `s/n` antes de ejecutar cada comando. |
| LOW | skills/story-delivery/SKILL.md:180 y :83 | gr-code semantica (ruta derivada de un argumento confinada al repo) | La ruta explicita `{story_path}` se valida (linea 175), pero el camino por ID (`specs/flow/{story_id}-*/`) no exige que `{story_id}` cumpla `STORY-NNN` y el slug de `guardrails.dod.story.deliver` (`docs/guardrails/<slug>.md`) no se valida contra `..` ni separadores. Un valor con `../` podria resolver fuera de `specs/flow/` o `docs/guardrails/`. Solo hay impacto si se confirma despues y el valor lo controla quien ya invoca el skill o edita la config, por lo que es endurecimiento sin exposicion demostrable. | Validar `{story_id}` con `^STORY-[0-9]+$` y el slug con `^[a-z0-9][a-z0-9-]*$` antes de construir la ruta; normalizar y comprobar que el resultado queda dentro de `specs/flow/` y `docs/guardrails/`. |
| LOW | skills/story-delivery/SKILL.md:442 | gr-ai semantica (contenido ingerido es dato; sin instrucciones propagadas) | En modo `--force`, el Paso 6a rellena `delivery-report.md` con el texto de los criterios y la evidencia (incluida la salida resumida de comandos), contenido no confiable. Ese archivo es append-only, se archiva con la historia y lo leeran agentes y humanos despues, de modo que texto con apariencia de instruccion o markdown/frontmatter inyectado quedaria persistido. | Indicar que la evidencia se inserta truncada (p. ej. codigo de salida y una linea de maximo 200 caracteres), escapada como texto/code span y sin saltos de linea, y que nunca se interpreta al releerla. |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (15 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Revisión aprobada: la historia queda en `CODE-REVIEW/DONE`. Antes de ACCEPTANCE, ejecuta a criterio humano `npm run test:eval -- story-delivery` y marca T022 `[x]` en `tasks.md`. Continúa con `/story-verify STORY-159`. Los hallazgos LOW son mejoras opcionales y no bloquean.

---

## Cumplimiento DoD — Fase CODE-REVIEW

DoD: `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] (línea 17) | ⚠️ | — | `implement-report.md` registra 17/24 ✓, 7 ⚠️ y 0 ❌; los ⚠️ requieren CI, ejecución de evals (T022) o juicio humano (no se invocó `skill-master`) |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) (línea 18) | ✓ | — | Tech-Lead-Reviewer e Integration-Reviewer no reportan violaciones de `constitution.md`; layout fijo y frontmatter conformes |
| 3 | Cada escenario Gherkin tiene correspondencia en el código (línea 19) | ✓ | — | Product-Owner-Reviewer: AC-1, AC-2 (tres filas) y AC-3 con correspondencia en SKILL.md, TC-001…TC-006 y documentos de dominio |
| 4 | Los componentes respetan la arquitectura de `design.md` (línea 20) | ✓ | — | Integration-Reviewer: C-1…C-11 y D-1…D-10 verificados contra el filesystem; solo desviaciones LOW por STORY-162/163 |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM (línea 21) | ✓ | — | Severidad máxima de los cuatro informes: LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) (línea 22) | ⚠️ | — | `tasks.md:60` T022 `[~]` (22/23 completadas): ejecución de evals diferida por decisión humana documentada (regla de `AGENTS.md`); no es evaluable por esta revisión y debe cerrarse antes de ACCEPTANCE |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados (línea 23) | ✓ | — | `story.md` conserva todos los campos (`id`, `kind`, `slug`, `title`, `parent`, `created`, `updated`, `related`); `status`/`substatus` se actualizan a `CODE-REVIEW/DONE` en el Paso 6 |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado (línea 24) | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) (línea 25) | ✓ | — | Frontmatter `verdict: APPROVED` |

**Resumen:** 7/9 criterios ✓ · 2 ⚠️ · 0 ❌
