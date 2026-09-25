import { useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { Badge } from "../components/Badge";

// Mantenemos las publicaciones iniciales de tu compañero
const initialPosts = [
  {
    id: 1,
    type: "EVENTO",
    title: "Feria de proyectos tecnológicos",
    description:
      "Una jornada para conocer proyectos, emprendimientos y nuevas ideas desarrolladas en nuestra comunidad.",
    tags: ["Tecnología", "Emprendimientos"],
    date: "24 SEP · 18:00",
    location: "Formosa Capital",
    recommended: true
  },
  {
    id: 2,
    type: "PUBLICACIÓN",
    title: "Taller de cerámica para principiantes",
    description:
      "Un espacio para aprender técnicas básicas de cerámica y conocer a otros artistas de la comunidad.",
    tags: ["Arte", "Cultura"],
    date: "26 SEP · 16:00",
    location: "Centro Cultural",
    recommended: false
  },
  {
    id: 3,
    type: "EVENTO",
    title: "Encuentro de desarrolladores",
    description:
      "Charlas y proyectos sobre desarrollo de software, tecnología y programación.",
    tags: ["Tecnología", "Educación"],
    date: "28 SEP · 19:00",
    location: "Polo Tecnológico",
    recommended: true
  }
];

function Dashboard() {
  const [posts, setPosts] = useState(initialPosts);

  // Tarea 2.2: Búsqueda y Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Tarea 2.1: Creación de Eventos / Publicaciones
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("EVENTO");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [newTags, setNewTags] = useState([]);

  // Tarea 2.3: Vista Detalle y Estados de Asistencia / Stand
  const [selectedPost, setSelectedPost] = useState(null);
  const [attendingPosts, setAttendingPosts] = useState({});
  const [standPosts, setStandPosts] = useState({});

  // --- Manejo del Tagger Dinámico (Tarea 2.1) ---
  const handleKeyDownTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const tagClean = tagInput.trim().replace(",", "");
      if (!newTags.includes(tagClean)) {
        setNewTags([...newTags, tagClean]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewTags(newTags.filter((t) => t !== tagToRemove));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newPostObj = {
      id: Date.now(),
      type: newType,
      title: newTitle,
      description: newDescription,
      tags: newTags,
      date: newDate || "Próximamente",
      location: newLocation || "Formosa",
      recommended: false
    };

    setPosts([newPostObj, ...posts]);

    // Limpieza
    setNewTitle("");
    setNewDescription("");
    setNewType("EVENTO");
    setNewLocation("");
    setNewDate("");
    setNewTags([]);
    setShowForm(false);
  };

  // --- Búsqueda y Filtros por Etiquetas (Tarea 2.2) ---
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // --- Asistencia y Stand (Tarea 2.3) ---
  const toggleAttendance = (postId) => {
    setAttendingPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleStand = (postId) => {
    setStandPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container" id="center">
        {/* Cabecera original de tu compañero */}
        <section className="dashboard-header">
          <p className="dashboard-eyebrow">FORMOSA · 24 SEP 2026</p>
          <h1>Descubrí algo nuevo.</h1>
          <p>Contenido seleccionado según tus intereses.</p>
        </section>

        {/* Separador temático usando las clases CSS de tu proyecto */}
        <div className="ticks" style={{ margin: "16px 0", width: "100%" }}></div>

        {/* ========================================================== */}
        {/* TAREA 2.1: Creador de Eventos y Publicaciones             */}
        {/* ========================================================== */}
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
              onSubmit={handleCreatePost}
              style={{
                background: "var(--social-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "20px",
                marginTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                boxShadow: "var(--shadow)"
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
                    fontWeight: "bold"
                  }}
                >
                  <option value="EVENTO">EVENTO</option>
                  <option value="PUBLICACIÓN">PUBLICACIÓN</option>
                </select>

                <input
                  type="text"
                  placeholder="Título del evento *"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "inherit"
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
                  minHeight: "70px"
                }}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Fecha (ej: 30 SEP · 18:00)"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "inherit"
                  }}
                />
                <input
                  type="text"
                  placeholder="Ubicación (ej: Centro Cultural)"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "inherit"
                  }}
                />
              </div>

              {/* Tagger Dinámico con estilo de variables CSS */}
              <div>
                <label style={{ fontSize: "14px", color: "var(--text-h)", display: "block", marginBottom: "6px" }}>
                  Etiquetas (Presiona Enter o Coma):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Tecnología, Arte, Formosa"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDownTag}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "inherit",
                    boxSizing: "border-box"
                  }}
                />
                <div style={{ marginTop: "10px" }}>
                  {newTags.map((tag) => (
                    <Badge key={tag} text={tag} onRemove={() => handleRemoveTag(tag)} />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="counter"
                style={{
                  marginBottom: 0,
                  marginTop: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: "var(--accent)",
                  color: "#fff"
                }}
              >
                Publicar Evento
              </button>
            </form>
          )}
        </section>

        {/* ========================================================== */}
        {/* TAREA 2.2: Buscador y Selección de Filtros por Etiquetas  */}
        {/* ========================================================== */}
        <section style={{ width: "100%", maxWidth: "680px" }}>
          <input
            type="text"
            placeholder="🔍 Buscar publicaciones por nombre o descripción..."
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
              boxSizing: "border-box"
            }}
          />

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
                fontSize: "13px"
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
                  fontSize: "13px"
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/* Feed Principal de Publicaciones                           */}
        {/* ========================================================== */}
        <section className="feed-section" style={{ width: "100%", maxWidth: "680px" }}>
          <div className="feed-title">
            <h2>Para vos</h2>
            <span>{filteredPosts.length} publicaciones</span>
          </div>

          <div className="feed">
            {filteredPosts.map((post) => (
              <div key={post.id} onClick={() => setSelectedPost(post)} style={{ cursor: "pointer" }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/* TAREA 2.3: Vista Detalle Tematizada (Modal)                */}
        {/* ========================================================== */}
        {selectedPost && (
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
              padding: "20px"
            }}
            onClick={() => setSelectedPost(null)}
          >
            <div
              style={{
                background: "var(--social-bg)",
                border: "1px solid var(--border)",
                color: "inherit",
                padding: "24px",
                borderRadius: "8px",
                maxWidth: "500px",
                width: "100%",
                boxShadow: "var(--shadow)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="counter" style={{ margin: 0, fontSize: "12px", padding: "2px 8px" }}>
                  {selectedPost.type}
                </span>
                <button
                  onClick={() => setSelectedPost(null)}
                  style={{ background: "none", border: "none", color: "inherit", fontSize: "1.2rem", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <h2 style={{ marginTop: "12px", marginBottom: "6px", color: "var(--text-h)" }}>{selectedPost.title}</h2>
              <p style={{ fontSize: "14px", color: "var(--accent)", marginBottom: "12px" }}>
                📍 {selectedPost.location} · 🗓️ {selectedPost.date}
              </p>

              <p style={{ lineHeight: "1.5", marginBottom: "16px" }}>{selectedPost.description}</p>

              <div style={{ marginBottom: "20px" }}>
                {selectedPost.tags?.map((tag) => (
                  <Badge key={tag} text={tag} />
                ))}
              </div>

              {/* Botones de Asistencia y Stand */}
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button
                  onClick={() => toggleAttendance(selectedPost.id)}
                  className="counter"
                  style={{
                    flex: 1,
                    margin: 0,
                    cursor: "pointer",
                    textAlign: "center",
                    background: attendingPosts[selectedPost.id] ? "var(--accent)" : "transparent",
                    color: attendingPosts[selectedPost.id] ? "#fff" : "var(--accent)"
                  }}
                >
                  {attendingPosts[selectedPost.id] ? "✓ Asistirá" : "Confirmar Asistencia"}
                </button>

                {selectedPost.type === "EVENTO" && (
                  <button
                    onClick={() => toggleStand(selectedPost.id)}
                    className="counter"
                    style={{
                      flex: 1,
                      margin: 0,
                      cursor: "pointer",
                      textAlign: "center",
                      background: standPosts[selectedPost.id] ? "var(--accent)" : "transparent",
                      color: standPosts[selectedPost.id] ? "#fff" : "var(--accent)"
                    }}
                  >
                    {standPosts[selectedPost.id] ? "✓ Stand Confirmado" : "Confirmación de Stand"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;