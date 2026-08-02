import type { Locale } from "../config";
import type { MessageTree } from "./types";
import { en } from "./en";
import { ru } from "./ru";
import { uz } from "./uz";

export const messages: Record<Locale, MessageTree> = { ru, uz, en };

export function getMessage(
  tree: MessageTree,
  key: string,
): string | undefined {
  const parts = key.split(".");
  let node: string | MessageTree | undefined = tree;
  for (const part of parts) {
    if (!node || typeof node === "string") return undefined;
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

export function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] !== undefined ? String(vars[name]) : `{${name}}`,
  );
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const value =
    getMessage(messages[locale], key) ??
    getMessage(messages.ru, key) ??
    key;
  return interpolate(value, vars);
}
