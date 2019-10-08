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

export interface StatisticsType {
  credit_amount: number; // 总额度
  credit_max_amount: number; // 临时额度
  credit_number: number; // 信用卡数量
  total_consumption: number; // 总消费额度
  monthly_consumption: number; // 当月消费额度
  interest_expense: number; // 利息支出
  current_interest: number; // 当月利息出支
  unpaid_bill: number; // 未还账单
  repaid_bill: number; // 已还账单
}
