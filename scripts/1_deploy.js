const { ethers } = require("hardhat");

async function main(){

    const provider = await ethers.provider.getNetwork();
    console.log(`${provider.chainId}\n`);
    
    //fetch account
    const accounts = await ethers.getSigners();
    accounts.map(account => console.log(account.address));

    console.log(`\nbalance: `, ethers.utils.formatUnits(await ethers.provider.getBalance(accounts[0].address), "ether"));
    
    //deploy Dispenser contract
    const Dispenser = await ethers.getContractFactory("Dispenser");
    const dispenser = await Dispenser.deploy(ethers.utils.parseUnits("1000", "ether"));
    await dispenser.deployed();

    console.log(`\nDispenser contract deployed: ${dispenser.address}`);    
    console.log(`Withdraw limit decimals ${await dispenser.tokenLimit()}`);

    //for localhost only
    if(provider.chainId == 31337){
        const Token = await ethers.getContractFactory("Token");
        const token = await Token.connect(accounts[0]).deploy("Hello World Coin", "HWC", 1000);
        await token.deployed();
        console.log(`\ntoken deployed: ${await token.name()}`);

        await token.connect(accounts[0]).approve(dispenser.address, ethers.utils.parseUnits("500", 18));
        await dispenser.connect(accounts[0]).deposit(token.address, ethers.utils.parseUnits("500", 18));
        console.log(`tokens deposited, tokenpool: ${await dispenser.tokenPool(token.address)}`);

        await dispenser.connect(accounts[1]).withdraw(token.address, ethers.utils.parseUnits("250", 18));
        console.log(`tokens withdrawn, tokenpool: ${await dispenser.tokenPool(token.address)}`);
    }
    
    //goerli
   // const bcc = await ethers.getContractAt("Token", config[provider.chainId].BCC.address);
   // const amountForDepo = (await bcc.balanceOf(accounts[0].address)).toBigInt() - (ethers.utils.parseUnits(`${10000}`, 18).toBigInt());
   // console.log(`bcc deposit amount: `, ethers.utils.formatUnits(`${amountForDepo}`, 18));
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.log(error);
    process.exit(1);
});