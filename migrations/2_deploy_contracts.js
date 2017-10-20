var HumanStandardToken = artifacts.require("./HumanStandardToken.sol");
var TokenRegistry = artifacts.require("./TokenRegistry.sol");
var OrderBook = artifacts.require("./OrderBook.sol");
const Web3 = require('web3');

module.exports =  function (deployer) {
  const web3 = new Web3(deployer.provider);
  deployer.deploy(HumanStandardToken, 5 * Math.pow(10, 4), "River X Token", 3, "RXT");
  deployer.deploy(TokenRegistry);
  deployer.deploy(OrderBook);
};
