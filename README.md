# HostelX — Smart Hostel Management System
Pixel Wizard · techFEST'26 @ SLIET · React + Vite + Tailwind + React Router + Lucide

## Run
```bash
npm install
npm run dev
```

## Rules (read once)
- **Never commit to `main`.** Branch as `jai/<feature>` or `teammate/<feature>`; PR into `main`.
- `git fetch && git rebase origin/main` before starting and before every PR.
- **Every file has one owner.** Need a change in someone else's file? Ask, or send a tiny PR touching only that file.
- Import primitives from one place: `import { Button, Card } from '../components/common'`
- Toasts: `const toast = useToast(); toast.success('Saved')`
- Persisted state: `useLocalStorage('key', initial)` (all keys prefixed `hostelx:`; `resetDemoData()` clears them)
- Colours/tokens live only in `tailwind.config.js`. Use `brand-*`, `ink`, `surface`; no random hex values.

## Component API cheat-sheet
| Component | Key props |
|---|---|
| Button | `variant` primary/secondary/soft/ghost/danger/success · `size` sm/md/lg · `icon` · `loading` · `as={Link}` |
| Card / CardHeader | `hover` · `padded` / `title` `subtitle` `action` |
| Badge | `tone` neutral/brand/success/warning/danger/info · `dot` · `icon` |
| StatusBadge | `status` (complaint, priority, announcement, poll, suggestion, room statuses) |
| Input / Select | `label` `error` `hint` `icon` `multiline` / `options` `placeholder` |
| SearchBar | `value` `onChange(string)` `placeholder` |
| Modal | `open` `onClose` `title` `size` `footer` |
| ProgressBar | `value`(0–100) `tone` `label` `showValue` `height` |
| StatCard | `label` `value` `icon` `tone` `hint` |
| EmptyState / ErrorState / LoadingSpinner | `title` `message` `action` / `message` `onRetry` / `label` |
| Avatar | `name` `size` |

## Deploy
Connect repo to Vercel (framework: Vite). `vercel.json` already rewrites all routes to `index.html`.
