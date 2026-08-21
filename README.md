# 🌐 Family Atlas — Interactive Radial Pedigree & Generational Dynasty Graph

[![Live Demo](https://img.shields.io/badge/Live%20Demo-family--atlas.netlify.app-00C853?style=for-the-badge&logo=netlify&logoColor=white)](https://tiny-taiyaki-398a43.netlify.app/)

**[🌐 Explore Live Deployment →](https://tiny-taiyaki-398a43.netlify.app/)**


[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://family-atlas.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

An institutional-grade, multi-generational genealogical web application featuring a **concentric radial sunburst pedigree canvas**, interactive generational coordinates (Gen I to Gen VII), bezier lineage flows, vital statistics panels, dynamic family chronicles, and AI-assisted dynasty narrative intelligence.

---

## ✨ Key Features & Architectural Modules

### 1. 🪐 Radial Sunburst & Generational Pedigree Graph
* **Concentric Coordinate Rings**: Seamlessly visualizes 7 full generations (`Gen I` to `Gen VII`) centered on the focal root person with polar-to-cartesian coordinate mapping.
* **Lineage Color-Coded Branches**:
  * 🔵 **Paternal Ancestry (Royal Blue)**
  * 🟢 **Maternal Ancestry (Emerald Green)**
  * 🔴 **Spouse / Partners (Rose & Marriage `&` Connectors)**
  * 🟡 **Descendant Generations (Amber / Gold)**
  * 🟣 **Collateral Kin / Aunts & Uncles (Violet)**
* **Organic Bezier Link Routing**: Computes smooth cubic Bezier arcs and marriage indicators dynamically as relationships evolve.
* **Smooth Infinite Pan & Zoom**: High-performance SVG viewport with double-click recentering, wheel zoom, and focal navigation.

### 2. 📋 Flyout Vital Stats & Timeline Panel
* **Comprehensive Record**: Displays high-res portrait avatar with active selection halo, birth-death years, birthplace, calling/occupation, and biographical overview.
* **Interactive Chronological Milestones**: Categorized lifecycle timeline (`Parent-Child`, `Marriage / Partner`, `Historical Milestones`).
* **Categorized Kinship Networks**: Quick-navigate clickable relationship cards for Parents, Spouses, Siblings, and Children.

### 3. 🔍 Navigation, Search & Filtering
* **Top Search Pill**: Instant fuzzy search across names, birth years, and occupations with auto-focus camera animation.
* **Lineage Branch Filter**: Isolate specific ancestry lines (Paternal, Maternal, Spouses, Descendants) in real time.
* **Root Re-Centering**: Dynamically re-orient the entire radial atlas around any selected family member with a single click.

### 4. 📖 Family Chronicles & AI Dynasty Storyteller
* **Dynasty Chronicles View**: Interactive historical storybook cataloging generation-by-generation heritage narratives.
* **AI Narrative Biographer**: Synthesizes custom life stories, milestone highlights, and lineage impact metrics with celebratory confetti.

### 5. 💾 Data Management & Persistence
* **LocalStorage Sync**: Automatically preserves all customizations and family additions.
* **JSON Import / Export**: Backup or transfer complete multi-generational family trees in structured JSON format.
* **One-Click Factory Reset**: Instantly restore the rich 60+ member sample dynasty.

---

## 🛠️ Technology Stack
* **Framework**: React 19, JavaScript / TypeScript, Vite 5
* **Icons & UI**: Lucide React, Custom SVG Geometry, Glassmorphism
* **Effects & Animation**: Canvas Confetti, CSS Transitions, SVG Filters
* **Deployment**: Netlify, GitHub Actions

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/AbinashBalaraman/Family_Tree.git

# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```
