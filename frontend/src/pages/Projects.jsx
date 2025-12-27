import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data);
    } catch {
      setError("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/projects", { name });
      setName("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  if (user.role === "super_admin") {
    return <p>Super admin cannot access projects.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Projects</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {user.role === "tenant_admin" && (
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Create</button>
        </form>
      )}

      <hr />

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <a href={`/projects/${p.id}`}>{p.name}</a> — {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
