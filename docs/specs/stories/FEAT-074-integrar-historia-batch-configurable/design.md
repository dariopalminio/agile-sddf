---
type: design
id: FEAT-074
slug: FEAT-074-integrar-historia-batch-configurable-design
title: "Design: story-integrate — Integración batch configurable de historias"
story: FEAT-074
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-074-integrar-historia-batch-configurable
---

[[FEAT-074-integrar-historia-batch-configurable]]

## Context

El skill `story-integrate` es el mecanismo de integración del ciclo SDD: toma una historia en estado `READY-FOR-INTEGRATE` y la integra hacia la rama de release correcta mediante operaciones Git/PR. El diseño actual (antes de FEAT-074) no existe — este skill es nuevo.

**Restricciones técnicas clave:**
- Los comandos Git no pueden estar hardcodeados en el skill — deben venir de un archivo de configuración versionado por el equipo (Requerimiento de negocio explícito)
- La versión del release se resuelve desde `.release-version` con fallback a la config de integración
- El skill debe ser idempotente: si un PR ya existe, no crear uno nuevo
- Solo ejecuta comandos definidos en archivos de config versionados — no permite inyección desde parámetros externos

**Criterios de aceptación (para trazabilidad):**
- AC-1: Integración batch exitosa con versión desde archivo (flujo happy path completo)
- AC-2: Idempotencia — detección de PR existente sin crear duplicado
- AC-R: Requerimiento de configuración externa — ningún comando Git hardcodeado

---

## Goals / Non-Goals

**Goals:**
- Crear el skill `.claude/skills/story-integrate/SKILL.md` usando el skill-master y resptendo el template .claude\skills\skill-master\assets\skill-template.md para la estructura del markdown del skill.
- El skill debe ejecutar el flujo de integración batch usando comandos de un archivo de config externo
- Definir el schema del archivo de configuración de integración (YAML) con el modelo `batch`
- Implementar la resolución de versión desde `.release-version`
- Implementar la detección de PR existente antes de crear uno nuevo (idempotencia)
- Actualizar `story.md` con los metadatos de integración (rama, PR number, commit hash, fecha)

**Non-Goals:**
- Soporte de modelo `continuous` — eso es FEAT-076
- Modo manual con confirmaciones interactivas — eso es FEAT-075
- Modo dry-run — eso es FEAT-075
- Selección automática de modelo de entrega desde config — eso es FEAT-076

---

## Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `story-integrate` (SKILL.md) | crear | `.claude/skills/story-integrate/SKILL.md` | AC-1, AC-2, AC-R |
| `integration-config-template.yaml` | crear | `.claude/skills/story-integrate/assets/integration-config-template.yaml` | AC-R |
| `example-integration-config.yaml` | crear | `.claude/skills/story-integrate/examples/example-integration-config.yaml` | AC-R |
| `example-input.md` | crear | `.claude/skills/story-integrate/examples/example-input.md` | AC-1, AC-2 |

---

## Interfaces

### IntegrationConfig — Schema YAML // satisface: AC-R

El archivo de configuración debe ubicarse en `integration-config.yaml` en la raíz del proyecto. Estructura mínima para el modelo batch:

```yaml
integration:
  delivery-model: batch
  version-source: .release-version    # | config
  batch:
    source-branch-pattern: "feat/{story-id}"
    target-branch-pattern: "release/{version}"
    commands:
      create-pr: "gh pr create --base {target-branch} --head {source-branch} --title 'feat: integrate {story-id}'"
      check-pr: "gh pr list --head {source-branch} --base {target-branch} --json number,url --state open"
      merge-pr: "gh pr merge {pr-number} --merge --delete-branch"
```

**Placeholders permitidos en comandos:** `{story-id}`, `{version}`, `{source-branch}`, `{target-branch}`, `{pr-number}`, `{title}`. Ningún otro placeholder se expande — se valida antes de ejecutar.

### IntegrationResult — Metadata escrita en story.md // satisface: AC-1, AC-2

Campos añadidos al frontmatter de `story.md` tras integración exitosa:

```yaml
integration:
  target-branch: release/v1.2.0
  source-branch: feat/FEAT-042
  pr-number: 42
  pr-url: https://github.com/owner/repo/pull/42
  commit-hash: abc123def456
  integrated-at: 2026-05-17
status: INTEGRATED
substatus: DONE
```

### StoryIntegrateInput — Parámetros del skill // satisface: AC-1

```
--story-id <FEAT-NNN>    ID de la historia a integrar (obligatorio)
```

Banderas adicionales para FEAT-075 (out-of-scope de este diseño): `--manual`, `--dry-run`.

---

## Flujos Clave

### Flujo principal — Integración batch (AC-1)

```
1. skill-preflight               → verifica entorno
2. resolver directorio historia  → glob FEAT-NNN-*
3. verificar story.md status     → READY-FOR-INTEGRATE (detener si no)
4. leer integration-config.yaml  → error si no existe
5. resolver versión:
   a. leer .release-version (raíz del proyecto)
   b. fallback: campo version en integration-config.yaml
   c. error si no se resuelve
6. calcular ramas:
   source = config.batch.source-branch-pattern.replace({story-id})
   target = config.batch.target-branch-pattern.replace({version})
7. verificar PR existente:
   → ejecutar config.batch.commands.check-pr (sanitizado)
   → parsear JSON output: buscar PR con matching head/base
8. Si no existe PR:
   → ejecutar config.batch.commands.create-pr (sanitizado)
   → extraer pr-number y pr-url del output
9. Ejecutar config.batch.commands.merge-pr (sanitizado)
   → extraer commit-hash del output
10. actualizar story.md → campos integration + status: INTEGRATED
```

### Flujo alternativo — PR ya existe (AC-2)

En el paso 7 del flujo principal, si check-pr retorna un PR abierto:
```
7a. mostrar "PR existente detectado: #<number> — <url>"
7b. registrar pr-number y pr-url del PR detectado
7c. saltar paso 8 (no ejecutar create-pr)
7d. continuar desde paso 9 (merge sobre PR existente)
```

---

## Decisions

### D1 — Formato del archivo de configuración de integración // satisface: AC-R

**Opción elegida:** Archivo YAML externo `integration-config.yaml` en la raíz del proyecto.

**Alternativas rechazadas:**
- `package.json` scripts section — mezcla config de distribución npm con config de integración; difícil de extender con múltiples modelos y parámetros; poco legible para comandos con plantillas
- `.sddf/config.json` JSON — menos legible que YAML para comandos con placeholders multilínea; convención ya establecida en el ecosistema SDDF con YAML

**Justificación:** YAML es el formato estándar en el ecosistema (skills usan YAML frontmatter, config.yaml existe en el proyecto); la separación en un archivo propio permite versionarlo sin afectar package.json y facilita la extensión para FEAT-076 (múltiples modelos).

---

### D2 — Seguridad en ejecución de comandos de config // satisface: AC-R (criterio seguridad)

**Opción elegida:** Sanitización de placeholders antes de expansión. Validar que `{story-id}`, `{version}`, `{source-branch}` y `{target-branch}` solo contengan caracteres alfanuméricos, `/`, `-`, `.` (regex `^[a-zA-Z0-9/\-.]+$`). Rechazar ejecución si algún placeholder contiene caracteres de inyección de shell (`;`, `|`, `&`, `` ` ``, `$(`, `>`).

**Alternativas rechazadas:**
- Sin sanitización — riesgo de inyección si story-id contiene caracteres especiales maliciosos
- Lista de comandos permitidos (allowlist) — demasiado restrictiva; los equipos necesitan flexibilidad en los comandos `gh`

**Justificación:** El AC no-funcional de seguridad es explícito. La sanitización de placeholders cubre el vector de ataque más probable sin limitar la flexibilidad de la config.

---

### D3 — Detección de PR existente para idempotencia // satisface: AC-2

**Opción elegida:** Ejecutar el comando `check-pr` de la config (estandarizado con `gh pr list`) y parsear el JSON output para buscar un PR abierto con el mismo `head` y `base`.

**Alternativas rechazadas:**
- Leer metadata de `story.md` — puede estar desactualizado si el PR fue creado fuera del skill; no es la fuente de verdad del repositorio remoto
- `git log` para detectar merge — no detecta PRs abiertos pendientes de merge; solo detecta merges ya realizados

**Justificación:** La fuente de verdad del estado del PR es el repositorio remoto. `gh pr list` con `--json` retorna resultado estructurado y confiable.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| `gh` CLI no instalado o no autenticado en el entorno | El skill debe verificar `gh auth status` como parte del preflight extendido; emitir error claro con instrucciones de instalación/auth si falla |
| El comando `merge-pr` falla por conflictos de merge | Capturar el exit code y stderr del comando; mostrar el error original al usuario sin modificar story.md; detener con mensaje accionable |
| `.release-version` ausente y config tampoco tiene versión | Error claro indicando cuál de los dos mecanismos falta configurar |
| La rama `feat/{story-id}` no existe | `gh pr create` fallará; el error del comando se propaga al usuario sin modificar story.md |

---

## Open Questions

Ninguna — todas las ambigüedades están resueltas en este diseño o delegadas explícitamente a FEAT-075/FEAT-076.

---

## Contratos de Verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Skill lee versión desde `.release-version` y construye rama `release/v1.2.0` | Ejecutar con `.release-version` conteniendo `v1.2.0`; verificar rama destino en metadata | AC-1 |
| 2 | Skill crea PR usando comando de config (no comando hardcodeado) | Verificar que SKILL.md no contiene `gh pr create` literal sin referenciar config | AC-R |
| 3 | Con PR existente: no crea segundo PR | Ejecutar con PR abierto existente; verificar que el conteo de PRs no aumenta | AC-2 |
| 4 | Con PR existente: muestra número y URL del PR detectado | Verificar output del skill contiene `PR existente detectado: #N` | AC-2 |
| 5 | story.md actualizado con campos integration + status INTEGRATED | Leer frontmatter de story.md post-integración | AC-1, AC-2 |
| 6 | Placeholder con caracteres de inyección es rechazado | Intentar con story-id `FEAT-042; rm -rf /` → debe fallar con error de sanitización | AC-R (seguridad) |

---

## Registro de Cambios (CR)

Sin CRs detectados.
