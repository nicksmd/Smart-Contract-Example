const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const { interface, bytecode } = require('../compile')

const provider = ganache.provider()
const web3 = new Web3(provider)

let accounts = []
let lottery

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode
    })
    .send({
      from: accounts[0],
      gas: '2000000'
    })
})

describe('Lottery contract', () => {
  it('Deploys a contract', () => {
    assert.ok(lottery.options.address)
  })

  it('Allow one player to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    })

    const players = await lottery.methods.getPlayers().call()

    assert.equal(players[0], accounts[0])
    assert.equal(players.length, 1)
  })

  it('Require > 0.01 ether', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('Only manager can pick winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('End to end test', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    })

    const initBalance = await web3.eth.getBalance(accounts[0])

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    const finalBalance = await web3.eth.getBalance(accounts[0])
    const delta = finalBalance - initBalance
    assert(delta > web3.utils.toWei('1.8', 'ether'))
    const numberOfPlayers = await lottery.methods.getNumberOfPlayers().call()
    assert.equal(numberOfPlayers, 0)
  })
})
