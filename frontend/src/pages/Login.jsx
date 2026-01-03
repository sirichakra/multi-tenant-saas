import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSubdomain, setTenantSubdomain] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
        tenantSubdomain,
      });

      // ✅ CORRECT TOKEN ACCESS
      const token = res.data?.data?.token;

      if (!token) {
        throw new Error("Token missing in response");
      }

      login(token);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <input
          type="text"
          placeholder="Tenant Subdomain (demo)"
          value={tenantSubdomain}
          onChange={(e) => setTenantSubdomain(e.target.value)}
        />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
