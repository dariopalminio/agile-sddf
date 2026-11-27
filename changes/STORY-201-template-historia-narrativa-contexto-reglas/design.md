---
alwaysApply: false
type: design
id: STORY-201
slug: STORY-201-template-historia-narrativa-contexto-reglas-design
title: "Design: Template de historia con narrativa, contexto y reglas de negocio"
status: PLAN
substatus: IN-PROGRESS
parent: null
story: STORY-201
created: 2026-11-27
updated: 2026-11-27
related:
  - STORY-201-template-historia-narrativa-contexto-reglas
---

<!-- Referencias -->
[[STORY-201-template-historia-narrativa-contexto-reglas]]

## Context

El template de historia vive en dos copias que deben ser idénticas byte a byte:

- `skills/story-creation/assets/story-template.md`: el **seed** que distribuye el paquete npm y del que `memory-system` copia `docs/templates/story-template.md`. `test/memory-system.test.js:476-477` lo verifica.
- `docs/templates/story-template.md`: la copia del proyecto, que `story-creation`, `story-evaluation` y `epic-refine` leen en tiempo de ejecución.

Hoy el template tiene esta estructura: `# 📖 Historia:` con `Como/Quiero/Para` sin sección propia, `## ✅ Criterios de aceptación`, `## ⚙️ Criterios no funcionales específicos`, `## Fuera de alcance (Non-Goals)` y `## 📎 Notas / contexto adicional`. Los AC se titulan `### AC-<n> — …`, con raya.

El Solo Builder dejó la estructura objetivo en `story-new-template.md`, dentro del directorio de la historia. Ese archivo ya conserva el frontmatter y los comentarios `escritor:` del template vigente.

Varios skills localizan secciones de `story.md` por su título literal (inventario verificado con `grep`):

| Skill | Ubicación | Título que busca |
|---|---|---|
| story-acceptance | `skills/story-acceptance/SKILL.md:203` | `## ✅ Criterios de aceptación` |
| story-verify | `skills/story-verify/SKILL.md:397` | `## ✅ Criterios de aceptación` |
| story-evaluation | `skills/story-evaluation/SKILL.md:222-239` | `## 📖 Historia` (componente 1) y `## ✅ Criterios de aceptación` (componente 2) |
| story-refine | `skills/story-refine/SKILL.md:244,247` | «Notas / contexto adicional» |
| epic-refine | `skills/epic-refine/references/sal-corrections.md:54,76,83,91,95,131` | `## ✅ Criterios de aceptación`, el prefijo `## 📎 Notas` y el título de AC `### AC-<k+1> — …` |
| story-creation · epic-generate-stories · epic-generate-all-stories | ejemplos inline: `SKILL.md:294,317` · `:288,311` · `:255,278` | ejemplos con los títulos anteriores |

`epic-analyze` solo busca el prefijo `### AC-<n>`, así que no necesita cambios.

Los destinos de runtime (`.claude/skills/…`) están en `.gitignore` y son salida de `agile-sddf install`: no se editan.

Stack (según `docs/constitution.md`): Markdown y scripts Node.js. Esta historia no requiere scripts nuevos.

## Goals / Non-Goals

**Goals:**
- Publicar la estructura nueva del template en el seed y en `docs/templates/`, con copias idénticas. // satisface: AC-1
- Hacer que `/story-creation` omita las secciones `*(si aplica)*` cuando no tiene contenido para ellas. // satisface: AC-2
- Hacer que los skills consumidores reconozcan el título anterior y el nuevo, y unificar el título de AC a `### AC-<n> - …`. // satisface: AC-3
- Mantener ambos templates en UTF-8 sin BOM. // satisface: CNF-1

**Non-Goals:**
- Migrar los `story.md` existentes (activos o archivados).
- Cambiar los pesos o umbrales de la rúbrica FINVEST, o puntuar `Contexto y valor` y `Reglas`.
- Actualizar las copias de `skills/memory-system/examples/**/story-template.md`: son fixtures de pruebas de `memory-system` y el gate no las compara con el seed.
- Cambiar los títulos de otros templates (por ejemplo, `## 📎 Notas adicionales` de la constitución).
- Cambiar cómo trata `epic-generate-stories` las secciones opcionales (hoy usa el placeholder `[Por completar]`).

## Decisions

### D-1 — Fuente del contenido nuevo: `story-new-template.md` sin reinterpretar // satisface: AC-1

El contenido del template nuevo es `story-new-template.md` tal como quedó tras la evaluación FINVEST: con un solo espacio en los títulos, `cubierta por [AC-1, AC-n]` y AC con guion. Se le agregan solo los comentarios `escritor:` de las secciones nuevas (D-2).

- **Alternativa rechazada A:** redactar el template desde la historia. Duplicaría trabajo y podría divergir de la propuesta del Solo Builder.
- **Alternativa rechazada B:** copiar el bloque de ejemplo que estaba en las Notas de la historia. Ese bloque tenía vallas de código anidadas rotas y se reemplazó por el archivo.

### D-2 — Comentarios `escritor:` de las secciones nuevas // satisface: AC-1 (regla: se conservan los comentarios escritor)

La Regla 1 de la historia conserva sin cambios el frontmatter y los comentarios `escritor:` existentes. Para las secciones nuevas, según la regla de veracidad de `AGENTS.md`, solo se declaran los escritores que realmente las escriben:

| Sección | Comentario |
|---|---|
| `# 📖 Historia:` | Se conserva el comentario actual (`defecto · story-refine · story-split`): son los skills que reescriben la historia. |
| `## Narrativa` | Sin comentario propio: la cubre el del título H1. |
| `## Contexto y valor *(si aplica)*` | `<!-- sección opcional · escritor: defecto -->` |
| `## Reglas (reglas de negocio) *(si aplica)*` | `<!-- sección opcional · escritor: defecto -->`, más el comentario guía RFC 2119 de la propuesta. |
| `## ✅ Criterios de aceptación (escenarios Gherkin)` · `## ⚙️ …` · `## 🚫 …` · `## 🔗 …` | Se conservan los comentarios `escritor:` que ya tenía cada sección. |

- **Alternativa rechazada:** declarar `story-refine` y `story-split` como escritores de `## Reglas`. Ninguno de los dos tiene hoy ese comportamiento, así que sería documentar algo que no existe.

### D-3 — Sincronizar las dos copias copiando bytes, no editando dos veces // satisface: AC-1, CNF-1

Se escribe el seed `skills/story-creation/assets/story-template.md` y luego se copian sus bytes a `docs/templates/story-template.md`. La igualdad se verifica por hash o con `cmp`.

- **Alternativa rechazada A:** editar las dos copias por separado. Es fácil que diverjan en espacios o BOM (antecedente: el U+FEFF literal recurrente en este repo).
- **Alternativa rechazada B:** `/memory-system rebuild --force`. Regeneraría también otros templates y semillas de `docs/`, fuera del alcance.

### D-4 — Omisión de secciones `*(si aplica)*` en `/story-creation` // satisface: AC-2

Se agrega una regla a `skills/story-creation/SKILL.md` (sección «Restricciones / Reglas»): *«Las secciones del template marcadas `*(si aplica)*` se omiten por completo (título incluido) cuando la necesidad no aporta contenido para ellas. Nunca se dejan con placeholders.»*

La regla no nombra secciones concretas, así que se mantiene el principio del skill de que la estructura la dicta el template en tiempo de ejecución.

Se actualiza además el «Ejemplo de output» de `story-creation/SKILL.md:286-322` a la estructura nueva (`## Narrativa`, `## ✅ Criterios de aceptación (escenarios Gherkin)`, `### AC-1 - …`, `## 🔗 Notas adicionales…`). Así el ejemplo deja de sesgar la generación hacia los títulos anteriores.

- **Alternativa rechazada:** mantener las secciones opcionales con `[Por completar]`, como hace `epic-generate-stories`. Contradice el paso `Pero` de AC-2.

### D-5 — Reconocimiento de títulos por el comienzo común // satisface: AC-3

Cada consumidor reemplaza el título exacto por el comienzo común, nombrando ambas formas:

| Archivo | Cambio |
|---|---|
| `skills/story-acceptance/SKILL.md:203` | «la sección cuyo título empieza por `## ✅ Criterios de aceptación` (`## ✅ Criterios de aceptación (escenarios Gherkin)` en el template actual; sin sufijo en historias anteriores)» |
| `skills/story-verify/SKILL.md:397` | El mismo texto que en story-acceptance. |
| `skills/story-evaluation/SKILL.md:222-239` | **Componente 1:** acepta como sección Historia `## 📖 Historia` o el par `# 📖 Historia:` + `## Narrativa`; los criterios de score no cambian. **Componente 2:** la sección cuyo título empieza por `## ✅ Criterios de aceptación`; los criterios de score no cambian. |
| `skills/story-refine/SKILL.md:244,247` | «Notas adicionales (`## 🔗 Notas adicionales…`; `## 📎 Notas / contexto adicional` en historias anteriores)» |
| `skills/epic-refine/references/sal-corrections.md:54,76,131` | «la sección cuyo título empieza por `## ✅ Criterios de aceptación`» |
| `skills/epic-refine/references/sal-corrections.md:95` | «la sección cuyo título empieza por `## 🔗 Notas` o `## 📎 Notas`». Si falta, sigue tomando el título del template; con el template nuevo, ese título es `## 🔗 Notas adicionales …`. |

- **Alternativa rechazada A:** una expresión regular centralizada en un script. Hoy ningún consumidor parsea con código: todos son instrucciones Markdown que lee un agente, y un script nuevo no tendría quién lo llamara.
- **Alternativa rechazada B:** migrar las historias existentes a los títulos nuevos. Está fuera de alcance, y los títulos de historias archivadas se conservan como historial.

### D-6 — Título de AC con guion // satisface: AC-1, AC-3

El template usa `### AC-<n> - …`. En `skills/epic-refine/references/sal-corrections.md:83,91`, el AC de cierre pasa de `### AC-<k+1> — …` a `### AC-<k+1> - …`. Los ejemplos inline de `epic-generate-stories/SKILL.md:288-311` y `epic-generate-all-stories/SKILL.md:255-278` adoptan los títulos nuevos con guion (D-7).

Los consumidores siguen buscando el prefijo `### AC-<n>`, así que las historias con raya siguen siendo válidas.

- **Alternativa rechazada:** mantener la raya. El Solo Builder decidió el guion porque no es un carácter raro (ver las Notas de la historia).

### D-7 — Ejemplos inline de `epic-generate-stories` y `epic-generate-all-stories` // satisface: AC-3

Se actualizan sus ejemplos de salida a los títulos nuevos (`## Narrativa`, `## ✅ Criterios de aceptación (escenarios Gherkin)`, `### AC-<n> - …`, `## 🔗 Notas adicionales…`). Su regla de secciones opcionales con `[Por completar]` (`epic-generate-stories/SKILL.md:253`) **no cambia** (Non-Goal). Solo se actualiza la mención de nombres `📎 Notas` → `🔗 Notas adicionales`.

- **Alternativa rechazada:** dejar los ejemplos con los títulos anteriores. Las historias generadas desde una épica divergirían del template.

### D-8 — Entrada en `CHANGELOG.md` // satisface: AC-1, AC-3

Se agrega `### Changed` en `## [Unreleased]` con: estructura nueva del template de historia, títulos de AC con guion y compatibilidad de los consumidores con los títulos anteriores. No es BREAKING, porque las historias existentes siguen siendo válidas (AC-3).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Seed del template de historia | modificar | `skills/story-creation/assets/story-template.md` | AC-1, AC-2, CNF-1 |
| Template del proyecto | modificar (copia por bytes del seed) | `docs/templates/story-template.md` | AC-1, CNF-1 |
| Regla de secciones opcionales y ejemplo de output | modificar | `skills/story-creation/SKILL.md` | AC-2 |
| Lectura de AC en acceptance | modificar | `skills/story-acceptance/SKILL.md` | AC-3 |
| Lectura de AC en verify | modificar | `skills/story-verify/SKILL.md` | AC-3 |
| Rúbrica F (componentes 1 y 2, solo reconocimiento de títulos) | modificar | `skills/story-evaluation/SKILL.md` | AC-3 |
| Mapa dimensión → sección | modificar | `skills/story-refine/SKILL.md` | AC-3 |
| Correcciones SAL (títulos, prefijos, AC de cierre) | modificar | `skills/epic-refine/references/sal-corrections.md` | AC-3 |
| Ejemplos inline de generación desde épica | modificar | `skills/epic-generate-stories/SKILL.md`, `skills/epic-generate-all-stories/SKILL.md` | AC-3 |
| Changelog | modificar | `CHANGELOG.md` | AC-1, AC-3 |
| Propuesta del Solo Builder | solo lectura (fuente de D-1) | `changes/STORY-201-…/story-new-template.md` | AC-1 |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Template → `story-creation` | Las secciones se leen en tiempo de ejecución; una sección con `*(si aplica)*` en el título es opcional y se omite sin contenido. | AC-2 |
| `story.md` → consumidores (acceptance, verify, evaluation, epic-refine) | La sección de AC es la que empieza por `## ✅ Criterios de aceptación`; cada AC es un `### AC-<n>` seguido de un bloque `gherkin`. | AC-3 |
| `story.md` → story-refine · epic-refine | La sección de notas es la que empieza por `## 🔗 Notas` o `## 📎 Notas`. | AC-3 |
| Seed ↔ `docs/templates/` | Igualdad byte a byte (`test/memory-system.test.js:476-477` lo verifica para el scaffold). | AC-1 |

## Esquema de datos

N/A: no hay datos persistidos más allá de los títulos Markdown descritos en Interfaces.

## Flujos clave

### F-1 — Publicación del template (escenario principal) // AC-1, CNF-1
1. Escribir el seed desde `story-new-template.md` más los comentarios de D-2.
2. Copiar sus bytes a `docs/templates/story-template.md`.
3. Verificar que ningún archivo tenga BOM, que las dos copias sean iguales y que los títulos estén en el orden de AC-1.

### F-2 — Historia nueva sin contexto ni reglas (escenario alternativo) // AC-2
`/story-creation` lee el template, detecta las secciones `*(si aplica)*` sin contenido y las omite. El `story.md` resultante contiene `## Narrativa` y `## ✅ Criterios de aceptación (escenarios Gherkin)`, sin `## Contexto y valor` ni `## Reglas`.

### F-3 — Compatibilidad (escenario de compatibilidad) // AC-3
`npm run verify:repository` y `npm test` terminan con código 0. Un `grep` sobre los cinco skills listados muestra el comienzo común o ambos títulos, y `sal-corrections.md` ya no contiene `### AC-<k+1> —`.

### F-4 — Degradación // P7
Si un consumidor lee una historia anterior, el comienzo común la reconoce. Si `docs/templates/story-template.md` no existe, los skills siguen usando el seed, que tiene el mismo contenido.

### F-5 — Puntos de cambio // P6
Nuevos sufijos en los títulos (por ejemplo, otro texto entre paréntesis) no rompen a los consumidores, porque estos buscan el comienzo común. Una sección opcional nueva solo requiere marcarla `*(si aplica)*` en el template.

## Decisiones de complejidad justificada

- **Reconocimiento por comienzo común en lugar de una lista de títulos:** solo cubre dos variantes por sección y sigue funcionando con sufijos futuros. Una lista literal sería más frágil y no más simple.
- **No crear un script de validación de títulos:** ningún consumidor parsea con código. Un checker nuevo sin quién lo llame sería complejidad sin uso (YAGNI).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Los títulos `##` del template aparecen en el orden de AC-1, con un solo espacio entre palabras | `grep -n "^## " docs/templates/story-template.md` comparado con la lista de AC-1; `grep -c "  \*(si aplica)\*"` = 0 | AC-1 |
| 2 | Los títulos de AC usan guion | `grep -c "^### AC-[0-9]* —"` = 0 y `grep -c "^### AC-[0-9]* - "` = 3 en el template | AC-1 |
| 3 | Las líneas de Reglas terminan en `→ cubierta por [AC-1, AC-n]` | `grep "^- \*\*Regla-"` sobre el template | AC-1 |
| 4 | El seed y la copia del proyecto son idénticos | `cmp skills/story-creation/assets/story-template.md docs/templates/story-template.md` | AC-1 |
| 5 | Una historia nueva sin contexto ni reglas omite esas secciones | Ejecución manual de `/story-creation` con una necesidad mínima e inspección del `story.md` | AC-2 |
| 6 | El gate pasa | `npm run verify:repository` y `npm test`, ambos con código 0 | AC-3 |
| 7 | Los consumidores nombran el comienzo común o ambos títulos | `grep` de los cinco skills listados en AC-3 | AC-3 |
| 8 | El AC de cierre de epic-refine usa guion | `grep -c "### AC-<k+1> —" skills/epic-refine/references/sal-corrections.md` = 0 | AC-3 |
| 9 | Sin BOM | `head -c3` distinto de `ef bb bf` y búsqueda de U+FEFF = 0 en las dos copias | CNF-1 |

## Risks / Trade-offs

- **[Riesgo] Destinos de runtime desactualizados:** `.claude/skills/` y los demás destinos conservan los títulos anteriores hasta reinstalar. → Mitigación: después de implementar, reinstalar localmente con `npx agile-sddf install --force` (no se versiona).
- **[Riesgo] Una copia del ejemplo con la estructura anterior queda en un skill no inventariado** y sesga la generación. → Mitigación: el contrato de verificación 7 y un `grep` final de `📎 Notas / contexto adicional` en `skills/` (excluye `examples/` y `evals/`).
- **[Trade-off] Los fixtures de `evals.json` (epic-analyze, story-split) mantienen los títulos anteriores.** Es intencional: ejercitan la compatibilidad con historias anteriores. Los evals no se ejecutan automáticamente (`AGENTS.md`).
- **[Trade-off] `story-refine/assets/refinement-log-template.md:37-45` mantiene «Notas / contexto adicional».** Es un ejemplo histórico de log, no una instrucción de localización.

## Open Questions

Ninguna: la sección `Contexto y valor` y la dimensión V de `story-refine` se dejan sin vínculo (Non-Goal), y el guion quedó decidido en la historia.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1, AC-2, AC-3 y CNF-1 tienen al menos un elemento de diseño cada uno. La regla de conservar el frontmatter la cubre D-2 y la de copias idénticas, D-3.
- **Ambigüedad:** «reconoce» quedó concretado como «empieza por …» en D-5.
- **Nombres:** se usan de forma consistente «título», «comienzo común», «seed» y «template del proyecto».
- **Estructura:** no hay dependencias cíclicas (el seed alimenta a la copia del proyecto, y los consumidores leen `story.md`). Cada componente tiene una sola razón de cambio.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: el componente 1 de `story-evaluation` busca `## 📖 Historia`, pero el template nuevo usa `# 📖 Historia:` + `## Narrativa`. La historia (AC-3) solo nombra el componente 2 de forma implícita; el diseño amplía el reconocimiento al componente 1 (D-5) sin cambiar los scores.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna en story.md. Se cubre en D-5 y en el contrato de verificación 7.

### CR-002
- **Tipo**: dependencia
- **Descripción**: los ejemplos inline de `story-creation`, `epic-generate-stories` y `epic-generate-all-stories` reproducen la estructura anterior. La historia los menciona solo en las Notas; el diseño los incluye en el alcance (D-4, D-7) para que AC-2 no dependa de un ejemplo contradictorio.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna en story.md.
