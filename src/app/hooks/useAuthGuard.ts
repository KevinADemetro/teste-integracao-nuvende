"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuthGuard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nuvende_token");

    if (!token) {
      router.replace("/");
      return;
    }

    fetch("/controllers/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid) router.replace("/");
        else setLoading(false);
      })
      .catch(() => router.replace("/"));
  }, [router]);

  return loading;
};
