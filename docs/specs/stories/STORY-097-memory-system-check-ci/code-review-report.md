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

> **Tercera pasada.** La primera aprobó con 16 hallazgos `LOW`. La segunda, tras el ciclo de corrección (CR-007 y CR-008), devolvió `needs-changes` por un `MEDIUM`: un wikilink roto en `docs/domains/domain-state-management.md:157`. Esta pasada revisa el resultado de corregirlo.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-097 — Verificar la consistencia de la memoria con un modo check apto para CI |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (20 casos — UT:12/CT:0/IT:2/API:0/E2E:2/EV:4) |
| Fecha | 2026-09-23 |

### Severidad por dimensión

| Dimensión | Agente | Severidad | Hallazgos |
|---|---|---|---|
| Calidad de Código | tech-lead-reviewer | LOW | 4 |
| Cobertura de Requisitos | product-owner-reviewer | LOW | 4 |
| Integración y Arquitectura | integration-reviewer | LOW | 1 |
| Seguridad | security-reviewer | LOW | 2 (69 reglas evaluadas) |

**Hallazgos bloqueantes (HIGH o MEDIUM): 0.** Los cuatro revisores aprueban de forma independiente.

### Qué se corrigió desde la segunda pasada

| Acción | Verificado por |
|---|---|
| `docs/domains/domain-state-management.md` revertido a HEAD (`git diff` vacío), resolviendo el `MEDIUM` y las tres ediciones sin registrar — decisión (a) del `fix-directives.md` | Tech-Lead, Integration |
| Diagnóstico falso de la deuda corregido: `[[state-machine]]` y `[[specs-and-workflows]]` no son "aún no escritos" sino **borrados** en el commit `7932954`; `plan-09` está `COMPLETED` | Tech-Lead (confirmado contra `git`) |
| Cifras realineadas a 46 problemas en `implement-report.md` y en la guía de pipeline | Tech-Lead, Integration |
| Tres `LOW` de texto desactualizado cerrados: docstring de `memory-system.js:18-21`, `CHANGELOG.md` (`S097-UT-001…012`), comentario de sección del test | Tech-Lead, Integration |

El Tech-Lead-Reviewer verificó además la aritmética del conteo, que cuadra por tres vías independientes: 44 → 43 al revertir el wikilink del `MEDIUM`, +3 al revertir el resto = 46; desglose `broken-wikilink` 41 + `orphan` 5 = 46; deuda por familias 36+3+1+1+5 = 46.

> **El conteo subió de 43 a 46 y es el resultado correcto.** Al revertir, los enlaces vuelven a estar rotos hasta que se restauren sus destinos. Es preferible a que apunten a `sdcl-sddf`, que no contiene lo que las citas prometen.

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

#### Verificaciones realizadas (sin hallazgo)

| Qué se verificó | Resultado |
|---|---|
| Reversión de `domain-state-management.md` | `git diff -- docs/domains/domain-state-management.md` vacío: el archivo vuelve a HEAD, con `[[workflow-canonico-story-y-epic]]`, las dos citas a `[[state-machine]]` (l. 146, 155) y la viñeta *Workflow narrativo* de §8 restauradas. Opción (a) aplicada entera, sin dejarlo a medias |
| Diagnóstico corregido de la deuda | **Verificado contra `git`.** `7932954` ("doc: add domain docs to docs\domain") **borra** `docs/domain/state-machine.md` (174 líneas) y `docs/domain/specs_and_workflows.md` (90 líneas) en el mismo commit que crea la familia `domain-*.md`; `63fb587` es el traslado previo desde `docs/knowledge/guides/`; `plan-09-state-machine-canonical-document.md` declara `status: COMPLETED`. Los destinos son recuperables desde git. El diagnóstico nuevo del informe es correcto y el anterior era falso, como dice |
| Aritmética de las 46 | Coherente en los tres documentos. Árbitro: 44 en el árbol → 43 tras revertir el wikilink del MEDIUM. La reversión completa vuelve a romper 3 enlaces → **46**. Desglose: `broken-wikilink` 38+3 = 41, `orphan` 5, total 46; deuda por familias 36+3+1+1+5 = 46; línea base 145 → 46 con 0+43+1+101 = 145. `implement-report.md:70,77,82-84,88,153` y `sddf-commands-pipeline.md:94` dicen los mismos números |
| Tres cierres `LOW` de texto | Aplicados y correctos: docstring `memory-system.js:18-21` (ahora dice que en `check` **todo** error sale con 2), `CHANGELOG.md` (`S097-UT-001…012`), y los dos comentarios de `test/memory-system.test.js` (l. 6 y 558, `UT-001…UT-012`) |
| Semántica del código | **Sin cambios en esta pasada.** El único hunk de `memory-system.js` que no es comentario (el sobre JSON en `main`, el `command === 'check'` → 2) procede de CR-008, ya aprobado por los cuatro revisores en la segunda pasada. Re-leído: `command` se asigna tras `parseArgs`, así que un `UsageError` de parseo sigue saliendo con 2 por la rama `usage`; el sobre se escribe con `JSON.stringify(error.message)`, de modo que el `USAGE` multilínea de `falta --root` queda escapado y stdout es **una sola línea** — la aserción de `S097-UT-012` es correcta |
| `t.mock` sobre `fs.readdirSync` | Correcto: `require('node:fs')` devuelve el mismo objeto de módulo en test y motor, el fallo nace dentro de `checkMemory` (vía `walk`), no es `UsageError` y con `command === 'check'` sale 2. `node:test` restaura los mocks al terminar el caso, y `S097-UT-011`, que corre después, usa subproceso: sin contaminación |
| `LOW` abiertos por alcance | Confirmados como `LOW`, sin discrepancia. `argv.includes('--json')`: el peor caso es un `index --json` mal escrito que imprime un sobre espurio junto a un exit 2 — inocuo. `engines >=18.0.0` vs `t.mock` (18.13): todos los workflows fijan `node-version: 20`. `groupByKind` con `?.push`: hoy inalcanzable. `assertRuntime` solo en `runCheck`: resuelto por documentación en `SKILL.md`. `STORY-089-*/design.md:54`: **no tocado**, sigue pendiente de confirmación del autor |

#### Hallazgos

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/specs/03-stories/STORY-097-memory-system-check-ci/implement-report.md:28,50,60 | Conteos de tests desfasados, la misma clase de texto obsoleto que esta pasada cerró en `CHANGELOG.md` y en los comentarios del test. El informe sigue diciendo **13 tests `S097-` (UT-001…UT-011, E2E-001, E2E-002)** y `40/40`; el árbol tiene **14** casos `S097-` (UT-001…UT-012 más los dos E2E) y **41** `test(` en `test/memory-system.test.js`. Por arrastre, `119/119` (l. 36, 37, 61, 176) también es anterior a UT-012 | Realinear a 14 tests `S097-` (UT-001…UT-012) y volver a medir `node --test test/memory-system.test.js` y `npm test`, registrando las cifras nuevas en *Evidencia de verificación* y en la fila "No hay regresiones" del DoD |
| LOW | docs/specs/03-stories/STORY-097-memory-system-check-ci/implement-report.md:142-153 | Las tres correcciones de texto de esta pasada (`memory-system.js:18-21`, la enumeración de tests del `CHANGELOG.md`, el comentario de sección de `test/memory-system.test.js`) **no están registradas** en § *Segunda pasada de review*, que solo documenta la reversión y el diagnóstico corregido. Además caen fuera de la lista blanca de `fix-directives.md`, que para la opción (a) solo autoriza `domain-state-management.md`. Las ediciones en sí son inocuas y correctas; lo que falta es el rastro — precisamente el patrón que la segunda pasada marcó `LOW` en `domain-state-management.md` | Añadir a § *Segunda pasada de review* una línea que liste los tres archivos y el motivo (cierre de `LOW` por texto desactualizado). Cierra este hallazgo y el anterior en la misma edición |
| LOW | docs/specs/03-stories/STORY-097-memory-system-check-ci/implement-report.md:101,151,153,159 | La deuda de 36 wikilinks se difiere a **STORY-100** (`EPIC-19-framework-consistency`), afirmada en presente ("su restauración se aborda en STORY-100"), pero **STORY-100 no existe**: la última historia del repositorio es `STORY-099-sddf-init-level-full`, no hay ningún `STORY-100*` en `docs/specs/03-stories/`, y `EPIC-19-framework-consistency/epic.md` enumera historias hasta STORY-094 sin mencionarla. La épica está `status: DEVELOP / substatus: IN-PROGRESS`, así que le aplica la regla de `constitution.md` "epic.md debe mantenerse actualizado […] incluyendo sus historias asociadas". El destino del diferimiento no tiene dueño ni artefacto | Crear `STORY-100` en EPIC-19 y registrarla en el backlog de `epic.md`, o bien reformular el informe como "pendiente de crear en EPIC-19" para no afirmar un artefacto inexistente. No bloquea: la deuda ya está descrita en el informe y avisada en `sddf-commands-pipeline.md:94` |
| LOW | test/memory-system.test.js:737 | `S097-UT-012` se declara **antes** de `S097-UT-011` (l. 761), invirtiendo el orden respecto de `testcases.md`. Sin efecto funcional: UT-011 mide rendimiento en subproceso y los mocks de UT-012 ya están restaurados | Mover el bloque de UT-012 después de UT-011 para que el archivo se lea en el mismo orden que la tabla de casos |

#### Veredicto

approved: la reversión es completa y verificada byte a byte, el diagnóstico corregido de la deuda resiste el contraste con `git` (commit `7932954`, `plan-09` COMPLETED), la aritmética de las 46 es coherente en los tres documentos y los tres cierres de texto están aplicados; los cuatro hallazgos restantes son `LOW` documentales — tres de ellos se cierran con una sola edición del `implement-report.md` — y ninguno toca el comportamiento del motor.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

#### Hallazgos — Cobertura de escenarios en tests

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | `D:/code/agile-sddf/docs/specs/03-stories/STORY-097-memory-system-check-ci/implement-report.md:28` y `:50` | El inventario de tests quedó desactualizado tras CR-008: declara «13 tests `S097-` (UT-001…UT-011, E2E-001, E2E-002)», pero el archivo tiene **14** tests `S097-` (UT-012 incluido). En la misma pasada se corrigió la enumeración equivalente del `CHANGELOG.md` (`S097-UT-001…011` → `…012`); el informe no. No afecta a la cobertura real, solo al mapa que un revisor usa para localizarla | Actualizar a «14 tests `S097-` (UT-001…UT-012, E2E-001, E2E-002)» en ambas filas |
| LOW | `D:/code/agile-sddf/docs/specs/03-stories/STORY-097-memory-system-check-ci/implement-report.md:60` | Evidencia «`node --test test/memory-system.test.js` → 40/40». El archivo declara hoy **41** tests (`grep -c "^test("`); la cifra es la medición previa a añadir `S097-UT-012` | Reejecutar y anotar 41/41, o marcar la cifra como previa al ciclo de corrección |

Fuera de esas dos cifras de informe, no hay escenarios Gherkin sin test: el escenario
principal (cuatro familias, sin escribir, exit 1/0) está en `S097-E2E-001` con `hashTree`
antes/después y el contraste contra `examples/sane/`; el escenario alternativo (JSON para CI
y re-chequeo tras corregir) en `S097-E2E-002`, que valida el objeto único, `ok: false`,
`summary`, `problems[0]` y el paso a `ok: true` / exit 0.

#### Veredicto

approved: los dos escenarios Gherkin y los cuatro ACs siguen cubiertos de forma observable y
`testcases.md` sigue trazable a los tests reales; los únicos hallazgos nuevos son cifras de
inventario desactualizadas en `implement-report.md` y dos imprecisiones de redacción en las
filas UT-005 y UT-007, todas `LOW` y ninguna bloqueante.

---

### Integración y Arquitectura (Integration-Reviewer)

#### Verificaciones de esta tercera pasada

##### 1. Coherencia documental del contrato de exit code (CR-008) en las seis superficies

| # | Superficie | Evidencia | Estado |
|---|---|---|---|
| 1 | `skills/memory-system/scripts/memory-system.js` | Docstring de cabecera, líneas 18-21: «En `check` el 1 significa exclusivamente "memoria con problemas" (gate de CI) y **todo** error, incluido el inesperado, sale con 2 (D-4, CR-008)». Coincide con `main()` línea 802 (`return usage \|\| command === 'check' ? 2 : 1;`) y con el comentario de las líneas 794-801 | ✅ cerrado |
| 2 | `skills/memory-system/SKILL.md` | Tabla de exit codes, filas 200-201: el 2 incluye «**en `check`, cualquier error inesperado** durante el chequeo (CR-008)» y el 1 queda «**excepto en `check`**». §3.5 paso 5 (líneas 299-304): el sobre JSON cubre «**todos** los exit 2, incluidos los errores de argumentos mal formados, que el motor detecta antes de entrar al subcomando (CR-008)» | ✅ |
| 3 | `skills/memory-system/references/memory-rules.md` §7 | Líneas 274-279: exit 2 ante «raíz inexistente, `--harness` no admitido, Node < 18, argumentos mal formados y **cualquier error inesperado durante el chequeo** (CR-008)»; «todo exit 2 deja `{ "ok": false, "error": "…" }` en stdout, incluidos los errores de parseo» | ✅ |
| 4 | `docs/architecture/memory-system.md` §10.4 | Tabla de exit codes, líneas 376-380 (fila `1` con «su **único** significado»; fila `2` con «cualquier error inesperado» y el sobre JSON «también cuando el error es de parseo de argumentos») y justificación en 382-385 | ✅ |
| 5 | `docs/guides/sddf-commands-pipeline.md` §0 | Viñeta de exit codes, líneas 83-88, alineada palabra por palabra con el motor; el snippet de CI (`set +e`, `status=$?`, rama `-eq 2` con `jq -r ".error"`) es ejecutable contra el contrato real. Aviso de línea base con **46** problemas (líneas 94-98) | ✅ |
| 6 | `CHANGELOG.md` 3.3.0 `[Unreleased]` → Added | Línea 15: enumera el `0/1/2`, el sobre JSON «también cuando el error es de parseo de argumentos» y cierra con «tests `S097-UT-001…012` y `S097-E2E-001/002`» | ✅ cerrado |

Las seis superficies dicen lo mismo y lo mismo que hace el código. Los tres `LOW` que la segunda
pasada dejó abiertos por documentación quedan cerrados: docstring (1), `CHANGELOG` con el rango
`S097-UT-001…012` (6) y comentario de sección de `test/memory-system.test.js` (líneas 6 y 558,
ambos «UT-001…UT-012»; el archivo contiene `S097-UT-001`…`S097-UT-012` y `S097-E2E-001/002`).

##### 2. Fidelidad de CR-007 y CR-008 a lo implementado

- **CR-007**: el contrato del evaluador es `(ctx: { root, nodes, layers, profile, slugSet }) → Problem[]`.
  `design.md` lo declara así en *Interfaces* (línea 226) y en *Esquema de datos* (línea 232, con la
  justificación de que `root` solo lo consume `missingLayers`); el motor construye exactamente ese
  objeto en `checkMemory` (línea 590) y `missingLayers` es el único que lo lee (líneas 534-543). Los
  cuatro evaluadores siguen sin efectos de escritura.
- **CR-008**: descrito fielmente en sus dos mitades. (a) El sobre JSON se emite en el `catch` de
  `main` condicionado a `argv.includes('--json')` (línea 797) y `runCheck` (líneas 770-784) ya no
  tiene `try/catch`. (b) En `check` todo error sale con 2 (línea 802), reservando el 1 para «memoria
  con problemas» (`return result.ok ? 0 : 1`, línea 783). La cobertura anunciada, `S097-UT-012`,
  existe (`test/memory-system.test.js:737`) y cubre ambos caminos.

##### 3. D-1…D-6 y CR-001…CR-006

| Decisión | Reflejo verificado |
|---|---|
| D-1 | `check` en `COMMANDS` (110), cuatro evaluadores puros en `EVALUATORS` (575), un único escaneo vía `scanNodes` reutilizado de `index` |
| D-2 | `extractWikilinks` (273-284): fences → inline → captura, corte por `\|` y `#`, descarte de vacíos y de `<`/`>`; `templates/` en `EXCLUDED_DIRS` (59). Regla normativa replicada en `memory-rules.md` §2 |
| D-3 | `REQUIRED_FIELDS = { all: [type, slug, title], specs: [id, status] }` (491), `SPEC_TYPES` (492), evaluación sobre `declared` (551-562); `memory-rules.md` §6 e invariante 2 de la arquitectura (líneas 206-207) reescritos según CR-001 |
| D-4 | Texto agrupado (`renderCheckText`, 598-606) y `--json` con las claves en el orden `harness, root, ok, summary, problems` (775-782); tres exit codes, ampliados por CR-008 sin contradecir AC-4 |
| D-5 | `SKILL.md` §3.5 reenvía stdout «tal cual», no ejecuta `detect` aparte, propaga el exit code y degrada inline sin Node (Paso 5.5 con el aviso literal) |
| D-6 | Arquitectura §10.4 + invariante 2, guía §0 con gate de CI y nota de complementariedad (CR-003), `README.md:23`, `CHANGELOG.md:15` |
| CR-001 | Invariante 2 ya reza `type`, `slug`, `title` (+ `id`, `status` en specs) y remite a `header-aggregation` |
| CR-002 | Orden 095 → 097 respetado; `skipLayers` vacío y consultado por `missingLayers` (536) |
| CR-003 | Documentado en la guía (líneas 100-105) y en la arquitectura (387-389) |
| CR-004 | `examples/sane/` usado por `E2E-001`/`EV-003`; `examples/sddf/` intacto |
| CR-005 | `deriveNode` devuelve `declared` (327) sin alterar el contrato previo; documentado en `memory-rules.md` §2 |
| CR-006 | Aserción de TC-012 registrada en `evals.json`; el formato exacto lo fija `S097-UT-008` |

También se confirma la reversión: `git status --porcelain docs/domains/` no devuelve nada, es decir
`docs/domains/domain-state-management.md` está idéntico a HEAD. El diagnóstico corregido del
`implement-report.md` (documentos **borrados** en `7932954`, restauración diferida a STORY-100) es
coherente con la cifra 46 que repiten el informe (líneas 70, 77, 153) y la guía de pipeline (línea 94).

#### Hallazgos — Conformidad estructural

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | `skills/memory-system/scripts/memory-system.js:797` | *(abierto por alcance desde la segunda pasada)* El sobre JSON de error se emite si el `argv` crudo contiene `--json`, sin acotarlo al subcomando: `index --root x --json` (o cualquier modo con el flag, que `parseArgs` acepta globalmente vía `BOOL_FLAGS`) escribiría el objeto en stdout al fallar, pese a que solo `check` lo consume. No afecta al gate de CI ni a ningún contrato documentado | Si se retoma: condicionar a `argv[0] === 'check'` o mover el flag a los flags propios de `check`. Alternativamente, dejar constancia en `memory-rules.md` §7 de que el sobre es global al motor |

#### Veredicto

approved: la arquitectura implementada sigue siendo consistente con `design.md` —CR-007 y CR-008
describen fielmente el código, D-1…D-6 y CR-001…CR-006 están reflejados, el contrato de exit code es
idéntico en las seis superficies (docstring incluido) y la trazabilidad de `testcases.md` no tiene
referencias huérfanas—, quedando únicamente el `LOW` de alcance ya conocido sobre el sobre JSON no
acotado al subcomando.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (69 reglas evaluadas)

#### Hallazgos

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | `skills/memory-system/scripts/memory-system.js:797` (+ `docs/guides/sddf-commands-pipeline.md:73-77`) | `gr-code` semántica «los mensajes de error no echan una ruta absoluta del host» / SEC-078 | **Hallazgo abierto de la 2ª pasada, sin cambios de comportamiento.** El sobre JSON `{ "ok": false, "error": … }` transporta `error.message` íntegro; en un error inesperado de `fs` (p. ej. `EACCES … open 'D:\…\docs\x.md'`) Node incluye la ruta absoluta. El snippet de CI persiste ese objeto en `memory-check.json` y lo reproduce con `jq -r ".error"` junto a la anotación `::error::`. Los mensajes propios (`UsageError`) ya usan `displayPath()` o el `--root` tal cual dio el operador, así que la fuga solo es posible por el camino inesperado. | Opcional: sanear el mensaje del camino inesperado antes de serializarlo (p. ej. aplicar `displayPath` al `error.path` de los errores de `fs`, o reemplazar `REPO_ROOT` por `.`). No bloqueante: el destino es el log del propio runner y solo revela la ruta de trabajo. |
| LOW | `skills/memory-system/SKILL.md:372-379` (Paso 5, `check` inline) | `gr-ai` semántica «el contenido que un skill ingiere se trata como dato, nunca como instrucción» | La degradación sin `node` hace que el agente **lea cada `.md` candidato** de `$SPECS_BASE` para clasificarlo a mano. El SKILL.md no incluye la cláusula de contenido no confiable, así que un artefacto del repositorio con texto dirigido al agente entra en su contexto sin marca explícita de "dato". La regla determinista `ai-untrusted-content-clause` **no** dispara (el SKILL.md no menciona `WebFetch`, `curl`, `fetch` ni "source of truth") y el contenido proviene del directorio de trabajo que el propio usuario abrió, no de una fuente externa. | Endurecimiento opcional: añadir una línea en el Paso 5 indicando que lo leído en los `.md` es dato para clasificar (slug/título/wikilinks) y nunca una instrucción a ejecutar. |

#### Verificación determinista ejecutada (todas sin salida salvo lo indicado)

Sobre `$IMPL_FILES` completo, incluidos `examples/{broken,sane}/**`:

- `sec-no-credential-literal`, `sec-no-private-key`, `sec-no-provider-token`, `sec-no-personal-data` (ningún e-mail), `sec-no-shell-injection`, `sec-no-dynamic-eval`, `sec-no-unsafe-yaml`, `sec-no-disabled-tls`, `sec-no-absolute-path`, `sec-no-custom-registry`, `sec-no-privilege-escalation`: sin coincidencias.
- `ai-no-prompt-override`, `ai-no-safety-bypass`, `ai-tools-not-wildcard` (no hay `allowed-tools`), `ai-no-opaque-blob`, `ai-no-hidden-characters`, `ai-no-home-path`, `ai-no-remote-pipe`, `ai-https-only` (ninguna URL `http://`): sin coincidencias.
- `ai-confirm-before-irreversible` (warn): única coincidencia en `CHANGELOG.md:52`, prosa histórica que **describe** un fallo de publicación de la 3.1.1 (`npm publish`); no es una instrucción a ejecutar ni fue introducida por esta historia. Triada como falso positivo, no se reporta.

#### Observaciones sin hallazgo

- **Sin superficie de red, ejecución dinámica ni credenciales.** El motor usa solo `node:fs`, `node:path` y `node:process`; no hay `eval`, `new Function`, `child_process`, HTTP ni deserialización insegura. SEC-011…015, SEC-021…025, SEC-036…038 y SEC-085/086 no tienen superficie a la que aplicarse.
- **`check` es estrictamente solo lectura** (`checkMemory` y los cuatro evaluadores no tocan el disco salvo `isDirectory`/`existsSync` en `missingLayers`); el único camino de escritura del motor sigue siendo `scaffold`/`index`, confinado a `specsBase` y con política copia-si-falta (`placeFile`, líneas 650-657).
- **Sin path traversal (SEC-071, `gr-code` semántica de confinamiento).** `--root`, `--cli-root` y `--template` son rutas suministradas por el operador, no input remoto; `walk`/`listSeeds`/`place` derivan todas sus rutas del propio árbol del skill y las unen bajo `specsBase`. `expandGlob` recorre únicamente el prefijo sin comodines bajo `REPO_ROOT`.
- **Validación de entrada.** `parseArgs` rechaza flags desconocidos, valores ausentes y `--date` fuera de `YYYY-MM-DD`; `detectHarness` valida `--harness` contra la lista cerrada de perfiles; `assertRuntime` exige Node ≥ 18. Todos con `UsageError` → exit 2 sin escribir.
- **Fixtures sintéticos.** `examples/broken/**` y `examples/sane/**` no contienen datos personales, hosts internos, URLs ni credenciales; `sddf.config.yaml` es un único `root: docs`.
- **Tests sin exposición.** `test/memory-system.test.js` invoca el motor con `spawnSync(process.execPath, [ENGINE, ...args])` (lista de argumentos, sin shell), aísla las escrituras en `fs.mkdtempSync(os.tmpdir())` con limpieza en `t.after`, y el `sha256` de `hashTree` compara árboles de archivos — no es criptografía de contraseñas ni de firmas (SEC-058/SEC-072 no aplican).
- **Cambios desde la 2ª pasada** (docstring de `memory-system.js:18-21`, enumeración de tests del `CHANGELOG.md`, un comentario en el test e `implement-report.md`): solo texto; ninguna regla cambia de resultado.

#### Veredicto

approved: el cambio no introduce ninguna exposición real — sin secretos, sin ejecución dinámica, sin red, sin traversal y con `check` en solo lectura —; los dos hallazgos son endurecimiento opcional de severidad `LOW` (la fuga de ruta absoluta en el sobre JSON sigue siendo `LOW` y abierta por decisión de alcance).

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: este ciclo tocó 6 archivos (1 de código —solo el docstring—, 1 de test —solo un comentario— y 4 de documentación y spec). Tamaño reducido y acorde a una corrección de review. Sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

**Hallazgos de cobertura de ACs (Product-Owner-Reviewer):**

#### Hallazgos — Cobertura en testcases.md

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| LOW | AC-3 / UT-007 | La columna *Entonces* dice «0 `broken-wikilink`», pero el test real (`test/memory-system.test.js:662`) asserta `result.summary['broken-wikilink'] === 1` —el `[[no-existe]]` deliberado del fixture— y que **ningún** problema provenga de `templates/` ni de `design.md`. La intención se entiende, pero leído al pie de la letra el caso contradice al test | Reformular: «0 `broken-wikilink` atribuible a `templates/` o a derivados de historia; el único reportado es el `[[no-existe]]` deliberado del fixture» |
| LOW | AC-3 / UT-005 | La columna *Dado* nombra `[[sdd]]` como wikilink que resuelve; el test usa `[[intro]]` (el fixture `openspec` no tiene `sdd`). La estructura del caso —un enlace que resuelve, uno roto, uno a raíz externa— sí coincide | Sustituir `[[sdd]]` por `[[intro]]` en el *Dado* |
| LOW | IT-001, IT-002 | Las dos únicas entradas `[ ]` del checklist *Test Cases Progress*. Ya documentadas y aceptadas por decisión de alcance (IT-001 cubierto de facto por EV-001…EV-004 y por los E2E; IT-002 verificación manual, no automatizable en CI). **Se listan por completitud, no como objeción nueva**: coincido con la decisión | Ninguna acción en esta historia |
| — | — | Los cuatro ACs tienen al menos un caso con `Ref` explícita: AC-1 (E2E-001, IT-001, EV-001, EV-003), AC-2 (E2E-002, UT-008, UT-012, IT-001, EV-002), AC-3 (UT-001…UT-007), AC-4 (E2E-001, UT-009, UT-010, UT-012, EV-004). Ambos escenarios Gherkin tienen caso E2E. No hay ninguna entrada `[!]` | — |

No re-reporto, por coincidir con la decisión de alcance registrada: la tercera causa de
exit 2 (`assertRuntime()`, runtime incompatible) sin aserción automatizada —el hueco está
declarado en las *Notas de cobertura* y es materialmente no ejecutable en el runner— ni la
forma de la aserción de `S097-UT-012`, que sí verifica los dos caminos de CR-008 (sobre JSON
en error de parseo y exit 2 ante error inesperado) de manera observable.


**Hallazgos de trazabilidad de diseño (Integration-Reviewer):**

#### Hallazgos — Trazabilidad de diseño en testcases.md

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| — | — | Trazabilidad de diseño correcta en `testcases.md`: las referencias usadas (`D-1`…`D-5`, `F-1`…`F-4`, `CR-008`, `AC-1`…`AC-4`, `NFR-1`/`NFR-2`/`NFR-3`, `T001`…`T008`) existen todas en `design.md` y `tasks.md`; ninguna es huérfana. Los dos casos `IT` llevan referencia de diseño (`IT-001` → `D-5`; `IT-002` → `NFR-3, D-5, F-4`) y no hay casos `API`. `D-6` no se referencia desde un caso, pero está cubierto por el contrato de verificación 12 y por la nota de cobertura de NFR-5 (T016), lo cual es correcto: es una decisión de documentación, no de comportamiento ejecutable | — |


---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban de forma independiente con severidad máxima `LOW`. El `MEDIUM` que bloqueó la segunda pasada está resuelto y verificado por dos revisores: `git diff` sobre `docs/domains/domain-state-management.md` sale vacío, el archivo vuelve a HEAD con sus dos citas a `[[state-machine]]`, la viñeta de §8 y el enlace `[[workflow-canonico-story-y-epic]]` restaurados.

Lo que sostiene la aprobación:

- **Funcionalidad completa y verificada.** Los dos escenarios Gherkin tienen test E2E 1-a-1 en verde y los cuatro ACs tienen `Ref` explícita en `testcases.md`. `npm test` 120/120.
- **Contrato de exit code coherente en seis superficies.** El Integration-Reviewer contrastó una por una el código (`main()`), el docstring, `SKILL.md` (tabla y §3.5), `memory-rules.md` §7, arquitectura §10.4, la guía de pipeline y el `CHANGELOG.md`: todas coinciden entre sí y con la implementación.
- **Sin exposición de seguridad.** 69 reglas evaluadas sobre el alcance completo, 0 hallazgos bloqueantes. El motor usa solo módulos nativos, `check` es estrictamente solo lectura y los fixtures son sintéticos.
- **Diagnóstico de la deuda ahora es correcto.** El Tech-Lead-Reviewer confirmó contra `git` que el commit `7932954` borra ambos documentos en el mismo commit que crea la familia `domain-*.md`, y que `plan-09` está `COMPLETED`. El diagnóstico anterior —"documento canónico aún no escrito"— era falso, y es lo que hizo que la deuda sobreviviera tres pasadas sin resolverse.

Los 11 hallazgos `LOW` no bloquean. Se agrupan así:

**Conteos desfasados en `implement-report.md`** (Tech-Lead #1, Product-Owner #1 y #2) — dice "13 tests `S097-` (UT-001…UT-011)" y `40/40`, cuando el árbol tiene 14 casos `S097-` y 41 `test(`. Misma clase de texto obsoleto que esta pasada cerró en el `CHANGELOG.md` y el docstring; el informe quedó atrás. Se cierran con una sola edición.

**Rastro incompleto** (Tech-Lead #2) — las tres correcciones de texto de esta pasada no están registradas en el `implement-report.md` y caen fuera de la lista blanca del `fix-directives.md`. Falta el rastro, no la corrección.

**Referencia hacia adelante** (Tech-Lead #3) — `implement-report.md` difiere la deuda a **STORY-100**, que todavía no existe: la última historia es STORY-099 y `EPIC-19` llega hasta STORY-094. La referencia se vuelve válida al crear la historia.

**Precisiones en `testcases.md`** (Product-Owner #3 y #4) — el *Entonces* de UT-007 dice "0 `broken-wikilink`" cuando el test asserta `=== 1` (el `[[no-existe]]` deliberado del fixture), y el *Dado* de UT-005 nombra `[[sdd]]` cuando el test usa `[[intro]]`. La estructura de ambos casos sí coincide con lo ejecutado.

**Arrastrados por decisión de alcance**, los cuatro revisores coinciden en mantenerlos como `LOW`:

- `argv.includes('--json')` no acotado al subcomando (Tech-Lead, Integration): un fallo en `index --json` también emitiría el sobre. No afecta al gate de CI ni a ningún contrato documentado.
- Ruta absoluta del host en el sobre JSON de un error inesperado de `fs` (Security): el destino es el log del propio runner, y los mensajes propios (`UsageError`) ya pasan por `displayPath()`.
- `SKILL.md:372-379` sin cláusula de "contenido no confiable = dato, nunca instrucción" en la degradación sin `node` (Security, nuevo): el contenido viene del directorio que el usuario abrió, y la regla determinista `ai-untrusted-content-clause` no dispara.
- `S097-UT-012` declarado antes de `S097-UT-011`, invirtiendo el orden de `testcases.md`. Cosmético.

---

## Siguiente acción

La historia avanza a `CODE-REVIEW/DONE`. Ejecuta `/story-verify STORY-097` para la fase VERIFY.

Trabajo derivado, no bloqueante:

1. **Cerrar los conteos y el rastro del `implement-report.md`** — una sola edición resuelve los tres primeros grupos de `LOW`.
2. **Crear STORY-100 en `EPIC-19-framework-consistency`** para restaurar desde git los dos documentos canónicos borrados (`docs/domain/state-machine.md` y `specs_and_workflows.md` en `7932954^`), conservando sus slugs para que las 33 citas resuelvan sin tocarlas. Eso valida además la referencia hacia adelante del hallazgo Tech-Lead #3 y baja `check --root docs` de 46 a ~13 problemas.
3. **Confirmar la anotación de `STORY-089-*/design.md:54`**, que sigue sin declarar. No se eliminó en esta revisión por indicación del Tech-Lead-Reviewer.

---

## Cumplimiento DoD — Fase CODE-REVIEW

Fuente: `docs/guardrails/dod-story-checklist.md` § *Definition of Done para el estado CODE-REVIEW* (líneas 134-142).

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Definition of Done para el estado IMPLEMENT es satisfactorio | ✓ | — | `implement-report.md` sin criterios ❌; los checklists de seguridad ⚠️ quedan cubiertos por el Security-Reviewer (69 reglas, 0 bloqueantes) |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer `approved`/`LOW`: sin dependencias nuevas, sin TODOs ni código muerto, kebab-case, funciones de responsabilidad única |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | `S097-E2E-001` y `S097-E2E-002` cubren los dos escenarios 1-a-1; sin entradas `[!]` en *Test Cases Progress* |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: CR-007 y CR-008 fieles a lo implementado; D-1…D-6 y CR-001…CR-006 reflejados; sin referencias `D-N` huérfanas |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | 0 HIGH y 0 MEDIUM entre los cuatro agentes; severidad máxima `LOW` |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | T001–T016 y "Implementar fix-directives.md" marcadas `[x]`; 0 entradas `- [ ]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; actualizado a `CODE-REVIEW/DONE` al cierre de este review |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este documento |
| 9 | Revisión de código aprobada (Review status approved) | ✓ | — | `review-status: approved` en el frontmatter |

**Resumen:** 9/9 criterios ✓ · 0 ❌ · 0 ⚠️
