---
type: code-review-report
story: STORY-161
title: "Code Review Report: Estrategia de instalación"
verdict: APPROVED
date: 2026-10-26
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-161

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron un informe válido y ninguno encontró problemas HIGH ni MEDIUM. Los 7 hallazgos LOW (5 distintos, porque dos se repiten entre revisores) son mejoras cosméticas o de cobertura que no bloquean la transición a `CODE-REVIEW/DONE`.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-161 — Estrategia de instalación |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-26 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | scripts/cli.js:48 | El cambio dejó la línea `--force` de `USAGE` con un espacio menos (`--force             Overwrite`): su descripción quedó desalineada respecto de `--global`, `--target` y `--strategy`. Antes del commit 95791ec la columna estaba alineada. | Restaurar el padding original (`  --force              Overwrite existing files (use for upgrades)`) para que las descripciones vuelvan a alinearse. |
| LOW | scripts/install.js:128 | Si `stdin` se cierra sin respuesta (EOF/Ctrl+D), `promptStrategySelection` resuelve `full` y la instalación sigue y escribe en el destino. Es la degradación que define F-4 de `design.md`, pero un usuario que corta el prompt probablemente quiere cancelar, no instalar el catálogo completo. Además no es simétrico con `promptFolderSelection`, que no maneja `close`. | Opcional: decidir de forma explícita (en `design.md`) si cerrar el prompt debe abortar sin escribir. Si se mantiene, dejar en el código una nota que remita a F-4. No bloquea. |
| LOW | scripts/cli.js:108-111 | La conexión «sin `--strategy` + TTY → prompt» en el CLI no tiene prueba automatizada. Las pruebas cubren `promptStrategySelection` aislada con `PassThrough` y el CLI sin TTY. La fila «con TTY» de AC-2 solo se verificó con un TTY simulado a mano (T028). | Opcional: extraer a una función pura la decisión de preguntar (`strategyValue === undefined && isTTY`) y probarla, o dejar registrada la verificación manual en una terminal real como pendiente de VERIFY. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Escenarios verificados: 5 (AC-1, las 3 filas de Ejemplos de AC-2 y AC-3) y 4 CNF. `node --test test/install.test.js`: 19/19 aprobadas en la revisión.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | test/install.test.js:406 | AC-2, fila «(sin flag) / con TTY»: la prueba cubre `promptStrategySelection` por separado, pero ninguna prueba automatizada recorre `scripts/cli.js` con `process.stdin.isTTY` verdadero, es decir, la condición `strategy === undefined && process.stdin.isTTY` que lanza el prompt. La única evidencia de ese camino es la verificación manual T028, hecha con TTY simulado. | Agregar una prueba de CLI que lance `scripts/cli.js` con un preload (`node -r <stub>`) que fije `process.stdin.isTTY = true`, enviar `--target claude-code` y la respuesta `2\n` por stdin, y comprobar el menú, la ausencia de `epic-*` y el texto `strategy story`. Otra opción es repetir T028 en una terminal real y dejar la evidencia. |
| LOW | test/install.test.js:368 | AC-2, fila «--strategy full / sin TTY»: el resultado está comprobado en la API (`installSDDF({ strategy: 'full' })`), pero ninguna prueba ejecuta el CLI con `--strategy full`. El parseo y la validación del flag con el valor `full` no se prueban de punta a punta. | Agregar `['install', '--strategy', 'full', '--target', 'claude-code']` como caso de CLI que compruebe el catálogo completo y `strategy full` en el stdout. |

---

### Integración y Arquitectura (Integration-Reviewer)

D-1 a D-10, la tabla de Interfaces, el Esquema de datos y las exportaciones de `install.js` se verificaron contra el código. La dependencia va en una sola dirección (`cli.js → install.js`) y no hay componentes sin documentar.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | scripts/cli.js:48 | Al insertar `--strategy` se quitó un espacio de la línea `--force` de `USAGE` (`"  --force             Overwrite..."`, 13 espacios en lugar de 14). Su descripción queda en la columna 20, mientras las demás opciones alinean en la 21. Es cosmético y no lo valida ninguna prueba | Restaurar los 14 espacios para que `--force` vuelva a alinear con `--global`, `--target` y `--strategy` |
| LOW | specs/flow/STORY-161-estrategia-de-instalacion/design.md (Context, Componentes afectados, D-10) | `design.md` ubica el párrafo del README en la sección «Instalación en tu runtime», que no existe: la sección real es `## Installation` (`README.md:367`) y la subsección se agregó en `README.md:397`. La desviación está anotada en `implement-report.md` («Notas de implementación»), pero `design.md` no se corrigió | Corregir la referencia en `design.md`, o registrarla en su «Registro de Cambios (CR)», para que el diseño refleje la estructura real del README |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-code-security-checklist.md`, `docs/guardrails/gr-ai-security-checklist.md`, `.claude/skills/security-audit/assets/security-checklist.md` (43 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (7 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-161`. Durante VERIFY conviene repetir T028 en una terminal interactiva real (fila «con TTY» de AC-2). Los hallazgos LOW son opcionales: la alineación de `--force` en `USAGE` y la sección del README en `design.md` se corrigen rápido.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Archivo: `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 20/24 ✓, 4 ⚠️, 0 ❌. Los ⚠️ (Gherkin pasan, sin regresiones, linter y CI) requieren CI/CD y no se pueden evaluar desde los artefactos. En la revisión, `test/install.test.js` dio 19/19 |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | CommonJS, sin dependencias nuevas y comentarios en español (Tech-Lead e Integration) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner verificó 5/5 escenarios con pruebas observables. Los dos huecos son LOW |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration confirmó D-1 a D-10, las interfaces y las exportaciones |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima entre los cuatro informes: LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 29 `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `story.md` pasa a `CODE-REVIEW/DONE` al cerrar esta revisión |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
