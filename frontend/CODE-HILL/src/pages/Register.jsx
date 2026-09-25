import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("persona");
  const [intereses, setIntereses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tagsDisponibles = [
    "Tecnología",
    "Emprendimientos",
    "Arte",
    "Cultura",
    "Música",
    "Educación",
    "Deportes",
    "Gastronomía"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !password) {
      setError("Completá nombre, email y contraseña.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        username: nombre,
        email,
        password,
        type: tipoUsuario,
        // OJO: el backend espera un array de IDs de etiquetas (tags: [1, 5, 12]),
        // no nombres como estos. Hay que resolver ese mapeo antes de mandar esto
        // a produccion (ver nota abajo del componente).
        tags: intereses,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <section className="register-container">

        {/* Logo */}

        <div className="register-logo">
          <span>✦</span>
          TAGMA
        </div>


        {/* Encabezado */}

        <div className="register-header">

          <p className="register-eyebrow">
            NUEVA CUENTA
          </p>

          <h1>
            Formá parte
            <br />
            de la comunidad.
          </h1>

          <p className="register-description">
            Contanos un poco sobre vos para
            encontrar contenido que te interese.
          </p>

        </div>


        {/* Formulario */}

        <form className="register-form" onSubmit={handleSubmit}>

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          {/* Nombre */}

          <div className="form-group">

            <label htmlFor="nombre">
              Nombre
            </label>

            <input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>


          {/* Contraseña */}

          <div className="form-group">

            <label htmlFor="register-password">
              Contraseña
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>


          {/* Tipo de usuario */}

          <div className="form-group">

            <label htmlFor="tipo-usuario">
              Tipo de usuario
            </label>

            <select
              id="tipo-usuario"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >

              <option value="persona">
                Persona
              </option>

              <option value="emprendimiento">
                Emprendimiento
              </option>

            </select>

          </div>


          {/* Intereses */}

          <div className="register-tags">

            <div className="register-tags-header">

              <label>
                ¿Qué te interesa?
              </label>

              <span>
                Elegí los que quieras
              </span>

            </div>


            <div className="tags-grid">

              {tagsDisponibles.map((tag) => (

                <label
                  className={
                    intereses.includes(tag)
                      ? "tag-option selected"
                      : "tag-option"
                  }
                  key={tag}
                >

                  <input
                    type="checkbox"
                    value={tag}
                    checked={intereses.includes(tag)}
                    onChange={() => {

                      if (intereses.includes(tag)) {

                        setIntereses(
                          intereses.filter(
                            (interes) => interes !== tag
                          )
                        );

                      } else {

                        setIntereses([
                          ...intereses,
                          tag
                        ]);

                      }

                    }}
                  />

                  <span>
                    {tag}
                  </span>

                </label>

              ))}

            </div>

          </div>


          {/* Botón */}

          <button
            className="register-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

        </form>


        {/* Volver al login */}

        <div className="register-login">

          <span>
            ¿Ya tenés una cuenta?
          </span>

          <a href="/login">
            Iniciá sesión
          </a>

        </div>

      </section>

    </main>
  );
}

export default Register;