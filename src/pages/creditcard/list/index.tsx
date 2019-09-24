import { Alert, Button, Card, Form, Input, InputNumber, Select } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Action, Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { CreditCardStateType } from './model';
import { CreditCardType, ListState, TableListData } from '@/pages/creditcard/list/data';
import StandardTable, {
  StandardTableColumnProps,
} from '@/pages/creditcard/list/components/StandardTable';
import { BankType } from '@/pages/bank/list/data';
import { SorterResult } from 'antd/es/table';
import CreateForm from '@/pages/creditcard/list/components/CreateForm';

interface ListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'creditcard/fetch' | 'creditcard/add' | 'bank/fetch'>>;
  loading: boolean;
  creditcard: CreditCardStateType;
}

@connect(
  ({
    creditcard,
    loading,
  }: {
    creditcard: CreditCardStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    creditcard,
    loading: loading.effects['creditcard/fetch'],
  }),
)
class List extends Component<ListProps, ListState> {
  state: ListState = {
    modalVisible: false,
    updateModalVisible: false,
    width: '100%',
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '银行',
      dataIndex: 'bank',
      key: 'bank',
      render: (text: BankType) => {
        return text.bank_name;
      },
    },
    {
      title: '信用卡',
      dataIndex: 'card_name',
      key: 'card_name',
    },
    {
      title: '固定额度',
      dataIndex: 'fixed_amount',
      key: 'fixed_amount',
    },
    {
      title: '临时额度',
      dataIndex: 'max_amount',
      key: 'max_amount',
    },
    {
      title: '账单日',
      dataIndex: 'billing_day',
      key: 'billing_day',
      render: (text: number) => {
        return '每月 ' + text + ' 日';
      },
    },
    {
      title: '还款日',
      dataIndex: 'cardholder',
      key: 'cardholder',
      width: 120,
      render: (text: number) => {
        return '每月 ' + text + ' 日';
      },
    },
    {
      title: '上期账单',
      dataIndex: 'billing_amount',
      key: 'billing_amount',
      render: (text: number) => {
        return '¥' + text;
      },
    },
    {
      title: '下期账单',
      dataIndex: 'next_billing_amount',
      key: 'next_billing_amount',
      render: (text: number) => {
        return '¥' + text;
      },
    },
    {
      title: '余额',
      dataIndex: 'billing_amount',
      key: 'balance',
      render: (text: number, record: CreditCardType) => {
        return '¥' + (record.max_amount - text);
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 160,
      render: (text: number) => {
        return text == 0 ? '正常' : '其他';
      },
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'creditcard/fetch',
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
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  handleAdd = (params: CreditCardType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creditcard/add',
      payload: params,
    });
  };

  handleModalVisible = (flag?: boolean) => {
    if (flag) {
      const { dispatch } = this.props;
      dispatch({
        type: 'creditcard/banks',
      });
    }

    this.setState({
      modalVisible: !!flag,
    });
  };

  handleStandardTableChange = (
    pagination: Partial<TableListData>,
    filtersArg: Record<keyof CreditCardType, string[]>,
    sorter: SorterResult<CreditCardType>,
  ) => {
    // const {dispatch} = this.props;
    // const {formValues} = this.state;
    //
    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = {...obj};
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});
    //
    // const params: Partial<TableListParams> = {
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...formValues,
    //   ...filters,
    // };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }
    //
    // dispatch({
    //   type: 'record/fetch',
    //   payload: params,
    // });
  };

  render() {
    const {
      creditcard: { data, banks },
      loading,
    } = this.props;

    const { modalVisible } = this.state;

    console.log(this.props);

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      banks: banks,
    };

    return (
      <div>
        <PageHeaderWrapper content="随时随地管理您的信用卡。">
          <Card
            title="信用卡列表"
            bordered={false}
            extra={
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                增加信用卡
              </Button>
            }
          >
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </Card>

          <CreateForm {...parentMethods} modalVisible={modalVisible} />
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create<ListProps>()(List);
