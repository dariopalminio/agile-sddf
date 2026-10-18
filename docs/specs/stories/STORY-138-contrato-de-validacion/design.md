---
alwaysApply: false
type: design
id: STORY-138
slug: STORY-138-contrato-de-validacion-design
title: "Design: Contrato de validación"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-138
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-138-contrato-de-validacion
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - policies-index
  - constitution
---

<!-- Referencias -->
[[STORY-138-contrato-de-validacion]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]] · [[policies-index]] · [[constitution]]

# Diseño técnico: contrato de validación

## Context

EPIC-25 alinea los skills de validación con un contrato común de reporte. Esta historia publica ese contrato como
`docs/policies/validation-contract-policy.md`. Las seis historias de alineación (STORY-139 a STORY-142, STORY-144 y
STORY-145) lo enlazan en lugar de repetirlo. Es la primera policy del repositorio.

**Estado medido el 2026-10-17** (`ls`, `grep`):

| Elemento | Estado actual |
|---|---|
| `docs/policies/` | Solo `README.md`. Su índice dice «Todavía no hay policies». La precondición de AC-1 se cumple. |
| `docs/templates/policy-template.md` | Plantilla de autoría manual (ADR-0012) con 10 secciones numeradas y la cabecera Versión / Estado / Última actualización / Propietario. |
| Convención de `docs/policies/README.md` | `<ámbito>-policy.md`; frontmatter con `type: policy`, `slug` igual al nombre del archivo, `derives-from: constitution` y `enforced-by` si hay guardrails. Se registra en la tabla «Índice de policies». |
| `scripts/check-doc-links.js` | Revisa `docs/policies` como raíz activa (enlaces relativos y wikilinks). Corre en `npm run verify:repository`. |
| Flowcharts | `flowchart-story-specify.mermaid` (`story-evaluation` → `SPLIT` / `NEEDS-REFINEMENT` / `APPROVED`), `flowchart-story-plan.mermaid` (`story-analyze` → `NEEDS-CHANGES` / `APPROVED`) y `flowchart-story-excecution-qa.mermaid` (`story-code-review`, `story-verify`, `story-acceptance` → `NEEDS-CHANGES` / `APPROVED`). El nombre del archivo lleva la errata `excecution`, y se enlaza tal cual. |

**Veredictos heredados por skill** (fuente: templates en `skills/<skill>/assets/` y `SKILL.md`):

| Skill | Reporte | Dónde declara hoy el resultado | Valores heredados |
|---|---|---|---|
| `epic-analyze` | `epic-analyze-report.md` | `verdict` (frontmatter) y fila «Veredicto» de `## Resumen` | `APPROVED`, `NEEDS-REFINEMENT`, `BLOCKED` |
| `story-evaluation` | `finvest-evaluation-report.md` | `decision` (frontmatter) | `APROBADA`, `REFINAR`, `RECHAZAR`, `DIVIDIR` |
| `story-analyze` | `analyze.md` | `**Estado general:**` (cuerpo) | `✓ Coherente`, `⚠️ Advertencias`, `❌ Inconsistencias bloqueantes` |
| `story-code-review` | `code-review-report.md` | `review-status` (frontmatter y cuerpo) | `approved`, `needs-changes` |
| `story-verify` | `verify-report.md` | Línea «Resultado» y estado interno `$VERIFY_RECHAZADO` | `VERIFY-PASSED`, `VERIFY-REJECTED`, `RECHAZADO`, `REJECTED` |
| `story-acceptance` | `acceptance-report.md` | `final-status` y `session-status` (frontmatter) | `ACCEPTANCE-APPROVED`, `ACCEPTANCE-REJECTED`, `ACCEPTANCE-BLOCKED`; `session-status: partial` |

`story-verify` no usa `RECHAZAR`, aunque CS-8 de la épica lo nombra. La tabla de equivalencias solo recoge los valores
que existen (veracidad).

**Precedentes reutilizados (P3):** `epic-analyze` ya declara `verdict` y escribe la línea
`**Veredicto:** <veredicto> — …`. EPIC-23 (`epic-validate`) adopta `## Veredicto` como primera sección. La política
toma ambos como forma canónica.

## Goals / Non-Goals

**Goals:**

- Publicar `docs/policies/validation-contract-policy.md` con la estructura común del reporte, el vocabulario por fase,
  los valores permitidos por skill, las equivalencias heredadas y un ejemplo conforme por skill. // satisface: AC-1, AC-2
- Hacer verificable por inspección que la tabla de valores permitidos coincide con las ramas `verdict` de los
  flowcharts. // satisface: AC-3
- Registrar la decisión transversal en `docs/adr/ADR-0015-contrato-de-validacion.md` (constitución, regla 16). // ver CR-001
- Registrar la policy y el ADR en sus índices. // satisface: CNF-1

**Non-Goals:**

- Modificar skills, templates de reporte, `README.md` del framework o flowcharts (STORY-139…145 y STORY-143).
- Crear un validador automático del contrato ni un guardrail `enforced-by` (STORY-143).
- Reescribir los reportes históricos de `docs/specs/` (ver D-7).
- Fijar las reglas de decisión internas de cada skill, como umbrales FINVEST o severidades de code review. La política
  fija qué valor se emite, no cómo lo calcula cada skill.

## Decisions

### D-1 — Ubicación y frontmatter de la policy // satisface: AC-1, CNF-1

- **Ruta:** `docs/policies/validation-contract-policy.md`, con la convención `<ámbito>-policy.md`.
- **Frontmatter:** `type: policy`, `slug: validation-contract-policy`, `title: "Política de contrato de validación"`
  y `derives-from: constitution`. **No** declara `enforced-by`, porque todavía no existe ningún guardrail que la haga
  cumplir. STORY-143 lo añade si crea uno. No se copian las anotaciones `escritor:` de la plantilla, porque no pasan a los
  documentos generados (constitución, regla 13).
- **Principios de los que deriva:** se citan en §1. Son el principio inamovible 3 (*Verificación y automejora*, quality
  gates) y el 8 (*estándares homogéneos*).

| Alternativa | Motivo del rechazo |
|---|---|
| Guardrail en `docs/guardrails/` | Un guardrail es un checklist con severidad para CI. El contrato es una convención declarativa con tablas de consulta, y su verificación automática es alcance de STORY-143. |
| Sección dentro de `docs/constitution.md` | Mezcla una convención operativa de siete skills con los principios supremos y contradice el flujo de autoridad, según el cual las policies desarrollan la constitución. |

### D-2 — Estructura: plantilla de policy reducida a siete secciones // satisface: AC-1, CNF-3, CNF-4

La policy parte de `docs/templates/policy-template.md`. Conserva la cabecera Versión / Estado / Última actualización /
Propietario y las secciones 1, 2 y 3. Elimina las secciones 4 a 8 y 10, que no aplican (buenas prácticas, rendimiento,
estructura de archivos, metadatos de descubrimiento, referencias externas y resumen de categorías). Añade cuatro
secciones de consulta. Los encabezados **no llevan la etiqueta de categoría** de la plantilla (`[CONTEXT]`,
`[GUARDRAIL - BLOQUEANTE]`), para que las anclas sean estables y legibles. STORY-139…145 enlazan las anclas
`#4-valores-permitidos-por-skill`, `#5-equivalencias-de-valores-heredados` y `#6-excepciones`.

| # | Encabezado exacto | Contenido | AC / CNF |
|---|---|---|---|
| — | `# Política de contrato de validación` | Cabecera de 4 líneas: Versión `1.0.0`, Estado `Aprobado`, Última actualización `2026-10-17`, Propietario `Mantenedores de Agile-SDDF` | CNF-3 |
| 1 | `## 1. Propósito y alcance` | Propósito (2 frases), alcance (los siete skills de §4) y exclusiones: `epic-format-validation`, `security-audit` y `fix-directives.md`, que es un artefacto de rework y no un reporte de veredicto | AC-1, P10 |
| 2 | `## 2. Vocabulario de veredictos` | Regla de formato y tabla de valores (D-4) | AC-1, CNF-2 |
| 3 | `## 3. Reglas no negociables` | G-01…G-06 (D-3, D-6) y acción ante violación | AC-1 |
| 4 | `## 4. Valores permitidos por skill` | Tabla por skill con trazabilidad a los flowcharts (D-4) | AC-1, AC-3 |
| 5 | `## 5. Equivalencias de valores heredados` | Tabla por (skill, valor heredado) y regla de reportes heredados (D-5, D-7) | AC-2 |
| 6 | `## 6. Excepciones` | Tabla vacía con la línea `Sin excepciones vigentes.` (D-8) | CNF-1 |
| 7 | `## 7. Ejemplos de reportes conformes` | Un bloque por skill (D-9) | AC-1 |
| — | `## Historial de cambios` | Fila `1.0.0 · 2026-10-17 · Creación inicial (STORY-138) · Dario Palminio` | — |

**Presupuesto de tamaño (CNF-4):** como máximo 200 líneas. Ninguna regla se enuncia dos veces. §2 da la semántica por
fase, §4 los valores por skill y §5 las traducciones. Ninguna sección repite el contenido de otra.

| Alternativa | Motivo del rechazo |
|---|---|
| Plantilla completa (10 secciones) | Seis secciones quedarían vacías o con relleno, lo que viola CNF-4. La propia plantilla indica que se eliminen las secciones que no aplican. |
| Documento libre sin plantilla | Rompe la uniformidad con futuras policies (P5) y pierde la cabecera de versión y estado que exige la plantilla. |
| Conservar las etiquetas `[CATEGORÍA]` en los encabezados | Generan anclas como `#3-guardrail---bloqueante-reglas-no-negociables`, que son frágiles para los enlaces de STORY-139…145. La naturaleza bloqueante ya la expresa el título de §3. |

### D-3 — Contrato de estructura del reporte (G-01…G-04) // satisface: AC-1

| Regla | Enunciado (redacción en la policy) |
|---|---|
| **G-01 — Campo `verdict`** | El frontmatter del reporte declara `verdict` con exactamente un valor. |
| **G-02 — Sección `## Veredicto`** | Es el primer encabezado `##` tras el título `#`. Entre ambos solo puede haber líneas en blanco o comentarios HTML. Su primera línea es `**Veredicto:** `<VALOR>` — <motivo en una frase>`, con el mismo valor que `verdict`. Pueden seguirle motivos breves. El detalle vive en las secciones propias del skill. |
| **G-03 — Vocabulario cerrado** | El valor es uno de los permitidos para el skill en §4. Cualquier otro valor no es conforme, ya sea heredado, en minúsculas, en español o de otro skill. |
| **G-04 — Fuente única en el reporte** | Ningún otro campo ni línea declara el veredicto (`decision`, `review-status`, `final-status`, `**Estado general:**`, línea «Resultado»). Los campos que no son veredicto se mantienen (`errors`, `warnings`, `max-severity`, `session-status`). |

**Acción ante violación** (una línea en la policy): un reporte no conforme es un defecto del skill que lo emite y se
corrige en ese skill. Sus consumidores aplican G-06.

| Alternativa | Motivo del rechazo |
|---|---|
| Solo frontmatter, sin sección | AC-1 exige ambas. Además, un lector humano tendría que abrir el YAML para conocer el resultado. |
| Solo sección, sin frontmatter | CI tendría que parsear Markdown, lo que contradice el «Para» de la historia y SMOKE-2 de la épica. |
| Permitir que la sección y el frontmatter difieran, con prioridad del frontmatter | Normaliza un reporte incoherente. Es más simple exigir el mismo valor y declarar no conforme la divergencia. |

### D-4 — Vocabulario por fase y tabla trazada a los flowcharts // satisface: AC-1, AC-3, CNF-2

**§2 — Regla de formato** (CNF-2, una línea): los valores van en inglés, en mayúsculas y con guion ASCII. Siguen el
patrón `^[A-Z]+(-[A-Z]+)*$`.

**§2 — Tabla de vocabulario** (columnas `Valor | Fase | Significado | Efecto en el flujo`):

| Valor | Fase | Significado | Efecto en el flujo |
|---|---|---|---|
| `APPROVED` | Todas | El artefacto supera el gate. | Avanza al paso siguiente. |
| `NEEDS-REFINEMENT` | Especificación | Un artefacto de especificación (épica o historia) debe refinarse. | Vuelve a refinar y se reevalúa. |
| `NEEDS-CHANGES` | Planificación, ejecución y QA | Un artefacto de planificación o de implementación fue rechazado o sus pruebas fallaron. | Vuelve al paso que lo produjo. |
| `BLOCKED` | Cualquiera con bloqueo | Un bloqueo impide completar el proceso. No es un defecto del artefacto. | Detiene el flujo hasta que se resuelva. No tiene rama en los flowcharts. |
| `SPLIT` | Extensión local de `story-evaluation` | La historia es demasiado grande. | Se divide y se reevalúa. |
| `PENDING` | Extensión local de `story-acceptance` | La sesión de validación sigue `partial`. | Detiene el flujo hasta completar la sesión. No tiene rama en los flowcharts. |

Debajo, una línea: «`NEEDS-REFINEMENT` y `NEEDS-CHANGES` no son alias: cada gate emite solo uno de los dos». La tabla
no nombra skills de refinamiento, porque `story-improve` se renombrará como `story-refine` (STORY-130). Así el cambio de
nombre no obliga a editar la policy (P6).

**§4 — Valores permitidos por skill** (columnas
`Skill | Reporte | Fase | Valores permitidos | Flowchart | Valores sin rama`):

| Skill | Reporte | Fase | Valores permitidos | Flowchart | Valores sin rama |
|---|---|---|---|---|---|
| `epic-analyze` | `epic-analyze-report.md` | Especificación | `APPROVED`, `NEEDS-REFINEMENT` | — (sin flowchart) | — |
| `story-evaluation` | `finvest-evaluation-report.md` | Especificación | `APPROVED`, `NEEDS-REFINEMENT`, `SPLIT` | specify | — |
| `story-analyze` | `analyze.md` | Planificación | `APPROVED`, `NEEDS-CHANGES` | plan | — |
| `story-code-review` | `code-review-report.md` | Ejecución y QA | `APPROVED`, `NEEDS-CHANGES` | ejecución y QA | — |
| `story-verify` | `verify-report.md` | Ejecución y QA | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` | ejecución y QA | `BLOCKED` |
| `story-acceptance` | `acceptance-report.md` | Ejecución y QA | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED`, `PENDING` | ejecución y QA | `BLOCKED`, `PENDING` |
| `epic-validate` (previsto, EPIC-23) | `epic-validate-report.md` | QA de épica | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` | — (sin flowchart) | — |

- La columna «Flowchart» es un enlace relativo al `.mermaid`
  (`../architecture/diagrams/flowchart-story-specify.mermaid`, `…-plan.mermaid`, `…-excecution-qa.mermaid`). Así
  `verify:links` comprueba que el diagrama existe.
- `epic-validate` se nombra **sin enlace**, porque el skill no existe y un enlace roto haría fallar `verify:links`.
- **Invariante de AC-3**, enunciada bajo la tabla: para cada fila con flowchart, los valores permitidos menos los
  valores sin rama coinciden exactamente con las ramas `verdict` que salen del skill en su diagrama. Solo `BLOCKED` y
  `PENDING` pueden figurar en «Valores sin rama». Comprobación con los flowcharts actuales: specify
  {SPLIT, NEEDS-REFINEMENT, APPROVED} = `story-evaluation`; plan {NEEDS-CHANGES, APPROVED} = `story-analyze`; ejecución y
  QA {NEEDS-CHANGES, APPROVED} = `story-code-review`, `story-verify` − {BLOCKED} y `story-acceptance` − {BLOCKED, PENDING}.

| Alternativa | Motivo del rechazo |
|---|---|
| Un solo vocabulario común sin tabla por skill | No dice qué valores puede emitir cada gate, de modo que AC-3 y G-03 no serían verificables. |
| Una columna por valor con marcas ✓ | Siete filas por seis columnas de casillas son menos legibles para un PO que una lista (CNF-3), y además pierde la columna «Valores sin rama» que hace verificable AC-3. |
| Omitir `epic-validate` hasta que exista | La historia (Notas) pide la fila para que EPIC-23 la consuma. Sin ella, EPIC-23 definiría su vocabulario fuera de la fuente única (CNF-1). |

### D-5 — Tabla de equivalencias por (skill, valor heredado) // satisface: AC-2

Columnas: `Skill | Campo heredado | Valor heredado | Valor canónico`. Hay una fila por valor heredado, para que la
consulta de AC-2 sea directa. La clave es el par (skill, valor), porque `BLOCKED` es canónico en `story-verify` y
heredado en `epic-analyze`. El texto introductorio enuncia que todo valor de la tabla es no conforme (G-03).

| Skill | Campo heredado | Valor heredado | Valor canónico |
|---|---|---|---|
| `epic-analyze` | `verdict` | `BLOCKED` | `NEEDS-REFINEMENT` |
| `story-evaluation` | `decision` | `APROBADA` | `APPROVED` |
| `story-evaluation` | `decision` | `REFINAR` | `NEEDS-REFINEMENT` |
| `story-evaluation` | `decision` | `RECHAZAR` | `NEEDS-REFINEMENT` |
| `story-evaluation` | `decision` | `DIVIDIR` | `SPLIT` |
| `story-analyze` | `**Estado general:**` | `✓ Coherente` | `APPROVED` |
| `story-analyze` | `**Estado general:**` | `⚠️ Advertencias` | `APPROVED` |
| `story-analyze` | `**Estado general:**` | `❌ Inconsistencias bloqueantes` | `NEEDS-CHANGES` |
| `story-code-review` | `review-status` | `approved` | `APPROVED` |
| `story-code-review` | `review-status` | `needs-changes` | `NEEDS-CHANGES` |
| `story-verify` | Resultado | `VERIFY-PASSED` | `APPROVED` |
| `story-verify` | Resultado | `VERIFY-REJECTED` | `NEEDS-CHANGES` |
| `story-verify` | estado interno | `RECHAZADO` | `NEEDS-CHANGES` |
| `story-verify` | estado interno | `REJECTED` | `NEEDS-CHANGES` |
| `story-acceptance` | `final-status` | `ACCEPTANCE-APPROVED` | `APPROVED` |
| `story-acceptance` | `final-status` | `ACCEPTANCE-REJECTED` | `NEEDS-CHANGES` |
| `story-acceptance` | `final-status` | `ACCEPTANCE-BLOCKED` | `BLOCKED` |
| `story-acceptance` | `session-status` | `partial` | `PENDING` |

Contiene los 7 ejemplos de AC-2 y cubre todos los valores heredados de las Notas. `⚠️ Advertencias` →
`APPROVED` sigue el comportamiento actual de `story-analyze`, que solo bloquea con ERROR («Sin inconsistencias
bloqueantes. Puedes proceder»), y coincide con STORY-144 AC-1 (`solo WARNING → APPROVED`). La fila `session-status`
traduce una condición, no un valor de veredicto. `session-status` sigue existiendo como campo propio (G-04).

| Alternativa | Motivo del rechazo |
|---|---|
| Tabla por valor heredado sin columna de skill | `BLOCKED` tendría dos traducciones según el skill, y la consulta de AC-2 sería ambigua. |
| `⚠️ Advertencias` → `NEEDS-CHANGES` | Cambiaría el comportamiento del gate de planificación, porque las advertencias pasarían a bloquear. Eso contradice STORY-144 (CNF-1 «sin cambio de criterio») y su AC-1. |

### D-6 — Precedencia y lectura por consumidores (G-05, G-06) // satisface: AC-1

| Regla | Enunciado |
|---|---|
| **G-05 — Precedencia** | Si en un reporte coexisten algo rechazado y algo bloqueado, gana `NEEDS-CHANGES`. Mientras la sesión de `story-acceptance` sea `partial`, el veredicto es `PENDING`. Fuera de estos dos casos, cada skill aplica su propia regla de decisión. |
| **G-06 — Lectura cerrada ante fallo** | Un consumidor (agente, orquestador o CI) lee `verdict` del frontmatter. Solo `APPROVED` habilita el avance. Un valor ausente, no permitido para el skill o heredado sin traducir (D-7) se trata como no aprobado. |

G-05 recoge literalmente las decisiones del PO del 2026-10-17. No generaliza un orden total entre todos los valores
(P12): la precedencia entre `SPLIT` y `NEEDS-REFINEMENT` la fija `story-evaluation` (STORY-140). G-06 es la degradación
segura del contrato (P7), y es lo que permite que CI lo consuma sin conocer cada skill (el «Para» de la historia).

| Alternativa | Motivo del rechazo |
|---|---|
| Orden total `PENDING > NEEDS-CHANGES > BLOCKED > SPLIT > NEEDS-REFINEMENT > APPROVED` | Inventa precedencias que el PO no decidió y que dependen de cada rúbrica, como la de FINVEST. |
| Lectura abierta, en la que un valor desconocido no bloquea | Un reporte roto o heredado pasaría el gate en silencio. |

### D-7 — Reportes heredados: no se reescriben; se traducen al leerlos // satisface: AC-2

La policy añade una regla bajo la tabla de §5. Los reportes generados antes de que su skill se alinee son registro
histórico de `docs/specs/` y no se reescriben (`check-doc-links.js` también excluye `docs/specs` por histórico). Un
consumidor que necesite leer uno lo traduce con la tabla de §5 antes de aplicar G-06. Ningún skill alineado vuelve a
emitir un valor heredado. Esto resuelve la nota de STORY-140 («los consumidores deben seguir leyendo `decision:` … o la
política debe definir una migración»).

| Alternativa | Motivo del rechazo |
|---|---|
| Migrar en bloque los reportes de `docs/specs/` | Reescribe la evidencia histórica. Además, es alcance de STORY-139…145 o de una historia de migración, no de la policy. |
| Ignorar los reportes heredados | Una historia ya evaluada con `APROBADA` dejaría de reconocerse (el riesgo que señala STORY-140). |

### D-8 — Sección de excepciones // satisface: CNF-1

`## 6. Excepciones` contiene una tabla `Skill | Elemento conservado | Motivo | Historia` con la línea
`Sin excepciones vigentes.`. STORY-139 AC-2 exige que, si un skill conserva una divergencia, esta quede «registrada como
excepción en la política con su motivo». Sin esta sección, cada historia de alineación inventaría su propio lugar. Eso
contradice CNF-1.

| Alternativa | Motivo del rechazo |
|---|---|
| Registrar las excepciones en el README o el SKILL.md de cada skill | Dispersa el contrato y contradice CNF-1. |
| No prever excepciones | STORY-139 AC-2 las contempla expresamente. |

### D-9 — Ejemplos: uno por skill, solo el contrato // satisface: AC-1, CNF-4

Hay seis bloques ```` ```markdown ````, uno por cada skill de validación existente, bajo los subtítulos
`### 7.1 epic-analyze` … `### 7.6 story-acceptance`. `epic-validate` no lleva ejemplo, porque AC-1 pide seis y el skill no
existe. Cada bloque muestra solo lo que fija el contrato: el frontmatter con `type` (el valor real del template del
skill) y `verdict`, el título `#`, la sección `## Veredicto` con su línea y el siguiente encabezado `##` real del template
seguido de `…`. Entre todos cubren los seis valores del vocabulario:

| Ejemplo | `type` | Título | `verdict` | Motivo de ejemplo | Siguiente `##` |
|---|---|---|---|---|---|
| 7.1 `epic-analyze` | `epic-analyze` | `# Análisis de épica: …` | `NEEDS-REFINEMENT` | 1 hallazgo ERROR de integridad | `## Resumen` |
| 7.2 `story-evaluation` | `finvest-evaluation` | `# Evaluación FINVEST` | `SPLIT` | S – Small = 1 | `## Historia evaluada` |
| 7.3 `story-analyze` | `analyze` | `# Reporte de Coherencia: …` | `APPROVED` | Sin ERROR; 2 WARNING | `## Resumen Ejecutivo` |
| 7.4 `story-code-review` | `code-review-report` | `# Code Review Report: …` | `NEEDS-CHANGES` | Hallazgo de severidad HIGH | `## Resumen` |
| 7.5 `story-verify` | `verify-report` | `# Test Report: …` | `BLOCKED` | Las pruebas no se pueden ejecutar en el entorno | `## Summary` |
| 7.6 `story-acceptance` | `acceptance-report` | `# Acceptance Report: …` | `PENDING` | `session-status: partial`, 3 de 5 criterios evaluados | `## Resumen ejecutivo` |

Los títulos `#` y el siguiente `##` se toman del template vigente de cada skill al implementar. Si un template no tiene
el encabezado indicado, se usa el primer `##` real (veracidad). Los ejemplos no llevan wikilinks ni enlaces, para no
generar falsos positivos en `verify:links`.

| Alternativa | Motivo del rechazo |
|---|---|
| Reportes completos de ejemplo | Multiplican el tamaño por diez, contradicen CNF-4 y duplican los templates, que son la fuente del resto de la estructura. |
| Un solo esqueleto genérico | AC-1 exige un ejemplo por cada uno de los seis skills. |
| Todos los ejemplos con `APPROVED` | No ilustran los valores de rechazo, bloqueo y extensión, que son los que generan dudas (CNF-3). |

### D-10 — ADR-0015 registra la decisión; la policy, las reglas // satisface: CNF-1 · resuelve CR-001

`docs/adr/ADR-0015-contrato-de-validacion.md` sigue `docs/adr/adr-template.md`:

- **Frontmatter:** `type: adr`, `id: ADR-0015`, `slug: contrato-de-validacion`,
  `title: "Contrato común de validación para los skills de gate"`, `status: ACCEPTED`, `date: 2026-10-17`,
  `supersedes: null` y `superseded-by: null`.
- **Secciones:** Contexto y problema (las tres divergencias del «Origen» de la épica); Decisión (un contrato común de
  veredicto definido en la policy, en inglés y mayúsculas, con dos valores de rechazo distintos por fase); Rationale;
  Alternativas consideradas (vocabulario en español, un único valor de rechazo y mantener vocabularios por skill);
  Consecuencias (ruptura de consumidores externos y mitigación con §5); Referencias (policy, EPIC-25 y flowcharts).
- **Sin duplicación (CNF-1):** el ADR no reproduce las tablas de §4 y §5. Para la lista de valores remite a la policy.
- **Estado `ACCEPTED`:** el PO tomó las decisiones el 2026-10-17 (Notas de la historia). El ADR se redacta como última
  pieza de contenido, con la policy ya cerrada, porque un ADR aceptado es inmutable.

| Alternativa | Motivo del rechazo |
|---|---|
| Sin ADR, solo la policy | Incumple la regla 16 de la constitución y el criterio de `docs/adr/README.md`, porque la decisión afecta a más de un skill y fija un contrato. El PO eligió incluirlo (2026-10-17). |
| ADR en una historia aparte | Deja el contrato publicado sin su registro de decisión mientras STORY-139…145 avanzan en paralelo. |
| ADR `PROPOSED` | Las decisiones ya están tomadas, y un ADR propuesto no es vinculante para las historias de alineación. |

### D-11 — Registro en índices // satisface: CNF-1

| Índice | Cambio |
|---|---|
| `docs/policies/README.md` › Índice de policies | Reemplaza la fila «Todavía no hay policies…» por `[validation-contract-policy.md](validation-contract-policy.md) · Veredicto y vocabulario de los reportes de validación · —`. |
| `docs/adr/README.md` › Índice de ADRs | Añade la fila `[ADR-0015](ADR-0015-contrato-de-validacion.md) · Contrato común de validación para los skills de gate · ACCEPTED · 2026-10-17`. |
| `docs/index.md` | Se regenera con `/memory-system index`, su escritor canónico. No se edita a mano. |

## Componentes afectados

| Componente | Acción | Ubicación | Satisface |
|---|---|---|---|
| Política de contrato de validación | crear | `docs/policies/validation-contract-policy.md` | AC-1, AC-2, AC-3, CNF-1…4 |
| ADR del contrato de validación | crear | `docs/adr/ADR-0015-contrato-de-validacion.md` | CR-001, CNF-1 |
| Índice de policies | modificar | `docs/policies/README.md` | CNF-1 |
| Índice de ADRs | modificar | `docs/adr/README.md` | CNF-1 |
| Índice de la wiki | regenerar | `docs/index.md` (vía `/memory-system index`) | CNF-1 |

No se tocan: `skills/**`, `docs/architecture/diagrams/*.mermaid`, `README.md`, `docs/constitution.md` ni `epic.md`.

## Interfaces

La policy es un contrato que leen dos tipos de consumidores: los autores de skills (STORY-139…145, EPIC-23) y los
lectores de reportes (agentes, orquestadores y CI).

| Interfaz | Contrato | Consumidor | Satisface |
|---|---|---|---|
| Campo `verdict` | Clave YAML de primer nivel, un único escalar que cumple `^[A-Z]+(-[A-Z]+)*$` y está en §4 para el skill | CI, orquestadores, `epic-validate` | AC-1, CNF-2 |
| Línea de veredicto | Primera línea de `## Veredicto`: `**Veredicto:** `<VALOR>` — <motivo>` | Lectores humanos, evals | AC-1 |
| Tabla §4 | Columnas `Skill · Reporte · Fase · Valores permitidos · Flowchart · Valores sin rama`; ancla `#4-valores-permitidos-por-skill` | STORY-139…145, EPIC-23, STORY-143 | AC-1, AC-3 |
| Tabla §5 | Columnas `Skill · Campo heredado · Valor heredado · Valor canónico`; ancla `#5-equivalencias-de-valores-heredados` | STORY-139…145, lectores de reportes heredados | AC-2 |
| Tabla §6 | Columnas `Skill · Elemento conservado · Motivo · Historia`; ancla `#6-excepciones` | STORY-139…145 | CNF-1 |
| Reglas `G-01…G-06` | IDs estables citables (`G-0N`) | Skills, code review, STORY-143 | AC-1 |

## Esquema de datos // satisface: AC-1, CNF-1

Frontmatter de la policy:

```yaml
type: policy
slug: validation-contract-policy
title: "Política de contrato de validación"
derives-from: constitution
```

Fragmento de contrato que todo reporte de validación debe contener (forma abstracta):

```markdown
---
type: <type del template del skill>
verdict: <VALOR permitido en §4>
---

# <título del reporte>

## Veredicto

**Veredicto:** `<VALOR>` — <motivo en una frase>
```

## Flujos clave

### F-1 — Un autor alinea un skill (STORY-139…145) // AC-1, AC-2

1. Busca su skill en §4 y obtiene los valores permitidos.
2. Consulta §5 para reemplazar cada valor heredado por su valor canónico.
3. Aplica G-01…G-04 al template, usando el ejemplo de §7 como referencia.
4. Si conserva una divergencia, la registra en §6 con su motivo.

### F-2 — CI o un orquestador consumen un reporte // AC-1 (G-06)

Leen `verdict` del frontmatter y comprueban que figura en §4 para el skill. Con `APPROVED`, avanzan. Con cualquier otro
valor, se detienen o siguen la rama del flowchart (`NEEDS-*`, `SPLIT`). Con `BLOCKED` o `PENDING`, se detienen sin
rama.

### F-3 — Lectura de un reporte heredado // AC-2 (D-7)

El valor no está en §4. El consumidor lo busca en §5 por el par (skill, valor). Si lo encuentra, usa el valor canónico.
Si no, aplica G-06 (no aprobado).

### F-4 — Degradación y cambio (P6, P7)

- **Valor ausente o desconocido:** G-06 lo trata como no aprobado. El fallo es visible, nunca silencioso.
- **Un flowchart gana o pierde una rama:** se actualiza la fila de §4 con una nueva versión en «Historial de cambios»,
  y la invariante de AC-3 delata la deriva.
- **Nuevo skill de validación:** se añade una fila en §4 y su ejemplo en §7. No hace falta tocar §2 si usa el
  vocabulario existente.
- **Nueva extensión local:** se añade al vocabulario de §2 con su fase «Extensión local de `<skill>`». Si cambia el
  contrato, requiere un ADR nuevo.

## Decisiones de complejidad justificada

| Elemento | Por qué no basta algo más simple | Satisface |
|---|---|---|
| Columna «Valores sin rama» en §4 | Sin ella, AC-3 exigiría deducir qué valores son excepción. Con ella, la invariante se comprueba con una resta de conjuntos. | AC-3 |
| Tabla §5 con una fila por valor (18 filas) | Agrupar valores por skill acortaría la tabla, pero AC-2 consulta pares (skill, valor). Una fila por par permite consultarla sin interpretar. | AC-2 |
| Sección §6 vacía | Es una línea. Evita que STORY-139 y siguientes inventen ubicaciones distintas para las excepciones. | CNF-1 |
| ADR además de la policy | Lo exige la constitución (regla 16). Ambos documentos tienen papeles distintos: el ADR explica el porqué y es inmutable, la policy fija el qué y es versionada. | CNF-1, CR-001 |
| G-06 | Es una línea, y sin ella el contrato no le dice a CI qué hacer ante un reporte roto. | AC-1 |

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | La policy existe con el frontmatter de D-1, y `slug` coincide con el nombre del archivo | Lectura del archivo | AC-1, CNF-1 |
| V-2 | Los encabezados `##` fuera de bloques cercados son exactamente los de D-2 y están en ese orden | `grep -n -E '^## ([0-9]+\. \|Historial)' docs/policies/validation-contract-policy.md`. Los `##` de §7 van dentro de bloques cercados | AC-1 |
| V-3 | G-02 exige `## Veredicto` como primera sección tras el título, y G-01 exige `verdict` | Lectura de §3 | AC-1 |
| V-4 | §2 lista los seis valores con su fase, y todos cumplen `^[A-Z]+(-[A-Z]+)*$` | Lectura de §2 y regex sobre los valores entre comillas invertidas | AC-1, CNF-2 |
| V-5 | §4 tiene las siete filas de D-4 con esos valores | Comparación con las Notas de story.md | AC-1 |
| V-6 | §5 contiene las 18 filas de D-5, incluidos los 7 ejemplos de AC-2 | Comparación fila a fila con la tabla de Ejemplos de AC-2 | AC-2 |
| V-7 | Para cada fila con flowchart, los valores permitidos menos los valores sin rama coinciden con las ramas que salen del skill en el `.mermaid`, y en «Valores sin rama» solo aparecen `BLOCKED` y `PENDING` | `grep -n -- '-->|' docs/architecture/diagrams/flowchart-story-*.mermaid` y comparación con §4 | AC-3 |
| V-8 | §7 tiene seis ejemplos. En cada uno, `verdict` coincide con la línea de `## Veredicto`, el valor está permitido para su skill y `## Veredicto` es el primer `##` tras el `#` | Lectura de §7 | AC-1 |
| V-9 | La policy tiene como máximo 200 líneas y ninguna regla se repite entre secciones | `wc -l` y lectura | CNF-4 |
| V-10 | Un PO puede responder, solo con la policy, qué valor emite `story-verify` cuando no puede ejecutar las pruebas y qué significa `ACCEPTANCE-BLOCKED` | Revisión del PO en ACCEPTANCE | CNF-3 |
| V-11 | ADR-0015 existe con el frontmatter de D-10, no contiene las tablas de §4 ni §5 y figura en `docs/adr/README.md` | Lectura y `grep -c '^| `story-' docs/adr/ADR-0015-contrato-de-validacion.md` = 0 | CNF-1, CR-001 |
| V-12 | La policy figura en `docs/policies/README.md` y en `docs/index.md` | `grep validation-contract-policy` en ambos | CNF-1 |
| V-13 | `npm run verify:repository` pasa, incluidos los enlaces activos de la policy | Ejecución | CNF-1 |

## Risks / Trade-offs

- **[Ruptura de consumidores externos que leen `decision`, `review-status` o `final-status`]** → §5 y D-7 dan la
  traducción, y ADR-0015 la documenta en Consecuencias. La ruptura efectiva ocurre en STORY-139…145, no aquí.
- **[Deriva entre la policy y los flowcharts]** → la columna «Flowchart» de §4 y la invariante de AC-3 la hacen
  detectable. El validador automático es alcance de STORY-143.
- **[`epic-validate` no existe]** → la fila se marca «previsto, EPIC-23» y no lleva enlace. Cuando EPIC-23 cree el
  skill, la fila no cambia.
- **[La tabla §5 tensiona CNF-4]** → son 18 filas de una línea. Se prefiere la consulta directa (CNF-3) a la
  compresión.
- **[ADR `ACCEPTED` inmutable]** → se redacta al final, con la policy cerrada (D-10). Cualquier cambio posterior del
  contrato va en un ADR nuevo y en una versión nueva de la policy.

## Open Questions

Ninguna. La necesidad del ADR se resolvió con el PO (CR-001).

## Autoevaluación (P9, P10)

- **Omisiones:** los tres AC y los cuatro CNF tienen cobertura (Componentes afectados y Contratos de verificación). Las
  notas de STORY-139 (excepciones) y STORY-140 (reportes heredados) quedan cubiertas por D-8 y D-7.
- **Ambigüedad:** la posición de `## Veredicto` (G-02), el formato del valor (§2), la precedencia (G-05) y la lectura ante
  fallo (G-06) son explícitos. El alcance excluye por nombre a `epic-format-validation` y `security-audit`.
- **Nombres:** «veredicto» y `verdict` designan lo mismo en todo el documento. «Valor heredado» y «valor canónico» se usan
  igual en §5, D-5 y los flujos.
- **Estructura:** no hay dependencias cíclicas (la policy deriva de la constitución, el ADR y los índices remiten a la
  policy, y la policy no depende de ningún skill). Cada sección tiene una sola responsabilidad.

## Registro de Cambios (CR)

### CR-001

- **Tipo**: dependencia
- **Descripción**: la decisión afecta a siete skills y fija un contrato que otros deben seguir. Por eso cumple los
  criterios de ADR de la regla 16 de la constitución y de `docs/adr/README.md`. La historia no lo prevé, aunque tampoco
  lo excluye en Fuera de alcance.
- **Documento afectado**: design.md
- **Acción requerida**: resuelta. El PO eligió incluir ADR-0015 en esta historia (2026-10-17), y queda diseñado en D-10
  y verificado en V-11. `story.md` no requiere cambios.
