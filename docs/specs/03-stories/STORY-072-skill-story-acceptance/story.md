---
alwaysApply: false
type: story
id: STORY-072
kind: feat
slug: STORY-072-skill-story-acceptance
title: "Skill story-acceptance: ValidaciÃ³n final humana de criterios de aceptaciÃ³n antes de DELIVER"
status: COMPLETED
substatus: DONE
parent: EPIC-13-quality-gates-con-dod-en-story-workflow
created: 2026-05-14
updated: 2026-05-16
related:
  - STORY-071-skill-story-verify
  - STORY-070-dod-code-review-en-story-code-review
  - STORY-068-dod-plan-en-story-analyze
---
<!-- Referencias -->
[[quality-gates-con-dod-en-story-workflow]]
[[STORY-071-skill-story-verify]]
[[dod-code-review-en-story-code-review]]

# ðŸ“– Historia: Skill story-acceptance: ValidaciÃ³n final humana de criterios de aceptaciÃ³n antes de DELIVER

**Como** desarrollador o Product Owner que ha completado la fase VERIFY de una historia  
**Quiero** ejecutar el skill `story-acceptance` para guiar la validaciÃ³n manual de los criterios de aceptaciÃ³n del DoD  
**Para** confirmar que la historia cumple todos los requisitos funcionales y de calidad antes de marcarla lista para DELIVER, con evidencia trazable del resultado

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Acceptance completado con todos los criterios aprobados

```gherkin
Dado que existe una historia "STORY-055" con status VERIFY y substatus DONE
  Y existe el archivo "$SPECS_BASE/policies/dod-story.md" con secciÃ³n ACCEPTANCE
Cuando el desarrollador ejecuta el skill `story-acceptance` con el ID "STORY-055"
Entonces el skill lee la secciÃ³n ACCEPTANCE del DoD y extrae los criterios a validar
  Y presenta al usuario los criterios de aceptaciÃ³n de "story.md" uno a uno solicitando validaciÃ³n manual
  Y el usuario confirma PASS para cada criterio validado
  Y el skill genera "$SPECS_BASE/specs/stories/STORY-055/acceptance-report.md" con los resultados y evidencia de cada validaciÃ³n
  Y actualiza el frontmatter de "story.md" con status ACCEPTANCE y substatus DONE
  Y muestra el mensaje "ACCEPTANCE APROBADO: historia STORY-055 lista para DELIVER"
```

### Escenario alternativo â€“ Uno o mÃ¡s criterios rechazados por el validador humano

```gherkin
Dado que el usuario estÃ¡ validando la historia "STORY-060" en modo acceptance
  Y el usuario registra FAIL en al menos un criterio de aceptaciÃ³n
Cuando el skill consolida los resultados de la sesiÃ³n
Entonces genera "acceptance-report.md" con todos los criterios evaluados, marcando los fallidos con observaciones del usuario
  Y actualiza el frontmatter de "story.md" con status VERIFY y substatus BLOCKED
  Y muestra el mensaje "ACCEPTANCE BLOQUEADO: N criterios no aprobados. La historia regresa a VERIFY para correcciÃ³n."
  Pero no avanza el status hacia DELIVER
```

### Escenario alternativo â€“ SesiÃ³n de acceptance interrumpida y reanudada

```gherkin
Dado que el usuario comenzÃ³ una sesiÃ³n de acceptance sobre "STORY-062"
  Y la sesiÃ³n fue interrumpida despuÃ©s de validar 3 de 5 criterios
Cuando el desarrollador ejecuta nuevamente `story-acceptance` con el ID "STORY-062"
Entonces el skill detecta que existe un "acceptance-report.md" parcial
  Y pregunta al usuario "Se encontrÃ³ una sesiÃ³n previa con 3/5 criterios validados. Â¿Deseas continuar desde donde quedÃ³ o reiniciar?"
  Y segÃºn la respuesta del usuario reanuda desde el criterio pendiente o reinicia la sesiÃ³n completa
```

### Escenario alternativo / error â€“ Historia en estado incorrecto para acceptance

```gherkin
Dado que existe una historia "STORY-040" con status IMPLEMENT y substatus IN-PROGRESS
Cuando el desarrollador ejecuta `story-acceptance` con el ID "STORY-040"
Entonces el skill detecta que la historia no cumple la precondiciÃ³n de estado
  Y muestra el mensaje "La historia STORY-040 tiene status IMPLEMENT/IN-PROGRESS. Completa primero story-code-review y story-verify antes de ejecutar story-acceptance."
  Pero no genera ni modifica ningÃºn archivo existente
```

### Escenario alternativo / error â€“ DoD sin secciÃ³n ACCEPTANCE definida

```gherkin
Dado que el archivo "$SPECS_BASE/policies/dod-story.md" no tiene una secciÃ³n ACCEPTANCE
Cuando el desarrollador ejecuta `story-acceptance` con el ID "STORY-063"
Entonces el skill muestra el aviso "No se encontrÃ³ secciÃ³n ACCEPTANCE en el DoD. Se usarÃ¡n los criterios de aceptaciÃ³n de story.md como lista de validaciÃ³n."
  Y continÃºa la sesiÃ³n usando exclusivamente los escenarios Gherkin de "story.md" como Ã­tems a validar
```

### Escenario con datos (Scenario Outline) â€“ Resultado por tipo de criterio evaluado

```gherkin
Escenario: Registro de resultado por criterio de aceptaciÃ³n
  Dado que el skill presenta el criterio "<criterio>" al validador
  Cuando el usuario responde "<respuesta>"
  Entonces el skill registra el criterio como "<estado>" en acceptance-report.md
Ejemplos:
  | criterio                                | respuesta              | estado   |
  | Escenario principal happy path          | PASS                   | APPROVED |
  | Escenario de error con mensaje correcto | PASS                   | APPROVED |
  | Criterio de rendimiento < 2s            | FAIL - tardÃ³ 4 segundos| REJECTED |
  | Criterio de accesibilidad               | BLOCKED - no probado   | BLOCKED  |
```

### Requerimiento: Lectura dinÃ¡mica del DoD ACCEPTANCE

El skill lee la secciÃ³n ACCEPTANCE (o "DefiniciÃ³n de Hecho para la fase de ACCEPTANCE") de `$SPECS_BASE/policies/dod-story.md` en tiempo de ejecuciÃ³n. Los criterios del DoD se presentan como checklist al validador humano junto con los escenarios Gherkin de `story.md`. Si el DoD evoluciona, el skill lo refleja automÃ¡ticamente.

### Requerimiento: Idempotencia y sesiones reanudables

El skill puede ejecutarse mÃºltiples veces. Si `acceptance-report.md` ya existe con una sesiÃ³n completa, ofrece reiniciar o consultar el resultado anterior. Si existe una sesiÃ³n parcial, ofrece reanudarla. Nunca elimina artefactos previos sin confirmaciÃ³n explÃ­cita del usuario.

### Requerimiento: Trazabilidad de la validaciÃ³n humana

Cada criterio evaluado debe registrar en `acceptance-report.md`: identificador del criterio, texto del criterio, resultado (PASS/FAIL/BLOCKED), observaciones del validador, y timestamp de la evaluaciÃ³n. El informe debe indicar el nombre del validador si el usuario lo proporciona.

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos. - Se debe seguir lineamientos de `skill-master`.md y se sigue la estructura canÃ³nica de skills .claude\skills\skill-master\assets\skill-template.md

### Requerimiento: No modifica cÃ³digo ni artefactos 
El skill `story-acceptance` no debe modificar ningÃºn cÃ³digo fuente ni artefacto de la historia (excepto el frontmatter de `story.md` para reflejar el resultado de la aceptaciÃ³n si es necesario). No debe eliminar ni sobreescribir archivos existentes sin confirmaciÃ³n explÃ­cita del usuario. Su funciÃ³n es exclusivamente orquestar la validaciÃ³n manual, interactuar con humano usuario y documentar resultados, sin alterar la implementaciÃ³n de la historia.

## âš™ï¸ Criterios no funcionales

* UX/Interactividad: El skill guÃ­a al usuario paso a paso, presentando un criterio por vez con instrucciones claras de quÃ© probar y cÃ³mo registrar el resultado
* Legibilidad: El `acceptance-report.md` debe ser legible por humanos y parseable por otros skills del pipeline
* Portabilidad: Funciona en cualquier tipo de proyecto (software, IA, SKILL-only) ya que la validaciÃ³n es siempre manual
* Idempotencia: Ejecutable mÃºltiples veces sin pÃ©rdida de datos; preserva historial de sesiones anteriores en `acceptance-report.md`

## ðŸ“Ž Notas / contexto adicional

**PosiciÃ³n en el pipeline de calidad:**
```
story-implement â†’ story-code-review â†’ story-verify â†’ story-acceptance â†’ DELIVER
```

**Diferencia con `story-verify`:**
- `story-verify` ejecuta pruebas automÃ¡ticas y detecta defectos tÃ©cnicos.
- `story-acceptance` es una gate de validaciÃ³n humana: solicita al usuario/PO que pruebe la funcionalidad y confirme que satisface el valor de negocio esperado. No ejecuta comandos de prueba.

**Estructura del `acceptance-report.md` generado:**
- Metadata: ID historia, fecha, validador (opcional), versiÃ³n DoD leÃ­da
- Resumen ejecutivo: total criterios, aprobados, rechazados, bloqueados
- Detalle por criterio: texto, resultado, observaciones, timestamp
- Criterios DoD ACCEPTANCE: lista con estado cumplido/no cumplido
- Estado final: ACCEPTANCE-APPROVED / ACCEPTANCE-REJECTED
- Historial de sesiones anteriores (si existen)

**Precondiciones requeridas:**
- Historia con `status: VERIFY` y `substatus: DONE` (o equivalente segÃºn el pipeline del proyecto)
- Archivo `story.md` accesible con criterios de aceptaciÃ³n Gherkin definidos
- Archivo DoD en `$SPECS_BASE/policies/dod-story.md`

**Flags de entrada aceptados:**
- `--story <ID>` o primer argumento posicional: ID de la historia a validar
- `--restart`: descarta sesiÃ³n previa y reinicia acceptance desde cero
- `--dry-run`: muestra la lista de criterios a validar sin iniciar la sesiÃ³n interactiva
- `--validator "<nombre>"`: registra el nombre del validador humano en el informe

**Fuera de scope de esta historia:**
- EjecuciÃ³n de tests automÃ¡ticos (eso corresponde a `story-verify`)
- RevisiÃ³n de cÃ³digo (eso corresponde a `story-code-review`)
- Despliegue o integraciÃ³n en rama principal (eso corresponde a un skill `story-integration`)
