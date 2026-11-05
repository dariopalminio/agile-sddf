---
type: code-review-report
story: STORY-170
title: "Code Review Report: Skill epic-ship"
verdict: APPROVED
date: 2026-10-31
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-170

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Es la ronda 2, después de aplicar `fix-directives.md` de la ronda 1. Los cuatro revisores entregaron un informe válido con `status: approved`, y los ocho hallazgos MEDIUM de la ronda 1 están resueltos o registrados con veracidad. Los 14 hallazgos que quedan son LOW: refuerzos y deriva menor de documentación que no bloquean la aprobación.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-170 — Skill epic-ship |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-31 |

**Estado de las correcciones de la ronda 1:**

| # ronda 1 | Dimensión | Estado |
|---|---|---|
| 1 | code-quality | Resuelto: solo se reemplaza un bloque dentro de `[Unreleased]`; un bloque publicado se rechaza sin escribir (`release-content.md:77-82`, TC-006) |
| 2 | requirements-coverage | Resuelto en la especificación: TC-001 tiene `manual_checks` observables (HEAD, tags, `show-ref`, árbol de trabajo, publicación/despliegue, BOM) |
| 3 | requirements-coverage | Registrado con veracidad: SMOKE-7 sigue pendiente de ejecución humana (AGENTS.md); `implement-report.md` no inventa evidencia |
| 4 | integration-architecture | Resuelto: el gate exige `VALIDATE/DONE` + `APPROVED` (`SKILL.md:99`, TC-008), alineado con `state-machine.md:182` |
| 5 | integration-architecture | Resuelto: D-7 y las Notas de implementación de `design.md` reflejan el gateway canónico |
| 6 | security | Resuelto: `{yaml_title}` se serializa como escalar YAML seguro (template:6,15; TC-007 con título adversarial) |
| 7, 8 | DoD-CODE-REVIEW | Resueltos con esta revisión (sin bloqueantes; `verdict: APPROVED`) |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-ship/SKILL.md:111 | Regresión del rework: el Paso 4 ya no contiene el mensaje exacto de bloque incompleto y remite a «el error indicado en la sección 4 de la referencia», pero `release-content.md:80` dice «error de bloque incompleto (Paso 4 de `SKILL.md`)». Cada archivo remite al otro y ninguno define el texto. El mensaje `❌ CHANGELOG.md tiene el bloque de <EPIC_ID> incompleto: corrige los delimitadores…` sigue fijado en `design.md:194` y en T009, así que la salida de ese caso queda a improvisación del agente. El comportamiento seguro (no escribir) se mantiene. | Poner el mensaje literal en la fila «Solo uno, o `end` antes de `start`» de `release-content.md:80`, igual que la fila de versión publicada, y quitar allí la referencia a `SKILL.md`. |
| LOW | skills/epic-ship/references/release-content.md:38 | La normalización de saltos de línea solo está especificada para el encabezado de `release-notes.md` (template:15). El `title` de la épica en `### EPIC-NN — <title>` del bloque de `CHANGELOG.md`, los `title` y `valor` de las historias en las viñetas y las celdas de la tabla `## Historias incluidas` solo escapan `<!--`. Un título con salto de línea seguido de `## [9.9.9]` mete un encabezado falso dentro del bloque, y la reejecución siguiente lo rechazaría como «fuera de [Unreleased]». Un `|` rompe la tabla. | Extender la regla de la sección 2 a todo escalar copiado: normalizar los saltos de línea a espacios y, en las celdas de tabla, escapar `|` como `\|`. Opcionalmente, añadir la variante al caso adversarial TC-007. |
| LOW | CHANGELOG.md:22 | La entrada de `/epic-ship` y la fila de `docs/guides/sddf-commands-pipeline.md:191` siguen describiendo como única precondición `epic-validate-report.md` en `APPROVED`. No mencionan el requisito `VALIDATE/DONE` ni el rechazo de un bloque ya publicado, que se introdujeron en la ronda 1. Es una deriva menor de la documentación (estos archivos no estaban en la lista blanca de `fix-directives.md`). | En una edición posterior, añadir «con la épica en `VALIDATE/DONE`» a ambas descripciones. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Los cuatro escenarios Gherkin (AC-1…AC-4) tienen cobertura: AC-1 → TC-001 (SMOKE-7), TC-005; AC-2 → TC-002; AC-3 → TC-003, TC-004, TC-008; AC-4 → `not_contains` de TC-001…TC-005 + `manual_checks` de TC-001.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-ship/evals/evals.json:70 | AC-1 exige mostrar los pasos de liberación (commit, tag, merge y despliegue), pero TC-001 solo afirma el encabezado `Pasos de liberación` y `1.5.0`. No comprueba que aparezcan los cuatro pasos de `SKILL.md:128-131`. La aserción es débil. | Añadir a `contains` de TC-001 fragmentos de los pasos, por ejemplo `Commit de los cambios`, `Tag de la versión`, `Merge a la rama principal` y `Despliegue o publicación`. |
| LOW | skills/epic-ship/SKILL.md:59 | CNF-1 ("en modo automático sin confirmación la épica no cambia de estado") y el modo orquestador del Paso 7 (`SKILL.md:138`) no tienen caso de eval. TC-002 cubre la respuesta `n`, no la invocación sin pregunta. | Añadir un caso con invocación por orquestador: espera los dos documentos escritos, ninguna pregunta `¿Completaste…` y sin `status: SHIP`. |
| LOW | skills/epic-ship/evals/evals.json:256 | AC-4 se formula para "cualquier ejecución", pero TC-006, TC-007 y TC-008 omiten los `not_contains` de comandos de git y `npm publish` que sí llevan TC-001…TC-005. Las comprobaciones observables solo existen en TC-001. | Añadir la misma lista `not_contains` (`git commit`, `git tag`, `git merge`, `git push`, `npm publish`) a TC-006…TC-008 por homogeneidad. |
| LOW | specs/flow/STORY-170-skill-epic-ship/story.md:29 | Tras el rework, el skill exige `VALIDATE/DONE` además de `APPROVED` (D-7, TC-008). El `Dado` de AC-1/AC-2/AC-3 y la entrada de `CHANGELOG.md:22` siguen nombrando solo el veredicto, igual que `domain-epic-lifecycle.md:159` y `sddf-commands-pipeline.md:191`. No hay contradicción con el gateway canónico (`APPROVED` deja `VALIDATE/DONE`), pero el requisito visible no refleja el rechazo nuevo. | Registrar en las Notas de `story.md` (y en la entrada de CHANGELOG) que la entrada exige `VALIDATE/DONE` + `APPROVED` y que un reporte aprobado aislado se rechaza (TC-008). |
| — | specs/flow/STORY-170-skill-epic-ship/implement-report.md:95 | Informativo: `npm run test:eval -- epic-ship` y el recorrido manual SMOKE-7 (dueña de CS-18) siguen pendientes de ejecución humana, y el reporte lo dice con veracidad. No penaliza en code review. | Antes de ACCEPTANCE/VERIFY, un humano ejecuta los evals y SMOKE-7 y registra en `implement-report.md` la fecha, el fixture, la evidencia de los cuatro `manual_checks` y el resultado. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-ship/SKILL.md:111 | El rework quitó de `SKILL.md` el mensaje exacto del bloque incompleto (`❌ CHANGELOG.md tiene el bloque de <EPIC_ID> incompleto…`, fijado en `design.md:194` P7). `SKILL.md` remite al «error indicado en la sección 4 de la referencia», y `release-content.md:80` remite de vuelta a «Paso 4 de `SKILL.md`». La referencia es circular y ningún archivo define ese mensaje. | Poner el texto literal del error de bloque incompleto en `release-content.md:80`, como ya se hizo con el de versión publicada en la línea 78, o restaurarlo en `SKILL.md:111`. |
| LOW | skills/epic-ship/SKILL.md:126 | D-2 (`design.md`) dice que promover `[Unreleased]` a `## [x.y.z]` es parte de la liberación manual, y `/epic-complete` toma la versión de ese encabezado (sin él, exige `--version`). Pero los cinco pasos de liberación no mencionan esa promoción en `CHANGELOG.md`. Un humano que los siga al pie de la letra deja el bloque en `[Unreleased]` y `/epic-complete` se detiene. Hay fallback (`--version`), así que no hay ruptura funcional. | Añadir al paso 3 (o en un paso nuevo) «promueve `## [Unreleased]` a `## [<versión>] — <fecha>` en `CHANGELOG.md`», con el texto fijo también en `design.md` (Pasos de liberación). |
| LOW | docs/domains/domain-skills-map.md:22 | La condición de entrada de `epic-ship` sigue resumida como «tras el `APPROVED` de `/epic-validate`» / «`epic-validate-report.md` con `APPROVED`» en `domain-skills-map.md:22`, `docs/guides/sddf-commands-pipeline.md:191`, `docs/domains/domain-epic-lifecycle.md:159` y `CHANGELOG.md:22`. No menciona que también se exige `VALIDATE/DONE`. La entrada de `CHANGELOG.md:22` también afirma que «una reejecución reemplaza sin duplicar» sin el nuevo rechazo de un bloque publicado. La fuente canónica (`state-machine.md:182`) sí lo cubre, por lo que no hay contradicción. | Ajustar esas cuatro descripciones a «épica en `VALIDATE/DONE` con `verdict: APPROVED`» y, en `CHANGELOG.md:22`, mencionar que un bloque ya publicado no se reescribe. |
| LOW | specs/flow/STORY-170-skill-epic-ship/design.md:206 | La tabla «Contratos de verificación» y la tabla P7 no se actualizaron tras la ronda 1. Las filas siguen citando solo TC-001…TC-005, sin TC-006 (bloque publicado), TC-007 (título YAML adversarial) ni TC-008 (`APPROVED` sin `VALIDATE/DONE`). P7 no tiene la fila «bloque dentro de una versión publicada», que F4 y D-4 sí describen. | Añadir las filas de TC-006…TC-008 a los contratos y la fila del bloque publicado a la tabla de degradación. |
| LOW | docs/domains/domain-epic-lifecycle.md:117 | La fila `SHIP` de §5 (editada por esta historia) mantiene «Substatus inicial: `IN-PROGRESS`». `epic-ship` escribe `SHIP/DONE` directamente desde `VALIDATE/DONE`, y ningún skill escribe `SHIP/IN-PROGRESS`. Es una inconsistencia menor de documentación, análoga a la de `DELIVER/DONE` en `story-delivery`. | Cambiar el substatus inicial de `SHIP` a `DONE`, o añadir una nota de que `epic-ship` registra `SHIP/DONE` en un solo paso. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (34 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-ship/SKILL.md:83 | AI-015 / SEC-071 | El argumento de tipo ruta se acepta tal cual («el directorio o su `epic.md`»), sin normalizarlo ni confinarlo a `REPO_ROOT/specs/flow/`. Después se escriben `<EPIC_DIR>/release-notes.md` y `epic.md` en esa ruta. Para explotarlo, el directorio de destino tendría que tener ya un `epic.md` en `VALIDATE/DONE` y un reporte `APPROVED`, por eso no se bloquea. `skills/epic-refine/SKILL.md:96` ya aplica este confinamiento a la misma forma de argumento. | Normalizar la ruta (separadores, `.`, `..` y enlaces simbólicos) y aceptarla solo si queda exactamente `specs/flow/EPIC-NN-<slug>/`, o su `epic.md`, con el mismo mensaje de rechazo que `epic-refine`. |
| LOW | skills/epic-ship/references/release-content.md:38 | SEC-051 | Los valores copiados (el `title` de la épica en `### EPIC-NN — <title>` y los `title` de las historias en las viñetas, así como en `{novedades}` y `{filas}`) solo escapan `<!--`. No normalizan los saltos de línea, aunque `TC-007` asume títulos que los contienen. Un `title` YAML con `\n## [9.9.9]` metería un encabezado de versión dentro del bloque de `CHANGELOG.md`, y `epic-complete` lee la versión de ese encabezado. Hoy lo mitigan dos cosas: la reejecución se detiene sin escribir porque los delimitadores quedan en secciones distintas, y el humano revisa `CHANGELOG.md` en el paso 1 de la liberación. | Al copiar cualquier escalar a `CHANGELOG.md` o al cuerpo de `release-notes.md`, normalizar CR/LF a un espacio, como ya se hace con el encabezado del template, y escapar `|` en las filas de la tabla. |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (12 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

1. Antes de VERIFY/ACCEPTANCE, un humano ejecuta `npm run test:eval -- epic-ship` (TC-001…TC-008) y el recorrido manual SMOKE-7, y registra en `implement-report.md` la fecha, el fixture, los cuatro `manual_checks` y el resultado.
2. Ejecutar `/story-verify STORY-170`.
3. Opcional, en una edición posterior: atender los hallazgos LOW. Los más útiles son el mensaje circular de bloque incompleto (`SKILL.md:111` ↔ `release-content.md:80`), que reportaron dos revisores; la normalización de saltos de línea en todos los escalares copiados; y la promoción de `[Unreleased]` en los pasos de liberación.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 20/24 ✓ y 4 ⚠️, sin ❌. Los cuatro ⚠️ (Gherkin pasan, CNF verificados, casos ejecutados, build de CI) requieren ejecutar los evals, SMOKE-7 o CI: no evaluable desde los artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead `approved`: skill en español, fuente única en `skills/`, layout fijo (`verify-fixed-layout` OK), sin secretos ni dependencias nuevas |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: AC-1…AC-4 cubiertos por TC-001…TC-008 y los `manual_checks` de TC-001 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration `approved`: gate `VALIDATE/DONE` + `APPROVED` coherente con `state-machine.md:182`; solo queda deriva LOW en las tablas de `design.md` |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los cuatro informes tienen `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 32/32 tareas `[x]`, ninguna `[ ]` ni `[!]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; esta revisión lo deja en `CODE-REVIEW/DONE` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este reporte (2026-10-31, ronda 2) |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
