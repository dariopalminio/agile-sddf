# Constitución como raíz: mover `docs/policies/constitution.md` → `docs/constitution.md`

## Contexto

Hoy el flujo de autoridad es `AGENTS.md → policies/constitution.md → guardrails/` y `→ policies/`. La
segunda flecha es una auto-referencia: `constitution.md` vive dentro de `policies/` y a la vez es la
raíz de la que derivan las policies, así que no queda claro si es una policy más o el índice de todas.
`docs/architecture/memory-system.md` ya prescribe la solución (§3 árbol: `docs/constitution.md`;
regla "Constitution fuera de policies"; §6 gobernanza) pero el repo no la aplica.

Resultado buscado: jerarquía explícita `constitution > policies > guardrails`, sin auto-referencia:

```
AGENTS.md
    ↓
docs/constitution.md          # documento supremo
    ├──► docs/policies/       # reglas de gobernanza derivadas (hoy: ninguna; README índice)
    └──► docs/guardrails/     # restricciones verificables
```

Decisiones con el usuario:
- `docs/policies/` se **conserva** con un `README.md` índice (estilo `adr/`, `guardrails/`); queda sin policies por ahora.
- Frontmatter de la constitución: `type: constitution` (archivo y template); se registra `constitution` como `ArtifactType` en el modelo de dominio.
- Continúa el patrón de la tarea anterior: skills consumidores leen la nueva ruta con fallback a la antigua + aviso de deprecación; `docs/specs/**`, `docs/adr/**` y entradas pasadas del CHANGELOG no se reescriben.

## Cambios

### 1. Mover el archivo (`git mv`)

`docs/policies/constitution.md` → `docs/constitution.md`. Frontmatter: `type: constitution` (era `policy`), `slug: constitution` se mantiene. Ajustar los enlaces relativos internos: `../guardrails/…` → `guardrails/…`. Añadir tras el encabezado una sección corta **"Flujo de autoridad"** con el diagrama de arriba y las tres relaciones (`policies/` derivan de aquí con `derives-from`; `guardrails/` la hacen verificable con `originates-from`/`enforced-by`), enlazando a `policies/README.md` y `guardrails/README.md`.

### 2. `docs/policies/README.md` (nuevo)

Índice de la capa con frontmatter `type: wiki`, `slug: policies-index`. Contenido: qué es una policy (tabla policy vs guardrail reutilizada de `guardrails/README.md`, enlazando a `domain-knowledge-artifacts.md` §6), que la constitución vive un nivel arriba en [../constitution.md](../constitution.md) y es la raíz de la que toda policy declara `derives-from`, convención de nombre `<nombre>-policy.md`, e índice vacío ("Todavía no hay policies; las reglas transversales viven en la constitución").

### 3. Template y skill generador

- `skills/project-policies-generation/assets/project-constitution-template.md`: ya usa `type: constitution`; añadir la misma sección "Flujo de autoridad" con placeholders.
- `skills/project-policies-generation/SKILL.md` (~23 refs): ruta de salida `$SPECS_BASE/constitution.md`; Paso 1 crea `policies/` (y su README si falta) y `guardrails/`; añadir Paso 2b de migración simétrico al 3b del DoD: si existe `policies/constitution.md` y no `constitution.md`, ofrecer moverlo (`git mv`, `type: constitution`, `updated`); referencia en CLAUDE.md pasa a `@docs/constitution.md` y se reemplaza la heredada en vez de duplicarla; resumen y sección Salida.

### 4. Skills consumidores — nueva ruta + fallback

Mismo patrón que el DoD: buscar `$SPECS_BASE/constitution.md`; si no existe, `$SPECS_BASE/policies/constitution.md` con `⚠️ policies/constitution.md está deprecado — muévelo a docs/constitution.md`; si ninguna, comportamiento actual.

- `skills/story-design/SKILL.md` (L51, L186-191, L478) + `examples/input/story.md` L46
- `skills/story-code-review/SKILL.md` (L74, L251, L290, L312) — los `agents/*.agent.md` reciben `$CONSTITUTION_PATH` resuelto, solo se ajusta texto descriptivo si nombra la ruta
- `skills/story-implement-tasks/SKILL.md` (L484, L497: solo nombran `constitution.md`, sin ruta → sin cambio)
- `skills/sddf-init/SKILL.md` (L131, L159: informe final `docs/constitution.md`)
- `skills/docs-wiki-builder/SKILL.md` L234: `[[constitution]] → <SPECS_BASE>/constitution.md` (hoy apunta a una ruta `knowledge/constitution/` que no existe)

### 5. Scripts y tests

- `scripts/audit-root-resolution.js` L26: `'docs/constitution.md'`.
- `scripts/check-doc-links.js` `ACTIVE_ROOTS`: añadir `'docs/constitution.md'` (hoy solo escanea `docs/policies`, así que el archivo movido quedaría fuera del checker). `test/check-doc-links.test.js` L14 lista los roots esperados → añadir la misma entrada.
- `scripts/verify-runtime-documentation.js` L22 y `verify-skill-security-workflow.js` L24/L64 listan `docs/policies` como superficie protegida: añadir `docs/constitution.md` a ambas para que la constitución siga auditada por Skill Shielder (revisar también `.github/workflows/skill-security-audit.yml` si enumera rutas).

### 6. Docs activas

- `AGENTS.md`: árbol (`docs/constitution.md` como primera entrada bajo `docs/`; `policies/ # reglas de gobernanza derivadas de la constitución`), sección "Documentación de referencia" menciona el flujo de autoridad en una línea, y `@docs/constitution.md` en "Políticas del Proyecto".
- `README.md` L218 (árbol) y L417 (enlace).
- `docs/index.md` L28 → `[constitution.md](constitution.md)`; retitular la sección "⚖️ Políticas" como "⚖️ Gobernanza" con las tres capas (constitución → policies → guardrails) y enlazar los tres README.
- `docs/domains/README.md` L67, `docs/domains/domain.md` L31 y L200, `docs/domains/domain-knowledge-artifacts.md` L32 (añadir `constitution` al conjunto cerrado de `ArtifactType`), L97 (fila **Constitution** — `constitution.md` en raíz de `docs/`, evoluciona lento, "documento supremo del que derivan policies y guardrails"), L430 y L444.
- `docs/architecture/memory-system.md`: ya correcto; solo verificar que §6 enlaza a los README.
- `docs/guardrails/README.md`: en "Guardrail vs Policy" añadir una línea: ambos derivan de [../constitution.md](../constitution.md).
- `CHANGELOG.md` `[Unreleased] → Changed`: nueva viñeta (constitución movida a la raíz de `docs/`, `type: constitution`, fallback deprecado, `policies/README.md`).

### 7. No tocar

`docs/specs/**`, `docs/adr/**`, entradas pasadas del CHANGELOG, ejemplos de skills que solo nombran `constitution.md` sin ruta, copias instaladas en `.claude/`, `.agents/`, `.github/`.

## Verificación

1. `git status` muestra `R docs/policies/constitution.md -> docs/constitution.md` y `?? docs/policies/README.md`.
2. `grep -rn "policies/constitution" skills/ scripts/ test/ AGENTS.md README.md docs/index.md docs/domains docs/guardrails docs/policies docs/constitution.md` devuelve solo líneas de fallback/deprecación.
3. `node scripts/check-doc-links.js` OK y ahora cuenta `docs/constitution.md` entre los archivos activos; `node test/check-doc-links.test.js` pasa.
4. `npm run test:installer`, `npm run test:eval:runner`, `node scripts/audit-root-resolution.js`, `node scripts/verify-runtime-documentation.js` y `node scripts/verify-skill-security-workflow.js` en verde.
5. Lectura manual: `AGENTS.md`, `docs/constitution.md`, `docs/policies/README.md` y `docs/index.md` cuentan el mismo flujo de autoridad sin auto-referencia.
