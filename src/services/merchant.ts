import request from '@/utils/request';

export async function getMerchants(params?: any) {
  return request(`/merchant`, {
    params
  });
}
