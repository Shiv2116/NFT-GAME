import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

export default function Navbar() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function init() {
      // Check if the user has a Web3-enabled browser (e.g., MetaMask)
      if (typeof window.ethereum !== 'undefined') {
        // Create a Web3 instance using the current provider (e.g., MetaMask)
        const web3 = new Web3(window.ethereum);

        // Request account access
        try {
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
          setWeb3(web3);
        } catch (error) {
          console.error('User denied account access:', error);
        }
      } else {
        console.warn('No Web3 provider detected. Please install MetaMask or another Ethereum wallet extension.');
      }
    }

    init();
  }, []);

  const handleConnect = async () => {
    if (web3) {
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('User denied account access:', error);
      }
    }
  };

  const handleDisconnect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await window.ethereum.request({ method: 'eth_accounts' });
        setAccount('');
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          Your NFT Game
        </div>
        <div className="navbar-account">
          {account ? (
            <div>
              <span>Connected Account:</span> {account}
              <button onClick={handleDisconnect}>Disconnect</button>
            </div>
          ) : (
            <button onClick={handleConnect}>Connect Wallet</button>
          )}
        </div>
      </div>
    </nav>
  );
}
