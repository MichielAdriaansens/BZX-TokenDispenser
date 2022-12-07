//SPDX-License-Identifier: Pen Is
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./Token.sol";

contract Dispenser{    
    address public owner;
    uint256 public tokenLimit;
    mapping(address => uint256) public withdrawRecord;
    mapping(address => uint256) public tokenPool; //tokenaddress > hoeveelheid tokens in dit contract

    event Deposit(address indexed _from, uint256 _value);
    event Withdraw(address indexed _to, address indexed _token, uint256 _value);

    constructor(uint256 limit){
        owner = msg.sender;
        tokenLimit = limit;
    }

    function setTokenLimit(uint256 amount) public{
        require(msg.sender == owner, "account unauthorized to set tokenLimit");
        tokenLimit = amount;
    }
    
    /*
    function _convertAmount(address _token, uint256 _amount) view private returns(uint256){
        uint256 amount = _amount * (10 ** Token(_token).decimals());
        return amount;
    }
    */

    //deposit
    function deposit(address _token, uint256 amount) public{
        //amount = _convertAmount(_token, amount);
        
        //transfer tokens naar dit adres
        require(Token(_token).transferFrom(msg.sender , address(this), amount), "tranferFrom failed!");

        tokenPool[_token] += amount;
        emit Deposit(msg.sender , amount);
    }

    //withdraw
    function withdraw(address _token, uint256 amount) public {
        //amount = _convertAmount(_token, amount);

        //enough balance in pool
        require(amount <= tokenPool[_token], "not enough tokens in pool");
        
        //check amount of token msg.sender has
        require(withdrawRecord[msg.sender] < tokenLimit, "you already have tokens in your wallet");
        withdrawRecord[msg.sender] += amount;

        tokenPool[_token] -= amount;

        //withdraw
        Token(_token).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, _token, amount);
    }
}