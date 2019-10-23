import { Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';
import styles from './index.less';
import {BillType} from "@/types/bill";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: BillType[];
    pagination: StandardTableProps<BillType>['pagination'];
  };
}

export interface StandardTableColumnProps extends ColumnProps<BillType> {
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends Component<StandardTableProps<BillType>> {
  constructor(props: StandardTableProps<BillType>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  render() {
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};

    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={rowKey || 'id'}
          // rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
