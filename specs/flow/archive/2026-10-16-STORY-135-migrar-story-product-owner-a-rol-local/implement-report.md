---
type: implement-report
id: STORY-135
slug: STORY-135-implement-report
title: "Implement Report: Migrar story-product-owner a rol local"
story: STORY-135
created: 2026-10-15
updated: 2026-10-15
---

# Reporte de Implementación: Migrar story-product-owner a rol local

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-135 |
| Total de tareas | 34 |
| Tareas completadas | 34 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-15 |

**Estado:** ✅ Implementación completa (AC-1, AC-2 y AC-3; G-1 cumplida)

**Precondición G-1 (T002):** `git ls-files "agents/*.agent.md"` listaba solo `agents/story-product-owner.agent.md` y `git ls-files -o agents` no listaba nada. STORY-129 y STORY-131…134 están en `CODE-REVIEW/DONE`. El retiro de `agents/` (AC-3) se ejecutó.

**Línea base (T001):** coincide con el «Estado medido» del diseño. Diferencias sin efecto: `wc -l` da 90 y 314 (los archivos no terminan en salto de línea; las líneas citadas coinciden), y en `README.md` la frase de D-10 «reciben skills y agentes…» está en l.307, no en l.312.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Confirmar el estado medido | ✓ completado | — |
| T002 | Comprobar G-1 | ✓ completado (G-1 cumplida) | — |
| T003 | `git mv` del agente al rol local | ✓ completado | `skills/story-specify/assets/agents/product-owner.md` |
| T004 | Frontmatter de I-1 | ✓ completado | `skills/story-specify/assets/agents/product-owner.md` |
| T005 | Tres ajustes del cuerpo (D-3) | ✓ completado | `skills/story-specify/assets/agents/product-owner.md` (83 líneas) |
| T006 | Comprobación del rol en el Paso 0 y fila de errores | ✓ completado | `skills/story-specify/SKILL.md` |
| T007 | Paso 1, Caso A | ✓ completado | `skills/story-specify/SKILL.md` |
| T008 | Paso 5B | ✓ completado | `skills/story-specify/SKILL.md` |
| T009 | Objetivo, Dependencias y Restricciones | ✓ completado | `skills/story-specify/SKILL.md` |
| T010 | Ficha del skill | ✓ completado | `skills/story-specify/README.md` |
| T011 | TC-005 corregido | ✓ completado | `skills/story-specify/evals/evals.json` |
| T012 | TC-007 y TC-008 | ✓ completado | `skills/story-specify/evals/evals.json` |
| T013 | Eliminar `agents/` | ✓ completado | — (directorio eliminado) |
| T014 | Quitar `"agents/"` de `files` | ✓ completado | `package.json` |
| T015 | Pruebas de instalación condicionadas a la fuente | ✓ completado (RED: 2 fallos con `agents/` ausente → GREEN: 11/11) | `test/install.test.js` |
| T016 | Smoke del tarball condicionado a la fuente | ✓ completado (RED: `claude-code local agents: fuente ausente` → GREEN: 4 runtimes) | `scripts/smoke-package-install.js` |
| T017 | `AGENTS.md:8` | ✓ completado | `AGENTS.md` |
| T018 | `README.md` (l.77, l.307, l.315) | ✓ completado | `README.md` |
| T019 | `SECURITY.md:6` | ✓ completado | `SECURITY.md` |
| T020 | Árboles de arquitectura y stack | ✓ completado | `docs/architecture/sddf-architecture.md`, `docs/architecture/tech-stack.md` |
| T021 | `docs/constitution.md:259` | ✓ completado | `docs/constitution.md` |
| T022 | Contrato 1 | ✓ completado | — |
| T023 | Contratos 2 y 7 (similitud 78 %, cambios solo en frontmatter y en los tres ajustes de D-3) | ✓ completado | — |
| T024 | Contrato 3 (`git grep` sin salida) | ✓ completado | — |
| T025 | Contrato 4 | ✓ completado | — |
| T026 | Contratos 5 y 6 (4 puntos; «No lances un subagente» = 2; `### Paso` = 0; `### Fase` = 5) | ✓ completado | — |
| T027 | Contrato 8 (sin BOM ni mojibake) | ✓ completado | — |
| T028 | Contrato 9 (TC-001…TC-008; `not_contains` de TC-007 parseado = `agents/story-product-owner`) | ✓ completado | — |
| T029 | Contrato 11 | ✓ completado | — |
| T030 | Contrato 13 (solo quedan las excepciones `SECURITY.md:68` y `docs/constitution.md:126`) | ✓ completado | — |
| T031 | `npm test` y smoke del tarball | ✓ completado | — |
| T032 | `npm run verify:repository` | ✓ completado (exit 0) | — |
| T033 | Contrato 10 a ejecución manual | ✓ completado (ver abajo) | — |
| T034 | Entorno local de dogfooding | ✓ completado | — (`.claude/` ignorado) |

---

## Desviaciones respecto del diseño

Registradas como CR-003 en `design.md`:

1. **`description` entre comillas dobles.** El texto contiene `: `; como escalar plano en una línea sería YAML inválido. Se mantiene en una sola línea, como pide T004.
2. **Mensaje en `### Manejo de errores`.** La columna «Mensaje» muestra `❌ Rol local no encontrado: assets/agents/product-owner.md` en lugar de «I-3», que es un identificador interno del diseño.

---

## Ejecuciones

| Comando | Resultado |
|---|---|
| `node --test test/install.test.js` | 11/11 ✓ |
| `node scripts/smoke-package-install.js` | `[OK] Smoke del tarball aprobó 4 runtime(s) declarados.` |
| `npm test` (suite completa, aislada) | 250/251; el único fallo fue `S097-UT-011` (`check` de `docs/` en menos de 5 s), una prueba de tiempo que pasa sola y dentro de `verify:repository`. No está relacionada con esta historia |
| `npm run verify:repository` | exit 0, `# fail 0` |
| `node scripts/cli.js install --target claude-code --force` | `34 skills, 0 agents`; existe `.claude/skills/story-specify/assets/agents/product-owner.md` |

**T034:** en `.claude/agents/` solo quedaba `story-product-owner.agent.md`, la copia instalada del agente global. Se borró a mano antes de reinstalar; `.claude/agents/` queda vacía.

---

## Pendiente a ejecución manual (T033)

- **Contrato 10:** `npm run test:eval -- story-specify` (TC-001…TC-008 en verde) queda a criterio del humano, según `AGENTS.md`.
- **Mitigación (Risks):** si alguno de TC-001…TC-006 falla porque el runner asume que falta el rol, añade «existe el rol local product-owner» a su `input.context` sin tocar `expected`.
- **AC-3:** no quedó pendiente; G-1 se cumplió.

## Observaciones para la épica

- La nota de `epic.md` (sección Notas) que describe el retiro de `agents/` como «un chore de cierre… sin historia propia» quedó desactualizada: el retiro lo hizo esta historia (AC-3). No se editó porque `epic.md` no está en el alcance de las tareas.
- Siguen nombrando `story-product-owner` o `agents/` los registros históricos que el diseño excluye (`CHANGELOG.md`, `docs/product/roadmap.md`, `docs/product/story-map.md`, `FR-034` y ADR-0014). Quedan para el chore de documentación del release major.

---

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-3 verificado con ejecución (contratos 11–14). AC-1 y AC-2 se miden con evals (TC-007 y TC-008), que se ejecutan a mano |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: el rol corre en la sesión. «No lances un subagente» aparece 2 veces en `SKILL.md` y el rol dice «No lances subagentes ni delegues trabajo» |
| 3 | El comportamiento coincide con `design.md` | ✓ | Contratos 1–9 y 11–14 cumplidos; desviaciones menores registradas en CR-003 |
| 4 | Sin regresiones | ⚠️ | Requiere ejecución de tests: `verify:repository` en verde localmente; prueba de tiempo inestable `S097-UT-011`, ajena a esta historia |
| 5 | Convenciones de `constitution.md` | ✓ | Español, UTF-8 sin BOM, roles locales en `skills/<skill>/assets/agents/` |
| 6 | Sin código comentado ni `TODO` | ✓ | No se añadieron |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `hasSourceAgents`, `sourceAgentsDir`, `packageAgents` y `hasPackageAgents` se usan todas |
| 8 | Linter y formateador sin errores | ⚠️ | Requiere ejecución de CI; la comprobación de sintaxis de `verify:repository` pasa (38 archivos) |
| 9 | Sin dependencias nuevas | ✓ | `package.json` solo pierde `"agents/"` de `files` |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se creó ningún skill |
| 11 | Skill nuevo en `files` de `package.json` | ✓ | No aplica: el rol viaja dentro de `skills/`, que ya está en `files` |
| 12 | [[gr-ai-security-checklist]] | ⚠️ | No se recorrió ítem por ítem; el rol prohíbe delegar y no añade herramientas |
| 13 | [[gr-code-security-checklist]] | ⚠️ | No se recorrió ítem por ítem; solo cambian aserciones de prueba y del smoke |
| 14 | [[gr-skill-creation-checklist]] | ⚠️ | No se recorrió ítem por ítem; contrato de skills verificado por `verify:repository` (34 skills) |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `story-specify` tiene TC-001…TC-008 |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de evals; manual según `AGENTS.md` |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 34/34 |
| 18 | README o docs actualizados si cambian contratos | ✓ | D-10 aplicado en `AGENTS.md`, `README.md`, `SECURITY.md`, arquitectura, stack y constitución |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | CR-003 |
| 20 | CHANGELOG actualizado si aplica | ⚠️ | Queda para el chore de documentación del release major (Non-Goals del diseño) |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; el mismo gate (`verify:repository`) pasa localmente |
| 22 | Sin secretos ni credenciales | ✓ | Solo Markdown, JSON de evals y aserciones de prueba |
| 23 | Variables de entorno documentadas | ✓ | No se añadieron variables |
| 24 | Despliegue reversible | ✓ | Cambio versionado y revertible con git; `config/runtimes.json` e instalador sin cambios |

**Resumen:** 15/24 criterios ✓ · 9 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

1. Ejecutar `npm run test:eval -- story-specify` (contrato 10).
2. Si algún test falla, revisar el código generado y ajustarlo a mano.
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas.
