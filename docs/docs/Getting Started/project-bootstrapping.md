---
sidebar_position: 3
---

# Project Bootstrapping

:::info Experimental Feature
This feature is experimental and was built on **15/02/26**. We are actively seeking feedback as we refine the Spark ecosystem.
:::

Ready to build? You can generate a pre-configured template in seconds using our global initializer. This handles the heavy lifting of folder structures and dependency management for you.

### 🛠️ Quick Start

1. **Navigate** to your desired workspace in the terminal:
```bash title="Terminal"
cd ~/projects/my-spark-apps

```


2. **Initialize** the creator tool:
```bash title="root@my-pc.local ~"
npm create sparkly

```


3. **Select your Flavor**:
* **`tsx-app`** — **Recommended.** A modern React + TypeScript stack optimized for high-performance web apps.
* **`html5-game`** — A lightweight boilerplate designed for web-based games and interactive canvas projects.


4. **Name your project**: Type the name of your new directory when prompted.

---

### 💻 Development Workflow

Once the folder is generated, move into the directory and start coding:

```bash title="root@my-pc.local my-game"
cd your-project-name
npm start

```

* **Preview**: Your app will be live at `http://localhost:[PORT]` (usually `3000` or `5173`).
* **Customize**:
* **For Apps**: Focus on the `src/App.tsx` file to build your UI and logic.
* **For Games**: Edit the `public` folder or the main entry script to customize your assets.



### 📦 Shipping to the Registry

When your masterpiece is ready for the world to see, use the Spark CLI to publish it directly to our registry:

```bash title="root@my-pc.local my-game"
npx spark-registry login
npx spark-registry publish

```

:::tip Pro-Tip
Before running the publish command, double-check your `package.json` to ensure your **name** and **version** are set exactly how you want them to appear in the registry!
:::