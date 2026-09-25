import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const API_URL = "http://localhost:3000/api";

function Dashboard() {
  const [contenidos, setContenidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarContenido() {
      try {
        const [respuestaPosts, respuestaEventos] = await Promise.all([
          fetch(`${API_URL}/posts`),
          fetch(`${API_URL}/events`)
        ]);

        if (!respuestaPosts.ok || !respuestaEventos.ok) {
          throw new Error("No se pudo cargar el contenido");
        }

        const posts = await respuestaPosts.json();
        const eventos = await respuestaEventos.json();

        const postsFormateados = posts.map((post) => ({
          id: `post-${post.id}`,
          type: "PUBLICACIÓN",
          title: post.title,
          description: post.content,
          tags: post.tags.map((tag) => tag.name),
          date: new Date(post.createdAt).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short"
          }).toUpperCase(),
          location: "Comunidad TAGMA",
          recommended: false
        }));

        const eventosFormateados = eventos.map((evento) => ({
          id: `evento-${evento.id}`,
          type: "EVENTO",
          title: evento.title,
          description: evento.description,
          tags: evento.tags.map((tag) => tag.name),
          date: new Date(evento.eventDate).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short"
          }).toUpperCase(),
          location: evento.location,
          recommended: true
        }));

        const contenido = [
          ...eventosFormateados,
          ...postsFormateados
        ];

        setContenidos(contenido);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el contenido.");
      } finally {
        setCargando(false);
      }
    }

    cargarContenido();
  }, []);

  return (
    <div className="dashboard-page">

      <Navbar />

      <main className="dashboard-container">

        <section className="dashboard-header">

          <p className="dashboard-eyebrow">
            FORMOSA · 25 SEP 2026
          </p>

          <h1>
            Descubrí algo nuevo.
          </h1>

          <p>
            Contenido seleccionado según
            tus intereses.
          </p>

        </section>

        <section className="feed-section">

          <div className="feed-title">

            <h2>
              Para vos
            </h2>

            <span>
              {cargando
                ? "Cargando..."
                : `${contenidos.length} contenidos`}
            </span>

          </div>

          <div className="feed">

            {cargando && (
              <div className="feed-message">
                Cargando contenido...
              </div>
            )}

            {error && (
              <div className="feed-message">
                {error}
              </div>
            )}

            {!cargando && !error && contenidos.length === 0 && (
              <div className="feed-message">
                Todavía no hay contenido disponible.
              </div>
            )}

            {!cargando &&
              !error &&
              contenidos.map((contenido) => (
                <PostCard
                  key={contenido.id}
                  post={contenido}
                />
              ))}
            
          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;