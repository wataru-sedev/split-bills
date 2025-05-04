'use client'

import { log } from "node:console";
import { useEffect, useState } from "react";

export default function AddPaymentPage () {
  const members =  ['のびた', 'すねお', 'じゃいあん'] ;

  const [payerName, setPayerName] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<Array<string>>([]);
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState('');
  const [paymentRecords, setPaymentRecords] = useState<Array<PaymentRecord>>([]);
  const [finalResults, setFinalResults] = useState<Array<Result>>([]);

  type PaymentRecord = {
    title:string;
    payer:string;
    beneficiaries:string[];
    price:number;
  }
  
  type Result = {
    from:string;
    to:string;
    amount:number;
    processed?:boolean;
  }

  const calculatePayment = (record:PaymentRecord[]) => {
    const results: Result[] = [];

    record.forEach((record) => {
      const repaymentAmount = record.price / record.beneficiaries.length;

      record.beneficiaries.forEach((member) => {
        if(member !== record.payer){
          results.push( {from:member, to:record.payer, amount:repaymentAmount} )
        }
      })
    })

    const correctResults: Result[] = [];

    for ( let i = 0; i < results.length; i++ ) {
      if ( results[i].processed ) continue;
      let isThroughInsideRoop:boolean = true;

      for ( let j = i + 1; j < results.length; j++ ){
        if ( results[j].processed ) continue;

        if ( results[i].from === results[j].from && results[i].to === results[j].to ){
          const totalAmount = results[i].amount + results[j].amount;
          correctResults.push({ from:results[i].from, to:results[i].to, amount:totalAmount });
          isThroughInsideRoop = false;
          results[i].processed = true;
          results[j].processed = true;
        } else if ( results[i].from === results[j].to && results[i].to === results[j].from){
          const difference = results[i].amount - results[j].amount;
          if ( difference > 0 ){
            correctResults.push({ from:results[i].from, to:results[i].to, amount:difference });
          } else if ( difference < 0 ){
            correctResults.push({ from:results[i].to, to:results[i].from, amount:Math.abs(difference) });}
          isThroughInsideRoop = false;
          results[i].processed = true;
          results[j].processed = true;
        }
      }

      if ( isThroughInsideRoop ) correctResults.push({ from:results[i].from, to:results[i].to, amount:results[i].amount });
      results[i].processed = true;
    }
    
    return correctResults;
  }

  const handleSubmit = () => {

    const newRecord:PaymentRecord = {
      title:title,
      payer:payerName,
      beneficiaries:selectedMember,
      price:parseInt(price),
    };

    setPaymentRecords((prev) => [...prev, newRecord]);
    setTitle('');
    setPayerName('');
    setSelectedMember([]);
    setPrice('');
  }

  useEffect(() => {
    if(paymentRecords.length === 0) return;

    const returnResults = calculatePayment(paymentRecords);
    setFinalResults(returnResults);
  }, [paymentRecords]);
  
  return(
    <div className="flex flex-col items-center gap-3" >
      <h1>立替記録追加ページ</h1>
      <div>
        <select value={payerName} name={payerName} onChange={(e) => setPayerName(e.target.value)} >
          <option value="" disabled>選択してください</option>
          {members.map((member) => (
            <option key={member} value={member} >{member}</option>
          ))}
        </select>
      </div>
      <div>
        {members.map((member) => (
          <label key={member}>
            <input type="checkbox" value={member} checked={selectedMember.includes(member)} onChange={(e) => {
              const value = e.target.value;
              const checked = e.target.checked;
              setSelectedMember((prev) => checked ?  [...prev, value] : prev.filter((name) => name !== value) )
            }}/>
            {member}
          </label>
        ))}
      </div>
      <div>
        <input type="text" placeholder="ご飯代" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded"  />
      </div>
      <div>
        <input type="text"  placeholder="3600" value={price} onChange={(e) => setPrice(e.target.value)} className="border rounded" />
      </div>
      <button onClick={handleSubmit} className="bg-cyan-500 text-white rounded-xl px-4 py-2 hover:cursor-pointer hover:shadow-lg" >登録</button>
      <div>
        {finalResults.map((result) => (
          <p key={`${result.from}-${result.to}`} >{result.from}→{result.to} {result.amount}円</p>
        ))}
      </div>
    </div>
  )
}