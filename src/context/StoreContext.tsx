"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getProductById,
  localizeProductName,
  type Product,
} from "@/data/products";
import type { Locale } from "@/i18n/config";
import { localizePackSize } from "@/i18n/catalog";
import {
  loadOrders,
  saveOrders,
  type OrderLine,
  type StoredOrder,
} from "@/lib/orders";
import { promoDiscountFor, validatePromoCode } from "@/lib/promo";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

export type StoreToast =
  | {
      id: string;
      type: "cart-add";
      title: string;
      subtitle: string;
      image: string;
    }
  | {
      id: string;
      type: "fav-add";
      title: string;
      subtitle: string;
      image: string;
    }
  | {
      id: string;
      type: "cart-remove";
      label: string;
      item: CartItem;
    };

export type PlaceOrderInput = {
  name: string;
  phone: string;
  address: string;
  date: string;
  slot: string;
  pay: string;
  comment: string;
  recipient?: string;
  cardText?: string;
};

type StoreContextValue = {
  cart: CartItem[];
  favorites: Set<string>;
  cartCount: number;
  favCount: number;
  cartTotal: number;
  promoCode: string | null;
  promoPercent: number;
  promoDiscount: number;
  payableTotal: number;
  orders: StoredOrder[];
  toasts: StoreToast[];
  addToCart: (product: Product, size?: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  restoreCartItem: (item: CartItem) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setPromoCode: (code: string | null, percent?: number) => void;
  applyPromoCode: (code: string) => Promise<boolean>;
  placeOrder: (input: PlaceOrderInput) => Promise<StoredOrder>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  dismissToast: (id: string) => void;
  hydrated: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "zamin-cart";
const FAV_KEY = "zamin-favorites";
const PROMO_KEY = "zamin-promo";
const LEGACY_CART_KEY = "loveflowers-cart";
const LEGACY_FAV_KEY = "loveflowers-favorites";
const TOAST_TTL = 5500;

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function migrateLegacyStorage() {
  if (typeof window === "undefined") return;
  try {
    if (!window.localStorage.getItem(CART_KEY)) {
      const legacy = window.localStorage.getItem(LEGACY_CART_KEY);
      if (legacy) {
        window.localStorage.setItem(CART_KEY, legacy);
        window.localStorage.removeItem(LEGACY_CART_KEY);
      }
    }
    if (!window.localStorage.getItem(FAV_KEY)) {
      const legacy = window.localStorage.getItem(LEGACY_FAV_KEY);
      if (legacy) {
        window.localStorage.setItem(FAV_KEY, legacy);
        window.localStorage.removeItem(LEGACY_FAV_KEY);
      }
    }
  } catch {
    /* ignore */
  }
}

export function cartItemLabel(
  item: Pick<CartItem, "name" | "size" | "productId">,
  locale: Locale = "ru",
): string {
  const name = item.productId
    ? localizeProductName({ id: item.productId, name: item.name }, locale)
    : item.name;
  const size = localizePackSize(locale, item.size);
  const none = localizePackSize(locale, "none");
  if (!size || size === "—" || size === none || size === "Без упаковки") {
    return name;
  }
  return `${name} - ${size}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [promoCode, setPromoCodeState] = useState<string | null>(null);
  const [promoPercent, setPromoPercent] = useState(0);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [toasts, setToasts] = useState<StoreToast[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const timers = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    (toast: StoreToast, ttl = TOAST_TTL) => {
      setToasts((prev) => [...prev.slice(-2), toast]);
      const existing = timers.current.get(toast.id);
      if (existing) window.clearTimeout(existing);
      const timer = window.setTimeout(() => dismissToast(toast.id), ttl);
      timers.current.set(toast.id, timer);
    },
    [dismissToast],
  );

  useEffect(() => {
    migrateLegacyStorage();
    setCart(loadJson<CartItem[]>(CART_KEY, []));
    setFavorites(new Set(loadJson<string[]>(FAV_KEY, [])));
    try {
      const raw = window.localStorage.getItem(PROMO_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { code?: string; percent?: number };
        if (parsed.code && parsed.percent) {
          setPromoCodeState(parsed.code);
          setPromoPercent(parsed.percent);
        }
      }
    } catch {
      /* ignore */
    }
    setOrders(loadOrders());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (promoCode && promoPercent > 0) {
      window.localStorage.setItem(
        PROMO_KEY,
        JSON.stringify({ code: promoCode, percent: promoPercent }),
      );
    } else {
      window.localStorage.removeItem(PROMO_KEY);
    }
  }, [promoCode, promoPercent, hydrated]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => window.clearTimeout(timer));
      map.clear();
    };
  }, []);

  const addToCart = useCallback(
    (product: Product, size = "M", qty = 1) => {
      setCart((prev) => {
        const key = `${product.id}:${size}`;
        const existing = prev.find((item) => item.id === key);
        if (existing) {
          return prev.map((item) =>
            item.id === key ? { ...item, qty: item.qty + qty } : item,
          );
        }
        return [
          ...prev,
          {
            id: key,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size,
            qty,
          },
        ];
      });

      pushToast({
        id: `cart-add-${Date.now()}`,
        type: "cart-add",
        title: "cartAdd",
        subtitle: `${product.id}|${size}`,
        image: product.images[0] || "",
      });
    },
    [pushToast],
  );

  const removeFromCart = useCallback(
    (id: string) => {
      let removed: CartItem | undefined;
      setCart((prev) => {
        removed = prev.find((item) => item.id === id);
        return prev.filter((item) => item.id !== id);
      });
      if (removed) {
        pushToast(
          {
            id: `cart-rm-${Date.now()}`,
            type: "cart-remove",
            label: cartItemLabel(removed),
            item: removed,
          },
          8000,
        );
      }
    },
    [pushToast],
  );

  const restoreCartItem = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((row) => row.id === item.id);
      if (existing) {
        return prev.map((row) =>
          row.id === item.id ? { ...row, qty: row.qty + item.qty } : row,
        );
      }
      return [...prev, item];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(1, qty) } : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const setPromoCode = useCallback((code: string | null, percent = 0) => {
    if (!code || percent <= 0) {
      setPromoCodeState(null);
      setPromoPercent(0);
      return;
    }
    setPromoCodeState(code.trim().toUpperCase());
    setPromoPercent(percent);
  }, []);

  const applyPromoCode = useCallback(async (code: string) => {
    const result = await validatePromoCode(code);
    if (!result) {
      setPromoCodeState(null);
      setPromoPercent(0);
      return false;
    }
    setPromoCodeState(result.code);
    setPromoPercent(result.percent);
    return true;
  }, []);

  const placeOrder = useCallback(
    async (input: PlaceOrderInput) => {
      const cartTotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      );
      const discount = promoDiscountFor(cartTotal, promoCode, promoPercent);
      const total = Math.max(0, cartTotal - discount);
      const items: OrderLine[] = cart.map((item) => ({ ...item }));
      const payload = {
        ...input,
        promoCode,
        discount,
        total,
        items,
      };

      let order: StoredOrder = {
        id: `ZG-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        status: "new",
        ...payload,
      };

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = (await res.json()) as { order: StoredOrder };
          if (data.order) order = data.order;
        }
      } catch {
        /* keep local fallback */
      }

      setOrders((prev) => {
        const next = [order, ...prev].slice(0, 40);
        saveOrders(next);
        return next;
      });
      setCart([]);
      setPromoCodeState(null);
      setPromoPercent(0);
      return order;
    },
    [cart, promoCode, promoPercent],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      let added = false;
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          added = true;
        }
        return next;
      });

      if (added) {
        const product = getProductById(id);
        if (product) {
          pushToast({
            id: `fav-add-${Date.now()}`,
            type: "fav-add",
            title: "favAdd",
            subtitle: product.id,
            image: product.images[0] || "",
          });
        }
      }
    },
    [pushToast],
  );

  const isFavorite = useCallback(
    (id: string) => favorites.has(id),
    [favorites],
  );

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const promoDiscount = promoDiscountFor(cartTotal, promoCode, promoPercent);
    const payableTotal = Math.max(0, cartTotal - promoDiscount);
    return {
      cart,
      favorites,
      cartCount,
      favCount: favorites.size,
      cartTotal,
      promoCode,
      promoPercent,
      promoDiscount,
      payableTotal,
      orders,
      toasts,
      addToCart,
      removeFromCart,
      restoreCartItem,
      setQty,
      clearCart,
      setPromoCode,
      applyPromoCode,
      placeOrder,
      toggleFavorite,
      isFavorite,
      dismissToast,
      hydrated,
    };
  }, [
    cart,
    favorites,
    promoCode,
    promoPercent,
    orders,
    toasts,
    addToCart,
    removeFromCart,
    restoreCartItem,
    setQty,
    clearCart,
    setPromoCode,
    applyPromoCode,
    placeOrder,
    toggleFavorite,
    isFavorite,
    dismissToast,
    hydrated,
  ]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
