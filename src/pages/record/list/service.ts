import request from '@/utils/request';
import {CreateFormParams, TableListParams} from '@/pages/record/list/data';

export async function getRecordList(params: TableListParams) {
  return request(`/record`, {
    params,
  });
}

export async function getStatistics() {
  return request(`/creditcard/statistics`);
}

export async function addRecord(params: CreateFormParams) {
  params.amount = parseFloat(params.amount);
  params.rate = parseFloat(params.rate);
  return request(`/record`, {
    method: 'POST',
    data: params,
  });
}
