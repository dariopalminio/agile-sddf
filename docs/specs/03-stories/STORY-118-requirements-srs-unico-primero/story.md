---
type: story
id: STORY-118
slug: STORY-118-requirements-srs-unico-primero
title: "Adoptar la estrategia 'SRS Ãºnico primero, fragmentaciÃ³n cuando duela' en requirements/"
status: READY-FOR-IMPLEMENT
substatus: DONE
kind: feat
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-103-replace-the-epic-template
---

# ðŸ“– Historia: Estrategia "SRS Ãºnico primero" en `requirements/`

**Como** mantenedor del framework SDDF  
**Quiero** adoptar la estrategia "documento Ãºnico primero, fragmentaciÃ³n cuando duela" en `docs/requirements/`, con un umbral explÃ­cito de 15 requisitos o 500 lÃ­neas, y un resolver de wikilinks que funcione en ambas disposiciones,  
**Para** evitar fragmentaciÃ³n prematura en proyectos pequeÃ±os sin renunciar a la escalabilidad en proyectos grandes, manteniendo `implements: [FR-NNN]` simple en las historias y sin duplicar contenido.

---

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” README de `requirements/` documenta la estrategia

```gherkin
Dado el archivo `docs/requirements/README.md`
Cuando se inspecciona su contenido
Entonces documenta las dos disposiciones:
  Â· SRS Ãºnico (default): `srs-<project-slug>.md`
  Â· Fragmentado: `functional/FR-NNN-<slug>.md` + `non-functional/NFR-NNN-<slug>.md`
 Y declara el umbral de fragmentaciÃ³n: > 15 requisitos O > 500 lÃ­neas
 Y explica la regla de resoluciÃ³n de wikilinks (archivo â†’ secciÃ³n â†’ error)
 Y menciona los comandos de migraciÃ³n en ambas direcciones
```

### AC-2 â€” Template de SRS Ãºnico creado

```gherkin
Dado el archivo `docs/templates/srs-template.md`
Cuando un autor lo copia para crear el SRS de un proyecto
Entonces contiene:
  Â· Frontmatter con `type: srs`, `slug`, `title`, `status`, `substatus`, `created`, `updated`
  Â· SecciÃ³n "## Requisitos funcionales" con ejemplo de `### FR-001 â€” <nombre>`
  Â· SecciÃ³n "## Requisitos no funcionales" con ejemplo de `### NFR-001 â€” <nombre>`
  Â· Comentarios que explican el umbral de fragmentaciÃ³n y la regla de no-renumerar
 Y no incluye secciones de implementaciÃ³n ni decisiones tÃ©cnicas
```

### AC-3 â€” `memory-system scaffold` crea solo SRS Ãºnico

```gherkin
Dado un proyecto sin `docs/requirements/`
Cuando ejecuto `/memory-system scaffold`
Entonces se crea `docs/requirements/srs-<project-slug>.md` a partir del template
 Y NO se crean las carpetas `functional/` ni `non-functional/` vacÃ­as
 Y el SRS creado pasa `memory-system check` sin errores
```

### AC-4 â€” Resolver de wikilinks soporta ambas disposiciones

```gherkin
Dado un requisito `FR-001` declarado en un `story.md` con `implements: [FR-001]`
Cuando `memory-system` resuelve el wikilink
Entonces aplica la precedencia:
  1. Busca `functional/FR-001-*.md` o `non-functional/FR-001-*.md`
  2. Si no existe, busca `### FR-001` dentro de cualquier `srs-*.md`
  3. Si no existe, falla con un error accionable

Dado un proyecto en modo SRS Ãºnico con `FR-001` definido como secciÃ³n
Cuando una historia declara `implements: [FR-001]`
Entonces el wikilink resuelve a `srs-<project-slug>.md#FR-001`
 Y `memory-system check` no reporta el wikilink como roto

Dado un proyecto en modo fragmentado con `FR-001-eliminar-cuenta.md`
Cuando una historia declara `implements: [FR-001]`
Entonces el wikilink resuelve a `functional/FR-001-eliminar-cuenta.md`
 Y `memory-system check` no reporta el wikilink como roto
```

### AC-5 â€” MigraciÃ³n de SRS Ãºnico a fragmentado

```gherkin
Dado un proyecto con `docs/requirements/srs-mi-proyecto.md`
  Y con > 15 requisitos o > 500 lÃ­neas
Cuando ejecuto `/memory-system migrate --from=srs-single`
Entonces cada secciÃ³n `### FR-NNN` del SRS se extrae a `functional/FR-NNN-<slug>.md`
 Y cada secciÃ³n `### NFR-NNN` se extrae a `non-functional/NFR-NNN-<slug>.md`
 Y el SRS se reemplaza por un `index.md` que lista todos los IDs con enlaces
 Y los wikilinks `[[FR-NNN]]` existentes siguen resolviendo (ahora al archivo individual)
 Y ningÃºn requisito se pierde
 Y la migraciÃ³n es idempotente: ejecutarla dos veces no duplica contenido
```

### AC-6 â€” MigraciÃ³n de fragmentado a SRS Ãºnico (opcional)

```gherkin
Dado un proyecto con `docs/requirements/functional/FR-NNN-*.md` fragmentados
Cuando ejecuto `/memory-system migrate --from=requirements-fragmented`
Entonces el contenido de cada FR/NFR se consolida en `srs-<project-slug>.md`
  Â· Cada archivo individual se convierte en una secciÃ³n `### FR-NNN`
  Â· El `index.md` se elimina
 Y los wikilinks `[[FR-NNN]]` siguen resolviendo (ahora a la secciÃ³n del SRS)
 Y la migraciÃ³n es idempotente
```

### AC-7 â€” `memory-system check` valida ambas disposiciones

```gherkin
Dado un proyecto en modo SRS Ãºnico
Cuando ejecuto `/memory-system check`
Entonces valida que:
  Â· Existe al menos un `srs-*.md` en `requirements/`
  Â· Cada `### FR-NNN` y `### NFR-NNN` tiene ID Ãºnico
  Â· Los IDs no se repiten en toda la memoria
  Â· Los `implements: [FR-NNN]` de las historias resuelven correctamente

Dado un proyecto en modo fragmentado
Cuando ejecuto `/memory-system check`
Entonces valida que:
  Â· Existe `index.md` en `requirements/`
  Â· Cada `FR-NNN-*.md` y `NFR-NNN-*.md` tiene frontmatter vÃ¡lido
  Â· El `index.md` lista todos los IDs presentes
  Â· No hay IDs duplicados entre archivos
```

### AC-8 â€” DocumentaciÃ³n canÃ³nica actualizada

```gherkin
Dado el cambio implementado
Cuando se inspecciona la documentaciÃ³n
Entonces `docs/architecture/memory-system.md` documenta las dos disposiciones
 Y `docs/domains/domain-knowledge-artifacts.md` incluye el tipo `srs` en la tabla de artefactos
 Y `docs/guides/sddf-commands-pipeline.md` menciona los comandos de migraciÃ³n
 Y `CHANGELOG.md` registra el cambio en `[Unreleased]` â†’ `Added` (estrategia) y `Changed` (scaffolding)
```

### AC-9 â€” Compatibilidad con proyectos existentes

```gherkin
Dado un proyecto existente con `docs/requirements/functional/FR-NNN-*.md`
Cuando se actualiza el framework a la versiÃ³n que introduce esta estrategia
Entonces el proyecto sigue funcionando sin migraciÃ³n obligatoria
 Y `memory-system check` valida su disposiciÃ³n fragmentada correctamente
 Y los wikilinks siguen resolviendo al archivo individual
```

---

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Idempotencia:** `migrate --from=srs-single` y `migrate --from=requirements-fragmented` son idempotentes. Ejecutarlos N veces produce el mismo resultado.
- **CNF-2 â€” Dry-run:** ambos modos de migraciÃ³n soportan `--dry-run` que reporta cambios sin escribir.
- **CNF-3 â€” Backward compatibility:** los proyectos que ya usan fragmentaciÃ³n siguen funcionando sin cambios obligatorios.
- **CNF-4 â€” Token efficiency:** un proyecto en modo SRS Ãºnico carga 1 archivo en lugar de N. Un proyecto fragmentado carga solo el archivo del requisito que necesita.
- **CNF-5 â€” ConvenciÃ³n de guion:** ASCII U+002D `-` en todos los slugs.
- **CNF-6 â€” Sin dependencias nuevas:** el resolver y la migraciÃ³n usan `fs-extra` (ya presente).

---

## ðŸš« Fuera de alcance

- Cambios en el template de Story (`story-template.md`) o Epic (`epic-template.md`).
- Cambios en la mÃ¡quina de estados de los work items.
- Cambios en otros tipos de requisitos (restricciones, supuestos, dependencias). La estrategia cubre solo FR y NFR.
- Editor visual de requisitos o dashboard de SRS.
- TraducciÃ³n del README a otros idiomas.
- SincronizaciÃ³n bidireccional automÃ¡tica entre SRS y fragmentado (la migraciÃ³n es manual y explÃ­cita).

---

## ðŸ“Ž Notas / mapa de implementaciÃ³n

| Archivo | Cambio |
|---------|--------|
| `docs/requirements/README.md` | Reescribir con la estrategia, umbral y resolver |
| `docs/templates/srs-template.md` | Crear (nuevo) |
| `docs/templates/requirement-template.md` | Mantener (usado en modo fragmentado) |
| `.claude/skills/memory-system/SKILL.md` | AÃ±adir modos `migrate --from=srs-single` y `--from=requirements-fragmented`; extender `check`; actualizar `scaffold` |
| `docs/architecture/memory-system.md` | Documentar las dos disposiciones |
| `docs/domains/domain-knowledge-artifacts.md` | AÃ±adir tipo `srs` a la tabla de artefactos |
| `docs/guides/sddf-commands-pipeline.md` | Mencionar comandos de migraciÃ³n |
| `README.md` | Mencionar la estrategia en la secciÃ³n de estructura |
| `CHANGELOG.md` | `[Unreleased]` â†’ `Added` + `Changed` |

### Orden de implementaciÃ³n sugerido

1. Crear `docs/templates/srs-template.md`.
2. Reescribir `docs/requirements/README.md`.
3. Actualizar `memory-system scaffold` (crear SRS Ãºnico).
4. Implementar el resolver (archivo â†’ secciÃ³n â†’ error).
5. Implementar `migrate --from=srs-single`.
6. Implementar `migrate --from=requirements-fragmented` (opcional).
7. Extender `memory-system check` para ambas disposiciones.
8. Actualizar documentaciÃ³n canÃ³nica y CHANGELOG.
9. Verificar con un proyecto de prueba: SRS Ãºnico â†’ migrar a fragmentado â†’ migrar de vuelta.

---

## ðŸ“Ž Referencias

- [[memory-system]] â€” Sistema de memoria y estructura de capas
- [[domain-knowledge-artifacts]] â€” Modelo de artefactos y tipos
- [[ADR-0001]] â€” Centralizar templates compartidos (precedente de DRY)
- [[ADR-0007]] â€” Templates como capa propia
- [[constitution]] â€” Principios aplicables (KISS, DRY, no crear capas vacÃ­as)
