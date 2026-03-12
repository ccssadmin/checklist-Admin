import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/Action/authAction";
import "../style/Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [animate, setAnimate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setTimeout(() => setAnimate(true), 800);
  }, []);

  /* 🔑 ROLE BASED REDIRECT */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-wrapper">
      {/* LEFT */}
      <div className={`splash-panel ${animate ? "slide-left" : ""}`}>
        <div className="splash-content">
          <h1>CIIP Maintenance</h1>
          <p>Professional Asset Management</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className={`login-panel ${animate ? "slide-in" : ""}`}>
        <div className="card p-5 shadow login-card">
          <h3 className="text-center mb-4">Login</h3>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn btn-dark w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p className="text-center mt-3 text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
