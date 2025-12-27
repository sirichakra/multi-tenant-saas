import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

function Tasks() {
  const { projectId } = useParams();
  const { token, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${API}/tasks?project_id=${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data.data);
    } catch {
      setError("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/tasks`,
        { title, project_id: projectId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle("");
      fetchTasks();
    } catch {
      setError("Failed to create task");
    }
  };

  const updateStatus = async (id) => {
    try {
      await axios.patch(
        `${API}/tasks/${id}/status`,
        { status: "done" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
    } catch {
      setError("Failed to update status");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tasks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {user.role !== "super_admin" && (
        <form onSubmit={handleCreate}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
          <button>Create Task</button>
        </form>
      )}

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} — <strong>{t.status}</strong>{" "}
            {t.status !== "done" && (
              <button onClick={() => updateStatus(t.id)}>Mark Done</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
