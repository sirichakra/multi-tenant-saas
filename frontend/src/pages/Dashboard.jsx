import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <hr />

      {/* Tenant Admin / User Links */}
      {user.role !== "super_admin" && (
        <>
          <Link to="/projects">📁 Projects</Link>
          <br />
          <br />
        </>
      )}

      {/* Tenant Admin Only */}
      {user.role === "tenant_admin" && (
        <>
          <a href="/users">Manage Users</a>
<br />

          <br />
        </>
      )}

      {/* Super Admin */}
      {user.role === "super_admin" && (
        <>
          <p>🛡️ Super Admin Access</p>
        </>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
