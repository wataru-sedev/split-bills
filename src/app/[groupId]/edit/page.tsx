'use client'

import { useEffect, useState } from "react";
import { fetchPaymentRecords } from '@/lib/firebase/fetchPaymetRecords';
import { PaymentRecord } from "@/lib/type";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function editPage () {
  const params = useParams();
  const groupId = typeof params.groupId === 'string' ? params.groupId : '';


  const [records, setRecords] = useState<PaymentRecord[]>([]);

  const router = useRouter();

  const isValidRecords:boolean = records.every((r) => !isNaN(r.price));

  useEffect(() => {
      const loadRecords = async () => {
        const data = await fetchPaymentRecords(groupId);
        setRecords(data);
      };
      loadRecords();
    }, [groupId]);

  const handlePriceChange = (id:string, value:string) => {
    const updated = records.map((record) => record.id === id ? {...record, price:parseInt(value)} : record );
    setRecords(updated);
  }

  const onClickDelete = async (id:string) => {
    const deleted = records.find((record) => record.id === id);
    if(!deleted) return;

    try{
      await deleteDoc(doc(db, 'groups', groupId, 'paymentRecords', id));

      const updated = records.filter((record) => record.id !== id);
      setRecords(updated);
      toast.info(`${deleted.title}を削除しました`);
    } catch(error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    if(!isValidRecords) {
      toast.error('正しい金額を入力してください');
      return;
    }

    if(typeof groupId !== 'string' || !groupId) {
      toast.error('グループidを取得できませんでした');
      return;
    }

    try{
      await Promise.all(
        records.map(async (record) => {
          const docRef = doc(db, 'groups', groupId, 'paymentRecords', record.id);
          await setDoc(docRef, record);
        })
      );
      toast.info(`支払い記録を更新しました`);
      router.push(`/${groupId}`);
    } catch (error) {
      console.log('Firestore更新エラー', error);
      toast.error('更新中にエラーが発生しました')
    }
  }

  const backToGroup = () => router.push(`/${groupId}`);

  return(
    <div className="flex justify-center px-4">
      <div className="w-full flex flex-col items-center justify-center gap-4 mt-2 max-w-3xl">
        <div className="w-full space-y-4">
            {records.map((record) => {  
              const { title, payer, beneficiaries, price, id } = record;
              return(
                <div key={title} className="flex flex-col items-center gap-y-2  gap-1 border rounded-md p-4 shadow-sm">
                  <span className="w-full font-medium">{title}</span>
                  <div className="w-full flex items-center justify-between gap-1">
                    <span className="">{payer}が立替</span>
                    <div className="flex gap-1" >{beneficiaries.map((person) => <p key={person} className="border rounded px-1 py-1 text-xs bg-gray-100">{person}</p>)}</div>
                    <input type="number" className="w-12 border rounded text-right text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" value={price} onChange={(e) => handlePriceChange(id!, e.target.value)}  />
                  </div> 
                  <button onClick={() => onClickDelete(id!)} className="text-sm text-gray-500 hover:text-red-500 hover:underline hover:cursor-pointer" >削除</button>
                </div>
            )})}
          </div>
          <button onClick={handleUpdate} disabled={!isValidRecords} className={`w-full bg-cyan-500 text-white rounded px-4 py-2 hover:shadow-md hover:cursor-pointer ${isValidRecords ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-400 cursor-not-allowed'} `} >更新</button>
          <button onClick={backToGroup} className="w-full bg-gray-300 text-gray-700 rounded px-4 py-2 hover:shadow-md hover:cursor-pointer" >戻る</button>
      </div>
    </div>
  )
}