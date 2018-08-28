pragma solidity ^0.4;

contract Inbox {
    string public message;
    constructor(string initString) public {
        message = initString;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }
}