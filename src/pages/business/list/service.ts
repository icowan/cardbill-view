import request from '@/utils/request';
import { BusinessType } from '@/types/business';

export async function addBusiness(params: BusinessType) {
  return request(`/business`, {
    method: 'POST',
    data: params,
  });
}
