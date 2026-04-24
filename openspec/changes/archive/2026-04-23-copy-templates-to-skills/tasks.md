## 1. Copiar templates al skill story-creation

- [x] 1.1 Crear directorio `.claude/skills/story-creation/templates/`
- [x] 1.2 Copiar `docs/specs/templates/story-gherkin-template.md` a `.claude/skills/story-creation/templates/story-gherkin-template.md`
- [x] 1.3 Actualizar referencias en `.claude/skills/story-creation/SKILL.md`: reemplazar `docs/specs/templates/story-gherkin-template.md` por `.claude/skills/story-creation/templates/story-gherkin-template.md`

## 2. Copiar templates al skill story-evaluation

- [x] 2.1 Crear directorio `.claude/skills/story-evaluation/templates/`
- [x] 2.2 Copiar `docs/specs/templates/story-gherkin-template.md` a `.claude/skills/story-evaluation/templates/story-gherkin-template.md`
- [x] 2.3 Copiar `docs/specs/templates/evaluation-output-template.md` a `.claude/skills/story-evaluation/templates/evaluation-output-template.md`
- [x] 2.4 Actualizar referencias en `.claude/skills/story-evaluation/SKILL.md`: reemplazar rutas `docs/specs/templates/` por `.claude/skills/story-evaluation/templates/`

## 3. Copiar templates al skill story-split

- [x] 3.1 Crear directorio `.claude/skills/story-split/templates/`
- [x] 3.2 Copiar `docs/specs/templates/story-gherkin-template.md` a `.claude/skills/story-split/templates/story-gherkin-template.md`
- [x] 3.3 Actualizar referencias en `.claude/skills/story-split/SKILL.md`: reemplazar `docs/specs/templates/story-gherkin-template.md` por `.claude/skills/story-split/templates/story-gherkin-template.md`

## 4. Copiar templates al skill project-discovery

- [x] 4.1 Crear directorio `.claude/skills/project-discovery/templates/`
- [x] 4.2 Copiar `docs/specs/templates/requirement-spec-template.md` a `.claude/skills/project-discovery/templates/requirement-spec-template.md`
- [x] 4.3 Actualizar referencias en `.claude/skills/project-discovery/SKILL.md`: reemplazar `docs/specs/templates/requirement-spec-template.md` por `.claude/skills/project-discovery/templates/requirement-spec-template.md`

## 5. Copiar templates al skill releases-from-project-plan

- [x] 5.1 Crear directorio `.claude/skills/releases-from-project-plan/templates/`
- [x] 5.2 Copiar `docs/specs/templates/release-spec-template.md` a `.claude/skills/releases-from-project-plan/templates/release-spec-template.md`
- [x] 5.3 Actualizar referencias en `.claude/skills/releases-from-project-plan/SKILL.md`: reemplazar `docs/specs/templates/release-spec-template.md` por `.claude/skills/releases-from-project-plan/templates/release-spec-template.md`

## 6. Copiar templates al skill release-format-validation

- [x] 6.1 Crear directorio `.claude/skills/release-format-validation/templates/`
- [x] 6.2 Copiar `docs/specs/templates/release-spec-template.md` a `.claude/skills/release-format-validation/templates/release-spec-template.md`
- [x] 6.3 Actualizar referencias en `.claude/skills/release-format-validation/SKILL.md`: reemplazar `docs/specs/templates/release-spec-template.md` por `.claude/skills/release-format-validation/templates/release-spec-template.md`

## 7. Copiar templates al skill release-generate-stories

- [x] 7.1 Crear directorio `.claude/skills/release-generate-stories/templates/`
- [x] 7.2 Copiar `docs/specs/templates/story-gherkin-template.md` a `.claude/skills/release-generate-stories/templates/story-gherkin-template.md`
- [x] 7.3 Actualizar referencias en `.claude/skills/release-generate-stories/SKILL.md`: reemplazar `docs/specs/templates/story-gherkin-template.md` por `.claude/skills/release-generate-stories/templates/story-gherkin-template.md`

## 8. Copiar templates al skill release-generate-all-stories

- [x] 8.1 Crear directorio `.claude/skills/release-generate-all-stories/templates/`
- [x] 8.2 Copiar `docs/specs/templates/story-gherkin-template.md` a `.claude/skills/release-generate-all-stories/templates/story-gherkin-template.md`
- [x] 8.3 Actualizar referencias en `.claude/skills/release-generate-all-stories/SKILL.md`: reemplazar `docs/specs/templates/story-gherkin-template.md` por `.claude/skills/release-generate-all-stories/templates/story-gherkin-template.md`

## 9. Copiar templates al skill reverse-engineering

- [x] 9.1 Crear directorio `.claude/skills/reverse-engineering/templates/`
- [x] 9.2 Copiar `docs/specs/templates/requirement-spec-template.md` a `.claude/skills/reverse-engineering/templates/requirement-spec-template.md`
- [x] 9.3 Actualizar referencias en `.claude/skills/reverse-engineering/SKILL.md`: reemplazar `docs/specs/templates/requirement-spec-template.md` por `.claude/skills/reverse-engineering/templates/requirement-spec-template.md`

## 10. Verificación final

- [x] 10.1 Ejecutar `grep -r "docs/specs/templates" .claude/skills/ .claude/agents/` y confirmar que no hay resultados en archivos activos
- [x] 10.2 Verificar que cada skill listado tiene su directorio `templates/` con los archivos esperados
