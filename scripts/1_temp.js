const { ethers } = require("hardhat")


async function Main(){
    const accounts = await ethers.getSigners();
    accounts.map(account => console.log(account.address));
    
}

Main();