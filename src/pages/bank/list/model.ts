import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getBankList, getCreditCards, addCreditCard } from './service';
import { message } from 'antd';

export interface StateType {
  banks?: [];
  creditCards?: [];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    banks: Effect;
    creditCards: Effect;
    addCreditCard: Effect;
  };
  reducers: {
    saveList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listBank',

  state: {
    banks: [],
    creditCards: [],
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
        type: 'saveList',
        payload: {
          banks: response.data,
        },
      });
    },
    *creditCards({ payload }, { call, put }) {
      const response = yield call(getCreditCards, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveList',
        payload: {
          creditCards: response.data,
        },
      });
    },
    *addCreditCard({ payload }, { call, put }) {
      const response = yield call(addCreditCard, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      // todo load list
      window.location.reload();
    },
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
