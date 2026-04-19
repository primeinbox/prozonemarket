// src/hooks/useRequireAuth.js
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useRequireAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (callback) => {
    if (!user) {
      // login page par bhejo, current path state mein save karo
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    callback(); // logged in hai → buy karne do
  };

  return requireAuth;
};