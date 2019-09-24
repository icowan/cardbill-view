import request from '@/utils/request';
import { CreditCardType } from '@/types/creditcard';

export async function addCreditCard(params: CreditCardType) {
  return request(`/creditcard`, {
    method: 'POST',
    data: params,
  });
}
