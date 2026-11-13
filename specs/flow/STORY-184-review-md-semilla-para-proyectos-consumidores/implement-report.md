---
type: implement-report
id: STORY-184
slug: STORY-184-implement-report
title: "Implement Report: REVIEW.md semilla para proyectos consumidores"
story: STORY-184
created: 2026-11-11
updated: 2026-11-11
---

# Reporte de Implementación: REVIEW.md semilla para proyectos consumidores

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-184 |
| Total de tareas | 16 |
| Tareas completadas | 16 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-11 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Comprobar el estado de partida | ✓ completado | — (ver «Versión de partida») |
| T002 | Evals de la semilla (TC-001 a TC-004) | ✓ completado | `skills/sddf-constitution/evals/evals.json` |
| T003 | Retirar la exención de `sddf-constitution` | ✓ completado | `config/eval-exemptions.json` |
| T004 | Pruebas deterministas (RED) | ✓ completado | `test/sddf-constitution.test.js` |
| T005 | Plantilla semilla, copia binaria | ✓ completado | `skills/sddf-constitution/assets/REVIEW-template.md` |
| T006 | `### Paso 4 — Sembrar REVIEW.md` | ✓ completado | `skills/sddf-constitution/SKILL.md` |
| T007 | Renumerar los Pasos 4→5 (5a-5c) y 5→6 | ✓ completado | `skills/sddf-constitution/SKILL.md` |
| T008 | Resumen, «Qué hace», Entrada, Dependencias, Salida y `description` | ✓ completado | `skills/sddf-constitution/SKILL.md` |
| T009 | README del skill | ✓ completado | `skills/sddf-constitution/README.md` |
| T010 | `node --test test/sddf-constitution.test.js` (GREEN) | ✓ completado | — |
| T011 | `npm pack --dry-run --json` | ✓ completado | — |
| T012 | `ai-no-hidden-characters` y BOM | ✓ completado | — |
| T013 | Verificación de AC-1, AC-2, AC-3 con hashes | ✓ completado (ver nota de alcance) | — (evidencia en el scratchpad, no versionada) |
| T014 | `npm test` y `npm run verify:repository` | ✓ completado | — |
| T015 | Anotar `npm run test:eval -- sddf-constitution` | ✓ completado (pendiente de decisión humana) | — |
| T016 | Alcance de cambios (`git status`, `git diff --stat`) | ✓ completado | — |

---

## Versión de partida (T001)

- `skills/sddf-constitution/assets/` tenía `project-constitution-template.md` y `dod-story/`; no existían `REVIEW-template.md` ni `evals/`.
- `config/eval-exemptions.json` eximía solo a `sddf-constitution`; EV-003 afirmaba la exención.
- El Paso 3 de `SKILL.md` salía con «continuar con el Paso 4» en 3a, 3b `n` y 3c; el Paso 4 era el registro en `CLAUDE.md` (4a-4c) y el Paso 5, el resumen.
- `docs/templates/REVIEW-template.md` tenía los cuatro `##` esperados por UT-002.
- `grep -rn "sddf-constitution" test scripts`: solo `test/dod-story-code-review.test.js` cita una ruta de `assets/dod-story/`. Ninguna prueba ni script fija el `description` del frontmatter ni los números de paso. `skills/sddf-init/SKILL.md` habla de sus propios Pasos 5 y 6, no de los de este skill.

## Cambios realizados

- **Evals primero (CNF-3):** `evals/evals.json` (versión `1.0.0`, `story: STORY-184`) se escribió y `npm run verify:eval-inventory` pasó (`[OK] … 43 skills; 0 excepción(es)`) antes de tocar `SKILL.md`. La `description` dice que los casos cubren solo la semilla de `REVIEW.md` (CR-001).
- **Plantilla (C-1):** copia con `cp` de `docs/templates/REVIEW-template.md`; `cmp` no devuelve diferencias.
- **Skill (C-2):** Paso 4 nuevo con la condición por existencia (archivo, directorio o enlace, sin abrirlo), la copia literal, los cuatro mensajes de I-4 copiados tal cual y la regla de que nunca bloquea. El registro en `CLAUDE.md` pasa a ser el Paso 5 (5a-5c) y el resumen el Paso 6, con el bloque `📝 Guía de revisión:`. Las tres salidas del Paso 3 no se editaron: ahora apuntan a la semilla (D-2). El `description` añade la semilla sin quitar ningún disparador.
- **README (C-3):** viñeta en «What it does», fila en `## Input`, línea en `## Output` y «tampoco sobrescribe `REVIEW.md`».
- **Pruebas (C-6):** E2E-001 exige la plantilla y los evals; EV-003 afirma que no hay exención; IT-001 comprueba que la plantilla llega a cada runtime; UT-001 (igualdad byte a byte), UT-002 (secciones por prefijo, sin BOM ni caracteres invisibles) y EV-005 (literales del Paso 4 y de los evals) son nuevos.
- **Desviación (CR-004 en `design.md`, INC-001 de `analyze.md`):** en TC-002, `Sobreescribir` se sustituyó en `not_contains` por `❌ No se pudo crear REVIEW.md`. El Paso 2c imprime `(s) Sobreescribir con el template en blanco` cuando la constitución existe, así que el caso original habría fallado con un Paso 4 correcto.
- **Incidencia de codificación (corregida):** la primera escritura de `HIDDEN_CHARACTERS` en la prueba dejó los code points como caracteres literales en lugar de escapes `\u`. Se detectó con el grep de `ai-no-hidden-characters` y se reescribió la línea por bytes con Node; el grep final no devuelve nada.

## Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `npm run verify:eval-inventory` (tras T003, antes del skill) | `[OK] Inventario de evals válido: 43 skills; 0 excepción(es) explícita(s).` |
| `node --test test/sddf-constitution.test.js` tras T004 | RED: 5 fallos (E2E-001, IT-001, UT-001, UT-002, EV-005); EV-003 ya pasa |
| Ídem tras T005 | 9/10: solo falla EV-005 (falta el Paso 4) |
| Ídem tras T006-T009 (T010) | GREEN: 10/10 |
| `npm pack --dry-run --json` (T011) | lista `skills/sddf-constitution/assets/REVIEW-template.md` y `skills/sddf-constitution/evals/evals.json`; no lista `REVIEW.md` |
| `ai-no-hidden-characters` sobre los seis archivos del alcance (T012) | ninguna coincidencia; ningún archivo empieza por `EF BB BF` |
| `npm test` (T014) | 566/566, código 0 |
| `npm run verify:repository` (T014) | código 0: `[OK] Smoke del tarball aprobó 4 runtime(s) declarados.` y `[OK] Verificación determinista del repositorio aprobada.` |
| `npm run test:eval -- sddf-constitution` (T015, contrato 7) | **no ejecutado**: queda a criterio humano (AGENTS.md). Cubre TC-001 a TC-004 |

## Verificación de AC-1, AC-2 y AC-3 (T013, contrato 6, SMOKE-4)

Se instaló el paquete de la rama (`installSDDF`, runtime `claude-code`) en dos proyectos temporales del scratchpad. El `SKILL.md` instalado es igual byte a byte al de la fuente. Cada proyecto tenía `docs/constitution.md`, los seis DoD, `docs/policies/README.md` y `CLAUDE.md` con `@docs/constitution.md`. Se siguió el flujo del skill instalado respondiendo `n` a cada pregunta y se calculó el SHA-256 de todo el árbol (`docs/`, `CLAUDE.md`, `REVIEW.md`) antes y después.

| Escenario | Mensaje del Paso 4 | Evidencia |
|---|---|---|
| AC-2: `REVIEW.md` propio | `ℹ️ Conservado: REVIEW.md (ya existe)` | SHA-256 de `REVIEW.md` `06fdf4f9…d3bc8d49` antes y después; el árbol completo no cambia. Constitución, DoD y registro en `CLAUDE.md` siguen su flujo (`saltado`, `ya existían 6`, `sin cambios`) |
| AC-1: sin `REVIEW.md`, 1.ª ejecución | `✅ Creado: REVIEW.md` y la línea `Edita sus [placeholders]: …` | El único cambio del árbol es `REVIEW.md` (`1f6ffc12…df8eb744`), igual byte a byte a la plantilla instalada |
| AC-3: 2.ª ejecución | `ℹ️ Conservado: REVIEW.md (ya existe)` | El árbol, `REVIEW.md` incluido, es igual tras la 1.ª y la 2.ª ejecución |

**Nota de alcance:** el flujo lo ejecutó el agente en esta sesión siguiendo el `SKILL.md` instalado, no una sesión nueva abierta en el proyecto temporal (INC-002 de `analyze.md`). La ejecución en una sesión limpia la cubren los evals TC-001 a TC-004, pendientes de decisión humana, y puede repetirse en VERIFY.

## Alcance de cambios (T016)

`git status --short`: `config/eval-exemptions.json`, `skills/sddf-constitution/README.md`, `skills/sddf-constitution/SKILL.md`, `test/sddf-constitution.test.js` (modificados), `skills/sddf-constitution/assets/REVIEW-template.md` y `skills/sddf-constitution/evals/` (nuevos), y los artefactos de `specs/flow/STORY-184-review-md-semilla-para-proyectos-consumidores/` y el checklist de `epic.md`. Sin cambios en `docs/templates/`, `package.json`, `sddf-init` ni `story-code-review`.

El agente no hace commits (AGENTS.md), así que la evidencia del orden «evals antes que el skill» (contrato 8) es el registro de esta ejecución: T002-T003 y su `verify:eval-inventory` en verde antes de T006-T008.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | AC-1, AC-2 y AC-3 verificados con hashes en T013 (ejecución del agente); los evals TC-001 a TC-004 no se ejecutaron (a criterio humano) |
| 2 | Los criterios no funcionales de `story.md` están verificados | ✓ | CNF-1: UT-001 y `cmp`. CNF-2: IT-001 y `npm pack --dry-run`. CNF-3: evals e inventario antes del skill. CNF-4: T012 |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | C-1 a C-6 e I-1 a I-6 implementados; la desviación se registró como CR-004 |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ✓ | `npm test` 566/566 |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | `node:test`, CommonJS, `'use strict'`, textos en español, como el resto de `test/sddf-constitution.test.js` |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | Los comentarios nuevos de la prueba son explicativos |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | Las constantes nuevas se usan en UT-001, UT-002 y EV-005 |
| 8 | El código pasa el linter y el formateador sin errores ni warnings | ⚠️ | El repositorio no tiene linter configurado; la sintaxis la valida `verify:repository` |
| 9 | No se introducen dependencias nuevas sin aprobación del equipo | ✓ | Solo módulos `node:` |
| 10 | Se usó el skill `skill-master` para crear skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Skill nuevo incluido en `files` de `package.json` | ✓ | No aplica; `skills/` ya se publica (T011) |
| 12 | Se cumple [[gr-ai-security-checklist]] | ✓ | `ai-no-hidden-characters` sin coincidencias; sin entrada externa ni credenciales |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | La prueba solo lee archivos del repositorio e instala en un temporal |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | El skill gana evals y pierde su exención; layout fijo verificado por `verify:repository` |
| 15 | Los skills críticos deben tener pruebas `evals/evals.json` | ✓ | `sddf-constitution` tiene TC-001 a TC-004 |
| 16 | Se ejecutaron y evaluaron los casos de prueba automáticamente («Test Cases» de `skill-master`) | ⚠️ | Requiere `npm run test:eval -- sddf-constitution`; queda a criterio humano |
| 17 | El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]` | ✓ | 16/16 `[x]` |
| 18 | Si la historia modifica APIs públicas o contratos, el README o docs relevantes están actualizados | ✓ | `SKILL.md` y `README.md` del skill describen el Paso 4 |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | CR-004 |
| 20 | El CHANGELOG se actualiza si aplica | ✓ | No aplica a nivel de historia: el bloque lo escribe `/epic-ship`. Para esas notas: un consumidor que actualice sin `--force` conserva el skill anterior completo (observación 4 de `analyze.md`) |
| 21 | El build de CI pasa sin errores | ⚠️ | Requiere ejecución en CI; el gate local `verify:repository` (el mismo de `quality.yml`) pasa |
| 22 | No hay secrets ni credenciales expuestos | ✓ | Ninguno en los archivos modificados |
| 23 | Las variables de entorno necesarias están documentadas | ✓ | No se añaden variables |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Solo cambian Markdown, JSON y pruebas; el Paso 4 nunca sobrescribe |

**Resumen:** 20/24 criterios ✓ (4 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
En esta ejecución ya se corrieron `node --test test/sddf-constitution.test.js`, `npm test` y `npm run verify:repository` (ver «Pruebas ejecutadas»). Queda pendiente, a criterio humano:

```
npm run test:eval -- sddf-constitution
```
