---
type: code-review-report
story: STORY-132
title: "Code Review Report: Partir project-architect en roles locales"
review-status: approved
date: 2026-10-15
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

<!-- Referencias -->
[[STORY-132-partir-project-architect-en-roles-locales]] · [[STORY-132-partir-project-architect-en-roles-locales-design]] · [[EPIC-24-agentes-locales-por-skill]]

# Code Review Report: STORY-132

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-132 — Partir project-architect en roles locales |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-15 |

Alcance: 7 archivos de `implement-report.md` más la eliminación de `agents/project-architect.agent.md`. La historia no tiene código ejecutable: son archivos de rol, `SKILL.md`, `README.md` y `evals.json`. Los evals (`npm run test:eval`) no se ejecutaron, por decisión humana según `AGENTS.md`.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 1 | LOW | skills/project-planning/SKILL.md:99 | El archivo redacta sus pasos en infinitivo («Leer», «Validar», «Mostrar»), pero la frase añadida está en imperativo («no lances un subagente para este paso»). En `project-discovery/SKILL.md` la misma frase sí es coherente, porque ese skill usa imperativo en todos sus pasos. | Cambiar a «no lanzar un subagente para este paso». |
| 2 | LOW | skills/project-planning/evals/evals.json:14 | El contexto de TC-009 dice «no existe la carpeta agents/» y, a la vez, que existe `skills/project-planning/assets/agents/planning.md`. Para el runner, que simula el filesystem, la frase es ambigua. | Precisar «no existe la carpeta `agents/` en la raíz del repositorio». |
| 3 | LOW | skills/project-planning/evals/evals.json:14 | `contains: "planning.md"` (TC-009 de planning) y `contains: "discovery-architect.md"` (TC-009 de `skills/project-discovery/evals/evals.json:14`) solo se cumplen si la sesión narra que leyó el rol. Ninguna salida del contrato nombra el rol, así que pueden dar falsos negativos. | Si fallan al ejecutar los evals, apoyar la aserción en salidas del contrato (`✅ Propuesta`, `manifest.md`). |
| 4 | LOW | skills/project-discovery/assets/agents/discovery-architect.md:1 | El `git mv` de T003 quedó en el commit `2d961dc` («Implement STORY-130 131») como renombrado al 100 %. Por eso `git diff HEAD` lo muestra como modificado y no como renombrado. El historial se conserva y el contrato 5 (`git diff -M main`) sigue siendo válido. | Mencionarlo en el mensaje del commit de STORY-132. |

Sin hallazgos en:
- **Fidelidad al original:** los roles coinciden literalmente con el original (`2d961dc^:agents/project-architect.agent.md`), salvo el frontmatter de D-2 e I-1 y las dos frases de D-3.
- **Duplicación:** la de `## Principios` está aceptada por ADR-0014.
- **Referencias:** ningún archivo de los dos skills contiene `project-architect` literal.
- **Higiene:** no hay BOM, secretos, dependencias nuevas ni `TODO`, y los dos `evals.json` parsean.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Escenarios verificados: AC-1, AC-2 y CNF-1. Todos tienen correspondencia concreta.

- **AC-1 en `project-planning`:**
  - El Paso 5 (`skills/project-planning/SKILL.md:99`) lee `assets/agents/planning.md` y sigue `## Estado Planning` en la propia sesión, sin subagente.
  - TC-009 cubre el camino feliz.
  - El tramo «append-only tras confirmación, como antes» queda cubierto por TC-001…TC-003, que no cambian.
- **AC-2 en `project-planning`:**
  - El Paso 0 (`skills/project-planning/SKILL.md:56-58`) comprueba el rol antes del inventario, de `.tmp/`, de cualquier pregunta y de `product/roadmap.md`.
  - El mensaje usa el formato I-3 y no hay fallback.
  - Lo cubre TC-008.
- **AC-1 y AC-2 en `project-discovery`:**
  - El Paso 0 comprueba el rol (`skills/project-discovery/SKILL.md:51,57`) y el Paso 6 lo ejecuta en línea (`:88-90`).
  - Lo cubren TC-009 y TC-010, y el contexto de TC-007 quedó corregido.
- **CNF-1:** la comparación con el blob original (`27ffe61`) da `## Principios` literal en los dos roles y cada `## Estado …` literal en su rol. Lo único retirado es `tools` y `model`, como pide D-2.

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 5 | LOW | skills/project-planning/evals/evals.json:7 | El contexto de TC-001…TC-003 no declara que exista `planning.md`. Un runner literal podría emitir I-3 y dejar sin verificar el tramo «append-only, como antes» de AC-1. El riesgo ya figura en `design.md` y en `implement-report.md`. | Si fallan por I-3, añadir «existe el rol local» al `input.context`, sin tocar `expected`. |
| 6 | LOW | skills/project-planning/evals/evals.json:13 | TC-008 verifica «no modifica product/roadmap.md» solo de forma indirecta, con `not_contains`. Lo mismo ocurre con TC-010 de `project-discovery`. | Añadir `"no se modificó ningún archivo"` a `contains` en los dos casos. |

ℹ️ Fuera de `skills/` aún nombran `project-architect`:
- `FR-009`, `FR-010` y `NFR-015`
- `docs/product/stakeholders.md` y `docs/product/roadmap.md`
- la salida local no versionada `.agents/agents/project-architect.agent.md`

Son Non-Goals de la historia y quedan para el chore de cierre de EPIC-24.

---

### Integración y Arquitectura (Integration-Reviewer)

Contratos de verificación 1–7 en verde. El contrato 9 (`npm run verify:repository`) también se ejecutó y terminó con exit 0, incluido el smoke del tarball en 4 runtimes. Comprobaciones contra `design.md`:

- **D-1…D-7, I-1…I-4 y F-1…F-5:** se aplican tal como están en `design.md`.
- **Pasos que ejecutan los roles:** el Paso 5 de planning y el Paso 6 de discovery pasan exactamente las 5 y las 11 variables de I-2.
- **`$UX_FINDINGS_PATH`:** queda definido en el Paso 5.
- **Consumidores:** no queda ninguno roto en `skills/`, `config/`, `scripts/`, `test/` ni `package.json`.

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 7 | LOW | skills/project-discovery/references/layer-materialization.md:3 | Dice «su agente sintetizador deje una propuesta». En discovery ahora la deja el rol local `discovery-architect`, que ejecuta la sesión. Es solo redacción. | Cambiar a «su agente o rol sintetizador», o dejarlo para STORY-133 o el chore de cierre. |
| 8 | LOW | skills/project-discovery/SKILL.md:78 | El Paso 3 limpia `$STAGING_DIR` «antes de delegar», pero la propuesta ya no se delega: solo `project-ux` sigue siendo subagente. | Cambiar a «antes del Paso 4», o dejarlo para STORY-133. |
| 9 | LOW | agents/project-architect.agent.md:0 | El commit `2d961dc`, ya publicado en `origin`, incluye el `git mv` sin editar (R100). En ese commit los `SKILL.md` siguen invocando un agente `project-architect` que no existe en `agents/`, así que queda en un estado intermedio inconsistente. El árbol de trabajo lo corrige. | Commitear STORY-132 completa y aclarar en el mensaje que completa ese renombrado (mismo origen que el #4). |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (33 reglas evaluadas)

Las 16 reglas deterministas dan resultado limpio. Las verificaciones semánticas también pasan:
- **Gates:** son fail-closed (`skills/project-planning/SKILL.md:114`, `skills/project-discovery/SKILL.md:99`).
- **Escrituras:** los roles solo escriben en staging.
- **Rutas externas:** no hay fallback fuera del directorio del skill.
- **Otros:** no hay secretos ni comandos de shell, y ningún subagente delega en otro.

| # | Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|---|-----------|---------------|-------|-------------|---------------|
| 10 | LOW | skills/project-discovery/assets/agents/discovery-architect.md:34 | ai-untrusted-content-clause / SEC-051 | El rol lee la visión, el resumen y `ux-findings.md`, que es salida de `project-ux`. No declara que ese contenido sea dato y nunca instrucción. Ahora corre en la sesión principal, sin la restricción de `tools` del antiguo subagente. El gate `Confirmar` fail-closed mitiga el impacto. | Añadir la cláusula estándar de contenido no confiable en el Paso 1 del rol. |
| 11 | LOW | skills/project-planning/assets/agents/planning.md:22 | ai-untrusted-content-clause / SEC-051 | Mismo patrón con los archivos de `$INPUT_PATHS`. La validación del staging y el gate fail-closed mitigan el riesgo. | Añadir la misma cláusula en «Entrada y salida». |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (7 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban con severidad máxima LOW: 11 hallazgos, ninguno HIGH ni MEDIUM, y ningún criterio DoD ❌.
- **Conformidad:** la implementación cumple D-1…D-7 de `design.md` y cubre AC-1, AC-2 y CNF-1 sin pérdida de instrucciones.
- **Gate:** `npm run verify:repository` pasa.
- **Hallazgos:** son de estilo, de robustez de evals, de redacción residual, de trazabilidad del historial de git (#4 y #9 tienen el mismo origen) y de endurecimiento recomendado (cláusula de contenido no confiable).

---

## Siguiente acción

1. Commitear STORY-132 completa e indicar en el mensaje que completa el renombrado empezado en `2d961dc` (#4, #9).
2. Ejecutar a mano `npm run test:eval -- project-planning` y `npm run test:eval -- project-discovery` (contrato 8). Si un caso falla, aplicar #2, #3 y #5.
3. Opcional: aplicar #1, #6, #10 y #11 en esta rama, o llevar #7 y #8 a STORY-133.
4. Continuar con `/story-verify STORY-132`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 20/24 ✓, 4 ⚠️ y 0 ❌. Los ⚠️ dependen de ejecutar los evals (a criterio humano) o del CHANGELOG, que se difiere al cierre de la épica |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Redacción en español, UTF-8 sin BOM y frontmatter uniforme con `discovery-pm.md`; `verify:repository` con exit 0 |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1 y AC-2 trazados a `SKILL.md` y a TC-008/TC-009 (planning) y TC-009/TC-010 (discovery) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-7, I-1…I-4 y contratos 1–7 y 9 en verde |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los 4 informes dan `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 23/23 `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `story.md` pasa a `CODE-REVIEW/DONE` con todos los campos completos |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (Review status approved en `code-review-report.md`) | ✓ | — | `review-status: approved` |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
