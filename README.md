# Intro to Fullstack Ethereum Development

This article will help you escape writing solidity tutorials in Remix and explain the tools you will need to create a simple full-stack dapp. The smart contract will be very simple itself and that is because we're focusing on all of the other tools you will need.

## Our stack

- [Solidity](https://docs.soliditylang.org) (To write our smart contract)
- [Hardat](https://hardhat.org/) (build, test and deployment framework)
- [React](https://reactjs.org/) (Create our frontend)
- [Metamask](https://metamask.io/) (Web Wallet that will allow us to interact with the ethereum blockchain) 
- [Ethers](https://docs.ethers.io) (web3 library for interacting with the blockchain and our smart contract)

## Installing a web wallet

Before getting started make sure you have a web wallet installed, I recommend [Metamask](https://metamask.io/download/). It is essentially just a browser extension that will allow us to interact with the ethereum blockchain. Just follow the instructions provided in the link to install and make sure not to use the same seed phrase for development for real ethereum/money. 

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

Let's create our contract, it will be very simple, the contract will only read from and write to the blockchain. I wanted to keep the contract simple since this will be a comprehensive look at all of the tools necessary to create a fullstack dapp.

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

It is also important to note that hardhat comes with it's own network so when we run our tests hardhat will spin up a local network where we can deploy our contract to and test.

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
$ hh test # or npx hardhat test

  SimpleStorage contract
    ✓ test deployment (366ms)
    ✓ test set new value (52ms)


  2 passing (420ms)
```

You will notice the text that we added to the test is printed out when the test runs

**NOTE** Another good example test: [link](https://hardhat.org/tutorial/testing-contracts.html) 
### console.log in solidity

When running contracts inside of the hardhat network we can make use of a special logging function provided by hardhat, here is an example of how to add it to your contract:

```
// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import "hardhat/console.sol";

contract SimpleStorage {
    uint256 storedData;

    constructor(uint256 _storedData) {
        console.log("Deployed by: ", msg.sender);
        console.log("Deployed with value: %s", _storedData);
        storedData = _storedData;
    }

    function set(uint256 x) public {
        console.log("Set value to: %s", x);
        storedData = x;
    }

    function get() public view returns (uint256) {
        console.log("Retrieved value: %s", storedData);
        return storedData;
    }
}
```

Now when we run `hh test` we should see:

```
  SimpleStorage contract
Deployed by:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
Deployed with value: 123
Retrieved value: 123
    ✓ test deployment (465ms)
Deployed by:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
Deployed with value: 123
Set value to: 456
Retrieved value: 456
    ✓ test set new value (74ms)
```

As you can see the logging function is very useful when trying to figure out what is happening with the internal logic of the smart contract.

## Deploying our contract

Now we are ready to deploy our contract, hardhat provides a local blockchain for testing so that we don't need to setup a node or use a third party provider to deploy to a testnet. We will first deploy to the local network and then optionally I will show you how to deploy to a testnet.

### Deployment script

Before we can deploy our contract we will need a deployment script so that `hardhat` knows how to instantiate the contract.

- First create a directory called `scripts/` and a file inside called `deploy.js`:

```
mkdir scripts/
touch scripts/deploy.js
```

- Here is some example code we can use to deploy our contract:

```
async function main() {
  // We get the contract to deploy
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const greeter = await SimpleStorage.deploy(789);

  // NOTE: All Contracts have an associated address
  console.log("SimpleStorage deployed to:", greeter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```


### Local deployment

- Start a local node

```
hh node # or npx hardhat node
```

You should see that 20 accounts are created with 10000 ETH each.

- In another terminal deploy the contract:

```
npx hardhat run --network localhost scripts/deploy.js
```

In the terminal where you started your local node you should have noticed the following output:

```
  Contract deployment: SimpleStorage
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x024bf3c1eb46ed3f405b7b10ea4c5e6b46c9e9deeed38d0743c6a7ae16b4d5b1
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            290646 of 290646
  Block #1:            0x0eabbc7dff1b963c76b5b077d3df3353f201a450d72361b3de3218454cffe105

  console.log:
    Deployed by:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
    Deployed with value: 789
```

**NOTE** Notice the `console.log` section, we can utilize the builtin logging functionality whenever our contract is deployed on the `hardhat` network, this is not just available in testing.

**NOTE** The Contract address will be useful later when we want to interact with our contract

## Creating our frontend

We will be using [React](https://reactjs.org/) since it is by far the most popular framework used to create frontends for dapps. 

If you need to brush up on your React skills I recommend checking out this tutorial: [React Tutorial](https://www.youtube.com/watch?v=j942wKiXFu8&list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d) 

Make sure you are in the root of our project (in the `intro-fullstack-ethereum` directory) and run:

```
npx create-react-app frontend
```

and make sure you can start your frontend by entering the `frontend` directory and running:

```
npm start
```

### Accessing our contract

Before we get started writing any code for the frontend we will need to have access to our contracts `ABI` or Application Binary Interface, which is basically just a JSON file containing the functions, permissions and other information about our smart contract. Normally this would be found under the `./artifacts/contracts/SimpleStorage.sol` directory and be called: `SimpleStorage.json`, but we want to move this somewhere that our frontend will be able to access it. so that `ethers.js` will know what functions are available for example.

Instead of moving this file somewhere our frontend can find it. I think it would be better if every time we compile our contract the file is automatically placed in `frontend/src/artifacts`. We can achieve this by adding the `paths` option to our `hardhat.config.js` file:

```
module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './frontend/src/artifacts',
  },
}
```

Now whenever we run `hh compile` the `ABI` is placed in `./frontend/src/artifacts`

## Metamask Hardhat Local Blockchain Fix

Before we can use metamask with our local blockchain we also need to add the following to `hardhat.config.js`:

```
module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './frontend/src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
}
```

[Metamask chainId issue](https://hardhat.org/metamask-issue.html) 

## Interacting with the Blockchain (using ethers.js)

Ok so now that we've created our smart contract, tested it, deployed it, and obtained the ABI, we are now ready to interact with our contract and create our dapp.

To begin remove all of the code in `src/App.js` and replace it with the code found at the following link: [App.js](https://github.com/ChristianChiarulli/intro-fullstack-ethereum/blob/master/frontend/src/App.js) 

### Connect Metamask to Local Blockchain

Open up your Metamask extension, click on the top where it says `mainnet` and choose `Localhost 8545`. 

I also recommend importing one of the accounts into Metamask so that you have 10,000 ether to play with. You can import by private key in metamask so just grab one of the private keys from the terminal where you started your node.

### Interact with the Dapp

You should now be able to interact with the dapp. Try getting the value and observe that it is the same value passed to the deploy function in out deploy script. After clicking the connect button you will be able to spend some ether and update the value in the smart contract.

**NOTE:** Remember changing values on chain cost ether, reading values from the blockchain is free.

## Styling

If you want to be a **fullstack** blockchain developer then you cannot escape learning `css` and how to create a solid UI/UX for your users, or investors. There are solutions like [bootstrap](https://getbootstrap.com/) available, but I would recommend at least knowing the basics including `flexbox`, `css-grid` and how to make your site responsive.

Here are some good resources to learn `css`

- [Flexbox](https://www.youtube.com/watch?v=3YW65K6LcIA) 
- [CSS Grid](https://www.youtube.com/watch?v=moBhzSC455o) 
- [Build a Responsive Website](https://www.youtube.com/watch?v=p0bGHP-PXD4) 
- [Complete Guide](https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/learn/lecture/9654188?start=15#content) 

## Testnet deployment (Optional)

In order to deploy your contract to a testnet you will need to edit the `hardhat.config.js` to include networks other than `localhost`. 

You will also need to set up an account with a node provider (you could do this without one but it will be much more complicated) for this tutorial I set one up at [alchemy.io](https://www.alchemy.com/) 

Here is an example of adding the `Ropsten` testnet to our list of networks:

```
require('@nomiclabs/hardhat-waffle')

// Replace this with a URL generated after setting up and account 
// with a node provider e.g. alchemy.io
const ROPSTEN_URL = ''

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY = ''

module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './frontend/src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: `${ROPSTEN_URL}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`],
    },
  },
}
```

After adding the new entry you will need to deploy your contract using the same deployment script and command as before

```
npx hardhat run --network ropsten scripts/deploy.js
```

After running this command copy the address for your deployed contract and head over to [ropsten.etherscan.io](https://ropsten.etherscan.io/) and click on the `Contract` tab and `Verify and Publish` your contract. For this tutorial you can select TODO: fill this in after anther deployment

TODO: get test ether

TODO: update contract address in `App.js`
