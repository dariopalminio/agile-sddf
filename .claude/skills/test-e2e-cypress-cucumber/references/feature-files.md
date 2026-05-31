# Feature Files (Gherkin)

## Basic Structure

```gherkin
# language: es   ← optional: declare Gherkin language
@domain @run-level
Característica: User Authentication
  As a registered user
  I want to log in
  So that I can access my account

  @smoke
  Escenario: Successful login
    Given the user is on the login page
    When the user enters valid credentials
    Then the user is redirected to the dashboard
```

## Scenario Outline (Data-Driven)

```gherkin
@core
Esquema del escenario: Login fails with missing fields
  When the user submits the form with email "<email>" and password "<password>"
  Then a validation error appears for the "<field>" field

  Ejemplos:
    | email            | password    | field    |
    |                  | pass123     | email    |
    | user@example.com |             | password |
```

## Background (Shared Precondition)

```gherkin
Antecedentes:
  Given the user is on the login page
```

Background runs before **every** scenario in the feature — identical to `beforeEach`.

## DataTable

```gherkin
Escenario: Register multiple users
  Given the following users exist:
    | name  | email             | role  |
    | Alice | alice@example.com | admin |
    | Bob   | bob@example.com   | user  |
```

Step implementation:
```typescript
Given('the following users exist:', (table: DataTable) => {
  const users = table.hashes()  // [{ name, email, role }, ...]
  users.forEach(user => userPage.create(user))
})
```

## DocString (Multi-line Text)

```gherkin
Escenario: Submit feedback form
  When the user submits the feedback:
    """
    This is a multi-line
    feedback message.
    """
```

## Tag Taxonomy

| Category | Examples | Purpose |
|---|---|---|
| Domain | `@auth`, `@checkout`, `@catalog` | Which feature area |
| Run level | `@smoke`, `@core`, `@full` | Execution tier |
| Status | `@wip`, `@flaky`, `@skip` | Lifecycle state |
| Type | `@positive`, `@negative`, `@edge-case` | Test intent |

**Rule:** Every scenario needs at least one domain tag and one run-level tag. Feature-level tags cascade to all its scenarios.

## Rules for Good Feature Files

- Write from a user's perspective — what the system does, not how
- One action per `When` step
- Avoid UI details in step names ("clicks the blue submit button" → "submits the form")
- `Background` only for steps shared by **all** scenarios in the feature
- `Scenario Outline` when 3+ examples share identical step structure
- Keep scenarios independent — no scenario should depend on state left by another
