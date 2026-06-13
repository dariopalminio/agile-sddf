---
name: nombre-del-skill
description: >-
  Qué hace este skill y cuándo usarlo. Incluir frases clave que disparan el skill.
  Invocar también cuando el usuario mencione "<alias>", "<alias>" o equivalentes.
triggers:
  - "<frase clave que dispara el skill>"
  - "<alias o variante>"
---

# Skill: `/<nombre-del-skill>`

**Cuándo usar este skill:** <!-- Obligatorio -->
[Listado de situaciones o frases que deberían disparar el uso de este skill.]

## Objetivo

[Descripción concisa de qué debe hacer y por qué. Una o dos oraciones.] <!-- Obligatorio -->

**Qué hace este skill:**  <!-- Optativo -->
[Listado de funcionalidades o acciones específicas que realiza el skill.]

**Qué NO hace este skill:** <!-- Optativo -->
[Listado de acciones o comportamientos que el skill no realiza.]

## Entrada

[Archivos, variables de entorno o contexto necesario para ejecutar el skill.]

## Parámetros

- `--id <id>`: identificador del workitem (opcional)
- `--auto`: modo automático sin interacción

## Precondiciones
- [Condición 1: por ejemplo, "El usuario debe tener permisos de escritura en el repositorio."]
- [Condición 2: por ejemplo, "El documento de entrada debe existir y estar en formato Markdown."] 

## Dependencias

- Skills: [`skill-preflight`] (opcional — solo si se ejecuta en un entorno SDDF)
- Herramientas: [`git`]

## Modos de ejecución

- **Manual**: `/<nombre-del-skill>` — pide confirmación al usuario antes de escribir.
- **Automático**: invocado por otro skill — no pide confirmación.

## Restricciones / Reglas

- Regla 1: [descripción de restricción]
- Regla 2: [descripción de restricción]

## Flujo de ejecución

### 0. Preflight (opcional — solo en entornos SDDF)
- Si el entorno usa SDDF: invocar `skill-preflight`. Detener si reporta ERROR.
- En entornos no-SDDF: omitir este paso.

### 1. Cargar contexto
- Leer los artefactos necesarios (story.md, design.md, etc.).

### 2. Proceso principal
- [Subpasos específicos de la lógica del skill.]

### 3. Manejo de errores
- Si algo falla, notificar al usuario con mensaje claro y salir.

### 4. Fin de proceso
- Actualizar frontmatter del documento de salida.
- Generar informe si aplica.

## Salida

- [Archivo o artefacto generado o modificado.]
- [Nuevo estado del workitem si aplica.]
