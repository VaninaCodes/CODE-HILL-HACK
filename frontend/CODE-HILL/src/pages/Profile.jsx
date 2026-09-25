import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const perfil = {
    nombre: "Santiago Falcón",
    tipo: "Persona",
    ubicacion: "Formosa Capital",
    descripcion:
        "Me interesa la tecnología, los proyectos y conocer nuevas personas de la comunidad.",
    intereses: [
        "Tecnología",
        "Educación",
        "Música",
        "Arte"
    ],
    publicaciones: [
        {
        id: 1,
        titulo: "Buscando gente para proyecto tecnológico",
        descripcion:
            "Estoy trabajando en una idea relacionada con tecnología y me gustaría conocer personas interesadas.",
        tags: ["Tecnología", "Emprendimientos"]
        },
        {
        id: 2,
        titulo: "Recomendación de recursos para aprender programación",
        descripcion:
            "Comparto algunos recursos que me sirvieron para empezar a programar.",
        tags: ["Tecnología", "Educación"]
        }
    ]
};

function Profile() {
    const { usuario } = useAuth();
    console.log(usuario);
    return (
        <div className="profile-page">
        <Navbar />

        <main className="profile-container">

            <section className="profile-header">

            <div className="profile-avatar">
                S
            </div>

            <div className="profile-info">
                <p className="profile-eyebrow">
                PERFIL · {perfil.tipo.toUpperCase()}
                </p>

                <h1>
                {perfil.nombre}
                </h1>

                <p className="profile-location">
                {perfil.ubicacion}
                </p>

                <p className="profile-description">
                {perfil.descripcion}
                </p>

                <div className="profile-tags">
                {perfil.intereses.map((interes) => (
                    <span key={interes}>
                    {interes}
                    </span>
                ))}
                </div>
            </div>

            <button className="profile-contact">
                Contactar
            </button>

            </section>

            <section className="profile-posts">

            <div className="profile-posts-header">
                <h2>
                Publicaciones
                </h2>

                <span>
                {perfil.publicaciones.length}
                </span>
            </div>

            <div className="profile-posts-list">

                {perfil.publicaciones.map((publicacion) => (
                <article
                    className="profile-post"
                    key={publicacion.id}
                >
                    <h3>
                    {publicacion.titulo}
                    </h3>

                    <p>
                    {publicacion.descripcion}
                    </p>

                    <div className="profile-post-tags">
                    {publicacion.tags.map((tag) => (
                        <span key={tag}>
                        {tag}
                        </span>
                    ))}
                    </div>
                </article>
                ))}

            </div>

            </section>

        </main>
        </div>
    );
}



export default Profile;