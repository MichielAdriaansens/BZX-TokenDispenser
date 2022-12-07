const {ethers} = require("hardhat");
const config = require("../src/config.json");

async function main(){
    const {chainId} = await ethers.provider.getNetwork();
    console.log(`chainId`, chainId);
   
    const accounts = await ethers.getSigners();

    const oldDispenser = await ethers.getContractAt("Dispenser", config[chainId].dispenser.address);
    const bcc = await ethers.getContractAt("Token", config[chainId].BCC.address);
    const hip = await ethers.getContractAt("Token", config[chainId].HIP.address);
    const fac = await ethers.getContractAt("Token", config[chainId].FAC.address);



    let trx = await oldDispenser.connect(accounts[0]).setTokenLimit(ethers.utils.parseUnits("1000000", 18));
    await trx.wait();
    console.log(`set withdraw limit to ${await oldDispenser.tokenLimit()}`);

    trx = await oldDispenser.connect(accounts[0]).withdraw(bcc.address, oldDispenser.tokenPool(bcc.address));
    await trx.wait();
    console.log(`tokenPool bcc depleted: ${await oldDispenser.tokenPool(bcc.address)}`);

    trx = await oldDispenser.connect(accounts[0]).withdraw(hip.address, oldDispenser.tokenPool(hip.address));
    await trx.wait();
    console.log(`tokenPool hip depleted: ${await oldDispenser.tokenPool(hip.address)}`);

    trx = await oldDispenser.connect(accounts[0]).withdraw(fac.address, oldDispenser.tokenPool(fac.address));
    await trx.wait();
    console.log(`tokenPool fac depleted: ${await oldDispenser.tokenPool(fac.address)}`);

}

main()
.then(() => process.exit(0))
.catch(error => {
    console.log(error);
    process.exit(1);
})