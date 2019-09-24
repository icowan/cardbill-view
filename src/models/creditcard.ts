import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getCreditCards } from '@/services/creditcard';
import { message } from 'antd';
import { CreditCardType } from '@/types/creditcard';

export interface CreditcardStateType {
  data?: CreditCardType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CreditcardStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: CreditcardStateType;
  effects: {
    banks: Effect;
    creditCards: Effect;
    addCreditCard: Effect;
  };
  reducers: {
    saveList: Reducer<CreditcardStateType>;
  };
}

const Model: ModelType = {
  namespace: 'creditcard',
  state: {
    data: [],
  },

  effects: {
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
          data: response.data,
        },
      });
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
