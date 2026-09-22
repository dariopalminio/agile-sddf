<!-- ------------------------------------------------------------------ -->
<!-- TEMPLATE PARA POLÍTICAS DE AGENTES DE IA (SDD)                     -->
<!-- Instrucciones de uso:                                              -->
<!-- 1. Rellena los marcadores entre corchetes [ ] con tu contenido.    -->
<!-- 2. Elimina las secciones que no apliquen a tu caso de uso.         -->
<!-- 3. Renombra el archivo siguiendo: <dominio>-policy.md              -->
<!-- ------------------------------------------------------------------ -->

# [NOMBRE DE LA POLÍTICA - Ej: POLÍTICA DE REVISIÓN DE CÓDIGO]

<!-- Versión semántica del documento -->
**Versión:** 1.0.0
**Estado:** [Borrador | Revisión | Aprobado]
**Última actualización:** YYYY-MM-DD
**Propietario:** [Nombre del responsable o equipo]

---

## 1. [CONTEXT] Propósito y Alcance

<!-- Define el QUÉ y el POR QUÉ de esta política. Explica qué problema resuelve y a qué agentes/sistemas aplica. -->

**Propósito:**
[Describe la razón principal de esta política. Ej: "Garantizar que los agentes generen código seguro y con pruebas antes de desplegar".]

**Alcance:**
[Indica a qué agentes, repositorios o dominios afecta. Ej: "Aplica a todos los agentes que generen código Python en el repositorio X".]

**Exclusiones:**
[Si aplica, indica qué NO cubre. Ej: "No aplica a scripts de prueba internos del CI/CD".]

---

## 2. [CONTEXT] Definiciones y Términos Clave

<!-- Define términos técnicos o específicos del dominio para evitar ambigüedades. -->

- **[Término 1]**: [Definición clara].
- **[Término 2]**: [Definición clara].

---

## 3. [GUARDRAIL - BLOQUEANTE] Reglas No Negociables

<!-- ESTAS REGLAS SON DE OBLIGADO CUMPLIMIENTO. El agente debe verificar CADA UNA antes de ejecutar. Si falla, ABORTA. -->

**Reglas de seguridad (incumplimiento = ABORTAR):**

- **G-01** – ❌ **Sin [práctica prohibida]**: [Explicación clara de la restricción].
- **G-02** – ❌ **Sin [otra práctica prohibida]**: [Explicación clara].
- **G-03** – ✅ **Validación obligatoria**: [Ejemplo: "Todas las URLs deben apuntar a dominios internos autorizados"].

**Acción ante violación:**
El agente debe **ABORTAR** la tarea y notificar el motivo con el ID de la regla (ej. `G-01`).

---

## 4. [GUIDE - ALTA PRIORIDAD] Buenas Prácticas

<!-- Estas son recomendaciones de calidad. El agente DEBE esforzarse por cumplirlas. Si no puede, debe justificarlo en su PLAN.md. -->

### 4.1. [Nombre de la Categoría, ej: Estructura]

- **BP-01** – ✅ [Recomendación clara y accionable].
- **BP-02** – ✅ [Otra recomendación].

### 4.2. [Nombre de la Categoría, ej: Mantenimiento]

- **BP-03** – ✅ [Recomendación].
- **BP-04** – ✅ [Recomendación].

---

## 5. [GUIDE - RENDIMIENTO] Optimización y Eficiencia

<!-- Recomendaciones para minimizar el consumo de contexto (tokens) del agente. -->

- **R-01** – ✅ **Mantén los archivos principales por debajo de [N] líneas**: [Explicación de por qué y cómo dividir].
- **R-02** – ✅ **Aplica divulgación progresiva**: [Explicación de que solo se carguen recursos bajo demanda].
- **R-03** – ✅ **Limita el tamaño de assets**: Cada archivo debe ser menor de [X] MB.

---

## 6. [GUIDE - ESTRUCTURA] Organización de Archivos (si aplica)

<!-- Define cómo deben organizarse físicamente las carpetas y archivos. -->

**Estructura mínima obligatoria:**

```
[nombre-base]/
└── [archivo-principal].[ext]   <!-- Ej: SKILL.md -->
```

**Estructura completa (con directorios opcionales):**

```
[nombre-base]/
├── [archivo-principal].[ext]   <!-- Obligatorio -->
├── scripts/                  <!-- Opcional: Código ejecutable -->
├── references/               <!-- Opcional: Documentación pesada -->
├── assets/                   <!-- Opcional: Plantillas o recursos -->
└── examples/                 <!-- Opcional: Ejemplos de código -->
```

**Reglas de la estructura:**
- El directorio raíz debe llamarse igual que el identificador `name` del frontmatter.
- Los directorios opcionales solo se cargan bajo demanda (véase R-02).

---

## 7. [GUIDE - METADATOS] Reglas para el Descubrimiento (si aplica)

<!-- Define el formato de los metadatos para que los agentes encuentren el recurso. -->

**Frontmatter obligatorio (formato YAML):**

```yaml
---
name: [identificador-unico]
description: >
  [Descripción clara. Incluir palabras clave de activación para que el agente
  sepa cuándo usar este recurso.]
---
```

**Requisitos del frontmatter:**
- `name`: [Requisito, ej: "Debe ser kebab-case y coincidir con el directorio"].
- `description`: [Requisito, ej: "Debe incluir verbos de acción y casos de uso"].

**Ejemplo:**
```yaml
---
name: generar-pruebas-unitarias
description: >
  Genera pruebas unitarias para Python usando pytest.
  Úsalo cuando se solicite crear pruebas, testear funciones,
  o verificar cobertura de código.
---
```

---

## 8. [GUIDE - REFERENCIAS] Estándares y Documentación Oficial

<!-- Lista de fuentes externas que respaldan esta política. -->

- **[Nombre del estándar](URL)** – [Breve descripción de por qué es relevante].
- **[Guía oficial](URL)** – [Breve descripción].

---

## 9. [INSTRUCTION] Directrices Operativas (si aplica)

<!-- Pasos secuenciales que el agente DEBE seguir para ejecutar esta política correctamente. -->

1. **Paso 1**: [Descripción del primer paso].
2. **Paso 2**: [Descripción].
   - Subpaso 2.1: [Detalle].
   - Subpaso 2.2: [Detalle].
3. **Paso 3**: [Descripción].

**Verificación de éxito:**
[Cómo debe el agente confirmar que la tarea se completó correctamente. Ej: "Verificar que el archivo generado tenga extensión .md"].

---

## 10. [CONTEXT] Resumen de Categorías

<!-- Clasificación interna del documento para que el agente sepa qué hacer con cada sección. -->

| Sección | Categoría | Naturaleza | Acción ante incumplimiento |
| :--- | :--- | :--- | :--- |
| **Sección 3 (Guardrails)** | **Guardrail** | Restrictiva / Seguridad | **ABORTAR** |
| **Secciones 4 a 8** | **Guide** | Recomendación / Calidad | **ADVERTIR / SUGERIR** |
| **Sección 9 (Instrucciones)** | **Instruction** | Operativa | **APLICAR** |
| **Secciones 1, 2 y 10** | **Instruction** | Definicional | **APLICAR** |

---

## Historial de Cambios

<!-- Registro de versiones para trazabilidad. -->

| Versión | Fecha | Cambios | Autor |
| :--- | :--- | :--- | :--- |
| 1.0.0 | YYYY-MM-DD | Creación inicial | [Nombre] |

---

*Este documento debe revisarse periódicamente y actualizarse según la evolución del proyecto.*
