---
type: implement-report
id: STORY-090
story: STORY-090
created: 2026-09-11
updated: 2026-09-11
related:
  - STORY-090-campos-declarados-nombran-su-escritor
---

<!-- Referencias -->
[[STORY-090-campos-declarados-nombran-su-escritor]]

# Implement Report: Todo campo declarado en un template nombra a su escritor

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí (evals generados; sin runner automático — ver nota) |
| Fase GREEN confirmada | sí (verificación estática de evals + contratos V-1..V-7, V-9..V-11) |
| Fase REFACTOR confirmada | sí (sin regresiones; subagente interrumpido por límite de sesión, no-regresión cerrada por el orquestador) |
| Archivos de prueba generados | 2 (`evals/story-creation.evals.json`, `evals/story-improve.evals.json` — 6 casos TC-NNN desde EV-001..EV-004) |
| Archivos de producción creados | 2 (`scripts/migrate-finvest-field.js`, `STORY-067/finvest-evaluation-report.md`) |
| Archivos de producción modificados | 50 (5 templates + 5 seeds + `story-evaluation/SKILL.md` + `constitution.md` + 38 `story.md`) |
| Commit | `acc7922 feat: implement STORY-090 - first part` (único, hecho por el usuario; incluye también traslado `docs/guides → docs/domain` y cambios de STORY-089) |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Generador `eval` (`skill-test-evals`) → 6 TC (3 `story-creation`: happy/fail-fast/edge · 3 `story-improve`: happy/fail-fast/edge). `unit`/`e2e` omitidos por `skill: none`. `npm run test:eval` exit 1 por script ausente en `package.json` — no hay runner; rojo no confirmable automáticamente |
| GREEN | ✅ | `skill-master` (capa `monolithic`) implementó los componentes de `design.md`: script de migración (D3), retiro del bloque FINVEST (D2), anotaciones `escritor:` en 5 templates + seeds (D1), equivalencia SPECIFY/DONE ⇔ APROBADA (D5), principio 13 (D6), resolución D4 de STORY-067/078, migración de 38 historias (dry-run → resolver → real → idempotencia) |
| REFACTOR | ✅ | Separador ` · ` homogéneo en todas las anotaciones; docblock del script documenta la variante tolerada (STORY-080). No-regresión: 0 MIGRADA / 82 SIN CAMBIOS / exit 0; fixtures 1/1/1/1; 5 seeds idénticos |

## Migración del campo FINVEST (evidencia en `.tmp/story-090/`)

| Ejecución | Resultado |
|---|---|
| `dry-run-1` (antes de D4) | 36 MIGRADA · 44 SIN CAMBIOS · 2 REQUIERE DECISIÓN (STORY-067, STORY-078) · exit 1 · sin cambios en git |
| Resolución D4 | STORY-067 → `finvest-evaluation-report.md` reconstruido (`finvest-score: 4.33`, `decision: APROBADA`, `evaluated: 2026-05-09`) · STORY-078 → bloque retirado + nota de pérdida aceptada en `## 📎 Notas` |
| `dry-run-2` | 37 MIGRADA · 45 SIN CAMBIOS · 0 REQUIERE DECISIÓN · exit 0 |
| `run-1` (real) | 37 MIGRADA · exit 0 |
| `run-2` (idempotencia) | 0 MIGRADA · exit 0 · `git status` idéntico |
| `refactor-run` (21:05) | 1 MIGRADA (STORY-089, re-editada por el usuario entre GREEN y REFACTOR) · exit 0 |
| Estado final (HEAD) | 0 MIGRADA · 82 SIN CAMBIOS · exit 0 · `grep "^\*\*FINVEST Score"` en historias → vacío |

Observaciones del script: `SIN CAMBIOS` incluye STORY-084/085 (directorios sin `story.md`); STORY-080 tenía el bloque con línea en blanco previa y sin `---` separador — variante tolerada y documentada en el docblock.

## Contratos de verificación (design.md)

| # | Resultado | Evidencia |
|---|---|---|
| V-1 | ✓ | `grep -c escritor` en los cinco templates: 13 / 14 / 12 / 17 / 17; inventario campo a campo en `.tmp/story-090/inventario-campos.md`; sin huérfanos además de FINVEST |
| V-2 | ✓ | Único hit del literal en `skills/*/assets/*-template.md`: `story-evaluation/assets/evaluation-output-template.md` (cuerpo del reporte FINVEST escrito por `story-evaluation`; no es template de `$SPECS_BASE/specs/templates/`) |
| V-3 | ✓ | `diff` vacío en las 5 parejas canónico/seed; `.claude/skills` refrescada con `install --force` |
| V-4 | ✓ (estático) | grep del literal vacío en los tres `SKILL.md` escritores; fallback §4c de `epic-generate-stories` sin FINVEST ni `escritor:`. La instanciación de prueba queda en TC-001 de `story-creation.evals.json` (pendiente de `/skill-test-evals evals story-creation` en `story-verify`) |
| V-5 | ✓ | Ninguna historia con `^**FINVEST Score`; muestreo 049/063/067/089: `---` seguido de `<!-- Referencias -->` |
| V-6 | ✓ | `dry-run-1` y `v6-run-real-sin-resolver.txt`: STORY-067/078 en `REQUIERE DECISIÓN`, archivos intactos, exit 1, resto `MIGRADA` |
| V-7 | ✓ | `run-2`: 0 MIGRADA, exit 0, sin cambios |
| V-8 | ⚠️ desviación | La migración **no** quedó en commit aislado: el usuario commiteó todo el working tree en `acc7922` junto con otros cambios. Revertir la migración requiere `git revert` parcial (solo `docs/specs/03-stories/**`). NFR-3 aceptado como desviación por decisión del usuario ("dejar todo sin commit" → commit propio) |
| V-9 | ✓ | Anotación de `status` en `story-template.md` y nota en `story-evaluation` Paso 7 declaran SPECIFY/DONE ⇔ APROBADA y el reporte como único registro |
| V-10 | ✓ | `constitution.md` ítem `13. **Todo campo declarado nombra a su escritor:** …` tras el 12, mismo formato; `updated: 2026-09-10` |
| V-11 | ✓ | `story-improve/SKILL.md` y `story-split/SKILL.md` sin cambios (siguen leyendo `finvest-evaluation-report.md`) |

## Decisiones del dueño del dato (tarea 1.2 — `.tmp/story-090/decisiones.md`)

- OQ-1 STORY-067: **reconstruir** el reporte (preserva el único score histórico).
- OQ-2 STORY-078: **aceptar la pérdida con nota** (decisión redundante con su `status`).
- CR-001: la detención cubre cualquier valor real en Score **o** Decisión — confirmado.

## Desviaciones y pendientes

- **NFR-3 / D8 (3 commits):** sustituido por un commit único del usuario (`acc7922`). Registrado en tareas 4.7, 6.5 y 7.2.
- **Evals sin runner:** `sddf.config.yaml` declara `verify.eval.command: npm run test:eval`, pero `package.json` no define el script. Los 6 TC se ejecutan con `/skill-test-evals evals story-creation` y `/skill-test-evals evals story-improve` (fase `story-verify`).
- **Fixtures de ejemplo** (`skills/story-improve/examples/*/story.md`, `skills/story-split/examples/input/epic-story.md`) conservan el campo por diseño (Non-Goal).
- **Historia hermana sugerida:** validación automatizada del principio 13 (script/eval que falle ante un campo sin `escritor:`), como declara `story.md` › Fuera de alcance.
- **Nota:** `status/substatus` de épica y `status` de proyecto se anotaron con "ningún skill lo transiciona hoy" — no son huérfanos (los escribe el creador), pero señalan una carencia del pipeline de épica/proyecto.

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan | ✓ | E2E-001..003 verificados por contratos V-1..V-7, V-9..V-11 |
| Criterios no funcionales verificados | ⚠️ | Sin pérdida de datos ✓ (V-6, D4) · Idempotencia ✓ (V-7) · Reversibilidad ⚠️ (commit no aislado — desviación aceptada) |
| El comportamiento coincide con `design.md` | ✓ | D1–D7 aplicados; D8 desviado (commits) |
| Sin regresiones | ✓ | `story-improve`/`story-split` intactos; script idempotente; `story-creation` lee el template central sin el bloque |
| Convenciones de `constitution.md` | ✓ | Node para lo ejecutable, kebab-case, UTF-8 sin BOM, sin dependencias |
| Sin código comentado ni `TODO` | ✓ | `grep TODO/FIXME` vacío en el script |
| Sin variables/imports/funciones sin usar | ✓ | Revisión manual del script (`fs`, `path` usados; todas las funciones invocadas) |
| Linter y formateador | ⚠️ | No hay linter configurado en el repo; `node --check` ok |
| Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| Se usó `skill-master` para skills nuevos | ✓ | No se crearon skills (N/A); GREEN/REFACTOR se ejecutaron vía `skill-master` como code_generator |
| Skill nuevo en `files` de `package.json` | ✓ | N/A — el script vive en `scripts/`, ya incluido en `files` |
| Checklist de Seguridad de IA | ⚠️ | No ejecutado formalmente; el cambio no introduce prompts ni entradas externas |
| Checklist de Seguridad de Código | ⚠️ | No ejecutado formalmente; script sin red, sin secretos, sin `eval` |
| Checklist de Creación de Skills | ✓ | N/A — sin skills nuevos |
| Skills críticos con `evals/evals.json` | ✓ | Evals de la historia en `evals/` (story-creation, story-improve) |
| Casos de prueba ejecutados automáticamente | ⚠️ | Sin runner (`test:eval` ausente); verificación estática + ejecución del script en fixtures |
| `tasks.md` todo `[x]` | ✓ | 38/38 (4.7, 6.5, 7.2 marcados con la desviación de commits) |
| README/docs actualizados si cambian contratos | ✓ | Constitución (principio 13) y `story-evaluation` Paso 7 actualizados; README no afectado |
| Decisiones no previstas documentadas en `design.md` | ✓ | CR-001 (STORY-078) ya registrado en `design.md` |
| CHANGELOG actualizado si aplica | ⚠️ | Pendiente: entrada en `[Unreleased]` (retiro del campo FINVEST del template, principio 13, `scripts/migrate-finvest-field.js`) |
| Build de CI pasa | ⚠️ | No hay CI configurado para este repo |
| Sin secrets en el código | ✓ | grep vacío |
| Variables de entorno documentadas | ✓ | N/A — el script no usa variables de entorno |
| Despliegue revertible sin pérdida de datos | ✓ | Dato de STORY-067 preservado en el reporte reconstruido; el bloque retirado se recupera con `git revert` parcial |

> Los evals de skills (`/skill-test-evals evals story-creation` y `story-improve`) deben ejecutarse en `story-verify` para confirmar el resultado final; ningún criterio DoD resultó `❌`.
