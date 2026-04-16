---
description: >-
  Primer paso del pipeline de ProjectSpecFactory. Entrevista al usuario mediante
  el agente product-manager para capturar la intención del proyecto y refinarla,
  produciendo docs/specs/project/project-intent.md en una sola sesión.
alwaysApply: false
name: ps-begin-intention
---
Eres el orchestrator del estado **Begin Intention** del pipeline de ProjectSpecFactory.

## Tu tarea

Generar `docs/specs/project/project-intent.md` conduciendo una entrevista en una sola sesión que captura la intención inicial del proyecto y la refina hasta producir el documento final.

## Pasos

### 1. Verificar WIP=1

Antes de iniciar, revisa los documentos de `docs/specs/project/` y detecta si existe algun archivo con `**Estado**: Doing`.

- Si **no** existe ningun documento en `Doing`: continua al paso 2.
- Si **existe** al menos uno en `Doing`: notifica el conflicto WIP=1 e indica que ya hay un proyecto activo. Muestra cual documento esta en `Doing` y ofrece solo estas opciones:
  - `Sobrescribir`: iniciar de cero y continuar con el flujo normal.
  - `Retomar`: continuar el proyecto activo aplicando flujo de retoma sobre el documento en `Doing`.

Si el usuario elige retomar, activa el flujo de retoma del paso 4 sin reiniciar desde cero.

### 2. Verificar estado del documento de output

Lee `docs/specs/project/project-intent.md` (si existe) y detecta el valor de `**Estado**:`.

- Si el archivo **no existe**: continua al paso 3 (primera ejecucion).
- Si existe con `**Estado**: Doing`: activa flujo de retoma y continua al paso 3.
- Si existe con `**Estado**: Ready`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### 3. Verificar que el template existe

Lee `.agent/skills/ps-begin-intention/templates/project-intent-template.md`.

- Si el archivo **existe**: continua al paso 4.
- Si el archivo **no existe**: informa al usuario y detén la ejecución:

  > ❌ No se encontró el template requerido en `.agent/skills/ps-begin-intention/templates/project-intent-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

### 4. Delegar al product-manager

Invoca al agente `product-manager` con la siguiente instrucción:

> Lee el template en `.agent/skills/ps-begin-intention/templates/project-intent-template.md`. Extrae las secciones del template en runtime.
>
> Si estas en flujo de retoma (documento existente en `Estado: Doing`), primero lee `docs/specs/project/project-intent.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continua solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> Conduce la entrevista de intencion de proyecto con el usuario en dos fases dentro de la misma sesion:
>
> **Fase 1 — Captura de intención:** Pregunta al usuario por la idea general del proyecto (qué quiere construir, para quién, qué problema resuelve). Usa máx 3-4 preguntas abiertas para entender el contexto.
>
> **Fase 2 — Refinamiento:** A partir de las respuestas de la Fase 1, profundiza sección por sección del template (máx 3-4 preguntas por ronda). Pre-rellena con la información ya capturada y solicita solo lo que falta. Infiere el contenido faltante marcándolo con `[inferido]`.
>
> Escribe el resultado completo en `docs/specs/project/project-intent.md`.

El `product-manager` se encargará de:
- Capturar la intención inicial del proyecto en la Fase 1
- Refinar y completar todas las secciones del template en la Fase 2
- Inferir contenido faltante marcándolo con `[inferido]`
- Escribir el documento final con metadatos de generación

### 5. Confirmar output

Cuando el `product-manager` termine:

1. Verifica que `docs/specs/project/project-intent.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `D:\code\project-spec-factory\docs\specs\project\project-intent.md`
  > Siguiente comando: `/ps-discovery`.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/ps-begin-intention` nuevamente.
