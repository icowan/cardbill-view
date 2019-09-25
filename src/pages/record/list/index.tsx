import {Card, Form, Button, Row, Icon, Tag} from 'antd';
import React, {Component} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Action, Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {connect} from 'dva';
import {StateType} from './model';
import {
  BusinessType,
  CreditCardType,
  ListItem,
  TableListPagination,
  ListState,
  TableListParams,
  CreateFormParams,
} from '@/pages/record/list/data';

import CreateForm from '@/pages/record/list/components/CreateForm';
import StandardTable, {
  StandardTableColumnProps,
} from '@/pages/record/list/components/StandardTable';
import {SorterResult} from 'antd/es/table';
import moment from 'moment';
import {CreditcardStateType} from '@/models/creditcard';
import {BusinessStateType} from '@/models/business';
import Statistics from "@/pages/record/list/components/Statistics";
import UserLanding from "@/pages/record/list/components/UserLanding";

interface ListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'record/fetch' | 'record/fetchStatistics' | 'record/add' | 'creditcard/fetch' | 'business/fetch'>>;
  loading: boolean;
  record: StateType;
}

const BankColor = {
  "1": "magenta",
  "2": "red",
  "3": "volcano",
  "4": "orange",
  "5": "gold",
  "6": "lime",
  "7": "green",
  "8": "cyan",
  "9": "blue",
  "10": "geekblue",
  "11": "purple",
  "12": "#f50",
  "13": "#2db7f5",
  "14": "#108ee9",
};

@connect(
  ({
     record,
     creditcard,
     business,
     loading,
   }: {
    record: StateType;
    creditcard: CreditcardStateType;
    business: BusinessStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    record,
    creditcard,
    business,
    loading: loading.effects['record/fetch'],
  })
)
class List extends Component<ListProps, ListState> {
  state: ListState = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    stepFormValues: {},
    width: '100%',
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => {
        return moment(new Date(text)).format('YYYY/MM/DD');
      },
    },
    {
      title: '银行',
      dataIndex: 'credit_card',
      key: 'bank',
      render: (text: CreditCardType) => {
        return <Tag color={BankColor[text.bank.id]}>{text.bank.bank_name}</Tag>;
      },
    },
    {
      title: '信用卡',
      dataIndex: 'credit_card',
      key: 'credit_card',
      render: (text: CreditCardType) => {
        return text.card_name;
      },
    },
    {
      title: '商户类型',
      dataIndex: 'business',
      key: 'business_type',
      render: (text: BusinessType) => {
        return text.code + '-' + text.business_name;
      },
    },
    {
      title: '商户名称',
      dataIndex: 'business_name',
      key: 'business_name',
    },
    {
      title: '费率',
      dataIndex: 'rate',
      key: 'rate',
      render: (text: number) => {
        return (text * 100).toFixed(2) + '%';
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => {
        return '¥' + text;
      },
    },
    {
      title: '到账',
      dataIndex: 'arrival',
      key: 'arrival',
      render: (text: number) => {
        return '¥' + text;
      },
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
    const {dispatch} = this.props;
    dispatch({
      type: 'record/fetch',
    });

    dispatch({
      type: 'record/fetchStatistics',
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0] as HTMLDivElement;
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const {width: stateWidth} = this.state;
        if (stateWidth !== width) {
          this.setState({width});
        }
      }
    });
  };

  handleModalVisible = (flag?: boolean) => {
    if (flag) {
      const {dispatch} = this.props;
      dispatch({
        type: 'creditcard/fetch',
      });
      dispatch({
        type: 'business/fetch',
      });
    }

    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = (fields: CreateFormParams) => {
    const {dispatch} = this.props;

    dispatch({
      type: 'record/add',
      payload: fields,
      callback: () => {
        dispatch({type: 'record/fetch'});
        dispatch({type: 'record/fetchStatistics'});
      },
    });

    this.handleModalVisible();
  };

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof ListItem, string[]>,
    sorter: SorterResult<ListItem>,
  ) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'record/fetch',
      payload: params,
    });
  };

  handleSelectRows = (rows: ListItem[]) => {
  };

  render() {
    const {
      record: {records, statistics},
      creditcard: {data},
      business,
      loading,
    } = this.props;

    const {modalVisible} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      creditCards: data,
      businesses: business.data,
    };

    return (
      <div>
        <PageHeaderWrapper content={<UserLanding/>} extra={<div>
          <Row>
            <h3 style={{margin: 0, color: '#333'}}>
              <a target="_black" href="https://docs.nsini.com">
                <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"/>{' '}
                使用文档
              </a></h3>
          </Row>
        </div>}>
          <Statistics data={statistics}/>
          <Card
            title="刷卡记录"
            bordered={false}
            extra={
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                增加记录
              </Button>
            }
          >
            <StandardTable
              selectedRows={}
              loading={loading}
              data={records}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </Card>

          <CreateForm {...parentMethods} modalVisible={modalVisible}/>

          {/*{stepFormValues && Object.keys(stepFormValues).length ? (*/}
          {/*  <UpdateForm*/}
          {/*    {...updateMethods}*/}
          {/*    updateModalVisible={updateModalVisible}*/}
          {/*    values={stepFormValues}*/}
          {/*  />*/}
          {/*) : null}*/}
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create<ListProps>()(List);
