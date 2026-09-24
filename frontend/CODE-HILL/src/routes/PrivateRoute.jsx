import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { usuario } = useAuth();

  console.log("PrivateRoute:", usuario);

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;