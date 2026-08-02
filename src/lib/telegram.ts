import type { StoreOrder } from "@/lib/store/types";

export async function notifyOrderTelegram(order: StoreOrder) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false as const, skipped: true };

  const lines = [
    `🌸 Новый заказ ${order.id}`,
    `💰 ${order.total.toLocaleString("ru-RU")} сум`,
    `👤 ${order.name} · ${order.phone}`,
    `📍 ${order.address}`,
    `📅 ${order.date} · ${order.slot}`,
    order.recipient ? `🎁 Получатель: ${order.recipient}` : null,
    order.cardText ? `✉️ Открытка: ${order.cardText}` : null,
    order.comment ? `💬 ${order.comment}` : null,
    "",
    ...order.items.map(
      (i) => `• ${i.name} (${i.size}) × ${i.qty} — ${i.price * i.qty}`,
    ),
  ].filter(Boolean);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
    }),
  });

  return { ok: res.ok, skipped: false as const };
}
