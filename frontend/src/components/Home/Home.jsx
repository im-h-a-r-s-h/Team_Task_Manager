import { useState } from "react";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import "./Home.css";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Team Task Manager</h1>
        <p>Organize projects, assign tasks, and collaborate efficiently.</p>

        <div className="home-buttons">
          <button className="btn btn-primary" onClick={() => setShowLogin(true)}>
            Login
          </button>

          <button className="btn btn-secondary" onClick={() => setShowSignup(true)}>
            Signup
          </button>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal">
          <div className="modal-box">
            <span className="close" onClick={() => setShowLogin(false)}>×</span>
            <Login onSuccess={() => setShowLogin(false)} />
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="modal">
          <div className="modal-box">
            <span className="close" onClick={() => setShowSignup(false)}>×</span>
            <Signup onSuccess={() => setShowSignup(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;