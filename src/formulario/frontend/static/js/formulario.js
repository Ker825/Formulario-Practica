import { validarContacto } from "./validaciones.js";
import { enviarContacto, obtenerContacto } from "./api.js";

const formulario = document.getElementById("formulario");
const btnEnviar = document.getElementById("btnEnviar");
const btnConsultar = document.getElementById("btnConsultar");
const errorEl = document.getElementById("error");

const modal = document.getElementById("modalContacto");
const btnCerrarModal = document.getElementById("btnCerrarModal");

let ultimoContactoId = null;

function mostrarError(mensaje) {
    errorEl.textContent = mensaje;
}

function limpiarError() {
    errorEl.textContent = "";
}

function obtenerPayload(formElement) {
    const formData = new FormData(formElement);
    const payload = {};

    for (const [clave, valor] of formData.entries()) {
        const limpio = valor.trim();
        payload[clave] = limpio === "" ? null : limpio;
    }
    return payload;
}

function renderizarModal(contacto) {
    document.getElementById("datoId").textContent = contacto.id;
    document.getElementById("datoNombre").textContent = contacto.nombre;
    document.getElementById("datoEmail").textContent = contacto.email ?? "No especificado";
    document.getElementById("datoSexo").textContent = contacto.sexo ?? "No especificado";
    document.getElementById("datoIntereses").textContent = contacto.intereses ?? "No especificado";
    document.getElementById("datoTelefono").textContent = contacto.telefono ?? "No especificado";
    document.getElementById("datoMensaje").textContent = contacto.mensaje ?? "Sin mensaje";

    if (!modal.open) {
        modal.showModal();
    }
}

async function cargarYMostrarContacto(id) {
    const contacto = await obtenerContacto(id);
    renderizarModal(contacto);
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    limpiarError();

    const payload = obtenerPayload(formulario);
    const mensajeError = validarContacto(payload);

    if (mensajeError) {
        mostrarError(mensajeError);
        return;
    }

    btnEnviar.disabled = true;

    try {
        const creado = await enviarContacto(payload);
        ultimoContactoId = creado.datos.id;
        await cargarYMostrarContacto(ultimoContactoId);
        formulario.reset();
    } catch (err) {
        mostrarError(err.message);
    } finally {
        btnEnviar.disabled = false;
    }
});

btnConsultar.addEventListener("click", async () => {
    limpiarError();

    if (ultimoContactoId === null) {
        mostrarError("Aun no hay ningun contacto registrado en esta sesion");
        return;
    }

    btnConsultar.disabled = true;

    try {
        await cargarYMostrarContacto(ultimoContactoId);
    } catch (err) {
        mostrarError(err.message);
    } finally {
        btnConsultar.disabled = false;
    }
});

btnCerrarModal.addEventListener("click", () => modal.close());

modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
        modal.close();
    }
});