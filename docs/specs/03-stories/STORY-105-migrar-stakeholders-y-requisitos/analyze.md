---
type: analyze
id: STORY-105
slug: STORY-105-analyze-report
title: "Analyze: Migrar project.md a product/stakeholders.md y requirements/"
story: STORY-105
design: STORY-105
tasks: STORY-105
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-105-migrar-stakeholders-y-requisitos
---

<!-- Referencias -->
[[STORY-105-migrar-stakeholders-y-requisitos]]

# Reporte de Coherencia: Migrar project.md a product/stakeholders.md y requirements/

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1, CNF-2 y CNF-3) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — `testcases.md` no presente (pipeline `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 15/15 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 elementos con tarea (9 componentes + 6 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Listada y alineada; 2 advertencias (INC-001, INC-002) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Perfiles US-001…US-006 en `stakeholders.md › Usuarios y roles`; las otras dos secciones conservan su marcador | ✓ | D-5, contratos #1–#2 |
| AC-2 | 53 FR + 24 NFR, un archivo por requisito con el ID original y sus campos; sin `FR-049-*` | ✓ | D-1, D-2, D-3, D-4, Esquema de datos, contratos #3–#6; diferencia de campos FR/NFR resuelta en CR-001 |
| AC-3 | §1.8, §2.1 y §2.2 de `project.md` sustituidas por `[[stakeholders]]`/`[[requirements-index]]`, sin duplicación; `check` limpio en `product/` y `requirements/` | ✓ | D-7, D-9, contratos #7–#9 |
| CNF-1 | Traslado literal, solo cambia el contenedor | ✓ | D-2 (regla de literalidad), D-4 (verificador independiente), D-5 |
| CNF-2 | README navega a los 77 por categoría; `docs/index.md` regenerado sin enlaces rotos | ✓ | D-6, D-8, contratos #10, #11, #13 |
| CNF-3 | UTF-8 sin BOM, sin mojibake | ✓ | D-4, contrato #12 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base de `check` | D-9, contrato #9 | ✓ |
| T002 | Crear el migrador desechable | D-2, D-3, D-4; interfaz `migrate-requirements.js` | ✓ |
| T003 | Ejecutar el migrador (53 + 24 archivos) | D-1, D-4; componentes de requisitos | ✓ |
| T004 | Crear y ejecutar el verificador independiente | D-4; interfaz `verify-requirements.js`; contratos #4–#6 | ✓ |
| T005 | Perfiles en `stakeholders.md` | D-5 | ✓ |
| T006 | Índice en `requirements/README.md` | D-6 | ✓ |
| T007 | Gate previo a editar `project.md` | D-9 | ✓ |
| T008 | Sustituir §1.8, §2.1, §2.2 en `project.md` | D-7 | ✓ |
| T009 | Neutralizar comentarios del borrador de STORY-103 | D-8, CR-003 | ✓ |
| T010 | Regenerar `docs/index.md` | D-8 | ✓ |
| T011 | Verificar AC-1 | Contratos #1–#2 | ✓ |
| T012 | Verificar AC-2 | Contratos #3–#6 | ✓ |
| T013 | Verificar AC-3 | Contratos #7–#9 | ✓ |
| T014 | Verificar CNF-2 y borrador | Contratos #10, #11, #13 | ✓ |
| T015 | Verificar CNF-3 | Contrato #12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Requisitos funcionales (53) | Componentes afectados, D-2 | T002, T003 | ✓ |
| Requisitos no funcionales (24) | Componentes afectados, D-2 | T002, T003 | ✓ |
| Índice de requisitos (`requirements/README.md`) | D-6 | T006 | ✓ |
| Stakeholders (`product/stakeholders.md`) | D-5 | T005 | ✓ |
| Especificación PROJ-01 (`project.md`) | D-7 | T008 | ✓ |
| Índice de documentación (`docs/index.md`) | D-8 | T010 | ✓ |
| Borrador de template de STORY-103 | D-8 | T009 | ✓ |
| Migrador desechable | D-4 | T002 | ✓ |
| Verificador desechable | D-4 | T004 | ✓ |
| Nombre de archivo de requisito | Interfaces, D-3 | T002, T012 | ✓ |
| Frontmatter de requisito | Interfaces, D-2 | T002, T004 | ✓ |
| Cuerpo de requisito | Interfaces, D-2 | T002, T004 | ✓ |
| Wikilinks de destino | Interfaces, D-6, D-7 | T006, T008, T013, T014 | ✓ |
| `migrate-requirements.js` | Interfaces | T002, T003 | ✓ |
| `verify-requirements.js` | Interfaces | T004, T012 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `## Historias`: `- [ ] **STORY-105** — Migrar project.md a product/stakeholders.md y requirements/ …` |
| Objetivo de la historia alineado con la épica | ✓ | La épica pide "repartir stakeholders y requisitos funcionales/no funcionales en sus nuevos hogares, sin pérdida semántica" y el criterio de salida "`docs/requirements/` contiene `functional/` y `non-functional/` poblados"; D-1…D-5 lo cumplen. Coherente con STORY-110 (los IDs nuevos continúan en FR-055, sin renumerar) |
| Restricciones de la épica respetadas | ⚠️ | Coherencia con STORY-118 pendiente (INC-001) y cambio fuera del alcance declarado de la historia (INC-002) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — desalineación con la épica (historia hermana STORY-118)
- **Descripción:** `docs/requirements/README.md` (sección "Disposición 2 — Fragmentado") prescribe un `requirements/index.md`
  regenerado por `memory-system index` y la resolución corta `[[FR-001]]`. `design.md` › D-1 y D-6 usan en cambio `README.md`
  (`[[requirements-index]]`) como índice y wikilinks con slug completo, tal como piden AC-3 y CNF-2 de `story.md`. Tras esta
  historia el README describirá una estructura (`index.md`) distinta de la que realmente tiene la capa.
- **Archivo afectado:** `design.md` — "D-1" y "CR-002"; `docs/requirements/README.md` — "Disposición 2 — Fragmentado".
- **Acción requerida:** confirmar que STORY-118 adopta `README.md` como índice de la disposición fragmentada (o al revés) y dejarlo
  anotado en las Notas de STORY-118 antes de su planning.

### INC-002 [WARNING]

- **Tipo:** D — restricción de alcance
- **Descripción:** `design.md` › D-8 y `tasks.md` › T009 modifican `docs/specs/03-stories/STORY-103-replace-the-epic-template/epic-template.md`,
  un artefacto de una historia cerrada que `story.md` no menciona. Es el cambio mínimo para que la regeneración de `docs/index.md`
  (CNF-2) no rompa `npm run verify:repository`, pero amplía el alcance de la historia y deja la causa raíz (parser de comentarios
  YAML de `memory-system`, CR-003) sin resolver.
- **Archivo afectado:** `design.md` — "D-8"; `tasks.md` — T009.
- **Acción requerida:** confirmar la mitigación de D-8, o bien corregir antes el parser de `memory-system` en una historia propia y
  eliminar T009.

### INC-003 [WARNING]

- **Tipo:** F — AC sin caso de prueba en testcases.md (no evaluable)
- **Descripción:** pipeline ejecutado con `--only-tasks`; no existe `testcases.md`. La verificación de AC-1…AC-3 está cubierta por
  T011–T015, el verificador desechable de T004 y los contratos #1–#13.
- **Archivo afectado:** directorio de la historia — `testcases.md` ausente.
- **Acción requerida:** ninguna obligatoria; `/story-testcases STORY-105` solo si se quiere implementar vía `/story-implement`.

---

## Recomendaciones

1. **INC-001:** añadir en `story.md` de STORY-118 (Notas) que la capa fragmentada de este repo usa `README.md` como índice, para que
   su diseño decida entre conservarlo o introducir `index.md` y migrar los enlaces `[[requirements-index]]`.
2. **INC-002:** decidir antes de `/story-implement-tasks` entre (a) mantener T009 tal cual o (b) abrir una historia para que
   `memory-system` descarte comentarios `#` en línea en el frontmatter y, una vez hecha, eliminar T009 y la parte de D-8 que la
   justifica.
3. **CR-001 de `design.md`:** precisar en `story.md` › AC-2 que los NFR conservan `Criterio de aceptación` en lugar de usuario y
   fuente.
4. **INC-003:** opcional — `/story-testcases STORY-105`.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-105` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-105` |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` · `enforcement: error` · 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 (principales) y AC-3 (alternativo) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla de cobertura: AC-1…AC-3 con D-1…D-9 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Encabezados D-1…D-9 con `// satisface:`; columnas AC en Componentes, Interfaces y Contratos |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | `Open Questions: Ninguna`; CR-001…CR-003 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 15 tareas acotadas; AC-1 (T005, T011), AC-2 (T002–T004, T012), AC-3 (T007–T008, T013) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe |
