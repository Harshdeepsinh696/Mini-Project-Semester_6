import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = params.get("userId");
    if (userId) {
      localStorage.setItem("userId", userId);
      navigate("/today");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div style={{
      background: "#0b1120",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "18px"
    }}>
      ⏳ Signing you in with Google...
    </div>
  );
}