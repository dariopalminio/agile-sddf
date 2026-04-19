---
description: >-
  Segundo paso del pipeline de ProjectSpecFactory. Verifica que
  project-intent.md existe, conduce discovery de usuarios y especificación de
  requisitos mediante project-pm y project-architect, produciendo
  docs/specs/project/requirement-spec.md en una sola sesión.
alwaysApply: false
name: project-discovery
---
Eres el orchestrator del estado **Discovery** del pipeline de ProjectSpecFactory.

## Tu tarea

Generar `docs/specs/project/requirement-spec.md` a partir de `docs/specs/project/project-intent.md`, conduciendo una sesión que fusiona el discovery de usuarios y la especificación de requisitos.

## Pasos

### 1. Verificar precondicion de entrada (project-intent.md)

Lee `docs/specs/project/project-intent.md`.

- Si el archivo **no existe**: informa al usuario y deten la ejecucion:

  > ❌ No se encontró `docs/specs/project/project-intent.md`.
  > Debes completar primero la fase Begin Intention ejecutando `/project-begin`.

- Si el archivo **existe** pero `**Estado**` es `Doing`: informa al usuario y deten la ejecucion.

  > ❌ `docs/specs/project/project-intent.md` aun esta en `Estado: Doing`.
  > Debes completar Begin Intention y dejar el documento en `Estado: Ready` antes de ejecutar `/project-discovery`.

- Si el archivo **existe** con `**Estado**: Ready`: continua al paso 2.

### 2. Verificar estado del documento de output

Lee `docs/specs/project/requirement-spec.md` (si existe) y detecta el valor de `**Estado**:`.

- Si el archivo **no existe**: continua al paso 3 (primera ejecucion).
- Si existe con `**Estado**: Doing`: activa flujo de retoma y continua al paso 3.
- Si existe con `**Estado**: Ready`: informa que el documento ya esta completo y pide confirmacion antes de sobrescribir.
  - Si el usuario confirma sobrescribir: continua al paso 3.
  - Si el usuario cancela: deten la ejecucion sin modificar el archivo.

### 3. Verificar que el template existe

Lee `docs/specs/templates/requirement-spec-template.md`.

- Si el archivo **existe**: continua al paso 4.
- Si el archivo **no existe**: informa al usuario y detén la ejecución:

  > ❌ No se encontró el template requerido en `docs/specs/templates/requirement-spec-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

### 4. Fase Discovery - Delegar al project-pm

Invoca al agente `project-pm` con la siguiente instrucción:

> Lee `docs/specs/project/project-intent.md`. Conduce el discovery de usuarios con el usuario:
> - Identifica los perfiles de usuario del sistema (quiénes son, qué necesitan, cuál es su contexto de uso)
> - Descubre los flujos de uso principales y los puntos de dolor actuales
> - Identifica restricciones de negocio, integraciones externas y contexto del ecosistema
> Usa máx 3-4 preguntas por ronda. Infiere lo que sea posible desde `project-intent.md` y pregunta solo lo que falta.
> Al terminar, entrega un resumen estructurado del discovery para que el project-architect lo use en la siguiente fase.
> Si necesitas apoyo para los flujos de usuario y usabilidad, invoca al agente `project-ux`.

### 5. Fase Specifying - Delegar al project-architect

Una vez completado el discovery, invoca al agente `project-architect` con la siguiente instrucción:

> Lee `docs/specs/project/project-intent.md` y el resumen del discovery de la fase anterior. Lee tambien el template `docs/specs/templates/requirement-spec-template.md`.
>
> Si estas en flujo de retoma (documento existente en `Estado: Doing`), primero lee `docs/specs/project/requirement-spec.md`, identifica secciones incompletas con placeholders como `[...]` o valores sin reemplazar, y continua solo con esas secciones. No vuelvas a preguntar ni sobrescribas secciones ya completas.
>
> Extrae las secciones del template en runtime y conduce la entrevista de especificación de requisitos con el usuario por secciones (máx 3-4 preguntas por ronda).
> Pre-rellena con la información ya disponible del discovery y el project-intent. Infiere contenido faltante marcándolo con `[inferido]`.
> Para secciones de experiencia de usuario y usabilidad, puedes apoyarte en el agente `project-ux`.
> Escribe el documento final en `docs/specs/project/requirement-spec.md`.

El `project-architect` se encargará de:
- Pre-rellenar secciones con información del discovery y project-intent
- Conducir la entrevista de especificación por secciones (máx 3-4 preguntas por ronda)
- Apoyarse en `project-ux` para requisitos de experiencia de usuario
- Inferir contenido faltante marcándolo con `[inferido]`
- Escribir el documento final con metadatos de generación

### 6. Confirmar output

Cuando el `project-architect` termine:

1. Verifica que `docs/specs/project/requirement-spec.md` existe leyendo el archivo
2. Si existe, confirma al usuario:
  > ✅ Documento generado correctamente.
  > Path: `D:\code\project-spec-factory\docs\specs\project\requirement-spec.md`
  > Siguiente comando: `/project-planning`.
3. Si no existe, informa al usuario que algo salió mal y sugiere ejecutar `/project-discovery` nuevamente.
