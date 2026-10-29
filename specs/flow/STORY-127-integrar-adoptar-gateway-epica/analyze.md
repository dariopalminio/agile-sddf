---
type: analyze
id: STORY-127
slug: STORY-127-analyze-report
title: "Analyze: Integrar y documentar el gateway de validación de épicas"
story: STORY-127
design: STORY-127
tasks: STORY-127
verdict: NEEDS-CHANGES
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-127-integrar-adoptar-gateway-epica
---

<!-- Referencias -->
[[STORY-127-integrar-adoptar-gateway-epica]]

# Reporte de Coherencia: Integrar y documentar el gateway de validación de épicas

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — ERROR de tipo B; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1, CNF-2, CS-8, CS-21) |
| Alineación tareas → diseño | ❌ | 12/13 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 4/4 componentes y 9/9 interfaces con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | Listada y con objetivo alineado; la épica pide reubicar la transición del gateway y ampliar el vocabulario del veredicto |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Transición permitida con `verdict: APPROVED`; el reporte permanece como evidencia | ✓ | C1 (sección de la guía), C2 (línea de `state-machine.md`), interfaces «Procedimiento del mantenedor» y «Escritura permitida tras `APPROVED`», tabla de decisión (fila `APPROVED`), F1, D-1, D-2, D-7, D-9 |
| AC-2 | Transición bloqueada con `verdict: BLOCKED`; la épica sigue en `DEVELOP` y se remite a `## Veredicto` | ✓ | Tabla de decisión (filas `BLOCKED`, `NEEDS-CHANGES`, ausente e ilegible), interfaz «Mensaje de remisión», F2, D-8 |
| AC-3 | `skills/epic-validate/` en `files` de `package.json` e instalado con su `SKILL.md` en cada runtime soportado | ✓ | C4 (prueba en `test/install.test.js`), «Disponibilidad por runtime», F3, D-3, D-4, CR-003 |
| CNF-1 | La guía y `state-machine.md` nombran el mismo punto de entrada y la misma transición | ✓ | Interfaz «Línea canónica del gateway», C3, D-5, D-6, F4 |
| CNF-2 | Disponibilidad independiente de carpetas de runtime del repositorio fuente | ✓ | Non-Goals (no se editan `.claude/`, `.opencode/`, `.github/`, `.agents/`), C4 iterando `config/runtimes.json` |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Resolver CR-001 con el PO antes de editar | `## Registro de Cambios (CR)` › CR-001 y CR-002; Risks/Trade-offs (primer riesgo) | ✓ |
| T002 | Verificar que existe `skills/epic-validate/SKILL.md` (STORY-124) | Degradación gradual (P7), fila «`SKILL.md` aún no existe»; segundo riesgo | ✓ |
| T003 | Sección C1: línea canónica y procedimiento | C1; interfaces «Línea canónica», «Encabezado de C1» y «Procedimiento del mantenedor» | ✓ |
| T004 | C1: tabla de decisión, escritura permitida, remisión, nota de disponibilidad | C1; «Tabla de decisión del gateway»; «Disponibilidad por runtime»; interfaces «Escritura permitida» y «Mensaje de remisión» | ✓ |
| T005 | Línea canónica en `state-machine.md` con enlace | C2; interfaz «Remisión desde C2» | ✓ |
| T006 | `test/epic-validate-gateway.test.js` | C3; interfaz «Prueba C3» | ✓ |
| T007 | Prueba de distribución en `test/install.test.js` | C4; interfaz «Prueba C4» | ✓ |
| T008 | Recorrido manual de AC-1 con fixture | Contrato de verificación 2 | ✓ |
| T009 | Recorrido manual de AC-2 con tres fixtures | Contrato de verificación 3 | ✓ |
| T010 | `npm pack --dry-run --json` incluye `SKILL.md` | Contrato de verificación 6 | ✓ |
| T011 | UTF-8 sin BOM y sin cambios en destinos de runtime, `package.json` ni `config/runtimes.json` | Non-Goals, D-3 y el párrafo «No se modifican …» de Componentes | ✓ |
| T012 | `verify:links`, pruebas y `verify:repository` | Contratos de verificación 4, 5 y 7 | ✓ |
| T013 | Ejecutar `graphify update .` | Ningún componente, interfaz, decisión ni contrato de verificación de design.md lo menciona | ❌ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C1 — Sección «Gateway de validación de épicas» | Decisions › Componentes | T003, T004 | ✓ |
| C2 — Línea de gateway del nivel ÉPICA | Decisions › Componentes | T005 | ✓ |
| C3 — Prueba de consistencia del gateway | Decisions › Componentes | T006 | ✓ |
| C4 — Prueba de distribución de `epic-validate` | Decisions › Componentes | T007 | ✓ |
| Línea canónica del gateway | Decisions › Interfaces | T003, T005, T006 | ✓ |
| Encabezado de C1 | Decisions › Interfaces | T003 | ✓ |
| Procedimiento del mantenedor | Decisions › Interfaces | T003 | ✓ |
| Escritura permitida tras `APPROVED` | Decisions › Interfaces | T004 | ✓ |
| Mensaje de remisión | Decisions › Interfaces | T004 | ✓ |
| Remisión desde C2 | Decisions › Interfaces | T005, T012 | ✓ |
| Prueba C3 | Decisions › Interfaces | T006 | ✓ |
| Prueba C4 | Decisions › Interfaces | T007 | ✓ |
| Tabla de decisión / Disponibilidad por runtime | Decisions › Esquema de datos | T004 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, «Fase VALIDATE», línea 56 (`STORY-127` — Integrar y documentar el gateway de validación de épicas). Dueña de CS-8 (§ Notas, línea 199) |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (ninguna épica avanza sin `APPROVED` y todo runtime aplica la misma regla) coincide con el objetivo de la épica: gates con veredicto que deciden cada avance |
| Restricciones de la épica respetadas | ❌ | `epic.md` § Notas › «Alineación pendiente», línea 197: «STORY-127 sitúa el gateway en `DEVELOP → VALIDATE`; debe situarlo en `VALIDATE → SHIP`». Línea 196: el vocabulario del veredicto debe incluir `NEEDS-CHANGES`. También coinciden con la épica el § Alcance (línea 29: `APPROVED` avanza a `SHIP`) y la nota «Posición de `epic-validate`» (línea 183). design.md lo registra como CR-001 y CR-002 |

---

## Inconsistencias Detectadas

### INC-001 [ERROR]

- **Tipo:** B: tarea sin diseño
- **Descripción:** T013 («Ejecutar `graphify update .` …») no se puede trazar a ningún componente, interfaz, decisión ni contrato de verificación de design.md. Es una tarea operativa del repositorio (regla graphify de `AGENTS.md`), no un entregable de la historia.
- **Archivo afectado:** tasks.md — sección «## 4. Verificación», línea 61
- **Acción requerida:** eliminar T013 de tasks.md (es un paso transversal que aplica la sesión de implementación) o, si se quiere conservar, agregarlo a design.md › «Contratos de verificación» con su justificación.

### INC-002 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** La historia (AC-1, AC-2, CNF-1, «Quiero», nota «Mecanismo de transición») sitúa el gateway en `DEVELOP → VALIDATE`. EPIC-23 (§ Notas, línea 197; § Alcance, línea 29; nota «Posición de `epic-validate`», línea 183) lo sitúa en `VALIDATE → SHIP`, con `NEEDS-CHANGES` como vuelta a `DEVELOP`. `domain-epic-lifecycle` §8 asigna `DEVELOP → VALIDATE` al gate de completitud de historias. design.md sigue la historia y lo registra como CR-001; T001 detiene la implementación hasta que el PO decida.
- **Archivo afectado:** story.md — `### AC-1` (línea 30), `### AC-2` (línea 39) y CNF-1 (línea 57); design.md — `### CR-001` (línea 184)
- **Acción requerida:** decidir la transición con el PO. Si es `VALIDATE → SHIP`, ejecutar `/story-refine STORY-127` y luego `/story-plan STORY-127 --only-tasks`.

### INC-003 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** La nota «Contrato consumido» y AC-2 solo admiten `APPROVED` | `BLOCKED`. La épica (§ Notas, línea 196, y la decisión del PO del 2026-10-17) exige `APPROVED` · `NEEDS-CHANGES` · `BLOCKED`. El diseño ya falla cerrado con cualquier valor distinto de `APPROVED` (D-8), así que no es un riesgo funcional.
- **Archivo afectado:** story.md — `## 📎 Notas / contexto adicional`, «Contrato consumido» (línea 69); design.md — `### CR-002` (línea 190)
- **Acción requerida:** al refinar la historia por INC-002, agregar `NEEDS-CHANGES` a la nota y al escenario de AC-2.

---

## Recomendaciones

1. **INC-001:** en `tasks.md` › «## 4. Verificación», eliminar T013 con `/story-fix-plan STORY-127`. La actualización del grafo es un paso transversal de la sesión, no de la historia.
2. **INC-002:** resolver CR-001 antes de implementar (es lo que pide T001). La épica, el diagrama de referencia y `domain-epic-lifecycle` §8 coinciden en `VALIDATE → SHIP`, y STORY-170 (`epic-ship`) ya exige `verdict: APPROVED` antes de `SHIP`. Se recomienda `/story-refine STORY-127` para reubicar el gateway y regenerar el plan con `/story-plan STORY-127 --only-tasks`.
3. **INC-003:** en el mismo refinamiento, actualizar la nota «Contrato consumido» y AC-2 de `story.md` con los tres valores del contrato (`APPROVED` · `NEEDS-CHANGES` · `BLOCKED`).

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente: no se evaluó la cobertura de pruebas.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-127` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-127` disponible |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` (`enforcement: error`), 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 y AC-3 en bloques `gherkin` (story.md, líneas 30–55) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs cubiertos (tabla de cobertura) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Columna «AC que satisface» en Componentes e Interfaces, columna «AC» en Decisiones técnicas, `// satisface:` en Goals, Esquema de datos y Flujos clave |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | D-1 a D-9 resueltas; la ubicación de la transición está registrada como CR-001 y el vocabulario como CR-002 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1 → T003–T005 y T008; AC-2 → T004 y T009; AC-3 → T007 y T010; cada tarea toca un archivo o un comando |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md ausente (modo `--only-tasks`) |
