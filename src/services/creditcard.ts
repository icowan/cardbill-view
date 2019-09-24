import request from '@/utils/request';

export async function getCreditCards(params?: any) {
  return request(`/creditcard`, {
    method: 'GET',
    params: params,
  });
}
