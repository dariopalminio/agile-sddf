---
alwaysApply: false
type: tasks
id: STORY-186
slug: STORY-186-adr-de-workflows-sin-estados-buffer-tasks
title: "Tasks: ADR de workflows sin estados buffer"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-186
design: STORY-186
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer-design
---

<!-- Referencias -->
[[STORY-186-adr-de-workflows-sin-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer-design]]

> Alcance: se crea `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` y se editan solo `docs/adr/ADR-0006-*.md` y `docs/adr/ADR-0008-*.md` (dos campos del frontmatter), `docs/adr/README.md` y `docs/index.md`. No se tocan skills, plantillas, dominios, requisitos, guías, ADR-0003, `CHANGELOG.md` ni `package.json` (design.md, Non-Goals). La historia es documental: no hay prueba automática nueva. La verificación son los contratos V-1 a V-11 de design.md más el gate.

## 1. Precondición

- [ ] T001 Comprobar el estado de partida que cita design.md (Context): el último ADR es ADR-0021 y no existe ningún `docs/adr/ADR-0022-*.md`; ADR-0006 y ADR-0008 tienen `status: ACCEPTED` y `superseded-by: null`; `docs/adr/adr-template.md` conserva sus 7 encabezados `##`; `story-implement` y `story-implement-tasks` siguen escribiendo los encabezados de ronda que cita D-05 (`## Ciclo de corrección — ronda {N}` y `## Correcciones de fix-directives.md (ronda <N>)`); y `npm run verify:repository` y `npm test` pasan antes del cambio (línea base). Si algo difiere, anotarlo para `implement-report.md` y ajustar el número o la regla antes de escribir. Hecho: el estado de partida está confirmado o sus diferencias están anotadas.

## 2. ADR-0022 (componente central)

- [ ] T002 Crear `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` desde `docs/adr/adr-template.md`, con el frontmatter de «Interfaces» (`status: ACCEPTED`, `date` = fecha de implementación, `supersedes: [ADR-0006, ADR-0008]`, `superseded-by: null`), sin los comentarios `escritor:`, el título `# ADR-0022: Workflows de Story y Epic sin estados buffer`, un bloque `<!-- Referencias -->` con wikilinks y los 7 encabezados de la plantilla vacíos de contenido. Depende de T001. Hecho: el archivo existe, en UTF-8 sin BOM, con los 7 encabezados en el orden de la plantilla (C-1, D-01).
- [ ] T003 Redactar `## Contexto y problema`: los dos buffers (`READY-FOR-IMPLEMENT` duplica `PLAN/DONE`; `READY-FOR-DEV` nunca se usó, según la «Evidencia» de la épica), el volumen de ocurrencias, la deuda de ADR-0008 (los rechazos de verify y acceptance no producen un artefacto que el ejecutor reconozca) y las cuatro decisiones abiertas que cierra el ADR. Depende de T002. Hecho: la sección cita EPIC-029, ADR-0006 y ADR-0008 y enumera las cuatro decisiones de CNF-1.
- [ ] T004 Redactar en `## Decisión` los workflows (D-02): el de historia, literal `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`, con `story-analyze` `APPROVED` → `PLAN/DONE`; el de épica, literal `DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED`, con la aprobación del PO como `PLAN/DONE` escrita a mano; `status` = etapa y `substatus` = progreso (NFR-006); `TODO` en cualquier estado activo; sin WIP de cola. Depende de T002. Hecho: las dos cadenas de AC-1 aparecen literales (V-3).
- [ ] T005 Redactar en `## Decisión` el rework y el contrato de `fix-directives.md` (D-03, D-04, D-05): destino `IMPLEMENT/TODO` en los tres gates; la frase «no existe estado ni substatus de rework»; `fix-directives.md` como única señal; la tabla por gate con `based-on`, filas que entran, `Dimensión` (`la del revisor o DoD-CODE-REVIEW`, `verify-defect`, `requirements-coverage`), `Archivo:Línea`, `Severidad` y lista blanca (vacía en aceptación, sin error); las reglas de ADR-0021 (sin PREEXISTENTE ni `no verificado`, fusionado una vez con `Reportado por:`); la regla de ronda: máximo entre `round` de `fix-directives.md` y los `N` de los dos encabezados de `implement-report.md`, + 1, `0` si no hay valor válido; el ciclo común (todo rework vuelve por `/story-code-review`, que es el único que borra el archivo); y la ubicación de la plantilla común `docs/templates/fix-directives-template.md` (la crea STORY-190). Depende de T004. Hecho: V-7 se cumple con la sección leída sola.
- [ ] T006 Redactar en `## Decisión` el valor legado (D-06): `READY-FOR-IMPLEMENT/DONE` → `IMPLEMENT/TODO` si existe `implement-report.md`, → `PLAN/DONE` si no; aviso de los ejecutores; `[WARNING]` de `skill-preflight` sin modificar archivos; migración por edición manual; `READY-FOR-DEV` solo con el aviso de `skill-preflight`; ventana abierta en 6.0.0 que **termina en 7.0.0**; y la regla no define estado ni substatus de rework. Depende de T005. Hecho: V-8 se cumple (`implement-report.md`, `7.0.0` y la negación del estado o substatus de rework aparecen en la sección).
- [ ] T007 Redactar `## Rationale`: simplicidad y coherencia con NFR-006 (no el argumento Lean), conservar la señal de ADR-0008 y cerrar su deuda, por qué `IMPLEMENT/TODO` y no `PLAN/DONE`, y por qué dos fuentes para la ronda y una ventana de una versión mayor. Depende de T006. Hecho: cada decisión de `## Decisión` tiene al menos un argumento.
- [ ] T008 [P] Redactar `## Alternativas consideradas` (D-08), cada una con su motivo de descarte: las 4 obligatorias de CNF-2 (rework en `PLAN/DONE`; que los ejecutores lean `verify-report.md` y `acceptance-report.md`; el estado como señal de rework; clasificar el valor legado por `fix-directives.md`) y las adicionales (`round` en `story.md`, `cycle-status.json`, `requirements-coverage` como dimensión de verify, la lista blanca de los archivos de la implementación, un alias permanente de `READY-FOR-IMPLEMENT`, la ventana sin cierre o hasta 6.1.0, `memory-system migrate`). Depende de T006. Hecho: V-9 se cumple.
- [ ] T009 [P] Redactar `## Consecuencias` con **Positivas** (un solo destino de rework, deuda de ADR-0008 cerrada, sin cambio de esquema en `story.md`, conjuntos cerrados solo pierden valores) y **Negativas / trade-offs** (BREAKING 6.0.0; edición manual en los proyectos consumidores; lista blanca vacía en aceptación, que pide más confirmaciones; la regla de ronda depende de dos encabezados distintos; la espera del rework deja de medirse como cola). Depende de T006. Hecho: ambas subsecciones tienen al menos dos viñetas.
- [ ] T010 [P] Redactar `## Referencias` con ADR-0003, ADR-0006, ADR-0008, ADR-0021, EPIC-029 y STORY-187 a STORY-193, como wikilinks o rutas. Depende de T002. Hecho: ninguna referencia apunta a un archivo inexistente.

## 3. Registros reemplazados e índices

- [ ] T011 [P] En `docs/adr/ADR-0006-migracion-retroactiva-de-estados-de-epica.md`, cambiar solo `status: ACCEPTED` → `status: SUPERSEDED` y `superseded-by: null` → `superseded-by: ADR-0022`, sin la nota bajo el título (D-07, CR-001) y conservando los fines de línea y la ausencia de BOM. Depende de T002. Hecho: `git diff` del archivo muestra exactamente 2 líneas `-` y 2 `+` (V-4).
- [ ] T012 [P] El mismo cambio en `docs/adr/ADR-0008-rework-sin-estado-propio.md`. Depende de T002. Hecho: `git diff` muestra exactamente 2 líneas `-` y 2 `+` (V-4).
- [ ] T013 En `docs/adr/README.md`, añadir al final de la tabla la fila `| [ADR-0022](ADR-0022-workflows-sin-estados-buffer.md) | Workflows de Story y Epic sin estados buffer | ACCEPTED | <date de ADR-0022> |` y cambiar la celda `Estado` de ADR-0006 y ADR-0008 a `SUPERSEDED → [ADR-0022](ADR-0022-workflows-sin-estados-buffer.md)`. Depende de T002 (fecha y título). Hecho: título, estado y fecha coinciden con el frontmatter de ADR-0022 (V-6).
- [ ] T014 [P] En `docs/index.md`, añadir tras la línea de ADR-0021, en `### Decisiones de arquitectura (adr/)`, la línea `- [[workflows-sin-estados-buffer]] — [ADR-0022-workflows-sin-estados-buffer.md](adr/ADR-0022-workflows-sin-estados-buffer.md) — Workflows de Story y Epic sin estados buffer` (C-5). Depende de T002. Hecho: el enlace resuelve a un archivo existente.

## 4. Verificación

- [ ] T015 Verificar AC-1 y CNF-3: V-1, V-2 (los 7 `##` de ADR-0022 coinciden en nombre y orden con `adr-template.md`), V-3, V-4 (`git diff` de ADR-0006 y ADR-0008), V-5 (`git diff --quiet -- docs/adr/ADR-0003-*` sale con 0) y V-6. Depende de T003 a T014. Hecho: los seis contratos se cumplen y la evidencia queda anotada para `implement-report.md`.
- [ ] T016 [P] Verificar AC-2 y AC-3 contra los ejemplos de la historia: para cada fila de la tabla de AC-2 (`story-code-review`/`code-review-report.md`/la del revisor o `DoD-CODE-REVIEW`; `story-verify`/`verify-report.md`/`verify-defect`; `story-acceptance`/`acceptance-report.md`/`requirements-coverage`), el ADR fija el destino `IMPLEMENT/TODO`, el `based-on`, la dimensión y la continuidad de `round` (V-7). Para AC-3: la regla de `implement-report.md`, la versión 7.0.0 y la ausencia de estado o substatus de rework (V-8). Depende de T005 y T006. Hecho: cada escenario de AC-2 y AC-3 tiene su frase en el ADR.
- [ ] T017 [P] Verificar CNF-1 y CNF-2: las cuatro «Decisiones para el ADR» de la épica tienen respuesta explícita en `## Decisión` (ventana, fuente de la ronda, dimensión de verify, lista blanca de aceptación) y las 4 alternativas obligatorias están en `## Alternativas consideradas` (V-9). Depende de T008. Hecho: 4/4 y 4/4.
- [ ] T018 Verificar encoding (V-11): los 5 archivos tocados no empiezan por `EF BB BF` y no contienen U+FEFF ni otros caracteres invisibles (verificación por bytes, no por grep con escapes). Depende de T011 a T014. Hecho: ninguna coincidencia.
- [ ] T019 Ejecutar `npm run verify:repository` y `npm test` (CNF-4, V-10). Depende de T018. Hecho: ambos salen con código 0. Si `check-doc-links` falla, corregir el enlace de T013 o T014 y repetir.
- [ ] T020 Ejecutar `graphify update .` para actualizar el grafo de conocimiento (AGENTS.md) y confirmar con `git status` que solo cambiaron los 5 archivos del alcance (más `graphify-out/`). Depende de T019. Hecho: ningún archivo fuera del alcance aparece modificado.
