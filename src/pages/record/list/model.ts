import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
// import { routerRedux } from 'dva/router';
import {getRecordList } from './service';
//import { getPageQuery, setAuthority } from './utils/utils';
import {message} from 'antd'

export interface StateType {
  list?: []
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
  };
  reducers: {
    saveList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'record',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(getRecordList, payload);
      if (!response) {
        return
      }
      if (!response.success) {
        message.error(response.error)
        return
      }
      yield put({
        type: 'saveList',
        payload: response,
      });
    }
  },

  reducers: {
    saveList(state, {payload}) {
        return {
            ...state,
            list: payload.data
        };
    }
  },
};

export default Model;
