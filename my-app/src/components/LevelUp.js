import React, { useState, useEffect } from 'react';
import { AvatarContractABI } from '../AvatarContractABI';

const LevelUp = ({ web3, account, avatarContract, tokenId }) => {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [currentAttributes, setCurrentAttributes] = useState({});
  const [newAttributes, setNewAttributes] = useState({});

  const fetchAttributes = async () => {
    if (!web3 || !avatarContract) return;

    try {
      const current = await avatarContract.methods.getAttributes(tokenId).call();
      setCurrentAttributes(current);
    } catch (error) {
      console.error('Error fetching current attributes:', error);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, [web3, account, avatarContract, tokenId]);

  const handleLevelUp = async () => {
    if (!web3 || !account || !avatarContract) {
      console.error('Web3, account, or contract not available.');
      return;
    }

    try {
      setIsLevelingUp(true);

      // Call the contract's levelUp function with the selected tokenId
      await avatarContract.methods.levelUp(tokenId).send({ from: account });

      // Fetch and set the new attributes after level-up
      const updated = await avatarContract.methods.getAttributes(tokenId).call();
      setNewAttributes(updated);

      // Trigger a callback to refresh NFT data in the parent component
      
    } catch (error) {
      console.error('Error leveling up NFT:', error);
    } finally {
      setIsLevelingUp(false);
    }
  };

  return (
    <div>
      <h2>Level Up NFT</h2>
      <button onClick={handleLevelUp} disabled={isLevelingUp}>
        {isLevelingUp ? 'Leveling Up...' : 'Level Up'}
      </button>

      <div>
        <h3>Current Attributes:</h3>
        <p>Level: {currentAttributes.level}</p>
        <p>Strength: {currentAttributes.strength}</p>
        <p>Agility: {currentAttributes.agility}</p>
        <p>Wisdom: {currentAttributes.wisdom}</p>
        <p>Stamina: {currentAttributes.stamina}</p>
      </div>

      {Object.keys(newAttributes).length > 0 && (
        <div>
          <h3>New Attributes:</h3>
          <p>Level: {newAttributes.level}</p>
          <p>Strength: {newAttributes.strength}</p>
          <p>Agility: {newAttributes.agility}</p>
          <p>Wisdom: {newAttributes.wisdom}</p>
          <p>Stamina: {newAttributes.stamina}</p>
        </div>
      )}
    </div>
  );
};

export default LevelUp;
