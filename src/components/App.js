import {ethers} from 'ethers';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import cBubble from '../assets/chatBubble.png';
import '../App.css';
import PoolInfo from './PoolInfo';
import Withdraw from './Withdraw';
import config from '../config.json';

let account,provider, chainId;


function App() {

  if(window.ethereum){
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  const [connected, setConnected] = useState(false);
  const [withdrawToken, setWithdrawToken] = useState("");
  const [chatMsg, setChatMsg] = useState("stake it 'til you BREAK it!");
  //const isConnected = Boolean(account);

  async function connectHandler(){
    try{
      account = await provider.send('eth_requestAccounts', [0]);
      if(account){
        setConnected(true);
      }
    }catch(error){
      console.log(error);
    }
  }

  async function networkHandler(event){
    console.log(event.target.value);

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      //onthoudt! de chain id parameter wil de hexadecimal waarde 80001 = 13881 hex bv
      params: [{chainId: `0x${event.target.value}`}]
    });
  }

  async function loadNetwork(){
    const network = await provider.getNetwork();
    chainId = network.chainId;
  }
  if(provider){
    loadNetwork();
    
    window.ethereum.on('chainChanged', async () =>{
      window.location.reload();
    });

    if(connected){
      window.ethereum.on('accountsChanged', async () =>{
        window.location.reload();
      });
    }
  }

  //triggers when withDrawToken var changes
  useEffect(() =>{
    //let rng = Math.floor(Math.random() * 3);
    if(withdrawToken === "BCC"){
      setChatMsg('Bitconnect')
    }
    else if(withdrawToken === "HIP"){
      setChatMsg('Hip BTC!')
    }
    else if(withdrawToken === "FAC"){
      setChatMsg('Falcon Coin!')
    }

  }, [withdrawToken]);

  return (
    <div className="App">

      <div className='App-chat'>
        <img src={cBubble} className="App-bubble" alt="chat" />
        <p className='App-comment'>{chatMsg}</p>
        {/* speech bubble -stake it till you break it! -BitConnect! -Hip BTC! -Falcon coin! */}
      </div>

      <a 
        href='https://weathered-bar-7268.on.fleek.co/' 
        target='_blank'
        rel='noreferrer' 
      >
        <img src={logo} className="App-logo" alt="logo" />
      </a>
     
      <h1>Token Dispenser!</h1>
      {/* check if browser has metamask extension */}
      {window.ethereum? (
        connected? (
          <div>

            {config[chainId]? (
              <div>
                
                <p className='selectTokenMsg'>Select a token!!</p>
                <PoolInfo provider={provider} chainId={chainId} setWithdrawToken={setWithdrawToken}/>
                <Withdraw provider={provider} chainId={chainId} withdrawToken={withdrawToken} account={account}/>
                <br/><p className='address'>address: {`${account.toString().slice(0,5)}...${account.toString().slice(38,42)}`}</p>
              </div>
            ):(
              <div className='networkUI'>
                <p><strong>Please select a network:</strong></p>
                
                <button className='networkButton' value="5" onClick={networkHandler}>Goerli</button>
                <button className='networkButton' value="13881" onClick={networkHandler}>Mumbai</button>
              </div>
            )}
          </div>
        ):(
          <button className='connectButton' onClick={connectHandler}>Connect</button>
        )
      ) : (
        <div className='needMetamask'>
          <h2>Oops! This website requires Metamask</h2>
         
          <p>
            please download 'Metamask' browser extension 
            <br/>
            <a href='https://metamask.io/download/' target='_bank' rel='noreferrer'>here</a>
          </p>
        </div>
      )}
      

    </div>
  );
}

export default App;
