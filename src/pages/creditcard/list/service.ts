import request from '@/utils/request';

export async function getRecordList() {
  return request(`/record`);
}

export async function getBankList() {
  return request(`/bank`);
}

export async function getCreditCards(params?: any) {
  return request(`/creditcard`, {
    method: 'GET',
    params: params,
  });
}

export async function getBusinessList(params?: any) {
  return request(`/business`, {
    method: 'GET',
    params: params,
  });
}

export async function addRecord(params?: any) {
  let body = JSON.stringify(params[0]);
  return request(`/record`, {
    method: 'POST',
    body: body,
  });
}
