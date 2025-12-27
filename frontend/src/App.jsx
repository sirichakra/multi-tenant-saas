import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";

function App() {
  const { loading, user } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<h2>Tenant Registration</h2>} />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />


      <Route
        path="/projects"
        element={user ? <Projects /> : <Navigate to="/login" />}
      />

      <Route
        path="/projects/:projectId"
        element={user ? <Tasks /> : <Navigate to="/login" />}
      />

      <Route
        path="/users"
        element={user ? <Users /> : <Navigate to="/login" />}
      />

    </Routes>
  );
}

export default App;
