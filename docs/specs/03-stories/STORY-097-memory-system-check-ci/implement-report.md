---
type: implement-report
id: STORY-097
slug: STORY-097-memory-system-check-ci-implement-report
title: "Implement Report: Verificar la consistencia de la memoria con un modo check apto para CI"
story: STORY-097
parent: EPIC-20-memory-system
created: 2026-09-23
updated: 2026-09-23
related:
  - STORY-097-memory-system-check-ci
  - memory-system
---

<!-- Referencias -->
[[STORY-097-memory-system-check-ci]]
[[memory-system]]

# Implement Report: STORY-097

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí |
| Fase GREEN confirmada | sí |
| Fase REFACTOR confirmada | sí |
| Archivos de prueba generados | 2 (`evals/evals.json` con 4 casos nuevos; 13 tests `S097-`) |
| Archivos de producción generados | 2 fixtures nuevos + 1 guía sin versionar; 6 modificados + ~69 de `docs/**` |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Tipo `eval` vía `skill-test-evals` → TC-011…TC-014 en `skills/memory-system/evals/evals.json`. Tipos `unit` y `e2e` con `skill: none` en `sddf.config.yaml` (omisión declarada). Rojo confirmado: `check` → `subcomando no admitido` (exit 2), `--json` → `flag desconocido`, `examples/broken/` inexistente, `SKILL.md` sin modo `check`. |
| GREEN | ✅ | Capa `monolithic` vía `skill-master`, en dos invocaciones secuenciales (A: motor + fixtures + tests; B: SKILL.md + referencias + documentación + memoria del repo). `node --test test/memory-system.test.js` 40/40 · `npm test` 119/119 · evals 4/4 (100%). |
| REFACTOR | ✅ | Sin regresiones. Salida de `check` verificada **byte a byte idéntica** antes/después en los cinco escenarios, y `index --dry-run` sin cambios. `npm test` 119/119 · evals 4/4 tras el refactor. |

## Componentes entregados

| Componente | Acción | Ubicación |
|---|---|---|
| Subcomando `check` + 4 evaluadores puros + `REQUIRED_FIELDS` | modificar | `skills/memory-system/scripts/memory-system.js` |
| Campo `declared` en `deriveNode` (CR-005) | modificar | `skills/memory-system/scripts/memory-system.js` |
| Modo `check [--json] [--harness h]` + degradación sin Node | modificar | `skills/memory-system/SKILL.md` |
| Reglas de wikilink (D-2) y `REQUIRED_FIELDS` (D-3) | modificar | `skills/memory-system/references/memory-rules.md` |
| Fixture con un problema por familia + falsos positivos | crear | `skills/memory-system/examples/broken/` |
| Fixture sano (CR-004) | crear | `skills/memory-system/examples/sane/` |
| Casos TC-011…TC-014 | modificar | `skills/memory-system/evals/evals.json` |
| 13 tests `S097-` (UT-001…UT-011, E2E-001, E2E-002) | modificar | `test/memory-system.test.js` |
| §7 invariante 2 (CR-001) y §10.4 modo `check` | modificar | `docs/architecture/memory-system.md` |
| Gate de CI + nota de complementariedad (CR-003) | modificar | `docs/guides/sddf-commands-pipeline.md` |
| Mención de `check` · entrada `Added` 3.3.0 | modificar | `README.md`, `CHANGELOG.md` |
| Frontmatter y wikilinks corregidos (D-6) | modificar | ~69 archivos de `docs/**` |

## Evidencia de verificación

| Comando | Resultado |
|---|---|
| `node --test test/memory-system.test.js` | 40/40 pass · exit 0 |
| `npm test` | 119/119 pass · exit 0 |
| `npm run test:eval -- memory-system --only TC-011,TC-012,TC-013,TC-014` | 4/4 PASS (100%) · exit 0 |
| `npm run verify:links` | 38 archivos, enlaces y anclas resuelven · exit 0 |
| `npm run verify:syntax` | 34 archivos JS válidos · exit 0 |
| `npm run verify:eval-inventory` | 33 skills, 8 excepciones explícitas · exit 0 |
| `npm run verify:repository` | Verificación determinista aprobada · exit 0 |
| `check` sobre `examples/broken/docs` | `problemas: 4 (missing-layer 1 · orphan 1 · invalid-frontmatter 1 · broken-wikilink 1)` · exit 1 |
| `check` sobre `examples/sane/docs` | `problemas: 0` · exit 0 |
| `check --root no-existe` | stderr `raíz inexistente: …` · exit 2 (y con `--json`, stdout `{ "ok": false, "error": … }`) |
| `check --root docs --json` | 46 problemas · exit 1 · **0,33 s** (NFR-2 exige < 5 s) |
| T015 — solo lectura sobre `docs/` | 403 archivos, 0 modificados / 0 nuevos / 0 borrados tras `check` y `check --json` |
| T015 — wikilink roto a propósito en una guía | `broken-wikilink` 41 → 42, el problema aparece en `--json`, exit 1; guía restaurada byte a byte |
| T014 — `gr-skill-creation-checklist` | Todos los greps sin salida. Único hallazgo, `foambubble.github.io` en `assets/index-template.md`, es **preexistente** (STORY-095) |

## Memoria del repositorio (D-6)

`check --root docs` pasó de **145 a 46** problemas. Sigue devolviendo exit 1, como prevé el diseño.

| Familia | Antes | Después |
|---|---|---|
| missing-layer | 0 | 0 |
| orphan | 43 | 5 |
| invalid-frontmatter | 1 | 0 |
| broken-wikilink | 101 | 41 |

Corregido: `title` en `docs/domains/domain.md`; frontmatter mínimo (`type`, `slug`, `title`) derivado sin inventar en 38 archivos; 60 wikilinks rotos por errata, renombrado o referencia por ID en vez de por slug. También el frontmatter de `docs/architecture/memory-system.md`, que no cerraba (un em dash `—` donde debía ir `---`).

## Deuda registrada (46 problemas, no bloqueante)

Conforme a D-6 y a la sección *Risks / Trade-offs* de `design.md`, se corrigieron solo frontmatter faltante y wikilinks rotos evidentes. Queda:

1. **broken-wikilink · documento canónico aún no escrito (36)** — `[[state-machine]]` ×18, `[[specs-and-workflows]]` ×17, `[[specs_and_workflows]]` ×1. `EPIC-17/plan-09-state-machine-canonical-document.md` planifica precisamente ese documento: es trabajo pendiente legítimo, no una errata. No se borran los enlaces ni se inventa el destino.
2. **broken-wikilink · nodo de `templates/`, excluido del escaneo por diseño (3)** — `[[story-template]]`, `[[project-template]]`, `[[release-spec-template]]` en `EPIC-17/plan-06-*`. `templates/` no se escanea (sus wikilinks son placeholders), así que ningún template tiene slug; `release-spec-template` además ya no existe.
3. **broken-wikilink · destino ambiguo (1)** — `[[security-checklist]]` en `docs/domains/domain-knowledge-artifacts.md`: hay dos candidatos (`gr-code-security-checklist`, `gr-ai-security-checklist`) y elegir uno sería inventar.
4. **broken-wikilink · referencia a un skill, no a un nodo (1)** — `[[skill-preflight]]` en `STORY-053-*/story.md`.
5. **orphan · sin encabezado `#` del que derivar un `title` honesto (5)** — `domains/domain-skills-map.md` (**archivo de 0 bytes**), `STORY-080-skills-master/plan.md`, `STORY-084-skill-verify/plan-03.md`, `STORY-088-security-enhancement/plan-02-security.md`, `STORY-094-*/insights.md`.

### Otras observaciones

- **`docs/index.md` desactualizado** respecto a los nuevos frontmatter y títulos. Se regenera con `/memory-system index`; no se hizo para no inflar el diff de la historia.
- **Borde del gate no cubierto** — un error inesperado dentro de `check` (p. ej. `EACCES` al leer un nodo) se propaga a `main`, que devuelve **1**, indistinguible de "memoria con problemas" para un pipeline. La documentación reserva el 2 solo para los tres casos enumerados, así que no hay contradicción documental, pero ningún test cubre ese borde.
- **Ajeno a la historia** — `assets/agile-sddf-blueprint.png` aparece modificado en el working tree. Ambas versiones son PNG estructuralmente válidos pero de distinto tamaño (worktree 1660×768 vs HEAD 1668×770): es un re-exportado del diagrama, no una corrupción. No se tocó durante el ciclo.

## Desviaciones del proceso

- La Fase GREEN se dividió en **dos invocaciones secuenciales** de `skill-master` sobre la misma capa `monolithic` (A: motor, fixtures y tests; B: SKILL.md, referencias, documentación y memoria del repo). El primer intento en una sola invocación se cortó por límite de sesión sin escribir nada.
- **Aserción de la Fase RED ajustada** — TC-012, ver CR-006. No se relajó la semántica de AC-2.
- Los comandos de test se leyeron de la sección `verify:` de `sddf.config.yaml`; el skill `story-implement` especifica `defaults.{type}.command`, pero en este repositorio `defaults:` solo declara `delivery-model`.

## DoD IMPLEMENT

### ✅ Criterios de Aceptación

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan | ✓ | E2E-001 y E2E-002 implementados como tests `S097-`, en verde |
| Criterios no funcionales verificados | ⚠️ | NFR-1 (UT-008), NFR-2 (0,33 s ≪ 5 s), NFR-4 (`path` con `/`), NFR-5 (documentación) ✓. **NFR-3 parcial**: la degradación sin `node` en PATH (IT-002) está escrita en `SKILL.md` pero no se ejecutó en un entorno real sin Node — `testcases.md` ya la marca como verificación manual |
| El comportamiento coincide con `design.md` | ✓ | D-1…D-6 implementadas; divergencias registradas como CR-004, CR-005, CR-006 |
| No hay regresiones | ✓ | 119/119 en `npm test`; `verify:repository` aprobado; salida byte a byte idéntica tras REFACTOR |

### 💻 Criterios de Código

| Criterio | Estado | Observación |
|---|---|---|
| Sigue las convenciones de `constitution.md` | ⚠️ | El código mantiene el estilo del motor existente (JSDoc en español, comentarios que citan D-N/AC-N); no se hizo una auditoría formal contra `constitution.md` |
| No hay código comentado ni `TODO` sin issue | ✓ | `grep TODO\|FIXME` sin resultados en el motor y en los tests |
| No hay variables, imports ni funciones sin usar | ⚠️ | No verificable automáticamente: el repositorio no tiene linter configurado |
| Pasa el linter y el formateador sin errores | ⚠️ | No hay script de lint; `npm run verify:syntax` aprueba los 34 archivos JS |
| No se introducen dependencias nuevas | ✓ | Solo módulos `node:` (`fs`, `path`, `process`) |
| Se usó `skill-master` para crear skills | ✓ | Fases GREEN y REFACTOR delegadas a `skill-master` según `sddf.config.yaml` |
| Skill nuevo incluido en `files` de `package.json` | ✓ | No aplica: `memory-system` ya existía y `skills/` está en `files` |
| Checklist de Seguridad de IA | ⚠️ | No ejecutado en este ciclo |
| Checklist de Seguridad de Código | ⚠️ | No ejecutado en este ciclo; sin secrets detectados y sin dependencias nuevas |
| Checklist de Creación de Skills | ✓ | T014 ejecutado sobre `skills/memory-system`: greps sin salida; único hallazgo preexistente |

### 🧪 Criterios de Tests

| Criterio | Estado | Observación |
|---|---|---|
| Los skills críticos tienen `evals/evals.json` | ✓ | 14 casos en `skills/memory-system/evals/evals.json` |
| Casos de prueba ejecutados y evaluados automáticamente | ✓ | `npm run test:eval` → 4/4 PASS (100%), antes y después del refactor |

### 📝 Criterios de Documentación

| Criterio | Estado | Observación |
|---|---|---|
| `tasks.md` con todas las tareas `[x]` | ✓ | T001–T016 completadas con evidencia |
| README / docs actualizados si cambian contratos | ✓ | `README.md`, `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md` |
| Decisiones no previstas documentadas en `design.md` | ✓ | CR-004 (fixture sano), CR-005 (campo `declared`), CR-006 (aserción TC-012) |
| CHANGELOG actualizado | ✓ | Entrada `Added` en 3.3.0 |

### 🚀 Criterios de Integración y Despliegue

| Criterio | Estado | Observación |
|---|---|---|
| El build de CI pasa sin errores | ✓ | `npm run verify:repository` aprobado (incluye build, tests, smoke del tarball) |
| No hay secrets ni credenciales expuestos | ✓ | Grep del guardrail sin resultados |
| Variables de entorno documentadas | ✓ | No aplica: `check` no introduce variables nuevas |
| El despliegue puede revertirse sin pérdida de datos | ✓ | `check` es solo lectura; no hay migración ni estado persistido |

**Resultado:** sin criterios `❌`. Los `⚠️` corresponden a verificaciones manuales o a herramientas que el repositorio no tiene configuradas, no a incumplimientos detectados.
