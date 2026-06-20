---
type: story
id: FEAT-099
slug: feat-099-generador-de-slugs
status: PLANNING
substatus: DONE
parent: EPIC-10-utilidades-core
created: 2026-05-01
updated: 2026-05-01
---

# FEAT-099: Generador de Slugs

## Historia de Usuario

**Como** desarrollador que usa el framework SDDF,
**quiero** una función utilitaria que convierta un título en un slug válido,
**para** generar identificadores URL-seguros de forma consistente en todo el proyecto.

---

## Criterios de Aceptación

### AC-1: Conversión básica de título a slug

**Dado** un título en texto plano,
**cuando** se invoca `toSlug(title)`,
**entonces** el resultado es el título en minúsculas con espacios reemplazados por guiones.

**Ejemplo:**
- Input: `"Mi Primer Proyecto"`
- Output: `"mi-primer-proyecto"`

### AC-2: Eliminación de caracteres especiales

**Dado** un título con caracteres no alfanuméricos (excepto espacios),
**cuando** se invoca `toSlug(title)`,
**entonces** los caracteres especiales son eliminados del resultado.

**Ejemplo:**
- Input: `"Título con: Acentos & Símbolos!"`
- Output: `"titulo-con-acentos-simbolos"`

### AC-3: Manejo de espacios múltiples y guiones

**Dado** un título con múltiples espacios consecutivos o guiones al inicio/fin,
**cuando** se invoca `toSlug(title)`,
**entonces** el resultado no tiene guiones duplicados ni guiones al inicio o fin.

**Ejemplo:**
- Input: `"  Espacios   Múltiples  "`
- Output: `"espacios-multiples"`

### AC-4: Manejo de entrada vacía

**Dado** una cadena vacía o solo espacios,
**cuando** se invoca `toSlug(title)`,
**entonces** el resultado es una cadena vacía `""`.

---

## Criterios No Funcionales

- La función debe ser pura (sin efectos secundarios)
- Tiempo de ejecución < 1ms para títulos de hasta 500 caracteres
