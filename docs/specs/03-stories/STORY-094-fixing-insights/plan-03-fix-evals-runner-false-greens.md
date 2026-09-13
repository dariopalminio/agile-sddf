# Plan 03 — Cerrar falsos verdes del runner de evals

## Objetivo

Impedir que scripts/run-evals.js termine exitosamente sin haber seleccionado
y procesado al menos un caso de evaluación. El contrato resultante debe servir
tanto para uso local como para un gate de CI: código de salida 0 solo significa
que existe un plan de ejecución no vacío y que, fuera de --dry-run, todos los
casos ejecutados aprobaron.

## Contexto

Actualmente, sin cambios locales bajo skills/, el modo implícito resuelve una
lista vacía y termina con exit 0. Asimismo, --only filtra los casos de cada
manifest, advierte cuando un ID no existe y puede terminar con cero casos y
exit 0. Ambas situaciones permiten que un control de calidad quede verde sin
evidencia.

La CI actual no contiene un workflow de evals. Sus checkouts usan la
profundidad por defecto, insuficiente para comparar correctamente el HEAD de
una PR con su SHA base.

## Alcance

Incluido:

- Añadir --changed-from <ref> para seleccionar skills modificados desde una
  referencia Git.
- Fallar cerrado ante referencias inválidas, skills no seleccionados, cero
  casos finales o IDs solicitados inexistentes.
- Validar toda la selección antes de invocar claude.
- Añadir pruebas deterministas del runner y un workflow de CI para la
  selección de evals.
- Documentar el contrato de flags, selección y códigos de salida.

No incluido:

- Resolver el hallazgo independiente de traversal de IDs y rutas de salida.
- Proveer silenciosamente credenciales o una instalación de Claude CLI en CI.
- Usar pull_request_target para dar secretos a código no confiable.

## Diseño de la corrección

### 1. Modos de selección explícitos

Extender parseArgs() y la ayuda de scripts/run-evals.js con:

    --changed-from <ref>  Ejecuta los skills modificados en <ref>...HEAD

El runner tendrá cuatro modos de alcance:

| Modo | Selección |
|---|---|
| Skills posicionales | Los manifests de los skills indicados. |
| --all | Todos los skills con evals/evals.json. |
| --changed-from <ref> | Skills con archivos modificados entre ref y HEAD. |
| Sin selector | Cambios locales actuales respecto de HEAD, para uso local. |

Los tres selectores explícitos (skills posicionales, --all y
--changed-from) serán mutuamente excluyentes. --only será un filtro posterior,
no un selector de skills. También se rechazará un valor vacío para --only.

Al recibir --changed-from, el runner debe comprobar que la referencia resuelve
a un commit y obtener los archivos mediante git diff <base>...HEAD -- <skills
dir>. Los errores de Git no se ignorarán: se reportarán con una guía para
proveer una referencia disponible o ejecutar --all.

Como la referencia llega desde la línea de comandos, la invocación Git debe
usar argumentos de proceso (execFileSync o equivalente) en vez de interpolar
un comando de shell. Esto evita introducir una nueva vía de inyección al
añadir el flag.

### 2. Preflight de casos y política de fallo cerrado

Separar el flujo actual en dos fases:

1. Resolver los nombres de skills.
2. Cargar, validar y filtrar todos los manifests antes de ejecutar el primer
   caso.

El preflight debe rechazar con exit 1:

- una lista de skills vacía, incluso en --dry-run;
- un evals.json inválido o con cases[] vacío;
- un --only vacío;
- uno o más IDs solicitados que no existan en la unión de los skills
  seleccionados;
- un filtro cuya selección final total sea cero;
- una referencia Git inválida o inaccesible.

Los IDs TC-NNN se reutilizan entre skills. Por ello, la existencia de --only se
validará sobre la unión de los casos de los skills seleccionados, no exigiendo
que cada ID exista en cada manifest. El informe de selección mostrará el número
de casos efectivos por skill; los skills sin coincidencias de un filtro válido
no se ejecutarán.

La validación se completa antes de llamar a Claude. Una lista mixta, por
ejemplo un ID válido y otro inexistente, debe fallar sin consumir llamadas LLM
parciales.

El contrato de salida queda así:

| Situación | Exit code |
|---|---|
| Selección inválida, cero casos, ref/manifest/ID inválido | 1 |
| Ejecución real con uno o más casos fallidos o con error | 1 |
| --dry-run con al menos un caso válido planificado | 0 |
| Ejecución real con al menos un caso y todos aprobados | 0 |

## Cambios por archivo

| Archivo | Cambio |
|---|---|
| scripts/run-evals.js | Añadir --changed-from; validar combinaciones de selectores y referencias Git; sustituir la selección silenciosa por preflight bloqueante; validar --only y el total de casos antes de ejecutar. |
| test/run-evals.test.js | Nueva suite node:test con fixtures aislados y pruebas de selección, errores y códigos de salida, sin invocar Claude. |
| package.json | Exponer la suite determinista del runner mediante un script de prueba específico. |
| .github/workflows/evals.yml | Nuevo workflow para comprobar el contrato del runner y seleccionar los evals de PR desde la SHA base. |
| README.md | Documentar --changed-from, ejemplos local/PR/manual y semántica de los exits. |
| AGENTS.md | Actualizar la descripción de CI cuando el workflow funcional exista. |
| CHANGELOG.md | Registrar el fix si se prepara un patch release. |

## Plan de ejecución

1. Crear primero la suite determinista del runner con manifests de fixture y
   un repositorio Git temporal, o con la capa Git inyectable que permita
   simular sus salidas.
2. Extender el parser, la cabecera de ayuda y los ejemplos con
   --changed-from <ref>. Rechazar combinaciones ambiguas antes de resolver
   archivos.
3. Refactorizar changedSkills() para aceptar opcionalmente una base. Con base,
   comparar el rango ref...HEAD; sin base, conservar la detección local actual.
   Propagar fallos de Git en lugar de convertirlos en una lista vacía.
4. Construir el preflight que carga todos los evals.json, calcula el conjunto
   de casos tras --only, valida IDs y comprueba que el total sea mayor que cero.
   Solo después iniciar el pool de concurrencia.
5. Mantener el comportamiento de reportes para ejecuciones válidas y hacer que
   los diagnósticos de preflight sean concisos y accionables.
6. Añadir el script de tests y ejecutarlo en CI para cambios de runner,
   pruebas, manifiesto o workflow.
7. Crear el workflow de evals para PRs que modifiquen skills/**. Debe usar
   actions/checkout con fetch-depth: 0 y ejecutar:

       npm run test:eval -- --changed-from "${{ github.event.pull_request.base.sha }}" --dry-run

   La SHA, y no el nombre de rama, será la base inmutable de comparación.
8. Reservar la evaluación LLM real para un job confiable que use el mismo
   --changed-from sin --dry-run y guarde .tmp/skill-test-evals/** con
   if: always(). Para una ejecución manual o nocturna completa, usar --all.
9. Configurar la autenticación e instalación del CLI antes de hacer obligatorio
   el job LLM real. Si faltan credenciales o CLI, el job debe fallar, no
   saltarse ni aprobar el control.
10. Actualizar README, AGENTS.md y changelog para que no prometan una cobertura
    de CI distinta de la realmente implementada.

## Matriz de validación

| Caso | Resultado esperado |
|---|---|
| Árbol limpio, sin argumentos, con y sin --dry-run | Exit 1 y diagnóstico de que no se seleccionó ningún caso. |
| --all con fixture válido | Exit 0 en dry-run y al menos un prompt/caso listado. |
| Skill explícito con --only inexistente | Exit 1, ID informado y cero invocaciones a Claude. |
| --only con ID válido e ID inexistente | Exit 1 antes de cualquier ejecución parcial. |
| --only vacío o solo separadores | Error de argumentos, exit 1. |
| --changed-from válido | Solo selecciona skills modificados en el rango indicado. |
| --changed-from con SHA/ref inexistente | Exit 1 con diagnóstico de referencia no disponible. |
| Rango válido sin skills evaluables | Exit 1; nunca el mensaje de “nada que ejecutar” con éxito. |
| --all combinado con skill o --changed-from | Error de uso, exit 1. |
| PR CI | Checkout completo, uso de la SHA base y selección no vacía demostrable en dry-run. |
| Job LLM confiable | Ejecución real; informes disponibles aun si hay fallo; falta de CLI o autenticación deja el job rojo. |

## Criterios de cierre

- [ ] Ninguna ruta de selección puede terminar con exit 0 y cero casos.
- [ ] Un --only inexistente o parcialmente inexistente aborta antes de llamar a
      Claude.
- [ ] --changed-from compara una referencia validada contra HEAD sin
      interpolación de shell.
- [ ] Las pruebas deterministas cubren los falsos verdes y se ejecutan en CI.
- [ ] Las PRs de skills usan la SHA base con historial suficiente; las
      ejecuciones completas usan --all en un contexto confiable.
- [ ] README y AGENTS.md describen el contrato real de ejecución y CI.
