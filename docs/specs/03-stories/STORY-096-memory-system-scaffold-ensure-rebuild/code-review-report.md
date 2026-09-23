---
type: code-review-report
story: STORY-096
title: "Code Review Report: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
review-status: needs-changes
date: 2026-09-23
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-096

> **Segunda ronda.** La primera revisión (2026-09-22) devolvió `needs-changes` con severidad MEDIUM. Sus correcciones se aplicaron en la pasada documentada en `implement-report.md`, y T016 y T017 —que habían quedado fuera de la lista blanca— se cerraron el mismo día. Esta revisión evalúa el árbol resultante.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-096 — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild |
| Review status | needs-changes |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (22 casos — UT:8/CT:0/IT:4/API:0/E2E:4/EV:6) |
| Fecha | 2026-09-23 |

### Severidad por dimensión

| Dimensión | Agente | Severidad | Hallazgos |
|---|---|---|---|
| Calidad de Código | tech-lead-reviewer | **MEDIUM** | 5 (1 MEDIUM + 4 LOW) |
| Cobertura de Requisitos | product-owner-reviewer | LOW | 4 |
| Integración y Arquitectura | integration-reviewer | **MEDIUM** | 3 (1 MEDIUM + 2 LOW) |
| Seguridad | security-reviewer | LOW | 1 (83 reglas evaluadas) |

**Hallazgos bloqueantes: 1.** Los dos `MEDIUM` son **el mismo defecto**, detectado de forma independiente por dos revisores que no comparten contexto. Se consolida en una única acción en `fix-directives.md`.

### El bloqueante en una línea

El árbol semilla contiene **22 archivos, no los 19** que declaran `design.md`, `implement-report.md` y el reporte anterior. Los tres extra —`templates/{domain,guardrail,policy}-template.md`— los añadió el commit de cierre de esta historia y no aparecen en ninguna de las cuatro listas de archivos gestionados, así que `scaffold` los escribe en todo proyecto consumidor fuera del alcance documentado.

Verificado directamente sobre el árbol por el árbitro, no solo desde los informes: 22 archivos, origen `911a188`, cero referencias en el repositorio, sin frontmatter canónico y sin anotación `escritor:`.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

#### Hallazgos

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | skills/memory-system/assets/scaffold/templates/domain-template.md, guardrail-template.md, policy-template.md (los 3 archivos) | El árbol semilla contiene **22** archivos, no los 19 que declaran `implement-report.md` y el diseño. Estas tres plantillas se añadieron en `911a188` y no aparecen en ninguna lista de archivos gestionados: `memory-rules.md` §5 ("**lo único** que `rebuild --force` sobrescribe"), `SKILL.md` §3.3 y "Salida" ("las seis plantillas de `templates/`") y `docs/architecture/memory-system.md:317-319`. `listSeeds()` (memory-system.js:624) recorre todo el árbol sin filtro, así que `scaffold` las crea y `scaffold --force` las sobrescribe fuera del alcance documentado. Además, al copiarse a `$SPECS_BASE/templates/` declaran campos (`**Versión:**`, `**Estado:**`, `**Última actualización:**`, `**Status:**`, `**Version:**`, secciones) sin anotación `escritor:` — el mismo criterio del principio 13 que la pasada de corrección resolvió para `adr-template.md` vía ADR-0012. La propia semilla `templates/README.md:17-19` afirma "Las seis plantillas base son…" y "Todo campo declarado en una plantilla nombra al skill que lo escribe", contradiciendo lo que el scaffold deja en disco. | Decidir con el autor entre las dos salidas coherentes y aplicar una: (a) retirar los tres archivos del árbol semilla, que es lo que `story.md:110` acota ("no forman parte de las once capas ni de las seis plantillas") y restaura la paridad 19 archivos / seis plantillas; o (b) mantenerlos y documentarlos en `memory-rules.md` §5, `SKILL.md` (§3.3, "Salida" y la descripción de `scaffold`), `docs/architecture/memory-system.md` §10 y el texto de la semilla `templates/README.md`, anotando `escritor:` en cada campo declarado igual que `adr-template.md` (ADR-0012). **No eliminar en silencio durante esta revisión.** |
| LOW | skills/memory-system/scripts/memory-system.js:711 | El aviso `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)` también se emite cuando no se pasó `--cli-root` (`source` es `null`): en ese caso el motor no ha comprobado nada y el skill dueño puede estar perfectamente instalado. El test `S096-UT-005` fija ese comportamiento como correcto. | Diferenciar el mensaje del caso `cliRoot == null` (p. ej. `template no copiado: <nombre> (sin --cli-root)`), o documentar en `memory-rules.md` §5 que el aviso cubre ambas causas. |
| LOW | skills/memory-system/scripts/memory-system.js:654 | Las plantillas compartidas se copian byte a byte (`fs.readFileSync` sin normalizar), mientras que `SKILL.md` ("Encoding") promete que "todo lo escrito va en UTF-8 sin BOM y con saltos `\n`". El repo no tiene `.gitattributes`, así que en un checkout Windows con `autocrlf` las fuentes llegan en CRLF y se propagan tal cual a `$SPECS_BASE/templates/`; las semillas `.md` sí se normalizan (`readText`). Tensión ya asumida por el diseño (ADR-0001, copia byte a byte), sin impacto funcional. | Matizar la regla de "Encoding" en `SKILL.md` para exceptuar explícitamente las cinco plantillas compartidas, o normalizar saltos también en esa copia si se prefiere salida idéntica entre plataformas. |
| LOW | skills/memory-system/scripts/memory-system.js:650-657, 725-737 | `scaffold --force` sobrescribe archivos editados a mano (incluido `constitution.md`) sin copia de seguridad y sin confirmación en el motor: el gate interactivo vive solo en la prosa de `SKILL.md` (Paso 1, `rebuild` sin `--force`). El flag explícito es una forma razonable de intención y ningún modo elimina archivos (verificado en `S096-UT-007`), por lo que no bloquea. | Ninguna acción obligatoria. Opcional: mencionar en el `--help`/USAGE del motor que `--force` es destructivo sobre archivos gestionados. |
| LOW | skills/memory-system/scripts/memory-system.js:808-834 | `scaffoldSummaryLine` se exporta sin ningún consumidor externo (ni tests ni otros módulos); mismo caso que `summaryLine` y `parseArgs`, heredado de STORY-095. Sin impacto funcional. | Confirmar con el autor si esos exports pueden retirarse o si se mantienen como superficie de prueba; no eliminarlos en silencio en esta revisión. |

#### Notas de conformidad (sin hallazgo)

- **Seguridad:** sin secretos, tokens ni credenciales; sin `eval`/`exec`/shell; las rutas de
  escritura se componen con `path.join(specsBase, ...relPath.split('/'))` a partir de rutas
  derivadas del árbol empaquetado (no de entrada del usuario), sin vector de traversal; ningún
  modo borra archivos.
- **Performance:** sin I/O en bucles no acotados — `listSeeds` recorre el árbol empaquetado
  (22 archivos) y `scaffold` hace una escritura por archivo; sin llamadas a red ni BD.
- **DoD / convenciones:** sin `TODO` ni código comentado (las coincidencias de `TODO` son
  valores legítimos de `substatus:` en el frontmatter de las semillas); sin variables, imports
  ni funciones sin usar en el alcance de la historia; solo módulos `node:` (sin dependencias
  nuevas); kebab-case en todos los archivos nuevos; `SKILL.md` 407 líneas y
  `memory-rules.md` 279, ambos bajo el límite de 500.
- **Calidad:** el REFACTOR cumple su objetivo — `placeFile()` unifica la política copia-si-falta
  de semillas y plantillas compartidas, y `assertSeedsCoverLayers()`/`profileOf()`/`scaffoldLayer()`
  son responsabilidades únicas y pequeñas. `LAYERS` es catálogo único de scaffold e índice
  (fijado por `S096-UT-001b`). `resolveScaffoldRoot` duplica poco de `resolveRoot` y la
  duplicación está justificada por la semántica de bootstrap.
- **Tests:** los diez casos `S096-*` cubren copia-si-falta, idempotencia, `--dry-run`, copia byte
  a byte, dueño ausente, `--force` selectivo, no-eliminación, fail-fast (exit 2) e integración
  `scaffold + index`, con verificación por hash de árbol y conteo de archivos.

#### Veredicto

needs-changes: el subcomando `scaffold` está bien construido, probado y documentado, pero el árbol
semilla entrega tres plantillas (`domain-`, `guardrail-`, `policy-template.md`) que ninguna de las
cuatro listas de archivos gestionados menciona y que carecen de la anotación `escritor:` que el
principio 13 exige a las plantillas de `$SPECS_BASE/templates/`, lo que deja el alcance real de
`rebuild --force` fuera de lo documentado.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

#### Hallazgos — Cobertura de escenarios en tests

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | `skills/memory-system/evals/evals.json` — TC-005 (`expected.not_contains`) | La mitad negativa del AC-8 ("sin el flag no se invoca `header-aggregation`") se describe en la prosa de TC-005 pero no se asegura: `not_contains` solo lista `Modo ensure aún no disponible`, `rebuild es destructivo`, `[SOBRESCRITO]` y `Entorno inválido`. Un `ensure` que invocara `header-aggregation` sin `--fix-frontmatter` pasaría el caso. | Añadir `"header-aggregation"` a `not_contains` de TC-005 (o de TC-006) para cerrar el contrapositivo de AC-8. |
| LOW | `skills/memory-system/evals/evals.json` — TC-008 (`expected`) | El `Entonces` "no modifica ningún archivo" del escenario `rebuild` sin `--force` solo se verifica por ausencia de marcas en la salida, no por hashes. El chequeo real de hashes existe únicamente en la verificación manual T019 (`implement-report.md`, "T019 — verificación de extremo a extremo", 13/13 PASS), no en un test automatizado. | Aceptable: el gate vive en `SKILL.md` y no es alcanzable desde el motor. Registrar la comprobación de hashes en `/story-verify` como evidencia permanente. |
| — | — | El resto de escenarios Gherkin está cubierto: escenario `ensure` → TC-005/TC-006 + `S096-UT-002` + `S096-IT-001`; escenario `scaffold` → TC-007 + `S096-UT-001` (11 capas, 6 plantillas, `product/*`, y aserción explícita de que `index.md` no se crea); `rebuild` sin `--force` → TC-008 (literal exacto); `rebuild --force` → TC-009 + `S096-UT-006` (hashes de `ADR-0001-x.md`, `guides/sdd.md` y `STORY-001-a/story.md` intactos, recuento de archivos no decrece). | — |

#### Veredicto
approved: los cuatro escenarios Gherkin y los ocho ACs tienen cobertura observable y ejecutada (UT `S096-*` 1-a-1 con UT-001…008, evals TC-005…TC-010 para los modos que viven en `SKILL.md`, más la corrida manual T019 13/13); solo quedan huecos LOW: dos aserciones negativas débiles en evals y un checklist desfasado con 8 entradas `[ ]` justificadas y ninguna `[!]`.

---

### Integración y Arquitectura (Integration-Reviewer)

#### Hallazgos — Conformidad estructural

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | `skills/memory-system/assets/scaffold/templates/{domain,guardrail,policy}-template.md` | Tres semillas de plantilla que **no existen en `design.md`** (D-1 fija el árbol semilla en `templates/{README.md, adr-template.md}`; D-2 y AC-6 fijan "seis plantillas"). Como `listSeeds` recorre el árbol completo (`memory-system.js:624`), `scaffold` las escribe en todo proyecto: `docs/templates/` recibe 9 plantillas, no 6. No aparecen en `implement-report.md` ("19 semillas", hoy son 22), ni en `tasks.md` (T005 solo cubre `adr-template.md`), ni en `SKILL.md:34-35`, ni en `memory-rules.md` §5, ni en `docs/architecture/memory-system.md:121-128`, ni en `CHANGELOG.md`, ni en los tests (`SIX_TEMPLATES`, `test/memory-system.test.js:324`, solo comprueba presencia, por eso no falla). Entran en conflicto directo con dos reglas escritas: `memory-rules.md:146` ("lo único que `rebuild --force` sobrescribe" — estas tres se sobrescriben sin estar en la lista) y `memory-rules.md:188` ("ADR-0001: un dueño por template, **sin copias en `assets/scaffold/`**"); no tienen skill dueño en el repo. Además son las únicas semillas `.md` sin frontmatter canónico (D-1/§5) y sin la anotación `escritor:` que ADR-0012 exige a una plantilla de generación — el mismo principio 13 que originó el MEDIUM de la ronda anterior. | Decidir explícitamente: (a) retirarlas de `assets/scaffold/templates/` si no pertenecen a STORY-096, o (b) si son intencionadas, registrarlas como CR en `design.md`/`implement-report.md`, darles frontmatter canónico y `escritor:` (ADR-0012), añadirlas a la tabla de archivos gestionados de `memory-rules.md` §5 y a `SKILL.md`, `docs/architecture/memory-system.md` §3/§10, `CHANGELOG.md` y `testcases.md` (AC-6 pasaría de seis a nueve plantillas), y resolver su dueño frente a ADR-0001. |
| LOW | `skills/memory-system/scripts/memory-system.js:613-621` | `resolveScaffoldRoot` crea la raíz si falta y su directorio padre existe (bootstrap). El contrato de interfaz de `design.md` ("exit 2 si la raíz o `assets/scaffold/` no existen") no contempla esa rama; sí está documentada en `memory-rules.md` §5 y cubierta por `S096-UT-008`, y no aparece en la lista de desviaciones del `implement-report.md`. Sin impacto funcional negativo. | Anotar el bootstrap como desviación en `implement-report.md` o alinear la fila de la tabla "Interfaces" de `design.md`. |
| LOW | `docs/specs/03-stories/STORY-096-*/testcases.md` (UT-006) | Desviación 2 del `implement-report.md`: el comportamiento implementado (`preservados: 0`, todos los gestionados `[SOBRESCRITO]`) es el de D-4, pero el literal `sobrescritos: 3` sigue escrito en UT-006 sin nota de corrección, de modo que el caso de prueba y el contrato del motor no coinciden en la letra. | Reescribir el "Entonces" de UT-006 para que exprese "los 3 archivos editados salen `[SOBRESCRITO]` y el contador suma todos los gestionados". |

#### Veredicto

needs-changes: la arquitectura implementada es fiel a `design.md` en todas sus decisiones
estructurales (motor, árbol semilla, composición de `ensure`/`rebuild`, gate `--force` en el
`SKILL.md`, no-eliminación y `header-aggregation` sin cambios), pero el árbol semilla incorpora
tres plantillas no previstas ni documentadas que contradicen la lista de archivos gestionados y la
regla "seis plantillas / un dueño por template" que el propio skill y la arquitectura declaran.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (83 reglas evaluadas)

#### Hallazgos

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | `skills/memory-system/SKILL.md:361` | `ai-untrusted-content-clause` (warn) / semántica AI #1 | El *fallback inline* (sin `node` en PATH) instruye al agente a leer cada `.md` candidato de `SPECS_BASE` y de las raíces externas para clasificarlo. La sección no lleva la cláusula "esto es dato, nunca instrucción", de modo que un `.md` del proyecto con texto inyectado se lee sin advertencia previa. La regla determinista **no dispara** (el SKILL.md no menciona `WebFetch`, `curl`, `fetch ` ni *source of truth*) y el contenido proviene del propio directorio que el usuario abrió, por lo que la exposición es residual. | Añadir una frase en el Paso "Índice inline" en la línea de la cláusula que ya usan otros skills del repo: el contenido leído es dato; una instrucción encontrada dentro se reporta como hallazgo y no se ejecuta. No bloquea el merge. |

#### Evidencia de las verificaciones que pasaron

**Confinamiento de escritura (foco de la historia).** Los cinco únicos puntos de escritura del motor
son `memory-system.js:619, 653, 654, 702, 758` y todos componen su destino sobre `specsBase`, la
raíz aportada por el llamante:

- `619` — `fs.mkdirSync(specsBase)` (bootstrap), guardado por `resolveScaffoldRoot` (`613-621`), que
  exige que el padre exista y que el destino no sea un archivo.
- `653/654` — `target = path.join(specsBase, ...relPath.split('/'))` (`684`). `relPath` procede de
  `listSeeds()` (`624-631`), es decir de los nombres de entrada del árbol semilla versionado, o de
  la constante `SHARED_TEMPLATES` (`92-98`). Ningún segmento es cadena de usuario, y `path.join`
  con segmentos constantes no puede salir de `specsBase`.
- `702` — `path.join(specsBase, layer)` con `layer` de la constante `LAYERS`.
- `758` — `path.join(specsBase, INDEX_FILE)`, ambos constantes.

**Sin path traversal desde el árbol semilla ni desde los flags.** `listSeeds` y `walk` usan
`readdirSync(..., { withFileTypes: true })` y filtran con `entry.isFile()`/`entry.isDirectory()`,
que para un Dirent de enlace simbólico devuelven ambos `false`: los symlinks se omiten, no se
siguen. `git ls-files -s skills/memory-system` no lista ninguna entrada modo `120000`, así que no
hay symlink versionado en las 22 semillas ni en los 61 archivos de fixture. `--cli-root` es de
usuario pero solo compone **orígenes de lectura** (`709`), nunca destinos; `--template` (`748`)
también es solo lectura.

**`rebuild` falla en cerrado.** El gate vive en `SKILL.md:161`: sin `--force` el skill muestra
`❌ rebuild es destructivo. Añade --force para confirmar.` y termina **sin invocar el motor y sin
escribir**. Con `--force`, `SKILL.md:240` obliga a mostrar antes la advertencia
`⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán.` El motor solo conoce
`scaffold --force`, que por defecto es `false` (`parseArgs`, `169`): ausencia de flag equivale a
preservar (`placeFile`, `651`: destino presente sin `force` → `preserved`, sin escritura).

**Nada se borra.** El grep de `rmSync|unlinkSync|rmdirSync|fs.rm(|rm -rf|Remove-Item` sobre los 94
archivos del alcance devuelve una sola línea: `test/memory-system.test.js:34`, limpieza `t.after()`
de un directorio creado con `fs.mkdtempSync(os.tmpdir(), …)` en la línea 33. Es ámbito de prueba
sobre un temporal propio, no una ruta del proyecto.

**`check` es solo lectura.** Ninguno de los cinco puntos de escritura pertenece a `runCheck`/
`checkMemory`; los evaluadores solo consultan `isDirectory`/`existsSync`.

**Sin credenciales, PII ni URLs internas en los 83 archivos de semilla y fixture.** Los greps de
literal de credencial, bloque de clave privada, patrones de token de proveedor (AWS/GitHub/OpenAI/
Slack), direcciones de correo y URLs `http(s)` sobre `assets/scaffold/**` y `examples/**` no
devuelven ninguna línea: las semillas son marcadores `[Por completar]` y los fixtures son
documentos sintéticos `STORY-001-a` / `ADR-0001-x`. No hay archivo `.env`, `.pem`, `.key`, binario
ni artefacto generado entre los archivos versionados del alcance (SEC-021, SEC-022, SEC-023,
`sec-no-credential-literal`, `sec-no-private-key`, `sec-no-provider-token`,
`sec-no-credential-file`, `sec-no-personal-data`, `sec-no-binary-artefact`).

**Código ejecutable.** Sin `eval(`, `new Function(`, `os.system(`, `shell=True` ni
`child_process.exec/execSync`. El único subproceso es `spawnSync(process.execPath, [ENGINE, ...args],
{ cwd: REPO_ROOT })` en `test/memory-system.test.js:29`: lista de argumentos, sin shell
(`sec-no-shell-injection`, `sec-no-dynamic-eval`, SEC-038). El único `new RegExp` es `globToRegExp`
(`351-358`), construido desde los patrones constantes de `HARNESS_PROFILES`, con los metacaracteres
escapados y sin entrada de usuario. El motor no usa red, así que `sec-no-disabled-tls` no aplica; el
YAML de `sddf.config.yaml` se lee sin parser externo. Cero dependencias nuevas: solo `node:fs`,
`node:path`, `node:process` (y `node:test`, `node:crypto`, `node:os` en las pruebas).

**Rutas absolutas y fuga por mensajes.** `sec-no-absolute-path` no devuelve ninguna línea: no hay
literal de unidad ni de `/home`, `/Users`, `/root`, `/etc`. Los mensajes usan `displayPath()`
(`128-130`, relativa al `cwd`) y el sobre JSON de `check` emite `toPosix(args.root)` (`777`), la
raíz tal como la pasó el llamante, no la absoluta resuelta: la salida no expone ruta de host,
entorno ni token (semántica de código #3, SEC-013, SEC-077).

**Instrucciones dirigidas al agente.** Sin patrones de anulación de instrucciones
(`ai-no-prompt-override`), sin `--dangerously-skip-permissions`, `bypassPermissions` ni `chmod 777`
(`ai-no-safety-bypass`), sin `curl … | sh` ni `Invoke-Expression` (`ai-no-remote-pipe`), sin
escalado de privilegios ni redirección de registro de paquetes, y sin `allowed-tools` comodín. El
barrido Unicode de caracteres invisibles y bidi (`ai-no-hidden-characters`, SEC-056) sobre los 94
archivos del alcance no devuelve ninguna línea. Las cuatro apariciones de `~/` están en
`README.md:277-280` y `CHANGELOG.md:454`: son una tabla documental de dónde instala cada harness su
configuración global, introducida en el commit `bdd3044`, anterior a esta historia, y no son una
instrucción de lectura dirigida a un agente.

#### Veredicto
approved: los tres modos que escriben confinan cada destino a la raíz aportada por el llamante
componiéndolo solo con segmentos constantes o con nombres del árbol semilla versionado, `rebuild`
falla en cerrado sin `--force` y advierte antes de sobrescribir, ningún modo borra, y las 83
semillas y fixtures no contienen credenciales, datos personales ni URLs; el único apunte es una
cláusula de contenido no confiable ausente en el fallback inline, endurecimiento recomendado que no
bloquea el merge.

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (~70 archivos: 22 del árbol semilla, 17 de fixtures, el motor, SKILL.md, referencias, evals, tests y 5 archivos de documentación). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

**Hallazgos de cobertura de ACs (Product-Owner-Reviewer):**

#### Hallazgos — Cobertura en testcases.md

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| LOW | IT-001 (`testcases.md:96`) | El checklist *Test Cases Progress* marca IT-001 como `[ ]` aunque el test `S096-IT-001 scaffold + index` existe y pasa (`test/memory-system.test.js:532`) y la orquestación completa de `ensure` está cubierta por TC-005/TC-006. El checklist quedó desfasado respecto al árbol. | Marcar IT-001 `[x]` citando `S096-IT-001` + TC-005, o anotar el criterio de cierre. |
| LOW | E2E-001…E2E-004, IT-002…IT-004 (`testcases.md:84-99`) | 7 entradas `[ ]` adicionales. Están justificadas y documentadas: IT-003/E2E se cubren de facto por TC-005/TC-007/TC-008/TC-009/TC-010 y por la corrida manual T019 (13/13 PASS en directorio temporal), e IT-002 es inaplicable porque STORY-095 ya está implementada (nota propia de `testcases.md:76-77`). Ninguna entrada está en `[!]`. | Cerrarlas en `/story-verify` o anotar en el checklist la evidencia (T019 / TC-NNN) que las sustituye, para que el `[ ]` no se lea como hueco real. |
| — | AC-1…AC-8 | Todos los ACs tienen al menos un test case referenciado en la columna `Ref`: AC-1 (E2E-001, IT-001, EV-001), AC-2 (E2E-002, UT-001, UT-003, EV-003), AC-3 (E2E-003, EV-004), AC-4 (E2E-004, UT-006, IT-004, EV-005), AC-5 (E2E-002, UT-001), AC-6 (E2E-002, UT-004, UT-005, EV-003), AC-7 (E2E-001/004, UT-002, UT-006, UT-007, EV-002), AC-8 (IT-003, EV-006). Los cuatro bloques Gherkin tienen E2E 1-a-1 y, además, un caso EV ejecutable que sí corre en CI de evals. | — |


**Hallazgos de trazabilidad de diseño (Integration-Reviewer):**

#### Hallazgos — Trazabilidad de diseño en testcases.md

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| — | — | Trazabilidad de diseño correcta en testcases.md | — |

Detalle: las referencias usadas son D-1, D-2, D-3, D-4, D-6 y F-1…F-4, todas existentes en
`design.md`; no hay referencias huérfanas. Los cuatro casos IT llevan referencia de diseño
(IT-001 D-3 · IT-002 D-3 · IT-003 D-3/D-6 · IT-004 D-4) y los cuatro E2E también. No hay casos API.
D-5 y D-7 no se referencian desde ningún caso, lo que es coherente: D-5 es contenido editorial
verificado dentro de UT-001 y D-7 se verifica por revisión y `verify:links` (T020), tal como
declaran las "Notas de cobertura".


---

## Decisión final

**review-status: needs-changes**

Dos revisores aprueban (`LOW`) y dos devuelven `needs-changes` por **el mismo** defecto, que fija la severidad máxima en `MEDIUM`.

Que Tech-Lead-Reviewer e Integration-Reviewer —que no comparten contexto y revisan dimensiones distintas— hayan llegado al mismo hallazgo por caminos independientes es, en sí, la señal más fuerte de este review: uno lo encontró contando archivos contra el inventario declarado, el otro contrastando el árbol con los componentes de `design.md`.

**Por qué bloquea**, más allá de la discrepancia numérica:

1. **Se escribe en todos los proyectos consumidores.** `listSeeds()` recorre el árbol completo sin filtro, así que `scaffold` copia las tres plantillas a `docs/templates/` de cualquier proyecto que use el skill. No es un archivo muerto en el repositorio: es comportamiento entregado.
2. **Cae fuera del alcance documentado del modo destructivo.** `memory-rules.md` §5 afirma que su lista es "**lo único**" que `rebuild --force` sobrescribe. Estas tres se sobrescriben sin estar en ella, de modo que la garantía escrita del modo destructivo es falsa tal como está redactada.
3. **Contradice una ADR de la propia historia.** `memory-rules.md` cita ADR-0001 —"un dueño por template, **sin copias en `assets/scaffold/`**"— y estas tres no tienen skill dueño en el repositorio.
4. **Viola el principio 13 de la constitución.** Declaran campos (`**Versión:**`, `**Estado:**`, `**Status:**`…) sin anotación `escritor:`. Es exactamente el criterio que la ronda anterior resolvió para `adr-template.md` vía ADR-0012, aplicado entonces solo a ese archivo.
5. **El entregable se contradice a sí mismo.** La propia semilla `templates/README.md` afirma *"Las seis plantillas base son…"* y *"Todo campo declarado en una plantilla nombra al skill que lo escribe"*.

Y un dato que conviene no perder: **`docs/templates/` de este repositorio no contiene esas tres plantillas**, así que el framework ya está desincronizado con su propio scaffold. Un `ensure` sobre este repositorio las crearía ahora mismo.

Los tests no lo detectaron porque `SIX_TEMPLATES` comprueba **presencia**, no exhaustividad — por eso la opción (a) de `fix-directives.md` incluye añadir esa aserción.

### Lo que sí quedó aprobado

- **Seguridad, sin reservas.** 83 reglas evaluadas sobre 94 archivos. El foco propio de esta historia —modos que escriben y uno destructivo— se verificó punto por punto: los cinco puntos de escritura componen su destino sobre `specsBase` y ningún segmento procede de cadena de usuario; `listSeeds` y `walk` omiten symlinks en vez de seguirlos; `rebuild` falla en cerrado sin `--force`; y el motor **no tiene ninguna operación de borrado** (la única del alcance está en el `t.after()` de un directorio temporal del test).
- **Cobertura de requisitos.** Los cuatro bloques Gherkin tienen E2E 1-a-1 más un eval ejecutable, los ocho ACs tienen `Ref`, y el checklist no contiene ninguna entrada `[!]`.
- **Conformidad de diseño.** Todos los componentes de `design.md` existen en ruta y nombre; los literales de `ensure`/`scaffold`/`rebuild` son textuales respecto a D-3/D-4/D-6; el gate `--force` vive en el `SKILL.md` y no en el motor, como fija D-4; las seis desviaciones declaradas se verificaron una a una y ninguna rompe un contrato; sin referencias `D-N` huérfanas.
- **Calidad del código.** Sin secretos, sin `eval` ni shell, sin dependencias nuevas, sin TODOs reales ni código muerto, kebab-case, y un REFACTOR que unificó la política copia-si-falta en `placeFile()`.

---

## Siguiente acción

La historia retrocede a `READY-FOR-IMPLEMENT/DONE`. Se añadió la tarea "Implementar fix-directives.md" a `tasks.md`.

1. Decide entre la **opción (a)** —retirar las tres plantillas del árbol semilla, recomendada porque restaura la paridad que fijan D-1/D-2, AC-6 y `story.md:110`, y resuelve las cuatro contradicciones de un golpe— y la **opción (b)**, documentarlas formalmente, que obliga además a resolver su conflicto con ADR-0001.
2. Añade a `test/memory-system.test.js` una aserción de **exhaustividad** del árbol semilla, para que un archivo extra no vuelva a pasar inadvertido.
3. Re-ejecuta `/story-code-review STORY-096`.

Los 11 hallazgos `LOW` quedan a tu criterio y están listados en `fix-directives.md`. Varios se cierran con la misma edición que el bloqueante.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-checklist.md` § *Definition of Done para el estado CODE-REVIEW* (líneas 134-142).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Definition of Done para el estado IMPLEMENT es satisfactorio | ⚠️ | — | El `implement-report.md` no declara ningún ❌, pero su inventario de artefactos es demostrablemente incompleto: declara 19 semillas y el árbol tiene 22. No se marca ❌ porque es la misma evidencia del hallazgo #1, no un incumplimiento independiente |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ❌ | MEDIUM | Las tres plantillas declaran campos sin anotación `escritor:`, contra el principio 13 y ADR-0012. Misma causa que el hallazgo #1 |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Los cuatro bloques Gherkin cubiertos 1-a-1 por E2E más un eval ejecutable; 0 entradas `[!]` en *Test Cases Progress* |
| 4 | Los componentes respetan la arquitectura de `design.md` | ❌ | MEDIUM | Tres semillas no previstas en D-1/D-2 ni en AC-6, que `scaffold` escribe en todo proyecto consumidor. Misma causa que el hallazgo #1 |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ❌ | MEDIUM | 1 hallazgo MEDIUM consolidado, reportado por dos revisores |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | 0 entradas `- [ ]` en el momento de la evaluación. La tarea "Implementar fix-directives.md" se añadió después, como consecuencia de este veredicto |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; retrocedido a `READY-FOR-IMPLEMENT/DONE` al cierre de este review |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este documento |
| 9 | Revisión de código aprobada (Review status approved) | ❌ | MEDIUM | `review-status: needs-changes` |

**Resumen:** 5/9 criterios ✓ · 4 ❌ · 1 ⚠️

> Los criterios 2, 4, 5 y 9 son **consecuencia del mismo defecto**, no cuatro incumplimientos independientes: los cuatro se satisfacen al resolver el hallazgo #1. Por eso `fix-directives.md` recoge una única acción bloqueante en vez de cuatro directivas redundantes.
