from fastapi import FastAPI
from dotenv import load_dotenv
from routes.download_routes import router as download_router

load_dotenv()

app = FastAPI()

# Registrar as rotas de download
app.include_router(download_router)

@app.get("/")
async def read_root():
    return {"health": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
