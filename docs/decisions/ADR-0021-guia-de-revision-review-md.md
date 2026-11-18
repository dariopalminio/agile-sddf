---
type: adr
id: ADR-0021
slug: guia-de-revision-review-md
title: "Guía de revisión por proyecto en REVIEW.md"
status: ACCEPTED
date: 2026-11-10
supersedes: null
superseded-by: null
---

# ADR-0021: Guía de revisión por proyecto en REVIEW.md

## Contexto y problema

`/story-code-review` genera mucho ruido. La línea base de EPIC-28 (2026-11-07) cuenta ≈580 hallazgos LOW en 55 de los
71 informes archivados (media ≈10, máximo 21). En STORY-125 hubo además 20 LOW arrastrados entre rondas y uno duplicado
entre revisores. Por otra parte, las reglas propias de agile-sddf (qué es bloqueante en este repo, qué no reportar)
viven dentro de los agentes revisores que el framework distribuye. Un proyecto consumidor no puede calibrar la revisión
sin editar esos agentes.

EPIC-28 adopta `REVIEW.md` como guía de revisión por proyecto y deja abiertas cuatro decisiones: dónde vive el archivo,
qué decide frente a `constitution.md`, al DoD CODE-REVIEW y a la plantilla del informe, de dónde se lee y cómo se
traducen las severidades de Claude Code Review. Afectan a `story-code-review` y a `sddf-constitution` y restringen a
STORY-179 a STORY-185. Por eso, según la regla 16 de la constitución, se registran en un ADR.

### Lo que dice la convención de Anthropic

Fuente: <https://code.claude.com/docs/en/code-review-customize> (consultada el 2026-11-07).

- `REVIEW.md` vive en la raíz del repositorio.
- Solo lo lee el servicio gestionado de Code Review en GitHub. El `/code-review` local no lo lee.
- Cambia lo que la revisión encuentra y reporta, no el formato del informe.
- Se lee de la rama base, nunca de los cambios del PR.
- Las severidades son 🔴 Important, 🟡 Minor y 🟣 Pre-existing. La documentación llama *Nit* (de *nitpick*) a la
  🟡; agile-sddf la llama Minor (ver «Vocabulario»).
- El check es neutral: nunca bloquea el merge.

### Lo que decide agile-sddf

- `story-code-review` es un gate que bloquea (`NEEDS-CHANGES`), no un check neutral. Por eso lee `REVIEW.md` de forma
  explícita, sin depender del servicio de GitHub.
- Lo lee desde el working tree, no desde la rama base (ver «Fuente de lectura»).
- Traduce las severidades de Anthropic a las suyas (`HIGH`, `MEDIUM`, `LOW`) y a la categoría `PREEXISTENTE` (ver
  «Vocabulario»).

## Decisión

agile-sddf adopta un único `REVIEW.md` en la raíz del repositorio como guía de revisión por proyecto.
`/story-code-review` lo lee del working tree. La guía queda por debajo de la constitución y del DoD CODE-REVIEW y por
encima de los criterios genéricos de los revisores. Cada severidad de Claude Code Review tiene una sola traducción.

### Ubicación

- `REVIEW.md` vive en `<REPO_ROOT>/REVIEW.md`, en la raíz del repositorio. Es un archivo de convención de herramienta,
  igual que `AGENTS.md` y `CLAUDE.md`, no una raíz del layout. Las tres raíces hermanas de
  [ADR-0019](ADR-0019-layout-fijo-con-archivo-de-epicas.md) (`docs/`, `specs/`, `workflow/`) no cambian, y ADR-0019 no
  se edita ni se reemplaza.
- agile-sddf lee un solo `REVIEW.md`: el de la raíz. No lee los `REVIEW.md` de subdirectorios que admite Claude Code
  Review.
- El `REVIEW.md` de este repositorio es propio y no se publica en npm (`package.json › files` no lo incluye). Los
  proyectos consumidores reciben una semilla con `/sddf-constitution` (STORY-184).

### Precedencia

De mayor a menor autoridad:

| # | Fuente | Qué decide | Relación con `REVIEW.md` |
|---|---|---|---|
| 1 | `docs/constitution.md` | Principios inamovibles y reglas técnicas del proyecto | `REVIEW.md` no puede contradecirla |
| 2 | DoD CODE-REVIEW (`$DOD_PATH`, por defecto `docs/guardrails/dod-story-code-review.md`) y los checklists que incorpora por referencia (p. ej. `gr-ai-security-checklist` y `gr-code-security-checklist`, a través de `dod-story-implement`) | Criterios que la revisión debe comprobar y su `enforcement` | `REVIEW.md` no elimina ni relaja un criterio, ni cambia su `enforcement`, ni declara no aplicable un checklist incorporado |
| 3 | `REVIEW.md` | Qué es bloqueante en cada área del repo, tope de LOW, qué no reportar y qué verificar siempre | — |
| 4 | Criterios genéricos de los revisores (`agents/*.agent.md` de `story-code-review` y el baseline embebido del Security-Reviewer) | Qué buscar por defecto y con qué severidad | `REVIEW.md` prevalece: puede excluir rutas o patrones (p. ej. fixtures) y subir o bajar la severidad de un tipo de hallazgo |

**Checklists incorporados por el DoD:** su cumplimiento es nivel 2, aunque los revisores los usen como fuente de
reglas. `REVIEW.md` solo puede acotar su aplicación (rutas o patrones excluidos, falsos positivos conocidos) y fijar la
severidad de cada hallazgo concreto. No puede declarar el checklist no aplicable ni retirar una de sus reglas. Un
checklist `gr-*security*` que el DoD no incorpora es nivel 4.

La plantilla `code-review-report-template.md` de `story-code-review` queda fuera de la escala: fija el formato del
informe (frontmatter, secciones y veredicto) según [ADR-0015](ADR-0015-contrato-de-validacion.md). `REVIEW.md` nunca
cambia ese formato ni el vocabulario de `verdict`.

**Regla de conflicto:** si una línea de `REVIEW.md` contradice una fuente de nivel superior, rige la superior y esa
línea no se aplica.

**Sin `REVIEW.md`:** rigen las fuentes 1, 2 y 4, como antes de este ADR.

### Fuente de lectura

`/story-code-review` lee `<REPO_ROOT>/REVIEW.md` del working tree, en el estado en que está al ejecutarse la revisión,
y lo pasa a los cuatro revisores y al árbitro. No usa git para leerlo.

### Historias que modifican la guía o el DoD

Cuando el alcance de la historia revisada modifica `REVIEW.md`, el DoD CODE-REVIEW (`$DOD_PATH`) o ambos:

- Rige la versión del working tree, es decir, la que incluye el cambio de la historia (consecuencia de «Fuente de
  lectura»).
- `/story-code-review` advierte en `code-review-report.md` que la historia modifica las reglas con las que se la
  revisa, y nombra el archivo (`REVIEW.md`, `$DOD_PATH` o ambos).
- La detección compara `REVIEW.md` y `$DOD_PATH` con `$IMPL_FILES` (los archivos que lista `implement-report.md`), sin
  git. Si `$IMPL_FILES` está vacío, el informe dice que no pudo comprobarlo.
- La advertencia no cambia `verdict` ni `max-severity`. Si la historia rebaja su propio listón, lo decide el humano en
  `/story-acceptance`.
- STORY-180 fija el texto de la advertencia y la sección existente del informe que la contiene, sin cambiar el
  contrato del informe.

### Vocabulario

Una fila por severidad de Claude Code Review:

| Claude Code Review | `story-code-review` | Efecto sobre el veredicto |
|---|---|---|
| 🔴 Important | `HIGH` o `MEDIUM` | bloquea (`NEEDS-CHANGES`) |
| 🟡 Minor | `LOW` | no bloquea |
| 🟣 Pre-existing | `PREEXISTENTE` | no bloquea |

Reglas que acompañan la tabla:

- **Important → `HIGH` o `MEDIUM`:** `REVIEW.md` define qué es bloqueante. Cada revisor elige entre `HIGH` y `MEDIUM`
  con su criterio actual. Los dos bloquean, así que el efecto de la traducción es único.
- **`PREEXISTENTE` es una categoría, no un valor de severidad:** no entra en `max-severity`, cuyos valores siguen
  siendo `HIGH`, `MEDIUM`, `LOW` y `ninguna`, ni en `fix-directives.md`.
- **Asignación conservadora:** un hallazgo solo es `PREEXISTENTE` si hay evidencia de que está en líneas que la
  historia no tocó. Sin esa evidencia, conserva su severidad y el informe dice por qué no se aplicó la categoría. El
  método para obtener la evidencia lo fija el `design.md` de STORY-181, dentro de esta regla: es una decisión de un solo
  skill (regla 16 de la constitución).
- **`Minor`, no `Nit`:** la convención de Anthropic llama `Nit` (de *nitpick*, «pega menor») a esta severidad.
  agile-sddf la llama `Minor` porque es más didáctico: nombra un problema menor que vale la pena corregir pero no
  bloquea. Es la misma severidad 🟡, con una sola traducción (`LOW`), y los artefactos de agile-sddf usan `Minor`.
- **Secciones de `REVIEW.md`** (las fija `docs/templates/REVIEW-template.md`): «Qué es «Importante» aquí» define lo que
  se reporta como `HIGH`/`MEDIUM`; «Tope de Minor» limita los `LOW`; «No reportar» excluye hallazgos; «Verificar
  siempre» añade comprobaciones.

## Rationale

1. **Separar los criterios genéricos de la calibración de cada proyecto.** El framework distribuye los criterios
   genéricos (agentes y baseline embebido, nivel 4 de «Precedencia»). Cada proyecto calibra la revisión en su `REVIEW.md`
   (nivel 3), sin editar los agentes.
2. **Reutilizar la convención de Anthropic.** Con la misma ubicación y las mismas secciones («Ubicación» y
   «Vocabulario»), un solo archivo sirve al gate local y, si se activa, al servicio de GitHub.
3. **KISS: sin git en el skill.** Leer del working tree y detectar los cambios por `$IMPL_FILES` («Fuente de lectura»
   e «Historias que modifican la guía o el DoD») funciona con cambios sin commit, sin remoto y sin PR. Así es el flujo
   local actual.
4. **La constitución prevalece.** El flujo de autoridad de `AGENTS.md` (`AGENTS.md → docs/constitution.md →
   docs/policies/ · docs/guardrails/`) se mantiene: `REVIEW.md` queda por debajo de la constitución, del DoD y de los
   checklists que el DoD incorpora por referencia («Precedencia»). Solo calibra los criterios genéricos del nivel 4.

## Alternativas consideradas

**Ubicación:**

- **`docs/guardrails/review.md` (o `docs/REVIEW.md`):** encaja en el layout de ADR-0019. Descartada porque rompe la
  convención de Claude Code Review: si se activa el servicio de GitHub, no lo leería y habría dos guías.
- **Leer también los `REVIEW.md` de subdirectorios:** descartada porque ninguna historia lo necesita (YAGNI) y exigiría
  una regla de fusión entre archivos.

**Precedencia:**

- **`REVIEW.md` por encima del DoD:** descartada porque una guía del proyecto podría anular un criterio del gate sin
  pasar por `/sddf-constitution`, que es quien versiona el DoD.
- **`REVIEW.md` al mismo nivel que los checklists de seguridad, sin precedencia:** descartada porque deja sin resolver
  el conflicto entre una exclusión de `REVIEW.md` (p. ej. un secreto falso en `examples/`) y una regla genérica de
  secretos.
- **`REVIEW.md` también fija el formato del informe:** descartada porque contradice la convención de Anthropic y rompe
  el contrato de ADR-0015.

**Fuente de lectura:**

- **Rama base (convención de Anthropic):** impide que un cambio rebaje su propio listón. Descartada porque obliga al
  skill a usar git (`git show <base>:REVIEW.md`) y a conocer una rama base que el flujo local no define: las historias
  se revisan con cambios sin commit en una rama de épica, y no siempre hay remoto ni PR. Sin git, la revisión fallaría.
- **Leer ambas versiones y aplicar la más estricta:** descartada porque también necesita git y una regla para comparar
  guías en lenguaje natural, que no es determinista.

**Historias que modifican la guía o el DoD:**

- **Bloquear (`BLOCKED`) la revisión de toda historia que modifique la guía:** descartada porque bloquearía a
  STORY-179, que crea `REVIEW.md`, y a STORY-183, que modifica el DoD.
- **Detectar el cambio con `git diff`:** descartada porque contradice la lectura sin git; `$IMPL_FILES` ya está
  disponible en el Paso 2c de `story-code-review`.

**Vocabulario:**

- **Important → solo `HIGH`:** descartada porque todo `MEDIUM` dejaría de bloquear y cambiaría el veredicto de los 71
  informes de la línea base.
- **Adoptar el vocabulario de Anthropic en el informe:** descartada porque cambia `max-severity` y rompe el contrato de
  ADR-0015.
- **`PREEXISTENTE` como cuarto valor de `max-severity`:** descartada porque rompe a los consumidores del frontmatter.
- **Fijar en este ADR el método para identificar líneas no tocadas** (`git diff HEAD`, `git diff` contra la rama
  principal o rangos de línea en `implement-report.md`): descartada porque cada método tiene un caso que oculta defectos
  propios (commits parciales) o cambia el contrato de `story-implement-tasks`. Elegir uno exige el análisis de
  STORY-181.

## Consecuencias

**Positivas:**

- Cada proyecto calibra la revisión sin editar los agentes de `story-code-review`.
- Los agentes quedan sin reglas propias de agile-sddf: esas reglas pasan al `REVIEW.md` de este repositorio.
- STORY-179 a STORY-185 aplican una sola decisión y no reabren la ubicación, la precedencia, la fuente de lectura ni el
  vocabulario en su `design.md`.

**Negativas / trade-offs:**

- Una historia puede rebajar su propio listón al editar `REVIEW.md` o el DoD. Se mitiga con la advertencia del informe
  y con la decisión humana en `/story-acceptance`.
- El mismo `REVIEW.md` se lee distinto en local (working tree) que en GitHub (rama base) mientras el cambio no se
  fusione.
- Si `implement-report.md` no lista `REVIEW.md` o el DoD, la detección no avisa. Un `implement-report.md` incompleto es
  un defecto de la etapa de implementación.
- Los proyectos sin `REVIEW.md` no cambian su revisión.

**Puntos de cambio:**

- Para leer `REVIEW.md` de la rama base también en local (p. ej. al activar Claude Code Review en GitHub) hace falta un
  ADR nuevo que reemplace «Fuente de lectura». ADR-0021 no se edita.
- Para admitir `REVIEW.md` por subdirectorio hace falta un ADR nuevo que reemplace «Ubicación».
- El método de líneas no tocadas puede cambiar en STORY-181 o después sin tocar este ADR, mientras respete la
  asignación conservadora de «Vocabulario».

## Referencias

- [[layout-fijo-con-archivo-de-epicas]] — ADR-0019, layout fijo que este ADR no modifica
- [[contrato-de-validacion]] — ADR-0015, contrato del informe de los skills de gate
- [[EPIC-28-calibrar-story-code-review-con-review-md]] — épica que origina la decisión
- [[STORY-178-adr-guia-de-revision]] — historia que registra este ADR
- [[STORY-179-review-md-de-agile-sddf]], [[STORY-180-story-code-review-lee-review-md]],
  [[STORY-181-hallazgos-preexistentes]], [[STORY-182-verificar-y-deduplicar-hallazgos]],
  [[STORY-183-dod-code-review-sin-criterios-circulares]], [[STORY-184-review-md-semilla-para-proyectos-consumidores]],
  [[STORY-185-tope-de-low-y-arrastres]] — historias que aplican este ADR
- Claude Code Review, personalización con `REVIEW.md`: <https://code.claude.com/docs/en/code-review-customize>
  (consultada el 2026-11-07)
