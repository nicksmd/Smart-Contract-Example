pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() payable public {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function getNumberOfPlayers() public restricted view returns(uint)  {
        return players.length;
    }

    function random() private view returns(uint) {
        return uint(sha3(block.difficulty, now, players));
    }

    // random pick a winner, transfer him/her money, empty the list
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }

    // return money to sender
    function returnMoney() restricted {
        require(msg.sender == manager);

    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address[]) {
        return players;
    }
}
