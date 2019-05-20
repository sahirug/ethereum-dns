import React, { Component } from 'react';
import {
    Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
} from 'antd';

const Option = Select.Option;

class DnsForm extends Component {

    renderSelect = (options) => {
        return (
            <Select>
                {
                    options.map(option => {
                        return (
                            <Option value={option.id} key={option.id}>{option.label}</Option>
                        );
                    })
                }
            </Select>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.submitHandler(values);
            }
        });
    }

    testValidation = (rule, value, callback) => {
        const form = this.props.form;
        if (false || value && value !== 'a') {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    generateFormFields = () => {
        const { formData } = this.props;
        const { getFieldDecorator } = this.props.form;
        const customValidator = [
            {
                validator: this.testValidation
            }
        ];
        return formData.map((field, index) => {
            return (
                <Form.Item label={field.label} key={index}>
                    {getFieldDecorator(field.key, {
                        initialValue: field.defaultValue,
                        rules: [
                            {
                                required: true, message: 'Please input a ' + field.label,
                            }, ...(field.validators ? field.validators : [])
                        ]
                    })(
                        field.type === undefined ? <Input disabled={field.disabled} /> :
                            field.type === 'select' ? this.renderSelect(field.options) : <Input disabled={field.disabled} />
                    )}
                </Form.Item>
            );
        });
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 1 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 10,
                },
            },
        };

        const { context, scope } = this.props;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                {this.generateFormFields()}
                <Form.Item {...tailFormItemLayout}>
                    <Button type="default" style={{ marginRight: '50px' }} onClick={this.props.cancelHandler}>Cancel</Button>
                    <Button type="primary" htmlType="submit">{scope === 'profile' ? 'Add' : 'Edit'}</Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedDnsForm = Form.create({ name: 'register' })(DnsForm);
export default WrappedDnsForm;