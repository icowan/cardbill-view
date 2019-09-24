import { CreditCardType } from '@/types/creditcard';

export interface TableListData {
  list: CreditCardType[];
}

export interface ListState {
  width: string;
  modalVisible: boolean;
  updateModalVisible: boolean;
}
