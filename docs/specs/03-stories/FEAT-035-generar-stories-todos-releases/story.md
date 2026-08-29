---
type: story
id: FEAT-035
slug: FEAT-035-generar-stories-todos-releases
title: "Generar stories de todos los releases en batch"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

# Historia de Usuario

## ?? Historia: Generar stories de todos los releases en batch

**Como** desarrollador que tiene m�ltiples archivos de release listos e`$SPECS_BASE/specs/s/releases/`
**Quiero** ejecutar el skill `release-generate-all-stories` para generar autom�ticamente las historias de todos los releases del proyecto en un solo paso
**Para** poblar `$SPECS_BASE/specs/stories/` de forma completa sin tener que invocar `release-generate-stories` individualmente por cada archivo de release

## ? Criterios de aceptaci�n

### Escenario principal � Generaci�n exitosa en batch de m�ltiples releases
```gherkin
Dado que existen al menos dos archivos de release en "docs/specs/releases/" con features definidas en su secci�n "## Features"
  Y el directorio "docs/specs/stories/" existe o puede ser creado
Cuando el desarrollador ejecuta el skill "release-generate-all-stories"
Entonces el skill procesa cada archivo de release en orden
  Y genera un archivo "story-[ID]-[nombre-kebab].md" por cada feature encontrada en cada release
  Y al finalizar muestra un resumen con el total de historias creadas, saltadas y releases sin features
```

### Escenario alternativo / error � Sin archivos de release disponibles
```gherkin
Dado que el directorio "docs/specs/releases/" no existe o no contiene ning�n archivo ".md"
Cuando el desarrollador ejecuta el skill "release-generate-all-stories"
Entonces el skill muestra "No se encontraron archivos de release en docs/specs/releases/"
  Pero no genera ning�n archivo de historia
```

### Escenario alternativo � Algunos releases sin features definidas
```gherkin
Dado que existen tres archivos de release en "docs/specs/releases/"
  Y solo dos de ellos contienen entradas en la secci�n "## Features"
Cuando el skill procesa todos los releases
Entonces genera stories para los dos releases con features
  Y para el release sin features muestra "No se encontraron features en <nombre-release>" sin interrumpir el proceso
  Y el resumen final indica cu�ntos releases fueron saltados por falta de features
```

### Requerimiento: Idempotencia guiada en modo batch
El skill SHALL solicitar confirmaci�n global al inicio si detecta que ya existen archivos de historia que ser�an sobreescritos, con opci�n de responder "sobreescribir todos", "saltar todos los existentes" o "decidir uno por uno" � evitando interrupciones por cada archivo durante el procesamiento en batch.

## ?? Criterios no funcionales

* Comportamiento: el skill procesa los releases en el orden en que los lista el sistema de archivos (alfab�tico por nombre)
* Resumen: al finalizar, muestra contadores: releases procesados / historias generadas / historias saltadas / releases sin features

## ?? Notas / contexto adicional

Skill orquestador de `release-generate-stories` (FEAT-029): no reimplementa la l�gica de generaci�n de stories, sino que itera sobre todos los archivos`$SPECS_BASE/specs/ecs/releases/` y delega en el mismo flujo de extracci�n y generaci�n. La validaci�n de calidad FINVEST de las historias generadas queda fuera del scope de esta historia.
