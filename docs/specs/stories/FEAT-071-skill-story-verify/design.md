---
alwaysApply: false
type: design
id: FEAT-071
slug: FEAT-071-skill-story-verify-design
title: "Design: Skill story-verify — Orquestar la fase VERIFY de pruebas de una historia"
story: FEAT-071
created: 2026-05-15
updated: 2026-05-15
related:
  - FEAT-071-skill-story-verify
  - FEAT-070-dod-code-review-en-story-code-review
  - EPIC-13-quality-gates-con-dod-en-story-workflow
---

<!-- Referencias -->
[[FEAT-071-skill-story-verify]]
[[FEAT-070-dod-code-review-en-story-code-review]]
[[EPIC-13-quality-gates-con-dod-en-story-workflow]]

## Context

El skill `story-verify` orquesta la fase VERIFY del workflow SDD. Viene después de `story-code-review` (que deja la historia en `READY-FOR-VERIFY/DONE`) y es responsable de: verificar precondiciones, detectar el modo de ejecución de pruebas, ejecutar o guiar las pruebas, evaluar los criterios del DoD VERIFY, generar `verify-report.md` y actualizar el frontmatter de `story.md`.

Su posicionamiento en el pipeline:
```
[story.md: READY-FOR-VERIFY/DONE]   ← viene de story-code-review
     ↓
story-verify    ← aquí
     │   Al iniciar: story.md → VERIFY/IN-PROGRESS
     │   Si todos los criterios DoD pasan: → VERIFY/DONE
     │   Si criterios DoD fallan: → substatus: REJECTED (sin cambio de status)
     │   Si estado incorrecto: → error, sin cambio
     ↓
[story.md: VERIFY/DONE]
```

**Stack aplicable (extraído de constitution.md):**
- Skills y agentes: Markdown puro.
- Convención de nombres: kebab-case.
- Almacenamiento: solo archivos. Sin base de datos.
- Patrón de orquestación: SKILL.md → subagente (un solo nivel de delegación).
- El skill no ejecuta código del proyecto directamente; invoca comandos del sistema operativo.

**Criterios de aceptación de la historia (referencia de trazabilidad):**
- AC-1: Verificación automática (unit tests) con generación de verify-report.md y actualización de story.md.
- AC-2: Verificación E2E (playwright/cypress/cucumber) con resultados por escenario Gherkin.
- AC-3: Verificación manual (sin tests automáticos) con guía interactiva escenario por escenario.
- AC-4: Precondición de estado: historia en estado incorrecto → error sin modificar archivos.
- AC-5: DoD VERIFY no superado → verify-report.md con defectos + substatus BLOCKED.
- AC-6: Detección automática del modo de ejecución según stack detectado.
- AC-7: Idempotencia — sobreescribe verify-report.md preservando historial de ejecuciones.
- AC-8: Lectura dinámica del DoD VERIFY en tiempo de ejecución.
- AC-9: Formato de defectos con severity CRITICAL/HIGH/MEDIUM/LOW.
- AC-10: Detección de frameworks de prueba + delegación a skill de testing si existe.
- AC-11: Template del reporte leído de `$SPECS_BASE/specs/templates`.
- AC-12: Seguir patrones estructurales de `skill-structural-pattern.md`.
- AC-13: Seguir lineamientos de `skill-master`.
- AC-14: El skill no modifica código fuente ni artefactos de la historia (solo `verify-report.md` y frontmatter de `story.md`).

---

## Goals / Non-Goals

**Goals:**
- Detectar automáticamente el modo de ejecución de pruebas según el stack del proyecto (AC-6, AC-10).
- Ejecutar la batería de pruebas del proyecto (unit, integration, E2E) o guiar la verificación manual (AC-1, AC-2, AC-3).
- Evaluar los criterios del DoD VERIFY leyendo el archivo de políticas en tiempo de ejecución (AC-8).
- Generar `verify-report.md` con resultados estructurados, defectos clasificados por severidad e historial (AC-1, AC-5, AC-7, AC-9, AC-11).
- Actualizar el frontmatter de `story.md` según el resultado (VERIFY/DONE o substatus BLOCKED) (AC-1, AC-5).
- Verificar la precondición de estado antes de ejecutar cualquier prueba (AC-4, AC-14).

**Non-Goals:**
- Generación de tests inexistentes (corresponde a `story-implement`).
- Revisión de código (corresponde a `story-code-review`).
- Despliegue a producción (corresponde a `story-integration` (o `story-deploy`), historia futura).
- Integración con CI/CD externo.
- Modificación del código fuente de la historia (AC-14).

---

## Decisions

### D-1: Estructura de directorios del skill // satisface: AC-12, AC-13

**Opción elegida:** Estructura canónica SDDF con agente local y template en `assets/`.

```
story-verify/
├── SKILL.md                          # orquestador principal
├── assets/
│   └── verify-report-template.md     # template del reporte (fallback si no está en $SPECS_BASE)
├── agents/
│   └── qa-engineer.agent.md          # rol QA: modo manual + evaluación de estrategia de prueba
├── examples/
│   ├── pytest-project/               # proyecto de ejemplo con pytest configurado
│   ├── jest-project/                 # proyecto de ejemplo con jest configurado
│   └── no-tests-project/            # proyecto de ejemplo para modo manual
└── evals/
    └── eval-mode-detection.md        # benchmarks para detección de modo de ejecución
```

**Alternativa rechazada A:** Múltiples agentes especializados (unit-test-agent, e2e-agent, manual-agent).
Rechazada porque el modo de ejecución lo determina la detección de stack, no roles separados. Un único agente QA generalista reduce la complejidad y es suficiente para todos los modos.

**Alternativa rechazada B:** Sin agente — SKILL.md hace todo directamente.
Rechazada porque el modo manual requiere un rol de QA Engineer con conocimiento de dominio de pruebas para guiar al usuario escenario por escenario. Eso pertenece al agente, no al orquestador (P11: separación de responsabilidades).

---

### D-2: Modos de ejecución y detección de stack // satisface: AC-6, AC-10

**Opción elegida:** SKILL.md detecta el modo leyendo archivos de configuración del proyecto; el modo se resuelve antes de cualquier ejecución.

| Modo | Condición de detección | Acción del SKILL.md |
|---|---|---|
| `automatico-unit` | pytest.ini, setup.cfg, jest.config.js/ts, vitest.config, go test, etc. | Ejecutar comando de test detectado |
| `automatico-e2e` | playwright.config.ts/js, cypress.config.js/ts, cucumber.js, features/ | Ejecutar comando E2E detectado |
| `delegado` | Skill de testing personalizado detectado en el proyecto | Invocar el skill de testing externo |
| `manual` | Ninguna configuración de tests detectada | Invocar qa-engineer.agent.md en modo guiado |

Orden de detección (primera coincidencia gana):
1. Buscar skill de testing en `.claude/skills/` → modo `delegado`
2. Buscar archivos de config E2E → modo `automatico-e2e`
3. Buscar archivos de config unit/integration → modo `automatico-unit`
4. Sin coincidencia → modo `manual`

**Alternativa rechazada:** Preguntar siempre al usuario qué modo usar.
Rechazada porque la historia requiere detección automática (AC-6). El flag `--mode` ya permite override manual si se necesita.

---

### D-3: Separación SKILL / Agente QA // satisface: AC-14, AC-3, NFR-separación

**Opción elegida:** SKILL.md concentra toda la E/S de archivos y ejecución de comandos; `qa-engineer.agent.md` solo contiene el rol y el conocimiento de dominio.

SKILL.md es responsable de:
- Leer y escribir archivos (`story.md`, `verify-report.md`, DoD, templates)
- Ejecutar comandos de prueba (`npm test`, `pytest`, `playwright test`)
- Generar `verify-report.md` a partir de los resultados
- Actualizar el frontmatter de `story.md`
- Mostrar resumen al usuario

`qa-engineer.agent.md` es responsable de:
- Guiar al usuario escenario por escenario en modo manual
- Evaluar la estrategia de prueba en modo E2E (si se invoca)
- Aplicar criterios de calidad QA al interpretar resultados ambiguos

El agente **no accede a archivos directamente** — recibe contexto del SKILL.md a través de `.tmp/story-verify/`.

**Alternativa rechazada:** El agente genera el reporte directamente.
Rechazada porque violaría AC-14 (no-destructividad) al dar al agente acceso de escritura a artefactos de la historia.

---

### D-4: Transiciones de estado de la historia // satisface: AC-1, AC-4, AC-5

**Opción elegida:** Tabla de transiciones estricta con precondición verificada antes de cualquier ejecución.

| Evento | status anterior | status nuevo | substatus nuevo |
|---|---|---|---|
| Inicio de story-verify | READY-FOR-VERIFY/DONE | VERIFY | IN-PROGRESS |
| Todos los criterios DoD VERIFY pasan | VERIFY/IN-PROGRESS | VERIFY | DONE |
| Algún criterio DoD VERIFY falla | VERIFY/IN-PROGRESS | VERIFY | BLOCKED |
| Estado incorrecto (precondición no cumplida) | cualquiera excepto READY-FOR-VERIFY o IMPLEMENT/DONE | sin cambio | sin cambio |

Precondiciones aceptables para ejecutar: `status: READY-FOR-VERIFY` o `status: IMPLEMENTING, substatus: DONE` (mínimo aceptable según la historia).

**Alternativa rechazada:** Permitir ejecución desde cualquier estado y solo emitir advertencia.
Rechazada porque compromete la integridad del pipeline SDD. El fail-fast ante precondición incorrecta es un principio de calidad del framework.

---

### D-5: Generación de verify-report.md // satisface: AC-1, AC-3, AC-5, AC-7, AC-9, AC-11

**Opción elegida:** Template leído en runtime de `$SPECS_BASE/specs/templates/verify-report-template.md` con fallback a `assets/verify-report-template.md`.

Secciones del reporte generado (según template de la historia):
- **Metadata**: story-id, fecha, modo de ejecución, versión DoD leída
- **Summary**: total tests, passed, failed, skipped, coverage %
- **Test Scope**: checkboxes (unit, integration, E2E, performance, security)
- **Findings**: defectos clasificados por severidad (CRITICAL/HIGH/MEDIUM/LOW) con location, steps to reproduce, expected/actual, fix
- **Coverage Analysis**: cobertura por módulo (solo para modo automático)
- **Recommendations**: acciones priorizadas
- **DoD VERIFY criteria**: lista de criterios con estado cumplido/no cumplido
- **Sign-off**: checkboxes de aprobación
- **Historial de ejecuciones anteriores**: preservado si el archivo existía

Idempotencia: si `verify-report.md` ya existe, SKILL.md extrae la sección "Historial" del reporte anterior, genera el nuevo reporte completo y appende la entrada de historial al final.

**Alternativa rechazada:** Sobrescribir sin preservar historial.
Rechazada porque AC-7 requiere explícitamente mantener historial de ejecuciones anteriores.

---

### D-6: Lectura dinámica del DoD VERIFY // satisface: AC-8

**Opción elegida:** SKILL.md lee `$SPECS_BASE/policies/definition-of-done-story.md` en runtime y extrae la sección cuyo encabezado contenga "VERIFY" (case-insensitive).

Si la sección VERIFY no se encuentra:
- Emitir advertencia: "Sección VERIFY no encontrada en DoD — usando criterios mínimos genéricos"
- Usar criterios mínimos: (1) todos los tests del proyecto pasan, (2) sin defectos CRITICAL o HIGH sin resolver

Si el archivo DoD no existe:
- Emitir advertencia y usar criterios mínimos genéricos

**Alternativa rechazada:** Hardcodear criterios de verificación en el SKILL.md.
Rechazada porque viola el principio de "Template como fuente de verdad dinámica" (Patrón #5 de skill-structural-pattern.md).

---

## Interfaces

### SKILL.md → qa-engineer.agent.md // satisface: AC-3, AC-2

```
Input (escribe en .tmp/story-verify/qa-input.json antes de invocar):
  {
    "story_id": "FEAT-NNN",
    "mode": "manual" | "e2e-assessment",
    "scenarios": [{ "id": "AC-N", "title": "...", "steps": "..." }],
    "dod_criteria": ["criterio 1", "criterio 2"],
    "story_title": "..."
  }

Output (el agente escribe en .tmp/story-verify/qa-output.json):
  {
    "scenario_results": [
      { "scenario_id": "AC-N", "status": "PASS | FAIL | SKIP | BLOCKED", "observations": "..." }
    ],
    "findings": [
      { "severity": "CRITICAL | HIGH | MEDIUM | LOW", "title": "...", "location": "...", "description": "...", "fix": "..." }
    ]
  }
```

### SKILL.md → verify-report-template.md // satisface: AC-11, AC-5

```
Template leído de: $SPECS_BASE/specs/templates/verify-report-template.md
                   (fallback: assets/verify-report-template.md)

Placeholders completados por SKILL.md:
  {story_id}, {story_title}, {date}, {mode}, {dod_version},
  {total_tests}, {passed}, {failed}, {skipped}, {coverage},
  {test_scope_checkboxes}, {findings_by_severity},
  {dod_criteria_results}, {recommendations}, {history}

Output: $SPECS_BASE/specs/stories/FEAT-NNN/verify-report.md
```

### SKILL.md → story.md (frontmatter update) // satisface: AC-1, AC-4, AC-5

```
Campos actualizados en frontmatter:
  status:    VERIFY (al iniciar) | sin cambio (si precondición falla)
  substatus: IN-PROGRESS (al iniciar) | DONE (si pasan todos los DoD) | BLOCKED (si fallan)
  updated:   <fecha actual>
```

---

## Flujos Clave

### Flujo 1: Verificación automática unit tests // satisface: AC-1, AC-6

```
SKILL.md lee story.md → verifica precondición (READY-FOR-VERIFY o IMPLEMENT/DONE)
→ actualiza story.md: VERIFY/IN-PROGRESS
→ lee DoD VERIFY de definition-of-done-story.md
→ detecta config de unit tests (pytest.ini / jest.config / etc.)
→ ejecuta comando de tests (npm test / pytest / etc.)
→ si ejecución >30s: muestra progreso cada 15s
→ recopila resultados (passed/failed/coverage)
→ evalúa criterios DoD contra resultados
→ escribe verify-report.md (con historial si existía)
→ si todos DoD pass: actualiza story.md → VERIFY/DONE
→ si algún DoD falla: actualiza story.md → substatus BLOCKED
→ muestra resumen en pantalla
```

### Flujo 2: Verificación E2E // satisface: AC-2, AC-6

```
SKILL.md detecta playwright.config / cypress.config / cucumber
→ actualiza story.md: VERIFY/IN-PROGRESS
→ ejecuta suite E2E (npm run test:e2e / npx playwright test / etc.)
→ mapea resultados a escenarios Gherkin de story.md (por nombre si es posible)
→ registra PASS/FAIL/SKIP por escenario
→ si la historia tiene escenarios que el E2E no cubre: registra como SKIP con nota
→ genera verify-report.md con resultados por escenario
→ evalúa DoD VERIFY → actualiza story.md
```

### Flujo 3: Verificación manual // satisface: AC-3, AC-6

```
SKILL.md no detecta configuración de tests
→ actualiza story.md: VERIFY/IN-PROGRESS
→ escribe .tmp/story-verify/qa-input.json con escenarios de story.md y criterios DoD
→ invoca qa-engineer.agent.md (modo manual)
→ qa-engineer guía al usuario escenario por escenario
→ qa-engineer escribe resultados en .tmp/story-verify/qa-output.json
→ SKILL.md lee qa-output.json y genera verify-report.md
→ evalúa DoD VERIFY → actualiza story.md
```

### Flujo 4: Precondición incorrecta // satisface: AC-4, AC-14

```
SKILL.md lee story.md frontmatter
→ status ≠ READY-FOR-VERIFY y ≠ IMPLEMENT/DONE
→ emite mensaje: "La historia <ID> tiene status <S>/<SS>. Ejecuta <skill-previo> antes de continuar."
→ termina sin crear ni modificar ningún archivo
```

### Flujo 5: DoD VERIFY no superado // satisface: AC-5, AC-9

```
Tras ejecutar pruebas → algún criterio DoD falla o hay defectos CRITICAL/HIGH
→ genera verify-report.md con sección Findings (CRITICAL→LOW)
→ actualiza story.md → VERIFY/substatus: REJECTED
→ muestra: "VERIFY BLOQUEADO: se encontraron N defectos. Revisa verify-report.md para detalles."
→ status principal NO cambia (solo substatus)
```

---

## Risks / Trade-offs

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Detección de framework de prueba falla (config no estándar) | Media | Medio | Fallback a modo manual; documentar patrones soportados en README |
| Tests tardan >30s sin progreso visible | Alta (repos reales) | Bajo | SKILL.md muestra progreso cada 15s (NFR explícito en la historia) |
| E2E tests no mapeables a escenarios Gherkin por nombre | Media | Bajo | Registrar como SKIP con nota; no bloquear la verificación |
| DoD VERIFY no existe en el archivo de políticas | Baja | Medio | Usar criterios mínimos genéricos + emitir advertencia clara |
| qa-engineer.agent.md no puede escribir en .tmp/story-verify/ | Baja | Alto | SKILL.md verifica existencia del directorio .tmp antes de invocar el agente; aborta con error si no puede crearlo |

---

## Open Questions

Ninguna — todas las ambigüedades técnicas han sido resueltas en este documento.

---

## Registro de Cambios (CR)

Sin CRs detectados. Todos los criterios de aceptación tienen cobertura directa en este diseño.
