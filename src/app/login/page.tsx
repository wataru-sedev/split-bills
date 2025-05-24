'use client'

import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { startTransition } from "react";

export default function LoginPage() {
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    setUser({ uid: user.uid, email: user.email });

    startTransition(() => {
      router.push('/');
    })
  }

  return (
    <div className="flex justify-center">
      <div className="w-96 flex flex-col items-center gap-5 m-5 border p-5 rounded-md bg-gray-100">
        <h1 className="w-full text-center text-xl font-medium">ログイン</h1>
        <button onClick={handleLogin} className="w-full text-center bg-cyan-500 text-white rounded px-4 py-2 hover:cursor-pointer hover:shadow-lg">Googleでログイン</button>
      </div>
    </div>
  )
}