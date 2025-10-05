# Expense Manager Backend

FastAPI + MongoDB backend for the Expense Manager application. It provides JWT authentication, role-based access control, expense submission with multi-step approvals, currency conversion, and optional OCR receipt parsing.

## Project structure

```
backend/
  app/
    core/          # configuration, security helpers
    db/            # MongoDB client and repositories
    dependencies/  # reusable dependency injections (auth, role guards)
    routers/       # FastAPI route modules
    schemas/       # Pydantic models for requests & responses
    services/      # Business logic (auth, users, expenses, etc.)
    utils/         # Shared helpers (ObjectId conversion, serializers)
    main.py        # FastAPI application entrypoint
  tests/
    test_health.py
  requirements.txt
  README.md
  .env.example
```

## Environment variables

Copy `.env.example` to `.env` and adjust the values:

- `MONGO_URI`: MongoDB connection string.
- `MONGO_DB_NAME`: Database name (defaults to `expense_manager`).
- `JWT_SECRET_KEY`: Random secret used for signing JWTs.
- `JWT_ALGORITHM`: Algorithms (defaults to `HS256`).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Access token TTL.
- `RESTCOUNTRIES_URL`: Country metadata service.
- `CURRENCY_API_BASE_URL`: Exchange rate API root.
- `CURRENCY_CACHE_TTL_MINUTES`: Cache lifetime for exchange rates (minutes).
- `CORS_ALLOW_ORIGINS`: Comma-separated list of allowed origins for the frontend.

## Running locally

1. Create and activate a virtualenv (Python 3.11+).
2. Change into the backend folder:

```powershell
cd backend
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Run the API (reload enabled):

```powershell
uvicorn app.main:app --reload --port 8000
```

5. API docs will be available at `http://localhost:8000/docs`.

  > **Heads-up:** The server must be started from the `backend` directory so Python can resolve the internal `app.*` imports.

## Testing

Run the pytest suite:

```powershell
pytest
```

## Key endpoints

- `POST /api/auth/signup` – bootstrap company + admin user.
- `POST /api/auth/login` – login to receive JWT.
- `GET /api/auth/me` – current authenticated user.
- `GET /api/users` – admin-only list of users.
- `POST /api/users` – admin creates users (employees/managers).
- `POST /api/expenses` – employees submit expense claims.
- `GET /api/expenses/mine` – employee history.
- `GET /api/expenses/pending` – manager/admin approvals queue.
- `POST /api/expenses/{id}/approval` – approve/reject.
- `GET /api/approval-rules` – manage approval workflows.
- `GET /api/companies/me` – company profile (currency, country).
- `POST /api/ocr/extract` – optional OCR endpoint (requires Tesseract).

## Notes

- MongoDB collections are created automatically on first write.
- OCR requires the `tesseract` binary to be installed on the host; if missing, the API returns HTTP 503.
- Currency conversion is cached in-memory to limit external API calls; adjust TTL via configuration as needed.
- Approval workflows support sequential, percentage, specific approver, and hybrid rules.
