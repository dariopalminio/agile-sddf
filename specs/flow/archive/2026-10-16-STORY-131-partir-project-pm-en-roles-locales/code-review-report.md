---
type: code-review-report
story: STORY-131
title: "Code Review Report: Partir project-pm en roles locales"
review-status: approved
date: 2026-10-15
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-131

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-131 — Partir project-pm en roles locales |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-15 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

**max-severity:** LOW · **status:** approved

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 1 | LOW | skills/project-begin/SKILL.md:103-109 | El bloque «Parametriza el rol así:» era el prompt de delegación al subagente. Ahora lo lee la misma sesión que lee `begin-intent.md`, de modo que el contrato tiene dos fuentes que no coinciden del todo: «máximo 3–4 preguntas» frente a «hasta cuatro», y `[inferido]` frente a `[inferido: sin respuesta del usuario]`. Las «dos fases» solo aparecen en el `SKILL.md`. D-4 decidió conservar el bloque. | En una historia posterior de EPIC-24, dejar en el `SKILL.md` solo lo que el rol no define o moverlo al rol, para que el contrato tenga una sola fuente. |
| 2 | LOW | skills/project-begin/assets/vision-template.md:6 (y docs/templates/vision-template.md:6) | `# escritor: project-begin (rol begin-intent: IN-PROGRESS · DONE tras confirmar)` atribuye al rol también `DONE`, pero `begin-intent.md:38` dice «No marca `DONE`» y lo escribe el gate del Paso 4. Es el texto literal que fija D-6. | Si se vuelve a tocar, separar los dos escritores (p. ej. `rol begin-intent: IN-PROGRESS · gate del Paso 4: DONE tras confirmar`) y mantener idénticas las dos copias. |
| 3 | LOW | skills/project-discovery/assets/agents/discovery-pm.md:9,16 | Texto heredado que no encaja con Discovery: la intro habla de «entrevistas de visión de producto» y el principio «Deriva las preguntas del template» no tiene template en este estado. D-3 prioriza el diff mínimo. | Opcional: ajustar la intro y el principio a la fase Discovery, o documentar que se conservan por diff mínimo. |
| 4 | LOW | skills/project-discovery/assets/agents/discovery-pm.md:27 | El rol fija el literal `.tmp/project-discovery/discovery-summary.md` y `SKILL.md:79` define `$DISCOVERY_SUMMARY_PATH` con la misma ruta: dos fuentes del mismo valor (lo que D-2 evitó al no añadir `output:`). | Declarar en el rol solo `$OUTPUT_PATH` («ruta resuelta por el skill») y dejar el literal en `SKILL.md`. |
| 5 | LOW | skills/project-discovery/SKILL.md:52-54 | La comprobación se presenta como una lista ampliable de roles, pero el mensaje lleva escrita la ruta de `discovery-pm`. Cuando STORY-132/133 añadan roles, el mensaje quedará incorrecto si no se edita. | Usar el marcador `assets/agents/<rol>.md` de I-3. |

Verificaciones sin hallazgos: 10 archivos en UTF-8 sin BOM y LF, sin mojibake; los dos `evals.json` son JSON válido con 8 casos; seed y copia central de `vision-template.md` idénticos; ninguna mención a `project-pm` en `skills/`, `agents/`, `config/`, `scripts/`, `test/`, `docs/templates/` ni `docs/guides/`; roles con 38 y 37 líneas, sin `tools` ni `model`; sin secretos ni dependencias nuevas.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

**max-severity:** LOW · **status:** approved

Escenarios verificados:

- **AC-1, fila `project-begin` / `begin-intent.md`:** Paso 3 de `skills/project-begin/SKILL.md:101-103` lee el rol e indica no lanzar subagente; `agents/project-pm.agent.md` ya no existe; TC-008 (`skills/project-begin/evals/evals.json:70`).
- **AC-1, fila `project-discovery` / `discovery-pm.md`:** Paso 4 de `skills/project-discovery/SKILL.md:79`; TC-007 (`skills/project-discovery/evals/evals.json:12`).
- **AC-2:** Paso 0 de `skills/project-begin/SKILL.md:73-75` se detiene, informa la ruta y no busca fuera del skill; TC-007 de `project-begin`. Misma comprobación en `project-discovery` (`SKILL.md:48-54`, TC-008).
- **CNF-1:** secciones transversales en ambos roles; Estado Visión solo en `begin-intent.md:25`, Estado Discovery solo en `discovery-pm.md:25`.
- **CNF-2:** 38 y 37 líneas frente a 57.
- **Notas de alcance:** README, los dos `vision-template.md` (idénticos) y la guía l.182 actualizados.

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 1 | LOW | docs/specs/stories/STORY-131-partir-project-pm-en-roles-locales/implement-report.md:75 | TC-007/TC-008 de los dos skills cubren AC-1 y AC-2 en su redacción pero no se han ejecutado (contrato 8 pendiente). Ejecución manual prevista por `AGENTS.md`. | Ejecutar `npm run test:eval -- project-begin` y `npm run test:eval -- project-discovery` antes de ACCEPTANCE y anotar el resultado. |
| 2 | LOW | skills/project-begin/evals/evals.json:70 (y skills/project-discovery/evals/evals.json:12) | «No invoca a project-pm como subagente» solo se comprueba con `not_contains` sobre rutas; una invocación por nombre sin ruta no se detectaría. | Añadir el nombre sin prefijo de ruta (escapado) al `not_contains`, o una cadena que delate la delegación. |
| 3 | LOW | skills/project-discovery/evals/evals.json:12 | TC-007 no comprueba que la sesión «conduce la entrevista con el usuario». | Añadir al contexto que el usuario responde la entrevista y exigir en `contains` una marca observable. |
| 4 | LOW | skills/project-begin/evals/evals.json:61 (y skills/project-discovery/evals/evals.json:13) | El contexto de AC-2 no incluye un agente global que pudiera servir de fallback, así que «no recurre a agents/project-pm.agent.md» se cumple casi trivialmente. | Añadir al contexto una copia instalada previa en `.claude/agents/`. |
| 5 | LOW | docs/requirements/functional/FR-008-captura-de-intencion-inicial-del-proyecto.md:26 | FR-008:26, FR-009:25 y NFR-015:25 siguen citando `project-pm`. Fuera del alcance declarado (Non-Goals de design.md). | Corregir en el chore de documentación del cierre de EPIC-24. |

---

### Integración y Arquitectura (Integration-Reviewer)

**max-severity:** LOW · **status:** approved

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 1 | LOW | skills/project-discovery/SKILL.md:54 | Mismo caso que el hallazgo 5 de Calidad: el mensaje de rol ausente está fijado a `discovery-pm.md` aunque la lista es ampliable; I-3 define la forma genérica `assets/agents/<rol>.md`. | Usar `<rol>` o dejar la generalización anotada para STORY-132/133. |
| 2 | LOW | docs/specs/stories/STORY-131-partir-project-pm-en-roles-locales/design.md:41,43,60 | «Estado medido» y Non-Goals no coinciden con el filesystem: `skills/reverse-engineering/assets/agents/` ya existe (STORY-129) y `agents/` tiene 4 archivos, no 9. Sin impacto funcional; choca con la regla de veracidad. | Corregir las cifras de `design.md`. |

Verificaciones conformes: contratos 1–7 y 9 (incluido `npm run verify:repository` con exit 0 y smoke del tarball en 4 runtimes; `npm pack --dry-run` incluye los dos roles); D-1…D-8 e I-1…I-4 respetados; `$DISCOVERY_SUMMARY_PATH` definido en el Paso 4 y consumido por los Pasos 5-6 sin cambios; un solo nivel de delegación (ADR-0002); `project-flow`, `package.json › files` y `config/runtimes.json` sin cambios; la copia instalada `.claude/agents/project-pm.agent.md` ya no existe.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (34 reglas evaluadas)

**max-severity:** LOW · **status:** approved

| # | Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|---|-----------|---------------|-------|-------------|---------------|
| 1 | LOW | skills/project-begin/assets/agents/begin-intent.md:1 | gr-ai «allowed-tools mínimo» / SEC-037 / SEC-052 | El antiguo subagente se limitaba a `Read, Write, Edit, AskUserQuestion`. Como rol leído por la sesión (sin `tools` y sin `allowed-tools` en `SKILL.md`), la entrevista corre con todas las herramientas de la sesión. Sin exposición demostrable. | Opcional: declarar `allowed-tools` mínimo en `skills/project-begin/SKILL.md`, o anotar en ADR-0014 la pérdida aceptada y su control compensatorio. |
| 2 | LOW | skills/project-discovery/assets/agents/discovery-pm.md:1 | gr-ai «allowed-tools mínimo» / SEC-037 / SEC-052 | Mismo caso en Discovery; el rol limita por instrucción su escritura a `$OUTPUT_PATH` (l.37). | Opcional: misma medida, incluyendo la herramienta de delegación que requieren los Pasos 5-6. |

Observaciones positivas: ambos skills comprueban el rol local antes de preguntar o escribir y no buscan fuera de su directorio (falla cerrado); el gate de `project-begin` conserva `IN-PROGRESS` sin respuesta; los escapes `m` de los evals decodifican a ASCII y no son caracteres ocultos. Las 16 comprobaciones deterministas (prompt override, bypass, caracteres ocultos, rutas al home, secretos, datos personales, registros alternativos, escalada de privilegios) no encontraron nada.

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (11 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban con severidad máxima LOW y el DoD CODE-REVIEW no aporta ningún criterio ❌. La implementación cumple AC-1 (las dos filas de Ejemplos), AC-2, CNF-1 y CNF-2, respeta D-1…D-8 e I-1…I-4 de `design.md`, y `npm run verify:repository` termina con exit 0. Los 14 hallazgos LOW (13 únicos: el del mensaje fijo de rol ausente en `project-discovery/SKILL.md` aparece en dos dimensiones) son mejoras de redacción, de la fuerza de las aserciones de los evals y de endurecimiento opcional. Ninguno afecta al comportamiento.

---

## Siguiente acción

1. Ejecutar a mano los evals (contrato 8): `npm run test:eval -- project-begin` y `npm run test:eval -- project-discovery`.
2. Continuar con `/story-verify STORY-131`.
3. Opcional, antes de STORY-132/133: generalizar el mensaje de rol ausente de `skills/project-discovery/SKILL.md:52-54` a `assets/agents/<rol>.md` y corregir las cifras de `design.md:41,43,60`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 18/24 ✓, 6 ⚠️, 0 ❌. Los ⚠️ requieren ejecutar evals o CI (ejecución manual según `AGENTS.md`); no evaluable desde artefactos |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead: español, UTF-8 sin BOM, fuente única en `skills/<skill>/`, sin secretos |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: AC-1 (dos filas) y AC-2 cubiertos en los `SKILL.md`, los roles y TC-007/TC-008 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration: D-1…D-8, I-1…I-4 y contratos 1–7 y 9 conformes |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima de los cuatro revisores: LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 24/24 tareas `[x]`, ninguna `[ ]` ni `[!]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | `story.md` pasa a `CODE-REVIEW/DONE` con `updated: 2026-10-15` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (Review status approved en `code-review-report.md`) | ✓ | — | `review-status: approved` |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
