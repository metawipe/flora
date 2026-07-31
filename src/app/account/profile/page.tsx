"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AccountSidebar } from "@/components/AccountSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Profile = {
  login: string;
  phone: string;
  name?: string;
  lastName?: string;
  email?: string;
};

const USER_KEY = "uzflora-user";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      setProfile(raw ? (JSON.parse(raw) as Profile) : null);
    } catch {
      setProfile(null);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!profile) {
    return (
      <main className="page-main">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Личный кабинет", href: "/account" },
              { label: "Личные данные" },
            ]}
          />
          <h1 className="page-title">Личные данные</h1>
          <div className="account-layout">
            <div className="account-sidebar-desktop">
              <AccountSidebar />
            </div>
            <div className="form-block">
              <p style={{ marginBottom: 16, color: "#777" }}>
                Войдите в аккаунт, чтобы редактировать профиль.
              </p>
              <Link href="/account" className="btn btn--primary">
                Войти
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const onSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Profile = {
      login: profile.login,
      name: String(data.get("name") || ""),
      lastName: String(data.get("lastName") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || "").replace(/[\s()-]/g, ""),
    };
    window.localStorage.setItem(USER_KEY, JSON.stringify(next));
    setProfile(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Личный кабинет", href: "/account" },
            { label: "Личные данные" },
          ]}
        />
        <h1 className="page-title">Личные данные</h1>
        <div className="account-layout">
          <div className="account-sidebar-desktop">
            <AccountSidebar />
          </div>
          <div className="account-content">
            <form className="profile-form" onSubmit={onSave}>
              <div className="profile-form__grid">
                <label className="field">
                  <span>Имя *</span>
                  <input
                    name="name"
                    required
                    defaultValue={profile.name || ""}
                    placeholder="Имя"
                  />
                </label>
                <label className="field">
                  <span>Фамилия *</span>
                  <input
                    name="lastName"
                    required
                    defaultValue={profile.lastName || ""}
                    placeholder="Фамилия"
                  />
                </label>
              </div>
              <label className="field">
                <span>Логин</span>
                <input value={profile.login} disabled readOnly />
              </label>
              <label className="field">
                <span>Почта</span>
                <input
                  name="email"
                  type="email"
                  defaultValue={profile.email || ""}
                  placeholder="email@example.com"
                />
              </label>
              <label className="field">
                <span>Контактный номер *</span>
                <input
                  name="phone"
                  required
                  type="tel"
                  defaultValue={profile.phone || "+998"}
                  placeholder="+998901234567"
                />
              </label>
              {saved && <p className="form-success">Данные сохранены</p>}
              <button type="submit" className="btn btn--primary btn--wide">
                Сохранить
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
