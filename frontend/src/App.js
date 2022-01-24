import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
// import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'

const simpleStorageAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
// const simpleStorageAbi = SimpleStorage.abi

const App = () => {
  const [provider, setProvider] = useState()

  // For the form
  const [inputValue, setInputValue] = useState('')
  const [value, setValue] = useState('0')
  const [blockNumber, setBlockNumber] = useState('0')
  const [gasPrice, setGasPrice] = useState('0')

  useEffect(async () => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('ethereum is available')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      setBlockNumber(await provider.getBlockNumber())
      let gasPrice = await provider.getGasPrice() 
      gasPrice = Math.trunc(ethers.utils.formatUnits(gasPrice, "gwei"))
      setGasPrice(gasPrice)
      // console.log(SimpleStorage.abi)
      console.log(await provider.getGasPrice())
    }
  }, [])

  const getStoredData = async () => {
    // const simpleStorageContract = new ethers.Contract(
    //   simpleStorageAddress,
    //   simpleStorageAbi,
    //   provider
    // )
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
          <button>Connect</button>
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
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault()
                }
              }}
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
        <div className='container'>{gasPrice} gwei &bull; {blockNumber}</div>
      </footer>
    </div>
  )
}

export default App
