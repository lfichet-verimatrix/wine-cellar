markdown
---
inclusion: fileMatch
fileMatchPattern: "src/**/*|server/**/*|**/*.controller.js|**/*.service.js|**/*.route.js|**/*.middleware.js"
---

# Backend Development Standards — Node.js / Express

## Project Structure
- Standard layout: `src/routes/`, `src/controllers/`, `src/services/`, `src/repositories/` (or `models/` if using an ORM directly), `src/middlewares/`, `src/utils/`, `src/config/`.
- One router file per resource (`users.routes.js`, `orders.routes.js`), mounted in a central `src/routes/index.js`.
- Controllers stay thin — parse `req`, call a service, send `res`. No `await db.query(...)` inside a controller.
- Use `express.Router()` per resource instead of attaching routes directly to the app instance.

## Setup & Middleware Order
- Standard middleware stack, in this order: `helmet()` → CORS → body parser (`express.json()`) → request logger (`morgan` or `pino-http`) → rate limiter (on public/auth routes) → routes → 404 handler → centralized error handler (must be last, 4 args: `(err, req, res, next)`).
- Use `express-async-errors` (or manually wrap) so `async` route handlers that throw are automatically passed to the error middleware — never leave a bare unhandled promise in a route.

## Routing & Controllers
```js
// users.routes.js
router.get('/:id', authenticate, validate(getUserSchema), userController.getById);
```
- Validation middleware runs before the controller, using **Zod** or **express-validator** schemas defined per-route in a `*.schema.js` file next to the route.
- Route params/query/body are validated — never trust `req.params.id` as a number without parsing/validating it.

## Services & Business Logic
- Services are plain functions/classes, no Express types (`req`/`res`) ever passed in — keeps them unit-testable without mocking HTTP.
- Services throw typed errors (`AppError`, `NotFoundError`, `ValidationError` — extend a base `AppError` with a `statusCode`), never `res.status(...)` directly.

## Error Handling
- Centralized error middleware maps error types to responses:
```js
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  logger.error({ err, reqId: req.id }, err.message);
  res.status(status).json({
    error: { code: err.code || 'INTERNAL_ERROR', message: status < 500 ? err.message : 'Something went wrong' }
  });
});
```
- Never leak stack traces or raw DB errors to the client in production.
- Use `pino` or `winston` for structured logging, not `console.log`.

## Database Layer
- If using **Prisma**: schema changes only via `prisma migrate dev` / `migrate deploy`, never manual SQL against prod.
- If using **Sequelize/TypeORM**: repositories wrap all queries; no raw model calls scattered in services.
- Wrap multi-step writes in a transaction (`prisma.$transaction`, `sequelize.transaction`, etc.).
- Add `.select()`/field projection to avoid over-fetching; paginate with `take`/`skip` or cursor-based pagination on list endpoints.

## Auth
- JWT-based auth via an `authenticate` middleware that verifies the token and attaches `req.user`.
- Role/permission checks live in a separate `authorize(role)` middleware, composed after `authenticate`.
- Hash passwords with `bcrypt` (cost factor ≥ 10); never store or log plaintext passwords or tokens.
- Store secrets (`JWT_SECRET`, DB creds) in `.env`, loaded via `dotenv`, never committed.

## Testing
- Unit test services with `jest` + mocked repositories.
- Integration test routes with `supertest` against a test DB (or `jest` + an in-memory/test container DB) — hit the real Express app, not mocked controllers.
- Every new endpoint requires: one happy-path integration test, one validation-failure test, one auth-failure test (if protected).

## Performance & Conventions
- Use `async/await` everywhere — no mixing callbacks and promises.
- Avoid N+1 queries — use `include`/`with`/eager loading for related data.
- Environment-specific config lives in `src/config/`, selected via `NODE_ENV` — no `if (env === 'prod')` scattered through business logic.
- Lint with ESLint (Airbnb or Standard config) + Prettier; enforce via a pre-commit hook (`husky` + `lint-staged`).
- Always use try/catch blocks for error handling
- Folow RESTFUL conventions
- validate all inputs
- return consistent response formats: {success: boolean, data? : any, error?: string}
