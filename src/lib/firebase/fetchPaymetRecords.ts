import { db } from "../firebase"
import { collection, getDocs } from "firebase/firestore";

import { PaymentRecord } from "../type"

export const fetchPaymentRecords = async(groupId:string):Promise<PaymentRecord[]> => {
  const recordRef = collection(db, 'groups', groupId, 'paymentRecords');
  const snapShot = await getDocs(recordRef);

  const result:PaymentRecord[] = snapShot.docs.map( doc => ({
    ...doc.data(),
  })) as PaymentRecord[];

  return result;
}