"use client";

import Image from "next/image";
import { useStore, type StoreToast } from "@/context/StoreContext";

function AddToast({ toast }: { toast: Extract<StoreToast, { type: "cart-add" | "fav-add" }> }) {
  const { dismissToast } = useStore();
  return (
    <div className="toast toast--add" role="status">
      <div className="toast__thumb">
        {toast.image ? (
          <Image src={toast.image} alt="" fill sizes="56px" />
        ) : null}
      </div>
      <div className="toast__body">
        <p className="toast__title">{toast.title}</p>
        <p className="toast__text">{toast.subtitle}</p>
      </div>
      <button
        type="button"
        className="toast__close"
        aria-label="Закрыть"
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
  return (
    <div className="toast toast--remove" role="status">
      <p className="toast__msg">
        Товар <strong>{toast.label}</strong> был удален из корзины.
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
          Восстановить
        </button>
        <button
          type="button"
          className="toast__close"
          aria-label="Закрыть"
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
