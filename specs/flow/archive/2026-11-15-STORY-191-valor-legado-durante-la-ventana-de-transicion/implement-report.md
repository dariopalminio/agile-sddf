---
type: implement-report
id: STORY-191
slug: STORY-191-implement-report
title: "Implement Report: Valor legado durante la ventana de transición"
story: STORY-191
created: 2026-11-14
updated: 2026-11-14
---

# Reporte de Implementación: Valor legado durante la ventana de transición

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-191 |
| Total de tareas | 14 |
| Tareas completadas | 14 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-14 |

**Estado:** ✅ Implementación completa

En una frase: los dos ejecutores aceptan `READY-FOR-IMPLEMENT/DONE` como alias con aviso (ADR-0022, hasta 7.0.0) y lo tratan en memoria como `IMPLEMENT/TODO` o `PLAN/DONE` según exista `implement-report.md`, y `skill-preflight` gana la Verificación 3b, que avisa con `[WARNING]` de cada `story.md`/`epic.md` activo con status legado y su destino de edición manual.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Comprobar el estado de partida (ADR-0022, STORY-188/189/190, inventario, línea base) | ✓ completado | — |
| T002 | Evals de `skill-preflight` (5 casos nuevos) | ✓ completado | `skills/skill-preflight/evals/evals.json` |
| T003 | Verificación 3b — Status legado de work items | ✓ completado | `skills/skill-preflight/SKILL.md` |
| T004 | README de `skill-preflight` | ✓ completado | `skills/skill-preflight/README.md` |
| T005 | Evals de `story-implement` (2 nuevos, 1 renombrado, 3 migrados) | ✓ completado | `skills/story-implement/evals/evals.json` |
| T006 | Evals de `story-implement-tasks` (2 nuevos, 3 migrados) | ✓ completado | `skills/story-implement-tasks/evals/evals.json` |
| T007 | Alias con aviso en `story-implement` (0c.2) | ✓ completado | `skills/story-implement/SKILL.md` |
| T008 | Alias con aviso en `story-implement-tasks` (1d) | ✓ completado | `skills/story-implement-tasks/SKILL.md` |
| T009 | README de los ejecutores | ✓ completado | `skills/story-implement/README.md`, `skills/story-implement-tasks/README.md` |
| T010 | Clasificación de ocurrencias `READY-FOR-*` y diff de la región de layout | ✓ completado | — |
| T011 | Recorrido F-1/F-2/F-3 contra AC-1, AC-2, AC-3 y SMOKE-3 | ✓ completado | — |
| T012 | JSON válido e inventario de evals | ✓ completado | — |
| T013 | `npm run verify:repository` y `npm test` | ✓ completado | — |
| T014 | Sin BOM ni U+FEFF | ✓ completado | — |

---

## Notas de T001 (estado de partida)

- `docs/decisions/ADR-0022-workflows-sin-estados-buffer.md` existe con `status: ACCEPTED`; su regla (historia → `IMPLEMENT/TODO` con `implement-report.md`, `PLAN/DONE` sin él; épica → `PLAN/DONE`) y la ventana 6.0.0 → 7.0.0 coinciden con la Interfaz «Regla del valor legado».
- STORY-188, STORY-189 y STORY-190 ya estaban aplicadas en `skills/`: gates con `PLAN/DONE` e `IMPLEMENT/TODO`, `$ENTRADA_SUBSTATUS`, transición por exclusión (0c.4 y 2e), excepción `IMPLEMENT/TODO` del gate anticipado de 2c y el aviso `[WARN] story.md está en IMPLEMENT/TODO sin fix-directives.md`. La etiqueta del valor anterior en el rechazo era «valor anterior a 6.0.0».
- Versiones de partida: `story-implement` 1.6.0 (último TC-051), `story-implement-tasks` 1.3.0 (último TC-012), `skill-preflight` 2.1.0 (último TC-007). Casos en el valor legado: `story-implement` TC-011, TC-022, TC-033 y TC-047; `story-implement-tasks` TC-002, TC-003 y TC-004. Ninguno tenía `implement-report.md` en su entrada.
- La Verificación 3 de `skill-preflight` seguía en las líneas 90-112.
- Línea base: `npm run verify:repository` (salida 0) y `npm test` (592/592).
- **Diferencia con el diseño:** la skill en ejecución (`.claude/skills/story-implement-tasks`) es la copia instalada antes de STORY-188; las fuentes de `skills/` ya tenían las tres historias anteriores. Hace falta `npx agile-sddf install` para el dogfooding (riesgo ya anotado en design.md).

## Cambios por componente

- **C-1 (`story-implement` evals, 1.7.0):** TC-052 `legado-sin-implement-report-se-trata-como-plan-done` (AC-1 fila 1, SMOKE-3) y TC-053 `ready-for-dev-rechazado-lista-estados-admitidos` (AC-3 fila 1) son nuevos. TC-047 pasa a llamarse `legado-con-implement-report-y-fix-directives-entra-en-rework` y añade `implement-report.md` a su entrada y el aviso y la línea `IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS` a sus `contains` (AC-1 fila 2). TC-011, TC-022 y TC-033 se migran a `PLAN/DONE` (D-07) sin cambiar `expected`.
- **C-2 (`story-implement-tasks` evals, 1.4.0):** TC-013 `legado-con-implement-report-sin-fix-directives-avisa-implement-todo` (AC-1 fila 3) y TC-014 `legado-sin-implement-report-se-trata-como-plan-done` (AC-1 fila 4) son nuevos. TC-002, TC-003 y TC-004 se migran a `PLAN/DONE` (D-07). TC-003 conserva la salida anticipada.
- **C-3 (`skill-preflight` evals, 2.2.0):** TC-008 a TC-012 cubren AC-2 filas 1-5, AC-3 fila 2 y CNF-3.
- **C-4 / C-5 (ejecutores):** el gate (0c.2 / 1d) marca `READY-FOR-IMPLEMENT/DONE` como valor legado, dice que `READY-FOR-DEV` y los demás pares se rechazan, clasifica por la existencia de `implement-report.md`, emite `[WARN] Valor legado READY-FOR-IMPLEMENT/DONE (ADR-0022): se acepta durante la ventana de transición y se retira en 7.0.0 — se trata como <equivalente>` y sustituye `$ENTRADA_STATUS`/`$ENTRADA_SUBSTATUS` en memoria (`$ENTRADA_LEGADO`). La última línea del rechazo es `· READY-FOR-IMPLEMENT/DONE  (valor legado, se acepta con aviso hasta 7.0.0 — ADR-0022)`. Se reescriben con los estados nuevos el resumen del Paso 0c, el posicionamiento, 0c.4, la línea `Estado`, las tablas de precondiciones y de ciclo de vida, la nota del gate anticipado de 2c y 2e.
- **C-6 (`skill-preflight`):** se añade `### Verificación 3b — Status legado de work items` después de `<!-- SDDF-LEGACY-DIAGNOSTIC:end -->`, junto con viñetas en «Usar cuando» y «No hace» y una línea en el «Informe final». La región y las Verificaciones 1, 2, 4 y 5 no cambian.
- **C-7 (README):** cada README de ejecutor nombra el valor legado en una sola línea, la de los estados admitidos. El de `skill-preflight` añade el bloque «Status legados de work items».

## Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `node -e "JSON.parse(...)"` en los tres `evals.json` | JSON válido, ID únicos (53 / 14 / 9 casos) |
| `npm run verify:eval-inventory` | `[OK] Inventario de evals válido: 43 skills` |
| `npm run verify:repository` | salida 0 (`[OK] Verificación determinista del repositorio aprobada`) |
| `npm test` | 592 pruebas, 592 pasan, 0 fallan |
| Bytes `EF BB BF` en los archivos tocados | 0 en todos |

No se ejecutó `npm run test:eval` para `story-implement`, `story-implement-tasks` ni `skill-preflight`: según AGENTS.md, lo ejecuta una persona a mano.

## Verificación de CNF-2 (T010)

`grep -rnE "READY-FOR-(IMPLEMENT|DEV)"` sobre los tres skills (`.md`) solo devuelve:

- `skills/story-implement/SKILL.md`: líneas 278, 281, 292, 300 y 309, todas del Paso 0c.2.
- `skills/story-implement-tasks/SKILL.md`: líneas 245, 248, 260, 273 y 282, todas del Paso 1d.
- `skills/skill-preflight/SKILL.md`: línea 133, de la Verificación 3b.
- `skills/story-implement/README.md:100` y `skills/story-implement-tasks/README.md:36`: líneas de los estados admitidos.
- `skills/skill-preflight/README.md:26`: viñeta de la señal.

En los `evals.json`, `READY-FOR-*` solo aparece en la `input` de los casos `legado-*` y del caso de rechazo, y en los `expected` de los casos de rechazo, que listan los estados admitidos. `git diff -U0 skills/skill-preflight/SKILL.md` solo añade líneas en 25, 31, 116-155 (después del marcador `end`) y 197: no toca la región `SDDF-LEGACY-DIAGNOSTIC` ni la Verificación 2. Fuera de la transición de arranque, ningún paso de los ejecutores escribe `status`.

## Trazabilidad AC → paso → eval (T011)

| Fila | Paso del skill | Caso de eval |
|---|---|---|
| AC-1 fila 1 (`/story-implement`, sin reporte) | 0c.2 clasificador → `PLAN/DONE`; 0c.4 por exclusión | `story-implement` TC-052 |
| AC-1 fila 2 (`/story-implement`, reporte + directivas) | 0c.2 → `IMPLEMENT/TODO`; 0c.3 modo rework | `story-implement` TC-047 |
| AC-1 fila 3 (`/story-implement-tasks`, reporte sin directivas) | 1d → `IMPLEMENT/TODO`; 2c sin salida anticipada + aviso de STORY-190 | `story-implement-tasks` TC-013 |
| AC-1 fila 4 (`/story-implement-tasks`, sin reporte) | 1d → `PLAN/DONE`; 2e | `story-implement-tasks` TC-014 |
| AC-2 filas 1 y 3 | Verificación 3b, S1 historia sin reporte | `skill-preflight` TC-008 |
| AC-2 fila 2 | Verificación 3b, S1 historia con reporte | `skill-preflight` TC-009 |
| AC-2 filas 4 y 5 | Verificación 3b, S1 épica | `skill-preflight` TC-010 |
| AC-3 fila 1 | 0c.2, rechazo con cuatro estados | `story-implement` TC-053 |
| AC-3 fila 2 | Verificación 3b, alcance sin `archive/` | `skill-preflight` TC-011 |
| CNF-3 | Verificación 3b, frontmatter ilegible | `skill-preflight` TC-012 |
| SMOKE-3 | Verificación 3b y luego 0c.2 → `PLAN/DONE` | TC-008 + `story-implement` TC-052 |

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Cada fila tiene paso y caso de eval (ver Trazabilidad). Falta ejecutar `npm run test:eval`, que lo hace una persona |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: regla con texto idéntico en los tres skills. CNF-2: ver T010. CNF-3: 3b solo emite `[WARNING]` y continúa ante un frontmatter ilegible. CNF-4: sustitución solo en memoria. CNF-5: evals antes que `SKILL.md` en el orden de tareas. CNF-6: gate verde |
| 3 | El comportamiento coincide con `design.md` | ✓ | Interfaces del aviso, del rechazo, de la señal S1 y del frontmatter ilegible copiadas literalmente. D-01 a D-07 aplicadas |
| 4 | Sin regresiones | ✓ | `npm test` 592/592 y `verify:repository` con salida 0; los casos migrados por D-07 conservan sus `expected` |
| 5 | Convenciones de `constitution.md` | ✓ | Español, solo Markdown y JSON, fuente en `skills/` (no en los destinos de runtime) |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | No se añadió ninguno |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `$ENTRADA_LEGADO` está documentada en las variables de 0c y en el clasificador de 1d (complejidad justificada en design.md) |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` con salida 0 |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crea ningún skill |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crea ningún skill |
| 12 | [[gr-ai-security-checklist]] | ✓ | La señal de `skill-preflight` es de solo lectura y solo lee el frontmatter YAML. No ejecuta contenido de los work items |
| 13 | [[gr-code-security-checklist]] | ✓ | Sin código ejecutable nuevo, sin secretos |
| 14 | [[gr-skill-creation-checklist]] | ⚠️ | Se modifican skills existentes sin crear ninguno; no se reevaluó el checklist completo |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | Los tres skills tienen evals actualizados (TC-052/053, TC-013/014, TC-008..012) |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | Requiere ejecución de tests: no evaluable por story-implement (`npm run test:eval` es manual según AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 14/14 `[x]` |
| 18 | README o docs actualizados si cambian contratos | ✓ | Se actualizaron los README de los tres skills. Guías y `README.md` raíz quedan fuera de alcance (STORY-193) |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | Ninguna decisión nueva. La línea `Estado: PLAN/DONE ✓` de `story-implement-tasks` conserva el formato de STORY-188 |
| 20 | CHANGELOG si aplica | ⚠️ | Lo escribe `epic-ship` al liberar EPIC-029 |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI. Localmente, el mismo gate (`verify:repository`) y `npm test` pasan |
| 22 | Sin secretos expuestos | ✓ | Ninguno en los archivos tocados |
| 23 | Variables de entorno documentadas | ✓ | No aplica: no hay variables nuevas |
| 24 | Despliegue reversible | ✓ | Cambios solo en Markdown y JSON, reversibles con git |

**Resumen:** 19/24 criterios ✓ (5 ⚠️, 0 ❌)

---

## Observaciones

- El working tree tiene, además, cambios de otra sesión en `skills/epic-analyze/`, `skills/epic-refine/`, `skills/epic-generate-all-stories/SKILL.md` y `specs/flow/STORY-192-*`. No pertenecen a esta historia y no se tocaron.
- Tras implementar, falta `npx agile-sddf install` para que `.claude/skills/` refleje los cambios (dogfooding).

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- story-implement`, `npm run test:eval -- story-implement-tasks` y `npm run test:eval -- skill-preflight`
2. Si algún caso falla, revisar el `SKILL.md` correspondiente y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
