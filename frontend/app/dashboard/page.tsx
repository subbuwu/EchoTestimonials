"use client";

import { useAuth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { getToken } = useAuth();

  const handleGetToken = async () => {
    const token = await getToken();
    console.log(token);
  };

  return (
    <div>
      <button onClick={handleGetToken}>Get Token</button>
    </div>
  );
}
