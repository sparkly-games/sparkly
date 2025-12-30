---
sidebar_position: 4
---

# Getting Started with Speed Insights

This guide will help you get started with using Vercel Speed Insights on your Sparkly Games project. It covers how to enable Speed Insights, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

```bash title="Install Vercel CLI"
npm i vercel
```

Or with your preferred package manager:

```bash title="pnpm"
pnpm i vercel
```

```bash title="yarn"
yarn i vercel
```

```bash title="bun"
bun i vercel
```

## Enable Speed Insights in Vercel

On the [Vercel dashboard](https://vercel.com/dashboard), select your Project followed by the **Speed Insights** tab. You can also select the button below to be taken there. Then, select **Enable** from the dialog.

:::note
Enabling Speed Insights will add new routes (scoped at `/_vercel/speed-insights/*`) after your next deployment.
:::

## Add `@vercel/speed-insights` to your project

Using the package manager of your choice, add the `@vercel/speed-insights` package to your project:

```bash title="npm"
npm i @vercel/speed-insights
```

Or with your preferred package manager:

```bash title="pnpm"
pnpm i @vercel/speed-insights
```

```bash title="yarn"
yarn i @vercel/speed-insights
```

```bash title="bun"
bun i @vercel/speed-insights
```

## Add the `SpeedInsights` component to your app

### For Next.js (Pages Router)

The `SpeedInsights` component is a wrapper around the tracking script, offering more seamless integration with Next.js.

Add the following component to your main app file:

```ts title="pages/_app.tsx"
import type { AppProps } from 'next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
```

For versions of Next.js older than 13.5, import the `<SpeedInsights>` component from `@vercel/speed-insights/react` and pass it the pathname of the route:

```tsx title="pages/example-component.tsx"
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useRouter } from "next/router";

export default function Layout() {
  const router = useRouter();

  return <SpeedInsights route={router.pathname} />;
}
```

### For Next.js (App Router)

The `SpeedInsights` component is a wrapper around the tracking script, offering more seamless integration with Next.js.

Add the following component to the root layout:

```tsx title="app/layout.tsx"
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

For versions of Next.js older than 13.5, create a dedicated component to avoid opting out from SSR on the layout:

```tsx title="app/insights.tsx"
"use client";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { usePathname } from "next/navigation";

export function Insights() {
  const pathname = usePathname();

  return <SpeedInsights route={pathname} />;
}
```

Then, import the `Insights` component in your layout:

```tsx title="app/layout.tsx"
import type { ReactNode } from "react";
import { Insights } from "./insights";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Insights />
      </body>
    </html>
  );
}
```

### For React (Create React App)

The `SpeedInsights` component is a wrapper around the tracking script, offering more seamless integration with React.

Add the following component to your main app file:

```ts title="App.tsx"
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <div>
      {/* ... */}
      <SpeedInsights />
    </div>
  );
}
```

### For Remix

The `SpeedInsights` component is a wrapper around the tracking script, offering seamless integration with Remix.

Add the following component to your root file:

```ts title="app/root.tsx"
import { SpeedInsights } from '@vercel/speed-insights/remix';

export default function App() {
  return (
    <html lang="en">
      <body>
        {/* ... */}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### For SvelteKit

Add the following code to your root layout:

```ts title="src/routes/+layout.ts"
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

injectSpeedInsights();
```

### For Vue

The `SpeedInsights` component is a wrapper around the tracking script, offering more seamless integration with Vue.

Add the following component to the main app template:

```vue title="src/App.vue"
<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
</template>
```

### For Nuxt

The `SpeedInsights` component is a wrapper around the tracking script, offering more seamless integration with Nuxt.

Add the following component to the default layout:

```vue title="layouts/default.vue"
<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
</template>
```

### For Astro

Speed Insights is available for both static and SSR Astro apps.

To enable this feature, declare the `<SpeedInsights />` component from `@vercel/speed-insights/astro` near the bottom of one of your layout components, such as `BaseHead.astro`:

```astro title="BaseHead.astro"
---
import SpeedInsights from '@vercel/speed-insights/astro';
const { title, description } = Astro.props;
---
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<SpeedInsights />
```

Optionally, you can remove sensitive information from the URL by adding a `speedInsightsBeforeSend` function to the global `window` object. The `<SpeedInsights />` component will call this method before sending any data to Vercel:

```astro title="BaseHead.astro"
---
import SpeedInsights from '@vercel/speed-insights/astro';
const { title, description } = Astro.props;
---
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<script is:inline>
  function speedInsightsBeforeSend(data){
    console.log("Speed Insights before send", data)
    return data;
  }
</script>
<SpeedInsights />
```

:::info Learn more
See the [Speed Insights documentation](https://vercel.com/docs/speed-insights/package#beforesend) to learn more about the `beforeSend` callback.
:::

### For HTML

Add the following scripts before the closing tag of the `<body>`:

```html title="index.html"
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

### For Other Frameworks

Import the `injectSpeedInsights` function from the package, which will add the tracking script to your app. **This should only be called once in your app, and must run in the client**.

Add the following code to your main app file:

```ts title="main.ts"
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();
```

## Deploy your app to Vercel

You can deploy your app to Vercel's global CDN by running the following command from your terminal:

```bash title="terminal"
vercel deploy
```

Alternatively, you can [connect your project's git repository](https://vercel.com/docs/git#deploying-a-git-repository), which will enable Vercel to deploy your latest pushes and merges to main.

Once your app is deployed, it's ready to begin tracking performance metrics.

:::note
If everything is set up correctly, you should be able to find the `/_vercel/speed-insights/script.js` script inside the body tag of your page.
:::

## View your data in the dashboard

Once your app is deployed, and users have visited your site, you can view the data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Speed Insights** tab.

After a few days of visitors, you'll be able to start exploring your metrics. For more information on how to use Speed Insights, see the [Speed Insights documentation](https://vercel.com/docs/speed-insights/using-speed-insights).

## Next steps

Now that you have Vercel Speed Insights set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/speed-insights` package](https://vercel.com/docs/speed-insights/package)
- [Learn about metrics](https://vercel.com/docs/speed-insights/metrics)
- [Read about privacy and compliance](https://vercel.com/docs/speed-insights/privacy-policy)
- [Explore pricing](https://vercel.com/docs/speed-insights/limits-and-pricing)
- [Troubleshooting](https://vercel.com/docs/speed-insights/troubleshooting)

Learn more about how Vercel supports [privacy and data compliance standards](https://vercel.com/docs/speed-insights/privacy-policy) with Vercel Speed Insights.
