"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default  function Home() {
  const nav = useRouter()
  return (
    <main className="flex min-h-screen justify-center gap-4 p-24">
      <Button onClick={() => nav.push("auth/login")}>Login</Button>
      <Button onClick={() => nav.push("auth/signup")}>Signup</Button>
    </main>
  );
}
