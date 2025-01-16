"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();

  // Check if window is defined (client-side check)
  let origin: string | null = null;
  if (typeof window !== "undefined") {
    // Accessing URL search parameters via URLSearchParams in the browser
    origin = new URLSearchParams(window.location.search).get("origin");
  }

  const { data, error, isLoading } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (data?.success) {
      // user is synced to db
      router.push(origin ? `/${origin}` : "/dashboard");
    } else if (error) {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      } else {
        // Handle other errors
        console.error("An error occurred:", error);
        // Optionally, redirect to an error page or show a notification
      }
    }
  }, [data, error, origin, router]);

  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
          <h3 className="font-semibold text-xl">Setting up your account...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }

  return null; // You may want to handle other states (e.g., error fallback) here
};

export default Page;
