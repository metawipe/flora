import { PrivacyContent } from "@/components/PrivacyContent";
import { site } from "@/data/products";

export const metadata = {
  title: `Политика конфиденциальности | ${site.name}`,
  description:
    "Как Zamin Gullari обрабатывает персональные данные при оформлении и доставке заказов.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
