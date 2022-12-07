const {ethers} = require("hardhat");
const {expect, assert} = require("chai");

function toDecimal(amount){
    return ethers.utils.parseUnits(`${amount}`, "18");
}

describe("Dispenser", () =>{
    let accounts, token, dispenser, transaction, result;

    beforeEach(async () => {
        accounts = await ethers.getSigners()

        const Token = await ethers.getContractFactory("Token");
        const Dispenser = await ethers.getContractFactory("Dispenser");
        
        token = await Token.deploy("GoldenShower", "GLDS", 100);
        await token.deployed();

        dispenser = await Dispenser.deploy(toDecimal(10));
        await dispenser.deployed();

        await token.connect(accounts[0]).approve(dispenser.address, toDecimal(100));
        transaction = await dispenser.connect(accounts[0]).deposit(token.address, toDecimal(100));
        result = await transaction.wait();
        
    });

    describe("Deposit", () => {
        it("receives tokens", async () => {

            expect(await token.balanceOf(accounts[0].address)).to.equal(0);
            expect(await dispenser.tokenPool(token.address)).to.equal(toDecimal(100), "whoopsie! transfer to dispenser failed");
        });
        it("has event", async () => {
            //console.log(result.events[2].event);

            assert.equal(result.events[2].event, "Deposit");
        });
    });
    describe("Withdraw", () => {
        beforeEach(async () => {
            transaction = await dispenser.connect(accounts[1]).withdraw(token.address, toDecimal(10));
            result = await transaction.wait();
        });
        
        it("withdraws tokens", async () => {

            expect(await token.balanceOf(accounts[1].address)).to.equal(toDecimal(10), "acc1 did not receive tokens from dispenser");
        });
        it("rejects withdraw above limit", async () => {
            
            expect(dispenser.connect(accounts[1]).withdraw(token.address, toDecimal(11))).to.be.reverted;
        });
        it("has event", async () => {
            assert.equal(result.events[1].event, "Withdraw");
        });
    });
});