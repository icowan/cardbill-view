import { Button, Divider, Input, Popconfirm, Icon, Table, message, Select } from 'antd';
import React, { Fragment, PureComponent } from 'react';

import isEqual from 'lodash.isequal';
import styles from '../style.less';
import moment from 'moment';
const { Option } = Select;

interface TableFormDateType {
  id: number;
  amount?: any;
  arrival?: any;
  business_name?: string;
  business_type?: number;
  rate?: number;
  card_id?: number;
  card_name?: string;
  isNew: boolean;
  editable?: boolean;
  business?: any;
  credit_card?: any;
  bank?: TableBanksType;
}

interface TableBanksType {
  id: number;
  bank_name: string;
}

interface TableCreditCardsType {
  bank_id: number;
  billing_day: number;
  card_name: string;
  cardholder: number;
  created_at: string;
  fixed_amount: number;
  id: number;
  max_amount: number;
  state: number;
}

interface TableBusinessType {
  id: number;
  business_name: string;
  code: number;
}

interface TableFormProps {
  loading?: boolean;
  value?: TableFormDateType[];
  banks?: TableBanksType[];
  creditCards?: TableCreditCardsType[];
  businesses?: TableBusinessType[];
  onLoadBanks?: () => void;
  loadList?: () => void;
  onLoadCreditCards?: (bankId?: number) => void;
  onChange?: (value: any) => void;
}

interface TableFormState {
  loading?: boolean;
  value?: TableFormDateType[];
  data?: TableFormDateType[];
}
class TableForm extends PureComponent<TableFormProps, TableFormState> {
  static getDerivedStateFromProps(nextProps: TableFormProps, preState: TableFormState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  clickedCancel: boolean = false;

  index = 0;

  cacheOriginData = {};

  constructor(props: TableFormProps) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
    };
  }

  getRowByKey(key: number, newData?: TableFormDateType[]) {
    const { data = [] } = this.state;
    return (newData || data).filter(item => item.id === key)[0];
  }

  toggleEditable = (e: React.MouseEvent | React.KeyboardEvent, key: number) => {
    e.preventDefault();
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: [] });
    }
  };

  newRecord = () => {
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    const { onLoadBanks } = this.props;
    onLoadBanks();
    newData.push({
      id: this.index,
      isNew: true,
      editable: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  // handleKeyPress(e: React.KeyboardEvent, key: string) {
  //   console.log(e, key)
  //   if (e.key === 'Enter') {
  //     this.saveRow(e, key);
  //   }
  // }

  handleFieldChange(e: React.ChangeEvent<HTMLInputElement>, fieldName: string, key: number) {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e: React.MouseEvent | React.KeyboardEvent, key: number) {
    e.persist();
    this.setState({
      loading: true,
    });

    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.amount || !target.card_id || !target.business_type || !target.rate) {
        message.error('请填写完整成员信息。');
        (e.target as HTMLInputElement).focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data = [] } = this.state;
      const { onChange } = this.props;
      if (onChange) {
        onChange([target]);
      }
      this.setState({
        loading: false,
        data: [],
      });
    }, 500);
  }

  // cancel(e: React.MouseEvent, key: string) {
  //   this.clickedCancel = true;
  //   e.preventDefault();
  //   const { data = [] } = this.state;
  //   const newData = [...data];
  //   // 编辑前的原始数据
  //   let cacheOriginData = [];
  //   cacheOriginData = newData.map(item => {
  //     if (item.id === key) {
  //       if (this.cacheOriginData[key]) {
  //         const originItem = {
  //           ...item,
  //           ...this.cacheOriginData[key],
  //           editable: false,
  //         };
  //         delete this.cacheOriginData[key];
  //         return originItem;
  //       }
  //     }
  //     return item;
  //   });

  //   this.setState({ data: cacheOriginData });
  //   this.clickedCancel = false;
  // }

  onChangeBank = (val?: number) => {
    this.props.onLoadCreditCards(val);
  };

  onChangeData = (val?: number, key?: string, id?: number) => {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(id, newData);
    if (target) {
      target[key] = val;
      this.setState({ data: newData });
    }
  };

  render() {
    const { loading, data } = this.state;
    const { banks, creditCards, businesses } = this.props;
    let children = [];
    let creditCardList = [];
    let businessList = [];
    for (let i in banks) {
      children.push(<Option key={banks[i].id}>{banks[i].bank_name}</Option>);
    }
    for (let i in creditCards) {
      creditCardList.push(<Option key={creditCards[i].id}>{creditCards[i].card_name}</Option>);
    }
    for (let i in businesses) {
      businessList.push(
        <Option key={businesses[i].id}>
          {businesses[i].code}-{businesses[i].business_name}
        </Option>,
      );
    }

    let columns = [
      {
        title: '时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 160,
        render: (text: string, record: TableFormDateType) => {
          return moment(new Date(text)).format('YYYY/MM/DD HH:mm');
        },
      },
      {
        title: '银行',
        dataIndex: 'credit_card',
        key: 'bank',
        width: 180,
        render: (text: string, record: TableFormDateType) => {
          // console.log("text", text)
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择银行"
                onChange={this.onChangeBank}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ padding: '8px', cursor: 'pointer' }}>
                      <Icon type="plus" /> 添加银行
                    </div>
                  </div>
                )}
              >
                {children}
              </Select>
            );
          }
          return text.bank.bank_name;
        },
      },
      {
        title: '信用卡',
        dataIndex: 'credit_card',
        key: 'credit_card',
        width: 180,
        render: (text: any, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择信用卡"
                onChange={val => this.onChangeData(val, 'card_id', record.id)}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ padding: '8px', cursor: 'pointer' }}>
                      <Icon type="plus" /> 添加信用卡
                    </div>
                  </div>
                )}
              >
                {creditCardList}
              </Select>
            );
          }
          return text.card_name;
        },
      },
      {
        title: '商户类型',
        dataIndex: 'business_type',
        key: 'business_type',
        width: 180,
        render: (text: string, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择商户类型"
                onChange={val => this.onChangeData(val, 'business_type', record.id)}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ padding: '8px', cursor: 'pointer' }}>
                      <Icon type="plus" /> 添加商户类型
                    </div>
                  </div>
                )}
              >
                {businessList}
              </Select>
            );
          }
          return record.business.business_name;
        },
      },
      {
        title: '商户名称',
        dataIndex: 'business_name',
        key: 'business_name',
        render: (text: string, record: any) => {
          if (record.editable) {
            return (
              <Input
                onChange={e => this.handleFieldChange(e, 'business_name', record.id)}
                // onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入商户名称"
              />
            );
          }
          return text;
        },
      },
      {
        title: '费率',
        dataIndex: 'rate',
        key: 'rate',
        width: 120,
        render: (text: number, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择费率"
                onChange={val => this.onChangeData(val, 'rate', record.id)}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ padding: '8px', cursor: 'pointer' }}>
                      <Icon type="plus" /> 添加费率
                    </div>
                  </div>
                )}
              >
                <Option key={55}>0.55%</Option>
                <Option key={53}>0.53%</Option>
                <Option key={58}>0.58%</Option>
              </Select>
            );
          }
          return (text * 100).toFixed(2) + '%';
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 160,
        render: (text: string, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <Input
                prefix="￥"
                suffix="RMB"
                onChange={e => this.handleFieldChange(e, 'amount', record.id)}
                // onKeyPress={e => this.handleKeyPress(e, record.id)}
                placeholder="金额"
              />
            );
          }
          return '¥' + text;
        },
      },
      {
        title: '到账',
        dataIndex: 'arrival',
        key: 'arrival',
        render: (text: string, record: TableFormDateType) => {
          return '¥' + text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text: string, record: TableFormDateType) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.id)}>添加</a>
                </span>
              );
            }
            return (
              <span>
                {/* <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                 <Divider type="vertical" />
                 <a onClick={e => this.cancel(e, record.key)}>取消</a> */}
              </span>
            );
          }
          return <span>{/* <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a> */}</span>;
        },
      },
    ];
    return (
      <Fragment>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newRecord}
          icon="plus"
        >
          新增记录
        </Button>
        <Table<TableFormDateType>
          loading={loading}
          columns={columns}
          dataSource={data ? data : []}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </Fragment>
    );
  }
}

export default TableForm;
