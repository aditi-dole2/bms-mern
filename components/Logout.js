import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    window.alert("logged out")
    navigate("/login");
  };
}
