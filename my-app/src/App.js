import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {AvatarContractABI} from './AvatarContractABI'; // Import your smart contract ABI
import NFTPage from './components/NFTPage';
import Navbar from './components/Navbar';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [avatarContract, setAvatarContract] = useState(null);
  const contractAddress = '0xfdce0dA299aA5Edc2629bF6a606F226923E5EDaa';
  

  useEffect(() => {
    async function init() {
      try {
      // Check if the user has a Web3-enabled browser (e.g., MetaMask)
      if (typeof window.ethereum !== 'undefined' ) {
        // Create a Web3 instance using the current provider (e.g., MetaMask)
        const web3 = new Web3(window.ethereum);
       

        // Get the current Ethereum accounts
        const accounts = await web3.eth.getAccounts();
        

        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        console.log(accounts);
        // Load your smart contract
        const networkId = await web3.eth.net.getId();
        console.log(networkId);
        console.log(AvatarContractABI);
        const deployedNetwork = 11155111;
      
        const contract = new web3.eth.Contract(
          AvatarContractABI,
          "0xfdce0dA299aA5Edc2629bF6a606F226923E5EDaa",
        );


        setWeb3(web3);
        setAvatarContract(contract);
        console.log(contract);
      } else {
        console.warn('No Web3 provider detected. Please install MetaMask or another Ethereum wallet extension.');
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
    }
    }

    init();
  }, []);

  return (
    <div className="App">
      <Navbar/>
      {/* Render the NFTPage component with the necessary props */}
      <NFTPage web3={web3} account={account} avatarContract={avatarContract} />
      {/* <button onClick={()=>init()}>init</button> */}
    </div>
  );
}

export default App;
