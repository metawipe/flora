"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

type StoreContextValue = {
  cart: CartItem[];
  favorites: Set<string>;
  cartCount: number;
  favCount: number;
  cartTotal: number;
  addToCart: (product: Product, size?: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  hydrated: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "uzflora-cart";
const FAV_KEY = "uzflora-favorites";

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

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
    },
    [],
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
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

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

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
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      toggleFavorite,
      isFavorite,
      hydrated,
    };
  }, [
    cart,
    favorites,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    toggleFavorite,
    isFavorite,
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
