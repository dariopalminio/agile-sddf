---
type: analyze
id: STORY-138
slug: STORY-138-analyze-report
title: "Analyze: Contrato de validación"
story: STORY-138
design: STORY-138
tasks: STORY-138
verdict: APPROVED
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-138-contrato-de-validacion
---

<!-- Referencias -->
[[STORY-138-contrato-de-validacion]]

# Reporte de Coherencia: Contrato de validación

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos |
| Alineación tareas → diseño | ✓ | 25/25 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea |
| Alineación con la épica EPIC-25-unificar-contrato-de-validaciones-en-skills | ⚠️ | Listada, objetivo y restricciones alineados; el estado de la épica sigue sin reflejar su gate aprobado |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | La política exige `## Veredicto` como primera sección y `verdict` en el frontmatter, define el vocabulario por fase e incluye un ejemplo por cada uno de los seis skills | ✓ | D-2 (l.95, secciones), D-3 (l.125, G-01/G-02), D-4 (l.143, vocabulario por fase), D-6 (l.229, G-05/G-06), D-9 (l.270, seis ejemplos) |
| AC-2 | Un valor heredado es no conforme y la tabla de equivalencias da su valor canónico | ✓ | D-5 (l.192): 18 filas por (skill, valor heredado), que incluyen los 7 Ejemplos de AC-2; D-7 (l.245), reportes heredados |
| AC-3 | Cada rama `verdict` de los flowcharts es un valor permitido para el skill que la precede, sin valores fuera de rama salvo `BLOCKED` y `PENDING` | ✓ | D-4 (l.143): columnas «Flowchart» y «Valores sin rama» e invariante de AC-3; contrato V-7. Las ramas de D-4 coinciden con las de los tres `.mermaid` actuales (comprobado con `grep -n -- '-->\|'`) |

CNF-1…CNF-4 también tienen cobertura: CNF-1 en D-1, D-8, D-10 y D-11; CNF-2 en D-4; CNF-3 en D-2 y V-10; CNF-4 en D-2, D-9 y V-9.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Confirmar el estado medido | Context («Estado medido», «Veredictos heredados»), D-4, D-9 | ✓ |
| T002 | Línea base de `check-doc-links.js` | V-13 | ✓ |
| T003 | Crear la policy con frontmatter, cabecera y encabezados | D-1, D-2 | ✓ |
| T004 | Redactar §1 | D-1 (principios), D-2 (fila §1) | ✓ |
| T005 | Redactar §2 | D-4 | ✓ |
| T006 | Redactar §3 | D-3, D-6 | ✓ |
| T007 | Redactar §4 | D-4 | ✓ |
| T008 | Redactar §5 y la regla de reportes heredados | D-5, D-7 | ✓ |
| T009 | Redactar §6 | D-8 | ✓ |
| T010 | Redactar §7 | D-9 | ✓ |
| T011 | Historial de cambios | D-2 | ✓ |
| T012 | V-1 y V-2 | Contratos de verificación V-1, V-2 | ✓ (ver INC-002) |
| T013 | V-3 y V-4 | V-3, V-4 | ✓ |
| T014 | V-5 y V-6 | V-5, V-6 | ✓ |
| T015 | V-7 (AC-3) | V-7 | ✓ |
| T016 | V-8 | V-8 | ✓ |
| T017 | V-9 y CNF-1 | V-9, D-2 «Presupuesto de tamaño» | ✓ |
| T018 | Crear ADR-0015 | D-10 | ✓ |
| T019 | V-11 | V-11 | ✓ (ver INC-003) |
| T020 | Fila en `docs/policies/README.md` | D-11 | ✓ |
| T021 | Fila en `docs/adr/README.md` | D-11 | ✓ |
| T022 | Regenerar `docs/index.md` | D-11 | ✓ |
| T023 | V-12 | V-12 | ✓ |
| T024 | V-13 | V-13 | ✓ |
| T025 | V-10 (evidencia para el PO) | V-10 | ✓ |

La tarea T026 del análisis anterior se retiró (`fix-plan-report.md`, C-01). No queda ninguna referencia a ella.

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Política de contrato de validación | Componentes afectados (l.326) | T003–T011 | ✓ |
| ADR del contrato de validación | Componentes afectados | T018 | ✓ |
| Índice de policies | Componentes afectados | T020 | ✓ |
| Índice de ADRs | Componentes afectados | T021 | ✓ |
| Índice de la wiki (`docs/index.md`) | Componentes afectados | T022 | ✓ |
| Campo `verdict` | Interfaces (l.338) | T006 (G-01), T013 | ✓ |
| Línea de veredicto | Interfaces | T006 (G-02), T016 | ✓ |
| Tabla §4 | Interfaces | T007, T014, T015 | ✓ |
| Tabla §5 | Interfaces | T008, T014 | ✓ |
| Tabla §6 | Interfaces | T009 | ✓ |
| Reglas G-01…G-06 | Interfaces | T006 | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-138` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-138` — disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-25-unificar-contrato-de-validaciones-en-skills

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l.22: «**STORY-138** — Contrato de validación: Definir `docs/policies/validation-contract-policy.md`…». La épica le asigna CS-1 (l.84). |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» de la historia («que agentes y pipelines CI lean el resultado de cualquier gate de la misma forma») coincide con el resultado que declara el Alcance de la épica: «un gate homogéneo que agentes, orquestadores y pipelines CI leen de la misma forma». |
| Restricciones de la épica respetadas | ✓ | El vocabulario de D-4 coincide con el del Alcance y las Notas de la épica. La mitigación del riesgo de ruptura de consumidores (l.94) se documenta en ADR-0015 › Consecuencias y en §5 (D-10, D-5). El diseño no toca skills ni el README, de modo que las demás historias no se ven afectadas. |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E (criterio DoD PLAN evaluado ⚠️, no bloqueante)
- **Descripción:** tras la corrección anterior, «Esquema de datos» (l.352) y «Decisiones de complejidad justificada» (l.410) ya tienen trazabilidad. Queda un elemento de diseño sin AC: el encabezado de **F-4 — Degradación y cambio (P6, P7)** (l.398) solo cita principios, mientras que F-1, F-2 y F-3 citan su AC. Su contenido se puede trazar de forma indirecta a AC-1 (G-06 ante valor ausente o desconocido) y a AC-3 (deriva de ramas entre flowchart y §4). Por la regla de duda, se marca ⚠️.
- **Archivo afectado:** design.md — sección «Flujos clave», encabezado F-4 (l.398)
- **Acción requerida:** anotar el encabezado como `### F-4 — Degradación y cambio (P6, P7) // AC-1, AC-3`, en la misma forma que F-1…F-3.

### INC-002 [WARNING]

- **Tipo:** coherencia interna entre el criterio y el método de un contrato de verificación
- **Descripción:** el criterio de V-2 (l.423) dice que los encabezados `##` fuera de bloques cercados son **exactamente** los de D-2. El método `grep -n -E '^## ([0-9]+\. |Historial)'`, y el mismo comando en T012 (tasks.md l.45), solo devuelve los encabezados numerados y «Historial». Un `##` sobrante sin número fuera de los bloques (por ejemplo, `## Notas`) pasaría la verificación sin detectarse. El método comprueba el orden de los ocho encabezados previstos, pero no su exclusividad.
- **Archivo afectado:** design.md — «Contratos de verificación», fila V-2 (l.423); tasks.md — «3. Verificación de la política», T012 (l.45)
- **Acción requerida:** cambiar el método a un filtro que ignore los bloques cercados y liste todos los `##` restantes, por ejemplo `awk '/^```/{f=!f} !f && /^## /' docs/policies/validation-contract-policy.md`, que debe devolver exactamente los 8 encabezados de D-2. Aplicar el mismo cambio en T012.

### INC-003 [WARNING]

- **Tipo:** formato Markdown de un contrato de verificación (el comando no se lee tal como está escrito)
- **Descripción:** el método de V-11 (l.432) y T019 (tasks.md l.55) escriben `` `grep -c '^| `story-' …` `` con comillas invertidas anidadas. Por eso el bloque de código se cierra antes de `story-`, y el comando se renderiza partido. Además, en la tabla de design.md el `|` sin escapar abre una columna extra en la fila V-11, de modo que el método y el origen (`CNF-1, CR-001`) se desplazan de columna. El comando es correcto en una terminal; lo que falla es su lectura en el documento.
- **Archivo afectado:** design.md — «Contratos de verificación», fila V-11 (l.432); tasks.md — «4. ADR-0015», T019 (l.55)
- **Acción requerida:** usar un bloque de código con doble comilla invertida (``` `` grep -c '^| `story-' docs/adr/ADR-0015-contrato-de-validacion.md `` ```) en ambos archivos y, dentro de la tabla de design.md, escapar el `|` como `\|`.

### INC-004 [WARNING]

- **Tipo:** D (desalineación con la épica: estado)
- **Descripción:** el frontmatter de `epic.md` sigue declarando `status: DEFINE` / `substatus: TODO` (l.6-7). Sin embargo, `epic-analyze-report.md` de EPIC-25 declara `verdict: APPROVED` y el commit `283bb1f` se titula «… READY-FOR-DEV» sin modificar `epic.md`. La historia se planifica bajo una épica cuyo estado no refleja su gate aprobado. No es un defecto de la historia.
- **Archivo afectado:** `docs/specs/epics/EPIC-25-unificar-contrato-de-validaciones-en-skills/epic.md` — frontmatter, l.6-7
- **Acción requerida:** confirmar el estado de la épica con el PO y, si está lista, actualizar `status`/`substatus` en `epic.md` (fuera del alcance de esta historia).

---

## Recomendaciones

1. **INC-001:** en `design.md` › «Flujos clave», añadir `// AC-1, AC-3` al encabezado de F-4.
2. **INC-002:** en `design.md` › «Contratos de verificación» › V-2 y en `tasks.md` › T012, sustituir el `grep` por `awk '/^```/{f=!f} !f && /^## /' docs/policies/validation-contract-policy.md`, que debe devolver exactamente los 8 encabezados de D-2 en ese orden.
3. **INC-003:** en `design.md` › V-11 y en `tasks.md` › T019, delimitar el comando con doble comilla invertida y escapar el `|` en la celda de la tabla.
4. **INC-004:** revisar el estado de EPIC-25 con el PO, sin tocar esta historia.

Ninguna de las cuatro bloquea la implementación. Las tres primeras se pueden aplicar con `/story-fix-plan STORY-138 corrige advertencias`.

---

## Cumplimiento DoD — Fase PLAN

DoD cargado: `docs/guardrails/dod-story-plan.md` (`enforcement: error`, 7 criterios).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1, AC-2 (Esquema del escenario con 7 Ejemplos) y AC-3, en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs cubiertos (ver «Cobertura de Criterios de Aceptación») |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | D-1…D-11, Componentes, Interfaces, Esquema de datos, Complejidad justificada y F-1…F-3 anotados; F-4 solo cita P6 y P7 (INC-001) |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna»; CR-001 resuelto con el PO (D-10) |
| Debe existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (25 tareas) |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | AC-1 → T003–T011, T012, T013 y T016; AC-2 → T008 y T014; AC-3 → T007 y T015. Cada tarea afecta a una sección o a una verificación, y todas se trazan a design.md |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
