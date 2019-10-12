import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {fetchLastAmount} from './service';
import {message} from 'antd';

export interface DashboardStateType {
  lastAmount?: [];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: DashboardStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: DashboardStateType;
  effects: {
    fetchLastAmount: Effect;
  };
  reducers: {
    save: Reducer<DashboardStateType>;
  };
}

const Model: ModelType = {
  namespace: 'dashboard',

  state: {
    lastAmount: [],
  },

  effects: {
    * fetchLastAmount({payload, callback}, {call, put}) {
      const response = yield call(fetchLastAmount, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }

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
