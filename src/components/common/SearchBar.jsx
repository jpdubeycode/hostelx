import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Controlled: <SearchBar value={q} onChange={setQ} placeholder="..." /> (onChange receives the string) */
export default function SearchBar({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ink-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-xl border border-surface-border bg-white pl-10 pr-9 text-sm placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-2.5 top-2.5 rounded-md p-0.5 text-ink-muted hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
