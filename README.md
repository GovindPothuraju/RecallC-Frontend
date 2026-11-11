# RecallC-Frontend

> Client web application for RecallC — personal learning and spaced-repetition revision management for software engineering concepts.  
> **Tagline: Learn Today. Recall Tomorrow.**

---

## 🎨 Design & Palette

Built with a minimalist, high-contrast, modern UI:

- **White:** `#FFFFFF`
- **Red (Primary Accent):** `#DC2626`
- **Deep Red (Hover/Active):** `#991B1B`
- **Black (Typography & Badges):** `#111111`
- **Light Gray (Backgrounds):** `#F5F5F5` / `#FAFAFA`
- **Secondary Gray (Muted text):** `#737373`

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3
- **Routing:** React Router DOM 6
- **Icons:** Lucide React
- **API Client:** Axios with JWT interceptors and timezone propagation

---

## 📱 Application Pages & Workflows

1. **Dashboard (`/`):**
   - High-level retention progress metrics (Due Today, Overdue, Total Topics, Completed).
   - Priority queues for unattempted Overdue Revisions and Today's Agenda.
   - Upcoming revision schedule preview.
2. **My Topics (`/topics`):**
   - Full topic catalog with real-time keyword search and category filters (`DSA`, `Java`, `OOPS`, `DBMS`, `SQL`, `OS`, `CN`, `React`, `System Design`, `Other`).
   - Cards display study date, next pending revision milestone, resource count, and cascade delete action.
3. **Add Topic (`/topics/new`):**
   - Form for topic title, category dropdown + custom category input, subcategory, study date.
   - Dynamic multi-resource fields (YouTube, Documentation, GitHub, Blogs, Other).
   - Personal notes textarea.
   - Submits to automatically generate all 9 deterministic revisions.
4. **Topic Details (`/topics/:id`):**
   - Overview of original notes, clickable learning resources, and interactive 9-stage revision timeline cards.
   - In-place editing of topic metadata (studyDate is protected/immutable).
   - Cascade delete confirmation modal.
5. **Revision Execution (`/revisions/:id`):**
   - Review original notes and saved reference links.
   - Records **Recall Quality** (`EASY`, `MEDIUM`, `HARD`).
   - Records **Recall Assistance** (`INDEPENDENT`, `PARTIAL`, `NEEDED_RESOURCES`).
   - Session notes and early completion validation (enforces 2-calendar-day early completion rule).
6. **Revision History (`/history`):**
   - Paginated chronological audit log of all completed revisions with ratings and timestamps.
7. **Progress Analytics (`/progress`):**
   - Visual distribution bars for categories, recall quality ratings, and assistance requirements.
8. **Settings (`/settings`):**
   - Profile management and account password change.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of `frontend/` (based on `.env.example`):

```env
VITE_API_BASE_URL=https://recallc-backend.onrender.com/api
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```
