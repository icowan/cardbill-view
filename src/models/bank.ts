import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getBanks } from '@/services/bank';
import { message } from 'antd';
import { BankType } from '@/types/bank';

export interface BankStateType {
  banks?: BankType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: BankStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: BankStateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<BankStateType>;
  };
}

const Model: ModelType = {
  namespace: 'bank',
  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getBanks, payload);
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
