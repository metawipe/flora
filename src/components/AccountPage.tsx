"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useT } from "@/i18n/LocaleProvider";
import {
  clearUserSession,
  loadUserProfile,
  loginAccount,
  registerAccount,
  type UserProfile,
} from "@/lib/userProfile";
import { Breadcrumbs } from "./Breadcrumbs";
import {
  ArrowRightIcon,
  HeartIcon,
  HelpIcon,
  OrdersIcon,
  ProfileEditIcon,
} from "./Icons";

type Mode = "login" | "register";

export function AccountPage() {
  const t = useT();
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUser(loadUserProfile());
    setReady(true);
  }, []);

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const login = String(data.get("login") || "").trim();
    const password = String(data.get("password") || "");
    if (login.length < 3 || password.length < 6) {
      setError(t("auth.errLoginPass"));
      return;
    }
    const result = await loginAccount(login, password);
    if (!result.ok) {
      setError(t("auth.errBadCreds"));
      return;
    }
    setUser(result.profile);
  };

  const onRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const login = String(data.get("login") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const password = String(data.get("password") || "");
    const password2 = String(data.get("password2") || "");

    if (login.length < 3) {
      setError(t("auth.errLoginMin"));
      return;
    }
    if (!/^\+998\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) {
      setError(t("auth.errPhone"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.errPassMin"));
      return;
    }
    if (password !== password2) {
      setError(t("auth.errPassMatch"));
      return;
    }

    const result = await registerAccount(
      {
        login,
        phone: phone.replace(/[\s()-]/g, ""),
        name: login,
      },
      password,
    );
    if (!result.ok) {
      setError(
        result.error === "exists" ? t("auth.errExists") : t("auth.errPassMin"),
      );
      return;
    }
    setUser(loadUserProfile());
  };

  const logout = () => {
    clearUserSession();
    setUser(null);
    setMode("login");
  };

  if (!ready) {
    return (
      <main className="page-main">
        <div className="container">
          <div className="skel skel--line skel--w40" style={{ height: 28 }} />
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="page-main">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: t("common.home"), href: "/" },
              { label: t("account.title") },
            ]}
          />
          <h1 className="page-title">{t("account.title")}</h1>
          <p className="cabinet-lead">{t("account.intro")}</p>

          <div className="cabinet-grid">
            <Link href="/account/profile" className="cabinet-card cabinet-card--wide">
              <div className="cabinet-card__top">
                <span className="cabinet-card__label">{t("account.personal")}</span>
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
                <span className="btn btn--ghost btn--xs">{t("account.edit")}</span>
              </div>
            </Link>

            <Link href="/favorites" className="cabinet-tile">
              <div className="cabinet-tile__icon">
                <HeartIcon />
              </div>
              <p className="cabinet-tile__title">{t("account.tileFav")}</p>
              <p className="cabinet-tile__sub">{t("account.tileFavSub")}</p>
            </Link>
            <Link href="/account/orders" className="cabinet-tile">
              <div className="cabinet-tile__icon">
                <OrdersIcon />
              </div>
              <p className="cabinet-tile__title">{t("account.tileOrders")}</p>
              <p className="cabinet-tile__sub">{t("account.tileOrdersSub")}</p>
            </Link>
            <Link href="/account/profile" className="cabinet-tile">
              <div className="cabinet-tile__icon">
                <ProfileEditIcon />
              </div>
              <p className="cabinet-tile__title">{t("account.tileProfile")}</p>
              <p className="cabinet-tile__sub">{t("account.tileProfileSub")}</p>
            </Link>
            <Link href="/faq" className="cabinet-tile">
              <div className="cabinet-tile__icon">
                <HelpIcon />
              </div>
              <p className="cabinet-tile__title">{t("account.tileHelp")}</p>
              <p className="cabinet-tile__sub">{t("account.tileHelpSub")}</p>
            </Link>
          </div>

          <div className="cabinet-cta">
            <Link href="/catalog/bouquets" className="btn btn--primary">
              {t("common.seeBouquets")}
            </Link>
            <button type="button" className="link-quiet" onClick={logout}>
              {t("account.logout")}
            </button>
          </div>
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
              { label: t("common.home"), href: "/" },
              {
                label: mode === "login" ? t("auth.login") : t("auth.register"),
              },
            ]}
          />
          <h1 className="page-title page-title--center">
            {mode === "login" ? t("auth.login") : t("auth.register")}
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
              {t("auth.tabLogin")}
            </button>
            <button
              type="button"
              className={`auth-tabs__btn${mode === "register" ? " is-active" : ""}`}
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              {t("auth.tabRegister")}
            </button>
          </div>

          {mode === "login" ? (
            <form className="auth-form" onSubmit={onLogin}>
              <label className="field">
                <span>{t("auth.loginOrPhone")}</span>
                <input
                  name="login"
                  required
                  placeholder={t("auth.loginOrPhonePh")}
                  autoComplete="username"
                />
              </label>
              <label className="field">
                <span>{t("auth.password")}</span>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder={t("auth.passwordPh")}
                  autoComplete="current-password"
                />
              </label>

              <div className="auth-form__row">
                <label className="check">
                  <input type="checkbox" defaultChecked />
                  <span>{t("auth.remember")}</span>
                </label>
                <button type="button" className="link-quiet">
                  {t("auth.forgot")}
                </button>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn btn--primary btn--wide">
                {t("auth.submitLogin")}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={onRegister}>
              <label className="field">
                <span>{t("profile.loginReadonly")} *</span>
                <input
                  name="login"
                  required
                  minLength={3}
                  placeholder={t("auth.loginLabel")}
                  autoComplete="username"
                />
              </label>
              <label className="field">
                <span>{t("auth.phone")}</span>
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
                <span>{t("auth.password")}</span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder={t("auth.passwordMinPh")}
                  autoComplete="new-password"
                />
              </label>
              <label className="field">
                <span>{t("auth.passwordRepeat")}</span>
                <input
                  name="password2"
                  type="password"
                  required
                  minLength={6}
                  placeholder={t("auth.passwordRepeat")}
                  autoComplete="new-password"
                />
              </label>

              <label className="check" style={{ marginBottom: 16 }}>
                <input type="checkbox" required defaultChecked />
                <span>
                  {t("auth.agreeBefore")}{" "}
                  <Link href="/offer">{t("auth.offer")}</Link>{" "}
                  {t("auth.agreeAfter")}
                </span>
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn btn--primary btn--wide">
                {t("auth.submitRegister")}
              </button>
            </form>
          )}

          <p className="auth-hint">
            {t("auth.noteBefore")}{" "}
            <Link href="/catalog/bouquets">{t("auth.pickBouquet")}</Link>{" "}
            {t("auth.noteAfter")}
          </p>

          <p className="auth-legal">
            {t("auth.privacyBefore")}{" "}
            <Link href="/privacy">{t("auth.privacy")}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
