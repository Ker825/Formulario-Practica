from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class ContactoCreate(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    email: EmailStr | None = None
    sexo: Literal["hombre", "mujer", "no_especificado"] | None = None
    intereses: str | None = None
    telefono: str | None = Field(default=None, pattern=r"^\d{10}$")
    mensaje: str | None = Field(default=None, max_length=1000)


class ContactoRead(ContactoCreate):
    id: int


class ContactoResponse(BaseModel):
    mensaje: str
    datos: ContactoRead
