// NFTMintDisplay.js
import Web3 from 'web3';
import "../styles/NFTMintDisplay.css"
import React, { useState, useEffect } from 'react';
import { AvatarContractABI } from '../AvatarContractABI';

const NFTMintDisplay = ({ web3, account }) => {
  const [nftList, setNFTList] = useState([]);
  const contractAddress = '0xfdce0dA299aA5Edc2629bF6a606F226923E5EDaa'; // Replace with your contract's address
  
  useEffect(() => {
    async function fetchNFTs() {
      console.log(web3, account );
      if (!web3 || !account) {
        console.error('Web3 or account not available.');
        return;
      }

      try {
        // Create a contract instance using the ABI and contract address
        const contract = new web3.eth.Contract(AvatarContractABI, contractAddress);
        console.log(contract);
        // Call the contract's function to get NFTs owned by the user
        const nfts = await contract.methods.getAllNFTs(account).call();

        // Check if the user has no NFTs
        if (nfts.length === 0) {
          setNFTList(['No NFTs']);
        } else {
          setNFTList(nfts);
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setNFTList(['Error fetching NFTs']);
      }
    }

    fetchNFTs();
  }, [web3, account]);

  return (
    <div className="nft-mint-display-container">
      <h2 className="nft-list-title">Your Minted NFTs</h2>
      {nftList.length === 1 && nftList[0] === 'No NFTs' ? (
        <p>No NFTs</p>
      ) : nftList.length === 1 && nftList[0] === 'Error fetching NFTs' ? (
        <p>Error fetching NFTs</p>
      ) : (
        <ul className="nft-list">
          {nftList.map((nft, index) => (
            <li key={index}>{nft}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NFTMintDisplay;
