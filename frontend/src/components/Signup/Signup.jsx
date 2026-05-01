import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = ({ onSuccess }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        `http://localhost:5000/api/auth/signup`,
        data
      );

      alert("Signup successful! Please login.");

      // close modal OR fallback navigation
      await axios.post(`http://localhost:5000/api/auth/signup`, data);

alert("Signup successful! Please login.");

// close modal if used
if (onSuccess) {
  onSuccess();
}

// always go login page after signup
nav("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handle}>
        <input
          className="input"
          placeholder="Name"
          required
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          className="input"
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          required
          minLength="6"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {/* still works in routing mode */}
      <p style={{ marginTop: "10px" }}>
        Already user? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;