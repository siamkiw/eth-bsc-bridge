// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TokenBase is ERC20 {
  address public admin;
  address public deployer;

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    admin = msg.sender;
    deployer = msg.sender;
  }

  function updateAdmin(address newAdmin) external {
    require(msg.sender == admin || msg.sender == deployer, 'only admin or deployer');
    admin = newAdmin;
  }

  function mint(address to, uint amount) external {
    require(msg.sender == admin || msg.sender == deployer, 'only admin or deployer');
    _mint(to, amount);
  }

  function burn(address owner, uint amount) external {
    require(msg.sender == admin || msg.sender == deployer, 'only admin or deployer');
    _burn(owner, amount);
  }
}

