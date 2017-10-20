pragma solidity ^0.4.11;


contract TokenRegistry {

    struct TokenInfo {
    string name;
    uint8 decimals;
    string symbol;
    address contractAddress;
    }

    address public owner;

    mapping (string => TokenInfo) tokens;

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

        tokens[_symbol] = TokenInfo(_name, _decimals, _symbol, _contractAddress);
        TokenAdded(_name, _decimals, _symbol, _contractAddress);
    }

    function removeToken(string _symbol) onlyOwner public {
        delete tokens[_symbol];
        TokenRemoved(_symbol);
    }

    function getToken(string _symbol) constant returns (string name, uint8 decimals, address contractAddress) {
        var tokenInfo = tokens[_symbol];
        return (tokenInfo.name, tokenInfo.decimals, tokenInfo.contractAddress);
    }

}