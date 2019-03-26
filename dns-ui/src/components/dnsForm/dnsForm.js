import React, { Component } from 'react';
import {
    Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
} from 'antd';

class DnsForm extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.submitHandler(values);
            }
        });
    }

    generateFormFields = () => {
        const { formData } = this.props;
        const { getFieldDecorator } = this.props.form;
        return formData.map((field, index) => {
            return (
                <Form.Item label={field.label} key={index}>
                    {getFieldDecorator(field.key, {
                        initialValue: field.defaultValue,
                        rules: [{
                            required: true, message: 'Please input a ' + field.label,
                        }]
                    })(
                        <Input disabled={field.disabled}/>
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

        const { context } = this.props;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                {this.generateFormFields()}
                <Form.Item {...tailFormItemLayout}>
                    <Button type="default" style={{ marginRight: '50px' }} onClick={this.props.cancelHandler}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedDnsForm = Form.create({ name: 'register' })(DnsForm);
export default WrappedDnsForm;