import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import {MerchantType} from "@/types/merchant";
import {getMerchants} from "@/services/merchant";

export interface MerchantStateType {
  data?: MerchantType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: MerchantStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: MerchantStateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<MerchantStateType>;
  };
}

const Model: ModelType = {
  namespace: 'merchant',
  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMerchants, payload);
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
