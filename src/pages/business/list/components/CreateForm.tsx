import { Form, Input, Modal, Select, Icon, Divider, InputNumber } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { BankType } from '@/types/bank';
import { CreditCardType } from '@/types/creditcard';

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: CreditCardType) => void;
  handleModalVisible: () => void;
  banks: BankType[];
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="添加商户类型"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="MCC">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, type: 'number', message: '请输入MCC！', min: 1000, max: 9999 }],
        })(
          <InputNumber
            style={{ width: 120 }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="MCC"
            min={1000}
            max={9999}
          />,
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商户类型">
        {form.getFieldDecorator('business_name', {
          rules: [{ required: true, message: '请输入商户类型!', max: 500 }],
        })(<Input placeholder="请输入商户类型!" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
