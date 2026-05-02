import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      // ✅ STEP 1: SIGNUP
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        data
      );

      // ✅ STEP 2: AUTO LOGIN
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password
        }
      );

      // ✅ STEP 3: STORE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      // ✅ STEP 4: REDIRECT
      nav("/dashboard");

      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
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
      </div>
    </div>
  );
};

export default Signup;