import {BillType} from "@/types/bill";

export interface DetailState {
  width: string;
  tabActiveKey: string;
  modalVisible: boolean;
  currBill: BillType
}

export interface RepaymentState {
  id: number;
  card_id: number;
  amount: number;
  repayment: string;
}
