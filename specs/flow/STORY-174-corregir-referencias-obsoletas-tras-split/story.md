---
alwaysApply: false
type: story
id: STORY-174
kind: feat
slug: STORY-174-corregir-referencias-obsoletas-tras-split
title: "Skill epic-refine: corregir referencias obsoletas tras un split"
status: SPECIFY
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-29
updated: 2026-10-29
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-165
  - STORY-173
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Skill `epic-refine` — corregir referencias obsoletas tras un split

**Como** Solo Builder  
**Quiero** que `/epic-refine EPIC-NN` detecte y corrija las referencias a slugs de historias que dejaron de existir tras un `/story-split`, aunque `epic-analyze` no las reporte  
**Para** que el índice de la épica y los `related` de sus historias apunten a historias reales sin rastrearlas a mano después de cada split.

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Corregir referencias al slug de una historia dividida
```gherkin
Dado que "STORY-301" se dividió con "/story-split": la core quedó como "STORY-301-exportar-informe-csv" y las hermanas son "STORY-305" y "STORY-306"
  Y el índice de "epic.md" y el "related" de "STORY-302" aún citan el slug "STORY-301-exportar-informe", que no existe en "specs/flow/" ni en "specs/flow/archive/"
  Y "epic-analyze-report.md" tiene "verdict: NEEDS-REFINEMENT" y no reporta esas referencias
Cuando el mantenedor ejecuta "/epic-refine EPIC-30" y confirma el plan de cambios
Entonces el plan de cambios incluye "COH-1" (índice de "epic.md") y "COH-2" ("related" de "STORY-302") con el reemplazo "STORY-301-exportar-informe-csv"
  Y el índice de "epic.md" y el "related" de "STORY-302" citan "STORY-301-exportar-informe-csv"
  Y existen "epic.md.bak" y "STORY-302-*/story.md.bak"
  Y "epic-refine-report.md" lista "COH-1" y "COH-2" como aplicados
```

### AC-2 — Escenario alternativo – Reemplazo no determinable
```gherkin
Dado que el "related" de "STORY-302" cita el slug "STORY-310-importar-datos"
  Y no existe ningún directorio "STORY-310-*" en "specs/flow/" ni en "specs/flow/archive/"
Cuando el mantenedor ejecuta "/epic-refine EPIC-30 --auto"
Entonces "epic-refine-report.md" lista la referencia como "COH-1" "fuera de alcance" con el responsable "PO"
  Pero el "story.md" de "STORY-302" no se modifica
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Seguridad de datos (Backup obligatorio):** Cada archivo modificado (`epic.md` o `story.md`) debe ser respaldado como `<archivo>.bak` antes de su escritura.
- **CNF-2 — Encoding:** Todos los archivos generados o modificados deben quedar en UTF-8 sin BOM.
- **CNF-3 — Tamaño del skill:** El detalle de la familia COH vive en `references/` o `assets/` del skill y el cuerpo de `skills/epic-refine/SKILL.md` sigue por debajo de 500 líneas.

## 🚫 Fuera de alcance (Non-Goals)

- Corregir los hallazgos que `epic-analyze` sí reporta (INT, MAD: STORY-165; SAL: STORY-173).
- Actualizar referencias fuera de `epic.md` y de los `story.md` de la épica (por ejemplo `docs/index.md`).
- Cambiar los estados (`status`/`substatus`) de la épica o de las historias.
- Dividir historias: `epic-refine` no ejecuta splits ni los necesita para corregir referencias; solo repara las que deja un `/story-split` ya hecho. Si detecta una historia que conviene dividir, la deriva a `/story-split` (con confirmación humana en modo manual) o la lista como "fuera de alcance" con el responsable "PO" (en `--auto`).

## 📎 Notas / contexto adicional

- **Referencia obsoleta (COH-<n>):** slug citado en el `related` de una historia de la épica o en una línea F2/F3 del índice de `epic.md` que no existe como directorio en `specs/flow/` ni en `specs/flow/archive/` y que `epic-analyze-report.md` no reporta. `COH` es un código propio de `epic-refine`, no del catálogo de `epic-analyze`.
- **Regla de reemplazo (determinista):** `/story-split` conserva el ID en la historia core y le puede cambiar el slug. Si existe un único directorio `STORY-NNN-*` con el mismo ID en `specs/flow/` o en `specs/flow/archive/`, ese es el reemplazo. Si no existe ninguno, o existe más de uno, el hallazgo va al PO como "fuera de alcance".
- **Disparo con `verdict: APPROVED`:** la detección COH solo se ejecuta cuando `epic-analyze-report.md` tiene `verdict: NEEDS-REFINEMENT`. Con `verdict: APPROVED` se mantiene sin cambios el AC-2 de STORY-165: no se crea ni se modifica ningún archivo.
- **Contrato que se reutiliza de STORY-165 (puntos de extensión):**
  - Plan de cambios consolidado: una entrada por hallazgo con código, archivo, cambio propuesto y tratamiento (corrección automática o "fuera de alcance"), confirmado una sola vez en modo manual.
  - Tabla de hallazgos de `epic-refine-report.md`: código, estado (`aplicado` / `fuera de alcance`) y responsable.
  - Backup `<archivo>.bak` antes de cada escritura y modos manual y `--auto`.

  STORY-174 añade la familia COH sobre ese contrato sin cambiar su estructura, así que se puede diseñar y probar con fixtures de `specs/flow/` y un stub del contrato aunque STORY-165 no esté entregada.
- **Split:** hermana de STORY-165 (core) resultante de `/story-split` (2026-10-29, patrón 2 — variaciones de reglas de negocio). Amplía el skill `epic-refine` que crea STORY-165, reutilizando su plan de cambios, sus backups y `epic-refine-report.md`. Se implementa después de STORY-165 y es independiente de STORY-173.
- Skill Tool: se debe usar skill-master
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
