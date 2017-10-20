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
    await instance.addToken("Other Token", 4, "OTK", "0x0000000000000000000000012354689321091315");

    const values = await instance.getToken("MTK");

    assert.equal(values[0], "My Token");
    assert.equal(values[1], 18);
    assert.equal(values[2], "0x0000000000000000000000012354689321091313");
    assert.equal(values[3].toNumber(), 1);


    const tokenSymbolsLength = await instance.getTokenSymbolsLength();
    assert.equal(tokenSymbolsLength.toNumber(), 2);

    let tokenSymbols = [];
    for (let i = 0; i < tokenSymbolsLength.toNumber(); i++) {
      const tokenSymbol = await instance.getTokenSymbol(i + 1);
      tokenSymbols.push(tokenSymbol);
    }
    assert.deepEqual(tokenSymbols, ['MTK', 'OTK']);

    await instance.removeToken("MTK", 1);

    const newMTKValues = await instance.getToken("MTK");
    assert.equal(newMTKValues[0], "");

    const newOTKValues = await instance.getToken("OTK");
    assert.equal(newOTKValues[0], "Other Token");

    const newTokenSymbolsLength = await instance.getTokenSymbolsLength();
    assert.equal(newTokenSymbolsLength.toNumber(), 2);


    let newTokenSymbols = [];
    for (let i = 0; i < newTokenSymbolsLength.toNumber(); i++) {
      const tokenSymbol = await instance.getTokenSymbol(i + 1);
      newTokenSymbols.push(tokenSymbol);
    }
    assert.deepEqual(newTokenSymbols, ['', 'OTK']);

  });

});
