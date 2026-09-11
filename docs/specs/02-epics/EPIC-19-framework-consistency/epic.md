---
alwaysApply: false
type: epic
id: EPIC-19
slug: EPIC-19-framework-consistency
title: "Framework Consistency — Coherencia de vocabulario, instalación, seguridad y ciclo de corrección"
status: DEVELOP
substatus: IN-PROGRESS
parent: null
created: 2026-06-14
updated: 2026-09-10
related: []
---

# Épica: Framework Consistency — Coherencia de vocabulario, instalación, seguridad y ciclo de corrección

## Descripción

Tras el hardening del workflow (EPIC-18) quedaron brechas que el propio uso del framework fue exponiendo: el nivel L2 se seguía llamando *release* y colisionaba con el sentido CI/CD del término; `npm install` no instalaba skills ni agentes en Windows; `story-code-review` arrastraba acoplamientos y hallazgos abiertos del checklist de seguridad; un review rechazado dejaba la historia sin estado ni ejecutor de correcciones; y los templates declaraban campos que ningún skill escribe. Esta épica cierra esas brechas para que el framework sea coherente consigo mismo: el vocabulario coincide con la estructura del filesystem, la instalación funciona en las tres plataformas, la seguridad está documentada y verificada, el ciclo de corrección tiene dueño, y todo campo declarado en un template nombra a su escritor.

## Historias

- [x] **STORY-086 — Renombrar el nivel L2 de release a épica y numerar los directorios de specs:** el nivel L2 pasa a llamarse *epic* (`epic.md`, `type: epic`, skills `epic-*`) y los directorios de specs quedan numerados por nivel de vuelo (`01-projects` / `02-epics` / `03-stories`). Se conserva "release" solo en su sentido de despliegue (runbooks, CHANGELOG, `security-audit --scope release`). Las historias quedan bajo el prefijo único `STORY-NNN` con el campo `kind` (`feat` / `fix` / `chore` / `hotfix`). — [[STORY-086-refactor-release-to-epic]]
- [x] **STORY-087 — Error en instalación local de `npm install agile-sddf` en Windows 11:** el postinstall reportaba skills instalados pero no creaba los directorios ni copiaba los agentes. Se corrige el instalador para que la copia a `.claude/` (o la carpeta elegida) sea real y verificable en Windows. — [[STORY-087-error-in-npm-install-locally]]
- [x] **STORY-088 — Mejoras de seguridad:** desacoplar `story-code-review` del skill `security-audit`, publicar `SECURITY.md` y cerrar los 8 hallazgos `(warn)` del `ai-security-checklist`. — [[STORY-088-security-enhancement]]
- [ ] **STORY-089 — Ciclo de corrección con dueño tras un code review rechazado:** un veredicto `needs-changes` de `/story-code-review` deja la historia en un estado propio y remite a un ejecutor de correcciones, de modo que el desarrollador aplica los hallazgos y vuelve a revisión sin editar el frontmatter a mano ni depender de `tasks.md`. — [[STORY-089-story-fix-post-code-review]]
- [x] **STORY-090 — Todo campo declarado en un template nombra a su escritor:** nuevo principio de la constitución y anotación de escritor en los cinco templates de `$SPECS_BASE/specs/templates/`, empezando por retirar el campo FINVEST del cuerpo de `story.md` (tres escritores, ningún lector) con una migración idempotente que se detiene ante datos sin otra copia. — [[STORY-090-campos-declarados-nombran-su-escritor]]

## Documentación
Agregar documentación de los dominios relacionados:
- [[domain-work-item-hierarchy]] — Jerarquía de work items (Project → Epic → Story)
- [[domain-state-management]] — Gestión de estados y transiciones de los work items

## Flujos Críticos / Smoke Tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### Escenario 1: La instalación deja el framework operativo en un proyecto limpio
**DADO** un proyecto vacío en Windows, macOS o Linux con Node ≥ 18  
**CUANDO** se ejecuta `npm install agile-sddf` (o `npx agile-sddf install --target .claude`)  
**ENTONCES** existen `.claude/skills/` y `.claude/agents/` con el mismo inventario que `skills/` y `agents/` del paquete, y `/skill-preflight` reporta `✓ Entorno OK` tras `sddf-init`

### Escenario 2: El vocabulario y la estructura numerada son consistentes de punta a punta
**DADO** un repositorio con SDDF inicializado  
**CUANDO** se ejecuta cualquier skill de nivel L2 (`epic-creation`, `epic-format-validation`, `epic-generate-stories`, `epic-from-project-plan`)  
**ENTONCES** resuelve sus rutas contra `$SPECS_BASE/specs/02-epics/`, genera `epic.md` con `type: epic`, y no queda ninguna referencia a `release-*` como skill ni a `specs/releases/` en `skills/`, `agents/`, `scripts/` ni `package.json`

### Escenario 3: Un code review rechazado tiene camino de vuelta a revisión
**DADO** una historia en IMPLEMENT con `code-review-report.md` en veredicto `needs-changes`  
**CUANDO** el desarrollador sigue el siguiente paso indicado por el propio mensaje de `/story-code-review`  
**ENTONCES** la historia queda en `NEEDS-CHANGES`, las correcciones se aplican con el ejecutor indicado y un nuevo `/story-code-review` puede emitir `approved` sin ediciones manuales del frontmatter

### Escenario 4: Los templates no declaran campos huérfanos
**DADO** los cinco templates de `$SPECS_BASE/specs/templates/`  
**CUANDO** se leen campo a campo (frontmatter, líneas de dato y secciones)  
**ENTONCES** cada campo tiene anotación `escritor:` o hereda del escritor por defecto del cuerpo, ningún template ni historia contiene el bloque `**FINVEST Score:**`, y `story-improve` / `story-split` siguen leyendo score y decisión de `finvest-evaluation-report.md`

## Impacto en Procesos Claves
- **Instalación y onboarding:** la instalación en Windows es verificable (directorios y agentes realmente copiados); `sddf-init` + `skill-preflight` siguen siendo el único protocolo de arranque.
- **Pipeline de historia (SPECIFY → PLAN → IMPLEMENT → VERIFY → ACCEPTANCE → DELIVER):** se incorpora el ciclo de corrección post-review (STORY-089) y desaparece el campo FINVEST del cuerpo de `story.md`; la señal de aprobación es `SPECIFY/DONE`, escrita solo por `story-evaluation`.
- **Pipeline de épica:** los skills `release-*` pasan a `epic-*` y los artefactos a `epic.md`; los IDs de historia se unifican bajo `STORY-NNN` + `kind`.
- **Mantenimiento de templates:** todo campo nuevo debe declarar su skill escritor (principio 13 de la constitución); los cinco templates centrales y sus seeds en `skills/*/assets/` se mantienen idénticos.
- **Seguridad:** `SECURITY.md` publicado, `story-code-review` desacoplado de `security-audit`, checklist de IA sin hallazgos `(warn)` abiertos.

## Dependencias Críticas (si las hay)
- **EPIC-18 Workflow Hardening (COMPLETED):** define el workflow canónico de épica y el traslado de skills a la raíz sobre los que esta épica construye.  
  *Dueño:* mantenedor del framework  
  *Fecha compromiso:* cerrada (2026-06-14)
- **STORY-089 antes de cerrar el ciclo de corrección en la documentación del pipeline:** `docs/knowledge/guides/state-machine.md` y `sddf-commands-pipeline.md` deben reflejar el estado `NEEDS-CHANGES` con su skill de entrada y de salida.  
  *Dueño:* mantenedor del framework  
  *Fecha compromiso:* al pasar STORY-089 a DELIVER

## Riesgos (opcional)
- **Renombrado masivo release → epic rompe referencias externas:** proyectos que instalaron versiones previas conservan `specs/releases/`. – **Mitigación:** documentar la migración en el CHANGELOG y mantener `release` como término válido en su sentido CI/CD.
- **Migración del campo FINVEST pierde el único dato sin copia (STORY-067):** – **Mitigación:** la migración se detiene ante cualquier historia con valor real y sin `finvest-evaluation-report.md`; la resolución (reconstruir el reporte o aceptar la pérdida) queda registrada en el commit.
- **Un skill copia los comentarios `escritor:` al documento generado:** – **Mitigación:** el principio de la constitución lo prohíbe y STORY-090 verifica con una instanciación de prueba de `story-creation`.
- **El estado `NEEDS-CHANGES` desalinea `state-machine.md`:** – **Mitigación:** STORY-089 exige como criterio no funcional reflejarlo en `docs/knowledge/guides/state-machine.md`.

**Criterios de éxito:**
- [x] Ningún skill, agente, script ni `package.json` referencia `release-*` como skill ni `specs/releases/`
- [x] `npm install agile-sddf` en Windows 11 deja `.claude/skills/` y `.claude/agents/` completos
- [x] `SECURITY.md` existe y el `ai-security-checklist` no tiene hallazgos `(warn)` abiertos
- [ ] Un `needs-changes` de `/story-code-review` conduce, sin edición manual del frontmatter, a un nuevo review `approved`
- [ ] Los cinco templates de `$SPECS_BASE/specs/templates/` tienen anotación de escritor en todos sus campos y ninguna historia conserva el bloque `**FINVEST Score:**`
- [ ] `docs/policies/constitution.md` incluye el principio "Todo campo declarado nombra a su escritor"

## Notas adicionales
- El directorio de esta épica es `EPIC-19/` sin slug, a diferencia del resto (`EPIC-NN-<slug>/`). Renombrarlo a `EPIC-19-framework-consistency/` exige actualizar `parent:` y `related:` en las cinco historias; se deja como tarea de cierre de la épica.
- `STORY-087` declara `parent: EPIC-08-npm-install-locally` en su frontmatter aunque se gestiona desde esta épica; alinear el `parent` al cerrar la historia.
- El slug anterior (`workflow-hardening`) duplicaba el de EPIC-18 y se reemplazó por `framework-consistency`.
