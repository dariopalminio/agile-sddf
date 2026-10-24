---
type: code-review-report
story: STORY-118
title: "Code Review Report: Adoptar la estrategia 'SRS único primero, fragmentación cuando duela' en requirements/"
review-status: approved
date: 2026-10-13
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-118

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-118 — Adoptar la estrategia "SRS único primero, fragmentación cuando duela" en `requirements/` |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Ronda | Revisión posterior a la ronda 1 de correcciones (`fix-directives.md` round 1) |
| Fecha | 2026-10-13 |

Los 10 hallazgos de la ronda 1 (6 de agentes y 4 derivados del DoD) quedaron resueltos y cubiertos por pruebas: `node --test test/requirements.test.js` 12/12, `test/requirements.test.js` + `test/memory-system.test.js` 82/82 y `npm test` 249/249 (según los revisores).

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

**Severidad máxima: LOW** — 0 HIGH, 0 MEDIUM, 3 LOW.

| # | Severidad | Archivo:Línea | Hallazgo | Recomendación |
|--:|-----------|---------------|----------|---------------|
| 1 | LOW | `skills/memory-system/scripts/requirements.js:272` | `exists(catalog) ? 'create' : 'create'` es un ternario con ramas idénticas (el hallazgo LOW previo sobre `[SOBRESCRITO]` sigue abierto). | Confirmar si se añade la acción `overwrite`; si no, simplificar a `'create'`. |
| 2 | LOW | `test/requirements.test.js:241` | La aserción `/Wikilinks pendientes: 0\|pendientes: 0/` es laxa. | Ajustar al texto exacto que emite `index`. |
| 3 | LOW | `skills/memory-system/scripts/requirements.js:85-307` | Funciones largas con varias sentencias por línea; consistente con el estilo del módulo. | Opcional: partir en helpers en una historia futura. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

**Severidad máxima: LOW** — 15 bloques Gherkin (AC-1…AC-9) más CNF-1 y CNF-2 verificados; 0 HIGH, 0 MEDIUM, 4 LOW.

Hallazgos previos: los 3 MEDIUM de cobertura están resueltos (S118-IT-006 `check` en ambas disposiciones, S118-IT-007 idempotencia y resolución tras migrar, S118-IT-008 reglas de `check`); el LOW de AC-5 queda cubierto en lo esencial por S118-IT-009.

| # | Severidad | Archivo:Línea | Hallazgo | Recomendación |
|--:|-----------|---------------|----------|---------------|
| 1 | LOW | `test/requirements.test.js:64` | CNF-2 (`--dry-run`) solo se prueba para `migrateSrsSingle`; `migrateFragmented` con `dryRun` no tiene aserción propia. | Añadir `dryRun: true` sobre `requirements-fragmented` con `treeHash` invariante. |
| 2 | LOW | `test/requirements.test.js:179` | AC-7 "existe al menos un `srs-*.md`" no tiene caso explícito de `check` sobre `requirements/` vacío. | Opcional. |
| 3 | LOW | `test/requirements.test.js:120` | AC-9: el legacy sin `index.md` falla `check` hasta ejecutar `index`; es la decisión D-9 de diseño y está cubierto. Informativo. | Mantener el mensaje accionable. |
| 4 | LOW | (AC-1, AC-2, AC-8) | Escenarios de documentación/template se verifican por `verify:repository`, no por tests unitarios dedicados. | Sin acción requerida. |

---

### Integración y Arquitectura (Integration-Reviewer)

**Severidad máxima: LOW** — 0 HIGH, 0 MEDIUM, 5 LOW.

Hallazgos previos: resueltos los 3 MEDIUM (aliases en `index` → S118-IT-010; validación de `kind` vs carpeta → S118-IT-008; catálogo excluido de la reescritura de enlaces → S118-IT-009).

| # | Severidad | Archivo:Línea | Hallazgo | Recomendación |
|--:|-----------|---------------|----------|---------------|
| 1 | LOW | `skills/memory-system/scripts/requirements.js:272` | D-7 paso 4 exige `[CREADO]` o `[SOBRESCRITO]` para el catálogo; la entrada usa siempre `create`. Sin impacto funcional. | Añadir la acción `overwrite` cuando el catálogo ya existe. |
| 2 | LOW | `skills/memory-system/scripts/requirements.js:108` | D-2 define `layout = srs` si hay algún `srs-*.md`; la implementación devuelve `empty` para un SRS sin secciones visibles (coherente con D-3 y `scaffold`). | Alinear la tabla de D-2 o documentar la desviación en design.md. |
| 3 | LOW | `skills/memory-system/scripts/memory-system.js:1012` | La tabla `MIGRATORS` del diseño es una constante local `migrators` dentro de `runMigrate`. Despacho correcto. | Opcional: extraer a constante de módulo. |
| 4 | LOW | `skills/memory-system/scripts/memory-system.js:1020` | `migrate --from=specs-3-levels` regenera el catálogo (`writeCatalog`); este acoplamiento no está en D-1. Consistente con AC-9. | Documentar el punto de integración en design.md (D-1/D-4). |
| 5 | LOW | `skills/memory-system/scripts/requirements.js:297` | `migrateFragmented` crea el SRS desde la semilla del skill, no desde `$SPECS_BASE/templates/srs-template.md` (D-3 paso 4). | Reutilizar `srsTemplate(specsBase, seed)`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-code-security-checklist.md`, `.claude/skills/security-audit/assets/security-checklist.md` (29 reglas evaluadas)

**Severidad máxima: LOW** — 0 HIGH, 0 MEDIUM, 2 LOW. Sin secretos, ejecución dinámica ni inyección de shell; sin path traversal por wikilinks ni por títulos (slug = id restringido por regex + `slugify`; escrituras y borrados pasan por `assertInsideRoot`).

| # | Severidad | Archivo:Línea | Regla | Hallazgo | Recomendación |
|--:|-----------|---------------|-------|----------|---------------|
| 1 | LOW | `skills/memory-system/scripts/requirements.js:186` | validación de input Markdown | `map[target.trim()]` consulta un objeto que hereda de `Object.prototype`; un wikilink `[[constructor]]` se reescribiría como texto de función al migrar. Solo corrupción de contenido; preexistente, no tocado por el diff. | Usar `Object.hasOwn(map, key)` o `new Map` / `Object.create(null)`. |
| 2 | LOW | `skills/memory-system/scripts/requirements.js:276,301-305` (y `assertInsideRoot` en `memory-system.js:214`) | ruta confinada a la raíz | El confinamiento es léxico (sin `realpath`); un symlink de directorio commiteado en `requirements/` podría sacar escrituras de la raíz. Requiere repo hostil. | Opcional: `fs.realpathSync` del directorio padre o rechazar symlinks. |

---

### Nota de Tamaño de Cambio

<!-- Verificación omitida: implement-report.md agrupa los archivos por tarea y no enumera un listado de rutas individuales ($IMPL_FILES vacío). Informativa y no afecta la decisión. -->

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Decisión final

**review-status: approved**

La severidad máxima entre las cuatro dimensiones y la evaluación del DoD es LOW (0 HIGH, 0 MEDIUM, 14 LOW en total). Los 10 hallazgos bloqueantes de la ronda 1 se corrigieron y cuentan con pruebas que fallan sin la corrección y pasan con ella. Los LOW restantes son mejoras opcionales sin impacto funcional.

---

## Siguiente acción

La historia queda en `CODE-REVIEW/DONE`. Se elimina `fix-directives.md` (revisión anterior superada). Siguiente gate: `/story-verify STORY-118`. Los hallazgos LOW pueden abordarse en una historia posterior (en particular los de seguridad: `Object.hasOwn` en `requirements.js:186` y el confinamiento por `realpath`).

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|--:|----------|:------:|:---------:|-----------|
| 1 | Se cumple `dod-story-implement` | ✓ | — | `implement-report.md`: 19/25 ✓, 6 ⚠️ (verificaciones externas o no configuradas), 0 ❌; `npm test` 249/249 y `verify:repository` aprobados. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Ningún revisor reportó incumplimientos; Node nativo, sin dependencias nuevas. |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1…AC-9 y CNF-1/CNF-2 con pruebas observables o `verify:repository`. |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: solo 5 desviaciones LOW sin impacto funcional. |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los cuatro revisores reportan `max-severity: LOW`. |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | `tasks.md`: 45 completadas, 0 pendientes, 0 bloqueadas. |
| 7 | Metadatos frontmatter de `story.md` completos y con status/substatus actualizados | ✓ | — | `story.md` pasa a `CODE-REVIEW/DONE` al cerrar este review. |
| 8 | El reporte de revisión de código está creado o actualizado | ✓ | — | Este archivo. |
| 9 | Revisión de código aprobada (Review status approved) | ✓ | — | `review-status: approved`. |

**Resumen:** 9/9 criterios ✓
