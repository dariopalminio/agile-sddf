---
alwaysApply: false
type: story
id: STORY-126
kind: feat
slug: STORY-126-operar-validacion-epica-segura
title: "Operar la validación de épicas de manera segura"
status: SPECIFY
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-12
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-124
  - STORY-125
  - STORY-127
  - STORY-128
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Operar la validación de épicas de manera segura

**Como** Solo Builder y mantenedor de Agile-SDDF que revisa la preparación de una épica  
**Quiero** ejecutar la validación en modos manual, automático y de previsualización sin efectos inesperados  
**Para** revisar una épica sin riesgo de escrituras y usar el mismo veredicto como gate automatizado y reproducible

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Resultado de la ejecución según el modo y el veredicto
```gherkin
Esquema del escenario: Resultado de la ejecución según el modo y el veredicto
  Dado una épica existente cuya validación resulta <veredicto>
  Cuando se solicita la validación con --mode <modo>
  Entonces se guarda un único epic-validate-report.md con el veredicto <veredicto>
    Y la ejecución termina con <resultado>
Ejemplos:
  | modo   | veredicto | resultado |
  | auto   | APPROVED  | éxito     |
  | manual | BLOCKED   | fallo     |
```

### AC-2 — Escenario alternativo — Previsualización sin escrituras
```gherkin
Dado una épica válida para validar
Cuando el mantenedor solicita la validación con --dry-run
Entonces recibe el contenido completo del reporte que se escribiría
  Y no se crea ni modifica ningún archivo
  Pero no se ejecuta ningún smoke test ni comando de verificación
```

### AC-3 — Escenario de error — Modo no reconocido
```gherkin
Dado una épica existente
Cuando se solicita la validación con un modo no reconocido, como --mode rapido
Entonces la ejecución termina con fallo e informa los valores válidos de --mode
  Pero no se crea ni modifica ningún archivo
```

### AC-4 — Escenario de regresión — Repetición sin efectos colaterales
```gherkin
Dado una épica sin cambios desde una validación anterior
Cuando se vuelve a validar con el mismo modo
Entonces el reporte es idéntico al anterior salvo la fecha de evaluación
  Y no se modifican fuentes ni artefactos distintos de epic-validate-report.md
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Idempotencia:** dos ejecuciones equivalentes producen el mismo veredicto, presentan los hallazgos en orden determinista y no los duplican.
- **CNF-2 — Escritura mínima:** fuera de previsualización, el único artefacto creado o actualizado es el reporte de validación de la épica.

## 🚫 Fuera de alcance

- Incorporar comprobaciones estructurales u operativas adicionales.
- Definir la fuente de evidencia de los smoke tests en cada modo (STORY-125).
- Decidir cuándo una épica cambia de estado.
- Publicar o documentar el skill.

## 📎 Notas / contexto adicional

- **Nombres de los modos:** se adoptan los flags de EPIC-23 y STORY-125: `--mode auto`, `--mode manual` y `--dry-run` para la previsualización. `--dry-run` es ortogonal al modo: simula la validación sin escribir archivos ni ejecutar tests, y en el reporte previsualizado las comprobaciones operativas figuran como no ejecutadas.
- **Semántica de los modos:** STORY-125 define qué evidencia toma cada modo; esta historia define cómo se selecciona el modo y qué efectos tiene la ejecución. Según la tabla de flags de EPIC-23, sin `--mode` la validación usa la ejecución automática cuando hay tests configurados, y el modo interactivo en caso contrario. `--mode manual` fuerza el modo interactivo y `--mode auto` nunca pide confirmación, así que se puede invocar desde una automatización.
- **Regla — Resultado observable:** quien invoca la validación distingue el éxito (veredicto APPROVED) del fallo (veredicto BLOCKED o error de invocación) sin leer el reporte. El mecanismo concreto (código de salida, línea final de estado u otro) se decide en el diseño.
- **Regla — Contenido equivalente:** dos reportes de la misma épica sin cambios solo pueden diferir en la fecha de evaluación. Los hallazgos se emiten en un orden determinista.
- **Dependencias:** consume el veredicto de STORY-124 y la selección de evidencia de STORY-125. Se puede desarrollar y probar con un validador stub que devuelva APPROVED o BLOCKED fijo, sin esperar a que esas historias se entreguen.
- Cubre el criterio de salida de EPIC-23: **CS-7** — El skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros documentos.
- Contribuye a **CS-10** de EPIC-23 en los flags `--mode manual`, `--mode auto` y `--dry-run`.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
