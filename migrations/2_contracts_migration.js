const SafeMath = artifacts.require('./libs/SafeMath.sol');
const Ownable = artifacts.require('./common/Ownable.sol');
const DDNS = artifacts.require('./DDNS.sol');

module.exports = (deployer) => {
    deployer.deploy(DDNS);
};