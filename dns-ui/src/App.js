import React, { Component } from 'react';
import Web3 from "web3";
// import logo from './logo.svg';
import './App.css';
import Sidebar from './components/sidebar/sidebar';
import { Layout, Modal } from 'antd';
import DnsContent from './components/content/content';
import WrappedDnsForm  from './components/dnsForm/dnsForm';
import { abi, address } from "./config";
import { keepOnlyCharacters, keepIpCharacters } from "./utils";

const { Header, Footer } = Layout;
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const ddns = new web3.eth.Contract(abi, address);
class App extends Component {

  state = {
    account: '',
    viewType: 'profile',
    domains: [],
    formData: [],
    modalVisible: false
  };

  componentWillMount() {
    this.getAccount();
  }

  getAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0]
    });
    let domains = this.getAccountDetails().then(domains => console.log(domains));
    // console.log('domains: ', domains);
    // this.setState({
    //   domains
    // });
  }

  getAccountDetails = async () => {
    const { account, domains } = this.state;
    let acc = await web3.eth.accounts[0];
    console.log('account: ', account);
    let domainsFromBlockchain = await ddns.methods.getDomainsForAddress(account).call();
    domainsFromBlockchain = domainsFromBlockchain.map(async (domain) => {
      let tlds = await ddns.methods.getTldForDomain(domain).call();
      tlds = tlds.map(tld => {
        tld = web3.utils.hexToAscii(tld);
        return keepOnlyCharacters(tld);
      });
      domain = web3.utils.hexToAscii(domain);
      let obj = {
        domainName: keepOnlyCharacters(domain),
        tlds: tlds
      };
      domains.push(obj);
      this.setState({
        domains
      });
    });
    return domainsFromBlockchain;
  }

  showEditIpModal = (record, domain) => {
    let formData = [
      {
        label: 'Key',
        key: 'key',
        disabled: true,
        defaultValue: record.id
      },
      {
        label: 'Old Ip',
        key: 'oldIp',
        disabled: true,
        defaultValue: record.ip
      },
      {
        label: 'New Ip',
        key: 'newIp',
        disabled: false,
        defaultValue: ''
      }
    ];
    console.log('formdata', formData);
    let modalVisible = true;
    this.setState({
      formData,
      modalVisible
    });
  }

  cancelModal = () => {
    this.setState({
      formData: [],
      modalVisible: false
    });
  }

  editIp = () => {
    console.log('edit ip');
  }

  convertToHex = (string, len = 32) => {
    return web3.utils.asciiToHex(string, len);
  }

  handleMenuClick = async (val) => {
    let viewType = 'profile';
    let data = {};
    if (val.key != 1) {
      viewType = 'ips';
      data.title = val.key;
      data.handlers = {
        onEdit: this.showEditIpModal
      };
      data.ips = await this.loadIpsForDomain(val.key);
    } else {
      data = {};
    }
    this.setState({
      viewType,
      data
    });
  }

  loadIpsForDomain = async (domain) => {
    let domainData = domain.split(".");
    let domainName = this.convertToHex(domainData[0]);
    let tld = this.convertToHex(domainData[1], 12);
    let a = this.convertToHex("A");
    let aaaa = this.convertToHex("AAAA");

    let aRecords = await ddns.methods.getIp(domainName, tld, a).call();
    let aaaaRecords = await ddns.methods.getIp(domainName, tld, aaaa).call();

    aRecords = aRecords[0].map((aRecord, index) => {
      let record = web3.utils.hexToAscii(aRecord);
      return {
        id: index,
        ip: keepIpCharacters(record),
        rType: 'A'
      }
    });

    aaaaRecords = aaaaRecords[0].map((aaaaRecord, index) => {
      let record = web3.utils.hexToAscii(aaaaRecord);
      return {
        id: index,
        ip: keepIpCharacters(record),
        rType: 'AAAA'
      };
    });

    let data = aRecords.concat(aaaaRecords);

    return data;
  }

  render() {
    const { viewType, data, formData } = this.state;
    let { domains } = this.state;
    if (domains == undefined) {
      domains = [];
    }
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar
          onClick={this.handleMenuClick}
          data={domains}
        />
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <div style={{ marginLeft: 15 }}>
              <h1>Account: </h1>
            </div>
          </Header>
          <DnsContent type={viewType} data={data} /> 
          <Footer style={{ textAlign: "center" }}>
            EthDNS ©2019 Created by sahirug@gmail.com
          </Footer>
        </Layout>
        <Modal
          title="Basic Modal"
          visible={this.state.modalVisible}
          footer={[
            null,
          ]}
        >
          <WrappedDnsForm 
            formData={formData}
            cancelHandler={this.cancelModal}
          />
        </Modal>
      </Layout>
    );
  }
}

export default App;
