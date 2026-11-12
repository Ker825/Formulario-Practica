const API_URL = "/api/contacto";
const TIMEOUT_MS = 8000;

async function request(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const respuesta = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        let data = null;
        try {
            data = await respuesta.json();
        } catch {
            data = null;
        }

        if (!respuesta.ok) {
            const mensaje = data?.detail || `Error HTTP ${respuesta.status}`;
            throw new Error(mensaje);
        }

        return data;
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error("Tiempo de espera agotado al conectar con el servidor");
        }
        if (err instanceof TypeError) {
            throw new Error("Sin conexion con el servidor");
        }
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

export function enviarContacto(payload) {
    return request(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export function obtenerContacto(id) {
    return request(`${API_URL}/${encodeURIComponent(id)}`, {
        method: "GET",
    });
}