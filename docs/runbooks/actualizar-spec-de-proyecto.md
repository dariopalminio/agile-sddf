---
type: runbook
slug: runbook-actualizar-spec-de-proyecto
title: "Runbook para actualizar la especificación de proyecto (project.md)"
status: COMPLETED
substatus: DONE
parent: null
created: 2026-08-30
updated: 2026-08-30
related:
  - PROJ-01-agile-sddf
  - index
---

<!-- Referencias -->
[[PROJ-01-agile-sddf]] · [[index]]

# 📘 Runbook para actualizar la especificación de proyecto

Procedimiento para resincronizar `$SPECS_BASE/specs/01-projects/<PROJ-NN>/project.md` con la realidad
del repositorio cuando el documento ha quedado obsoleto.

Este runbook se escribió a partir de la ejecución real del 2026-08-30 sobre `PROJ-01-agile-sddf`,
donde el `project.md` llevaba cuatro meses sin tocarse (generado el 2026-04-19 por
`/reverse-engineering`) y describía un sistema de ~15 skills con integración OpenSpec y cinco
runtimes, frente a los 34 skills, 3 runtimes y sin OpenSpec del repositorio real.

---

## Cuándo ejecutarlo

- Al cerrar una épica que añade una capacidad nueva al producto.
- Antes de publicar una versión **major** en npm.
- Cuando `docs/index.md`, el `CHANGELOG.md` y `project.md` se contradigan entre sí.
- Cuando un ADR nuevo invalide una afirmación estructural del documento (por ejemplo ADR-0004,
  que renombró el nivel L2 de *release* a *épica*).

**Señal de alarma barata:** si `git log -1 --format=%ad -- docs/specs/01-projects/*/project.md`
devuelve una fecha muy anterior al último commit del repositorio, el documento está desfasado.

## Por qué no basta con `/reverse-engineering --update`

El flag `--update` re-analiza únicamente las secciones marcadas `<!-- PENDING MANUAL REVIEW -->` y
preserva verbatim el resto. Aquí el problema es exactamente el contrario: **las secciones sin marcar
son las que están obsoletas**. Un `--update` las dejaría intactas y produciría un documento que sigue
mintiendo, pero con aspecto de recién actualizado.

Un `/reverse-engineering` completo tampoco sirve: sobrescribiría el trabajo humano acumulado (visión,
non-goals, criterios de éxito) con inferencias, y perdería la historia del proyecto que solo existe en
las épicas y en el `CHANGELOG.md`.

---

## Procedimiento

### Paso 1 — Delimitar: el template manda la estructura

Leer los dos documentos que definen el trabajo:

- `$SPECS_BASE/specs/01-projects/<PROJ-NN>/project.md` — lo que hay que corregir.
- `$SPECS_BASE/specs/templates/project-template.md` — la estructura obligatoria.

**Regla:** la estructura de secciones no se negocia, viene del template (constitución, patrón 5). El
trabajo de esta actualización es **solo de contenido**. Si el template evolucionó desde la última
edición, alinear primero los headings y luego el contenido.

Anotar también el esquema de frontmatter canónico, que vive en `skills/header-aggregation/SKILL.md`
(campos obligatorios y regla de derivación de cada uno). Es fácil que el documento arrastre campos
antiguos: en la ejecución de referencia tenía `date:` en vez de `created:`/`updated:`, y un
`substatus: READY` que no pertenece al conjunto canónico.

### Paso 2 — Inventariar el filesystem: contar, no recordar

Antes de leer un solo documento de contenido, obtener las cifras. Este bloque es la línea base contra
la que se escribe todo lo demás:

```bash
echo "epic dirs:      $(ls -d docs/specs/02-epics/*/ | wc -l)"
echo "epic.md:        $(ls docs/specs/02-epics/*/epic.md | wc -l)"
echo "plan-NN.md:     $(ls docs/specs/02-epics/*/plan-*.md | wc -l)"
echo "story dirs:     $(ls -d docs/specs/03-stories/*/ | wc -l)"
echo "story.md:       $(ls docs/specs/03-stories/*/story.md | wc -l)"
echo "skills:         $(ls -d skills/*/ | wc -l)"
echo "agents raiz:    $(ls agents/*.agent.md | wc -l)"
echo "agents locales: $(ls skills/*/agents/*.md | wc -l)"
echo "skills c/evals: $(ls -d skills/*/evals | wc -l)"

grep -h "^status:"    docs/specs/02-epics/*/epic.md   | sort | uniq -c
grep -h "^substatus:" docs/specs/02-epics/*/epic.md   | sort | uniq -c
grep -h "^status:"    docs/specs/03-stories/*/story.md | sort | uniq -c
grep -h "^substatus:" docs/specs/03-stories/*/story.md | sort | uniq -c
grep -h "^kind:"      docs/specs/03-stories/*/story.md | sort | uniq -c
```

Dos avisos que la ejecución de referencia hizo evidentes:

- **Número de directorios ≠ número de documentos.** Había 79 directorios de historia pero solo 77
  `story.md`: dos contenían únicamente planes. Escribir «87 historias» (el ID más alto) habría sido
  un error de tres cifras distintas a la vez.
- **Los `uniq -c` de estado delatan artefactos rotos.** Un `status: [ BACKLOG | IN-PROGRESS | ... ]`
  en el recuento es un documento que conserva el placeholder del template sin rellenar.

### Paso 3 — Explorar en paralelo con subagentes

El volumen (19 épicas + 79 historias + 34 skills) no cabe en el contexto de una sola sesión, y leerlo
entero contradice el principio 5 de la constitución (gestión estricta de contexto). Lanzar **tres
subagentes de exploración en paralelo**, uno por eje:

| Subagente | Alcance | Qué debe devolver |
|---|---|---|
| 1 | `docs/specs/02-epics/` | Por épica: frontmatter, objetivo en 1-2 líneas, historias hijas, capacidad aportada. Cierra con tabla resumen y agrupamiento temático |
| 2 | `docs/specs/03-stories/` | Por historia: **solo frontmatter** + título. Cierra con tabla, conteos por estado y por épica padre, e IDs faltantes en la secuencia |
| 3 | `skills/`, `agents/`, `sddf.config.yaml`, `package.json`, `scripts/` | Por skill: descripción, precondición/gate, output, flags, subagentes que invoca. Cierra con tabla skill → fase → output y agrupamiento en pipelines |

Reglas para el prompt de cada subagente:

- Pedir **tablas y extractos, no volcados de archivos**. Un subagente que devuelve archivos completos
  traslada el problema de contexto en vez de resolverlo.
- Acotar la profundidad de lectura explícitamente («lee solo el frontmatter y el título», «lee solo
  frontmatter + primeras secciones del `SKILL.md`»).
- Pedirle al tercero que contraste su hallazgo contra el `project.md` actual: es quien tiene el
  inventario de skills en la mano y detecta las ausencias.

### Paso 4 — Contrastar con las fuentes de verdad transversales

Los subagentes dan el *qué*. Estos cuatro documentos dan el *porqué* y suelen estar más actualizados
que el propio `project.md`:

| Fuente | Qué aporta |
|---|---|
| `docs/index.md` | El índice wiki. Es el documento mejor mantenido del repositorio y ya trae el agrupamiento temático de épicas e historias hecho |
| `CHANGELOG.md` | Explica **por qué** cambió cada cosa. Los renombrados masivos, las capacidades retiradas y las migraciones manuales están aquí, no en las specs |
| `docs/adr/` | Las decisiones que invalidan afirmaciones del documento. ADR-0004 y ADR-0005 obligaron a reescribir la nomenclatura entera |
| `docs/guides/state-machine.md` | La máquina de estados canónica. El `project.md` antiguo describía un campo `**Estado**: IN-PROGRESS \| Ready` que ya no existe |

### Paso 5 — Verificar personalmente todo lo que se va a afirmar

**Regla no negociable:** ningún dato entra al documento sin comprobarse con `ls` o `grep`, incluidos
los que reporta un subagente. Los subagentes leen documentación, y la documentación puede estar tan
desactualizada como el archivo que se está corrigiendo.

En la ejecución de referencia, esta verificación es la que encontró lo más grave:

```bash
for d in gem rovo openspec .agents skills-lock.json; do
  [ -e "$d" ] && echo "EXISTS: $d" || echo "MISSING: $d"
done
find . -name "*.py" -not -path "./node_modules/*"
cat package.json | grep -A8 '"files"'
```

Cuatro afirmaciones del documento se cayeron de golpe: `gem/` y `rovo/` habían sido eliminados,
`openspec/` no existía (con lo que cuatro requisitos funcionales completos describían una capacidad
retirada), `skills-lock.json` nunca fue reemplazado tras retirar `skill-master`, y los únicos
archivos Python restantes eran *fixtures* de ejemplo, no la implementación que el stack declaraba.

Un subagente que solo lee documentación no encuentra ninguna de esas cuatro cosas.

### Paso 6 — Construir el inventario de drift

Antes de escribir nada, producir una tabla de tres columnas: **afirmación actual → realidad →
evidencia**. Es el paso que convierte la reescritura en verificable en vez de opinable, y sirve
después como base del mensaje de commit y de la entrada del CHANGELOG.

```
| # | Afirmación actual                          | Realidad                                        |
|---|--------------------------------------------|-------------------------------------------------|
| D1| Skills en `.claude/skills/…`               | Fuente única en `skills/` raíz (EPIC-18 plan-08) |
| D2| 5 runtimes (incluye Gemini Gems y Rovo)    | 3 — `gem/` y `rovo/` eliminados (EPIC-17 plan-13)|
| …
```

Si un ítem del inventario no tiene evidencia verificable, no entra: se queda como pregunta para el
usuario, no como afirmación en el documento.

### Paso 7 — Reescribir y cerrar

1. Reescribir `project.md` sección por sección siguiendo el orden del template. Renumerar los FR/NFR
   solo si se acordó reescritura completa; si se acordó actualización incremental, conservar la
   numeración y marcar los retirados.
2. Sustituir cualquier sección «Gaps & Next Steps» heredada de `/reverse-engineering` por un apéndice
   de **brechas verificadas**. La diferencia importa: los gaps generados son preguntas que la IA no
   supo responder; las brechas son hallazgos comprobados y accionables.
3. Actualizar `updated:` en el frontmatter (y `created:` si aún no existía).
4. Añadir la entrada correspondiente en `docs/index.md` y en `CHANGELOG.md`.

---

## Verificación post-actualización

```bash
P=docs/specs/01-projects/PROJ-01-agile-sddf/project.md

# 1. Frontmatter canónico: created + updated, substatus válido
head -15 "$P"

# 2. Sin referencias fantasma fuera del apéndice de deuda
grep -nE '\.claude/skills|skills-lock\.json|openspec|Rovo|Gemini Gems|story-refine' "$P"

# 3. Todo skill existente aparece al menos una vez en el documento
for s in $(ls skills/); do grep -q "$s" "$P" || echo "FALTA: $s"; done

# 4. La estructura sigue conforme al template
diff <(grep -oE '^#+ [0-9]+\.?[0-9]*\.?' "$P") \
     <(grep -oE '^#+ [0-9]+\.?[0-9]*\.?' docs/specs/templates/project-template.md)

# 5. Las cifras del apéndice coinciden con el filesystem (reejecutar el Paso 2)
```

> Este repositorio no declara `npm test` ni `npm run build` (`package.json` solo declara
> `postinstall`), así que la verificación es documental: `ls`, `grep` y recuento. No hay suite que
> ejecutar.

---

## Lecciones de la ejecución de referencia (2026-08-30)

- **Un documento generado por ingeniería inversa envejece peor que uno escrito a mano**, porque nadie
  lo revisa: parece autoritativo por su formato exhaustivo y su tabla de niveles de confianza, pero
  es una foto con fecha. Conviene dejar una nota de vigencia visible al inicio.
- **`docs/index.md` es mejor punto de partida que `project.md`.** Lo mantiene un skill
  (`docs-wiki-builder`) que se reejecuta con frecuencia, así que refleja el filesystem mucho mejor
  que un documento de spec editado a mano.
- **El `CHANGELOG.md` es la única fuente del *porqué*.** Sin él, un renombrado masivo parece un error
  de nomenclatura en vez de una decisión deliberada con su ADR detrás.
- **Los non-goals caducan.** «Generación de código de implementación» figuraba como fuera de alcance
  mientras `story-implement` ya ejecutaba el ciclo TDD completo. Revisar la sección 1.7 explícitamente
  en cada pasada: es donde el desfase pasa más desapercibido.
- **Separar «brecha» de «pregunta».** El apéndice final solo debe contener hallazgos verificados. Las
  preguntas abiertas se llevan al usuario, no se dejan sedimentar en el documento como si fueran
  conocimiento.
