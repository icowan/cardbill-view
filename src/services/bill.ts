import request from '@/utils/request';

export async function getRecentRepay() {
  return request(`/bill/recent-repay`);
}
