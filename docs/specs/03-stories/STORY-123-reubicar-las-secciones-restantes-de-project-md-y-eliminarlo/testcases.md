---
type: testcases
id: STORY-123
slug: STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo-testcases
title: "Test Cases: Reubicar las secciones restantes de project.md y eliminarlo"
story: STORY-123
created: 2026-10-09
updated: 2026-10-09
related:
  - STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo
---

<!-- Referencias -->
[[STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo]]

# Casos de Prueba: Reubicar las secciones restantes de `project.md` y eliminarlo

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 24 |
| CT   | 0 |
| IT   | 7 |
| API  | 0 |
| E2E  | 3 |
| EV   | 0 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | Secciones reubicadas y `01-projects/` eliminada | `docs/specs/01-projects/PROJ-01-agile-sddf/` solo contiene `project.md` y este ya no tiene §1.8 ni §2.1–2.2 como texto propio | Se ejecuta el flujo F-1 completo (T001–T019) | `test ! -e docs/specs/01-projects` termina con éxito; cada sección de origen de la tabla del Context figura en `reubicacion-report.md` › `## Secciones` como reubicada en `product/`, `architecture/` o `domains/`, o como `descartada-duplicado` con `Motivo` que cita dónde vive su contenido (§1.1 y §11) | AC-1, D-1, D-8, V-1, V-2, T016, T020, T021 |
| E2E-002 | End-to-End | Redirección y sin wikilinks rotos | ADR-0006, `docs/product/story-map.md` y los 14 `epic.md` (EPIC-00…12 y EPIC-20) contienen `[[PROJ-01-agile-sddf]]` | Se elimina `project.md` junto con la creación de la redirección y el retiro del runbook (T015–T019) | `grep -rl "^slug: PROJ-01-agile-sddf$" docs` devuelve solo `docs/product/proj-01-agile-sddf.md`; su cuerpo es solo la tabla `Sección antigua \| Hogar actual` con un wikilink por fila; `docs/runbooks/actualizar-spec-de-proyecto.md` no existe; `memory-system check` no reporta `broken-wikilink` hacia `[[PROJ-01-agile-sddf]]`, `[[runbook-actualizar-spec-de-proyecto]]` ni en los documentos tocados, y el total de `broken-wikilink` no supera la línea base (interpretación V-7 de CR-002) | AC-2, D-6, D-7, V-4, V-5, V-6, V-7, T022, T023 |
| E2E-003 | End-to-End | Sección sin hogar bloquea el borrado | El inventario de `project.md` contiene una sección (simulada) sin capa de destino ni equivalente en otra capa, marcada `SIN HOGAR` | Se aplica el gate de D-8 paso 5 (T014) | `project.md` sigue existiendo; las secciones con destino quedan reubicadas, registradas en el informe y reemplazadas en `project.md` por una línea de enlace a su destino; la sección `SIN HOGAR` queda intacta y listada en `## Pendiente de decisión del PO`; no se crea la redirección, no se borra el runbook ni se regenera el índice | AC-3, D-8, F-2, V-8, T014, T024 |
| UT-001 | Unit | Precondición de AC-1 satisfecha | STORY-104…107 implementadas: `PROJ-01-agile-sddf/` contiene solo `project.md` y §1.8/§2.1/§2.2 son enlaces a `[[stakeholders]]` y `[[requirements-index]]` | Se ejecutan `ls` y `grep -nE "\*\*(FR-\|NFR-\|US-0)"` sobre `project.md` (T001) | `ls` lista solo `project.md`; `grep` no devuelve texto propio de requisitos ni perfiles; el flujo continúa | AC-1, D-8 paso 1, T001 |
| UT-002 | Unit | Precondición de AC-1 incumplida | `PROJ-01-agile-sddf/` contiene además `project-plan.md` (o `project.md` conserva `**FR-001`) | Se ejecuta T001 | La historia se detiene sin crear ni modificar ningún archivo e informa qué historia de STORY-104…107 falta según el archivo sobrante o el texto persistente | AC-1, D-8 paso 1, Risks, T001 |
| UT-003 | Unit | Esquema del informe de reubicación | T002 completada con la salida de `check` | Se crea `reubicacion-report.md` (T003) | Frontmatter `type: report`, `id: STORY-123`, `slug: STORY-123-reubicacion-report`, `title: "Informe de reubicación de project.md"`, `created`/`updated`; título `# Informe de reubicación de project.md`; `## Línea base` con total, desglose `orphan`/`broken-wikilink` y `broken-wikilink` por destino | Esquema de datos, D-8 paso 2, T003 |
| UT-004 | Unit | Tabla `## Secciones` completa y con decisiones válidas | `project.md` vigente y la tabla del Context de `design.md` | Se construye el inventario (T004) | Columnas `Sección de origen \| Líneas \| Ítems origen \| Decisión \| Destino (ruta › sección) \| Ítems destino \| Motivo`; una fila por sección (incluidas la nota de vigencia como `absorbida`, `# 1.`…`# 4.` como `sin-contenido-propio` y §1.8/§2.1/§2.2 como `trasladada-STORY-105`); toda `Decisión` pertenece al enumerado del Esquema de datos; `Líneas` e `Ítems origen` recalculados sobre el `project.md` vigente | AC-1, CNF-1, D-1, D-8 paso 3, T004 |
| UT-005 | Unit | Descartes justificados | Filas §1.1 y §11 con decisión `descartada-duplicado` | Se revisa la columna `Motivo` | §1.1 cita `domains/domain.md › Project Overview › **Nombre:**` y §11 cita `docs/index.md`; ninguna fila `descartada-duplicado` ni `SIN HOGAR` tiene `Motivo` vacío | AC-1, CNF-1, D-1, V-2, T004 |
| UT-006 | Unit | Sección nueva no prevista en el diseño | `project.md` vigente tiene un encabezado `##` que no figura en la tabla del Context | Se comparan encabezados con el inventario (T005) | Se añade su fila con destino según D-2…D-5 o, si ninguna capa la admite, con decisión `SIN HOGAR` y `Motivo` obligatorio | AC-3, D-8 paso 3, T005 |
| UT-007 | Unit | `vision.md` con §1.2–1.7 como contenido vigente | `vision.md` con la estructura de STORY-104 D-1 | Se trasladan §1.2–1.7 (T007) | `## Problema que resolvemos` (2 párrafos), `### Visión (elevator pitch)` (7 ítems), `### Beneficios clave` (6 ítems), `## Criterios de éxito` (10 ítems con casillas `[x]`/`[ ]` y evidencias tal cual), `### Restricciones` (3 ítems) y `### Fuera de alcance (Non-Goals)` (7 ítems) contienen el texto literal de `project.md`; la nota de STORY-104 se conserva; en el frontmatter solo cambia `updated` (`type: product`, `slug: vision` intactos) | AC-1, CNF-1, D-3, CR-001, T007 |
| UT-008 | Unit | Intención de abril pasa a histórica en `vision.md` | Texto que STORY-104 trasladó de `project-intent.md` | Se crea `## Intención original (2026-04-20)` (T006) | Antes del pie `Volver al mapa: [[index]].` aparecen, íntegras y en orden, `### Definición del Problema`, `### Visión (elevator pitch)`, `### Beneficios Clave`, `### Criterios de Éxito`, `### Restricciones` y `### Fuera de alcance (Non-Goals)`, con `Registro histórico: no describe el estado actual.`; ninguna sección vigente conserva texto de abril | AC-1, CNF-1, D-2, D-3, T006 |
| UT-009 | Unit | Encabezado esperado ausente en `vision.md` o `roadmap.md` | STORY-104 o STORY-106 dejaron el destino sin el encabezado de su diseño (p. ej. falta `## Plan original (2026-04-20)`) | Se ejecuta T006 o T012 | El encabezado o las secciones se crean con el título del diseño (al final, antes del pie, en el caso del roadmap) y el informe anota la desviación | Risks, D-3, D-5, T006, T012 |
| UT-010 | Unit | `ux-ui.md` creado con §2.3 y §3 | `docs/architecture/ux-ui.md` no existe | Se crea el documento (T008) | Frontmatter `type: architecture`, `id: ARCH-UX-UI`, `slug: ux-ui`, `title: "Experiencia de usuario e interfaz del framework SDDF"`, `status: active`; título `#` homónimo; nota D-2; `## Experiencia de usuario (UX) y Diseño de Interfaz (UI)` (párrafo + 9 ítems), `## Design Vibe`, `## Visual Inspiration` (3 ítems), `## Mapas de Navegación` (párrafo + árbol en bloque ``` literal), `## Wireframe ASCII (Box Drawing)`, y `## Referencias` con `[[sddf-architecture]] · [[state-machine]] · [[tech-stack]]` | AC-1, CNF-1, D-4, T008 |
| UT-011 | Unit | `architecture/README.md` registra `ux-ui.md` sin otros cambios | `README.md` con la tabla "Índice de documentos" y el árbol "Cómo se relacionan" | Se edita (T009) | `git diff` muestra exactamente dos líneas añadidas: la fila `[[ux-ui]] — [ux-ui.md](ux-ui.md)` \| `ARCH-UX-UI` \| "Interacción conversacional, patrones de UX y mapa de invocación de skills" y `├── ux-ui.md ← cómo se usa`; ninguna línea eliminada ni modificada | AC-1, D-4, T009 |
| UT-012 | Unit | Anexo histórico de §4.1 en `tech-stack.md` | `tech-stack.md` vigente (2026-09-26) con `## 8. Referencias` | Se añade el anexo (T010) | Tras `## 8. Referencias` existe `## Anexo — Stack según project.md (2026-08-30)` con nota D-2 histórica, la tabla de 15 filas y los bloques `**Patrón arquitectónico.**`, `**Modelo de delegación.**` (con su árbol), `**Agentes.**` y `**Frontera core / extensión.**` literales; las secciones vigentes 1–8 no cambian; en el frontmatter solo cambia `updated` | AC-1, CNF-1, D-2, D-5, T010 |
| UT-013 | Unit | Glosario detallado de §12 en `domain.md` | `domain.md` con `## Terminology Glossary` de 15 términos | Se añade el subapartado (T011) | Al final de `## Terminology Glossary` existe `### Glosario detallado (project.md, 2026-08-30)` con nota D-2 histórica y la tabla literal de 39 términos; el glosario compacto no cambia; la línea "Fuentes de inicio" sustituye solo `` `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` `` por `` `docs/product/`, `docs/requirements/` ``; en el frontmatter solo cambia `updated` | AC-1, CNF-1, D-5, T011 |
| UT-014 | Unit | Apéndices A y B en `roadmap.md` | `roadmap.md` de STORY-106 con `## Épicas` y `## Plan original (2026-04-20)` | Se añaden los anexos (T012) | Tras `## Plan original (2026-04-20)` y antes del pie aparecen `## Estado de implementación (2026-08-30)` (con `### Épicas (19)`, `### Historias (77 con story.md, en 79 directorios)`, `### Superficie del framework`, tablas y 3 párrafos literales) y `## Brechas y deuda conocida (2026-08-30)` (9 ítems numerados literales), ambas con nota D-2 histórica y la cita de origen del apéndice; `## Épicas` vigente no cambia | AC-1, CNF-1, D-5, T012 |
| UT-015 | Unit | Nota de origen en cada bloque trasladado | Destinos D-3…D-5 modificados | Se revisa el inicio de cada bloque trasladado | Cada bloque empieza con `> Trasladado desde project.md §<n> (revisión 2026-08-30, PROJ-01, eliminado) por STORY-123 — [[eliminar-specs-01-projects]].`; `project.md` aparece como texto, no como wikilink; los bloques históricos añaden `Registro histórico: no describe el estado actual.` | CNF-1, D-2, Interfaces, T006–T012 |
| UT-016 | Unit | Recuento de ítems origen = destino | Traslados T006–T012 aplicados | Se cuentan ítems `- `, filas `\| ` y párrafos en `git show HEAD:…/project.md` y en cada destino (T013) | Para cada sección reubicada, `Ítems origen` = `Ítems destino` en el informe | CNF-1, V-3, T013 |
| UT-017 | Unit | Diferencia de recuento o reescritura detectada | Un destino tiene un ítem menos o un dato desfasado corregido (p. ej. "34 skills" cambiado al recuento actual) | Se ejecuta T013 | La diferencia se corrige en el destino antes de continuar; el texto queda literal (los datos desfasados se conservan y se remiten a CR-003); no se avanza al gate con discrepancias | CNF-1, D-1, CR-003, T013 |
| UT-018 | Unit | Gate sin secciones `SIN HOGAR` habilita el cierre | Informe con todas las filas en decisiones distintas de `SIN HOGAR` | Se evalúa el gate (T014) | No se crea `## Pendiente de decisión del PO`; el flujo continúa con los grupos 7 y 8 | AC-1, D-8 paso 5, T014 |
| UT-019 | Unit | Frontmatter de la redirección | Traslados completos y gate superado | Se crea `docs/product/proj-01-agile-sddf.md` (T015) | Frontmatter `type: product`, `slug: PROJ-01-agile-sddf`, `title: "Redirección: especificación de proyecto PROJ-01 (project.md, retirado)"`, `created`/`updated`; no declara `type: project`, `id` ni `status` | AC-2, D-6, T015 |
| UT-020 | Unit | Cuerpo de la redirección: solo tabla, 20 filas | Redirección creada | Se inspecciona el cuerpo fuera del frontmatter | Toda línea no vacía empieza por `\|`; sin `#`, párrafos ni pie; 20 filas de datos en orden §1.1, §1.2…§1.7, §1.8, §2.1, §2.2, §2.3, §3.1…§3.4, §4.1, §11, §12, Apéndice A, Apéndice B; cada celda "Hogar actual" tiene exactamente un `[[slug]]` sin ancla seguido de `›` y el título del destino (§1.1 → `[[domain]] › Project Overview`, §11 → `[[index]]`) | AC-2, D-6, V-5, T015, T022 |
| UT-021 | Unit | Redirección inválida es detectada | Variante con una fila con dos wikilinks, un ancla (`[[vision#…]]`) o un párrafo explicativo | Se aplica la verificación V-5 | La verificación falla: `grep -o "\[\[" \| wc -l` ≠ 1 en esa fila, o aparece una línea no vacía que no empieza por `\|`; con ancla, `check` reporta `broken-wikilink` | AC-2, D-6, V-5 |
| UT-022 | Unit | Runbook retirado sin tocar historial | `docs/runbooks/actualizar-spec-de-proyecto.md` existe | Se ejecuta `git rm` (T017) | `test ! -e docs/runbooks/actualizar-spec-de-proyecto.md` termina con éxito; `runbooks/README.md` y `CHANGELOG.md` no aparecen en `git diff` | AC-2, D-7, V-6, T017, T020 |
| UT-023 | Unit | Puntero de `AGENTS.md` actualizado | `AGENTS.md:13` contiene `` (ver `docs/specs/01-projects/PROJ-01-agile-sddf/`) `` | Se edita (T018) | La línea contiene `` (ver `docs/specs/02-epics/` y `docs/specs/03-stories/`) `` y el resto de la frase no cambia; `grep -n "01-projects" AGENTS.md` no devuelve esa línea | AC-1, D-7, T018 |
| UT-024 | Unit | Codificación UTF-8 sin BOM | Archivos creados o modificados por la historia | Se leen los tres primeros bytes y se busca mojibake (T025) | Ninguno empieza con `EF BB BF`; `grep -lE "Ã\|ðŸ"` sobre `vision.md`, `roadmap.md`, `proj-01-agile-sddf.md`, `ux-ui.md`, `architecture/README.md`, `tech-stack.md`, `domain.md`, `index.md`, `AGENTS.md` y `reubicacion-report.md` devuelve vacío | CNF-1, V-9, T025 |
| IT-001 | Integration | Línea base de `memory-system check` registrada | Repositorio antes de cualquier cambio de la historia | Se ejecuta `node skills/memory-system/scripts/memory-system.js check --root docs` (T002) | La salida queda en `.tmp/story-implement/STORY-123/check-before.txt`; el informe registra total, desglose y `broken-wikilink` por destino, y anota la diferencia si no coincide con `problemas: 56 (orphan 7 · broken-wikilink 49)` | AC-2, CR-002, D-8 paso 2, T002 |
| IT-002 | Integration | `check` posterior sin wikilinks rotos atribuibles a la historia | Cierre e índice aplicados | Se ejecuta `memory-system check --root docs` y se guarda `check-after.txt` (T023) | 0 líneas `broken-wikilink` con destino `[[PROJ-01-agile-sddf]]` o `[[runbook-actualizar-spec-de-proyecto]]`, o con ruta `product/vision.md`, `product/roadmap.md`, `product/proj-01-agile-sddf.md`, `architecture/ux-ui.md`, `architecture/tech-stack.md` o `domains/domain.md`; total de `broken-wikilink` ≤ línea base de IT-001 | AC-2, CR-002, V-7, T023 |
| IT-003 | Integration | Enlaces entrantes resuelven por la redirección sin editarse | ADR-0006, `story-map.md`, los 14 `epic.md` e `index.md` enlazan `[[PROJ-01-agile-sddf]]` | Se ejecuta `check` tras el cierre y `git diff --name-only` | Ningún `broken-wikilink` en esos archivos hacia `[[PROJ-01-agile-sddf]]`; ADR-0006, `story-map.md` y los `epic.md` no aparecen en `git diff` (Non-Goals; ADR inmutable) | AC-2, D-6, F-3, Non-Goals |
| IT-004 | Integration | Wikilinks de los documentos nuevos resuelven | `ux-ui.md`, la redirección y las notas D-2 citan `[[sddf-architecture]]`, `[[state-machine]]`, `[[tech-stack]]`, `[[vision]]`, `[[roadmap]]`, `[[domain]]`, `[[stakeholders]]`, `[[requirements-index]]`, `[[index]]` y `[[eliminar-specs-01-projects]]` | Se ejecuta `check` y `grep "^slug:"` sobre `docs/` | Cada slug citado existe en un único nodo escaneado; `check` no reporta `broken-wikilink` con origen en esos documentos | AC-2, D-1, D-6, V-7 |
| IT-005 | Integration | Regeneración del índice | Cierre aplicado (T015–T018) | Se ejecuta `memory-system index --root docs` (T019) | En `docs/index.md` desaparecen las entradas de `project.md` y `[[runbook-actualizar-spec-de-proyecto]]` y aparecen `[[PROJ-01-agile-sddf]]` bajo `product/` y `[[ux-ui]]` bajo `architecture/`; el informe registra el diff ajeno (incluida la entrada de `STORY-103-…/epic-template.md`) y la sección vacía `### L3 — Proyecto (specs/01-projects/)` para STORY-115, sin corregirlos | AC-2, D-7, D-8 paso 7, T019 |
| IT-006 | Integration | Redirección y borrado en el mismo cambio | Implementación completa | Se inspecciona el commit o el cambio preparado (`git diff --cached --name-status`) | La creación de `docs/product/proj-01-agile-sddf.md` y el borrado de `project.md` van en el mismo cambio; en ningún estado intermedio versionado dos documentos declaran `slug: PROJ-01-agile-sddf` | AC-2, D-6, D-8 paso 6, T015, T016 |
| IT-007 | Integration | Informe final consolidado y fuera del escaneo | V-1…V-9 ejecutadas (T020–T025) | Se completa `## Verificación final` (T026) y se ejecuta `check`/`index` | El informe registra el resultado de V-1…V-9, la comparación `check-after.txt` frente a `check-before.txt` y el diff ajeno de `index.md`; `reubicacion-report.md` no aparece en `docs/index.md` ni en la salida de `check` (derivado excluido por `isExcludedFile`) | AC-1, AC-2, CNF-1, D-8 paso 8, T026 |

## Notas de cobertura

- `tasks.md` se usó para enriquecer la columna Ref (`T-NNN`) y para concretar ubicaciones, recuentos y comandos de cada caso.
- Cada escenario Gherkin genera un E2E trazable 1-a-1: AC-1 → E2E-001, AC-2 → E2E-002, AC-3 → E2E-003.
- La historia es un `chore` de documentación sin código: los UT verifican contratos estructurales de un único artefacto (frontmatter, secciones, recuentos, literalidad) y los IT verifican la integración entre documentos y `memory-system` (`check`, `index`, resolución de wikilinks). No hay componentes UI, endpoints, stores, contratos entre sistemas ni skills como sujeto de validación: CT, API, ST, PT, CON y EV no aplican.
- **CR-002:** AC-2 pide literalmente que `memory-system check` "no reporte `broken-wikilink`", inalcanzable hoy por 49 enlaces rotos ajenos (32 de ellos a `[[ADR-0013-eliminar-specs-01-projects]]`). E2E-002 e IT-002 lo verifican con la interpretación V-7 del diseño (0 rotos atribuibles a la historia y total ≤ línea base). Si el PO reformula AC-2 o la corrección de esos enlaces precede a esta historia, el umbral de IT-002 pasa a 0.
- **AC-3 (E2E-003, UT-006):** con la tabla del Context no se espera ninguna sección `SIN HOGAR`; el caso se valida por revisión del procedimiento o en una copia de trabajo, sin forzarlo en el repositorio real (V-8).
- **Precondición:** al 2026-10-09 STORY-104…107 no están implementadas, por lo que UT-001 fallaría y aplica UT-002 (detención sin escritura). Los recuentos de líneas e ítems de los casos provienen del diseño y deben recalcularse sobre el `project.md` vigente al implementar (T004).
- **CR-003:** los datos desfasados del contenido trasladado se conservan literalmente; UT-017 verifica que no se "corrijan" durante la migración.

## Test Cases Progress for STORY-123

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: Secciones reubicadas y `01-projects/` eliminada
- [ ] E2E-002: Redirección y sin wikilinks rotos
- [ ] E2E-003: Sección sin hogar bloquea el borrado
- [ ] UT-001: Precondición de AC-1 satisfecha
- [ ] UT-002: Precondición de AC-1 incumplida
- [ ] UT-003: Esquema del informe de reubicación
- [ ] UT-004: Tabla `## Secciones` completa y con decisiones válidas
- [ ] UT-005: Descartes justificados
- [ ] UT-006: Sección nueva no prevista en el diseño
- [ ] UT-007: `vision.md` con §1.2–1.7 como contenido vigente
- [ ] UT-008: Intención de abril pasa a histórica en `vision.md`
- [ ] UT-009: Encabezado esperado ausente en `vision.md` o `roadmap.md`
- [ ] UT-010: `ux-ui.md` creado con §2.3 y §3
- [ ] UT-011: `architecture/README.md` registra `ux-ui.md` sin otros cambios
- [ ] UT-012: Anexo histórico de §4.1 en `tech-stack.md`
- [ ] UT-013: Glosario detallado de §12 en `domain.md`
- [ ] UT-014: Apéndices A y B en `roadmap.md`
- [ ] UT-015: Nota de origen en cada bloque trasladado
- [ ] UT-016: Recuento de ítems origen = destino
- [ ] UT-017: Diferencia de recuento o reescritura detectada
- [ ] UT-018: Gate sin secciones `SIN HOGAR` habilita el cierre
- [ ] UT-019: Frontmatter de la redirección
- [ ] UT-020: Cuerpo de la redirección: solo tabla, 20 filas
- [ ] UT-021: Redirección inválida es detectada
- [ ] UT-022: Runbook retirado sin tocar historial
- [ ] UT-023: Puntero de `AGENTS.md` actualizado
- [ ] UT-024: Codificación UTF-8 sin BOM
- [ ] IT-001: Línea base de `memory-system check` registrada
- [ ] IT-002: `check` posterior sin wikilinks rotos atribuibles a la historia
- [ ] IT-003: Enlaces entrantes resuelven por la redirección sin editarse
- [ ] IT-004: Wikilinks de los documentos nuevos resuelven
- [ ] IT-005: Regeneración del índice
- [ ] IT-006: Redirección y borrado en el mismo cambio
- [ ] IT-007: Informe final consolidado y fuera del escaneo
