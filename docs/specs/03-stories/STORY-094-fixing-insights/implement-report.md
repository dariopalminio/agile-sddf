
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
