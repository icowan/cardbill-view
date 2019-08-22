import { Button, Divider, Input, InputNumber, Icon, Table, message, Select, Pagination } from 'antd';
import React, { Fragment, PureComponent } from 'react';

import isEqual from 'lodash.isequal';
const { Option } = Select;

interface TableFormDateType {
  id: number;
  card_name: string;
  bank_id: number;
  fixed_amount: number;
  max_amount: number;
  billing_day: number;
  cardholder: number;
  state: number;
  bank: BankType;
  editable: boolean;
  isNew: boolean;
}

interface BankType {
  id: number;
  bank_name: string;
}

interface TableFormProps {
  loading?: boolean;
  value?: TableFormDateType[];
  banks?: BankType[];
  creditCards?: TableFormDateType[];
  pagination?: Pagination;
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
      if (
        !target.bank_id ||
        !target.card_name ||
        !target.billing_day ||
        !target.cardholder ||
        !target.fixed_amount ||
        !target.max_amount
      ) {
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

  onChangeData = (val?: any, key?: string, id?: number) => {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(id, newData);
    if (target) {
      target[key] = val;
      this.setState({ data: newData });
    }
  };

  render() {
    const { loading, data, pagination } = this.state;
    const { banks } = this.props;
    let bankOptions = [];
    for (let i in banks) {
      bankOptions.push(<Option key={banks[i].id}>{banks[i].bank_name}</Option>);
    }

    let columns = [
      {
        title: '银行',
        dataIndex: 'bank',
        key: 'bank',
        width: 180,
        render: (text: BankType, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择银行"
                onChange={val => this.onChangeData(val, 'bank_id', record.id)}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    {/* <Divider style={{ margin: '4px 0' }} />
                    <div style={{ padding: '8px', cursor: 'pointer' }}>
                      <Icon type="plus" /> 添加银行
                    </div> */}
                  </div>
                )}
              >
                {bankOptions}
              </Select>
            );
          }
          return text.bank_name;
        },
      },
      {
        title: '信用卡',
        dataIndex: 'card_name',
        key: 'card_name',
        width: 160,
        render: (text: string, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <Input
                onChange={e => this.handleFieldChange(e, 'card_name', record.id)}
                placeholder="请输入信用卡"
              />
            );
          }
          return text;
        },
      },
      {
        title: '固定额度',
        dataIndex: 'fixed_amount',
        key: 'fixed_amount',
        width: 180,
        render: (text: number, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <InputNumber
                min={1}
                max={999999}
                placeholder="固额"
                onChange={val => this.onChangeData(val, 'fixed_amount', record.id)}
              />
            );
          }
          return text;
        },
      },
      {
        title: '临时额度',
        dataIndex: 'max_amount',
        key: 'max_amount',
        width: 180,
        render: (text: number, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <InputNumber
                min={1}
                max={999999}
                placeholder="临额"
                onChange={val => this.onChangeData(val, 'max_amount', record.id)}
              />
            );
          }
          return text;
        },
      },
      {
        title: '账单日',
        dataIndex: 'billing_day',
        key: 'billing_day',
        render: (text: number, record: any) => {
          if (record.editable) {
            return (
              <InputNumber
                min={1}
                max={31}
                placeholder="账单日"
                onChange={val => this.onChangeData(val, 'billing_day', record.id)}
              />
            );
          }
          return '每月 ' + text + ' 日';
        },
      },
      {
        title: '还款日',
        dataIndex: 'cardholder',
        key: 'cardholder',
        width: 120,
        render: (text: number, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <InputNumber
                min={1}
                max={31}
                placeholder="还款日"
                onChange={val => this.onChangeData(val, 'cardholder', record.id)}
              />
            );
          }
          return '每月 ' + text + ' 日';
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 160,
        render: (text: number, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择状态"
                onChange={val => this.onChangeData(val, 'state', record.id)}
              >
                <Option key={0}>正常</Option>
                <Option key={1}>禁用</Option>
              </Select>
            );
          }
          return text == 0 ? '正常' : '其他';
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
          新增信用卡
        </Button>
        <Table<TableFormDateType>
          loading={loading}
          columns={columns}
          dataSource={data ? data : []}
          pagination={pagination}
          // rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </Fragment>
    );
  }
}

export default TableForm;
