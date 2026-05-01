import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Login/Login";

const Signup = ({ onSuccess }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        data
      );

      alert("Signup successful! Please login.");

      if (onSuccess) onSuccess();

      nav("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">

      {/* SIGNUP FORM */}
      <div className="signup-box">
        <h2>Signup</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handle}>
          <input
            className="input"
            placeholder="Name"
            required
            onChange={(e) =>
              setData({ ...data, name: e.target.value })
            }
          />

          <input
            className="input"
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            required
            minLength="6"
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {/* SWITCH TO LOGIN */}
        <p>
          Already have an account?{" "}
          <span
            style={{ color: "#3498db", cursor: "pointer" }}
            onClick={() => setShowLogin(true)}
          >
            Login
          </span>
        </p>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal">
          <div className="modal-box">
            <span
              className="close"
              onClick={() => setShowLogin(false)}
            >
              ×
            </span>

            <Login onSuccess={() => setShowLogin(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Signup;