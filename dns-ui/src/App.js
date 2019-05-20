import React, { Component } from 'react';
import Web3 from "web3";
// import logo from './logo.svg';
import './App.css';
import Sidebar from './components/sidebar/sidebar';
import { Layout, Modal, Button } from 'antd';
import DnsContent from './components/content/content';
import WrappedDnsForm from './components/dnsForm/dnsForm';
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
    modalVisible: false,
    currentDomain: 'Account',
    isAddingTLD: false,
    isAddingIp: false,
    allDomains: []
  };

  componentWillMount() {
    this.getAccount();
    this.getAllDomains();
  }

  getAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0]
    });
    let domains = this.getAccountDetails();
    // this.setState({
    //   domains
    // });
  }

  getAllDomains = async () => {
    let domains = await ddns.methods.getAllDomains().call();
    // domains.forEach(domain => {
    //   console.log((web3.utils.hexToNumberString(domain)) === '0');
    // });
    domains = domains.filter(domain => web3.utils.hexToNumberString(domain) !== '0');
    domains = domains.map(domain => keepOnlyCharacters(web3.utils.hexToAscii(domain)));
    this.setState({
      allDomains: domains
    });
  }

  getAccountDetails = async () => {
    const { account } = this.state;
    let { domains } = this.state;
    domains = [];
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
      },
      {
        label: 'RType',
        key: 'rType',
        disabled: true,
        defaultValue: record.rType
      }
    ];
    let modalVisible = true;
    this.setState({
      formData,
      modalVisible
    });
  }

  showAddDomainModal = () => {
    let formData = [
      {
        label: 'Domain',
        key: 'domain',
        disabled: false,
        validators: [
          { validator: this.validateUniqueDomainName },
          { pattern: new RegExp("^[a-zA-Z0-9]*$"), message: 'Domain cannot have any special characters' }
        ]
      },
      {
        label: 'TLD',
        key: 'tld',
        type: 'select',
        options: [
          {
            id: 'com',
            label: 'com'
          },
          {
            id: 'org',
            label: 'org'
          },
          {
            id: 'lk',
            label: 'lk'
          }
        ],
        disabled: true,
      },
      {
        label: 'IP',
        key: 'newIp',
        disabled: false,
        validators: [
          { pattern: new RegExp("\\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.|$)){4}\\b"), message: 'IP has to be valid format' }
        ]
      },
      {
        label: 'RType',
        key: 'rType',
        type: 'select',
        options: [
          {
            id: 'A',
            label: 'A'
          },
          {
            id: 'AAAA',
            label: 'AAAA'
          }
        ],
        disabled: true,
      }
    ];
    let modalVisible = true;
    this.setState({
      formData,
      modalVisible
    });
  }

  showAddTldModal = () => {
    const { currentDomain, domains } = this.state;
    let domainName = currentDomain.split('.')[0];
    let savedDomain = domains.find(domain => domain.domainName === domainName);

    let unsavedTlds = ["com", "org", "lk"].filter(tld => {
      if (savedDomain.tlds.indexOf(tld) === -1) {
        return tld;
      }
    });

    unsavedTlds = unsavedTlds.map(tld => {
      return {
        id: tld,
        label: tld
      };
    });

    let formData = [
      {
        label: 'Domain',
        key: 'domain',
        disabled: true,
        defaultValue: domainName
      },
      {
        label: 'TLD',
        key: 'tld',
        type: 'select',
        options: unsavedTlds,
        disabled: true,
      },
      {
        label: 'New Ip',
        key: 'newIp',
        disabled: false,
      },
      {
        label: 'RType',
        key: 'rType',
        type: 'select',
        options: [
          {
            id: 'A',
            label: 'A'
          },
          {
            id: 'AAAA',
            label: 'AAAA'
          }
        ],
        disabled: true,
      }
    ];
    let modalVisible = true;
    let isAddingTLD = true;
    this.setState({
      formData,
      modalVisible,
      isAddingTLD
    });
  }

  showAddIpModal = () => {
    const { currentDomain } = this.state;

    let formData = [
      {
        label: 'Domain',
        key: 'domain',
        disabled: true,
        defaultValue: currentDomain.split('.')[0]
      },
      {
        label: 'TLD',
        key: 'tld',
        disabled: true,
        defaultValue: currentDomain.split('.')[1]
      },
      {
        label: 'New Ip',
        key: 'newIp',
        disabled: false,
        // defaultValue: ''
      },
      {
        label: 'RType',
        key: 'rType',
        type: 'select',
        options: [
          {
            id: 'A',
            label: 'A'
          },
          {
            id: 'AAAA',
            label: 'AAAA'
          }
        ],
        disabled: true,
      }
    ];

    let modalVisible = true;
    let isAddingIp = true;
    this.setState({
      formData,
      modalVisible,
      isAddingIp
    });
  }

  cancelModal = () => {
    this.setState({
      formData: [],
      modalVisible: false,
      isAddingTLD: false,
      isAddingIp: false
    });
  }

  editIp = async (values) => {
    const { currentDomain, account } = this.state;
    let domainData = currentDomain.split(".");
    let domainName = this.convertToHex(domainData[0]);
    let tld = this.convertToHex(domainData[1], 12);
    let newIp = this.convertToHex(values.newIp);
    let key = values.key;
    let rType = this.convertToHex(values.rType);

    await ddns.methods.editDomain(domainName, tld, newIp, key, rType).send({ from: account });

    this.handleMenuClick({ key: currentDomain });

    this.setState({
      modalVisible: false
    });
  }

  addDomain = async (values) => {
    let { account, allDomains } = this.state;
    let domainName = this.convertToHex(values.domain);
    let tld = this.convertToHex(values.tld, 12);
    let newIp = this.convertToHex(values.newIp);
    let rType = this.convertToHex(values.rType);

    await ddns.methods.register(domainName, tld, newIp, rType).send({ from: account });

    allDomains.push(values.domain);

    this.setState({
      modalVisible: false,
      allDomains
    });

    this.getAccountDetails();
  }

  addTld = async (values) => {
    const { account } = this.state;
    let domainName = this.convertToHex(values.domain);
    let tld = this.convertToHex(values.tld, 12);
    let newIp = this.convertToHex(values.newIp);
    let rType = this.convertToHex(values.rType);

    await ddns.methods.addTldToDomain(domainName, tld, newIp, rType).send({ from: account });
    this.setState({
      isAddingTLD: false,
      modalVisible: false
    });
  }

  addIp = async (values) => {
    const { account } = this.state;
    let domainName = this.convertToHex(values.domain);
    let tld = this.convertToHex(values.tld, 12);
    let newIp = this.convertToHex(values.newIp);
    let rType = this.convertToHex(values.rType);

    await ddns.methods.edit(domainName, tld, newIp, rType).send({ from: account });

    this.setState({
      isAddingIp: false,
      modalVisible: false
    });
  }

  convertToHex = (string, len = 32) => {
    return web3.utils.asciiToHex(string, len);
  }

  handleMenuClick = async (val) => {
    let viewType = 'profile';
    let data = {};
    let currentDomain = '';
    if (val.key != 1) {
      viewType = 'ips';
      data.title = val.key;
      data.handlers = {
        onEdit: this.showEditIpModal
      };
      data.ips = await this.loadIpsForDomain(val.key);
      currentDomain = val.key;
    } else {
      data = {};
      data.handlers = {
        addNewDomain: this.showAddDomainModal
      };
      currentDomain = 'Account';
    }
    this.setState({
      viewType,
      data,
      currentDomain
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

  validateUniqueDomainName = (rule, value, callback) => {
    let { allDomains } = this.state;
    if (false || value && allDomains.includes(value)) {
      callback('Domain Name exists!');
    } else {
      callback();
    }
  }

  testValidation = (rule, value, callback) => {
    if (false || value && value !== 'a') {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  render() {
    const { viewType, formData, currentDomain, isAddingTLD, isAddingIp } = this.state;
    let { domains, data } = this.state;
    if (domains == undefined) {
      domains = [];
    }

    if (data === undefined) {
      data = {};
      data.handlers = {
        addNewDomain: this.showAddDomainModal
      };
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
              <h1>
                {currentDomain}
                {currentDomain !== 'Account' ? <span style={{ float: 'right', marginRight: '30px' }}><Button type="primary" ghost onClick={this.showAddTldModal}> Add TLD </Button></span> :
                  <span style={{ float: 'right', marginRight: '30px' }}><Button type="primary" ghost> Help </Button></span>}
              </h1>
            </div>
          </Header>
          <DnsContent type={viewType} data={data} miscFuncs={{ addIpModal: this.showAddIpModal }} />
          <Footer style={{ textAlign: "center" }}>
            EthDNS ©2019 Created by sahirug@gmail.com
          </Footer>
        </Layout>
        <Modal
          title="Edit Domain"
          visible={this.state.modalVisible}
          footer={[
            null,
          ]}
          closable={false}
        >
          <WrappedDnsForm
            formData={formData}
            cancelHandler={this.cancelModal}
            submitHandler={viewType === 'profile' ? this.addDomain : isAddingTLD ? this.addTld : isAddingIp ? this.addIp : this.editIp}
            scope={viewType}
          />
        </Modal>
      </Layout>
    );
  }
}

export default App;
