import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addBusiness } from './service';
import { message } from 'antd';

export interface BusinessListStateType {
  list?: [];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: BusinessListStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: BusinessListStateType;
  effects: {
    add: Effect;
  };
  reducers: {
    save: Reducer<BusinessListStateType>;
  };
}

const Model: ModelType = {
  namespace: 'businessList',

  state: {
    list: [],
  },

  effects: {
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addBusiness, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      message.success('添加成功');
      if (callback) callback();
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
