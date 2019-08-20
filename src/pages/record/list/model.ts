import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
// import { routerRedux } from 'dva/router';
import { getRecordList, getBankList, getCreditCards, getBusinessList, addRecord } from './service';
//import { getPageQuery, setAuthority } from './utils/utils';
import { message } from 'antd';

export interface StateType {
  list?: [];
  banks?: [];
  creditCards?: [];
  businesses?: [];
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
    banks: Effect;
    creditCards: Effect;
    businesses: Effect;
    addRecord: Effect;
  };
  reducers: {
    saveList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'record',

  state: {
    list: [],
    banks: [],
    creditCards: [],
    businesses: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(getRecordList, payload);
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
    *businesses({ payload }, { call, put }) {
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
          businesses: response.data,
        },
      });
    },
    *addRecord({ payload }, { call, put }) {
      const response = yield call(addRecord, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      // todo load list
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
