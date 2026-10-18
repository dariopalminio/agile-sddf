---
type: analyze
id: STORY-138
slug: STORY-138-analyze-report
title: "Analyze: Contrato de validación"
story: STORY-138
design: STORY-138
tasks: STORY-138
veredict: NEEDS-CHANGES
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
| Alineación tareas → diseño | ❌ | 25/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea |
| Alineación con la épica EPIC-25-unificar-contrato-de-validaciones-en-skills | ⚠️ | Listada, objetivo y restricciones alineados; estado de la épica incoherente con su último commit |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ |

**Estado general:** ❌ Inconsistencias bloqueantes

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | La política exige `## Veredicto` como primera sección y `verdict` en el frontmatter, define el vocabulario por fase e incluye un ejemplo por cada uno de los seis skills | ✓ | D-2 (l.95, secciones), D-3 (l.125, G-01/G-02), D-4 (l.143, vocabulario por fase), D-6 (l.229, G-05/G-06), D-9 (l.270, seis ejemplos) |
| AC-2 | Un valor heredado es no conforme y la tabla de equivalencias da su valor canónico | ✓ | D-5 (l.192): 18 filas por (skill, valor heredado), que incluyen los 7 Ejemplos de AC-2; D-7 (l.245), reportes heredados |
| AC-3 | Cada rama `verdict` de los flowcharts es un valor permitido para el skill que la precede, sin valores fuera de rama salvo `BLOCKED` y `PENDING` | ✓ | D-4 (l.143): columnas «Flowchart» y «Valores sin rama» e invariante de AC-3; contrato V-7 |

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
| T019 | V-11 | V-11 | ✓ |
| T020 | Fila en `docs/policies/README.md` | D-11 | ✓ |
| T021 | Fila en `docs/adr/README.md` | D-11 | ✓ |
| T022 | Regenerar `docs/index.md` | D-11 | ✓ |
| T023 | V-12 | V-12 | ✓ |
| T024 | V-13 | V-13 | ✓ |
| T025 | V-10 (evidencia para el PO) | V-10 | ✓ |
| T026 | `graphify update .` | — (ningún componente, interfaz ni contrato de design.md lo menciona) | ❌ |

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
| Historia listada en la épica | ✓ | `epic.md` l.22: «**STORY-138** — Contrato de validación: Definir `docs/policies/validation-contract-policy.md`…». La épica le asigna CS-1 (l.83). |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» de la historia («que agentes y pipelines CI lean el resultado de cualquier gate de la misma forma») coincide con el resultado que declara el Alcance de la épica: «un gate homogéneo que agentes, orquestadores y pipelines CI leen de la misma forma». |
| Restricciones de la épica respetadas | ✓ | El vocabulario de D-4 coincide con el del Alcance y las Notas de la épica (valores, fases, `BLOCKED`, `SPLIT`, `PENDING`, `epic-validate`). La mitigación del riesgo de ruptura de consumidores se documenta en ADR-0015 › Consecuencias y en §5 (D-10, D-5), como pide la nota «Riesgo» de la épica. Las demás historias no se ven afectadas: el diseño no toca skills ni el README. |

---

## Inconsistencias Detectadas

### INC-001 [ERROR]

- **Tipo:** B (tarea sin diseño asociado)
- **Descripción:** T026 («Ejecutar `graphify update .`…, — entorno local») no se puede trazar a ningún componente, interfaz, decisión ni contrato de verificación de design.md. El origen de la tarea es la regla de `AGENTS.md` «After modifying code, run `graphify update .`». Pero esta historia solo modifica documentación, y `graphify-out/` está en `.gitignore` (l.59), así que la tarea no produce ningún entregable versionado.
- **Archivo afectado:** tasks.md — sección «6. Verificación final», l.68 (T026)
- **Acción requerida:** retirar T026 de tasks.md, o bien declararla en design.md › «Componentes afectados» como paso local no versionado, con su origen en `AGENTS.md`.

### INC-002 [WARNING]

- **Tipo:** coherencia interna entre design.md y tasks.md (contrato de verificación que no puede pasar tal como está escrito)
- **Descripción:** V-2 (design.md › «Contratos de verificación») y T012 exigen que `grep -n '^## ' docs/policies/validation-contract-policy.md` devuelva **exactamente** los encabezados de D-2. Pero D-9 (l.270) y T010 colocan dentro de los seis bloques de ejemplo de §7 líneas que empiezan por `## ` (`## Veredicto`, `## Resumen`, `## Summary`…). El grep las devolverá y V-2 fallará aunque la policy sea correcta. design.md ya muestra el mismo efecto: su propio `## Veredicto` dentro del bloque de «Esquema de datos» (l.373) aparece al listar sus encabezados.
- **Archivo afectado:** design.md — sección «Contratos de verificación», fila V-2; tasks.md — sección «3. Verificación de la política», T012 (l.45)
- **Acción requerida:** restringir V-2 y T012 a los encabezados fuera de los bloques de código, por ejemplo con `grep -n -E '^## ([0-9]+\. |Historial)'`, e indicar que los `##` de §7 están dentro de bloques cercados.

### INC-003 [WARNING]

- **Tipo:** E (criterio DoD PLAN evaluado ⚠️, no bloqueante)
- **Descripción:** el criterio «Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen» se cumple en Decisions (D-1…D-11), Componentes afectados, Interfaces y Flujos clave. En cambio, «Esquema de datos» (l.352) y la tabla de «Decisiones de complejidad justificada» (l.408) no tienen la anotación `// satisface: AC-N`. Se pueden trazar de forma indirecta a D-1, D-3, D-4 y D-10, así que, aplicando la regla de duda, se marcan ⚠️.
- **Archivo afectado:** design.md — secciones «Esquema de datos» y «Decisiones de complejidad justificada»
- **Acción requerida:** añadir `// satisface: AC-1, CNF-1` al encabezado de «Esquema de datos» y una columna «Satisface» a la tabla de complejidad justificada.

### INC-004 [WARNING]

- **Tipo:** D (desalineación con la épica: estado)
- **Descripción:** el frontmatter de `epic.md` declara `status: DEFINE` / `substatus: TODO`. Sin embargo, el commit `283bb1f` se titula «spec: EPIC-25-unificar-contrato-de-validaciones-en-skills READY-FOR-DEV» y no modifica `epic.md`. La historia se está planificando bajo una épica cuyo estado no refleja que esté lista para desarrollo. Este análisis no evalúa la historia en sí, sino el gate de la épica.
- **Archivo afectado:** `docs/specs/epics/EPIC-25-unificar-contrato-de-validaciones-en-skills/epic.md` — frontmatter, l.6-7
- **Acción requerida:** confirmar el estado de la épica y, si está lista, actualizar `status`/`substatus` en `epic.md` (fuera del alcance de esta historia).

---

## Recomendaciones

1. **INC-001 (bloqueante):** eliminar T026 de `tasks.md` › «6. Verificación final». Es la opción más simple, porque la regla de `AGENTS.md` se refiere a código y `graphify-out/` no se versiona. Si se prefiere conservarla, añadir en `design.md` › «Componentes afectados» una fila «Grafo de conocimiento local | regenerar | `graphify-out/` (no versionado) | AGENTS.md». Después, volver a ejecutar `/story-analyze STORY-138`.
2. **INC-002:** en `design.md` › «Contratos de verificación», cambiar el método de V-2 a `grep -n -E '^## ([0-9]+\. |Historial)' …` con la nota «los `##` de §7 van dentro de bloques cercados», y aplicar el mismo cambio en `tasks.md` › T012.
3. **INC-003:** en `design.md`, anotar `// satisface: AC-1, CNF-1` en «## Esquema de datos» y añadir una columna «Satisface» a «## Decisiones de complejidad justificada» (por ejemplo, «Valores sin rama» → AC-3; «Tabla §5» → AC-2; «Sección §6» → CNF-1; «ADR» → CNF-1; «G-06» → AC-1).
4. **INC-004:** revisar el estado de EPIC-25 con el PO, sin tocar esta historia.

---

## Cumplimiento DoD — Fase PLAN

DoD cargado: `docs/guardrails/dod-story-plan.md` (`enforcement: error`, 7 criterios).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1, AC-2 (Esquema del escenario con 7 Ejemplos) y AC-3, en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs cubiertos (ver «Cobertura de Criterios de Aceptación») |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | D-1…D-11, Componentes, Interfaces y Flujos anotados; «Esquema de datos» y «Decisiones de complejidad justificada» sin anotación (INC-003) |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna»; CR-001 resuelto con el PO (D-10) |
| Debe existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (26 tareas) |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | AC-1 → T003–T011, T012, T013 y T016; AC-2 → T008 y T014; AC-3 → T007 y T015. Cada tarea afecta a una sección o a una verificación. La no trazabilidad de T026 se reporta en INC-001 (TIPO B), no aquí. |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
