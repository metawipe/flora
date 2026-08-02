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
import { getProductById, type Product } from "@/data/products";

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

type StoreContextValue = {
  cart: CartItem[];
  favorites: Set<string>;
  cartCount: number;
  favCount: number;
  cartTotal: number;
  toasts: StoreToast[];
  addToCart: (product: Product, size?: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  restoreCartItem: (item: CartItem) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  dismissToast: (id: string) => void;
  hydrated: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "loveflowers-cart";
const FAV_KEY = "loveflowers-favorites";
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

export function cartItemLabel(item: Pick<CartItem, "name" | "size">): string {
  if (!item.size || item.size === "—" || item.size === "Без упаковки") {
    return item.name;
  }
  return `${item.name} - ${item.size}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
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
    setCart(loadJson<CartItem[]>(CART_KEY, []));
    setFavorites(new Set(loadJson<string[]>(FAV_KEY, [])));
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
        title: "В корзине",
        subtitle: cartItemLabel({ name: product.name, size }),
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
            title: "В избранном",
            subtitle: product.name,
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
    return {
      cart,
      favorites,
      cartCount,
      favCount: favorites.size,
      cartTotal,
      toasts,
      addToCart,
      removeFromCart,
      restoreCartItem,
      setQty,
      clearCart,
      toggleFavorite,
      isFavorite,
      dismissToast,
      hydrated,
    };
  }, [
    cart,
    favorites,
    toasts,
    addToCart,
    removeFromCart,
    restoreCartItem,
    setQty,
    clearCart,
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
