from formulario.backend.schemas.contacto import ContactoCreate


def validar_contacto(contacto: ContactoCreate) -> None:
    if contacto.telefono and not contacto.telefono.isdigit():
        raise ValueError("El teléfono debe contener solo dígitos.")
    if contacto.nombre.isspace() or not contacto.nombre:
        raise ValueError("El nombre no puede estar vacío o contener solo espacios.")
    if contacto.intereses and len(contacto.intereses) > 200:
        raise ValueError("Los intereses no pueden superar los 200 caracteres.")
    if contacto.mensaje and len(contacto.mensaje) > 1000:
        raise ValueError("El mensaje no puede superar los 1000 caracteres.")
    if contacto.sexo and contacto.sexo not in ["hombre", "mujer", "no_especificado"]:
        raise ValueError("El sexo debe ser 'hombre', 'mujer' o 'no_especificado'.")
