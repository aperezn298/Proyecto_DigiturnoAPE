from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
from .routers import wedscraping
from pathlib import Path
import uvicorn

env_path = Path('..') / '.env'

# Cargar las variables de entorno
load_dotenv(dotenv_path=env_path)

# Obtén la API key del entorno
API_KEY = os.getenv("API_KEY")
app = FastAPI()
app.title = "Backend API"

# Middleware personalizado para validar la API key
# @app.middleware("http")
# async def apikey_middleware(request: Request, call_next):
#     api_key = request.headers.get("x-api-key")
#     if api_key != API_KEY:
#         return JSONResponse(
#             status_code=401,
#             content={"error": "Unauthorized - Invalid API Key"},
#         )
#     return await call_next(request)

# Incluye el router para webscraping
app.include_router(wedscraping.router)

@app.get("/")
def Home():
    return {
        "message": "Welcome to Backend API",
        "status": "Healthy",
        "version": "1.0.0"
    }

# Asegúrate de que la aplicación escuche en el puerto dinámico proporcionado por Render
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # Usa el puerto proporcionado por Render o 8000 como predeterminado
    uvicorn.run(app, host="0.0.0.0", port=port)
