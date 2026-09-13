---
type: story
id: STORY-037
kind: feat
slug: STORY-037-generar-baseline-openspec-inversa
title: "Generar l�nea base de OpenSpec mediante ingenier�a inversa"
date: 2026-04-23
status: CANCELED
substatus: DONE
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

## ?? Historia: Generar l�nea base de OpenSpec mediante ingenier�a inversa

**Como** tech lead que incorpora OpenSpec a un proyecto con c�digo ya implementado
**Quiero** ejecutar el skill `/openspec-generate-baseline` para que analice el c�digo fuente y genere y archive autom�ticamente los artefactos de especificaci�n como baseline
**Para** obtener una l�nea base de especificaciones vivas sin documentar manualmente lo que el c�digo ya hace, dejando el proyecto especificado desde el primer d�a de adoptar OpenSpec

## ? Criterios de aceptaci�n

### Escenario principal � Generaci�n y archivado exitoso con src/ presente
```gherkin
Dado que el proyecto tiene un directorio "src/" en la ra�z
  Y existe "openspec/config.yaml" en el proyecto
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill analiza "src/", "README.md" y "AGENTS.md" (si existe) mediante ingenier�a inversa
  Y genera los artefactos "proposal.md", "design.md", "specs/" y "tasks.md" en "openspec/changes/baseline/"
  Y archiva el change directamente en "openspec/changes/archive/YYYY-MM-DD-baseline/" sin ejecutar apply
  Y confirma el resultado mostrando la ruta del change archivado y los specs generados en "openspec/specs/"
```

### Escenario alternativo / error � Directorio src/ no existe
```gherkin
Dado que el proyecto no tiene un directorio "src/" en la ra�z
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill lista todos los directorios disponibles en la ra�z del proyecto
  Y solicita al usuario que indique cu�l contiene el c�digo fuente antes de continuar
  Pero no genera ning�n artefacto hasta recibir la confirmaci�n del directorio
```

### Escenario alternativo / error � Change baseline ya existe
```gherkin
Dado que ya existe "openspec/changes/baseline/" en el proyecto
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill detecta el conflicto y pregunta al usuario con dos opciones:
  Y opci�n 1: sobreescribir el change "baseline" existente
  Y opci�n 2: crear uno nuevo con sufijo de fecha (ej. "baseline-2026-04-23")
  Pero no procede hasta que el usuario elija una opci�n
```

### Requerimiento
El flujo del skill es siempre `propose ? archive`, sin pasar por `apply`. Las tareas generadas en `tasks.md` del change baseline no representan trabajo pendiente: el c�digo ya existe. Cuando `/opsx:archive` solicite confirmaci�n por tareas incompletas, el skill debe confirmar el archivado de todas formas.

## ?? Criterios no funcionales

* El skill no modifica ni genera c�digo fuente � es solo documentaci�n especificada
* Los artefactos generados son una aproximaci�n inicial; deben revisarse manualmente para completar lo no inferible del c�digo (intenci�n de negocio, decisiones de dise�o impl�citas)

## ?? Notas / contexto adicional

El skill soporta solo `src/` como directorio fuente predeterminado en esta versi�n; si no existe, pide al usuario que lo indique. La generaci�n autom�tica de `openspec/config.yaml` desde cero queda fuera de scope (debe existir previamente). El change archivado sirve como punto de referencia hist�rico: "as� funcionaba el sistema el d�a que adoptamos OpenSpec".

Nota de cancelación: esta historia se canceló en este repositorio porque se implementa en otro repositorio externo: agile-sddf-extension