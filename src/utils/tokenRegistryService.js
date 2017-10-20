import TokenRegistryContract from '../../build/contracts/TokenRegistry.json'

const contract = require('truffle-contract');

async function loadTokens(web3) {
  const tokenRegistryContract = contract(TokenRegistryContract);
  tokenRegistryContract.setProvider(web3.currentProvider);

  const instance = await tokenRegistryContract.deployed();

  const tokenSymbolsLength = await instance.getTokenSymbolsLength();

  let tokenSymbols = [];
  for (let i = 0; i < tokenSymbolsLength.toNumber(); i++) {
    const tokenSymbol = await instance.getTokenSymbol(i + 1);
    tokenSymbols.push(tokenSymbol);
  }

  let tokens = [];

  for (let i = 0; i < tokenSymbols.length; i++) {
    const tokenSymbol = tokenSymbols[i];
    if (!tokenSymbol) { // deleted symbol
      continue;
    }

    const values = await instance.getToken(tokenSymbol);
    tokens.push({
      name: values[0],
      decimals: values[1],
      contractAddress: values[2],
      id: values[3],
      symbol: tokenSymbol
    });
  }

  return tokens;
}

let tokenRegistryService = {
  loadTokens: loadTokens
};

export default tokenRegistryService;