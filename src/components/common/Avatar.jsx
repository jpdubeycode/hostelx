import { cn } from '../../utils/cn'

const palette = ['bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700']
const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-xl' }

/** Initials avatar (no images needed). Colour is stable per name. */
export default function Avatar({ name = '?', size = 'md', className }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const color = palette[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length]
  return <div className={cn('flex shrink-0 items-center justify-center rounded-full font-semibold', color, sizes[size], className)} aria-hidden>{initials}</div>
}
