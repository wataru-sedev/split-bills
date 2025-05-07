'use client'

import { useState } from "react";
import { toast } from "sonner";
import { useGroupStore, PaymentRecord, Result } from "@/store";
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox";

export default function AddPaymentPage () {
  const group = useGroupStore((state) => state.group);
  const paymentRecords = useGroupStore((state) => state.paymentRecords);
  const setPaymentRecords = useGroupStore((state) => state.setPaymentRecords);
  const finalResults = useGroupStore((state) => state.finalResults);
  const setFinalResults = useGroupStore((state) => state.setFinalResults);

  const [payerName, setPayerName] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<Array<string>>([]);
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState('');

  const router = useRouter();

  const formatRecord = (record:PaymentRecord) => {
    const results: Result[] = [];

    const repaymentAmount = record.price / record.beneficiaries.length;

    record.beneficiaries.forEach((member) => {
      if(member !== record.payer){
        results.push( {from:member, to:record.payer, amount:repaymentAmount} )
      }
    })
    
    return results;
  }
  
  const calculatePaymentFromRecords = (records:PaymentRecord[]):Result[] => {
    const results:Result[] = records.flatMap(formatRecord);

    const map = new Map<string, number>();

    //合算処理
    for(const {from, to, amount} of results){
      const key = `${from}->${to}`;
      map.set(key, (map.get(key) || 0) + amount);
    }

    const finalResults:Result[] = [];
    const visited = new Set<string>();

    //相殺処理
    for(const [key, amount] of map.entries()){
      if(visited.has(key)) continue;

      const [from, to] = key.split('->');
      const reverseKey = `${to}->${from}`;
      const reverseAmount = map.get(reverseKey) || 0;

      visited.add(key);
      visited.add(reverseKey);

      const diff = amount - reverseAmount;

      if(diff > 0){
        finalResults.push({from, to, amount:diff});
      }else if(diff < 0){
        finalResults.push({from:to, to:from, amount:-diff})
      }
    }
    return finalResults;
  }

  const handleSubmit = () => {
    if( !title || !payerName || !selectedMember.length || !price ) {
      toast.error('入力されていない項目があります');
      return;
    } 

    if( isNaN(parseInt(price))){
      toast.error('金額は数字を入力してください');
      return;
    }
    
    const newRecord:PaymentRecord = {
      title:title,
      payer:payerName,
      beneficiaries:selectedMember,
      price:parseInt(price),
    };

    const updatedRecords:PaymentRecord[] = [...paymentRecords, newRecord];
    setPaymentRecords(updatedRecords);
    setFinalResults(calculatePaymentFromRecords(updatedRecords));

    setTitle('');
    setPayerName('');
    setSelectedMember([]);
    setPrice('');

    router.push('/group')
  }

  return(
    <div className="flex justify-center" >
      <div className="w-96 bg-white rounded-xl flex flex-col items-center text-lg p-6 gap-6" >
        <div className="w-full flex items-center gap-1">
          <select value={payerName} name={payerName} onChange={(e) => setPayerName(e.target.value)} className="w-full border rounded-lg px-3 py-2 hover:shadow-lg" >
            <option value="" disabled>選択してください</option>
            {group.map((member) => (
              <option key={member} value={member} >{member}</option>
            ))}
          </select>
          <span>が</span>
        </div>
        <div className="w-full flex" >
          {group.map((member) => (
            <label key={member} className="w-full inline-flex items-center">
              <input type="checkbox" value={member} checked={selectedMember.includes(member)} onChange={(e) => {
                const value = e.target.value;
                const checked = e.target.checked;
                setSelectedMember((prev) => checked ?  [...prev, value] : prev.filter((name) => name !== value) )
              }} className="hover:shadow-lg"/>
              {member}
            </label>
          ))}
        </div>
        <div className="w-full flex justify-center items-center text-lg gap-1">
          <span>の</span>
          <input type="text" placeholder="ご飯代" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"  />
          <span className="whitespace-nowrap">を払って</span>
        </div>
        <div className="w-full flex justify-center items-center text-lg" >
          <span>￥</span>
          <input type="text"  placeholder="3600" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded px-3 py-2 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-300" />
          <span className="whitespace-nowrap">かかった</span>
        </div>
        <button onClick={handleSubmit} className="w-full bg-cyan-500 text-white rounded-md px-4 py-2 hover:cursor-pointer hover:shadow-lg" >登録</button>
      </div>
    </div>
  )
}