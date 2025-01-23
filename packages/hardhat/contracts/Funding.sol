// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Donation is Ownable {
    
    struct Cause {
        string name;
        address payable recipient;
        uint256 totalDonations;
    }

    IERC20 public stablecoin;
    mapping(uint256 => Cause) public causes;
    uint256 public causeCount;

    event DonationReceived(address indexed donor, uint256 causeId, uint256 amount);
    event FundsWithdrawn(uint256 causeId, uint256 amount);

    constructor(address _stablecoin) {
        stablecoin = IERC20(_stablecoin);
    }

    function addCause(string memory _name, address payable _recipient) external onlyOwner {
        causes[causeCount] = Cause(_name, _recipient, 0);
        causeCount++;
    }

    function donate(uint256 _causeId, uint256 _amount) external {
        require(_causeId < causeCount, "Cause does not exist");
        require(_amount > 0, "Donation must be greater than zero");

        // Transfer stablecoins from sender to contract
        require(stablecoin.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        // Update cause donation total
        causes[_causeId].totalDonations += _amount;

        emit DonationReceived(msg.sender, _causeId, _amount);
    }

    function withdraw(uint256 _causeId) external {
        require(_causeId < causeCount, "Cause does not exist");
        Cause storage cause = causes[_causeId];

        require(msg.sender == cause.recipient, "Only the cause recipient can withdraw");
        require(cause.totalDonations > 0, "No funds to withdraw");

        uint256 amount = cause.totalDonations;
        cause.totalDonations = 0;

        // Transfer stablecoins from contract to recipient
        require(stablecoin.transfer(cause.recipient, amount), "Transfer failed");

        emit FundsWithdrawn(_causeId, amount);
    }

    function changeStablecoin(address _newStablecoin) external onlyOwner {
        stablecoin = IERC20(_newStablecoin);
    }
}
