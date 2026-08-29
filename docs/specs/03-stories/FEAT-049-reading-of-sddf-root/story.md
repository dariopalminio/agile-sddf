---
alwaysApply: false
type: story
id: FEAT-049
slug: FEAT-049-reading-of-sddf-root
title: "Lectura de SDDF_ROOT como ruta base de artefactos en skills SDDF"
date: 2026-05-01
status: COMPLETED
substatus: READY
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
---
**FINVEST Score:** [pendiente]
**FINVEST Decisión:** [pendiente]
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]

# 📖 Historia: Lectura de SDDF_ROOT como ruta base de artefactos en skills SDDF

**Como** desarrollador o equipo que usa el framework SDDF en un proyecto con estructura de directorios personalizada
**Quiero** poder definir la variable de entorno `SDDF_ROOT` para indicar el directorio raíz de artefactos
**Para** adaptar el framework a distintas estructuras de proyecto sin modificar ningún archivo del framework

## ✅ Criterios de aceptación

### Escenario principal – SDDF_ROOT definida y ruta existente

```gherkin
Dado que el desarrollador tiene definida la variable de entorno SDDF_ROOT="/custom/specs"
  Y la ruta "/custom/specs" existe en el sistema de archivos
Cuando ejecuta cualquier skill SDDF que accede a artefactos (ej. /story-creation, /project-begin)
Entonces el skill usa "/custom/specs" como directorio raíz para leer y escribir artefactos
  Y no accede a la ruta "docs/" por defecto
```

### Escenario alternativo / error – SDDF_ROOT no definida (fallback a docs)

```gherkin
Dado que el desarrollador no tiene definida la variable de entorno SDDF_ROOT
Cuando ejecuta cualquier skill SDDF que accede a artefactos
Entonces el skill usa "docs" como directorio raíz por defecto
  Y el comportamiento es idéntico al existente antes de este cambio
```

### Escenario alternativo / error – SDDF_ROOT apunta a ruta inexistente

```gherkin
Dado que el desarrollador tiene definida la variable de entorno SDDF_ROOT="/ruta/que/no/existe"
  Y la ruta "/ruta/que/no/existe" no existe en el sistema de archivos
Cuando ejecuta cualquier skill SDDF que accede a artefactos
Entonces el skill muestra "⚠️ La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs"
  Y el skill continúa usando "docs" como directorio raíz
```

### Escenario con datos (Scenario Outline) – Resolución de SPECS_BASE según estado de SDDF_ROOT

```gherkin
Escenario: Resolución de SPECS_BASE según estado de SDDF_ROOT
  Dado que la variable SDDF_ROOT tiene el valor "<valor_sddf_root>"
  Y la ruta existe en el sistema: "<ruta_existe>"
  Cuando el skill resuelve SPECS_BASE
  Entonces SPECS_BASE toma el valor "<specs_base_resultante>"
  Y el skill muestra advertencia: "<muestra_advertencia>"
Ejemplos:
  | valor_sddf_root    | ruta_existe | specs_base_resultante | muestra_advertencia |
  | /custom/specs      | sí          | /custom/specs         | no                  |
  | (no definida)      | N/A         | docs                  | no                  |
  | /ruta/inexistente  | no          | docs                  | sí                  |
```

### Requirement: Convención estándar de resolución de SPECS_BASE

Cada skill afectado debe resolver `SPECS_BASE` siguiendo exactamente este orden de precedencia al inicio de su ejecución:

1. Si `SDDF_ROOT` está definida y la ruta existe → `SPECS_BASE = $SDDF_ROOT`
2. Si `SDDF_ROOT` está definida pero la ruta no existe → advertencia + `SPECS_BASE = docs`
3. Si `SDDF_ROOT` no está definida → `SPECS_BASE = docs`

Skills afectados: `project-begin`, `project-discovery`, `project-planning`, `story-creation`, `story-split`, `story-evaluation`, `release-generate-all-stories`, `release-generate-stories`, `releases-from-project-plan`, `project-story-mapping`, `reverse-engineering`, `header-aggregation`.

## ⚙️ Criterios no funcionales

* Retrocompatibilidad: sin `SDDF_ROOT` definida, el comportamiento es **idéntico** al actual — sin breaking changes ni cambios en contratos de skills.
* Portabilidad: la convención debe funcionar en entornos Unix y Windows (paths absolutos o relativos válidos).
* Documentación: el `README.md` debe incluir una sección dedicada con propósito, valores válidos y cómo definir `SDDF_ROOT`.

## 📎 Notas / contexto adicional

El cambio es puramente aditivo: se introduce la lectura de `SDDF_ROOT` en los `SKILL.md` afectados sin alterar lógica de negocio ni contratos existentes.

Fuera de scope: creación automática de la ruta si no existe, soporte para múltiples variables alternativas, integración con archivos `.env`.
