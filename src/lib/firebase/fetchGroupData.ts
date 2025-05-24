import { doc, getDoc} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from "sonner";

export type Group = {
  groupName:string;
  members:string[];
}

export const fetchGroupData = async (groupId:string):Promise<Group | null> => {
    const docRef = doc(db, 'groups', groupId);
    const docSnap = await getDoc(docRef);

    if(!docSnap.exists()){
      toast.error('データが見つかりません');
      return null;
    }
    const data = docSnap.data();

    return {
      groupName: data.groupName,
      members: data.members,
    };
  }
