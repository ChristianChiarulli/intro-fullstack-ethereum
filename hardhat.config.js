/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle')
require("dotenv").config();

const RINKEBY_URL = process.env.RINKEBY_URL
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY

module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './frontend/src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: `${RINKEBY_URL}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
    },
  },
}
