# Stack Tecnológico SDDF

> **ID:** ARCH-TECH-STACK · **Detalle:** [[sddf-architecture]], [[memory-system]]

---

## 1. Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js ≥18 |
| Lenguaje | JavaScript puro (sin TS, sin compilación) |
| Gestor | npm / pnpm |
| Dependencia runtime | `fs-extra@^11.3.4` (única) |
| Dependencias dev | Ninguna |
| Test runner | `node --test` (nativo) |
| CLI | `scripts/cli.js` → binario `agile-sddf` |
| Config | `sddf.config.yaml` (YAML) |
| Skills / agentes | Markdown (`SKILL.md`, `.agent.md`) + TOML (`.toml`) |
| CI/CD | GitHub Actions |
| Seguridad | Trivy + Skill Shielder |
| Dev container | Docker (`Dockerfile.dev`) |
| Versionado | SemVer + `CHANGELOG.md` (3.2.1) |
| Distribución | npm (`agile-sddf`), licencia MIT |

---

## 2. Recursividad (self-hosting)

SDDF se construye con SDDF. 

```text
En el repo de SDDF:
    Memory System (docs/)  ←→  documenta SDDF
    Harness Runtime        ←→  construye SDDF
                            ↑
                            │
            El framework se construye a sí mismo
```

Declarado en `sddf.config.yaml`:

```yaml
profile: dogfood
stack: sddf-authoring
implement:
  code_generators:
    - layer: monolithic    # el "código de producción" son skills Markdown
      skill: skill-master
```

**Implicación:** sin capas frontend/backend/database; el código son skills.

---

## 3. Meta-framework externo

Los skills de creación y benchmarking de skills **no están en el paquete core**. Viven en:

**`https://github.com/dariopalminio/agile-sddf-extension`**

| Skill | Propósito | Declarado en |
|-------|-----------|--------------|
| `skill-master` | Flujo completo de creación de skills (brainstorm → create → eval → review → iterate → package) | `implement.code_generators` |
| `skill-test-evals` | Ciclo de vida de evals: generate / evals / benchmark (integrado en TDD RED) | `implement.test_generators` |

**Razones del split:** core agnóstico al stack · superficie de ataque mínima · evolución independiente · multi-stack (React, Python, Go, etc.).

---

## 4. Decisiones de diseño

| Decisión | Rationale |
|----------|-----------|
| JavaScript sin TS | Cero compilación; scripts ejecutables directo. |
| Una sola dependencia | Supply chain trivial de auditar. |
| `node --test` nativo | Sin frameworks de test que mantener. |
| Skills en Markdown | Portable a cualquier cliente IA (Claude, Codex, Copilot, Cursor, OpenCode). |
| Config en YAML | Legible por humanos y agentes. |
| Perfil `dogfood` | Validación en uso real (SDDF construye SDDF). |
| Meta-framework externo | Core agnóstico; workers por stack viven en extensión. |

---

## 5. Distribución

**Paquete npm (`files`):**
```
agents/  skills/  config/  scripts/  sddf.config.yaml  README.md  LICENSE
```

**No incluido:** skills de extensión (`skill-master`, `skill-test-evals`, workers por stack) — se instalan desde `agile-sddf-extension`.

**Restricciones:** Node ≥18 · sin compilación · offline-friendly · cross-platform · sin lockfile en distribución · core agnóstico al stack.

---

## 6. NO usa

TypeScript · Commander.js · Jest/Vitest/Mocha · ESLint/Prettier · js-yaml · simple-git · glob · bundlers.

---

## 7. Referencias

[[sddf-architecture]] · [[memory-system]] · [[domain-knowledge-artifacts]] · `package.json` · `sddf.config.yaml` · `agile-sddf-extension`