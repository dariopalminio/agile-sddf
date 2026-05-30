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
