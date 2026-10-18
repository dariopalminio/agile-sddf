---
type: tasks
id: STORY-138
slug: STORY-138-contrato-de-validacion-tasks
title: "Tasks: Contrato de validación"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-138
design: STORY-138
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-138-contrato-de-validacion
  - STORY-138-contrato-de-validacion-design
---

<!-- Referencias -->
[[STORY-138-contrato-de-validacion]] · [[STORY-138-contrato-de-validacion-design]]

> Orden: línea base → política (secciones §1–§7) → verificación de la política → ADR-0015 → índices → verificación final.
> Todas las tareas del grupo 2 editan el mismo archivo y se ejecutan en orden. Las de verificación son de solo lectura y pueden ir en paralelo.
> ADR-0015 se redacta solo cuando la política pasa V-1…V-9, porque un ADR `ACCEPTED` es inmutable (D-10).
> No se modifican `skills/**`, los flowcharts, `README.md`, `docs/constitution.md` ni `epic.md`. Todo archivo creado o modificado se guarda en UTF-8 sin BOM.

## 1. Línea base

- [ ] T001 Confirmar el «Estado medido» del diseño sobre la rama actual. Comprobar que `ls docs/policies/` lista solo `README.md`, que `ls docs/adr/ | grep ADR-0015` no devuelve nada y que `grep -n -- '-->|' docs/architecture/diagrams/flowchart-story-*.mermaid` da las ramas de D-4. Comprobar también que los valores heredados de la tabla «Veredictos heredados por skill» siguen en sus templates y `SKILL.md`, y que el título `#` y el primer `##` de cada template coinciden con la tabla de D-9. Si alguna pieza no coincide, detener la historia e informar cuál, sin editar nada — Context, AC-1, AC-2, AC-3
- [ ] T002 [P] Registrar la línea base de enlaces activos con `node scripts/check-doc-links.js` (resultado y número de errores), para distinguir después los errores nuevos de los previos — V-13

## 2. Política `validation-contract-policy.md`

- [ ] T003 Crear `docs/policies/validation-contract-policy.md` con el frontmatter de D-1 (`type: policy`, `slug: validation-contract-policy`, `title: "Política de contrato de validación"`, `derives-from: constitution`, sin `enforced-by` ni anotaciones `escritor:`). Añadir el título `# Política de contrato de validación`, la cabecera de 4 líneas (Versión `1.0.0`, Estado `Aprobado`, Última actualización `2026-10-17`, Propietario `Mantenedores de Agile-SDDF`) y los encabezados de D-2 en su orden exacto y sin etiquetas `[CATEGORÍA]`: `## 1. Propósito y alcance` … `## 7. Ejemplos de reportes conformes` y `## Historial de cambios` (requiere T001) — D-1, D-2, AC-1, CNF-3
- [ ] T004 Redactar §1. El propósito va en dos frases. Citar los principios inamovibles 3 y 8 de la constitución con un enlace a `../constitution.md`. El alcance son los siete skills de §4, con remisión a la tabla y sin repetir la lista de valores. Las exclusiones se nombran: `epic-format-validation`, `security-audit` y `fix-directives.md` (artefacto de rework) (requiere T003) — D-1, D-2, AC-1, CNF-1
- [ ] T005 Redactar §2. Primero la regla de formato en una línea (inglés, mayúsculas, guion ASCII, patrón `^[A-Z]+(-[A-Z]+)*$`). Después, la tabla `Valor | Fase | Significado | Efecto en el flujo` con las seis filas de D-4. Al final, la línea «`NEEDS-REFINEMENT` y `NEEDS-CHANGES` no son alias: cada gate emite solo uno de los dos». No nombrar `story-improve` ni `story-refine` (requiere T004) — D-4, AC-1, CNF-2
- [ ] T006 Redactar §3. Incluir las reglas G-01…G-04 con el enunciado de D-3 y G-05 y G-06 con el de D-6, con IDs `G-0N` en negrita. Cerrar con la línea «Acción ante violación» de D-3. Comprobar que G-02 fija literalmente la línea `**Veredicto:** `<VALOR>` — <motivo en una frase>` (requiere T005) — D-3, D-6, AC-1
- [ ] T007 Redactar §4. La tabla lleva las columnas `Skill | Reporte | Fase | Valores permitidos | Flowchart | Valores sin rama` y las siete filas de D-4. La columna «Flowchart» enlaza `../architecture/diagrams/flowchart-story-specify.mermaid`, `flowchart-story-plan.mermaid` y `flowchart-story-excecution-qa.mermaid` (con la errata del nombre real). `epic-validate` va sin enlace y con la marca «previsto, EPIC-23». Bajo la tabla, enunciar la invariante de AC-3 en un párrafo (requiere T006) — D-4, AC-1, AC-3
- [ ] T008 Redactar §5. Una línea introductoria declara no conforme todo valor de la tabla (G-03). La tabla lleva las columnas `Skill | Campo heredado | Valor heredado | Valor canónico` y las 18 filas de D-5 en ese orden. Debajo, la regla de reportes heredados de D-7: no se reescriben, se traducen con esta tabla antes de aplicar G-06 y ningún skill alineado emite valores heredados (requiere T007) — D-5, D-7, AC-2
- [ ] T009 Redactar §6 con la tabla `Skill | Elemento conservado | Motivo | Historia` y, debajo, la línea `Sin excepciones vigentes.` (requiere T008) — D-8, CNF-1
- [ ] T010 Redactar §7 con seis bloques ```` ```markdown ````, bajo `### 7.1 epic-analyze` … `### 7.6 story-acceptance`, según la tabla de D-9. Cada bloque contiene el frontmatter con `type` y `verdict` (y `session-status: partial` en 7.6), el título `#` y el primer `##` reales del template de cada skill (verificados en T001) seguidos de `…`, y la sección `## Veredicto` con la línea de G-02 y el motivo de ejemplo. Los bloques no llevan enlaces ni wikilinks (requiere T009) — D-9, AC-1, CNF-4
- [ ] T011 Completar `## Historial de cambios` con la tabla `Versión | Fecha | Cambios | Autor` y la fila `1.0.0 | 2026-10-17 | Creación inicial (STORY-138) | Dario Palminio` (requiere T010) — D-2

## 3. Verificación de la política

- [ ] T012 [P] V-1 y V-2: el frontmatter coincide con D-1 y `grep -n '^## ' docs/policies/validation-contract-policy.md` devuelve exactamente los encabezados de D-2 en ese orden (requiere T011) — AC-1, CNF-1
- [ ] T013 [P] V-3 y V-4: §3 exige `verdict` (G-01) y `## Veredicto` como primer `##` tras el título (G-02). Los seis valores de §2 cumplen `^[A-Z]+(-[A-Z]+)*$`, comprobado extrayendo los valores entre comillas invertidas de la columna «Valor» (requiere T011) — AC-1, CNF-2
- [ ] T014 [P] V-5 y V-6: §4 tiene las siete filas con los valores de las Notas de `story.md` (incluida `epic-validate`). §5 tiene las 18 filas de D-5, y cada una de las 7 filas de Ejemplos de AC-2 aparece con el mismo par (skill, valor heredado) y el mismo valor canónico (requiere T011) — AC-1, AC-2
- [ ] T015 [P] V-7: para cada `.mermaid`, listar las ramas `-->|…|` que salen del nodo `{verdict}` de cada skill y comprobar que coinciden exactamente con los valores permitidos menos los valores sin rama de su fila en §4. Comprobar también que «Valores sin rama» solo contiene `BLOCKED` o `PENDING`. Registrar la comparación en `implement-report.md` (requiere T011) — AC-3
- [ ] T016 [P] V-8: §7 tiene seis ejemplos. En cada uno, `verdict` coincide con el valor de la línea `**Veredicto:**`, el valor está permitido para su skill según §4 y `## Veredicto` es el primer `##` tras el `#`. Entre los seis aparecen los seis valores del vocabulario (requiere T011) — AC-1
- [ ] T017 [P] V-9 y CNF-1: `wc -l docs/policies/validation-contract-policy.md` da 200 líneas o menos, y ninguna regla ni lista de valores se enuncia dos veces entre secciones. Si falla, compactar la redacción en la sección afectada sin cambiar el contenido normativo y repetir T012–T016 (requiere T011) — CNF-1, CNF-4

## 4. ADR-0015

- [ ] T018 Crear `docs/adr/ADR-0015-contrato-de-validacion.md` a partir de `docs/adr/adr-template.md`. El frontmatter es el de D-10 (`id: ADR-0015`, `slug: contrato-de-validacion`, `title: "Contrato común de validación para los skills de gate"`, `status: ACCEPTED`, `date: 2026-10-17`, `supersedes: null`, `superseded-by: null`), sin anotaciones `escritor:`. Las secciones (Contexto y problema, Decisión, Rationale, Alternativas consideradas, Consecuencias, Referencias) siguen el contenido de D-10. Para la lista de valores, remitir a `../policies/validation-contract-policy.md` sin reproducir §4 ni §5 (requiere T012–T017) — D-10, CR-001, CNF-1
- [ ] T019 V-11: el frontmatter coincide con D-10, `grep -c '^| `story-' docs/adr/ADR-0015-contrato-de-validacion.md` da 0 y los enlaces relativos a la policy, a EPIC-25 y a los flowcharts resuelven (requiere T018) — CNF-1, CR-001

## 5. Índices

- [ ] T020 [P] En `docs/policies/README.md` › «Índice de policies», reemplazar la fila «Todavía no hay policies…» por `| [validation-contract-policy.md](validation-contract-policy.md) | Veredicto y vocabulario de los reportes de validación | — |` (requiere T017) — D-11, CNF-1
- [ ] T021 [P] En `docs/adr/README.md` › «Índice de ADRs», añadir tras ADR-0014 la fila `| [ADR-0015](ADR-0015-contrato-de-validacion.md) | Contrato común de validación para los skills de gate | ACCEPTED | 2026-10-17 |` (requiere T019) — D-11, CNF-1
- [ ] T022 Regenerar `docs/index.md` con `/memory-system index`, sin editarlo a mano. Revisar el diff: las entradas nuevas deben ser `validation-contract-policy` en «Policies» y `contrato-de-validacion` en «Decisiones de arquitectura». Cualquier otro cambio del diff se anota en `implement-report.md` como ajeno a la historia (requiere T020, T021) — D-11, CNF-1

## 6. Verificación final

- [ ] T023 [P] V-12: `grep -n validation-contract-policy docs/policies/README.md docs/index.md` devuelve una coincidencia en cada archivo (requiere T022) — CNF-1
- [ ] T024 [P] V-13: `npm run verify:repository` pasa. Comparar el resultado de enlaces activos con la línea base de T002: no debe haber errores nuevos en `docs/policies/` ni en `docs/adr/` (requiere T022) — CNF-1
- [ ] T025 [P] V-10 (preparar la evidencia para ACCEPTANCE): anotar en `implement-report.md`, con la sección y la regla de la política que la respaldan, la respuesta a dos preguntas. Qué valor emite `story-verify` cuando no puede ejecutar las pruebas (`BLOCKED`, §4) y qué valor canónico corresponde a `ACCEPTANCE-BLOCKED` (`BLOCKED`, §5). La revisión del PO se hace en `/story-acceptance` (requiere T022) — CNF-3
- [ ] T026 Ejecutar `graphify update .` para mantener el grafo de conocimiento al día con los documentos nuevos (requiere T023–T025) — entorno local
