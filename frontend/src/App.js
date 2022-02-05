import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'

// NOTE: Make sure to change this to the contract address you deployed
const simpleStorageAddress = '0xde4De608C284709E8980212C7A48B8bcA5b570A2'
// ABI so the web3 library knows how to interact with our contract
const simpleStorageAbi = SimpleStorage.abi

// NOTE: checkout the API for ethers.js here: https://docs.ethers.io/v5/api/
// TIP: Remember to console.log something if you are unsure of what is being returned

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

      // Set some data like block number and gas price provided, you can find more options in the API docs
      const setBlockchainData = async () => {
        setBlockNumber(await provider.getBlockNumber())
        let gasPrice = await provider.getGasPrice()
        // formats a returned big number as gwei where 1,000,000,000 gwei is 1 ether
        // you can read about more denominations here: https://ethdocs.org/en/latest/ether.html
        gasPrice = Math.trunc(ethers.utils.formatUnits(gasPrice, 'gwei'))
        setGasPrice(gasPrice)
      }

      // Set aquired blockchain data as state to use in our frontend
      setBlockchainData()

      // Set provider so we can use it in other functions
      setProvider(provider)
    }
  }, [])

  // handles setting account and balance
  const accountHandler = async (account) => {
    setAccount(account)
    const balance = await provider.getBalance(account)
    // notice that we use format ether here, uncomment the following console.log and see what happens if we don't
    setBalance(ethers.utils.formatEther(balance))
  }

  // handles connecting account
  const connectHandler = async () => {
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
    const accountList = await provider.listAccounts()
    console.log(accountList)
    accountHandler(accountList[0])
    setConnected(true)
  }

  // handles submit button
  const handleSubmit = async (e) => {
    // stops page from refreshing
    e.preventDefault()

    // create instance of contract using our contract address, abi, and provider
    const contract = new ethers.Contract(
      simpleStorageAddress,
      simpleStorageAbi,
      provider
    )

    // a signer is necessary when your want to write to the blockchain
    // your wallet doesn't need to sign or spend any ether to read from the blockchain
    // but it does need to spend ether and therefore sign to write to the blockchain
    const signer = provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    // we can use 'set' here because the abi provides us with a reference to the methods defined in our smart contract
    console.log(await contractWithSigner.set(inputValue))
    console.log(inputValue)
  }

  const handleRetrieveData = async () => {
    const simpleStorageContract = new ethers.Contract(
      simpleStorageAddress,
      simpleStorageAbi,
      provider
    )
    // we can use 'get' here because the abi provides us with a reference to the methods defined in our smart contract
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
          <button onClick={handleRetrieveData}>Retrieve</button>
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
