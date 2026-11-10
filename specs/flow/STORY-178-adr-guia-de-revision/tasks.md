---
alwaysApply: false
type: tasks
id: STORY-178
slug: STORY-178-adr-guia-de-revision-tasks
title: "Tasks: ADR de la guía de revisión"
status: IMPLEMENT
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-178
design: STORY-178
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-178-adr-guia-de-revision
  - STORY-178-adr-guia-de-revision-design
---

<!-- Referencias -->
[[STORY-178-adr-guia-de-revision]] · [[STORY-178-adr-guia-de-revision-design]]

> Alcance (Non-Goals de design.md): solo se crean o modifican `docs/adr/ADR-0021-guia-de-revision-review-md.md`, `docs/adr/README.md` y `docs/index.md`. No se crea `REVIEW.md` ni se tocan `story-code-review`, sus agentes, `dod-story-code-review.md`, `sddf-constitution`, ADR-0015 ni ADR-0019.

## 1. Precondiciones

- [x] T001 [P] Confirmar que el número y el slug siguen libres: no existe `docs/adr/ADR-0021-*`, `ADR-0021` no aparece fuera de los artefactos de EPIC-28 y `guia-de-revision-review-md` no es el `slug:` de ningún archivo de `docs/` (D-1, F-1 paso 1). Si el número está ocupado, aplicar F-3: usar el siguiente libre, propagarlo al nombre de archivo, `id`, título, fila del README y línea de `docs/index.md`, y anotarlo para `implement-report.md`. Hecho: se conoce el número definitivo del ADR.
- [x] T002 [P] Comprobar el estado de CR-001 de design.md: o bien `specs/flow/STORY-181-hallazgos-preexistentes/story.md` ya dice «el método que fija el `design.md` de STORY-181 conforme a ADR-0021», o bien el humano decidió fijar el método en el ADR y D-6 lo incluye. Si ninguna de las dos se cumple, pedir la decisión al humano antes de redactar D-6 (T009). Hecho: está decidido si el ADR delega o fija el método de líneas no tocadas.

## 2. ADR-0021 (componente central)

- [x] T003 Crear `docs/adr/ADR-0021-guia-de-revision-review-md.md` desde `docs/adr/adr-template.md` con el frontmatter del esquema de datos de design.md (`type: adr`, `id: ADR-0021`, `slug: guia-de-revision-review-md`, `title: "Guía de revisión por proyecto en REVIEW.md"`, `status: ACCEPTED`, `date:` de hoy, `supersedes: null`, `superseded-by: null`), el encabezado `# ADR-0021: Guía de revisión por proyecto en REVIEW.md` y las seis secciones `##` en el orden del template, sin comentarios `escritor:` ni `[Por completar]` (D-1, AC-1). Depende de T001. Hecho: el archivo existe con frontmatter válido y los seis encabezados en orden.
- [x] T004 Redactar `## Contexto y problema` según D-7: el ruido de `/story-code-review` (línea base de EPIC-28: ≈580 LOW en 55 de 71 informes, LOW arrastrados y duplicados en STORY-125) y las reglas propias de agile-sddf dentro de los agentes; después, dos bloques separados con los títulos **Lo que dice la convención de Anthropic** (cita `https://code.claude.com/docs/en/code-review-customize` con la fecha de consulta 2026-11-07: solo lo lee el servicio gestionado de GitHub y no el `/code-review` local, cambia lo que se reporta y no el formato, se lee de la rama base, severidades Important/Minor/Pre-existing, check neutral que nunca bloquea) y **Lo que decide agile-sddf** (`story-code-review` es un gate que bloquea, lee `REVIEW.md` de forma explícita desde el working tree y traduce las severidades) (CNF-3, F-3). Hecho: la URL aparece con fecha y los dos bloques no mezclan convención y decisión.
- [x] T005 Redactar en `## Decisión` el subtítulo `### Ubicación` según D-2: `REVIEW.md` vive en `<REPO_ROOT>/REVIEW.md` como archivo de convención de herramienta, igual que `AGENTS.md` y `CLAUDE.md`; no es una raíz del layout y ADR-0019 no cambia; agile-sddf lee un solo `REVIEW.md` (no los de subdirectorios); el de este repo no se publica en npm y los consumidores reciben una semilla con `/sddf-constitution` (STORY-184) (AC-1, CNF-1). Hecho: el texto nombra `AGENTS.md`, `CLAUDE.md` y ADR-0019 sin proponer una cuarta raíz.
- [x] T006 Redactar `### Precedencia` según D-3: la tabla de cuatro niveles (`docs/constitution.md` → DoD CODE-REVIEW `$DOD_PATH`, por defecto `docs/guardrails/dod-story-code-review.md` → `REVIEW.md` → criterios genéricos de los revisores) con las columnas Fuente, Qué decide y Relación con `REVIEW.md`; el párrafo de que `code-review-report-template.md` fija el formato fuera de la escala (ADR-0015) y `REVIEW.md` nunca cambia formato ni vocabulario de `verdict`; la regla de conflicto (rige la fuente superior) y el comportamiento sin `REVIEW.md` (fuentes 1, 2 y 4, CS-2) (AC-1). Hecho: la sección nombra `constitution.md`, `dod-story-code-review.md` y `code-review-report-template.md`.
- [x] T007 Redactar `### Fuente de lectura` según D-4: `/story-code-review` lee `<REPO_ROOT>/REVIEW.md` del working tree en el estado en que está al ejecutarse la revisión, lo pasa a los cuatro revisores y al árbitro y no usa git para leerlo (AC-1, AC-3). Hecho: la sección contiene «working tree» y no exige ningún comando git.
- [x] T008 Redactar `### Historias que modifican la guía o el DoD` según D-5: rige la versión del working tree; `/story-code-review` advierte en `code-review-report.md` nombrando `REVIEW.md`, `$DOD_PATH` o ambos; la detección compara esos archivos con `$IMPL_FILES` (de `implement-report.md`) sin git y, si `$IMPL_FILES` está vacío, el informe dice que no pudo comprobarlo; la advertencia no cambia `verdict` ni `max-severity` (decide el humano en `/story-acceptance`); el texto y la sección de la advertencia los fija STORY-180 sin cambiar el contrato del informe (AC-3). Hecho: los tres puntos de AC-3 (versión que rige, advertencia exigida, sin git) se leen en la sección.
- [x] T009 Redactar `### Vocabulario` según D-6: la tabla con una fila por severidad (🔴 Important → `HIGH` o `MEDIUM` → bloquea `NEEDS-CHANGES`; 🟡 Minor → `LOW` → no bloquea; 🟣 Pre-existing → `PREEXISTENTE` → no bloquea) y las cuatro reglas que la acompañan: elección entre `HIGH` y `MEDIUM` por el criterio actual del revisor; `PREEXISTENTE` es categoría, no entra en `max-severity` ni en `fix-directives.md`; asignación conservadora con la delegación del método según lo resuelto en T002; correspondencia de las cuatro secciones de `REVIEW.md` que nombra STORY-179 (AC-2). Depende de T002. Hecho: cada severidad aparece en una sola fila con su categoría y efecto.
- [x] T010 Redactar `## Rationale` con los cuatro motivos de D-7: separar criterios genéricos del framework y calibración por proyecto; reutilizar la convención de Anthropic para que un archivo sirva al gate local y al servicio de GitHub; KISS sin git en el skill; la constitución prevalece (flujo de autoridad de AGENTS.md) (AC-1). Hecho: los cuatro motivos están y cada uno remite a una decisión de `## Decisión`.
- [x] T011 Redactar `## Alternativas consideradas` con las alternativas rechazadas de D-2 a D-6 y su motivo, incluida **rama base** (exige git y una rama base que el flujo local no define; sin git la revisión fallaría) y **leer ambas versiones y aplicar la más estricta** (CNF-2). Hecho: «rama base» aparece con su motivo de descarte.
- [x] T012 Redactar `## Consecuencias` según D-7: positivas (cada proyecto calibra la revisión sin editar los agentes; los agentes quedan sin reglas propias de agile-sddf, CS-3) y negativas/trade-offs (una historia puede rebajar su listón, mitigado por D-5 y `/story-acceptance`; lectura distinta en local y en GitHub hasta fusionar; proyectos sin `REVIEW.md` sin cambios, CS-2); añadir los puntos de cambio de F-4 (reemplazar D-4 o D-2 solo con un ADR nuevo) (AC-1). Hecho: la sección distingue positivas de negativas y nombra los puntos de cambio.
- [x] T013 Redactar `## Referencias`: `[[layout-fijo-con-archivo-de-epicas]]`, `[[contrato-de-validacion]]`, `[[EPIC-28-calibrar-story-code-review-con-review-md]]`, la URL de Anthropic y STORY-179 a STORY-185 (D-7). Verificar a mano que cada wikilink coincide con un `slug:` existente, porque `check-doc-links.js` excluye `docs/adr` (Risks). Hecho: todos los wikilinks resuelven a un `slug:` real.

## 3. Índices

- [x] T014 [P] Añadir al final de la tabla `## Índice de ADRs` de `docs/adr/README.md` la fila `| [ADR-0021](ADR-0021-guia-de-revision-review-md.md) | Guía de revisión por proyecto en REVIEW.md | ACCEPTED | <date> |`, con `title` y `date` idénticos al frontmatter de T003 (AC-1). Depende de T003. Hecho: la fila queda tras la de ADR-0020 y su enlace resuelve.
- [x] T015 [P] Añadir en `docs/index.md`, sección `### Decisiones de arquitectura (adr/)`, tras la línea de ADR-0020, la línea `- [[guia-de-revision-review-md]] — [ADR-0021-guia-de-revision-review-md.md](adr/ADR-0021-guia-de-revision-review-md.md) — Guía de revisión por proyecto en REVIEW.md`, sin regenerar el índice (AC-1, CNF-4). Depende de T003. Hecho: la línea sigue el formato de las de ADR-0001 a ADR-0020.

## 4. Verificación

- [x] T016 [P] Verificar los contratos 1 y 2 de design.md: `id: ADR-0021`, `status: ACCEPTED`, `slug` igual al nombre de archivo sin `ADR-0021-` ni `.md`; los encabezados `##` son exactamente Contexto y problema, Decisión, Rationale, Alternativas consideradas, Consecuencias y Referencias, en ese orden; no hay `[Por completar]` ni `escritor:` (AC-1). Hecho: los dos contratos se cumplen.
- [x] T017 [P] Verificar los contratos 3, 6 y 7: `## Decisión` contiene la raíz del repositorio como ubicación, la tabla de precedencia con los tres archivos y «working tree»; la regla de D-5 con la versión que rige, la advertencia y `$IMPL_FILES` sin git; el ADR compara `REVIEW.md` con `AGENTS.md` y `CLAUDE.md` y `git diff -- docs/adr/ADR-0019-layout-fijo-con-archivo-de-epicas.md` sale vacío (AC-1, AC-3, CNF-1). Hecho: los tres contratos se cumplen.
- [x] T018 [P] Verificar el contrato 5 (AC-2) con los tres ejemplos de la historia: en la tabla de vocabulario, `Important`, `Minor` y `Pre-existing` aparecen una sola vez cada uno, con `HIGH o MEDIUM`/bloquea, `LOW`/no bloquea y `PREEXISTENTE`/no bloquea. Hecho: las tres filas de Ejemplos de AC-2 coinciden con la tabla.
- [x] T019 [P] Verificar los contratos 8 y 9: `## Alternativas consideradas` contiene «rama base» con motivo; el ADR contiene `code.claude.com/docs/en/code-review-customize` y los bloques **Lo que dice la convención de Anthropic** y **Lo que decide agile-sddf** (CNF-2, CNF-3). Hecho: los dos contratos se cumplen.
- [x] T020 [P] Verificar el contrato 4 y la codificación: la fila de README tiene el mismo `title`, `ACCEPTED` y la misma `date` que el frontmatter; los tres archivos tocados están en UTF-8 sin BOM y sin U+FEFF literal en el contenido (comprobación por bytes) (AC-1). Hecho: título, estado y fecha coinciden y no hay BOM.
- [x] T021 Ejecutar `npm run verify:repository` y `npm test`; si fallan por el wikilink o el enlace de `docs/index.md`, corregir la ruta o el slug, nunca relajar el checker (CNF-4, F-3). Depende de T003 a T020. Hecho: ambos comandos terminan con código 0.
- [x] T022 Verificar el contrato 11: `git diff --stat` y `git status` solo muestran los tres archivos de «Componentes afectados» más los artefactos de `specs/flow/STORY-178-adr-guia-de-revision/` (Non-Goals). Depende de T021. Hecho: ningún otro archivo aparece modificado por esta historia.
