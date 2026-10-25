---
type: plan
slug: plan-02-fix-postinstall-target-validation
title: "Plan 02 — Cerrar el traversal de `SDDF_TARGET` en `postinstall`"
---

# Plan 02 — Cerrar el traversal de `SDDF_TARGET` en `postinstall`

## Contexto

El CLI valida `--target`, pero esa validación no protege todas las entradas del
instalador. `scripts/postinstall.js` entrega `process.env.SDDF_TARGET`
directamente a `installSDDF()`, y `scripts/install.js` construye el destino con
`path.join(base, folder)` sin validar `options.folder`. Por tanto, un valor como
`..\\escape` o `../escape` se normaliza fuera de `INIT_CWD` (instalación local) o
de `os.homedir()` (instalación global), antes de que `copyDir()` cree `skills/` y
`agents/` allí.

El problema no se limita al hook de npm: `installSDDF` se exporta, de modo que
una validación exclusiva del CLI volvería a dejar desprotegidos tanto
`postinstall` como futuros consumidores programáticos.

## Objetivo verificable

Ningún punto de entrada puede hacer que el instalador escriba fuera de su raíz
local o global mediante el valor de destino. Solo se aceptan exactamente
`.claude`, `.agents` y `.github`; cualquier otro valor falla antes de registrar,
crear o copiar rutas. Los tres valores documentados y el destino por defecto
`.claude` conservan su comportamiento actual.

## Alcance

Incluido:

- Centralizar en `installSDDF` el contrato de entrada de `folder`.
- Aplicar allowlist exacta y contención léxica con `path.resolve` y
  `path.relative`, tanto local como globalmente.
- Probar el contrato a través de la API, el hook `postinstall` y el CLI.
- Añadir una regresión determinista y ejecutarla en CI.
- Documentar la validación y preparar un parche de seguridad.

No incluido en el parche inmediato:

- Permitir rutas arbitrarias o variantes normalizadas como `./.agents`,
  `.claude/` o diferencias de mayúsculas. Son valores no documentados y se
  rechazarán de forma intencional.
- Declarar que la contención es física frente a enlaces simbólicos, junctions o
  reparse points preexistentes. `resolve` y `relative` cubren traversal
  textual; la política de enlaces se trata explícitamente como endurecimiento
  posterior.
- Cambiar silenciosamente el contrato de instalación automática de npm. Esa
  decisión se detalla al final y requiere una versión compatible con su
  impacto.

## Diseño de la corrección

### 1. Un único guard de destino en la capa que escribe

En `scripts/install.js`, crear un helper pequeño que reciba `options.folder`:

1. Usa `.claude` solo cuando el valor es `undefined` (destino omitido).
2. Rechaza cualquier otro tipo o cadena que no coincida exactamente con un
   elemento de `VALID_FOLDERS`.
3. Lanza un error accionable que enumere los tres valores permitidos.

`installSDDF()` debe invocar este guard **antes** de llamar a `resolveDestDir`,
mostrar el destino o llegar a `validateDestBase`/`copyDir`. El CLI puede
conservar su chequeo temprano para una mejor experiencia de uso, pero no será
el control de seguridad. Si se extrae el helper para que el CLI lo reutilice,
la fuente de verdad sigue siendo `installSDDF`.

`postinstall.js` debe pasar el valor crudo de `process.env.SDDF_TARGET` y dejar
que el default se resuelva centralmente. Así, una variable ausente conserva
`.claude`, mientras que una variable presente pero vacía o inválida falla de
forma explícita en vez de confundirse con el default mediante `||`.

### 2. Resolver y comprobar la ruta desde una base explícita

Refactorizar `resolveDestDir()` para separar base y candidato:

```js
const baseDir = path.resolve(isGlobal ? os.homedir() : (process.env.INIT_CWD || process.cwd()));
const destDir = path.resolve(baseDir, folder);
const relative = path.relative(baseDir, destDir);
```

Rechazar el candidato si `relative` es vacío, equivale a `..`, comienza por
`..${path.sep}`, o es absoluto. Este control debe ejecutarse antes de cualquier
operación de filesystem y cubre cambios futuros que relajen por error la
allowlist, unidades distintas en Windows y rutas absolutas/UNC.

La allowlist y la contención son deliberadamente redundantes: la primera define
el contrato de producto y la segunda protege su implementación.

### 3. Política de enlaces: registrar el límite sin prometer protección falsa

`fs.statSync()` sigue enlaces. Por ello, un destino permitido que ya sea un
symlink o junction hacia afuera puede eludir la contención física aunque la
cadena de ruta sea válida. El parche debe documentar que resuelve traversal
textual de `SDDF_TARGET`.

Como seguimiento de hardening, decidir si el instalador debe rechazar enlaces
en el destino raíz y en `skills/`/`agents/`, o resolver sus ancestros reales y
comprobarlos. La recomendación es fallar de forma segura para reparse points,
pero debe evaluarse separadamente porque puede romper instalaciones que usan
enlaces de forma deliberada.

## Cambios por archivo

| Archivo | Cambio |
|---|---|
| `scripts/install.js` | Validar el folder efectivo dentro de `installSDDF`; resolver base y destino con `path.resolve`; comprobar la relación con `path.relative` antes de cualquier escritura; mantener `VALID_FOLDERS` como allowlist única. |
| `scripts/postinstall.js` | Entregar `SDDF_TARGET` sin aplicar un default con `||`, para que el default y la validación vivan en el instalador. Mantener el prefijo de error y salida no cero al rechazarlo. |
| `scripts/cli.js` | Conservar o delegar su validación temprana al helper central, sin duplicar reglas divergentes. |
| `test/install.test.js` | Crear pruebas deterministas con `node:test` y `node:assert/strict` para API, hook y CLI. |
| `package.json` | Añadir `test:installer` con `node --test test/install.test.js`, sin dependencias nuevas. |
| `.github/workflows/installer-security.yml` | Añadir un gate ligero para los archivos del instalador, tests y manifiestos: `npm ci --ignore-scripts`, `npm run test:installer` y `npm pack --dry-run`. |
| `README.md` | Declarar que `SDDF_TARGET` no acepta rutas arbitrarias y que los valores no canónicos abortan la instalación sin copiar archivos. |
| `SECURITY.md` | Actualizar el control de integridad de instalación para describir allowlist y contención léxica, sin afirmar cobertura de symlinks que aún no existe. |
| `CHANGELOG.md` | Registrar la corrección de seguridad bajo `Unreleased` y clasificarla como fix para un patch release. |

## Plan de ejecución

1. Crear primero la suite aislada del instalador con directorios temporales. El
   caso RED principal llamará directamente a
   `installSDDF({ folder: '../escape' })`; reproducirá el bypass actual sin
   escribir fuera de un sandbox temporal.
2. Implementar el helper de folder efectivo y llamarlo desde `installSDDF`
   antes de resolver, loguear o tocar el filesystem. Conservar el default solo
   para `undefined`.
3. Sustituir la composición de `path.join` por base y destino resueltos, y
   añadir el guard de `path.relative` antes de `validateDestBase`.
4. Ajustar `postinstall` y el CLI para que no reintroduzcan defaults o reglas
   diferentes. El hook debe propagar la excepción como `SDDF postinstall
   failed:` y terminar con código no cero.
5. Completar los casos GREEN, incluyendo `force: true`, para demostrar que
   ninguna ruta invalidada alcanza `ensureDir` ni `copy`.
6. Añadir el workflow de regresión con `--ignore-scripts` al instalar
   dependencias de CI: evita que el propio hook altere el checkout antes de las
   pruebas. Hacer que se active por cambios en `scripts/**`, `test/**`,
   `package.json`, `package-lock.json`, README, SECURITY y el workflow.
7. Actualizar documentación y changelog solo después de fijar el contrato
   exacto de valores; ejecutar el empaquetado seco para comprobar que los
   scripts necesarios siguen publicados.
8. Publicar el arreglo mínimo como patch release y comunicar que solo se
   rechazan valores de destino no soportados.

## Matriz de validación

| Caso | Entrada / preparación | Resultado esperado |
|---|---|---|
| Default local | `folder` y `SDDF_TARGET` ausentes, con `INIT_CWD` temporal | Exit exitoso; copia solo bajo `<sandbox>/.claude/`. |
| Targets permitidos | API y `postinstall` con `.claude`, `.agents`, `.github` | Exit exitoso; aparecen `skills/` y `agents/` bajo el target solicitado. |
| API directa maliciosa | `../escape`, `..\\escape`, `.claude/../../escape`, absoluta y UNC; repetir con `force: true` | Promesa rechazada antes de copiar; no se crean `escape/skills` ni `escape/agents`. |
| Hook malicioso | Subproceso `node scripts/postinstall.js` con los mismos valores y `INIT_CWD` temporal | Exit distinto de cero, prefijo `SDDF postinstall failed:`, cero escrituras fuera de la base temporal. |
| CLI conservado | `cli.js install --target ../escape` | Sigue fallando sin escribir; los tres valores documentados conservan éxito. |
| Global | Subproceso con `npm_config_global=true` y home temporal | Target permitido queda bajo el home temporal; traversal falla sin crear un hermano de ese home. |
| Valores no canónicos | `''`, `null`, número, `./.agents`, `.claude/`, espacios y mayúsculas distintas | Rechazo explícito; el mensaje lista solo los valores válidos. |
| Contención futura | Prueba unitaria del helper con base y candidato fuera, igual o en otra unidad cuando aplique | Rechazo para relativo vacío, ascendente o absoluto; aceptación solo de hijo estricto. |
| Empaquetado y gate | CI limpia | `npm ci --ignore-scripts`, `npm run test:installer`, `npm run verify:security-ci` y `npm pack --dry-run` terminan correctamente. |

Todos los casos que escriben usarán `fs.mkdtemp` y limpieza registrada en
`t.after()`. Las pruebas globales deben ejecutarse en un subproceso con `HOME`
y `USERPROFILE` temporales, nunca contra el home real del desarrollador o del
runner.

## Decisión separada: volver la instalación automática opt-in

La copia automática no debe retrasar este parche: hoy README, SECURITY y el
requisito FR-052 de `project.md` prometen que `postinstall` copia por defecto.
Cambiarla ahora sin migración mezclaría una corrección crítica con una ruptura
de comportamiento.

Se recomienda abrir un cambio posterior, de versión mayor, con esta decisión:

1. **Opción recomendada:** retirar `postinstall` del paquete y exigir el
   comando explícito `agile-sddf install` / `npx agile-sddf install`. Es el
   único enfoque que evita ejecutar también el hook de npm por defecto.
2. **Alternativa de transición:** conservar un hook no operativo salvo una
   señal explícita como `SDDF_AUTO_INSTALL=1`. Reduce copias inesperadas, pero
   el código del hook aún se ejecuta y por ello ofrece una garantía menor.

Si se aprueba cualquiera de ellas, actualizar `package.json`, README,
SECURITY, `project.md`/FR-052, guías de upgrade y CHANGELOG; añadir casos donde
la ausencia de opt-in no cree ningún destino y los valores inválidos continúen
fallando. No presentar esa transición como un patch compatible.

## Criterios de cierre

- [ ] La API, `postinstall` y el CLI comparten el mismo conjunto de targets
      válidos.
- [ ] Un valor de traversal, absoluto, UNC o no canónico no provoca ninguna
      escritura fuera de un sandbox de prueba.
- [ ] La contención léxica se comprueba antes de `ensureDir`, `copy` y de
      imprimir una ruta destino.
- [ ] Los tres destinos soportados y el default actual pasan en modos local y
      global.
- [ ] La regresión determinista corre en CI y el paquete sigue incluyendo sus
      scripts de instalación.
- [ ] README, SECURITY y CHANGELOG describen el contrato implantado, incluido
      el límite conocido respecto de enlaces.
- [ ] La decisión de instalación opt-in queda aprobada y planificada como
      cambio separado, o se mantiene explícitamente fuera de este patch.
