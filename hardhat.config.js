/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle')

const RINKEBY_URL = 'https://eth-rinkeby.alchemyapi.io/v2/D-MLvdPiuZ_xbBAGCJuUjVcHGQjiU9xR'
const RINKEBY_PRIVATE_KEY = '2b657be932e7677dee92835d7ec6d9c4d699c10c24a8fa77267dbd157f37d95c'

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
