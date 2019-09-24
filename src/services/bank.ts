import request from '@/utils/request';

export async function getBanks() {
  return request(`/bank`);
}
