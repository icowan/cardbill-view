import {Button, Card, Form, Icon, List, Tag, Typography, Avatar} from 'antd';
import React, {Component} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Action, Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {connect} from 'dva';
import {CreditCardType, ListState} from '@/pages/creditcard/list/data';
import {BankType} from '@/pages/bank/list/data';
import CreateForm from '@/pages/creditcard/list/components/CreateForm';
import {BankStateType} from '@/models/bank';
import {CreditCardStateType} from '@/pages/creditcard/list/model';
import styles from "./style.less";
import {Link} from "umi";

const {Paragraph} = Typography;

interface ListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'creditcard/fetch' | 'creditcardList/add' | 'bank/fetch'>>;
  loading: boolean;
  creditcard: CreditCardStateType;
}

const BankColor = {
  '1': 'magenta',
  '2': 'red',
  '3': 'volcano',
  '4': 'orange',
  '5': 'gold',
  '6': 'lime',
  '7': 'green',
  '8': 'cyan',
  '9': 'blue',
  '10': 'geekblue',
  '11': 'purple',
  '12': '#f50',
  '13': '#2db7f5',
  '14': '#10239e',
  '15': '#391085',
  '16': '#9e1068',
  '17': '#391085',
  '18': '#eb2f96',
  '19': '#520339',
  '20': '#120338',
};

@connect(
  ({
     creditcard,
     bank,
     loading,
   }: {
    creditcard: CreditCardStateType;
    bank: BankStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    creditcard,
    bank,
    loading: loading.effects['creditcard/fetch'],
  }),
)
class Index extends Component<ListProps, ListState> {
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
        return <Tag color={BankColor[text.id]}>{text.bank_name}</Tag>;
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
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
    const {dispatch} = this.props;
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
        const {width: stateWidth} = this.state;
        if (stateWidth !== width) {
          this.setState({width});
        }
      }
    });
  };

  handleAdd = (params: CreditCardType) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'creditcardList/add',
      payload: params,
      callback: () => {
        dispatch({type: 'creditcard/fetch'});
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
      modalVisible: !!flag,
    });
  };

  render() {
    const {
      creditcard: {data},
      bank,
      loading,
    } = this.props;

    const {modalVisible} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      banks: bank.data,
    };

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          随时随地管理您的信用卡
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"/>{' '}
            使用简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"/>{' '}
            使用文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>

      </div>
    );

    const nullData: Partial<CreditCardType> = {};

    return (
      <div>
        <PageHeaderWrapper content={content} extra={extraContent}>
          {/*<Card*/}
          {/*  title="信用卡列表"*/}
          {/*  bordered={false}*/}
          {/*  extra={*/}
          {/*    <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*/}
          {/*      增加信用卡*/}
          {/*    </Button>*/}
          {/*  }*/}
          {/*>*/}
          {/*  <StandardTable loading={loading} data={{ list: data }} columns={this.columns} />*/}
          {/*</Card>*/}

          <List<Partial<CreditCardType>>
            rowKey="id"
            loading={loading}
            grid={{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}}
            dataSource={[nullData, ...data]}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[<Link to={`/credit-card/${item.id}/record`} key="option1">查看消费</Link>, <Link key="option2" to={`/credit-card/${item.id}/bill`}>查看账单</Link>]}
                    >
                      <Card.Meta
                        avatar={<Avatar className={styles.cardAvatar}
                                        style={{backgroundColor: BankColor[item.bank.id]}}>{item.bank.bank_name.slice(0,1)}</Avatar>}
                        title={<a>{item.bank.bank_name} - {item.card_name}</a>}
                        description={
                          <Paragraph className={styles.item} ellipsis={{rows: 3}}>
                            <p>固定额度: <b>{item.fixed_amount}</b></p>
                            <p>临时额度: {item.max_amount}</p>
                            <p>账单日: 每月 {item.billing_day} 日</p>
                            <p>还款日: 每月 {item.cardholder} 日</p>
                          </Paragraph>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }

              return (
                <List.Item>
                  <Button type="dashed" onClick={() => this.handleModalVisible(true)} className={styles.newButton}>
                    <Icon type="plus"/> 增加信用卡
                  </Button>
                </List.Item>
              );
            }}
          />

          <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create<ListProps>()(Index);
