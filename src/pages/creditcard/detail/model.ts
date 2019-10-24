import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {getDetail, getBill, repayBill} from './service';
import {message} from 'antd';
import {CreditCardType} from "@/types/creditcard";

export interface CreditCardStateType {
  data: CreditCardType,
  bill: {},
  record: [],
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CreditCardStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: CreditCardStateType;
  effects: {
    fetch: Effect;
    fetchBill: Effect;
    repay: Effect;
  };
  reducers: {
    save: Reducer<CreditCardStateType>;
  };
}

const Model: ModelType = {
  namespace: 'creditcarddetail',

  state: {
    data: {},
    bill: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    },
    record: [],
  },

  effects: {
    * fetch({payload, callback}, {call, put}) {
      const response = yield call(getDetail, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      if (callback) callback();

      yield put({
        type: 'save',
        payload: {
          data: response.data,
        },
      });
    },
    * fetchBill({payload, callback}, {call, put}) {
      const response = yield call(getBill, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      if (callback) callback();

      yield put({
        type: 'save',
        payload: {
          bill: response.data,
        },
      });
    },
    * repay({payload, callback}, {call, put}) {
      const response = yield call(repayBill, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      message.success("还款成功!");
      if (callback) callback();
    }
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
