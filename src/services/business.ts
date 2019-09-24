import request from '@/utils/request';

export async function getBusinesses(params?: any) {
  return request(`/business`, {
    method: 'GET',
    params: params,
  });
}
