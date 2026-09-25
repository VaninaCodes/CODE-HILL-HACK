import { Link } from "react-router-dom";

function Navbar() {
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
      </div>

    </header>
  );
}

export default Navbar;