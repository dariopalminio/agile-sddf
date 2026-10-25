---
type: code-review-report
story: STORY-090
title: "Code Review Report: Todo campo declarado en un template nombra a su escritor"
review-status: needs-changes
date: 2026-09-11
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

<!-- Referencias -->
[[STORY-090-campos-declarados-nombran-su-escritor]]

# Code Review Report: STORY-090

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-090 — Todo campo declarado en un template nombra a su escritor |
| Review status | **needs-changes** |
| Severidad máxima detectada | **MEDIUM** |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (33 casos — UT:16/CT:0/IT:10/API:0/E2E:3/EV:4) |
| Fecha | 2026-09-11 |

### Severidad por dimensión

| Dimensión | Agente | Status | Severidad máxima | Hallazgos |
|---|---|---|---|---|
| Calidad de Código | Tech-Lead-Reviewer | needs-changes | MEDIUM | 0 HIGH · 1 MEDIUM · 6 LOW |
| Cobertura de Requisitos | Product-Owner-Reviewer | approved | LOW | 0 HIGH · 0 MEDIUM · 5 LOW |
| Integración y Arquitectura | Integration-Reviewer | needs-changes | MEDIUM | 0 HIGH · 1 MEDIUM · 4 LOW |
| Seguridad | Security-Reviewer | approved | LOW | 0 HIGH · 0 MEDIUM · 2 LOW |
| DoD CODE-REVIEW | (árbitro) | needs-changes | MEDIUM | 3 MEDIUM · 1 LOW |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

**Veredicto:** `needs-changes` — el código entregado es correcto, legible y consistente con las convenciones del repo, pero los dos archivos de evals no son alcanzables por el runner declarado y colisionan en IDs con los evals canónicos de los skills, de modo que la única cobertura automatizada de la historia produciría una señal verde falsa en `story-verify`.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | `evals/story-creation.evals.json:1` · `evals/story-improve.evals.json:1` | Los 6 casos `TC-NNN` no son ejecutables por el runner que declara `implement-report.md`. El Paso E1 del modo `evals` resuelve `$CLI_ROOT/skills/{arg}/`, exige `SKILL.md` en esa ruta y `evals/evals.json` con ese nombre exacto; estos archivos viven en el directorio de la historia con nombre `<skill>.evals.json`. El comando declarado ejecutaría los casos preexistentes y devolvería verde sin probar nada de STORY-090. Los IDs `TC-001..TC-003` además colisionan con los canónicos. | Fusionar los casos en `skills/story-creation/evals/evals.json` y `skills/story-improve/evals/evals.json` renumerando los IDs, o documentar el comando real y corregir la afirmación de `implement-report.md` |
| LOW | `scripts/migrate-finvest-field.js:231` | `process.exit(blocked > 0 ? 1 : 0)` tras ~90 `console.log`: con stdout redirigido Node escribe de forma asíncrona y puede truncar la tabla o el resumen | Usar `process.exitCode = blocked > 0 ? 1 : 0;` |
| LOW | `scripts/migrate-finvest-field.js:190-195` | El `catch` que envuelve `analyzeStory` + `fs.writeFileSync` clasifica un fallo de **escritura** como `ERROR LECTURA` — diagnóstico engañoso justo cuando el archivo pudo quedar a medias | Añadir `RESULT.ERROR_ESCRITURA` y separar el `try` de lectura del de escritura |
| LOW | `docs/specs/templates/project-template.md:112` y su seed | `·` (U+00B7) inicial impide que Markdown reconozca el heading `## 2.3.`; el patrón §5 de la constitución hace que los skills extraigan secciones leyendo headings. **Preexistente** (`51bcb81`), pero esta historia editó esa línea para añadir la anotación `escritor:` | Confirmar con el autor si se corrige como drive-by o se abre aparte; no modificarlo en silencio durante la revisión |
| LOW | `scripts/migrate-finvest-field.js:1-235` | Script de un solo uso, ya aplicado, que queda permanente en `scripts/`, directorio publicado vía `files` de `package.json`. Hay precedente (`normalize-preflight-paso0.js`), por lo que no se trata como defecto de empaquetado | Confirmar con el autor si conservarlo, moverlo o excluirlo de `files`; no eliminarlo en silencio |
| LOW | `scripts/migrate-finvest-field.js:190-191` | La escritura masiva es el comportamiento **por defecto** (`--dry-run` es opt-in), sin confirmación ni respaldo; la reversibilidad depende de git, que aquí quedó mezclada (desviación V-8). Mitigado por idempotencia, exit 1 ante dudas y parada en `REQUIERE DECISIÓN` | Opcional: invertir el default (`--apply`) o avisar con el número de archivos antes de la primera escritura |
| LOW | `testcases.md:42-47` | UT-001..UT-010 (lógica de `isEmptyValue`, regla CR-001, grafía no prevista → dato real) no tienen contraparte automatizada: `implement.test_generators[unit].skill: none` y la verificación fue manual sobre fixtures en `.tmp/` | Aceptable como decisión de proyecto; si el script se conserva, valorar un test mínimo sobre fixtures versionados |

**Notas de verificación sin hallazgo:** `node --check` OK; sin `TODO`/`FIXME`, secretos, dependencias nuevas ni código muerto; sin BOM. Algoritmo verificado contra el diff real: 38 archivos, 137 borrados, y todas las líneas eliminadas ajenas al bloque FINVEST pertenecen a `STORY-089/story.md` (reeditada por el usuario en el mismo commit) — sin daño colateral. Los 5 canónicos, sus 5 seeds y las copias instaladas en `.claude/skills/` son `diff`-idénticos; evidencia V-1 reproducida (13/14/12/17/17). `STORY-067/finvest-evaluation-report.md` reconstruido con frontmatter suficiente para sus consumidores reales. Principio 13 y `story-evaluation` Paso 7 respetan el formato vecino.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

**Veredicto:** `approved` — los tres escenarios Gherkin y los cinco ACs están cubiertos con verificación observable y reproducible sobre el repositorio, incluidas la detención sin pérdida de datos de AC-2 y la idempotencia (reconfirmada ejecutando el script); los únicos huecos son de severidad LOW.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | `evals/story-creation.evals.json:1` · `evals/story-improve.evals.json:1` | Los 6 casos `TC-NNN` están especificados pero no ejecutados: `verify.eval.command: npm run test:eval` no existe en `package.json`. El `Entonces` "ninguna ejecución de story-creation… vuelve a escribir el campo" está probado de forma estática, no por instanciación real (V-4 "✓ estático") | Ejecutar `/skill-test-evals evals story-creation` y `story-improve` en `story-verify` |
| LOW | `evals/story-creation.evals.json:TC-003` | Hay caso para `story-creation` y para el fallback §4c de `epic-generate-stories`, pero ninguno instancia `epic-generate-all-stories`. `testcases.md` lo declara como gap aceptado y el grep del literal en su `SKILL.md` es vacío | Aceptable: delega en el mismo flujo. Si TC-003 falla en `story-verify`, extender al tercer escritor |
| LOW | `.tmp/story-090/` | La evidencia ejecutable de AC-2 y de los UT vive fuera del control de versiones; con el árbol ya migrado la detención no es reproducible sin restaurar fixtures | Conservar `v6-run-real-sin-resolver.txt` / `dry-run-1.txt` como anexo de `story-verify` |
| LOW | Checklist "Test Cases Progress" | Las 33 entradas siguen en `[ ]` pese a la verificación documentada de V-1..V-7 y V-9..V-11. Ninguna en `[!]` | Marcar `[x]` los casos con evidencia durante `story-verify` |
| LOW | NFR-3 / IT-009 | IT-009 ("el commit de migración está aislado") no puede pasar: el working tree se commiteó completo. V-8 lo registra como desviación aceptada; la reversibilidad se conserva vía `git revert` parcial. No afecta a ningún AC | Reescribir IT-009 para verificar reversibilidad por ruta, o marcarlo N/A |

**Cobertura verificada de forma independiente en HEAD** (grep, diff y ejecución real del script en `--dry-run`):

| AC | Casos que lo referencian | E2E/IT presente |
|----|--------------------------|-----------------|
| AC-1 (escenario principal) | E2E-001, IT-003, IT-004, IT-005, IT-007, IT-010, EV-001..EV-004 | ✓ E2E + IT |
| AC-2 (escenario alternativo) | E2E-002, UT-007..UT-011 | ✓ E2E |
| AC-3 (escenario de error) | E2E-003, IT-006 | ✓ E2E + IT |
| AC-4 (principio 13) | IT-008 | ✓ IT |
| AC-5 (anotación de escritor) | E2E-003, IT-001, IT-002, IT-006 | ✓ E2E + IT |

Ningún AC queda sin caso referenciado; ninguno queda cubierto solo con UT. `node scripts/migrate-finvest-field.js --dry-run` ejecutado durante la revisión: 82 historias · 0 MIGRADA · 82 SIN CAMBIOS · exit 0 → idempotencia confirmada en vivo.

---

### Integración y Arquitectura (Integration-Reviewer)

**Veredicto:** `needs-changes` — la arquitectura, los cinco templates anotados, la resolución D-4 y el principio 13 son consistentes con `design.md`, pero el script de migración amplía el contrato de detección definido en D-3 sin registrar el cambio y en contradicción con el caso UT-004 especificado.

#### Conformidad estructural

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | `scripts/migrate-finvest-field.js:121,128` | Desviación del contrato "CLI de migración" (D3): D3 exige detectar **exactamente** las tres líneas inmediatamente tras el `---` de cierre y reportar `FORMA INESPERADA` en cualquier otra forma. La implementación tolera líneas en blanco intermedias (l.121) y bloque sin `---` separador (l.128). Documentada en el docblock y en `implement-report.md` (STORY-080), pero **sin CR en `design.md`**, y contradice UT-004, que exige `FORMA INESPERADA` para "bloque incompleto": con el código actual ese fixture devuelve `MIGRADA` | Añadir `CR-002` en `design.md` ampliando el contrato de D3, y actualizar UT-004 en `testcases.md`; o restringir el script a la forma canónica y tratar STORY-080 como caso manual |
| LOW | `scripts/migrate-finvest-field.js:60` | `BLOCKING_RESULTS` incluye `ERROR LECTURA` como causa de exit 1; D3 declara exit 1 solo para `REQUIERE DECISIÓN` y `FORMA INESPERADA`. Coherente con UT-012, pero el texto de D3 quedó desalineado | Alinear la fila "Salida" de D3 (mismo CR) |
| LOW | `scripts/migrate-finvest-field.js:96` | Un directorio `STORY-*` sin `story.md` (STORY-084/085) se clasifica como `SIN CAMBIOS`; D3 no contempla ese estado de entrada | Documentar el caso en la fila "Entrada" o "Regla de decisión" de D3 |
| LOW | `implement-report.md:61` | D8 (tres commits, NFR-3) no se cumplió. Además el hash citado (`acc7922`) ya no existe en el historial (HEAD: `244550b`), por lo que IT-009 queda inejecutable tal como está escrito | Actualizar la referencia de commit y marcar IT-009 como N/A por la desviación aceptada |
| LOW | `docs/specs/03-stories/STORY-075-integrar-historia-modo-manual-dryrun/story.md.bak:0` | Archivo versionado que conserva el bloque `**FINVEST Score:**` retirado. No es `story.md` ni template (fuera de AC-1 y V-5), pero es un residuo de backup dentro del árbol de historias | Eliminar el `.bak` del control de versiones en una tarea de limpieza aparte |

**Verificaciones conformes:** las 5 parejas canónico↔seed con `diff` vacío; ninguna clave de frontmatter de los cinco templates sin `# escritor:` (verificado con `awk`), con el comentario `<!-- escritor del cuerpo: … -->` en los cinco y excepciones locales donde el escritor difiere; gramática conforme a D-1 (separador ` · `); sin fuga de anotaciones a documentos generados; literal FINVEST ausente de templates, seeds e historias; D-4 conforme para STORY-067/078; equivalencia SPECIFY/DONE ⇔ APROBADA documentada (D-5); principio 13 en `constitution.md:228` con el formato de los 12 anteriores; `story-improve`/`story-split` sin cambios y sin acoplamiento nuevo; los diez componentes de la tabla "Componentes afectados" presentes en su ruta declarada.

#### Trazabilidad de diseño en testcases.md

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| — | — | Trazabilidad de diseño correcta en testcases.md | — |

Los `Ref` usan `D-1..D-8`, todos correspondientes a decisiones existentes (`### D1`…`### D8`; la diferencia de guion es consistente y está explicada en las notas de convenciones). Sin referencias huérfanas. Los `V-1…V-11`, los `T-x.y` y `CR-001` existen. Los diez `IT-001…IT-010` llevan al menos una referencia a diseño; no hay casos de tipo API.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** `docs/guardrails/gr-code-security-checklist.md`, `docs/guardrails/gr-ai-security-checklist.md`, `.claude/skills/security-audit/assets/security-checklist.md` (72 reglas evaluadas)

**Veredicto:** `approved` — el cambio no introduce ninguna exposición real de seguridad: sin secretos, sin ejecución dinámica, sin red, sin dependencias nuevas y con el manejo de rutas confinado a la raíz que suministra quien invoca; los dos hallazgos LOW son endurecimiento recomendado que no debe bloquear el merge.

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | `scripts/migrate-finvest-field.js:178` | `gr-code` semántica (mensajes de error sin rutas absolutas del host) | El `console.error` interpola `STORIES_DIR`, que es una ruta absoluta (`path.resolve`, l.69). Las líneas 102 y 194 propagan además `err.message` de `fs`, que en Node incluye la ruta absoluta. La cabecera de l.211 sí usa `path.relative`: la inconsistencia está solo en el camino de error | Emitir `path.relative(process.cwd(), STORIES_DIR)` en l.178 y sanear `err.message` (o usar `err.code`) en l.102 y 194 |
| LOW | `scripts/migrate-finvest-field.js:190-191` | `gr-ai` semántica (paso irreversible tras confirmación explícita) | El script reescribe `story.md` in situ sin confirmación ni respaldo, y la escritura es el modo **por defecto**. `scripts/` se publica en npm. Mitigantes reales: `bin` solo expone `scripts/cli.js`, el `postinstall` no lo invoca, y los destinos están versionados en git | Endurecimiento opcional: escribir solo con `--write`/`--apply`, o confirmación interactiva cuando `!DRY_RUN && process.stdout.isTTY`. No debe bloquear el merge |

**Sin hallazgo:** todas las reglas deterministas de `gr-code` y `gr-ai` imprimen vacío sobre el alcance. El script solo requiere `fs` y `path` — sin dependencias nuevas, red, `child_process`, `eval`, SQL, deserialización, `process.env` ni secretos. **Path traversal verificado y correcto:** los nombres vienen de `readdirSync(..., {withFileTypes:true})` filtrados por `isDirectory() && /^STORY-/`, no pueden contener separadores, y `Dirent.isDirectory()` descarta symlinks, de modo que ningún `path.join` escapa de la raíz. Regex lineales (sin ReDoS) y claves de `counts` provenientes de constantes fijas (sin contaminación de prototipo). Tres falsos positivos descartados con justificación: `sec-no-absolute-path` en l.43 coincide con la secuencia `n:\` del literal regex; `ai-no-home-path` fuera del ámbito de la regla y preexistente (`472d4ae`); `ai-confirm-before-irreversible` son las excepciones ya documentadas en el propio guardrail. El skill `security-audit` **no fue invocado**: solo se leyó su checklist.

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (54 archivos modificados). Considera ejecutar `/story-split` antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

> Contexto: 38 de los 54 archivos son `story.md` tocados por la migración automatizada de una sola línea cada uno, no lógica nueva.

---

### Cobertura de Casos de Prueba (testcases.md)

✓ Analizado — 33 casos (UT:16 / CT:0 / IT:10 / API:0 / E2E:3 / EV:4). La ausencia de CT/API está justificada en las notas del propio documento (sin componentes UI ni endpoints).

**Cobertura de ACs (Product-Owner-Reviewer):** los cinco ACs tienen al menos un caso E2E o IT referenciado; ninguno queda cubierto solo con UT. Hallazgos LOW: las 33 entradas del checklist "Test Cases Progress" siguen en `[ ]` (ninguna en `[!]`); IT-009 no puede pasar por la desviación aceptada de NFR-3; falta un caso propio para `epic-generate-all-stories` (gap declarado y aceptado).

**Trazabilidad de diseño (Integration-Reviewer):** correcta — todas las referencias `D-N`, `V-N`, `T-x.y` y `CR-001` apuntan a elementos existentes en `design.md` y `tasks.md`; sin referencias huérfanas. Salvedad: `UT-004` especifica `FORMA INESPERADA` para el bloque sin `---` de cierre, comportamiento que el script implementado no produce (ver hallazgo MEDIUM de integración).

---

## Decisión final

**review-status: needs-changes**

La implementación es sólida en lo sustantivo: los tres escenarios Gherkin y los cinco criterios de aceptación están cubiertos con verificación observable y reproducible sobre el repositorio —la migración es idempotente (reconfirmada en vivo con `--dry-run`: 0 MIGRADA · 82 SIN CAMBIOS · exit 0), la parada ante datos reales sin reporte funciona con las dos historias reales del repositorio, el dato de STORY-067 quedó preservado, los cinco templates están anotados y son `diff`-idénticos a sus seeds, y el principio 13 respeta el formato de los doce anteriores. La auditoría de seguridad no encontró ninguna exposición real sobre 72 reglas evaluadas.

La revisión no aprueba por dos hallazgos MEDIUM que comparten la misma raíz — **una afirmación de verificación que no se sostiene**:

1. **Los evals no prueban lo que dicen probar.** Los 6 casos `TC-NNN` viven fuera de la ruta que resuelve el runner declarado y colisionan en IDs con los evals canónicos, de modo que `/skill-test-evals evals story-creation` devolvería verde ejecutando otros casos. Siendo la única cobertura automatizada de la historia, `story-verify` recibiría una señal falsa — exactamente lo que el principio §3 de la constitución ("obligar a demostrar, no declarar") existe para impedir.
2. **El script amplía el contrato de D3 sin registrarlo.** La tolerancia a líneas en blanco y a bloques sin `---` separador es una decisión razonable y está documentada en el docblock, pero no se registró como CR en `design.md` y deja `UT-004` especificando un comportamiento que el código no produce. El diseño y la especificación de pruebas describen hoy un script distinto del entregado.

Ninguno de los dos cuestiona el resultado de la migración, ya verificado por otras vías; ambos afectan a la capacidad de **demostrarlo de nuevo**. Son correcciones de documentación y de ubicación de archivos, no de lógica.

Los nueve hallazgos LOW restantes quedan registrados sin bloquear, incluidas dos desviaciones ya aceptadas por decisión del usuario (NFR-3 / commit no aislado) y dos candidatos a *drive-by* que requieren confirmación del autor antes de tocarlos (el `·` espurio en `project-template.md`, el `.bak` versionado de STORY-075).

---

## Siguiente acción

1. Aplica las correcciones de `fix-directives.md` (2 hallazgos de agentes; los 3 criterios DoD se satisfacen al resolverlos).
2. Limita los cambios a la lista blanca de ese archivo.
3. Re-ejecuta `/story-code-review STORY-090`.
4. Con `approved`, la historia avanza a `CODE-REVIEW/DONE` y queda lista para `/story-verify`.

Estado actual: `story.md` retrocede a **READY-FOR-IMPLEMENT/DONE** y se registró la tarea "Implementar fix-directives.md" en `tasks.md`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Definition of Done para el estado IMPLEMENT es satisfactorio | ❌ | LOW | `implement-report.md` › DoD IMPLEMENT no registra ningún `❌`, pero deja `CHANGELOG` como pendiente explícito y `CHANGELOG.md` no contiene entrada para esta historia (verificado: sin sección `[Unreleased]`). El resto de los `⚠️` (linter, CI, checklists de seguridad formales) no son evaluables desde los artefactos |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead: kebab-case, Node sin dependencias, UTF-8 sin BOM, sin TODOs ni código muerto; Integration: principio 13 en `constitution.md:228` con el formato de los 12 anteriores |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: 3/3 escenarios verificados de forma independiente en HEAD (grep, diff y ejecución real del script); los tres `Entonces` de cada uno confirmados |
| 4 | Los componentes respetan la arquitectura de `design.md` | ❌ | MEDIUM | Integration: `scripts/migrate-finvest-field.js:121,128` amplía el contrato de detección de D3 sin CR registrado y en contradicción con UT-004 |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ❌ | MEDIUM | 2 hallazgos MEDIUM: evals inalcanzables por el runner (code-quality) y contrato D3 ampliado sin CR (integration-architecture) |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | 37/37 tareas en `[x]`, ninguna `[ ]` al iniciar la revisión (la tarea "Implementar fix-directives.md" la añade este mismo gate) |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter con `id`, `slug`, `title`, `parent`, `related`, `created`, `updated`; `status`/`substatus` transicionados por este skill |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este documento |
| 9 | Revisión de código aprobada (Review status approved en `code-review-report.md`) | ❌ | MEDIUM | `review-status: needs-changes` por los dos hallazgos MEDIUM del criterio 5 |

**Resumen:** 5/9 criterios ✓ · 4 ❌ (3 MEDIUM · 1 LOW)

> Los criterios 5 y 9 son consecuencia directa de los hallazgos de agentes: se satisfacen al resolver los dos MEDIUM, sin trabajo propio. El criterio 4 se cierra con el `CR-002` en `design.md`.
