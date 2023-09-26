// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

// Import the Chainlink Oracle interface
import "../lib/chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Avatars is ERC721, Ownable {
    AggregatorV3Interface public oracle; // Declare the Chainlink Oracle interface

    uint256 public mintPriceEth; // Minting price in ETH

    struct AvatarAttributes {
        uint256 level;
        uint256 strength;
        uint256 agility;
        uint256 wisdom;
        uint256 stamina;
    }

    mapping(uint256 => AvatarAttributes) public avatarAttributes;

    constructor() ERC721("Avatar", "AVTR") {
        oracle = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e); // Initialize the Chainlink Oracle contract
    
    }

    // Fetch the USD/ETH conversion rate from the Chainlink Oracle
    function getEthToUsdPrice() public view returns (int256) {
        (, int256 price, , , ) = oracle.latestRoundData();
        return price;
    }

    // Calculate the minting price in ETH based on the current USD/ETH rate
    function calculateMintPriceEth() public  returns (uint256) {
        int256 ethToUsdPrice = getEthToUsdPrice();
        require(ethToUsdPrice > 0, "Oracle price not available");

        mintPriceEth = (20 * 1e18) / uint256(ethToUsdPrice); // 20 USD in wei
        
        return mintPriceEth;
    }
      function totalSupply() public view returns (uint256) {
        return balanceOf(address(this));
    }

    // Mint a new Avatar
    function mintAvatar() external payable {
        uint price = calculateMintPriceEth();
        require(msg.value >= price, "Insufficient ETH sent");

        uint256 tokenId = totalSupply() + 1;
        _mint(msg.sender, tokenId);

        // Initialize Avatar attributes
        AvatarAttributes memory attributes;
        attributes.level = 1;
        attributes.strength = 10;
        attributes.agility = 10;
        attributes.wisdom = 10;
        attributes.stamina = 10;
        avatarAttributes[tokenId] = attributes;
    }

    // Level up an Avatar
    function levelUp(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        AvatarAttributes storage attributes = avatarAttributes[_tokenId];

        // Increase attributes based on your game's rules
        attributes.level += 1;
        attributes.strength += 5;
        attributes.agility += 5;
        attributes.wisdom += 5;
        attributes.stamina += 5;
    }

    // Withdraw contract balance (only callable by the owner)
    function withdrawBalance() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}