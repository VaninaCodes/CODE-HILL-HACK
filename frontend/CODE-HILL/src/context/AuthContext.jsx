import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
  const usuarioGuardado = localStorage.getItem("usuario");

  if (usuarioGuardado) {
    return JSON.parse(usuarioGuardado);
  }

  return null;
});

function iniciarSesion(datosUsuario) {
  setUsuario(datosUsuario);
  localStorage.setItem("usuario", JSON.stringify(datosUsuario));
}

  function cerrarSesion() {
  setUsuario(null);
  localStorage.removeItem("usuario");
}

  return (
    <AuthContext.Provider
      value={{
        usuario,
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