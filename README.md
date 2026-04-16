# Task Up

**Task Up** is a sleek, modern, and persistent Kanban-style task manager built to help you organize your workflow seamlessly. With features like drag-and-drop columns, priority tiers, and a dedicated recycle bin, it provides an intuitive visual experience for task tracking.

![Tech Stack](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Key Features
- **Kanban Board:** Organize tasks elegantly into `Pending`, `In-Progress`, and `Completed` lanes.
- **Drag & Drop:** Native HTML5 drag-and-drop system to seamlessly move tasks between different columns.
- **Advanced Filtering:** Instantly search through tasks using substrings or sort exclusively by priority levels (`High`, `Mid`, `Low`).
- **Rich Task Information:** Attach a detailed description to any task.
- **Inline Editing:** Hit the ✏️ on any task to instantly open the editor modal and rewrite its contents or swap its priority.
- **Persistent Data:** Never lose your progress. The app automatically persists your columns and tasks securely in your browser's `localStorage`.
- **Recycle Bin:** Deleted a task by mistake? They are caught by the dynamic Recycle Bin overlay where you can review or permanently empty them.
- **Premium Dark Mode UI:** Designed to feel expensive and dynamic, with sleek gradient text, frosted glassmorphism overlays, and smooth CSS-driven hover animations.

## 🛠️ Technology Stack
- **Framework:** Next.js (App Router)
- **Library:** React (Functional Components + Hooks)
- **Styling:** Tailwind CSS (Utility First classes)
- **Language:** TypeScript 
- **Storage:** Browser `localStorage`

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd task-up
   ```

2. **Install the dependencies:**
   Make sure you have Node.js installed, then install the package modules:
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Pop open your preferred browser and visit:  
   `http://localhost:3000`

## 📁 Code Architecture Overview
- `app/page.tsx`: The primary state controller that powers the lists, drag listeners, and overarching layout.
- `components/TaskCard.tsx`: The individual UI tiles that house your tasks, their descriptions, tags, edit, and deletion listeners.
- `components/EditModal.tsx`: The overlay hook allowing safe inline-edits of task content without disrupting your workflow.
- `components/BinModal.tsx`: A robust modal view intercepting and logging deleted tasks before final wipe.
- `types.ts`: Global TypeScript definitions syncing the Kanban shape dynamically across all components.
