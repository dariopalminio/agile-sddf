---
type: implement-report
id: STORY-088
slug: STORY-088-skill-security-audit-condicional-implement-report
title: "Reporte de Implementación security-enhancement"
story: STORY-088
created: 2026-09-03
updated: 2026-09-03
---

# Reporte de Implementación security-enhancement

## Desacopla `story-code-review` del skill `security-audit`

Cambios aplicados:

Nuevo agente — security-reviewer.agent.md, cuarto agente local del skill, con el mismo molde que sus tres hermanos (name/role/dimension/output, estándar de aprobación duplicado, mismo contrato de informe). Su flujo:

Resuelve el alcance desde $IMPL_FILES → tasks.md → omite con max-severity: ninguna (nunca corre git diff por su cuenta).
Descubre checklists acumulativamente: docs/policies/*security-checklist*.md + los enlazados desde constitution/DoD, y el security-audit/assets/security-checklist.md de un skill de seguridad instalado bajo skills/, .claude/skills/, .agents/skills/, .github/skills/.
Si no hay ninguno → baseline embebido de 8 reglas (secretos, inyección, eval dinámico, autorización ausente, TLS deshabilitado, PII en logs, path traversal, HTML sin sanitizar).
Normaliza severidades externas (CRITICAL|HIGH→HIGH, MEDIUM|error→MEDIUM, LOW|warn→LOW) y escribe security-report.md con checklist-sources y rules-evaluated.
Regla explícita en el agente: el checklist del skill instalado se lee, no se invoca — ADR-0002 prohíbe subagente → skill orquestador.

SKILL.md — Dependencias: Skills: [skill-preflight] (sin security-audit); Paso 3b lanza cuatro agentes y ahora pasa $REPO_PATH e $IMPL_FILES; Pasos 4a/4b/4c eliminan $SECURITY_STATUS y $SEC_AUDIT_REPORT — la seguridad contribuye por max-severity como cualquier revisor, con el mismo fail-safe HIGH si falta el informe; Paso 5b sustituye la sección inyectada ## Security Audit por el placeholder {{SECURITY_FINDINGS}}; Paso 7 y Salida actualizados. Neto: −54/+98 líneas, la mayor parte eliminación de la lógica dual.

También: template con el 4º reviewer y la sección ### Seguridad; evals.json con el contrato renombrado a security_max_severity y un TC-008 nuevo para el fallback al baseline; entrada en [Unreleased] del CHANGELOG.

Verificado: git diff --stat skills/security-audit/ vacío (intacto); sin referencias residuales a security-audit/SECURITY_STATUS/audit-report en el skill salvo las dos intencionales (la lectura del checklist en el agente y el not_contains de TC-008); evals.json parsea con 8 casos; sin BOM ni mojibake.

No ejecuté la verificación end-to-end (puntos 4–5 del plan): correr /story-code-review muta el frontmatter de una historia real (IMPLEMENT/DONE → CODE-REVIEW/DONE) y el WIP del repo. Hay cuatro candidatas listas — STORY-062, STORY-065, STORY-067, STORY-077 — si querés que lo corra contra alguna, decime cuál.


El skill security-audit fue removido del repositorio.

## SECURITY.md Added
 
 Creado SECURITY.md en la raíz, adaptado del SECURITY.md de agile-sddf-extension — misma tesis y estructura, con los hechos de este repo verificados uno por uno.

Lo que cambió respecto de la referencia:

Scope — describe lo que este paquete realmente distribuye: skills/, agents/, docs/policies/ y los cuatro scripts Node de scripts/.
Supported versions — main + 2.x en npm; 1.x sin soporte porque 2.0.0 rompió compatibilidad sin alias, con enlace a la migración del README. Se explica que el instalador copia (no enlaza), así que actualizar es reinstalar.
Threat model — ocho filas, todas con rule ids que existen de verdad en los dos guardrails. No incluye las filas ai-locked-skill-* de la referencia: dependen de skills-lock.json, que este repo no tiene, y declararlas sería describir un control inexistente. En su lugar, los dos párrafos que pedía SEC-081: OWASP A08 (el postinstall ejecuta installSDDF y copia al directorio del usuario antes de que nadie lea nada — con la salida --ignore-scripts documentada) y OWASP A06 (una sola dependencia directa, fs-extra, node >= 18).
How this repository is validated — tabla con el estado real de cada control. Trivy activo; Skill Shielder marcado como limitación conocida: filtra por .claude/skills/**, que tiene 0 archivos trackeados, mientras los 151 archivos de skills viven en skills/. Los guardrails y el skill security-audit propio se corren a mano.
Coordinated disclosure — añade la versión npm que lleva el fix, además del advisory y el CHANGELOG.
Verificado:

Los 13 rule ids citados existen en los checklists; cero menciones a ai-locked-skill-*.
Las 6 rutas enlazadas y el ancla #upgrading-desde-1x del README existen.
El snippet documentado produce un script de 39 líneas con sintaxis válida.
Corrí los dos guardrails sobre el árbol: SECURITY.md no aparece en ningún hallazgo. (Sí hay findings preexistentes ajenos a este cambio: 7 ai-confirm-before-irreversible en docs/runbooks/specs — es regla (warn) — y 3 sec-gitignore-coverage (error) por .agents, .temp y __pycache__ sin ignorar.)
Afirmaciones sobre CI y versiones contrastadas con git ls-files, git tag y package.json (2.0.2, fs-extra, >=18.0.0).
UTF-8 sin BOM, sin mojibake, única URL externa en https://.
No ejecuté el paso 8 del plan (re-correr /security-audit --repo . para ver SEC-081 pasar a ✅): es una ejecución multiagente completa que reescribe .tmp/security-audit/. Decime si querés que la corra.

Dos cosas que quedan señaladas y no toqué, por si querés abordarlas aparte: el path filter de skill-security-audit.yml, y los 3 sec-gitignore-coverage en (error).

## Cerrar los 8 hallazgos `(warn)` del `ai-security-checklist`

Plan aplicado. Los 8 hallazgos (warn) quedan cerrados: 2 corregidos, 6 justificados.

Corregidos

deployment-to-npm.md — añadido un paso de confirmación obligatorio antes de npm publish, con cuatro comprobaciones (dry-run que lista los archivos, versión no publicada, tag y release existentes, entrada de CHANGELOG) y la regla explícita de que un agente debe pedir aprobación al mantenedor y falla cerrado sin respuesta afirmativa. El comando queda ahora en dos bloques: primero --dry-run, y npm publish solo tras confirmar.

best-practices-for-testing.md:198 — no se pudo cambiar a https://: extremeprogramming.org presenta un certificado de *.m3xs.net, así que HTTPS falla en ese host. Como preveía el plan, sustituí la referencia por el artículo de Martin Fowler sobre TDD, que cubre la misma práctica test-first y sí sirve por HTTPS (verificado).

Justificados — nueva sección ### Accepted exceptions en ai-security-checklist.md, dentro de Verification, con una fila por hallazgo: archivo, línea, regla y por qué no aplica. No toqué ninguna regla, peso ni comando del script. El control compensatorio es que cada fila fija archivo y línea, así que un cambio en ese archivo caduca la excepción; queda escrito que una excepción caducada se borra, no se actualiza.

Encoding — STORY-039/story.md reconvertido de CP-1252 a UTF-8 sin BOM, con los 59 CRLF preservados. ú, ó, á y el guion largo – se decodifican correctamente.

Verificado

Guardrail de IA: ai-confirm-before-irreversible baja de 7 a 6 líneas, y esas 6 son exactamente las 6 filas de la tabla de excepciones. ai-https-only ya no imprime nada.
Las 7 reglas (error) siguen limpias.
Cada línea citada en la tabla de excepciones sigue disparando su regla (comprobado línea a línea).
Guardrail de código sin regresión: siguen los mismos 3 sec-gitignore-coverage preexistentes.
Un hallazgo que encontré y no toqué: al menos cuatro story.md (STORY-007, STORY-012, STORY-039, STORY-046) tienen emojis de encabezado destruidos por una conversión de encoding anterior — aparecen como ## ? y ## ?? donde las otras 36 historias tienen ## ✅ Criterios de aceptación. Recuperarlos exige adivinar cuál era cada uno, y afecta a archivos fuera del alcance del plan, así que lo dejo como cambio aparte. También siguen abiertos los 3 sec-gitignore-coverage y el path filter de skill-security-audit.yml.