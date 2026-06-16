'use client';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }: SearchInputProps) {
  return (
    <div className='relative'>
      <i className='bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-sm' style={{ color: 'var(--faint)' }} aria-hidden='true' />
      <input
        type='search'
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 200))}
        placeholder={placeholder}
        aria-label='Search'
        autoComplete='off'
        spellCheck={false}
        className='search-input w-full rounded-[10px] border py-2.5 pl-9 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-[var(--faint)]'
        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--fg)' }}
      />
    </div>
  );
}
