---
type: testcases
id: STORY-147
slug: STORY-147-adr-del-layout-fijo-de-tres-raices-testcases
title: "Test Cases: ADR del layout fijo de tres raíces"
story: STORY-147
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-147-adr-del-layout-fijo-de-tres-raices
---

<!-- Referencias -->
[[STORY-147-adr-del-layout-fijo-de-tres-raices]]

# Casos de Prueba: ADR del layout fijo de tres raíces

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 0 |
| CT   | 0 |
| IT   | 4 |
| API  | 0 |
| E2E  | 4 |
| EV   | 0 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | ADR nuevo que reemplaza a ADR-0010 | ADR-0010 vigente de hecho (`PROPOSED`) y sin `ADR-0016-*` en `docs/adr/` | Se registra el ADR del layout fijo (T003–T009) | Existe `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` con `status: ACCEPTED` y `supersedes: ADR-0010`; su `## Decisión` contiene literalmente `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` como raíces hermanas en la raíz del repo, declara retirados `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y `SPECS_BASE`, y fija `<YYYY-MM-DD>-STORY-NNN-<slug>/` para `specs/flow/archive/`; ADR-0010 tiene `status: SUPERSEDED` y `superseded-by: ADR-0016`; `docs/adr/README.md` lista ADR-0016 | AC-1, D-1, D-2, D-3, D-5, D-7, T011 |
| E2E-002 | End-to-End | ADR-0010 no se edita in place | ADR-0010 con su contenido original en `HEAD` | Se marca como reemplazado (T008) | `git diff -- docs/adr/ADR-0010-specs-dentro-de-docs.md` muestra solo las líneas `status`, `superseded-by` y la nota blockquote bajo el título; Contexto y problema, Decisión, Rationale, Alternativas consideradas, Consecuencias y Referencias quedan idénticas, igual que `supersedes: ADR-0009` | AC-2, CNF-1, D-5, D-6, T012 |
| E2E-003 | End-to-End | Decisión explícita sobre el slug del directorio | EPIC-26 conserva `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/` (ADR-0004) | Se redacta `## Decisión` de ADR-0016 (T006) | La sección declara que los directorios de `specs/flow/` conservan el slug (`STORY-NNN-<slug>/`, `EPIC-NN-<slug>/`) y cita SMOKE-1 (`specs/flow/STORY-001-<slug>/story.md`) y SMOKE-2 (`specs/flow/EPIC-01-<slug>/epic.md`) sin contradecirlos | AC-3, D-4, T013 |
| E2E-004 | End-to-End | Gate determinista verde tras añadir el ADR | ADR-0016 creado e índices actualizados | Se ejecuta `npm run verify:repository` | Termina con código 0, sin enlaces rotos en «enlaces activos» | CNF-2, D-7, T015 |
| IT-001 | Integration | Reemplazo bidireccional coherente entre ADRs | ADR-0016 y ADR-0010 editados | Se comparan sus frontmatter | `ADR-0016.supersedes = ADR-0010` y `ADR-0010.superseded-by = ADR-0016`; `ADR-0010.status = SUPERSEDED` (estado válido del README) | AC-1, Interfaz «Reemplazo entre ADRs», D-6 |
| IT-002 | Integration | Índice de ADRs coherente con los frontmatter | `docs/adr/README.md` actualizado (T009) | Se compara la fila ADR-0016 y la fila ADR-0010 con sus archivos | La fila ADR-0016 enlaza `ADR-0016-layout-fijo-de-tres-raices.md` con `title`, `ACCEPTED` y `date` iguales al frontmatter; la fila ADR-0010 muestra `SUPERSEDED → [ADR-0016](ADR-0016-layout-fijo-de-tres-raices.md)` | AC-1, D-7, T009 |
| IT-003 | Integration | Wikilink de `docs/index.md` resuelve al ADR nuevo | `slug: layout-fijo-de-tres-raices` único en `docs/` (T002) y línea añadida (T010) | `check-doc-links.js` indexa slugs y resuelve `[[layout-fijo-de-tres-raices]]` | El wikilink resuelve a un único archivo (`docs/adr/ADR-0016-layout-fijo-de-tres-raices.md`) y el enlace relativo `adr/ADR-0016-layout-fijo-de-tres-raices.md` existe | CNF-2, D-1, D-7, T002, T010 |
| IT-004 | Integration | Enlaces del ADR y de la nota (fuera del gate) | `docs/adr` excluido de `check-doc-links.js` | Se revisan a mano los enlaces relativos de ADR-0016 y de la nota de ADR-0010 | Cada enlace relativo apunta a un archivo existente; `git diff --stat` solo incluye los 4 archivos de «Componentes afectados» y artefactos de la historia | CNF-2, Non-Goals, T014, T016 |

## Notas de cobertura

- **tasks.md usado:** sí; T002, T009, T010, T014 y T016 originan IT-002 a IT-004 y los Ref `T-NNN` de cada caso.
- **Tipos sin casos:** la historia es un `chore` documental que no crea funciones (UT), UI (CT), endpoints (API) ni modifica skills (EV). La verificación es sobre archivos Markdown y el gate existente.
- **Precondición de E2E-001/E2E-002:** se usa el estado real de ADR-0010 (`PROPOSED`, vigente de hecho) en lugar de «ACCEPTED» de la historia (CR-001 de design.md). La intención del AC se conserva.
- **Nota de reemplazo:** E2E-002 acepta la línea blockquote bajo el título según `docs/adr/README.md` y D-5 (CR-002 de design.md).
- **Gap conocido:** el gate no valida enlaces dentro de `docs/adr/`; lo cubre IT-004 de forma manual.

## Test Cases Progress for STORY-147

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: ADR nuevo que reemplaza a ADR-0010
- [ ] E2E-002: ADR-0010 no se edita in place
- [ ] E2E-003: Decisión explícita sobre el slug del directorio
- [ ] E2E-004: Gate determinista verde tras añadir el ADR
- [ ] IT-001: Reemplazo bidireccional coherente entre ADRs
- [ ] IT-002: Índice de ADRs coherente con los frontmatter
- [ ] IT-003: Wikilink de `docs/index.md` resuelve al ADR nuevo
- [ ] IT-004: Enlaces del ADR y de la nota (fuera del gate)
