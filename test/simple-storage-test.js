const { expect } = require('chai')

describe('SimpleStorage contract', function () {
  it('test deployment', async function () {
    const SimpleStorage = await ethers.getContractFactory('SimpleStorage')

    const simpleStorage = await SimpleStorage.deploy(123)

    const storedValue = await simpleStorage.get()

    expect(storedValue).to.equal(123)
  })

  it('test set new value', async function () {
    const SimpleStorage = await ethers.getContractFactory('SimpleStorage')

    const simpleStorage = await SimpleStorage.deploy(123)

    await simpleStorage.set(456)

    const storedValue = await simpleStorage.get()

    expect(storedValue).to.equal(456)
  })
})
