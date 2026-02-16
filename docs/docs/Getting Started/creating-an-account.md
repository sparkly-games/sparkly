---
sidebar_position: 2
---

# Creating an Account

:::info Experimental Feature
This feature is experimental and was launched on **16/02/26**. Account systems are currently tied directly to your GitHub identity.
:::

Setting up your Sparkly.Dev account is handled entirely through the command line. There are no long forms to fill out—we use GitHub's secure device flow to link your identity.

### 🛠️ Setup Steps

1. **Open your terminal** (Command Prompt, PowerShell, or Terminal).
2. **Execute the login command**:

```bash title="root@my-pc.local ~"
npx spark-registry login

```

3. **Authenticate with GitHub**:
* A unique **User Code** will appear in your terminal.
* Follow the link provided to GitHub's activation page.
* Enter your code and authorize the Spark Registry.



🎉 **That’s it!** Your account is created and your CLI is now authorized. You are ready to start sparking projects to the registry!

:::tip Why GitHub?
We use GitHub IDs as your permanent `author_id`. This ensures that even if you change your username, you retain ownership of all your published packages and templates.
:::