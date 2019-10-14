import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {fetchLastAmount, fetchMonthAmount} from './service';
import {message} from 'antd';

export interface DashboardStateType {
  lastAmount?: [];
  monthAmount?: [];
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
    fetchMonthAmount: Effect;
  };
  reducers: {
    save: Reducer<DashboardStateType>;
  };
}

const Model: ModelType = {
  namespace: 'dashboard',

  state: {
    lastAmount: [],
    monthAmount: [],
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

      yield put({
        type: 'save',
        payload: {
          lastAmount: response.data,
        },
      });
    },
    * fetchMonthAmount({payload, callback}, {call, put}) {
      const response = yield call(fetchMonthAmount, payload);
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
          monthAmount: response.data,
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
