import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { Badge } from "../components/Badge";
import { useAuth } from "../context/AuthContext";
import {
  getPosts,
  getEvents,
  createPost,
  createEvent,
  attendEvent,
  cancelAttendance,
  getEventAttendees,
  search,
} from "../services/api";

function Dashboard() {
  const { usuario } = useAuth();

  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Búsqueda (contra el backend) y Filtro por etiqueta (local)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = sin busqueda activa
  const [searching, setSearching] = useState(false);

  // Formulario de Creación
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("EVENTO");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState(""); // datetime-local para eventos
  const [newImageFile, setNewImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Vista Detalle (unifica posts y eventos con "kind")
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalAttendees, setModalAttendees] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [standNameInput, setStandNameInput] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [postsData, eventsData] = await Promise.all([getPosts(), getEvents()]);
      setPosts(postsData);
      setEvents(eventsData);
    } catch (err) {
      setError(err.message || "Error al obtener el contenido.");
    } finally {
      setLoading(false);
    }
  };

  // Busqueda contra el backend (posts + eventos + personas), con debounce
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await search({ q: term, type: "all" });
        setSearchResults(data);
      } catch (err) {
        console.error(err);
        setSearchResults({ posts: [], events: [], users: [] });
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setNewImageFile(file);
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewType("EVENTO");
    setNewLocation("");
    setNewDate("");
    setNewImageFile(null);
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    if (!usuario) {
      alert("Debes iniciar sesión para crear publicaciones o eventos.");
      return;
    }

    setSubmitting(true);
    try {
      if (newType === "EVENTO") {
        if (!newLocation.trim() || !newDate) {
          alert("Para un evento, completá la fecha y la ubicación.");
          setSubmitting(false);
          return;
        }

        const eventPayload = {
          userId: usuario.id,
          title: newTitle,
          description: newDescription,
          location: newLocation,
          eventDate: new Date(newDate).toISOString(),
        };

        const created = await createEvent(eventPayload);
        setEvents([created, ...events]);
      } else {
        const postPayload = {
          userId: usuario.id,
          title: newTitle,
          content: newDescription,
        };
        if (newImageFile) postPayload.image = newImageFile;

        const created = await createPost(postPayload);
        setPosts([created, ...posts]);
      }

      resetForm();
    } catch (err) {
      alert(err.message || "Error al crear la publicación.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Feed combinado (posts + eventos) ----------
  const feedItems = [...posts, ...events]
    .map((item) => ({ ...item, kind: item.eventDate ? "event" : "post" }))
    .sort((a, b) => {
      const dateA = new Date(a.kind === "event" ? a.eventDate : a.createdAt);
      const dateB = new Date(b.kind === "event" ? b.eventDate : b.createdAt);
      return dateB - dateA;
    });

  const allTags = Array.from(
    new Set(
      feedItems.flatMap((item) => (item.tags || []).map((t) => (typeof t === "string" ? t : t.name)))
    )
  );

  const filteredFeed = feedItems.filter((item) => {
    if (!selectedTag) return true;
    const tagNames = (item.tags || []).map((t) => (typeof t === "string" ? t : t.name));
    return tagNames.includes(selectedTag);
  });

  // Mapea un item del feed a las props que espera PostCard
  const toCardData = (item) =>
    item.kind === "event"
      ? { ...item, content: item.description, author: item.organizer, createdAt: item.eventDate }
      : item;

  // ---------- Modal "Ver más" ----------
  const loadModalAttendees = useCallback(async () => {
    if (!selectedItem || selectedItem.kind !== "event") return;
    try {
      const data = await getEventAttendees(selectedItem.id);
      setModalAttendees(data);
    } catch (err) {
      console.error(err);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (selectedItem?.kind === "event") {
      loadModalAttendees();
    } else {
      setModalAttendees([]);
    }
    setStandNameInput("");
  }, [selectedItem, loadModalAttendees]);

  const miAsistencia = usuario
    ? modalAttendees.find((a) => a.userId === usuario.id)
    : null;

  const handleToggleAttend = async () => {
    if (!usuario) {
      alert("Tenés que iniciar sesión para confirmar tu asistencia.");
      return;
    }
    setModalLoading(true);
    try {
      if (miAsistencia) {
        await cancelAttendance(selectedItem.id, usuario.id);
      } else {
        await attendEvent(selectedItem.id, { userId: usuario.id });
      }
      await loadModalAttendees();
    } catch (err) {
      alert(err.message || "Error al confirmar la asistencia");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStand = async () => {
    if (!usuario) {
      alert("Tenés que iniciar sesión para confirmar tu stand.");
      return;
    }
    setModalLoading(true);
    try {
      if (miAsistencia?.standName) {
        await cancelAttendance(selectedItem.id, usuario.id);
      } else {
        await attendEvent(selectedItem.id, {
          userId: usuario.id,
          standName: standNameInput || "Mi stand",
        });
      }
      await loadModalAttendees();
    } catch (err) {
      alert(err.message || "Error al confirmar el stand");
    } finally {
      setModalLoading(false);
    }
  };

  const hasActiveSearch = searchTerm.trim().length > 0;

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container" id="center">
        <section className="dashboard-header">
          <p className="dashboard-eyebrow">FORMOSA · 25 SEP 2026</p>
          <h1>Descubrí algo nuevo.</h1>
          <p>Contenido seleccionado según tus intereses.</p>
        </section>

        <div className="ticks" style={{ margin: "16px 0", width: "100%" }}></div>

        {/* Creador de publicaciones */}
        <section style={{ width: "100%", maxWidth: "680px" }}>
          <button
            className="counter"
            onClick={() => setShowForm(!showForm)}
            style={{ cursor: "pointer", width: "100%", textAlign: "center", fontWeight: "bold" }}
          >
            {showForm ? "✕ Cancelar creación" : "+ Crear Publicación o Evento"}
          </button>

          {showForm && (
            <form
              onSubmit={handleCreate}
              style={{
                background: "var(--social-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "20px",
                marginTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                boxShadow: "var(--shadow)",
              }}
            >
              <h3 style={{ color: "var(--text-h)", margin: 0 }}>Nueva Publicación / Evento</h3>

              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                    fontWeight: "bold",
                  }}
                >
                  <option value="EVENTO">EVENTO</option>
                  <option value="PUBLICACIÓN">PUBLICACIÓN</option>
                </select>

                <input
                  type="text"
                  placeholder="Título *"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "inherit",
                  }}
                />
              </div>

              <textarea
                placeholder="Descripción detallada..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "inherit",
                  minHeight: "70px",
                }}
              />

              {newType === "EVENTO" ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "inherit",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Ubicación (ej: Centro Cultural)"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "inherit",
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: "14px", color: "var(--text-h)", display: "block", marginBottom: "6px" }}>
                    Foto (opcional):
                  </label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {newImageFile && (
                    <p style={{ fontSize: "13px", color: "var(--accent)", marginTop: "6px" }}>
                      {newImageFile.name}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="counter"
                disabled={submitting}
                style={{
                  marginBottom: 0,
                  marginTop: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: "var(--accent)",
                  color: "#fff",
                }}
              >
                {submitting ? "Publicando..." : newType === "EVENTO" ? "Publicar Evento" : "Publicar"}
              </button>
            </form>
          )}
        </section>

        {/* Buscador y Filtros */}
        <section style={{ width: "100%", maxWidth: "680px" }}>
          <input
            type="text"
            placeholder="Buscar publicaciones, eventos o personas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--social-bg)",
              color: "inherit",
              fontSize: "15px",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />

          {!hasActiveSearch && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "var(--text-h)", marginRight: "4px" }}>Filtros:</span>
              <button
                onClick={() => setSelectedTag("")}
                style={{
                  padding: "4px 12px",
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  background: selectedTag === "" ? "var(--accent-bg)" : "transparent",
                  color: selectedTag === "" ? "var(--accent)" : "inherit",
                  borderColor: selectedTag === "" ? "var(--accent-border)" : "var(--border)",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Todas
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    background: selectedTag === tag ? "var(--accent-bg)" : "transparent",
                    color: selectedTag === tag ? "var(--accent)" : "inherit",
                    borderColor: selectedTag === tag ? "var(--accent-border)" : "var(--border)",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Resultados de búsqueda (backend: posts + eventos + personas) */}
        {hasActiveSearch ? (
          <section className="feed-section" style={{ width: "100%", maxWidth: "680px" }}>
            <div className="feed-title">
              <h2>Resultados para "{searchTerm}"</h2>
            </div>

            {searching ? (
              <p>Buscando...</p>
            ) : (
              <>
                {/* Personas */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "16px", color: "var(--text-h)" }}>
                    Personas y emprendimientos ({searchResults?.users?.length || 0})
                  </h3>
                  {!searchResults?.users?.length ? (
                    <p style={{ color: "#888", fontSize: "0.9rem" }}>No se encontraron personas.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {searchResults.users.map((u) => (
                        <div
                          key={u.id}
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong>{u.username}</strong>
                            <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--accent)" }}>
                              {u.type}
                            </span>
                            {u.description && (
                              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#aaa" }}>
                                {u.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Eventos */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "16px", color: "var(--text-h)" }}>
                    Eventos ({searchResults?.events?.length || 0})
                  </h3>
                  {!searchResults?.events?.length ? (
                    <p style={{ color: "#888", fontSize: "0.9rem" }}>No se encontraron eventos.</p>
                  ) : (
                    <div className="feed">
                      {searchResults.events.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedItem({ ...ev, kind: "event" })}
                          style={{ cursor: "pointer" }}
                        >
                          <PostCard post={toCardData({ ...ev, kind: "event" })} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Publicaciones */}
                <div>
                  <h3 style={{ fontSize: "16px", color: "var(--text-h)" }}>
                    Publicaciones ({searchResults?.posts?.length || 0})
                  </h3>
                  {!searchResults?.posts?.length ? (
                    <p style={{ color: "#888", fontSize: "0.9rem" }}>No se encontraron publicaciones.</p>
                  ) : (
                    <div className="feed">
                      {searchResults.posts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedItem({ ...p, kind: "post" })}
                          style={{ cursor: "pointer" }}
                        >
                          <PostCard post={toCardData({ ...p, kind: "post" })} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        ) : (
          /* Feed Principal (sin búsqueda activa) */
          <section className="feed-section" style={{ width: "100%", maxWidth: "680px" }}>
            <div className="feed-title">
              <h2>Para vos</h2>
              <span>{filteredFeed.length} publicaciones</span>
            </div>

            {loading ? (
              <p>Cargando publicaciones...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <div className="feed">
                {filteredFeed.map((item) => (
                  <div
                    key={`${item.kind}-${item.id}`}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <PostCard post={toCardData(item)} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Modal de Detalle */}
        {selectedItem && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setSelectedItem(null)}
          >
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid var(--border)",
                color: "inherit",
                padding: "24px",
                borderRadius: "8px",
                maxWidth: "500px",
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                boxShadow: "var(--shadow)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="counter" style={{ margin: 0, fontSize: "12px", padding: "2px 8px" }}>
                  {selectedItem.kind === "event" ? "EVENTO" : "PUBLICACIÓN"}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{ background: "none", border: "none", color: "inherit", fontSize: "1.2rem", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              {selectedItem.image && (
                <img
                  src={
                    selectedItem.image.startsWith("http")
                      ? selectedItem.image
                      : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "")}${selectedItem.image}`
                  }
                  alt={selectedItem.title}
                  style={{ width: "100%", maxHeight: "220px", objectFit: "cover", borderRadius: "8px", marginTop: "12px" }}
                />
              )}

              <h2 style={{ marginTop: "12px", marginBottom: "6px", color: "var(--text-h)" }}>
                {selectedItem.title}
              </h2>

              {selectedItem.kind === "event" ? (
                <p style={{ fontSize: "14px", color: "var(--accent)", marginBottom: "12px" }}>
                   {selectedItem.location || "Sin ubicación"} · {" "}
                  {selectedItem.eventDate
                    ? new Date(selectedItem.eventDate).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" })
                    : "Sin fecha"}
                  {selectedItem.organizer?.username && ` ·  ${selectedItem.organizer.username}`}
                </p>
              ) : (
                selectedItem.author?.username && (
                  <p style={{ fontSize: "14px", color: "var(--accent)", marginBottom: "12px" }}>
                     {selectedItem.author.username}
                    {selectedItem.createdAt &&
                      ` · ${new Date(selectedItem.createdAt).toLocaleDateString("es-AR")}`}
                  </p>
                )
              )}

              <p style={{ lineHeight: "1.5", marginBottom: "16px" }}>
                {selectedItem.content || selectedItem.description}
              </p>

              <div style={{ marginBottom: "20px" }}>
                {(selectedItem.tags || []).map((tag) => (
                  <Badge
                    key={typeof tag === "string" ? tag : tag.id}
                    text={typeof tag === "string" ? tag : tag.name}
                  />
                ))}
              </div>

              {/* Acciones de asistencia solo para eventos */}
              {selectedItem.kind === "event" && (
                <>
                  <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
                    <button
                      onClick={handleToggleAttend}
                      disabled={modalLoading}
                      className="counter"
                      style={{
                        flex: 1,
                        margin: 0,
                        cursor: "pointer",
                        textAlign: "center",
                        background: miAsistencia ? "var(--accent)" : "transparent",
                        color: miAsistencia ? "#fff" : "var(--accent)",
                      }}
                    >
                      {miAsistencia ? "✓ Asistirás" : "Confirmar Asistencia"}
                    </button>

                    <button
                      onClick={handleToggleStand}
                      disabled={modalLoading}
                      className="counter"
                      style={{
                        flex: 1,
                        margin: 0,
                        cursor: "pointer",
                        textAlign: "center",
                        background: miAsistencia?.standName ? "var(--accent)" : "transparent",
                        color: miAsistencia?.standName ? "#fff" : "var(--accent)",
                      }}
                    >
                      {miAsistencia?.standName ? "✓ Stand Confirmado" : "Confirmación de Stand"}
                    </button>
                  </div>

                  {!miAsistencia?.standName && (
                    <input
                      type="text"
                      placeholder="Nombre del stand (opcional)"
                      value={standNameInput}
                      onChange={(e) => setStandNameInput(e.target.value)}
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--border)",
                        background: "transparent",
                        color: "inherit",
                        boxSizing: "border-box",
                      }}
                    />
                  )}

                  <div style={{ marginTop: "18px" }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>Asistentes confirmados ({modalAttendees.length})</h4>
                    {modalAttendees.length === 0 ? (
                      <p style={{ color: "#888", fontSize: "0.9rem" }}>Todavía nadie confirmó asistencia.</p>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {modalAttendees.map((a) => (
                          <li
                            key={a.id}
                            style={{ fontSize: "0.9rem", borderBottom: "1px solid var(--border)", padding: "4px 0" }}
                          >
                            {a.User?.username || "Usuario"}
                            {a.standName ? ` —  ${a.standName}` : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;