---
type: code-review-report
story: STORY-163
title: "Code Review Report: story-delivery: --dry-run y --force"
verdict: APPROVED
date: 2026-10-26
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-163

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos y todos concluyen `approved`; no hay hallazgos HIGH ni MEDIUM de agentes ni criterios del DoD de la etapa code-review claramente incumplidos. Los dos criterios en `⚠️` dependen de verificaciones diferidas a ejecución humana: la comprobación manual de CNF-1 (T018) y la ejecución de evals (T020, regla de `AGENTS.md`), que deben cerrarse antes de ACCEPTANCE.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-163 — story-delivery: --dry-run y --force |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-26 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-delivery/SKILL.md:497 | En `previsualización forzada` el Paso 7 solo anticipa la falta del template (5a.1), no el fallo de 5a.2 (un `delivery-report.md` previo sin frontmatter `type: delivery-report`). En ese caso el dry-run promete «registraría en delivery-report.md», pero un `--force` real se detendría antes de la confirmación. La previsualización deja de ser fiel. | Añadir un segundo aviso: `⚠️ delivery-report.md existe pero no se puede ampliar: {motivo}; con --force la entrega se detendría antes de la confirmación.` |
| LOW | skills/story-delivery/SKILL.md:444 | La compensación del Paso 6b (línea 466: «restaurar su contenido previo si se amplió») exige tener el contenido anterior del reporte, pero el Paso 6a.3 no dice que se conserve antes de ampliarlo. Sin esa instrucción, el rollback de un reporte ampliado no se puede implementar. | En 6a.3, indicar que se guarde en memoria el contenido previo de `delivery-report.md` antes de añadir la sección, para poder usarlo en la compensación de 6b. |
| LOW | skills/story-delivery/assets/delivery-report-template.md:33 | El marcador `{criterios_incumplidos}` está bajo la cabecera de la tabla (líneas 35-37) y el comentario manda a escribir «Ninguno» cuando no hay ❌. Escrito tal cual, «Ninguno» no es una fila válida y rompe la tabla Markdown. El Paso 6a.1 del SKILL.md tampoco fija el formato. | Indicar en el comentario y en 6a.1 la fila exacta: `\| — \| Ninguno \| — \|`. |
| LOW | skills/story-delivery/SKILL.md:112 | La regla global dice que todo mensaje de detención en `previsualización` termina con `🔍 Dry-run: no se creó, modificó ni borró ningún archivo.`, pero los bloques literales de detención de los Pasos 1b, 1c, 2, 2b y 3 (líneas 177, 184, 261, 280 y 87) no la incluyen. El runner de evals manda copiar los mensajes «tal cual», así que la línea puede omitirse. Además no está claro si se aplica a un flag no reconocido que llega junto a `--dry-run` (línea 148), donde `$MODO` aún no se resolvió. | Añadir en cada bloque, o una sola vez en el Paso 0b, la nota «en `previsualización`, añadir la línea de cierre de dry-run», y aclarar el caso del flag no reconocido. |
| LOW | skills/story-delivery/evals/evals.json:315 | En TC-010 y TC-011 (línea 351), `not_contains: "delivery-report.md creado"` es una cadena que el skill nunca emite, así que la aserción no comprueba CNF-1. El runner (`scripts/run-evals.js` `buildPrompt`) emite cada archivo escrito como bloque `=== FILE: …`. Ese patrón ya se usa en los evals de epic-analyze, memory-system y story-fix-plan. | Sustituir o complementar la aserción con `"=== FILE:"` en `not_contains` de TC-010, TC-011 y TC-012 (y de TC-014, TC-015 y TC-016), para que el eval detecte cualquier escritura en dry-run o en un bloqueo. |
| LOW | skills/story-delivery/evals/evals.json:489 | Hay ramas nuevas sin caso de eval: flag no reconocido (Paso 0b), `ℹ️ --force no fue necesario` (5a), ampliación append-only con `## Override 2` (6a.3) y `--force` con `continuous`. | Añadir casos mínimos para flag no reconocido y override append-only: son contratos de salida nuevos documentados en `## Salida`. |
| LOW | skills/story-delivery/README.md:53 | La lista de disparadores del README no incluye «dry-run de entrega» ni «forzar entrega», que sí añadió `description` en el frontmatter (SKILL.md:8). | Sincronizar la línea de disparadores del README con la `description`. |
| LOW | skills/story-delivery/SKILL.md:475 | La referencia a `/story-complete {story_id} (STORY-160); mientras no exista, el cierre a COMPLETED es manual` quedó obsoleta: `skills/story-complete/` ya existe. Lo mismo pasa en la línea 44. Es preexistente: no lo introdujo el diff de STORY-163. | Quitar «mientras no exista…» y la mención a STORY-160 en un cambio de mantenimiento (no bloquea esta historia). |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Correspondencia Gherkin → implementación (`skills/story-delivery/SKILL.md` y `skills/story-delivery/evals/evals.json`):

| Escenario / ejemplo | Implementación en SKILL.md | Eval(s) | Cobertura |
|---|---|---|---|
| AC-1 fila 1 — ACCEPTANCE/DONE + DoD cumplido + `--dry-run` → «escribiría DELIVER/DONE», sin cambios | Paso 0b (modo `previsualización`), Paso 4b (solo comandos con `--dry-run`), Paso 5 (sin pregunta final), Paso 7 fila «`$BLOQUEOS` vacío» y cierre `🔍 Dry-run: no se creó…`; Restricciones «Dry-run sin efectos» (L112) | TC-010 | ✅ (aserción de «ningún archivo cambia» débil, ver hallazgo 1) |
| AC-1 fila 2 — VERIFY/DONE + DoD incumplido + `--dry-run` → bloqueo y «--force permitiría seguir» | Paso 1d tabla (registra `estado` y continúa), Paso 5 (registra `dod`), Paso 7 fila «`$BLOQUEOS` no vacío, previsualización» | TC-011 (+ TC-012 para `--dry-run --force`) | ✅ (misma debilidad del hallazgo 1) |
| AC-2 — VERIFY/DONE + DoD incumplido + `--force` + confirmación → DELIVER/DONE + `updated` + `delivery-report.md` con estado previo, criterios incumplidos y fecha del override | Paso 1d (`forzado`), Paso 5 (aviso de omisión), 5a (template y reporte previo), 5b (pregunta FORZADA), 6a (reporte antes que story.md, append-only), 6b (status/substatus/updated); template `assets/delivery-report-template.md` (L24-L37: fecha, estado previo, gates, criterios) | TC-013 | ✅ (umbral 0.9, ver hallazgo 2) |
| AC-3 — bloqueo por estado sin `--force` sugiere el override | Paso 1d bloqueo `interactivo` (L210-L216) + regla «Sugerencia de override» (L114-L118) | TC-015 | ✅ |
| AC-3 — bloqueo por DoD sin `--force` sugiere el override | Paso 5 bloqueo `interactivo` (L370-L378) | TC-016 | ✅ |
| AC-3 «Pero» — rechazo de la confirmación no sugiere `--force` | Paso 5b (L426-L430: «sin la sugerencia de override») | TC-004 (`not_contains: "--force"`), TC-014 (rechazo en modo forzado) | ✅ |
| CNF-2 — `--force` no omite la confirmación humana | Restricciones «Alcance de `--force`» (L113), tabla de gates del Paso 1d (L221-L231), Paso 2b | TC-013, TC-014 | ✅ |
| CNF-1 — dry-run sin efectos, tampoco en `.tmp/` | Restricciones (L112), Paso 6 no se ejecuta, `## Salida` (L511) | TC-010, TC-011, TC-012 | ⚠️ solo vía mensaje de cierre; verificación manual T018 pendiente |

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-delivery/evals/evals.json:315 | AC-1 «Y ningún archivo del repositorio cambia» (y CNF-1): TC-010, TC-011 (L351) y TC-012 (L380-L384) lo verifican solo con `not_contains: "delivery-report.md creado"`, cadena que el SKILL.md nunca emite (aserción muerta). El runner (`scripts/run-evals.js:475-476`) pide un bloque `=== FILE: <ruta> ===` por cada archivo que el skill escribiría, así que la ausencia de escritura es observable pero no se comprueba; hoy solo la cubre el mensaje de cierre `🔍 Dry-run: no se creó…`. | Sustituir o complementar esa entrada por `"=== FILE:"` en `not_contains` de TC-010, TC-011 y TC-012 (patrón ya usado en los evals de `epic-analyze`, `memory-system` y `story-fix-plan`). |
| LOW | skills/story-delivery/evals/evals.json:428 | AC-2: TC-013 usa `threshold: 0.9` sobre 11 cadenas `contains`, de modo que el caso pasa aunque falte una (10/11 ≈ 0.91), p. ej. `"Fecha del override:"` o `"Estado previo: VERIFY/DONE"`, que son justo los campos que el AC exige en `delivery-report.md`. Además `"updated:"` (L416) no comprueba que lleve la fecha de hoy (limitación aceptable de un JSON estático). | Subir el umbral de TC-013 a `1.0`, o mover a un caso separado con umbral 1.0 las tres cadenas del contrato del reporte (fecha del override, estado previo, criterio incumplido). |

ℹ️ Los evals TC-010…TC-016 y el TC-004 modificado aún no se ejecutaron (T020), y la verificación manual de CNF-1 (T018) está pendiente: la cobertura se juzga sobre la especificación de los casos.

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/architecture/state-machine.md:107 | La tabla de transiciones por skill sigue declarando `ACCEPTANCE/DONE` como única precondición de `story-delivery`. Con `--force` es posible `* → DELIVER/DONE` (ruta que C-5/CR-002 documentó solo en `domain-story-lifecycle.md` §4.3). El diseño no incluyó este documento ni en los componentes afectados ni en «Sin cambios». | Añadir en la celda de precondición «(o cualquier estado no archivado con `--force`, override en `delivery-report.md`)», o una nota bajo la tabla que remita a §4.3 de `domain-story-lifecycle.md` (regla de Veracidad). |
| LOW | skills/story-delivery/SKILL.md:114 | D-7 pide definir la línea de sugerencia una sola vez en `## Restricciones / Reglas` y referenciarla desde los dos pasos. La implementación la referencia, pero también la copia literalmente en los bloques de los Pasos 1d (línea 215) y 5 (línea 377). Hoy las tres copias son idénticas, aunque pueden divergir. | Aceptable si los bloques de mensaje deben ser autocontenidos. Si no, sustituir las copias por un marcador («+ línea de sugerencia de override») para que haya una sola fuente. |
| LOW | skills/story-delivery/SKILL.md:497 | En `previsualización forzada`, el Paso 7 solo avisa de la ausencia del template. No avisa de un `delivery-report.md` previo que no se puede ampliar (comprobación 5a.2), así que la previsualización puede mostrar «escribiría…» cuando el `--force` real se detendría. F-4 solo exigía el aviso del template. | Añadir al Paso 7 el aviso equivalente para 5a.2 (`⚠️ delivery-report.md existe pero no se puede ampliar: … con --force la entrega se detendría antes de la confirmación.`). |
| LOW | skills/story-delivery/assets/delivery-report-template.md:35 | Si `{criterios_incumplidos}` se sustituye por «Ninguno» (como indica el comentario de la línea 33 y el Paso 6a), queda una tabla con encabezado y sin filas seguida de texto suelto, y el Markdown no se renderiza bien. Además, `Confirmado por` (línea 29) aparece antes de los criterios, mientras que D-5 lo pone al final (diferencia cosmética). | Indicar que con «Ninguno» se omite la tabla, o usar una fila `\| — \| Ninguno \| — \|`. |
| LOW | skills/story-delivery/SKILL.md:475 | El mensaje final, que el modo forzado reutiliza (D-8 paso 3), sigue diciendo «/story-complete {story_id} (STORY-160); mientras no exista, el cierre a COMPLETED es manual». En HEAD `skills/story-complete/` ya existe. Texto heredado de STORY-159, no introducido por STORY-163. | Quitar la coletilla «mientras no exista…» en la historia que corresponda (o en un fix menor) para alinear con STORY-160. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-ai-security-checklist.md`, `docs/guardrails/gr-code-security-checklist.md`, `.claude/skills/security-audit/assets/security-checklist.md` (37 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/story-delivery/SKILL.md:330 | gr-ai semántica «irreversible step … fails closed» / SEC-037 | En `previsualización`, un comando de evidencia se ejecuta si lleva `--dry-run`. Eso no garantiza que no tenga efectos: `npm pack --dry-run` ejecuta igualmente los scripts de ciclo de vida `prepack`/`prepare`/`postpack` del `package.json` del repo destino. Por eso, en un repo ajeno, la garantía absoluta «no se creó, modificó ni borró ningún archivo» (`SKILL.md:112`, `:501`; `README.md:78`) puede no cumplirse. En este repo no hay scripts de ciclo de vida, así que no hay exposición actual. | En `previsualización`, añadir `--ignore-scripts` a los comandos `npm` o tratar como `⏸` cualquier comando que pueda disparar scripts del proyecto. También se puede matizar el mensaje de cierre a «el skill no escribió ningún archivo». |
| LOW | skills/story-delivery/SKILL.md:442 | gr-ai semántica «ingested content is data» / SEC-051, ai-no-hidden-characters | En `forzado`, el paso 6a copia en `delivery-report.md` los criterios ❌ con su evidencia, que incluye la línea relevante de la salida de un comando (`:315`). Ese texto no confiable acaba en un artefacto versionado que se archiva y que leerán agentes posteriores. No se indica sanearlo: quitar caracteres de control o secuencias ANSI, escapar `\|` en la tabla y neutralizar texto con forma de instrucción. Hoy solo es endurecimiento, porque el DoD actual no hace que `npm pack --dry-run` emita contenido arbitrario. | Indicar en 6a que la evidencia se resume y se sanea antes de escribirla: quitar caracteres de control o invisibles, escapar `\|`, limitar la longitud y citarla como dato, no como instrucción. |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (6 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Historia en `CODE-REVIEW/DONE`. Antes de ACCEPTANCE, cerrar las verificaciones diferidas: ejecutar manualmente `npm run test:eval -- story-delivery` (T020: TC-010…TC-016 y TC-004) y verificar CNF-1 con `git status --porcelain` antes y después de `/story-delivery <id> --dry-run` y `--dry-run --force` (T018). Después, continuar con `/story-verify STORY-163`. Los hallazgos LOW (en especial la aserción `not_contains` sin efecto en TC-010…TC-012 y el aviso faltante de 5a.2 en la previsualización forzada, señalado por dos revisores) pueden atenderse en un ajuste menor.

---

## Cumplimiento DoD — Fase CODE-REVIEW

DoD: `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] (línea 17) | ⚠️ | — | `implement-report.md`: 18/24 ✓, 6 ⚠️, 0 ❌. Los ⚠️ (ejecución de evals T020, CNF-1 T018, CI, CHANGELOG) no son evaluables desde los artefactos |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) (línea 18) | ✓ | — | Tech-Lead-Reviewer: skill en español, `SDDF-FIXED-LAYOUT: v1` intacto, sin secretos, dependencias ni código ejecutable nuevos |
| 3 | Cada escenario Gherkin tiene correspondencia en el código (línea 19) | ✓ | — | Product-Owner-Reviewer: AC-1 (dos ejemplos) → Pasos 0b/1d/4b/5/7 + TC-010…TC-012; AC-2 → Pasos 1d/5/5a/5b/6a/6b + template + TC-013; AC-3 → Pasos 1d/5 + TC-015, TC-016, TC-004, TC-014 |
| 4 | Los componentes respetan la arquitectura de `design.md` (línea 20) | ✓ | — | Integration-Reviewer: C-1…C-6 en sus rutas; D-1…D-9 reflejados; desvíos justificados en CR-005 y CR-006 |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM (línea 21) | ✓ | — | Los cuatro informes: `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) (línea 22) | ⚠️ | — | 19/21 `[x]`; T018 y T020 `[~]` son verificaciones diferidas a ejecución humana (sesión interactiva y regla de `AGENTS.md`). Requiere ejecución — no evaluable desde artefactos; cerrar antes de ACCEPTANCE |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados (línea 23) | ✓ | — | Frontmatter completo (`id`, `kind`, `slug`, `title`, `parent`, `created`, `updated`, `related`); `status`/`substatus` actualizados a `CODE-REVIEW/DONE` por este skill |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado (línea 24) | ✓ | — | Generado en esta ejecución |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) (línea 25) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 7/9 criterios ✓ · 2 ⚠️ · 0 ❌
