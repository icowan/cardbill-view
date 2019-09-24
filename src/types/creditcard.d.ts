import { BankType } from '@/types/bank';

export interface CreditCardType {
  bank_id: number;
  billing_day: number;
  card_name: string;
  cardholder: number;
  created_at: string;
  fixed_amount: number;
  id: number;
  max_amount: number;
  state: number;
  bank: BankType;
}
