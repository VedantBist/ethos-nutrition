# Ethos Nutrition

Ethos Nutrition is a meal planning and nutrition tracking application with a React/Vite client and a Spring Boot REST API. The established visual interface remains intact; the API provides authenticated persistence, server-side macro calculations, planning, logging, and user targets.

## Project layout

```text
src/                    React + TypeScript client
backend/                Java 21 / Spring Boot API
backend/src/main/...    Controllers, services, JPA entities, security
```

## Run the frontend

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` (or `3001` if the first port is busy). In development, `/api` is proxied to Spring Boot on port `8080`, so both Vite ports use the same database-backed catalog. Set `VITE_API_BASE_URL` in a local `.env` file only when the API is hosted elsewhere. Without a running API, the existing guest flow and local browser data remain available.

## Run the backend

Create (or allow the local development URL to create) a MySQL database named `ethos_nutrition`, then configure environment variables (see `.env.example`):

```bash
export DB_URL='jdbc:mysql://localhost:3306/ethos_nutrition?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
export DB_USERNAME='root'
export DB_PASSWORD='your-password'
export JWT_SECRET='a-long-random-secret-with-at-least-32-characters'
export FRONTEND_ORIGIN='http://localhost:3000'
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080/api`. It uses MySQL and Hibernate's non-destructive `update` schema mode; it never uses `create` or `create-drop`.

## Indian food database

On startup, the API additively imports the versioned [`indian-foods.json`](backend/src/main/resources/data/indian-foods.json) catalog. Existing foods, users, meals, and logs are never deleted or replaced. Records are idempotent through their source-specific `externalId`.

- 542 raw ingredients from ICMR-NIN's Indian Food Composition Tables (IFCT 2017)
- 1,014 prepared Indian recipes from the Indian Nutrient Databank (INDB 2024)
- 1,556 source-backed foods, 2,570 food-specific serving definitions, and 8,151 aliases

Food responses retain the existing macro fields and additionally include structured category, dietary type, cuisine, raw/prepared state, basis, aliases, and servings. Use `GET /api/foods?query=dahi&category=DAIRY` for server-side alias search and category filtering. Nutrient provenance is stored for auditing but is deliberately not promoted in the standard library UI.

IFCT is the primary source for raw foods. INDB provides recipe values per 100 g and documented servings for prepared foods. The seed catalog does not label every value as IFCT, and unavailable micronutrients remain `null`, never zero-filled.

## API overview

Public endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/foods?query=&category=`
- `GET /api/foods/{id}`

Authenticated endpoints require `Authorization: Bearer <token>`:

- `GET /api/auth/me`, `GET|PUT /api/profile`
- `POST|PUT|DELETE /api/foods/{id}`
- `GET|POST /api/meals`, `GET|PUT|DELETE /api/meals/{id}`
- `GET /api/plans/week?start=YYYY-MM-DD`
- `POST|PUT|DELETE /api/planned-meals`
- `POST /api/food-logs`
- `GET /api/nutrition/daily?date=YYYY-MM-DD`

Meal and food-log nutrition is calculated by the backend from food values per 100g, using `BigDecimal` rather than floating-point arithmetic. API failures use a consistent JSON error shape with `timestamp`, `status`, `error`, `message`, and `path`.

## Verification

```bash
npm run lint
npm run build
cd backend && mvn test
```

## Security notes

Passwords are BCrypt-hashed, never returned from the API, and authentication is stateless JWT-based. Keep `.env` files and production credentials out of version control. CORS explicitly allows the local Vite origins (`localhost`/`127.0.0.1` on ports 3000 and 3001) plus `FRONTEND_ORIGIN`; credentials are disabled.
