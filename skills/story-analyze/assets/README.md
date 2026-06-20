# Assets — story-analyze

El template canónico del reporte de coherencia se ubica en la ruta estándar de templates del proyecto:

```
$SPECS_BASE/specs/templates/analyze-report-template.md
```

El skill lo lee dinámicamente en runtime. Si no existe, usa `assets/analyze-report-template.md`
como segundo nivel de fallback antes de recurrir al template embebido en SKILL.md.
