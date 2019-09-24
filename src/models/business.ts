import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getBusinesses } from '@/services/business';
import { message } from 'antd';
import { BusinessType } from '@/types/business';

export interface BusinessStateType {
  data?: BusinessType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: BusinessStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: BusinessStateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<BusinessStateType>;
  };
}

const Model: ModelType = {
  namespace: 'business',
  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getBusinesses, payload);
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
