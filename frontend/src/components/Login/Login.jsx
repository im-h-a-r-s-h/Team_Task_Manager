import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "../Signup/Signup";

const Login = ({ onSuccess, prefill }) => {

  // ✅ INITIAL STATE
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const nav = useNavigate();

  // ✅ FIX: UPDATE STATE WHEN PREFILL CHANGES
  useEffect(() => {
    if (prefill) {
      setData({
        email: prefill.email || "",
        password: prefill.password || ""
      });
    }
  }, [prefill]);

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

        {/* EMAIL */}
        <input
          className="input"
          placeholder="Email"
          value={data.email}
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        {/* BUTTON */}
        {loading ? (
          <div className="loader"></div>
        ) : (
          <button className="btn btn-primary" onClick={handle}>
            Login
          </button>
        )}

        {/* SWITCH TO SIGNUP */}
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