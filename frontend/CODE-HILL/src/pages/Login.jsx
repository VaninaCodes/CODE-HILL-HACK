import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completá email y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      // iniciarSesion guarda el token en localStorage Y actualiza
      // el estado de React (usuario) al instante, sin esperar un reload.
      iniciarSesion(data);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <section className="login-container">

        {/* Logo */}
        <div className="login-logo">
          <span>✦</span>
          TAGMA
        </div>

        {/* Título */}
        <div className="login-header">
          <p className="login-eyebrow">
            BIENVENIDO
          </p>

          <h1>
            Volvé a descubrir
            <br />
            tu comunidad.
          </h1>

          <p className="login-description">
            Encontrá personas, proyectos y eventos
            que coincidan con tus intereses.
          </p>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="form-group">

            <div className="password-label">

              <label htmlFor="password">
                Contraseña
              </label>

              <button type="button">
                ¿La olvidaste?
              </button>

            </div>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>

        {/* Registro */}
        <div className="login-register">

          <span>
            ¿Todavía no tenés una cuenta?
          </span>

          <a href="/register">
            Registrate
          </a>

        </div>

      </section>

    </main>
  );
}

export default Login;