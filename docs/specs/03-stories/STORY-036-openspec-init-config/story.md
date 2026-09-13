---
type: story
id: STORY-036
kind: feat
slug: STORY-036-openspec-init-config
title: "Inicializar configuraci�n de OpenSpec autom�ticamente"
date: 2026-04-23
status: CANCELED
substatus: DONE
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

## ?? Historia: Inicializar configuraci�n de OpenSpec autom�ticamente

**Como** developer que usa OpenSpec en un proyecto y necesita configurar el contexto inicial
**Quiero** ejecutar el skill `/openspec-init-config` para que analice la documentaci�n del proyecto y actualice autom�ticamente el campo `context:` de `openspec/config.yaml`
**Para** evitar configurar manualmente el contexto y mantener `openspec/config.yaml` alineado con la realidad del proyecto desde el primer uso

## ? Criterios de aceptaci�n

### Escenario principal � Carga exitosa del contexto con documentaci�n completa
```gherkin
Dado que el proyecto tiene "README.md" y "CLAUDE.md" en la ra�z
  Y existe el archivo "openspec/config.yaml"
Cuando ejecuto el skill "/openspec-init-config"
Entonces el campo "context:" de "openspec/config.yaml" es actualizado con el stack, arquitectura, convenciones y dominio inferidos de la documentaci�n
  Y los campos "schema:" y "rules:" permanecen intactos
  Y se confirma en pantalla el contenido escrito en el campo "context:"
```

### Escenario alternativo / error � Archivos opcionales ausentes
```gherkin
Dado que el proyecto tiene "README.md" en la ra�z
  Y no existen "AGENTS.md" ni "CLAUDE.md"
Cuando ejecuto el skill "/openspec-init-config"
Entonces el skill usa solo los archivos disponibles para construir el contexto
  Y el campo "context:" es actualizado sin error
```

### Escenario alternativo / error � config.yaml no existe
```gherkin
Dado que "openspec/config.yaml" no existe en el proyecto
Cuando ejecuto el skill "/openspec-init-config"
Entonces el skill informa que "openspec/config.yaml" no fue encontrado
  Y sugiere ejecutar "openspec init" antes de continuar
```

### Requerimiento
El campo `context:` debe seguir el formato YAML multiline (`|`) y contener al menos: stack tecnol�gico, arquitectura del proyecto, convenciones de naming/commits y dominio del negocio.

## ?? Criterios no funcionales

* El skill NO debe modificar el campo `schema:` ni el campo `rules:` de `openspec/config.yaml`
* El contexto generado debe ser legible por el modelo en futuras ejecuciones de `openspec instructions`

## ?? Notas / contexto adicional

La historia cubre �nicamente el skill `/openspec-init-config` en `.claude/skills/openspec-init-config/SKILL.md`.
La generaci�n autom�tica de `openspec/config.yaml` desde cero (si no existe) queda fuera de scope de esta historia.

Nota de cancelación: esta historia se canceló en este repositorio porque se implementa en otro repositorio externo: agile-sddf-extension