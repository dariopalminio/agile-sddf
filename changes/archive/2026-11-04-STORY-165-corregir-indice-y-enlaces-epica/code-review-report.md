---
type: code-review-report
story: STORY-165
title: "Code Review Report: Skill epic-refine (Core): corregir índice y enlaces de una épica"
verdict: APPROVED
date: 2026-10-30
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-165

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos con `status: approved`. Los cuatro confirman en el código real que el MEDIUM de la ronda 3 está corregido: en modo sandbox, `buildClaudeArgs` ya no concede `Write`/`Edit` sin ruta, y la prueba `test/run-evals.test.js:778` lo fija. Quedan 13 hallazgos LOW con solapamientos entre revisores (configuración heredada del CLI, fuga de lectura de `evals.json`, `README.md:538`, `CHANGELOG.md`, CR pendientes en `design.md`); ninguno bloquea.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-165 — Skill epic-refine (Core): corregir índice y enlaces de una épica |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-30 |
| Ronda de revisión | 4 (tras `fix-directives.md` ronda 3) |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | scripts/run-evals.js:693 | **Confinamiento residual que depende de la configuración del usuario.** `--strict-mcp-config` ignora solo la configuración MCP. Las reglas `permissions.allow` de los `settings.json` de usuario o de proyecto se siguen heredando. Si alguna concede `Edit`/`Write` sin ruta (o `Edit(//**)`), el agente evaluado podría volver a escribir fuera del sandbox sin aprobación. `snapshotTree` no lo detectaría. El runner ya no introduce esa vía por sí mismo, y `implement-report.md` justifica que se descartara `--restricted` por compatibilidad del CLI. | Documentar esta precondición en el USAGE o en `tech-stack.md` (el modo sandbox asume que la configuración no concede `Edit`/`Write` sin ruta). Si el CLI mínimo soportado lo permite, considerar `--setting-sources` acotado o `--settings` con un archivo de permisos propio. |
| LOW | scripts/run-evals.js:907 | Sigue abierto desde la ronda 3: el sandbox se crea dentro del repositorio (`.tmp/skill-test-evals/<skill>/sandbox/<TC>/`). El agente evaluado hereda el `CLAUDE.md`/`AGENTS.md` de la raíz y puede leer `skills/<skill>/evals/evals.json` por ruta relativa. Además, `buildSandboxPrompt` (l. 644) no repite la regla «no mires `expected`». Es fuga de expectativas, no de escritura. `implement-report.md` ya corrige su afirmación previa. | Crear el sandbox en `os.tmpdir()` (dejando la evidencia en `.tmp/…/runs/`) o, como mínimo, añadir al prompt sandbox «no leas fuera del directorio de trabajo ni la sección `expected`». |
| LOW | README.md:538 | Sigue desalineado: dice que Codex queda «en sandbox de solo lectura», pero con un caso `sandbox` el runner usa `workspace-write --cd <sandbox>` (`scripts/run-evals.js:702`). Estaba fuera de la lista blanca de la ronda 3. | Matizar: solo lectura por defecto; escritura confinada al directorio del sandbox en los casos con `sandbox`. |
| LOW | CHANGELOG.md:9 | `[Unreleased]` no tiene entrada para el modo sandbox opt-in de `npm run test:eval` (`sandbox`, `expected.files`), y `scripts/` se publica en el paquete. | Añadir una viñeta bajo `### Added`. |
| LOW | skills/epic-refine/references/sal-corrections.md:20 | Persiste la referencia a «Paso 3.5 del `SKILL.md`», que no existe; los catálogos INT y MAD dicen «punto 5 del Paso 3». | Cambiarla a «punto 5 del Paso 3 del `SKILL.md`» en la historia dueña del archivo (STORY-173) o en una ronda con autorización. |


---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Escenarios verificados: 3/3 (AC-1, AC-2, AC-3); CNF-1…CNF-5 con correspondencia.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/evals/evals.json:39 | Abierto desde la ronda 3. En AC-3, «ningún `epic.md` ni `story.md` se modifica» solo se comprueba sobre los bloques `=== FILE:` que transcribe la simulación de TC-003 (`not_contains` de `epic.md ===`, `story.md ===` y `.bak`). No hay caso sandbox que lo compruebe en disco, como sí tienen ya AC-1 (TC-023) y AC-2 (TC-024). El camino «sin ningún `C-NN`» (`SKILL.md:186`, que solo escribe el reporte) queda sin verificar en disco. El paso tiene aserción, así que no bloquea. | Opcional: añadir un caso sandbox con `fixture: skills/epic-refine/examples/solo-decisiones-po`, `flags: ["--auto"]`, `files.written: ["specs/flow/EPIC-30-ejemplo/epic-refine-report.md"]` y `files.contains` de `findings-out-of-scope: 3` en el reporte. |
| LOW | skills/epic-refine/evals/evals.json:103 | Aserción débil en CNF-2. TC-007 exige `Notas` y que no aparezca `status: COMPLETED`, pero no exige que la nota registre la ubicación `<ruta>:<línea>` del texto con forma de instrucción (`SKILL.md:76`). Tampoco exige que la línea F2 copie literal el `title` manipulado. | Opcional: añadir a `contains` un fragmento de la ubicación (p. ej. `STORY-304-` y `story.md:`) y el `title` literal de la línea F2. |


---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-165-corregir-indice-y-enlaces-epica/design.md:333 | Persiste desde la ronda 3. El modo sandbox de `scripts/run-evals.js` y los casos TC-023…TC-025 son ahora la verificación en disco de AC-1, AC-2 y D-6, pero `design.md` no los recoge. V-1, V-2 y V-4 (`:333-336`) siguen citando solo TC-001, TC-002 y TC-004. D-11 (`:257-281`) no lista los casos sandbox. El riesgo «Sin pruebas deterministas del comportamiento» (`:352`) ya no describe el estado actual. D-2 (`:82`) no refleja el confinamiento de la forma «ruta». Sin impacto funcional: el diseño queda por detrás de la implementación. | Añadir en el «Registro de Cambios» un CR-006 (el modo sandbox como mecanismo de verificación: V-1 → TC-023, V-2 → TC-024, V-4 → TC-025, permisos `acceptEdits` sin `Write`/`Edit`) y un CR-007 (confinamiento de la ruta derivado de D-9). No requiere ADR. |
| LOW | scripts/run-evals.js:691 | El comentario y la prueba (`test/run-evals.test.js:789`) dicen que «solo acceptEdits» aprueba escrituras y «únicamente en el cwd». El runner no neutraliza las reglas `Edit(...)`/`Write(...)` con ruta heredadas de la configuración: `--disallowedTools` solo cubre shell y web, y `--strict-mcp-config` solo MCP. El propio repositorio declara en `.claude/settings.local.json:8-14` reglas `Edit(/.claude/skills/**)`, que apuntan fuera del sandbox. Que se apliquen depende de cómo el CLI descubre la configuración desde el cwd anidado. Es un riesgo residual no demostrado y no rompe ningún contrato de `design.md`. | Matizar el comentario («salvo reglas con ruta heredadas de la configuración») o, si el CLI mínimo soportado lo permite, acotar las fuentes de configuración en el modo sandbox. Otra opción es crear el sandbox fuera de `REPO_ROOT` (`os.tmpdir()`), con lo que una fuga no alcanzaría el árbol de trabajo. |
| LOW | scripts/run-evals.js:644 | Persiste. `buildSandboxPrompt` no incluye la regla «No mires la sección "expected"» que sí lleva el prompt en seco (`:472`). El sandbox vive dentro de `REPO_ROOT` y `Read`/`Glob`/`Grep` no tienen ruta, así que `skills/epic-refine/evals/evals.json` sigue al alcance de lectura aunque la copia excluya `evals/`. Los dos contratos de prompt quedan sin paridad. | Añadir al prompt sandbox la misma regla, junto con «no leas fuera del directorio de trabajo». |
| LOW | README.md:538 | Persiste. Dice que las herramientas de Codex quedan «en sandbox de solo lectura». En un caso `sandbox` el runner usa `workspace-write --cd <sandbox>` (`scripts/run-evals.js:703`) y en Claude, `acceptEdits`. `tech-stack.md:88` y la cabecera del runner ya están alineados, pero el README no (regla de veracidad de AGENTS.md). | Matizar: solo lectura por defecto; escritura confinada a `.tmp/skill-test-evals/<skill>/sandbox/<TC>/` en los casos con `sandbox`. |
| LOW | CHANGELOG.md:9 | Persiste. `[Unreleased]` no tiene entrada para el contrato nuevo del runner (`sandbox`, `expected.files` con `written`/`contains`/`not_contains`/`backups`), que se publica en el paquete y que cualquier `evals.json` puede usar. | Añadir una viñeta que describa el modo sandbox opt-in y la calificación `expected.files`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (67 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | scripts/run-evals.js:685-693 | SEC-052 / AI-017 (mínimo privilegio) | El modo sandbox no aísla las fuentes de configuración del CLI `claude`. Las reglas `allow` de escritura (`Write(...)`/`Edit(...)`) o los `additionalDirectories` que el usuario tenga en su configuración global se siguen heredando y podrían aprobar ediciones fuera del cwd del sandbox. `--disallowedTools` cubre shell y web, pero no esa vía. Con la configuración por defecto no hay exposición. | Endurecimiento opcional: pasar `--setting-sources` limitado (o un `--settings` mínimo) en modo sandbox para no heredar reglas de permiso del usuario, o documentar la suposición en el USAGE. |


---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (20 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Historia lista para verificación final: ejecuta `/story-verify STORY-165`. Antes de la aceptación, ejecuta a criterio humano los evals pendientes que registra `implement-report.md`: `npm run test:eval -- epic-refine --only TC-023,TC-024,TC-025`, luego la suite completa y SMOKE-5 de EPIC-23. Los hallazgos LOW pueden resolverse en una historia de mantenimiento del runner de evals (documentar o aislar la configuración heredada del CLI en modo sandbox, alinear `README.md:538` y `CHANGELOG.md`, añadir CR-006/CR-007 a `design.md`).

---

## Cumplimiento DoD — Fase CODE-REVIEW

DoD: `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 15/24 ✓, 9 ⚠️, 0 ❌. Los ⚠️ requieren ejecutar evals o CI y no son evaluables desde los artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer: sin hallazgos de convenciones; ningún archivo con BOM |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: 3/3 (AC-1 → TC-023/TC-001, AC-2 → TC-024/TC-002, AC-3 → TC-003) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-11 conformes; solo desalineaciones LOW de documentación |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima de los cuatro informes: LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 35/35 tareas `[x]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `story.md` → `CODE-REVIEW/DONE` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
