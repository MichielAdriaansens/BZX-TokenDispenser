import {useState} from "react";
import {ethers} from 'ethers';
import Dispenser from "../abis/dispenserAbi.json";
import config from "../config.json";

function PoolInfo({provider, setWithdrawToken, chainId}){
    const [bccPool, setBccPool] = useState(0);
    const [hipPool, setHipPool] = useState(0);
    const [facPool, setFacPool] = useState(0);
    const [selected, setSelected] = useState(0);
   

    async function loadTokenPool(){
       // const {chainId} = await provider.getNetwork();
        const dispenser = new ethers.Contract(config[chainId].dispenser.address, Dispenser.abi, provider);

        //pas op met bignumbers en useState.. zonder formatUnits ontstaat er een "loop"
        let bccPoolValue = ethers.utils.formatUnits(await dispenser.tokenPool(config[chainId].BCC.address), 18);
        setBccPool(bccPoolValue);

        let hipPoolValue = ethers.utils.formatUnits(await dispenser.tokenPool(config[chainId].HIP.address), 18);
        setHipPool(hipPoolValue);
        
        let facPoolValue = ethers.utils.formatUnits(await dispenser.tokenPool(config[chainId].FAC.address), 18);
        setFacPool(facPoolValue);
       
    }
    loadTokenPool();

    return (
        <div className="selectContainer">
            <div className="tokenSelect" onClick={()=>{setWithdrawToken("BCC"); setSelected(1)}}>
                {selected === 1 && <strong>{`>> `}</strong>}BCC: {`${bccPool}`}
            </div>
            <div className="tokenSelect" onClick={()=>{setWithdrawToken("HIP"); setSelected(2)}}>
                {selected === 2 && <strong>{`>> `}</strong>}HIP: {`${hipPool}`}
            </div>
            <div className="tokenSelect" onClick={()=>{setWithdrawToken("FAC"); setSelected(3)}}>
                {selected === 3 && <strong>{`>> `}</strong>}FAC: {`${facPool}`}
            </div>
        </div>
    )
}

export default PoolInfo;