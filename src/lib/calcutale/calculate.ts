import { Result,PaymentRecord } from "@/store";

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

export const calculatePaymentFromRecords = (records:PaymentRecord[]):Result[] => {
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