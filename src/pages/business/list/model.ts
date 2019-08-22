import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getBusinessList, addBusiness } from './service';
import { message } from 'antd';

export interface StateType {
  list?: [];
  business?: [];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    list: Effect;
    addBusiness: Effect;
  };
  reducers: {
    saveList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'business',

  state: {
    list: [],
    business: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(getBusinessList, payload);
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
          list: response.data,
        },
      });
    },
    *addBusiness({ payload }, { call, put }) {
      const response = yield call(addBusiness, payload);
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
