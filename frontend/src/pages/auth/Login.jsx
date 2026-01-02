import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!role) return alert("Please select a role");

    const demoUser = { name: "Demo User", role };
    localStorage.setItem("user", JSON.stringify(demoUser));

    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "teacher":
        navigate("/teacher");
        break;
      case "learner":
        navigate("/learner");
        break;
      case "expert":
        navigate("/expert");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">-- Select Role --</option>
        <option value="admin">Admin</option>
        <option value="teacher">Teacher</option>
        <option value="learner">Learner</option>
        <option value="expert">Expert</option>
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
