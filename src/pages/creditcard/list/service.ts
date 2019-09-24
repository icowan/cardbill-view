import request from '@/utils/request';
import { CreditCardType } from '@/types/creditcard';

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

export async function addCreditCard(params: CreditCardType) {
  return request(`/creditcard`, {
    method: 'POST',
    data: params,
  });
}
