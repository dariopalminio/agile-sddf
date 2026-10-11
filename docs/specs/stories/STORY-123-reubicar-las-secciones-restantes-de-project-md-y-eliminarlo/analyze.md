---
type: analyze
id: STORY-123
slug: STORY-123-analyze-report
title: "Analyze: Reubicar las secciones restantes de project.md y eliminarlo"
story: STORY-123
design: STORY-123
testcases: STORY-123
tasks: STORY-123
created: 2026-10-09
updated: 2026-10-09
related:
  - STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo
---

<!-- Referencias -->
[[STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo]]

# Reporte de Coherencia: Reubicar las secciones restantes de `project.md` y eliminarlo

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba (E2E-001…003, 1-a-1) |
| Alineación tareas → diseño | ✓ | 26/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 12/12 componentes y 5/5 interfaces con tarea |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Listada y alineada; la historia usa también `domains/`, que el Alcance de la épica no nombra |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR · 4 WARNING)

Verificaciones hechas sobre el repositorio el 2026-10-09: los encabezados de `project.md` (líneas 25–1232, 1264 líneas) coinciden con las 19 filas de la tabla del Context de design.md; `memory-system check --root docs` devuelve `problemas: 56 (orphan 7 · broken-wikilink 49)`, igual que la línea base de design.md; los slugs `vision`, `tech-stack`, `domain`, `stakeholders`, `requirements-index`, `sddf-architecture`, `state-machine`, `index` y `eliminar-specs-01-projects` existen; `roadmap` (STORY-106) y `ux-ui` (esta historia) aún no.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Secciones reubicadas y `01-projects/` eliminada | ✓ | Goals (líneas 109–111); tabla del Context (líneas 54–76); D-1, D-2, D-3, D-4, D-5, D-8 (`// satisface: AC-1`); componentes "Visión del producto", "UX/UI", "Stack", "Contexto de dominio", "Roadmap", "Especificación de proyecto (eliminar)"; V-1, V-2 |
| AC-2 | Redirección y sin wikilinks rotos | ✓ (con reinterpretación, ver INC-001) | D-6 (redirección `docs/product/proj-01-agile-sddf.md`), D-7 (runbook e índice), D-8 paso 6; interfaces "Wikilink → slug", "Redirección", `memory-system check`/`index`; V-4…V-7; CR-002 |
| AC-3 | Sección sin hogar bloquea el borrado | ✓ | D-8 paso 3 y paso 5 (gate `SIN HOGAR`), flujo F-2, V-8 |
| CNF-1 | Sin pérdida semántica | ✓ | D-1 (copia literal), D-2 (nota de origen), Esquema de datos de `reubicacion-report.md`, V-3, V-9, CR-003 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar la precondición de AC-1 | D-8 paso 1 | ✓ |
| T002 | Línea base de `memory-system check` | D-8 paso 2, interfaz `memory-system check`, CR-002 | ✓ |
| T003 | Crear `reubicacion-report.md` con `## Línea base` | Esquema de datos, componente "Informe de reubicación" | ✓ |
| T004 | Tabla `## Secciones` del inventario | D-1, D-8 paso 3, tabla del Context | ✓ |
| T005 | Detectar secciones nuevas o `SIN HOGAR` | D-8 paso 3, D-2…D-5 | ✓ |
| T006 | `vision.md`: intención de abril como histórica | D-2, D-3 | ✓ |
| T007 | `vision.md`: §1.2–1.7 como vigente | D-2, D-3, CR-001 | ✓ |
| T008 | Crear `architecture/ux-ui.md` | D-4, componente "UX/UI del framework" | ✓ |
| T009 | Registrar `ux-ui.md` en `architecture/README.md` | D-4, componente "Índice de arquitectura" | ✓ |
| T010 | Anexo histórico §4.1 en `tech-stack.md` | D-5, componente "Stack tecnológico" | ✓ |
| T011 | Glosario detallado §12 y línea 34 de `domain.md` | D-5, componente "Contexto de dominio" | ✓ |
| T012 | Apéndices A y B en `roadmap.md` | D-5, componente "Roadmap" | ✓ |
| T013 | Recuento de ítems origen = destino | D-8 paso 4, V-3 | ✓ |
| T014 | Gate de sección sin hogar | D-8 paso 5, F-2 | ✓ |
| T015 | Crear la redirección `proj-01-agile-sddf.md` | D-6, interfaz "Redirección" | ✓ |
| T016 | `git rm project.md` y carpetas | D-8 paso 6a, componente "Especificación de proyecto" | ✓ |
| T017 | `git rm` del runbook | D-7, componente "Runbook de resincronización" | ✓ |
| T018 | Paréntesis de `AGENTS.md:13` | D-7, componente "Instrucciones raíz" | ✓ |
| T019 | Regenerar `docs/index.md` | D-7, D-8 paso 7, interfaz `memory-system index` | ✓ |
| T020 | Verificar V-1 y V-6 | Contratos de verificación | ✓ |
| T021 | Verificar V-2 y V-3 | Contratos de verificación | ✓ |
| T022 | Verificar V-4 y V-5 | Contratos de verificación | ✓ |
| T023 | Verificar V-7 | Contratos de verificación, CR-002 | ✓ |
| T024 | Verificar V-8 (rama AC-3) | Contratos de verificación, F-2 | ✓ |
| T025 | Verificar V-9 (codificación) | Contratos de verificación | ✓ |
| T026 | `## Verificación final` del informe | D-8 paso 8, Esquema de datos | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Informe de reubicación | Componentes afectados; Esquema de datos | T003, T004, T005, T013, T026 | ✓ |
| Visión del producto | Componentes afectados; D-3 | T006, T007 | ✓ |
| UX/UI del framework | Componentes afectados; D-4 | T008 | ✓ |
| Índice de arquitectura | Componentes afectados; D-4 | T009 | ✓ |
| Stack tecnológico | Componentes afectados; D-5 | T010 | ✓ |
| Contexto de dominio | Componentes afectados; D-5 | T011 | ✓ |
| Roadmap | Componentes afectados; D-5 | T012 | ✓ |
| Redirección `PROJ-01-agile-sddf` | Componentes afectados; D-6 | T015 | ✓ |
| Especificación de proyecto (eliminar) | Componentes afectados; D-8 paso 6 | T016 | ✓ |
| Runbook de resincronización (eliminar) | Componentes afectados; D-7 | T017 | ✓ |
| Índice de la memoria (regenerar) | Componentes afectados; D-7 | T019 | ✓ |
| Instrucciones raíz (`AGENTS.md`) | Componentes afectados; D-7 | T018 | ✓ |
| Interfaz "Wikilink → slug" | Interfaces | T015, T023 | ✓ |
| Interfaz "Redirección" | Interfaces; D-6 | T015, T022 | ✓ |
| Interfaz "Nota de origen" | Interfaces; D-2 | T006, T007, T008, T010, T011, T012 | ✓ |
| Interfaz `memory-system check` | Interfaces | T002, T023 | ✓ |
| Interfaz `memory-system index` | Interfaces | T019 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 50: `**STORY-123** — Reubicar las secciones restantes de project.md y eliminarlo` |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" cubre el criterio de salida de `epic.md` línea 54 (`docs/specs/01-projects/` no existe) y el orden previo a STORY-108 (línea 39) |
| Restricciones de la épica respetadas | ⚠️ | El Alcance (línea 25) migra a `product/`, `requirements/` y `architecture/`; la historia (AC-1) y el diseño (D-5) usan también `domains/` (§12 y descarte de §1.1). Ver INC-002 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** A (AC cubierto con reinterpretación; degradado a WARNING por regla de duda)
- **Descripción:** AC-2 exige literalmente que `memory-system check` "no reporte `broken-wikilink`". La línea base medida hoy es `broken-wikilink 49`, ajenos a la historia, y uno de ellos está en el propio `story.md` (línea 21, `[[ADR-0013-eliminar-specs-01-projects]]`; el slug real es `eliminar-specs-01-projects`). El diseño lo cubre con la interpretación V-7 (0 rotos atribuibles y total ≤ línea base), registrada como CR-002, pero story.md no se ha reformulado.
- **Archivo afectado:** story.md — sección "AC-2 — Escenario de cierre"; design.md — "Registro de Cambios (CR)" › CR-002
- **Acción requerida:** decisión del PO: reformular el último `Y` de AC-2 según V-7, o hacer que la corrección de los wikilinks a ADR-0013 (incluido el de story.md línea 21) preceda a esta historia.

### INC-002 [WARNING]

- **Tipo:** D
- **Descripción:** El Alcance de EPIC-21 nombra como destinos `product/`, `requirements/` y `architecture/`; la historia admite además `domains/`, y el diseño lleva allí §12 (glosario detallado) y el descarte de §1.1. No viola ningún criterio de salida, pero el Alcance queda incompleto.
- **Archivo afectado:** epic.md — sección "Alcance" (línea 25); story.md — AC-1; design.md — D-5
- **Acción requerida:** añadir `domains/` al Alcance de la épica o aceptar la desviación explícitamente.

### INC-003 [WARNING]

- **Tipo:** D (nota de story.md contradicha por design.md)
- **Descripción:** Las Notas de story.md ("Secciones a reubicar") proponen que §1.2–1.7 "ya están en `product/vision.md` por STORY-104" y que `docs/index.md` sustituye al Apéndice A. design.md (Context y CR-001) demuestra que ambas suposiciones son falsas y las trata como reubicaciones (D-3, D-5). La nota sigue sin corregir y podría inducir un descarte con pérdida.
- **Archivo afectado:** story.md — sección "Notas / contexto adicional" › "Secciones a reubicar"
- **Acción requerida:** corregir la nota según CR-001 (sin cambiar los AC).

### INC-004 [WARNING]

- **Tipo:** D (dependencia de orden de la épica)
- **Descripción:** La precondición de AC-1 no se cumple hoy: `docs/specs/01-projects/PROJ-01-agile-sddf/` contiene 5 archivos (`project.md`, `project-intent.md`, `project-plan.md`, `story-map.md`, `context-diagram.puml`) y STORY-104…107 están en `READY-FOR-IMPLEMENT/DONE`, no implementadas. T001 detendrá la implementación sin escribir hasta que se completen. `docs/product/roadmap.md` (destino de T012) tampoco existe aún.
- **Archivo afectado:** tasks.md — T001; design.md — "Risks / Trade-offs" (primer ítem)
- **Acción requerida:** implementar STORY-104…107 antes de iniciar `/story-implement STORY-123` o `/story-implement-tasks STORY-123`.

---

## Recomendaciones

1. (INC-001) Pedir al PO que reformule en story.md AC-2 el paso `Y "memory-system check" no reporta "broken-wikilink"` como "no reporta `broken-wikilink` hacia slugs retirados ni en los documentos tocados, y el total no supera la línea base", o planificar antes la corrección de los 36 wikilinks `[[ADR-0013-eliminar-specs-01-projects]]`; en este último caso, bajar a 0 el umbral de V-7, T023 e IT-002.
2. (INC-002) Añadir `domains/` a la frase de destinos de `epic.md` › "Alcance".
3. (INC-003) Editar story.md › Notas › "Secciones a reubicar": §1.2–1.7 se reubican en `vision.md` como vigente y el Apéndice A va a `roadmap.md` (CR-001).
4. (INC-004) Mantener el orden STORY-104…107 → STORY-123 → STORY-108 y no iniciar la implementación hasta que T001 pase. Al implementar, recalcular líneas e ítems (T004) y la línea base (T002); hoy `check` registra 36 líneas `[[ADR-0013-eliminar-specs-01-projects]]`, frente a las 32 que cita design.md.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Secciones reubicadas y `01-projects/` eliminada | ✓ | E2E-001; UT-001…UT-018, UT-023 |
| AC-2 | Redirección y sin wikilinks rotos | ✓ | E2E-002; UT-019…UT-022; IT-001…IT-006 |
| AC-3 | Sección sin hogar bloquea el borrado | ✓ | E2E-003; UT-006 |
| CNF-1 | Sin pérdida semántica | ✓ | UT-015, UT-016, UT-017, UT-024, IT-007 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-123` |
| tasks.md | ✓ | `/story-implement-tasks STORY-123` |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), resuelto vía `sddf.config.yaml › guardrails.dod.story.plan`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (cierre), AC-3 (error) en bloques `gherkin` Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Componentes afectados" y D-1…D-8; ver "Cobertura de Criterios de Aceptación" |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-8 con `// satisface:`; tablas de componentes, interfaces y contratos con columna "AC que satisface"/"AC origen" |
| No hay decisiones de arquitectura aplazadas | ✓ | — | "Open Questions: Ninguna"; ambigüedades en CR-001…CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Ambos presentes |
| Si tasks.md existe, solo tareas atómicas para todos los escenarios principales | ✓ | — | T001–T026, una acción verificable cada una; AC-1 (T001–T016, T018), AC-2 (T015–T019, T022–T023), AC-3 (T005, T014, T024) |
| Si testcases.md existe, pruebas definidas para todos los escenarios principales | ✓ | — | E2E-001/002/003 mapeados 1-a-1 con AC-1/2/3 |
