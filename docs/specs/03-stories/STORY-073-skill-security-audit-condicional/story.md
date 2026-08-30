---
alwaysApply: false
type: story
id: STORY-073
kind: feat
slug: STORY-073-skill-security-audit-condicional
title: "Construir skill `security-audit` para auditoría automática condicional de seguridad"
status: COMPLETED
substatus: DONE
parent: EPIC-13-quality-gates-con-dod-en-story-workflow
created: 2026-05-15
updated: 2026-05-15
related: []
---
**FINVEST Score:** [pendiente de evaluación]
**FINVEST Decisión:** [pendiente de evaluación]
---
<!-- Referencias -->
[[EPIC-13-quality-gates-con-dod-en-story-workflow]]
[[STORY-064-revision-codigo-multi-agente]]
[[dod-code-review-en-story-code-review]]

# 📖 Historia: Construir skill `security-audit` para auditoría automática condicional de seguridad

**Como** ingeniero de software o revisor de código  
**Quiero** un skill independiente que detecte automáticamente las características del repositorio, evalúe un checklist de seguridad condicional y genere un reporte estructurado con hallazgos, evidencias y recomendaciones  
**Para** integrarlo como agente especializado dentro del proceso de `story-code-review` o ejecutarlo de forma aislada, y garantizar que los criterios de seguridad se cumplan antes de fusionar o desplegar

## ✅ Criterios de aceptación

### Escenario principal – Auditoría exitosa sobre repositorio con JWT

```gherkin
Dado que existe un repositorio con archivos JavaScript que importan "jsonwebtoken"
  Y el archivo "package.json" declara la dependencia "jsonwebtoken"
Cuando el ingeniero ejecuta "security-audit --repo /ruta/al/proyecto"
Entonces el skill detecta la variable "uses_jwt_tokens: true"
  Y evalúa únicamente las reglas del checklist cuya condición incluye "uses_jwt_tokens"
  Y genera un reporte Markdown con resumen ejecutivo, tabla de reglas con estado PASS/FAIL/N/A
  Y el reporte incluye para cada FAIL: descripción de vulnerabilidad, fragmento de código con nombre y número de línea, severidad y recomendación técnica
  Y el reporte incluye la lista completa de características detectadas con sus valores asignados
```

### Escenario alternativo / error – Característica crítica no determinable

```gherkin
Dado que el repositorio no contiene ninguna referencia explícita al entorno de ejecución
Cuando el skill intenta determinar el valor de "environment"
Entonces el skill asume "environment = production" como valor seguro por defecto
  Y registra "environment: manual_review_required" en la sección de características detectadas del reporte
  Pero no interrumpe la ejecución del análisis
```

### Escenario alternativo / error – Repositorio sin archivos fuente reconocidos

```gherkin
Dado que el repositorio no contiene ningún archivo con extensión reconocida (.js, .ts, .py, .go, .java, etc.)
Cuando el ingeniero ejecuta "security-audit --repo /ruta/al/proyecto"
Entonces el skill reporta estado "N/A" para todas las reglas del checklist con justificación "sin archivos fuente detectados"
  Y finaliza con código de salida 0
  Y muestra el mensaje "No se encontraron archivos fuente reconocidos en el repositorio"
```

### Escenario con datos (Scenario Outline) – Modos de ejecución

```gherkin
Escenario: Ejecución en modo "<modo>"
  Dado que el repositorio tiene archivos fuente con patrones de autenticación detectables
  Cuando el skill se ejecuta en modo "<modo>" con los parámetros "<parámetros>"
  Entonces produce una salida con formato "<formato>"
    Y el estado global es "<estado>" basado en los hallazgos
Ejemplos:
  | modo       | parámetros                        | formato  | estado       |
  | autónomo   | --repo /proyecto                  | Markdown | PASS o FAIL  |
  | autónomo   | --repo /proyecto --output json    | JSON     | PASS o FAIL  |
  | diff       | --repo /proyecto --diff pr.json   | Markdown | PASS o FAIL  |
  | integrado  | payload JSON con ruta y diff      | JSON     | PASS o FAIL  |
```

### Requerimiento: Checklist de seguridad en archivo Markdown

Todas las reglas del checklist condicional deben estar definidas en un único archivo `.md` dentro del directorio del skill, con la siguiente estructura por regla:

```
ID: [identificador único]
Condición: [expresión lógica evaluable: has_authentication AND uses_jwt_tokens]
Requerimiento: [qué verificar en el código]
Severidad: [CRITICAL | HIGH | MEDIUM | LOW | INFO]
```

El skill carga este archivo en runtime y no tiene reglas hardcodeadas en su lógica. Si el archivo cambia o se amplía, el skill se adapta automáticamente.

Severity Guide:
Severity	Meaning	Example
🔴 CRITICAL	Immediate exploitation risk, data breach likely	SQLi, RCE, auth bypass
🟠 HIGH	Serious vulnerability, exploit path exists	XSS, IDOR, hardcoded secrets
🟡 MEDIUM	Exploitable with conditions or chaining	CSRF, open redirect, weak crypto
🔵 LOW	Best practice violation, low direct risk	Verbose errors, missing headers
⚪ INFO	Observation worth noting, not a vulnerability	Outdated dependency (no CVE)


### Requerimiento: Integración con skill `story-code-review`

El skill debe poder ser invocado desde el skill `story-code-review` mediante un payload JSON con la siguiente estructura mínima:

```json
{
  "repo": "/ruta/al/proyecto",
  "changed_files": ["src/auth.ts", "src/api/routes.ts"]
}
```

Y retornar:

```json
{
  "status": "PASS | FAIL",
  "summary": { "evaluated": 42, "pass": 38, "fail": 3, "na": 1 },
  "report": "...contenido Markdown del reporte..."
}
```
### Requerimiento: Agente local al skill
El agente debe ser un archivo local dentro del directorio del skill, no debe depender de agentes externos o compartidos. Esto garantiza que el skill sea autónomo y fácilmente integrable en diferentes contextos sin dependencias externas.

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos.

### Requerimiento: Modos de Auditoría Release y Story Review
El skill debe soportar al menos dos modos de ejecución:
- Modo Release: análisis completo del repositorio, ideal para auditorías periódicas o pre-despliegue
- Modo Story Review: análisis enfocado en los archivos modificados en una historia, ideal para integrarse en el proceso de revisión de código sin generar ruido por archivos no relacionados    
Parámetro	Descripción
--scope release	Marca la auditoría como "Release Readiness" con veredicto de bloqueo
--files f1,f2,...	Lista inline de archivos a auditar (sin crear JSON previo)
--story <path>	Auto-detecta los archivos de una historia via git diff o tasks.md

Modo	Parámetros	Alcance
Release	--repo . --scope release	Todo el repo + sección Release Readiness
Story	--repo . --story docs/specs/stories/STORY-NNN-...	Archivos auto-detectados de la historia
Files	--repo . --files src/auth.ts,src/api.ts	Archivos indicados inline

Ejemplos de uso resultantes

/security-audit --repo . --scope release
/security-audit --repo . --story docs/specs/stories/STORY-071-skill-story-verify
/security-audit --repo . --files src/auth.ts,src/api/routes.ts
/security-audit --repo . --scope release --output json

### Requerimiento: Checklist incluye riesgos OWASP Top 10
El archivo de security checklist debe incluir reglas de OWASP Top 10, OWASP API Top 10 y OWASP Top 10 para LLMs, es decir, al menos 30 reglas con condiciones variadas para asegurar que el skill cubre un amplio espectro de vulnerabilidades relevantes para aplicaciones web, APIs y sistemas que integran LLMs.

## ⚙️ Criterios no funcionales

* Rendimiento: el análisis completo de un repositorio de menos de 1000 archivos no debe superar 30 segundos en modo autónomo sin interacción humana
* Rendimiento: en modo `--diff`, el análisis se limita a los archivos modificados, reduciendo el tiempo de ejecución
* Seguridad: el skill no ejecuta código del repositorio auditado; solo realiza análisis estático mediante búsqueda de patrones
* Extensibilidad: añadir nuevas reglas al checklist solo requiere editar el archivo `.md`; no requiere modificar la lógica del skill

## 📎 Notas / contexto adicional

**Variables de detección de contexto (heurísticas):**
El skill detecta automáticamente variables como `has_authentication`, `uses_jwt_tokens`, `has_llm_agent`, `is_web_application`, `has_file_upload`, `has_graphql`, `environment`, `has_multi_tenant`, `has_unsafe_deserialization`, entre otras, mediante búsqueda de patrones en nombres de archivos, contenido de dependencias (`package.json`, `requirements.txt`, `go.mod`) y código fuente.

**Scope out explícito:**
- Análisis dinámico o ejecución de código del repositorio auditado.
- Integración con herramientas de SAST externas (Snyk, SonarQube, Semgrep). Podrían añadirse en historias futuras.
- Corrección automática de vulnerabilidades detectadas.

**Tamaño de esta historia:**
Esta historia cubre múltiples capacidades interrelacionadas (detección, evaluación condicional, generación de reportes, modos de ejecución, integración). Fue intencionalmente mantenida como una sola historia porque el valor mínimo entregable requiere todas estas partes. Si el equipo decide reducir el alcance, se recomienda dividir por: (1) motor de detección + evaluación básica, (2) generación de reportes + modos de ejecución, (3) integración con `code-review`.
