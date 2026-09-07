# Desacoplar `story-code-review` del skill `security-audit`

## Context

Hoy el **Participante 4** del skill [story-code-review](skills/story-code-review/SKILL.md#L316-L320) no es un agente sino una invocación al skill `security-audit`. Eso genera tres problemas:

1. **Dependencia dura entre skills.** `story-code-review` declara `Dependencias → Skills: [skill-preflight, security-audit]`. Si `security-audit` no está instalado (es opcional en instalaciones parciales / futuras extracciones al repo de extensiones, como ya pasó con `readme-builder`), el quality gate se rompe o queda a medias.
2. **Contrato dual y lógica especial.** El Paso 4 mantiene un camino aparte (`$SECURITY_STATUS = pass|fail|skipped`, lectura de `.tmp/security-audit/<slug>/audit-report.md`, mapeo `fail → HIGH`) distinto al de los otros tres revisores, que solo reportan `max-severity`. Son dos mecánicas para lo mismo.
3. **Acoplamiento de rutas.** `story-code-review` conoce la convención interna de `$AUDIT_TMP` de otro skill.

**Resultado buscado:** `story-code-review` pasa a tener **cuatro agentes locales propios** en `agents/`, sin depender de ningún otro skill. El nuevo agente de seguridad es autónomo: descubre los checklists de seguridad que existan en el contexto de ejecución (incluido el `assets/security-checklist.md` de un `security-audit` instalado, que **lee como fuente de reglas, no invoca**) y cae a un baseline embebido si no encuentra ninguno. **`skills/security-audit/` no se toca.**

> **Decisión de arquitectura:** el agente **no** invoca el skill de seguridad. `security-audit` es un skill *orquestador* (lanza sus propios subagentes) y `docs/guides/best-practices-for-skills.md` + [ADR-0002](docs/adr/ADR-0002-invocacion-agentes-locales-de-skill.md) prohíben `subagente → skill orquestador`. Reusar su checklist obtiene el mismo valor sin violar la matriz de invocaciones ni reintroducir el acoplamiento.

---

## Archivos a modificar / crear

| Archivo | Acción |
|---|---|
| `skills/story-code-review/agents/security-reviewer.agent.md` | **Crear** |
| [skills/story-code-review/SKILL.md](skills/story-code-review/SKILL.md) | Modificar (Dependencias, Paso 3b, Paso 4a/4b/4c, Paso 4f, Paso 5b, Paso 7, Salida) |
| [skills/story-code-review/assets/code-review-report-template.md](skills/story-code-review/assets/code-review-report-template.md) | Modificar (reviewers + sección de seguridad) |
| [skills/story-code-review/evals/evals.json](skills/story-code-review/evals/evals.json) | Modificar (renombrar contrato + caso nuevo) |
| [CHANGELOG.md](CHANGELOG.md) | Modificar (entrada en `[Unreleased]`) |
| `skills/security-audit/**` | **No se toca** |

---

## 1. Crear `skills/story-code-review/agents/security-reviewer.agent.md`

Sigue el mismo molde que sus tres hermanos ([tech-lead-reviewer.agent.md](skills/story-code-review/agents/tech-lead-reviewer.agent.md), [product-owner-reviewer.agent.md](skills/story-code-review/agents/product-owner-reviewer.agent.md), [integration-reviewer.agent.md](skills/story-code-review/agents/integration-reviewer.agent.md)): frontmatter → misión → criterios → **Estándar de aprobación** (texto duplicado, los subagentes no heredan contexto) → formato de severidad → output.

**Frontmatter** (misma convención de ruta que los hermanos — sin `{story_id}`, ver nota al final):

```yaml
---
name: security-reviewer
description: >-
  Subagente del skill story-code-review. Audita la seguridad del código implementado en una historia
  SDD evaluando los checklists de seguridad disponibles en el contexto de ejecución; si no encuentra
  ninguno, aplica un baseline embebido. Escribe su informe parcial a
  .tmp/story-code-review/security-report.md con el formato de contrato definido.
  Invocado exclusivamente por el orquestador story-code-review — no invocar directamente.
role: Auditor de Seguridad
dimension: security
output: .tmp/story-code-review/security-report.md
---
```

**Contexto recibido del orquestador** (documentarlo en el body como hacen los hermanos):
`$STORY_DIR`, `$REPO_PATH` (= `$SDDF_ROOT`/raíz del repo), `$CONSTITUTION_PATH`, `$DOD_PATH`, `$IMPL_REPORT_AVAILABLE`, `$IMPL_FILES` (lista ya resuelta en el Paso 2c del skill).

**Misión, en 4 pasos:**

### Paso 1 — Resolver alcance de archivos
- Si `$IMPL_FILES` no está vacío → ese es el alcance.
- Si está vacío y existe `$STORY_DIR/tasks.md` → extraer rutas de archivo de tareas marcadas `[x]`.
- Si sigue vacío → registrar `scope: repositorio-no-resuelto` y emitir informe con `max-severity: ninguna` + nota informativa `⏭️ Sin archivos fuente resueltos — auditoría de seguridad omitida`. **Nunca ejecutar `git diff` ni comandos nuevos** (el skill ya evita lógica de Bash propia, ver Paso 4c.2 actual).

### Paso 2 — Descubrir checklists de seguridad (en orden, acumulativo)
1. **Checklists de política del proyecto** — glob `docs/policies/*security-checklist*.md` bajo `$REPO_PATH` (y las rutas enlazadas desde `$CONSTITUTION_PATH` / `$DOD_PATH`). En este repo eso resuelve a [ai-security-checklist.md](docs/policies/ai-security-checklist.md) y [code-security-checklist.md](docs/policies/code-security-checklist.md), ya referenciados desde [constitution.md:47-48](docs/policies/constitution.md#L47-L48) y [definition-of-done-story.md:65-66](docs/policies/definition-of-done-story.md#L65-L66). Formato: líneas `- [ ] <regla> — grep: \`<rule-id>\` (error|warn)`.
2. **Checklist de un skill de seguridad instalado** — buscar `*/security-audit/assets/security-checklist.md` bajo las rutas de instalación de skills que existan (`skills/`, `.claude/skills/`, `.agents/skills/`, `.github/skills/`). Si aparece, **leerlo como fuente de reglas** (formato `### SEC-NNN`, con `**Condición:**`, `**Severidad:**`, `**Patrones de detección:**`) y evaluar solo las reglas cuya condición sea plausible para los archivos del alcance. **Prohibido invocarlo con la herramienta `Skill`** — regla explícita en la sección "Reglas" del agente.
3. **Ninguno encontrado** → usar el **baseline embebido** (abajo).

Registrar la lista de fuentes usadas para citarla en el informe.

### Paso 3 — Baseline embebido (fallback, ~8 reglas)
Lista corta y auto-contenida, aplicada solo por búsqueda estática de patrones en los archivos del alcance:

| ID | Regla | Severidad |
|---|---|---|
| `BASE-01` | Secretos / credenciales / API keys literales en código | HIGH |
| `BASE-02` | Concatenación de input en consultas SQL/NoSQL | HIGH |
| `BASE-03` | `eval(`, `new Function(`, `exec(`, `shell=True` con input externo | HIGH |
| `BASE-04` | Endpoint o handler sin verificación de autenticación/autorización | HIGH |
| `BASE-05` | Verificación TLS deshabilitada (`verify=False`, `rejectUnauthorized: false`) | HIGH |
| `BASE-06` | Datos sensibles (tokens, passwords, PII) escritos a logs | MEDIUM |
| `BASE-07` | Rutas de archivo construidas con input sin normalizar (path traversal) | MEDIUM |
| `BASE-08` | `innerHTML` / `dangerouslySetInnerHTML` con datos no sanitizados | MEDIUM |

### Paso 4 — Evaluar y escribir informe
- **Solo análisis estático**; nunca ejecutar el código auditado.
- **Principio de cautela** (heredado del criterio de `security-audit`): ante duda sin evidencia concreta, **no reportar hallazgo**. No fabricar findings.
- Mapear severidades del checklist externo al vocabulario de los revisores: `CRITICAL|HIGH → HIGH`, `MEDIUM|error → MEDIUM`, `LOW|warn → LOW`.

**Estándar de aprobación** (adaptado del texto compartido): aprobar cuando no hay exposición real; reservar `HIGH` para exposición concreta de secretos, inyección o bypass de autorización con evidencia en archivo:línea, `MEDIUM` para deuda de seguridad significativa, `LOW` para endurecimiento opcional. No bloquear por hipótesis sin evidencia.

**Output** — `.tmp/story-code-review/security-report.md`:

```markdown
---
agent: security-reviewer
dimension: security
status: approved | needs-changes
max-severity: HIGH | MEDIUM | LOW | ninguna
checklist-sources: [<rutas usadas> | baseline-embebido]
rules-evaluated: <N>
---

# Informe: Seguridad

## Fuentes de checklist
- <ruta o "baseline embebido (checklist de seguridad no encontrado en el contexto)">

## Hallazgos

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| HIGH      | src/auth.ts:42 | SEC-002 | API key hardcodeada | Mover a process.env.API_KEY |

## Veredicto
{approved | needs-changes}: {justificación en una oración}
```

Sin hallazgos → fila única `| — | — | — | Sin hallazgos de seguridad | — |`.
Sin archivos en alcance → nota `⏭️ Sin archivos fuente resueltos — auditoría de seguridad omitida` + `max-severity: ninguna`.

**Reglas** (mismo bloque de cierre que los hermanos): `approved` si `max-severity ∈ {LOW, ninguna}`; `needs-changes` si `∈ {HIGH, MEDIUM}`; no escribir fuera del archivo de output; **no invocar ningún skill**; no comunicarse con el usuario.

---

## 2. Modificar `skills/story-code-review/SKILL.md`

| Ubicación | Cambio |
|---|---|
| Frontmatter `description` ([L3-8](skills/story-code-review/SKILL.md#L3-L8)) | `3 subagentes … + skill security-audit en paralelo` → `4 subagentes en paralelo (Inspector de Código, Guardián de Requisitos, Inspector de Integración, Auditor de Seguridad)` |
| Dependencias ([L94-95](skills/story-code-review/SKILL.md#L94-L95)) | Skills: `[skill-preflight]` (quitar `security-audit`); Agentes: agregar `security-reviewer` |
| Objetivo / "Qué hace" ([L22-30](skills/story-code-review/SKILL.md#L22-L30)) | "tres subagentes" → "cuatro subagentes" |
| Paso 3b ([L291-331](skills/story-code-review/SKILL.md#L291-L331)) | Reemplazar el bloque **Participante 4 — Security-Audit** por **Agente 4 — Security-Reviewer** (`agents/security-reviewer.agent.md`, output `.tmp/story-code-review/{story_id}/security-report.md`). Agregar `$IMPL_FILES` y `$REPO_PATH` a la lista de variables pasadas. El aviso de "Principio compartido — Estándar de aprobación" pasa a decir "los cuatro agentes". Mantener el `🔒` en el bloque de progreso. |
| Paso 4a ([L337-350](skills/story-code-review/SKILL.md#L337-L350)) | Leer los **cuatro** informes de `.tmp/story-code-review/{story_id}/` incluyendo `security-report.md`. **Eliminar** la lectura de `$SEC_AUDIT_REPORT` y la derivación de `$SECURITY_STATUS`. El fail-safe `max-severity: HIGH` ante informe faltante aplica ahora también a `security-report.md`. |
| Paso 4b ([L352-365](skills/story-code-review/SKILL.md#L352-L365)) | Quitar las tres reglas de contribución de `$SECURITY_STATUS`. Queda: `max_severity = máxima severidad entre los cuatro agentes`. |
| Paso 4c ([L374-378](skills/story-code-review/SKILL.md#L374-L378)) | Quitar `$SECURITY_STATUS` de las variables registradas. |
| Paso 4f ([L464](skills/story-code-review/SKILL.md#L464)) | Los hallazgos de seguridad entran en `fix-directives.md` como cualquier otro agente: `Dimensión = security`. Borrar la regla especial de `audit-report.md`. |
| Paso 5b ([L533-536](skills/story-code-review/SKILL.md#L533-L536)) | Sustituir la "Sección `## Security Audit` (inyectada dinámicamente)" por el llenado normal del placeholder `{{SECURITY_FINDINGS}}` del template. |
| Paso 7 ([L579-581](skills/story-code-review/SKILL.md#L579-L581), [L609-610](skills/story-code-review/SKILL.md#L609-L610)) | Una sola fila `🔒 Seguridad │ <sev> │ <N> hallazgos`, en lugar de las tres variantes PASS/FAIL/omitido. |
| Salida ([L637-640](skills/story-code-review/SKILL.md#L637-L640)) | Agregar `.tmp/story-code-review/{story_id}/security-report.md`; **eliminar** la fila `.tmp/security-audit/<basename>/audit-report.md`. |

---

## 3. `assets/code-review-report-template.md`

- Frontmatter `reviewers:` ([L8-11](skills/story-code-review/assets/code-review-report-template.md#L8-L11)) → agregar `- security-reviewer`.
- Fila "Revisores" del Resumen ([L23](skills/story-code-review/assets/code-review-report-template.md#L23)) → agregar `Security-Reviewer`.
- Nueva sección tras "Integración y Arquitectura" ([L45](skills/story-code-review/assets/code-review-report-template.md#L45)), con el mismo formato que las otras tres dimensiones:

```markdown
### Seguridad (Security-Reviewer)

{{SECURITY_FINDINGS}}
```

---

## 4. `evals/evals.json`

- En los 6 casos que lo declaran, renombrar `agent_results.security_audit_status: "pass"|"fail"` → `security_max_severity: "ninguna"|"HIGH"` (mismo vocabulario que los otros tres agentes).
- **TC-002**: hoy mezcla `security_audit_status: "fail"` con un hallazgo del tech-lead. Dejar `security_max_severity: "ninguna"` para que el caso siga probando exactamente lo que dice su nombre (hallazgo HIGH del Tech-Lead).
- **Caso nuevo TC-008 — `seguridad-sin-checklist-usa-baseline`** (`type: happy-path`): historia en `IMPLEMENT/DONE` sin checklists de seguridad ni skill de seguridad en el contexto; el Security-Reviewer usa el baseline embebido y no encuentra hallazgos.
  `expected.contains`: `["approved", "baseline", "security-reviewer", "CODE-REVIEW", "DONE"]`;
  `expected.not_contains`: `["security-audit", "needs-changes", "fix-directives.md"]`;
  `threshold: 0.85`.
- Actualizar el `description` de nivel raíz para reflejar 4 agentes locales.

---

## 5. `CHANGELOG.md`

Entrada bajo `## [Unreleased]`, siguiendo el estilo narrativo existente:

```markdown
### Changed

- **`story-code-review` deja de depender de `security-audit`** — el Participante 4 pasa de ser una
  invocación al skill `security-audit` a un agente local propio,
  `skills/story-code-review/agents/security-reviewer.agent.md`. El agente descubre los checklists de
  seguridad disponibles en el contexto (`docs/policies/*security-checklist*.md`, o el
  `assets/security-checklist.md` de un `security-audit` instalado, que lee como fuente de reglas sin
  invocarlo — ADR-0002 prohíbe subagente → skill orquestador) y cae a un baseline embebido de 8
  reglas si no encuentra ninguno. Los cuatro revisores comparten ahora el mismo contrato
  (`max-severity`), eliminando la lógica dual de `$SECURITY_STATUS` (pass/fail/skipped) del Paso 4.
  `security-audit` sigue existiendo sin cambios como skill independiente.
```

---

## Verificación

Este repo no tiene tests ni build (`package.json` solo declara `postinstall`), así que la verificación es documental + ejecución real del skill:

1. **Coherencia de referencias** — no debe quedar ninguna mención a `security-audit` dentro del skill:
   ```bash
   grep -rn "security-audit\|SECURITY_STATUS\|audit-report" skills/story-code-review/
   ```
   Resultado esperado: sin coincidencias (salvo la mención explícita "no invocar el skill de seguridad" en las Reglas del agente).
2. **`security-audit` intacto** — `git diff --stat skills/security-audit/` debe salir vacío.
3. **Formato del agente nuevo** — frontmatter con `name`, `description`, `role`, `dimension`, `output`; comparar lado a lado con `tech-lead-reviewer.agent.md`.
4. **Ejecución end-to-end** en este mismo repo (dogfooding): tomar una historia en `IMPLEMENT/DONE` y correr `/story-code-review <STORY-ID>`. Verificar que:
   - se crean los **cuatro** informes en `.tmp/story-code-review/<story_id>/`, incluido `security-report.md`;
   - `security-report.md` cita en `checklist-sources` los checklists de `docs/policies/` (este repo sí los tiene);
   - `code-review-report.md` contiene la sección `### Seguridad (Security-Reviewer)` y ya **no** contiene `## Security Audit`;
   - `.tmp/security-audit/` **no** se crea durante la ejecución.
5. **Fallback del baseline** — repetir contra un directorio sin `docs/policies/` para confirmar `checklist-sources: baseline-embebido`.
6. **Encoding** — todos los `.md` guardados en UTF-8 sin BOM (restricción del propio SKILL.md); verificar que no aparecen `Ã³` ni `ðŸ"–`.

> **Nota de convención (fuera de alcance):** los tres agentes existentes declaran `output: .tmp/story-code-review/<x>-report.md` mientras el SKILL.md usa `.tmp/story-code-review/{story_id}/<x>-report.md`. El agente nuevo replica la convención de sus hermanos para no introducir una tercera variante; unificar esa discrepancia es un cambio aparte.
