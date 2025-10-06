import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  return logout;
};
