---
type: story
id: STORY-037
kind: feat
slug: STORY-037-generar-baseline-openspec-inversa
title: "Generar lï¿½nea base de OpenSpec mediante ingenierï¿½a inversa"
date: 2026-04-23
status: CANCELED
substatus: DONE
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

## ?? Historia: Generar lï¿½nea base de OpenSpec mediante ingenierï¿½a inversa

**Como** tech lead que incorpora OpenSpec a un proyecto con cï¿½digo ya implementado
**Quiero** ejecutar el skill `/openspec-generate-baseline` para que analice el cï¿½digo fuente y genere y archive automï¿½ticamente los artefactos de especificaciï¿½n como baseline
**Para** obtener una lï¿½nea base de especificaciones vivas sin documentar manualmente lo que el cï¿½digo ya hace, dejando el proyecto especificado desde el primer dï¿½a de adoptar OpenSpec

## ? Criterios de aceptaciï¿½n

### Escenario principal ï¿½ Generaciï¿½n y archivado exitoso con src/ presente
```gherkin
Dado que el proyecto tiene un directorio "src/" en la raï¿½z
  Y existe "openspec/config.yaml" en el proyecto
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill analiza "src/", "README.md" y "AGENTS.md" (si existe) mediante ingenierï¿½a inversa
  Y genera los artefactos "proposal.md", "design.md", "specs/" y "tasks.md" en "openspec/changes/baseline/"
  Y archiva el change directamente en "openspec/changes/archive/YYYY-MM-DD-baseline/" sin ejecutar apply
  Y confirma el resultado mostrando la ruta del change archivado y los specs generados en "openspec/specs/"
```

### Escenario alternativo / error ï¿½ Directorio src/ no existe
```gherkin
Dado que el proyecto no tiene un directorio "src/" en la raï¿½z
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill lista todos los directorios disponibles en la raï¿½z del proyecto
  Y solicita al usuario que indique cuï¿½l contiene el cï¿½digo fuente antes de continuar
  Pero no genera ningï¿½n artefacto hasta recibir la confirmaciï¿½n del directorio
```

### Escenario alternativo / error ï¿½ Change baseline ya existe
```gherkin
Dado que ya existe "openspec/changes/baseline/" en el proyecto
Cuando ejecuto el skill "/openspec-generate-baseline"
Entonces el skill detecta el conflicto y pregunta al usuario con dos opciones:
  Y opciï¿½n 1: sobreescribir el change "baseline" existente
  Y opciï¿½n 2: crear uno nuevo con sufijo de fecha (ej. "baseline-2026-04-23")
  Pero no procede hasta que el usuario elija una opciï¿½n
```

### Requerimiento
El flujo del skill es siempre `propose ? archive`, sin pasar por `apply`. Las tareas generadas en `tasks.md` del change baseline no representan trabajo pendiente: el cï¿½digo ya existe. Cuando `/opsx:archive` solicite confirmaciï¿½n por tareas incompletas, el skill debe confirmar el archivado de todas formas.

## ?? Criterios no funcionales

* El skill no modifica ni genera cï¿½digo fuente ï¿½ es solo documentaciï¿½n especificada
* Los artefactos generados son una aproximaciï¿½n inicial; deben revisarse manualmente para completar lo no inferible del cï¿½digo (intenciï¿½n de negocio, decisiones de diseï¿½o implï¿½citas)

## ?? Notas / contexto adicional

El skill soporta solo `src/` como directorio fuente predeterminado en esta versiï¿½n; si no existe, pide al usuario que lo indique. La generaciï¿½n automï¿½tica de `openspec/config.yaml` desde cero queda fuera de scope (debe existir previamente). El change archivado sirve como punto de referencia histï¿½rico: "asï¿½ funcionaba el sistema el dï¿½a que adoptamos OpenSpec".

Nota de cancelaciÃ³n: esta historia se cancelÃ³ en este repositorio porque se implementa en otro repositorio externo: agile-sddf-extension