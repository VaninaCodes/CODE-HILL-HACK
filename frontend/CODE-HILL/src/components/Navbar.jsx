import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cerrarSesion } = useAuth();
  return (
    <header className="navbar">

      <Link to="/dashboard" className="navbar-logo">
        <span>✦</span>
        TAGMA
      </Link>

      <nav className="navbar-links">

        <Link to="/dashboard">
          Inicio
        </Link>

        <Link to="/profile">
          Perfil
        </Link>

      </nav>

      <div className="navbar-user">
  <div className="navbar-avatar">
    S
  </div>

  <button
    className="navbar-logout"
    onClick={cerrarSesion}
  >
    Cerrar sesión
  </button>
</div>

    </header>
  );
}

export default Navbar;