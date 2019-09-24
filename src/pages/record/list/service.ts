import request from '@/utils/request';
import { CreateFormParams, TableListParams } from '@/pages/record/list/data';

export async function getRecordList(params: TableListParams) {
  return request(`/record`, {
    params,
  });
}

export async function getBankList() {
  return request(`/bank`);
}

export async function getBusinessList(params?: any) {
  return request(`/business`, {
    method: 'GET',
    params: params,
  });
}

export async function addRecord(params: CreateFormParams) {
  params.amount = parseFloat(params.amount);
  params.rate = parseFloat(params.rate);
  return request(`/record`, {
    method: 'POST',
    data: params,
  });
}
