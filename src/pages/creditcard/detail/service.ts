import request from '@/utils/request';
import {RepaymentState} from "@/pages/creditcard/detail/data";

export async function getDetail(params?: any) {
  return request(`/creditcard/${params.id}`);
}

export async function updateDetail(params?: any) {
  return request(`/creditcard/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function getBill(params?: any) {
  return request(`/bill/card/${params.id}`, {
    params
  });
}

export async function getRecord(params?: any) {
  return request(`/creditcard/${params.id}/record`, {
    params
  });
}

export async function repayBill(params?: RepaymentState) {
  return request(`/bill/${params.card_id}/repay`, {
    method: 'POST',
    data: params,
  });
}
