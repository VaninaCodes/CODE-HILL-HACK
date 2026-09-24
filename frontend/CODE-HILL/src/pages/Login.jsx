import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
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
          <p className="login-eyebrow">BIENVENIDO</p>

          <h1>
            Volvé a descubrir
            <br />
            tu comunidad.
          </h1>

          <p className="login-description">
            Encontrá personas, proyectos y eventos que coincidan con tus
            intereses.
          </p>
        </div>

        {/* Formulario */}
        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();

            iniciarSesion({
              nombre: "Santiago Falcón",
              email: "santi@email.com",
            });

            navigate("/dashboard");
          }}
        >
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input id="email" type="email" placeholder="tu@email.com" />
          </div>

          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Contraseña</label>

              <button type="button">¿La olvidaste?</button>
            </div>

            <input id="password" type="password" placeholder="••••••••" />
          </div>

          <button className="login-button" type="submit">
            Iniciar sesión
          </button>
        </form>

        {/* Registro */}
        <div className="login-register">
          <span>¿Todavía no tenés una cuenta?</span>

          <a href="/register">Registrate</a>
        </div>
      </section>
    </main>
  );
}

export default Login;
