---
type: analyze
id: STORY-139
slug: STORY-139-analyze-report
title: "Analyze: Alinear epic-analyze"
story: STORY-139
design: STORY-139
tasks: STORY-139
verdict: APPROVED
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-139-alinear-epic-analyze
---

<!-- Referencias -->
[[STORY-139-alinear-epic-analyze]]

# Reporte de Coherencia: Alinear epic-analyze

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (AC-1, AC-2, CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente |
| Alineación tareas → diseño | ✓ | 25/25 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 9/9 elementos con tarea (5 componentes + 4 interfaces) |
| Alineación con la épica EPIC-25-unificar-contrato-de-validaciones-en-skills | ✓ | Listada en el índice (epic.md:23) y dueña de CS-4 (epic.md:37) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR, 2 WARNING)

Fuentes leídas: `story.md`, `design.md`, `tasks.md`, `epic.md` de EPIC-25 y `docs/guardrails/dod-story-plan.md` (`enforcement: error`). También se contrastó el «Estado medido» del diseño con el repositorio: `skills/epic-analyze/SKILL.md`, `README.md`, `assets/epic-analyze-report-template.md`, `evals/evals.json` y `docs/domains/domain-skills-map.md`.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `## Veredicto` es la primera sección tras el título, con el mismo valor que `verdict`; filas APPROVED / NEEDS-REFINEMENT (> 3 WARNING) / NEEDS-REFINEMENT (≥ 1 ERROR); sin `BLOCKED` | ✓ | D-1 (regla), D-2 (sección y clave), D-3 (motivo), D-6 (alcance del `Pero`), D-7, D-8; F-1, F-2; Interfaces «Frontmatter» y «Sección `## Veredicto`»; V-1, V-2, V-3, V-5, V-7, V-8 |
| AC-2 | Cada diferencia entre el template y la policy se corrige; si alguna se conserva, se registra como excepción | ✓ | D-2, D-4 (fila de `## Resumen` eliminada), D-9 (lista C-1…C-6, sin excepciones), D-10 (secuencia con STORY-138); F-3, F-4; V-4, V-6 |
| CNF-1 | `errors` y `warnings` se conservan y distinguen un NEEDS-REFINEMENT con ERROR de uno solo con WARNING | ✓ | D-5; Esquema de datos; Interfaz «Frontmatter»; V-2, V-7 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar que la policy existe y leer G-01…G-06, §2, §4, §5, §6, §7.1 | D-9, D-10 | ✓ |
| T002 | Confirmar el «Estado medido» | Context, D-7, D-8 | ✓ |
| T003 | Línea base del gate | V-9 | ✓ |
| T004 | `verdict` sin `BLOCKED` en el template; conservar `errors` y `warnings` | D-1, D-5; componente «Template» | ✓ |
| T005 | Insertar `## Veredicto` con marcador, comentario y dos líneas | D-2, D-3; Esquema de datos | ✓ |
| T006 | Quitar el veredicto de `## Resumen` | D-4 | ✓ |
| T007 | Paso 6: tabla de D-1 y referencia a la policy en código en línea | D-1, D-7 | ✓ |
| T008 | Paso 7: fila `veredicto` con el motivo de D-3; `resumen` sin veredicto | D-2, D-3, D-4 | ✓ |
| T009 | Aviso cuando falta la clave `veredicto` | D-2, F-3 | ✓ |
| T010 | Objetivo (l.19) y catálogo MAD (l.255) | D-6, D-7 | ✓ |
| T011 | Consola (l.306, l.318), verificación (l.327), Salida (l.335) | D-7; Interfaz «Salida de consola» | ✓ |
| T012 | `README.md` l.11 | D-7; componente «Ficha del skill» | ✓ |
| T013 | `domain-skills-map.md` l.19 | D-7; componente «Mapa de skills» | ✓ |
| T014 | Los 11 casos con ERROR | D-6, D-8 | ✓ |
| T015 | TC-001 | D-4, D-8 | ✓ |
| T016 | TC-006 y TC-024 | D-5, D-8 | ✓ (ver INC-002) |
| T017 | `description`, `version: 1.3.0`, JSON válido | D-8 | ✓ |
| T018 | V-1 | Contratos de verificación | ✓ |
| T019 | V-2, V-3, V-4 | Contratos de verificación | ✓ (ver INC-001) |
| T020 | V-5 | Contratos de verificación | ✓ |
| T021 | V-7 | Contratos de verificación | ✓ |
| T022 | V-8 | Contratos de verificación | ✓ |
| T023 | V-6 (C-1…C-6 contra la policy publicada) | D-9; Contratos de verificación | ✓ |
| T024 | V-9 y alcance de `git status` | Contratos de verificación; «No se tocan» de Componentes | ✓ |
| T025 | V-10 manual | Contratos de verificación; AGENTS.md | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Regla de veredicto y escritura por clave (`SKILL.md`) | Componentes afectados | T007–T011 | ✓ |
| Template del reporte | Componentes afectados | T004–T006 | ✓ |
| Ficha del skill (`README.md`) | Componentes afectados | T012 | ✓ |
| Evals del skill (`evals.json`) | Componentes afectados | T014–T017 | ✓ |
| Mapa de skills (`domain-skills-map.md`) | Componentes afectados | T013 | ✓ |
| Frontmatter del reporte | Interfaces | T004, T008 | ✓ |
| Sección `## Veredicto` | Interfaces | T005, T008 | ✓ |
| Clave de template `veredicto` | Interfaces | T005, T008, T009 | ✓ |
| Salida de consola | Interfaces | T011 | ✓ |

Los contratos V-1…V-10 se cubren con T018–T025 y T003. Las decisiones D-1…D-10 tienen al menos una tarea cada una.

---

## Alineación con la Épica

**Épica padre:** EPIC-25-unificar-contrato-de-validaciones-en-skills

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:23`: «STORY-139 — Alinear epic-analyze: Añadir la sección `## Veredicto` al reporte y emitir `NEEDS-REFINEMENT` en lugar de `BLOCKED`» |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (leer el resultado como el de cualquier otro gate) coincide con el Alcance. Cubre CS-4 (`epic.md:37`) y la nota de `epic.md:92` (`BLOCKED` → `NEEDS-REFINEMENT`, severidad en `errors` / `warnings`) |
| Restricciones de la épica respetadas | ✓ | Vocabulario en inglés y en mayúsculas. `NEEDS-REFINEMENT` es el rechazo de un gate de especificación, no `NEEDS-CHANGES` (D-1). La secuencia con STORY-138 (`epic.md:85`) se respeta con D-10 y T001. Los otros cinco skills quedan fuera de alcance |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** C (el método de verificación no se puede ejecutar tal como está escrito)
- **Descripción:** V-4 (y T019) esperan que `grep -n -i veredicto skills/epic-analyze/assets/epic-analyze-report-template.md` muestre coincidencias **solo en el frontmatter y en la sección `## Veredicto`**. Esto no puede cumplirse por dos motivos. (1) El frontmatter usa `verdict:`, no `veredicto`, así que nunca coincide. (2) El comentario guía de `## Notas del análisis` (template l.61) dice «…que no son hallazgos y no cuentan para el veredicto…». Esa línea sobrevive al cambio y hará fallar V-4 aunque la implementación sea correcta.
- **Archivo afectado:** `design.md` — sección «Contratos de verificación», fila V-4; `tasks.md` — T019 (grupo «6. Verificación»)
- **Acción requerida:** Reformular V-4 para que afirme lo que realmente importa. `grep -n -E '\| Veredicto \||\*\*Veredicto:\*\*' …` debe coincidir solo dentro de `## Veredicto` (la línea del valor). Además, el comentario guía de `## Resumen` no debe mencionar el veredicto. La mención de l.61 se acepta porque no declara un valor.

### INC-002 [WARNING]

- **Tipo:** C (el inventario del diseño no coincide con el estado de `evals.json`)
- **Descripción:** D-8 y T014/T016 describen cambios que no coinciden del todo con el archivo actual (`version: 1.2.0`, 28 casos):
  - TC-006 y TC-024 **ya** contienen `"NEEDS-REFINEMENT"`, `"verdict: NEEDS-REFINEMENT"` y `"errors: 0"`, y ya tienen `"verdict: BLOCKED"` en `not_contains`. T016 pide añadir `"errors: 0"` (ya presente) y lo único nuevo son `"## Veredicto"` y `` "**Veredicto:** `NEEDS-REFINEMENT`" ``.
  - D-8 dice «se conservan sus `errors: 1`» para los 11 casos con ERROR, pero solo 7 lo afirman. TC-003, TC-017, TC-026 y TC-027 no lo hacen, y TC-027 tiene además dos ERROR (INT-06 + INT-02). La tarea es correcta («conservar» no añade nada), pero el texto puede llevar a añadir `errors: 1` donde no corresponde.
  - TC-005 y TC-013 (casos APPROVED) tienen `"BLOCKED"` a secas en `not_contains`. Siguen siendo válidos y V-7 los admite, pero D-6 desaconseja ese patrón y el diseño no dice si se conservan.
- **Archivo afectado:** `design.md` — sección «D-8 — Evals: actualizar los 11 casos y afirmar la sección»; `tasks.md` — T014 y T016 (grupo «5. Evals del skill»)
- **Acción requerida:** En T016, decir «añadir si falta» y nombrar solo las dos aserciones nuevas. En T014, aclarar que `errors: 1` se conserva donde ya existe y que no se añade a TC-003, TC-017, TC-026 ni TC-027. En D-8, decidir qué hacer con el `"BLOCKED"` a secas de TC-005 y TC-013: conservarlo (no hay MAD-01 en esos fixtures) o cambiarlo por `"verdict: BLOCKED"` para cumplir D-6.

---

## Recomendaciones

1. **INC-001:** en `design.md` › «Contratos de verificación», reescribir el método de V-4 con el patrón `'\| Veredicto \||\*\*Veredicto:\*\*'` y excluir de forma explícita la mención de l.61 (Notas del análisis). Ajustar T019 de la misma forma. Se puede aplicar con `/story-fix-plan STORY-139`.
2. **INC-002:** en `tasks.md`, que T016 diga «añadir `"## Veredicto"` y `` "**Veredicto:** `NEEDS-REFINEMENT`" `` a `contains`, si faltan». Que T014 aclare que `errors: 1` no se añade a TC-003, TC-017, TC-026 ni TC-027. En `design.md` › D-8, añadir una línea sobre TC-005 y TC-013. La opción recomendada es cambiar `"BLOCKED"` por `"verdict: BLOCKED"` para aplicar D-6 de forma uniforme.
3. **Dependencia (no es un hallazgo):** `docs/policies/validation-contract-policy.md` todavía no existe (`docs/policies/` solo contiene `README.md`). La historia queda planificada, pero el «Dado» de AC-2 depende de STORY-138. T001 detiene la implementación hasta que la policy esté publicada.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. La verificación de los ACs vive en el grupo «6. Verificación» de `tasks.md` (T018–T025) y en las evals del skill (D-8).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-139` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-139` |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` (resuelto vía `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`; `enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (Esquema del escenario con 3 Ejemplos) y AC-2 en bloques `gherkin` (story.md:27-48) |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1, AC-2 y CNF-1 cubiertos (ver tabla de cobertura) |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-10 y el Esquema de datos llevan `// satisface:`. Componentes, Interfaces, Complejidad y V-1…V-10 tienen columna «Satisface»/«Origen». F-1…F-4 usan `// AC-N` sin la palabra «satisface», que se acepta como trazabilidad explícita |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna». La decisión de las Notas (fila en `## Resumen`) se resuelve en D-4 y el `Pero` de AC-1 en D-6. La regla de D-9 ante una policy distinta es una contingencia definida, no una decisión aplazada |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 25 tareas de una sesión. Las tres filas de AC-1 se verifican en T020/T021, AC-2 en T019/T023 y CNF-1 en T019/T021 |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
