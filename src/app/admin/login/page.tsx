"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Неверный пароль");
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <main className="admin-login">
      <form className="admin-login__card" onSubmit={onSubmit}>
        <h1>Zamin Gullari · Admin</h1>
        <p>Вход для управления товарами и заказами</p>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>
        {error ? <p className="admin-login__error">{error}</p> : null}
        <button type="submit" className="btn btn--primary btn--wide" disabled={loading}>
          {loading ? "…" : "Войти"}
        </button>
      </form>
    </main>
  );
}
