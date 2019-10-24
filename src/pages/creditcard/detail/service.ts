import request from '@/utils/request';
import {RepaymentState} from "@/pages/creditcard/detail/data";

export async function getDetail(params?: any) {
  return request(`/creditcard/${params.id}`);
}

export async function getBill(params?: any) {
  return request(`/bill/card/${params.id}`);
}

export async function repayBill(params?: RepaymentState) {
  return request(`/bill/${params.card_id}/repay`, {
    method: 'POST',
    data: params,
  });
}
