pragma solidity ^0.4.11;


contract TokenRegistry {

    struct TokenInfo {
    string name;
    uint8 decimals;
    string symbol;
    address contractAddress;
    uint id;
    }

    address public owner;

    mapping (string => TokenInfo) tokens;

    string[] tokenSymbols;

    event TokenAdded(string _name, uint8 _decimals, string _symbol, address _contractAddress);

    event TokenRemoved(string _symbol);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function TokenRegistry() public {
        owner = msg.sender;
    }

    function addToken(string _name, uint8 _decimals, string _symbol, address _contractAddress) onlyOwner public {
        // avoid overwrite
        require(tokens[_symbol].contractAddress == address(0));

        tokens[_symbol] = TokenInfo(_name, _decimals, _symbol, _contractAddress, tokenSymbols.length + 1);
        tokenSymbols.push(_symbol);

        TokenAdded(_name, _decimals, _symbol, _contractAddress);
    }

    function removeToken(string _symbol, uint _id) onlyOwner public {
        delete tokens[_symbol];
        delete tokenSymbols[_id - 1];
        TokenRemoved(_symbol);
    }

    function getToken(string _symbol) constant returns (string name, uint8 decimals, address contractAddress, uint id) {
        var tokenInfo = tokens[_symbol];
        return (tokenInfo.name, tokenInfo.decimals, tokenInfo.contractAddress, tokenInfo.id);
    }

    function getTokenSymbol(uint _id) constant returns (string symbol) {
        var tokenSymbol = tokenSymbols[_id - 1];
        return (tokenSymbol);
    }

    function getTokenSymbolsLength() constant public
    returns (uint length){
        return tokenSymbols.length;
    }

}