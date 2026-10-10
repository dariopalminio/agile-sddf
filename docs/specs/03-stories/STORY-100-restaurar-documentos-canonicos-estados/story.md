---
alwaysApply: false
type: story
id: STORY-100
kind: fix
slug: STORY-100-restaurar-documentos-canonicos-estados
title: "Restaurar los documentos canÃ³nicos de la mÃ¡quina de estados borrados sin repuntar sus citas"
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

# ðŸ“– Historia: Restaurar los documentos canÃ³nicos de la mÃ¡quina de estados borrados sin repuntar sus citas

**Como** mantenedor del framework SDDF
**Quiero** que `[[state-machine]]` y `[[specs-and-workflows]]` vuelvan a resolver a documentos reales
**Para** que los ADR, los documentos de dominio y el Ã­ndice apunten a la fuente de verdad de estados y transiciones en lugar de a un destino inexistente

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ las citas resuelven sin tocar ni un enlace

```gherkin
Dado un repositorio donde `/memory-system check --root docs` reporta 36 wikilinks rotos hacia `state-machine`, `specs-and-workflows` y `specs_and_workflows`
Cuando se restauran ambos documentos desde el commit que los borrÃ³, conservando el `slug` que declaraban
Entonces `check --root docs` deja de reportar esos 36 problemas
  Y ninguna de las 33 citas existentes ha sido modificada
  Y los dos documentos restaurados no aparecen como `orphan` ni como `invalid-frontmatter`
```

### Escenario alternativo â€“ el contenido restaurado describe el pipeline vigente

```gherkin
Dado el documento `state-machine` restaurado, con su tabla de transiciones por skill
Cuando se contrasta cada fila con la precondiciÃ³n y las transiciones que declara el `SKILL.md` correspondiente
Entonces las filas que sigan siendo correctas se conservan
  Y las que hayan derivado se corrigen en el documento restaurado
  Y las divergencias corregidas quedan registradas, para no restaurar una fuente de verdad desactualizada
```

### Requerimiento: ConservaciÃ³n del slug

Los dos documentos se restauran conservando el `slug` que ya declaraban (`state-machine` y `specs-and-workflows`). Es lo que hace resolver las citas sin editarlas: `deriveSlug` devuelve el slug declarado en el frontmatter, no el nombre del archivo.

### Requerimiento: Una sola fuente de verdad

`docs/architecture/sdcl-sddf.md` solapa con el documento restaurado en la lista de estados y el diagrama de flujo de nivel STORY. Al cerrar la historia debe existir **un** documento canÃ³nico de la mÃ¡quina de estados; el otro remite a Ã©l en lugar de duplicarlo.

### Requerimiento: No reescribir el registro histÃ³rico

Las citas que viven en artefactos de historias ya cerradas y en `EPIC-17/plan-09-*` no se editan: son registro histÃ³rico y resuelven solas al restaurar los destinos.

**Ãšnica excepciÃ³n:** una errata de grafÃ­a que no resuelve sola. La cita `[[specs_and_workflows]]` de `plan-09` usa guion bajo, pero el documento al que apunta declaraba `slug: specs-and-workflows` con guiones desde el principio â€” nunca fue un slug vÃ¡lido. Corregir un error tipogrÃ¡fico no reescribe ninguna decisiÃ³n ni afirmaciÃ³n del registro, asÃ­ que se corrige.

## âš™ï¸ Criterios no funcionales

* **Trazabilidad:** la restauraciÃ³n parte de `git show 7932954^:<ruta>`, no de contenido reescrito a mano, de modo que el diff contra el original sea auditable.
* **Consistencia de capa:** cada documento queda en una capa vÃ¡lida de `LAYERS` y con un `type` coherente con ella.
* **Sin regresiÃ³n:** `npm test` y `npm run verify:links` siguen en verde.

## Fuera de alcance (Non-Goals)

- Resolver el resto de la deuda de `check`: los 3 wikilinks a nodos de `templates/` (excluidos del escaneo por diseÃ±o), el destino ambiguo `[[security-checklist]]`, la referencia `[[skill-preflight]]` a un skill y los 5 `orphan` sin encabezado.
- Reescribir el modelo de estados. Esta historia restaura y actualiza lo que haya derivado; no rediseÃ±a.
- Cablear el gate de CI de `memory-system check` en los workflows.

## ðŸ“Ž Notas / contexto adicional

**Origen.** La deuda la detectÃ³ `/memory-system check` en [[STORY-097-memory-system-check-ci]], que la diagnosticÃ³ mal: su `implement-report.md` afirmaba que eran "documento canÃ³nico aÃºn no escrito, trabajo pendiente legÃ­timo". El diagnÃ³stico correcto, verificado contra git durante el code review de esa historia:

| Hecho | Evidencia |
|---|---|
| Ambos documentos existieron | `EPIC-17/plan-09-state-machine-canonical-document.md` estÃ¡ `status: COMPLETED` y los creÃ³ |
| Se trasladaron de capa | `docs/knowledge/guides/` â†’ `docs/domain/` en el commit `63fb587` (2026-08-26) |
| Fueron borrados | commit `7932954` (2026-09-11, *"doc: add domain docs to docs\domain"*), que creÃ³ la familia `domain-*.md` y eliminÃ³ `state-machine.md` (174 lÃ­neas) y `specs_and_workflows.md` (90 lÃ­neas) sin repuntar ninguna cita |

**Por quÃ© no basta con repuntar a `[[sdcl-sddf]]`.** Ese documento se aÃ±adiÃ³ el 2026-09-23, tiene 74 lÃ­neas y cubre el mapeo SDLC clÃ¡sico â†” SDDF, la lista de estados y un diagrama de flujo. Le faltan las tres cosas que las citas prometen: el modelo de `substatus` (`TODO`/`IN-PROGRESS`/`DONE`/`BLOCKED` y el principio de los dos ejes ortogonales), las mÃ¡quinas de los niveles PROJECT y Ã‰PICA, y la tabla de transiciones por skill. Repuntar dejarÃ­a enlaces que prometen "fuente canÃ³nica de transiciones" y "diagramas Mermaid por nivel" sobre un documento que no los tiene.

**El contenido borrado sigue vigente.** Su tabla de transiciones por skill describe exactamente el comportamiento observado de `story-code-review` durante el review de STORY-097: precondiciÃ³n `IMPLEMENT/DONE`, inicio `CODE-REVIEW/IN-PROGRESS`, Ã©xito `CODE-REVIEW/DONE`, retroceso a `READY-FOR-IMPLEMENT/DONE` con `needs-changes`.

**Riesgo a vigilar.** Las tablas de los niveles PROJECT y Ã‰PICA **no** se contrastaron con los skills actuales. El escenario alternativo existe precisamente para cubrirlo.

**Erratas de referencia que arrastra la misma causa**, a resolver en esta historia:

- `docs/domains/README.md` apunta a `docs/wiki/specs-and-workflows.md` y a `docs/wiki/state-machine.md`, un directorio que no existe.
- `README.md` referencia `docs/guides/state-machine.md`, tambiÃ©n inexistente.
- Una Ãºnica cita usa la grafÃ­a con guion bajo, `[[specs_and_workflows]]`, frente a las 16 con guiones.
- `docs/index.md` tiene tres entradas `âš ï¸ nodo pendiente` para estos slugs, que desaparecen al regenerarlo con `/memory-system index`.

**VerificaciÃ³n sugerida:**

1. `check --root docs` baja de 46 a ~10 problemas y ninguno cita `state-machine` ni `specs-and-workflows`.
2. `git diff` no muestra ediciones en los seis `domain-*.md` ni en los ADR: las citas resuelven sin tocarlas.
3. Seguir `[[state-machine]]` desde `docs/domains/domain-story-lifecycle.md` lleva al modelo de `substatus` y a la tabla de transiciones por skill.

---

## ðŸ Cierre

Cerrada como **correcciÃ³n documental**, con transiciÃ³n manual a `COMPLETED/DONE` â€” el terminal pasivo que, segÃºn [[state-machine]], ningÃºn skill escribe y marca la persona.

