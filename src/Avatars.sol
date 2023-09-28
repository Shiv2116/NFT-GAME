// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

// Import the Chainlink Oracle interface
import "../lib/chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Avatars is ERC721, Ownable {
    AggregatorV3Interface public oracle; // Declare the Chainlink Oracle interface

    uint256 public mintPriceEth; // Minting price in ETH
    uint256  public tokenId = 0;
    struct AvatarAttributes {
        uint256 level;
        uint256 strength;
        uint256 agility;
        uint256 wisdom;
        uint256 stamina;
    }

    mapping(uint256 => AvatarAttributes) public avatarAttributes;
    mapping(address => uint256[]) private ownedNFTs;
    mapping(uint256 => string) public tokenIPFSURIs;
    event NFTLevelUp(uint256 tokenId, uint256 newLevel, uint256 newStrength, uint256 newAgility, uint256 newWisdom, uint256 newStamina);

    constructor() ERC721("Avatar", "AVTR") {
        oracle = AggregatorV3Interface(0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910); // Initialize the Chainlink Oracle contract
        
    }

    function getPriceRate() public view returns (uint) {
        (, int price,,,) = oracle.latestRoundData();
        uint ethPriceInWei = uint(price);
        uint usdInWei = 20 * 1e18; // Hardcoded 20 USD in wei
        uint ethAmountInWei = usdInWei / ethPriceInWei;
        return (ethAmountInWei * 100000)- 6000000000000000;
    }

    

    
      function totalSupply() internal view  returns (uint256) {
        return balanceOf(address(this));
    }

    // Mint a new Avatar
    function mintAvatar(string memory ipfsCID) external payable {
        uint price = getPriceRate();
        require(msg.value>=price,"Not possible");
        tokenId += 1;
        _mint(msg.sender, tokenId);

        // Initialize Avatar attributes
        AvatarAttributes memory attributes;
        attributes.level = 1;
        attributes.strength = 10;
        attributes.agility = 10;
        attributes.wisdom = 10;
        attributes.stamina = 10;
        avatarAttributes[tokenId] = attributes;
        ownedNFTs[msg.sender].push(tokenId);
        tokenIPFSURIs[tokenId] = ipfsCID;
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

        emit NFTLevelUp(_tokenId, attributes.level, attributes.strength, attributes.agility, attributes.wisdom, attributes.stamina);
    }
     function getAllNFTs(address owner) external view returns (uint256[] memory) {
        return ownedNFTs[owner];
    }
    function getAttributes(uint256 _tokenId) external view returns (AvatarAttributes memory) {
        return avatarAttributes[_tokenId];
    }

    // Withdraw contract balance (only callable by the owner)
    function withdrawBalance() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

}