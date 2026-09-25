import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/api";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar la app, si hay token guardado, recuperamos el usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }

    getProfile()
      .then((data) => setUsuario(data.user)) // getProfile() devuelve { user: {...} }
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  // Se llama justo despues de un login exitoso.
  // datosUsuario es la respuesta cruda de POST /auth/login: { message, token, user }
  function iniciarSesion(datosUsuario) {
    if (datosUsuario?.token) {
      localStorage.setItem("token", datosUsuario.token);
    }
    if (datosUsuario?.user) {
      localStorage.setItem("user", JSON.stringify(datosUsuario.user));
      setUsuario(datosUsuario.user);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };