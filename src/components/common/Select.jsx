import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { fieldBase } from './Input'

/** options: array of strings or { value, label } */
export default function Select({ label, error, options = [], placeholder, className, ...props }) {
  const id = useId()
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>}
      <div className="relative">
        <select id={id} className={cn(fieldBase, 'h-10 appearance-none pr-9', error ? 'border-rose-400' : 'border-surface-border')} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o
            return <option key={opt.value} value={opt.value}>{opt.label}</option>
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-ink-muted" />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
