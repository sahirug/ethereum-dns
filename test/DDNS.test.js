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

    // it('Throw error when domain name exists and still valid', async () => {
    //     const domainName = web3.utils.utf8ToHex("sahirug");
    //     const ipAddr = web3.utils.utf8ToHex("127.0.0.1");
    //     const tld = web3.utils.utf8ToHex(".com");        
    //     const price = await contract.getPrice(domainName);

    //     await contract.register(domainName, tld, ipAddr, { from: accounts[0], value: price });
    //     const result = await contract.register(domainName, tld, ipAddr, { from: accounts[0], value: price });
    //     await assertRevert(result);
    // });

    it('resolves yahoo', async () => {
        const domainName = web3.utils.utf8ToHex("yahoo");
        const ipAddr = web3.utils.utf8ToHex("1.2.3.4");
        const tld = web3.utils.utf8ToHex("com");        
        const price = await contract.getPrice(domainName);

        // console.log(await contract.getDomainHash(domainName, tld));

        await contract.register(domainName, tld, ipAddr, {
            from: accounts[0],
            value: price
        });

        const ips = await contract.getIp(domainName, tld);
        ips.forEach(ip => {
            assert.equal("1.2.3.4", web3.utils.hexToUtf8(ip));
        })
    });

    it('resolves google', async () => {
        const domainName = web3.utils.utf8ToHex("google");
        const tld = web3.utils.utf8ToHex("com");        
        const price = await contract.getPrice(domainName);

        const ips = await contract.getIp(domainName, tld);
        ips.forEach(ip => {
            assert.equal("9.9.9.9", web3.utils.hexToUtf8(ip));
        })
    });

    it('saves state', async() => {
        const google = web3.utils.utf8ToHex("google");
        const yahoo = web3.utils.utf8ToHex("yahoo");
        const tld = web3.utils.utf8ToHex("com"); 
        
        const googleIps = await contract.getIp(google, tld);
        googleIps.forEach(googleIp => {
            assert.equal("9.9.9.9", web3.utils.hexToUtf8(googleIp));
        })

        const yahooIps = await contract.getIp(yahoo, tld);
        yahooIps.forEach(yahooIp => {
            assert.equal("1.2.3.4", web3.utils.hexToUtf8(yahooIp));
        })
    });

    it('edit a domain', async() => {
        const yahoo = web3.utils.utf8ToHex("yahoo");
        const tld = web3.utils.utf8ToHex("com");
        const newIp = web3.utils.utf8ToHex("5.5.5.5");
        await contract.edit(yahoo, tld, newIp, {
            from: accounts[0]
        });
    });

    it('checks if domain was edtited', async() => {
        const yahoo = web3.utils.utf8ToHex("yahoo");
        const tld = web3.utils.utf8ToHex("com");
        const ips = await contract.getIp(yahoo, tld);

        requiredIps = ["1.2.3.4", "5.5.5.5"];

        ips.forEach((ip, key) => {
            assert.equal(requiredIps[key], web3.utils.hexToUtf8(ip));
        });
    });
});