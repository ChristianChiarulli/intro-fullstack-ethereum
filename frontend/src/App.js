import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
// import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'

const simpleStorageAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
// const simpleStorageAbi = SimpleStorage.abi

const App = () => {
  const [provider, setProvider] = useState()

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('ethereum is available')
      setProvider(new ethers.providers.Web3Provider(window.ethereum))
      // console.log(SimpleStorage.abi)
    }
  }, [])

  const getBlockNumber = async () => {
    console.log(await provider.getBlockNumber())
  }

  const getBalance = async () => {
    console.log(
      await provider.getBalance('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
    )
  }

  const getStoredData = async () => {
    // const simpleStorageContract = new ethers.Contract(
    //   simpleStorageAddress,
    //   simpleStorageAbi,
    //   provider
    // )
    // console.log(await simpleStorageContract.get())
    {
      /* <header className='navbar'> */
    }
    {
      /* <button onClick={getBlockNumber}>Get Block Number</button> */
    }
    {
      /* <button onClick={getBalance}>Get Balance</button> */
    }
    {
      /* <button onClick={getStoredData}>Get Stored Data</button> */
    }
    {
      /* </header> */
    }
  }

  return (
    <div className='wrapper'>
      <header className='navbar'>
        <div className='container'>
          <div className='logo'>Simple Storage</div>
          <button>Connect</button>
        </div>
      </header>
      <section className='cards'>
        <div className='card'>
          <h2>Set Value</h2>
          <form>
            <label>
              <input type='text' name='value' />
            </label>
          </form>
          <button>Submit</button>
        </div>
        <div className='card'>
          <h2>Get Value</h2>
          <button>Retrieve</button>
          <label>0</label>
        </div>
      </section>
      <footer>
        <div className='container'>
          {"200 gwei | 7906980"}
        </div>
      </footer>
    </div>
  )
}

export default App
