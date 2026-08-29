---
alwaysApply: false
type: policy
slug: skill_creation_policy
title: "Política de Creación de Skills para Agentes de IA"
created: 2026-05-06
updated: 2026-05-06
---

# Política de Creación de Skills para Agentes de IA

---

## 1. [CONTEXT] Definición

Un **Skill** es un conjunto reutilizable de instrucciones y recursos que enseña a un agente de IA cómo realizar tareas específicas. Un Agent Skill es una capacidad modular que extiende la funcionalidad del agente.

Un skill puede abarcar desde una simple lista de verificación hasta un flujo de trabajo detallado con experiencia en un dominio, e incluir archivos de soporte como scripts o plantillas.

Los Skills son carpetas autónomas que contienen instrucciones, scripts y recursos que los agentes pueden descubrir y utilizar para realizar tareas de manera más precisa y eficiente.

---

## 2. [CONTEXT] Cuándo Usar un Skill

Los skills son apropiados cuando se necesita:

- **Enseñar al agente un flujo de trabajo reusable o un procedimiento específico de un dominio** que pueda cargar bajo demanda.
- **Encapsular experiencia de dominio**: convertir conocimiento especializado —desde procesos de revisión legal hasta pipelines de análisis de datos o formateo de presentaciones— en instrucciones y recursos reutilizables.
- **Encapsular flujos de trabajo repetibles**: transformar tareas de múltiples pasos en procedimientos consistentes y auditables.
- **Reutilización entre productos**: construir un skill una vez y usarlo en cualquier agente compatible con skills.

**Es necesario invocarlo explícitamente** (por el agente o por los usuarios). Los skills impulsan tareas específicas con recursos empaquetados.

---

## 3. [GUARDRAIL - BLOQUEANTE] Seguridad y Cumplimiento (NO NEGOCIABLE)

*El agente DEBE verificar estas reglas antes de generar o modificar cualquier skill. Si se viola alguna, la operación se CANCELA.*

**Reglas de seguridad (incumplimiento = ABORTAR):**

- **G-01** – ❌ **Sin instrucciones maliciosas**: El skill nunca debe contener instrucciones que puedan causar daño, comprometer sistemas o violar políticas de seguridad.
- **G-02** – ❌ **Sin patrones de exfiltración de datos**: El skill nunca debe contener código o instrucciones que extraigan datos del sistema o del usuario sin autorización.
- **G-03** – ❌ **Sin credenciales en texto plano**: No debe haber credenciales codificadas (secrets, API keys, tokens, contraseñas) en ningún archivo del skill.
- **G-04** – ❌ **Sin bypass de políticas**: El skill no debe intentar eludir los guardrails definidos en esta política ni las políticas de seguridad de la organización.
- **G-05** – ✅ **Validación de URLs externas**: Si el skill referencia URLs externas, estas deben apuntar siempre a los dominios esperados y autorizados.

**Acción ante violación**: El agente debe **ABORTAR** la creación o modificación del skill y reportar la violación con el identificador de la regla incumplida.

---

## 4. [GUIDE - ALTA PRIORIDAD] Buenas Prácticas (FUERTEMENTE RECOMENDADAS)

*El agente debe esforzarse por cumplir estas reglas. Si no puede cumplir alguna, debe documentar el motivo en su plan de trabajo (ej. `PLAN.md`).*

### 4.1. Estructura y Enfoque

- **BP-01** – ✅ **Mantener skills enfocados**: Un skill por flujo de trabajo o dominio. Si un skill se vuelve extenso, considerar dividirlo.
- **BP-02** – ✅ **Un propósito por skill**: Enfocarse en una única tarea o flujo de trabajo.
- **BP-03** – ✅ **Escribir para claridad**: Los skills son instrucciones para el agente. Usar lenguaje claro, directo y pasos numerados.
- **BP-04** – ✅ **Incluir pasos de verificación**: Ayudar al agente a confirmar que el flujo de trabajo se completó con éxito.

### 4.2. Descubrimiento y Metadatos

- **BP-05** – ✅ **Descripción crítica para el descubrimiento**: El campo `description` es fundamental para que el agente encuentre el skill. Redactarlo para que los agentes entiendan cuándo invocarlo.
- **BP-06** – ✅ **Palabras clave de activación**: Incluir palabras clave en la descripción para que los agentes encuentren el skill correcto.

### 4.3. Portabilidad y Mantenimiento

- **BP-07** – ✅ **Hacerlo genérico**: Escribir skills que funcionen en diferentes proyectos.
- **BP-08** – ✅ **Ser explícito**: Evitar lenguaje ambiguo; especificar requisitos exactos.
- **BP-09** – ✅ **Nombrar de forma descriptiva**: Usar nombres claros y orientados a acción: `generar-pruebas`, no `auxiliar`.
- **BP-10** – ✅ **Probar exhaustivamente**: Verificar que los skills funcionen con diferentes entradas y codebases.

---

## 5. [GUIDE - ESTRUCTURA] Estructura de Archivos de un Skill

*Un Skill es un directorio que contiene, como mínimo, un archivo `SKILL.md`.*

**Estructura mínima obligatoria:**

```
mi-skill/
└── SKILL.md          # Obligatorio: metadatos + instrucciones
```

**Estructura completa (con directorios opcionales):**

```
mi-skill/
├── SKILL.md          # Obligatorio: metadatos + instrucciones
├── README.md         # Opcional: documentación orientada a humanos
├── scripts/          # Opcional: código ejecutable
├── references/       # Opcional: documentación de referencia
├── assets/           # Opcional: plantillas, imágenes, recursos estáticos
├── examples/         # Opcional: ejemplos de código o ejemplos de referencia
└── evals/            # Opcional: evaluaciones y pruebas del skill
```

**Descripción de los directorios opcionales:**

- **`scripts/`** – Contiene código ejecutable (Python, Bash, JavaScript, etc.) que el agente puede invocar para realizar tareas específicas.
- **`references/`** – Contiene documentación complementaria (archivos Markdown, guías, especificaciones) que el agente puede cargar bajo demanda para obtener contexto adicional.
- **`assets/`** – Contiene recursos estáticos como plantillas, imágenes, archivos de configuración o datos de referencia que el skill pueda necesitar.
- **`evals/`** – Contiene evaluaciones y pruebas del skill, como scripts de prueba automatizados o archivos de resultados esperados.
- **`examples/`** – Contiene ejemplos de código o ejemplos de referencia que demuestran cómo usar el skill.

**Reglas de estructura:**

- **El nombre del directorio debe coincidir exactamente con el campo `name` del frontmatter** de `SKILL.md`.
- **`SKILL.md` es el punto de entrada obligatorio**. El agente lo carga primero para entender el propósito y las instrucciones del Skill.
- **Los archivos en `scripts/`, `references/` y `assets/` solo se cargan bajo demanda** (patrón de *progressive disclosure*), lo que minimiza el consumo de contexto del agente.
- **Mantén `SKILL.md` por debajo de 500 líneas**. Si el contenido es extenso, mueve los detalles a archivos en `references/` y enlázalos desde `SKILL.md`.
- **Los archivos empaquetados deben ser menores de 5 MB cada uno** (véase BP-10).
- **No incluyas credenciales ni información sensible** en ningún archivo del skill (véase G-03).

**Ejemplo de estructura completa:**

```
mi-skill/
├── SKILL.md
├── scripts/
│   └── validator.py
├── references/
│   ├── api-reference.md
│   └── faq.md
└── assets/
    ├── template.docx
    └── logo.png
```

---

## 6. [GUIDE - METADATOS] Reglas para el Descubrimiento

*Reglas específicas para el archivo `SKILL.md` y su frontmatter.*

**Estructura del frontmatter YAML (obligatorio):**

```yaml
---
name: nombre-descriptivo-del-skill
description: >
  Descripción clara y concisa. Incluir palabras clave que activen el skill.
  Mencionar explícitamente los casos de uso y cuándo debe ser invocado.
---
```

**Requisitos del frontmatter:**

- `name`: Nombre corto y descriptivo del skill. Debe coincidir con el nombre del directorio.
- `description`: Campo crítico para el descubrimiento del skill por parte del agente. Debe incluir palabras clave de activación.

**Ejemplo de frontmatter válido:**

```yaml
---
name: generar-pruebas-unitarias
description: >
  Genera pruebas unitarias para código Python usando pytest. 
  Úsalo cuando se solicite crear pruebas, testear funciones, 
  o verificar cobertura de código.
---
```

---

### 7. [GUIDE - RENDIMIENTO] Optimización y Rendimiento

*El rendimiento de un skill se mide en términos de consumo de contexto del agente, tiempo de carga y claridad de la información. Estas prácticas minimizan el uso de tokens y maximizan la eficiencia.*

**Principios de optimización:**

- **R-01** – ✅ **Mantén `SKILL.md` por debajo de 500 líneas**: El archivo principal se carga completo en el contexto del agente. Superar este límite consume tokens innecesariamente y ralentiza el procesamiento. Si el contenido es extenso, **divide** la información en archivos dentro de `references/` y enlázalos desde `SKILL.md`.

- **R-02** – ✅ **Aplica divulgación progresiva (*progressive disclosure*)**: El agente solo debe cargar el contenido de `SKILL.md` inicialmente. Los archivos en `scripts/`, `references/`, `assets/` y `examples/` **solo deben cargarse bajo demanda**, cuando el agente los necesite o cuando el usuario los solicite explícitamente. Esto reduce drásticamente el consumo de tokens en tareas simples.

- **R-03** – ✅ **Limita el tamaño de los archivos empaquetados**: Cada archivo dentro del skill (scripts, referencias, assets, ejemplos) debe ser **menor de 5 MB**. Archivos más grandes ralentizan la transferencia y el procesamiento. Si necesitas assets más pesados, considera alojarlos externamente y referenciarlos por URL.

- **R-04** – ✅ **Evita archivos innecesarios**: No incluyas archivos de documentación auxiliar (como `README.md`) a menos que sean estrictamente necesarios para humanos. Cada archivo adicional aumenta el tamaño del skill y puede confundir al agente sobre cuál es el punto de entrada principal.

- **R-05** – ✅ **Prioriza la claridad sobre la verbosidad**: Las instrucciones en `SKILL.md` deben ser concisas y directas. Usa ejemplos breves y representativos. Evita párrafos extensos o explicaciones redundantes que consuman tokens sin aportar valor.

- **R-06** – ✅ **Estructura las referencias para carga selectiva**: Si un skill tiene múltiples dominios de conocimiento, divídelos en varios archivos dentro de `references/` (ej. `references/api.md`, `references/faq.md`, `references/advanced.md`). El agente solo cargará el archivo que necesite en cada momento, en lugar de uno enorme.

**Ejemplo de aplicación de R-01 y R-06:**

```markdown
# SKILL.md (contenido principal, < 500 líneas)

Este skill genera informes financieros.

## Instrucciones
1. Recopila los datos usando el script en `scripts/fetch_data.py`.
2. Aplica las reglas de formato definidas en `references/formatting_rules.md`.
3. Si necesitas ayuda con el análisis de datos, consulta `references/data_analysis_guide.md`.

## Verificación
- Comprueba que el informe generado tenga el formato esperado.
```
---


## 8. [GUIDE - REFERENCIAS] Estándares y Documentación Oficial

Para la creación de skills, se deben seguir los estándares y guías oficiales:

- **[Agent Skills Standard](https://agentskills.io/home)** – Formato abierto y estándar para dotar a los agentes de nuevas capacidades y experiencia.
- **[Agent Skills Specification](https://agentskills.io/specification.md)** – Especificación completa del formato de Agent Skills.
- **[Claude Platform - Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)** – Documentación oficial de Anthropic sobre Agent Skills.
- **[Creating Effective Skills](https://awesome-copilot.github.com/learning-hub/creating-effective-skills/)** – Guía para escribir skills reutilizables y compartibles que ofrecen resultados consistentes.

---

## 9. [CONTEXT] Resumen de Categorías

**Clasificación de las secciones del documento:**

- **Sección 3 (Seguridad)** – **Guardrail** – Naturaleza restrictiva / seguridad – Acción ante incumplimiento: **BLOQUEAR / ABORTAR**.
- **Sección 4 (Buenas Prácticas)** – **Guide** – Naturaleza de recomendación / calidad – Acción ante incumplimiento: **ADVERTIR / SUGERIR** (puede proceder bajo justificación).
- **Sección 5 (Estructura)** – **Guide** – Naturaleza de recomendación / organización – Acción ante incumplimiento: **ADVERTIR** (recomendar corrección).
- **Sección 6 (Metadatos)** – **Guide** – Naturaleza de recomendación / descubrimiento – Acción ante incumplimiento: **ADVERTIR**.
- **Secciones 1, 2 y 8 (Definición, Cuándo Usar, Resumen)** – **Instruction** – Naturaleza definicional / contexto – Acción: **APLICAR para interpretar la tarea**.

---

