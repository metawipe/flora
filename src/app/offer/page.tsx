import { OfferContent } from "@/components/OfferContent";
import { site } from "@/data/products";

export const metadata = {
  title: `Публичная оферта | ${site.name}`,
  description:
    "Публичная оферта на заказ и доставку цветов Zamin Gullari по Ташкенту.",
};

export default function OfferPage() {
  return <OfferContent />;
}
