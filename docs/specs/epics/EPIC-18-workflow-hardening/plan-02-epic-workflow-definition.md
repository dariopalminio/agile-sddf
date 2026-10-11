---
type: plan
id: plan-02
slug: plan-02-epic-workflow-definition
title: "Definir workflow canónico de Épica/Release"
status: COMPLETED
substatus: DONE
parent: EPIC-18
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-18-workflow-hardening
---


# Plan: Definir workflow canónico de Épica/Release

## Contexto

El workflow de épica en el framework estaba documentado con solo 2 estados (`DEFINITION → RELEASED`) en `state-machine.md`, pero en la práctica los archivos `release.md` existentes usaban valores heterogéneos (`IMPLEMENT`, `COMPLETED`, `RELEASED`, `DEFINITION`). El usuario define un flujo formal de 7 estados que refleja la naturaleza de una épica como contenedor de historias, con buffer de capacidad (READY-FOR-DEV) y estado terminal pasivo (COMPLETED).

**Nuevo workflow canónico:**
```
DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED
```

**No se tocan los archivos release.md históricos** en `docs/specs/releases/` — son artefactos pasados y su actualización masiva no agrega valor.

Documentar en ADR.

---

## Estados y descripciones canónicas

| Estado | Descripción |
|--------|-------------|
| `DEFINE` | Se define el alcance: objetivos, features, criterios de éxito y valor. Se documenta en `release.md`. |
| `PLAN` | Se desglosan las historias, se asignan a releases, se estima esfuerzo y se identifican dependencias. |
| `READY-FOR-DEV` | Buffer/cola de espera. Épica planificada y aprobada, esperando capacidad del equipo. WIP limit aplicable. |
| `DEVELOP` | Desarrollo en curso: las historias de la épica se implementan. La épica permanece aquí hasta que todas estén entregadas. |
| `VALIDATE` | Pruebas de integración y regresión del conjunto completo (end-to-end, UAT, requisitos no funcionales). |
| `SHIP` | La épica se publica/despliega a producción. Último estado activo. |
| `COMPLETED` | Estado terminal pasivo. Épica cerrada administrativamente. Sin acciones pendientes. |

---

## Archivos a modificar

### 1. `docs/knowledge/guides/state-machine.md`
Reemplazar toda la sección **"Nivel RELEASE"** (actualmente 2 estados con diagrama simple) por:
- Diagrama Mermaid con los 7 estados y transiciones
- Tabla de transiciones (qué skill o actor gestiona cada transición)
- Nota sobre READY-FOR-DEV como buffer (WIP = 1 en DEVELOP)
- Nota sobre COMPLETED como estado terminal pasivo

### 2. `docs/knowledge/guides/specs_and_workflows.md`
Añadir o reemplazar la sección de Release Workflow (actualmente ausente o mínima) con:
- Happy path: `DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED`
- Descripción de cada estado

### 3. `.claude/skills/header-aggregation/SKILL.md`
Actualizar el enum de `status` en el esquema canónico de frontmatter:
- Añadir: `DEFINE | READY-FOR-DEV | DEVELOP | VALIDATE | SHIP`
- Mantener: `COMPLETED` (compartido con story)
- Deprecar (no eliminar aún para no romper históricos): `DEFINITION | RELEASED`

### 4. `.claude/skills/release-creation/SKILL.md`
Actualizar la tabla del Paso 3 (frontmatter defaults):
- `status` por defecto: `DEFINE` (era `DEFINITION`)

### 5. `.claude/skills/releases-from-project-plan/SKILL.md`
Actualizar el status por defecto de releases generados:
- `status: DEFINE` (era `DEFINITION`)

### 6. `docs/knowledge/guides/skill-structural-pattern.md`
Actualizar el enum de `status` en el ejemplo de frontmatter (sección §8) para incluir los nuevos estados de épica.

### 7. `docs/adr/ADR-0003-workflow-canonico-story-y-epic.md`
Crear ADR-0003 — Workflows canónicos de Story y Epic — que documente formalmente los workflows canónicos de historia y épica, incluyendo la definición de cada estado, las transiciones permitidas, y la justificación de diseño. Referenciar esta ADR desde la documentación canónica (state-machine.md) y desde el release.md de EPIC-18.
ID del nuevo ADR: ADR-0003 (el mayor existente es ADR-0002) Nombre del archivo: docs/adr/ADR-0003-workflow-canonico-story-y-epic.md


---

## Archivos que NO se tocan

- `docs/specs/releases/EPIC-*/release.md` — artefactos históricos, no requieren actualización retroactiva
- `docs/specs/templates/release-spec-template.md` — ya usa placeholder `<ESTADO_INICIAL>`, no hardcodea el valor

---

## Verificación

1. `grep -r "DEFINITION" .claude/skills/release-creation/ .claude/skills/releases-from-project-plan/ docs/knowledge/` → debe devolver 0 coincidencias (valor reemplazado por DEFINE)
2. Leer `docs/knowledge/guides/state-machine.md` sección "Nivel RELEASE" → debe mostrar los 7 estados con diagrama Mermaid correcto
3. Leer `header-aggregation/SKILL.md` → debe incluir `DEFINE | READY-FOR-DEV | DEVELOP | VALIDATE | SHIP` en el enum
