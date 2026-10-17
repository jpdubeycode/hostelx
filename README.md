# HostelX — Smart Hostel Management System

> A student-centric hostel platform that solves real problems faced by hostel residents, while giving wardens an efficient management dashboard.

Built for **Pixel Wizard — techFEST'26 @ SLIET** (24-hour frontend hackathon) · Problem statement: **Hostel Management System**

**Live demo:** https://hostelx-three.vercel.app

---

## What makes HostelX different

Most hostel systems are CRUD tables for the warden. HostelX is built around what residents actually deal with, and our biggest idea comes straight from our own hostel:

### Mess Committee + Student Voting

The mess committee represents students and makes decisions through polls, using a full participation workflow:

```text
Student Suggestion → Committee Review → Approved → Poll Created
        → Students Vote → Poll Closed → Result → Decision Published
```

Students suggest ideas ("Friday dinner should include South Indian food"), the committee turns the good ones into polls, everyone votes, and the published decision is visible to the whole hostel.

---

## Roles (demo login, no password needed)

| Role | What they can do |
|---|---|
| **Student** | Dashboard, room and roommates, raise and track complaints, mess menu, vote in polls, submit suggestions, announcements, rules, limited-info student/room search |
| **Admin / Warden** | Dashboard with stats, full student profiles, room allocation and occupancy, complaint management, mess, announcements, rules, full-info search |
| **Mess Committee** | Create and close polls, review suggestions, convert suggestions into polls, publish decisions. Committee members keep full student access via **Student view** |

**Privacy by design:** students never see another student's phone, email, guardian details, fees or complaint history. This is enforced in one place (`utils/permissions.js`) and the UI renders by role.

---

## Features

- **Role-based experience:** separate layouts, navigation and dashboards for each role, with route guards.
- **Complaint tracking:** categories, priority, and a visual `Submitted → Assigned → In Progress → Resolved` timeline. Admin can filter, assign and update status.
- **Room management:** visual room cards with occupancy, capacity and status (Full / Partial / Empty). Occupancy is derived from student data, never duplicated.
- **Mess module:** today's and weekly menu as food cards, special meals, and feedback.
- **Polls and decisions:** live progress bars, vote percentages, turnout, countdown, closed state with the winner and the committee's decision.
- **Announcements:** priority indicators (Emergency / Important / Normal), categories and pinned notices.
- **Rules and regulations:** accordion sections with search, category filters and an "important rules" section.
- **Search:** by name, registration number, room or branch. Students see public fields only; admin sees the full profile.
- **Polished UX states:** loading, empty, success (toasts) and error states across modules.
- **Responsive:** sidebar on desktop, floating bottom navigation with a "More" sheet on mobile, tables that become cards, bottom-sheet modals.
- **Accessible:** semantic HTML, labelled inputs, keyboard-friendly controls, skip-to-content link, reduced-motion support.

---

## Tech stack

React 18 · Vite · JavaScript · Tailwind CSS 3 · React Router v6 · lucide-react

No backend. Data is mock data seeded from `src/data/` and persisted in the browser with `localStorage`. No UI libraries and no chart libraries: charts and progress visuals are hand-built with CSS/SVG to keep the bundle small.

---

## Getting started

```bash
git clone <repo-url>
cd hostelx
npm install
npm run dev
```

Open the app, pick a role on the login screen, and explore. Use **Reset demo data** (login page, or the profile menu) to restore the original mock data at any time.

```bash
npm run build     # production build
npm run preview   # preview the build locally
```

### Suggested demo path (about 3 minutes)

1. **Student:** raise a complaint, then submit a mess suggestion.
2. **Mess Committee:** approve the suggestion, create a poll from it, and watch it go live.
3. **Student:** vote in the poll.
4. **Mess Committee:** close the poll and publish the decision.
5. **Admin:** assign the complaint and move its status forward, then check the dashboard and student search.
6. **Student:** see the updated complaint timeline and the published decision.

---

## Project structure

```text
src/
├── components/
│   ├── common/          Reusable primitives (Button, Card, Modal, Badge, StatusBadge, Input, …)
│   ├── layout/          AppShell, Sidebar, Topbar, BottomNav, ProfileMenu, Logo, PageHeader
│   ├── dashboard/       HeroBanner and dashboard widgets
│   ├── charts/          Hand-built SVG/CSS charts
│   ├── complaints/ mess/ rooms/ students/ announcements/ polls/ rules/
├── pages/
│   ├── auth/            Login
│   ├── student/         Student pages
│   ├── admin/           Admin pages
│   ├── committee/       Mess Committee pages
│   └── shared/          Search, Announcements, Rules, NotFound
├── layouts/             StudentLayout, AdminLayout, CommitteeLayout (wrappers around AppShell)
├── routes/              Per-role route files + RoleGuard
├── context/             AuthContext, ToastContext, domain contexts
├── data/                Mock data (students, rooms, complaints, mess, polls, …)
├── hooks/               useLocalStorage, useAuth
└── utils/               cn, permissions, rooms, constants, navConfig, dates
```

### Architecture notes

- **One app, three shells.** Roles share components, contexts and data; layouts differ only by navigation.
- **Single source of truth for navigation:** `utils/navConfig.js` drives the sidebar and the mobile bottom nav.
- **Derive, don't duplicate.** Room occupancy comes from `students[].roomId`, and poll results come from votes.
- **Role-based rendering:** use `visibleStudent(student, role)` from `utils/permissions.js` to strip sensitive fields.
- **Design tokens live in one place:** `tailwind.config.js` and the CSS variables in `src/index.css`.

### Component cheat-sheet

| Component | Key props |
|---|---|
| `Button` | `variant` primary / secondary / soft / ghost / danger / success · `size` sm / md / lg · `icon` · `loading` · `as={Link}` |
| `Card`, `CardHeader` | `hover`, `padded` · `title`, `subtitle`, `action` |
| `Badge` | `tone` neutral / brand / success / warning / danger / info · `dot` · `icon` |
| `StatusBadge` | `status` (complaint, priority, announcement, poll, suggestion and room statuses) |
| `Input`, `Select` | `label`, `error`, `hint`, `icon`, `multiline` · `options`, `placeholder` |
| `SearchBar` | `value`, `onChange(string)`, `placeholder` |
| `Modal` | `open`, `onClose`, `title`, `size`, `footer` (bottom sheet on mobile) |
| `ProgressBar` | `value` (0–100), `tone`, `label`, `showValue`, `height` |
| `StatCard` | `label`, `value`, `icon`, `tone`, `hint` |
| `EmptyState`, `ErrorState`, `LoadingSpinner` | `title`, `message`, `action` · `message`, `onRetry` · `label` |
| `PageHeader` | `title`, `subtitle`, `action`, `eyebrow` |
| `HeroBanner` | `eyebrow`, `title`, `subtitle`, `icon`, `children` |

Toasts: `const toast = useToast(); toast.success('Saved')`
Persisted state: `useLocalStorage('key', initial)` (keys are prefixed with `hostelx:`)

---

## Team and workflow

| Member | Area |
|---|---|
| **Jai Prakash Dubey** | Foundation, design system, layouts, student experience, Mess Committee and polls |
| **Sundram jha** | Admin dashboard, students, rooms, search, announcements, rules |

- `main` is protected and always deployable. Never commit to it directly.
- Feature branches: `jai/<feature>` and `teammate/<feature>`, merged through pull requests.
- `git fetch && git rebase origin/main` before starting work and before opening a PR.
- Every file has one owner. Ask the owner (or send a small PR touching only that file) before changing it.
- Commit style: `feat:`, `fix:`, `style:`, `refactor:`, `chore:` (for example `feat: add mess polling`).

---

## Deployment

Hosted on **Vercel**, with automatic deploys from `main` and a preview URL for every branch and PR.

- Framework preset: **Vite**
- `vercel.json` rewrites all routes to `index.html`, so refreshing any nested route works.

Pre-submission checklist: live URL works · no broken routes · no console errors · refresh works on nested routes · mobile and desktop layouts verified · all key interactions work · `/design` preview route removed.

---

## Judging criteria alignment

| Criterion | Weight | How HostelX addresses it |
|---|---|---|
| Functionality and interactivity | 30% | Role-based dashboards, complaint workflow, live polls and voting, search and filters, room allocation |
| UI/UX and visual design | 25% | Custom design system, dark gradient sidebar, glass surfaces, consistent states and toasts |
| Creativity and originality | 20% | Mess Committee and the Suggestion → Poll → Decision workflow |
| Responsive design | 15% | Mobile-first layouts, floating bottom nav, cards instead of tables, bottom-sheet modals |
| Code quality and rule compliance | 10% | Modular structure, reusable components, single source of truth, original work done during the event |

---

## Future scope

HostelX is a frontend prototype today. Here is how it can grow into a production system.

**Platform and infrastructure**
- Real backend and database (for example Node.js with PostgreSQL, or Supabase) replacing the mock data and `localStorage`.
- Secure authentication through the college SSO or email login, with proper role and permission management.
- Real-time updates over WebSockets, so poll results, complaint status and announcements update live without a refresh.
- Progressive Web App support: installable on phones, offline viewing of the menu and rules.

**Student life**
- **Digital leave and outpass:** request, guardian approval and warden sign-off, with a full history.
- **Room change and swap requests** with an approval workflow, replacing paper applications.
- **Visitor management:** pre-registered visitors, gate entry logs and visiting-hours enforcement.
- **QR-based mess attendance** and gate entry and exit tracking.
- **Online fee payment** with receipts and automatic reminders for pending dues.

**Mess and polling**
- Verified one-student-one-vote polls with optional anonymous voting, to protect the integrity of decisions.
- Mess analytics: rating trends per meal, food wastage tracking and participation reports for the committee.
- Smart suggestions that group similar student suggestions together and flag popular ones automatically.

**Operations for wardens**
- Complaint SLAs with automatic escalation when a complaint stays unresolved, plus assignment to a maintenance staff app.
- Automatic complaint categorisation and priority suggestion using AI.
- Exportable reports (PDF and CSV) for occupancy, complaints and fee status.
- Support for multiple hostels and blocks, including girls' hostels, with per-hostel caretakers and a mess manager role.

**Experience**
- Push, email and SMS notifications for announcements, complaint updates and poll deadlines.
- Hindi and Punjabi language support.
- Dark mode and a full accessibility audit against WCAG guidelines.

---

## License

Built during techFEST'26 for the Pixel Wizard competition.