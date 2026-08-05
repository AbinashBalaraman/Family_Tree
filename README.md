# 🌳 Kinship Studio — Modern Family Tree & Genealogy Suite

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![GEDCOM 5.5](https://img.shields.io/badge/GEDCOM-5.5%20Standard-emerald.svg)](https://en.wikipedia.org/wiki/GEDCOM)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

Kinship Studio is a state-of-the-art, interactive web application for building, visualizing, and preserving family history and multi-generational genealogical trees. Built with React 18, Vite, and custom SVG path layout engines.

---

## ✨ Features

- 🎨 **Interactive Visual Tree Canvas**: Smooth zooming, panning, and generation-ranked hierarchy visualization.
- 🔗 **Smart Relationship Lines**: Curved Bezier paths linking parents, children, and spouses with marriage badges.
- 🧬 **Direct Pedigree View**: Dedicated ancestral chart view focusing on direct-line biological lineage.
- 🗂️ **Member Directory**: Filterable and searchable grid/table view by generation, gender, name, or location.
- ⏳ **Heritage Timeline**: Chronological event flow of births, marriages, passings, and historic family milestones.
- 📊 **Demographic Analytics**: Insights on average ancestor lifespan, surname distributions, and geographic roots.
- 📜 **GEDCOM 5.5 Support**: Standard `.ged` file import and export fully compatible with Ancestry.com, MyHeritage, and Gramps.
- 💾 **Local Storage & JSON Backup**: Save automatically in-browser or download complete JSON backups.
- 🌙 **Modern Glassmorphic UI**: Sleek dark mode and warm light mode with responsive design across desktop & mobile.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbinashBalaraman/Family_Tree.git
   cd Family_Tree
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
Family_Tree/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top bar with view switcher, search & theme toggles
│   │   ├── TreeView.jsx        # Interactive pan/zoom visual tree canvas
│   │   ├── PedigreeView.jsx    # Direct ancestry fan chart view
│   │   ├── MemberDirectory.jsx # Searchable & filterable directory grid
│   │   ├── TimelineView.jsx    # Chronological family milestone timeline
│   │   ├── AnalyticsView.jsx   # Demographic charts & longevity stats
│   │   ├── MemberModal.jsx     # Profile editor & kinship connection drawer
│   │   ├── ExportModal.jsx     # GEDCOM & JSON import/export modal
│   │   └── GitHubModal.jsx     # Remote git sync modal
│   ├── data/
│   │   └── sampleTree.js       # Pre-loaded multi-generational family dataset
│   ├── utils/
│   │   ├── gedcom.js           # GEDCOM 5.5 parser & serializer
│   │   └── treeLayout.js       # SVG node placement & connector curve engine
│   ├── App.jsx                 # Main application state & local storage sync
│   ├── main.jsx                # Application root
│   └── index.css               # Design tokens, theme variables & animations
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠️ Usage & Keyboard Shortcuts

- **Pan & Drag**: Click and hold anywhere on the tree canvas to pan.
- **Zoom**: Use mouse scroll wheel or the floating zoom controls in the bottom-right corner.
- **Edit Member**: Click on any node card and select **Details** to open the bio and relationship editor.
- **Add Kin**: Click **Add Kin** on a node card to add a child, parent, or spouse directly attached to that individual.
- **Export GEDCOM**: Click **Export/Import** in the top navigation bar to download a `.ged` file or copy GEDCOM data.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues tab.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
