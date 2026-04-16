---
description: >-
  Tercer paso del pipeline de ProjectSpecFactory. Verifica que
  requirement-spec.md existe, conduce la generación del plan mediante el agente
  architect y genera docs/specs/project/project-plan.md.
alwaysApply: false
name: ps-planning
---
Eres el orchestrator del estado **Planning** del pipeline de ProjectSpecFactory.

## Tu tarea

Generar `docs/specs/project/project-plan.md` a partir de `docs/specs/project/requirement-spec.md` y los documentos anteriores del pipeline, delegando el análisis y la generación al `architect`.

## Pasos

### 1. Verificar precondicion de entrada (requirement-spec.md)

Lee `docs/specs/project/requirement-spec.md`.

- Si el archivo **no existe**: informa al usuario y deten la ejecucion:

  > ❌ No se encontró `docs/specs/project/requirement-spec.md`.
  > Debes completar primero la fase Discovery ejecutando `/ps-discovery`.

- Si el archivo **existe** pero `**Estado**` es `Doing`: informa al usuario y deten la ejecucion.

  > ❌ `docs/specs/project/requirement-spec.md` aun esta en `Estado: Doing`.
  > Debes completar Discovery y dejar el documento en `Estado: Ready` antes de ejecutar `/ps-planning`.

- Si el archivo **existe** con `**Estado**: Ready`: continua al paso 2.

### 2. Verificar estado del documento de output

Lee `docs/specs/project/project-plan.md` (si existe) y detecta el valor de `**Estado**:`.

- Si el archivo **no existe**: continua al paso 3 (primera ejecucion).
- Si existe con `**Estado**: Doing`: activa flujo de retoma y continua al paso 3.
- Si existe con `**Estado**: Ready`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### 3. Verificar que el template existe

Lee `.agent/skills/ps-planning/templates/project-plan-template.md`.

- Si el archivo **existe**: continua al paso 4.
- Si el archivo **no existe**: informa al usuario y detén la ejecución:

  > ❌ No se encontró el template requerido en `.agent/skills/ps-planning/templates/project-plan-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

### 4. Delegar al architect

Invoca al agente `architect` con la siguiente instrucción:

> Lee los documentos `docs/specs/project/project-intent.md` y `docs/specs/project/requirement-spec.md`. Lee tambien el template `.agent/skills/ps-planning/templates/project-plan-template.md`.
>
> Si estas en flujo de retoma (documento existente en `Estado: Doing`), primero lee `docs/specs/project/project-plan.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continua solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> Extrae features atomicas con IDs FEAT-NNN, priorizalas, agrupalas en releases con MVP en Release 1, y escribe el resultado en `docs/specs/project/project-plan.md`.

El `architect` se encargará de:
- Leer los documentos de entrada de fases anteriores
- Leer el template y derivar la estructura del output dinámicamente
- Extraer features atómicas con IDs únicos (FEAT-NNN), descripciones y dependencias
- Priorizar por valor de negocio, dependencias y riesgo técnico
- Agrupar en releases con MVP en Release 1, incluyendo criterios de éxito
- Escribir el documento final con metadatos y checkboxes vacíos `- [ ]`

### 5. Confirmar output

Cuando el `architect` termine:

1. Verifica que `docs/specs/project/project-plan.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `D:\code\project-spec-factory\docs\specs\project\project-plan.md`
  > Workflow completo: el documento esta listo para revision.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/ps-planning` nuevamente.
