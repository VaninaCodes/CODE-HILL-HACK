import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:3000/api/auth";

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      return JSON.parse(usuarioGuardado);
    }

    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  async function iniciarSesion(email, password) {
    const respuesta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.message || "Error al iniciar sesión");
    }

    setUsuario(datos.user);
    setToken(datos.token);

    localStorage.setItem("usuario", JSON.stringify(datos.user));
    localStorage.setItem("token", datos.token);

    return datos.user;
  }

  function cerrarSesion() {
    setUsuario(null);
    setToken(null);

    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        iniciarSesion,
        cerrarSesion
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