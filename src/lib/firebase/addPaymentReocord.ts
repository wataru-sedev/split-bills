import { setDoc, collection, doc } from "firebase/firestore";
import { PaymentRecord } from "../type";
import { db } from "../firebase";

export const addPaymentRecord = async (groupId:string, record:PaymentRecord)  => {
  const paymentRef = collection(db, 'groups', groupId, 'paymentRecords');

  const newRef =  doc(paymentRef); //ドキュメントidを生成
  const recordWithId = {
    ...record,
    id:newRef.id, //フィールドにも同じidを保存
  }

  await setDoc(newRef, recordWithId);
}