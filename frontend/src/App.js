import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
// import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'

const simpleStorageAddress = '0xb107a9552ee8ca6551f6bcda154ef4560da226d2'
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
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={getBlockNumber}>Get Block Number</button>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={getStoredData}>Get Stored Data</button>
      </header>
    </div>
  )
}

export default App
