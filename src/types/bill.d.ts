import {BankType} from "@/types/bank";

export interface BillType {
  id: number;
  card_id: number;
  amount: number;
  repayment_day: string;
  is_repay: boolean;
  repay_time: string;
  created_at: string;
  updated_at: string;
  bank: BankType;
}
