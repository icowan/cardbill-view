import request from '@/utils/request';

export async function getDetail(params?: any) {
  return request(`/creditcard/${params.id}`);
}

export async function getBill(params?: any) {
  return request(`/bill/card/${params.id}`);
}
