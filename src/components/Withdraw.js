import {ethers} from 'ethers';
import config from '../config.json'
import {useState} from 'react';
import Dispenser from '../abis/dispenserAbi.json'

function Withdraw({provider, withdrawToken, account, chainId}){

    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [userRecord, setUserRecord] = useState(0);
    let dispenser, amount, userWithdrawn;

    async function loadContracts(){

        dispenser = new ethers.Contract(config[chainId].dispenser.address, Dispenser.abi, provider);

        amount = await dispenser.tokenLimit();
        setWithdrawAmount( ethers.utils.formatUnits(amount, 18));
        
        //--if not a function error. check abi -_-
        userWithdrawn = await dispenser.withdrawRecord(account.toString());
        setUserRecord(ethers.utils.formatUnits(userWithdrawn,18));
    }
    loadContracts();

    async function withdrawHandler(){

        const signer = await provider.getSigner();
        await signer;

        if(withdrawToken === "BCC"){
            console.log("BiiitCoonneeect");
            await dispenser.connect(signer).withdraw(config[chainId].BCC.address, amount);
        }
        else if(withdrawToken === "HIP"){
            console.log("Hip BTC Hip BTC!");
            await dispenser.connect(signer).withdraw(config[chainId].HIP.address, amount);
        } 
        else if(withdrawToken === "FAC"){
            console.log("Falcon Coin!!!");
            await dispenser.connect(signer).withdraw(config[chainId].FAC.address, amount);  
        }
    }

    dispenser.once('Withdraw', async (event)=>{
        userWithdrawn = await dispenser.withdrawRecord(account.toString());
        setUserRecord(ethers.utils.formatUnits(userWithdrawn,18));
       console.log("tokens withdrawn"); 
    });

    function WithdrawUI(){
        return(
            <div className='withdrawUI'>
            
                {withdrawToken !== "" && (
                    <button onClick={withdrawHandler}>Withdraw</button>
                )}
                <p>
                    Claim <strong>{withdrawAmount} {withdrawToken}</strong> Tokens!!
                </p>
            </div>
        )
    }

    return(
        <div>
            {userRecord < withdrawAmount? (
                <WithdrawUI/>
            ):(
                <p>
                Congratulations! you have withdrawn {withdrawAmount} Tokens.
                Go to <a href='https://weathered-bar-7268.on.fleek.co/'>BeeZeeXchange</a>
                &#160;and trade your tokens! 
                <br/>
                <br/>
                Have fun :3
                </p>
            )}
            
        </div>
    )
}

export default Withdraw;