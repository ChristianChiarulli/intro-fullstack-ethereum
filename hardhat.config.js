/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle')

const ROPSTEN_URL = 'https://eth-ropsten.alchemyapi.io/v2/6hiMq2arEwzXsEiupc5-uo28ZY31Vha2'
const ROPSTEN_PRIVATE_KEY = '0e8a2476ce7eec1860c3b42d5c0b662a6b80f37d53918bfcd16671c3292ba591'

const KOVAN_URL = 'https://eth-kovan.alchemyapi.io/v2/Q1hQ-wHl_es7qp4Ssp4XwUREdYEmfQx9'
const KOVAN_PRIVATE_KEY = "62c0c96a5f9d54dcdd81f5615f6dd455b7363b02633eca82570b62356e92c46b"



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
    kovan: {
      url: `${KOVAN_URL}`,
      accounts: [`${KOVAN_PRIVATE_KEY}`],
    },
  },
}
