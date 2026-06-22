<p align="center">
  <img src="./.github/assets/logo.png" width="160" alt="SAR Logo" />
</p>

<h1 align="center">Sparkly Games</h1>

<p align="center">
  <strong>Fast, static-first browser gaming powered by Expo.</strong>
</p>

<p align="center">
  <a href="https://sparxscience.lgbt.sh/stable">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-ff69b4?style=for-the-badge">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/sparkly-games/sparkly?style=flat-square&color=blue">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square">
  <img src="https://img.shields.io/github/stars/sparkly-games/sparkly?style=flat-square">
  <img src="https://img.shields.io/github/repo-size/sparkly-games/sparkly?style=flat-square">
  <img src="https://img.shields.io/github/commit-activity/m/sparkly-games/sparkly?style=flat-square">
  <img src="https://img.shields.io/badge/built%20with-Expo-000020?style=flat-square&logo=expo">
</p>

---

## 📘 Overview
Sparkly is a static-first browser gaming platform powered by **React Native + Expo**. By leveraging static web exports, Sparkly delivers a native-feeling experience on the web with lightning-fast load times.

### ✨ Key Features
* 📱 **Universal Codebase:** Written in React Native for seamless scaling.
* ⚡ **Static Export:** Optimized via `expo export` for deployment on Vercel/Netlify.
* 🛡️ **Type Safe:** Full TypeScript implementation.
* 🎨 **Smooth UI:** Polished animations and responsive layouts.

---

## 🛠️ Tech Stack
| Tool | Usage |
| :--- | :--- |
| **Framework** | [Expo](https://expo.dev/) (React Native) |
| **Deployment** | Static Web Export |
| **Language** | TypeScript |
| **Package Manager** | npm |

---

## 🚀 Getting Started

### Prerequisites
* Node.js (LTS)
* npm or yarn

### Installation
```bash
# Clone and enter the repo
git clone https://github.com/sparkly-games/sparkly.git && cd sparkly

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start the development server
npm start
```

---

## 🌍 Deployment

```bash
npx expo export --platform web
```

Output is generated in:

```text
dist/
```

Can be deployed to:
- Vercel
- Netlify
- Cloudflare Pages
- Static hosting

---


## 🤝 Contributing
We welcome contributions! Please follow these steps:

1. **Fork** the project.
2. **Branch**: `git checkout -b feature/AmazingFeature`
3. **Commit**: `git commit -m 'Add some AmazingFeature'`
4. **Push**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

> [!IMPORTANT]
> Ensure your PR includes screenshots for UI changes and do **not** commit your `.env` file.

---

## 📜 License & Disclaimer
**Disclaimer:** Sparkly is an open web gaming platform built for experimentation, performance, and accessibility. **Users** are responsible for complying with **local network** and usage **policies**. **Proceed at your own risk.**

Distributed under the **MPL-2.0 License**. See `LICENSE` for more information.