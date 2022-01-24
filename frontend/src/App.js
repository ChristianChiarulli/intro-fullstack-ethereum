import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
// import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'

const simpleStorageAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
// const simpleStorageAbi = SimpleStorage.abi

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
  useEffect(async () => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('ethereum is available')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      setBlockNumber(await provider.getBlockNumber())
      let gasPrice = await provider.getGasPrice()
      gasPrice = Math.trunc(ethers.utils.formatUnits(gasPrice, 'gwei'))
      setGasPrice(gasPrice)
      // console.log(SimpleStorage.abi)
      console.log(await provider.getGasPrice())
    }
  }, [])

  const accountHandler = (account) => {
    setAccount(account)
    getAccountBalance(account.toString())
  }

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        setBalance(ethers.utils.formatEther(balance))
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const connectHandler = () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        accountHandler(result[0])
        getAccountBalance(result[0])
        setConnected(true)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const getBlockNumber = async () => {
    console.log(await provider.getBlockNumber())
  }

  const handleSubmit = (e) => {
    e.preventDefault() // stops page from refreshing
    console.log(inputValue)
  }

  const handlRetrieveData = () => {
    setValue(inputValue)
  }

  return (
    <div className='layout'>
      <header className='navbar'>
        <div className='container'>
          <div className='logo'>Simple Storage</div>
          {connected ? (
            <div>
              <label className='balance'>
                {`${Number.parseFloat(balance).toPrecision(4)} ETH `}
              </label>
              <label className='account'>
                {account.substring(0, 6)}...
                {account.substring(account.length - 4)}
              </label>
            </div>
          ) : (
            <button onClick={connectHandler}>Connect</button>
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
