import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getPosts, getProfile } from "../services/api";

function Profile() {
  const { usuario } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileAndPosts() {
      try {
        setLoading(true);
        let userData = usuario || JSON.parse(localStorage.getItem("user") || "{}");

        // Intentamos obtener perfil fresco desde /auth/me
        try {
          const freshData = await getProfile();
          if (freshData && freshData.user) {
            userData = freshData.user;
          } else if (freshData) {
            userData = freshData;
          }
        } catch (e) {
          console.warn("No se pudo conectar con /auth/me, usando localStorage");
        }

        setProfileData(userData);

        // Obtener publicaciones del usuario
        const allPosts = await getPosts();
        const currentUserId = userData.id;
        const currentUsername = userData.username;

        const filtered = allPosts.filter(
          (p) =>
            p.userId === currentUserId ||
            p.UserId === currentUserId ||
            p.author?.id === currentUserId ||
            p.author?.username === currentUsername
        );

        setUserPosts(filtered);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfileAndPosts();
  }, [usuario]);

  const user = profileData || {};

  // Mapeo según backend Sequelize
  const username = user.username || "Usuario";
  const type = user.type || "Persona";
  const description = user.description || "Sin descripción proporcionada.";
  const tags = user.Tags || user.tags || user.intereses || [];

  const initialLetter = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">
        <section className="profile-header">
          <div className="profile-avatar">{initialLetter}</div>

          <div className="profile-info">
            <p className="profile-eyebrow">PERFIL · {type.toUpperCase()}</p>

            <h1>{username}</h1>

            <p className="profile-location">Formosa Capital</p>

            <p className="profile-description">{description}</p>

            <div className="profile-tags">
              {tags.map((tag) => (
                <span key={typeof tag === "string" ? tag : tag.id || tag.name}>
                  {typeof tag === "string" ? tag : tag.name}
                </span>
              ))}
            </div>
          </div>

          <button className="profile-contact">Contactar</button>
        </section>

        <section className="profile-posts">
          <div className="profile-posts-header">
            <h2>Publicaciones</h2>
            <span>{userPosts.length}</span>
          </div>

          {loading ? (
            <p style={{ padding: "20px" }}>Cargando datos del perfil...</p>
          ) : (
            <div className="profile-posts-list">
              {userPosts.length === 0 ? (
                <p style={{ padding: "20px", opacity: 0.7 }}>
                  No hay publicaciones creadas por este usuario.
                </p>
              ) : (
                userPosts.map((post) => (
                  <article className="profile-post" key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.content || post.description}</p>
                    <div className="profile-post-tags">
                      {(post.tags || []).map((tag) => (
                        <span key={typeof tag === "string" ? tag : tag.id || tag.name}>
                          {typeof tag === "string" ? tag : tag.name}
                        </span>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Profile;