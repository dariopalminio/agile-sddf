---
alwaysApply: false
---
**Título**: README.md builder
**Versión**: 1.0
**Estado**: Doing
**Fecha**: 2026-04-25
**FINVEST Score:** —
**FINVEST Decisión:** —
---

# Historia de Usuario

## 📖 Historia: README.md builder

**Como** desarrollador o tech lead que usa SDDF para especificar un proyecto
**Quiero** ejecutar el skill `readme-builder` para generar un README.md completo y actualizado
**Para** tener documentación pública del proyecto lista para publicar sin redactarla manualmente desde cero

## ✅ Criterios de aceptación

### Escenario principal – Generación de README desde artefactos existentes
```gherkin
Dado que el proyecto tiene al menos un artefacto de especificación disponible (project-intent.md, requirement-spec.md o project-plan.md)
  Y el directorio raíz del proyecto no tiene un README.md previo
Cuando el usuario ejecuta el skill `readme-builder`
Entonces el skill genera un archivo README.md en la raíz del proyecto
  Y el contenido incluye secciones derivadas de los artefactos disponibles (visión, descripción, instalación, uso)
  Y el formato sigue el template específico de README del skill
```

### Escenario alternativo / error – README.md ya existe
```gherkin
Dado que ya existe un README.md en la raíz del proyecto
Cuando el usuario ejecuta el skill `readme-builder`
Entonces el skill informa que existe un README.md previo y muestra las opciones disponibles
  Pero no sobreescribe el archivo sin confirmación explícita del usuario
```

### Escenario alternativo / error – No hay artefactos de especificación disponibles
```gherkin
Dado que el proyecto no tiene ningún artefacto de especificación (project-intent.md, requirement-spec.md, project-plan.md)
Cuando el usuario ejecuta el skill `readme-builder`
Entonces el skill muestra el mensaje "No se encontraron artefactos de especificación para generar el README"
  Y sugiere ejecutar primero `/project-discovery` o `/project-pm` para crear los artefactos base
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: release-09-docs-and-wiki-builders.md
Feature origen: FEAT-042 — README.md builder
Dependencias declaradas: FEAT-001, FEAT-003, FEAT-004
El skill debe analizar el proyecto actual si no encuentra artefactos en rutas esperadas.
