---
name: skill-preflight
description: "Protocolo centralizado de verificación de entorno previo a la ejecución de cualquier skill SDDF. Verifica SDDF_ROOT, subdirectorios de specs estándar, templates requeridos y config.yaml. Produce un informe OK/WARNING/ERROR con mensajes accionables."
---

# Skill: skill-preflight

Protocolo de verificación que centraliza todas las comprobaciones de entorno del framework SDDF. Cada skill SDDF llama a este skill en su Paso 0 en lugar de replicar la lógica de validación.

> **Flujo de onboarding recomendado:** `sddf-init → skill-preflight → [cualquier skill SDDF]`
> Usa `sddf-init` primero para crear la estructura base (directorios, config.yaml). Luego `skill-preflight` verifica que el entorno está correcto antes de cada ejecución.

**Usar cuando:**
- Al inicio de cualquier skill SDDF (invocado internamente como Paso 0)
- Cuando se quiere diagnosticar el estado del entorno antes de ejecutar un workflow

**No es necesario invocar directamente** — los skills SDDF lo llaman automáticamente.

---

## Protocolo de verificación

Ejecutar las siguientes verificaciones en orden. Acumular todos los resultados y emitir el informe completo al final.

### Verificación 1 — SDDF_ROOT y resolución de `SPECS_BASE`

1. Leer la variable de entorno `SDDF_ROOT`.
2. **Si `SDDF_ROOT` está definida y la ruta existe:**
   - Emitir: `[OK]  SDDF_ROOT = <ruta>`
   - Establecer `SPECS_BASE = <ruta>`
3. **Si `SDDF_ROOT` no está definida:**
   - Emitir: `[WARNING] SDDF_ROOT no definida → Se usará "docs" como valor por defecto`
   - Establecer `SPECS_BASE = docs`
4. **Si `SDDF_ROOT` está definida pero la ruta no existe:**
   - Emitir: `[ERROR]  SDDF_ROOT apunta a ruta inexistente: <ruta> → Crear el directorio o corregir la variable`
   - Registrar error bloqueante.

Exponer `SPECS_BASE` al skill invocador para que lo use en todas sus rutas.

### Verificación 2 — Subdirectorios de specs estándar

Para cada uno de los siguientes directorios bajo `SPECS_BASE`:
- `specs/01-projects/`
- `specs/02-epics/`
- `specs/03-stories/`

Verificar si existe:
- **Existe:** emitir `[OK]  <ruta> existe`
- **No existe:** emitir `[WARNING] <ruta> no encontrado → Crear el directorio si el skill lo requiere`

Los directorios faltantes son advertencias, no errores bloqueantes (algunos workflows pueden no necesitar todos los directorios).

### Verificación 3 — Templates requeridos por el skill invocador (opcional)

Si el skill invocador declara una lista de templates requeridos, verificar cada uno según su tipo:

**Templates centrales** (compartidos, resueltos vía `$SPECS_BASE/specs/templates/<nombre>`):
- **Existe en el central:** emitir `[OK]  Template presente: $SPECS_BASE/specs/templates/<nombre>`
- **No existe en el central pero sí en el `assets/` del skill dueño:** emitir
  `[WARNING] Template <nombre> no centralizado → usando fallback del skill dueño. Ejecutar sddf-init para centralizarlo`
- **No existe en ninguno de los dos:** emitir
  `[ERROR]  Template faltante: <nombre> → Ejecutar sddf-init`
  - Registrar error bloqueante.

**Templates locales** (archivos en el directorio `assets/` del propio skill invocador):
- **Existe:** emitir `[OK]  Template presente: <ruta>`
- **No existe:** emitir `[ERROR]  Template faltante: <ruta> → Verificar que el archivo existe en assets/`
  - Registrar error bloqueante.

Si no se declaran templates requeridos, omitir esta verificación.

### Verificación 4 — Inicialización de config.yaml

Verificar si `openspec/config.yaml` existe y tiene contenido:
- **Existe con contenido:** emitir `[OK]  openspec/config.yaml inicializado`
- **No existe o está vacío:** emitir `[WARNING] openspec/config.yaml no inicializado → Ejecutar /sddf-init seguido de /openspec-init-config`

Esta es una advertencia, no un error bloqueante.

### Verificación 5 — Resolución de `CLI_ROOT`

1. Si la variable de entorno `SDDF_CLI_ROOT` está definida → `CLI_ROOT = $SDDF_CLI_ROOT`.
2. Si no, detectar por filesystem (en orden de prioridad):
   - Si `.claude/` existe → `CLI_ROOT = .claude`
   - Si `.opencode/` existe → `CLI_ROOT = .opencode`
   - Si `.github/copilot/` existe → `CLI_ROOT = .github/copilot`
3. Si ninguno de los anteriores existe:
   - Emitir: `[WARNING] No se detectó directorio CLI conocido → Se usará ".claude" como valor por defecto`
   - `CLI_ROOT = .claude`
4. Emitir: `[OK]  CLI_ROOT = <ruta>`

Exponer `CLI_ROOT` al skill invocador para que lo use en rutas a skills, agents y commands.

---

## Informe de estado final

Después de todas las verificaciones, emitir el informe consolidado:

```
── Preflight SDDF ──────────────────────────────
[OK]      SDDF_ROOT = docs
[OK]      CLI_ROOT = .claude
[OK]      specs/01-projects/ existe
[WARNING] specs/02-epics/ no encontrado → Crear el directorio si el skill lo requiere
[OK]      specs/03-stories/ existe
[OK]      openspec/config.yaml inicializado
────────────────────────────────────────────────
```

**Si no hay errores bloqueantes:**
```
✓ Entorno OK — listo para continuar
```
Ceder el control al skill invocador para que prosiga su ejecución.

**Si hay uno o más errores bloqueantes:**
```
✗ Entorno inválido — corregir los errores [ERROR] antes de continuar
```
Detener la ejecución. No continuar con el skill invocador hasta que el usuario corrija el entorno.
