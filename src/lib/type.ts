export type PaymentRecord = {
  title:string;
  payer:string;
  beneficiaries:string[];
  price:number;
  id:string;
}

export type Result = {
  from:string;
  to:string;
  amount:number;
}