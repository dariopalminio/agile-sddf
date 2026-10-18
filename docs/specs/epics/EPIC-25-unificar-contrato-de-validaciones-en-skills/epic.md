---
type: epic
id: EPIC-25
slug: EPIC-25-unificar-contrato-de-validaciones-en-skills
title: "Unificar contrato de validaciones en skills"
status: DEFINE
substatus: TODO
parent: null
created: 2026-10-14
updated: 2026-10-18
related: []
---

# Épica: Unificar contrato de validaciones en skills

## Alcance

Alinear los seis skills de validación del framework (`epic-analyze`, `story-evaluation`, `story-analyze`, `story-code-review`, `story-verify`, `story-acceptance`) bajo un contrato común de reporte: el veredicto va en una sección `## Veredicto` al inicio y en el campo `verdict` del frontmatter, con un vocabulario controlado único en inglés. El vocabulario sigue las ramas de los flowcharts del ciclo de historia. Los gates de especificación (`epic-analyze`, `story-evaluation`) emiten `APPROVED` o `NEEDS-REFINEMENT`. Los gates de planificación, ejecución y QA (`story-analyze`, `story-code-review`, `story-verify`, `story-acceptance`) emiten `APPROVED` o `NEEDS-CHANGES`. `BLOCKED` indica que un bloqueo impide completar el proceso (`story-code-review`, `story-verify`, `story-acceptance`): el flujo se detiene y, despejado el bloqueo, se vuelve a ejecutar el mismo gate. `SPLIT` (`story-evaluation`) y `PENDING` (`story-acceptance` con la sesión a medias) son extensiones locales. El resultado es un gate homogéneo que agentes, orquestadores y pipelines CI leen de la misma forma.

## Historias

- [x] **STORY-138** — Contrato de validación: Definir `docs/policies/validation-contract-policy.md` con la estructura común de reporte y el vocabulario controlado por fase
- [x] **STORY-139** — Alinear epic-analyze: Añadir la sección `## Veredicto` al reporte y emitir `NEEDS-REFINEMENT` en lugar de `BLOCKED`
- [x] **STORY-140** — Alinear story-evaluation: Mover el veredicto al inicio, declarar `verdict` y normalizar los valores a `APPROVED` / `NEEDS-REFINEMENT` / `SPLIT`
- [ ] **STORY-141** — Alinear story-code-review: Reemplazar `review-status` por `verdict` y normalizar los valores a `APPROVED` / `NEEDS-CHANGES`
- [ ] **STORY-142** — Alinear story-verify: Añadir veredicto y `verdict`, y reemplazar `RECHAZAR` por `NEEDS-CHANGES`
- [ ] **STORY-143** — Validación end-to-end: Verificar los seis reportes contra el contrato y documentarlo en el README
- [ ] **STORY-144** — Alinear story-analyze: Añadir veredicto y `verdict` (`APPROVED` / `NEEDS-CHANGES`) al reporte de coherencia
- [ ] **STORY-145** — Alinear story-acceptance: Reemplazar `final-status` por `verdict` (`APPROVED` / `NEEDS-CHANGES` / `BLOCKED` / `PENDING`) y mover el veredicto al inicio
- [x] **STORY-146** — Crear y alinear story-fix-plan para que corrija automáticamente los hallazgos de `analyze.md` siguiendo el contrato de validación y registre los cambios en `fix-plan-report.md`

## Criterios de salida

- [ ] **CS-1** — `docs/policies/validation-contract-policy.md` existe y describe la estructura común de reporte y el vocabulario por fase, con ejemplos para cada skill.
- [ ] **CS-2** — Los seis skills de validación (`epic-analyze`, `story-evaluation`, `story-analyze`, `story-code-review`, `story-verify`, `story-acceptance`) tienen una sección `## Veredicto` como primera sección tras el título en sus templates de reporte.
- [ ] **CS-3** — Los seis templates de reporte declaran `verdict` en el frontmatter con valores del vocabulario controlado.
- [ ] **CS-4** — `epic-analyze` produce un veredicto explícito `APPROVED` | `NEEDS-REFINEMENT`, sin `BLOCKED`.
- [ ] **CS-5** — `story-evaluation` produce un veredicto explícito `APPROVED` | `NEEDS-REFINEMENT` | `SPLIT`, y `RECHAZAR` se mapea a `NEEDS-REFINEMENT`.
- [ ] **CS-6** — `story-analyze` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES`.
- [ ] **CS-7** — `story-code-review` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES` | `BLOCKED`.
- [ ] **CS-8** — `story-verify` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES` | `BLOCKED`, sin `RECHAZAR`, `RECHAZADO` ni `REJECTED`.
- [ ] **CS-9** — `story-acceptance` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES` | `BLOCKED`, y `PENDING` mientras la sesión está a medias, sin `ACCEPTANCE-REJECTED`.
- [ ] **CS-10** — No existe ninguna variante `APROBADA`, `Aprobada`, `review-status` ni el valor de veredicto `approved` en skills, templates ni documentación vigente del framework (se excluyen los artefactos históricos de `docs/specs/` y las versiones publicadas del CHANGELOG).
- [ ] **CS-11** — El README del framework apunta a `docs/policies/validation-contract-policy.md` como fuente de verdad del contrato de validación.

## Smoke tests

### SMOKE-1 — Veredicto uniforme en los seis reportes
```gherkin
Escenario: Los seis skills de validación emiten el veredicto con la misma estructura
  Dado el framework con las historias de esta épica implementadas
  Cuando se ejecutan los seis skills de validación sobre artefactos de ejemplo
  Entonces cada reporte generado tiene una sección "## Veredicto" como primera sección tras el título
  Y cada reporte declara en el campo "verdict" de su frontmatter un valor que la política de contrato de validación permite para su skill
```

### SMOKE-2 — story-verify emite veredicto consumible por CI
```gherkin
Escenario: Un pipeline CI consume el veredicto de story-verify
  Dado un reporte generado por story-verify sobre una historia implementada con defectos sin resolver
  Cuando el pipeline lee el campo "verdict" del frontmatter
  Entonces obtiene el valor NEEDS-CHANGES
  Y no encuentra RECHAZAR, RECHAZADO ni REJECTED en ninguna parte del reporte
```

### SMOKE-3 — Vocabulario canónico sin variantes
```gherkin
Escenario: El framework no contiene variantes de aprobación
  Dado el repositorio con las historias de esta épica implementadas
  Cuando se buscan "APROBADA", "Aprobada", "review-status" y el valor de veredicto "approved" en skills, templates y documentación vigente
  Entonces no se encuentran coincidencias
  Y "APPROVED" aparece en los seis skills de validación como valor canónico de aprobación
```

## Notas

- **Flowcharts de referencia:** el vocabulario de cada skill sigue las ramas `verdict` de tres diagramas:
  - `docs/architecture/diagrams/flowchart-story-specify.mermaid` (especificación): `story-evaluation` → `SPLIT` / `NEEDS-REFINEMENT` / `APPROVED`.
  - `docs/architecture/diagrams/flowchart-story-plan.mermaid` (planificación): `story-analyze` → `NEEDS-CHANGES` / `APPROVED`.
  - `docs/architecture/diagrams/flowchart-story-excecution-qa.mermaid` (ejecución y QA): `story-code-review`, `story-verify` y `story-acceptance` → `NEEDS-CHANGES` (vuelve a implementar) / `BLOCKED` (vuelve a ejecutar el mismo gate) / `APPROVED`.
  - `PENDING` no es una rama de los flowcharts: detiene el flujo hasta que termine la sesión.
- **Fuera de alcance: nodos de los flowcharts que hoy no existen.** `story-refine` corresponde hoy a `story-improve`, y renombrarlo no forma parte de esta épica. `story-fix-changes`, el bucle `NEEDS-CHANGES` de planificación, no existe. Además, `story-implement` hoy solo reconoce `fix-directives.md` como señal de rework, no `verify-report.md` ni `acceptance-report.md`. Esta épica fija los veredictos que leerán esos bucles; construirlos corresponde a otra épica.
- Los IDs `CS-N` de los criterios de salida son estables, como los `SMOKE-N`: no se renumeran al insertar o eliminar criterios.
- Cada criterio de salida y cada smoke test tiene una historia dueña que lo cita en sus notas: STORY-138 (CS-1), STORY-139 (CS-4), STORY-140 (CS-5), STORY-141 (CS-7), STORY-142 (CS-8; SMOKE-2), STORY-143 (CS-2, CS-3, CS-10, CS-11; SMOKE-1, SMOKE-3), STORY-144 (CS-6) y STORY-145 (CS-9).
- **Habilitación secuencial:** STORY-138 (contrato) bloquea a las seis historias de alineación por skill (STORY-139 a STORY-142, STORY-144 y STORY-145). Esas seis pueden ejecutarse en paralelo una vez fijado el contrato. STORY-143 (validación end-to-end) depende de que estén completas.
- **Origen:** la épica surge del análisis comparativo de los templates de reporte de los skills de validación. Se detectaron tres divergencias: la ubicación del veredicto (al inicio, al final o ausente), el idioma y el formato del valor (`APPROVED` / `APROBADA` / `approved` / `ACCEPTANCE-APPROVED`) y el nombre del campo (`verdict` / `decision` / `review-status` / `final-status`). `story-analyze` no declara veredicto, solo un «Estado general» en el texto.
- **Decisión de vocabulario:** valores en inglés y en mayúsculas, separados con guion ASCII (`NEEDS-REFINEMENT`). Así son consistentes con `epic-analyze`, que ya usa `APPROVED` / `NEEDS-REFINEMENT`, y compatibles con máquinas de estado y pipelines CI.
- **Semántica de los valores de rechazo:** `NEEDS-REFINEMENT` indica que un artefacto de especificación (épica o historia) debe refinarse antes de avanzar. `NEEDS-CHANGES` indica que un artefacto de planificación o de implementación fue rechazado o sus pruebas fallaron: debe corregirse, y el flujo vuelve al paso que lo produjo. No son alias: cada gate emite solo uno de los dos.
- **`BLOCKED`:** un bloqueo impide completar el proceso; no es un defecto del artefacto. Ejemplos: en `story-verify`, las pruebas no se pueden ejecutar; en `story-acceptance`, un criterio queda bloqueado. Lo que falla o se rechaza es `NEEDS-CHANGES`; lo que no se pudo evaluar es `BLOCKED`. Si en un mismo reporte hay a la vez algo rechazado y algo bloqueado, gana `NEEDS-CHANGES`. En el flowchart de ejecución y QA, la rama `BLOCKED` vuelve al mismo gate: el flujo se detiene y, una vez despejado el bloqueo, se vuelve a ejecutar ese gate (decisión del PO, 2026-10-18).
- **Decisión semántica en VERIFY y ACCEPTANCE:** `RECHAZAR` (`story-verify`) y `ACCEPTANCE-REJECTED` (`story-acceptance`) se reemplazan por `NEEDS-CHANGES`. En esas fases el artefacto ya existe (código y pruebas ejecutadas), así que un fallo se resuelve iterando y no reiniciando. En `story-evaluation`, `RECHAZAR` se mapea a `NEEDS-REFINEMENT` porque la historia «no es viable en su forma actual».
- **Extensiones locales:** `SPLIT` solo aplica a `story-evaluation` (historia demasiado grande). `PENDING` solo aplica a `story-acceptance`, mientras la sesión de validación está a medias (`session-status: partial`).
- **`epic-analyze` deja de emitir `BLOCKED`:** hoy lo emite con hallazgos ERROR de integridad o de cobertura, que son defectos de la épica y no un bloqueo del proceso. Pasa a emitir `NEEDS-REFINEMENT`, y la severidad sigue legible en `errors` / `warnings` del frontmatter. Su único consumidor previsto, `epic-validate` (EPIC-23), solo comprueba `APPROVED`, así que el cambio no lo afecta.
- **`epic-validate` (EPIC-23):** adopta este contrato con `APPROVED` / `NEEDS-CHANGES` / `BLOCKED` (decisión del PO, 2026-10-17). El skill aún no existe; EPIC-23 lo construye ya alineado.
- **Riesgo:** se romperá cualquier consumidor externo (agentes, scripts, pipelines) que hoy dependa de `decision: APROBADA`, `review-status: approved`, `final-status: ACCEPTANCE-*` o del veredicto al final del reporte. Mitigación: documentar el cambio en `docs/policies/validation-contract-policy.md` y en el README.
