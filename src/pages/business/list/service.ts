import request from '@/utils/request';

export async function getBusinessList(params?: any) {
  return request(`/business`, {
    method: 'GET',
    params: params,
  });
}
interface TableFormDateType {
  id: number;
  card_name: string;
  bank_id: number;
  fixed_amount: number;
  max_amount: number;
  billing_day: number;
  cardholder: number;
  state: number;
  bank: BankType;
  editable: boolean;
  isNew: boolean;
}
export async function addBusiness(params: TableFormDateType[]) {
  params[0].code = parseInt(params[0].code);
  let body = JSON.stringify(params[0]);
  return request(`/business`, {
    method: 'POST',
    body: body,
  });
}
