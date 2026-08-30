---
type: adr
id: ADR-0005
slug: prefijo-story-para-el-nivel-l1
title: "El ID del nivel L1 se prefija con STORY; el tipo de trabajo vive en el campo kind"
status: ACCEPTED
date: 2026-08-29
supersedes: null
superseded-by: null
---

# ADR-0005: El ID del nivel L1 se prefija con `STORY`; el tipo de trabajo vive en el campo `kind`

## Contexto y problema

Los tres niveles de work item usan prefijo de ID: `PROJ-NN` (L3), `EPIC-NN` (L2) y, hasta ahora,
`FEAT-NNN` (L1). Los dos primeros nombran el **nivel**; el tercero nombraba un **tipo** de trabajo.
Esa asimetría no era teórica — producía dos fallos concretos:

**1. Colisión con la convención de ramas.** `branching-strategy-sddf-git-flow.md` define
`feat/<story-id>`, `fix/<story-id>`, `chore/<story-id>`: el prefijo de rama **es** el tipo. Con
`FEAT` dentro del ID resultaba `fix/FEAT-042-corregir-login`, que se contradice a sí mismo. Y
`flight-leves-model.md` ya declaraba cuatro **Tipos de Story** (Feat, Fix, Chore, Hotfix), así que
`FEAT-042` para una corrección era incorrecto por construcción.

**2. Un bug ya materializado en el repositorio.** Existía
`docs/specs/03-stories/FIX-001-error-in-npm-install-locally/` con `id: FIX-001`: alguien tuvo una
historia de corrección, vio que `FEAT-` no encajaba, e inventó un prefijo propio. Consecuencias
reales que estaban activas:

- El glob `03-stories/FEAT-*/story.md` —hardcodeado en `story-creation`, `story-evaluation` y
  `epic-generate-stories` para calcular el siguiente ID libre— **no veía `FIX-001`**. El cálculo del
  máximo ID lo ignoraba, con riesgo de asignar un número en colisión.
- El mapa de tipos de `header-aggregation` (`FEAT-*` → `story`) no lo clasificaba: habría caído a
  `wiki`.

El prefijo por tipo rompe el globbing por nivel, que es la operación más frecuente del framework.

## Decisión

**1. El ID del nivel L1 se prefija con `STORY`:** `STORY-NNN-kebab` (tres dígitos). Los números
existentes se conservan 1:1 (`FEAT-042` ≡ `STORY-042`) para que toda referencia histórica siga
siendo trazable. `FIX-001` se renumeró a `STORY-087` por colisión con `STORY-001`.

**2. El tipo de trabajo se declara en un campo `kind` del frontmatter de la historia:**

```yaml
type: story                          # nivel L1
id: STORY-087
kind: fix                            # feat | fix | chore | hotfix
```

**3. La sección `## Features` de `epic.md` pasa a llamarse `## Historias`**, porque lista ítems que
son historias del nivel L1, no "features" genéricas.

**4. Queda fijada la regla: _prefijo = nivel, tipo = `kind` + rama_.** No se admiten prefijos de ID
por tipo (`BUG-`, `CHORE-`, `FIX-`). El nombre de rama se compone como `<kind>/<id>-<slug>`
(ej. `fix/STORY-087-error-in-npm-install-locally`).

## Rationale

- **Simetría entre niveles.** `PROJ` / `EPIC` / `STORY` nombran los tres niveles con el mismo
  criterio. La jerarquía se lee sin excepciones que memorizar.
- **El globbing por nivel vuelve a ser total.** `03-stories/STORY-*/story.md` encuentra las 79
  historias; antes `FEAT-*` encontraba 78 y silenciosamente omitía una.
- **Separación de ejes ortogonales.** Nivel y tipo son dimensiones independientes: una historia de
  corrección sigue siendo L1. Codificar ambos en un solo identificador obliga a elegir, y esa
  elección se resolvió inventando prefijos ad hoc.
- **Principio constitucional 8 (estándares homogéneos):** el patrón resultante es predecible y no
  admite variantes locales.
- **Alineación con la rama.** `kind` y prefijo de rama son el mismo dato, declarado una vez.

## Alternativas consideradas

- **Mantener `FEAT-NNN`:** descartada. Es el estado que produjo `FIX-001` y el glob incompleto. No
  hay forma de representar una historia de corrección sin romper la convención o el globbing.
- **Renombrar la carpeta a `03-features/` en vez del prefijo:** descartada porque propaga el término
  más vago en lugar de corregirlo, y deja intacta la colisión `fix/FEAT-042` con el nombre de rama.
  El nivel L1 son historias, no "features".
- **Permitir prefijos de ID por tipo (`BUG-`, `CHORE-`, `FIX-`) como convención oficial:** descartada
  — es exactamente el bug observado, elevado a norma. Rompe el globbing por nivel, obliga a cada
  skill a conocer la lista completa de prefijos válidos, y hace que añadir un tipo nuevo sea un
  cambio en todos los skills en vez de un valor nuevo en un campo.
- **Poner el tipo en el `slug` (`STORY-087-fix-error-npm`):** descartada porque el slug es texto
  libre derivado del título; no es un campo consultable ni validable, y duplicaría información que
  la rama ya expresa.

## Consecuencias

**Positivas:**
- Los tres niveles se nombran con el mismo criterio y el globbing por nivel es completo.
- Historias de corrección, chores y hotfixes tienen representación de primera clase sin inventar
  prefijos.
- `kind` conecta explícitamente el artefacto con la convención de ramas.
- Añadir un tipo nuevo en el futuro es añadir un valor al enum, no tocar los skills.

**Negativas / trade-offs:**
- **Breaking change.** Los 79 directorios cambian de nombre, y con ellos 2590 referencias. Requiere
  migración manual en proyectos ya instalados (ver `CHANGELOG.md`).
- `STORY-NNN` es más largo que `FEAT-NNN`; los IDs ocupan algo más en tablas y diagramas.
- Las historias existentes reciben `kind: feat` por defecto. Si alguna era en realidad un `chore` o
  un `fix`, queda mal clasificada hasta que alguien la revise a mano.
- Tres directorios de historia (`STORY-084`, `STORY-085`, `STORY-086`) no tienen `story.md` —solo
  planes y reportes—, así que no tienen frontmatter donde declarar `kind`.

## Referencias

- [[nivel-l2-epic-y-directorios-numerados]]
- [[flight-leves-model]]
- [[branching-strategy-sddf-git-flow]]
- [[organization-of-artifacts]]
- [[workflow-canonico-story-y-epic]]
