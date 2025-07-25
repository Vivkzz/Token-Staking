// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is ReentrancyGuard {
    IERC20 public immutable stakingToken;

    mapping(address => uint256) stakedBalance;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    error TransferFailed();
    error NullAmount();
    error InsufficientBalance();

    constructor(address _stakingToken) {
        require(_stakingToken != address(0), "Invalid token Address");
        stakingToken = IERC20(_stakingToken);
    }

    function stake(uint256 amount) external nonReentrant {
        if (amount <= 0) revert NullAmount();

        uint256 userBalance = stakingToken.balanceOf(msg.sender);
        if (userBalance < amount) revert InsufficientBalance();

        bool success = stakingToken.transferFrom(msg.sender, address(this), amount);
        if (!success) revert TransferFailed();
        stakedBalance[msg.sender] += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        if (amount <= 0) revert NullAmount();

        if (stakedBalance[msg.sender] < amount) revert InsufficientBalance();

        stakedBalance[msg.sender] -= amount;

        bool success = stakingToken.transfer(msg.sender, amount);
        if (!success) {
            stakedBalance[msg.sender] += amount;
            revert TransferFailed();
        }
        emit Unstaked(msg.sender, amount);
    }

    function getTokenBalance(address user) external view returns (uint256) {
        return stakedBalance[user];
    }

    function getContractBalance() external view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }
}
