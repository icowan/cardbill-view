import { BusinessType } from '@/types/business';
import { CreditCardType } from '@/types/creditcard';

interface ListState {
  width: string;
  modalVisible: boolean;
  updateModalVisible: boolean;
  formValues: { [key: string]: string };
  stepFormValues: Partial<ListItem>;
}

export interface ListItem {
  amount: number;
  arrival: number;
  business: BusinessType[];
  business_name: string;
  business_type: number;
  card_id: number;
  created_at: string;
  credit_card: CreditCardType[];
  id: number;
  rate: number;
  updated_at: string;
  user_id: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: ListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  page: number;
}

export interface CreateFormParams {
  amount: number;
  business: string;
  business_type: number;
  card_id: number;
  rate: number;
}
