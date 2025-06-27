# KUET EEE Hub

**KUET EEE Hub** is a modern, responsive web application designed to serve as the centralized platform for students of the Electrical and Electronic Engineering (EEE) department at Khulna University of Engineering & Technology (KUET). It provides streamlined access to academic resources, online class recordings, and departmental information through an elegant and intuitive interface.

---

## 🚀 Key Features

* **Comprehensive Resource Library**: Searchable and filterable access to PDFs, documents, and presentations from a centralized Google Drive folder.
* **Online Class Recordings**: Optimized YouTube video listing with lazy-loading support for seamless playback.
* **AI Chat Assistant**: An interactive chatbot powered by n8n to assist users with queries regarding resources and lectures.
* **Smart Filters & Global Search**: Find materials quickly using filters by year, semester, course, teacher, or category.
* **Modern, Minimal UI**: Inspired by Swiss design with clean whitespace and responsive layout.
* **Light & Dark Modes**: Theme toggle with persistent preference for optimal reading comfort.
* **Sticky Navigation**: A smooth "tubelight" style navbar that stays accessible as you scroll.
* **Contribution-Friendly**: Clear channels to submit resources or contact the admin directly.

---

## 🌐 Live Demo

Access the deployed project here:

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-VISIT%20NOW-007EC6?style=for-the-badge\&labelColor=555555)](https://kuet-eee-hub.vercel.app/)

---

## 🛠️ Tech Stack

Built with a full-stack TypeScript ecosystem and modern tooling:

### Framework & Runtime

* **Next.js v15 (App Router)**

### Styling

* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [next-themes](https://github.com/pacocoursey/next-themes)
* [clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)

### UI Components

* Core: `Card`, `Button`, `Input`, `Separator`, `Badge`, `Avatar`, `Skeleton`
* Interactive: `Dialog`, `Sheet`, `DropdownMenu`, `Accordion`, `Tabs`, `Select`, `Tooltip`, `Popover`
* Icons: [Lucide React](https://lucide.dev/)

### Data & State Management

* [TanStack Query (React Query)](https://tanstack.com/query)
* React hooks: `useState`, `useEffect`, `useMemo`

### Backend & APIs

* **Next.js API Routes** for serverless endpoints
* **Google APIs** (`googleapis`) to connect with Google Sheets
* **n8n Webhook** integration for chatbot queries

### AI & Automation

* [Genkit](https://firebase.google.com/docs/genkit) + Google AI plugin (early configuration)

### Tooling

* TypeScript, ESLint, Prettier
* PostCSS for Tailwind processing

---

## ⚙️ How It Works

### 📂 Resource & Recording Management

* **Data Source**: Google Sheets act as a lightweight CMS for metadata.
* **API Access**: Custom API routes fetch sheet data securely using a service account.
* **Frontend Rendering**: `ResourcesSection` and `OnlineClassRecordingsSection` dynamically display content with multi-level filters and global search.

### 💬 AI Chat Assistant

* **Component**: `ExpandableChatDemo` renders the widget.
* **State Management**: `useChat` handles UI interactions and API requests.
* **Message Flow**:

  * Frontend sends input to `/api/chat`
  * Server proxies request (with `chat_id`) to the `N8N_WEBHOOK_URL`
  * n8n processes and returns a response to be rendered on-screen

---

## 🔐 Environment Variables

Create a `.env.local` file in your project root and configure the following:

### Google Service Account

```env
GOOGLE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
GOOGLE_RESOURCES_SHEET_ID=your_google_sheet_id_for_resources
GOOGLE_SHEET_ID=your_google_sheet_id_for_recordings
```

> 🔒 Ensure private key formatting (with `\n`) is correct and quoted.

### Chatbot Webhook

```env
N8N_WEBHOOK_URL=your-chat-webhook-from-n8n
```

---

## 🧑‍💻 Getting Started

### Prerequisites

* Node.js `v18.18` or higher
* npm / yarn / pnpm

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/shaonirfan/kuet-eee-hub.git
   cd kuet-eee-hub
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment:**
   Create `.env.local` and paste the required variables as per [above](#environment-variables).

4. **Run the development server:**

   ```bash
   npm run dev
   ```

Visit: [http://localhost:9002](http://localhost:9002)

---

## 🤝 Contribution

Contributions are encouraged! If you have academic notes, slides, or job prep materials to share:

### Contact

* **Shaon Irfan (2k20)**
* [Telegram](https://t.me/shaonirfan)
* [Facebook](https://www.facebook.com/shaon.irfan)
* [LinkedIn](https://www.linkedin.com/in/shaon-irfan-ba5b03b4)

You may either share files directly or provide a Google Drive link. Let's build a better academic resource hub together.

---

> MIT License | Developed with ❤️ by KUETians
