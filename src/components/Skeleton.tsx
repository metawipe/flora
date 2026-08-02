import type { CSSProperties } from "react";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <span
      className={`skel${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <article
      className={`product-card product-card--skel${compact ? " product-card--compact" : ""}`}
      aria-hidden
    >
      <div className="product-card__media">
        <Skeleton className="skel--fill skel--media" />
      </div>
      <div className="product-card__info">
        <Skeleton className="skel--line skel--w80" />
        <Skeleton className="skel--line skel--w45 skel--mt" />
      </div>
    </article>
  );
}

export function ProductShelfSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="product-shelf" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} compact />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="product-grid" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CollectionsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="collections-grid" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="collection-card collection-card--skel">
          <span className="collection-card__media">
            <Skeleton className="skel--fill skel--media" />
          </span>
          <Skeleton className="skel--line skel--w60" />
        </div>
      ))}
    </div>
  );
}

export function BasketItemSkeleton() {
  return (
    <article className="basket-card basket-card--skel" aria-hidden>
      <div className="basket-card__img">
        <Skeleton className="skel--fill skel--media" />
      </div>
      <div className="basket-card__body">
        <Skeleton className="skel--line skel--w70" />
        <Skeleton className="skel--line skel--w40 skel--mt" />
        <Skeleton className="skel--pill skel--mt" />
      </div>
    </article>
  );
}

export function PdpSkeleton() {
  return (
    <main className="page-main page-main--pdp" aria-busy="true">
      <div className="container pdp-container">
        <div className="pdp">
          <div className="pdp-bleed">
            <div className="pdp__gallery">
              <div className="pdp__album">
                <div className="pdp__shot">
                  <Skeleton className="skel--fill skel--media" />
                </div>
              </div>
            </div>
          </div>
          <aside className="pdp__panel">
            <div className="pdp__panel-inner">
              <Skeleton className="skel--line skel--w60 skel--h20" />
              <Skeleton className="skel--line skel--w35 skel--h24 skel--mt" />
              <Skeleton className="skel--block skel--mt-lg" />
              <Skeleton className="skel--btn skel--mt-lg" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export function HomeSkeleton() {
  return (
    <main className="home-app" aria-busy="true">
      <section className="home-occasions">
        <div className="container">
          <div className="section__head">
            <Skeleton className="skel--line skel--w30 skel--h18" />
          </div>
          <div className="home-occasions__row">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="home-occasion" aria-hidden>
                <span className="home-occasion__ring">
                  <Skeleton className="skel--fill skel--media" />
                </span>
                <Skeleton className="skel--line skel--w80" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section__head">
            <Skeleton className="skel--line skel--w25 skel--h18" />
          </div>
          <CollectionsSkeleton />
        </div>
      </section>
      <section className="section section--shelf">
        <div className="container">
          <div className="section__head">
            <Skeleton className="skel--line skel--w30 skel--h18" />
          </div>
          <ProductShelfSkeleton />
        </div>
      </section>
    </main>
  );
}

export function CatalogSkeleton() {
  return (
    <main className="page-main" aria-busy="true">
      <div className="container">
        <Skeleton className="skel--line skel--w40 skel--h22" />
        <div style={{ height: 16 }} />
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}

export function CartSkeleton() {
  return (
    <main className="page-main page-main--cart" aria-busy="true">
      <div className="container cart-page">
        <Skeleton className="skel--line skel--w30 skel--h22" />
        <div className="cart-layout" style={{ marginTop: 16 }}>
          <div className="cart-list">
            <BasketItemSkeleton />
            <BasketItemSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
