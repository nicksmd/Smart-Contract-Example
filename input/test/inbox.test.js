/* eslint-disable import/newline-after-import,no-unused-vars */
// 'use strict'

const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const { interface, bytecode } = require('../compile')

const provider = ganache.provider()
const web3 = new Web3(provider)

let accounts = []
// direct ref of the Inbox contract
let inbox

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  // deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ['Hello world!']
    }) // this line doesn't deploy anything, just create an obj then can be deploy to the network
    .send({
      from: accounts[0],
      gas: '1000000'
    }) // trigger the deploy
})

describe('Inbox', () => {
  it('Deploy a contract', () => {
    assert.ok(inbox.options.address)
  })
  it('Has a default message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, 'Hello world!')
  })
  it('Can change the message', async () => {
    await inbox.methods.setMessage('I am Quang').send({
      from: accounts[0],
      gas: '1000000'
    })
    const message = await inbox.methods.message().call()
    assert.equal(message, 'I am Quang')
  })
})
