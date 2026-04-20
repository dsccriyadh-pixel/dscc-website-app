import { useEffect, useState } from "react";
import { Redirect } from "wouter";
import { api } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "ok" | "fail">("checking");

  useEffect(() => {
    let cancelled = false;
    if (!getToken()) {
      setState("fail");
      return;
    }
    api
      .checkAuth()
      .then(() => {
        if (!cancelled) setState("ok");
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          setState("fail");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "checking") {
    return (
      <div className="h-screen w-full grid place-items-center">
        <Spinner />
      </div>
    );
  }
  if (state === "fail") return <Redirect to="/login" />;
  return <>{children}</>;
}
