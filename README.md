# Intro to Fullstack Ethereum Development

This article will help you escape writing solidity tutorials in Remix and explain the tools you will need to create a simple full-stack dapp. The smart contract will be very simple itself and that is because we're focusing on all of the other tools you will need.

## Our stack

- Solidity (To write our smart contract)
- Hardat (build, test and deployment framework)
- React (Create our frontend)
- Ethers (web3 library for interacting with the blockchain and our smart contract)

## Environment

First head over to the hardhat [website](https://hardhat.org/), we're going to be doing most of what is covered in the tutorial section as well as some of the documentation.

Make sure you have nodejs installed, if you don't then follow the setup [here](https://hardhat.org/tutorial/setting-up-the-environment.html) 

## Create a new project

To get your project started:

```
mkdir intro-fullstack-ethereum
cd intro-fullstack-ethereum
npm init --yes
npm i --save-dev hardhat
```

In the same directory where you installed Hardhat run:

```
npx hardhat
```

A menu will appear, for this tutorial we will be selecting `Create an empty hardhat.config.js`

Make sure these packages are installed, you may have been asked to install them when initializing the project.

```
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```

## Create our Contract

Let's create our contract, it will be very simple, the contract will only read from and write to the blockchain

First we will need to create a directory for our contract, hardhat expects them to be in a directory called `contracts/` so:

```
mkdir contracts
cd contracts
touch SimpleStorage.sol
```

### Our Smart Contract

```
// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract SimpleStorage {
    uint256 storedData;

    constructor(uint256 _storedData) {
        storedData = _storedData;
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
```

TODO: explain contract

We can now use `hardhat` to compile our contract with

```
npx hardhat compile
```

## Shorthand commands

Instead of typing out `npx hardhat <command>` we can install `hardhat-shorthand` and use the `hh` command

```
npm i -g hardhat-shorthand
```

We can also get tab completion by running the command:

```
hardhat-completion install
```

Choose to install the autocompletion for your shell and you should now get tab completion after typing `hh` as long as you are in a hardhat project directory.

Try compiling your contract now with:

```
hh compile
```

## Testing

It is very import since money is often on the line when it comes to smart contracts. I will show you how to create a simple test for our `SimpleStorage` contract.

First create a directory called `test/` and create a file called `simple-storage-test.js`

```
mkdir `test`
touch simple-storage-test.js
```

Here are our simple tests:

```
const { expect } = require('chai')

describe('SimpleStorage contract', function () {
  it('test deployment', async function () {
    const SimpleStorage = await ethers.getContractFactory('SimpleStorage')

    const simpleStorage = await SimpleStorage.deploy(123)

    const storedValue = await simpleStorage.get()

    expect(storedValue).to.equal(123)
  })

  it('test set new value', async function () {
    const SimpleStorage = await ethers.getContractFactory('SimpleStorage')

    const simpleStorage = await SimpleStorage.deploy(123)

    await simpleStorage.set(456)

    const storedValue = await simpleStorage.get()

    expect(storedValue).to.equal(456)
  })
})
```

You will always be able to call the `deploy` method on your contract even if you didn't define a method called `deploy` essentially it just calls your constructor.

We have defined two tests here one just deploys the contract with an initial value and checks that it was deployed properly, the other does the same except we set a new value using the `set` method defined in our smart contract.


Before we can run our test we will need to `require` `hardhat-waffle` this will make the `ethers` variable available in global scope

So add the following line to the top of your `hardhat.config.js` file:

```
require("@nomiclabs/hardhat-waffle");
```

Ok now we are ready to run our test:

```
$ hh test

  SimpleStorage contract
    ✓ test deployment (366ms)
    ✓ test set new value (52ms)


  2 passing (420ms)
```

You will notice the text that we added to the test is printed out when the test runs

**NOTE** Another good example test: [link](https://hardhat.org/tutorial/testing-contracts.html) 


