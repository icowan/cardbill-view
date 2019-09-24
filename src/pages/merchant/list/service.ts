import request from '@/utils/request';
import {MerchantType} from "@/types/merchant";

export async function addMerchant(params: MerchantType) {
  return request(`/merchant`, {
    method: 'POST',
    data: params,
  });
}
