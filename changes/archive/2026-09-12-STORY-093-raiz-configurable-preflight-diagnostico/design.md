---
alwaysApply: false
type: design
id: STORY-093
slug: STORY-093-raiz-configurable-preflight-diagnostico-design
title: "Design: Resolver una raíz configurable y usar preflight como diagnóstico"
date: 2026-09-12
status: PLAN
substatus: DONE
parent: EPIC-19-framework-consistency
story: STORY-093
related:
  - STORY-093-raiz-configurable-preflight-diagnostico
  - STORY-049-reading-of-sddf-root
  - STORY-053-centralizar-validacion-entorno-sddf
  - STORY-054-inicializar-entorno-sddf
---

<!-- Referencias -->
[[STORY-093-raiz-configurable-preflight-diagnostico]]
[[STORY-049-reading-of-sddf-root]]
[[STORY-053-centralizar-validacion-entorno-sddf]]
[[STORY-054-inicializar-entorno-sddf]]

# Diseño técnico: Resolver una raíz configurable y usar preflight como diagnóstico

## Context

La resolución vigente solo considera SDDF_ROOT y el fallback docs. A la vez, la mayoría
de los skills invocan automáticamente skill-preflight como Paso 0. Eso duplica lectura,
validación y contexto en el camino habitual, y deja en conflicto el contrato de
STORY-049 con la política creada por STORY-053.

El archivo sddf.config.yaml ya vive en la raíz del repositorio, pero aún no declara la
raíz de artefactos. Tampoco puede tratarse SPECS_BASE como raíz del repositorio: el
primero contiene documentación SDDF, mientras que la configuración, el código y las
rutas de runtime pertenecen al segundo o a CLI_ROOT.

Para este diseño, los tres criterios de aceptación se numeran según el orden de los
escenarios de story.md:

| ID | Criterio resumido |
|---|---|
| AC-1 | Resolver una única raíz por precedencia de entorno, configuración y defecto. |
| AC-2 | Rechazar una fuente explícita inválida sin escribir en una ubicación inesperada. |
| AC-3 | Ejecutar preflight solo bajo demanda como diagnóstico no mutante. |

## Goals / Non-Goals

**Goals:**

- Establecer un contrato único, trazable y portable para resolver SPECS_BASE.
- Mantener docs como comportamiento compatible cuando no existe una fuente explícita.
- Hacer que cada skill conserve su resolución durante una invocación, sin depender de
  variables exportadas por un proceso hermano.
- Separar de forma explícita REPO_ROOT, SPECS_BASE y CLI_ROOT en los consumidores que
  hoy los confunden.
- Convertir skill-preflight en una inspección explícita, de solo lectura y sin
  dependencia de OpenSpec retirado.

**Non-Goals:**

- No se soportan varias raíces de artefactos en una misma invocación.
- No se prescribe un helper de shell, yq, Bash ni una capacidad de caché entre sesiones.
- No se migran ni crean automáticamente raíces explícitas inexistentes fuera del
  bootstrap idempotente de sddf-init.
- No se rediseña la selección de runtime ni los workers configurados en
  sddf.config.yaml.

## Decisions

### D-1 — El contrato de resolución usa tres raíces con responsabilidades no intercambiables

// satisface: AC-1, AC-2

REPO_ROOT es la raíz del repositorio que contiene sddf.config.yaml, código, políticas y
scripts. SPECS_BASE es la única raíz de artefactos SDDF. CLI_ROOT identifica el destino
de runtime que contiene skills y agentes instalados. Ninguna de estas variables se
deriva de otra por sustitución textual.

Todo skill determina REPO_ROOT antes de leer configuración. Después resuelve SPECS_BASE
una sola vez y conserva en su contexto local los valores SPECS_BASE y ROOT_SOURCE. El
resultado no se exporta como estado entre skills, subagentes o sesiones.

| Prioridad | Fuente y condición | Resultado |
|---|---|---|
| 1 | SDDF_ROOT está definida, no está vacía y apunta a un directorio accesible | Usar esa ruta, no leer ni parsear la configuración y registrar ROOT_SOURCE = SDDF_ROOT. |
| 1-error | SDDF_ROOT está definida, pero es vacía, inválida, inaccesible o inexistente | Emitir error accionable y no escribir artefactos; no continuar con la configuración. |
| 2 | SDDF_ROOT no está definida y sddf.config.yaml declara root como escalar no vacío y accesible | Usar la ruta y registrar ROOT_SOURCE = sddf.config.yaml. |
| 2-error | SDDF_ROOT no está definida y el YAML es ilegible, root no es un escalar válido o la ruta declarada no es utilizable | Emitir error accionable y no escribir artefactos. |
| 3 | No hay SDDF_ROOT y no existe configuración o esta no declara root | Usar docs y registrar ROOT_SOURCE = default. |

Las rutas relativas se normalizan respecto de REPO_ROOT; las absolutas conservan su
significado y los espacios internos forman parte de la ruta, no se eliminan. La
resolución en sí no crea directorios. Una raíz explícita debe existir
antes de poder usarse; tras resolver el default docs o una raíz explícita válida, cada
skill conserva su lógica de negocio para crear exclusivamente los descendientes que
posee. Por ejemplo, docs-wiki-builder puede crear su estructura documental y
story-specify puede crear specs/03-stories. Ninguno crea una raíz alternativa como
fallback ni continúa después de una fuente explícita inválida. sddf-init sigue siendo el
dueño del esqueleto SDDF completo, pero no el único skill que crea su salida específica.

### D-2 — El contrato se declara y se resuelve localmente en cada skill, una vez por invocación

// satisface: AC-1, AC-3

Cada SKILL.md fuente incorpora el mismo bloque breve de resolución de contexto antes de
usar rutas de artefactos. El bloque lee sddf.config.yaml directamente desde REPO_ROOT,
aplica D-1 y reutiliza la resolución local durante el resto de su workflow.

No se introduce un helper de shell ni un parser externo: los destinos soportados
incluyen Windows, Claude Code, OpenCode, Copilot y Codex, y el instalador actual no
distribuye scripts auxiliares con los skills. El contrato declarativo evita exigir yq,
Bash o una variable de caché que un proceso hijo no puede preservar.

La sustitución del antiguo Paso 0 se verifica de forma estática: todo skill que accede a
artefactos debe contener el contrato de resolución y ningún flujo normal debe invocar
skill-preflight. Las menciones documentales o la invocación explícita por el usuario no
se consideran una invocación de hot path.

### D-3 — sddf-init hace bootstrap idempotente de la configuración y no corrige una fuente explícita inválida

// satisface: AC-1, AC-2

La clave de primer nivel root se agrega a sddf.config.yaml y a la plantilla de
sddf-init. La plantilla usa root: docs, preservando el comportamiento normal. Cuando no
existen configuración ni override, sddf-init crea docs y persiste esa clave.

Si existe una configuración válida, sddf-init inicializa únicamente la raíz resuelta y
no sobrescribe una clave root ya existente. Como excepción de bootstrap, si el root
versionado es relativo a REPO_ROOT, se normaliza dentro del repositorio y su directorio
aún no existe, sddf-init puede crearlo junto con el esqueleto estándar. Un root
configurado absoluto o que escape REPO_ROOT debe existir previamente; los skills
ordinarios siempre fallan ante cualquier raíz explícita inexistente.

Cuando SDDF_ROOT está definida y no existe configuración, sddf-init se detiene antes de
crear directorios o archivos: el mensaje pide quitar el override para bootstrap por
defecto o declarar primero una raíz versionada. Así no se persiste una variable temporal
de CI/local ni se crean dos raíces contradictorias. Una fuente explícita inválida es
igualmente un error sin escrituras.

El archivo .env.template deja de activar SDDF_ROOT por defecto. Documenta el override
como opcional para CI o pruebas, de modo que no anule silenciosamente root en la
configuración versionada.

### D-4 — skill-preflight es un diagnóstico explícito, consistente y de solo lectura

// satisface: AC-3

skill-preflight aplica exactamente D-1 y muestra: REPO_ROOT, SPECS_BASE, ROOT_SOURCE,
validez de la configuración, directorios estándar bajo SPECS_BASE y el conjunto base de
cinco templates centrales: story-template.md, epic-template.md, project-template.md,
project-intent-template.md y project-plan-template.md. Ese conjunto es fijo para la
invocación independiente; no requiere un parámetro de skill consumidor. Cuando
corresponda, el informe también muestra el runtime detectado. No crea directorios, no
reescribe configuración y no entrega variables persistentes a otro skill.

OpenSpec no se inspecciona ni se advierte como requisito por defecto. Una integración
legada solo podría diagnosticarse si un comando futuro la solicita de forma explícita.
El reporte distingue un error de una fuente raíz inválida de un warning operativo no
bloqueante.

### D-5 — Los consumidores sensibles corrigen su semántica de rutas

// satisface: AC-1, AC-2, AC-3

Todos los skills fuente migran al bloque de D-2. Además, los consumidores que usan más
de una raíz reciben estas reglas:

- story-verify busca sddf.config.yaml en REPO_ROOT y conserva reportes e historias bajo
  SPECS_BASE.
- story-code-review usa REPO_ROOT para código y diffs, y SPECS_BASE solo para
  artefactos de historia.
- story-implement, sddf-init y los skills que buscan otros skills resuelven CLI_ROOT
  independientemente, solo cuando necesitan un runtime.

Esta historia no cambia el orden ni los destinos que usa hoy la selección de CLI_ROOT;
solo elimina su acoplamiento con SPECS_BASE. La verificación usa un runtime ya soportado
como fixture y comprueba independencia de rutas, sin ampliar la selección a nuevos
directorios de runtime.

No se acepta que CLI_ROOT o SPECS_BASE sean reinterpretados como raíz de código.

### D-6 — El cambio se respalda con un auditor no mutante y una matriz de evaluación

// satisface: AC-1, AC-2, AC-3

El script normalize-preflight-paso0.js se elimina porque su propósito es reinsertar el
comportamiento retirado. Se crea scripts/audit-root-resolution.js, un auditor Node de
solo lectura basado en fs y path. Comprueba el inventario fuente, la presencia del
contrato D-2 y la ausencia de invocaciones automáticas en SKILL.md, sin modificar
archivos ni prohibir menciones documentales a una invocación explícita.

El auditor también revisa los evals, ejemplos y README de skills cuando declaren
preflight automático como comportamiento esperado. Así, las evidencias de prueba no
reintroducen un contrato ya retirado. El inventario exacto de soportes se construye con
una búsqueda reproducible durante T001 y se corrige en T015.

Las evaluaciones cubren la precedencia, el default compatible, los fallos cerrados, el
bootstrap, los consumidores especiales y el diagnóstico explícito. La comprobación de
rendimiento se expresa como una lectura de configuración por invocación, no como una
promesa de caché entre procesos.

### D-7 — La documentación normativa y la trazabilidad de la épica se actualizan junto con el contrato

// satisface: AC-1, AC-3

AGENTS.md, constitution.md, domain.md, README.md, root-folder-practices.md,
sddf-commands-pipeline.md, skill-structural-pattern.md,
harness-eng-agents-orchestration.md, best-practices-for-skills.md y
artifact-directory-migration.md describen la misma precedencia y el carácter opcional
de preflight. La regla de dominio BR-002 pasa de exigir preflight a exigir resolución
local y reserva el diagnóstico para una invocación explícita.

EPIC-19 incorpora STORY-093 a su lista de historias antes de cerrar el trabajo. Las
historias históricas STORY-049 y STORY-053 permanecen inmutables como antecedente; la
documentación vigente señala que este contrato las sustituye operativamente.

## Componentes afectados

| Componente | Acción | Ubicación | Trazabilidad |
|---|---|---|---|
| Contrato de raíces y clave root | modificar | sddf.config.yaml y plantilla de sddf-init | D-1, D-3; AC-1, AC-2 |
| Bootstrap idempotente | modificar | skills/sddf-init/SKILL.md y .env.template | D-3; AC-1, AC-2 |
| Diagnóstico explícito | modificar | skills/skill-preflight/SKILL.md | D-4; AC-3 |
| Skills consumidores | modificar | todos los SKILL.md fuente inventariados | D-2, D-5; AC-1, AC-3 |
| Auditor de contrato | crear y retirar normalizador conflictivo | scripts/audit-root-resolution.js y scripts/normalize-preflight-paso0.js | D-6; AC-1, AC-3 |
| Evidencias de skills | modificar si afirman Paso 0 automático | evals, ejemplos y README bajo skills/ | D-6; AC-3 |
| Normativa y guía | modificar | AGENTS.md, docs/policies, README.md y guías activas enumeradas en D-7 | D-7; AC-1, AC-3 |
| Trazabilidad de épica | modificar | EPIC-19-framework-consistency/epic.md, incluida su sección de flujos e impacto | D-7; AC-1, AC-3 |

## Interfaces

| Interfaz | Contrato | Trazabilidad |
|---|---|---|
| Resolución de raíz | Entrada: REPO_ROOT, SDDF_ROOT y root en sddf.config.yaml. Salida local: SPECS_BASE, ROOT_SOURCE o error accionable. Aplica la tabla de D-1 sin fallback sobre una fuente explícita inválida. | D-1; AC-1, AC-2 |
| Configuración SDDF | root es una clave escalar de primer nivel. Convive con defaults, verify e implement; las demás claves no cambian. | D-3; AC-1 |
| Preflight | Entrada: el contexto de repositorio; salida: informe no mutante con fuente, estado de raíz, directorios y los cinco templates centrales definidos en D-4. No es dependencia implícita de otro skill. | D-4; AC-3 |
| Rutas de consumidores | REPO_ROOT para config y código; SPECS_BASE para artefactos SDDF; CLI_ROOT para runtime instalado. | D-5; AC-1, AC-2 |
| Auditor | Entrada: inventario de SKILL.md y soportes que afirman comportamiento de preflight; salida: éxito o lista accionable de contratos ausentes y pasos automáticos residuales; no escribe archivos. | D-6; AC-1, AC-3 |

## Flujos clave

### F-1 — Resolución ordinaria

REPO_ROOT se determina una vez. Si SDDF_ROOT es válida, gana. Si no está definida, se
lee root desde REPO_ROOT/sddf.config.yaml. Si la clave tampoco existe, se usa docs. El
skill conserva SPECS_BASE y ROOT_SOURCE en su contexto hasta terminar.

### F-2 — Fuente explícita inválida

Una variable de entorno inválida tiene prioridad como error y no permite caer a la
configuración. Una configuración YAML inválida, un root vacío o una ruta inexistente
también detienen antes de cualquier escritura. El mensaje nombra fuente, valor y acción
de corrección.

### F-3 — Diagnóstico bajo demanda

El mantenedor ejecuta skill-preflight. Este resuelve la misma raíz, informa la fuente,
comprueba estructura y templates, y termina sin mutar el repositorio. La ejecución
posterior de un skill normal no vuelve a invocarlo automáticamente.

## Contratos de verificación

// satisface: AC-1, AC-2, AC-3

| ID | Criterio verificable | Método principal | AC |
|---|---|---|---|
| V-1 | La precedencia usa SDDF_ROOT válida antes que root en configuración y docs por defecto. | E2E-001 y EV-011. | AC-1 |
| V-2 | Una fuente explícita inválida no escribe, mientras que docs por defecto conserva la creación propia del skill. | E2E-002, EV-003, EV-004 y EV-008. | AC-2 |
| V-3 | skill-preflight es explícito, no mutante, informa la fuente y revisa los cinco templates centrales. | E2E-003 y EV-005. | AC-3 |
| V-4 | sddf-init crea docs por defecto o una raíz versionada relativa de forma idempotente, sin persistir SDDF_ROOT efímero. | IT-001, EV-002 y EV-007. | AC-1, AC-2 |
| V-5 | Los consumidores que usan varias raíces consultan configuración y código desde REPO_ROOT y no derivan CLI_ROOT de SPECS_BASE. | IT-002 y EV-006. | AC-1 |

## Risks / Trade-offs

- **Migración transversal de SKILL.md y sus evidencias** → una edición incompleta puede
  dejar contratos o evals distintos. Mitigación: inventario explícito, auditor no
  mutante y tareas por familia.
- **Cambio de fallback ante valor inválido** → un usuario de STORY-049 podría esperar
  docs. Mitigación: el error es intencional, seguro y documentado; solo la ausencia de
  fuente conserva el default.
- **Configuración malformada** → el skill no puede inferir una ruta segura.
  Mitigación: error con la ruta del archivo y ninguna escritura.
- **Helper de shell no distribuido** → se evita dependencia no portable. Trade-off:
  cada skill contiene un bloque breve equivalente, compensado por menor latencia y
  ausencia de un proceso adicional.
- **Épica aún no lista la historia** → genera una advertencia de trazabilidad durante
  este planning. Mitigación: tarea explícita antes de cerrar la implementación.

## Open Questions

Ninguna que bloquee el diseño. La semántica de raíces inválidas, bootstrap, portabilidad,
auditoría y separación de rutas queda resuelta en D-1 a D-7.

## Registro de Cambios (CR)

### CR-001

- **Tipo:** sustitución de contrato
- **Descripción:** STORY-049 documenta fallback a docs para una variable inválida y
  STORY-053 hace preflight obligatorio. D-1 y D-4 los sustituyen para el comportamiento
  vigente.
- **Documento afectado:** documentación vigente y SKILL.md fuente; los artefactos
  históricos se conservan como evidencia.
- **Acción requerida:** citar STORY-093 como contrato activo en las guías actualizadas.

### CR-002

- **Tipo:** trazabilidad
- **Descripción:** EPIC-19 es el padre declarado de STORY-093, pero aún no la enumera
  bajo Historias.
- **Documento afectado:** EPIC-19-framework-consistency/epic.md.
- **Acción requerida:** añadir la historia como parte de T017 antes de marcar la
  implementación como completada.
