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
      <div className="auth-bg">
        <div className="vinyl-ring r1" />
        <div className="vinyl-ring r2" />
        <div className="vinyl-ring r3" />
        <div className="vinyl-center" />
      </div>

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
