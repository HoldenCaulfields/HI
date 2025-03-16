"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../../context/AuthContext";

export default function DashboardPage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const { user } = authContext || {};

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect if not logged in
    }
  }, [user, router]);

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome, {user?.username}</h2>
      <p>This is a protected dashboard.</p>
    </div>
  );
}
