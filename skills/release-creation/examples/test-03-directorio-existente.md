# Test Case 03 — Directorio existente (usuario elige sobreescribir)

**Descripción:** El usuario invoca el skill para crear un release cuyo directorio de destino ya existe. El skill detecta el conflicto, pregunta qué hacer, y el usuario elige sobreescribir.

---

## Input del usuario

```
/release-creation
```

---

## Flujo esperado

### Fase 0 — Modo de ejecución
- No se detecta `--quick` → `QUICK_MODE=false`
- Prompt: "¿Cómo se llama el release o épica?"
- Usuario responde: `"Autenticación básica"` (mismo nombre que ya existe como EPIC-01)
- Slug derivado: `autenticacion-basica`
- El sistema detecta que `$SPECS_BASE/specs/releases/EPIC-01-autenticacion-basica/` **ya existe**

### Detección de conflicto

El skill muestra:

```
⚠️ El directorio `$SPECS_BASE/specs/releases/EPIC-01-autenticacion-basica/` ya existe.
¿Qué deseas hacer?
1. Sobreescribir el archivo existente
2. Usar un nombre diferente
```

- Usuario responde: **"1" (sobreescribir)**
- El skill continúa con la ruta `$SPECS_BASE/specs/releases/EPIC-01-autenticacion-basica/release.md`

### Fase 1 — Leer template
- Se lee `$SPECS_BASE/specs/templates/release-spec-template.md`
- Secciones extraídas normalmente

### Fases 2–4 — Completar contenido
- El usuario completa el frontmatter y las secciones (flujo normal)
- En este test solo se completan obligatorias (usuario responde "saltar todas" en opcionales)

### Fase 5 — Vista previa y confirmación

El skill muestra vista previa del contenido y pregunta:
> "Voy a crear el archivo en `$SPECS_BASE/specs/releases/EPIC-01-autenticacion-basica/release.md`. ¿Confirmas? (sí / editar primero)"

- Usuario responde: **"sí"**
- El archivo es sobreescrito

### Fase 6 — Validación
- `release-format-validation` retorna **APROBADO**

---

## Variante: usuario elige "usar un nombre diferente"

Si en el conflicto el usuario responde **"2"**:
- El skill vuelve al inicio de Fase 0 para pedir un nombre diferente
- Usuario ingresa: `"Autenticación básica v2"`
- Slug derivado: `autenticacion-basica-v2`
- El sistema sugiere `EPIC-03` (próximo disponible)
- No hay conflicto → continúa normalmente

---

## Criterios de éxito del test

- [ ] El skill detecta el directorio existente antes de comenzar las preguntas de contenido
- [ ] El skill presenta las dos opciones claramente (sobreescribir / renombrar)
- [ ] Si el usuario elige sobreescribir: el archivo se reemplaza correctamente
- [ ] Si el usuario elige renombrar: el skill vuelve a pedir el nombre sin perder el contexto
- [ ] En ambos casos, el archivo final pasa `release-format-validation` con APROBADO
