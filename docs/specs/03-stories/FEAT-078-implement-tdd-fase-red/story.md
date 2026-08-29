---
alwaysApply: false
type: story
id: FEAT-078
slug: FEAT-078-implement-tdd-fase-red
title: "story-implement — Fase RED: validar configuración y generar pruebas"
status: VERIFY
substatus: TODO
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-081
  - FEAT-082
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** APROBADA
---
[[EPIC-14-fabrica-de-skills]]

# 📖 Historia: story-implement — Fase RED: validar configuración y generar pruebas

**Como** practitioner de SDDF que tiene story.md, design.md y testcases.md listos para implementar,  
**Quiero** que story-implement valide los skills declarados en sddf-config.yaml y ejecute la Fase RED invocando cada skill de generación de pruebas en el orden configurado, confirmando que todos los tests quedan en estado rojo,  
**Para** tener todos los archivos de prueba generados en el código productivo antes de implementar, con la certeza de que las pruebas fallan correctamente y guiarán el desarrollo en la Fase GREEN.

## ✅ Criterios de aceptación

### Escenario principal – Fase RED exitosa: configuración válida, tests generados y confirmados en rojo
```gherkin
Dado que existen story.md, design.md y testcases.md en el directorio de la historia
  Y sddf-config.yaml declara al menos un tipo de prueba activo con skill de generación asignado
  Y todos los skills declarados existen en .claude/skills/
Cuando el practitioner invoca story-implement con el ID de la historia
Entonces el skill valida sddf-config.yaml y confirma que los skills declarados existen
  Y ejecuta cada skill de generación de pruebas en el orden configurado
  Y cada skill genera los archivos de prueba en la ruta del código productivo
  Y ejecuta los tests confirmando que están en estado rojo (fallan)
```

### Escenario alternativo – Skill declarado no encontrado detiene la ejecución antes de generar pruebas
```gherkin
Dado que sddf-config.yaml declara un skill de generación de pruebas cuyo directorio no existe en .claude/skills/
Cuando el practitioner invoca story-implement
Entonces el skill emite ❌ "Skill '<nombre>' declarado en sddf-config.yaml no encontrado en .claude/skills/"
  Y detiene la ejecución sin generar ningún archivo de prueba
  Y sugiere verificar el nombre del skill en sddf-config.yaml o instalarlo
```

### Escenario alternativo – testcases.md ausente: continúa con story.md y design.md como fuentes
```gherkin
Dado que existen story.md y design.md pero testcases.md no existe en el directorio de la historia
Cuando el practitioner invoca story-implement
Entonces el skill emite ⚠️ "testcases.md no encontrado — generando pruebas desde story.md y design.md"
  Y continúa la Fase RED usando story.md y design.md como fuentes de especificación de pruebas
  Y no bloquea la ejecución por la ausencia de testcases.md
```

### Requerimiento: configurabilidad agnóstica al stack en sddf-config.yaml

El skill determina qué skills de generación de pruebas invocar leyendo `docs/policies/sddf-config.yaml`. Agregar un nuevo tipo de prueba o skill de generación no requiere modificar story-implement: solo se actualiza sddf-config.yaml. Si un tipo activo no tiene skill declarado, emitir `[WARN] Sin skill declarado para tipo '<tipo>' — omitiendo ese tipo` y continuar.

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: skill-preflight como Paso 0

Invocar `skill-preflight` antes de cualquier operación. Si retorna `✗ Entorno inválido`, detener inmediatamente.

## ⚙️ Criterios no funcionales

* **Agnósticidad de stack:** el skill no hardcodea nombres de skills de testing; todos se resuelven dinámicamente desde sddf-config.yaml
* **Fail-fast:** si un skill de generación falla, detener la Fase RED inmediatamente sin invocar los siguientes tipos

## 📎 Notas / contexto adicional

- **Posición en el pipeline:** story-plan → story-testcases → **story-implement (Fase RED)** → story-implement (GREEN+REFACTOR, FEAT-081)
- **Historias hermanas:** FEAT-081 (Fases GREEN y REFACTOR), FEAT-082 (modos de ejecución)
- **Output de esta historia:** archivos de prueba generados en el código productivo + confirmación de estado rojo. El estado de story.md no se modifica en esta fase.
- **Configuración esperada en sddf-config.yaml:** sección `IMPLEMENT.test_generators` con lista de entradas `{type, skill, required}`.
