
import request from '@/utils/request';

export async function getRecordList() {
    return request(`/record`);
}
