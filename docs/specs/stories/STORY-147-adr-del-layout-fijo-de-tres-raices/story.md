---
alwaysApply: false
type: story
id: STORY-147
kind: chore
slug: STORY-147-adr-del-layout-fijo-de-tres-raices
title: "ADR del layout fijo de tres raíces"
status: SPECIFY
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-22
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: ADR del layout fijo de tres raíces

**Como** mantenedor de Agile-SDDF que va a migrar los skills a rutas fijas
**Quiero** un ADR aceptado que fije `docs/`, `specs/` (`flow/`, `flow/archive/`, `living/`) y `workflow/` como raíces hermanas en la raíz del repo y retire `SDDF_ROOT`, la clave `root` y `SPECS_BASE`
**Para** que las historias de migración de skills, de `sddf-init` y de la migración de work items partan de una decisión registrada e inmutable en lugar de reinterpretar la épica

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – ADR nuevo que reemplaza a ADR-0010
```gherkin
Dado que "docs/adr/ADR-0010-specs-dentro-de-docs.md" está ACCEPTED
Cuando se registra el ADR del layout fijo de tres raíces
Entonces existe un ADR nuevo con status ACCEPTED en "docs/adr/"
  Y declara "docs/", "specs/flow/", "specs/flow/archive/", "specs/living/" y "workflow/" como raíces hermanas en la raíz del repo
  Y declara retirados "SDDF_ROOT", la clave "root" de "sddf.config.yaml" y "SPECS_BASE"
  Y fija la convención "<YYYY-MM-DD>-STORY-NNN-<slug>/" para "specs/flow/archive/"
  Y ADR-0010 queda marcado "superseded-by" el ADR nuevo
  Y "docs/adr/README.md" lista el ADR nuevo
```

### AC-2 — Escenario alternativo / error – ADR aceptado no se edita in place
```gherkin
Dado que ADR-0010 está ACCEPTED
Cuando se marca como reemplazado
Entonces solo cambian sus metadatos de reemplazo ("status" y "superseded-by")
  Pero el contexto, la decisión y las consecuencias de ADR-0010 quedan sin cambios
```

### AC-3 — Escenario alternativo – decisión sobre el nombre del directorio de historia
```gherkin
Dado que la épica conserva "STORY-NNN-<slug>/" y "EPIC-NN-<slug>/" (ADR-0004)
Cuando se redacta el ADR
Entonces el ADR declara explícitamente si los directorios de "specs/flow/" conservan el slug
  Y la decisión es consistente con SMOKE-1 y SMOKE-2 de la épica
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Inmutabilidad de ADRs:** ningún ADR aceptado se edita en su contenido; el reemplazo se expresa solo con un ADR nuevo y `superseded-by` (regla de `AGENTS.md`).
- **CNF-2 — Enlaces:** `npm run verify:repository` (chequeo de enlaces) termina en verde tras añadir el ADR.

## Fuera de alcance (Non-Goals)

- Modificar skills, `sddf-init` o mover work items: lo cubren STORY-148 a STORY-153.
- Decidir el archivado de épicas o de stories `CANCELED` (épica de Workflow).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-147 — ADR del layout fijo de tres raíces
Debe completarse antes de las demás historias de EPIC-26 porque fija la decisión que todas aplican.

**Criterio de salida de la épica que cubre** (AC-1 y AC-2 lo verifican juntos; cita literal para la trazabilidad de `/epic-analyze`):

- **CS-1** — Existe un ADR nuevo `ACCEPTED` del layout fijo y ADR-0010 queda reemplazado (`superseded-by`) sin editarse su contenido.
