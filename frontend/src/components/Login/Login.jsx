import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Signup from "../Signup/Signup";

const Login = ({ onSuccess }) => {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const nav = useNavigate();

  const handle = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      nav("/dashboard");

      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">

      {/* LOGIN BOX */}
      <div className="login-box">
        <h2>Login</h2>

        {error && <div className="toast">{error}</div>}

        <input
          className="input"
          placeholder="Email"
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        {loading ? (
          <div className="loader"></div>
        ) : (
          <button className="btn btn-primary" onClick={handle}>
            Login
          </button>
        )}

        {/* SIGNUP LINK */}
        <p>
          New user?{" "}
          <span
            onClick={() => setShowSignup(true)}
            style={{ cursor: "pointer", color: "#3498db" }}
          >
            Signup
          </span>
        </p>
      </div>

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="modal">
          <div className="modal-box">
            <span
              className="close"
              onClick={() => setShowSignup(false)}
            >
              ×
            </span>

            <Signup onSuccess={() => setShowSignup(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;