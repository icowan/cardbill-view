import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getBankList, getCreditCards, addCreditCard } from './service';
import { message } from 'antd';
import { TableListData } from '@/pages/creditcard/list/data';

export interface CreditCardStateType {
  banks?: [];
  data?: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CreditCardStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: CreditCardStateType;
  effects: {
    banks: Effect;
    fetch: Effect;
    add: Effect;
  };
  reducers: {
    save: Reducer<CreditCardStateType>;
  };
}

const Model: ModelType = {
  namespace: 'creditcard',

  state: {
    banks: [],
    data: {
      list: [],
    },
  },

  effects: {
    *banks({ payload }, { call, put }) {
      const response = yield call(getBankList, payload);
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
          banks: response.data,
        },
      });
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(getCreditCards, payload);
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
          data: {
            list: response.data,
          },
        },
      });
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addCreditCard, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
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
