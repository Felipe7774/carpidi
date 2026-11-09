import { CSSProperties, ReactNode } from 'react';

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
};

export function Skeleton({ className = '', style, 'aria-label': ariaLabel = 'Cargando' }: SkeletonProps) {
  return <span className={`skeleton ${className}`.trim()} style={style} aria-label={ariaLabel} aria-hidden="true" />;
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="products-grid" role="status" aria-label="Cargando catálogo">
      {Array.from({ length: count }, (_, index) => (
        <article className="product-card-stitch skeleton-card" key={index}>
          <Skeleton className="skeleton-product-image" />
          <div className="product-meta">
            <Skeleton className="skeleton-line skeleton-line-short" />
            <Skeleton className="skeleton-line skeleton-line-title" />
            <Skeleton className="skeleton-line skeleton-line-price" />
          </div>
          <div className="skeleton-actions">
            <Skeleton className="skeleton-button" />
            <Skeleton className="skeleton-button" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function RetryAlert({ message, onRetry, children }: { message?: string; onRetry: () => void; children?: ReactNode }) {
  return (
    <div className="alert-error alert-with-action" role="alert">
      <span>{children ?? message}</span>
      <button type="button" className="retry-button" onClick={onRetry}>Reintentar</button>
    </div>
  );
}
