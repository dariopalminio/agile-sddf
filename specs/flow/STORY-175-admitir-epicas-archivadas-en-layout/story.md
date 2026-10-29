---
alwaysApply: false
type: story
id: STORY-175
kind: feat
slug: STORY-175-admitir-epicas-archivadas-en-layout
title: "Admitir épicas archivadas en el layout fijo con un ADR nuevo"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-29
updated: 2026-10-29
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-171
  - STORY-172-skill-epic-complete-archivar-epicas-canceladas
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Admitir épicas archivadas en el layout fijo con un ADR nuevo

**Como** Solo Builder que mantiene Agile-SDDF  
**Quiero** que un ADR nuevo admita épicas cerradas en `specs/flow/archive/` y que los documentos de autoridad reconozcan a `epic-complete` como escritor de `COMPLETED` de épica  
**Para** que `/epic-complete` pueda archivar una épica sin contradecir una regla aceptada, y que los skills de épica sigan numerando y resolviendo épicas sin reutilizar números de épicas archivadas

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Un ADR nuevo reemplaza a ADR-0017
```gherkin
Dado que ADR-0017 está aceptado y deja las épicas en specs/flow/
Cuando se acepta el ADR nuevo del layout
Entonces admite épicas COMPLETED/DONE y CANCELED/DONE en specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/
  Y ADR-0017 pasa a status "SUPERSEDED" con "superseded-by" apuntando al ADR nuevo y una nota de reemplazo bajo su título, sin otros cambios
  Y la fila de ADR-0017 en el índice de docs/adr/README.md muestra "SUPERSEDED → ADR-NNNN"
```

### AC-2 — Escenario principal – Documentos activos coherentes con el ADR
```gherkin
Dado que el ADR nuevo del layout está aceptado
Cuando el Solo Builder consulta AGENTS.md, docs/constitution.md, domain-epic-lifecycle y domain-state-management
Entonces documentan que epic-complete escribe COMPLETED de épica solo con confirmación humana
  Pero ningún documento activo de AGENTS.md, docs/ (salvo los ADR inmutables) ni skills/ afirma que las épicas no se archivan
```

### AC-3 — Escenario alternativo – La numeración cuenta las épicas archivadas
```gherkin
Escenario: <skill> no reutiliza el número de una épica archivada
  Dado una épica archivada en specs/flow/archive/2026-10-01-EPIC-30-exportar-informes/
    Y EPIC-29 como la épica activa de mayor número en specs/flow/
  Cuando el Solo Builder crea una épica nueva con "<skill>"
  Entonces la épica nueva recibe el ID "EPIC-31"
    Pero no recibe el ID "EPIC-30"
Ejemplos:
  | skill                   |
  | /epic-creation          |
  | /epic-from-project-plan |
```

### AC-4 — Escenario principal – Máquina de estados y reporte de VALIDATE coherentes
```gherkin
Dado que el ADR nuevo del layout está aceptado
Cuando el Solo Builder consulta la sección "Nivel ÉPICA" de docs/architecture/state-machine.md y domain-epic-lifecycle
Entonces state-machine.md documenta que epic-ship escribe SHIP y epic-complete escribe COMPLETED de épica, cada uno solo con confirmación humana
  Y domain-epic-lifecycle nombra epic-validate-report.md como el reporte de VALIDATE de la épica
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Inmutabilidad de ADR:** ADR-0017 solo recibe los cambios que permite `docs/adr/README.md`: `status: SUPERSEDED`, `superseded-by` y una nota visible de reemplazo bajo su título. El resto de su contenido no se edita (regla de AGENTS.md).
- **CNF-2 — Fecha del archivo:** el ADR nuevo aplica a las épicas la misma regla de fecha que ADR-0017 aplica a las historias (`updated:`, `created:` o `date:`).
- **CNF-3 — Gate determinista:** `npm run verify:repository` y `npm test` pasan después del cambio.

## Fuera de alcance (Non-Goals)

- Implementar el skill `epic-complete` (STORY-171) y el archivado de épicas canceladas (STORY-172).
- Mover épicas existentes a `specs/flow/archive/`.
- Migrar `docs/requirements/` a `specs/living/`.
- Corregir documentos históricos de work items ya entregados (`design.md` y `tasks.md` de STORY-147, STORY-151 y STORY-152) o de épicas de otros flujos, que registran la regla vigente cuando se escribieron.

## 📎 Notas / contexto adicional

- **Split (2026-10-29):** surge de `/story-split STORY-171` con el patrón 4 (complejidad de criterios de aceptación); recoge el antiguo AC-4 de gobierno y la nota de impacto en otros skills.
- **Orden de entrega:** se entrega antes de STORY-171 y STORY-172, que dependen de que el layout admita épicas archivadas.
- **Número del ADR:** probablemente ADR-0019, porque ADR-0018 (Cucumber para `specs/living/`) ya existe en `PROPOSED`. El número final se fija al crearlo.
- **Alcance cerrado de documentos con la regla obsoleta** (verificado el 2026-10-29 con una búsqueda de «no se archivan»):

  | Documento | Cambio |
  |---|---|
  | `skills/epic-analyze/SKILL.md:103` | Retirar «las épicas no se archivan» y fijar el comportamiento ante una épica archivada. |
  | `skills/epic-creation/SKILL.md:136` | Calcular el siguiente `NN` sobre `specs/flow/EPIC-*/` y `specs/flow/archive/*-EPIC-*/` (AC-3). |
  | `skills/epic-from-project-plan/SKILL.md:55` | `$MAX_EPIC` incluye las épicas archivadas (AC-3). |
  | `skills/epic-generate-stories/SKILL.md` | Sin cambio: ya excluye `specs/flow/archive/` al buscar épicas. |
  | `docs/guides/organization-of-artifacts.md:53` | Retirar «Las épicas no se archivan» y describir la regla del ADR nuevo. |
  | `docs/guides/root-folder-practices.md:34` | Ídem. |
  | `AGENTS.md`, `docs/constitution.md`, `docs/domains/domain-epic-lifecycle.md`, `docs/domains/domain-state-management.md` | Regla de archivo de épicas y escritor de `COMPLETED` de épica (AC-2). |
  | `docs/adr/README.md` | Fila del ADR nuevo y fila de ADR-0017 como `SUPERSEDED` (AC-1). |
  | `docs/architecture/state-machine.md` (sección "Nivel ÉPICA") | `epic-ship` escribe `SHIP` y `epic-complete` escribe `COMPLETED` de épica con confirmación humana; hoy `SHIP` figura a cargo de DevOps / CI-CD (AC-4). |
  | `docs/domains/domain-epic-lifecycle.md` | Nombrar `epic-validate-report.md` como reporte de `VALIDATE` (AC-4). |

  Las copias en `.claude/`, `.agents/` y `.codex/` son salida de `agile-sddf install` y no se editan a mano.
- Cubre el criterio de salida de EPIC-23: **CS-20** — Un ADR nuevo reemplaza a ADR-0017 para admitir épicas en `specs/flow/archive/`; `domain-epic-lifecycle`, `domain-state-management` y `docs/architecture/state-machine.md` documentan que `epic-ship` y `epic-complete` escriben `SHIP` y `COMPLETED` de épica con confirmación humana, `domain-epic-lifecycle` nombra `epic-validate-report.md` como reporte de `VALIDATE`, y `validation-contract-policy` registra los gates del flujo de épica de forma coherente con su flowchart. Lo completa junto con STORY-166 (`validation-contract-policy`) y STORY-170 (`SHIP` de épica en `domain-epic-lifecycle` y `domain-state-management`); coordinar con STORY-170 el orden de edición de los documentos de dominio (invariante 6 de `domain-state-management`).
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
