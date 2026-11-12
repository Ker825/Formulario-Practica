from pathlib import Path

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from formulario.backend.routers import contactos

BASE_DIR = Path(__file__).resolve().parent.parent
print(f"BASE_DIR: {BASE_DIR}")
templates = Jinja2Templates(directory=BASE_DIR / "frontend" / "static" / "templates")


def create_app() -> FastAPI:
    app = FastAPI(title="Formulario API", version="1.0.0")

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        errores = [f"{err['loc'][-1]}: {err['msg']}" for err in exc.errors()]
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": " | ".join(errores)},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Error interno del servidor"},
        )

    app.mount(
        "/static",
        StaticFiles(directory=BASE_DIR / "frontend" / "static"),
        name="static",
    )
    app.include_router(contactos.router)

    @app.get("/", response_class=HTMLResponse)
    def vista_formulario(request: Request):
        return templates.TemplateResponse(request=request, name="formulario.html")

    return app


app = create_app()
