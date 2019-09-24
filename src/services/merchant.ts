import request from '@/utils/request';

export async function getMerchants() {
  return request(`/merchant`);
}
