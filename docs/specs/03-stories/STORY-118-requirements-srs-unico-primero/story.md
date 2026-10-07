---
type: story
id: STORY-118
slug: STORY-118-requirements-srs-unico-primero
title: "Adoptar la estrategia 'SRS único primero, fragmentación cuando duela' en requirements/"
status: SPECIFY
substatus: IN-PROGRESS
kind: feat
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-XXX-epic-template-minimalista
---

# 📖 Historia: Estrategia "SRS único primero" en `requirements/`

**Como** mantenedor del framework SDDF  
**Quiero** adoptar la estrategia "documento único primero, fragmentación cuando duela" en `docs/requirements/`, con un umbral explícito de 15 requisitos o 500 líneas, y un resolver de wikilinks que funcione en ambas disposiciones,  
**Para** evitar fragmentación prematura en proyectos pequeños sin renunciar a la escalabilidad en proyectos grandes, manteniendo `implements: [FR-NNN]` simple en las historias y sin duplicar contenido.

---

## ✅ Criterios de aceptación

### AC-1 — README de `requirements/` documenta la estrategia

```gherkin
Dado el archivo `docs/requirements/README.md`
Cuando se inspecciona su contenido
Entonces documenta las dos disposiciones:
  · SRS único (default): `srs-<project-slug>.md`
  · Fragmentado: `functional/FR-NNN-<slug>.md` + `non-functional/NFR-NNN-<slug>.md`
 Y declara el umbral de fragmentación: > 15 requisitos O > 500 líneas
 Y explica la regla de resolución de wikilinks (archivo → sección → error)
 Y menciona los comandos de migración en ambas direcciones
```

### AC-2 — Template de SRS único creado

```gherkin
Dado el archivo `docs/templates/srs-template.md`
Cuando un autor lo copia para crear el SRS de un proyecto
Entonces contiene:
  · Frontmatter con `type: srs`, `slug`, `title`, `status`, `substatus`, `created`, `updated`
  · Sección "## Requisitos funcionales" con ejemplo de `### FR-001 — <nombre>`
  · Sección "## Requisitos no funcionales" con ejemplo de `### NFR-001 — <nombre>`
  · Comentarios que explican el umbral de fragmentación y la regla de no-renumerar
 Y no incluye secciones de implementación ni decisiones técnicas
```

### AC-3 — `memory-system scaffold` crea solo SRS único

```gherkin
Dado un proyecto sin `docs/requirements/`
Cuando ejecuto `/memory-system scaffold`
Entonces se crea `docs/requirements/srs-<project-slug>.md` a partir del template
 Y NO se crean las carpetas `functional/` ni `non-functional/` vacías
 Y el SRS creado pasa `memory-system check` sin errores
```

### AC-4 — Resolver de wikilinks soporta ambas disposiciones

```gherkin
Dado un requisito `FR-001` declarado en un `story.md` con `implements: [FR-001]`
Cuando `memory-system` resuelve el wikilink
Entonces aplica la precedencia:
  1. Busca `functional/FR-001-*.md` o `non-functional/FR-001-*.md`
  2. Si no existe, busca `### FR-001` dentro de cualquier `srs-*.md`
  3. Si no existe, falla con un error accionable

Dado un proyecto en modo SRS único con `FR-001` definido como sección
Cuando una historia declara `implements: [FR-001]`
Entonces el wikilink resuelve a `srs-<project-slug>.md#FR-001`
 Y `memory-system check` no reporta el wikilink como roto

Dado un proyecto en modo fragmentado con `FR-001-eliminar-cuenta.md`
Cuando una historia declara `implements: [FR-001]`
Entonces el wikilink resuelve a `functional/FR-001-eliminar-cuenta.md`
 Y `memory-system check` no reporta el wikilink como roto
```

### AC-5 — Migración de SRS único a fragmentado

```gherkin
Dado un proyecto con `docs/requirements/srs-mi-proyecto.md`
  Y con > 15 requisitos o > 500 líneas
Cuando ejecuto `/memory-system migrate --from=srs-single`
Entonces cada sección `### FR-NNN` del SRS se extrae a `functional/FR-NNN-<slug>.md`
 Y cada sección `### NFR-NNN` se extrae a `non-functional/NFR-NNN-<slug>.md`
 Y el SRS se reemplaza por un `index.md` que lista todos los IDs con enlaces
 Y los wikilinks `[[FR-NNN]]` existentes siguen resolviendo (ahora al archivo individual)
 Y ningún requisito se pierde
 Y la migración es idempotente: ejecutarla dos veces no duplica contenido
```

### AC-6 — Migración de fragmentado a SRS único (opcional)

```gherkin
Dado un proyecto con `docs/requirements/functional/FR-NNN-*.md` fragmentados
Cuando ejecuto `/memory-system migrate --from=requirements-fragmented`
Entonces el contenido de cada FR/NFR se consolida en `srs-<project-slug>.md`
  · Cada archivo individual se convierte en una sección `### FR-NNN`
  · El `index.md` se elimina
 Y los wikilinks `[[FR-NNN]]` siguen resolviendo (ahora a la sección del SRS)
 Y la migración es idempotente
```

### AC-7 — `memory-system check` valida ambas disposiciones

```gherkin
Dado un proyecto en modo SRS único
Cuando ejecuto `/memory-system check`
Entonces valida que:
  · Existe al menos un `srs-*.md` en `requirements/`
  · Cada `### FR-NNN` y `### NFR-NNN` tiene ID único
  · Los IDs no se repiten en toda la memoria
  · Los `implements: [FR-NNN]` de las historias resuelven correctamente

Dado un proyecto en modo fragmentado
Cuando ejecuto `/memory-system check`
Entonces valida que:
  · Existe `index.md` en `requirements/`
  · Cada `FR-NNN-*.md` y `NFR-NNN-*.md` tiene frontmatter válido
  · El `index.md` lista todos los IDs presentes
  · No hay IDs duplicados entre archivos
```

### AC-8 — Documentación canónica actualizada

```gherkin
Dado el cambio implementado
Cuando se inspecciona la documentación
Entonces `docs/architecture/memory-system.md` documenta las dos disposiciones
 Y `docs/domains/domain-knowledge-artifacts.md` incluye el tipo `srs` en la tabla de artefactos
 Y `docs/guides/sddf-commands-pipeline.md` menciona los comandos de migración
 Y `CHANGELOG.md` registra el cambio en `[Unreleased]` → `Added` (estrategia) y `Changed` (scaffolding)
```

### AC-9 — Compatibilidad con proyectos existentes

```gherkin
Dado un proyecto existente con `docs/requirements/functional/FR-NNN-*.md`
Cuando se actualiza el framework a la versión que introduce esta estrategia
Entonces el proyecto sigue funcionando sin migración obligatoria
 Y `memory-system check` valida su disposición fragmentada correctamente
 Y los wikilinks siguen resolviendo al archivo individual
```

---

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Idempotencia:** `migrate --from=srs-single` y `migrate --from=requirements-fragmented` son idempotentes. Ejecutarlos N veces produce el mismo resultado.
- **CNF-2 — Dry-run:** ambos modos de migración soportan `--dry-run` que reporta cambios sin escribir.
- **CNF-3 — Backward compatibility:** los proyectos que ya usan fragmentación siguen funcionando sin cambios obligatorios.
- **CNF-4 — Token efficiency:** un proyecto en modo SRS único carga 1 archivo en lugar de N. Un proyecto fragmentado carga solo el archivo del requisito que necesita.
- **CNF-5 — Convención de guion:** ASCII U+002D `-` en todos los slugs.
- **CNF-6 — Sin dependencias nuevas:** el resolver y la migración usan `fs-extra` (ya presente).

---

## 🚫 Fuera de alcance

- Cambios en el template de Story (`story-template.md`) o Epic (`epic-template.md`).
- Cambios en la máquina de estados de los work items.
- Cambios en otros tipos de requisitos (restricciones, supuestos, dependencias). La estrategia cubre solo FR y NFR.
- Editor visual de requisitos o dashboard de SRS.
- Traducción del README a otros idiomas.
- Sincronización bidireccional automática entre SRS y fragmentado (la migración es manual y explícita).

---

## 📎 Notas / mapa de implementación

| Archivo | Cambio |
|---------|--------|
| `docs/requirements/README.md` | Reescribir con la estrategia, umbral y resolver |
| `docs/templates/srs-template.md` | Crear (nuevo) |
| `docs/templates/requirement-template.md` | Mantener (usado en modo fragmentado) |
| `.claude/skills/memory-system/SKILL.md` | Añadir modos `migrate --from=srs-single` y `--from=requirements-fragmented`; extender `check`; actualizar `scaffold` |
| `docs/architecture/memory-system.md` | Documentar las dos disposiciones |
| `docs/domains/domain-knowledge-artifacts.md` | Añadir tipo `srs` a la tabla de artefactos |
| `docs/guides/sddf-commands-pipeline.md` | Mencionar comandos de migración |
| `README.md` | Mencionar la estrategia en la sección de estructura |
| `CHANGELOG.md` | `[Unreleased]` → `Added` + `Changed` |

### Orden de implementación sugerido

1. Crear `docs/templates/srs-template.md`.
2. Reescribir `docs/requirements/README.md`.
3. Actualizar `memory-system scaffold` (crear SRS único).
4. Implementar el resolver (archivo → sección → error).
5. Implementar `migrate --from=srs-single`.
6. Implementar `migrate --from=requirements-fragmented` (opcional).
7. Extender `memory-system check` para ambas disposiciones.
8. Actualizar documentación canónica y CHANGELOG.
9. Verificar con un proyecto de prueba: SRS único → migrar a fragmentado → migrar de vuelta.

---

## 📎 Referencias

- [[memory-system]] — Sistema de memoria y estructura de capas
- [[domain-knowledge-artifacts]] — Modelo de artefactos y tipos
- [[ADR-0001]] — Centralizar templates compartidos (precedente de DRY)
- [[ADR-0007]] — Templates como capa propia
- [[constitution]] — Principios aplicables (KISS, DRY, no crear capas vacías)
