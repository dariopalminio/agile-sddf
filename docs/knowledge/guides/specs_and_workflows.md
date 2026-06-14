# Specs y Workflows

## Specs

- **Los Specs son contratos**: el documento es el contrato, la IA implementa según el contrato, y una revisión independiente verifica el cumplimiento del contrato.
- **Separación de intereses**: Al escribir el spec no hay que pensar en la implementación técnica; al escribir el plan no hay que repetir los requisitos. Cada documento tiene una única responsabilidad, reduciendo la redundancia de información.
- **Trazabilidad**: Cada spec tiene relaciones de padre y elementos relacionados. En la revisión se puede ubicar con precisión en qué fase está el problema: si el spec no fue definido claramente, si el plan tiene un diseño defectuoso, o si el implement se desvió del plan. La trazabilidad permite la navegabilidad.
- **Estados y subestados**: El spec tiene status (estados de workflow) y substatus (TODO, IN-PROGRESS, DONE) que permiten visualizar el progreso y detectar bloqueos o retrasos.

## Specs primarios vs secundarios

Los specs primarios representan especificaciones de work items, por ejemplo: project, release o story. 
Los specs secundarios representan especificaciones secundarias de un work item, por ejemplo: project-plan.

## Workflow

Un workflow es una secuencia de pasos por los que puede pasar un work item. Por ejemplo en el flujo de story.

## Status

Un status representa una etapa dentro de un flujo de trabajo (workflow) de un work item. Un spec de un work item (como story) tiene un estado asociado que indica en que etapa del flujo de trabajo se encuentra el work item.

## Substatus

Un subestado representa el nivel de avance interno de un work item dentro de un estado del workflow, indicando si está pendiente de iniciarse, en ejecución activa o ya completado y listo para avanzar al siguiente estado.

- **TODO**: El  work item está pendiente de iniciar en el status. Puede estar esperando capacidad (WIP limit). Cuando un desarrollador/IA toma el ítem, pasa a IN‑PROGRESS.
- **IN‑PROGRESS**: Alguien está trabajando activamente en esta etapa (ej. redactando la especificación, planificando, implementando) sobre el work item. Al completar la tarea de la etapa (ej. finishing spec.md), pasa a DONE.
- **DONE**: El trabajo de esta etapa (status) ha terminado. El work item está listo para pasar a la siguiente etapa del flujo (listo para pasar al siguiente status). 
- **BLOCKED**:  BLOCKED no retrocede. El work item no hizo nada malo; no puede evaluarse por un impedimento. El work item está bloqueado y no puede avanzar hasta que se resuelva el bloqueo. Generalmente el bloqueo consta de esperar una acción de un humano o usuario.

## Story Workflow

Happy path:
```
SPECIFY --> PLAN --> READY-FOR-IMPLEMENT --> IMPLEMENT --> CODE-REVIEW --> VERIFY --> ACCEPTANCE --> DELIVER --> COMPLETED
```

Rejected path:
```
READY-FOR-IMPLEMENT --> IMPLEMENT --> CODE-REVIEW --> VERIFY --> ACCEPTANCE --> DELIVER --> COMPLETED
       |                                   |            |            | 
       |                                REJECTED     REJECTED     REJECTED
       |                                   |            |            |         
       |                                   v            v            v           
       <------------------------------------------------------------------          
```

- SPECIFY – Especificación de requisitos.
- PLAN – Fase donde se generan design.md, tasks.md, testcases.md y analyze.md.
- READY-FOR-IMPLEMENT – Cola buffer.
- IMPLEMENT – Fase donde se escribe código y se ejecuta TDD.
- CODE-REVIEW – Revisión de código independiente (IA o humano).
- VERIFY – Fase donde se ejecutan pruebas automáticas.
- ACCEPTANCE – Aceptación humana o del PO.  
- DELIVER – Incremento listo para entregar o ya entregado al usuario. Cubre tanto el modelo batch (potencialmente entregable, esperando ventana de despliegue) como el modelo continuous (ya desplegado en producción).
- COMPLETED – Estado final "Done".

> La máquina de estados completa con transiciones skill a skill, retrocesos y los niveles project y release está en [[state-machine]].

## Release (Épica) Workflow

Happy path:
```
DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED
```

- DEFINE – Se define el alcance: objetivos de alto nivel, features que componen la épica, criterios de éxito y valor esperado. Se documenta en `release.md`.
- PLAN – Se planifica la ejecución: se desglosan las historias de usuario, se asignan a releases, se estima esfuerzo y se identifican dependencias.
- READY-FOR-DEV – Estado buffer. La épica está completamente planificada, priorizada y aprobada. Espera a que el equipo tenga capacidad para comenzar el desarrollo. Se aplican límites de WIP.
- DEVELOP – Desarrollo en curso: las historias de la épica se implementan. La épica permanece aquí hasta que todas las historias estén entregadas.
- VALIDATE – Se ejecutan pruebas de integración y regresión del conjunto completo (end-to-end, UAT, requisitos no funcionales).
- SHIP – La épica se libera: se publica el artefacto, se despliega a producción o se marca como disponible para los usuarios finales. Último estado activo.
- COMPLETED – Estado terminal pasivo. La épica está cerrada administrativamente. Sin acciones pendientes.

> Ver diagrama Mermaid y tabla de transiciones en [[state-machine]].
