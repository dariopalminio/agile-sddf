---
alwaysApply: false
type: design
id: STORY-178
slug: STORY-178-adr-guia-de-revision-design
title: "Design: ADR de la guía de revisión"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-178
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-178-adr-guia-de-revision
  - EPIC-28-calibrar-story-code-review-con-review-md
---

<!-- Referencias -->
[[STORY-178-adr-guia-de-revision]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[layout-fijo-con-archivo-de-epicas]] · [[contrato-de-validacion]]

## Context

La historia es un `chore` documental: registra en un ADR nuevo las decisiones de EPIC-28 sobre `REVIEW.md`, para que STORY-179 a STORY-185 las apliquen sin reabrirlas. No crea `REVIEW.md` ni toca `story-code-review`, sus agentes, el DoD ni `sddf-constitution` (Non-Goals).

Estado verificado en el filesystem (2026-11-08):

| Fuente | Hallazgo |
|---|---|
| `docs/adr/` | Último ADR: `ADR-0020-contratos-centralizados-para-spec-living.md`. Sin coincidencias de `ADR-0021` en el repo: el siguiente número libre es **ADR-0021**. |
| `docs/adr/adr-template.md` | Frontmatter `type`, `id`, `slug`, `title`, `status`, `date`, `supersedes`, `superseded-by`; seis secciones: Contexto y problema, Decisión, Rationale, Alternativas consideradas, Consecuencias, Referencias. Los ADR existentes (ADR-0015, ADR-0019) no conservan los comentarios `escritor:` del template. |
| `docs/adr/README.md` | Tabla `## Índice de ADRs` con columnas ID, Título, Estado, Fecha; última fila ADR-0020. |
| `docs/index.md` | Sección `### Decisiones de arquitectura (adr/)` lista ADR-0001 a ADR-0020 con el formato `- [[<slug>]] — [<archivo>](adr/<archivo>) — <título>`. |
| `docs/constitution.md` | Regla 16: ADR obligatorio si la decisión afecta a más de un skill o restringe decisiones futuras; las decisiones de un solo skill van al `design.md` de la historia. |
| `ADR-0019` | Declara las raíces hermanas `docs/`, `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/`; no regula archivos sueltos de la raíz (`AGENTS.md`, `CLAUDE.md`). |
| `skills/story-code-review/SKILL.md` | Severidades `HIGH > MEDIUM > LOW > ninguna`; bloqueante = `HIGH` o `MEDIUM` (4c); el orquestador no usa git (4c.2: «No se invoca `git diff`») y conoce los archivos de la historia por `$IMPL_FILES`, extraídos de `implement-report.md` (2c). El DoD se resuelve como `$DOD_PATH` (2d). |
| `skills/story-code-review/assets/code-review-report-template.md` | Contrato del informe: frontmatter con `max-severity`, secciones y veredicto (ADR-0015). |
| `REVIEW.md` | No existe en el repo (lo crea STORY-179). |
| STORY-179 | Nombra las cuatro secciones de `REVIEW.md`: «Qué es «Importante» aquí», «Tope de nits», «No reportar», «Verificar siempre», con doble vocabulario según este ADR. |
| STORY-180 (AC-4), STORY-181 (AC-3, Notas) | Esperan del ADR la fuente de lectura, la precedencia y el método para identificar líneas no tocadas. Ver D-6 y CR-001. |
| Convención de Anthropic | `code.claude.com/docs/en/code-review-customize` (consultada el 2026-11-07, notas de EPIC-28): `REVIEW.md` en la raíz; solo lo lee el servicio gestionado de Code Review en GitHub; «cambia lo que la revisión encuentra y reporta; no cambia el formato»; se lee de la rama base, nunca de los cambios del PR; severidades Important, Nit, Pre-existing; el check es neutral y nunca bloquea. |

Stakeholders: el mantenedor que ejecuta STORY-179 a STORY-185, que citarán ADR-0021.

## Goals / Non-Goals

**Goals:**
- Crear `docs/adr/ADR-0021-guia-de-revision-review-md.md` con `status: ACCEPTED` y las seis secciones del template // satisface: AC-1
- Fijar en `## Decisión` la ubicación (D-2), la precedencia (D-3), la fuente de lectura (D-4), la regla para historias que modifican la guía o el DoD (D-5) y el vocabulario (D-6) // satisface: AC-1, AC-2, AC-3
- Distinguir en el ADR la convención de Anthropic de la decisión de agile-sddf, citando la fuente // satisface: CNF-3
- Listar ADR-0021 en `docs/adr/README.md` y en `docs/index.md` // satisface: AC-1

**Non-Goals:**
- Crear `REVIEW.md` o su plantilla (STORY-179, STORY-184)
- Modificar `story-code-review`, sus agentes o su plantilla de informe (STORY-180 a STORY-182, STORY-185)
- Modificar `dod-story-code-review.md` o `sddf-constitution` (STORY-183, STORY-184)
- Editar o reemplazar ADR-0019 o ADR-0015 (CNF-1)
- Fijar el método concreto para identificar líneas no tocadas (D-6, CR-001)

## Decisions

### D-1 — ADR nuevo `ADR-0021`, aceptado al crearse // satisface: AC-1

| Campo | Valor |
|---|---|
| Archivo | `docs/adr/ADR-0021-guia-de-revision-review-md.md` |
| `type` | `adr` |
| `id` | `ADR-0021` |
| `slug` | `guia-de-revision-review-md` (único en `docs/`: verificado sin coincidencias) |
| `title` | `"Guía de revisión por proyecto en REVIEW.md"` |
| `status` | `ACCEPTED` |
| `date` | fecha de implementación (`YYYY-MM-DD`) |
| `supersedes` | `null` |
| `superseded-by` | `null` |

Cuerpo: `# ADR-0021: Guía de revisión por proyecto en REVIEW.md` y las seis secciones de `adr-template.md` en su orden, sin comentarios `escritor:` ni `[Por completar]` (convención de ADR-0015 y ADR-0019).

**Alternativas rechazadas:**
- **Crear el ADR `PROPOSED`:** AC-1 y CS-1 exigen `ACCEPTED`, y STORY-179 a STORY-185 necesitan una decisión vinculante; la épica ya está en `DEFINE/DONE` con las decisiones en sus notas.
- **Registrar las decisiones en el `design.md` de STORY-180:** la regla 16 de la constitución exige ADR, porque la decisión afecta a `story-code-review` y a `sddf-constitution` y restringe a siete historias.

### D-2 — Ubicación: `<REPO_ROOT>/REVIEW.md`, un solo archivo // satisface: AC-1, CNF-1

El ADR declara:
- `REVIEW.md` vive en la raíz del repositorio, como `AGENTS.md` y `CLAUDE.md`: es un archivo de convención de herramienta, no una raíz del layout. Las tres raíces de ADR-0019 no cambian y ADR-0019 no se edita ni se reemplaza.
- agile-sddf lee un solo `REVIEW.md`, el de la raíz. Los `REVIEW.md` de subdirectorios que admite Claude Code Review no se leen.
- El `REVIEW.md` de este repo no se publica en npm (`package.json › files` no lo incluye); los proyectos consumidores reciben una semilla con `/sddf-constitution` (STORY-184).

**Alternativas rechazadas:**
- **`docs/guardrails/review.md` (o `docs/REVIEW.md`):** encaja en el layout, pero rompe la convención de Claude Code Review; si el servicio de GitHub se activa, no lo leería y habría dos guías.
- **Leer también los `REVIEW.md` de subdirectorios:** ninguna historia lo necesita (YAGNI) y exigiría una regla de fusión entre archivos.

### D-3 — Precedencia: qué decide `REVIEW.md` y qué no // satisface: AC-1

El ADR fija esta tabla, de mayor a menor autoridad:

| # | Fuente | Qué decide | Relación con `REVIEW.md` |
|---|---|---|---|
| 1 | `docs/constitution.md` | Principios inamovibles y reglas técnicas del proyecto | `REVIEW.md` no puede contradecirla |
| 2 | DoD CODE-REVIEW (`$DOD_PATH`, por defecto `docs/guardrails/dod-story-code-review.md`) | Criterios que la revisión debe comprobar y su `enforcement` | `REVIEW.md` no elimina, relaja ni cambia el `enforcement` de un criterio |
| 3 | `REVIEW.md` | Qué es bloqueante en cada área del repo, tope de LOW, qué no reportar y qué verificar siempre | — |
| 4 | Criterios genéricos de los revisores (`agents/*.agent.md`, checklists `docs/guardrails/gr-*security*`, baseline embebido) | Qué buscar por defecto y con qué severidad | `REVIEW.md` prevalece: puede excluir rutas o patrones (p. ej. fixtures) y subir o bajar la severidad de un tipo de hallazgo |

Y, fuera de la escala, la plantilla `code-review-report-template.md` fija el formato del informe (frontmatter, secciones y veredicto, ADR-0015). `REVIEW.md` nunca cambia el formato ni el vocabulario de `verdict`.

Regla de conflicto: si una línea de `REVIEW.md` contradice una fuente de nivel superior, rige la superior y esa línea no se aplica. Sin `REVIEW.md`, rigen las fuentes 1, 2 y 4 como hoy (CS-2).

**Alternativas rechazadas:**
- **`REVIEW.md` por encima del DoD:** una guía del proyecto podría anular un criterio del gate sin pasar por `/sddf-constitution`, que es quien versiona el DoD.
- **`REVIEW.md` al mismo nivel que los checklists de seguridad, sin precedencia:** deja sin resolver SMOKE-1 (secreto falso en `examples/` excluido por `REVIEW.md` frente a una regla genérica de secretos).
- **`REVIEW.md` también fija el formato:** contradice la convención de Anthropic y rompe el contrato de ADR-0015.

### D-4 — Fuente de lectura: el working tree // satisface: AC-1, AC-3, CNF-2

El ADR declara: `/story-code-review` lee `<REPO_ROOT>/REVIEW.md` del working tree, en el estado en que está al ejecutarse la revisión, y lo pasa a los cuatro revisores y al árbitro. Para leerlo no usa git.

**Alternativas rechazadas** (las registra `## Alternativas consideradas`, CNF-2):
- **Rama base (convención de Anthropic):** impide que un cambio rebaje su propio listón, pero obliga al skill a usar git (`git show <base>:REVIEW.md`) y a conocer una rama base que el flujo local no define: las historias se revisan con cambios sin commit en una rama de épica (p. ej. `epic/EPIC-28-…`), y no siempre hay remoto ni PR. Sin git, la revisión fallaría.
- **Leer ambas versiones y aplicar la más estricta:** necesita git igual que la anterior y una regla para comparar guías en lenguaje natural que no es determinista.

### D-5 — Historia que modifica `REVIEW.md` o el DoD // satisface: AC-3

El ADR declara:
- Rige la versión del working tree, la que incluye el cambio de la historia (consecuencia de D-4).
- `/story-code-review` advierte en `code-review-report.md` que la historia modifica las reglas con las que se la revisa, nombrando el archivo (`REVIEW.md`, `$DOD_PATH` o ambos).
- La detección compara `REVIEW.md` y `$DOD_PATH` con `$IMPL_FILES` (archivos de `implement-report.md`), sin git. Si `$IMPL_FILES` está vacío, el informe dice que no pudo comprobarlo.
- La advertencia no cambia `verdict` ni `max-severity`: la decide el humano en `/story-acceptance`.
- El texto de la advertencia y la sección existente que la contiene los fija STORY-180, sin cambiar el contrato del informe (CS-2).

**Alternativas rechazadas:**
- **Bloquear (`BLOCKED`) la revisión de toda historia que modifique la guía:** bloquearía a STORY-179, que crea `REVIEW.md`, y a STORY-183, que modifica el DoD.
- **Detectar con `git diff`:** contradice D-4; `$IMPL_FILES` ya está disponible en el Paso 2c.

### D-6 — Vocabulario: una traducción por severidad // satisface: AC-2

El ADR contiene esta tabla, con una fila por severidad:

| Claude Code Review | `story-code-review` | Efecto sobre el veredicto |
|---|---|---|
| 🔴 Important | `HIGH` o `MEDIUM` | bloquea (`NEEDS-CHANGES`) |
| 🟡 Nit | `LOW` | no bloquea |
| 🟣 Pre-existing | `PREEXISTENTE` | no bloquea |

Reglas que acompañan la tabla:
- **Important → HIGH o MEDIUM:** `REVIEW.md` define qué es bloqueante; elegir entre `HIGH` y `MEDIUM` sigue el criterio actual de cada revisor. Ambos bloquean, así que la traducción es única en su efecto.
- **PREEXISTENTE es una categoría, no un valor de severidad:** no entra en `max-severity` (cuyos valores siguen siendo `HIGH`, `MEDIUM`, `LOW`, `ninguna`) ni en `fix-directives.md`.
- **Asignación conservadora:** un hallazgo solo es `PREEXISTENTE` con evidencia de que está en líneas que la historia no tocó. Sin esa evidencia, conserva su severidad y el informe dice por qué no se aplicó. El método para obtener la evidencia lo fija el `design.md` de STORY-181 (decisión de un solo skill, regla 16), dentro de esta regla. Ver CR-001.
- **Secciones de `REVIEW.md`:** «Qué es «Importante» aquí» define lo que se reporta como `HIGH`/`MEDIUM`; «Tope de nits» limita los `LOW`; «No reportar» excluye hallazgos; «Verificar siempre» añade comprobaciones. Así las nombra STORY-179.

**Alternativas rechazadas:**
- **Important → solo HIGH:** todo `MEDIUM` dejaría de bloquear y cambiaría el veredicto de los 71 informes archivados en su línea base.
- **Adoptar el vocabulario de Anthropic en el informe:** cambia `max-severity` y rompe el contrato de ADR-0015 y CS-2.
- **PREEXISTENTE como cuarto valor de `max-severity`:** rompe a los consumidores del frontmatter (STORY-181 CNF-2).
- **Fijar en el ADR el método de líneas no tocadas** (`git diff HEAD`, `git diff` contra la rama principal o rangos de línea en `implement-report.md`): cada uno tiene un caso que oculta defectos propios (commits parciales) o cambia el contrato de `story-implement-tasks`; elegir uno exige el análisis de STORY-181.

### D-7 — Contenido de `## Contexto y problema`, `## Rationale`, `## Consecuencias` y `## Referencias` // satisface: AC-1, CNF-3

- **Contexto y problema:** el ruido de `/story-code-review` (línea base de EPIC-28: ≈580 LOW en 55 de 71 informes, LOW arrastrados y duplicados en STORY-125) y las reglas propias de agile-sddf dentro de los agentes. Dos bloques separados con estos títulos:
  - **Lo que dice la convención de Anthropic** (cita `https://code.claude.com/docs/en/code-review-customize`): `REVIEW.md` solo lo lee el servicio gestionado de GitHub (el `/code-review` local no); cambia lo que se reporta, no el formato; se lee de la rama base; Important, Nit, Pre-existing; check neutral que nunca bloquea.
  - **Lo que decide agile-sddf:** `story-code-review` es un gate que bloquea, así que lee `REVIEW.md` de forma explícita, desde el working tree (D-4), y traduce las severidades (D-6).
- **Rationale:** (1) separar los criterios genéricos que distribuye el framework de la calibración de cada proyecto; (2) reutilizar la convención de Anthropic para que un mismo archivo sirva al gate local y al servicio de GitHub; (3) KISS: sin git en el skill para leer la guía; (4) la constitución prevalece (AGENTS.md, flujo de autoridad).
- **Alternativas consideradas:** las de D-2, D-3, D-4 (incluida la rama base, CNF-2), D-5 y D-6.
- **Consecuencias positivas:** cada proyecto calibra la revisión sin editar los agentes; los agentes quedan sin reglas propias de agile-sddf (CS-3).
- **Consecuencias negativas / trade-offs:** una historia puede rebajar su propio listón (mitigado por D-5 y `/story-acceptance`); un mismo `REVIEW.md` se lee distinto en local (working tree) que en GitHub (rama base) mientras el cambio no se fusione; los proyectos sin `REVIEW.md` no cambian (advertencia, CS-2).
- **Referencias:** `[[layout-fijo-con-archivo-de-epicas]]`, `[[contrato-de-validacion]]`, `[[EPIC-28-calibrar-story-code-review-con-review-md]]`, la URL de Anthropic y STORY-179 a STORY-185.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| ADR de la guía de revisión | crear | `docs/adr/ADR-0021-guia-de-revision-review-md.md` | AC-1, AC-2, AC-3, CNF-1 a CNF-3 |
| Índice de ADRs | modificar (una fila al final) | `docs/adr/README.md` | AC-1 |
| Índice wiki | modificar (una línea tras ADR-0020) | `docs/index.md` | AC-1, CNF-4 |

No se modifica ningún otro archivo (Non-Goals).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Frontmatter de ADR | campos de `adr-template.md`; `status ∈ {PROPOSED, ACCEPTED, DEPRECATED, SUPERSEDED}` (README) | AC-1 |
| Fila del índice de ADRs | `\| [ADR-0021](ADR-0021-guia-de-revision-review-md.md) \| <title> \| ACCEPTED \| <date> \|`, con `title` y `date` idénticos al frontmatter | AC-1 |
| Línea de `docs/index.md` | `- [[guia-de-revision-review-md]] — [ADR-0021-guia-de-revision-review-md.md](adr/ADR-0021-guia-de-revision-review-md.md) — <title>`; el wikilink se resuelve por `slug:` (`check-doc-links.js`) | AC-1, CNF-4 |
| ADR-0021 → STORY-179 a STORY-185 | Las historias citan las decisiones D-2 a D-6 por su contenido en `## Decisión`, sin repetirlas en su `design.md` | AC-1 a AC-3 |

## Esquema de datos // satisface: AC-1

```yaml
type: adr
id: ADR-0021
slug: guia-de-revision-review-md
title: "Guía de revisión por proyecto en REVIEW.md"
status: ACCEPTED
date: <YYYY-MM-DD>
supersedes: null
superseded-by: null
```

Estructura de `## Decisión` (subtítulos `###` en este orden): Ubicación (D-2), Precedencia (D-3), Fuente de lectura (D-4), Historias que modifican la guía o el DoD (D-5), Vocabulario (D-6).

## Flujos clave

### F-1 — Registro del ADR (escenario principal) // AC-1
1. Confirmar que `ADR-0021-*` sigue libre (F-3).
2. Crear ADR-0021 (D-1) con `## Decisión` (D-2 a D-6) y el resto de secciones (D-7).
3. Añadir la fila en `docs/adr/README.md` y la línea en `docs/index.md`.
4. Ejecutar `npm run verify:repository` y `npm test` (CNF-4).

### F-2 — Consulta de una severidad // AC-2
El lector busca `Important`, `Nit` o `Pre-existing` en la tabla de vocabulario del ADR y encuentra una sola fila con categoría y efecto.

### F-3 — Degradación // P7
- Si al implementar ya existe `ADR-0021-*` (trabajo en paralelo): usar el siguiente número libre y propagarlo a la fila del README, la línea de `docs/index.md` y el título; registrarlo en `implement-report.md`.
- Si `verify:repository` falla por el wikilink o el enlace de `docs/index.md`: corregir la ruta o el slug, nunca relajar el checker.
- La URL de Anthropic puede cambiar: el ADR la cita con la fecha de consulta (2026-11-07), para que la decisión no dependa de que siga vigente.

### F-4 — Puntos de cambio // P6
- Si se activa Claude Code Review en GitHub y se quiere la rama base también en local: ADR nuevo que reemplace D-4, sin editar ADR-0021.
- Si se admiten `REVIEW.md` por subdirectorio: ADR nuevo que reemplace D-2.
- El método de líneas no tocadas puede cambiar en STORY-181 o después sin tocar el ADR, mientras respete la asignación conservadora de D-6.

## Decisiones de complejidad justificada

- **Tabla de precedencia de cuatro niveles (D-3):** la historia solo pide la relación con `constitution.md`, el DoD y la plantilla; el nivel 4 (criterios genéricos de los revisores) se incluye porque sin él SMOKE-1 no tiene respuesta: es exactamente lo que `REVIEW.md` calibra.
- **Detección por `$IMPL_FILES` en D-5:** fijarla en el ADR evita que STORY-180 reabra «git o no git»; reutiliza un dato que el skill ya tiene.
- **Línea en `docs/index.md`:** no la pide ningún AC, pero el índice wiki lista todos los ADR (precedente STORY-147); es una línea, sin regenerar el índice.
- No se crea script, test ni eval: es un `chore` documental y el gate existente cubre CNF-4.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | ADR-0021 existe y está aceptado | Frontmatter: `id: ADR-0021`, `status: ACCEPTED`, `slug` igual al nombre de archivo sin `ADR-0021-` ni extensión | AC-1 |
| 2 | Tiene las seis secciones del template, en orden | Encabezados `##` de ADR-0021 = Contexto y problema, Decisión, Rationale, Alternativas consideradas, Consecuencias, Referencias; sin `[Por completar]` | AC-1 |
| 3 | `## Decisión` fija ubicación, precedencia y fuente | Contiene `<REPO_ROOT>/REVIEW.md` (o «raíz del repositorio»), la tabla de D-3 con `constitution.md`, `dod-story-code-review.md` y `code-review-report-template.md`, y la palabra «working tree» | AC-1 |
| 4 | README lista el ADR igual | La fila de ADR-0021 en `docs/adr/README.md` tiene el mismo `title`, `ACCEPTED` y la misma `date` que el frontmatter | AC-1 |
| 5 | Una fila por severidad | En la tabla de vocabulario, `Important`, `Nit` y `Pre-existing` aparecen una vez cada una, con `HIGH o MEDIUM`/bloquea, `LOW`/no bloquea y `PREEXISTENTE`/no bloquea | AC-2 |
| 6 | Historia que modifica la guía o el DoD | `## Decisión` dice que rige la versión del working tree, exige la advertencia en el informe y detecta con `$IMPL_FILES`, sin git | AC-3 |
| 7 | Sin cuarta raíz y ADR-0019 intacto | ADR-0021 compara `REVIEW.md` con `AGENTS.md` y `CLAUDE.md`; `git diff -- docs/adr/ADR-0019-layout-fijo-con-archivo-de-epicas.md` vacío | CNF-1 |
| 8 | Alternativa de fuente descartada | `## Alternativas consideradas` contiene «rama base» con motivo de descarte | CNF-2 |
| 9 | Fuente citada y distinguida | ADR-0021 contiene `code.claude.com/docs/en/code-review-customize` y los dos bloques de D-7 | CNF-3 |
| 10 | Gate verde | `npm run verify:repository` y `npm test` terminan con código 0 | CNF-4 |
| 11 | Alcance acotado | `git diff --stat` solo muestra los 3 archivos de «Componentes afectados» (más artefactos de la historia) | Non-Goals |

## Risks / Trade-offs

- **[Riesgo] Una historia rebaja su propio listón** editando `REVIEW.md` o el DoD → advertencia en el informe (D-5) y decisión humana en `/story-acceptance`.
- **[Riesgo] Si `implement-report.md` no lista `REVIEW.md` o el DoD, D-5 no detecta el cambio** → el informe solo dice «no pudo comprobarlo» cuando `$IMPL_FILES` está vacío; un `implement-report.md` incompleto es un defecto de esa etapa, que revisa el Product-Owner-Reviewer.
- **[Trade-off] Lectura distinta en local y en GitHub** (working tree frente a rama base) → se documenta en Consecuencias; desaparece al fusionar el cambio.
- **[Limitación] `check-doc-links.js` excluye `docs/adr`** → los enlaces dentro de ADR-0021 no los valida el gate; verificarlos a mano.

## Open Questions

Ninguna: la decisión (b) de la épica queda acotada en D-6 y su método se delega de forma explícita en STORY-181 (CR-001).

## Autoevaluación (P9, P10)

- **Omisiones:** los 3 AC y los 4 CNF tienen decisión y contrato de verificación (AC-1: D-1 a D-4, D-7; AC-2: D-6; AC-3: D-4, D-5; CNF-1: D-2; CNF-2: D-4; CNF-3: D-7; CNF-4: F-1).
- **Ambigüedad:** «Important → HIGH o MEDIUM» se resuelve por su efecto (ambos bloquean) y deja la elección al criterio actual del revisor (D-6).
- **Nombres:** «guía de revisión», «PREEXISTENTE», «working tree», «rama base» y `$IMPL_FILES`/`$DOD_PATH` se usan igual que en la historia, la épica y `story-code-review`.
- **Estructura:** tres archivos sin dependencias cíclicas; cada uno con una sola razón de cambio; sin código.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: STORY-181 (AC-3 y Notas) espera que el ADR fije el método para identificar las líneas que la historia no tocó. Este diseño no lo fija: la decisión afecta solo a `story-code-review` (regla 16 de la constitución → `design.md`), y cada método evaluado (`git diff HEAD`, `git diff` contra la rama principal, rangos de línea en `implement-report.md`) tiene un caso que oculta defectos propios o cambia el contrato de otro skill. El ADR fija la regla que el método debe cumplir: asignación conservadora y aviso en el informe cuando no se aplica (D-6).
- **Documento afectado**: `specs/flow/STORY-181-hallazgos-preexistentes/story.md`
- **Acción requerida**: cambiar «el método que fija el ADR de la guía de revisión» por «el método que fija el `design.md` de STORY-181 conforme a ADR-0021». Si se prefiere fijarlo en el ADR, hay que decidirlo antes de implementar esta historia y añadirlo a D-6.
