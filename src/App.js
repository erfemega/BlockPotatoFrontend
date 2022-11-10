import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import blockPotatoABI from './assets/BlockPotatoGame.json';
import PlayButton from './components/PlayButton';

const App = () => {

  const GAME_CONTRACT_ADDRESS = '0xA47E743a070AE945eA62E528ED4af3119f75447A';
  //state variable to store user's public wallet 
  const [currentAccount, setCurrentAccount] = useState("");
  const [providerGameContract, setProviderGameContract] = useState(null);
  const [signerGameContract, setSignerGameContract] = useState(null);
  const [playResultMessage, setPlayResultMessage] = useState('')

  // check wallet connection when the page loads
  const checkIfWalletIsConnected = async () => {

    // access to window.ethereum
    const {ethereum} = window;

    //check if user has metamask 
    if(!ethereum) {
      alert("Make sure you have metamask");
      return;
    }
          
    //get the wallet account
    const accounts = await ethereum.request({method: 'eth_accounts'});

    //get the first account
    if(accounts.length !== 0){
      const account = accounts[0];
      console.log("Found account:", account);

      //set the account as a state 
      setCurrentAccount(account);
    }
    else{
      console.log("No account");
    }
  }

  // connect to wallet 
  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if(!ethereum) {
        alert("Opps, looks like there is no wallet!");
        return;
      }

      const currentNetwork = ethereum.networkVersion;
      console.log("Current network", currentNetwork);

      // request to switch the network 
      try {
        const tx = await ethereum.request(
          {
            method: 'wallet_switchEthereumChain',
            params:[
              {
                chainId: '0x5'
              }
            ]
          }
        );
      }
      catch (tx) {
        if (tx) {
          console.log(tx)
        }
      }
              
            

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      setCurrentAccount(accounts[0]); 

    }
    catch( error){
      console.log(error);
    }
  }


  //run function checkIfWalletIsConnected when the page loads
  useEffect(()=> {
    checkIfWalletIsConnected();
    setContracts();
  }, [currentAccount]);

  //connect to wallet
  const walletNotConnected = () => (
    <button onClick={connectWallet} className="connect-to-wallet-button">
      Connect to Wallet
    </button>
  );

  //wallet connected
  const walletConnected = () => (
    <div>
      <p>Connected to the wallet</p>
    </div>
  );

  const setContracts = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const providerContract = new ethers.Contract(
      GAME_CONTRACT_ADDRESS,
      blockPotatoABI.abi,
      provider
    );
    const signerContract = new ethers.Contract(
      GAME_CONTRACT_ADDRESS,
      blockPotatoABI.abi,
      signer
    );
    setProviderGameContract(providerContract);
    setSignerGameContract(signerContract);
  };

  return (
    <div className="App">
      <div style={{display: 'flex', justifyContent:'center', height: '50px'}}>
          {currentAccount === "" ? walletNotConnected()  : walletConnected()}
          <br />
      </div>
      <div>
        <h3>{playResultMessage}</h3>
      </div>
      <div>
        <PlayButton
          signerContract={signerGameContract}
          currentAccount={currentAccount}
          onPlay={(event) => {
            console.log(event);
            setPlayResultMessage(event)
          }}/>
      </div>
    </div>
  );
};

export default App;
