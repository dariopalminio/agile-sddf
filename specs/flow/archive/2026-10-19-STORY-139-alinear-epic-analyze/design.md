---
alwaysApply: false
type: design
id: STORY-139
slug: STORY-139-alinear-epic-analyze-design
title: "Design: Alinear epic-analyze"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-139
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-139-alinear-epic-analyze
  - STORY-138-contrato-de-validacion
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---

<!-- Referencias -->
[[STORY-139-alinear-epic-analyze]] · [[STORY-138-contrato-de-validacion]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Diseño técnico: alinear epic-analyze

## Context

EPIC-25 alinea los skills de validación con el contrato común que publica STORY-138 en
`docs/policies/validation-contract-policy.md`. Esta historia alinea `epic-analyze`, el gate de especificación de épicas.
El contrato que se aplica es el que fija el diseño de STORY-138 (`READY-FOR-IMPLEMENT/DONE`): reglas G-01…G-06 (D-3 y
D-6), fila `epic-analyze` de §4 con `APPROVED`, `NEEDS-REFINEMENT` (D-4), equivalencia `BLOCKED` → `NEEDS-REFINEMENT` de
§5 (D-5) y ejemplo 7.1 (D-9).

**Estado medido el 2026-10-17** (`grep`, lectura de archivos):

| Elemento | Estado actual |
|---|---|
| `skills/epic-analyze/assets/epic-analyze-report-template.md` | l.7 `verdict: {APPROVED \| NEEDS-REFINEMENT \| BLOCKED}`; conserva `errors` y `warnings` (l.8-9). Tras `# Análisis de épica: {título}` (l.18), el primer `##` es `## Resumen` (l.20). El veredicto es una fila de su tabla (l.26), y el comentario guía (l.21) pide además la línea `**Veredicto:** <veredicto> — informativo; …` bajo la tabla. Cada `##` lleva el marcador `<!-- sección obligatoria · clave: … · escritor: epic-analyze -->`. |
| `skills/epic-analyze/SKILL.md` | `BLOCKED` como veredicto en l.19 (Objetivo), l.255 (catálogo MAD), l.271 (Paso 6), l.306 y l.318 (Paso 9) y l.335 (Salida). En l.235 `BLOCKED` es un `substatus` de historia, no un veredicto. El Paso 7 (l.283-289) rellena las secciones por clave, y `resumen` incluye el veredicto (l.285). |
| `skills/epic-analyze/README.md` | l.11: «un veredicto `APPROVED`, `NEEDS-REFINEMENT` o `BLOCKED`». |
| `skills/epic-analyze/evals/evals.json` | 28 casos (`version: 1.2.0`). 11 esperan `BLOCKED` en `contains`: TC-002, TC-003, TC-004, TC-012, TC-014, TC-015, TC-016, TC-017, TC-026, TC-027 y TC-028. Todos tienen ≥ 1 ERROR. La `description` del archivo (l.4) también nombra `BLOCKED`. Ningún caso afirma `## Veredicto`. |
| `docs/domains/domain-skills-map.md` | l.19: «veredicto informativo `APPROVED` / `NEEDS-REFINEMENT` / `BLOCKED`». La historia no lo lista en sus Notas, pero dejarlo así contradice el skill alineado. |
| `scripts/run-evals.js` | Califica solo con subcadenas (`contains`, `not_contains`, `output_contains`, l.654-656); no hay aserciones de orden ni regex. |
| `scripts/check-doc-links.js` | `ACTIVE_ROOTS` (l.17) no incluye `skills/`; `docs/specs` y `CHANGELOG.md` son históricos. |
| Copias de runtime | `.claude/` está en `.gitignore` (l.4); es salida de `agile-sddf install`, no fuente. |
| `docs/policies/validation-contract-policy.md` | Todavía no existe: lo crea STORY-138 (ver D-10). |

**Consumidores del veredicto:** `epic-validate` (EPIC-23, previsto) solo comprueba `APPROVED`. Ningún skill, script ni
test de `test/` lee el valor `BLOCKED` de `epic-analyze` (`grep -rn epic-analyze skills scripts test config`).

## Goals / Non-Goals

**Goals:**

- El reporte declara el veredicto en `verdict` y en `## Veredicto`, la primera sección tras el título, con el mismo
  valor. // satisface: AC-1
- La regla de veredicto emite solo `APPROVED` o `NEEDS-REFINEMENT`. // satisface: AC-1
- El template queda conforme con la policy, sin excepciones registradas. // satisface: AC-2
- `errors` y `warnings` siguen distinguiendo un `NEEDS-REFINEMENT` con ERROR de uno solo con WARNING. // satisface: CNF-1

**Non-Goals:**

- Cambiar las familias INT, SAL y MAD, sus severidades o el umbral de 3 WARNING (Fuera de alcance de la historia).
- Alinear los otros cinco skills de validación (STORY-140…142, STORY-144, STORY-145).
- Reescribir reportes ya generados, como `docs/specs/epics/EPIC-25-…/epic-analyze-report.md`: son registro histórico
  (STORY-138 D-7).
- Editar `CHANGELOG.md`: `[Unreleased]` está vacío aunque ya se añadió `story-fix-plan`, de modo que el registro se hace en
  la release (`/doc-release-notes`).
- Editar la policy: no se conserva ninguna divergencia (D-9).

## Decisions

### D-1 — Regla de veredicto sin `BLOCKED` // satisface: AC-1

El Paso 6 de `SKILL.md` pasa a esta tabla, que coincide fila a fila con los Ejemplos de AC-1:

| ERROR | WARNING | Veredicto |
|---|---|---|
| ≥ 1 | cualquiera | `NEEDS-REFINEMENT` |
| 0 | ≤ 3 | `APPROVED` |
| 0 | > 3 | `NEEDS-REFINEMENT` |

La regla sigue siendo una función pura de los conteos (SKILL.md l.267). Un hallazgo ERROR es un defecto de la épica, no un
bloqueo del proceso (decisión del PO del 2026-10-17), y `NEEDS-REFINEMENT` es el valor de rechazo de los gates de
especificación (§2 de la policy).

| Alternativa | Motivo del rechazo |
|---|---|
| Conservar `BLOCKED` y registrarlo como excepción en §6 | Contradice la decisión del PO, CS-4 de la épica y la equivalencia de §5 (STORY-138 D-5). |
| Emitir `NEEDS-CHANGES` con ERROR | `NEEDS-CHANGES` es de planificación, ejecución y QA. Un gate de especificación emite solo `NEEDS-REFINEMENT` («no son alias», §2). |

### D-2 — Sección `## Veredicto` en el template, con clave propia // satisface: AC-1, AC-2

En el template, justo tras `# Análisis de épica: {título}` y antes de `## Resumen`, se añade:

- Encabezado `## Veredicto <!-- sección obligatoria · clave: veredicto · escritor: epic-analyze -->`, con el marcador que
  ya usan las demás secciones.
- Comentario guía de una línea con el contenido que escribe el skill.
- Primera línea: `` **Veredicto:** `{veredicto}` — {motivo} `` (G-02, motivo de D-3).
- Segunda línea fija: `Informativo: este análisis no cambia el estado de la épica.` Recoge el matiz que hoy lleva la línea
  bajo `## Resumen` (D-4). G-02 admite motivos breves tras la primera línea.

En el Paso 7 de `SKILL.md`, la tabla de claves gana la fila `veredicto` («la línea `**Veredicto:**` de D-3 y la línea
informativa»), y la fila `resumen` deja de incluir el veredicto. Si un template central no declara la clave `veredicto`,
se aplica la regla vigente (l.292): la sección se omite con `⚠️`. El aviso añade «el reporte no cumple el contrato de
validación (G-02)». El veredicto y `verdict` no cambian (P7).

| Alternativa | Motivo del rechazo |
|---|---|
| Que el skill escriba la sección aunque el template no la declare | Rompe la regla del skill de que la estructura del reporte vive solo en el template (l.280), y crearía dos fuentes de estructura que pueden divergir. |
| Poner `## Veredicto` después de `## Resumen` | Viola G-02: debe ser el primer `##` tras el título. |
| Sección sin marcador `clave:` | El Paso 7 rellena por clave. Sin marcador, la sección caería en «clave desconocida» (l.292) y saldría `N/A`. |

### D-3 — Motivo determinista de la línea de veredicto // satisface: AC-1

El skill exige determinismo (l.79), así que el motivo se deriva de la misma fila de D-1 que da el valor:

| Fila de D-1 | Línea escrita |
|---|---|
| ERROR ≥ 1 | `` **Veredicto:** `NEEDS-REFINEMENT` — <n> hallazgo(s) ERROR `` |
| 0 ERROR, WARNING ≤ 3 | `` **Veredicto:** `APPROVED` — sin hallazgos ERROR y <m> WARNING (umbral: 3) `` |
| 0 ERROR, WARNING > 3 | `` **Veredicto:** `NEEDS-REFINEMENT` — <m> hallazgos WARNING, por encima del umbral de 3 `` |

`<n>` y `<m>` son los mismos conteos que `errors` y `warnings`. La forma singular se usa con `<n> = 1`.

| Alternativa | Motivo del rechazo |
|---|---|
| Motivo libre redactado por el agente | Dos ejecuciones sobre las mismas fuentes podrían dar cuerpos distintos, lo que viola l.79 y l.298. |
| Listar los códigos de los hallazgos en la línea | Duplica `## Hallazgos` y alarga la línea sin límite. G-02 pide una frase, y el detalle vive en las secciones propias. |

### D-4 — Se elimina el veredicto de `## Resumen` // satisface: AC-2

Esto resuelve la «Decisión de diseño» de las Notas de la historia. Se eliminan la fila `| Veredicto | {veredicto} |` (l.26)
y la línea `**Veredicto:** … — informativo; …` que pide el comentario guía (l.21). El comentario guía se reescribe sin
ellas. G-04 prohíbe que otro campo o línea declare el veredicto, y con ambas el reporte lo declararía tres veces (lo que
señala FINVEST › S). `## Resumen` conserva épica, conteos, contrato de salida, madurez, fecha y templates.

| Alternativa | Motivo del rechazo |
|---|---|
| Conservar la fila en `## Resumen` | Viola G-04, y AC-2 obligaría a registrarla como excepción en §6 sin un motivo que lo justifique. |
| Conservar la fila con otra etiqueta («Resultado») | Sigue declarando el veredicto con otra forma, que es lo que G-04 prohíbe. |

### D-5 — `errors` y `warnings` se conservan // satisface: CNF-1

El frontmatter mantiene `errors: {n}` y `warnings: {n}` (l.8-9). Con `NEEDS-REFINEMENT`, `errors ≥ 1` distingue la
fila 3 de AC-1 de la fila 2 (`errors: 0`, `warnings > 3`). G-04 conserva expresamente los campos que no son veredicto.

| Alternativa | Motivo del rechazo |
|---|---|
| Un tercer valor de veredicto para la fila 3 | Es lo que CNF-1 descarta por título, y el vocabulario de §4 no lo admite. |
| Añadir un campo `max-severity` | YAGNI: `errors ≥ 1` ya da la misma información. |

### D-6 — Alcance del `Pero` de AC-1 // satisface: AC-1

«El reporte no declara el valor BLOCKED» significa que **ni `verdict` ni la sección `## Veredicto` declaran `BLOCKED`**.
`BLOCKED` sigue siendo un `substatus` válido de historia (SKILL.md l.235), y un hallazgo MAD-01 lo cita literalmente
como evidencia. Prohibir el texto en todo el reporte rompería MAD-01 (FINVEST › T). Las evals afirman
`` not_contains: ["verdict: BLOCKED", "**Veredicto:** `BLOCKED`"] ``, nunca `not_contains: ["BLOCKED"]` en casos que
puedan tener MAD-01.

| Alternativa | Motivo del rechazo |
|---|---|
| Prohibir `BLOCKED` en todo el reporte | Un MAD-01 legítimo sobre una historia `SPECIFY/BLOCKED` produciría un falso fallo. |
| Pedir a la historia que reformule el `Pero` | No hace falta. El diseño fija la lectura y la verificación (V-2) la hace operativa. |

### D-7 — Inventario de cambios en documentación del skill // satisface: AC-1, AC-2

| Archivo | Línea | Cambio |
|---|---|---|
| `SKILL.md` | l.19 | `APPROVED` / `NEEDS-REFINEMENT` / `BLOCKED` → `APPROVED` / `NEEDS-REFINEMENT`, y mención de la sección `## Veredicto` |
| `SKILL.md` | l.255 | Se elimina «y nunca producen `BLOCKED` por sí solos»; queda «todos WARNING: cuentan para el umbral de `NEEDS-REFINEMENT` del Paso 6» |
| `SKILL.md` | l.269-275 | Tabla de D-1. Se añade una línea que remite al contrato de validación (`docs/policies/validation-contract-policy.md` de Agile-SDDF, en código en línea y sin enlace) |
| `SKILL.md` | l.283-289 | Fila `veredicto` (D-2) y `resumen` sin veredicto (D-4) |
| `SKILL.md` | l.292 | Aviso de D-2 cuando falta la clave `veredicto` |
| `SKILL.md` | l.306, l.318 | `<APPROVED \| NEEDS-REFINEMENT>` en las salidas de consola |
| `SKILL.md` | l.327 | Verificación del flujo: `## Veredicto` es el primer `##` y su valor coincide con `verdict` |
| `SKILL.md` | l.335 | «Con veredicto `BLOCKED`, corregir…» → «Con `NEEDS-REFINEMENT` y `errors ≥ 1`, corregir…; con solo WARNING, además…» |
| `README.md` | l.11 | Veredicto `APPROVED` o `NEEDS-REFINEMENT` en la sección `## Veredicto`, según el contrato de validación |
| `docs/domains/domain-skills-map.md` | l.19 | `APPROVED` / `NEEDS-REFINEMENT` |

Se conserva l.235 (estado de historia). El skill nombra la policy en código en línea y no la enlaza: un skill se instala en
proyectos que no tienen `docs/policies/` (ADR-0014, Regla 1), y `skills/` no es raíz activa de `check-doc-links.js`. Es
una referencia, no una precondición. Ninguna línea repite la tabla de vocabulario de la policy (STORY-138 CNF-1): el skill
declara solo su regla de decisión.

| Alternativa | Motivo del rechazo |
|---|---|
| Enlace Markdown relativo a la policy desde `SKILL.md` | Queda roto en cada proyecto que instala el skill. |
| No mencionar la policy | El autor del skill perdería la referencia a la fuente única que justifica los valores. |

### D-8 — Evals: actualizar los 11 casos y afirmar la sección // satisface: AC-1, CNF-1

- **11 casos con ERROR** (lista del Context): en `contains`, `"BLOCKED"` y `"verdict: BLOCKED"` se sustituyen por
  `"verdict: NEEDS-REFINEMENT"`, `"## Veredicto"` y `` "**Veredicto:** `NEEDS-REFINEMENT`" ``. Se conserva `"errors: 1"`
  en los 7 casos que ya lo afirman (CNF-1), y no se añade a TC-003, TC-017, TC-026 ni TC-027 (TC-027 tiene dos ERROR:
  INT-06 e INT-02). En `not_contains` se añade `"verdict: BLOCKED"` si falta, y se ajustan las `description` que nombran
  `BLOCKED`.
- **TC-001** (fila 1): se añaden `"## Veredicto"` y `` "**Veredicto:** `APPROVED`" `` a `contains`, y `"| Veredicto |"` a
  `not_contains` (D-4).
- **TC-006 y TC-024** (fila 2): ya afirman `"verdict: NEEDS-REFINEMENT"` y `"errors: 0"`, y tienen `"verdict: BLOCKED"`
  en `not_contains`. Solo se añaden `"## Veredicto"` y `` "**Veredicto:** `NEEDS-REFINEMENT`" `` a `contains`.
- **TC-005 y TC-013** (casos `APPROVED`): el `"BLOCKED"` a secas de `not_contains` se sustituye por `"verdict: BLOCKED"`,
  para aplicar D-6 de forma uniforme en todos los casos.
- Se actualizan la `description` del archivo (l.4) y `version` → `1.3.0`, porque cambian las expectativas.
- No se crean casos nuevos: las tres filas de AC-1 ya tienen casos (TC-001, TC-006/TC-024 y los 11 de ERROR).

La **posición** de `## Veredicto` no se afirma en evals: el runner solo compara subcadenas (l.654), y una subcadena de
varias líneas depende de las líneas en blanco que emita el modelo. La posición se verifica en el template (V-3), que es la
fuente de la estructura (D-2).

| Alternativa | Motivo del rechazo |
|---|---|
| `contains` multilínea `"# Análisis de épica: …\n\n## Veredicto"` | Es frágil ante variaciones de espaciado del modelo, y las evals fallarían sin que haya defecto. |
| Crear casos nuevos en lugar de editar los existentes | Los 11 casos seguirían esperando `BLOCKED` y fallarían. |

### D-9 — Conformidad documentada (AC-2) // satisface: AC-2

El «Entonces» de AC-2 se vuelve una lista de chequeo cerrada (FINVEST › T) entre el template (y el Paso 6 que lo rellena) y
la policy:

| # | Punto de la policy | Estado tras esta historia |
|---|---|---|
| C-1 | G-01: `verdict` con un solo valor | Ya existía (l.7); solo cambian sus valores |
| C-2 | G-02: `## Veredicto` es el primer `##` tras el `#`, con la línea `` **Veredicto:** `<VALOR>` — <motivo> `` | D-2 y D-3 |
| C-3 | G-03 y §4: valores `APPROVED`, `NEEDS-REFINEMENT` | D-1 |
| C-4 | G-04: ningún otro campo o línea declara el veredicto | D-4. `errors` y `warnings` no son veredicto |
| C-5 | §5: `BLOCKED` → `NEEDS-REFINEMENT` | D-1 aplica la equivalencia |
| C-6 | §7.1: ejemplo conforme (`type: epic-analyze`, siguiente `##` = `## Resumen`) | El template conserva `type` y `## Resumen` como siguiente sección |

**Resultado: no se conserva ninguna divergencia.** §6 de la policy sigue con `Sin excepciones vigentes.`, y esta historia
no edita la policy. Si al implementar la policy publicada difiere del diseño de STORY-138 en algún punto C-1…C-6, se
aplica la policy publicada y se anota la diferencia en `implement-report.md`.

| Alternativa | Motivo del rechazo |
|---|---|
| Registrar la fila de `## Resumen` como excepción | No hay motivo para conservarla (D-4). |
| Delegar la comprobación en STORY-143 | AC-2 la exige en esta historia. STORY-143 verifica los seis skills juntos, de extremo a extremo. |

### D-10 — Secuencia respecto a STORY-138 // satisface: AC-2

La implementación empieza cuando `docs/policies/validation-contract-policy.md` existe (lo comprueba la primera tarea).
El `Dado` de AC-2 la exige, y los puntos C-1…C-6 se comparan contra el texto publicado y no contra un diseño. WIP = 1 por
nivel ya impone implementar las historias en serie.

| Alternativa | Motivo del rechazo |
|---|---|
| Implementar AC-1 antes de que exista la policy (como sugiere FINVEST › I) | Si la redacción de la policy cambia al implementarse, habría que rehacer la línea de veredicto y las evals. |
| Crear aquí un borrador de la policy | Duplica la fuente única y pisa el alcance de STORY-138. |

## Componentes afectados

| Componente | Acción | Ubicación | Satisface |
|---|---|---|---|
| Regla de veredicto y escritura por clave de `epic-analyze` | modificar | `skills/epic-analyze/SKILL.md` | AC-1, AC-2 |
| Template del reporte de análisis de épica | modificar | `skills/epic-analyze/assets/epic-analyze-report-template.md` | AC-1, AC-2, CNF-1 |
| Ficha del skill | modificar | `skills/epic-analyze/README.md` | AC-1 |
| Evals del skill | modificar | `skills/epic-analyze/evals/evals.json` | AC-1, CNF-1 |
| Mapa de skills | modificar | `docs/domains/domain-skills-map.md` (l.19) | AC-1 |

No se tocan: la policy, los otros skills, `epic.md`, los reportes históricos, `CHANGELOG.md`, `package.json` (no hay
archivos nuevos) ni las copias de runtime de `.claude/`.

## Interfaces

| Interfaz | Contrato | Consumidor | Satisface |
|---|---|---|---|
| Frontmatter del reporte | `verdict: APPROVED \| NEEDS-REFINEMENT`; `errors: <n>`, `warnings: <m>` (enteros ≥ 0) | `epic-validate` (EPIC-23), CI, orquestadores | AC-1, CNF-1 |
| Sección `## Veredicto` | Primer `##` tras `# Análisis de épica: <título>`. Primera línea según D-3; segunda línea informativa fija | Lectores humanos, evals | AC-1 |
| Clave de template `veredicto` | Marcador `<!-- sección obligatoria · clave: veredicto · escritor: epic-analyze -->` en un `##` del template | Paso 7 de `SKILL.md`, templates centrales en `$SPECS_BASE/templates/` | AC-1, AC-2 |
| Salida de consola | Manual: `Veredicto: <APPROVED \| NEEDS-REFINEMENT>`. Agent: `VEREDICTO: <APPROVED \| NEEDS-REFINEMENT>` (cuatro líneas, sin cambio de forma) | Usuario, orquestadores | AC-1 |

## Esquema de datos // satisface: AC-1, CNF-1

Cabecera del template tras el cambio (forma abstracta; los placeholders se reemplazan en el Paso 7):

```markdown
---
type: epic-analyze
…
verdict: {APPROVED | NEEDS-REFINEMENT}
errors: {n}
warnings: {n}
…
---
<!-- Referencias -->
[[{nombre-directorio-epica}]]

# Análisis de épica: {título}

## Veredicto <!-- sección obligatoria · clave: veredicto · escritor: epic-analyze -->
<!-- comentario guía -->

**Veredicto:** `{veredicto}` — {motivo}
Informativo: este análisis no cambia el estado de la épica.

## Resumen <!-- sección obligatoria · clave: resumen · escritor: epic-analyze -->
…tabla sin la fila «Veredicto»…
```

## Flujos clave

### F-1 — Análisis con hallazgos ERROR // AC-1 (fila 3), CNF-1

Pasos 5–5c → `errors ≥ 1` → D-1 da `NEEDS-REFINEMENT` → el Paso 7 escribe `verdict: NEEDS-REFINEMENT`, `errors: <n>` y
`## Veredicto` con `— <n> hallazgo(s) ERROR` → la consola muestra `Veredicto: NEEDS-REFINEMENT`.

### F-2 — Análisis aprobado o con exceso de WARNING // AC-1 (filas 1 y 2)

`errors = 0` → `warnings ≤ 3` da `APPROVED`, y `> 3` da `NEEDS-REFINEMENT` con el motivo del umbral. `errors: 0` deja
ver que no hay defectos ERROR (CNF-1).

### F-3 — Template central sin la clave `veredicto` // AC-2 (degradación)

El Paso 7 omite la sección y emite el `⚠️` de D-2. `verdict` se escribe igual, de modo que G-06 sigue funcionando para CI.
El reporte no es conforme, y el aviso lo hace visible.

### F-4 — Cambio de contrato (P6) // AC-2

Si la policy cambia los valores de `epic-analyze`, cambian D-1 (tabla del Paso 6), D-3 y las evals de D-8. La estructura
(D-2) no depende de los valores.

## Decisiones de complejidad justificada

| Elemento | Por qué no basta algo más simple | Satisface |
|---|---|---|
| Clave `veredicto` en lugar de texto fijo en el template | El Paso 7 rellena por clave. Una sección sin clave saldría como `N/A`. | AC-1 |
| Motivo con tres formas (D-3) | Un motivo libre rompe el determinismo del skill. Una sola forma no distingue las filas 2 y 3. | AC-1 |
| Segunda línea informativa | Conserva el matiz «no cambia el estado» que hoy está en `## Resumen` y que D-4 elimina. | AC-2 |

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | `SKILL.md` no declara `BLOCKED` como veredicto; solo l.235 (estado de historia) conserva el valor | `grep -n BLOCKED skills/epic-analyze/SKILL.md` devuelve solo la fila de l.235 | AC-1 |
| V-2 | El template declara `verdict: {APPROVED \| NEEDS-REFINEMENT}` y conserva `errors` y `warnings` | `grep -n -E '^(verdict\|errors\|warnings):' skills/epic-analyze/assets/epic-analyze-report-template.md` | AC-1, CNF-1 |
| V-3 | En el template, el primer `##` tras el `#` es `## Veredicto` con clave `veredicto`, y le sigue `## Resumen` | `grep -n '^#' skills/epic-analyze/assets/epic-analyze-report-template.md` (las líneas `#`, `## Veredicto` y `## Resumen` aparecen en ese orden y sin otro `##` entre ellas) | AC-1, AC-2 |
| V-4 | `## Resumen` no contiene la fila ni la línea de veredicto | `grep -n -i 'veredicto' skills/epic-analyze/assets/epic-analyze-report-template.md` solo coincide dentro de la sección `## Veredicto` (encabezado, comentario guía y línea `**Veredicto:**`) y en el comentario guía de `## Notas del análisis` («no cuentan para el veredicto»), que no declara un valor; `grep -n -F -e '\| Veredicto \|'` sobre el mismo archivo no devuelve nada | AC-2 |
| V-5 | El Paso 6 de `SKILL.md` coincide con D-1 y el Paso 7 tiene la fila `veredicto` | Lectura de l.265-292 | AC-1 |
| V-6 | Los puntos C-1…C-6 de D-9 se cumplen frente a la policy publicada, sin excepciones en §6 | Lectura comparada; resultado anotado en `implement-report.md` | AC-2 |
| V-7 | Ningún caso de `evals.json` espera `BLOCKED` como veredicto, y las tres filas de AC-1 tienen caso | `grep -n -E '"(verdict: )?BLOCKED"' skills/epic-analyze/evals/evals.json` solo en `not_contains` o en la entrada de TC-008 | AC-1, CNF-1 |
| V-8 | `README.md` y `domain-skills-map.md` no nombran `BLOCKED` como veredicto de `epic-analyze` | `grep -n BLOCKED skills/epic-analyze/README.md docs/domains/domain-skills-map.md` | AC-1 |
| V-9 | El gate determinista pasa | `npm run verify:repository` y `npm test` | AC-1, AC-2 |
| V-10 | Las evals del skill pasan (ejecución manual, a criterio humano, según AGENTS.md) | `npm run test:eval -- epic-analyze` | AC-1, CNF-1 |

## Risks / Trade-offs

- **[Consumidor externo que lee `verdict: BLOCKED`]** → no hay ninguno en el repositorio (Context). `epic-validate`
  solo comprueba `APPROVED`. La traducción vive en §5 de la policy.
- **[Template central desactualizado en un proyecto consumidor]** → F-3: el reporte se escribe sin `## Veredicto` y con
  un `⚠️` explícito. El proyecto lo corrige copiando el seed.
- **[Las evals dependen del LLM]** → las aserciones nuevas son subcadenas exactas que fija el template (D-8). La posición se
  verifica en el template (V-3).
- **[La policy publicada difiere del diseño de STORY-138]** → D-9 aplica la versión publicada y registra la diferencia.
- **[Copias de runtime desactualizadas]** → `.claude/skills/epic-analyze/` se regenera con `npx agile-sddf install --force`.
  No está versionado.

## Open Questions

Ninguna. La decisión pendiente de las Notas (fila del veredicto en `## Resumen`) se resuelve en D-4, y la ambigüedad del
`Pero` de AC-1 en D-6.

## Autoevaluación (P9, P10)

- **Omisiones:** las tres filas de AC-1, AC-2 y CNF-1 tienen elemento de diseño y verificación. El inventario de `BLOCKED`
  de FINVEST › E está completo en D-7 y D-8, y añade `domain-skills-map.md`.
- **Ambigüedad:** la lectura del `Pero` (D-6), la lista de puntos de AC-2 (D-9) y el motivo (D-3) quedan fijados.
- **Nombres:** «veredicto» designa el valor y `## Veredicto` la sección. La clave del template es `veredicto`, en
  minúsculas como las demás claves.
- **Estructura:** sin dependencias cíclicas. El template define la estructura y el `SKILL.md` la rellena por clave; la
  policy es una referencia externa y no una dependencia de runtime. Cada cambio afecta a una sola responsabilidad: regla
  (D-1), estructura (D-2), texto (D-3), eliminación (D-4).

## Registro de Cambios (CR)

Sin CRs detectados. `domain-skills-map.md` no figura en las Notas de la historia, pero su cambio cae dentro del objetivo
(veracidad del vocabulario del skill) y no altera ningún AC, así que `story.md` no requiere cambios.
