import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/api";
import "./AuthPage.css";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const data = mode === "login"
        ? await loginUser({ username: form.username, password: form.password })
        : await registerUser(form);
      login(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">

      {/* Vinyl — this spins */}
      <div className="auth-bg">
        <div className="vinyl-ring r1" />
        <div className="vinyl-ring r2" />
        <div className="vinyl-ring r3" />
        <div className="vinyl-center" />
      </div>

      {/* Tonearm + block — outside auth-bg so they don't spin with it */}
      <svg
        className="tonearm-svg"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tonearm at 45° */}
        <line x1="300" y1="300" x2="162" y2="162"
          stroke="#c8a060" strokeWidth="6" strokeLinecap="round"/>
        <line x1="300" y1="300" x2="162" y2="162"
          stroke="rgba(255,220,140,0.2)" strokeWidth="2" strokeLinecap="round"/>

        {/* Headshell */}
        <g transform="translate(162,162) rotate(-45)">
          <rect x="-5" y="-12" width="10" height="24" rx="2"
            fill="#c8a060" stroke="#f5a623" strokeWidth="1"/>
          <rect x="-8" y="-24" width="16" height="14" rx="2"
            fill="#1a1a1a" stroke="#888" strokeWidth="0.8"/>
          <line x1="0" y1="-24" x2="0" y2="-34"
            stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="0" cy="-36" r="3" fill="#f5a623"/>
        </g>

        {/* Pivot */}
        <circle cx="300" cy="300" r="10" fill="#c8a060" stroke="#f5a623" strokeWidth="1.5"/>
        <circle cx="300" cy="300" r="4.5" fill="#f5a623"/>

        {/* Orbiting block */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 300 300"
            to="360 300 300"
            dur="4s"
            repeatCount="indefinite"
          />
          <rect x="288" y="94" width="24" height="12" rx="3"
            fill="#f5a623" stroke="#c87010" strokeWidth="1.5"/>
        </g>
      </svg>
      
      <div className="auth-panel">
        <div className="auth-logo">
          <span className="logo-icon">♬</span>
          <span className="logo-text">muse</span>
        </div>
        <p className="auth-tagline">where music lives.</p>

        <div className="auth-tabs">
          <button
            className={`tab-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => { setMode("register"); setError(""); }}
          >
            Join
          </button>
        </div>

        <div className="auth-form">
          <div className="field">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handle} placeholder="your_name" />
          </div>

          {mode === "register" && (
            <div className="field">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handle} placeholder="you@example.com" type="email" />
            </div>
          )}

          <div className="field">
            <label>Password</label>
            <input name="password" value={form.password} onChange={handle} placeholder="••••••••" type="password" />
          </div>

          {mode === "register" && (
            <div className="field">
              <label>Role</label>
              <div className="role-toggle">
                <button
                  className={`role-btn ${form.role === "user" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, role: "user" })}
                  type="button"
                >
                  🎧 Listener
                </button>
                <button
                  className={`role-btn ${form.role === "artist" ? "active" : ""}`}
                  onClick={() => setForm({ ...form, role: "artist" })}
                  type="button"
                >
                  🎤 Artist
                </button>
              </div>
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button className="submit-btn" onClick={submit} disabled={loading}>
            {loading ? <span className="spinner" /> : mode === "login" ? "Continue" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
