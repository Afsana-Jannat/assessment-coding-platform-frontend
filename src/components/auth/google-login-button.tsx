"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuthenticatedUser, getRoleHome, googleLogin } from "@/api/auth.api";

export default function GoogleLoginButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Google login is unavailable until NEXT_PUBLIC_GOOGLE_CLIENT_ID is
        configured.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async ({ credential }) => {
            if (!credential) {
              setError("Google did not return an ID token.");
              return;
            }
            try {
              await googleLogin(credential);
              const user = await getAuthenticatedUser();
              router.push(getRoleHome(user.role));
              router.refresh();
            } catch (requestError) {
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "Google login failed",
              );
            }
          }}
          onError={() => setError("Google login failed. Please try again.")}
        />
      </div>
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
