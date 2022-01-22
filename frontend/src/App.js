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
    <>
      <nav className='navbar'>
        <div className='container'>
          <div className='logo'>SimpleStorage</div>
          <ul className='nav'>
            <li>
              <a href='#'>Connect</a>
            </li>
          </ul>
        </div>
      </nav>
      <section className='cards'>
        <div className='card-container'>
          <div className='card'>
            <h2>Set Value</h2>
            <form className='storage-form'>
              <label>
                <input type='text' name='value' className='form-input' />
              </label>
            </form>
            <button className='btn'>Submit</button>
          </div>
          <div className='card'>
            <h2>Get Value</h2>
            <button className='btn'>Retrieve</button>
            <label className='lbl'>0</label>
          </div>
        </div>
      </section>
      {/* <div className="navbar">navbar</div> */}
      {/* <div className="logo">Logo</div> */}
      {/* <div className="nav">nav</div> */}
      {/* <div className="content">content</div> */}
      {/* <div className="footer">footer</div> */}
    </>
  )
}

export default App
