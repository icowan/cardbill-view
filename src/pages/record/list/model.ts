import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getRecordList, addRecord } from './service';
import { message } from 'antd';
import { CreditCardType, TableListData } from '@/pages/record/list/data';
import { CreditCardType, BankType } from '@/types/creditcard';

export interface StateType {
  banks?: BankType[];
  creditCards?: CreditCardType[];
  businesses?: [];
  records: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'record',

  state: {
    banks: [],
    creditCards: [],
    businesses: [],
    records: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getRecordList, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          records: response.data,
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRecord, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      message.success('添加成功!');
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default Model;
