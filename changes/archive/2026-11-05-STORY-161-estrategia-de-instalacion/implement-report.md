---
type: implement-report
id: STORY-161
slug: STORY-161-implement-report
title: "Implement Report: Estrategia de instalación"
story: STORY-161
created: 2026-10-25
updated: 2026-10-25
---

# Reporte de Implementación: Estrategia de instalación

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-161 |
| Total de tareas | 29 |
| Tareas completadas | 29 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-25 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Imports de estrategia y helper `epicSkillNames()` | ✓ completado | `test/install.test.js` |
| T002 | Prueba `resolveInstallStrategy` | ✓ completado | `test/install.test.js` |
| T003 | Prueba `installSDDF({ strategy: 'story' })` | ✓ completado | `test/install.test.js` |
| T004 | Prueba `full` y sin estrategia | ✓ completado | `test/install.test.js` |
| T005 | Prueba `--force` + `story` local y global | ✓ completado | `test/install.test.js` |
| T006 | Prueba `promptStrategySelection` con `PassThrough` | ✓ completado | `test/install.test.js` |
| T007 | Prueba CLI `--strategy story` | ✓ completado | `test/install.test.js` |
| T008 | Prueba CLI sin `--strategy` y sin TTY | ✓ completado | `test/install.test.js` |
| T009 | Prueba CLI `--strategy` inválido / sin valor | ✓ completado | `test/install.test.js` |
| T010 | Prueba de ayuda con `--strategy` | ✓ completado | `test/install.test.js` |
| T011 | RED: 9 pruebas fallan, 10 previas pasan | ✓ completado | — |
| T012 | `INSTALL_STRATEGIES`, `VALID_STRATEGIES`, `DEFAULT_STRATEGY` | ✓ completado | `scripts/install.js` |
| T013 | `resolveInstallStrategy` | ✓ completado | `scripts/install.js` |
| T014 | `copyDir` con `shouldCopy` y `excluded` | ✓ completado | `scripts/install.js` |
| T015 | `installSDDF` resuelve la estrategia y filtra solo `skills/` | ✓ completado | `scripts/install.js` |
| T016 | Resumen y resultado con `strategy` y `skills.excluded` | ✓ completado | `scripts/install.js` |
| T017 | `promptStrategySelection` | ✓ completado | `scripts/install.js` |
| T018 | Exportaciones nuevas | ✓ completado | `scripts/install.js` |
| T019 | Imports, parseo y `exitInvalidStrategy` | ✓ completado | `scripts/cli.js` |
| T020 | Validación temprana de `--strategy` | ✓ completado | `scripts/cli.js` |
| T021 | Prompt de estrategia condicionado a TTY | ✓ completado | `scripts/cli.js` |
| T022 | `USAGE` con `--strategy` y ejemplo | ✓ completado | `scripts/cli.js` |
| T023 | GREEN: 19/19 en `test:installer`; sin refactor | ✓ completado | — |
| T024 | Sintaxis del comando en tech-stack | ✓ completado | `docs/architecture/tech-stack.md` |
| T025 | Sintaxis del comando en `## Comandos` | ✓ completado | `AGENTS.md` |
| T026 | Subsección «Estrategia: `full` o `story`» | ✓ completado | `README.md` |
| T027 | `npm test` (350/350) y `npm run verify:repository` aprobados | ✓ completado | — |
| T028 | Verificación AC-2 fila «con TTY» | ✓ completado (TTY simulado) | — |
| T029 | `graphify update .` | ✓ completado | — |

---

## Notas de implementación

- **Ubicación en el README:** la sección se titula `## Installation`, no «Instalación en tu runtime» como decía `design.md`; la subsección nueva va allí, después de «Codex: solo skills» y fuera de los marcadores `runtime-contract`.
- **`promptStrategySelection`:** escribe el menú en el stream `output` inyectado (no con `console.log`) para que la prueba con `PassThrough` capture el menú (D-5). Si `stdin` se cierra sin respuesta, el evento `close` resuelve `full`, que es la degradación de F-4.
- **T028:** no había terminal interactiva disponible. Se ejecutó el `scripts/cli.js` real con `process.stdin.isTTY` forzado a `true` y la respuesta `2` por stdin, con `install --target claude-code`. Resultado: se mostró el menú de estrategia, `.claude/skills` quedó sin `epic-*` (31 instalados, 6 excluidos) y el resumen dijo `strategy story`. Falta repetirlo en una terminal real.
- **Catálogo actual:** 37 skills, 6 `epic-*`. Las pruebas leen el catálogo de `skills/` y no fijan números.
- **CHANGELOG:** entrada en `[Unreleased] › Added`.

---

## Cumplimiento DoD — Fase IMPLEMENT

Archivo: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. En esta sesión pasaron las pruebas de AC-1 (T003, T007), AC-2 (T004, T006, T008; fila TTY simulada en T028) y AC-3 (T002, T009) |
| 2 | Los criterios no funcionales de `story.md` están verificados | ✓ | CNF-1: T009 con `assertNoRuntimeOutput`. CNF-2: T004, T005, T008. CNF-3: `USAGE` y T010. CNF-4: T027 |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1 a D-10 implementados; las desviaciones menores están en «Notas de implementación» |
| 4 | No hay regresiones | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. `npm test` dio 350/350 en esta sesión |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | CommonJS, sin dependencias nuevas, comentarios en español, mismo patrón que `--target` y `promptFolderSelection` |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Ninguno en `scripts/install.js`, `scripts/cli.js` ni `test/install.test.js` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Todos los imports y exportaciones nuevos se usan en `cli.js` o en las pruebas |
| 8 | Pasa el linter y el formateador | ⚠️ | El repo no tiene linter configurado; `npm run verify:repository` aprobó |
| 9 | Sin dependencias nuevas sin aprobación | ✓ | Solo `node:stream` (módulo nativo) en las pruebas |
| 10 | Se usó `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Skill nuevo incluido en `files` de `package.json` | ✓ | No aplica: no se crean skills |
| 12 | Se cumple `gr-ai-security-checklist` | ✓ | No se tocan prompts ni skills; el cambio es solo del instalador |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | `--strategy` se valida contra una lista cerrada antes de escribir. Ninguna ruta sale del valor, que solo elige una clave del catálogo. Sin `exec`/`eval`. El error repite solo el valor recibido. Los gates de seguridad de `verify:repository` aprobaron |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | No aplica: no se crean ni modifican skills |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | No aplica: ningún skill modificado |
| 16 | Casos de prueba evaluados según «Test Cases» de `skill-master` | ✓ | No aplica: ningún skill modificado; las pruebas del instalador son `node:test` |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 29/29 `[x]` |
| 18 | README/docs actualizados si cambia una API pública | ✓ | `USAGE`, `README.md`, `docs/architecture/tech-stack.md` y `AGENTS.md` |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | No hubo decisiones relevantes no previstas. Los detalles menores, dentro de D-5 y F-4, están en este reporte |
| 20 | CHANGELOG actualizado si aplica | ✓ | `CHANGELOG.md › [Unreleased] › Added` |
| 21 | El build de CI pasa | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement. El equivalente local, `npm run verify:repository`, aprobó |
| 22 | Sin secrets ni credenciales expuestos | ✓ | No se añaden credenciales |
| 23 | Variables de entorno documentadas | ✓ | No se introducen variables nuevas |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Cambio solo de código del instalador. La estrategia `story` no borra nada del destino (D-9) |

**Resumen:** 20/24 criterios ✓ · 4 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
En esta sesión ya se ejecutaron `npm run test:installer` (19/19), `npm test` (350/350) y `npm run verify:repository` (aprobado).

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
4. Repetir T028 en una terminal interactiva real: `node scripts/cli.js install --target claude-code` sobre un directorio temporal
