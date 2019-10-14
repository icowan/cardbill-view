import request from '@/utils/request';

export async function fetchLastAmount(params?: any) {
  return request(`/dashboard/last-amount`);
}
export async function fetchMonthAmount(params?: any) {
  return request(`/dashboard/month-amount`);
}
