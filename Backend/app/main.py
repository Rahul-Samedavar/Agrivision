import secrets
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import router as api_router
from app.config import settings

app = FastAPI(title="AgriVision API")


@app.middleware("http")
async def check_bearer_token(request, call_next):
    if not settings.BEARER_TOKEN:
        return JSONResponse(
            status_code=500,
            content={"detail": "BEARER_TOKEN is not configured on the server"},
        )

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"detail": "Missing or invalid Authorization header"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    provided_token = auth_header[len("Bearer "):].strip()
    if not secrets.compare_digest(provided_token, settings.BEARER_TOKEN):
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid bearer token"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    return await call_next(request)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriVision API"}
