import { create } from "zustand";

export type PaymentRecord = {
  title:string;
  payer:string;
  beneficiaries:string[];
  price:number;
}

export type Result = {
  from:string;
  to:string;
  amount:number;
}

export type GroupStore = {
  group: string[];
  addMember: (name:string) => void;

  groupName:string;
  setGroupName:(name:string) => void; 

  paymentRecords:PaymentRecord[];
  setPaymentRecords:(records:PaymentRecord[]) => void;

  finalResults:Result[];
  setFinalResults:(results:Result[]) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  group: [],
  addMember: (name) => 
    set((state) => ({
      group: [...state.group, name],
    })),
  
  groupName:'',
  setGroupName: (name) => 
    set(() => ({
      groupName:name,
    })),
  
  paymentRecords:[],
  setPaymentRecords:(records) => set({paymentRecords:records}),
  
  finalResults:[],
  setFinalResults:(results) => set({finalResults:results})
}))