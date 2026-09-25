const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper genérico con inclusión automática de Token JWT
async function request(path, options = {}) {
    const token = localStorage.getItem("token");
    const isFormData = options.body instanceof FormData;

    const headers = {
        // Si es FormData, NO seteamos Content-Type: el browser pone el boundary correcto solo
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Error ${res.status}`);
    }

    return res.json();
}

// Convierte un objeto plano (con posible File en "image") a FormData
function toFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "tagIds" && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, value);
        }
    });
    return formData;
}

// ---------- Publicaciones ----------
export const getPosts = () => request("/posts");
export const getPostById = (id) => request(`/posts/${id}`);

// data puede incluir "image" como File (input type="file") -> se manda como multipart
export const createPost = (data) =>
    request("/posts", { method: "POST", body: toFormData(data) });
export const updatePost = (id, data) =>
    request(`/posts/${id}`, { method: "PUT", body: toFormData(data) });
export const deletePost = (id) =>
    request(`/posts/${id}`, { method: "DELETE" });

// ---------- Eventos ----------
export const getEvents = () => request("/events");
export const getEventById = (id) => request(`/events/${id}`);
export const createEvent = (data) =>
    request("/events", { method: "POST", body: JSON.stringify(data) });
export const attendEvent = (id, data) =>
    request(`/events/${id}/attend`, { method: "POST", body: JSON.stringify(data) });
export const cancelAttendance = (id, userId) =>
    request(`/events/${id}/attend`, { method: "DELETE", body: JSON.stringify({ userId }) });
export const getEventAttendees = (id) => request(`/events/${id}/attendees`);

// ---------- Autenticación ----------
export const registerUser = (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const loginUser = (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const getProfile = () => request("/auth/me");

// ---------- Buscador ----------
export const search = (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/search?${query}`);
};