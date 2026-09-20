# Plan 04 — Cerrar los hallazgos pendientes de la auditoría

## Objetivo

Completar los hallazgos de `insights.md` que siguen abiertos después de los
planes 01–03, sin rehacer los controles ya corregidos. El resultado debe hacer
reproducible la instalación **core**, explícito el entorno de desarrollo del
propio framework (**dogfood**), seguro el runner de evals y verificable el
contrato de distribución, documentación y CI en Windows, macOS y Linux.

## Línea base comprobada

Los siguientes hallazgos ya están cerrados y este plan solo debe conservar sus
regresiones:

| Hallazgo de la auditoría | Estado | Evidencia actual |
|---|---|---|
| CI de Skill Shielder sobre las fuentes canónicas y con fallo bloqueante | Corregido por Plan 01 | `scripts/verify-skill-security-workflow.js` y `.github/workflows/skill-security-audit.yml` |
| Allowlist y contención léxica de `SDDF_TARGET` | Corregido por Plan 02 | `test/install.test.js` cubre destinos inválidos, traversal y hook actual |
| Falsos verdes del runner y selección desde SHA base | Corregido por Plan 03 | `test/run-evals.test.js` cubre 18 casos y `evals.yml` usa `--changed-from` |
| Contrato de resolución de raíces | Corregido por STORY-093 | `node scripts/audit-root-resolution.js` completa sin errores |

Siguen abiertos los siguientes puntos:

| ID | Pendiente | Evidencia de partida |
|---|---|---|
| P1 | El runner permite traversal por nombre de skill, ID de caso y `--skills-dir`. | `scripts/run-evals.js` usa `path.join()` con esos valores antes de las lecturas/escrituras. |
| P2 | La instalación automática sigue activa. | `package.json` declara `postinstall`; `scripts/postinstall.js` llama a `installSDDF()` sin acto explícito del usuario. |
| P3 | `core`, `dogfood` y los stacks no son perfiles reproducibles. | El `sddf.config.yaml` raíz exige `skill-test-evals` y `skill-master`, aunque no forman parte de `skills/`. |
| P4 | No existe un contrato único de runtime → destino. | Instalador, README, `skill-preflight` y guías discrepan entre `.agents/` y `.opencode/`. |
| P5 | La cadena determinista y de empaquetado es parcial. | Faltan comandos requeridos en `package.json`, validadores de enlaces/configuración/inventario, smoke cross-platform y 9 de 32 skills no tienen manifiesto de evals. |
| P6 | La documentación activa contiene enlaces y capacidades incoherentes. | DoD, constitution, guardrails e índice tienen rutas rotas; README todavía presenta OpenSpec como capacidad core. |
| P7 | Las dependencias de CI y Skill Shielder no están fijadas inmutablemente; el release gate no es verificable. | Workflows usan tags mutables, Skill Shielder se clona sin SHA y el runbook/changelog no están alineados con la versión actual. |

## Decisiones de arquitectura previas

Antes de modificar instalador, perfiles o documentación se creará un ADR. Es
necesario porque las decisiones afectan a varios scripts, skills y plataformas,
y restringirán futuras instalaciones.

1. **Runtimes soportados y rutas canónicas.** Decidir expresamente qué runtime
   soporta el paquete y, para cada uno, el directorio local/global y el formato
   de skills y agentes. No se asumirá que `.agents/` equivale a OpenCode si el
   runtime requiere `.opencode/`.
2. **Compatibilidad de instalación.** Retirar la copia automática de
   `postinstall` es un cambio incompatible. Definir la versión SemVer y el
   mensaje de migración: `npm install` no escribe directorios de runtime y
   `npx agile-sddf install` pasa a ser el único acto de copia por defecto.
3. **Política de extensiones.** Definir un origen, revisión inmutable y lista
   exacta de workers para dogfood. La CI de PR no descargará ni ejecutará una
   extensión remota; validará un fixture local o el manifiesto fijado.

El ADR también distinguirá estas tres nociones:

| Concepto | Responsabilidad |
|---|---|
| `core` | Perfil distribuido por npm. Solo usa contenido incluido en el paquete y no requiere workers externos. Debe ser el valor predeterminado. |
| `dogfood` | Perfil usado para desarrollar Agile SDDF. Declara explícitamente los workers externos de autoría y su revisión fijada; falla con diagnóstico si faltan. |
| `stack` | Composición de comandos de verificación y workers para una tecnología. No es una tercera instalación implícita: un perfil selecciona o referencia un stack declarado. |

## Paquete de trabajo 1 — Contención completa del runner de evals

### Diseño

1. Añadir en `scripts/run-evals.js` un helper único de ruta contenida basado en
   `path.resolve()` y `path.relative()`. Recibirá una raíz y segmentos, y
   rechazará raíz vacía, resultado igual a la raíz, salida por `..`, rutas
   absolutas, UNC y separadores que permitan salir del árbol.
2. Establecer contratos de entrada antes de leer, crear directorios o invocar
   Claude:
   - skill: `^[a-z0-9]+(?:-[a-z0-9]+)*$`;
   - ID de caso: `^TC-\d{3,}$`;
   - IDs únicos dentro de cada `evals.json` (se mantiene la reutilización de un
     mismo ID entre skills distintos);
   - `--skills-dir`: ruta relativa contenida bajo el `repoRoot` efectivo.
3. Aplicar el helper a `SKILL.md`, `evals/evals.json`, cambios Git, `runs/`,
   stdout, stderr y el informe. La ruta temporal debe quedar siempre dentro de
   `.tmp/skill-test-evals/` o del `tmpRoot` inyectado y contenido para pruebas.
4. Mantener el contrato actual de seguridad para enlaces simbólicos: la primera
   versión garantiza contención léxica, igual que el instalador. Si se decide
   ampliar a contención física (`realpath`/junctions), registrarlo como alcance
   explícito y cubrirlo por plataforma, no como efecto accidental del helper.

### Pruebas

Extender `test/run-evals.test.js` con fixtures aislados para:

- skills `../x`, `..\\x`, rutas absolutas y UNC;
- `--skills-dir` vacío, externo o que escape del repositorio;
- IDs `../x`, `..\\x`, `TC-001/extra`, duplicados internos y formatos no
  `TC-NNN`;
- ausencia de creación de archivos fuera de `tmpRoot` ante cualquier rechazo;
- preservación de los casos válidos y de la reutilización inter-skill;
- uso de argumentos separados para Git y de la SHA resuelta, nunca una cadena
  de shell interpolada.

### Cierre

`npm run test:eval:runner` debe aprobar los casos vigentes y los nuevos. Todo
input inválido termina con exit 1 antes de crear archivos o llamar a Claude.

## Paquete de trabajo 2 — Perfiles explícitos y postinstall opt-in

### Diseño de perfiles

1. Versionar un manifiesto legible por máquina para perfiles y stacks, junto
   con un validador determinista. Debe listar para cada perfil:
   - configuración base y overlays aplicables;
   - workers requeridos/opcionales;
   - origen y revisión inmutable de cada extensión;
   - comandos de verificación que el perfil declara;
   - runtimes con los que es compatible.
2. Hacer que `sddf-init` genere `core` de forma predeterminada. En core, los
   workers externos quedan como `none` y `required: false`; ningún comando
   obligatorio puede apuntar a un script inexistente.
3. Declarar el `sddf.config.yaml` de este repositorio como `dogfood`, no como
   configuración universal. Su bootstrap debe ser explícito, no una descarga
   silenciosa, y la validación debe mostrar exactamente qué extensión, revisión
   y worker falta.
4. Corregir el valor inválido `required: tfalserue` de la plantilla y validar
   semánticamente que todos los `required` sean booleanos y que cada comando
   requerido exista en los scripts del proyecto correspondiente.
5. Añadir al `files` de npm solamente los manifiestos y scripts necesarios para
   validar/usar core; las extensiones no se empaquetan ni se instalan por
   dependencia transitiva.

### Instalación explícita

1. Eliminar la copia por lifecycle como comportamiento predeterminado. Una
   instalación limpia de npm no creará `.claude/`, `.agents/`, `.github/` ni
   ninguna otra carpeta de runtime.
2. Conservar `agile-sddf install` como comando explícito y permitir un opt-in
   claro y documentado solo si el ADR lo aprueba. No se reutilizará una variable
   de entorno ambigua para convertir silenciosamente la instalación en escritura.
3. Actualizar las pruebas de `postinstall`: en vez de demostrar la copia
   automática, deben demostrar que no hay escrituras durante `npm install` y
   que el comando explícito sigue respetando allowlist y contención.
4. Actualizar README, SECURITY, CLI help, CHANGELOG y el runbook de migración.
   La guía debe indicar `npm install --ignore-scripts` como práctica defensiva
   válida, pero ya no como workaround necesario para evitar la copia.

### Cierre

- Un proyecto vacío puede instalar y usar el perfil core sin extensiones.
- Dogfood sin sus workers fijados falla temprano y explica cómo proveerlos;
  dogfood con un fixture/instalación fijada pasa su validación.
- `npm install` no escribe en el proyecto ni en el home del usuario.

## Paquete de trabajo 3 — Contrato único multi-runtime y smoke cross-platform

1. Implementar el mapa aprobado en el ADR como una única fuente de datos
   versionada. Debe contener id de runtime, destinos local/global, directorios
   de skills/agentes, extensiones de archivo y estado de soporte.
2. Consumir el mapa desde `scripts/install.js`, `scripts/cli.js`, los mensajes
   de ayuda y `skill-preflight`. Ninguno debe mantener una segunda lista de
   `.claude`, `.agents`, `.github` o `.opencode`.
3. Actualizar README, SECURITY, AGENTS, guardrails y guías activas para derivar
   las rutas del mismo contrato. Los documentos históricos conservarán su
   contexto y se marcarán como históricos en vez de reescribirse masivamente.
4. Añadir pruebas de consistencia que fallen si un runtime se documenta o se
   instala sin aparecer en el mapa. Probar inventario y contenido, no solo que
   `mkdir` termina sin error.
5. Ejecutar smoke tests empaquetando el tarball (`npm pack`) e instalándolo en
   un directorio temporal. En cada runtime soportado validar:
   - ausencia de copia implícita;
   - copia explícita al destino canónico;
   - inventario de `skills/` y `agents/` igual al del paquete;
   - descubrimiento por el runtime/preflight que corresponda;
   - rechazo de destino no declarado.
6. Ejecutar la matriz en Windows y Linux; incluir macOS mientras el soporte
   siga prometido por STORY-094/README. Si algún runtime no puede verificarse
   en un runner hospedado, documentar la razón y dejar un job manual bloqueante
   antes de declararlo soportado.

## Paquete de trabajo 4 — Gate determinista, documentación activa y release hygiene

### Cadena determinista

Crear un comando agregado, por ejemplo `npm run verify:repository`, y un
workflow de CI general que, sin credenciales LLM ni lifecycle scripts, ejecute:

1. `node --test` para todas las suites deterministas.
2. Chequeo de sintaxis de scripts y pruebas Node.
3. `node scripts/audit-root-resolution.js`.
4. Validación de perfiles/stacks, booleanos YAML, comandos requeridos y
   manifiestos de evals.
5. Inventario de evals: los nueve skills sin `evals/evals.json`
   (`docs-wiki-builder`, `project-begin`, `project-context-diagram`,
   `project-discovery`, `project-flow`, `project-planning`,
   `project-policies-generation`, `project-story-mapping` y
   `reverse-engineering`) deben obtener evals o una exclusión versionada con
   dueño, razón y fecha de revisión. No se aceptará una ausencia silenciosa.
6. Link checker local para documentación activa, con reglas explícitas para
   anchors, enlaces externos y archivos históricos excluidos.
7. `npm pack --dry-run` y el smoke de instalación del paquete generado.

Reconciliar `sddf.config.yaml` con esa realidad: crear los scripts requeridos
o marcar las categorías que este repositorio no usa como no requeridas. No
deben permanecer `test:unit` ni `test:component:file` obligatorios si
`package.json` no los ofrece.

Las evaluaciones LLM reales quedan fuera de PRs no confiables: solo jobs
manuales/nocturnos, con CLI y credenciales configurados, pueden ejecutar
`npm run test:eval -- --all`. Una falta de CLI/autenticación debe dejar ese job
rojo, nunca verde ni omitido como si hubiera evidencia.

### Documentación y enlaces

1. Corregir primero los enlaces activos conocidos:
   - `docs/policies/dod-story.md` hacia `../guardrails/gr-*.md`;
   - `docs/policies/constitution.md` hacia rutas relativas válidas;
   - referencias internas de los guardrails;
   - entradas inexistentes de `docs/index.md`.
2. Recalcular el índice y sustituir la afirmación no verificada de «0 enlaces
   rotos» por resultado generado por el link checker.
3. Publicar una matriz de capacidades en README con estas columnas: capacidad,
   perfil (`core`/`dogfood`), origen (paquete/extensión), runtime compatible y
   requisito externo. OpenSpec y los meta-skills deben figurar inequívocamente
   como extensión o retirarse del flujo core; `security-audit` debe describirse
   como control de CI del repositorio salvo que se distribuya explícitamente.
4. Revisar el runbook de publicación para la versión y estructura vigentes.
   Actualizar el CHANGELOG con una única sección correspondiente a la versión
   publicada y eliminar/explicar encabezados duplicados.

### Release gate

Añadir una verificación determinista que compruebe:

- coherencia `package.json` ↔ `package-lock.json` ↔ CHANGELOG;
- formato y unicidad de la sección de release;
- allowlist real de `npm pack`;
- smoke de instalación desde el tarball;
- inventario de skills/agentes incluido en el paquete;
- que publicar sigue requiriendo una aprobación explícita, sin convertir CI de
  PR en una publicación.

## Paquete de trabajo 5 — Cadena de suministro reproducible

1. Fijar Skill Shielder a un commit completo y verificable tanto en
   `Dockerfile.dev` como en `skill-security-audit.yml`. Tras el clone se debe
   verificar que `HEAD` coincide con la revisión declarada.
2. Fijar todas las GitHub Actions a SHA completa, acompañada por comentario con
   el tag/release humano (`checkout`, `setup-node`, `upload-artifact`, Trivy y
   cualquier action nueva).
3. Añadir un validador que rechace `uses:` basado solo en tags y clones remotos
   sin ref inmutable. La imagen base Debian ya usa digest y debe preservarse.
4. Ejecutar ese validador en la cadena determinista y conservar informes de
   auditoría aunque Skill Shielder falle.

## Orden de ejecución

1. Aprobar ADR de runtime, perfiles, stacks y cambio SemVer de `postinstall`.
2. Implementar y probar P1 (contención del runner), independiente del cambio
   de instalación.
3. Implementar perfiles, validador de configuración y el cambio explícito de
   instalación (P2–P3).
4. Extraer el contrato de runtime y montar los smoke tests multiplataforma
   sobre la instalación ya explícita (P4).
5. Incorporar gate determinista, inventario de evals, link checker, matriz de
   capacidades y release verification (P5–P6).
6. Fijar supply chain y hacer que el gate la compruebe (P7).
7. Ejecutar la matriz completa, actualizar `implement-report.md` con evidencia
   real y solo entonces revisar los criterios de cierre de STORY-094.

## Matriz de aceptación

| Escenario | Resultado esperado |
|---|---|
| Nombre/ID/ruta maliciosa para `run-evals` | Exit 1, sin lectura/escritura fuera de sus raíces ni invocación de Claude. |
| `npm install` de un tarball core en directorio vacío | No crea directorio de runtime ni ejecuta copia implícita. |
| `npx agile-sddf install --target <runtime>` | Copia solo al destino definido por el mapa y conserva el inventario del paquete. |
| Perfil core | Sin workers externos obligatorios ni comandos inexistentes. |
| Perfil dogfood sin extensión | Diagnóstico bloqueante, explícito y reproducible. |
| Perfil dogfood con fixture/revisión fijada | Valida todos sus workers y comandos declarados. |
| CI de PR | Ejecuta verificaciones deterministas, sin LLM ni secretos; cualquier selección/configuración/enlace inválido falla. |
| CI de Windows, macOS y Linux | El smoke de empaquetado e instalación pasa para los runtimes declarados compatibles. |
| Supply chain | Ninguna action ni clone remoto crítico usa una referencia mutable. |
| Release | La versión, changelog, contenido del tarball y smoke son coherentes antes de publicar. |

## Criterios de cierre

- [x] P1–P7 no dejan rutas de escritura, capacidades, perfiles ni runtimes
      implícitos.
- [ ] El paquete core se instala de manera limpia y explícita en las plataformas
      que README declara soportadas.
- [x] Dogfood no se confunde con core ni depende de extensiones no fijadas.
- [x] Ningún enlace local activo ni control de CI crítico puede quedar verde sin
      evidencia determinista.
- [x] El informe de implementación distingue evidencia local, CI hospedada y
      verificaciones manuales que requieran permisos administrativos.
