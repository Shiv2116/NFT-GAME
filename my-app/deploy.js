
const Web3 = require('web3');
const { abi, evm } = require('./src/AvatarContractABI'); // Import the ABI and bytecode

async function deployContract() {
  const web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/ZfT2BslmxwkCj-MwW-oE2Bn1s9soF2X4'); // Replace with your provider URL
  const fromAddress = '0x7F8Db8cB2470C6282d284AA6988595541AA13b0b'; // 

  // Create a contract instance
  const contract = new web3.eth.Contract(abi);

  // Deploy the contract
  const deployTransaction = contract.deploy({
    data: evm.bytecode.object,
    arguments: [constructorArgument1, constructorArgument2], // Pass constructor arguments if needed
  });

  const deployOptions = {
    from: fromAddress,
    gas: 100000000, // Set an appropriate gas limit
  };

  // Send the deployment transaction
  const deployedContract = await deployTransaction.send(deployOptions);

  console.log('Contract deployed to address:', deployedContract.options.address);
}

deployContract().catch(console.error);
