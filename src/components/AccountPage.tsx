"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { ArrowRightIcon, HeartIcon } from "./Icons";

type Mode = "login" | "register";

type UserProfile = {
  login: string;
  phone: string;
  name?: string;
};

const USER_KEY = "loveflowers-user";

function loadUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function AccountPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUser(loadUser());
    setReady(true);
  }, []);

  const onLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const login = String(data.get("login") || "").trim();
    const password = String(data.get("password") || "");
    if (login.length < 3 || password.length < 6) {
      setError("Логин от 3 символов, пароль от 6");
      return;
    }
    const next = { login, phone: login.startsWith("+") ? login : "+998" };
    window.localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
  };

  const onRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const login = String(data.get("login") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const password = String(data.get("password") || "");
    const password2 = String(data.get("password2") || "");

    if (login.length < 3) {
      setError("Логин: минимум 3 символа");
      return;
    }
    if (!/^\+998\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) {
      setError("Телефон в формате +998XXXXXXXXX");
      return;
    }
    if (password.length < 6) {
      setError("Пароль: минимум 6 символов");
      return;
    }
    if (password !== password2) {
      setError("Пароли не совпадают");
      return;
    }

    const next = {
      login,
      phone: phone.replace(/[\s()-]/g, ""),
      name: login,
    };
    window.localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
  };

  const logout = () => {
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
    setMode("login");
  };

  if (!ready) return null;

  if (user) {
    return (
      <main className="page-main">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Личный кабинет" },
            ]}
          />
          <h1 className="page-title">Личный кабинет</h1>

          <div className="cabinet-grid">
            <Link href="/account/profile" className="cabinet-card cabinet-card--wide">
              <div className="cabinet-card__top">
                <span className="cabinet-card__label">Личные данные</span>
                <span className="cabinet-card__arrow">
                  <ArrowRightIcon />
                </span>
              </div>
              <p className="cabinet-card__value">{user.name || user.login}</p>
              <div className="cabinet-card__bottom">
                <div>
                  <p>{user.login}</p>
                  <p>{user.phone}</p>
                </div>
                <span className="btn btn--ghost btn--xs">Сменить пароль</span>
              </div>
            </Link>

            <Link href="/favorites" className="cabinet-tile">
              <div className="cabinet-tile__icon">
                <HeartIcon />
              </div>
              <p className="cabinet-tile__title">Избранное</p>
              <p className="cabinet-tile__sub">Сохранённые букеты</p>
            </Link>
            <Link href="/account/orders" className="cabinet-tile">
              <div className="cabinet-tile__icon">☰</div>
              <p className="cabinet-tile__title">Заказы</p>
              <p className="cabinet-tile__sub">История покупок</p>
            </Link>
            <Link href="/account/profile" className="cabinet-tile">
              <div className="cabinet-tile__icon">✎</div>
              <p className="cabinet-tile__title">Профиль</p>
              <p className="cabinet-tile__sub">Имя и контакты</p>
            </Link>
            <Link href="/faq" className="cabinet-tile">
              <div className="cabinet-tile__icon">?</div>
              <p className="cabinet-tile__title">Помощь</p>
              <p className="cabinet-tile__sub">Вопросы и ответы</p>
            </Link>
          </div>

          <button type="button" className="link-quiet" style={{ marginTop: 24 }} onClick={logout}>
            Выйти
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="container">
        <div className="auth-wrap">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: mode === "login" ? "Авторизация" : "Регистрация" },
            ]}
          />
          <h1 className="page-title page-title--center">
            {mode === "login" ? "Авторизация" : "Регистрация"}
          </h1>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tabs__btn${mode === "login" ? " is-active" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Войти
            </button>
            <button
              type="button"
              className={`auth-tabs__btn${mode === "register" ? " is-active" : ""}`}
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              Регистрация
            </button>
          </div>

          {mode === "login" ? (
            <form className="auth-form" onSubmit={onLogin}>
              <label className="field">
                <span>Логин или телефон *</span>
                <input
                  name="login"
                  required
                  placeholder="+998 __ ___ __ __ или логин"
                  autoComplete="username"
                />
              </label>
              <label className="field">
                <span>Пароль *</span>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Пароль"
                  autoComplete="current-password"
                />
              </label>

              <div className="auth-form__row">
                <label className="check">
                  <input type="checkbox" defaultChecked />
                  <span>Запомнить меня</span>
                </label>
                <button type="button" className="link-quiet">
                  Забыли пароль?
                </button>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn btn--primary btn--wide">
                Войти
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={onRegister}>
              <label className="field">
                <span>Логин *</span>
                <input
                  name="login"
                  required
                  minLength={3}
                  placeholder="Придумайте логин"
                  autoComplete="username"
                />
              </label>
              <label className="field">
                <span>Номер телефона *</span>
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="+998901234567"
                  defaultValue="+998"
                  autoComplete="tel"
                />
              </label>
              <label className="field">
                <span>Пароль *</span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Минимум 6 символов"
                  autoComplete="new-password"
                />
              </label>
              <label className="field">
                <span>Повторите пароль *</span>
                <input
                  name="password2"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Повторите пароль"
                  autoComplete="new-password"
                />
              </label>

              <label className="check" style={{ marginBottom: 16 }}>
                <input type="checkbox" required defaultChecked />
                <span>
                  Согласен с{" "}
                  <Link href="/offer">офертой</Link> и обработкой данных
                </span>
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn btn--primary btn--wide">
                Зарегистрироваться
              </button>
            </form>
          )}

          <div className="auth-social">
            <p>Войти с помощью</p>
            <div className="auth-social__grid">
              <button type="button">Telegram</button>
              <button type="button">Google</button>
              <button type="button">Apple</button>
            </div>
          </div>

          <p className="auth-legal">
            Продолжая, вы соглашаетесь с{" "}
            <Link href="/offer">политикой конфиденциальности</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
