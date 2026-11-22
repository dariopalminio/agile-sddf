---
type: implement-report
id: STORY-091
story: STORY-091
created: 2026-09-12
updated: 2026-09-12
---

# Implement Report: story-implement toma de la cola una historia rechazada y corrige en modo rework

Generado por `/story-implement STORY-091` (modo interactivo, ejecución inicial — sin `fix-directives.md`, por lo que esta ejecución no fue en modo rework). Capa única `monolithic` (el "código de producción" son los skills Markdown). Generators: `eval` → `skill-test-evals`; `monolithic` → `skill-master`.

> Nota de contexto: el sujeto de esta historia es el propio `story-implement`. La ejecución se hizo con la versión instalada previa del skill (sin Paso 0c); el gate de estado y la escritura `IMPLEMENT/IN-PROGRESS` al arrancar se aplicaron manualmente por el orquestador conforme al comportamiento declarado. La copia instalada `.claude/skills/story-implement/` ya contiene la versión nueva (refrescada en REFACTOR), así que la próxima invocación de `/story-implement` ejecutará el Paso 0c real.

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí (por inspección estática — ver nota) |
| Fase GREEN confirmada | sí (por inspección estática — ver nota) |
| Fase REFACTOR confirmada | sí (sin regresiones estáticas; `.claude/skills/` refrescada, `diff -r` vacío) |
| Archivos de prueba generados | 1 (`skills/story-implement/evals/evals.json`: 9 casos previos → 22; 13 nuevos TC-010…TC-022, 3 modificados TC-004/007/008; `version` 1.1.0) |
| Archivos de producción generados | 0 |
| Archivos de producción modificados | 3 (`skills/story-implement/SKILL.md` 844 → 1031 líneas, `skills/story-implement/README.md`, `CHANGELOG.md`) |

> **Nota sobre la confirmación RED/GREEN:** el comando configurado en `sddf.config.yaml` para el tipo `eval` es `npm run test:eval`, que **no existe** en `package.json` (`Missing script: "test:eval"`). Confirmación por inspección estática: en RED, 0 ocurrencias en `SKILL.md` de los literales esperados por los casos nuevos (`Modo rework`, `rework_round`, `fix_directives_path`, `whitelist`, `Ejecuta /story-code-review`, `no está en un estado válido`, `Ciclo de corrección`, `Instrucción de rework`, `Paso 0c`); en GREEN y tras REFACTOR, 85/101 `contains` de los 22 casos aparecen literalmente en `SKILL.md` y los 16 restantes son valores de runtime (`🔁 Modo rework (ronda 2)`, `rework_round: 2|1|null`, `Ciclo de corrección — ronda 2`, nombres de skill del input, `[INFO] Modo de ejecución: interactive|auto`) cubiertos por los placeholders `(ronda {N})`, `{$REWORK_ROUND}`, `{$EXEC_MODE}`. La ejecución real (`/skill-test-evals evals story-implement`, tarea 5.2) queda para `/story-verify`.

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Tipo `eval` generado (`unit`/`e2e` omitidos por `skill: none` — omisión válida). EV-001…EV-013 de `testcases.md` → TC-010…TC-022 (nombres de D-7/tasks 1.1–1.6 respetados; TC-014 con `input.variants` a/b; TC-022 con `input.runs` 1 y 2); EV-014 implementado modificando TC-004/007/008 (tarea 1.7: `+ "Ejecuta /story-code-review"`, literal desactualizado `CODE-REVIEW` → `IMPLEMENT/DONE`). Rojo confirmado por inspección; `red-phase-status.json` escrito con `rework_round: null` |
| GREEN | ✅ | Capa `monolithic` en dos sub-invocaciones de `skill-master`: (1) flujo — nuevo Paso 0c (0c.1 `$STORY_DIR`; 0c.2 gate espejo del 1d de `story-implement-tasks`, ausentes ⇒ `SPECIFY/TODO`, reanudación re-ejecuta el ciclo completo; 0c.3 `$REWORK_MODE` por presencia de `fix-directives.md` como única señal, `$REWORK_ROUND` ⇒ 1 si falta/ilegible y nunca se escribe, `$REWORK_FINDINGS`, `$REWORK_MAX_SEVERITY`, `$WHITELIST [{path, note}]`, `[WARN] … whitelist vacía`; 0c.4 escritura `IMPLEMENT/IN-PROGRESS` + bloque `🚀 Iniciando implementación` con `Estado: … ✓` y `🔁 Modo rework (ronda N) — H hallazgo(s) bloqueante(s), W archivo(s) en lista blanca`), Paso 3 con `$STORY_DIR` y bundle con los tres campos siempre presentes, Paso 4/9/10 con contexto + "Instrucción de rework" condicional, fila nueva en omisiones inválidas, Paso 5 explícito, `rework_round` en `red-phase-status.json` y `cycle-status.json`, 11b sección condicional `## Ciclo de corrección — ronda {N}` (`✓ aplicado` / `⚠️ sin evidencia`, nunca `❌`), 11e con línea `🔁` condicional y pie `→ Ejecuta /story-code-review {story_id}` / `→ Resuelve los criterios DoD ❌ y re-ejecuta /story-implement {story_id}`; (2) docs — Objetivo/"Qué NO hace" (STORY-092, `verify-report`/`acceptance-report` no son señal), Posicionamiento corregido (NFR-1), Manejo de errores (+5 filas), Arquitectura de delegación, Salida, README (posicionamiento, precondiciones, sección "Modo rework") |
| REFACTOR | ✅ | Sin cambios de comportamiento: `{$RED_STORY_ID}` → `{story_id}` en Paso 4 (variable definida en Paso 7), `$TESTCASES_PATH`/`$STORY_PATH`/`$DESIGN_PATH` declarados en Paso 3, explicación canónica de propagación en 0c.3 con referencias cortas en 3/4/6/9/10/11e, "Validación post-escritura" a nivel `####`, 3 literales de la tabla de errores igualados al flujo, fila `fix-directives.md` retirada de Salida (es entrada de solo lectura), README sin duplicados. Copia instalada refrescada (`cp -r`; `scripts/install.js` no expone CLI) y verificada con `diff -r`. No-regresión estática: `contains_lost: []`, `not_contains_introduced: []` |

## Archivos

**Pruebas (RED):**
- `skills/story-implement/evals/evals.json` — TC-010…TC-022 nuevos (EV-001…EV-013); TC-004, TC-007, TC-008 modificados (EV-014)

**Producción (GREEN + REFACTOR):**
- `skills/story-implement/SKILL.md`, `skills/story-implement/README.md`
- `CHANGELOG.md` — entrada en `[Unreleased] › Changed` (CR-001: la escritura de `IMPLEMENT/IN-PROGRESS` al arrancar es comportamiento nuevo, no restaurado)
- `.claude/skills/story-implement/` (copia instalada, ignorada por git)

**Verificaciones estáticas (V-7, V-8, V-9, IT-006, IT-007, IT-008):** `grep -n "needs-changes"` en SKILL.md y README.md = 0 líneas; `verify-report|acceptance-report` solo en "Qué NO hace" (l. 44) y 0c.3 (l. 178); `tasks.md` solo en leyenda y notas "no guía el pipeline / no lee"; `$RED_STORY_ID` no aparece antes del Paso 7; `CODE-REVIEW/IN-PROGRESS` = 0 en ambos; sin BOM; `diff -r skills/story-implement .claude/skills/story-implement` vacío.

## Desviaciones respecto a `design.md`

- **`CHANGELOG.md` editado.** D7 dice que la historia "no toca docs fuera del skill" (en referencia a la guía de pipeline, para evitar ediciones concurrentes con STORY-089). CR-001 pide mencionar en el CHANGELOG que la escritura de `IMPLEMENT/IN-PROGRESS` es comportamiento nuevo, y el DoD exige CHANGELOG actualizado "si aplica"; STORY-089 ya está commiteada, así que no hay concurrencia. Se añadió una entrada de 8 líneas bajo `[Unreleased] › Changed`.
- **`[WARN]` adicional en 0c.3** para tabla "Instrucciones de corrección" ilegible (`[WARN] fix-directives.md sin tabla de hallazgos legible — continuando con 0 hallazgo(s)`): D2 solo fija el `[WARN]` de lista blanca, pero la interfaz "Lectura de `fix-directives.md`" dice "Fallos de parseo ⇒ `[WARN]` y valores vacíos, nunca detención"; este `[WARN]` concreta esa regla. Documentado en la tabla de errores.
- **Sin sección de rework en este reporte:** esta ejecución no fue en modo rework (STORY-091 no tiene `fix-directives.md`), así que la sección `## Ciclo de corrección — ronda N` no aplica (AC-2).
- Observaciones preexistentes no tocadas (fuera de alcance): el Posicionamiento describe a `story-implement` como "ejecuta TDD tarea por tarea" (semántica de `story-implement-tasks`); la plantilla de `implement-report.md` usa `<YYYY-MM-DD>` mientras 11c usa `{YYYY-MM-DD}`.

## Pendiente (fuera de esta ejecución)

- **T-5.2** — ejecución real de los evals: `/skill-test-evals evals story-implement` (22 casos; fase VERIFY).
- **T-5.4 / T-5.5** — fixture STORY-090: `/story-implement STORY-090` (hoy `READY-FOR-IMPLEMENT/DONE` + `fix-directives.md` sin `round`, con `tasks.md`) debe anunciar `🔁 Modo rework (ronda 1)` sin paso previo; después `/story-code-review STORY-090`. Es la única forma de observar cómo interpretan `skill-test-evals`/`skill-master` los campos `fix_directives_path`/`whitelist` (CR-002). Modifican el estado real de STORY-090 — requieren confirmación del usuario.
- **T-5.6** — recorrido del DoD CODE-REVIEW y cierre del checklist de la épica una vez 5.2–5.5 estén en verde (el checklist ya fue marcado `[x]` por el 11d de este skill; revertir a `[ ]` si el fixture falla).
- **Checkboxes de `testcases.md`:** no se marcaron porque no hubo ejecución; `story-verify` los actualiza.

## DoD IMPLEMENT

Fuente: `docs/policies/dod-story.md` › "Definition of Done para el estado IMPLEMENT" (24 criterios).

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan exitosamente | ⚠️ | Cubiertos por E2E-001…E2E-003 / TC-010, TC-011, TC-012; sin ejecución (`test:eval` inexistente). Verificar en `/story-verify` |
| Los criterios no funcionales de `story.md` están verificados | ✓ | NFR-1 (`grep needs-changes` = 0), NFR-3 (`round` ausente ⇒ 1, sin escribir; TC-016), NFR-4 (`tasks.md` solo en notas "no guía"); NFR-2 (idempotencia) por diseño (D8; TC-020), sin ejecución |
| El comportamiento coincide con lo especificado en `design.md` | ✓ | D1–D8 implementados; desviaciones menores documentadas arriba |
| No hay regresiones en las funcionalidades previamente trabajadas | ⚠️ | No-regresión estática limpia (literales de TC-001…TC-009 intactos); sin ejecución de evals |
| El código sigue las convenciones de `constitution.md` | ✓ | Gate con precondición (§10), orquestador sin lógica de negocio (§6: parser de lista blanca de una regla), `round` no se escribe desde este skill (principio 13), evals antes del SKILL.md (principio 11) |
| No hay código comentado ni `TODO` sin issue asociado | ✓ | `grep TODO` sin hallazgos en los archivos editados |
| No hay variables, imports ni funciones sin usar | ✓ | N/A (Markdown); `$STORY_DIR`, `$ENTRADA_STATUS`, `$REWORK_MODE`, `$REWORK_ROUND`, `$FIX_DIRECTIVES_PATH`, `$WHITELIST`, `$REWORK_FINDINGS`, `$REWORK_MAX_SEVERITY`, `$GREEN_FILES_MODIFIED`, `$REFACTOR_FILES_MODIFIED` consumidos en pasos posteriores |
| El código pasa el linter y el formateador | ✓ | N/A (sin linter para Markdown); JSON validado con `JSON.parse`; UTF-8 sin BOM |
| No se introducen dependencias nuevas | ✓ | `package.json` sin cambios |
| Se usó `skill-master` para crear skills nuevos | ✓ | No hay skills nuevos; las modificaciones se hicieron vía `skill-master` (GREEN/REFACTOR) |
| Nuevo skill incluido en `files` de `package.json` | ✓ | N/A — sin skill nuevo |
| Checklist de Seguridad de IA | ⚠️ | No evaluado en este ciclo; lo cubre `/story-code-review` |
| Checklist de Seguridad de Código | ⚠️ | Idem; solo Markdown/JSON, sin secretos ni ejecución |
| Checklist de Creación de Skills | ⚠️ | Estructura y frontmatter intactos; revisión formal en `/story-code-review` |
| Los skills críticos tienen `evals/evals.json` | ✓ | `story-implement` pasa de 9 a 22 casos |
| Se ejecutaron y evalúan los casos de prueba automáticamente | ⚠️ | **No ejecutados**: `npm run test:eval` no existe. Pendiente en VERIFY (T-5.2) |
| `tasks.md` con todas las tareas `[x]` | ⚠️ | 22/26 marcadas. Pendientes 5.2, 5.4, 5.5, 5.6 (ejecución de evals y fixture STORY-090) |
| README/docs actualizados si cambian contratos | ✓ | README del skill (posicionamiento, precondiciones, "Modo rework"), Arquitectura de delegación (bundles con tres campos nuevos) |
| Decisiones no previstas documentadas en `design.md` | ✓ | Sin decisiones nuevas; las desviaciones se registran en este reporte (no alteran D1–D8) |
| CHANGELOG actualizado | ✓ | Entrada en `[Unreleased] › Changed` |
| El build de CI pasa | ⚠️ | Sin CI configurado en el repo |
| No hay secrets ni credenciales expuestos | ✓ | Solo Markdown/JSON |
| Variables de entorno documentadas | ✓ | N/A — ninguna nueva |
| El despliegue puede revertirse | ✓ | Cambios en git; ningún archivo destruido |

**Resultado:** 16 ✓ · 8 ⚠️ · 0 ❌ → `$DOD_BLOQUEADO = false`. Los ⚠️ se concentran en la ejecución de pruebas (fase VERIFY) y en los checklists que evalúa `/story-code-review`.

> Los tests deben ejecutarse manualmente para confirmar el resultado final.
