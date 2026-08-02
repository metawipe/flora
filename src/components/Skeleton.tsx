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
        <div className="basket-card__info">
          <Skeleton className="skel--line skel--w70 skel--h18" />
          <Skeleton className="skel--chip skel--mt" />
        </div>
        <div className="basket-card__bottom">
          <Skeleton className="skel--pill" />
          <div className="basket-card__prices">
            <Skeleton className="skel--line skel--w45 skel--h18" />
            <Skeleton className="skel--line skel--w35 skel--mt" />
          </div>
        </div>
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
        <div className="cart-layout">
          <div className="cart-panel">
            <header className="cart-panel__head">
              <Skeleton className="skel--line skel--w30 skel--h22" />
              <Skeleton className="skel--line skel--w25" style={{ height: 14 }} />
            </header>
            <div className="cart-list">
              <BasketItemSkeleton />
              <BasketItemSkeleton />
              <BasketItemSkeleton />
            </div>
          </div>
          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <div className="cart-summary__row">
                <Skeleton className="skel--line skel--w25" />
                <Skeleton className="skel--line skel--w40" />
              </div>
              <div className="cart-summary__row">
                <Skeleton className="skel--line skel--w30" />
                <Skeleton className="skel--line skel--w25" />
              </div>
              <div className="cart-summary__total">
                <Skeleton className="skel--line skel--w30 skel--h20" />
                <Skeleton className="skel--line skel--w45 skel--h20" />
              </div>
              <Skeleton className="skel--block" style={{ height: 44 }} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function FieldSkeleton({ wideLabel = false }: { wideLabel?: boolean }) {
  return (
    <div className="field" aria-hidden>
      <Skeleton
        className={`skel--line ${wideLabel ? "skel--w45" : "skel--w30"}`}
        style={{ height: 12 }}
      />
      <Skeleton className="skel--input skel--mt" />
    </div>
  );
}

export function FavoritesSkeleton() {
  return (
    <main className="page-main" aria-busy="true">
      <div className="container">
        <Skeleton className="skel--line skel--w35" style={{ height: 14 }} />
        <Skeleton className="skel--line skel--w40 skel--h22 skel--mt-lg" />
        <div className="account-layout" style={{ marginTop: 20 }}>
          <div className="account-content">
            <ProductGridSkeleton count={4} />
          </div>
        </div>
      </div>
    </main>
  );
}

export function ProfileSkeleton() {
  return (
    <main className="page-main" aria-busy="true">
      <div className="container">
        <Skeleton className="skel--line skel--w35" style={{ height: 14 }} />
        <Skeleton className="skel--line skel--w40 skel--h22 skel--mt-lg" />
        <div className="account-layout" style={{ marginTop: 20 }}>
          <div className="account-content">
            <div className="profile-form">
              <div className="profile-form__grid">
                <FieldSkeleton />
                <FieldSkeleton />
              </div>
              <FieldSkeleton wideLabel />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton wideLabel />
              <Skeleton className="skel--btn skel--mt-lg" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function AccountSkeleton() {
  return (
    <main className="page-main" aria-busy="true">
      <div className="container">
        <Skeleton className="skel--line skel--w25" style={{ height: 14 }} />
        <Skeleton className="skel--line skel--w35 skel--h22 skel--mt-lg" />
        <Skeleton
          className="skel--line skel--w60 skel--mt"
          style={{ height: 14, maxWidth: 280 }}
        />
        <div className="cabinet-grid" style={{ marginTop: 24 }}>
          <div className="cabinet-card cabinet-card--wide" aria-hidden>
            <Skeleton className="skel--line skel--w25" style={{ height: 12 }} />
            <Skeleton
              className="skel--line skel--w40 skel--mt-lg"
              style={{ height: 28 }}
            />
            <div className="cabinet-card__bottom">
              <div style={{ width: "45%" }}>
                <Skeleton className="skel--line skel--w80" />
                <Skeleton className="skel--line skel--w60 skel--mt" />
              </div>
              <Skeleton className="skel--pill" style={{ width: 72, height: 30 }} />
            </div>
          </div>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="cabinet-tile" aria-hidden>
              <Skeleton
                className="skel--mt"
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
              <Skeleton
                className="skel--line skel--w70"
                style={{ marginTop: "auto", height: 14 }}
              />
              <Skeleton className="skel--line skel--w50 skel--mt" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function LegalSectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <section className="legal__section" aria-hidden>
      <Skeleton className="skel--line skel--w40 skel--h18" />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={`skel--line skel--mt ${i === lines - 1 ? "skel--w60" : "skel--w80"}`}
          style={{ height: 12 }}
        />
      ))}
    </section>
  );
}

export function PrivacySkeleton() {
  return (
    <main className="page-main" aria-busy="true">
      <div className="container legal">
        <Skeleton className="skel--line skel--w35" style={{ height: 14 }} />
        <Skeleton className="skel--line skel--w55 skel--h22 skel--mt-lg" />
        <div className="legal__lead">
          <Skeleton className="skel--line skel--w80" style={{ height: 12 }} />
          <Skeleton
            className="skel--line skel--w70 skel--mt"
            style={{ height: 12 }}
          />
        </div>
        <LegalSectionSkeleton lines={3} />
        <LegalSectionSkeleton lines={5} />
        <LegalSectionSkeleton lines={2} />
        <LegalSectionSkeleton lines={3} />
      </div>
    </main>
  );
}
