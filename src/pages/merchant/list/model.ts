import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {message} from 'antd';
import {addMerchant} from "@/pages/merchant/list/service";

export interface MerchantListStateType {
  list?: [];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: MerchantListStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: MerchantListStateType;
  effects: {
    add: Effect;
  };
  reducers: {
    save: Reducer<MerchantListStateType>;
  };
}

const Model: ModelType = {
  namespace: 'merchantList',

  state: {
    list: [],
  },

  effects: {
    * add({payload, callback}, {call, put}) {
      const response = yield call(addMerchant, payload);
      if (!response) {
        return;
      }
      if (!response.success) {
        message.error(response.error);
        return;
      }
      message.success('清加成功');
      if (callback) callback();
    },
  },

  reducers: {
    saveList(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
