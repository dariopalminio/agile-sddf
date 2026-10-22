---
alwaysApply: false
type: design
id: STORY-148
slug: STORY-148-contrato-de-rutas-fijas-y-gate-determinista-design
title: "Design: Contrato de rutas fijas y gate determinista"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-148
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-147-adr-del-layout-fijo-de-tres-raices
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-147-adr-del-layout-fijo-de-tres-raices]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

La historia sustituye el auditor del contrato de raíz configurable (`SDDF-ROOT-RESOLUTION: v1`) por un validador del **contrato de layout fijo** (ADR-0016, STORY-147) y lo conecta a `verify:repository`. No migra el contenido de ningún skill (Non-Goals: STORY-149 a STORY-158).

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `scripts/audit-root-resolution.js` | Auditor de solo lectura (STORY-093). Exige en cada `skills/*/SKILL.md` el marcador `<!-- SDDF-ROOT-RESOLUTION: v1 -->`; exige `root:` no vacío en `sddf.config.yaml` y en los assets de `sddf-init`; prohíbe `SDDF_ROOT=` asignado en `.env.template`; detecta el preflight automático (`findStalePreflightClaim`) en skills, sus soportes `.md`/`.json` y 10 docs vigentes (`ACTIVE_DOCS`); exige que `skill-preflight` se declare «diagnóstico explícito» y no verifique `openspec/config.yaml`; avisa (`[WARN]`) si un doc vigente no menciona `SDDF_ROOT`. No exporta funciones: ejecuta al cargarse. |
| `scripts/verify-repository.js` | `steps()` declara el paso `{ label: 'resolución de raíces', args: ['scripts/audit-root-resolution.js'] }` (3.º de 14). Exporta `steps`, `runStep`, `verifyRepository`. |
| Referencias versionadas al script legado | `scripts/verify-repository.js:19`, `sddf.config.yaml:20` (`verify.integration.command`), `config/profiles.json:45` (stack `sddf-authoring`, `required: true`), `test/profile-contract.test.js:39` (lista de copia del fixture), `test/verify-repository.test.js:14` (label esperado), `CHANGELOG.md:262` (histórico). Ver CR-002. |
| `scripts/verify-profiles.js` | Valida que cada comando obligatorio sea `npm run <script>` existente o `node scripts/<archivo>` existente (`extractNodeScript`). Por eso el reemplazo del archivo exige actualizar `config/profiles.json` y el fixture de `test/profile-contract.test.js` en el mismo cambio. |
| `skills/` | 36 skills fuente. **Todos** contienen hoy `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE` o `SDDF_ROOT` (de 3 coincidencias en `docs-wiki-builder` a 47 en `memory-system`). Ninguno declara aún el contrato de layout fijo. |
| `skills/skill-preflight/SKILL.md` | 16 coincidencias: bloque v1, tabla de precedencia `SDDF_ROOT` → `root` → `docs`, salida `[OK] SPECS_BASE = <ruta>`. Su migración a diagnóstico del layout legado la hace otra historia de EPIC-26. |
| `docs/specs/stories/STORY-147-…/design.md` | ADR-0016 (aún no creado; STORY-147 en `READY-FOR-IMPLEMENT/DONE`) fija las rutas fijas y el retiro de `SDDF_ROOT`/`root`/`SPECS_BASE`, pero **no define un marcador ni un texto canónico del bloque de contrato**. Ver CR-001. |
| Convención de scripts | CommonJS `'use strict'`, `node:` built-ins, funciones exportadas con `module.exports` y CLI bajo `if (require.main === module)` (`verify-validation-contract.js`, `check-doc-links.js`, `verify-repository.js`); salida `[OK]`/`[WARN]`/`[ERROR]`; `process.exitCode = 1` en fallo. Nombres `verify-<contrato>.js` con alias `npm run verify:<contrato>`. |
| Convención de pruebas | `node:test` + `node:assert/strict`; fixtures en `fs.mkdtempSync(os.tmpdir())` con limpieza en `t.after` (`test/profile-contract.test.js`). No existe `test/fixtures/`. |
| EPIC-26 | CS-2: `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/` vacío salvo diagnóstico en `skill-preflight`. CS-3: ningún skill lee la clave `root` de `sddf.config.yaml`. CS-12: `npm test` y `verify:repository` en verde. |

Stakeholders: el mantenedor que ejecuta las historias de migración (cada una retira skills de la lista transitoria) y STORY-157, que verifica la lista vacía al cerrar la épica.

## Goals / Non-Goals

**Goals:**
- Definir el contrato de layout fijo verificable de un `SKILL.md`: marcador, bloque y tokens prohibidos // satisface: AC-1, AC-2
- Crear `scripts/verify-fixed-layout.js`, validador determinista, sin entorno ni configuración // satisface: AC-1, AC-2, CNF-1, CNF-2
- Reportar cada referencia legada con skill y número de línea // satisface: AC-2
- Admitir las menciones de diagnóstico del layout legado solo en `skill-preflight`, en una región delimitada // satisface: AC-2
- Lista transitoria explícita de skills pendientes de migración, que el gate obliga a mantener exacta // satisface: AC-1, AC-2 (Non-Goals de la historia)
- Sustituir el paso del gate y todas las referencias al script legado, y eliminarlo // satisface: AC-1, AC-2
- Pruebas unitarias del validador con fixtures (conforme, legado, excepción de `skill-preflight`) // satisface: CNF-3

**Non-Goals:**
- Migrar el contenido de cualquier skill o retirar entradas de la lista transitoria (STORY-149 a STORY-158)
- Retirar `root: docs` de `sddf.config.yaml` o de los assets de `sddf-init` (STORY-149 y siguientes)
- Redactar el ADR-0016 (STORY-147); solo se pide incluir el marcador (CR-001)
- Validar las copias instaladas en destinos de runtime (`.claude/skills/`, etc.): son salida de `agile-sddf install`, no fuente
- Editar `CHANGELOG.md` (registro histórico; la entrada de versión se escribe al publicar)

## Decisions

### D-1 — Contrato de layout fijo de un `SKILL.md` // satisface: AC-1, AC-2

Un `skills/<skill>/SKILL.md` es **conforme** si y solo si cumple las cuatro reglas:

| Regla | Condición verificable | Mensaje de error (formato) |
|---|---|---|
| R1 — Marcador | contiene la línea exacta `<!-- SDDF-FIXED-LAYOUT: v1 -->` | `skills/<skill>/SKILL.md: falta el contrato de layout fijo (<!-- SDDF-FIXED-LAYOUT: v1 -->)` |
| R2 — Bloque completo | el bloque del contrato (desde el marcador hasta el siguiente encabezado `#`–`######` o fin de archivo) contiene `REPO_ROOT`, `specs/flow/`, `docs/templates/` y `docs/guardrails/` | `skills/<skill>/SKILL.md:<línea del marcador>: el bloque del contrato no declara <token>` |
| R3 — Sin resolución legada | ninguna línea contiene `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE` ni `SDDF_ROOT` | `skills/<skill>/SKILL.md:<línea>: referencia legada \`<token>\`` |
| R4 — Sin lectura de `root` | ninguna línea contiene a la vez la palabra `root` (minúsculas, límite de palabra) y `sddf.config.yaml` | `skills/<skill>/SKILL.md:<línea>: lee la clave legada \`root\` de sddf.config.yaml` |

- R3 y R4 se evalúan línea a línea y se emite **un error por cada línea y token**, con número de línea 1-based (AC-2: «nombra el skill y la línea»).
- «Resuelve solo `REPO_ROOT`» (contrato (b) de la historia) se verifica como R2 (el bloque nombra `REPO_ROOT`) ∧ R3 ∧ R4 (no nombra ninguna otra raíz). No se verifica semántica de prosa.
- La región de diagnóstico de `skill-preflight` (D-3) se excluye de R3 y R4 únicamente en ese skill.

Texto canónico del bloque que adoptarán las historias de migración (lo fija ADR-0016, CR-001):

```markdown
### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).
```

**Alternativas rechazadas:**
- **Comparar el bloque contra el texto canónico byte a byte:** cada skill necesita introducir su paso 0 con su propio número de paso y contexto; un diff de espacios rompería el gate sin aportar garantía. Los tokens requeridos (R2) capturan la intención.
- **Solo marcador, sin R2:** un skill podría declarar el marcador con un bloque vacío o incompleto y pasar el gate; AC-1 exige que el bloque use las tres rutas fijas.
- **Detectar `root` en cualquier línea:** `root` es una palabra común en prosa y en código (`root:` de otros YAML, «root cause»); el falso positivo sería masivo. Limitarlo a líneas que nombran `sddf.config.yaml` cubre CS-3 con ruido acotado.

### D-2 — Validador nuevo `scripts/verify-fixed-layout.js` // satisface: AC-1, AC-2, CNF-1, CNF-2

Script CommonJS sin dependencias (solo `node:fs` y `node:path`), siguiendo la convención `verify-*.js`:

| Elemento | Contrato |
|---|---|
| Constantes exportadas | `LAYOUT_MARKER = '<!-- SDDF-FIXED-LAYOUT: v1 -->'`; `REQUIRED_BLOCK_TOKENS = ['REPO_ROOT', 'specs/flow/', 'docs/templates/', 'docs/guardrails/']`; `LEGACY_TOKENS = ['SDDF-ROOT-RESOLUTION: v1', 'SPECS_BASE', 'SDDF_ROOT']`; `DIAGNOSTIC_SKILL = 'skill-preflight'`; `PENDING_MIGRATION` (D-4) |
| `checkSkillLayout(name, content) → string[]` | Aplica R1–R4 (y la región de D-3 si `name === DIAGNOSTIC_SKILL`) a un contenido; devuelve los mensajes de error sin prefijo de ruta absoluta. Función pura: sin I/O. |
| `verifyFixedLayout({ repoRoot, pending = PENDING_MIGRATION }) → { errors: string[], warnings: string[], skills: string[], pending: string[] }` | Lista `<repoRoot>/skills/*/SKILL.md` en orden alfabético, aplica D-4 y `checkSkillLayout`, y conserva los chequeos heredados de D-5. Solo lectura. |
| CLI | `node scripts/verify-fixed-layout.js [--quiet] [--json]` (mismos flags que el script legado). Encabezado `── Contrato de layout fijo ──`; `[WARN]` por cada aviso, `[ERROR]` por cada error; si no hay errores: `[OK] Contrato de layout fijo verificado en <N> skill(s); <M> pendiente(s) de migración.`; `process.exitCode = 1` si hay errores. |
| Alias npm | `"verify:layout": "node scripts/verify-fixed-layout.js"` en `package.json › scripts` |

Determinismo (CNF-1): el validador no lee `process.env`, no lee `sddf.config.yaml` y deriva `repoRoot` de `path.resolve(__dirname, '..')` en modo CLI; con el mismo árbol produce la misma salida (orden alfabético de skills, orden de línea de los errores).

**Alternativas rechazadas:**
- **Adaptar `audit-root-resolution.js` in place:** su nombre describe el contrato que se retira y su núcleo (marcador v1 y `root:` obligatorio) se invierte; la historia pide eliminarlo. Un archivo nuevo deja un diff legible y un nombre alineado con `verify:*`.
- **Integrar el chequeo en `verify-validation-contract.js` o `check-doc-links.js`:** mezcla contratos con razones de cambio distintas (P11).
- **Usar el parser de `memory-system` o una librería de Markdown:** CNF-2 prohíbe dependencias nuevas, y el contrato es por líneas y encabezados.

### D-3 — Región de diagnóstico del layout legado en `skill-preflight` // satisface: AC-2

En `skills/skill-preflight/SKILL.md`, y **solo** en ese skill, las líneas comprendidas entre `<!-- SDDF-LEGACY-DIAGNOSTIC:start -->` y `<!-- SDDF-LEGACY-DIAGNOSTIC:end -->` se excluyen de R3 y R4. Fuera de la región, `skill-preflight` cumple el contrato completo (R1–R4).

| Caso | Resultado |
|---|---|
| `SPECS_BASE`/`SDDF_ROOT` dentro de la región en `skill-preflight` | sin error |
| Mismo token fuera de la región en `skill-preflight` | error R3 con línea |
| Región en cualquier otro skill | se ignora la región (sus líneas se evalúan) y se emite `skills/<skill>/SKILL.md:<línea>: la región SDDF-LEGACY-DIAGNOSTIC solo se admite en skill-preflight` |
| `start` sin `end`, `end` sin `start` o regiones anidadas | error `skills/skill-preflight/SKILL.md:<línea>: región SDDF-LEGACY-DIAGNOSTIC sin cerrar` (o `sin abrir`) y la región no exime nada |

**Alternativas rechazadas:**
- **Eximir `skill-preflight` por completo:** contradice CS-2 («salvo las menciones de diagnóstico») y dejaría pasar el bloque v1 copiado.
- **Heurística por palabras («diagnóstico», «legado») en la línea:** frágil y dependiente de redacción; los marcadores explícitos son deterministas y revisables.

### D-4 — Lista transitoria `PENDING_MIGRATION` // satisface: AC-1, AC-2

Constante exportada en `scripts/verify-fixed-layout.js`: arreglo ordenado alfabéticamente con los nombres de los skills pendientes. Valor inicial: **los 36 directorios actuales de `skills/`** (todos contienen hoy referencias legadas y ninguno declara el contrato; ver Context), incluido `skill-preflight`.

Reglas del gate sobre la lista:

| Condición | Resultado |
|---|---|
| Skill en la lista | se omite `checkSkillLayout`; se cuenta en `pending` |
| Entrada que no corresponde a un directorio de `skills/` | error `PENDING_MIGRATION: <skill> no existe en skills/ — retíralo de la lista` |
| Skill en la lista que ya es conforme (R1–R4 sin errores) | error `PENDING_MIGRATION: <skill> ya cumple el contrato — retíralo de la lista` |
| Lista no vacía | `[WARN] <M> skill(s) pendientes de migración al layout fijo (EPIC-26): <lista>` |

- Cada historia de migración retira de la lista los skills que migra en el mismo cambio en que añade el bloque; STORY-157 (AC-3) verifica la lista vacía.
- Los dos errores de higiene garantizan que la lista nunca sea más amplia que la deuda real: un skill migrado no puede quedarse exento.

**Alternativas rechazadas:**
- **Archivo de datos aparte (`config/layout-migration.json`):** añade un archivo, un parser y una ruta a mantener para una lista efímera que debe desaparecer al cerrar la épica; la constante es visible en el diff de cada historia de migración.
- **Sin lista (gate rojo hasta migrar todo):** rompe CS-12 durante toda la épica e impide integrar STORY-148 antes de las migraciones (contradice la independencia declarada en la historia).
- **Excluir por patrón (p. ej. «skills sin marcador»):** un skill nuevo sin contrato pasaría el gate sin quedar registrado como deuda.

### D-5 — Chequeos heredados que se conservan y que se retiran // satisface: AC-1, AC-2

El validador reemplaza al auditor legado; se decide explícitamente qué cobertura sobrevive:

| Chequeo de `audit-root-resolution.js` | Decisión | Razón |
|---|---|---|
| Marcador `SDDF-ROOT-RESOLUTION: v1` obligatorio | **retirar** (pasa a prohibido, R3) | Es el contrato que se reemplaza |
| `root:` no vacío en `sddf.config.yaml` y en `sddf-init/assets/sddf.config.yaml.{template,example}` | **retirar** | Contradice ADR-0016; su retiro físico es de STORY-149 y siguientes, que no deben encontrar un gate que lo exija |
| `[WARN]` si un doc de `ACTIVE_DOCS` no menciona `SDDF_ROOT` | **retirar** | Invierte el contrato nuevo |
| `$SDDF_ROOT/sddf.config.yaml` y `$REPO_PATH … $SDDF_ROOT` en skills | **retirar** | Subsumido por R3 para skills migrados |
| `.env.template` sin `SDDF_ROOT=` asignado | **conservar** | Coherente con el retiro (nunca debe asignarse); sin costo |
| Preflight automático (`findStalePreflightClaim`) en `SKILL.md` (salvo `skill-preflight`), soportes `.md`/`.json` de cada skill y `ACTIVE_DOCS` | **conservar** sin cambios | Contrato vigente no relacionado con la raíz; se aplica a todos los skills, también a los pendientes |
| `skill-preflight` declarado «diagnóstico explícito» y sin `openspec/config.yaml` | **conservar** | Contrato vigente de STORY-093 no relacionado con la raíz |

`findStalePreflightClaim`, `collectSupportFiles` y `ACTIVE_DOCS` se trasladan al validador nuevo con el mismo comportamiento.

**Alternativas rechazadas:**
- **Retirar todo lo heredado:** perdería la protección contra el preflight automático, que ningún otro script del gate verifica.
- **Mantener el auditor legado en paralelo:** dos pasos del gate con contratos contradictorios (marcador v1 obligatorio vs prohibido).

### D-6 — Sustitución en el gate y en las referencias // satisface: AC-1, AC-2

| Archivo | Cambio |
|---|---|
| `scripts/verify-repository.js` | paso `{ label: 'resolución de raíces', args: ['scripts/audit-root-resolution.js'] }` → `{ label: 'contrato de layout fijo', args: ['scripts/verify-fixed-layout.js'] }`, misma posición (3.º) |
| `test/verify-repository.test.js` | label esperado `'resolución de raíces'` → `'contrato de layout fijo'` |
| `sddf.config.yaml` | `verify.integration.command: "node scripts/audit-root-resolution.js"` → `"node scripts/verify-fixed-layout.js"` (la clave `root` no se toca) |
| `config/profiles.json` | stack `sddf-authoring`, verificación `"node scripts/audit-root-resolution.js"` → `"node scripts/verify-fixed-layout.js"` (`required: true` igual) |
| `test/profile-contract.test.js` | lista de `profileFixture`: `'scripts/audit-root-resolution.js'` → `'scripts/verify-fixed-layout.js'` |
| `package.json` | añadir `"verify:layout": "node scripts/verify-fixed-layout.js"` |
| `scripts/audit-root-resolution.js` | **eliminar** |

`git grep -n "audit-root-resolution" -- ':!CHANGELOG.md' ':!docs/specs' ':!.tmp' ':!.temp'` queda vacío tras el cambio.

**Alternativas rechazadas:**
- **Dejar `audit-root-resolution.js` como envoltorio que delega:** la historia pide eliminarlo; un alias sin uso es deuda.
- **Mantener el label `resolución de raíces`:** describe un contrato retirado y confunde el diagnóstico del gate.

### D-7 — Pruebas unitarias `test/verify-fixed-layout.test.js` // satisface: CNF-3, AC-1, AC-2

Fixtures temporales con `fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-layout-'))` y limpieza en `t.after` (patrón de `test/profile-contract.test.js`). Cada fixture crea `skills/<skill>/SKILL.md` con contenido mínimo y los archivos que exigen los chequeos heredados de D-5 (`skills/skill-preflight/SKILL.md` con «diagnóstico explícito», `.env.template` y los `ACTIVE_DOCS` necesarios, o se invoca `checkSkillLayout` directamente para los casos puros).

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Conforme | `SKILL.md` con el bloque canónico de D-1 | `checkSkillLayout` → `[]`; `verifyFixedLayout({ pending: [] })` sin errores |
| Bloque legado | `SKILL.md` con `<!-- SDDF-ROOT-RESOLUTION: v1 -->` en la línea N y `SPECS_BASE` en la línea M | errores que contienen `skills/<skill>/SKILL.md:N` y `:M` y el token |
| Sin marcador | `SKILL.md` sin `SDDF-FIXED-LAYOUT` | error R1 |
| Bloque incompleto | marcador sin `docs/guardrails/` en su bloque | error R2 que nombra el token |
| Lectura de `root` | línea `` Lee `root` de `sddf.config.yaml` `` | error R4 con línea |
| Excepción de `skill-preflight` | `SDDF_ROOT` dentro de la región de D-3 | sin error |
| Fuera de la región | `SDDF_ROOT` fuera de la región en `skill-preflight` | error R3 con línea |
| Región en otro skill | marcadores de región en un skill distinto | error de D-3 y la línea interna se reporta |
| Lista transitoria | skill legado en `pending` | sin error de layout; `[WARN]` de pendientes |
| Entrada obsoleta | skill conforme en `pending` | error `ya cumple el contrato` |
| Entrada inexistente | `pending` con un skill ausente | error `no existe en skills/` |
| Determinismo | dos ejecuciones sobre el mismo fixture con `process.env.SDDF_ROOT` distinto | resultados idénticos (`deepEqual`) |

**Alternativas rechazadas:**
- **Probar contra el árbol real `skills/`:** el resultado cambia con cada historia de migración; la historia exige fixtures (Independencia).
- **Ejecutar el CLI con `spawnSync` en todos los casos:** más lento y acopla las aserciones al formato de consola; las funciones exportadas se prueban directo y basta un caso de CLI (exit code) cubierto por `verify-repository`.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Validador del contrato de layout fijo | crear | `scripts/verify-fixed-layout.js` | AC-1, AC-2, CNF-1, CNF-2 |
| Pruebas del validador | crear | `test/verify-fixed-layout.test.js` | CNF-3 |
| Gate determinista | modificar (un paso) | `scripts/verify-repository.js` | AC-1, AC-2 |
| Prueba del gate | modificar (un label) | `test/verify-repository.test.js` | AC-1, AC-2 |
| Configuración del proyecto | modificar (`verify.integration.command`) | `sddf.config.yaml` | AC-1 |
| Manifiesto de perfiles | modificar (un comando) | `config/profiles.json` | AC-1 |
| Prueba de perfiles | modificar (una ruta de fixture) | `test/profile-contract.test.js` | AC-1 |
| Scripts npm | modificar (alias `verify:layout`) | `package.json` | AC-1 |
| Auditor legado | eliminar | `scripts/audit-root-resolution.js` | AC-2 |

No se modifica ningún `SKILL.md` (Non-Goals).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Marcador del contrato | línea exacta `<!-- SDDF-FIXED-LAYOUT: v1 -->` en `SKILL.md` | AC-1 |
| Bloque del contrato | desde el marcador hasta el siguiente encabezado Markdown; contiene `REPO_ROOT`, `specs/flow/`, `docs/templates/`, `docs/guardrails/` | AC-1 |
| Región de diagnóstico | `<!-- SDDF-LEGACY-DIAGNOSTIC:start -->` … `<!-- SDDF-LEGACY-DIAGNOSTIC:end -->`, efectiva solo en `skill-preflight` | AC-2 |
| `checkSkillLayout(name: string, content: string) → string[]` | pura; mensajes `skills/<name>/SKILL.md[:<línea>]: <motivo>` | AC-1, AC-2 |
| `verifyFixedLayout({ repoRoot: string, pending?: string[] }) → { errors, warnings, skills, pending }` | solo lectura; sin `process.env` ni `sddf.config.yaml` | AC-1, AC-2, CNF-1 |
| CLI `node scripts/verify-fixed-layout.js [--quiet] [--json]` | exit 0 sin errores, 1 con errores; `--json` imprime el objeto de `verifyFixedLayout` | AC-1, AC-2 |
| Paso del gate | `steps()` incluye `{ label: 'contrato de layout fijo', command: process.execPath, args: ['scripts/verify-fixed-layout.js'] }` | AC-1, AC-2 |

## Esquema de datos // satisface: AC-1, AC-2

Resultado de `verifyFixedLayout` (y de `--json`):

```yaml
errors:   [string]   # "skills/<skill>/SKILL.md:<línea>: referencia legada `SPECS_BASE`", …
warnings: [string]   # "<M> skill(s) pendientes de migración al layout fijo (EPIC-26): …"
skills:   [string]   # nombres de skills/ en orden alfabético
pending:  [string]   # entradas de PENDING_MIGRATION presentes en skills/
```

## Flujos clave

### F-1 — Skill conforme pasa el gate // AC-1
1. `npm run verify:repository` ejecuta el paso `contrato de layout fijo`.
2. `verifyFixedLayout` lista los skills; el skill no está en `PENDING_MIGRATION`.
3. `checkSkillLayout` encuentra el marcador (R1), el bloque con los cuatro tokens (R2) y ninguna línea legada (R3, R4) → `[]`.
4. Sin errores en el resto de skills y chequeos heredados → `[OK] …`, exit 0; el gate continúa y termina en verde.

### F-2 — Skill con resolución legada hace fallar el gate // AC-2
1. Un skill fuera de la lista contiene `SPECS_BASE` en la línea 42.
2. `checkSkillLayout` emite `skills/<skill>/SKILL.md:42: referencia legada \`SPECS_BASE\``.
3. El CLI imprime `[ERROR] …` y sale con 1; `runStep` lanza `contrato de layout fijo: falló con exit 1`; `verify:repository` termina en rojo.

### F-3 — Diagnóstico en `skill-preflight` // AC-2
1. `skill-preflight` (ya migrado, fuera de la lista) declara el contrato y una región `SDDF-LEGACY-DIAGNOSTIC` que menciona `SDDF_ROOT` y `SPECS_BASE`.
2. Las líneas de la región no se evalúan con R3/R4; el resto sí → sin error.

### F-4 — Retiro de un skill de la lista (historias de migración) // AC-1
1. La historia de migración añade el bloque al skill y lo retira de `PENDING_MIGRATION` en el mismo cambio.
2. Si olvida retirarlo, el gate falla con `ya cumple el contrato — retíralo de la lista`.

### F-5 — Degradación // P7
- `skills/` ausente o `SKILL.md` ilegible: error explícito con la ruta (`no se pudo leer (<motivo>)`), nunca éxito silencioso (comportamiento heredado de `read`).
- Un `ACTIVE_DOCS` ausente: error con la ruta, como hoy.
- El validador no escribe nada: un fallo no deja estado parcial.

### F-6 — Puntos de cambio // P6
- **Versión del contrato:** un cambio incompatible del bloque se modela con `SDDF-FIXED-LAYOUT: v2` y una constante nueva, sin tocar R3/R4.
- **Rutas fijas:** viven solo en `REQUIRED_BLOCK_TOKENS`; si la épica de Living Spec añade `specs/living/` al contrato, se cambia una constante y el texto canónico.
- **Fin de la transición:** cuando `PENDING_MIGRATION` quede vacía (STORY-157), la constante y sus reglas pueden retirarse sin afectar R1–R4.

## Decisiones de complejidad justificada

- **R2 (tokens del bloque) además del marcador:** sin R2 el gate aceptaría un marcador vacío; AC-1 pide que el bloque use las rutas fijas. Es una comprobación de inclusión de cadenas, no un parser.
- **Región delimitada en `skill-preflight` (D-3):** la alternativa simple (eximir el skill entero) incumple CS-2; dos marcadores HTML son el mínimo determinista.
- **Errores de higiene de la lista (D-4):** dos condiciones adicionales evitan que la lista crezca o envejezca; sin ellas STORY-157 tendría que auditarla a mano.
- **Conservar chequeos heredados (D-5):** el validador reemplaza al auditor; descartar la detección del preflight automático dejaría una regresión silenciosa en el gate.
- No se crea parser YAML ni Markdown, ni archivo de configuración, ni eval LLM: el contrato es textual y la verificación cabe en `npm test` + `verify:repository`.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Un skill conforme no produce errores | `node --test test/verify-fixed-layout.test.js` (caso «Conforme») | AC-1 |
| 2 | El gate termina en verde con el árbol actual | `npm run verify:repository` → exit 0 (36 skills pendientes, `[WARN]` de lista) | AC-1, CS-12 |
| 3 | Referencia legada falla con skill y línea | caso «Bloque legado»: mensajes con `SKILL.md:<N>` y el token | AC-2 |
| 4 | El gate falla ante un skill legado fuera de la lista | caso «Bloque legado» vía `verifyFixedLayout` → `errors.length > 0`; el CLI sale con 1 | AC-2 |
| 5 | Excepción de `skill-preflight` | casos «Excepción» y «Fuera de la región» | AC-2 |
| 6 | Determinismo | caso «Determinismo»; `grep -nE "process\.env\|sddf\.config\.yaml'" scripts/verify-fixed-layout.js` sin lecturas de entorno ni de la configuración | CNF-1 |
| 7 | Sin dependencias nuevas | `git diff package.json` solo añade el script `verify:layout`; `dependencies` igual | CNF-2 |
| 8 | `npm test` incluye y aprueba las pruebas | `npm test` → exit 0 con `test/verify-fixed-layout.test.js` | CNF-3 |
| 9 | Script legado eliminado sin referencias vivas | `test ! -e scripts/audit-root-resolution.js`; `git grep -n audit-root-resolution -- ':!CHANGELOG.md' ':!docs/specs' ':!.tmp' ':!.temp'` vacío | AC-2 |
| 10 | Perfiles coherentes | `npm run verify:profiles` y `node --test test/profile-contract.test.js` → exit 0 | AC-1 |
| 11 | Alcance acotado | `git diff --stat` solo muestra los 9 archivos de «Componentes afectados» (más artefactos de la historia); ningún `SKILL.md` | Non-Goals |

## Risks / Trade-offs

- **[Riesgo] ADR-0016 no fija marcador ni texto del bloque, y aún no existe** → D-1 fija `SDDF-FIXED-LAYOUT: v1` y el texto canónico; CR-001 pide incluirlos en ADR-0016 al implementar STORY-147. La precondición de la historia (ADR `ACCEPTED`) se verifica antes de implementar (T001 de `tasks.md`).
- **[Trade-off] La lista inicial contiene los 36 skills:** el contrato nuevo no protege ningún skill hasta la primera migración. Es el estado real del repo; los errores de higiene (D-4) y STORY-157 garantizan que la exención se reduzca a cero.
- **[Riesgo] R4 puede dar falsos positivos** en un skill migrado que mencione `sddf.config.yaml` y la palabra `root` con otro sentido → el mensaje nombra la línea; se reformula la línea. No se añade lista de excepciones (YAGNI).
- **[Limitación] R3/R4 no detectan referencias indirectas** (p. ej. «la raíz configurada»): el contrato es textual por diseño (CNF-1); la revisión de las historias de migración cubre la prosa.
- **[Limitación] Las copias instaladas (`.claude/skills/`, etc.) no se validan:** son salida de `agile-sddf install`; reflejan `skills/` tras reinstalar.

## Open Questions

Ninguna: el marcador y el texto del bloque quedan fijados en D-1 (CR-001); las referencias no listadas en la historia se incluyen en D-6 (CR-002); la redacción de mensajes y la estructura interna, abiertas a negociación según la historia, quedan decididas en D-1 a D-4.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-1, D-2, D-4, D-6; contratos 1, 2, 10), AC-2 (D-1, D-3, D-6; contratos 3, 4, 5, 9), CNF-1 (D-2; contrato 6), CNF-2 (D-2; contrato 7), CNF-3 (D-7; contrato 8). CS-3 (lectura de `root`) cubierto por R4.
- **Ambigüedad:** «resuelve solo `REPO_ROOT`» operacionalizado como R2 ∧ R3 ∧ R4; «menciones de diagnóstico» como región delimitada (D-3); marcador fijado (CR-001).
- **Nombres:** «contrato de layout fijo», «referencia legada», «lista transitoria» / `PENDING_MIGRATION`, «diagnóstico del layout legado» se usan igual que en la historia y la épica.
- **Estructura:** `checkSkillLayout` (puro) ← `verifyFixedLayout` (I/O de lectura) ← CLI ← `verify-repository`; sin ciclos. Cada componente tiene una razón de cambio; sin código de implementación en este documento (el bloque canónico es contenido Markdown del contrato, no lógica).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: la historia dice que el marcador y el texto del bloque del contrato los «fija el ADR de STORY-147», pero el diseño de ADR-0016 (STORY-147) solo fija las rutas fijas y el retiro de `SDDF_ROOT`/`root`/`SPECS_BASE`; no define marcador ni texto. ADR-0016 aún no existe en `docs/adr/`.
- **Documento afectado**: STORY-147 `design.md`/`tasks.md` (contenido de `## Decisión` de ADR-0016); story.md de STORY-148 (precondición)
- **Acción requerida**: al implementar STORY-147, incluir en `## Decisión` de ADR-0016 el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` y el texto canónico del bloque de D-1 (y la región `SDDF-LEGACY-DIAGNOSTIC` de D-3 para `skill-preflight`). Si ADR-0016 se acepta sin ellos, STORY-148 los documenta en `docs/guides/skill-structural-pattern.md` y lo registra en `implement-report.md`. Implementar STORY-148 solo con ADR-0016 `ACCEPTED`.

### CR-002
- **Tipo**: dependencia
- **Descripción**: la historia lista como referencias del script legado `scripts/verify-repository.js`, `sddf.config.yaml` y `test/profile-contract.test.js`, pero también lo referencian `config/profiles.json` (verificación obligatoria del stack `sddf-authoring`, validada por `verify-profiles.js`) y `test/verify-repository.test.js` (label del paso). Sin actualizarlos, `verify:profiles` y `npm test` fallarían al eliminar el script.
- **Documento afectado**: story.md (Notas › Alcance mínimo del contrato)
- **Acción requerida**: añadir `config/profiles.json` y `test/verify-repository.test.js` a la lista de referencias que se actualizan. El diseño ya los incluye (D-6).
