// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Donation {

    address public owner;
    uint256 public TotalDonations;

    event DonationReceived(address indexed donor, uint256 amount);
    event FundsWithdrawn(uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than zero");
        TotalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");

        payable(owner).transfer(amount);
        emit FundsWithdrawn(amount);
    }

}