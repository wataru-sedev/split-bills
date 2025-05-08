'use client'

import { calculatePaymentFromRecords } from "@/lib/calcutale/calculate";
import { useGroupStore } from "@/store";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function () {
  const paymentRecords = useGroupStore((state) => state.paymentRecords);
  const setPaymentRecords = useGroupStore((state) => state.setPaymentRecords);
  const setFinalResults = useGroupStore((state) => state.setFinalResults);

  const [editRecords, setEditRecords] = useState(paymentRecords);

  const router = useRouter();

  const isValidRecords:boolean = editRecords.every((r) => !isNaN(r.price));

  const handlePriceChange = (index:number, value:string) => {
    if(!isValidRecords) {
      toast.error('正しい金額を入力してください');
      return;
    }

    const updated = [...editRecords];
    updated[index].price = parseInt(value);
    setEditRecords(updated);
  }

  const onClickDelete = (index:number) => {
    const updated = editRecords.filter((_, i) => i !== index);
    const final = calculatePaymentFromRecords(updated);
    setEditRecords(updated);
    setPaymentRecords(updated);
    setFinalResults(final);
    toast.info(`${editRecords[index].title}を削除しました`);
  };

  const handleUpdate = () => {
    
    setPaymentRecords(editRecords);
    const final = calculatePaymentFromRecords(editRecords);
    setFinalResults(final);
    toast.info(`支払い記録を更新しました`);
    router.push('/group');
  }

  const backToGroup = () => router.push('/group');

  return (
    <div className="flex justify-center px-4">
      <div className="w-full flex flex-col items-center justify-center gap-4 mt-2 max-w-3xl">
          <div className="w-full space-y-4">
            {paymentRecords.map((record, index) => {  
              const { title, payer, beneficiaries, price } = record;
              return(
                <div key={title} className="flex flex-col md-flex-row md:items-center items-center gap-y-2  gap-1 border rounded-md p-4 shadow-sm">
                  <span className="w-full font-medium">{title}</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm">{payer}が立替</span>
                    <div className="flex gap-1" >{beneficiaries.map((person) => <p key={person} className="border rounded px-1 py-1 text-xs bg-gray-100">{person}</p>)}</div>
                    <input type="number" className="w-12 border rounded p-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" value={price} onChange={(e) => handlePriceChange(index, e.target.value)}  />
                  </div> 
                  <button onClick={() => onClickDelete(index)} className="text-sm text-gray-500 hover:text-red-500 hover:underline hover:cursor-pointer" >削除</button>
                </div>
            )})}
          </div>
          <button onClick={handleUpdate} disabled={!isValidRecords} className={`w-full bg-cyan-500 text-white rounded px-4 py-2 hover:shadow-md hover:cursor-pointer ${isValidRecords ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-400 cursor-not-allowed'} `} >更新</button>
          <button onClick={backToGroup} className="w-full bg-gray-300 text-gray-700 rounded px-4 py-2 hover:shadow-md hover:cursor-pointer" >戻る</button>
      </div>
    </div>
  )
}