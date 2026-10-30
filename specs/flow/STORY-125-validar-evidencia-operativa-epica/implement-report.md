---
type: implement-report
id: STORY-125
slug: STORY-125-implement-report
title: "Implement Report: Validar la evidencia operativa de una épica"
story: STORY-125
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Validar la evidencia operativa de una épica

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-125 |
| Total de tareas | 29 |
| Tareas completadas | 29 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa (con dos decisiones de implementación documentadas en `design.md`: D-11 y D-12, esta última pendiente de ratificación humana)

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Comprobar si existe el motor `check-command` de STORY-169 | ✓ completado — no existía (STORY-169 sigue en `READY-FOR-IMPLEMENT/DONE`); T002–T006 lo crean, no hay reutilización | — |
| T002 | Scaffold de `epic-suites.js` y del helper de pruebas | ✓ completado | `test/epic-suites.test.js`, `skills/epic-validate/scripts/epic-suites.js` |
| T003 | Detección previa de script npm no declarado | ✓ completado | ídem (`npmScriptOf`, `precheckCommand`) |
| T004 | `classifyCommand` (pass/fail/not-executable, duración, `outputTail`) | ✓ completado — más la comprobación previa del PATH (D-11) | ídem |
| T005 | Subcomando `check-command`, parseo de argumentos, salida 2, no escritura | ✓ completado | ídem (`parseArgs`, `main`) |
| T006 | Comando de smoke tests con el ID ya sustituido | ✓ completado | `test/epic-suites.test.js` |
| T007 | Reglas de smoke tests e historia dueña | ✓ completado | `skills/epic-validate/references/story-sources.md` (§6) |
| T008 | `--mode auto\|manual`, modo por defecto, dependencias y restricciones | ✓ completado | `skills/epic-validate/SKILL.md` |
| T009 | Paso 3b, rama `auto` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T010 | Paso 3b, rama `manual` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T011 | Agregación de `OPE-01` y sus motivos | ✓ completado | `skills/epic-validate/SKILL.md` |
| T012 | Paso 3c `OPE-02` `verify:release` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T013 | Paso 3d `OPE-03` DoD de validación de épica | ✓ completado | `skills/epic-validate/SKILL.md` |
| T014 | Veredicto con `omitida`, orden de motivos, consola y resumen | ✓ completado | `skills/epic-validate/SKILL.md` |
| T015 | Sección `smoke-epica` del template | ✓ completado | `skills/epic-validate/assets/epic-validate-report-template.md` |
| T016 | Sección `dod-epica` del template (STORY-169 no la había agregado) | ✓ completado | ídem |
| T017 | Filas `OPE-*` y `omitida` en `## Comprobaciones`, fila de smoke tests en `## Resumen`; `verify:validation-contract` | ✓ completado | ídem |
| T018 | Eval AC-1 modo auto (V-1) | ✓ completado | `skills/epic-validate/evals/evals.json` (TC-006) |
| T019 | Evals AC-1 modo manual (V-2, V-3) | ✓ completado | ídem (TC-007, TC-008) |
| T020 | Evals AC-2 evidencia fallida (V-4) | ✓ completado | ídem (TC-009, TC-010, TC-011) |
| T021 | Eval `BLOCKED` sin `verify.e2e-smoke` (V-6) | ✓ completado | ídem (TC-012) |
| T022 | Eval AC-3 (V-5) | ✓ completado | ídem (TC-013) |
| T023 | Fila `epic-validate` de `domain-skills-map.md` | ✓ completado | `docs/domains/domain-skills-map.md` |
| T024 | Aplicar CR-001 en `story.md` | ✓ completado | `story.md` (AC-2 → `NEEDS-CHANGES`; notas G-05) |
| T025 | Registrar CR-002 en `epic.md` › Notas | ✓ completado | `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` |
| T026 | `node --test test/epic-suites.test.js` y `npm test` | ✓ completado — 13/13 y 366/366 | — |
| T027 | `npm run verify:repository` | ✓ completado — `[OK] Verificación determinista del repositorio aprobada.` | — |
| T028 | Motor sobre este repositorio | ✓ completado — ver «Verificación del motor sobre el repositorio» | — |
| T029 | Evals de `epic-validate` para ejecución manual | ✓ completado — pendiente de ejecución humana (ver abajo) | — |

---

## Cambios fuera del plan

- **TC-001 y TC-004 (evals de STORY-124) ajustados.** Con `OPE-01`, una épica sin ningún `SMOKE-N` da `no cumple` (tabla «Comprobaciones operativas» de `design.md`). Así, TC-001 (espera `APPROVED`) y TC-004 (espera `BLOCKED`) habrían pasado a `NEEDS-CHANGES`. A sus fixtures se les añadió un `SMOKE-1` aprobado por el `acceptance-report.md` `APPROVED` de su historia dueña (modo manual por defecto, sin `verify.e2e-smoke`). Sus aserciones no cambian.
- **D-11 (en `design.md`).** Verificado en este equipo: con `shell: true`, Node lanza `cmd.exe /d /s /c`, que ante un comando desconocido sale con **1** y no con 9009. La regla de STORY-169 D-3 clasificaría entonces un binario ausente como `fail` (→ `NEEDS-CHANGES`). El motor comprueba antes de lanzar que el primer token resuelve a un archivo en el PATH (con `PATHEXT`) y mantiene `ENOENT`, 127 y 9009 como respaldo.
- **D-12 (en `design.md`), pendiente de ratificación humana.** `check-command` usa `spawnSync(command, { shell: true })`, como fija T004. Choca con la intención de `sec-no-shell-injection` de `gr-code-security-checklist`, aunque el grep de esa regla no lo detecta. La decisión registra por qué (cadenas de shell que declara el proyecto; `npm.cmd` no se lanza sin shell en Windows) y los controles compensatorios. **Es el primer script del repositorio que lanza un shell.**
- **CHANGELOG.** Entrada en `[Unreleased] › Added`, siguiendo la convención de las historias anteriores de EPIC-23.

---

## Verificación del motor sobre el repositorio (T028)

```
$ node skills/epic-validate/scripts/epic-suites.js check-command --repo-root . --command "npm run verify:release"
{"ok":true,"command":"npm run verify:release","outcome":"pass","exitCode":0,"durationSeconds":0.7,"reason":null,"outputTail":null}

$ node skills/epic-validate/scripts/epic-suites.js check-command --repo-root . --command "npm run test:e2e:smoke"
{"ok":true,"command":"npm run test:e2e:smoke","outcome":"not-executable","exitCode":null,"durationSeconds":null,"reason":"script npm test:e2e:smoke no declarado en package.json","outputTail":null}
```

Esto confirma el riesgo documentado: `--mode auto` sobre EPIC-23 da `BLOCKED` hasta que exista un runner de smoke tests. La validación del propio repositorio se hace con `--mode manual`, que es el modo por defecto porque `sddf.config.yaml` no declara un `verify.e2e-smoke.command` ejecutable.

---

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | AC-1…AC-3 están cubiertos por TC-006…TC-013, pero los evals no se ejecutaron (AGENTS.md: ejecución manual a criterio humano) |
| 2 | Los criterios no funcionales de `story.md` están verificados | ⚠️ | CNF-1 (columna «Fuente de evidencia», motivos con elemento y fuente) y CNF-2 (Paso 3b sin ejecución en manual) están en `SKILL.md` y en TC-007; requiere ejecución de evals |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | Pasos 1, 3b, 3c, 3d, 4 y 5 siguen C1–C11, la tabla de evidencia y las tablas de comprobaciones y motivos; las desviaciones están documentadas en D-11 y D-12 |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ✓ | `npm test` 366/366 y `npm run verify:repository` OK; TC-001…TC-005 conservan sus aserciones (fixtures de TC-001/TC-004 ajustados) |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | CommonJS sin dependencias, cabecera y estructura de `story-complete.js`, `node:test` + `node:assert/strict`, documentos en español |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | Revisado en `epic-suites.js` y `test/epic-suites.test.js` |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | Las funciones exportadas se usan en el CLI o en las pruebas |
| 8 | El código pasa el linter y el formateador sin errores ni warnings | ✓ | `verify:syntax` dentro de `verify:repository` OK (el repositorio no declara otro linter) |
| 9 | No se introducen dependencias nuevas sin aprobación del equipo | ✓ | Solo `fs`, `path` y `child_process` |
| 10 | Se usó el skill `skill-master` para crear skills nuevos | ✓ | No se crea ningún skill (N/A); `epic-validate` se modificó siguiendo `gr-skill-creation-checklist`, sin invocar `skill-master` |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No hay skill nuevo; `npm pack --dry-run` incluye `skills/epic-validate/scripts/epic-suites.js` |
| 12 | Se cumple [[gr-ai-security-checklist]] | ✓ | La cláusula de contenido untrusted se amplió a los reportes de las dueñas, al DoD y a la salida de los comandos; la confirmación manual falla cerrada (`sin evidencia` → `BLOCKED`) |
| 13 | Se cumple [[gr-code-security-checklist]] | ⚠️ | El grep de `sec-no-shell-injection` pasa, pero `check-command` usa `shell: true`: excepción documentada en D-12 con controles compensatorios, **pendiente de ratificación humana** |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ⚠️ | `SKILL.md` tiene 313 líneas, la descripción 395 caracteres y los enlaces a `scripts/` y `references/` resuelven. Los evals se escribieron antes que los cambios del `SKILL.md`, pero sin commit intermedio: el historial de git no lo muestra |
| 15 | Los skills críticos deben tener pruebas `evals/evals.json` | ✓ | `epic-validate/evals/evals.json` tiene 13 casos; `verify:eval-inventory` OK |
| 16 | Se ejecutaron y evaluaron los casos de prueba automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; `npm run test:eval -- epic-validate` queda para ejecución manual |
| 17 | El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]` | ✓ | 29/29 `[x]` |
| 18 | Si la historia modifica APIs públicas o contratos, el README o docs relevantes están actualizados | ✓ | `docs/domains/domain-skills-map.md` (T023), CHANGELOG, `SKILL.md` y template |
| 19 | Si se toman decisiones de diseño relevantes no previstas, se documentan en `design.md` | ✓ | D-11 y D-12 |
| 20 | El CHANGELOG o historial de releases se actualiza si aplica | ✓ | `CHANGELOG.md › [Unreleased] › Added`; `verify:release` OK |
| 21 | El build de CI pasa sin errores (build + tests + lint) | ⚠️ | Requiere ejecución de CI — el mismo gate (`verify:repository`) y `npm test` pasan en local |
| 22 | No hay secrets ni credenciales expuestos en el código | ✓ | Revisado; `verify:repository` incluye los gates de seguridad |
| 23 | Las variables de entorno necesarias están documentadas | ✓ | Ninguna nueva (el motor solo lee `PATH` y `PATHEXT` del sistema) |
| 24 | El despliegue puede revertirse sin pérdida de datos si algo falla | ✓ | Cambios de código y documentación sin migraciones ni datos |

**Resumen:** 18/24 criterios ✓ · 6 ⚠️ · 0 ❌

---

## Verificaciones pendientes (ejecución humana)

- `npm run test:eval -- epic-validate`: TC-001…TC-013 (V-1…V-6 de `design.md`, más la regresión de STORY-124). No se ejecutó para economizar cuota (AGENTS.md).
- Ratificar o rechazar D-12 (shell en `check-command`). Si se rechaza, la alternativa es partir el comando en argv y lanzar `npm` por su ruta a `npm-cli.js` con `process.execPath`, lo que limita los comandos admitidos.

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
`test/epic-suites.test.js` ya se ejecutó en esta sesión (13/13), igual que `npm test` (366/366).

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
