import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import '../styles/Navbar.css';
const Navbar = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function init() {
      // Check if the user has a Web3-enabled browser (e.g., MetaMask)
      if (typeof window.ethereum !== 'undefined') {
        // Create a Web3 instance using the current provider (e.g., MetaMask)
        const web3 = new Web3(window.ethereum);

        // Get the current Ethereum accounts
        const accounts = await web3.eth.getAccounts();

        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }

        setWeb3(web3);
      } else {
        console.warn('No Web3 provider detected. Please install MetaMask or another Ethereum wallet extension.');
      }
    }

    init();
  }, []);

  const connectToMetaMask = async () => {
    if (web3) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Update the connected account
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    }
  };

  async function disconnectMetaMask() {
    // Check if the user is connected to MetaMask
    if (window.ethereum && window.ethereum.isMetaMask) {
      // Request to disconnect from MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
  
      // Clear the connected account
      setAccount('');
    }
  }

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
              <button onClick={disconnectMetaMask}>Disconnect</button>
            </div>
          ) : (
            <button onClick={connectToMetaMask}>Connect Wallet</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
