---
type: adr
id: ADR-0004
slug: nivel-l2-epic-y-directorios-numerados
title: "El nivel L2 es una épica, y los niveles viven en directorios numerados"
status: ACCEPTED
date: 2026-08-29
supersedes: null
superseded-by: null
---

# ADR-0004: El nivel L2 es una épica, y los niveles viven en directorios numerados

## Contexto y problema

SDDF opera con tres niveles de work item (L3 project → L2 → L1 story). Hasta la v1.x el nivel L2
se llamaba **release** y sus artefactos vivían en `$SPECS_BASE/specs/releases/`. El término colisiona
con su significado en CI/CD: liberación, despliegue, tag de versión, publicación en npm.

La ambigüedad estaba documentada dentro del propio framework. `flight-leves-model.md` tenía que
aclarar explícitamente que "el release a nivel de gestión de trabajo es independiente del release
real y versión de software en herramientas como github" — una aclaración que solo hace falta cuando
el nombre está mal elegido. La misma colisión aparecía en `branching-strategy-sddf-git-flow.md`
(donde la rama ya se llamaba `epic/` pero el texto hablaba de "rama release") y en `security-audit`,
que usa `--scope release` en el sentido legítimo de CI/CD.

Pero el problema de fondo no es de vocabulario sino **estructural**:

- **Cardinalidad rota (N:M).** Una épica puede abarcar varias releases, y una release puede contener
  varias épicas completas. Guardar `epic.md` dentro de `releases/` afirma una relación de contención
  1:1 que no existe en el dominio.
- **Confusión de onboarding.** Quien abre `releases/` espera encontrar versiones (`v1.0.0`), no work
  items de planificación.
- **Escalado bloqueado.** No hay dónde documentar el lanzamiento en sí (`release-notes.md`) sin
  mezclarlo con las épicas.

El resto del framework ya usaba el vocabulario correcto de forma parcial: los IDs son `EPIC-NN`, la
rama de nivel medio es `epic/`, y el ADR-0003 titula el workflow de nivel medio como "Epic/Release".
Convivían dos nombres para el mismo concepto, y eso ya estaba produciendo errores concretos: un
barrido automatizado de renombrado generó rutas `épicas/` (con tilde, un directorio inexistente)
precisamente porque el nombre del directorio y el del concepto discrepaban.

## Decisión

**1. El work item de nivel L2 se llama épica (epic).** El término **"release" queda reservado
exclusivamente para su sentido de CI/CD** (liberación, despliegue, versión publicada, rama de
liberación, release notes).

| Antes | Ahora |
|---|---|
| Skill `release-creation` | `epic-creation` |
| Skill `release-format-validation` | `epic-format-validation` |
| Skill `release-generate-stories` | `epic-generate-stories` |
| Skill `release-generate-all-stories` | `epic-generate-all-stories` |
| Skill `releases-from-project-plan` | `epic-from-project-plan` |
| Artefacto `release.md` | `epic.md` |
| Frontmatter `type: release` | `type: epic` |
| Sección `## Propuesta de Releases` de `project-plan.md` | `## Propuesta de Épicas` |

**2. Los tres niveles viven en directorios numerados por su posición en la jerarquía:**

```
$SPECS_BASE/specs/
├── 01-projects/     L3 — proyectos / iniciativas
├── 02-epics/        L2 — épicas (entregables)
├── 03-stories/      L1 — historias
└── templates/       infraestructura, sin numerar
```

El prefijo numérico hace que **el orden alfabético del explorador de archivos coincida con el orden
jerárquico** (L3 → L2 → L1). Sin él, el orden sería `epics, projects, stories` (e → p → s), que
invierte la jerarquía y pierde la legibilidad que daba el nombre `releases`.

`templates/` **no lleva número**: no es un nivel de vuelo sino infraestructura compartida, y la
ausencia de prefijo lo comunica. Ordena de forma natural al final.

El nombre `releases/` queda **libre** para su significado real de CI/CD el día que se documenten
lanzamientos (`release-notes.md`, changelogs por versión).

## Rationale

- **Cardinalidad correcta.** Épica y release son entidades N:M. Ninguna contiene a la otra, así que
  ninguna debe anidarse dentro del directorio de la otra.
- **Principio constitucional 8 (buenas prácticas y estándares homogéneos):** un concepto, un nombre.
  Mantener dos nombres para el nivel L2 (`EPIC-NN` en los IDs, `release` en skills y directorios)
  producía resultados impredecibles al pedirle trabajo a un agente sobre "el release", y de hecho ya
  generó rutas inválidas en un renombrado automatizado.
- **Principio constitucional 1 (el repositorio como sistema):** un agente que lee el repo para
  entender "cómo trabajamos" no debe tener que desambiguar si "release" significa un entregable de
  gestión o un despliegue a producción.
- El vocabulario nuevo ya era el dominante en los artefactos reales (`EPIC-NN`, rama `epic/`), así
  que el cambio alinea los nombres con lo que el repositorio ya hacía.

## Alternativas consideradas

- **Mantener `release` y documentar mejor la distinción:** descartada porque es exactamente lo que ya
  se hacía (`flight-leves-model.md` incluía la aclaración) y la ambigüedad persistía igual. Una nota
  al pie no compite con el nombre del skill que el usuario teclea ni con el nombre del directorio que
  ve en el explorador.
- **Renombrar solo los skills y el artefacto, dejando el directorio `specs/releases/`:** descartada
  tras aplicarse parcialmente. Deja un estado a medias — `epic.md` dentro de `releases/` — que
  conserva intacto el problema de cardinalidad y la confusión de onboarding, que son las razones de
  fondo del cambio. El coste de migración que se le atribuía es real pero acotado (~1081 referencias,
  todas mecánicas, ninguna en código ejecutable).
- **Renombrar a `epics/` sin prefijo numérico:** descartada porque pierde la correspondencia entre
  orden alfabético y orden jerárquico (`epics, projects, stories` lee L2 → L3 → L1), que era la
  virtud accidental del nombre `releases` y la razón por la que se había elegido.
- **Numerar también `templates/` (`00-` o `04-`):** descartada porque le daría rango de nivel de vuelo
  a algo que es infraestructura compartida, y añadiría ~170 referencias de churn sin beneficio.
- **Alias retrocompatibles (`/release-creation` como sinónimo, fallback de lectura `epic.md` →
  `release.md`, symlink `releases/` → `02-epics/`):** descartada porque perpetúa el vocabulario
  ambiguo justo en la superficie que motivó el cambio, y duplica indefinidamente la lógica de
  resolución de rutas. Se prefiere una ruptura limpia documentada con instrucciones de migración.

## Consecuencias

**Positivas:**
- Un solo vocabulario para el nivel L2 en skills, artefactos, frontmatter, templates y guías.
- La estructura de directorios refleja la jerarquía y se lee correctamente en cualquier explorador.
- `release` recupera un significado único y no ambiguo (CI/CD), y sigue usándose sin conflicto en
  `security-audit --scope release`, en la estrategia de branching batch y en el CHANGELOG.
- El nombre `releases/` queda disponible para documentar lanzamientos reales.
- Los nombres de skill (`epic-*`) concuerdan con los IDs (`EPIC-NN`) y con la rama (`epic/`).

**Negativas / trade-offs:**
- **Breaking change doble.** Los comandos `/release-*` dejan de existir, los artefactos `release.md`
  ya no son encontrados, y las rutas `specs/{projects,releases,stories}/` cambian. Requiere migración
  manual en proyectos ya instalados (ver `CHANGELOG.md`) y un salto de versión mayor a `2.0.0`.
- Las rutas son algo más largas y llevan un prefijo numérico que no aporta significado semántico,
  solo ordenación.
- Los artefactos históricos bajo `docs/specs/**` (planes `plan-NN.md`, historias `STORY-0NN`) siguen
  hablando de "release" y citando rutas antiguas porque describen el estado del repo en su momento;
  no se reescriben.

## Referencias

- [[flight-leves-model]]
- [[organization-of-artifacts]]
- [[state-machine]]
- [[workflow-canonico-story-y-epic]]
- [[artifact-directory-migration]]
