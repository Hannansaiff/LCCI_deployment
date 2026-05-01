# API Integration Guide for Next.js Frontend

## Overview
This guide explains how to integrate the FastAPI backend with your Next.js frontend application.

## Configuration

### 1. Add Backend URL to Frontend

Create or update `.env.local` in the Next.js root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.lcci.org.pk
```

### 2. Update Next.js Server Actions

Replace the existing server actions with API calls to the backend.

#### Example: Membership Application

**Before (Direct Database)**
```typescript
// app/actions/membership.ts
export async function submitMembershipApplication(formData: FormData) {
  // Direct database calls...
}
```

**After (API Call)**
```typescript
// app/actions/membership.ts
"use server";

import { z } from "zod";

export async function submitMembershipApplication(formData: FormData) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // First, submit the application
  const applicationData = {
    businessName: formData.get("businessName"),
    ownerName: formData.get("ownerName"),
    address: formData.get("address"),
    businessType: formData.get("businessType"),
    registrationNo: formData.get("registrationNo"),
    contactNo: formData.get("contactNo"),
    email: formData.get("email"),
  };

  const response = await fetch(
    `${apiUrl}/api/memberships/applications`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    }
  );

  if (!response.ok) {
    return { ok: false, error: "Failed to submit application" };
  }

  const application = await response.json();

  // Upload files if provided
  if (formData.get("cnic")) {
    const cnicFormData = new FormData();
    cnicFormData.append("file", formData.get("cnic"));
    
    await fetch(
      `${apiUrl}/api/memberships/applications/${application.id}/upload-cnic`,
      { method: "POST", body: cnicFormData }
    );
  }

  if (formData.get("businessDocs")) {
    const docsFormData = new FormData();
    docsFormData.append("file", formData.get("businessDocs"));
    
    await fetch(
      `${apiUrl}/api/memberships/applications/${application.id}/upload-docs`,
      { method: "POST", body: docsFormData }
    );
  }

  return { ok: true };
}
```

### 3. Authentication for Admin Panel

Create an auth helper:

```typescript
// lib/api-client.ts
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession();
  
  if (!session?.token) {
    throw new Error("Not authenticated");
  }

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.token}`,
  };
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any
) {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

### 4. Update Admin Panel Actions

**Update Services**
```typescript
// admin/actions/cms.ts
import { apiRequest } from "@/lib/api-client";

export async function updateService(serviceId: string, data: any) {
  return await apiRequest("PATCH", `/api/services/${serviceId}`, data);
}

export async function createService(data: any) {
  return await apiRequest("POST", `/api/services/`, data);
}

export async function deleteService(serviceId: string) {
  return await apiRequest("DELETE", `/api/services/${serviceId}`);
}
```

**Update Events**
```typescript
export async function updateEvent(eventId: string, data: any) {
  return await apiRequest("PATCH", `/api/events/${eventId}`, data);
}

export async function createEvent(data: any) {
  return await apiRequest("POST", `/api/events/`, data);
}

export async function deleteEvent(eventId: string) {
  return await apiRequest("DELETE", `/api/events/${eventId}`);
}
```

### 5. Update NextAuth Configuration

Modify your NextAuth configuration to use the backend API:

```typescript
// src/lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Invalid credentials");
        }

        const user = await res.json();
        
        return {
          id: "admin", // You might want to get this from backend
          token: user.access_token,
          name: credentials.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.token = token.token as string;
      return session;
    },
  },
};
```

### 6. Update Public Data Fetching

For public pages, you can fetch data directly:

```typescript
// Page that displays public content
import { Suspense } from "react";

async function getServices() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services/?active_only=true`,
    { cache: "revalidate", next: { revalidate: 3600 } }
  );
  return res.json();
}

async function getEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/?visible_only=true`,
    { cache: "revalidate", next: { revalidate: 3600 } }
  );
  return res.json();
}

export default async function HomePage() {
  const services = await getServices();
  const events = await getEvents();

  return (
    <>
      {/* Your page content using services and events */}
    </>
  );
}
```

### 7. Handle File Uploads

For file uploads (logos, images), send to backend:

```typescript
export async function uploadImage(
  file: File,
  endpoint: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return data.path;
}
```

## Common Patterns

### Error Handling
```typescript
try {
  const result = await apiRequest("POST", "/api/events/", eventData);
  return { success: true, data: result };
} catch (error) {
  return { 
    success: false, 
    error: error instanceof Error ? error.message : "Unknown error" 
  };
}
```

### Loading States
```typescript
"use client";

import { useState } from "react";

export function ServiceForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Make API call
      const result = await updateService(serviceId, data);
      // Show success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      {/* form fields */}
      <button disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

## Testing

### Test API Connectivity
```typescript
// pages/api/test.ts
export default async function handler(req, res) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
    const data = await response.json();
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ error: "Backend not available" });
  }
}
```

## Troubleshooting

### CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**: 
- Ensure frontend URL is in backend's `ALLOWED_ORIGINS`
- Frontend must be at http://localhost:3000 or configured URL
- Check backend .env file

### 401 Unauthorized
**Problem**: "Unauthorized" when accessing admin endpoints

**Solution**:
- Token might be expired (set new expiry in backend)
- Token not being sent in headers
- Check token format in Authorization header

### 404 Not Found
**Problem**: "API endpoint not found"

**Solution**:
- Check endpoint path is correct
- Verify backend is running
- Check if service is created (GET might fail if empty)

## Production Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.lcci.org.pk
```

### Security Headers (in Next.js config)
```typescript
const securityHeaders = [
  {
    key: 'X-API-URL',
    value: process.env.NEXT_PUBLIC_API_URL
  }
]
```

### Rate Limiting (Optional)
Consider implementing rate limiting on backend for production APIs.

## Next Steps

1. ✅ Update server actions to use API
2. ✅ Configure NextAuth for backend auth
3. ✅ Test all endpoints in admin panel
4. ✅ Verify CORS configuration
5. ✅ Set up error logging
6. ✅ Deploy both services

---

For more information:
- Backend API Docs: [README.md](../backend-python/README.md)
- FastAPI Documentation: https://fastapi.tiangolo.com/
