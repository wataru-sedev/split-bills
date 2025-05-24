import { PaymentRecord, Result } from "@/store";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore"

export const getGroupData = async (groupId:string) => {
  const docRef = doc(db, 'groups', groupId);
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()){
    return docSnap.data();
  }else{
    throw new Error ('Group Not Found');
  }
}

export const saveGroupData = async ({
  userId,
  groupId,
  paymentRecords,
  finalResults
}: {
  userId:string;
  groupId:string;
  paymentRecords:PaymentRecord[];
  finalResults:Result[];
  }) => {
    const docRef = doc(db, 'users', userId, 'groups', groupId);
    await setDoc(docRef, {
      paymentRecords,
      finalResults,
      updatedAt: new Date(),
    })
  }