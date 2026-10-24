---
alwaysApply: false
type: tasks
id: STORY-147
slug: STORY-147-adr-del-layout-fijo-de-tres-raices-tasks
title: "Tasks: ADR del layout fijo de tres raíces"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-147
design: STORY-147
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-147-adr-del-layout-fijo-de-tres-raices
---

<!-- Referencias -->
[[STORY-147-adr-del-layout-fijo-de-tres-raices]] · [[STORY-147-adr-del-layout-fijo-de-tres-raices-design]]

## 1. Preparación

- [x] T001 Confirmar el número libre: `ls docs/adr/` no contiene `ADR-0016-*`; si existe, usar el siguiente número libre y sustituirlo en T002–T008 (design F-3) — AC-1
- [x] T002 [P] Confirmar que el slug `layout-fijo-de-tres-raices` no existe en ningún frontmatter de `docs/` (`grep -rn "^slug: layout-fijo-de-tres-raices" docs`) para que el wikilink de `docs/index.md` resuelva a un solo archivo — CNF-2

## 2. ADR-0016 (componente central)

- [x] T003 Crear `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` desde `docs/adr/adr-template.md`: frontmatter de design «Esquema de datos» (`status: ACCEPTED`, `supersedes: ADR-0010`, `superseded-by: null`, `date` = fecha de implementación), sin comentarios `# escritor:` ni `[Por completar]`, título `# ADR-0016: Layout fijo de tres raíces: docs/, specs/ y workflow/` — D-1, AC-1, CNF-1
- [x] T004 Redactar `## Contexto y problema`: conocimiento y estado mezclados bajo una raíz configurable; ADR-0010 aplicado de hecho aunque nunca pasó a `ACCEPTED`; origen en EPIC-26 y mejora-012/013 — D-6, AC-1
- [x] T005 Redactar `## Decisión` con el árbol de D-2 y las cadenas literales `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/` como raíces hermanas en la raíz del repo; retiro de `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y `SPECS_BASE` (solo se resuelve `REPO_ROOT`, rutas fijas `specs/flow/…`, `docs/templates/`, `docs/guardrails/`); `docs/requirements/` sin mover — D-2, AC-1
- [x] T006 Añadir a `## Decisión` la convención `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` (solo `COMPLETED`; fecha = `updated:` o, si falta, `created:`; épicas y `CANCELED` no se archivan) y la frase explícita de D-4: los directorios de `specs/flow/` conservan el slug (`STORY-NNN-<slug>/`, `EPIC-NN-<slug>/`), consistente con SMOKE-1 y SMOKE-2 — D-3, D-4, AC-1, AC-3
- [x] T007 Redactar `## Rationale`, `## Alternativas consideradas` (mantener ADR-0010, `root: .`, fase de compatibilidad `specs_root`, directorio sin slug), `## Consecuencias` (positivas; negativas: cambio incompatible y versión mayor, convivencia con Spec Kit, detectar sin escribir, aplicación incremental en EPIC-26; párrafo de D-8 sobre ADR-0002/0007/0012/0013) y `## Referencias` (`[[specs-dentro-de-docs]]`, `[[nivel-l2-epic-y-directorios-numerados]]`, `[[templates-como-capa-propia]]`, `[[EPIC-26-layout-y-flow-forward-mejorado]]`) — D-8, D-9, AC-1

## 3. Reemplazo de ADR-0010 e índices

- [x] T008 Editar `docs/adr/ADR-0010-specs-dentro-de-docs.md` solo en: `status: PROPOSED` → `status: SUPERSEDED`, `superseded-by: null` → `superseded-by: ADR-0016`, y una línea blockquote tras `# ADR-0010: …` con el texto de D-5 enlazando `ADR-0016-layout-fijo-de-tres-raices.md`; no tocar `supersedes: ADR-0009` ni ninguna sección — D-5, D-6, AC-1, AC-2, CNF-1
- [x] T009 [P] Editar `docs/adr/README.md`: fila ADR-0010 con estado `SUPERSEDED → [ADR-0016](ADR-0016-layout-fijo-de-tres-raices.md)` y fila nueva ADR-0016 al final con `title`, `ACCEPTED` y `date` leídos del frontmatter creado en T003 — D-7, AC-1
- [x] T010 [P] Editar `docs/index.md`: línea nueva tras ADR-0015 en `### Decisiones de arquitectura (adr/)` con el formato `- [[layout-fijo-de-tres-raices]] — [ADR-0016-layout-fijo-de-tres-raices.md](adr/ADR-0016-layout-fijo-de-tres-raices.md) — <title>` — D-7, CNF-2

## 4. Verificación

- [x] T011 Verificar AC-1 con los contratos 1–6 de design: frontmatter de ADR-0016 y ADR-0010, `grep -F` de las cinco rutas, de `SDDF_ROOT`/`root`/`SPECS_BASE` y de `<YYYY-MM-DD>-STORY-NNN-<slug>/` en ADR-0016, y fila ADR-0016 en `docs/adr/README.md` — AC-1
- [x] T012 Verificar AC-2 y CNF-1 con `git diff -- docs/adr/ADR-0010-specs-dentro-de-docs.md`: solo cambian las líneas `status`, `superseded-by` y la línea de nota; ninguna línea de Contexto y problema, Decisión, Rationale, Alternativas consideradas, Consecuencias ni Referencias — AC-2, CNF-1
- [x] T013 [P] Verificar AC-3: `## Decisión` de ADR-0016 contiene `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/` y menciona SMOKE-1 y SMOKE-2 — AC-3
- [x] T014 [P] Verificar a mano que los enlaces relativos de ADR-0016 y de la nota de ADR-0010 apuntan a archivos existentes (`docs/adr` está excluido de `check-doc-links.js`) — CNF-2
- [x] T015 Ejecutar `npm run verify:repository` y confirmar código 0 (incluye «enlaces activos» sobre `docs/index.md`) — CNF-2 — enlaces activos exit 0 (CNF-2 ✓); el gate completo termina en exit 1 por 15 pruebas preexistentes del template de épica, idénticas en HEAD sin estos cambios
- [x] T016 Verificar alcance con `git diff --stat`: solo `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` (nuevo), `docs/adr/ADR-0010-specs-dentro-de-docs.md`, `docs/adr/README.md`, `docs/index.md` y artefactos de la historia — Non-Goals
