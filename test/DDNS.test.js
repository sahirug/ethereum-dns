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

    it('Throw error when domain name exists and still valid', async () => {
        const domainName = web3.utils.utf8ToHex("sahirug");
        const ipAddr = web3.utils.utf8ToHex("127.0.0.1");
        const tld = web3.utils.utf8ToHex(".com");        
        const price = await contract.getPrice(domainName);

        await contract.register(domainName, tld, ipAddr, { from: accounts[0], value: price });
        const result = await contract.register(domainName, tld, ipAddr, { from: accounts[0], value: price });
        await assertRevert(result);
    });
});