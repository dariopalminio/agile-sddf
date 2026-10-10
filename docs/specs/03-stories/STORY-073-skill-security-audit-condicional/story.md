---
alwaysApply: false
type: story
id: STORY-073
kind: feat
slug: STORY-073-skill-security-audit-condicional
title: "Construir skill `security-audit` para auditorÃ­a automÃ¡tica condicional de seguridad"
status: CANCELED
substatus: DONE
parent: EPIC-13-quality-gates-con-dod-en-story-workflow
created: 2026-05-15
updated: 2026-05-15
related: []
---
<!-- Referencias -->
[[quality-gates-con-dod-en-story-workflow]]
[[STORY-064-revision-codigo-multi-agente]]
[[dod-code-review-en-story-code-review]]

# ðŸ“– Historia: Construir skill `security-audit` para auditorÃ­a automÃ¡tica condicional de seguridad

**Como** ingeniero de software o revisor de cÃ³digo  
**Quiero** un skill independiente que detecte automÃ¡ticamente las caracterÃ­sticas del repositorio, evalÃºe un checklist de seguridad condicional y genere un reporte estructurado con hallazgos, evidencias y recomendaciones  
**Para** integrarlo como agente especializado dentro del proceso de `story-code-review` o ejecutarlo de forma aislada, y garantizar que los criterios de seguridad se cumplan antes de fusionar o desplegar

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ AuditorÃ­a exitosa sobre repositorio con JWT

```gherkin
Dado que existe un repositorio con archivos JavaScript que importan "jsonwebtoken"
  Y el archivo "package.json" declara la dependencia "jsonwebtoken"
Cuando el ingeniero ejecuta "security-audit --repo /ruta/al/proyecto"
Entonces el skill detecta la variable "uses_jwt_tokens: true"
  Y evalÃºa Ãºnicamente las reglas del checklist cuya condiciÃ³n incluye "uses_jwt_tokens"
  Y genera un reporte Markdown con resumen ejecutivo, tabla de reglas con estado PASS/FAIL/N/A
  Y el reporte incluye para cada FAIL: descripciÃ³n de vulnerabilidad, fragmento de cÃ³digo con nombre y nÃºmero de lÃ­nea, severidad y recomendaciÃ³n tÃ©cnica
  Y el reporte incluye la lista completa de caracterÃ­sticas detectadas con sus valores asignados
```

### Escenario alternativo / error â€“ CaracterÃ­stica crÃ­tica no determinable

```gherkin
Dado que el repositorio no contiene ninguna referencia explÃ­cita al entorno de ejecuciÃ³n
Cuando el skill intenta determinar el valor de "environment"
Entonces el skill asume "environment = production" como valor seguro por defecto
  Y registra "environment: manual_review_required" en la secciÃ³n de caracterÃ­sticas detectadas del reporte
  Pero no interrumpe la ejecuciÃ³n del anÃ¡lisis
```

### Escenario alternativo / error â€“ Repositorio sin archivos fuente reconocidos

```gherkin
Dado que el repositorio no contiene ningÃºn archivo con extensiÃ³n reconocida (.js, .ts, .py, .go, .java, etc.)
Cuando el ingeniero ejecuta "security-audit --repo /ruta/al/proyecto"
Entonces el skill reporta estado "N/A" para todas las reglas del checklist con justificaciÃ³n "sin archivos fuente detectados"
  Y finaliza con cÃ³digo de salida 0
  Y muestra el mensaje "No se encontraron archivos fuente reconocidos en el repositorio"
```

### Escenario con datos (Scenario Outline) â€“ Modos de ejecuciÃ³n

```gherkin
Escenario: EjecuciÃ³n en modo "<modo>"
  Dado que el repositorio tiene archivos fuente con patrones de autenticaciÃ³n detectables
  Cuando el skill se ejecuta en modo "<modo>" con los parÃ¡metros "<parÃ¡metros>"
  Entonces produce una salida con formato "<formato>"
    Y el estado global es "<estado>" basado en los hallazgos
Ejemplos:
  | modo       | parÃ¡metros                        | formato  | estado       |
  | autÃ³nomo   | --repo /proyecto                  | Markdown | PASS o FAIL  |
  | autÃ³nomo   | --repo /proyecto --output json    | JSON     | PASS o FAIL  |
  | diff       | --repo /proyecto --diff pr.json   | Markdown | PASS o FAIL  |
  | integrado  | payload JSON con ruta y diff      | JSON     | PASS o FAIL  |
```

### Requerimiento: Checklist de seguridad en archivo Markdown

Todas las reglas del checklist condicional deben estar definidas en un Ãºnico archivo `.md` dentro del directorio del skill, con la siguiente estructura por regla:

```
ID: [identificador Ãºnico]
CondiciÃ³n: [expresiÃ³n lÃ³gica evaluable: has_authentication AND uses_jwt_tokens]
Requerimiento: [quÃ© verificar en el cÃ³digo]
Severidad: [CRITICAL | HIGH | MEDIUM | LOW | INFO]
```

El skill carga este archivo en runtime y no tiene reglas hardcodeadas en su lÃ³gica. Si el archivo cambia o se amplÃ­a, el skill se adapta automÃ¡ticamente.

Severity Guide:
Severity	Meaning	Example
ðŸ”´ CRITICAL	Immediate exploitation risk, data breach likely	SQLi, RCE, auth bypass
ðŸŸ  HIGH	Serious vulnerability, exploit path exists	XSS, IDOR, hardcoded secrets
ðŸŸ¡ MEDIUM	Exploitable with conditions or chaining	CSRF, open redirect, weak crypto
ðŸ”µ LOW	Best practice violation, low direct risk	Verbose errors, missing headers
âšª INFO	Observation worth noting, not a vulnerability	Outdated dependency (no CVE)


### Requerimiento: IntegraciÃ³n con skill `story-code-review`

El skill debe poder ser invocado desde el skill `story-code-review` mediante un payload JSON con la siguiente estructura mÃ­nima:

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
El agente debe ser un archivo local dentro del directorio del skill, no debe depender de agentes externos o compartidos. Esto garantiza que el skill sea autÃ³nomo y fÃ¡cilmente integrable en diferentes contextos sin dependencias externas.

### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos.

### Requerimiento: Modos de AuditorÃ­a Release y Story Review
El skill debe soportar al menos dos modos de ejecuciÃ³n:
- Modo Release: anÃ¡lisis completo del repositorio, ideal para auditorÃ­as periÃ³dicas o pre-despliegue
- Modo Story Review: anÃ¡lisis enfocado en los archivos modificados en una historia, ideal para integrarse en el proceso de revisiÃ³n de cÃ³digo sin generar ruido por archivos no relacionados    
ParÃ¡metro	DescripciÃ³n
--scope release	Marca la auditorÃ­a como "Release Readiness" con veredicto de bloqueo
--files f1,f2,...	Lista inline de archivos a auditar (sin crear JSON previo)
--story <path>	Auto-detecta los archivos de una historia via git diff o tasks.md

Modo	ParÃ¡metros	Alcance
Release	--repo . --scope release	Todo el repo + secciÃ³n Release Readiness
Story	--repo . --story docs/specs/stories/STORY-NNN-...	Archivos auto-detectados de la historia
Files	--repo . --files src/auth.ts,src/api.ts	Archivos indicados inline

Ejemplos de uso resultantes

/security-audit --repo . --scope release
/security-audit --repo . --story docs/specs/stories/STORY-071-skill-story-verify
/security-audit --repo . --files src/auth.ts,src/api/routes.ts
/security-audit --repo . --scope release --output json

### Requerimiento: Checklist incluye riesgos OWASP Top 10
El archivo de security checklist debe incluir reglas de OWASP Top 10, OWASP API Top 10 y OWASP Top 10 para LLMs, es decir, al menos 30 reglas con condiciones variadas para asegurar que el skill cubre un amplio espectro de vulnerabilidades relevantes para aplicaciones web, APIs y sistemas que integran LLMs.

## âš™ï¸ Criterios no funcionales

* Rendimiento: el anÃ¡lisis completo de un repositorio de menos de 1000 archivos no debe superar 30 segundos en modo autÃ³nomo sin interacciÃ³n humana
* Rendimiento: en modo `--diff`, el anÃ¡lisis se limita a los archivos modificados, reduciendo el tiempo de ejecuciÃ³n
* Seguridad: el skill no ejecuta cÃ³digo del repositorio auditado; solo realiza anÃ¡lisis estÃ¡tico mediante bÃºsqueda de patrones
* Extensibilidad: aÃ±adir nuevas reglas al checklist solo requiere editar el archivo `.md`; no requiere modificar la lÃ³gica del skill

## ðŸ“Ž Notas / contexto adicional

**Variables de detecciÃ³n de contexto (heurÃ­sticas):**
El skill detecta automÃ¡ticamente variables como `has_authentication`, `uses_jwt_tokens`, `has_llm_agent`, `is_web_application`, `has_file_upload`, `has_graphql`, `environment`, `has_multi_tenant`, `has_unsafe_deserialization`, entre otras, mediante bÃºsqueda de patrones en nombres de archivos, contenido de dependencias (`package.json`, `requirements.txt`, `go.mod`) y cÃ³digo fuente.

**Scope out explÃ­cito:**
- AnÃ¡lisis dinÃ¡mico o ejecuciÃ³n de cÃ³digo del repositorio auditado.
- IntegraciÃ³n con herramientas de SAST externas (Snyk, SonarQube, Semgrep). PodrÃ­an aÃ±adirse en historias futuras.
- CorrecciÃ³n automÃ¡tica de vulnerabilidades detectadas.

**TamaÃ±o de esta historia:**
Esta historia cubre mÃºltiples capacidades interrelacionadas (detecciÃ³n, evaluaciÃ³n condicional, generaciÃ³n de reportes, modos de ejecuciÃ³n, integraciÃ³n). Fue intencionalmente mantenida como una sola historia porque el valor mÃ­nimo entregable requiere todas estas partes. Si el equipo decide reducir el alcance, se recomienda dividir por: (1) motor de detecciÃ³n + evaluaciÃ³n bÃ¡sica, (2) generaciÃ³n de reportes + modos de ejecuciÃ³n, (3) integraciÃ³n con `code-review`.

Nota de cancelaciÃ³n: esta historia se cancelÃ³ en este repositorio porque se implementa en otro repositorio externo: agile-sddf-extension