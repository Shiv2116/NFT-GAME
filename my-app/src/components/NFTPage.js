import React, { useState } from 'react';
import NFTMintDisplay from './NFTMintDisplay';
import MintAvatar from './MintAvatar';
import LevelUpAvatar from './LevelUp';
import "../styles/NFTPage.css";
const NFTPage = ({ web3, account, avatarContract }) => {
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  const handleTokenSelect = (tokenId) => {
    setSelectedTokenId(tokenId);
  };
  const ipfsCID = "QmPdNEcNxr8uB4AVW4GTpUY7n8LoAAMXbrqttHfYg29Vvn";

  return (
    <div  className="nft-page-container">
      <div className="nft-page-section">
       
      <MintAvatar web3={web3} account={account} avatarContract={avatarContract}  ipfsCID={ipfsCID} />
      {selectedTokenId !== null && (
        <LevelUpAvatar
          web3={web3}
          account={account}
          avatarContract={avatarContract}
          tokenId={selectedTokenId}
        />
        
        
      )}
      </div>
      <div className="nft-page-section">
      <NFTMintDisplay web3={web3} account={account} />
      </div>
    </div>
  );
};

export default NFTPage;
