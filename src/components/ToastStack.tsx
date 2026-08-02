"use client";

import Image from "next/image";
import { useStore, cartItemLabel, type StoreToast } from "@/context/StoreContext";
import { getProductById, localizeProductName } from "@/data/products";
import { useLocale } from "@/i18n/LocaleProvider";

function AddToast({
  toast,
}: {
  toast: Extract<StoreToast, { type: "cart-add" | "fav-add" }>;
}) {
  const { dismissToast } = useStore();
  const { locale, t } = useLocale();

  let title = t("toast.cartAdd");
  let subtitle = toast.subtitle;

  if (toast.type === "cart-add") {
    title = t("toast.cartAdd");
    const [productId, size = ""] = toast.subtitle.split("|");
    const product = productId ? getProductById(productId) : undefined;
    subtitle = cartItemLabel(
      {
        productId: productId || "",
        name: product?.name || subtitle,
        size,
      },
      locale,
    );
  } else {
    title = t("toast.favAdd");
    const product = getProductById(toast.subtitle);
    subtitle = product
      ? localizeProductName(product, locale)
      : toast.subtitle;
  }

  return (
    <div className="toast toast--add" role="status">
      <div className="toast__thumb">
        {toast.image ? (
          <Image src={toast.image} alt="" fill sizes="56px" />
        ) : null}
      </div>
      <div className="toast__body">
        <p className="toast__title">{title}</p>
        <p className="toast__text">{subtitle}</p>
      </div>
      <button
        type="button"
        className="toast__close"
        aria-label={t("common.close")}
        onClick={() => dismissToast(toast.id)}
      >
        ×
      </button>
    </div>
  );
}

function RemoveToast({
  toast,
}: {
  toast: Extract<StoreToast, { type: "cart-remove" }>;
}) {
  const { dismissToast, restoreCartItem } = useStore();
  const { locale, t } = useLocale();
  const label = cartItemLabel(toast.item, locale);
  const [before = "", after = ""] = t("toast.cartRemove", {
    label: "<<<L>>>",
  }).split("<<<L>>>");

  return (
    <div className="toast toast--remove" role="status">
      <p className="toast__msg">
        {before}
        <strong>{label}</strong>
        {after}
      </p>
      <div className="toast__actions">
        <button
          type="button"
          className="toast__undo"
          onClick={() => {
            restoreCartItem(toast.item);
            dismissToast(toast.id);
          }}
        >
          {t("toast.restore")}
        </button>
        <button
          type="button"
          className="toast__close"
          aria-label={t("common.close")}
          onClick={() => dismissToast(toast.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ToastStack() {
  const { toasts } = useStore();
  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) =>
        toast.type === "cart-remove" ? (
          <RemoveToast key={toast.id} toast={toast} />
        ) : (
          <AddToast key={toast.id} toast={toast} />
        ),
      )}
    </div>
  );
}
