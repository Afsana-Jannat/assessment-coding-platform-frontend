"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";
import QueryProvider from "./query.provider";

export default function Providers({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const content = <QueryProvider>{children}</QueryProvider>;
  return clientId ? (
    <GoogleOAuthProvider clientId={clientId}>{content}</GoogleOAuthProvider>
  ) : (
    content
  );
}
