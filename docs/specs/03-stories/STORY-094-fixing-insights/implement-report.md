
# Reporte de Implementación

## Implementación del Plan 01 — Corregir la cobertura y el fallo de la CI de seguridad

Cambios principales:
- [skill-security-audit.yml](D:/code/agile-sddf/.github/workflows/skill-security-audit.yml) ahora:
  - Se activa en PRs y pushes a main para skills, agentes, scripts, políticas, guardrails y workflows.
  - Audita seis fuentes reales: skills, agents, scripts, docs/policies, docs/guardrails y .github/workflows.
  - Falla ante cualquier salida no cero del escáner.
  - Conserva audit-report.txt incluso en fallo.
  - Ejecuta un verificador de su propio contrato antes del escaneo.
- Añadí [verify-skill-security-workflow.js](D:/code/agile-sddf/scripts/verify-skill-security-workflow.js) y el comando npm run verify:security-ci para prevenir regresiones como volver a .claude/skills, tolerar errores o quitar rutas protegidas.
- Actualicé [SECURITY.md](D:/code/agile-sddf/SECURITY.md) con el alcance real de la CI y enlaces válidos a los guardrails.
Validado con:
- npm run verify:security-ci
- node --check scripts/verify-skill-security-workflow.js
- git diff --check
También confirmé que Skill Shielder admite directorios locales y sus códigos 0/1/2/3. La ejecución real del workflow queda pendiente de workflow_dispatch o una PR en GitHub; configurar ese check como obligatorio para main requiere acceso administrativo al repositorio.
Detecté cambios concurrentes en varias historias ajenas; los dejé intactos. El clon temporal usado para inspeccionar el escáner fue eliminado.

---

## Implementación del Plan 02 — Cerrar el traversal de `SDDF_TARGET`

Cambios principales:

- `scripts/install.js` valida el destino dentro de `installSDDF` y acepta
  únicamente `.claude`, `.agents` y `.github`; el default `.claude` solo se
  aplica cuando no se entrega un valor.
- La resolución local y global usa `path.resolve` y comprueba con
  `path.relative` que el destino sea un hijo estricto de su base antes de
  registrar, crear o copiar archivos.
- `postinstall` entrega el valor crudo de `SDDF_TARGET` para que el contrato
  central rechace también valores vacíos o no canónicos. El CLI conserva su
  rechazo temprano y ahora también falla si `--target` no recibe valor.
- Se añadió `test/install.test.js` y `npm run test:installer`, con fixtures
  temporales para API, hook local/global, CLI, traversal, rutas absolutas/UNC y
  el helper de contención.
- Se añadió el workflow `installer-security.yml`; instala dependencias sin
  lifecycle scripts, ejecuta la regresión y valida el contenido publicable.
- README, SECURITY y CHANGELOG documentan los valores permitidos y el límite
  explícito: la corrección garantiza contención léxica, no resuelve symlinks o
  junctions preexistentes.

Validado con:

- RED: `node --test --test-name-pattern "rejects invalid targets" test/install.test.js`
  falló contra el instalador previo porque `../escape` no era rechazado.
- GREEN: `npm run test:installer` — 6/6 pruebas pasaron.
- `npm run verify:security-ci`.
- `node --check scripts/install.js`, `scripts/postinstall.js`, `scripts/cli.js`
  y `test/install.test.js`.
- `npm pack --dry-run` — paquete generado con los scripts actualizados.
- `git diff --check`.

No se modificó la decisión de convertir `postinstall` en opt-in: se mantiene
como cambio mayor separado, según el alcance de Plan 02.

--

## Solución: `security-audit` sacado de README

Problema resuelto: El README anuncia capacidades que no están en el core, como `security-audit` y OpenSpec. [README](/D:/code/agile-sddf/README.md:67) · [OpenSpec](/D:/code/agile-sddf/README.md:323); Riesgo de onboarding fallido. Publicar una matriz clara: Core / Extensión / Runtime / Requisito externo. Se sacó del README.

---

## Implementación del Plan 03 — Cerrar falsos verdes del runner de evals

Cambios principales:

- `scripts/run-evals.js` incorpora `--changed-from <ref>` y hace mutuamente
  excluyentes los selectores posicionales, `--all` y `--changed-from`.
- La resolución de cambios Git usa `execFileSync` con argumentos; valida la
  referencia como commit y compara su SHA con `HEAD` sin interpolación de
  shell.
- Un preflight carga y valida todos los manifests antes de llamar a Claude,
  valida `--only` sobre la unión de IDs y rechaza filtros, manifiestos,
  referencias o planes vacíos. Los skills sin coincidencias válidas se omiten.
- Una salida de Claude con código no cero o timeout ahora cuenta como error
  aunque contenga texto que pudiera aprobar la calificación.
- Se añadió `test/run-evals.test.js`, el script
  `npm run test:eval:runner` y el workflow `evals.yml`. Las PR con cambios en
  skills comparan la SHA base inmutable contra el head con historial completo
  y solo planifican evals; no ejecutan LLMs ni usan credenciales.
- README, AGENTS y CHANGELOG documentan el contrato de selección, los códigos
  de salida y el alcance real de CI.

Validado con:

- `npm run test:eval:runner` — 18/18 pruebas pasaron.
- `node --check scripts/run-evals.js` y `node --check test/run-evals.test.js`.
- Ejecuciones reales de CLI: árbol limpio y referencia inexistente retornaron
  exit 1.
- `git diff --check`.

---

## Implementación del Plan 04 — Cerrar hallazgos pendientes de auditoría

### Resultado

Se implementaron los paquetes P1–P7 con contratos versionados, validadores
deterministas y pruebas de regresión.

- **P1 — runner de evals:** `scripts/run-evals.js` valida nombres de skill,
  IDs `TC-NNN`, duplicados por manifest y `--skills-dir`; resuelve cada ruta
  mediante contención léxica antes de leer, escribir o invocar Claude. La
  suite cubre traversal, UNC, rutas absolutas y preserva la reutilización de
  IDs entre skills.
- **P2/P3 — instalación y perfiles:** se eliminó el lifecycle `postinstall`
  del paquete; el archivo heredado es un no-op. Solo `agile-sddf install`
  copia archivos y solo `--global` explícito puede cambiar el alcance. Los
  manifiestos `config/profiles.json` definen `core` (sin workers ni comandos
  externos obligatorios) y `dogfood` (workers fijados por URL, SHA y lock).
  El stack de pruebas del repositorio quedó en `sddf-authoring`, no en core.
- **P4 — runtimes:** `config/runtimes.json` es la fuente única para Claude
  Code, OpenCode y GitHub Copilot. Instalador, CLI, ayuda, documentación y
  smoke consumen ese contrato; `.agents` queda explícitamente como
  compatibilidad de skills, no como target instalable.
- **P5/P6 — gate y documentación:** `npm run verify:repository` agrupa
  pruebas, sintaxis, raíces, perfiles, runtimes, YAML, inventario de evals,
  enlaces, supply chain, release, empaquetado y smoke. Las nueve ausencias de
  evals tienen excepción versionada con dueño, razón y fecha. README publica
  la matriz core/extensión/runtime y los documentos activos que describen
  layouts remiten a `config/runtimes.json`.
- **P7 — supply chain:** Actions, Trivy y Skill Shielder están fijados a SHA.
  El validador falla ante tags, clones remotos no allowlisted o sin checkout y
  comprobación de `HEAD` inmutables.

### Evidencia local

- `npm run verify:repository` — **59/59** pruebas deterministas aprobadas;
  sintaxis de 28 archivos JS, auditoría de 32 skills, 32 skills con 9
  excepciones de eval explícitas, 34 documentos activos sin enlaces rotos,
  release `3.0.0` y smoke del tarball aprobados.
- `node scripts/smoke-package-install.js` valida el tarball en un consumidor
  temporal: no hay hooks de lifecycle permitidos, no aparecen destinos
  locales/globales ni `.agents` antes de la acción explícita, los tres
  runtimes copian el inventario y contenido completos de `skills/` y
  `agents/`, y un destino no declarado falla.
- `node scripts/verify-profiles.js --profile core` aprueba sin extensión.
  La prueba de perfil comprueba que dogfood sin lock/worker falla con URL y
  SHA accionables, y que un fixture fijado pasa.
- `npm ci --ignore-scripts --dry-run` aprobó; el gate y la CI usan lifecycle
  desactivado incluso durante el empaquetado y el smoke.

### Evidencia pendiente de CI hospedada

`.github/workflows/quality.yml` declara la misma verificación en Ubuntu,
Windows y macOS, sin secretos LLM ni lifecycle scripts. Esta ejecución local
aporta evidencia Windows; la confirmación real de runners Linux/macOS quedará
registrada cuando el workflow corra en una PR, push a `main` o
`workflow_dispatch`. No se publicó el paquete ni se ejecutaron evaluaciones
LLM durante esta implementación.

No se modificó el estado de `story.md`: faltan los artefactos formales
`design.md` y `tasks.md` para una transición SDD, y la evidencia hospedada
sigue pendiente.
