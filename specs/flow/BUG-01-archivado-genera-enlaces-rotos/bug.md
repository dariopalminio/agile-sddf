---
type: bug
id: BUG-01
slug: BUG-01-archivado-genera-enlaces-rotos
title: "Archivado genera enlaces rotos"
created: 2026-05-11
updated: 2026-05-11
status: DELIVER
substatus: DONE
parent: null
related:      
  - EPIC-23-completar-flujo-de-epic                        
  - STORY-171-completar-archivar-epica-liberada
  - STORY-172-skill-epic-complete-archivar-epicas-canceladas
---

## Título: Archivado genera enlaces rotos

Skills de archivado (epic-complete y story-complete) no actualizan enlaces en documentación activa

## Resumen (opcional)

Al ejecutar `/epic-complete EPIC-23` y `/story-complete STORY-124`, la épica y la historia se archivan correctamente, pero la documentación activa conserva enlaces a las rutas originales en `specs/flow/...`. La validación de enlaces detecta enlaces rotos en documentación activa. Se espera que ambos skills actualicen las referencias (rutas en links de referencias) a la nueva ubicación de los archivos archivados.

## Ambiente

- **Versión del producto**: 5.1.0
- **Navegador**: No aplica; el problema se reproduce mediante skills/herramientas de CLI.
- **Paquetes y versiones instalados**: Agile SDDF v5.1.0
- **Sistema operativo**: Windows y Ubuntu

## Pasos para reproducir

1. Invocar el skill con una épica por ejemplo en opencode se probó con: “Invoca el skill /epic-complete EPIC-00” o en Claude con “`/epic-complete` para la épica `EPIC-23`”.
2. Invocar el skill para una historia, por ejemplo se probó con `/story-complete` para la historia `STORY-124`.
3. Ejecutar la validación de enlaces de la documentación activa.
4. Revisar el resultado CI de Github Action.
5. Revisar los enlaces rotos reportados en `docs/index.md`.

## Resultado observado

Los skills archivan correctamente la épica y la historia, pero no actualizan los enlaces de la documentación activa. La validación reporta 18 enlaces rotos, incluyendo:

```text
[ERROR] 18 broken active documentation link(s):
- docs/index.md:214: Missing local target: specs/flow/EPIC-23-completar-flujo-de-epic/epic.md
- docs/index.md:241: Missing local target: specs/flow/STORY-124-validar-preparacion-estructural-epica/story.md
```
[dariopalminio/agile-sddf] Repository Quality workflow run
 
Error en Action de Github:
 ```text
Repository Quality: All jobs have failed
 
View workflow run
 
Status	Job	Annotations
Deterministic contracts (ubuntu-latest)	
Repository Quality / Deterministic contracts (ubuntu-latest)
Failed in 29 seconds

annotations for Repository Quality / Deterministic contracts (ubuntu-latest) 2
Deterministic contracts (macos-latest)	
Repository Quality / Deterministic contracts (macos-latest)
Failed in 46 seconds

annotations for Repository Quality / Deterministic contracts (macos-latest) 3
Deterministic contracts (windows-latest)	
Repository Quality / Deterministic contracts (windows-latest)
Failed in 1 minute and 31 seconds
…
[VERIFY] enlaces activos
[ERROR] 1 broken active documentation link(s):
- docs/index.md:160: Missing local target: specs/flow/EPIC-00-estructura-base-y-mecanismo-de-templates/epic.md

[ERROR] enlaces activos: falló con exit 1
Error: Process completed with exit code 1.
```

## Resultado esperado (opcional)

Tanto `/story-complete` como `/epic-complete` deberían actualizar los enlaces en la documentación activa (en docs/index.md si existe u en otro link de referencia) para reflejar el estado archivado de las historias y épicas correspondientes. En particular, las referencias deberían apuntar a la nueva ubicación de los archivos archivados, evitando enlaces rotos en `docs/index.md` y en el resto de la documentación activa.

## Evidencias (opcional)

Salida de la validación de enlaces:

```text
[ERROR] 18 broken active documentation link(s):
- docs/index.md:214: Missing local target: specs/flow/EPIC-23-completar-flujo-de-epic/epic.md
- docs/index.md:241: Missing local target: specs/flow/STORY-124-validar-preparacion-estructural-epica/story.md
```

## Datos de prueba (opcional)

- Épica archivada: `EPIC-23`
- Épica archivada: `EPIC-00`
- Historia archivada: `STORY-124`
- Documento afectado: `docs/index.md`
- Líneas reportadas: `214`, `241`
- Rutas originales referenciadas:
  - `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`
  - `specs/flow/STORY-124-validar-preparacion-estructural-epica/story.md`

## Contexto adicional (opcional)

El problema afecta a ambos skills de archivado. Aunque el archivado de la épica y la historia se completa, la documentación activa queda inconsistente porque mantiene referencias a las rutas anteriores. Sería recomendable que los skills actualicen automáticamente los enlaces afectados o que exista un paso de validación/actualización posterior al archivado.
