import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiRequest } from "../Api";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("denied");
      return;
    }

    apiRequest("/Api/auth/me")
      .then(() => setStatus("allowed"))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setStatus("denied");
      });
  }, []);

  if (status === "checking") return <p>Loading...</p>;
  if (status === "denied") return <Navigate to="/auth" replace />;
  return children;
}

export default ProtectedRoute;