import { tickerItems } from "@/data/products";

export function Ticker() {
  const doubled = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {doubled.map((text, i) => (
          <span key={`${text}-${i}`} className="ticker__item">
            {text} /
          </span>
        ))}
      </div>
    </div>
  );
}
