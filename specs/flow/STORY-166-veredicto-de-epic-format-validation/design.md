---
alwaysApply: false
type: design
id: STORY-166
slug: STORY-166-veredicto-de-epic-format-validation-design
title: "Design: Veredicto de epic-format-validation"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-166
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-166-veredicto-de-epic-format-validation
  - STORY-167-skill-epic-improve
  - EPIC-23-completar-flujo-de-epic
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---

<!-- Referencias -->
[[STORY-166-veredicto-de-epic-format-validation]] · [[STORY-167-skill-epic-improve]] · [[EPIC-23-completar-flujo-de-epic]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

## Context

`skills/epic-format-validation/SKILL.md` (290 líneas) es el gate de `DEFINE`. Hoy:

- Declara `APROBADO`, `REFINAR` o `RECHAZADO` como **texto libre en la consola** (Paso 1 «Manejo de archivo no encontrado» y Paso 5). No persiste nada: «Solo lectura: no escribe ni modifica ningún archivo».
- `RECHAZADO` significa «archivo no encontrado»; no es un juicio sobre la épica.
- `docs/policies/validation-contract-policy.md` (v1.2.0) lo **excluye** en §1 y no tiene fila en §4.
- `docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid` ya modela `epic-format-validation → dec_def{verdict}` con las ramas `NEEDS-REFINEMENT → epic-improve` y `APPROVED → epic-generate-stories`.

Restricción técnica decisiva, verificada en `scripts/verify-validation-contract.js`:

- `parsePolicyContract` exige en cada fila de §4 un skill, un **nombre de reporte** `*.md` y valores que cumplan `^[A-Z]+(-[A-Z]+)*$`.
- `verifyValidationContract` falla con `P-1 … sin entrada en REPORT_TEMPLATES` si un skill de §4 con `SKILL.md` instalado no tiene template de reporte, y valida ese template con `checkReport` (G-01 `verdict` único, G-02 `## Veredicto` primera sección, G-03 vocabulario, G-04 campos heredados).
- El verificador **no** comprueba flowcharts: el invariante de §4 con los diagramas hoy solo se sostiene por revisión.

Consumidores del vocabulario heredado (grep `APROBADO|REFINAR|RECHAZADO` en `skills/`, `docs/`, `scripts/`, `test/`):

| Archivo | Uso |
|---|---|
| `skills/epic-creation/SKILL.md` (líneas 29, 75, 282-317) | Paso 7 ramifica por `APROBADO` / `REFINAR` |
| `skills/epic-creation/evals/evals.json`, `skills/epic-creation/examples/test-0{1,2,3}-*.md` | Esperan `APROBADO` / `REFINAR` |
| `skills/epic-from-project-plan/SKILL.md` (líneas 77, 81) y su `evals/evals.json` (TC-008) | Registra `REFINAR` sin detener el lote |
| `skills/epic-generate-stories/evals/evals.json` (línea 51) | `not_contains: APROBADO` |
| `skills/epic-format-validation/{SKILL.md,README.md,evals/evals.json}` | Emisor y sus 15 evals |
| `docs/requirements/functional/FR-027-validacion-de-formato-de-epica-gate.md` | Requisito con el vocabulario viejo |

Fuera del inventario (no son consumidores de este gate): `story-evaluation/evals` (`REFINAR` de su `decision` heredada), `story-verify/evals` (`RECHAZADO` de su estado interno) y `docs/product/{roadmap,story-map}.md` (estratégicos, excluidos por el verificador).

Precedente reutilizado (P3): `epic-analyze` (alineado en STORY-139) escribe `epic-analyze-report.md` en el directorio de la épica desde `assets/epic-analyze-report-template.md`, se sobrescribe en cada ejecución y tiene fila en §4. Este diseño replica ese patrón.

## Goals / Non-Goals

**Goals:**
- `epic-format-validation` emite `APPROVED` o `NEEDS-REFINEMENT` en `verdict` de un reporte conforme a G-01…G-04 // satisface: AC-1, AC-2, CNF-1
- Cada defecto queda diagnosticado con ubicación y corrección esperada, en una forma que `epic-improve` (STORY-167) consume sin reanalizar // satisface: AC-2
- La épica inexistente termina en error sin veredicto ni reporte // satisface: AC-3
- La policy pasa a v1.3.0: fila en §4, fuera de §1, enlazando el flowchart de épica; `npm run verify:repository` lo comprueba // satisface: AC-4
- Ningún consumidor del repo sigue leyendo `APROBADO` / `REFINAR` / `RECHAZADO` de este gate // satisface: CNF-2
- `SKILL.md` no crece: el formato del reporte sale a `assets/` y se lee bajo demanda // satisface: CNF-3, CNF-4

**Non-Goals:**
- Cambiar las reglas de forma (Pasos 3 y 4: frontmatter, secciones, F1/F2/F3, SMOKE-N).
- Aplicar correcciones en `epic.md` (STORY-167).
- Emitir `BLOCKED` (ver D-3).
- Verificar automáticamente el invariante §4 ↔ flowcharts para todos los skills (ver D-7).
- Alinear la fila prevista de `epic-validate` (ver CR-001).

## Decisions

### D-1 — Persistir `epic-format-validation-report.md` junto a `epic.md` // satisface: AC-1, AC-2, AC-4, CNF-1

El skill escribe `<EPIC_DIR>/epic-format-validation-report.md` (mismo directorio que el `epic.md` validado) cada vez que llega a veredicto, sobrescribiéndolo, y muestra en consola la línea `**Veredicto:**` y la ruta del reporte.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo consola con `APPROVED` / `NEEDS-REFINEMENT` (sin archivo) | G-01 y G-06 exigen leer `verdict` de un frontmatter; §4 exige un nombre de reporte y el verificador un template (`REPORT_TEMPLATES`). Además `epic-improve` tendría que reanalizar la épica (contradice AC-2). |
| Solo consola + cambiar el verificador para admitir filas sin reporte | Abre una excepción al contrato para un único skill y deja a `epic-improve` sin entrada persistente. |
| Escribir el reporte en `.tmp/epic-format-validation/` | `.tmp/` es canal entre subagentes y no se versiona; el gate de `DEFINE` debe dejar evidencia consultable como `epic-analyze-report.md`. |

Consecuencia: la regla «Solo lectura» pasa a «**Escritura acotada:** solo escribe `epic-format-validation-report.md` junto al `epic.md` validado; nunca modifica `epic.md` ni el template». Los invocadores automáticos (`epic-creation`, `epic-from-project-plan`) heredan este efecto sin cambiar su flujo.

### D-2 — Regla de veredicto // satisface: AC-1, AC-2, CNF-1

| Resultado de los Pasos 4a–4d | `verdict` |
|---|---|
| Sin campos/secciones faltantes y sin formato inválido | `APPROVED` |
| Al menos un defecto (cualquier tipo de D-4) | `NEEDS-REFINEMENT` |

No hay más valores. `NEEDS-REFINEMENT` (no `NEEDS-CHANGES`) porque §2 lo reserva a artefactos de especificación (decisión del PO, 2026-10-27).

### D-3 — Errores sin veredicto: épica inexistente, template ausente o inválido // satisface: AC-3

Las tres condiciones que hoy cortan el flujo terminan con un mensaje `❌`, **sin** `verdict`, **sin** reporte y sin las palabras `APPROVED` / `NEEDS-REFINEMENT`:

| Condición | Mensaje (primera línea) | Detalle obligatorio |
|---|---|---|
| Épica no encontrada (Tipo A o B) | `❌ Épica no encontrada: <input>` | `Ruta buscada: <ruta exacta>` (Tipo A) o `Ruta buscada: specs/flow/EPIC-*<término>*/epic.md` (Tipo B) |
| Template ausente (central y fallback) | `❌ Template epic-template.md no encontrado. Ejecuta sddf-init.` (sin cambios) | — |
| Clave duplicada en el template | `❌ Template inválido: clave <clave> duplicada` (sin cambios) | — |

| Alternativa | Motivo del rechazo |
|---|---|
| Emitir `BLOCKED` para épica inexistente | `BLOCKED` no figura en las ramas de `dec_def` del flowchart; añadirlo rompe el invariante de §4 o exige otra rama. Un input erróneo no es un bloqueo del entorno que se resuelva reejecutando el mismo gate. |
| Conservar `RECHAZADO` | Valor heredado fuera del vocabulario (G-03). |

Resuelve la nota abierta de la historia («decidir si además debe emitir `BLOCKED`»): **no**.

### D-4 — Diagnóstico: tabla única de defectos // satisface: AC-2

El reporte lista **todos** los defectos en una sola tabla `## Defectos`, una fila por defecto, en el orden en que se detectan (4a → 4b → 4c → 4d):

| Columna | Contenido |
|---|---|
| `ID` | `D-<n>` correlativo desde 1 |
| `Tipo` | `campo-faltante` · `seccion-faltante` · `formato-historias` · `formato-smoke-tests` |
| `Ubicación` | `frontmatter` · `tras ## <título previo según el template>` (o `al inicio del cuerpo` si es la primera) · `línea <n> (## <título>)` |
| `Encontrado` | `—` para faltantes; texto literal de la línea o encabezado entre comillas invertidas para formato |
| `Corrección esperada` | `añadir <clave>:` · `añadir ## <título> según docs/templates/epic-template.md` · forma F1/F2/F3 · `### SMOKE-N — <nombre>` / bloque `gherkin` con Escenario/Dado/Cuando/Entonces (los mismos textos que hoy da el Paso 5) |

Con `APPROVED`, la sección contiene solo `Sin defectos.`. Si hay algún `seccion-faltante`, el reporte añade `## Migración` con la nota actual (`/memory-system migrate --from=epic-template-v1`); si no, la sección no se escribe.

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener dos bloques de texto (`Secciones/campos faltantes:` y `Formato inválido:`) | Dos formas distintas que `epic-improve` tendría que parsear; la ubicación de una sección faltante no se informa hoy. |
| Un archivo JSON aparte para `epic-improve` | Duplica la fuente de verdad del diagnóstico; el proyecto usa Markdown + frontmatter para todos los reportes. |

La consola conserva los encabezados `Secciones/campos faltantes:` y `Formato inválido:` como resumen legible (los usan los evals vigentes TC-007…TC-013), derivados de la misma tabla.

### D-5 — Template del reporte en `assets/` // satisface: AC-1, AC-2, AC-4, CNF-3, CNF-4

Nuevo `skills/epic-format-validation/assets/epic-format-validation-report-template.md`. El Paso 5 del `SKILL.md` se reduce a: regla D-2, «completa el template» y el resumen de consola; los bloques de salida largos (`APROBADO` / `REFINAR` de ~40 líneas) se eliminan del `SKILL.md`. Objetivo: `SKILL.md` ≤ 290 líneas tras el cambio (hoy 290).

| Alternativa | Motivo del rechazo |
|---|---|
| Formato del reporte inline en `SKILL.md` | Crece el `SKILL.md` y el verificador necesita un archivo de template para `REPORT_TEMPLATES`. |

### D-6 — Policy v1.3.0 // satisface: AC-4, CS-20 (parte de la policy)

Cambios en `docs/policies/validation-contract-policy.md`:

1. §1 «Exclusiones»: retirar `epic-format-validation` (quedan `security-audit` y `fix-directives.md`).
2. §4: nueva fila, primera de la tabla (orden del ciclo: DEFINE antes que PLAN):
   `` | `epic-format-validation` | `epic-format-validation-report.md` | Especificación | `APPROVED`, `NEEDS-REFINEMENT` | [épica](../architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid) | — | ``
3. §4 fila `epic-analyze`: la columna Flowchart pasa de `— (sin flowchart)` al mismo enlace de épica. Sus ramas en el diagrama (`dec_plan`: `NEEDS-REFINEMENT`, `APPROVED`) coinciden con sus valores permitidos, así que el invariante se cumple; esto completa la parte de CS-20 que la épica asigna a STORY-166 (ver CR-001 para `epic-validate`).
4. §5: **sin filas nuevas** — el skill nunca persistió reportes, así que no hay reportes heredados que traducir (CNF-2 se cumple actualizando los consumidores, D-8).
5. §7: nuevo ejemplo `7.7 epic-format-validation` con `verdict: NEEDS-REFINEMENT`.
6. Versión `1.3.0`, `Última actualización` y fila en «Historial de cambios» (STORY-166).

### D-7 — Verificación determinista de AC-4 // satisface: AC-4

- `scripts/verify-validation-contract.js`: añadir `'epic-format-validation': 'skills/epic-format-validation/assets/epic-format-validation-report-template.md'` a `REPORT_TEMPLATES`. Con eso el paso «contrato de validación» comprueba la fila de §4, G-01…G-04 del template, el ejemplo de D-9 y la presencia de `APPROVED` en el `SKILL.md` (regla S-3).
- `test/verify-validation-contract.test.js`:
  - Añadir `epic-format-validation` al mapa `REPORTS` del fixture (si no, todas las pruebas de fixture fallan con `falta epic-format-validation en §4`).
  - Nueva prueba sobre la **policy real** y el **flowchart real**: la fila de `epic-format-validation` existe con `APPROVED`, `NEEDS-REFINEMENT`; §1 no la menciona; la celda Flowchart enlaza `flowchart-skill-epic-flow-relationship.mermaid`; en ese diagrama, desde el nodo de decisión al que apunta `epic-format-validation`, las ramas son exactamente `{APPROVED, NEEDS-REFINEMENT}` y `NEEDS-REFINEMENT` apunta a `epic-improve`.
  - `npm test` es el primer paso de `npm run verify:repository`, así que AC-4 queda cubierto por el comando que la historia nombra.

| Alternativa | Motivo del rechazo |
|---|---|
| Implementar en el verificador el invariante §4 ↔ flowchart para todas las filas | Generaliza más allá de la historia y obliga a resolver primero CR-001 (`epic-validate` con `BLOCKED` sin rama). |
| Verificación solo por revisión humana | AC-4 nombra `npm run verify:repository` como acción verificadora. |

### D-8 — Consumidores del repositorio // satisface: CNF-2

Sustitución semántica, sin cambiar flujos: `APROBADO → APPROVED`, `REFINAR → NEEDS-REFINEMENT`, `RECHAZADO → error ❌ sin veredicto`.

| Archivo | Cambio |
|---|---|
| `skills/epic-creation/SKILL.md` | Línea 29 y 75; Paso 7: «Si el `verdict` es `APPROVED`» / «Si el `verdict` es `NEEDS-REFINEMENT`», leyendo `verdict` del reporte (G-06); tabla de errores |
| `skills/epic-creation/examples/test-0{1,2,3}-*.md` | `APROBADO → APPROVED` |
| `skills/epic-creation/evals/evals.json` | Literales en `contains` / `not_contains` |
| `skills/epic-from-project-plan/SKILL.md` | Paso 77/81: «un `NEEDS-REFINEMENT` se registra, pero no detiene el lote»; el resumen muestra el `verdict` de cada épica |
| `skills/epic-from-project-plan/evals/evals.json` | Literales de TC-008 |
| `skills/epic-generate-stories/evals/evals.json` | `not_contains: APROBADO → APPROVED` |
| `skills/epic-format-validation/README.md` | Vocabulario, reporte producido, «Does not do» (no modifica `epic.md`) |
| `docs/requirements/functional/FR-027-…md` | Veredicto `APPROVED` / `NEEDS-REFINEMENT` en `epic-format-validation-report.md`; la épica inexistente es un error; `updated:` |

`epic-creation` mantiene su corrección interactiva ante `NEEDS-REFINEMENT`; no se le añade `/epic-improve` porque ese skill todavía no existe (STORY-167).

### D-9 — Evals y ejemplo // satisface: AC-1, AC-2, AC-3

`skills/epic-format-validation/evals/evals.json` → versión `3.0.0`:

- TC-001…TC-014: `APROBADO → APPROVED`, `REFINAR → NEEDS-REFINEMENT` en `contains` / `not_contains`; `RECHAZADO` pasa a `not_contains` en todos; los casos `APPROVED` añaden `not_contains: "APROBADO"` (AC-1, segunda cláusula).
- TC-002 se reescribe para AC-3: input `EPIC-77`; `contains: ["EPIC-77", "specs/flow", "Ruta buscada"]`; `not_contains: ["APPROVED", "NEEDS-REFINEMENT", "RECHAZADO"]`.
- TC-015 sin cambios de expectativa salvo `not_contains` de los nuevos valores.
- TC-016 nuevo (AC-2): épica sin `## Criterios de salida` y con una línea de historias inválida → `contains: ["NEEDS-REFINEMENT", "Criterios de salida", "Formato inválido:", <línea literal>, "epic-format-validation-report.md"]`.

Ejemplo: `skills/epic-format-validation/examples/needs-refinement/epic-format-validation-report.md`, el caso de TC-016 completo; el verificador lo valida en modo `report` (valor literal, línea visible = frontmatter).

### Componentes afectados

| Componente | Acción | Ubicación | AC |
|---|---|---|---|
| Gate de formato de épica | modificar | `skills/epic-format-validation/SKILL.md` | AC-1, AC-2, AC-3, CNF-3, CNF-4 |
| Template del reporte de formato | crear | `skills/epic-format-validation/assets/epic-format-validation-report-template.md` | AC-1, AC-2, AC-4 |
| Ejemplo de reporte | crear | `skills/epic-format-validation/examples/needs-refinement/epic-format-validation-report.md` | AC-2, AC-4 |
| Evals del gate | modificar | `skills/epic-format-validation/evals/evals.json` | AC-1, AC-2, AC-3 |
| README del gate | modificar | `skills/epic-format-validation/README.md` | CNF-2 |
| Política de contrato de validación | modificar | `docs/policies/validation-contract-policy.md` | AC-4 |
| Verificador del contrato | modificar | `scripts/verify-validation-contract.js` (`REPORT_TEMPLATES`) | AC-4 |
| Pruebas del verificador | modificar | `test/verify-validation-contract.test.js` | AC-4 |
| Consumidores | modificar | ver D-8 | CNF-2 |
| Requisito FR-027 | modificar | `docs/requirements/functional/FR-027-validacion-de-formato-de-epica-gate.md` | CNF-2 |
| Flowchart de épica | sin cambios | `docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid` | AC-4 |

`package.json › files` no cambia: publica `skills/` completo, incluidos `assets/` y `examples/`.

### Interfaces y contratos

| Interfaz | Contrato | AC |
|---|---|---|
| Invocación | `/epic-format-validation <epica>` (sin cambios: Tipo A ruta, Tipo B término) | AC-1, AC-2, AC-3 |
| Reporte → consumidores | `verdict` del frontmatter de `<EPIC_DIR>/epic-format-validation-report.md` ∈ {`APPROVED`, `NEEDS-REFINEMENT`}; ausente o fuera de ese conjunto = no aprobado (G-06) | AC-1, AC-2, CNF-2 |
| Reporte → `epic-improve` | Tabla `## Defectos` con columnas `ID │ Tipo │ Ubicación │ Encontrado │ Corrección esperada` (D-4) | AC-2 |
| Error → invocador | Mensaje `❌ …`, sin reporte nuevo; un invocador automático lo trata como fallo, no como veredicto | AC-3 |
| Policy → verificador | Fila §4 parseable por `parsePolicyContract` + entrada en `REPORT_TEMPLATES` | AC-4 |

### Esquema del reporte // satisface: AC-1, AC-2

```markdown
---
type: epic-format-validation
id: {EPIC_ID}
slug: {nombre-directorio-epica}-format-validation-report
title: "Epic format validation: {título}"
epic: {EPIC_ID}
verdict: {APPROVED | NEEDS-REFINEMENT}
defects: {n}
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
---
# Validación de formato de épica: {título}

## Veredicto
**Veredicto:** `{veredicto}` — {motivo}

## Resumen
| Métrica | Valor |   (Épica y ruta de epic.md · Template efectivo · Defectos · Fecha)

## Defectos
| ID | Tipo | Ubicación | Encontrado | Corrección esperada |   («Sin defectos.» si APPROVED)

## Migración   (solo si hay algún seccion-faltante)
```

Motivos deterministas: `APPROVED` → `cumple la estructura obligatoria del template epic-template.md`; `NEEDS-REFINEMENT` → `<n> defectos de estructura o formato`. `defects` no es un campo de veredicto (G-04 lo permite, como `errors` en `epic-analyze`). Sin `related:` en el frontmatter: el reporte se identifica por `epic:` y no forma parte del grafo wiki.

### Flujos clave

- **F-1 Épica conforme (AC-1):** resolver input → template → contrato → 4a–4d sin defectos → escribir reporte `APPROVED` → consola: `**Veredicto:** \`APPROVED\` — …` + ruta del reporte.
- **F-2 Épica con defectos (AC-2):** … → 4b registra `seccion-faltante` (Criterios de salida) y 4c `formato-historias` → reporte `NEEDS-REFINEMENT` con D-1, D-2 y `## Migración` → consola: veredicto, `Secciones/campos faltantes:`, `Formato inválido:` y ruta del reporte.
- **F-3 Épica inexistente (AC-3):** Paso 1 sin coincidencias → `❌ Épica no encontrada: EPIC-77` + `Ruta buscada: …` → fin; ningún archivo escrito.
- **F-4 Bucle DEFINE (SMOKE-4, con STORY-167):** F-2 → `/epic-improve` lee `## Defectos` → corrige → F-1 sobrescribe el reporte con `APPROVED`.
- **F-5 Degradación (P7):** si la escritura del reporte falla, el skill muestra el veredicto en consola y `⚠️ No se pudo escribir <ruta>: <causa>`; un invocador automático no encuentra `verdict` y aplica G-06 (no aprobado). Si existía un reporte anterior y la escritura falla, se avisa de que ese reporte es obsoleto.
- **Puntos de cambio (P6):** nuevas reglas de forma → nuevos valores de `Tipo` en D-4 sin tocar el veredicto; nuevo valor de veredicto → policy §4 + flowchart + template (el verificador y la prueba de D-7 lo detectan).

## Decisiones de complejidad justificada

- **Escribir un archivo en un skill hasta ahora de solo lectura:** la alternativa más simple (consola) no cumple G-01/G-06 ni el contrato del verificador, y obligaría a `epic-improve` a reanalizar (D-1).
- **Prueba específica de flowchart en vez de regla general del verificador:** cubre AC-4 con una prueba acotada; la regla general queda para cuando CR-001 se resuelva (D-7).
- **Tabla única de defectos:** reemplaza dos formatos por uno; no añade una capa nueva (D-4).

## Contratos de verificación

| # | Criterio | Método | AC |
|---|---|---|---|
| 1 | Épica conforme → `verdict: APPROVED`, sin `APROBADO`/`REFINAR`/`RECHAZADO` | Evals TC-001, TC-005, TC-006, TC-011, TC-014 (manual, `npm run test:eval -- epic-format-validation`) | AC-1 |
| 2 | Épica con faltante + línea inválida → `NEEDS-REFINEMENT` con ubicación y corrección por defecto | Eval TC-016; ejemplo validado por el verificador | AC-2 |
| 3 | Épica inexistente → error con ruta buscada, sin veredicto | Eval TC-002 | AC-3 |
| 4 | Fila §4, fuera de §1, flowchart con rama `NEEDS-REFINEMENT → epic-improve` | `npm test` (nueva prueba) dentro de `npm run verify:repository` | AC-4 |
| 5 | Template conforme a G-01…G-04 y valor en `^[A-Z]+(-[A-Z]+)*$` | Paso «contrato de validación» de `verify:repository` | AC-4, CNF-1 |
| 6 | Sin `APROBADO`/`REFINAR`/`RECHAZADO` del gate en consumidores | `grep` sobre los archivos de D-8 (revisión de implementación) | CNF-2 |
| 7 | `SKILL.md` ≤ 290 líneas | `wc -l` | CNF-3, CNF-4 |
| 8 | `npm run verify:repository` y `npm test` en verde | Comandos | CS-21 |

## Risks / Trade-offs

- [El gate ahora escribe un archivo en cada invocación, incluidas las automáticas de `epic-creation` y `epic-from-project-plan`] → acotado a un único archivo derivado y sobrescribible en el directorio de la épica, igual que `epic-analyze-report.md`.
- [Los evals de `epic-creation` / `epic-from-project-plan` pueden depender de textos de consola cambiados] → D-8 los actualiza en la misma historia; la ejecución de evals es manual (AGENTS.md).
- [El verificador de leyendas heredadas no detecta `APROBADO`/`REFINAR`/`RECHAZADO`] → se acepta; el contrato de verificación 6 lo cubre por revisión y las evals con `not_contains` lo cubren en ejecución.
- [Reportes `epic-format-validation-report.md` antiguos] → no existen: el skill nunca persistió reportes; por eso §5 no cambia.

## Open Questions

Ninguna. La única ambigüedad de la historia (`BLOCKED` para épica inexistente) queda resuelta en D-3; lo que excede el alcance está en CR-001.

## Autoevaluación (P9, P10)

- **Omisiones:** los 4 AC y los 4 CNF tienen al menos una decisión (D-1…D-9). CS-20 (parte de la policy) cubierto en D-6 salvo `epic-validate` (CR-001).
- **Ambigüedad:** ubicación de una sección faltante definida por el orden del template (D-4).
- **Nombres:** un solo nombre por concepto: «reporte de formato» = `epic-format-validation-report.md`; «defecto» = fila de `## Defectos`.
- **Estructura:** sin ciclos (skill → template; verificador → policy + template; prueba → policy + flowchart). Cada componente tiene una sola razón de cambio. La interfaz hacia consumidores es un único campo (`verdict`) y una tabla.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: CS-20 pide que `validation-contract-policy` registre los gates del flujo de épica de forma coherente con su flowchart. La fila prevista de `epic-validate` declara `APPROVED`, `NEEDS-CHANGES`, `BLOCKED`, pero el diagrama de épica solo tiene ramas `APPROVED` y `NEEDS-CHANGES` desde `dec_val`: enlazar el flowchart hoy rompería el invariante de §4 (solo `PENDING` puede quedar sin rama).
- **Documento afectado**: `docs/policies/validation-contract-policy.md`, `flowchart-skill-epic-flow-relationship.mermaid`; historias de `epic-validate` (STORY-124…128)
- **Acción requerida**: decidir en la historia dueña de `epic-validate` si el diagrama gana la rama `BLOCKED` o la fila la pierde, y enlazar entonces el flowchart. STORY-166 no toca esa fila.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: la historia dice «el resultado declara el veredicto» sin indicar si el resultado se persiste. El diseño decide persistir `epic-format-validation-report.md` (D-1) porque AC-4 exige una fila de §4 (que requiere reporte) y AC-2 exige que `epic-improve` no reanalice.
- **Documento afectado**: story.md (sin cambio obligatorio), STORY-167
- **Acción requerida**: STORY-167 debe leer `## Defectos` y `verdict` de `<EPIC_DIR>/epic-format-validation-report.md`; anotarlo al planificar STORY-167.
