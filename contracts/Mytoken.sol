// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title MyToken
/// @author Vivek Tanna
/// @dev Just a simple netive ERC20 token for staking dApp

contract MyToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18; // taken it as 1 mil

    constructor() ERC20("MyToken", "MYT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /// @dev simple mint function which create new tokens
    /// @param to address where we have mint token
    /// @param amount total amount to mint
    /// @notice Currently this mint() call by any one bcz i want it to be Test token as faucet on testnet
    function mint(address to, uint256 amount) external /*onlyOwner*/ {
        _mint(to, amount);
    }

    /// @dev burn function used to burn token
    /// @param amount amount of token to burn
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
