import {
  Alert,
  Button,
  Card,
  Form,
  Icon,
  Input,
  InputNumber,
  Select,
  List,
  Tag,
  Typography,
  Avatar,
  Statistic, Descriptions, Dropdown, Steps, Tooltip, Divider, Empty
} from 'antd';
import React, {Component, Fragment} from 'react';
import {GridContent, PageHeaderWrapper, RouteContext} from '@ant-design/pro-layout';
import {Action, Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {connect} from 'dva';
import {CreditCardType} from '@/pages/creditcard/list/data';
import styles from "./style.less";
import {DetailState, RepaymentState} from "@/pages/creditcard/detail/data";
import StandardTable from "@/pages/creditcard/detail/bill";
import moment from "moment";
import Repayment from "@/pages/creditcard/detail/components/Repayment";
import {BillType} from "@/types/bill";
import CreateForm from "@/pages/creditcard/list/components/CreateForm";
import {BankStateType} from "@/models/bank";
import {BusinessStateType} from "@/models/business";
import {BusinessType} from "@/types/business";
import {ListItem, TableListPagination} from "@/pages/record/list/data";
import {SorterResult} from "antd/es/table";


interface ListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'creditcarddetail/fetch'>>;
  loading: boolean;
  data: CreditCardType;
  bill?: any;
  record?: any;
  bank: BankStateType;
}

@connect(
  ({
     creditcarddetail,
     bank,
     record,
     loading,
   }: {
    data: creditcarddetail.data,
    bill: creditcarddetail.bill,
    record: creditcarddetail.record,
    banks: bank.data,
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    data: creditcarddetail.data,
    bill: creditcarddetail.bill,
    record: creditcarddetail.record,
    banks: bank.data,
    loading: loading.effects['creditcarddetail/fetch' | 'creditcarddetail/fetchBill' | 'creditcarddetail/update'],
  }),
)
class Index extends Component<ListProps> {
  state: DetailState = {
    width: '100%',
    tabActiveKey: "billTab",
    modalVisible: false,
    editVisible: false,
    currBill: null
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
    const {dispatch, match: {params}} = this.props;

    dispatch({
      type: 'creditcarddetail/fetch',
      payload: params,
    });

    dispatch({
      type: 'creditcarddetail/fetchBill',
      payload: params,
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

  columns = [
    {
      title: '账单时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => {
        return <Tag>{moment(new Date(text)).format('YYYY-MM-DD')}</Tag>;
      },
    },
    {
      title: '账单金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '还款日',
      dataIndex: 'repayment_day',
      key: 'repayment_day',
      render: (text: string) => {
        return <Tag>{moment(new Date(text)).format('YYYY-MM-DD')}</Tag>;
      },
    },
    {
      title: '还款时间',
      dataIndex: 'repay_time',
      key: 'repay_time',
      render: (text: string) => {
        if (text == null) {
          return <Tag color="red">-</Tag>
        }
        return <Tag color={"green"}>{moment(new Date(text)).format('YYYY-MM-DD H:m')}</Tag>;
      },
    },
    {
      title: '还款',
      dataIndex: 'is_repay',
      key: 'is_repay',
      render: (text: boolean) => {
        if (text) {
          return <Tag color="green">已还</Tag>
        }
        return <Tag color="red">未还</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record: BillType) => {
        if (!record.is_repay) {
          return <Fragment>
            <a onClick={() => this.showRepayment(true, record)}>还款</a>
            <Divider type="vertical"/>
            <span>分期</span>
          </Fragment>
        }
        return ('')
      },
    },
  ];

  showRepayment = (visible: boolean, bill: BillType) => {
    this.setState({
      modalVisible: visible,
      currBill: bill
    });
  };

  handleRepayment = (fieldsValue: RepaymentState) => {
    const {dispatch, match: {params}} = this.props;
    dispatch({
      type: 'creditcarddetail/repay',
      payload: fieldsValue,
      callback: () => {
        this.showRepayment(false, null);
        dispatch({
          type: 'creditcarddetail/fetch',
          payload: params,
        });

        dispatch({
          type: 'creditcarddetail/fetchBill',
          payload: params,
        });
      },
    });
  };

  handleUpdate = (params: CreditCardType) => {
    const {dispatch, match, data} = this.props;
    params.id = data.id;

    dispatch({
      type: 'creditcarddetail/update',
      payload: params,
      callback: () => {
        dispatch({
          type: 'creditcarddetail/fetch',
          payload: match.params,
        });
      },
    });

    this.handleModalVisible();
  };

  handleModalVisible = (flag?: boolean) => {
    if (flag) {
      const {dispatch} = this.props;
      dispatch({
        type: 'bank/fetch',
      });
    }

    this.setState({
      editVisible: !!flag,
    });
  };

  onTabChange = (key: string) => {
    const {dispatch, match: {params}} = this.props;
    if (key == "recordTab") {
      dispatch({
        type: 'creditcarddetail/fetchRecord',
        payload: params,
      });
    } else if (key == "billTab") {
      dispatch({
        type: 'creditcarddetail/fetchBill',
        payload: params,
      });
    }
    this.setState({tabActiveKey: key});
  };

  onChangeRecord = (pagination: Partial<TableListPagination>,
                    filtersArg: Record<keyof ListItem, string[]>,
                    sorter: SorterResult<ListItem>,) => {
    const {tabActiveKey} = this.state;
    const {dispatch, match: {params}} = this.props;
    params.page = pagination.current;
    params.pageSize = pagination.pageSize;
    if (tabActiveKey == "billTab") {
      dispatch({
        type: 'creditcarddetail/fetchBill',
        payload: params,
      });
    } else {
      dispatch({
        type: 'creditcarddetail/fetchRecord',
        payload: params,
      });
    }
  };

  render() {
    const {data, bill, banks, record} = this.props;
    const {tabActiveKey, modalVisible, currBill, editVisible} = this.state;

    if (!data || !data.user) {
      return ('')
    }

    const description = (
      <RouteContext.Consumer>
        {({isMobile}) => (
          <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
            <Descriptions.Item label="创建人">{data.user.username}</Descriptions.Item>
            <Descriptions.Item label="所属银行">{data.bank.bank_name}</Descriptions.Item>
            <Descriptions.Item
              label="创建时间">{moment(new Date(data.created_at)).format('YYYY/MM/DD H:m')}</Descriptions.Item>
            <Descriptions.Item label="卡号末四位">{data.tail_number}</Descriptions.Item>
            <Descriptions.Item label="固定额度">{data.fixed_amount}</Descriptions.Item>
            <Descriptions.Item label="临时额度">{data.max_amount}</Descriptions.Item>
            <Descriptions.Item label="账单日">每月 {data.billing_day} 日</Descriptions.Item>
            <Descriptions.Item label="还款日">每月 {data.cardholder} 日</Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const extraContent = (
      <div className={styles.moreInfo}>
        <Statistic title="剩余额度" value={data.remaining_amount} prefix="¥"/>
      </div>
    );

    const action = (
      <RouteContext.Consumer>
        {({isMobile}) => (<Fragment>
          <Button type="primary" onClick={(e) => this.handleModalVisible(true)}>编辑</Button>
        </Fragment>)}

      </RouteContext.Consumer>
    );

    const parentMethods = {
      handleAdd: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      banks: banks,
      creditCard: data,
    };

    const contentList = {
      billTab: (
        <Card title="账单列表" style={{marginBottom: 24}} bordered={false}>
          <StandardTable columns={this.columns} data={bill}/>
        </Card>
      ),
      recordTab: (
        <Card title={"消费记录"} style={{marginBottom: 24}} bordered={false}>
          <StandardTable columns={[
            {
              title: '时间',
              dataIndex: 'created_at',
              key: 'created_at',
              render: (text: string) => {
                return <Tag>{moment(new Date(text)).format('YYYY-MM-DD H:m:s')}</Tag>;
              },
            }, {
              title: '金额',
              dataIndex: 'amount',
              key: 'amount',
              render: (text: number) => {
                return <Tag>{text}</Tag>;
              },
            }, {
              title: '到账',
              dataIndex: 'arrival',
              key: 'arrival',
              render: (text: number) => {
                return <Tag>{text}</Tag>;
              },
            }, {
              title: '费率',
              dataIndex: 'rate',
              key: 'rate',
              render: (text: number) => {
                return <Tag>{(text * 100).toFixed(2)}%</Tag>;
              },
            }, {
              title: '商户类型',
              dataIndex: 'business',
              key: 'business',
              render: (text: BusinessType) => {
                return <Tag>{text.business_name}</Tag>;
              },
            },
            {
              title: '商户',
              dataIndex: 'business_name',
              key: 'business_name',
              render: (text: string) => {
                return <Tag>{text}</Tag>;
              },
            }
          ]} data={record} onChange={this.onChangeRecord}/>
        </Card>
      )
    };

    return (
      <div>
        <PageHeaderWrapper
          title={data.card_name}
          extra={action}
          className={styles.pageHeader}
          content={description}
          extraContent={extraContent}
          tabActiveKey={tabActiveKey}
          onTabChange={this.onTabChange}
          tabList={[
            {
              key: 'billTab',
              tab: '账单历史',
            },
            {
              key: 'recordTab',
              tab: '刷卡记录',
            },
          ]}>

          <div className={styles.main}>
            <GridContent>
              {contentList[this.state.tabActiveKey]}
            </GridContent>
          </div>

          <Repayment modalVisible={modalVisible} handleModalVisible={this.showRepayment}
                     handleRepayment={this.handleRepayment} bill={currBill} card={data}/>
        </PageHeaderWrapper>

        <CreateForm {...parentMethods} modalVisible={editVisible}/>
      </div>
    );
  }
}

export default Form.create<ListProps>()(Index);
