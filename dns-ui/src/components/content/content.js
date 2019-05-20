import React, { Component } from 'react';
import { Layout, Breadcrumb, Statistic, Row, Col, Button, Divider, Table, Tag } from 'antd';

const { Content } = Layout;

class DnsContent extends Component {

    state = {
        collapsed: false,
        data: []
    };

    renderProfile = () => {
        const { data } = this.props;
        return (
            <Content style={{ margin: "0 16px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Accounts</Breadcrumb.Item>
                    <Breadcrumb.Item>0x90Ed0334018BB086226475906d815a402c2909cd</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: "#fff", minHeight: "80vh" }}>
                    <Row gutter={16}>
                        <Col span={10}>
                            <Statistic title="Account Address" value={'0x90Ed0334018BB086226475906d815a402c2909cd'} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="Account Balance (ETH)" value={112893} precision={2} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="Registered Domains" value={2} />
                        </Col>
                        <Col span={6}>
                            <h6>Register a new Domain Here</h6>
                            <Button type="primary" size={'large'} onClick={data.handlers.addNewDomain}>Register Domain</Button>
                        </Col>
                    </Row>
                </div>
            </Content>
        );
    }

    renderIps = () => {
        let { data, miscFuncs } = this.props;

        let columns = [
            { title: 'Address', dataIndex: 'ip', key: 'ip' },
            {
                title: 'Type',
                dataIndex: 'rType',
                key: 'rType',
                render: rType => {
                    let color = rType == "A" ? 'geekblue' : 'green';
                    let type = rType == "A" ? 'IPv4' : 'IPv6';
                    return (
                        <Tag color={color} key={rType}>{type}</Tag>
                    );
                }
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (text, record) => {
                    return (
                        <span>
                            <Button type="primary" onClick={() => { data.handlers.onEdit(record, data.title) }}>Edit</Button>
                            <Divider type="vertical" />
                            <Button type="danger">Remove</Button>
                        </span>
                    );
                }
            },
        ];

        return (
            <Content style={{ margin: "0 16px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Domains</Breadcrumb.Item>
                    <Breadcrumb.Item>google.com</Breadcrumb.Item>
                </Breadcrumb>
                <Table columns={columns} dataSource={data.ips} pagination={false}/>
                <div style={{ float: 'right', marginTop: '20px' }}>
                    <Button type="primary" ghost onClick={miscFuncs.addIpModal}>Add IP</Button>
                </div>
            </Content>
        );
    }

    render() {
        const { type } = this.props;

        return (
            type === 'profile' ? this.renderProfile() : this.renderIps()
        );
    }
}

export default DnsContent;
