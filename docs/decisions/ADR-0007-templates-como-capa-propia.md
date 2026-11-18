---
type: adr
id: ADR-0007
slug: templates-como-capa-propia
title: "Los templates son una capa propia, hermana de specs/"
status: ACCEPTED
date: 2026-09-11
supersedes: ADR-0001
superseded-by: null
---

<!-- Referencias -->
[[centralizar-templates-compartidos]]

# ADR-0007: Los templates son una capa propia, hermana de `specs/`

## Contexto y problema

[[centralizar-templates-compartidos]] (ADR-0001) resolvió correctamente **quién es dueño** de un template compartido: el proyecto, no un skill. Pero lo ubicó en `$SPECS_BASE/specs/templates/`, es decir, **dentro de la capa de work items**. Esa ubicación era un accidente de implementación, no una decisión de modelo, y el repositorio lleva desde entonces pagando el coste:

1. **Contradice los conjuntos cerrados del propio modelo de dominio.** `Templates` no figura en `ArtifactType` ni en `Layer` de [[domain-knowledge-artifacts]], pese a tener su propia fila en la tabla de tipos de artefacto. Un tipo que existe en la tabla pero no en el VO que la gobierna es una inconsistencia declarada.
2. **`templates/` nunca apareció en el árbol de capas** ni en la tabla "Rol de cada capa" de ese mismo documento: el directorio existía en disco pero no en el modelo.
3. **[[nivel-l2-epic-y-directorios-numerados]] (ADR-0004) tuvo que excusarlo explícitamente:** *"`templates/` **no lleva número**: no es un nivel de vuelo sino infraestructura compartida"*. Una excepción escrita para justificar por qué un hermano de `01-projects/`, `02-epics/` y `03-stories/` no se parece en nada a ellos es la señal de que no es su hermano.
4. **La fila de la tabla de tipos era la única con dos ubicaciones** y la única cuyo "Prefijo" era en realidad un sufijo.

La raíz es conceptual: un template **no especifica un work item**. Es un meta-artefacto — describe la forma de un documento que un skill generará. Ponerlo bajo `specs/` obliga a leer `specs/` como "cosas de specs y además las plantillas", que no es una capa sino una bolsa.

## Decisión

**Los templates son una capa de primera clase.** Viven en `$SPECS_BASE/templates/`, hermana de `specs/`, `policies/` y `adr/`, no dentro de ninguna de ellas.

El modelo de dominio se actualiza en consecuencia: `template` entra en el conjunto cerrado `ArtifactType`, `templates` entra en `Layer`, la capa aparece en el árbol y en la tabla de roles, y una invariante de estructura declara dónde viven y con qué sufijo.

**Todo lo demás de ADR-0001 se conserva sin cambios** y sigue vigente:

- El modelo **seed → central**: el skill dueño conserva el canónico en su `assets/` para distribución npm, y `sddf-init` lo copia al directorio central de forma idempotente sin sobrescribir.
- El orden de resolución **central → seed del dueño (con WARNING) → error accionable**.
- La verificación de `skill-preflight` (OK central / WARNING fallback / ERROR ninguno).

Este ADR supersede a ADR-0001 porque cambia la ubicación que aquel fijó, no porque invalide su rationale. La parte de ADR-0004 que describe `templates/` como infraestructura sin numerar dentro de `specs/` queda superada por este ADR; el resto de ADR-0004 no se ve afectado.

## Rationale

1. **Una capa responde a una pregunta.** `specs/` responde "¿qué estamos construyendo?"; `templates/` responde "¿con qué estructura se generan los artefactos?". Son preguntas distintas y merecen capas distintas.
2. **El modelo deja de contradecirse.** Desaparece la fila que existía fuera de los conjuntos cerrados y la excepción que ADR-0004 tuvo que redactar.
3. **Detectable por lectura.** Quien abra `docs/` ve la capa de plantillas sin tener que entrar en `specs/` y descubrir que hay algo que no es un spec.
4. **Coste de migración bajo y acotado.** No hay script, build ni paquete npm que dependa de la ruta: `docs/` no está en el campo `files` de `package.json` y ningún script de `scripts/` la menciona. La migración es textual.
5. **Coherente con el principio 1 de la constitución** (repositorio como sistema): la estructura de directorios es parte del contrato legible del proyecto, no un detalle de implementación.

## Alternativas consideradas

- **Dejar `specs/templates/` y añadir `templates` a los conjuntos cerrados:** descartada — legitima la anomalía en vez de resolverla, y mantiene a `templates/` como un hermano postizo de los tres niveles de vuelo, obligando a conservar la excepción de ADR-0004.
- **Mover los templates al `assets/` de cada skill y eliminar la copia central:** descartada — revierte ADR-0001 y devuelve los 13 acoplamientos cross-skill por ruta relativa, además de impedir la personalización por proyecto.
- **Ruta literal `docs/templates/` en vez de `$SPECS_BASE/templates/`:** descartada — rompería los proyectos con `SDDF_ROOT` personalizado, que quedarían con los templates fuera de su raíz SDDF.
- **Reescribir también las referencias históricas:** descartada — los specs de historias y épicas cerradas y el `CHANGELOG` registran lo que se hizo entonces; reescribirlos falsifica el historial. Siguen citando `specs/templates/` de forma deliberada.

## Consecuencias

**Positivas:**
- `ArtifactType` y `Layer` vuelven a ser conjuntos cerrados consistentes con la tabla de tipos.
- La excepción de ADR-0004 sobre `templates/` deja de ser necesaria.
- `sddf-init` crea `templates/` junto a los demás directorios base (Paso 2), no como apéndice de `specs/`.

**Negativas / trade-offs:**
- Los proyectos ya inicializados conservan `<root>/specs/templates/` tras actualizar el framework. `sddf-init` creará `<root>/templates/` y copiará los seeds ahí; el directorio viejo queda huérfano y hay que borrarlo a mano. Las personalizaciones del template central **no se migran automáticamente**: quien haya editado sus templates debe moverlos antes de reejecutar `sddf-init`, o perderá la personalización en favor del seed.
- Las referencias históricas en `docs/specs/03-stories/`, `docs/specs/02-epics/` y `CHANGELOG.md` siguen citando la ruta anterior. Es deliberado, pero obliga a quien lea un spec antiguo a saber que esa capa se movió.
- La duplicación seed/central que ADR-0001 aceptó como trade-off persiste sin cambios.

## Referencias

- [[centralizar-templates-compartidos]] — ADR-0001, superado por este ADR
- [[nivel-l2-epic-y-directorios-numerados]] — ADR-0004, cuya excepción sobre `templates/` queda superada
- [[domain-knowledge-artifacts]] — `ArtifactType`, `Layer`, tabla de tipos, árbol de capas e invariante de estructura
- `skills/sddf-init/SKILL.md` — Paso 2 (creación de la capa) y Paso 2b (copia idempotente de seeds)
- `skills/skill-preflight/SKILL.md` — Verificación 3 (templates centrales)
- `docs/policies/constitution.md` — principio 13, cuyo alcance es esta capa
