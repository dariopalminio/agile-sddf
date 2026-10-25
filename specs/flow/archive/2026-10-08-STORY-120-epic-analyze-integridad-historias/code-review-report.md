---
type: code-review-report
story: STORY-120
title: "Code Review Report: Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo"
review-status: approved
date: 2026-10-08
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-120

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-120 — Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-08 |

Alcance revisado: `skills/epic-analyze/SKILL.md`, `skills/epic-analyze/assets/epic-analyze-report-template.md`, `skills/epic-analyze/evals/evals.json` (commits `a3e09e6` → `209f68b`) y los cambios de documentación de D-14 (`docs/domains/domain-skills-map.md`, `docs/domains/domain-epic-lifecycle.md`, `docs/guides/sddf-commands-pipeline.md`, `CHANGELOG.md`) más la transición F2 → F3 de STORY-120 en `docs/specs/02-epics/EPIC-22-epic-analyze/epic.md`.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

Verificado sin hallazgos: frontmatter solo `name`/`description` (`>-`, 324 caracteres); `SKILL.md` de 236 líneas; enlaces a `assets/` resueltos; sin rutas absolutas, URLs, credenciales ni `TODO`; cláusula `ai-untrusted-content-clause`; worker sin delegación; template leído en runtime y relleno por `clave:`, sin estructura embebida (CNF-4); fallos que detienen antes de escribir; veredicto como función pura y orden determinista; evals con happy-path, fail-fast y error-handling; evals commiteadas antes que `SKILL.md`; `package.json` intacto (CR-002).

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 1 | LOW | skills/epic-analyze/SKILL.md:129-133 | La clasificación de la Vía A no cubre `**STORY-NNN**` en negrita **sin** checkbox (`- **STORY-205** — X`), aunque la línea 75 declara las reglas exhaustivas. | Hacer explícito que F2/F3 exige el prefijo `- [ ]`/`- [x]`; si no, "No reconocida". |
| 2 | LOW | skills/epic-analyze/SKILL.md:187,199 | "Solo `updated` puede diferir" omite que la `Fecha` del resumen también está en el cuerpo. | Precisar "solo `updated` y la fecha del resumen pueden diferir". |
| 3 | LOW | skills/epic-analyze/SKILL.md:188 | `indice-historias` no define texto para el caso vacío (solo está en el comentario guía del template). | Añadir "si no hay IDs, solo `Sin historias con ID.`". |
| 4 | LOW | skills/epic-analyze/SKILL.md:102 | El argumento **Ruta** no se confina a `REPO_ROOT` / `$SPECS_BASE/specs/02-epics/`. | Exigir que `EPIC_DIR` resuelva dentro de la raíz; si no, `❌` sin escribir. |
| 5 | LOW | docs/index.md:294, docs/domains/README.md:111,113 | Referencias desactualizadas a `domain-skills-map.md` ("sin frontmatter", "próximamente"). | `/memory-system index` y actualizar el README de dominios. |

**Veredicto del agente:** approved.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Escenario | Regla en SKILL.md | Eval | Resultado |
|---|---|---|---|
| AC-1 — índice consistente → `APPROVED`, 0 ERROR, fuentes sin cambios | Pasos 3–6, Paso 8, Restricciones "Solo lectura" | TC-001, TC-010, ejecución real T025 | ✓ Cubierto |
| AC-2 fila 1 — `STORY-203` sin directorio | INT-01, Paso 4.4 | TC-002 | ✓ Cubierto |
| AC-2 fila 2 — `STORY-204` huérfana | INT-02, Paso 4.3 | TC-003 | ✓ Cubierto (aserción de severidad débil) |
| AC-2 fila 3 — `STORY-201` duplicada | INT-03 (todas las líneas, un hallazgo por ID) | TC-004 | ✓ Cubierto |
| AC-2 fila 4 — 1 planificada sin ID | F1, INT-05, Paso 6 (≤ 3 WARNING) | TC-005 | ✓ Cubierto |
| AC-2 fila 5 — 4 planificadas sin ID | INT-05 por línea, Paso 6 (> 3 WARNING) | TC-006 | ✓ Cubierto (aserción de nombres parcial) |
| AC-3 — `EPIC-77` no resuelta | Paso 1 (glob con guion, mensaje con ruta, sin escritura) | TC-007 | ✓ Cubierto |

CNF-1…CNF-8 revisados; INT-04 e INT-06 (CR-001) cubiertos por TC-026 y TC-027.

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 6 | LOW | skills/epic-analyze/evals/evals.json:212 | TC-006 solo comprueba `Auditar accesos`; AC-2 fila 5 pide citar cada historia planificada. | Añadir los cuatro nombres y `epic.md:18`…`epic.md:21` a `contains`. |
| 7 | LOW | skills/epic-analyze/evals/evals.json:109 | TC-003 no comprueba `ERROR` ni `errors: 1`; TC-004 no comprueba el literal `ERROR`. | Añadir esas aserciones. |
| 8 | LOW | docs/specs/03-stories/STORY-120-epic-analyze-integridad-historias/implement-report.md:72 | La idempotencia de CNF-3 en dos ejecuciones reales (T025) se justifica por razonamiento, sin evidencia de la segunda ejecución. | Ejecutar dos veces `/epic-analyze EPIC-22 --auto` y anotar el diff, o registrar la desviación en `design.md`. |

**Veredicto del agente:** approved.

---

### Integración y Arquitectura (Integration-Reviewer)

Conformidad verificada contra `design.md` (D-1…D-14, I-1…I-6, CR-001…CR-004): estructura de directorios, resolución de la épica, sección por `clave: historias`, catálogo INT-01…INT-06 con combinación y orden, tabla de veredicto, template central → seed sin estructura embebida, frontmatter y escritura única, cláusula de contenido como datos, retorno I-3 (CR-004), worker sin delegación, orden evals → `SKILL.md` y los cuatro documentos de D-14.

| # | Severidad | Archivo:Línea | Descripción | Recomendación |
|---|-----------|---------------|-------------|---------------|
| 9 | LOW | skills/epic-analyze/assets/epic-analyze-report-template.md:1 | Las claves del frontmatter del template no llevan `# escritor:` (constitución, principio 13); las secciones sí. Mismo caso que `analyze-report-template.md`. | Anotar `# escritor: epic-analyze` y no copiar esos comentarios al reporte. |
| 10 | LOW | skills/epic-analyze/SKILL.md:142 | El Paso 4.4 añade una regla para un ID con varios directorios que D-5 no recoge. | Registrarla en `design.md` (CR-005 o apunte en D-5). |
| — | LOW | docs/index.md:294, docs/domains/README.md:111 | Duplicado del hallazgo #5. | — |

Trazabilidad de diseño en testcases.md: ⏭️ omitida (no existe el archivo).

**Veredicto del agente:** approved.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (26 reglas evaluadas)

Ninguna regla determinista `(error)` falla. CNF-7 se cumple (`SKILL.md:79-81`); escritura única, sin cambio de estado, shell ni red; datos sintéticos en evals. La única coincidencia `warn` (`npm publish` en `CHANGELOG.md:88`) es preexistente y ajena al diff.

| # | Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|---|-----------|---------------|-------|-------------|---------------|
| — | LOW | skills/epic-analyze/SKILL.md:102 | gr-ai / gr-code (confinamiento de rutas) | Duplicado del hallazgo #4: un argumento `../otro-repo/EPIC-1-x` leería y escribiría fuera del repositorio. | Normalizar y confinar la ruta; añadir un caso de eval. |
| 11 | LOW | skills/epic-analyze/SKILL.md:81 | SEC-036 / gr-ai (contenido ingerido = datos) | Un nombre o `parent` con comilla invertida cierra el código en línea y el resto vuelve a ser Markdown activo. | Usar un delimitador más largo (` `` … `` `) cuando el texto contenga comillas invertidas. |

Observación: ningún caso de eval ejercita un `epic.md`/`story.md` con texto en forma de instrucción; CNF-7 se verifica solo con grep de la cláusula.

**Veredicto del agente:** approved.

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (8 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban con severidad máxima LOW. Los tres escenarios Gherkin y las cinco filas de `Ejemplos` de AC-2 tienen regla explícita en `SKILL.md` y caso de eval (12/12 PASS); la implementación respeta D-1…D-14 y los CR registrados; no hay exposiciones de seguridad ni reglas deterministas fallidas. Los 11 hallazgos LOW (deduplicados) son precisiones de redacción, aserciones de eval débiles, endurecimiento opcional y referencias de documentación desactualizadas; ninguno bloquea.

---

## Siguiente acción

Ejecutar `/story-verify STORY-120`. Opcionalmente, abrir seguimiento para los LOW de mayor valor: confinamiento de la ruta (#4), delimitador de citas (#11), aserciones de TC-003/TC-004/TC-006 (#6, #7) y referencias desactualizadas a `domain-skills-map` (#5).

---

## Cumplimiento DoD — Fase CODE-REVIEW

DoD resuelto: `docs/guardrails/dod-story-code-review.md` (override `sddf.config.yaml › guardrails.dod.story.code-review`), `enforcement: error`.

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 21/24 ✓, 0 ❌; 3 ⚠️ (linter genérico inexistente, uso parcial del bucle de `skill-master`, build de CI). Requiere acceso a CI/CD — no evaluable desde artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Skill en español en `skills/epic-analyze/`, template en `assets/`, solo Markdown, UTF-8 sin BOM; único apunte (principio 13 en el frontmatter del template, #9) es LOW |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1, AC-2 (5 filas) y AC-3 con regla y eval |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-14, I-1…I-6, CR-001…CR-004 conformes |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima de los cuatro agentes: LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 26/26 tareas `[x]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; transición a `CODE-REVIEW/DONE` aplicada al cerrar esta revisión |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (Review status approved en `code-review-report.md`) | ✓ | — | `review-status: approved` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
