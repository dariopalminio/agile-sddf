---
type: code-review-report
story: STORY-157
title: "Code Review Report: Reparar enlaces y validar el gate tras la migración"
verdict: APPROVED
date: 2026-10-24
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-157

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos con `status: approved`. Los 16 hallazgos son de severidad LOW o inferior y ninguno es bloqueante. Los criterios del DoD CODE-REVIEW quedan cumplidos o no son evaluables desde los artefactos (⚠️), sin ningún ❌.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-157 — Reparar enlaces y validar el gate tras la migración |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-24 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | test/check-doc-links.test.js:100 | La prueba `HISTORICAL_EXCLUSIONS informa specs/ como raíz histórica…` fija la constante literal completa (`deepEqual` sobre los 3 valores). Es una prueba que solo detecta cambios: falla ante cualquier edición legítima de la lista y no verifica comportamiento, porque la constante solo se usa en el mensaje `[INFO]` de `main()` (l. 291). | Opcional: afirmar solo lo que importa (`includes('specs')` y que no aparezca `docs/specs`), o probar la salida informativa de `main()`. |
| LOW | test/check-doc-links.test.js:71-89, 118-127 | Se duplica el helper local `write(relativePath, slug)`, que crea un archivo con frontmatter `slug:`, en dos pruebas del mismo archivo. | Opcional: sacarlo a una función de módulo junto a `fixture()` para no repetirlo. |
| LOW | test/check-doc-links.test.js:71, 100 | Los nombres de las pruebas nuevas mezclan español e inglés (`wikilinks a work items…`, `HISTORICAL_EXCLUSIONS informa…`) y no siguen el patrón del archivo, donde predomina el inglés (`resolves…`, `reports…`). | Opcional: unificar el idioma de los títulos dentro del archivo. |
| LOW | scripts/check-doc-links.js:27-31 | `HISTORICAL_EXCLUSIONS` declara ahora `specs` completo como raíz «histórica», aunque también contiene work items activos (`specs/flow/STORY-*`, `EPIC-*` IN-PROGRESS). La semántica es correcta para el checker (no son raíces activas de documentación), pero el término «historical» del comentario de cabecera (l. 8) y del mensaje `[INFO]` ya no describe bien todo el árbol. | Opcional: ajustar el comentario o el mensaje (por ejemplo, «excluded work-item/historical roots») en una historia futura; no bloquea. |
| LOW | docs/domains/domain.md:85 | Ninguno de los archivos tocados se contradice, pero el glosario de dominio sigue describiendo como vigente la resolución `SDDF_ROOT` válida → `sddf.config.yaml.root` válida → `docs`, que esta historia termina de retirar al quitar `root:` de `sddf.config.yaml`. Este caso no entró en el inventario del implement-report, que solo clasifica `domain.md:34`. Lo mismo pasa con `docs/domains/domain-epic-lifecycle.md:199` (`$SPECS_BASE/templates/epic-template.md`). | Registrarlo como deuda junto a la ya anotada para `domain.md:34`, o corregir esas dos líneas a `docs/templates/` y al layout fijo de ADR-0016. |
| LOW | specs/flow/STORY-157-reparar-enlaces-tras-migracion/implement-report.md («Alcance del diff») | El reporte declara 12 archivos modificados, pero `git diff HEAD --stat` muestra 13: también cambia `specs/flow/EPIC-26-layout-y-flow-forward-mejorado/epic.md` (casilla `[x]` de STORY-157). El cambio es legítimo, pero no figura en el alcance. | Añadir `epic.md` a la sección «Alcance del diff» del implement-report. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-157-reparar-enlaces-tras-migracion/story.md:42 | La precondición de AC-3 («todas las demás historias de EPIC-26 entregadas») no se cumple del todo. STORY-151 sigue en `READY-FOR-IMPLEMENT/DONE` con `fix-directives.md` pendiente; el implement-report lo registra como observación devuelta. Los `Entonces` de AC-3 sí se cumplen (`pending: []`, grep limpio), así que esto no bloquea esta historia. Sí impide declarar cerrado el contrato de salida global de la épica. | Antes de pasar EPIC-26 a DONE, cerrar el rework de STORY-151 y volver a correr `verify-fixed-layout --json`, el grep CS-2 y `verify:repository`. |
| LOW | specs/flow/STORY-157-reparar-enlaces-tras-migracion/story.md:37 | AC-2 pide que `docs/requirements/` no cambie de contenido. `git diff --quiet $(git merge-base main HEAD) HEAD -- docs/requirements` termina con exit 1 por `85d9229`, el renombre de wikilink de ADR-0013, anterior a la migración. Esta historia no toca `docs/requirements/`: el árbol está limpio y el commit de migración `8df4b11` no lo modifica. Por eso el escenario se cumple en la práctica, pero la evidencia del comando literal no es limpia. | Que el aceptante dé por buena la justificación del implement-report, o que la verificación use como base el padre de `8df4b11` en lugar del merge-base con `main`. |
| LOW | test/check-doc-links.test.js:100 | El caso `HISTORICAL_EXCLUSIONS informa specs/ como raíz histórica…` solo compara el valor de la constante. No comprueba ningún comportamiento observable. La constante solo se usa en el mensaje `[INFO]` (`scripts/check-doc-links.js:291`), así que la aserción es débil, aunque coherente con D-5. | Opcional: comprobar la línea `[INFO]` que emite el CLI, o aceptar la prueba como guarda de regresión de la constante. |
| LOW | specs/flow/EPIC-26-layout-y-flow-forward-mejorado/epic.md:37 | La historia se marca `[x]` en el índice de la épica estando aún en `CODE-REVIEW/IN-PROGRESS`, antes de verify y acceptance. | Confirmar que la convención del flujo permite marcarla al implementar. Si no la permite, desmarcarla hasta el gate de aceptación. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-157-reparar-enlaces-tras-migracion/design.md:0 (D-5, «Componentes afectados») | El diseño declara como cambio de esta historia la ampliación del corpus de slugs a `specs/` en `checkDocumentation`, pero ya existía (`scripts/check-doc-links.js:246–247`, aportado por STORY-153), igual que el caso `resolves wikilinks to work items under specs/flow/`. La implementación lo detecta y limita el cambio a `HISTORICAL_EXCLUSIONS` (correcto), pero el design no refleja el estado real. Sin impacto funcional: el contrato de interfaz se cumple. | Dejar constancia en el registro de cambios de design.md (o en el informe final) de que D-5 se cumplió parcialmente por adelantado en STORY-153. |
| LOW | test/check-doc-links.test.js:71 | El caso nuevo `wikilinks a work items en specs/flow y archive…` solapa con el caso existente de la l. 60 en la resolución desde `specs/flow/STORY-*`; su valor añadido es solo la entrada de `archive/`. Además mezcla un nombre en español entre títulos en inglés del mismo archivo. | Opcional: centrar el caso en `archive/` y unificar el idioma de los títulos del archivo. |
| LOW | specs/flow/STORY-157-reparar-enlaces-tras-migracion/design.md:0 (D-7, D-1 P2) | Los comandos literales de D-1 P2 (`git log --diff-filter=R -1 -- specs/flow`) y D-7 (`git show --stat -M … -- <archivo>`) no detectan el renombre al limitar el pathspec al destino; la implementación usó variantes sin pathspec y con `-l0`, documentadas en `implement-report.md`. El contrato #7 (`git diff --quiet $(git merge-base main HEAD) HEAD -- docs/requirements`) sale con exit 1 por `85d9229` (cambio de wikilink previo a la épica, ajeno a la migración). | Corregir los comandos en el design para futuras verificaciones; la desviación del contrato #7 la debe juzgar el Guardián de Requisitos para AC-2. |
| LOW | docs/runbooks/actualizar-spec-de-proyecto.md:45 | El runbook queda a medias: el bloque de conteo usa ya `specs/flow/`, pero las l. 27, 45, 67 y 199 siguen citando `docs/specs/01-projects/…/project.md` (nivel retirado por ADR-0013), igual que `docs/domains/domain.md:34`. No son rutas movidas por STORY-153, así que quedan fuera de la regla D-2 y se registran como deuda previa (F-4), pero la clase «deuda previa» no está entre las cuatro de D-2. | Abrir una historia propia para retirar o reescribir el procedimiento `01-projects` del runbook y de `domain.md`. |
| LOW | specs/flow/STORY-157-reparar-enlaces-tras-migracion/implement-report.md:0 («Alcance del diff») | El informe dice 12 archivos modificados, pero el diff también incluye `specs/flow/EPIC-26-layout-y-flow-forward-mejorado/epic.md` (checklist de STORY-157 en `[x]`). Es el comportamiento esperado de `story-implement-tasks` (actualiza el checklist de la épica), así que no viola el contrato #12, pero la lista del informe está incompleta. | Añadir `epic.md` (checklist de la épica) a la sección de alcance del informe. |
| LOW | docs/index.md:0 (D-4) | El índice regenerado no incluye la entrada `[[specs-index]] → ../specs/README.md` que esperaba D-4; ningún documento activo la enlaza, así que no rompe el gate. Ya está devuelto a STORY-152 en el informe, según D-1/D-4. | Ninguna en esta historia; seguimiento en STORY-152. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (59 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (10 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-157`. Los hallazgos LOW son opcionales. Antes de cerrar EPIC-26 quedan dos seguimientos: el rework pendiente de STORY-151 y la deuda documental de `01-projects`, `SDDF_ROOT` y `$SPECS_BASE` en `docs/domains/` y en el runbook, que puede ir a una historia propia.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | DoD IMPLEMENT con 21/24 criterios ✓. Los 3 ⚠️ no son evaluables desde artefactos: el build de CI requiere acceso a CI/CD, no hay linter configurado y AC-2 tiene un diff estricto contra `main` por `85d9229`, commit ajeno a la migración. Ninguno es ❌ |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer `approved`: el cambio es mínimo, sigue el estilo del archivo y las pruebas usan `node:test` |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer verificó AC-1, AC-2 y AC-3 reproduciendo la evidencia: `npm test` 309/309, `verify:links` y `verify:repository` en verde, `pending: []`, grep CS-2 y `git log --follow` |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer `approved`: D-1 a D-8 aplicados, la interfaz `checkDocumentation` y `ACTIVE_ROOTS` sin cambios, sin archivos versionados nuevos |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima LOW: 16 hallazgos LOW, 0 HIGH/MEDIUM |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 20 `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; se actualiza a `CODE-REVIEW/DONE` en esta ejecución |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️ no evaluable, sin ❌)
