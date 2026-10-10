---
alwaysApply: false
type: story
id: STORY-078
kind: feat
slug: STORY-078-implement-tdd-fase-red
title: "story-implement â€” Fase RED: validar configuraciÃ³n y generar pruebas"
status: VERIFY
substatus: TODO
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - STORY-081
  - STORY-082
---
[[fabrica-de-skills]]

# ðŸ“– Historia: story-implement â€” Fase RED: validar configuraciÃ³n y generar pruebas

**Como** practitioner de SDDF que tiene story.md, design.md y testcases.md listos para implementar,  
**Quiero** que story-implement valide los skills declarados en sddf-config.yaml y ejecute la Fase RED invocando cada skill de generaciÃ³n de pruebas en el orden configurado, confirmando que todos los tests quedan en estado rojo,  
**Para** tener todos los archivos de prueba generados en el cÃ³digo productivo antes de implementar, con la certeza de que las pruebas fallan correctamente y guiarÃ¡n el desarrollo en la Fase GREEN.

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Fase RED exitosa: configuraciÃ³n vÃ¡lida, tests generados y confirmados en rojo
```gherkin
Dado que existen story.md, design.md y testcases.md en el directorio de la historia
  Y sddf-config.yaml declara al menos un tipo de prueba activo con skill de generaciÃ³n asignado
  Y todos los skills declarados existen en .claude/skills/
Cuando el practitioner invoca story-implement con el ID de la historia
Entonces el skill valida sddf-config.yaml y confirma que los skills declarados existen
  Y ejecuta cada skill de generaciÃ³n de pruebas en el orden configurado
  Y cada skill genera los archivos de prueba en la ruta del cÃ³digo productivo
  Y ejecuta los tests confirmando que estÃ¡n en estado rojo (fallan)
```

### Escenario alternativo â€“ Skill declarado no encontrado detiene la ejecuciÃ³n antes de generar pruebas
```gherkin
Dado que sddf-config.yaml declara un skill de generaciÃ³n de pruebas cuyo directorio no existe en .claude/skills/
Cuando el practitioner invoca story-implement
Entonces el skill emite âŒ "Skill '<nombre>' declarado en sddf-config.yaml no encontrado en .claude/skills/"
  Y detiene la ejecuciÃ³n sin generar ningÃºn archivo de prueba
  Y sugiere verificar el nombre del skill en sddf-config.yaml o instalarlo
```

### Escenario alternativo â€“ testcases.md ausente: continÃºa con story.md y design.md como fuentes
```gherkin
Dado que existen story.md y design.md pero testcases.md no existe en el directorio de la historia
Cuando el practitioner invoca story-implement
Entonces el skill emite âš ï¸ "testcases.md no encontrado â€” generando pruebas desde story.md y design.md"
  Y continÃºa la Fase RED usando story.md y design.md como fuentes de especificaciÃ³n de pruebas
  Y no bloquea la ejecuciÃ³n por la ausencia de testcases.md
```

### Requerimiento: configurabilidad agnÃ³stica al stack en sddf-config.yaml

El skill determina quÃ© skills de generaciÃ³n de pruebas invocar leyendo `docs/policies/sddf-config.yaml`. Agregar un nuevo tipo de prueba o skill de generaciÃ³n no requiere modificar story-implement: solo se actualiza sddf-config.yaml. Si un tipo activo no tiene skill declarado, emitir `[WARN] Sin skill declarado para tipo '<tipo>' â€” omitiendo ese tipo` y continuar.

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: skill-preflight como Paso 0

Invocar `skill-preflight` antes de cualquier operaciÃ³n. Si retorna `âœ— Entorno invÃ¡lido`, detener inmediatamente.

## âš™ï¸ Criterios no funcionales

* **AgnÃ³sticidad de stack:** el skill no hardcodea nombres de skills de testing; todos se resuelven dinÃ¡micamente desde sddf-config.yaml
* **Fail-fast:** si un skill de generaciÃ³n falla, detener la Fase RED inmediatamente sin invocar los siguientes tipos

## ðŸ“Ž Notas / contexto adicional

- **PosiciÃ³n en el pipeline:** story-plan â†’ story-testcases â†’ **story-implement (Fase RED)** â†’ story-implement (GREEN+REFACTOR, STORY-081)
- **Historias hermanas:** STORY-081 (Fases GREEN y REFACTOR), STORY-082 (modos de ejecuciÃ³n)
- **Output de esta historia:** archivos de prueba generados en el cÃ³digo productivo + confirmaciÃ³n de estado rojo. El estado de story.md no se modifica en esta fase.
- **ConfiguraciÃ³n esperada en sddf-config.yaml:** secciÃ³n `IMPLEMENT.test_generators` con lista de entradas `{type, skill, required}`.
- **Campo FINVEST retirado (STORY-090):** el valor `FINVEST DecisiÃ³n: APROBADA` que figuraba en el cuerpo se retirÃ³ sin `finvest-evaluation-report.md` asociado; era redundante con el `status` del frontmatter (posterior a `SPECIFY/DONE`), por lo que la pÃ©rdida se acepta y queda registrada aquÃ­.
