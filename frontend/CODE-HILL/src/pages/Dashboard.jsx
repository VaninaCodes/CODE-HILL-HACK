import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const posts = [
  {
    id: 1,

    type: "EVENTO",

    title: "Feria de proyectos tecnológicos",

    description:
      "Una jornada para conocer proyectos, emprendimientos y nuevas ideas desarrolladas en nuestra comunidad.",

    tags: [
      "Tecnología",
      "Emprendimientos"
    ],

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

    tags: [
      "Arte",
      "Cultura"
    ],

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

    tags: [
      "Tecnología",
      "Educación"
    ],

    date: "28 SEP · 19:00",

    location: "Polo Tecnológico",

    recommended: true
  }
];

function Dashboard() {

  return (
    <div className="dashboard-page">

      <Navbar />

      <main className="dashboard-container">

        <section className="dashboard-header">

          <p className="dashboard-eyebrow">
            FORMOSA · 24 SEP 2026
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
              {posts.length} publicaciones
            </span>

          </div>


          <div className="feed">

            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;