import TokenRegistryContract from '../../build/contracts/TokenRegistry.json'

const contract = require('truffle-contract');

async function loadTokens(web3) {
  const tokenRegistryContract = contract(TokenRegistryContract);
  tokenRegistryContract.setProvider(web3.currentProvider);

  const instance = await tokenRegistryContract.deployed();

  let tokenAddresses = await instance.getTokenAddresses();

  let tokens = [];

  for (let i = 0; i < tokenAddresses.length; i++) {
    const tokenAddress = tokenAddresses[i];
    if (!tokenAddress) { // deleted symbol
      continue;
    }

    const values = await instance.getToken(tokenAddress);
    tokens.push({
      name: values[0],
      decimals: values[1].toNumber(),
      symbol: values[2],
      id: values[3].toNumber(),
      contractAddress: tokenAddress
    });
  }

  return tokens;
}

let tokenRegistryService = {
  loadTokens: loadTokens
};

export default tokenRegistryService;