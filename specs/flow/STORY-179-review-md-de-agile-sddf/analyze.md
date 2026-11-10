---
type: analyze
id: STORY-179
slug: STORY-179-analyze-report
title: "Analyze: REVIEW.md de agile-sddf"
story: STORY-179
design: STORY-179
testcases: STORY-179
tasks: STORY-179
verdict: APPROVED
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-179-review-md-de-agile-sddf
---

<!-- Referencias -->
[[STORY-179-review-md-de-agile-sddf]]

# Reporte de Coherencia: REVIEW.md de agile-sddf

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1 a CNF-4) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba (E2E-001 a E2E-003, más UT/IT) |
| Alineación tareas → diseño | ✓ | 13/13 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 7/7 elementos con tarea (C-1, C-2, I-1 a I-5) |
| Alineación con la épica EPIC-28 | ✓ | Listada en `## Historias`; cubre la parte de `REVIEW.md` de CS-1 |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `REVIEW.md` con las cuatro secciones en orden, sin placeholders ni comentarios, una viñeta por área, tope de 5 LOW y sin sección de formato | ✓ | C-1, I-1, I-2, D-1, D-2, Esquema de datos, C-2 (aserciones 1-3) |
| AC-2 | Cada una de las siete reglas del repo en una sola sección, la indicada | ✓ | I-4, D-2, D-3 (tabla de marcadores), D-4, D-5, C-2 (aserción 4) |
| AC-3 | «Verificar siempre» sin lo que ya ejecuta el gate, «No reportar» excluye lo que el gate comprueba y toda ruta citada existe | ✓ | D-4 (viñeta 1), D-5, D-8, I-5, C-2 (aserción 6), CR-002 |
| CNF-1 | Doble vocabulario en cada sección | ✓ | I-3, D-5, C-2 (aserción 5), CR-001 |
| CNF-2 | Sin cuarta raíz y sin publicación | ✓ | Non-Goals, C-2 (aserción 7), contrato 9 |
| CNF-3 | Español, UTF-8 sin BOM, sin caracteres invisibles | ✓ | D-6, C-2 (aserción 8), contrato 10 |
| CNF-4 | Gate verde | ✓ | D-7, F-1, contrato 11 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Estado de partida y ADR-0021 | Context, F-1 paso 1, F-3, CR-001 | ✓ |
| T002 | Crear `test/review-md.test.js` (RED) | C-2, D-7, D-8, I-1 a I-5 | ✓ |
| T003 | Copiar la plantilla y fijar el H1 | C-1, I-1, D-1 | ✓ |
| T004 | «Qué es «Importante» aquí» | C-1, I-2, D-2, D-3 | ✓ (ver INC-001 e INC-002) |
| T005 | «Tope de Minor» | C-1, D-1 | ✓ (ver INC-001) |
| T006 | «No reportar» | C-1, D-4, D-3 | ✓ |
| T007 | «Verificar siempre» | C-1, D-5, D-3 | ✓ (ver INC-002) |
| T008 | Restricciones de redacción | D-6, I-3 | ✓ |
| T009 | Prueba en verde | C-2; contratos 1-4, 7-10 | ✓ |
| T010 | Revisión manual contra el gate | D-5; contratos 5, 6 | ✓ |
| T011 | `npm pack` y bytes | Contratos 9, 10 | ✓ |
| T012 | `npm test` y `verify:repository` | Contrato 11, F-3 | ✓ |
| T013 | Alcance acotado | Contrato 12, Non-Goals | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Guía de revisión (`REVIEW.md`) | Componentes afectados | T003-T008 | ✓ |
| C-2 Prueba de forma (`test/review-md.test.js`) | Componentes afectados | T002, T009 | ✓ |
| I-1 Estructura | Interfaces | T003, T002 (aserción 1) | ✓ |
| I-2 Viñetas por área | Interfaces | T004, T002 (aserción 2) | ✓ |
| I-3 Doble vocabulario | Interfaces | T005-T008, T002 (aserción 5) | ✓ |
| I-4 Marcadores de AC-2 | Interfaces | T004, T006, T007, T002 (aserción 4) | ✓ |
| I-5 Ruta citada | Interfaces | T002 (aserción 6) | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-28-calibrar-story-code-review-con-review-md

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › `## Historias`, entrada STORY-179 |
| Objetivo de la historia alineado con la épica | ✓ | Responde al objetivo de la épica («reporte lo que de verdad importa… y no bloquee por ruido») y cubre la parte de `REVIEW.md` de CS-1 |
| Restricciones de la épica respetadas | ✓ | `REVIEW.md` en la raíz sin cuarta raíz (Notas (c)); no se publica (`## Notas › Publicación`); el vocabulario es el de `## Notas › Vocabulario`; sin evals porque no cambia el comportamiento de ningún skill (`## Notas › Evals`) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E — criterio DoD PLAN «toda ambigüedad técnica está resuelta» (evaluado ⚠️)
- **Descripción:** I-3 (design.md, `## Interfaces`) y la aserción 5 de D-7 exigen que «ningún término aparece sin su traducción». Pero T004 y T005 mandan conservar sin cambios líneas de la plantilla que usan el término solo: `Reserva 🔴 Important para…` (plantilla:29), `Un 🔴 Important exige…` y `…🟡 Nit como máximo` (35-36), y `No repitas un 🟡 Nit…` y `…por encima de 🟡 Nit…` (41-42). D-2 ya traduce la línea 36 (`🟡 Nit (LOW) como máximo`), pero no las demás. Si se siguen T004 y T005 al pie de la letra, la aserción 5 de T009 falla.
- **Archivo afectado:** design.md — `## Interfaces` (I-3) y D-2; tasks.md — T004 y T005
- **Acción requerida:** decidir una de dos opciones. (a) Mantener I-3 estricta y escribir en T004 y T005 que esas líneas de la plantilla se copian añadiendo la traducción (`🔴 Important (HIGH/MEDIUM)`, `🟡 Nit (LOW)`). (b) Relajar I-3 y la aserción 5 a «al menos un par término-traducción por sección», que es lo que pide CNF-1. Se recomienda (a): el texto queda autoexplicativo para el servicio de GitHub.

### INC-002 [WARNING]

- **Tipo:** E — criterio DoD PLAN «toda ambigüedad técnica está resuelta» (evaluado ⚠️)
- **Descripción:** I-5 trata como ruta de repositorio todo tramo entre comillas invertidas con `/`, y comprueba el prefijo desde la raíz. Dos rutas que el diseño manda citar son relativas a un skill, así que la aserción 6 de C-2 fallaría:
  - D-2, fila `skills/`: `` `agents/*.agent.md` `` (prefijo `agents/`) y `` `assets/agents/` ``: no existen en la raíz ni están ignoradas.
  - D-5 y T007: el marcador `` `evals/evals.json` ``, sin `skills/*/` delante: no existe `evals/` en la raíz.
- **Archivo afectado:** design.md — D-2 (tabla, fila `skills/`) y D-5; tasks.md — T004 y T007
- **Acción requerida:** citar esas rutas desde la raíz: `` `skills/*/SKILL.md` ``, `` `skills/*/agents/*.agent.md` ``, `` `skills/*/assets/agents/` `` y `` `skills/*/evals/evals.json` ``. El marcador `evals/evals.json` de D-3 sigue apareciendo como subcadena, y no choca con el marcador `skills/*/examples/`.

---

## Recomendaciones

1. **INC-001:** en design.md, D-2 (párrafo «Cierra con las dos líneas…»), indicar que las líneas 29, 35 y 36 de la plantilla se copian con la traducción entre paréntesis. En tasks.md, T004 (cierre) y T005 («seguido de las líneas 41-42»), añadir «añadiendo `(HIGH/MEDIUM)` o `(LOW)` tras cada término».
2. **INC-002:** en design.md, D-2, fila `` `skills/` ``, sustituir la columna de viñeta por `` `skills/` `` (`` `skills/*/SKILL.md` ``, `` `skills/*/agents/*.agent.md` ``, `` `skills/*/assets/agents/` ``). En D-5, primera fila de la tabla de casillas, y en tasks.md T007, citar `` `skills/*/evals/evals.json` ``.
3. Las dos se pueden aplicar con `/story-fix-plan STORY-179` antes de `/story-implement-tasks STORY-179`. No bloquean: T009 ya manda corregir `REVIEW.md` si una aserción falla. Pero así se evita una vuelta RED→GREEN que se puede prever.
4. **Dependencia (CR-001 de design.md):** implementar después de STORY-178 (ADR-0021), como recomienda la historia.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Cuatro secciones, áreas, tope de 5 LOW, sin formato | ✓ | E2E-001; UT-001, UT-002, UT-003, UT-010 |
| AC-2 | Cada regla en una sola sección (7 ejemplos) | ✓ | E2E-002; UT-004, UT-011 |
| AC-3 | Sin duplicar el gate y rutas existentes | ✓ | E2E-003; UT-006, UT-012 |
| CNF-1 | Doble vocabulario | ✓ | UT-005, UT-013 |
| CNF-2 | Sin publicación | ✓ | UT-007, IT-003 |
| CNF-3 | Codificación | ✓ | UT-008 |
| CNF-4 | Gate verde | ✓ | IT-001, IT-002 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-179` — disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-179` — disponible |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (Scenario Outline con 7 ejemplos) y AC-3 (alternativo), en bloques `gherkin` |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Componentes afectados» (columna «AC / CNF») e interfaces I-1 a I-5 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | Goals, D-1 a D-8 y Esquema de datos con `// satisface:`; componentes e interfaces con columna «AC / CNF»; flujos con `// AC-N` |
| No hay decisiones de arquitectura aplazadas; toda ambigüedad técnica está resuelta | ⚠️ | WARNING | «Open Questions: Ninguna» y CR-002 resuelto en D-8, pero I-3 e I-5 contradicen el contenido que D-2, D-5, T004, T005 y T007 mandan escribir (INC-001, INC-002) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Ambos presentes |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | AC-1: T003-T005; AC-2: T004, T006, T007; AC-3: T006, T007, T010. Cada tarea toca una sección o una verificación y tiene un «Hecho» |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | E2E-001 a E2E-003, uno por AC, con UT e IT de soporte |
