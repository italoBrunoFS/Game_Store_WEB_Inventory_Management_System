import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";
import { useNavigate } from "react-router";

const ProtectedRoutes = ({children}) => {
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      navigate('/login');
    }
  }, [user, navigate]);

  if(!user) return null;

  return children;
}

export default ProtectedRoutes;
