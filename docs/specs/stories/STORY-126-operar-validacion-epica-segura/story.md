---
alwaysApply: false
type: story
id: STORY-126
kind: feat
slug: STORY-126-operar-validacion-epica-segura
title: "Operar la validación de épicas de manera segura"
status: SPECIFY
substatus: DONE
parent: EPIC-23-skill-epic-validate
created: 2026-10-12
updated: 2026-10-12
related:
  - EPIC-23-skill-epic-validate
  - STORY-124
  - STORY-125
  - STORY-127
  - STORY-128
---
[[EPIC-23-skill-epic-validate]]

# 📖 Historia: Operar la validación de épicas de manera segura

**Como** mantenedor de Agile-SDDF que revisa la preparación de una épica  
**Quiero** ejecutar la validación en modos manual, automático y de previsualización sin efectos inesperados  
**Para** elegir una operación reproducible que se adapte a una revisión humana o a una automatización

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Previsualización sin escrituras
```gherkin
Dado una épica válida para validar
Cuando el mantenedor solicita una previsualización
Entonces recibe el reporte completo y no se crea ni modifica ningún reporte persistente
```

### AC-2 — Escenario principal — Ejecución automática
```gherkin
Dado una épica existente
Cuando una automatización solicita la validación sin interacción
Entonces se guarda un único reporte y el resultado de la ejecución coincide con su veredicto
```

### AC-3 — Escenario de regresión — Repetición sin efectos colaterales
```gherkin
Dado una épica sin cambios desde una validación anterior
Cuando se vuelve a validar
Entonces el reporte conserva el mismo contenido lógico y no se modifican fuentes ni artefactos ajenos al reporte
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Idempotencia:** dos ejecuciones equivalentes producen el mismo veredicto y no duplican hallazgos.
- **CNF-2 — Escritura mínima:** fuera de previsualización, el único artefacto creado o actualizado es el reporte de validación de la épica.

## 🚫 Fuera de alcance

- Incorporar comprobaciones estructurales u operativas adicionales.
- Decidir cuándo una épica cambia de estado.
- Publicar o documentar el skill.

## 📎 Notas / contexto adicional

- Los modos concretos de invocación y sus códigos de salida se decidirán durante el diseño, manteniendo la semántica verificable de estos escenarios.
