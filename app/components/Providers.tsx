"use client";

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        throw new Error("Failed to authenticate with ImageKit");
      }
      const data = await response.json();
      const { signature, token, expire } = data;
      return { signature, token, expire };
    } catch (error) {
      console.log("Error during authentication:", error);
      throw new Error("Authentication failed");
    }
  };
  return (
    <SessionProvider>
      <ImageKitProvider urlEndpoint={urlEndpoint}>{children}</ImageKitProvider>
    </SessionProvider>
  );
}
