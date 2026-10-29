---
alwaysApply: false
type: design
id: STORY-173
slug: STORY-173-cubrir-criterios-salida-epica-design
title: "Design: Skill epic-refine: asignar la cobertura de criterios de salida"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-173
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-173-cubrir-criterios-salida-epica
  - STORY-165-corregir-indice-y-enlaces-epica
  - STORY-174-corregir-referencias-obsoletas-tras-split
  - EPIC-23-completar-flujo-de-epic
---

<!-- Referencias -->
[[STORY-173-cubrir-criterios-salida-epica]] · [[STORY-165-corregir-indice-y-enlaces-epica]] · [[STORY-174-corregir-referencias-obsoletas-tras-split]] · [[EPIC-23-completar-flujo-de-epic]]

## Context

STORY-173 amplía el skill `epic-refine` que crea STORY-165. Su diseño (`specs/flow/STORY-165-corregir-indice-y-enlaces-epica/design.md`) ya fija lo que esta historia reutiliza sin cambios: invocación `/epic-refine <epica> [--auto]` y gate por `verdict` (D-2), extracción de bloques `H-NNN` y revalidación contra el filesystem (D-3), tabla de enrutamiento código → tratamiento como único punto de extensión (D-4), plan consolidado `C-NN │ Origen │ Archivo │ Ubicación │ Operación │ Antes │ Después` (D-6), escritura con `.bak`, relectura y restauración global (D-7), `epic-refine-report.md` sin veredicto (D-8) y contenido no confiable (D-9). En la versión de STORY-165, SAL-01 y SAL-02 se enrutan a «fuera de alcance · PO» con la nota «lo asigna STORY-173».

Estado verificado del que parte el diseño:

- **`skills/epic-refine/` aún no existe** (`ls skills/`): STORY-165 está en `PLAN`. Esta historia se implementa después de STORY-165 (nota de la historia) y modifica los archivos que esa historia crea.
- **Hallazgos SAL de entrada** (`skills/epic-analyze/SKILL.md` Paso 5b): SAL-01 (ERROR, criterio de salida sin cobertura; **Elemento** = texto literal del criterio) y SAL-02 (WARNING, smoke test sin cobertura; **Elemento** = `SMOKE-<N>` + nombre). Su **Evidencia** es `epic.md:<línea>` y, si las hay, las evidencias parciales con la forma `parcial: STORY-NNN › AC-<n> · story.md:<línea>` (verificado en `specs/flow/EPIC-23-completar-flujo-de-epic/epic-analyze-report.md:137`). La etiqueta `CS-<n>` es posicional del reporte (columna de la sección `cobertura-salida`), no un ID de la épica.
- **Reglas de evidencia** (Paso 5b.2 de `epic-analyze`): E1 = mención explícita (smoke: token `SMOKE-<N>` con límite de palabra; criterio: texto completo normalizado como subcadena de una línea normalizada del cuerpo, fuera del frontmatter y de una sección `## Fuera de alcance…`). E2 = un `### AC-<n>` cuyo `Entonces` (o `Y`/`Pero` siguiente) afirma el mismo resultado observable; si afirma solo una parte, es `parcial` y no cubre. Un elemento está cubierto con ≥ 1 evidencia no parcial; las parciales de varias historias no se suman.
- **El índice de `epic.md` no declara dependencias:** las formas F1/F2/F3 (`docs/templates/epic-template.md`, sección `historias`) son `- [ ] **STORY-NNN** — <Nombre>: <descripción>`. La convención del repositorio para dependencias duras es la línea `depends-on: STORY-NNN` en el cuerpo del `story.md` (STORY-149, STORY-156 y STORY-158 en `specs/flow/`; `story-refine` la recomienda en `STORY-156/story-refinement-log.md:22`).
- **Precedente manual:** `specs/flow/EPIC-26-layout-y-flow-forward-mejorado/epic-refine-report.md` resolvió cinco SAL-01 a mano con el mismo patrón que propone la historia: «Dueño único: cita E1» y «Criterio global: AC de cierre + cita E1» en la historia de cierre (STORY-157), y descartó «citar CS-2 en cada historia de migración» porque «la cita falsearía la cobertura».
- **Escritores del `story.md`:** `docs/templates/story-template.md` (idéntico a su seed `skills/story-creation/assets/story-template.md`) declara los escritores de `## ✅ Criterios de aceptación` y `## 📎 Notas / contexto adicional`; ninguno nombra a `epic-refine`.

## Goals / Non-Goals

**Goals:**
- Para cada SAL-01 / SAL-02 con evidencia `parcial`, elegir una única historia de cierre con la regla determinista «la única candidata sin dependientes en el índice» y escribir **solo en ella** un AC de cierre y una cita E1 del elemento // satisface: AC-1, CNF-2
- Registrar cada asignación en `epic-refine-report.md` con la forma `SAL-01 · CS-1 → STORY-302` // satisface: AC-1
- Llevar a «fuera de alcance · PO» los SAL sin evidencia `parcial`, con empate o sin candidata, sin escribir ninguna cita // satisface: AC-2, CNF-2
- Respaldar como `story.md.bak` cada `story.md` modificado y escribir en UTF-8 sin BOM, reutilizando D-7 de STORY-165 // satisface: CNF-1, CNF-3
- Detallar la familia SAL en `skills/epic-refine/references/sal-corrections.md`, cargado solo si hay SAL corregibles; el cuerpo del `SKILL.md` sigue < 500 líneas // satisface: CNF-4

**Non-Goals:**
- Modificar o retirar criterios de salida o smoke tests de `epic.md` (decisión del PO): esta historia no escribe `epic.md`.
- Crear una historia nueva para un criterio sin evidencia (delega en `/epic-generate-stories`).
- Corregir índice y `related` (STORY-165) o referencias obsoletas tras `/story-split` (STORY-174).
- Tratar SAL-03 y SAL-04: siguen siempre en «fuera de alcance · PO» (tabla D-4 de STORY-165, sin cambios).
- Cambiar `skills/epic-analyze/`: se consume su reporte tal cual.
- Cambiar `status` o `substatus` de ningún `story.md` (CS-15).

## Decisions

### D-1 — Extensión por fila de enrutamiento + catálogo `sal-corrections.md` // satisface: AC-1, AC-2, CNF-4

Cambios en `skills/epic-refine/` (archivos creados por STORY-165):

| Archivo | Acción | Cambio | AC |
|---|---|---|---|
| `skills/epic-refine/SKILL.md` | modificar | Tabla de enrutamiento (D-4 de STORY-165): la fila `SAL-01, SAL-02 · Fuera de alcance en esta versión · PO (nota: «lo asigna STORY-173»)` pasa a `SAL-01, SAL-02 · Asignación de cobertura a la historia de cierre · PO en los casos de D-4 · sal-corrections.md`. Restricciones: añadir la regla CNF-2 (D-5). `description`: añadir «asigna la cobertura de criterios de salida y smoke tests» sin superar 500 caracteres. Ningún Paso nuevo | AC-1, AC-2, CNF-2, CNF-4 |
| `skills/epic-refine/references/sal-corrections.md` | crear | Detalle de SAL-01/SAL-02: extracción de candidatas, revalidación, regla de la historia de cierre, forma del AC de cierre y de la cita E1, posiciones de inserción, casos «fuera de alcance» (D-2 a D-5) | AC-1, AC-2, CNF-2, CNF-4 |
| `skills/epic-refine/assets/epic-refine-report-template.md` | modificar | Comentario de la sección `hallazgos`: forma de **Elemento** para SAL (D-6); sin columnas ni secciones nuevas | AC-1, AC-2 |
| `skills/epic-refine/README.md` | modificar | Capacidades: añadir SAL-01/SAL-02 | CS-12 |
| `skills/epic-refine/evals/evals.json` | modificar | Casos TC-009…TC-013 (D-8) | AC-1, AC-2, CNF-1, CNF-2 |
| `skills/epic-refine/examples/<caso>/` | crear | Fixtures SAL (D-8) | AC-1, AC-2 |

El Paso 4 de STORY-165 ya carga `references/<familia>-corrections.md` solo si el reporte contiene un código corregible de esa familia: con SAL-03/SAL-04 solos, o sin SAL, `sal-corrections.md` no se lee.

| Alternativa | Motivo del rechazo |
|---|---|
| Un Paso nuevo «Asignar cobertura» en el `SKILL.md` | STORY-165 D-4 fija la tabla como único punto de extensión; un Paso por familia alargaría el cuerpo y duplicaría plan, backup y reporte (CNF-4). |
| Script Node que calcule la historia de cierre | La regla es determinista pero opera sobre texto Markdown ya leído por el skill; ningún corrector del repositorio usa script (STORY-165 D-1) y añadiría CLI y pruebas propias. |
| Delegar en `/story-refine` la escritura del AC | `story-refine` aplica recomendaciones FINVEST a una historia; no conoce el contrato de salida de la épica y exigiría una invocación por historia. |

### D-2 — Extracción y revalidación de un hallazgo SAL // satisface: AC-1, AC-2, CNF-2

Para cada `HallazgoAnalisis` con código SAL-01 o SAL-02 (D-3 de STORY-165):

1. **Etiqueta del elemento:** SAL-01 → `CS-<n>` de la fila de la sección `cobertura-salida` del reporte cuya línea en `epic.md` coincide con la de **Evidencia**; si no hay fila, la posición del criterio en la sección `criterios-salida` de `epic.md` (misma regla posicional que `epic-analyze` Paso 5b.1). SAL-02 → el `SMOKE-<N>` de **Elemento**.
2. **Elemento vigente:** se relee el elemento en `epic.md` (criterio: línea de nivel superior cuyo texto normalizado coincide con **Elemento**; smoke: encabezado `### SMOKE-<N>`). Si ya no figura → **ya resuelto** con nota `el elemento ya no figura en epic.md`.
3. **Cobertura vigente:** si algún `story.md` activo del universo de la épica (`parent` con prefijo `EPIC_ID`, resuelto por glob como en STORY-165 D-3) contiene ya una mención E1 del elemento según la regla E1 de `epic-analyze` → **ya resuelto**. Solo se revalida E1 (determinista); E2 es juicio y no se re-evalúa. Así una re-ejecución tras escribir el AC de cierre y la cita no vuelve a escribir (idempotencia).
4. **Candidatas:** los `STORY-NNN` de las evidencias `parcial:` de **Evidencia**, resueltos de nuevo por glob (`specs/flow/<STORY-NNN>-*/story.md`). Se descartan, con nota, las archivadas (`historia archivada: registro histórico`), las `CANCELED` y las que ya no tienen `parent` con prefijo `EPIC_ID`. La ruta de la evidencia nunca se usa para escribir.

Sin candidatas tras el paso 4 → D-4, caso «sin evidencia parcial».

### D-3 — Regla de la historia de cierre: única candidata sin dependientes // satisface: AC-1, AC-2

- **Índice:** las historias de las líneas F2/F3 (`**STORY-NNN**`) de nivel superior de la sección `historias` de `epic.md` (localizada por `clave:` como en STORY-165).
- **Dependiente de X:** una historia del índice, distinta de X, cuyo `story.md` activo contiene en el cuerpo (fuera del frontmatter y de una sección `## Fuera de alcance…`) una línea con el token `depends-on:` seguido de una lista que incluye `X` con límite de palabra (admite comillas invertidas, comas y la anotación `(dura)` que usa el repositorio).
- **Historia de cierre:** entre las candidatas de D-2, la **única** sin dependientes. AC-1: STORY-302 declara `depends-on: STORY-301`, así que STORY-301 tiene un dependiente y STORY-302 es la historia de cierre.
- **Sin una única historia de cierre** (todas tienen dependientes, o varias no tienen ninguno) → «fuera de alcance · PO» (D-4).

| Alternativa | Motivo del rechazo |
|---|---|
| Desempatar varias candidatas sin dependientes por el mayor `STORY-NNN` (propuesta no vinculante de la historia) | La regla de las Notas fija «si ninguna o varias cumplen la regla, el hallazgo va al PO»; elegir por numeración asignaría la cobertura a una historia que puede no verificar el resultado final (CNF-2). |
| Inferir la dependencia del orden de las líneas del índice | El orden del índice agrupa por fase, no declara dependencias (EPIC-23 lista STORY-165, 173, 174 en orden de ID, y 173 y 174 son independientes). |
| Inferir dependencias de frases libres («se implementa después de STORY-165») | No determinista; la convención explícita del repositorio es `depends-on:`. |
| Usar `related` como relación de dependencia | `related` es simétrico y no expresa orden. |

### D-4 — Casos «fuera de alcance» de la familia SAL // satisface: AC-2, CNF-2

Siempre responsable `PO`, con la **Acción sugerida** del reporte copiada literal y una nota de motivo:

| Caso | Nota |
|---|---|
| Sin evidencia `parcial` (AC-2) | `sin evidencia parcial: crea o ajusta una historia con /epic-generate-stories o retira el elemento de epic.md` |
| Todas las candidatas tienen dependientes | `ninguna candidata sin dependientes: STORY-a, STORY-b` |
| Varias candidatas sin dependientes | `varias candidatas sin dependientes: STORY-a, STORY-b` |
| La historia de cierre está en `IMPLEMENT` o posterior (`CODE-REVIEW`, `VERIFY`, `ACCEPTANCE`, `DELIVER`, `COMPLETED`) | `STORY-NNN ya está implementada: añadir un AC reabre su alcance` |
| El `story.md` de la historia de cierre no tiene la sección `## ✅ Criterios de aceptación` o ningún `### AC-<n>` | `STORY-NNN sin sección de criterios de aceptación reconocible` |
| El smoke test (SAL-02) no tiene bloque `gherkin` con `Entonces` | `SMOKE-<N> sin resultado reconocible en epic.md` |

En ningún caso de esta tabla se escribe un `story.md`. Si la historia de cierre está en `PLAN` o `READY-FOR-IMPLEMENT`, la asignación **sí** se aplica y el resumen final añade `Replanifica: /story-plan STORY-NNN` (su `design.md`, `tasks.md` y `analyze.md` no cubren el AC nuevo); `status` y `substatus` no se tocan (CS-15).

| Alternativa | Motivo del rechazo |
|---|---|
| Aplicar también a historias implementadas | El AC nuevo no tendría implementación ni verificación; falsearía la cobertura (CNF-2). |
| Rechazar también las historias en `PLAN` / `READY-FOR-IMPLEMENT` | `epic-refine` corre en el `PLAN` de la épica, cuando sus historias suelen estar en `SPECIFY` o `PLAN` (EPIC-23 hoy); el skill quedaría sin uso real. La replanificación se recomienda explícitamente. |

### D-5 — Escritura en la historia de cierre: AC de cierre + cita E1 // satisface: AC-1, CNF-1, CNF-2, CNF-3

Regla CNF-2 (Restricciones del `SKILL.md`): una cita E1 o un AC nuevo solo se escriben en **una** historia por elemento, la historia de cierre, y **siempre juntos**: el AC hace que la historia verifique el elemento completo y la cita E1 lo hace visible a `epic-analyze`. Nunca se escribe una cita sin AC ni se cita el elemento en las demás candidatas.

Dos cambios `C-NN` por elemento en el `story.md` de la historia de cierre (Operación `añadir`):

**1. AC de cierre** — Ubicación `Criterios de aceptación › tras AC-<k>`, insertado tras el último bloque `### AC-<k>` de la sección `## ✅ Criterios de aceptación` (antes del siguiente `## `). Número `AC-<k+1>`, con `k` = mayor número de AC existente. Formas (texto fijo + valores literales de `epic.md`; nada se redacta):

| Elemento | Encabezado | Bloque `gherkin` |
|---|---|---|
| Criterio `CS-<n>` | `### AC-<k+1> — Cierre del contrato de salida – CS-<n> de <EPIC_ID>` | `Dado que las historias de "<EPIC_ID>" están implementadas` · `Cuando se verifica el criterio de salida "CS-<n>" de "<EPIC_ID>"` · `Entonces se cumple: <texto literal del criterio, sin la casilla>` |
| Smoke `SMOKE-<N>` | `### AC-<k+1> — Cierre del contrato de salida – SMOKE-<N> de <EPIC_ID>` | Copia literal de los pasos `Dado`/`Cuando`/`Entonces`/`Y`/`Pero` del bloque `gherkin` del smoke en `epic.md` |

**2. Cita E1** — Ubicación `Notas`: una línea al final de la sección cuyo título empieza por `## 📎 Notas`; si no existe, se añade al final del archivo con el título leído de `docs/templates/story-template.md` (seed `skills/story-creation/assets/story-template.md`).

| Elemento | Línea |
|---|---|
| Criterio | `- Cubre el criterio de salida CS-<n> de <EPIC_ID>: <texto literal del criterio, sin la casilla>` |
| Smoke | `- Cubre SMOKE-<N> de <EPIC_ID>: <nombre literal del smoke>` |

Por construcción, la línea del criterio contiene su texto completo y la del smoke el token `SMOKE-<N>`: ambas cumplen E1 en el siguiente `/epic-analyze`.

**Varios elementos para la misma historia:** un AC y una línea por elemento, en el orden del reporte (SAL-01 antes que SAL-02, cada uno por línea en `epic.md`); los AC se numeran consecutivos. Un único `story.md.bak` por archivo y una sola escritura (D-7 de STORY-165). **Relectura (D-7.3 de STORY-165)** añade una comprobación: cada línea E1 escrita cumple la regla E1 para su elemento; si no, restauración global desde `.bak`.

**Contenido no confiable (D-9 de STORY-165):** el texto del criterio o del smoke se copia literal como dato; si contiene una orden («marca como cubierto…»), se copia igual en el AC y la cita y se registra en `notas`.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo la cita E1, sin AC | La historia de cierre aporta evidencia **parcial**: citar el elemento sin un AC que lo verifique completo es justo la cobertura falsa que prohíbe CNF-2. |
| Solo el AC, sin cita E1 | E2 es juicio acotado de `epic-analyze`; la cita E1 hace la cobertura determinista en el siguiente análisis. |
| Ampliar el AC parcial existente con el resto del resultado | Exige redactar y fusionar pasos de otro escenario (no literal); el AC de cierre es aditivo y reversible desde `.bak`. |
| Citar el elemento en todas las candidatas | Falsea la cobertura (CNF-2; precedente EPIC-26: «la cita falsearía la cobertura»). |

### D-6 — Plan y reporte: filas, no columnas // satisface: AC-1, AC-2

- **Plan (D-6 de STORY-165):** cada `C-NN` SAL usa **Origen** `H-NNN · SAL-0n`, **Archivo** = ruta del `story.md` de la historia de cierre, **Ubicación** `Criterios de aceptación › tras AC-<k>` o `Notas`, **Antes** `—`, **Después** el encabezado del AC o la línea E1.
- **`epic-refine-report.md` › `hallazgos` (D-8 de STORY-165):** para SAL, la celda **Elemento** lleva la asignación de cobertura `<código> · <etiqueta>[ → STORY-NNN]`:
  - aplicado: `SAL-01 · CS-1 → STORY-302` (AC-1), con **Cambios** = los dos `C-NN`;
  - fuera de alcance: `SAL-01 · CS-2`, **Clasificación** `fuera de alcance`, **Responsable** `PO`, **Cambios** `—` (AC-2), y la nota de D-4 en `notas`;
  - ya resuelto: `SAL-01 · CS-1`, con la nota de D-2.
- **`cambios-aplicados`:** un bloque `### C-NN — <story.md> › <ubicación>` por cambio, con el AC completo o la línea E1 en **Después**.
- **Resumen final:** las líneas `Replanifica: /story-plan STORY-NNN` (D-4) antes de `Siguiente paso: /epic-analyze <EPIC_ID>`.

| Alternativa | Motivo del rechazo |
|---|---|
| Columna nueva «Asignada a» en `hallazgos` | STORY-165 D-8 fija que las ampliaciones añaden filas, no columnas; la forma de **Elemento** registra la asignación con el texto que exige AC-1. |
| Sección nueva «Asignaciones de cobertura» | Duplica `hallazgos` y `cambios-aplicados`. |

### D-7 — Escritores de los templates de historia // satisface: AC-1 (veracidad), CS-12

| Componente | Cambio |
|---|---|
| `docs/templates/story-template.md` y `skills/story-creation/assets/story-template.md` | Añadir `epic-refine (AC de cierre del contrato de salida, SAL-01/SAL-02)` al `escritor:` de `## ✅ Criterios de aceptación` y `epic-refine (cita E1 del contrato de salida)` al de `## 📎 Notas / contexto adicional`; ambos archivos quedan idénticos (la igualdad se comprueba igual que en STORY-165 V-10) |
| `docs/guides/sddf-commands-pipeline.md` §2 | La fila de `epic-refine` que descomenta STORY-165 pasa a incluir la asignación de cobertura de criterios de salida y smoke tests |
| `docs/templates/epic-template.md` y seed | Sin cambios: esta historia no escribe `epic.md` |
| `skills/epic-analyze/` | Sin cambios: su **Acción sugerida** de SAL-01/SAL-02 ya contempla «citar el criterio en su `story.md`» |
| `package.json › files` | Sin cambios: `skills/` ya se publica completo |

### D-8 — Evals y fixtures // satisface: AC-1, AC-2, CNF-1, CNF-2

Fixtures nuevos en `skills/epic-refine/examples/` (cada uno un `specs/flow/` mínimo con `EPIC-30-ejemplo/`, todas las historias en `SPECIFY/DONE` salvo indicación):

| Fixture | Contenido | `epic-analyze-report.md` |
|---|---|---|
| `cobertura-cierre/` | Índice con STORY-301 y STORY-302 en F2; STORY-302 con `depends-on: STORY-301` en Notas; ambas con un AC que afirma parte de `CS-1` | `NEEDS-REFINEMENT`; H-001 SAL-01 `CS-1` con `parcial: STORY-301 › AC-1 …` y `parcial: STORY-302 › AC-1 …` |
| `cobertura-sin-parcial/` | Índice con STORY-301 y STORY-302; ninguna menciona `CS-2` | `NEEDS-REFINEMENT`; H-001 SAL-01 `CS-2` sin evidencias parciales |
| `cobertura-empate/` | Como `cobertura-cierre/`, sin `depends-on` | Igual que `cobertura-cierre/` |
| `cobertura-reejecucion/` | Estado tras aplicar `cobertura-cierre/`: STORY-302 ya tiene el AC de cierre y la línea E1 | Igual que `cobertura-cierre/` (reporte anterior a la escritura) |
| `cobertura-smoke-implementada/` | `SMOKE-2` con parcial solo en STORY-303, en `IMPLEMENT/DONE` | `NEEDS-REFINEMENT`; H-001 SAL-02 `SMOKE-2` |

Casos nuevos en `skills/epic-refine/evals/evals.json` (versión `1.1.0`):

| Caso | AC | Modo | Esperado (`contains` / `not_contains`) |
|---|---|---|---|
| TC-009 | AC-1, CNF-1 | `--auto` sobre `cobertura-cierre/` | `SAL-01 · CS-1 → STORY-302`, `aplicado`, `story.md.bak` de STORY-302, `Cubre el criterio de salida CS-1`, `Cierre del contrato de salida` en STORY-302 / `CS-1` nuevo en STORY-301, `story.md.bak` de STORY-301, `epic.md.bak` |
| TC-010 | AC-2 | `--auto` sobre `cobertura-sin-parcial/` | `SAL-01 · CS-2`, `fuera de alcance`, `PO`, `sin evidencia parcial` / `story.md.bak`, `Cubre el criterio de salida CS-2` |
| TC-011 | D-3 | `--auto` sobre `cobertura-empate/` | `varias candidatas sin dependientes`, `PO` / `story.md.bak` |
| TC-012 | D-2 | `--auto` sobre `cobertura-reejecucion/` | `ya resuelto`, `SAL-01` / segundo `Cierre del contrato de salida` en STORY-302 |
| TC-013 | D-4, CS-15 | `--auto` sobre `cobertura-smoke-implementada/` | `ya está implementada`, `PO`, `status: IMPLEMENT` / `story.md.bak` |

Los evals se ejecutan a criterio humano (`npm run test:eval -- epic-refine`, AGENTS.md).

### Componentes afectados

| Componente | Acción | Ubicación | AC |
|---|---|---|---|
| Skill corrector de épica (enrutamiento, restricción CNF-2, `description`) | modificar | `skills/epic-refine/SKILL.md` | AC-1, AC-2, CNF-2, CNF-4 |
| Catálogo de la familia SAL | crear | `skills/epic-refine/references/sal-corrections.md` | AC-1, AC-2, CNF-4 |
| Template del reporte de refinamiento | modificar | `skills/epic-refine/assets/epic-refine-report-template.md` | AC-1, AC-2 |
| Ficha del skill | modificar | `skills/epic-refine/README.md` | CS-12 |
| Evals y fixtures SAL | modificar / crear | `skills/epic-refine/evals/evals.json`, `skills/epic-refine/examples/cobertura-*/` | AC-1, AC-2, CNF-1, CNF-2 |
| Template de historia (central + seed) | modificar | `docs/templates/story-template.md`, `skills/story-creation/assets/story-template.md` | AC-1 (veracidad de escritores) |
| Guía de pipeline | modificar | `docs/guides/sddf-commands-pipeline.md` §2 | AC-1 |
| Gate de integridad | sin cambios (consumido) | `skills/epic-analyze/` | AC-1, AC-2 |

### Interfaces y contratos

| Interfaz | Contrato | AC |
|---|---|---|
| Reporte de análisis → `epic-refine` (SAL) | Bloque `H-NNN` SAL-01/SAL-02: **Elemento** (texto del criterio o `SMOKE-<N>` + nombre), **Evidencia** `epic.md:<línea>` + `parcial: STORY-NNN › AC-<n> · story.md:<línea>`; fila de `cobertura-salida` para la etiqueta `CS-<n>` | AC-1, AC-2 |
| `story.md` → regla de cierre | Línea `depends-on: STORY-NNN[, …]` en el cuerpo; `status` del frontmatter | AC-1 |
| `SKILL.md` → `sal-corrections.md` | Leído solo en el Paso 4 si hay SAL-01/SAL-02 en el reporte | CNF-4 |
| `epic-refine` → `story.md` de cierre | AC `### AC-<k+1> — Cierre del contrato de salida – <etiqueta> de <EPIC_ID>` + línea E1 en Notas; `story.md.bak` previo; una escritura | AC-1, CNF-1, CNF-2, CNF-3 |
| `epic-refine` → `epic-refine-report.md` | Fila de `hallazgos` con **Elemento** `<código> · <etiqueta>[ → STORY-NNN]` | AC-1, AC-2 |
| `epic-refine` → usuario | `Replanifica: /story-plan STORY-NNN` por cada historia de cierre en `PLAN` / `READY-FOR-IMPLEMENT`; `Siguiente paso: /epic-analyze <EPIC_ID>` | AC-1 |

### Flujos clave

- **F-1 Asignar a la historia de cierre (AC-1):** reporte `NEEDS-REFINEMENT` → H-001 SAL-01 `CS-1` → cargar `sal-corrections.md` → `CS-1` vigente y sin E1 → candidatas STORY-301, STORY-302 → STORY-302 declara `depends-on: STORY-301` → historia de cierre STORY-302 (en `SPECIFY`) → plan `C-01 STORY-302/story.md › Criterios de aceptación › tras AC-2 · añadir`, `C-02 … › Notas · añadir` → `--auto` → `story.md.bak` de STORY-302 → escritura → relectura (status intacto, E1 válida) → reporte `SAL-01 · CS-1 → STORY-302 │ aplicado` → `/epic-analyze EPIC-30` cubre `CS-1` por E1.
- **F-2 Sin evidencia parcial (AC-2):** H-001 SAL-01 `CS-2` sin `parcial:` → «fuera de alcance · PO» con nota → sin `C-NN` → solo `epic-refine-report.md` con `SAL-01 · CS-2` (D-6 de STORY-165).
- **F-3 Empate o sin candidata (D-3):** varias o ninguna sin dependientes → «fuera de alcance · PO» con las candidatas en la nota.
- **F-4 Re-ejecución (D-2):** STORY-302 ya contiene la línea E1 de `CS-1` → «ya resuelto» → sin escritura; su `.bak` previo se conserva.
- **F-5 Degradación (P7):** sección de criterios de aceptación no reconocible, smoke sin `Entonces` o historia implementada → «fuera de alcance · PO»; relectura fallida → restauración global (D-7 de STORY-165); ausencia de `sal-corrections.md` → `❌ Catálogo references/sal-corrections.md no encontrado` antes de escribir.
- **Puntos de cambio (P6):** otra convención de dependencias → solo D-3 en `sal-corrections.md`; otra forma del AC de cierre → solo D-5; nueva forma de evidencia en `epic-analyze` → solo D-2.

## Decisiones de complejidad justificada

- **Regla «única sin dependientes» con `depends-on:` y empate al PO:** es la regla mínima que identifica la historia que verifica el resultado final sin juicio del agente; la alternativa más simple (cualquier candidata, o la de mayor ID) viola CNF-2.
- **AC de cierre + cita E1 juntos:** dos inserciones por elemento en lugar de una, porque cada una sola falsea la cobertura (solo cita) o la deja al juicio de E2 (solo AC).
- **Revalidar solo E1:** basta para la idempotencia, ya que el skill siempre escribe E1; re-evaluar E2 reintroduciría juicio y podría divergir de `epic-analyze`.
- **Aplicar a historias en `PLAN`/`READY-FOR-IMPLEMENT` con aviso de replanificación:** sin ello el skill no sirve en el `PLAN` de la épica; el aviso cubre el desfase del plan sin cambiar estados (CS-15).

## Contratos de verificación

| # | Criterio | Método | AC |
|---|---|---|---|
| V-1 | Solo STORY-302 recibe el AC de cierre y la cita de `CS-1`; reporte con `SAL-01 · CS-1 → STORY-302` | Eval TC-009 | AC-1 |
| V-2 | Sin evidencia parcial: `SAL-01 · CS-2` fuera de alcance con `PO` y ningún `story.md` cita `CS-2` | Eval TC-010 | AC-2 |
| V-3 | `story.md.bak` solo en los `story.md` modificados | Eval TC-009 (`not_contains` STORY-301), TC-010 | CNF-1 |
| V-4 | Empate, historia implementada y re-ejecución no escriben citas | Evals TC-011, TC-012, TC-013 | CNF-2 |
| V-5 | UTF-8 sin BOM en archivos creados y modificados | `npm run verify:repository` / revisión de los primeros bytes | CNF-3 |
| V-6 | `SKILL.md` < 500 líneas y detalle SAL en `references/sal-corrections.md` | `wc -l skills/epic-refine/SKILL.md`; revisión | CNF-4 |
| V-7 | Template de historia central = seed tras añadir los escritores | `cmp docs/templates/story-template.md skills/story-creation/assets/story-template.md` | AC-1 |
| V-8 | `npm run verify:repository` y `npm test` en verde | Comandos | CS-21 |

## Risks / Trade-offs

- [STORY-165 cambia su diseño durante su implementación] → esta historia solo depende de la tabla de enrutamiento, el Paso 4 (carga por familia), el plan `C-NN`, D-7 y las secciones del reporte; un cambio en ellos exige revisar D-1 y D-6 antes de implementar.
- [Las épicas existentes no usan `depends-on:` (EPIC-23)] → la mayoría de los SAL con varias candidatas irán al PO por empate; es el comportamiento seguro (CNF-2) y el PO puede añadir `depends-on:` y re-ejecutar.
- [El AC de cierre con `Entonces se cumple: <criterio>` es genérico] → es literal y verificable con el propio criterio; si el PO quiere un escenario más concreto, lo refina con `/story-refine` (el `.bak` conserva el estado previo).
- [El AC añadido a una historia en `READY-FOR-IMPLEMENT` deja su `analyze.md` desactualizado] → aviso `Replanifica: /story-plan STORY-NNN` en el resumen; el skill no cambia estados (CS-15).

## Open Questions

Ninguna. La relación de dependencia (D-3), el desempate (D-3), los estados admitidos (D-4) y la forma del AC y de la cita (D-5) quedan fijados.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-2, D-3, D-5, D-6, F-1, V-1), AC-2 (D-4, D-6, F-2, V-2), CNF-1 (D-5, V-3), CNF-2 (D-3, D-4, D-5, V-4), CNF-3 (D-5, V-5), CNF-4 (D-1, V-6); Non-Goals respetados (no se escribe `epic.md`, no se crean historias, SAL-03/SAL-04 sin cambios).
- **Ambigüedad:** «dependiente» y «historia de cierre» tienen definición determinista (D-3); los casos al PO están enumerados (D-4).
- **Nombres:** «historia de cierre» = única candidata sin dependientes; «candidata» = historia con evidencia `parcial`; «AC de cierre» = `### AC-<k+1> — Cierre del contrato de salida – …`; «cita E1» = línea `- Cubre … de <EPIC_ID>: …`; «asignación» = `<código> · <etiqueta> → STORY-NNN`.
- **Estructura:** sin ciclos (`epic-refine` lee el reporte, `epic.md` y los `story.md`; escribe solo `story.md` de cierre, `.bak` y su reporte). `sal-corrections.md` tiene una única razón de cambio (reglas SAL); el `SKILL.md` solo cambia una fila de enrutamiento y una restricción.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: la historia define la historia de cierre como «la que no tiene dependientes en el índice de `epic.md`», pero las formas F1/F2/F3 del índice no declaran dependencias. El diseño interpreta «dependiente de X» como una historia del índice cuyo `story.md` declara `depends-on: X` (convención existente del repositorio) (D-3).
- **Documento afectado**: story.md (Notas)
- **Acción requerida**: opcionalmente precisar en las Notas de la historia «dependientes = historias del índice que declaran `depends-on:`»; el fixture de AC-1 incluye `depends-on: STORY-301` en STORY-302.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: las Notas contienen la regla «si ninguna o varias cumplen la regla, el hallazgo va al PO» y la propuesta no vinculante «si empatan varias, desempatar por el mayor `STORY-NNN`». El diseño adopta la regla (empate → PO) y rechaza el desempate (D-3, CNF-2).
- **Documento afectado**: design.md
- **Acción requerida**: ninguna en story.md.

### CR-003
- **Tipo**: dependencia
- **Descripción**: la historia no menciona que la historia de cierre puede estar ya planificada o implementada. El diseño aplica la asignación en `SPECIFY`, `PLAN` y `READY-FOR-IMPLEMENT` (con aviso de replanificación) y la lleva al PO desde `IMPLEMENT` (D-4).
- **Documento afectado**: design.md
- **Acción requerida**: ninguna en story.md; documentarlo en `references/sal-corrections.md`.

### CR-004
- **Tipo**: dependencia
- **Descripción**: escribir AC y Notas en un `story.md` obliga a añadir `epic-refine` a los escritores de esas secciones en `docs/templates/story-template.md` y su seed; la historia no lo menciona.
- **Documento afectado**: tasks.md
- **Acción requerida**: incluir la tarea y comprobar la igualdad central = seed.

### CR-005
- **Tipo**: dependencia
- **Descripción**: `skills/epic-refine/` no existe todavía; todos los archivos que esta historia modifica los crea STORY-165.
- **Documento afectado**: tasks.md
- **Acción requerida**: la primera tarea verifica que STORY-165 esté implementada (`skills/epic-refine/SKILL.md` con la tabla de enrutamiento y la fila SAL «lo asigna STORY-173»).
