---
alwaysApply: false
type: tasks
id: FEAT-073
slug: FEAT-073-skill-security-audit-condicional-tasks
title: "Tasks: Construir skill `security-audit` para auditoría automática condicional de seguridad"
story: FEAT-073
design: FEAT-073
created: 2026-05-15
updated: 2026-05-15
related:
  - FEAT-073-skill-security-audit-condicional
---

<!-- Referencias -->
[[FEAT-073-skill-security-audit-condicional]]
[[FEAT-073-skill-security-audit-condicional-design]]

## 1. Scaffolding — Estructura de directorios

- [x] 1.1 Crear la estructura de directorios del skill: `.claude/skills/security-audit/`, `assets/`, `agents/`, `examples/jwt-project/src/`, `examples/empty-project/`, `evals/`

## 2. Checklist de seguridad (assets/security-checklist.md)

- [x] 2.1 Escribir `assets/security-checklist.md` con los 10 grupos de reglas (~50 reglas) en formato estructurado: `SEC-NNN`, Condición (expresión lógica), Requerimiento, Severidad, Patrones de detección, Referencia OWASP/CWE. Grupos mínimos: Autenticación JWT, XSS, SQL Injection, CSRF, Gestión de secretos, File Upload, GraphQL, LLM Agent, Multi-tenant, Deserialización insegura

## 3. Agentes especializados

- [x] 3.1 [P] Escribir `agents/context-detector.agent.md`: instrucciones para detectar `ProjectContext` según las heurísticas de D-3 (búsqueda en `package.json`/`requirements.txt`/`go.mod`/`pom.xml` y código fuente); manejar variables no determinables asumiendo valor safe-by-default; escribir resultado en `.tmp/security-audit/project-context.json`
- [x] 3.2 [P] Escribir `agents/checklist-evaluator.agent.md`: instrucciones para leer `project-context.json` y `active-rules.json`; para cada regla activa buscar los patrones definidos en el checklist; asignar estado `PASS`/`FAIL`/`N/A` con evidencia concreta (archivo, línea, fragmento); escribir `rule-results.json`
- [x] 3.3 [P] Escribir `agents/report-generator.agent.md`: instrucciones para leer `project-context.json` y `rule-results.json`; producir resumen ejecutivo + tabla de reglas + detalle de FAILs; escribir `audit-report.md` siempre y `audit-report.json` cuando se solicite

## 4. Orquestador principal (SKILL.md)

- [x] 4.1 Escribir `SKILL.md` con frontmatter YAML estandarizado (name, description, triggers, outputs) e instrucciones de orquestación completas: (a) detección del modo de ejecución por parámetros (autónomo Markdown, autónomo JSON, diff, integrado), (b) lectura y parseo de `assets/security-checklist.md`, (c) filtrado de reglas por condición usando `project-context.json`, (d) invocación secuencial de los tres agentes escribiendo resultados en `.tmp/security-audit/`, (e) manejo de errores: checklist no encontrado → abortar, repositorio sin archivos fuente → N/A para todas, variable no determinable → asumir safe-default

## 5. Ejemplos de prueba

- [x] 5.1 [P] Crear `examples/jwt-project/package.json` con `jsonwebtoken` como dependencia y `examples/jwt-project/src/auth.js` con `jwt.sign(...)` y `localStorage.setItem('token', ...)` (genera al menos un FAIL en la regla de JWT+localStorage para verificar AC-1)
- [x] 5.2 [P] Crear `examples/empty-project/README.md` con solo texto (sin archivos `.js`/`.ts`/`.py`/`.go`/`.java`) para verificar el flujo AC-3 (todas las reglas N/A, exit 0)

## 6. Verificación de criterios de aceptación

- [x] 6.1 Verificar AC-1: ejecutar skill sobre `examples/jwt-project/` y confirmar que el reporte Markdown incluye: `uses_jwt_tokens: true` en contexto detectado, al menos una regla evaluada con estado FAIL, evidencia con nombre de archivo y línea, severidad y recomendación técnica
- [x] 6.2 Verificar AC-2: ejecutar skill sobre un directorio sin `NODE_ENV`/`.env`/`APP_ENV` y confirmar que el reporte incluye `environment: manual_review_required` en la sección de contexto y que el análisis continúa sin interrupciones
- [x] 6.3 Verificar AC-3: ejecutar skill sobre `examples/empty-project/` y confirmar que todas las reglas tienen estado N/A con justificación "sin archivos fuente detectados" y que el proceso finaliza con código de salida 0
- [x] 6.4 Verificar AC-4 (modo JSON): ejecutar con `--output json` y confirmar que la salida JSON contiene los campos `status`, `summary.evaluated`, `summary.pass`, `summary.fail`, `summary.na`, `detected_context` y `report`
- [x] 6.5 Verificar AC-6 (modo integrado): pasar payload JSON `{"repo": "...", "changed_files": ["src/auth.js"]}` y confirmar que el retorno JSON sigue el contrato definido en design.md: `{status, summary, report}`
- [x] 6.6 Verificar mitigaciones de riesgos (INC-001): al completar las tareas 3.1 y 4.1, revisar la tabla `Risks / Trade-offs` de `design.md` y confirmar que cada mitigación está implementada: (a) `context-detector` marca `manual_review_required` ante variables no determinables; (b) SKILL.md aborta con mensaje claro si `security-checklist.md` no existe; (c) si `context-detector` falla completamente, SKILL.md aborta con mensaje claro; (d) si una regla individual falla en evaluación, se marca N/A y continúa; (e) SKILL.md falla con error de permisos si `.tmp/security-audit/` no puede crearse
- [x] 6.7 Verificar AC-10: Modos de Auditoría Release y Story Review
  - Para Release: ejecutar el skill en modo autónomo sobre un proyecto de ejemplo y confirmar que el reporte se genera correctamente sin intervención humana
  - Para Story Review: simular la ejecución del skill en modo diff pasando un conjunto de archivos modificados y confirmar que solo se evalúan las reglas relevantes para esos archivos, generando un reporte enfocado en los cambios recientes
- [x] Requerimiento: Checklist incluye riesgos OWASP Top 10. Revisar `assets/security-checklist.md` y confirmar que incluye al menos 30 reglas que cubren OWASP Top 10, OWASP API Top 10 y OWASP Top 10 para LLMs, con condiciones variadas para asegurar una cobertura amplia de vulnerabilidades relevantes.

## 7. Documentación

- [x] 7.1 Escribir `README.md` del skill con: instalación y dependencias, modos de uso (autónomo, diff, integrado, CI/CD), explicación de las heurísticas de detección por variable, cómo extender el checklist añadiendo nuevas reglas al archivo `.md`

## 8. Evals

- [x] 8.1 Escribir `evals/eval-detection.md` con benchmarks para verificar la detección correcta de cada variable booleana en proyectos de ejemplo representativos de Node.js, Python y Go (casos PASS y FAIL por variable)
