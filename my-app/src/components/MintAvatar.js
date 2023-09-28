import React, { useState } from 'react';
import "../styles/MintAvatar.css";
const MintAvatar = ({ web3, account, avatarContract,ipfsCID }) => {
  const [isMinting, setIsMinting] = useState(false);

  const handleMintAvatar = async() => {
    console.log(web3);
  console.log(account);
  console.log(avatarContract); 
    if (!web3 || !account || !avatarContract || !ipfsCID) {
      console.error('Web3, account, or contract not available.');
      return;
    }

    try {
      setIsMinting(true);

      // Determine the minting price (you may need to adjust this based on your contract)
      const mintPrice = await avatarContract.methods.getPriceRate().call({ from: account });
      ;
      
      // Send a transaction to the contract's mintAvatar function
      await avatarContract.methods.mintAvatar(ipfsCID).send({
        from: account,
        value: mintPrice, // Send the required ETH for minting
      });

      // Minting was successful, you can update the UI or show a success message
      console.log('Avatar minted successfully');
    } catch (error) {
      console.error('Error minting Avatar:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div  className="mint-avatar-container">
      <h2 className="mint-avatar-title">Mint Your Avatar</h2>
      <img src="https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=" alt="Avatar Preview"  className="avatar-image" />
      <button  className="mint-avatar-button" onClick={handleMintAvatar} disabled={isMinting}>
        {isMinting ? 'Minting...' : 'Mint Avatar'}
      </button>
    </div>
  );
};

export default MintAvatar;
