---
alwaysApply: false
type: design
id: STORY-072
slug: STORY-072-skill-story-acceptance-design
title: "Design: Skill story-acceptance — Validación final humana de criterios de aceptación antes de DELIVER"
story: STORY-072
created: 2026-05-15
updated: 2026-05-15
status: PLANNING
substatus: IN-PROGRESS
related:
  - STORY-072-skill-story-acceptance
  - STORY-071-skill-story-verify
  - STORY-070-dod-code-review-en-story-code-review
---

<!-- Referencias -->
[[STORY-072-skill-story-acceptance]]
[[STORY-071-skill-story-verify]]
[[STORY-070-dod-code-review-en-story-code-review]]

## Context

Este diseño especifica el skill `story-acceptance`, última gate de calidad antes de que una historia avance a DELIVER. A diferencia de `story-verify` (que ejecuta pruebas automáticas), `story-acceptance` es una gate de validación **exclusivamente humana**: guía al usuario criterio por criterio, recopila evidencia manual y genera un `acceptance-report.md` trazable.

**Posición en el pipeline de calidad:**
```
story-implement → story-code-review → story-verify → story-acceptance → DELIVER
```

**Contexto técnico del proyecto (extraído de constitution.md y código existente):**
- Skills en `.claude/skills/{nombre}/SKILL.md` — orquestadores Markdown puro
- Agentes locales al skill en `.claude/skills/{nombre}/agents/`
- Templates locales del skill en `.claude/skills/{nombre}/assets/`
- Templates globales en `docs/specs/templates/` — fuente de verdad compartida
- Convención de nombres: kebab-case en todo el repositorio
- Patrón arquitectónico: skill (orquestador) → agentes (especialistas); un solo nivel de delegación
- Output de historias en `docs/specs/stories/STORY-NNN/`
- Directorio temporal de trabajo entre agentes: `.tmp/{skill-name}/`
- Gestión de estado de historia mediante frontmatter YAML (`status` / `substatus`)
- Skill para creación de nuevos skills: `/skill-master` y la estructura canónica de skills `.claude\skills\skill-master\assets\skill-template.md`

---

## Goals / Non-Goals

**Goals:**
- Definir los pasos y estructura de `SKILL.md` para `story-acceptance` // satisface: AC-1, AC-2, AC-3, AC-4, AC-5, Req-10, Req-11
- Especificar la máquina de estados de `story.md` durante el ciclo de acceptance // satisface: AC-1, AC-2, AC-4
- Diseñar el formato y contenido de `acceptance-report.md` con trazabilidad por criterio // satisface: AC-1, AC-2, AC-6, Req-9
- Definir la fuente de criterios a validar (DoD ACCEPTANCE + fallback a Gherkin) // satisface: AC-5, Req-7
- Especificar el mecanismo de sesiones reanudables e idempotencia // satisface: AC-3, Req-8
- Verificar precondiciones de estado antes de iniciar la sesión // satisface: AC-4
- Definir el template `acceptance-report-template.md` en `assets/` // satisface: Req-10
- Garantizar que el skill no modifica código fuente ni artefactos distintos de `story.md` (frontmatter) y `acceptance-report.md` // satisface: Req-12
- Garantizar que se usa el skill /skill-master y se sigue la estructura canónica de skills .claude\skills\skill-master\assets\skill-template.md
**Non-Goals:**
- Ejecutar pruebas automáticas (responsabilidad de `story-verify`)
- Revisar código fuente (responsabilidad de `story-code-review`)
- Desplegar ni integrar en rama principal (responsabilidad de un skill `story-integration` futuro)
- Validar la calidad del `acceptance-report.md` generado (autocorrección fuera de scope de este skill)

---

## Decisions

### D-1: Arquitectura del skill — orquestador puro sin subagentes // satisface: AC-1, AC-2, AC-3, Req-10, Req-11

**Opción elegida:** `SKILL.md` actúa como orquestador único sin subagentes especializados.

El acceptance es una sesión interactiva y secuencial (un criterio por vez, esperando respuesta humana). No hay análisis paralelo de dominio que justifique subagentes. Todo el flujo (leer criterios → presentar → recopilar → generar report) es transformación de datos + interacción con el usuario — tarea del orquestador.

```
story-acceptance/
├── SKILL.md                           # orquestador principal (sin agentes)
└── assets/
    └── acceptance-report-template.md  # template de salida (fuente de verdad)
```

**Alternativas rechazadas:**
- Subagente `criteria-presenter.agent.md`: añade un nivel de indirección para una tarea que es solo lectura + interacción con usuario; viola KISS (P12) y el principio de un solo nivel de delegación.
- Subagente `report-generator.agent.md` separado: el report se genera a partir de la sesión acumulada en memoria del orquestador; externalizar a un agente requeriría serializar y pasar el estado completo de la sesión, añadiendo complejidad sin beneficio.

---

### D-2: Fuente de criterios a validar — DoD ACCEPTANCE + fallback Gherkin // satisface: AC-5, Req-7

**Opción elegida:** Lectura dinámica en dos niveles:

1. **Primario:** leer sección `ACCEPTANCE` (o equivalente) de `$SPECS_BASE/policies/definition-of-done-story.md`
2. **Fallback:** si no existe la sección ACCEPTANCE, usar los escenarios Gherkin de `story.md` como lista de validación

El skill detecta la ausencia de la sección ACCEPTANCE en el DoD y avisa al usuario antes de cambiar al fallback:
```
⚠️ No se encontró sección ACCEPTANCE en el DoD.
   Se usarán los criterios de aceptación de story.md como lista de validación.
```

Los criterios del DoD se presentan como checklist al validador; los Gherkin de `story.md` se presentan como escenarios a ejecutar manualmente.

**Alternativas rechazadas:**
- Hardcodear criterios de acceptance en el skill: viola el principio de "template como fuente de verdad dinámica"; si el DoD evoluciona, el skill quedaría desactualizado.
- Solo usar Gherkin de `story.md` ignorando el DoD: pierde la dimensión de criterios de proceso/calidad del DoD que no aparecen en los Gherkin funcionales.

---

### D-3: Gestión de sesiones — detección de estado parcial o completo // satisface: AC-3, Req-8

**Opción elegida:** El skill detecta el estado de `acceptance-report.md` al inicio y ofrece tres caminos según el estado encontrado:

| Estado de `acceptance-report.md` | Acción |
|----------------------------------|--------|
| No existe | Iniciar sesión nueva |
| Existe, sesión parcial (N de M criterios evaluados) | Preguntar: continuar / reiniciar |
| Existe, sesión completa (todos los criterios evaluados) | Preguntar: reiniciar / mostrar resultado anterior |

La condición de "sesión parcial" se detecta comparando el número de criterios registrados con resultado vs. el total de criterios extraídos del DoD + story.md en la ejecución actual.

El flag `--restart` fuerza reinicio sin preguntar (descarta sesión previa).

**Alternativas rechazadas:**
- Sobrescribir siempre: impide resumir sesiones interrumpidas; el usuario pierde el trabajo parcial.
- Gestionar sesiones con archivo `.tmp/story-acceptance/session.json`: añade una dependencia de formato no-Markdown; el estado de sesión puede derivarse directamente del `acceptance-report.md` ya existente.

---

### D-4: Máquina de estados de story.md durante el ciclo de acceptance // satisface: AC-1, AC-2, AC-4

**Opción elegida:**

```
Estado inicial permitido: VERIFY/DONE
  ↓ (al iniciar sesión)
ACCEPTANCE/IN-PROGRESS
  ↓ (consolidación)
  ├── todos PASS/APPROVED → ACCEPTANCE/DONE + mensaje "ACCEPTANCE APROBADO"
  └── ≥1 FAIL o BLOCKED   → READY-FOR-IMPLEMENT/DONE + mensaje "ACCEPTANCE BLOQUEADO"

Cualquier otro estado inicial → ERROR (no se modifica story.md)
```

El skill verifica el estado de `story.md` antes de modificar cualquier archivo. Si el estado no es `VERIFY/DONE`, muestra el mensaje de error (AC-4) y termina sin escribir nada.

**Transiciones de frontmatter:**

| Evento | status | substatus |
|--------|--------|-----------|
| Inicio de sesión de acceptance | `ACCEPTANCE` | `IN-PROGRESS` |
| Todos los criterios PASS/APPROVED | `ACCEPTANCE` | `DONE` |
| ≥1 criterio FAIL o BLOCKED | `READY-FOR-IMPLEMENT` | `DONE` |

**Alternativas rechazadas:**
- Actualizar story.md solo al finalizar (no al inicio): el story.md quedaría en `VERIFY/DONE` mientras la sesión está en curso; otro skill podría interpretar incorrectamente que la historia está disponible para re-verificar.
- Estado intermedio `ACCEPTANCE/REJECTED`: introduce un estado no definido en constitution.md y no comunica qué acción debe tomar el desarrollador.
- `VERIFY/REJECTED`: rechazado porque la historia ya superó `story-verify` (pruebas automáticas) para llegar a acceptance. Regresar a ese estado implicaría que las pruebas automáticas fallaron, lo cual no es el caso. El rechazo en acceptance significa que hay trabajo de implementación pendiente (fixes, refinamiento de UX, nuevas tareas). `READY-FOR-IMPLEMENT/DONE` es semánticamente correcto: señala que la historia vuelve a la cola de implementación para que el desarrollador añada tasks de corrección y re-ejecute el pipeline completo.

---

### D-5: Formato de acceptance-report.md — template en assets/ // satisface: AC-1, AC-2, AC-6, Req-9, Req-10

**Opción elegida:** Template en `assets/acceptance-report-template.md`, leído en runtime por el orquestador (fuente de verdad dinámica — Principio 5 de constitution.md).

**Estructura del documento generado:**

```markdown
---
type: acceptance-report
story: STORY-NNN
date: YYYY-MM-DD
validator: <nombre o "no especificado">
dod-version: <fecha del DoD leído>
session-status: complete | partial
final-status: ACCEPTANCE-APPROVED | ACCEPTANCE-REJECTED
---

### D-6: Uso de skill-master
Garantizar que se usa el skill /skill-master y se sigue la estructura canónica de skills .claude\skills\skill-master\assets\skill-template.md

# Acceptance Report: STORY-NNN — <título>

## Resumen ejecutivo
- **Historia:** STORY-NNN — <título>
- **Fecha:** YYYY-MM-DD
- **Validador:** <nombre>
- **Total criterios:** N
- **Aprobados (APPROVED):** N
- **Rechazados (REJECTED):** N
- **Bloqueados (BLOCKED):** N

## Detalle por criterio

| # | Criterio | Resultado | Observaciones del validador | Timestamp |
|---|----------|-----------|-----------------------------|-----------|
| 1 | <texto del criterio> | APPROVED | <notas> | HH:MM |
| 2 | <texto del criterio> | REJECTED | <notas> | HH:MM |

## Criterios DoD ACCEPTANCE

| Criterio DoD | Estado |
|--------------|--------|
| <texto criterio DoD> | ✓ cumplido / ✗ no cumplido |

## Estado final

**ACCEPTANCE APROBADO** / **ACCEPTANCE BLOQUEADO: N criterios no aprobados**

## Historial de sesiones anteriores

<!-- Si existen: listar sesiones previas con fecha, resultado y N criterios evaluados. -->
```

**Resultados válidos por criterio:**
- `APPROVED` — criterio verificado y aprobado (respuesta: PASS)
- `REJECTED` — criterio verificado y rechazado (respuesta: FAIL + observación obligatoria)
- `BLOCKED` — criterio no pudo probarse (respuesta: BLOCKED + razón obligatoria)

**Alternativas rechazadas:**
- Formato libre de texto sin tabla: viola Req-9 (trazabilidad por criterio) y dificulta el procesamiento por otros skills del pipeline.
- Incluir el acceptance-report dentro de story.md: mezcla el contrato de la historia con la evidencia de validación; los artefactos tienen audiencias y ciclos de vida distintos.

---

### D-6: Interacción con el usuario — presentación uno por vez // satisface: AC-1, AC-2, AC-6, Req-9

**Opción elegida:** El orquestador presenta cada criterio de forma secuencial con instrucciones de qué validar. Por cada criterio:

```
─────────────────────────────────────────────────────
 Criterio 2 de 5: Escenario — Uno o más criterios rechazados
─────────────────────────────────────────────────────
 Texto: <descripción del criterio o escenario Gherkin>

 Instrucción: Ejecuta el escenario manualmente y registra el resultado.

 Resultado:
   [P] PASS    — el criterio se cumple
   [F] FAIL    — el criterio no se cumple (requiere observación)
   [B] BLOCKED — no se pudo probar (requiere razón)
   [Q] Salir   — interrumpir y guardar sesión parcial
─────────────────────────────────────────────────────
```

El flag `--dry-run` muestra la lista de criterios sin iniciar la sesión interactiva.

**Alternativas rechazadas:**
- Presentar todos los criterios juntos para que el usuario responda en bloque: no garantiza que el validador pruebe cada uno individualmente; pierde granularidad de evidencia.
- Agrupar criterios Gherkin + DoD en una sola lista sin distinción: confunde la dimensión funcional (Gherkin) con la dimensión de proceso (DoD); el validador necesita saber qué tipo de validación ejecutar.

---

### D-7: Idempotencia de acceptance-report.md // satisface: Req-8

**Opción elegida:** El skill nunca elimina el `acceptance-report.md` sin confirmación explícita. Al detectar sesión completa existente, el orquestador ofrece:

```
Se encontró un acceptance-report.md completo con resultado ACCEPTANCE-APPROVED.
¿Qué deseas hacer?
  (r) Reiniciar  — iniciar nueva sesión (el historial anterior se preserva en "Historial de sesiones")
  (v) Ver report — mostrar el resultado anterior sin modificar nada
```

El historial de sesiones anteriores se añade como sección al final del `acceptance-report.md` (no se sobreescribe, se acumula).

**Alternativas rechazadas:**
- Sobrescribir el acceptance-report.md incondicionalmente: pierde evidencia de sesiones previas y viola Req-8 (idempotencia sin pérdida de datos).
- Crear múltiples archivos `acceptance-report-v2.md`, `acceptance-report-v3.md`: prolifera artefactos y complica la lectura por otros skills del pipeline.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| DoD evoluciona entre sesiones parciales → lista de criterios cambia al reanudar | El skill re-extrae los criterios del DoD en cada ejecución; al reanudar avisa si el número de criterios difiere del total registrado en la sesión parcial |
| Sesión muy larga (muchos criterios) → el usuario abandona | La opción `[Q] Salir` guarda la sesión parcial; el usuario puede reanudar en cualquier momento |
| El validador ingresa `FAIL` sin observación → informe sin trazabilidad | El skill valida que FAIL y BLOCKED requieren texto de observación no vacío; rechaza la respuesta si está vacía |
| Dos instancias del skill ejecutándose en paralelo sobre la misma historia → corrupción de acceptance-report.md | No hay mecanismo de lock de archivos Markdown; es responsabilidad del usuario no ejecutar en paralelo; la idempotencia garantiza que re-ejecutar sobre un report completo siempre ofrece la opción de reiniciar |
| story.md en estado `ACCEPTANCE/IN-PROGRESS` al inicio (sesión previa interrumpida) → precondición falla | La precondición acepta `VERIFY/DONE` **o** `ACCEPTANCE/IN-PROGRESS` (sesión en curso); en este segundo caso el skill detecta el partial y ofrece reanudar directamente |

---

## Open Questions

Sin preguntas abiertas. El diseño cubre todos los ACs y requisitos de STORY-072.

Los mecanismos de `story-verify` (pruebas automáticas que preceden a acceptance) están definidos en STORY-071 y son independientes de este diseño.

---

## Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `story-acceptance/SKILL.md` | crear | `.claude/skills/story-acceptance/SKILL.md` | AC-1, AC-2, AC-3, AC-4, AC-5, Req-10, Req-11 |
| `acceptance-report-template.md` | crear | `.claude/skills/story-acceptance/assets/acceptance-report-template.md` | AC-1, AC-2, AC-6, Req-9 |
| `acceptance-report.md` | crear (output por historia) | `docs/specs/stories/STORY-NNN/acceptance-report.md` | AC-1, AC-2, AC-3, AC-6, Req-9 |
| `story.md` (frontmatter) | modificar (solo status/substatus) | `docs/specs/stories/STORY-NNN/story.md` | AC-1, AC-2, AC-4, Req-12 |
| `definition-of-done-story.md` | leer (sin modificar) | `docs/policies/definition-of-done-story.md` | AC-5, Req-7 |

---

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `story-acceptance {story_id}` | Entrada: ID de historia. Salida: `acceptance-report.md` + frontmatter de `story.md` actualizado | AC-1, AC-2 |
| `story-acceptance {story_id} --restart` | Descarta sesión previa y reinicia desde el primer criterio | AC-3, Req-8 |
| `story-acceptance {story_id} --dry-run` | Lista criterios a validar sin iniciar sesión interactiva | Req-8 |
| `story-acceptance {story_id} --validator "<nombre>"` | Registra el nombre del validador en `acceptance-report.md` | Req-9 |
| Lectura de `definition-of-done-story.md` | El skill lee la sección ACCEPTANCE en tiempo de ejecución; si no existe, usa Gherkin de story.md | AC-5, Req-7 |
| Detección de `acceptance-report.md` existente | Si existe: detecta partial vs. complete y ofrece resume/restart/show | AC-3, Req-8 |

---

## Flujos Clave

### Flujo principal (happy path — AC-1)
```
1. skill-preflight → OK
2. Resolver {story_id} → directorio de historia
3. Verificar story.md: status=VERIFY, substatus=DONE → OK
4. Leer DoD sección ACCEPTANCE → extraer criterios DoD
5. Leer story.md → extraer escenarios Gherkin
6. Detectar acceptance-report.md → no existe → sesión nueva
7. Actualizar story.md: ACCEPTANCE/IN-PROGRESS
8. Por cada criterio (DoD + Gherkin):
   a. Presentar criterio con instrucción
   b. Esperar respuesta: PASS → APPROVED
   c. Registrar en sesión: id, texto, resultado, timestamp
9. Consolidar: todos APPROVED → generar acceptance-report.md completo
10. Actualizar story.md: ACCEPTANCE/DONE
11. Mostrar: "ACCEPTANCE APROBADO: historia STORY-NNN lista para DELIVER"
```

### Flujo alternativo — criterios rechazados (AC-2)
```
... (pasos 1-8 iguales, pero step 8b: FAIL → REJECTED + observación obligatoria)
9. Consolidar: ≥1 REJECTED/BLOCKED → generar acceptance-report.md con criterios fallidos
10. Actualizar story.md: READY-FOR-IMPLEMENT/DONE
11. Mostrar: "ACCEPTANCE BLOQUEADO: N criterio(s) no aprobado(s). La historia regresa a la cola de implementación."
```

### Flujo de reanudación (AC-3)
```
1-6. ... detectar acceptance-report.md parcial (N de M criterios)
7. Preguntar: "Continuar desde criterio N+1 / Reiniciar"
   → Continuar: saltar criterios ya evaluados, reanudar desde pendiente
   → Reiniciar: limpiar sesión, iniciar desde criterio 1
```

### Flujo de error — estado incorrecto (AC-4)
```
3. Verificar story.md: status ≠ VERIFY/DONE (y ≠ ACCEPTANCE/IN-PROGRESS)
   → Mostrar mensaje de error con instrucción
   → Terminar sin modificar ningún archivo
```

---

## Registro de Cambios (CR)

Sin CRs detectados. Todos los ACs tienen cobertura de diseño completa.
