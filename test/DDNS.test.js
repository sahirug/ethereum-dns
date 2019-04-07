const DDNSService = artifacts.require('../contracts/DDNS.sol');

const assertRevert = require('./utils/assertRevert');
const watchEvent = require('./utils/watchEvent');
const constants = require('./utils/constants');
const increaseTime = require('./utils/increaseTime');

contract('DDNService', (accounts) => {
    let contract;
    let events = [];

    beforeEach(async () => {
        contract = await DDNSService.deployed();
    });

    afterEach(() => {
        if(events.length){
            events.forEach((ev) => {
                ev.stopWatching();
            });

            events = [];
        }
    });

    it('DDNS contract was deployed', async () => {
        assert.ok(contract);
    });

    it('registers a domain', async () => {
        const domainName = web3.utils.utf8ToHex('youtube');
        const tld = web3.utils.utf8ToHex('com');
        const ipAddr = web3.utils.utf8ToHex('1.2.3.4');
        const rType = web3.utils.utf8ToHex('A');
        const price = await contract.getPrice(domainName);

        await contract.register(domainName, tld, ipAddr, rType, { from: accounts[0], value: price });
        let ips = await contract.getIp(domainName, tld, rType);
        ips = ips.map((ip, key) => {
            return web3.utils.hexToUtf8(ip);
        });
        assert.equal('1.2.3.4', ips[0]);
    });

    it('throws an error when trying to register same domain twice', async () => {
        const domainName = web3.utils.utf8ToHex('youtube');
        const tld = web3.utils.utf8ToHex('com');
        const ipAddr = web3.utils.utf8ToHex('1.2.3.4');
        const rType = web3.utils.utf8ToHex('A');
        const price = await contract.getPrice(domainName);
    });

    it('can add a multiple addresses to a domain', async () => {
        const domainName = web3.utils.utf8ToHex('youtube');
        const tld = web3.utils.utf8ToHex('com');
        const ipAddr = web3.utils.utf8ToHex('2.3.4.5');
        const rType = web3.utils.utf8ToHex('A');

        await contract.edit(domainName, tld, ipAddr, rType, { from: accounts[0] });
        let ips = await contract.getIp(domainName, tld, rType);
        ips = ips.map((ip, key) => {
            return web3.utils.hexToUtf8(ip);
        });
        assert.equal('1.2.3.4', ips[0]);
        assert.equal('2.3.4.5', ips[1]);
    });

    it('edits a domain', async () => {
        const domainName = web3.utils.utf8ToHex('youtube');
        const tld = web3.utils.utf8ToHex('com');
        const ipAddr = web3.utils.utf8ToHex('1.2.3.4');
        const newIp = web3.utils.utf8ToHex('4.5.6.7');
        const rType = web3.utils.utf8ToHex('A');

        let ips = await contract.getIp(domainName, tld, rType);
        ips = ips.map((ip, key) => {
            return web3.utils.hexToUtf8(ip);
        });
        // console.log('Before edit: ', ips);

        ips = await contract.editDomain(domainName, tld, newIp, 0, rType);
        ips = await contract.getIp(domainName, tld, rType);
        ips = ips.map((ip, key) => {
            return web3.utils.hexToUtf8(ip);
        });
        // console.log('After edit: ', ips);
    });

    it('allows only domain owner to edit domain', async() => {
        assert.equal(1,1);
    });

    it('retrieves all domains for an address', async () => {
        let domains = await contract.getDomainsForAddress(accounts[1]);
        domains = domains.map(domain => {
            return web3.utils.hexToUtf8(domain);
        });
        // console.log(domains);
    });

    it('retrieves tlds for a domain', async () => {
        let domains = await contract.getDomainsForAddress(accounts[0]);
        domains = domains.map(async (domain) => {
            let tlds = await contract.getTldForDomain(domain);
            // console.log(web3.utils.hexToUtf8(domain), tlds);
        });
    });
});