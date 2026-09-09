# Highland Destinations Backend

Production-oriented NestJS and MongoDB backend for Highland Destinations.

## Runtime

- Node.js `24.19.0` (Node 24 LTS line)
- npm `11.x`
- MongoDB running locally or supplied by a managed development environment

Docker is intentionally not part of this repository. Install MongoDB locally, or set
`MONGODB_URI` to a development cluster. The application fails fast when the required URI is
missing.

## Local setup

```text
npm install
Copy-Item .env.example .env
npm run start:dev
```

The API listens on `http://localhost:3000` by default.

Operational endpoints:

- `GET /api/v1/health` checks application dependencies.
- `GET /api/v1/health/live` checks process liveness without requiring MongoDB.
- `GET /api/v1/health/ready` checks readiness, including MongoDB connectivity.
- `GET /api/v1/status` is the versioned operational placeholder route.
- `GET /` returns the service status.
- `POST /api/v1/contact-inquiries` stores contact details and requirements in MongoDB.

Example request body:

```json
{
  "name": "Alex Highland",
  "mobileNumber": "+919876543210",
  "email": "alex@example.com",
  "requirements": "Looking for a 5-day family tour",
  "message": "Please share available dates and pricing."
}
```

## Quality checks

```text
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run security:audit
```

Testing infrastructure is intentionally not installed yet. Route registration functions and
service functions are ready for a future unit, integration, and E2E test framework.

## Vercel deployment

Vercel discovers the serverless entrypoint at `api/index.ts`. Deploy the repository root as a
Node.js project without overriding the detected build settings. The function preserves the API
paths, so the versioned production routes are available under `/api/v1`, including
`/api/v1/health/live` and `/api/v1/status`.

Configure these environment variables in the Vercel project for every environment that will run
the function:

- `MONGODB_URI` (required; use a rotated credential and a MongoDB deployment that allows Vercel)
- `CORS_ORIGINS` (comma-separated origins, without trailing slashes)
- `NODE_ENV=production`
- `LOG_LEVEL=info`
- `MONGODB_MAX_POOL_SIZE`, `MONGODB_MIN_POOL_SIZE`, `MONGODB_SERVER_SELECTION_TIMEOUT_MS`,
  `MONGODB_CONNECT_TIMEOUT_MS`, `MONGODB_SOCKET_TIMEOUT_MS`, `RATE_LIMIT_TTL_MS`, and
  `RATE_LIMIT_MAX` as needed

Do not upload `.env` or commit database credentials. After deployment, verify the live and ready
health routes and inspect Vercel function logs if initialization fails.

## Architecture

The application is a small NestJS service. Controllers handle HTTP concerns, injectable services
coordinate use cases, and feature modules own Mongoose schemas. The current foundation contains
configuration, MongoDB lifecycle management, health checks, security defaults, request correlation,
structured Pino logging, and global error handling.

Authentication provider, authorization model, deployment platform, and observability vendors remain
deliberately deferred until their requirements are known.
