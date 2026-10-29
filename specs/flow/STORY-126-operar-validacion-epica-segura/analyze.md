---
type: analyze
id: STORY-126
slug: STORY-126-analyze-report
title: "Analyze: Operar la validación de épicas de manera segura"
story: STORY-126
design: STORY-126
tasks: STORY-126
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-126-operar-validacion-epica-segura
---

<!-- Referencias -->
[[STORY-126-operar-validacion-epica-segura]]

# Reporte de Coherencia: Operar la validación de épicas de manera segura

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos (más CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | testcases.md no presente — cobertura de pruebas no evaluada (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 24/24 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 9/9 componentes y 7/7 interfaces con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Listada en el índice; dueña de CS-7 y de CS-10 para `--mode` y `--dry-run` |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Resultado según modo y veredicto (`auto`/`APPROVED` → éxito; `manual`/`BLOCKED` → fallo) | ✓ | C1 (parseo), C2 (resolución de `MODO`), C7 (bloque de resultado); Interfaces «Interacción por modo» y «Correspondencia del resultado»; F1, F2; D-1, D-8 |
| AC-2 | Previsualización `--dry-run` sin escrituras ni comandos | ✓ | C3 (Política de efectos), C4 (guardia `no ejecutada`), C5 (impresión en consola), C8; Interfaz «Previsualización»; F3; D-4, D-5, D-6 |
| AC-3 | Modo no reconocido → fallo con valores válidos, sin archivos | ✓ | C1 (cinco errores de invocación en orden), C7; F4; D-3, D-7, D-10 |
| AC-4 | Repetición sin efectos colaterales | ✓ | C5, C6 (campos volátiles, reglas de orden y forma); F5; D-9 y CR-001 |
| CNF-1 | Idempotencia y orden determinista | ✓ | C6; «Reglas de orden y forma» |
| CNF-2 | Escritura mínima | ✓ | C3; «Política de efectos» |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondición (STORY-124 implementada; presencia de pasos de STORY-125/169) | CR-002 | ✓ |
| T002 | Aplicar CR-001 en `story.md` con confirmación del PO | CR-001, D-9 | ✓ |
| T003 | Reescribir el Paso 1 «Argumentos» | C1; Interfaz «Invocación»; D-2, D-3 | ✓ |
| T004 | Cinco errores de invocación en orden | C1; Interfaz «Errores de invocación»; D-7, D-10 | ✓ |
| T005 | Paso «Modo de evidencia» | C2; Interfaz «Resolución de `MODO`»; CR-003 | ✓ |
| T006 | Interacción por modo y argumento ausente | Interfaces «Argumento `<epica>` ausente» e «Interacción por modo»; D-8 | ✓ |
| T007 | Sección «Política de efectos» | C3; Esquema «Política de efectos» | ✓ |
| T008 | Guardia de previsualización | C4; Esquema «Resultado `no ejecutada`»; D-4, D-5 | ✓ |
| T009 | `no ejecutada` sin efecto en el veredicto | C8; D-6 | ✓ |
| T010 | Previsualización, campos volátiles y reglas de orden en el Paso 5 | C5, C6; D-4, D-9 | ✓ |
| T011 | Bloque de resultado en el Paso 6 | C7; Interfaces «Bloque de resultado» y «Correspondencia del resultado»; D-1 | ✓ |
| T012 | Parámetros, modos y salida del `SKILL.md` | C1 (contrato de invocación), CS-10 | ✓ |
| T013 | Eval V-1 | C9; V-1 | ✓ |
| T014 | Eval V-2 | C9; V-2 | ✓ |
| T015 | Eval V-3 | C9; V-3 | ✓ |
| T016 | Eval V-4 | C9; V-4 | ✓ |
| T017 | Eval V-5 | C9; V-5 | ✓ |
| T018 | Evals V-6 y V-7 | C9; V-6, V-7 | ✓ |
| T019 | Verificación de tamaño, encoding y literales | Interfaces (mensajes literales) | ✓ |
| T020 | Verificación diferida si faltan STORY-125/169 | CR-002 | ✓ |
| T021 | `verify:layout`, `verify:validation-contract`, `verify:eval-inventory` | V-8, CS-21 | ✓ |
| T022 | `npm test` y `verify:repository` | V-8 | ✓ |
| T023 | `graphify update .` | Regla del repositorio (`AGENTS.md` › graphify), tras modificar archivos | ✓ |
| T024 | Evals y recorrido manual pendientes de criterio humano | V-1…V-7; `AGENTS.md` (evals manuales) | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C1 Paso 1 «Argumentos» | Componentes | T003, T004, T012 | ✓ |
| C2 Paso «Modo de evidencia» | Componentes | T005 | ✓ |
| C3 Política de efectos | Componentes / Esquema | T007 | ✓ |
| C4 Guardia de previsualización | Componentes / Esquema | T008 | ✓ |
| C5 Paso 5 «Template y escritura» | Componentes | T010 | ✓ |
| C6 Reglas de determinismo | Componentes / Esquema | T010 | ✓ |
| C7 Paso 6 «Salida» | Componentes | T011 | ✓ |
| C8 Regla del veredicto | Componentes | T009 | ✓ |
| C9 Casos de eval | Componentes / Contratos V-1…V-7 | T013–T018 | ✓ |
| Interfaz «Invocación» | Interfaces | T003 | ✓ |
| Interfaz «Errores de invocación» | Interfaces | T004 | ✓ |
| Interfaz «Argumento `<epica>` ausente» | Interfaces | T006 | ✓ |
| Interfaz «Resolución de `MODO`» | Interfaces | T005 | ✓ |
| Interfaz «Interacción por modo» | Interfaces | T006 | ✓ |
| Interfaz «Previsualización» | Interfaces | T010 | ✓ |
| Interfaces «Bloque de resultado» y «Correspondencia del resultado» | Interfaces | T011 | ✓ |
| Degradación gradual (P7) | Degradación gradual | T005 (config ausente), T006 (no se puede preguntar), T011 (template ausente, escritura fallida) | ✓ |
| Contrato V-8 | Contratos de verificación | T021, T022 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:55` — `**STORY-126** — Operar la validación de épicas de manera segura` |
| Objetivo de la historia alineado con la épica | ✓ | `epic.md:29` (VALIDATE: «fuera de `--dry-run`, escribe únicamente su reporte»), CS-7 (`epic.md:77`) y CS-10 (`epic.md:80`); el reparto de `epic.md:199` asigna a STORY-126 CS-7 y `--mode`/`--dry-run` de CS-10 |
| Restricciones de la épica respetadas | ✓ | Tabla de flags (`epic.md:204-207`) aplicada en C2 y D-4; vocabulario `NEEDS-CHANGES`/`BLOCKED` (`epic.md:190-193`) respetado: el ejemplo `manual`/`BLOCKED` de AC-1 corresponde a evidencia sin obtener; `--verbose` se deja a STORY-137 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E
- **Descripción:** el criterio DoD «tasks.md contiene únicamente tareas atómicas» queda en duda para T010: agrupa tres cambios del Paso 5 (impresión de la previsualización, tabla de campos volátiles y tabla de reglas de orden y forma) en una sola tarea con tres viñetas. Es cohesiva (un mismo paso del `SKILL.md`), pero su criterio de terminado es triple.
- **Archivo afectado:** tasks.md — sección «## 3. SKILL.md — efectos, previsualización y determinismo», T010
- **Acción requerida:** opcionalmente, dividir T010 en dos tareas: previsualización en consola (C5) y reglas de determinismo (C6).

---

## Recomendaciones

1. (INC-001) En `tasks.md`, dividir T010 en «T010 Previsualización en el Paso 5 (C5)» y «T011 Campos volátiles y reglas de orden y forma (C6)», renumerando las siguientes; no bloquea la implementación.
2. Aplicar T002 (CR-001 del diseño) antes de implementar: AC-4 aún dice «salvo la fecha de evaluación» mientras el diseño admite también las duraciones medidas (D-9). La divergencia está registrada como CR, por eso no es un hallazgo.
3. Al refinar EPIC-23, resolver la tensión que el diseño registra en Risks entre STORY-125 (`--mode auto` sin smoke config → `BLOCKED` con reporte) y STORY-137 AC-2 (error sin reporte), y anotar en STORY-125 T008 la remisión a los mensajes de C1 (CR-003).
4. Considerar generar `testcases.md` con `/story-testcases STORY-126` para habilitar también `/story-implement`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-126` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-126` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1…AC-4 en bloques `gherkin` (principal, alternativo, error, regresión) |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla de Componentes C1–C9 con columna «AC que satisface»; ver Cobertura |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | Goals, Esquema y Flujos anotados con `// satisface:`; Componentes, Interfaces y Decisiones con columna AC |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna»; D-1…D-10; divergencias registradas en CR-001…CR-003 |
| Existe tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (24 tareas) |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ⚠️ | WARNING | Los cuatro escenarios tienen tareas (T003–T018); T010 agrupa tres cambios (INC-001) |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe (modo `--only-tasks`) |
