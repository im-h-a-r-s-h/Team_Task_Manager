import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ onSuccess }) => {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handle = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/login`,
        data
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      // close modal OR redirect (both supported)
      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
localStorage.setItem("role", res.data.user.role);

// always go dashboard after login
nav("/dashboard");

// close modal if exists
if (onSuccess) {
  onSuccess();
}
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <h2>Login</h2>

      {error && <div className="toast">{error}</div>}

      <input
        className="input"
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      {loading ? (
        <div className="loader"></div>
      ) : (
        <button className="btn btn-primary" onClick={handle}>
          Login
        </button>
      )}

      {/* still works in normal routing mode */}
      <p>
        New user? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;