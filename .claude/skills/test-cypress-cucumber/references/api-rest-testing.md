# API REST Testing

Testing REST APIs directly with Cypress's `cy.request()` — no browser interaction required.

---

## Setup: baseUrl y headers globales

Configurar en `cypress.config.ts` o pasar headers en cada petición:

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.VITE_APP_TO_TEST_URI || 'http://localhost:5173',
    env: {
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    },
  },
});
```

Para reutilizar headers de autenticación, usar un custom command:

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('loginApi', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    Cypress.env('authToken', response.body.token);
  });
});
```

---

## Login & Register — Casos positivos

```typescript
// tests/e2e/api/auth.cy.ts
describe('POST /api/auth/login', () => {
  it('returns 200 and token with valid credentials', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: {
        email: 'user@test.com',
        password: 'password123',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string').and.have.length.greaterThan(0);
      expect(response.body).to.have.property('user');
      expect(response.body.user.email).to.eq('user@test.com');
    });
  });
});

describe('POST /api/auth/register', () => {
  it('returns 201 and creates user with valid data', () => {
    const newUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'SecurePass123!',
      name: 'Test User',
    };

    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/register`,
      body: newUser,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.email).to.eq(newUser.email);
      expect(response.body).not.to.have.property('password'); // Never expose password
    });
  });
});
```

---

## Login & Register — Casos negativos

Por defecto `cy.request()` falla en respuestas 4xx/5xx. Usar `failOnStatusCode: false` para testear errores:

```typescript
describe('POST /api/auth/login — negative', () => {
  it('returns 401 with wrong password', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { email: 'user@test.com', password: 'wrongpassword' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('error');
      expect(response.body).not.to.have.property('token');
    });
  });

  it('returns 401 with non-existent user', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { email: 'nobody@nowhere.com', password: 'irrelevant' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('returns 400 when email is missing', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { password: 'password123' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  it('returns 400 when body is empty', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: {},
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});

describe('POST /api/auth/register — negative', () => {
  it('returns 409 when email already exists', () => {
    const data = { email: 'existing@test.com', password: 'Pass123!', name: 'Existing' };
    const url = `${Cypress.env('API_BASE_URL')}/api/auth/register`;

    // First registration
    cy.request({ method: 'POST', url, body: data });

    // Second registration with same email
    cy.request({ method: 'POST', url, body: data, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(409);
      expect(response.body).to.have.property('error');
    });
  });

  it('returns 422 with invalid email format', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/register`,
      body: { email: 'not-an-email', password: 'Pass123!', name: 'Test' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(422);
    });
  });

  it('returns 422 with weak password', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/register`,
      body: { email: 'test@example.com', password: '123', name: 'Test' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(422);
    });
  });
});
```

---

## HTTP Status Code Validation

```typescript
// tests/e2e/api/http-codes.cy.ts
describe('HTTP status code assertions', () => {
  let authToken: string;

  before(() => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { email: 'user@test.com', password: 'password123' },
    }).then((res) => {
      authToken = res.body.token;
    });
  });

  it('GET /api/users — 200 OK', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE_URL')}/api/users`,
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('POST /api/users — 201 Created', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/users`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: { name: 'New User', email: `u${Date.now()}@test.com` },
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it('GET /api/users/:id — 404 Not Found', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE_URL')}/api/users/nonexistent-id-999999`,
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('GET /api/users — 401 Unauthorized (no token)', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE_URL')}/api/users`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('GET /api/admin — 403 Forbidden (non-admin user)', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE_URL')}/api/admin`,
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('POST /api/users — 422 Unprocessable (invalid data)', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/users`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: { name: '' }, // missing required fields
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(422);
    });
  });
});
```

### HTTP Status Code Reference

| Code | Meaning | When to expect |
|------|---------|----------------|
| `200` | OK | Successful GET, PUT |
| `201` | Created | Successful POST that creates resource |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Malformed request body/params |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Valid token, insufficient permissions |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Duplicate resource (e.g., email already exists) |
| `422` | Unprocessable | Valid JSON but failed validation rules |
| `500` | Server Error | Unexpected backend failure |

---

## Idempotency Verification

Idempotent operations: the same request executed N times produces the same result.

```typescript
// tests/e2e/api/idempotency.cy.ts
describe('Idempotency', () => {
  let authToken: string;

  before(() => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { email: 'user@test.com', password: 'password123' },
    }).then((res) => { authToken = res.body.token; });
  });

  it('PUT /api/users/:id is idempotent', () => {
    const userId = 'user-123';
    const updateData = { name: 'Updated Name' };
    const headers = { Authorization: `Bearer ${authToken}` };
    const url = `${Cypress.env('API_BASE_URL')}/api/users/${userId}`;

    // Execute the same PUT request 3 times sequentially
    cy.request({ method: 'PUT', url, headers, body: updateData })
      .then((r1) => {
        expect(r1.status).to.eq(200);
        return cy.request({ method: 'PUT', url, headers, body: updateData });
      })
      .then((r2) => {
        expect(r2.status).to.eq(200);
        return cy.request({ method: 'PUT', url, headers, body: updateData });
      })
      .then((r3) => {
        expect(r3.status).to.eq(200);
        expect(r3.body.name).to.eq('Updated Name');
      });
  });

  it('DELETE /api/users/:id is idempotent', () => {
    const userId = 'user-to-delete';
    const headers = { Authorization: `Bearer ${authToken}` };
    const url = `${Cypress.env('API_BASE_URL')}/api/users/${userId}`;

    // First DELETE — should succeed
    cy.request({ method: 'DELETE', url, headers }).then((first) => {
      expect(first.status).to.eq(204);
    });

    // Second DELETE — resource already gone, should return 404 (not 500)
    cy.request({ method: 'DELETE', url, headers, failOnStatusCode: false }).then((second) => {
      expect([404, 204]).to.include(second.status); // Accept both, never 500
    });
  });

  it('POST /api/orders is NOT idempotent (creates duplicates)', () => {
    const orderData = { productId: 'prod-1', quantity: 1 };
    const headers = { Authorization: `Bearer ${authToken}` };
    const url = `${Cypress.env('API_BASE_URL')}/api/orders`;

    let firstId: string;

    cy.request({ method: 'POST', url, headers, body: orderData }).then((first) => {
      expect(first.status).to.eq(201);
      firstId = first.body.id;
    });

    cy.request({ method: 'POST', url, headers, body: orderData }).then((second) => {
      expect(second.status).to.eq(201);
      // Two different IDs — POST creates new resources each time
      expect(second.body.id).not.to.eq(firstId);
    });
  });
});
```

---

## Performance Measurement

```typescript
// tests/e2e/api/performance.cy.ts
// IMPORTANT: Thresholds must be derived from measured baselines, not guessed.
// How to establish baselines:
//   1. Run the test suite against a known-good environment (staging or local with prod data volume)
//   2. Record p50 and p95 values over at least 50 warm requests
//   3. Set the threshold at 2× the observed p95 to allow for CI variance
//   4. Document the baseline date and environment in a comment below
//
// Baselines last measured: <DATE> on <ENVIRONMENT> (e.g. staging, Node 20, 2-core runner)
// login p95 measured: ~220ms  → threshold set at 500ms (2× buffer for CI)
// listUsers p95 measured: ~130ms → threshold set at 300ms
const THRESHOLDS = {
  login: 500,       // ms — update after re-measuring on target environment
  listUsers: 300,   // ms — update after re-measuring on target environment
};

describe('API Performance', () => {
  it('POST /api/auth/login responds within threshold', () => {
    const start = Date.now();

    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { email: 'user@test.com', password: 'password123' },
    }).then((response) => {
      const duration = Date.now() - start;
      expect(response.status).to.eq(200);
      expect(duration, `Login took ${duration}ms — threshold: ${THRESHOLDS.login}ms`)
        .to.be.lessThan(THRESHOLDS.login);
    });
  });

  it('measures p95 response time over 10 requests', () => {
    const RUNS = 10;
    const P95_THRESHOLD = 400; // ms
    const durations: number[] = [];

    // cy.request calls chain automatically in Cypress
    Cypress._.times(RUNS, () => {
      const start = Date.now();
      cy.request({
        method: 'GET',
        url: `${Cypress.env('API_BASE_URL')}/api/users`,
        headers: { Authorization: `Bearer ${Cypress.env('authToken')}` },
      }).then((response) => {
        durations.push(Date.now() - start);
        expect(response.status).to.eq(200);
      });
    });

    cy.then(() => {
      const sorted = [...durations].sort((a, b) => a - b);
      const p95Index = Math.ceil(RUNS * 0.95) - 1;
      const p95 = sorted[p95Index];
      cy.log(`p95 response time: ${p95}ms (from ${RUNS} runs: ${sorted.join(', ')}ms)`);
      expect(p95, `p95 ${p95}ms exceeds threshold ${P95_THRESHOLD}ms`).to.be.lessThan(P95_THRESHOLD);
    });
  });
});
```

---

## JSON Schema Validation

```typescript
// tests/e2e/api/schemas.cy.ts

// Inline schema validator (sin dependencias externas)
function validateSchema(body: Record<string, unknown>, schema: { required: string[]; properties: Record<string, { type: string }> }, label: string) {
  for (const field of schema.required) {
    expect(body, `${label}: missing required field "${field}"`).to.have.property(field);
  }
  for (const [key, def] of Object.entries(schema.properties)) {
    if (key in body) {
      expect(typeof body[key], `${label}: field "${key}" should be ${def.type}`).to.eq(def.type);
    }
  }
}

const userSchema = {
  required: ['id', 'email', 'name', 'createdAt'],
  properties: {
    id:        { type: 'string' },
    email:     { type: 'string' },
    name:      { type: 'string' },
    role:      { type: 'string' },
    createdAt: { type: 'string' },
  },
};

const loginResponseSchema = {
  required: ['token', 'user'],
  properties: {
    token:     { type: 'string' },
    expiresIn: { type: 'number' },
    user:      { type: 'object' },
  },
};

describe('JSON Schema Validation', () => {
  let authToken: string;

  before(() => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { email: 'user@test.com', password: 'password123' },
    }).then((res) => { authToken = res.body.token; });
  });

  it('GET /api/users/:id — validates user schema', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE_URL')}/api/users/user-123`,
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      validateSchema(response.body, userSchema, 'GET /api/users/:id');
      // Password must NEVER be exposed
      expect(response.body).not.to.have.property('password');
    });
  });

  it('POST /api/auth/login — validates login response schema', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { email: 'user@test.com', password: 'password123' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      validateSchema(response.body, loginResponseSchema, 'POST /api/auth/login');
    });
  });

  it('GET /api/users — validates array response', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE_URL')}/api/users`,
      headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');

      // Validate each item in the array
      response.body.forEach((user: Record<string, unknown>) => {
        validateSchema(user, userSchema, 'user item in GET /api/users');
        expect(user).not.to.have.property('password');
      });
    });
  });

  it('error responses include error field', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: { email: 'bad@bad.com', password: 'wrong' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.be.a('string').and.have.length.greaterThan(0);
    });
  });
});
```

---

## Quick Reference

| Topic | Pattern |
|-------|---------|
| API request básico | `cy.request({ method, url, body })` |
| Peticiones autenticadas | `headers: { Authorization: 'Bearer <token>' }` |
| Testear errores 4xx/5xx | `failOnStatusCode: false` (por defecto falla en errores) |
| Assert status primero | `expect(response.status).to.eq(200)` antes del body |
| Idempotency (PUT) | Ejecutar N veces, afirmar mismo estado final |
| Idempotency (DELETE) | Segunda llamada devuelve `404`, nunca `500` |
| Performance threshold | `expect(duration).to.be.lessThan(THRESHOLD)` |
| p95 measurement | Ordenar N duraciones, tomar índice `ceil(N * 0.95) - 1` |
| Schema validation | Verificar campos requeridos + tipos de propiedades |
| Nunca exponer | `password`, tokens internos, PII en respuestas de API |

| HTTP Method | Idempotent? | Expected status on repeat |
|-------------|-------------|---------------------------|
| GET | Yes | Always `200` |
| PUT | Yes | Always `200` |
| DELETE | Yes | `204` then `404` |
| POST | No | Creates new resource each time (`201`) |
| PATCH | Depends | Check API contract |
