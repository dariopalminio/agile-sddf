---
type: plan
id: plan-03
slug: plan-03-lazy-assignment-of-feat-ids
title: "Asignación lazy de FEAT IDs (dos fases)"
status: COMPLETED
substatus: DONE
parent: EPIC-18
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-18-workflow-hardening
---

# Plan: Asignación lazy de FEAT IDs (dos fases)

## Contexto

`release-creation` asigna FEAT IDs en el momento de crear el `release.md`, leyendo los
directorios existentes en `$SPECS_BASE/specs/stories/` para calcular el siguiente número
disponible. Esto genera colisiones si:
- Dos releases se definen en paralelo antes de generar sus historias.
- Un release se define pero sus historias no se crean inmediatamente.

El contador solo ve el estado del filesystem en el instante de creación del release, no los
IDs que ya fueron "reservados" por otros releases en definición simultánea.

**Solución:** mover la asignación de FEAT IDs al momento real de creación de directorios de
historia (`release-generate-stories`). El `release.md` describe features **sin ID**; el ID
se asigna y se escribe en `release.md` recién cuando `release-generate-stories` crea los
directorios.

---

## Cambios

### 1. `.claude/skills/release-creation/assets/release-spec-template.md`

Actualizar el bloque `## Features` para que no incluya `FEAT-[INDEX]`:

```markdown
## Features <!-- sección obligatoria-->
- [ ] **[Nombre feature 1]:** [Breve descripción de la feature]
- [ ] **[Nombre feature 2]:** [Breve descripción de la feature]
- [ ] **[Nombre feature 3]:** [Breve descripción de la feature]
```

### 2. `.claude/skills/release-creation/SKILL.md`

En **Paso 4 — Features**:
- Eliminar el párrafo sobre cálculo automático del siguiente `FEAT-NNN`
  (leer dirs de `$SPECS_BASE/specs/stories/`, incrementar, etc.).
- El formato de salida en `release.md` pasa a ser: `- [ ] **{Nombre}:** {descripción}`
- Añadir nota al final del bloque Features:
  > Los FEAT IDs se asignan al ejecutar `/release-generate-stories`. No se pre-asignan
  > en el release para evitar colisiones con otros releases en definición simultánea.

### 3. `.claude/skills/release-generate-stories/SKILL.md`

#### Paso 2 — Extraer features (ampliar parsing)

Añadir soporte para ambos formatos:
- **Con ID (releases existentes):** `- [ ] FEAT-NNN - **Nombre:** desc` → usar ID extraído.
- **Sin ID (releases nuevos):** `- [ ] **Nombre:** desc` → marcar como "pendiente de asignación".

#### Nuevo sub-paso 2b — Asignar IDs a features sin ID

Para features sin ID:
1. Leer con Glob `$SPECS_BASE/specs/stories/FEAT-*/story.md` → encontrar mayor `FEAT-NNN`
   en el filesystem.
2. Leer **todos** los `release.md` en `$SPECS_BASE/specs/releases/*/` y extraer cualquier
   `FEAT-NNN` ya presente en sus secciones Features — evita colisiones con releases que ya
   tienen IDs asignados pero cuyas historias aún no existen en disco.
3. Tomar el máximo entre ambas fuentes y asignar IDs secuenciales desde `max+1`.
4. **Backfill en `release.md`:** actualizar la sección `## Features` del release activo,
   reemplazando cada línea sin ID por la versión con ID asignado:
   `- [ ] FEAT-NNN - **Nombre:** desc`

   Esto restaura la trazabilidad: después de la generación, `release.md` refleja los IDs reales.

#### Restricciones — actualizar

Cambiar la regla `El skill **no modifica** el archivo de release` a:

> El skill **solo modifica** el archivo de release para backfill de FEAT IDs: reemplaza
> líneas `- [ ] **Nombre:** desc` por `- [ ] FEAT-NNN - **Nombre:** desc` en la sección
> `## Features` antes de generar los directorios de historia. No modifica ninguna otra
> sección ni ningún otro archivo.

---

## Compatibilidad hacia atrás

`release-generate-stories` debe manejar ambos formatos:
- Formato nuevo (sin ID): línea no contiene patrón `FEAT-\d+`.
- Formato antiguo (con ID): releases históricos que ya tienen `FEAT-NNN`.

Si todos los features de un release ya tienen ID → comportamiento actual sin cambios.
Si algunos o todos carecen de ID → asignar y hacer backfill antes de generar.

---

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `.claude/skills/release-creation/assets/release-spec-template.md` | Quitar `FEAT-[INDEX]` del bloque Features |
| `.claude/skills/release-creation/SKILL.md` | Eliminar lógica de asignación de IDs en Paso 4; actualizar formato de salida |
| `.claude/skills/release-generate-stories/SKILL.md` | Ampliar Paso 2; añadir sub-paso 2b de asignación + backfill; actualizar restricciones |

**No requieren cambio:**
- `release-format-validation/SKILL.md` — solo valida presencia de sección, no formato de IDs.
- `releases-from-project-plan/SKILL.md` — lee features desde `project-plan.md` donde el PM
  puede tener IDs pre-asignados; no es el caso problemático reportado.

---

## Verificación

1. Crear release con `/release-creation` → `release.md` NO contiene `FEAT-NNN` en Features.
2. Ejecutar `/release-generate-stories` → directorios `FEAT-NNN-nombre/` creados con IDs
   correctos; `release.md` actualizado con backfill de IDs.
3. Crear dos releases sin generar historias; luego ejecutar `/release-generate-stories` sobre
   cada uno → los IDs no colisionan entre releases.
4. Ejecutar `/release-generate-stories` sobre un release antiguo (IDs ya en `release.md`) →
   comportamiento anterior intacto (no modifica ni reasigna).
