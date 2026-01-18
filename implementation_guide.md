# Implementation Guide: TanStack Start + Better Auth + Convex

## 1. Architecture Overview

We are transitioning the application to use **TanStack Start** to leverage Server-Side Rendering (SSR) for improved SEO and initial load performance. For authentication, we have selected **Better Auth** over the beta `convex-auth` due to its mature support for plugins, Two-Factor Authentication (2FA), and broader ecosystem stability.

**Documentation:**
- Use `context7` MCP tools to query latest documentation for `TanStack Start`, `Convex`, and `Better Auth`.

**Stack Choice:**
*   **TanStack Start:** Provides the full-stack React framework capabilities, managing routing and SSR.
*   **Convex:** Serves as the backend-as-a-service and database.
*   **Better Auth:** Handles authentication logic, session management, and security features, bridging the application and the database.

## 2. Prerequisites

You will need to install the core Better Auth packages and the specific dependencies for React, Convex, and Motion.

```bash
pnpm add better-auth @better-auth/cli motion clsx tailwind-merge
```

*Note: We use `motion` for animations instead of GSAP to ensure better compatibility with React SSR and declarative steps() animations.*

## 3. Step-by-Step Implementation

### Step 1: Convex Setup

Better Auth requires specific tables to manage users, sessions, and accounts. In Convex, we define this in `convex/schema.ts`.

Add the following tables to your `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["token"]),

  accounts: defineTable({
    userId: v.id("users"),
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.number()),
    refreshTokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  verifications: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
```

### Step 2: Better Auth Configuration

Create a file `src/lib/auth.ts` to configure the authentication client. Since a direct official Convex adapter is unique, we configure it to interact with our data source.

*Note: As of now, if a direct `convex-adapter` package is not available, you would use the generic adapter interface provided by Better Auth or a community wrapper. Below assumes a standard configuration flow.*

```typescript
import { betterAuth } from "better-auth";
// If a specific adapter library exists: import { convexAdapter } from "better-auth-convex-adapter";
// Otherwise, standard generic setup (conceptual):

export const auth = betterAuth({
  database: {
    // Configuration to point to Convex tables
    // In a real scenario without a direct driver, this often involves 
    // passing functions that read/write to the Convex HTTP API or Client
    provider: "custom", 
    // ... custom adapter implementation logic would go here
  },
  emailAndPassword: {
    enabled: true,
  },
  // Add other providers (Google, GitHub, etc.)
});
```

### Step 3: TanStack Start Integration (API Routes)

TanStack Start uses file-based routing. You need to create an API route to handle the auth requests.

Create `src/routes/api/auth.$.ts`:

```typescript
import { createAPIFileRoute } from "@tanstack/start/api";
import { auth } from "../../lib/auth"; // Your auth config

export const Route = createAPIFileRoute("/api/auth/$")({
  GET: ({ request }) => {
    return auth.handler(request);
  },
  POST: ({ request }) => {
    return auth.handler(request);
  },
});
```

### Step 4: Client-Side Usage

Instantiate the client in `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Change to your production URL
});

export const { useSession, signIn, signOut, signUp } = authClient;
```

**Usage in a Component:**

```tsx
import { signIn, useSession } from "~/lib/auth-client";

export default function Login() {
  const session = useSession();

  if (session.data) {
    return <div>Hello, {session.data.user.name}</div>;
  }

  return (
    <button onClick={async () => {
      await signIn.social({
        provider: "github"
      });
    }}>
      Sign in with GitHub
    </button>
  );
}
```

### Step 5: Middleware & Route Protection

In TanStack Start, you can use middleware in your router or `beforeLoad` hooks to protect routes.

**Example: Protecting a specific route (`src/routes/dashboard.tsx`):**

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '~/lib/auth-client';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: Dashboard,
});
```

**Global Context (Root):**

In `src/routes/__root.tsx`, you can fetch the session to make it globally available via context, allowing you to hide UI elements based on auth state without a hard redirect on every page.
