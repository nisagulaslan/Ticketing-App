import React, { useState } from "react";
import styles from "./Login.module.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);

    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        return data;
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        onLogin(data.token);
      })
      .catch((e) => setError(e.message));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.background}></div>
      <div className={styles.blurCard}>
        <h2>Welcome Back 🎟</h2>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleLogin} className={styles.loginBtn}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
