import type { CSSProperties } from 'react';

export type SkeletonVariant = 'home' | 'list' | 'grid' | 'article' | 'profile' | 'form' | 'status';

const repeat = (n: number) => Array.from({ length: n });

function Bone({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />;
}

function CardBone({ grid = false }: { grid?: boolean }) {
  return (
    <div
      className='rounded-[14px] border p-6'
      style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
    >
      <div className='mb-3 flex gap-2'>
        <Bone className='h-5 w-20 rounded-full' />
        <Bone className='h-5 w-16 rounded-full' />
      </div>
      <Bone className='mb-3 h-6 w-3/4' />
      <Bone className='mb-2 h-4 w-full' />
      <Bone className='mb-4 h-4 w-5/6' />
      {grid ? (
        <div className='flex gap-1.5'>
          {[50, 60, 45].map((w, i) => (
            <Bone key={i} className='h-5 rounded-md' style={{ width: w }} />
          ))}
        </div>
      ) : (
        <Bone className='h-4 w-20' />
      )}
    </div>
  );
}

function GridCardBone() {
  return (
    <div
      className='overflow-hidden rounded-[14px] border transition-all duration-200'
      style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
    >
      <Bone className='h-48 w-full rounded-none' />
      <div className='p-5'>
        <div className='mb-3 flex gap-2'>
          <Bone className='h-5 w-20 rounded-full' />
          <Bone className='h-5 w-16 rounded-full' />
        </div>
        <Bone className='mb-3 h-6 w-3/4' />
        <Bone className='mb-2 h-4 w-full' />
        <Bone className='mb-4 h-4 w-2/3' />
        <div className='flex gap-1.5'>
          {[50, 60, 45].map((w, i) => (
            <Bone key={i} className='h-5 rounded-md' style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonPageHeader({ titleWidth = 'w-40', descWidth = 'w-72' }: { titleWidth?: string; descWidth?: string }) {
  return (
    <div className='mb-10'>
      <Bone className='mb-2 h-3 w-16 rounded-full' />
      <Bone className={`mb-3 h-9 ${titleWidth}`} />
      <Bone className={`h-4 ${descWidth}`} />
    </div>
  );
}

function FilterToolbar({ withSort = false }: { withSort?: boolean }) {
  return (
    <>
      <div className='mb-6 flex gap-3'>
        <Bone className='h-10 flex-1 rounded-[10px]' />
        {withSort && <Bone className='h-10 w-32 rounded-[10px]' />}
      </div>
      <div className='mb-8 flex gap-2'>
        {[60, 80, 70, 55].map((w, i) => (
          <Bone key={i} className='h-8 rounded-[10px]' style={{ width: w }} />
        ))}
      </div>
    </>
  );
}

function HomeSkeleton() {
  return (
    <div className='mx-auto max-w-3xl px-6'>
      <section className='flex flex-col items-center pb-16 pt-12' aria-label='Profile'>
        <div className='avatar-wrapper relative mb-7 h-28 w-28'>
          <div className='absolute inset-[-5px] rounded-full' aria-hidden='true' />
          <Bone className='relative z-10 h-28 w-28 rounded-full' />
        </div>
        <Bone className='mb-1 h-10 w-32' />
        <Bone className='mb-3 h-4 w-20' />
        <Bone className='mb-5 h-6 w-48' />
        <Bone className='mx-auto mb-8 h-20 w-full max-w-lg' />
        <div className='mb-8 flex gap-3'>
          {repeat(5).map((_, i) => <Bone key={i} className='h-9 w-9 rounded-full' />)}
        </div>
        <div className='flex gap-3'>
          <Bone className='h-10 w-36 rounded-[10px]' />
          <Bone className='h-10 w-36 rounded-[10px]' />
        </div>
      </section>

      <section className='mb-16' aria-label='Tech Stack'>
        <div className='mb-10'>
          <Bone className='mb-2 h-3 w-16 rounded-full' />
          <Bone className='mb-3 h-8 w-40' />
          <Bone className='h-4 w-80' />
        </div>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {repeat(8).map((_, i) => <Bone key={i} className='h-14 rounded-[14px]' />)}
        </div>
      </section>

      <section className='mb-16' aria-label='Featured Projects'>
        <div className='mb-10'>
          <Bone className='mb-2 h-3 w-12 rounded-full' />
          <div className='flex items-end justify-between gap-4'>
            <Bone className='h-8 w-48' />
            <Bone className='h-4 w-28' />
          </div>
        </div>
        <div className='grid gap-5 sm:grid-cols-2'>
          {repeat(2).map((_, i) => <GridCardBone key={i} />)}
        </div>
      </section>

      <section className='mb-16' aria-label='Latest Articles'>
        <div className='mb-10'>
          <Bone className='mb-2 h-3 w-12 rounded-full' />
          <div className='flex items-end justify-between gap-4'>
            <Bone className='h-8 w-44' />
            <Bone className='h-4 w-28' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          {repeat(3).map((_, i) => <CardBone key={i} />)}
        </div>
      </section>

      <section
        className='mb-20 rounded-[14px] border p-8 text-center'
        aria-label='Contact call to action'
        style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
      >
        <i className='bi bi-chat-heart mb-4 block text-4xl' style={{ color: 'var(--accent)' }} aria-hidden='true' />
        <Bone className='mx-auto mb-2 h-7 w-48' />
        <Bone className='mx-auto mb-6 h-4 w-full max-w-sm' />
        <Bone className='mx-auto h-11 w-28 rounded-[10px]' />
      </section>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-12'>
      <SkeletonPageHeader titleWidth='w-32' />
      <FilterToolbar withSort />
      <div className='flex flex-col gap-5'>
        {repeat(4).map((_, i) => <CardBone key={i} />)}
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-12'>
      <SkeletonPageHeader titleWidth='w-40' descWidth='w-96' />
      <FilterToolbar />
      <div className='grid gap-5 sm:grid-cols-2'>
        {repeat(4).map((_, i) => <GridCardBone key={i} />)}
      </div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-12'>
      <Bone className='mb-8 h-4 w-28' />
      <div className='mb-4 flex gap-2'>
        <Bone className='h-6 w-20 rounded-full' />
        <Bone className='h-6 w-24 rounded-full' />
      </div>
      <Bone className='mb-3 h-12 w-full' />
      <Bone className='mb-2 h-12 w-4/5' />
      <Bone className='mb-6 h-5 w-full max-w-xl' />
      <Bone className='mb-10 h-64 w-full rounded-[14px]' />
      <div className='flex flex-col gap-3'>
        {[100, 90, 100, 75].map((w, i) => (
          <Bone key={i} className='h-4' style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-12'>
      <div className='mb-12'>
        <Bone className='mb-2 h-3 w-12 rounded-full' />
        <Bone className='mb-4 h-10 w-64' />
        <Bone className='h-5 w-full max-w-xl' />
      </div>

      <div
        className='mb-16 flex flex-col items-center gap-6 rounded-[14px] border p-6 sm:flex-row sm:items-start'
        style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
      >
        <Bone className='h-24 w-24 flex-shrink-0 rounded-full border' style={{ borderColor: 'var(--border)' }} />
        <div className='flex-1'>
          <Bone className='mb-1 h-6 w-32' />
          <Bone className='mb-3 h-4 w-20' />
          <div className='mt-3 flex flex-wrap gap-2'>
            {repeat(4).map((_, i) => (
              <Bone key={i} className='h-6 rounded-full' style={{ width: 70 + i * 15 }} />
            ))}
          </div>
        </div>
      </div>

      {['Timeline', 'Education'].map((section) => (
        <section key={section} className='mb-16'>
          <div className='mb-6 flex items-center gap-2'>
            <i className='bi text-xl' style={{ color: 'var(--accent)', width: '24px' }} aria-hidden='true' />
            <Bone className='h-8 w-32' />
          </div>
          <div className='flex flex-col gap-4'>
            {repeat(3).map((_, i) => (
              <div key={i} className='rounded-[14px] border p-5' style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}>
                <Bone className='mb-1 h-3 w-16 rounded-full' />
                <Bone className='mb-2 h-5 w-48' />
                <Bone className='h-4 w-full' />
                <Bone className='mt-1 h-4 w-5/6' />
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className='mb-12'>
        <Bone className='mb-6 h-8 w-32' />
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {repeat(8).map((_, i) => <Bone key={i} className='h-14 rounded-[14px]' />)}
        </div>
      </section>

      <div className='flex flex-wrap gap-3 border-t pt-12' style={{ borderColor: 'var(--border)' }}>
        <Bone className='h-10 w-32 rounded-[10px]' />
        <Bone className='h-10 w-32 rounded-[10px]' />
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-12'>
      <SkeletonPageHeader titleWidth='w-40' descWidth='w-full max-w-lg' />
      <div className='grid gap-8 sm:grid-cols-5'>
        <aside className='sm:col-span-2' aria-label='Social media links'>
          <Bone className='mb-4 h-6 w-32' />
          <div className='space-y-3'>
            {repeat(5).map((_, i) => (
              <div key={i} className='rounded-[10px] border p-3' style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className='flex items-center gap-2'>
                  <Bone className='h-5 w-5 rounded' />
                  <Bone className='h-4 w-24' />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className='sm:col-span-3'>
          <div
            className='rounded-[14px] border p-6'
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
          >
            <Bone className='mb-5 h-6 w-32' />
            <div className='grid gap-5 sm:grid-cols-2'>
              {['Name', 'Email'].map((f) => (
                <div key={f}>
                  <Bone className='mb-2 h-4 w-12' />
                  <Bone className='h-10 w-full rounded-[10px]' />
                </div>
              ))}
            </div>
            <div className='mt-5'>
              <Bone className='mb-2 h-4 w-16' />
              <Bone className='h-10 w-full rounded-[10px]' />
            </div>
            <div className='mt-5'>
              <Bone className='mb-2 h-4 w-20' />
              <Bone className='h-36 w-full rounded-[10px]' />
            </div>
            <Bone className='mt-5 h-10 w-28 rounded-[10px]' />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusSkeleton() {
  return (
    <div className='mx-auto max-w-2xl space-y-12 px-6 py-20'>
      <SkeletonPageHeader />
      <CardBone />
      <div className='grid gap-3 md:grid-cols-2'>
        {repeat(4).map((_, i) => <CardBone key={i} grid />)}
      </div>
    </div>
  );
}

const SKELETONS: Record<SkeletonVariant, () => JSX.Element> = {
  home:    HomeSkeleton,
  list:    ListSkeleton,
  grid:    GridSkeleton,
  article: ArticleSkeleton,
  profile: ProfileSkeleton,
  form:    FormSkeleton,
  status:  StatusSkeleton,
};

export function PageSkeleton({ variant = 'list' }: { variant?: SkeletonVariant }) {
  const Render = SKELETONS[variant];
  return (
    <div aria-busy='true' aria-label='Loading…'>
      <Render />
    </div>
  );
}
