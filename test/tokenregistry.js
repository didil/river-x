const TokenRegistry = artifacts.require("./TokenRegistry.sol");
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');
const getEventLogs = require('./support/getEventLogs.js');
const catchOpcodeErr = require('./support/catchOpcodeErr.js');

const web3 = TokenRegistry.web3;
const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

contract('TokenRegistry', function (accounts) {

  it("add/delete/get", async function () {
    const instance = await TokenRegistry.deployed();

    let token1_Address = "0x0000000000000000000000012354689321091313";
    let token2_Address = "0x0000000000000000000000012354689321091315";

    await instance.addToken("My Token", 18, "MTK", token1_Address);
    await instance.addToken("Other Token", 4, "OTK", token2_Address);

    const values = await instance.getToken(token1_Address);

    assert.equal(values[0], "My Token");
    assert.equal(values[1], 18);
    assert.equal(values[2], "MTK");
    assert.equal(values[3].toNumber(), 1);

    let tokenAddresses = await instance.getTokenAddresses();
    assert.deepEqual(tokenAddresses, [token1_Address, token2_Address]);

    await instance.removeToken(token1_Address, 1);

    const newMTKValues = await instance.getToken(token1_Address);
    assert.equal(newMTKValues[0], "");

    const newOTKValues = await instance.getToken(token2_Address);
    assert.equal(newOTKValues[0], "Other Token");

    let newTokenAddresses = await instance.getTokenAddresses();
    assert.deepEqual(newTokenAddresses, ["0x0000000000000000000000000000000000000000", token2_Address]);
  });

});
