/**
 * src/components/ui/PageSkeleton.tsx
 *
 * Universal skeleton loading component used by every loading.tsx in the app.
 *
 * Variants:
 *   'home'     – hero + stats + two content sections (home page)
 *   'list'     – header + search/filter toolbar + stacked card list (blog)
 *   'grid'     – header + search/filter toolbar + 2-column card grid (projects)
 *   'article'  – hero header + wide prose block (blog/project detail)
 *   'profile'  – avatar card + two timeline sections + tech grid (about)
 *   'form'     – header + contact form fields (contact)
 */

export type PageSkeletonVariant =
  | 'home'
  | 'list'
  | 'grid'
  | 'article'
  | 'profile'
  | 'form';

interface PageSkeletonProps {
  variant?: PageSkeletonVariant;
}

// ─── Small re-usable skeleton primitives ──────────────────────

function Bone({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />;
}

function CardBone({ grid = false }: { grid?: boolean }) {
  return (
    <div
      className="rounded-[14px] border p-6"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="mb-3 flex gap-2">
        <Bone className="h-5 w-20 rounded-full" />
        <Bone className="h-5 w-16 rounded-full" />
      </div>
      <Bone className="mb-2 h-6 w-3/4" />
      <Bone className="mb-1 h-4 w-full" />
      <Bone className="mb-4 h-4 w-5/6" />
      {grid ? (
        <div className="flex gap-1.5">
          {[50, 60, 45].map((w, i) => (
            <Bone key={i} className="h-5 rounded-md" style={{ width: w }} />
          ))}
        </div>
      ) : (
        <Bone className="h-4 w-20" />
      )}
    </div>
  );
}

function GridCardBone() {
  return (
    <div
      className="overflow-hidden rounded-[14px] border"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <Bone className="h-48 w-full rounded-none" />
      <div className="p-5">
        <div className="mb-3 flex gap-2">
          <Bone className="h-5 w-20 rounded-full" />
        </div>
        <Bone className="mb-2 h-5 w-3/4" />
        <Bone className="mb-1 h-4 w-full" />
        <Bone className="mb-4 h-4 w-2/3" />
        <div className="flex gap-1.5">
          {[50, 60, 45].map((w, i) => (
            <Bone key={i} className="h-5 rounded-md" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PageHeader({
  titleWidth = 'w-40',
  descWidth = 'w-72',
}: {
  titleWidth?: string;
  descWidth?: string;
}) {
  return (
    <div className="mb-10">
      <Bone className="mb-2 h-3 w-16 rounded-full" />
      <Bone className={`mb-3 h-9 ${titleWidth}`} />
      <Bone className={`h-4 ${descWidth}`} />
    </div>
  );
}

function FilterToolbar({ withSort = false }: { withSort?: boolean }) {
  return (
    <>
      <div className="mb-6 flex gap-3">
        <Bone className="h-10 flex-1 rounded-[10px]" />
        {withSort && <Bone className="h-10 w-32 rounded-[10px]" />}
      </div>
      <div className="mb-8 flex gap-2">
        {[60, 80, 70, 55].map((w, i) => (
          <Bone key={i} className="h-8 rounded-[10px]" style={{ width: w }} />
        ))}
      </div>
    </>
  );
}

// ─── Variant renderers ────────────────────────────────────────

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6">
      {/* Hero */}
      <section className="flex flex-col items-center pb-16 pt-12">
        <Bone className="mb-7 h-28 w-28 rounded-full" />
        <Bone className="mb-1 h-10 w-32" />
        <Bone className="mb-3 h-4 w-20" />
        <Bone className="mb-5 h-6 w-48" />
        <Bone className="mx-auto mb-8 h-16 w-full max-w-lg" />
        <div className="flex gap-3">
          {[40, 40, 36, 36, 36].map((w, i) => (
            <Bone key={i} className="h-9 w-9 rounded-full" />
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          <Bone className="h-10 w-36 rounded-[10px]" />
          <Bone className="h-10 w-36 rounded-[10px]" />
        </div>
      </section>

      {/* Tech stack section */}
      <section className="mb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <Bone className="mb-1 h-3 w-12 rounded-full" />
            <Bone className="h-7 w-28" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Bone key={i} className="h-14 rounded-[14px]" />
          ))}
        </div>
      </section>

      {/* Featured projects section */}
      <section className="mb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <Bone className="mb-1 h-3 w-10 rounded-full" />
            <Bone className="h-7 w-40" />
          </div>
          <Bone className="h-4 w-24" />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <GridCardBone />
          <GridCardBone />
        </div>
      </section>

      {/* Latest articles section */}
      <section className="mb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <Bone className="mb-1 h-3 w-14 rounded-full" />
            <Bone className="h-7 w-36" />
          </div>
          <Bone className="h-4 w-20" />
        </div>
        <div className="mt-6 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardBone key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PageHeader titleWidth="w-40" descWidth="w-72" />
      <FilterToolbar withSort />
      <div className="flex flex-col gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardBone key={i} />
        ))}
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PageHeader titleWidth="w-36" descWidth="w-64" />
      <FilterToolbar />
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <GridCardBone key={i} />
        ))}
      </div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Back link */}
      <Bone className="mb-8 h-4 w-28" />

      {/* Meta badges */}
      <div className="mb-4 flex gap-2">
        <Bone className="h-6 w-20 rounded-full" />
        <Bone className="h-6 w-24 rounded-full" />
      </div>

      {/* Title */}
      <Bone className="mb-3 h-12 w-full" />
      <Bone className="mb-2 h-12 w-4/5" />

      {/* Description */}
      <Bone className="mb-6 h-5 w-full max-w-xl" />

      {/* Author row */}
      <div className="mb-10 flex items-center gap-3">
        <Bone className="h-9 w-9 rounded-full" />
        <div>
          <Bone className="mb-1 h-4 w-24" />
          <Bone className="h-3 w-36" />
        </div>
      </div>

      {/* Cover image placeholder */}
      <Bone className="mb-10 h-64 w-full rounded-[14px]" />

      {/* Prose */}
      <div className="flex flex-col gap-3">
        {[100, 90, 100, 75, 100, 85, 60].map((w, i) => (
          <Bone key={i} className="h-4" style={{ width: `${w}%` }} />
        ))}
        <div className="my-2" />
        {[100, 95, 100, 80].map((w, i) => (
          <Bone key={i} className="h-4" style={{ width: `${w}%` }} />
        ))}
        <div className="my-2" />
        {[100, 70, 100, 88, 55].map((w, i) => (
          <Bone key={i} className="h-4" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Page heading */}
      <div className="mb-12">
        <Bone className="mb-2 h-3 w-12 rounded-full" />
        <Bone className="mb-4 h-11 w-64" />
        <Bone className="h-16 w-full max-w-xl" />
      </div>

      {/* Profile card */}
      <div
        className="mb-16 flex flex-col items-center gap-6 rounded-[14px] border p-6 sm:flex-row sm:items-start"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <Bone className="h-24 w-24 flex-shrink-0 rounded-full" />
        <div className="flex-1">
          <Bone className="mb-1 h-6 w-32" />
          <Bone className="mb-3 h-4 w-20" />
          <div className="flex flex-wrap gap-2">
            {[80, 100, 90, 110].map((w, i) => (
              <Bone key={i} className="h-6 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {['Timeline', 'Education'].map((section) => (
        <section key={section} className="mb-16">
          <div className="mb-6 flex items-center gap-2">
            <Bone className="h-6 w-6 rounded" />
            <Bone className="h-7 w-32" />
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[14px] border p-5"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <Bone className="mb-1 h-3 w-16 rounded-full" />
                <Bone className="mb-2 h-5 w-48" />
                <Bone className="h-4 w-full" />
                <Bone className="mt-1 h-4 w-4/5" />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Tech stack */}
      <section className="mb-12">
        <Bone className="mb-6 h-8 w-28" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Bone key={i} className="h-14 rounded-[14px]" />
          ))}
        </div>
      </section>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PageHeader titleWidth="w-32" descWidth="w-80" />

      {/* Contact info chips */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[120, 140, 110].map((w, i) => (
          <Bone key={i} className="h-9 rounded-[10px]" style={{ width: w }} />
        ))}
      </div>

      {/* Form card */}
      <div
        className="rounded-[14px] border p-6"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Bone className="mb-2 h-4 w-12" />
            <Bone className="h-11 w-full rounded-[10px]" />
          </div>
          <div>
            <Bone className="mb-2 h-4 w-14" />
            <Bone className="h-11 w-full rounded-[10px]" />
          </div>
        </div>
        <div className="mt-5">
          <Bone className="mb-2 h-4 w-16" />
          <Bone className="h-11 w-full rounded-[10px]" />
        </div>
        <div className="mt-5">
          <Bone className="mb-2 h-4 w-20" />
          <Bone className="h-36 w-full rounded-[10px]" />
        </div>
        <Bone className="mt-5 h-11 w-36 rounded-[10px]" />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────

const VARIANTS: Record<PageSkeletonVariant, () => JSX.Element> = {
  home:    HomeSkeleton,
  list:    ListSkeleton,
  grid:    GridSkeleton,
  article: ArticleSkeleton,
  profile: ProfileSkeleton,
  form:    FormSkeleton,
};

export function PageSkeleton({ variant = 'list' }: PageSkeletonProps) {
  const Render = VARIANTS[variant];
  return (
    <div aria-busy="true" aria-label="Loading…">
      <Render />
    </div>
  );
}
