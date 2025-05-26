'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchGroupData, Group } from '@/lib/firebase/fetchGroupData';
import { fetchPaymentRecords } from '@/lib/firebase/fetchPaymetRecords';
import { Result } from '@/lib/type';
import { calculatePaymentFromRecords } from '@/lib/calcutale/calculate';

type Props = {
  params: Promise<{groupId:string}>;
}

export default function GroupPage ({params}: Props)  {
  const { groupId } = use(params);

  const [loading, setLoading] = useState(true); 
  const [groupData, setGroupData] = useState<Group | null>(null); 
  const [results, setResults] = useState<Result[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGroupData(groupId);
      setGroupData(data);
      setLoading(false);
    }
    loadData();
    
  }, [groupId]);

  useEffect(() => {
    const loadRecords = async () => {
      const data = await fetchPaymentRecords(groupId);
      const results = calculatePaymentFromRecords(data);
      setResults(results);
      setLoading(false);
    };
    loadRecords();
  },[groupId]);

  if(loading) return <p className="flex justify-center items-center text-xl m-5" >Loading…</p>


  const showDetail = () => router.push(`/${groupId}/edit`);

  return(
    <div className="flex justify-center">
      <div className="w-96 bg-white p-6 flex flex-col gap-5 items-center">
        <h1 className="text-xl" >{groupData?.groupName}</h1>
        <div className="w-full flex justify-center gap-2">
          {groupData?.members.map((person) => (
            <p key={person} className="border border-gray-500 rounded-md px-2 py-1 hover:border-blue-700">{person}</p>
          ))}
        </div>
        <div className="w-full flex flex-col gap-4 mt-3">
          {results.map((result) => (
            <div key={`${result.from}-${result.to}`} className="flex justify-between border-b border-gray-400 pb-1">
              <span>{result.from} → {result.to}</span>
              <span>￥{result.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <Link href={`/${groupId}/new`} className="w-full text-center bg-cyan-500 text-white rounded px-4 py-2 hover:shadow-lg mt-4" >立替記録を追加</Link>
        <button onClick={showDetail} className="w-full bg-gray-300 text-gray-700 rounded px-4 py-2 hover:shadow-md hover:cursor-pointer" >明細を見る</button>
      </div>
    </div>
  )
}