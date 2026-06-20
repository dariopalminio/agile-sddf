# Eval: Detección de Modo de Ejecución

Benchmark para verificar que `story-verify` detecta el modo de ejecución correcto dado el contenido de cada caso de prueba.

## Caso 1: pytest.ini presente → modo automatico-unit

**Input (archivos en el directorio del proyecto):**
```
pytest.ini
tests/test_auth.py
```

**Output esperado:**
```
🔍 Modo de ejecución detectado: automatico-unit
   Framework: pytest
```

**Comando ejecutado:** `python -m pytest` o `pytest`

---

## Caso 2: setup.cfg con [tool:pytest] → modo automatico-unit

**Input:**
```
setup.cfg  (contiene [tool:pytest])
tests/
```

**Output esperado:**
```
🔍 Modo de ejecución detectado: automatico-unit
   Framework: pytest
```

---

## Caso 3: jest.config.js → modo automatico-unit

**Input:**
```
jest.config.js
src/__tests__/auth.test.js
```

**Output esperado:**
```
🔍 Modo de ejecución detectado: automatico-unit
   Framework: jest
```

**Comando ejecutado:** `npx jest` o `npm test`

---

## Caso 4: playwright.config.ts → modo automatico-e2e

**Input:**
```
playwright.config.ts
e2e/auth.spec.ts
```

**Output esperado:**
```
🔍 Modo de ejecución detectado: automatico-e2e
   Framework: playwright
```

**Comando ejecutado:** `npx playwright test`

---

## Caso 5: cypress.config.js → modo automatico-e2e

**Input:**
```
cypress.config.js
cypress/e2e/auth.cy.js
```

**Output esperado:**
```
🔍 Modo de ejecución detectado: automatico-e2e
   Framework: cypress
```

**Comando ejecutado:** `npx cypress run`

---

## Caso 6: cucumber.js + features/ → modo automatico-e2e

**Input:**
```
cucumber.js
features/auth.feature
features/step_definitions/auth_steps.js
```

**Output esperado:**
```
🔍 Modo de ejecución detectado: automatico-e2e
   Framework: cucumber
```

**Comando ejecutado:** `npx cucumber-js`

---

## Caso 7: sin configuración de tests → modo manual

**Input:**
```
src/auth.py
README.md
```
(sin pytest.ini, jest.config, playwright.config, ni carpeta features/)

**Output esperado:**
```
🔍 Modo de ejecución detectado: manual
   Framework: qa-engineer.agent.md
```

**Acción:** Se invoca `agents/qa-engineer.agent.md` en modo interactivo.

---

## Caso 8: skill de testing personalizado → modo delegado

**Input:**
```
.claude/skills/test-master/SKILL.md  (existe un skill cuyo nombre contiene "test")
```

**Output esperado:**
```
🔍 Modo de ejecución detectado: delegado
   Framework: test-master
```

**Acción:** Se invoca `/test-master {story_id}`.

---

## Caso 9: E2E + unit coexisten → E2E tiene prioridad

**Input:**
```
playwright.config.ts
jest.config.js
```

**Output esperado:**
```
🔍 Modo de ejecución detectado: automatico-e2e
   Framework: playwright
```

**Justificación:** La prioridad definida en D-2 del design.md es: delegado → e2e → unit → manual.

---

## Criterios de Evaluación

| Caso | Configuración | Modo esperado | Resultado |
|------|---------------|---------------|-----------|
| 1 | pytest.ini | automatico-unit | |
| 2 | setup.cfg [tool:pytest] | automatico-unit | |
| 3 | jest.config.js | automatico-unit | |
| 4 | playwright.config.ts | automatico-e2e | |
| 5 | cypress.config.js | automatico-e2e | |
| 6 | cucumber.js + features/ | automatico-e2e | |
| 7 | sin configuración | manual | |
| 8 | skill de testing en .claude/skills/ | delegado | |
| 9 | playwright.config.ts + jest.config.js | automatico-e2e | |

**Criterio de aprobación:** 9/9 casos producen el modo esperado.
