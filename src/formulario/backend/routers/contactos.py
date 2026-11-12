from fastapi import APIRouter, HTTPException, Path, status

from formulario.backend.schemas.contacto import (
    ContactoCreate,
    ContactoRead,
    ContactoResponse,
)

router = APIRouter(
    prefix="/api/contacto",
    tags=["Contactos"],
)

_contactos_db: dict[int, ContactoRead] = {}
_ultimo_id: int = 0


@router.post("", response_model=ContactoResponse, status_code=status.HTTP_201_CREATED)
def crear_contacto(contacto: ContactoCreate) -> ContactoResponse:
    global _ultimo_id
    _ultimo_id += 1
    registro = ContactoRead(id=_ultimo_id, **contacto.model_dump())
    _contactos_db[_ultimo_id] = registro

    return ContactoResponse(
        mensaje="Registro recibido",
        datos=registro,
    )


@router.get("/{contacto_id}", response_model=ContactoRead)
def obtener_contacto(
    contacto_id: int = Path(..., ge=1, description="ID del contacto"),
) -> ContactoRead:
    registro = _contactos_db.get(contacto_id)
    if registro is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contacto #{contacto_id} no encontrado",
        )
    return registro
