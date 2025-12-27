import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSubdomain, setTenantSubdomain] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        email,
        password,
      };

      if (tenantSubdomain) {
        payload.tenantSubdomain = tenantSubdomain;
      }

      const res = await axios.post(`${API}/auth/login`, payload);

      login(res.data.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Login failed. Check credentials."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
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

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Tenant Subdomain (optional for super admin)"
          value={tenantSubdomain}
          onChange={(e) => setTenantSubdomain(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
