const TokenRegistry = artifacts.require("./TokenRegistry.sol");
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');
const getEventLogs = require('./support/getEventLogs.js');
const catchOpcodeErr = require('./support/catchOpcodeErr.js');

const web3 = TokenRegistry.web3;
const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

contract('TokenRegistry', function (accounts) {

  it("add/delete/get", async function () {
    const instance = await TokenRegistry.deployed();

    await instance.addToken("My Token", 18, "MTK", "0x0000000000000000000000012354689321091313");

    const values = await instance.getToken("MTK");

    assert.equal(values[0], "My Token");
    assert.equal(values[1], 18);
    assert.equal(values[2], "0x0000000000000000000000012354689321091313");

    await instance.removeToken("MTK");

    const newValues = await instance.getToken("MTK");
    assert.equal(newValues[0], "");
  });

});
