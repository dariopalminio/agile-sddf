---
type: analyze
id: STORY-104
slug: STORY-104-analyze-report
title: "Analyze: Migrar project-intent.md a product/vision.md"
story: STORY-104
design: STORY-104
tasks: STORY-104
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-104-migrar-project-intent-a-vision
---

<!-- Referencias -->
[[STORY-104-migrar-project-intent-a-vision]]

# Reporte de Coherencia: Migrar project-intent.md a product/vision.md

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — `testcases.md` no presente (pipeline `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 15/15 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 9/9 elementos con tarea (5 componentes + 4 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Listada y alineada; 1 advertencia de coherencia con STORY-109 (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | La visión consolida las seis secciones de origen, sin `[Por completar`, conservando `type: product` y `slug: vision` | ✓ | D-1 (correspondencia de secciones), D-2 (frontmatter), Esquema de datos, contratos #1–#4 |
| AC-2 | `Criterios de Éxito` en sección propia; ningún ítem de criterios, restricciones ni non-goals omitido o resumido | ✓ | D-1 (sección nueva `## Criterios de éxito`, regla de copia literal), contratos #4–#5 |
| AC-3 | Original eliminado, sin `[[PROJ-01-agile-sddf-project-intent]]` fuera de `03-stories/`, referencias a `[[vision]]`, `check` sin wikilinks rotos | ✓ | D-3 (`index.md`), D-4 (`project.md`), D-6 (orden y criterio por delta), contratos #6–#10; interpretaciones registradas en CR-001 y CR-002 |
| CNF-1 | `vision.md` declara su origen en ADR-0013 | ✓ | D-2 (nota de trazabilidad con `[[eliminar-specs-01-projects]]`), contrato #11 |
| CNF-2 | UTF-8 sin BOM, sin mojibake | ✓ | Componentes afectados, contrato #12 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Registrar línea base de `memory-system check` | D-6, contrato #9 | ✓ |
| T002 | Frontmatter (`updated`) y nota de trazabilidad en `vision.md` | D-2, CNF-1 | ✓ |
| T003 | `## Problema que resolvemos` ← `Definición del Problema` | D-1 | ✓ |
| T004 | `## Propuesta de valor` ← Visión + Beneficios | D-1 | ✓ |
| T005 | `## Criterios de éxito` (sección nueva) | D-1, AC-2 | ✓ |
| T006 | `## Alcance y límites` ← Restricciones + Non-Goals; UTF-8 sin BOM | D-1, D-2, CNF-2 | ✓ |
| T007 | Retirar línea 75 de `docs/index.md` | D-3 | ✓ |
| T008 | Redirigir las 3 referencias de `project.md` a `vision` | D-4 | ✓ |
| T009 | Corregir puntero en `AGENTS.md:13` | D-5, CR-003 | ✓ |
| T010 | `git rm` de `project-intent.md` | D-6 | ✓ |
| T011 | Verificar AC-1 | Contratos #1–#3 | ✓ |
| T012 | Verificar AC-2 contra `git show HEAD:` | Contratos #4–#5 | ✓ |
| T013 | Verificar AC-3 (borrado, grep, redirecciones) | Contratos #6–#8 | ✓ |
| T014 | Verificar `check` por delta y `check-doc-links.js` | D-6, contratos #9–#10 | ✓ |
| T015 | Verificar CNF-1, CNF-2 y `AGENTS.md` | Contratos #11–#13 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Visión del producto (`docs/product/vision.md`) | Componentes afectados, D-1, D-2 | T002–T006 | ✓ |
| Intención del proyecto (`project-intent.md`, eliminar) | Componentes afectados, D-6 | T010 | ✓ |
| Índice de documentación (`docs/index.md`) | Componentes afectados, D-3 | T007 | ✓ |
| Especificación PROJ-01 (`project.md`) | Componentes afectados, D-4 | T008 | ✓ |
| Instrucciones raíz (`AGENTS.md`) | Componentes afectados, D-5 | T009 | ✓ |
| Slug `vision` | Interfaces | T002, T013 | ✓ |
| Secciones `##` de `vision.md` | Interfaces | T003–T006, T011 | ✓ |
| Wikilink de trazabilidad `[[eliminar-specs-01-projects]]` | Interfaces | T002, T015 | ✓ |
| `memory-system check --root docs` (criterio por delta) | Interfaces | T001, T014 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `## Historias`: `- [ ] **STORY-104** — Migrar project-intent.md a product/vision.md …` |
| Objetivo de la historia alineado con la épica | ✓ | La épica busca "una única fuente de verdad para la visión" y la entrada pide "sin pérdida semántica … y con wikilinks actualizados"; D-1 (copia literal) y D-3/D-4 lo cumplen |
| Restricciones de la épica respetadas | ⚠️ | El criterio de salida "`memory-system check` devuelve exit code 0" es de la épica y no lo alcanza esta historia (línea base de 55 problemas ajenos); el diseño garantiza no empeorarlo (D-6). Ver además INC-001 sobre la coherencia con STORY-109 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — desalineación con la épica (historia hermana)
- **Descripción:** `design.md` › D-2 decide conservar `substatus: TODO` en `vision.md` tras rellenarla ("la capa `product/` no es un work item…", YAGNI). Pero STORY-109 (misma épica), en su AC-1 y AC-2 (`story.md`, líneas 35 y 42–46), convierte el `substatus` de `vision.md` en el estado del proyecto: `TODO` dispara la entrevista completa de `project-begin` sobre una visión vacía y `DONE` significa visión completa. Con `TODO`, cuando STORY-109 esté implementada, `project-begin` trataría la visión ya migrada de este repo como pendiente. Además, la nota de STORY-109 (línea 74) exige que el template de visión coincida con la estructura que STORY-104 deja en `vision.md`; D-1 añade `## Criterios de éxito`, que la semilla de `memory-system` no tiene.
- **Archivo afectado:** `design.md` — sección "D-2 — Frontmatter y nota de trazabilidad de `vision.md`" (alternativa rechazada "Marcar `substatus` como `DONE`") y `tasks.md` — T002.
- **Acción requerida:** decidir antes de implementar si `vision.md` pasa a `substatus: DONE` (recomendado) y dejar constancia en STORY-109/STORY-115 de que la estructura de visión vigente incluye `## Criterios de éxito`.

### INC-002 [WARNING]

- **Tipo:** F — AC sin caso de prueba en testcases.md (no evaluable)
- **Descripción:** el pipeline se ejecutó con `--only-tasks`; no existe `testcases.md`. La verificación de los tres ACs queda cubierta por las tareas T011–T015 y los contratos #1–#13 de `design.md`, pero no hay casos tipificados.
- **Archivo afectado:** directorio de la historia — `testcases.md` ausente.
- **Acción requerida:** ninguna obligatoria; ejecutar `/story-testcases STORY-104` solo si se desea implementar vía `/story-implement`.

---

## Recomendaciones

1. **INC-001:** en `design.md` › D-2 cambiar la decisión a `substatus: DONE` (manteniendo `status` y el resto del frontmatter) y moverla de "alternativas rechazadas" a la decisión; actualizar T002 de `tasks.md` y el "Esquema de datos" en consecuencia. Añadir en las Notas de STORY-109 (o STORY-115) que la estructura de `vision.md` tras STORY-104 tiene cuatro secciones `##`, incluida `Criterios de éxito`.
2. **INC-002:** opcional — `/story-testcases STORY-104` para habilitar `/story-implement`; con `tasks.md` ya está habilitado `/story-implement-tasks`.
3. **CR-001 / CR-002 de `design.md`** (no bloqueantes, ya registrados): precisar en `story.md` › AC-3 que en `index.md` basta retirar la entrada (la de `[[vision]]` ya existe) y que "sin wikilinks rotos" se mide respecto de la línea base; abrir una historia o tarea aparte para corregir `[[ADR-0013-eliminar-specs-01-projects]]` → `[[eliminar-specs-01-projects]]` en las historias de EPIC-21.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-104` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-104` |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` · `enforcement: error` · 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo), AC-3 (cierre) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla de cobertura: AC-1…AC-3 con D-1…D-6 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Encabezados D-1…D-6 con `// satisface:`; tablas de Componentes e Interfaces con columna AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | `Open Questions: Ninguna`; CR-001…CR-003 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 15 tareas acotadas a un archivo o una verificación; AC-1 (T002–T006, T011), AC-2 (T005, T012), AC-3 (T007–T010, T013–T014) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe |
