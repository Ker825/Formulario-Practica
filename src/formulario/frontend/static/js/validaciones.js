const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\d{10}$/;

export function validarContacto(payload) {
    if (!payload.nombre || payload.nombre.trim() === "") {
        return "Escribe tu nombre";
    }
    if (payload.email && !EMAIL_REGEX.test(payload.email)) {
        return "El formato del correo electronico no es valido";
    }
    if (payload.telefono && !TELEFONO_REGEX.test(payload.telefono)) {
        return "El telefono debe contener exactamente 10 digitos numericos";
    }
    return "";
}