---
type: code-review-report
story: STORY-097
title: "Code Review Report: Verificar la consistencia de la memoria con un modo check apto para CI"
review-status: approved
date: 2026-09-23
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-097

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-097 — Verificar la consistencia de la memoria con un modo check apto para CI |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (19 casos — UT:11/CT:0/IT:2/API:0/E2E:2/EV:4) |
| Fecha | 2026-09-23 |

### Severidad por dimensión

| Dimensión | Agente | Severidad | Hallazgos |
|---|---|---|---|
| Calidad de Código | tech-lead-reviewer | LOW | 7 |
| Cobertura de Requisitos | product-owner-reviewer | LOW | 5 (3 en tests + 2 en testcases.md) |
| Integración y Arquitectura | integration-reviewer | LOW | 4 (3 estructurales + 1 trazabilidad) |
| Seguridad | security-reviewer | ninguna | 0 (66 reglas evaluadas) |

**Hallazgos bloqueantes (HIGH o MEDIUM): 0.**

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

#### Hallazgos

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/memory-system/scripts/memory-system.js:769-788 | El sobre de error JSON (`{ "ok": false, "error": … }`) se emite dentro de `runCheck`, es decir **después** de `parseArgs`. Un error de parseo con `--json` presente (`check --json` sin `--root`, flag mal escrito, valor ausente) sale con exit 2 y **stdout vacío**, lo que contradice la regla 5 del Paso 3.5 de `SKILL.md` ("el propio motor ya ha puesto `{ "ok": false, "error": "…" }` en stdout") y rompe el `jq -r ".error" memory-check.json` del snippet de CI de `docs/guides/sddf-commands-pipeline.md`. Los tres errores enumerados en D-4 (raíz inexistente, harness no admitido, Node < 18) sí están cubiertos, así que no hay contradicción con el diseño, solo con la guía. | Mover la emisión del sobre JSON a `main` (detectando `--json` en `argv` antes de validar), o acotar la redacción de `SKILL.md`/`sddf-commands-pipeline.md` a los errores posteriores al parseo. No bloquea. |
| LOW | skills/memory-system/scripts/memory-system.js:790-800 | Un error inesperado dentro de `check` (p. ej. `EACCES` al leer un nodo) se propaga a `main`, que devuelve **1** — indistinguible de "memoria con problemas" para el pipeline, justo la ambigüedad que D-4 quería evitar reservando el 2. El stderr sí lo distingue (`❌ error inesperado: …`) y ningún test cubre el borde. Ya está registrado como deuda en `implement-report.md` (*Borde del gate no cubierto*). | Confirmar con el autor si se deja como deuda explícita de STORY-098 o se convierte en exit 2 con un test de refuerzo. No eliminar ni cambiar el contrato en esta revisión. |
| LOW | skills/memory-system/scripts/memory-system.js:515-519 | `groupByKind` usa `byKind.get(entry.kind)?.push(entry)`: un problema cuya familia no esté en `CHECK_KINDS` se descarta en silencio. Como `checkMemory` cuenta `problems.length` pero construye el `summary` y el informe textual desde `groupByKind`, una familia nueva no registrada inflaría `problemas: N` sin aparecer en ninguna línea ni en el resumen. Hoy es inalcanzable (todas las llamadas a `problem()` usan literales de `CHECK_KINDS`), pero es una trampa para quien añada la quinta familia. | Sustituir el `?.` por un fallo ruidoso (lanzar o `assert`) cuando `kind` no esté en `CHECK_KINDS`, o derivar `CHECK_KINDS` de un único registro de evaluadores. Mejora opcional. |
| LOW | skills/memory-system/scripts/memory-system.js:536-540 | `skipLayers` del perfil de harness se consulta también con `ROOT_FILE` (`constitution.md`), que no es una capa sino un archivo: el nombre del campo deja de describir su contenido justo antes de que STORY-098 lo rellene con valores reales. | Documentar en `references/memory-rules.md` §1 que `skipLayers` admite además `constitution.md`, o separar la omisión del archivo raíz en su propia clave del perfil. |
| LOW | skills/memory-system/scripts/memory-system.js:576-581 | `assertRuntime()` solo se invoca desde `runCheck`, mientras la tabla de exit codes de `SKILL.md` presenta "Node < 18 → exit 2" como **común a todos los subcomandos**. `detect`, `index` y `scaffold` en Node < 18 no producen ese mensaje. | Llamar a `assertRuntime()` al principio de `main` (coste nulo, comportamiento homogéneo) o matizar en `SKILL.md` que la comprobación aplica a `check`. |
| LOW | skills/memory-system/references/memory-rules.md (§7, tabla de familias) | La nota dice que `path` es `<capa>/` para `missing-layer`, pero el problema de `constitution.md` se reporta **sin barra final** (`memory-system.js:538-539`, confirmado por `S097-UT-001`). Un consumidor que derive la capa quitando la `/` final se encuentra la excepción sin aviso. | Añadir "excepto `constitution.md`, que se reporta tal cual" a esa nota. |
| LOW | docs/guides/sddf-commands-pipeline.md (§ Gate de CI) · .github/workflows/ | El snippet de gate está documentado pero no cableado en ningún workflow, y aplicado a este repositorio hoy falla: `check --root docs` devuelve 46 problemas conocidos (exit 1) según `implement-report.md`. Copiar el snippet tal cual en `quality.yml` rompería el build. No parece un incumplimiento de la historia (el alcance es "modo apto para CI", no "activar el gate"), pero conviene que quede explícito. | Confirmar con el autor si el cableado pertenece a esta historia; si no, añadir una línea en la guía avisando de que el repositorio del framework aún no está en verde. Sin cambio de código. |

#### Veredicto

approved: el subcomando `check` está bien factorizado (cuatro evaluadores puros sobre un contexto explícito, un único escaneo, orden canónico determinista, solo lectura verificada por hash en `S097-UT-009`), sin secretos, sin dependencias nuevas, sin TODOs ni código muerto, con 13 tests `S097-` que cubren cada evaluador, ambos formatos de salida, los exit codes y los falsos positivos de wikilink; los siete hallazgos son bordes de contrato y precisión documental que no justifican bloquear el merge.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

#### Hallazgos — Cobertura de escenarios en tests

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | test/memory-system.test.js:712 | AC-4 enumera tres causas de exit 2 (raíz inexistente, harness no admitido, runtime incompatible). UT-010 (`S097-UT-010`) sólo ejercita las dos primeras; la guarda `runtime incompatible: se requiere Node >= …` (`scripts/memory-system.js:577-579`) no tiene aserción | Extraer la comprobación de versión a una función exportada y afirmar el `UsageError`, o dejar constancia explícita en `testcases.md` de que es verificación manual |
| LOW | skills/memory-system/scripts/memory-system.js:796 | Borde no cubierto (ya autodeclarado en `implement-report.md`): un error inesperado dentro de `check` (p. ej. `EACCES` al leer un nodo) no es `UsageError` y sale con exit 1, indistinguible de "memoria con problemas" para un pipeline de CI. Ningún test cubre este camino | Añadir un test que provoque un fallo de lectura y decidir si debe mapear a 2, o documentar explícitamente que 1 también cubre el error inesperado |
| LOW | skills/memory-system/evals/evals.json (TC-012) | Aserción debilitada por CR-006: `contains` pasó de la subcadena literal `"ok": false` a `"ok"` + `false` por separado. La semántica se preserva vía `not_contains` de ambas grafías de `ok: true` y el formato exacto lo fija `S097-UT-008` de forma determinista | Ninguna acción bloqueante; mantener UT-008 como guardián del formato byte a byte |

#### Cobertura verificada (sin hallazgos)

| AC / Escenario | Cobertura |
|----------------|-----------|
| AC-1 — Escenario principal (`check` determinista, 4 familias, sin escribir, exit 0/1) | `S097-E2E-001` (líneas del informe por familia, `problemas: 4 (…)`, `hashTree` idéntico antes/después, fixture sano con exit 0) + EV-001/EV-003 en la capa de skill |
| AC-2 — Escenario alternativo (`--json` para CI) | `S097-E2E-002` (objeto único, `ok: false`, `summary` por familia, `problems[]` con kind/path/detail, exit 1; tras corregir el wikilink `ok: true` y exit 0) y `S097-UT-008` (orden de claves `harness, root, ok, summary, problems`, orden canónico por (kind, path, detail), reproducibilidad byte a byte) + EV-002 |
| AC-3 — Cuatro familias y exclusiones | `S097-UT-001`/`UT-002` (missing-layer y `skipLayers`), `UT-003` (orphan), `UT-004` (`REQUIRED_FIELDS` por tipo, incl. `id`/`status` en project/epic/story), `UT-005` (broken-wikilink contra `slugSet`), `UT-006` (código inline, fence, alias, ancla, placeholder), `UT-007` (`templates/` y derivados excluidos) |
| AC-4 — Solo lectura y exit codes | `S097-UT-009` (hashes intactos con y sin `--json`, sin archivos nuevos), `S097-UT-010` (exit 2 + stderr + objeto `{ok:false,error}` en stdout) y EV-004 |
| NFR-1 determinismo / NFR-2 rendimiento / NFR-4 portabilidad | `S097-UT-008` (salidas idénticas y `path` sin `\`), `S097-UT-011` (< 5 s sobre `docs/`) |
| NFR-5 documentación | Verificado por lectura: `docs/architecture/memory-system.md` §10.4 (familias, `REQUIRED_FIELDS`, falsos positivos, esquema JSON) y `docs/guides/sddf-commands-pipeline.md` §0 (gate de CI con `jq` y exit codes) |

No hay escenarios Gherkin sin test, no hay `Scenario Outline` / `Ejemplos` en `story.md`, y el checklist "Test Cases Progress" no contiene ninguna entrada `[!]`.

#### Veredicto
approved: los dos escenarios Gherkin y los cuatro ACs tienen cobertura observable y en verde (E2E-001/E2E-002 más UT-001…UT-011 y EV-001…EV-004), y los únicos huecos son bordes de bajo valor (runtime incompatible, error inesperado interno) y desfases documentales en `testcases.md`.

---

### Integración y Arquitectura (Integration-Reviewer)

#### Hallazgos — Conformidad estructural

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/memory-system/scripts/memory-system.js:589 | El contexto de evaluación construido por `checkMemory` es `{ root, nodes, layers, profile, slugSet }`; `design.md` §Esquema de datos y §Interfaces declaran `(ctx: { nodes, layers, profile, slugSet }) → Problem[]`. La clave `root` es una extensión necesaria (solo `missingLayers` mira el disco), está justificada en el JSDoc y en el helper `checkCtx` de los tests, pero no se registró como CR — a diferencia de la extensión equivalente del nodo (`declared`, CR-005) | Añadir un CR en `design.md` (o ampliar CR-005) que fije el contexto como `{ root, nodes, layers, profile, slugSet }`, para que el contrato documentado y el implementado coincidan |
| LOW | skills/memory-system/scripts/memory-system.js:784-787, 796-798 | Un error inesperado dentro de `check` (p. ej. `EACCES` al leer un nodo) sale por `main` como exit **1**, indistinguible de "memoria con problemas" para un pipeline. Los tres errores técnicos que D-4 enumera (raíz inexistente, `--harness` no admitido, Node < 18) sí terminan en 2 vía `UsageError`, por lo que el contrato literal de AC-4 se cumple; el borde ya está registrado como deuda en `implement-report.md` | Mapear el error inesperado de `check` a exit 2 (o dejar constancia explícita en `memory-rules.md` §7 de que el 1 también cubre ese borde) y añadir un test del caso |
| LOW | skills/memory-system/references/memory-rules.md:256 | §7 afirma que para `missing-layer` el `path` es `<capa>/`, pero la entrada de `constitution.md` se emite sin barra final (`memory-system.js:539`, verificado por `S097-UT-001`) | Precisar en §7: `<capa>/` para las once capas y `constitution.md` para el archivo raíz |

Verificaciones con resultado conforme (sin hallazgo):

- **Contratos de `Interfaces`**: objeto JSON de `check` = `{ harness, root, ok, summary, problems }` con ese orden de claves (`runCheck`, `memory-system.js:775-782`; aserción de orden en `S097-UT-011`); `problems` ordenado por `(kind, path, detail)` con comparación ordinal (`sortProblems`); `path` relativo a `SPECS_BASE` con `/`.
- **`REQUIRED_FIELDS`** = `{ all: ['type','slug','title'], specs: ['id','status'] }` (`memory-system.js:490`), exportado en `module.exports` y documentado en `references/memory-rules.md` §6 y en `docs/architecture/memory-system.md` §10.4.
- **Exit codes 0/1/2**: `runCheck` devuelve 0/1; `assertRuntime` (Node < 18), `resolveRoot` (raíz inexistente) y `detectHarness` (`--harness` no admitido) lanzan `UsageError` dentro del `try`, de modo que `main` devuelve 2 y, con `--json`, stdout lleva `{ "ok": false, "error": … }` y una sola línea. Cubierto por `S097-UT-010`.
- **D-1**: `check` es subcomando del motor (`COMMANDS`), reutiliza `scanNodes`/`parseFrontmatter`/`LAYERS` y añade cuatro evaluadores puros en `EVALUATORS`; un único recorrido del árbol.
- **D-2**: `extractWikilinks` elimina fences antes que código inline, corta en `|` y `#`, descarta capturas vacías o con `<`/`>`; `templates/` sigue en `EXCLUDED_DIRS`. El orden normativo de los cuatro pasos está fijado en `memory-rules.md` §2.
- **D-3**: `invalidFrontmatter` evalúa `node.declared` (no el derivado), un problema por campo con `detail: "falta <campo>"`, `id`/`status` solo para `type ∈ {project, epic, story}` (`SPEC_TYPES`), y omite los nodos ya reportados como `orphan`.
- **D-4**: `renderCheckText` reproduce el formato de `design.md` (cabecera, `KIND_WIDTH` derivado, regla de 48 caracteres, línea `problemas: N (…)` solo con las familias no vacías).
- **D-5**: `SKILL.md` §3.5 y Paso 4 reenvían stdout sin alterarlo, prohíben contaminar el stdout de `--json`, propagan el exit code y describen la degradación inline con el aviso literal `⚠️ node no disponible — sin exit code; no usar en CI` (Paso 5.5).
- **D-6**: `docs/architecture/memory-system.md` §7 invariante 2 reescrito (CR-001) y §10.4 añadida; `docs/guides/sddf-commands-pipeline.md` §0 con el gate de CI y la nota de complementariedad (CR-003, líneas 69-92); `README.md` y `CHANGELOG.md` 3.3.0 · Added.
- **CR-004**: fixture nuevo `skills/memory-system/examples/sane/` con las once capas y `constitution.md`; `examples/sddf/` intacto; TC-013 y `S097-E2E-001` apuntan a `sane`.
- **CR-005**: `deriveNode` devuelve `declared` **además** de los campos previos (`path, relPath, layer, slug, title, hasFrontmatter, slugPlaceholder, wikilinks`); `index` no cambia de comportamiento y el esquema ampliado está documentado en `memory-rules.md` §2.
- **CR-006**: TC-012 de `evals/evals.json` asevera `"ok"` + `false` por separado y `not_contains` cubre `"ok": true` y `"ok":true`.
- **Principios arquitectónicos**: `SKILL.md` declara explícitamente "No lanza subagentes" (un solo nivel de delegación); `check` es solo lectura y no escribe en `.tmp/` ni en ningún otro sitio (verificado por `S097-UT-009` y `S097-E2E-001` con hash del árbol); sin dependencias nuevas (solo módulos `node:`).
- **Convenciones**: kebab-case en `memory-system.js`, `memory-rules.md`, `examples/broken/`, `examples/sane/`; frontmatter YAML completo en `SKILL.md` y en los fixtures de `sane/`.
- **Componentes**: los ocho componentes de la tabla "Componentes afectados" de `design.md` existen en el árbol; no se detectó ningún componente nuevo sin documentar (los dos añadidos —fixture `sane` y campo `declared`— están cubiertos por CR-004 y CR-005).

#### Veredicto
approved: la implementación respeta los contratos de `Interfaces` (objeto JSON, `REQUIRED_FIELDS`, evaluadores puros, exit codes 0/1/2), las seis decisiones D-1…D-6 y los seis CR registrados; los únicos hallazgos son inconsistencias menores de documentación (contexto de evaluación con `root`, `path` de `constitution.md` en `memory-rules.md` §7, nombre del fixture sano en `testcases.md`) y un borde de exit code ya registrado como deuda, ninguno con impacto sobre la integración con el resto del framework.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (66 reglas evaluadas)

#### Hallazgos

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

#### Evidencia de las verificaciones

Análisis estático por patrones sobre los 74 archivos del alcance (motor, `SKILL.md`, referencias, los ocho fixtures de `examples/`, evals, test, documentación). No se ejecutó ningún archivo auditado.

##### Deterministas — todas sin salida (pasan)

`sec-no-credential-literal`, `sec-no-private-key`, `sec-no-provider-token`, `sec-no-personal-data` (warn), `sec-no-shell-injection`, `sec-no-dynamic-eval`, `sec-no-unsafe-yaml`, `sec-no-disabled-tls`, `sec-no-absolute-path`, `sec-no-custom-registry`, `sec-no-privilege-escalation`, `sec-no-credential-file`, `sec-no-generated-artefact`, `sec-no-binary-artefact`.

`ai-no-prompt-override`, `ai-no-safety-bypass`, `ai-tools-not-wildcard`, `ai-no-opaque-blob` (warn), `ai-no-hidden-characters`, `ai-no-home-path`, `ai-https-only` (warn), `ai-no-remote-pipe`, `ai-confirm-before-irreversible`, `ai-untrusted-content-clause` (no aplica: `SKILL.md` no ingiere contenido externo al repositorio).

##### Semánticas — observaciones que sostienen la aprobación

- **Superficie de ejecución nula.** `scripts/memory-system.js` solo requiere `node:fs`, `node:path` y `node:process` (líneas 23-25). Sin `child_process`, sin `eval`/`new Function`, sin red, sin dependencias de terceros. El código nuevo de STORY-097 (`check`, líneas 484-605) es estrictamente de solo lectura: ningún evaluador escribe.
- **Validación de entradas por lista blanca** (`parseArgs`, líneas 167-187): subcomando contra `COMMANDS`, `--harness` contra las claves de `HARNESS_PROFILES` (línea 202), `--date` contra `ISO_DATE`, flag desconocido rechazado con exit 2. El lookup de flags usa `Object.hasOwn` (líneas 172-175), inmune a contaminación de prototipo.
- **Confinamiento de rutas.** Las escrituras se derivan siempre de una raíz aportada por el llamador: `index` escribe un único destino fijo `path.join(specsBase, INDEX_FILE)` (línea 751) y `scaffold` compone destinos a partir de nombres del árbol semilla empaquetado en el skill (`listSeeds`, líneas 623-630), nunca de entrada del usuario. Sin patrón `path.join(..., req.*)` ni concatenación de input: `SEC-071` no encuentra condición.
- **Recorrido de directorios sin bucles.** `walk` (líneas 337-347) y `expandGlob` (líneas 360-376) usan `withFileTypes`, por lo que un symlink no se recorre ni se indexa: no hay ciclo ni escape del árbol.
- **Construcción de regex acotada.** `globToRegExp` (líneas 350-357) compila patrones que proceden exclusivamente de la constante `HARNESS_PROFILES`, no de argumentos, y escapa los metacaracteres. Sin superficie de ReDoS por entrada.
- **Salidas sin filtración.** Los mensajes usan `displayPath` (relativo al cwd, líneas 127-129) y `check --json` emite `root: toPosix(args.root)` (línea 777), el argumento tal cual, no una ruta absoluta del host. No se vuelca el entorno ni ningún token.
- **Criptografía.** El único uso es `crypto.createHash('sha256')` en `test/memory-system.test.js:50`, para comparar identidad de bytes entre ejecuciones. No es MD5/SHA-1 ni se presenta como ejemplo para contraseñas o firmas.
- **Fixtures sintéticos.** `examples/broken/` y `examples/sane/` contienen solo texto de relleno en español sobre el propio fixture: ningún usuario, cliente, host, URL interna ni credencial —real o simulada—. Los placeholders `[[<slug>]]` son marcadores de plantilla, no contenido inyectable.
- **Configuración de agente sin comandos peligrosos** (`SEC-079`): `SKILL.md` no documenta `rm -rf`, `curl | sh`, `base64 -d` ni URL de exfiltración. El único modo destructivo, `rebuild --force`, exige el flag explícito (falla en cerrado sin él), imprime una advertencia previa obligatoria (`SKILL.md` §3.3), sobrescribe únicamente archivos gestionados por el scaffold y nunca elimina nada.
- **Sin `allowed-tools` en el frontmatter de `SKILL.md`**: la regla `ai-tools-not-wildcard` solo aplica "cuando está presente", y la ausencia no es una brecha en este repositorio. No se reporta.

##### Nota informativa (no es un hallazgo)

`SEC-056` (filtrado de Unicode invisible) queda fuera por el principio de cautela: `normalizeText` (líneas 136-138) elimina el BOM y normaliza saltos, pero el motor propaga `title` y `slug` del frontmatter a `index.md` sin filtrar el bloque Tag `U+E0000–U+E007F`. No se reporta porque no hay evidencia en archivo:línea de contenido de terceros en el alcance y porque el guardrail `ai-no-hidden-characters` ya cubre el repositorio completo de forma determinista. Es endurecimiento opcional para un futuro `migrate` que indexe raíces no controladas.

#### Veredicto
approved: el cambio no introduce ninguna exposición de seguridad — el motor solo usa módulos nativos de Node en modo lectura, valida sus argumentos por lista blanca, confina toda escritura a la raíz aportada por el llamador y sus fixtures son íntegramente sintéticos.

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (~82 archivos modificados: 11 archivos de código y documentación + 2 directorios de fixtures + ~69 archivos de `docs/**` con frontmatter y wikilinks corregidos). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

**Hallazgos de cobertura de ACs (Product-Owner-Reviewer):**


| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| LOW | IT-001, IT-002 | Dos entradas `[ ]` pendientes en "Test Cases Progress" (ningún `[!]`). IT-001 (propagación de stdout y exit code por `SKILL.md`) está cubierto de facto por EV-001…EV-004 (TC-011…TC-014, 4/4 PASS) y por E2E-001/E2E-002 en la capa del motor; IT-002 (NFR-3, degradación sin `node` en PATH) sólo está escrito en `SKILL.md:370-380` y requiere un entorno sin Node | Marcar IT-001 como cubierto por los evals y dejar IT-002 anotado explícitamente como verificación manual no automatizable en CI |
| LOW | E2E-001 / EV-003 (AC-1) | Desfase de datos: el "Dado" nombra `examples/sddf/` como fixture sano, pero la implementación creó `examples/sane/` (CR-004 en `design.md:319-322`) y tanto el test `S097-E2E-001` como TC-013 apuntan a `sane`. `testcases.md` quedó sin actualizar | Actualizar el "Dado" de E2E-001 y EV-003 a `examples/sane/` para conservar la trazabilidad |


**Hallazgos de trazabilidad de diseño (Integration-Reviewer):**


| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| LOW | E2E-001, EV-003 | Las referencias `D-N` son todas válidas, pero el **fixture sano** sigue nombrado como `examples/sddf/` en ambos casos, cuando CR-004 lo sustituyó por `examples/sane/` (es lo que usan `S097-E2E-001` y TC-013). CR-004 declara `testcases.md` como documento afectado con "acción requerida: ninguna", de modo que el texto quedó desfasado | Actualizar `examples/sddf/` → `examples/sane/` en E2E-001 y EV-003 de `testcases.md` para que el caso especificado coincida con el ejecutado |

Verificación de referencias: los 19 casos usan `D-1`, `D-2`, `D-3`, `D-4`, `D-5`, `F-1`, `F-2`, `F-3` y `F-4`, todas existentes en `design.md` (D-1…D-6, F-1…F-4). **No hay referencias huérfanas.** Los dos casos IT llevan referencia de diseño (IT-001 → `AC-1, AC-2, D-5, T008`; IT-002 → `NFR-3, D-5, F-4, T008`); no hay casos de tipo API. `D-6` (documentación) no tiene caso propio, lo cual es coherente: se verifica por el contrato V-12 (`grep` + `verify:links`), no por test automatizado.


---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban de forma independiente. La severidad máxima consolidada es `LOW` y no existe ningún hallazgo de severidad `HIGH` o `MEDIUM`, ni entre los agentes ni en la evaluación DoD.

Razones que sostienen la aprobación:

- **Funcionalidad completa y verificada:** los dos escenarios Gherkin de `story.md` tienen test E2E 1-a-1 en verde (`S097-E2E-001`, `S097-E2E-002`), y los cuatro criterios de aceptación están cubiertos por los 13 tests `S097-` más los cuatro casos de eval TC-011…TC-014 (4/4 PASS).
- **Arquitectura conforme:** las seis decisiones D-1…D-6 y los contratos de la sección *Interfaces* de `design.md` (objeto JSON, `REQUIRED_FIELDS`, evaluadores puros, exit codes 0/1/2) están implementados sin componentes faltantes ni componentes nuevos sin documentar. Los seis CR registrados se reflejan en el código.
- **Sin exposición de seguridad:** 66 reglas evaluadas sobre 74 archivos del alcance, 0 hallazgos. El motor usa exclusivamente módulos `node:` en modo lectura, valida sus argumentos por lista blanca y no introduce dependencias nuevas.
- **Calidad sostenible:** evaluadores puros sobre un contexto explícito, un único escaneo de disco, orden canónico determinista, solo lectura verificada por hash del árbol, sin secretos, sin TODOs ni código muerto.

Los 16 hallazgos `LOW` son bordes de contrato y precisiones documentales que no comprometen el comportamiento entregado. Se agrupan en cuatro temas recurrentes, señalados de forma convergente por más de un revisor:

1. **Error inesperado dentro de `check` sale con exit 1** (tech-lead, product-owner, integration) — el contrato literal de AC-4/D-4 se cumple, porque los tres errores técnicos enumerados sí devuelven 2. Ya registrado como deuda explícita en `implement-report.md`.
2. **`path` de `constitution.md` sin barra final** frente a lo que afirma `references/memory-rules.md` §7 (tech-lead, integration) — precisión documental.
3. **Fixture sano nombrado `examples/sddf/` en `testcases.md`** cuando CR-004 lo sustituyó por `examples/sane/` (product-owner, integration) — desfase documental; el test y el eval usan `sane`.
4. **Contexto de evaluación con la clave `root`** no registrado como CR, a diferencia de la extensión equivalente del nodo (CR-005) — inconsistencia entre contrato documentado e implementado, sin impacto funcional.

Ninguno de estos temas justifica bloquear el merge según el estándar de aprobación compartido por los cuatro revisores: el cambio mejora claramente la salud del código.

---

## Siguiente acción

La historia avanza a `CODE-REVIEW/DONE`. Ejecuta `/story-verify STORY-097` para la fase VERIFY.

Sugerencias no bloqueantes, a criterio del autor (pueden abordarse en esta historia o diferirse a STORY-098):

- Corregir en `testcases.md` el nombre del fixture sano (`examples/sddf/` → `examples/sane/`) en E2E-001 y EV-003, para conservar la trazabilidad con lo realmente ejecutado.
- Precisar en `references/memory-rules.md` §7 que `constitution.md` se reporta sin barra final.
- Registrar un CR en `design.md` (o ampliar CR-005) que fije el contexto de evaluación como `{ root, nodes, layers, profile, slugSet }`.
- Decidir si el error inesperado dentro de `check` debe mapear a exit 2 con un test de refuerzo, o dejarlo documentado como deuda.
- Marcar IT-002 en `testcases.md` como verificación manual no automatizable en CI (entorno sin `node` en PATH).

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-checklist.md` § *Definition of Done para el estado CODE-REVIEW* (líneas 134-142).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Definition of Done para el estado IMPLEMENT es satisfactorio | ✓ | — | `implement-report.md` § *DoD IMPLEMENT* cierra con "sin criterios ❌". Los dos ⚠️ de checklists de seguridad quedan cubiertos por este review (Security-Reviewer: 66 reglas, 0 hallazgos). Los ⚠️ restantes (IT-002 manual, ausencia de linter en el repositorio) son limitaciones de herramienta, no incumplimientos |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer `approved`/`LOW`: kebab-case, sin dependencias nuevas, sin TODOs ni código muerto, funciones de responsabilidad única |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: escenario principal → `S097-E2E-001`; escenario alternativo `--json` → `S097-E2E-002`. Sin escenarios sin test y sin entradas `[!]` en *Test Cases Progress* |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer `approved`/`LOW`: los ocho componentes de la tabla *Componentes afectados* existen; D-1…D-6 y CR-001…CR-006 reflejados; sin referencias `D-N` huérfanas |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | 0 hallazgos HIGH y 0 MEDIUM entre los cuatro agentes; severidad máxima consolidada `LOW` |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | T001–T016 marcadas `[x]`; 0 entradas `- [ ]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter con `type`, `id`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated`, `related`; actualizado a `CODE-REVIEW/DONE` al cierre de este review |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este documento, generado en esta ejecución |
| 9 | Revisión de código aprobada (Review status approved) | ✓ | — | `review-status: approved` en el frontmatter de este reporte |

**Resumen:** 9/9 criterios ✓ · 0 ❌ · 0 ⚠️
