import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getRecentRepay } from '@/services/bill';
import { message } from 'antd';
import {BillType} from "@/types/bill";

export interface BillStateType {
  bill?: BillType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: BillStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: BillStateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<BillStateType>;
  };
}

const Model: ModelType = {
  namespace: 'bill',
  state: {
    data: [],
  },

  effects: {
    *fetchRecentRepay({ payload }, { call, put }) {
      const response = yield call(getRecentRepay, payload);
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
