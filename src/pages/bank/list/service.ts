import request from '@/utils/request';

export async function getRecordList() {
  return request(`/record`);
}

export async function getBankList() {
  return request(`/bank`);
}

export async function getCreditCards(params?: any) {
  return request(`/creditcard`, {
    method: 'GET',
    params: params,
  });
}

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

export async function addCreditCard(params: TableFormDateType[]) {
  params[0].bank_id = parseInt(params[0].bank_id);
  params[0].state = parseInt(params[0].state);
  let body = JSON.stringify(params[0]);
  return request(`/creditcard`, {
    method: 'POST',
    body: body,
  });
}
