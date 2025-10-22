"use client";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function PixPage() {
  const loading = useAuthGuard();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">teste</h1>
    </div>
  );
}
