# River Exchange

River Exchange is a Distributed Application (Dapp) ERC20 Token Exchange running on the Ethereum Blockchain, allowing:
- Deposits/Withdrawals for Eth and ERC20 tokens
- Orders creation/cancel/execution
- Buy and Sell orders listing

Built with :
- Truffle.js
- Solidity Smart Contracts
- Web3.js
- React.js + Redux + Redux Sagas +  Babel + Webpack
- Smart Contract Unit with Mocha.js

Todo/Possible improvements : 
- Balance locking to avoid phantom orders
- Balance and Orders syncing "a-la-websockets" via Ethereum Events
- Sharding to avoid query slowdown of orders due to order list growth

Dapp live on the Rinkeby testnet at https://river-x.firebaseapp.com/ 