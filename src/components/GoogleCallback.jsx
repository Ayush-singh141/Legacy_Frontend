// /oauth/callback
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      axios
        .get(`https://legacy-backend-wcod.onrender.com/api/auth/verifywithgoogle?code=${code}`, {
          withCredentials: true
        })
        .then((res) => {
          if (res.data.success) {
            navigate("/dashboard"); // or your home page
          }
        })
        .catch((err) => {
          console.error("OAuth error:", err);
        });
    }
  }, []);

  return <p>Logging you in...</p>;
}
