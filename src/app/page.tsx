'use client'

import { useEffect, useState } from "react";
import { useGroupStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"

export default function Home() {
  const [member, setMember] = useState<string>('');
  const [loading, setLoading] = useState(true); 

  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const group = useGroupStore((state) => state.group);
  const groupName = useGroupStore((state) => state.groupName);
  const addMember = useGroupStore((state) => state.addMember);
  const setGroupName = useGroupStore((state) => state.setGroupName); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser({ uid: user.uid, email: user.email });
        setLoading(false);
      } else {
        router.push('/login')
      }
    });
    return () => unsubscribe();
  } , [router, setUser])

  if(loading) return <p>読み込み中…</p>

  const handleAddMember = () => {
    if( member.trim() === '' ) return;
    addMember(member);
    setMember('');
  }
  
  const makeGroupPage = () => {
    if( groupName.trim() === '' || group.length === 0 ) {
      toast.error('グループ名とメンバー名を入力してください。');
      return;
    } 

    router.push('/group');
  }

  return (
    <div className="flex justify-center">
      <div className="w-96 bg-white rounded-xl p-6 flex flex-col gap-6 items-center">
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-1" >グループ名</p>
          <input type="text" placeholder="北海道旅行" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full border rounded px-3 py-2 hover:shadow focus:outline-none focus:ring-2 focus:ring-cyan-300"/>
        </div>
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-1" >メンバー名</p>
          <div className="flex gap-1" >
            <input type="text" placeholder="たろう" value={member} onChange={(e) => setMember(e.target.value)} className="flex-1 border rounded px-3 py-2 hover:shadow focus:outline-none focus:ring-2 focus:ring-cyan-300" />
            <button onClick={handleAddMember} className="bg-cyan-500 text-white rounded px-4 py-2 hover:cursor-pointer hover:shadow-lg">追加</button>
          </div>
          <div className="flex gap-2 mt-2">
            {group.map((person) => (
              <p className="border border-gray-500 rounded-md px-2 py-1 hover:border-blue-700" key={person}>{person}</p>
            ))}
          </div>
        </div>
        <button onClick={makeGroupPage} className="w-full text-center bg-cyan-500 text-white rounded px-4 py-2 hover:cursor-pointer hover:shadow-lg" >グループページを作成</button>
      </div>
    </div>
  );
}
