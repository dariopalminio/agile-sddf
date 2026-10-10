---
type: story
id: STORY-028
kind: feat
slug: STORY-028-generar-releases
title: "Generar releases desde project-plan"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

# Historia de Usuario

## ?? Historia: Generar releases desde project-plan

**Como** desarrollador que ha completado la planificaciï¿½n de un proyecto SDDF con releases definidos en `project-plan.md`
**Quiero** ejecutar el skill `releases-from-project-plan` para generar automï¿½ticamente un archivo `release-[ID]-[Nombre].md` por cada release planificado
**Para** obtener especificaciones de release estructuradas segï¿½n el template `release-spec-template.md` listas para completar, sin crearlas manualmente desde cero

## ? Criterios de aceptaciï¿½n

### Escenario principal ï¿½ Generaciï¿½n exitosa de archivos de release
```gherkin
Dado que existe "docs/specs/projects/project-plan.md" con al menos una secciï¿½n "### Release NN ï¿½ Nombre" bajo "## Propuesta de Releases"
  Y el directorio "docs/specs/releases/" existe o puede ser creado
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill genera un archivo "release-[ID]-[Nombre-kebab].md" por cada release encontrado
  Y cada archivo sigue la estructura de "docs/specs/templates/release-spec-template.md"
  Y los archivos se guardan en "docs/specs/releases/"
```

### Escenario alternativo / error ï¿½ project-plan.md no existe
```gherkin
Dado que el archivo "docs/specs/projects/project-plan.md" no existe
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill muestra "No se encontrï¿½ docspecs/projects/t/project-plan.md"
  Pero no genera ningï¿½n archivo de release
```

### Escenario alternativo / error ï¿½ Plan sin releases planificados
```gherkin
Dado que "docs/specs/projects/project-plan.md" existe
  Y no contiene ninguna secciï¿½n "### Release" bajo "## Propuesta de Releases"
Cuando el desarrollador ejecuta el skill "releases-from-project-plan"
Entonces el skill muestra "No se encontraron releases planificados en project-plan.md"
  Pero no genera ningï¿½n archivo de release
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automï¿½ticamente desde el release: release-06-release-and-story-generator.md
Feature origen: STORY-028 ï¿½ Generar releases
