import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch {
      setError("Failed to load users");
    }
  };
  
  useEffect(() => {
    loadUsers();
  }, []);

  const toggle = async (id, active) => {
    await api.patch(`/users/${id}/status`, { is_active: !active });
    loadUsers();
  };

  if (user.role !== "tenant_admin") return <h3>Access denied</h3>;

  return (
    <div>
      <h2>Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.email} — {u.is_active ? "Active" : "Inactive"}
            {u.role === "user" && (
              <button onClick={() => toggle(u.id, u.is_active)}>
                Toggle
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
