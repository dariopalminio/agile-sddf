## 1. Crear estructura del skill skill-preflight

- [x] 1.1 Crear directorio `.claude/skills/skill-preflight/` con subdirectorio `assets/`
- [x] 1.2 Crear `SKILL.md` con el protocolo de preflight: verificación de SDDF_ROOT, subdirectorios de specs, templates requeridos y config.yaml
- [x] 1.3 Verificar que el skill aparece listado en la sesión de Claude Code (nombre: `skill-preflight`)

## 2. Implementar lógica de verificación en SKILL.md

- [x] 2.1 Implementar Paso 0: resolver SDDF_ROOT (OK / WARNING con fallback a `docs` / ERROR con detención)
- [x] 2.2 Implementar Paso 1: verificar subdirectorios estándar (`$SPECS_BASE/specs/projects/`, `$SPECS_BASE/specs/releases/`, `$SPECS_BASE/specs/stories/`)
- [x] 2.3 Implementar Paso 2: verificar templates declarados por el skill invocador (si se proporcionan)
- [x] 2.4 Implementar Paso 3: verificar `openspec/config.yaml` (WARNING si ausente, no bloqueante)
- [x] 2.5 Implementar Paso 4: emitir informe de estado con formato `[OK] / [WARNING] / [ERROR]` y resultado final `✓ Entorno OK` o `✗ Entorno inválido`

## 3. Actualizar spec de sddf-root-env-var

- [x] 3.1 Ejecutar `openspec apply --change skill-preflight` para promover los specs del change a `openspec/specs/`
- [x] 3.2 Verificar que `openspec/specs/sddf-root-env-var/spec.md` refleja la delegación a `skill-preflight`
- [x] 3.3 Verificar que `openspec/specs/skill-preflight/spec.md` fue creada correctamente

## 4. Migrar skills de alta prioridad (L1 Story workflow)

- [x] 4.1 Actualizar `story-creation`: reemplazar Paso 0 ad-hoc por `Paso 0: Invocar skill-preflight`
- [x] 4.2 Actualizar `story-evaluation`: reemplazar validación de entorno por llamada a `skill-preflight`
- [x] 4.3 Actualizar `story-split`: reemplazar validación de entorno por llamada a `skill-preflight`
- [x] 4.4 Actualizar `story-refine`: reemplazar validación de entorno por llamada a `skill-preflight`

## 5. Migrar skills de alta prioridad (L2 Release workflow)

- [x] 5.1 Actualizar `release-creation`: reemplazar Paso 0 por `skill-preflight`
- [x] 5.2 Actualizar `release-format-validation`: reemplazar validación por `skill-preflight`
- [x] 5.3 Actualizar `releases-from-project-plan`: reemplazar validación por `skill-preflight`
- [x] 5.4 Actualizar `release-generate-stories`: reemplazar validación por `skill-preflight`
- [x] 5.5 Actualizar `release-generate-all-stories`: reemplazar validación por `skill-preflight`

## 6. Migrar skills de alta prioridad (L3 Project workflow)

- [x] 6.1 Actualizar `project-begin`: reemplazar Paso 0 por `skill-preflight`
- [x] 6.2 Actualizar `project-discovery`: reemplazar validación por `skill-preflight`
- [x] 6.3 Actualizar `project-planning`: reemplazar validación por `skill-preflight`
- [x] 6.4 Actualizar `project-flow`: reemplazar validación por `skill-preflight`
- [x] 6.5 Actualizar `project-story-mapping`: reemplazar validación por `skill-preflight`

## 7. Migrar skills restantes

- [x] 7.1 Actualizar `readme-builder`: reemplazar validación por `skill-preflight`
- [x] 7.2 Actualizar `docs-wiki-builder`: reemplazar validación por `skill-preflight`
- [x] 7.3 Actualizar `header-aggregation`: reemplazar validación por `skill-preflight`
- [x] 7.4 Actualizar `reverse-engineering`: reemplazar validación por `skill-preflight`
- [x] 7.5 Actualizar `project-context-diagram`: reemplazar validación por `skill-preflight`
- [x] 7.6 Actualizar `openspec-init-config`, `openspec-apply-change`, `openspec-archive-change`, `openspec-explore`, `openspec-propose`, `openspec-generate-baseline`: reemplazar validación por `skill-preflight` donde aplique
- [x] 7.7 Actualizar `skill-master`: reemplazar validación por `skill-preflight`

## 8. Validación

- [ ] 8.1 Probar `skill-preflight` en entorno limpio sin `SDDF_ROOT` → verificar WARNING y fallback a `docs`
- [ ] 8.2 Probar `skill-preflight` con `SDDF_ROOT` apuntando a directorio válido → verificar `[OK]`
- [ ] 8.3 Probar `skill-preflight` con `SDDF_ROOT` apuntando a ruta inexistente → verificar `[ERROR]` y detención
- [ ] 8.4 Probar `skill-preflight` con template faltante declarado → verificar `[ERROR]` bloqueante
- [ ] 8.5 Ejecutar un skill migrado end-to-end (`story-creation`) y verificar que el flujo completo funciona
- [x] 8.6 Verificar que los skills migrados no tienen código de validación duplicado en su Paso 0
