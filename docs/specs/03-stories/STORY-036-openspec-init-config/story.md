---
type: story
id: STORY-036
kind: feat
slug: STORY-036-openspec-init-config
title: "Inicializar configuraciï¿½n de OpenSpec automï¿½ticamente"
date: 2026-04-23
status: CANCELED
substatus: DONE
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

## ?? Historia: Inicializar configuraciï¿½n de OpenSpec automï¿½ticamente

**Como** developer que usa OpenSpec en un proyecto y necesita configurar el contexto inicial
**Quiero** ejecutar el skill `/openspec-init-config` para que analice la documentaciï¿½n del proyecto y actualice automï¿½ticamente el campo `context:` de `openspec/config.yaml`
**Para** evitar configurar manualmente el contexto y mantener `openspec/config.yaml` alineado con la realidad del proyecto desde el primer uso

## ? Criterios de aceptaciï¿½n

### Escenario principal ï¿½ Carga exitosa del contexto con documentaciï¿½n completa
```gherkin
Dado que el proyecto tiene "README.md" y "CLAUDE.md" en la raï¿½z
  Y existe el archivo "openspec/config.yaml"
Cuando ejecuto el skill "/openspec-init-config"
Entonces el campo "context:" de "openspec/config.yaml" es actualizado con el stack, arquitectura, convenciones y dominio inferidos de la documentaciï¿½n
  Y los campos "schema:" y "rules:" permanecen intactos
  Y se confirma en pantalla el contenido escrito en el campo "context:"
```

### Escenario alternativo / error ï¿½ Archivos opcionales ausentes
```gherkin
Dado que el proyecto tiene "README.md" en la raï¿½z
  Y no existen "AGENTS.md" ni "CLAUDE.md"
Cuando ejecuto el skill "/openspec-init-config"
Entonces el skill usa solo los archivos disponibles para construir el contexto
  Y el campo "context:" es actualizado sin error
```

### Escenario alternativo / error ï¿½ config.yaml no existe
```gherkin
Dado que "openspec/config.yaml" no existe en el proyecto
Cuando ejecuto el skill "/openspec-init-config"
Entonces el skill informa que "openspec/config.yaml" no fue encontrado
  Y sugiere ejecutar "openspec init" antes de continuar
```

### Requerimiento
El campo `context:` debe seguir el formato YAML multiline (`|`) y contener al menos: stack tecnolï¿½gico, arquitectura del proyecto, convenciones de naming/commits y dominio del negocio.

## ?? Criterios no funcionales

* El skill NO debe modificar el campo `schema:` ni el campo `rules:` de `openspec/config.yaml`
* El contexto generado debe ser legible por el modelo en futuras ejecuciones de `openspec instructions`

## ?? Notas / contexto adicional

La historia cubre ï¿½nicamente el skill `/openspec-init-config` en `.claude/skills/openspec-init-config/SKILL.md`.
La generaciï¿½n automï¿½tica de `openspec/config.yaml` desde cero (si no existe) queda fuera de scope de esta historia.

Nota de cancelaciÃ³n: esta historia se cancelÃ³ en este repositorio porque se implementa en otro repositorio externo: agile-sddf-extension