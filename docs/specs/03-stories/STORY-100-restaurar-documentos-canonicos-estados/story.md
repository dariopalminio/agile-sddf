---
alwaysApply: false
type: story
id: STORY-100
kind: fix
slug: STORY-100-restaurar-documentos-canonicos-estados
title: "Restaurar los documentos canónicos de la máquina de estados borrados sin repuntar sus citas"
status: COMPLETED
substatus: DONE
parent: EPIC-19-framework-consistency
created: 2026-09-23
updated: 2026-09-23
related:
  - EPIC-19-framework-consistency
  - STORY-097-memory-system-check-ci
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]
[[STORY-097-memory-system-check-ci]]

# 📖 Historia: Restaurar los documentos canónicos de la máquina de estados borrados sin repuntar sus citas

**Como** mantenedor del framework SDDF
**Quiero** que `[[state-machine]]` y `[[specs-and-workflows]]` vuelvan a resolver a documentos reales
**Para** que los ADR, los documentos de dominio y el índice apunten a la fuente de verdad de estados y transiciones en lugar de a un destino inexistente

## ✅ Criterios de aceptación

### Escenario principal – las citas resuelven sin tocar ni un enlace

```gherkin
Dado un repositorio donde `/memory-system check --root docs` reporta 36 wikilinks rotos hacia `state-machine`, `specs-and-workflows` y `specs_and_workflows`
Cuando se restauran ambos documentos desde el commit que los borró, conservando el `slug` que declaraban
Entonces `check --root docs` deja de reportar esos 36 problemas
  Y ninguna de las 33 citas existentes ha sido modificada
  Y los dos documentos restaurados no aparecen como `orphan` ni como `invalid-frontmatter`
```

### Escenario alternativo – el contenido restaurado describe el pipeline vigente

```gherkin
Dado el documento `state-machine` restaurado, con su tabla de transiciones por skill
Cuando se contrasta cada fila con la precondición y las transiciones que declara el `SKILL.md` correspondiente
Entonces las filas que sigan siendo correctas se conservan
  Y las que hayan derivado se corrigen en el documento restaurado
  Y las divergencias corregidas quedan registradas, para no restaurar una fuente de verdad desactualizada
```

### Requerimiento: Conservación del slug

Los dos documentos se restauran conservando el `slug` que ya declaraban (`state-machine` y `specs-and-workflows`). Es lo que hace resolver las citas sin editarlas: `deriveSlug` devuelve el slug declarado en el frontmatter, no el nombre del archivo.

### Requerimiento: Una sola fuente de verdad

`docs/architecture/sdcl-sddf.md` solapa con el documento restaurado en la lista de estados y el diagrama de flujo de nivel STORY. Al cerrar la historia debe existir **un** documento canónico de la máquina de estados; el otro remite a él en lugar de duplicarlo.

### Requerimiento: No reescribir el registro histórico

Las citas que viven en artefactos de historias ya cerradas y en `EPIC-17/plan-09-*` no se editan: son registro histórico y resuelven solas al restaurar los destinos.

**Única excepción:** una errata de grafía que no resuelve sola. La cita `[[specs_and_workflows]]` de `plan-09` usa guion bajo, pero el documento al que apunta declaraba `slug: specs-and-workflows` con guiones desde el principio — nunca fue un slug válido. Corregir un error tipográfico no reescribe ninguna decisión ni afirmación del registro, así que se corrige.

## ⚙️ Criterios no funcionales

* **Trazabilidad:** la restauración parte de `git show 7932954^:<ruta>`, no de contenido reescrito a mano, de modo que el diff contra el original sea auditable.
* **Consistencia de capa:** cada documento queda en una capa válida de `LAYERS` y con un `type` coherente con ella.
* **Sin regresión:** `npm test` y `npm run verify:links` siguen en verde.

## Fuera de alcance (Non-Goals)

- Resolver el resto de la deuda de `check`: los 3 wikilinks a nodos de `templates/` (excluidos del escaneo por diseño), el destino ambiguo `[[security-checklist]]`, la referencia `[[skill-preflight]]` a un skill y los 5 `orphan` sin encabezado.
- Reescribir el modelo de estados. Esta historia restaura y actualiza lo que haya derivado; no rediseña.
- Cablear el gate de CI de `memory-system check` en los workflows.

## 📎 Notas / contexto adicional

**Origen.** La deuda la detectó `/memory-system check` en [[STORY-097-memory-system-check-ci]], que la diagnosticó mal: su `implement-report.md` afirmaba que eran "documento canónico aún no escrito, trabajo pendiente legítimo". El diagnóstico correcto, verificado contra git durante el code review de esa historia:

| Hecho | Evidencia |
|---|---|
| Ambos documentos existieron | `EPIC-17/plan-09-state-machine-canonical-document.md` está `status: COMPLETED` y los creó |
| Se trasladaron de capa | `docs/knowledge/guides/` → `docs/domain/` en el commit `63fb587` (2026-08-26) |
| Fueron borrados | commit `7932954` (2026-09-11, *"doc: add domain docs to docs\domain"*), que creó la familia `domain-*.md` y eliminó `state-machine.md` (174 líneas) y `specs_and_workflows.md` (90 líneas) sin repuntar ninguna cita |

**Por qué no basta con repuntar a `[[sdcl-sddf]]`.** Ese documento se añadió el 2026-09-23, tiene 74 líneas y cubre el mapeo SDLC clásico ↔ SDDF, la lista de estados y un diagrama de flujo. Le faltan las tres cosas que las citas prometen: el modelo de `substatus` (`TODO`/`IN-PROGRESS`/`DONE`/`BLOCKED` y el principio de los dos ejes ortogonales), las máquinas de los niveles PROJECT y ÉPICA, y la tabla de transiciones por skill. Repuntar dejaría enlaces que prometen "fuente canónica de transiciones" y "diagramas Mermaid por nivel" sobre un documento que no los tiene.

**El contenido borrado sigue vigente.** Su tabla de transiciones por skill describe exactamente el comportamiento observado de `story-code-review` durante el review de STORY-097: precondición `IMPLEMENT/DONE`, inicio `CODE-REVIEW/IN-PROGRESS`, éxito `CODE-REVIEW/DONE`, retroceso a `READY-FOR-IMPLEMENT/DONE` con `needs-changes`.

**Riesgo a vigilar.** Las tablas de los niveles PROJECT y ÉPICA **no** se contrastaron con los skills actuales. El escenario alternativo existe precisamente para cubrirlo.

**Erratas de referencia que arrastra la misma causa**, a resolver en esta historia:

- `docs/domains/README.md` apunta a `docs/wiki/specs-and-workflows.md` y a `docs/wiki/state-machine.md`, un directorio que no existe.
- `README.md` referencia `docs/guides/state-machine.md`, también inexistente.
- Una única cita usa la grafía con guion bajo, `[[specs_and_workflows]]`, frente a las 16 con guiones.
- `docs/index.md` tiene tres entradas `⚠️ nodo pendiente` para estos slugs, que desaparecen al regenerarlo con `/memory-system index`.

**Verificación sugerida:**

1. `check --root docs` baja de 46 a ~10 problemas y ninguno cita `state-machine` ni `specs-and-workflows`.
2. `git diff` no muestra ediciones en los seis `domain-*.md` ni en los ADR: las citas resuelven sin tocarlas.
3. Seguir `[[state-machine]]` desde `docs/domains/domain-story-lifecycle.md` lleva al modelo de `substatus` y a la tabla de transiciones por skill.

---

## 🏁 Cierre

Cerrada como **corrección documental**, con transición manual a `COMPLETED/DONE` — el terminal pasivo que, según [[state-machine]], ningún skill escribe y marca la persona.

### Qué se entregó

| Cambio | Ubicación |
|---|---|
| `state-machine.md` restaurado desde `7932954^` (174 líneas), `slug: state-machine` conservado, `type: wiki` → `architecture` | `docs/architecture/state-machine.md` |
| `specs-and-workflows.md` restaurado desde `7932954^` (90 líneas), nombre con guiones para que coincida con su `slug` | `docs/guides/specs-and-workflows.md` |
| Enlaces Markdown relativos del documento restaurado (asumían la ubicación antigua) convertidos a wikilinks | `state-machine.md` l. 31 y *Fuentes de verdad* |
| Estado `CANCELED` añadido a la tabla y al diagrama, con transición desde cualquier estado activo | `state-machine.md` |
| `sdcl-sddf.md` reducido a su aportación propia (mapeo SDLC clásico ↔ SDDF) y remitido al canónico | `docs/architecture/sdcl-sddf.md` |
| Erratas de referencia | `plan-09` (`[[specs_and_workflows]]`), `docs/domains/README.md` (ruta `docs/wiki/` inexistente, más fila para `[[state-machine]]`) |
| Índice regenerado | `docs/index.md`, 241 nodos |

### Resultado verificado

| Comprobación | Resultado |
|---|---|
| `check --root docs` | **46 → 10** problemas · exit 1 |
| Citas resueltas sin editar enlaces | `git diff` sobre `docs/domains/` y `docs/adr/` sin cambios (salvo el README) |
| `npm test` | 120/120 · exit 0 |
| `npm run verify:links` | 39 archivos · exit 0 |
| `npm run verify:syntax` · `verify:eval-inventory` · `verify:repository` | exit 0 |

### Decisiones tomadas durante la ejecución

1. **Se corrigió la errata de `plan-09`** pese al requerimiento de no tocar el registro histórico. La excepción está documentada arriba: `[[specs_and_workflows]]` con guion bajo nunca fue un slug válido, así que no resolvía sola al restaurar. Corregir un typo no reescribe ninguna decisión del registro.
2. **Se desambiguaron dos `slug: plan` idénticos** (`STORY-085` y `STORY-089`). Regenerar el índice destapó el choque y dejó `verify:links` en exit 1; ninguna cita usaba `[[plan]]`, así que el renombrado es seguro. Es un defecto preexistente, no causado por esta historia. **Quedan más slugs duplicados en el repositorio** — solo este rompía el build; el resto es deuda abierta.

### Alcance de proceso — leer antes de tomar esto como precedente

Esta historia **no pasó por el pipeline SDDF**. No existen `finvest-evaluation-report.md`, `design.md`, `tasks.md`, `testcases.md`, `implement-report.md` ni `code-review-report.md`, y no se ejecutaron `story-evaluation`, `story-plan`, `story-implement` ni `story-code-review`. Se cerró directamente por decisión explícita, al tratarse de una restauración de contenido versionado cuya verificación es determinista y está registrada arriba.

El `COMPLETED/DONE` refleja que el trabajo está entregado y verificado, **no** que los gates del pipeline se hayan superado.

### Deuda que permanece (fuera de alcance, declarada)

Los 10 problemas restantes de `check`: 3 wikilinks a nodos de `templates/` (excluidos del escaneo por diseño), `[[security-checklist]]` con dos candidatos posibles, `[[skill-preflight]]` que apunta a un skill y no a un nodo, y 5 artefactos `orphan` sin encabezado del que derivar un `title` honesto.
