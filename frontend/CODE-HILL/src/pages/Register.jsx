import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("persona");

  const [tagsDisponibles, setTagsDisponibles] = useState([]);
  const [intereses, setIntereses] = useState([]);

  useEffect(() => {
    async function cargarTags() {
      try {
        const respuesta = await fetch("http://localhost:3000/api/tags");
        const datos = await respuesta.json();

        setTagsDisponibles(datos);
      } catch (error) {
        console.error("Error al cargar las etiquetas:", error);
      }
    }

    cargarTags();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: nombre,
            email,
            password,
            type: tipoUsuario,
            tags: intereses
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || "Error al registrarse");
      }

      alert("Cuenta creada correctamente.");

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="register-page">
      <section className="register-container">

        <div className="register-logo">
          <span>✦</span>
          TAGMA
        </div>

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

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

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
                    intereses.includes(tag.id)
                      ? "tag-option selected"
                      : "tag-option"
                  }
                  key={tag.id}
                >

                  <input
                    type="checkbox"
                    value={tag.id}
                    checked={intereses.includes(tag.id)}
                    onChange={() => {
                      if (intereses.includes(tag.id)) {
                        setIntereses(
                          intereses.filter(
                            (id) => id !== tag.id
                          )
                        );
                      } else {
                        setIntereses([
                          ...intereses,
                          tag.id
                        ]);
                      }
                    }}
                  />

                  <span>
                    {tag.name}
                  </span>

                </label>
              ))}

            </div>
          </div>

          <button
            className="register-button"
            type="submit"
          >
            Crear cuenta
          </button>

        </form>

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