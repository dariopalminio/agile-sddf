---
type: plan
id: plan-05
slug: plan-05-enhance-code-review
title: "Incorporar mejoras a `story-code-review`"
status: COMPLETED
substatus: DONE
parent: EPIC-18
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-18-complete-flow
---

# Plan: incorporar mejoras a `story-code-review`

## Contexto

Se pueden aportar cinco prácticas que hoy **no existen** en nuestro skill y que sí aportan valor real:

1. **Eje de Performance** — no se revisa nada de rendimiento (N+1, loops sin límite, sync/async, paginación, hot paths).
2. **Estándar de aprobación explícito** ("aprobar si mejora claramente la salud del código, no exigir perfección") — sin esto, los revisores pueden sobre-bloquear por preferencia estilística.
3. **Checklist de disciplina de dependencias** — la constitución solo exige "no añadir dependencias sin aprobación" como criterio binario, sin guía de evaluación.
4. **Guía de tamaño de cambio** (sugerir dividir historias grandes) — ya existe `story-split` en el repo pero no hay gancho desde code-review.
5. **Higiene de código muerto** ("listar candidatos con justificación, no borrar en silencio") — hoy "código comentado" se trata como hallazgo a corregir sin ese matiz.

Lo que el externo NO aporta (y por tanto se descarta): SLAs de tiempo de respuesta (no aplica a agentes IA) y el patrón "multi-model review" (ya lo tenemos, vía 3 agentes + security-audit).

**Decisión de diseño clave:** Performance se **pliega dentro de `tech-lead-reviewer.agent.md`** (nueva subsección de criterios), no se crea un 4º subagente paralelo. Razón: la asimetría existente entre "seguridad básica" (folded en tech-lead-reviewer) y `security-audit` (subagente/skill independiente) se explica porque `security-audit` ya era una capability reutilizable con checklist condicional propio y multi-paso (context-detector → checklist-evaluator → report-generator) antes de integrarse aquí. Performance no tiene esa complejidad ni reutilización fuera de code-review — es análisis estático sobre el mismo código que tech-lead-reviewer ya lee. Crear un 4º agente añadiría latencia/coste de spawn y lectura duplicada de archivos sin beneficio proporcional (KISS).

Todos los cambios son **aditivos**: no se modifica la lógica de consolidación de severidad existente (`4b`, `4c`, `4c.1` de `SKILL.md`), salvo por la incorporación natural de nuevos hallazgos de Tech-Lead-Reviewer en el cálculo ya existente.

## Cambios a realizar

### 1. `agents/tech-lead-reviewer.agent.md`

- **Código muerto (matiz):** sustituir la línea "No hay código comentado sin justificación" por una versión que indique reportar código muerto/comentado como candidato en la tabla de hallazgos con severidad `LOW` y recomendación "Confirmar con el autor si puede eliminarse; no eliminar en silencio durante esta revisión" (nunca asumir borrado).
- **Nueva subsección "Performance"** (tras "Seguridad básica"): N+1 queries/llamadas en loops, loops sin límite superior, operaciones síncronas bloqueantes que deberían ser async según el patrón ya usado en el módulo, re-renders/recálculos innecesarios en UI reactiva (si aplica al stack), falta de paginación/límite en consultas que retornan colecciones grandes.
- **Checklist de disciplina de dependencias** (dentro de "Cumplimiento de DoD", activado **solo si se detecta una dependencia nueva** en `package.json`/manifest equivalente): ¿el stack existente ya resuelve esto?, ¿impacto en bundle documentado?, ¿está mantenida activamente?, ¿compatible con la licencia del proyecto? Si no hay justificación visible en `design.md`/`implement-report.md`, reportar `MEDIUM`: "Dependencia nueva '<paquete>' sin justificación de necesidad".
- **Estándar de aprobación** (nueva sección antes de "Formato de severidad"): "Aprueba un cambio cuando definitivamente mejora la salud general del código, aunque no sea perfecto. No bloquees por preferencia personal o estilo no normado en `constitution.md`. Reserva HIGH/MEDIUM para problemas reales de funcionalidad, seguridad, mantenibilidad o performance; usa LOW para mejoras opcionales que no deben bloquear el merge."
- **Formato de severidad:** ampliar la descripción de `MEDIUM` para incluir explícitamente hallazgos de performance con impacto medible y dependencias nuevas sin justificación.

### 2. `agents/product-owner-reviewer.agent.md` y `agents/integration-reviewer.agent.md`

- Insertar (antes de "## Formato de severidad" en cada uno) el mismo principio de **Estándar de aprobación**, adaptado a su dimensión: Product-Owner-Reviewer no bloquea por tests triviales/de bajo valor si los escenarios principales están cubiertos; Integration-Reviewer no bloquea por desviaciones menores de naming que no afectan integración. Se duplica el texto literalmente en cada agente (no se referencia desde `SKILL.md`) porque los subagentes no heredan el contexto del orquestador — solo reciben lo que se les pasa explícitamente.

### 3. `SKILL.md`

- **Paso 3 (antes de listar los agentes):** añadir una nota documental breve indicando que los 3 agentes comparten el mismo Estándar de aprobación (texto vive en cada `agents/*.agent.md`, aquí solo se referencia para quien lea el flujo).
- **Nuevo sub-paso 4c.2 — Verificación informativa de tamaño de cambio** (entre `4c.1` y `4d`): cuenta `$IMPL_FILES` (ya extraído en el Paso 2c desde `implement-report.md`, sin invocar `git diff` de nuevo — evita duplicar lo que ya resuelve `security-audit` y mantiene el orquestador sin lógica de Bash propia). Umbral por **número de archivos** (aproximación a la guía de líneas del skill externo, adaptada a lo que el framework puede medir sin comandos nuevos): ≤5 sin nota, 6–12 nota informativa "aceptable", >12 nota "considera `/story-split`". **Nunca** modifica `$MAX_SEVERITY` ni `$REVIEW_STATUS`. Si `$IMPL_FILES` está vacío, omitir sin error.
- **Paso 5b:** añadir la sección `{{CHANGE_SIZE_NOTE}}` a la lista de placeholders a completar.
- **Paso 7:** añadir línea opcional de resumen con el conteo de archivos y la nota (solo si no está vacía), en ambos bloques (aprobado / needs-changes).

### 4. `assets/code-review-report-template.md`

- Insertar sección `### Nota de Tamaño de Cambio` con `{{CHANGE_SIZE_NOTE}}`, entre "Integración y Arquitectura" y "Cobertura de Casos de Prueba". Performance y dependencias **no** requieren placeholder nuevo: ya viajan dentro de `{{TECH_LEAD_FINDINGS}}` con el mismo formato de tabla existente.

### 5. `evals/evals.json`

Añadir 3 casos nuevos (formato idéntico a TC-001…TC-004):
- **TC-005** — hallazgo de performance (N+1 en loop) detectado por Tech-Lead-Reviewer → `needs-changes` + `fix-directives.md`.
- **TC-006** — historia con 15 archivos en `implement-report.md` pero sin hallazgos HIGH/MEDIUM → debe seguir `approved` y mostrar la nota informativa de tamaño de cambio sugiriendo `/story-split` (verifica que la nota NO afecta el resultado).
- **TC-007** — dependencia nueva sin justificación detectada → `needs-changes` con hallazgo `MEDIUM` de disciplina de dependencias.

Actualizar la `description` raíz del JSON para mencionar los nuevos escenarios.

## Orden de implementación

1. `evals/evals.json` (casos nuevos primero — deben fallar contra el comportamiento actual, principio TDD de la constitución).
2. `agents/tech-lead-reviewer.agent.md` (performance, dependencias, código muerto, estándar de aprobación).
3. `agents/product-owner-reviewer.agent.md` y `agents/integration-reviewer.agent.md` (estándar de aprobación).
4. `SKILL.md` (nota de Paso 3, sub-paso 4c.2, ajustes Paso 5b y Paso 7).
5. `assets/code-review-report-template.md` (placeholder `{{CHANGE_SIZE_NOTE}}`).
6. Releer el flujo completo para confirmar coherencia entre agentes, `SKILL.md` y template.

## Archivos a modificar

- `d:\code\agile-sddf\.claude\skills\story-code-review\agents\tech-lead-reviewer.agent.md`
- `d:\code\agile-sddf\.claude\skills\story-code-review\agents\product-owner-reviewer.agent.md`
- `d:\code\agile-sddf\.claude\skills\story-code-review\agents\integration-reviewer.agent.md`
- `d:\code\agile-sddf\.claude\skills\story-code-review\SKILL.md`
- `d:\code\agile-sddf\.claude\skills\story-code-review\assets\code-review-report-template.md`
- `d:\code\agile-sddf\.claude\skills\story-code-review\evals\evals.json`

No se modifica `security-audit` ni `constitution.md`/`definition-of-done-story.md` — el checklist de dependencias y performance quedan dentro del alcance de `story-code-review`.

## Verificación

- Revisión visual de que los 3 `agents/*.agent.md` mantienen formato de frontmatter y contrato de output intactos tras las inserciones.
- Confirmar que `SKILL.md` Paso 4c.2 no toca las variables `$MAX_SEVERITY`/`$REVIEW_STATUS` ya calculadas en 4b/4c/4c.1 (revisión de texto, no hay código ejecutable que correr).
- Validar manualmente los 3 nuevos casos de `evals.json` contra el flujo descrito en `SKILL.md` actualizado (recorrido lógico paso a paso, ya que no hay test runner automatizado para skills Markdown en este repo).
- Confirmar que `code-review-report-template.md` renderiza sin placeholders huérfanos cuando `$CHANGE_SIZE_NOTE` está vacío (la sección debe quedar en blanco, no mostrar `{{CHANGE_SIZE_NOTE}}` literal).
