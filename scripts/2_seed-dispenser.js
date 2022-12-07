const config = require("../src/config.json");
const { ethers } = require("hardhat");

async function main(){
    let transaction;
    //network
    const {chainId} = await ethers.provider.getNetwork();
    console.log(chainId);

    const accounts = await ethers.getSigners();
    console.log(accounts[0].address);

    //fetching token adresses
    const bcc = await ethers.getContractAt("Token", config[chainId].BCC.address);
    console.log(await bcc.name());

    const hip = await ethers.getContractAt("Token", config[chainId].HIP.address);
    console.log(await hip.name());

    const fac = await ethers.getContractAt("Token", config[chainId].FAC.address);
    console.log(await fac.name());

    //fetching dispenser address
    const dispenser = await ethers.getContractAt("Dispenser", config[chainId].dispenser.address);
    console.log(`\nfetched Dispenser: `, dispenser.address);

    
    //set amount to deposit
    bcc.amount = (await bcc.balanceOf(accounts[0].address)).toBigInt() - (ethers.utils.parseEther("10000", 18)).toBigInt();
    hip.amount = (await hip.balanceOf(accounts[0].address)).toBigInt() - (ethers.utils.parseEther("10000", 18)).toBigInt();
    fac.amount = (await fac.balanceOf(accounts[0].address)).toBigInt() - (ethers.utils.parseEther("10000", 18)).toBigInt();

    console.log('BCC amount to deposit: ', bcc.amount);
    console.log('HIP amount to deposit: ', hip.amount);
    console.log('HIP amount to deposit: ', fac.amount);

    //approve
    console.log('\nApproving..');

    transaction = await bcc.connect(accounts[0]).approve(dispenser.address, bcc.amount);
    await transaction.wait();
    console.log('BCC allowed: ', await bcc.allowance(accounts[0].address, dispenser.address));
    
    transaction = await hip.connect(accounts[0]).approve(dispenser.address, hip.amount);
    await transaction.wait();
    console.log('HIP allowed: ', await hip.allowance(accounts[0].address, dispenser.address));
    
    transaction = await fac.connect(accounts[0]).approve(dispenser.address, fac.amount);
    await transaction.wait();
    console.log('FAC allowed: ', await fac.allowance(accounts[0].address, dispenser.address));
    
    //deposit
    console.log('\nDepositing..')
    transaction = await dispenser.connect(accounts[0]).deposit(bcc.address, bcc.amount);
    await transaction.wait();
    console.log('tokenPool BCC', await dispenser.tokenPool(bcc.address));

    transaction = await dispenser.connect(accounts[0]).deposit(hip.address, hip.amount);
    await transaction.wait();
    console.log('tokenPool HIP', await dispenser.tokenPool(hip.address));

    transaction = await dispenser.connect(accounts[0]).deposit(fac.address, fac.amount);
    await transaction.wait();
    console.log('tokenPool FAC', await dispenser.tokenPool(fac.address));
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.log(error);
    process.exit(1);
})