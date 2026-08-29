---
alwaysApply: false
type: story
id: FEAT-072
slug: FEAT-072-skill-story-acceptance
title: "Skill story-acceptance: Validación final humana de criterios de aceptación antes de DELIVER"
status: COMPLETED
substatus: DONE
parent: EPIC-13-quality-gates-con-dod-en-story-workflow
created: 2026-05-14
updated: 2026-05-16
related:
  - FEAT-071-skill-story-verify
  - FEAT-070-dod-code-review-en-story-code-review
  - FEAT-068-dod-plan-en-story-analyze
---
**FINVEST Score:** [pendiente de evaluación]
**FINVEST Decisión:** [pendiente de evaluación]
---
<!-- Referencias -->
[[EPIC-13-quality-gates-con-dod-en-story-workflow]]
[[FEAT-071-skill-story-verify]]
[[FEAT-070-dod-code-review-en-story-code-review]]

# 📖 Historia: Skill story-acceptance: Validación final humana de criterios de aceptación antes de DELIVER

**Como** desarrollador o Product Owner que ha completado la fase VERIFY de una historia  
**Quiero** ejecutar el skill `story-acceptance` para guiar la validación manual de los criterios de aceptación del DoD  
**Para** confirmar que la historia cumple todos los requisitos funcionales y de calidad antes de marcarla lista para DELIVER, con evidencia trazable del resultado

## ✅ Criterios de aceptación

### Escenario principal – Acceptance completado con todos los criterios aprobados

```gherkin
Dado que existe una historia "FEAT-055" con status VERIFY y substatus DONE
  Y existe el archivo "$SPECS_BASE/policies/definition-of-done-story.md" con sección ACCEPTANCE
Cuando el desarrollador ejecuta el skill `story-acceptance` con el ID "FEAT-055"
Entonces el skill lee la sección ACCEPTANCE del DoD y extrae los criterios a validar
  Y presenta al usuario los criterios de aceptación de "story.md" uno a uno solicitando validación manual
  Y el usuario confirma PASS para cada criterio validado
  Y el skill genera "$SPECS_BASE/specs/stories/FEAT-055/acceptance-report.md" con los resultados y evidencia de cada validación
  Y actualiza el frontmatter de "story.md" con status ACCEPTANCE y substatus DONE
  Y muestra el mensaje "ACCEPTANCE APROBADO: historia FEAT-055 lista para DELIVER"
```

### Escenario alternativo – Uno o más criterios rechazados por el validador humano

```gherkin
Dado que el usuario está validando la historia "FEAT-060" en modo acceptance
  Y el usuario registra FAIL en al menos un criterio de aceptación
Cuando el skill consolida los resultados de la sesión
Entonces genera "acceptance-report.md" con todos los criterios evaluados, marcando los fallidos con observaciones del usuario
  Y actualiza el frontmatter de "story.md" con status VERIFY y substatus BLOCKED
  Y muestra el mensaje "ACCEPTANCE BLOQUEADO: N criterios no aprobados. La historia regresa a VERIFY para corrección."
  Pero no avanza el status hacia DELIVER
```

### Escenario alternativo – Sesión de acceptance interrumpida y reanudada

```gherkin
Dado que el usuario comenzó una sesión de acceptance sobre "FEAT-062"
  Y la sesión fue interrumpida después de validar 3 de 5 criterios
Cuando el desarrollador ejecuta nuevamente `story-acceptance` con el ID "FEAT-062"
Entonces el skill detecta que existe un "acceptance-report.md" parcial
  Y pregunta al usuario "Se encontró una sesión previa con 3/5 criterios validados. ¿Deseas continuar desde donde quedó o reiniciar?"
  Y según la respuesta del usuario reanuda desde el criterio pendiente o reinicia la sesión completa
```

### Escenario alternativo / error – Historia en estado incorrecto para acceptance

```gherkin
Dado que existe una historia "FEAT-040" con status IMPLEMENT y substatus IN-PROGRESS
Cuando el desarrollador ejecuta `story-acceptance` con el ID "FEAT-040"
Entonces el skill detecta que la historia no cumple la precondición de estado
  Y muestra el mensaje "La historia FEAT-040 tiene status IMPLEMENT/IN-PROGRESS. Completa primero story-code-review y story-verify antes de ejecutar story-acceptance."
  Pero no genera ni modifica ningún archivo existente
```

### Escenario alternativo / error – DoD sin sección ACCEPTANCE definida

```gherkin
Dado que el archivo "$SPECS_BASE/policies/definition-of-done-story.md" no tiene una sección ACCEPTANCE
Cuando el desarrollador ejecuta `story-acceptance` con el ID "FEAT-063"
Entonces el skill muestra el aviso "No se encontró sección ACCEPTANCE en el DoD. Se usarán los criterios de aceptación de story.md como lista de validación."
  Y continúa la sesión usando exclusivamente los escenarios Gherkin de "story.md" como ítems a validar
```

### Escenario con datos (Scenario Outline) – Resultado por tipo de criterio evaluado

```gherkin
Escenario: Registro de resultado por criterio de aceptación
  Dado que el skill presenta el criterio "<criterio>" al validador
  Cuando el usuario responde "<respuesta>"
  Entonces el skill registra el criterio como "<estado>" en acceptance-report.md
Ejemplos:
  | criterio                                | respuesta              | estado   |
  | Escenario principal happy path          | PASS                   | APPROVED |
  | Escenario de error con mensaje correcto | PASS                   | APPROVED |
  | Criterio de rendimiento < 2s            | FAIL - tardó 4 segundos| REJECTED |
  | Criterio de accesibilidad               | BLOCKED - no probado   | BLOCKED  |
```

### Requerimiento: Lectura dinámica del DoD ACCEPTANCE

El skill lee la sección ACCEPTANCE (o "Definición de Hecho para la fase de ACCEPTANCE") de `$SPECS_BASE/policies/definition-of-done-story.md` en tiempo de ejecución. Los criterios del DoD se presentan como checklist al validador humano junto con los escenarios Gherkin de `story.md`. Si el DoD evoluciona, el skill lo refleja automáticamente.

### Requerimiento: Idempotencia y sesiones reanudables

El skill puede ejecutarse múltiples veces. Si `acceptance-report.md` ya existe con una sesión completa, ofrece reiniciar o consultar el resultado anterior. Si existe una sesión parcial, ofrece reanudarla. Nunca elimina artefactos previos sin confirmación explícita del usuario.

### Requerimiento: Trazabilidad de la validación humana

Cada criterio evaluado debe registrar en `acceptance-report.md`: identificador del criterio, texto del criterio, resultado (PASS/FAIL/BLOCKED), observaciones del validador, y timestamp de la evaluación. El informe debe indicar el nombre del validador si el usuario lo proporciona.

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos. - Se debe seguir lineamientos de `skill-master`.md y se sigue la estructura canónica de skills .claude\skills\skill-master\assets\skill-template.md

### Requerimiento: No modifica código ni artefactos 
El skill `story-acceptance` no debe modificar ningún código fuente ni artefacto de la historia (excepto el frontmatter de `story.md` para reflejar el resultado de la aceptación si es necesario). No debe eliminar ni sobreescribir archivos existentes sin confirmación explícita del usuario. Su función es exclusivamente orquestar la validación manual, interactuar con humano usuario y documentar resultados, sin alterar la implementación de la historia.

## ⚙️ Criterios no funcionales

* UX/Interactividad: El skill guía al usuario paso a paso, presentando un criterio por vez con instrucciones claras de qué probar y cómo registrar el resultado
* Legibilidad: El `acceptance-report.md` debe ser legible por humanos y parseable por otros skills del pipeline
* Portabilidad: Funciona en cualquier tipo de proyecto (software, IA, SKILL-only) ya que la validación es siempre manual
* Idempotencia: Ejecutable múltiples veces sin pérdida de datos; preserva historial de sesiones anteriores en `acceptance-report.md`

## 📎 Notas / contexto adicional

**Posición en el pipeline de calidad:**
```
story-implement → story-code-review → story-verify → story-acceptance → DELIVER
```

**Diferencia con `story-verify`:**
- `story-verify` ejecuta pruebas automáticas y detecta defectos técnicos.
- `story-acceptance` es una gate de validación humana: solicita al usuario/PO que pruebe la funcionalidad y confirme que satisface el valor de negocio esperado. No ejecuta comandos de prueba.

**Estructura del `acceptance-report.md` generado:**
- Metadata: ID historia, fecha, validador (opcional), versión DoD leída
- Resumen ejecutivo: total criterios, aprobados, rechazados, bloqueados
- Detalle por criterio: texto, resultado, observaciones, timestamp
- Criterios DoD ACCEPTANCE: lista con estado cumplido/no cumplido
- Estado final: ACCEPTANCE-APPROVED / ACCEPTANCE-REJECTED
- Historial de sesiones anteriores (si existen)

**Precondiciones requeridas:**
- Historia con `status: VERIFY` y `substatus: DONE` (o equivalente según el pipeline del proyecto)
- Archivo `story.md` accesible con criterios de aceptación Gherkin definidos
- Archivo DoD en `$SPECS_BASE/policies/definition-of-done-story.md`

**Flags de entrada aceptados:**
- `--story <ID>` o primer argumento posicional: ID de la historia a validar
- `--restart`: descarta sesión previa y reinicia acceptance desde cero
- `--dry-run`: muestra la lista de criterios a validar sin iniciar la sesión interactiva
- `--validator "<nombre>"`: registra el nombre del validador humano en el informe

**Fuera de scope de esta historia:**
- Ejecución de tests automáticos (eso corresponde a `story-verify`)
- Revisión de código (eso corresponde a `story-code-review`)
- Despliegue o integración en rama principal (eso corresponde a un skill `story-integration`)
