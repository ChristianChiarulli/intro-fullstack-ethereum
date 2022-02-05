import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'

// NOTE: Make sure to change this to the contract address you deployed
const simpleStorageAddress = '0xde4De608C284709E8980212C7A48B8bcA5b570A2'
// ABI so the web3 library knows how to interact with our contract
const simpleStorageAbi = SimpleStorage.abi

// NOTE: checkout the API for ethers.js here: https://docs.ethers.io/v5/api/

const App = () => {
  const [provider, setProvider] = useState()
  const [inputValue, setInputValue] = useState('')
  const [value, setValue] = useState('0')
  const [blockNumber, setBlockNumber] = useState('0')
  const [gasPrice, setGasPrice] = useState('0')
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [connected, setConnected] = useState(false)

  // Will run once everytime a user connects to the dapp
  useEffect(() => {
    // check if ethereum is provided by something like Metamask
    if (typeof window.ethereum !== 'undefined') {
      console.log('ethereum is available')

      // get provider injected by metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      // Set some data like block number and gas price provided
      const setBlockchainData = async () => {
        setBlockNumber(await provider.getBlockNumber())
        let gasPrice = await provider.getGasPrice()
        gasPrice = Math.trunc(ethers.utils.formatUnits(gasPrice, 'gwei'))
        setGasPrice(gasPrice)
      }

      // Set aquired blockchain data as state to use in our frontend
      setBlockchainData()

      // Set provider so we can use it in other functions
      setProvider(provider)
    }
  }, [])

  // handles setting our account
  const accountHandler = async (account) => {
    setAccount(account)
    const balance = await provider.getBalance(account.toString())
    setBalance(ethers.utils.formatEther(balance))
  }

  const connectHandler = async () => {
    const accountList = await provider.listAccounts()
    accountHandler(accountList[0])
    setConnected(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // stops page from refreshing
    const contract = new ethers.Contract(
      simpleStorageAddress,
      simpleStorageAbi,
      provider
    )
    const signer = provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    console.log(await contractWithSigner.set(inputValue))
    console.log(inputValue)
  }

  const handlRetrieveData = async () => {
    const simpleStorageContract = new ethers.Contract(
      simpleStorageAddress,
      simpleStorageAbi,
      provider
    )
    setValue(ethers.utils.formatUnits(await simpleStorageContract.get(), 0))
  }

  return (
    <div className='layout'>
      <header className='navbar'>
        <div className='container'>
          <div className='logo'>Simple Storage</div>
          {connected ? (
            <div>
              <label>
                {`${Number.parseFloat(balance).toPrecision(4)} ETH`}
              </label>
              <button className='account-button' onClick={connectHandler}>
                {account.substring(0, 6)}...
                {account.substring(account.length - 4)}
              </button>
            </div>
          ) : (
            <button className='connect-button' onClick={connectHandler}>
              Connect
            </button>
          )}
        </div>
      </header>
      <section className='cards'>
        <div className='card'>
          <h2>Set Value</h2>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              name='value'
              placeholder='0'
            />
            <button>Submit</button>
          </form>
        </div>
        <div className='card'>
          <h2>Get Value</h2>
          <button onClick={handlRetrieveData}>Retrieve</button>
          <label>{value}</label>
        </div>
      </section>
      <footer>
        <div className='container'>
          {gasPrice} gwei &bull; {blockNumber}
        </div>
      </footer>
    </div>
  )
}

export default App
