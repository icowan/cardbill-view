import { Button, Input, InputNumber, Table, message } from 'antd';
import React, { Fragment, PureComponent } from 'react';

import isEqual from 'lodash.isequal';

interface TableFormDateType {
  id: number;
  business_name: string;
  code: number;
  editable: boolean;
  isNew: boolean;
}

interface TableFormProps {
  loading?: boolean;
  value?: TableFormDateType[];
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
      console.log(target);
      if (!target.business_name || !target.code) {
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
    const { loading, data } = this.state;
    let columns = [
      {
        title: '名称',
        dataIndex: 'business_name',
        key: 'business_name',
        render: (text: string, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <Input
                onChange={e => this.handleFieldChange(e, 'business_name', record.id)}
                placeholder="请输入名称"
              />
            );
          }
          return text;
        },
      },
      {
        title: 'MCC',
        dataIndex: 'code',
        key: 'code',
        render: (text: string, record: TableFormDateType) => {
          if (record.editable) {
            return (
              <InputNumber
                min={1000}
                max={9999}
                onChange={val => this.onChangeData(val, 'code', record.id)}
                placeholder="请输入MCC"
              />
            );
          }
          return text;
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
          新增商户类型
        </Button>
        <Table<TableFormDateType>
          loading={loading}
          columns={columns}
          dataSource={data ? data : []}
          pagination={false}
          // rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </Fragment>
    );
  }
}

export default TableForm;
