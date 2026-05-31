# Estructura de Carpetas Estándar de un Skill

## Estructura canónica

```
skill-name/
├── SKILL.md          # OBLIGATORIO — frontmatter YAML + instrucciones del skill
├── assets/           # templates canónicos (fuente de verdad dinámica)
├── references/       # guías y documentación de referencia (solo en skills tipo reference)
├── evals/
│   └── evals.json    # casos de prueba — DEBE existir ANTES que SKILL.md (TDD)
├── examples/
│   ├── input/        # ejemplos de entrada para el skill
│   └── output/       # ejemplos de salida esperada
└── scripts/          # ejecutables si aplica
```

## Reglas por directorio

### `SKILL.md` (OBLIGATORIO)
- DEBE existir en todo skill sin excepción
- DEBE comenzar con frontmatter YAML estandarizado (ver `skill-frontmatter.md`)
- DEBE describir el objetivo, entradas, salidas y pasos de ejecución del skill

### `assets/`
- DEBE contener los templates de output que el skill genera (p.ej. `report-template.md`)
- El skill lee estos templates en tiempo de ejecución — NO hardcodea la estructura del output
- Si el skill no genera documentos con template propio: PUEDE omitirse

### `references/`
- DEBE existir solo en skills con `type: reference`
- Contiene guías prescriptivas en Markdown que otros skills cargan en su contexto
- NO contiene código ejecutable ni templates de output
- Cada archivo DEBE usar vocabulario prescriptivo: **DEBE**, **NO DEBE**, **PUEDE**

### `evals/`
- DEBE contener `evals.json` con casos de prueba del skill
- DEBE crearse **antes** de escribir `SKILL.md` (principio TDD para skills)
- Ver formato en `skill-evals-format.md`
- En skills `type: reference`: el eval es opcional — la calidad se mide por el orquestador que usa las referencias

### `examples/`
- DEBE contener al menos un par input/output que demuestre el comportamiento esperado
- Sirve como documentación viva y referencia para evals

### `scripts/`
- PUEDE omitirse si el skill no necesita código ejecutable
- Los scripts NO DEBEN contener lógica de dominio; solo I/O y orquestación

## Convenciones de nombre

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Directorio del skill | `kebab-case` | `pdf-summarizer` |
| Archivos en `references/` | `kebab-case.md` | `writing-guide.md` |
| Archivos en `assets/` | `kebab-case-template.md` | `report-template.md` |
| Script ejecutable | `kebab-case.py` o `.ts` | `extract-context.ts` |
| Casos de prueba | `evals.json` (fijo) | `evals/evals.json` |

## Cuándo incluir cada directorio

| Directorio | Incluir cuando... | Omitir cuando... |
|-----------|-------------------|-----------------|
| `assets/` | el skill genera documentos con estructura fija | el skill solo transforma o valida |
| `references/` | `type: reference` en SKILL.md | `type: delegate` o skill genérico |
| `evals/` | el skill es crítico o tiene comportamiento medible | skill trivial de una línea |
| `examples/` | el comportamiento no es obvio por el nombre | skill autoexplicativo |
| `scripts/` | necesita I/O de sistema o procesamiento de datos | toda la lógica cabe en el SKILL.md |

## Reglas de comportamiento

### Idempotencia declarada

El skill DEBE ser idempotente: ejecutarse múltiples veces sin efectos adversos. Si el artefacto de salida ya existe, el skill DEBE ofrecer opciones al usuario antes de sobrescribir:

- `(r) Regenerar` — reemplazar el contenido existente
- `(n) No modificar` — saltar la generación y terminar
- `(c) Comparar` — mostrar diff antes de decidir (si aplica)

Skills de inicialización (p.ej. `sddf-init`) DEBEN declarar explícitamente que no sobrescriben archivos existentes.

Excepción: si el skill recibe el flag `--force`, puede sobrescribir directamente, emitiendo `[INFO] <archivo> sobreescrito con --force`.

### Flags opcionales para modos alternativos

Los skills DEBEN exponer flags para variantes de comportamiento cuando aplique. Usar estos nombres canónicos:

| Flag | Comportamiento |
|------|---------------|
| `--dry-run` | Muestra el plan de ejecución sin crear ni modificar archivos |
| `--force` | Sobreescribe artefactos existentes sin pedir confirmación |
| `--interactive` | Pausa en cada paso clave para pedir confirmación (predeterminado en skills manuales) |
| `--auto` | Ejecuta sin pausas; se detiene solo ante errores |
| `--update` | Actualiza un artefacto existente en lugar de regenerarlo desde cero |
| `--quick` | Omite pasos opcionales para una ejecución más rápida |
| `--from-files` | Lee inputs desde archivos en lugar de contexto de conversación |
| `--verbose` | Emite logs detallados de cada paso |

### Progreso en comandos largos

Si un paso puede tardar más de unos segundos (ejecución de tests, análisis de codebase, generación masiva), el skill DEBE emitir indicadores de progreso periódicos. Ejemplos:

```
[1/5] Leyendo story.md...
[2/5] Derivando casos E2E desde ACs...
[3/5] Derivando casos UT desde design.md...
```

No dejar al usuario sin feedback durante operaciones de larga duración.
