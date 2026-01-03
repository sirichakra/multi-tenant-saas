import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        tenantSubdomain: tenant
      });
      setMsg("Login success ✔️ Token received");
    } catch {
      setMsg("Login failed ❌");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="email" onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" onChange={e=>setPassword(e.target.value)} />
      <input placeholder="tenant" onChange={e=>setTenant(e.target.value)} />
      <button onClick={login}>Login</button>
      <p>{msg}</p>
    </div>
  );
}

export default App;
