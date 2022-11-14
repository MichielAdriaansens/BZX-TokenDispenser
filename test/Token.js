const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

function toDecimal(amount){
    return ethers.utils.parseUnits(amount, "ether");
}

describe("Token", () => {
    let accounts, token;

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("Bitconnect", "BCC", toDecimal('1000'));
        await token.deployed();
    })

    it("Deployed", async () => {
        console.log(`   token totalSupply decimals: `,await token.totalSupply());
        console.log(`   deployer balance decimals: `, await token.balanceOf(accounts[0].address));

        assert(await token.address.length > 1 , 'no address detected');
        assert(await token.name() == 'Bitconnect', "token name not detected");
        assert(await token.symbol() == 'BCC', 'No symbol detected');
    });

    it('Transfer function', async () => {

        await token.connect(accounts[0]).transfer(accounts[1].address, toDecimal("200"));

        //console.log(`   account[1] received: `,await token.balanceOf(accounts[1].address));
        //console.log(toDecimal("200"));

        //assert( await token.balanceOf(accounts[1].address) >= toDecimal("200"), "no funds transferred");
        expect(await token.balanceOf(accounts[1].address)).to.equal(toDecimal("200"));
    });

    it('TransferFrom function', async () => {
        await token.connect(accounts[0]).approve(accounts[0].address , toDecimal("500"));
        await token.connect(accounts[0]).transferFrom(accounts[0].address, accounts[1].address, toDecimal("500"));

        expect(await token.balanceOf(accounts[1].address)).to.equal(toDecimal("500"), "failed transferFrom!");
    });
});