'use client'

import Link from "next/link"
import { useGroupStore } from "@/store"
import { useRouter } from "next/navigation";

export default function GroupPage () {
  const group = useGroupStore((state) => state.group);
  const groupName = useGroupStore((state) => state.groupName);
  const finalResults = useGroupStore((state) => state.finalResults);

  const router = useRouter();

  const showDetail = () => {
    router.push('/group/edit');
  }
  
  return(
    <div className="flex justify-center" >
      <div className="w-96 bg-white p-6 flex flex-col gap-5 items-center">
        <h1 className="text-xl" >{groupName}</h1>
        <div className="w-full flex justify-center gap-2">
          {group.map((person) => (
            <p key={person} className="border border-gray-500 rounded-md px-2 py-1 hover:border-blue-700">{person}</p>
          ))}
        </div>
        <div className="w-full flex flex-col gap-4 mt-3">
          {finalResults.map((result) => (
            <div key={`${result.from}-${result.to}`} className="flex justify-between border-b border-gray-400 pb-1">
              <span>{result.from} → {result.to}</span>
              <span>￥{result.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <Link href='/group/new' className="w-full text-center bg-cyan-500 text-white rounded px-4 py-2 hover:shadow-lg mt-4" >立替記録を追加</Link>
        <button onClick={showDetail} className="w-full bg-gray-300 text-gray-700 rounded px-4 py-2 hover:shadow-md hover:cursor-pointer" >明細を見る</button>
      </div>
    </div>
  )
}
