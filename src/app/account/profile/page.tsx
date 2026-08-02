"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AccountSidebar } from "@/components/AccountSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useT } from "@/i18n/LocaleProvider";
import {
  loadUserProfile,
  saveUserProfile,
  type UserProfile,
} from "@/lib/userProfile";

export default function ProfilePage() {
  const t = useT();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(loadUserProfile());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!profile) {
    return (
      <main className="page-main">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: t("common.home"), href: "/" },
              { label: t("account.title"), href: "/account" },
              { label: t("profile.title") },
            ]}
          />
          <h1 className="page-title">{t("profile.title")}</h1>
          <div className="account-layout">
            <div className="account-sidebar-desktop">
              <AccountSidebar />
            </div>
            <div className="form-block">
              <p style={{ marginBottom: 16, color: "#777" }}>
                {t("profile.needLogin")}
              </p>
              <Link href="/account" className="btn btn--primary">
                {t("auth.tabLogin")}
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
    const next: UserProfile = {
      login: profile.login,
      name: String(data.get("name") || ""),
      lastName: String(data.get("lastName") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || "").replace(/[\s()-]/g, ""),
      address: String(data.get("address") || ""),
    };
    saveUserProfile(next);
    setProfile(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="page-main">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("account.title"), href: "/account" },
            { label: t("profile.title") },
          ]}
        />
        <h1 className="page-title">{t("profile.title")}</h1>
        <div className="account-layout">
          <div className="account-sidebar-desktop">
            <AccountSidebar />
          </div>
          <div className="account-content">
            <form className="profile-form" onSubmit={onSave}>
              <div className="profile-form__grid">
                <label className="field">
                  <span>{t("profile.firstName")}</span>
                  <input
                    name="name"
                    required
                    defaultValue={profile.name || ""}
                    placeholder={t("profile.firstNamePh")}
                  />
                </label>
                <label className="field">
                  <span>{t("profile.lastName")}</span>
                  <input
                    name="lastName"
                    required
                    defaultValue={profile.lastName || ""}
                    placeholder={t("profile.lastNamePh")}
                  />
                </label>
              </div>
              <label className="field">
                <span>{t("profile.loginReadonly")}</span>
                <input value={profile.login} disabled readOnly />
              </label>
              <label className="field">
                <span>{t("profile.email")}</span>
                <input
                  name="email"
                  type="email"
                  defaultValue={profile.email || ""}
                  placeholder="email@example.com"
                />
              </label>
              <label className="field">
                <span>{t("profile.phone")}</span>
                <input
                  name="phone"
                  required
                  type="tel"
                  defaultValue={profile.phone || "+998"}
                  placeholder="+998901234567"
                />
              </label>
              <label className="field">
                <span>{t("profile.address")}</span>
                <input
                  name="address"
                  defaultValue={profile.address || ""}
                  placeholder={t("profile.addressPh")}
                />
              </label>
              {saved && <p className="form-success">{t("profile.saved")}</p>}
              <button type="submit" className="btn btn--primary btn--wide">
                {t("profile.save")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
