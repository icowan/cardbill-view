import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addCreditCard } from './service';
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
    add: Effect;
  };
  reducers: {
    save: Reducer<CreditCardStateType>;
  };
}

const Model: ModelType = {
  namespace: 'creditcardList',

  state: {
    banks: [],
    data: {
      list: [],
    },
  },

  effects: {
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
