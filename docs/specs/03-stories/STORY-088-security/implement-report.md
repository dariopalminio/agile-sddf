Cambios aplicados:

Nuevo agente — security-reviewer.agent.md, cuarto agente local del skill, con el mismo molde que sus tres hermanos (name/role/dimension/output, estándar de aprobación duplicado, mismo contrato de informe). Su flujo:

Resuelve el alcance desde $IMPL_FILES → tasks.md → omite con max-severity: ninguna (nunca corre git diff por su cuenta).
Descubre checklists acumulativamente: docs/policies/references/*security-checklist*.md + los enlazados desde constitution/DoD, y el security-audit/assets/security-checklist.md de un skill de seguridad instalado bajo skills/, .claude/skills/, .agents/skills/, .github/skills/.
Si no hay ninguno → baseline embebido de 8 reglas (secretos, inyección, eval dinámico, autorización ausente, TLS deshabilitado, PII en logs, path traversal, HTML sin sanitizar).
Normaliza severidades externas (CRITICAL|HIGH→HIGH, MEDIUM|error→MEDIUM, LOW|warn→LOW) y escribe security-report.md con checklist-sources y rules-evaluated.
Regla explícita en el agente: el checklist del skill instalado se lee, no se invoca — ADR-0002 prohíbe subagente → skill orquestador.

SKILL.md — Dependencias: Skills: [skill-preflight] (sin security-audit); Paso 3b lanza cuatro agentes y ahora pasa $REPO_PATH e $IMPL_FILES; Pasos 4a/4b/4c eliminan $SECURITY_STATUS y $SEC_AUDIT_REPORT — la seguridad contribuye por max-severity como cualquier revisor, con el mismo fail-safe HIGH si falta el informe; Paso 5b sustituye la sección inyectada ## Security Audit por el placeholder {{SECURITY_FINDINGS}}; Paso 7 y Salida actualizados. Neto: −54/+98 líneas, la mayor parte eliminación de la lógica dual.

También: template con el 4º reviewer y la sección ### Seguridad; evals.json con el contrato renombrado a security_max_severity y un TC-008 nuevo para el fallback al baseline; entrada en [Unreleased] del CHANGELOG.

Verificado: git diff --stat skills/security-audit/ vacío (intacto); sin referencias residuales a security-audit/SECURITY_STATUS/audit-report en el skill salvo las dos intencionales (la lectura del checklist en el agente y el not_contains de TC-008); evals.json parsea con 8 casos; sin BOM ni mojibake.

No ejecuté la verificación end-to-end (puntos 4–5 del plan): correr /story-code-review muta el frontmatter de una historia real (IMPLEMENT/DONE → CODE-REVIEW/DONE) y el WIP del repo. Hay cuatro candidatas listas — STORY-062, STORY-065, STORY-067, STORY-077 — si querés que lo corra contra alguna, decime cuál.


El skill security-audit fue removido del repositorio.
