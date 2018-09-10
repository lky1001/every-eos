import Eos from 'eosjs'
import * as Values from './constants/Values'

const singleton = Symbol()
const singletonEosAgent = Symbol()

const ENDPOINT = Values.NETWORK.protocol + '://' + Values.NETWORK.host + ':' + Values.NETWORK.port

class EosAgent {
  constructor(eosAgent) {
    if (eosAgent !== singletonEosAgent) {
      throw new Error('Cannot construct singleton')
    }

    this.scatter = null
    this._initialized = false
    this.identity = null
    this.scatterAccount = null

    this.eos = Eos({
      httpEndpoint: ENDPOINT,
      chainId: Values.NETWORK.chainId
    })
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new EosAgent(singletonEosAgent)
    }

    return this[singleton]
  }

  initScatter = scatter => {
    this.scatter = scatter
    this._initialized = true
  }

  isInitScatter = () => {
    return this._initialized
  }

  initEosAgent = id => {
    if (id) {
      this.scatter.useIdentity(id)
      console.log('Possible identity', this.scatter.identity)
      const loginAccount = this.scatter.identity.accounts.find(
        acc => acc.blockchain === Values.NETWORK.blockchain
      )

      this.scatterAccount = loginAccount
      this.identity = id

      this.eos = this.scatter.eos(Values.NETWORK, Eos, Values.CONFIG)

      return true
    }
  }

  loginWithScatter = async () => {
    if (!this.scatter) {
      return false
    }

    let id = await this.scatter.getIdentity(Values.requiredFields)

    return this.initEosAgent(id)
  }

  logout = async () => {
    if (!this.scatter) {
      return
    }

    let res = await this.scatter.forgetIdentity()

    this._initialized = false
    this.identity = null
    this.loginAccount = null
    this.eos = Eos({
      httpEndpoint: ENDPOINT,
      chainId: Values.NETWORK.chainId
    })

    console.log('logout : ' + res)
  }

  getScatterAccount = () => {
    return this.scatterAccount
  }

  getBlock = async blockNum => {
    if (!this.eos) {
      return
    }

    return await this.eos.getBlock(blockNum)
  }

  getInfo = async () => {
    return this.eos.getInfo({})
  }

  /**
   * query = {
      json: true,
      code: 'code',
      scope: 'scope',
      table: 'table name'
    }
   */
  getTableRows = async query => {
    if (!this.eos) {
      return
    }

    return await this.eos.getTableRows(query)
  }

  getAccount = async accountName => {
    if (!this.eos) {
      return
    }

    return await this.eos.getAccount({ account_name: accountName })
  }

  getKeyAccounts = async publicKey => {
    if (!this.eos) {
      return
    }

    return await this.eos.getKeyAccounts({ public_key: publicKey })
  }

  getCurrencyBalance = async query => {
    if (!this.eos) {
      return
    }

    return await this.eos.getCurrencyBalance(query)
  }

  getCurrencyStats = async query => {
    if (!this.eos) {
      return
    }

    return await this.eos.getCurrencyStats(query)
  }

  getActions = async (account_name, pos, offset) => {
    if (!this.eos) {
      return
    }

    return await this.eos.getActions({
      account_name,
      pos,
      offset
    })
  }

  /**
   * isProxy :
   * 1 : proxy
   * 0 : unproxy
   */
  regproxy = async (accountName, isProxy) => {
    if (!this.eos) {
      return
    }

    return await this.eos.regproxy({
      proxy: accountName,
      isproxy: isProxy
    })
  }

  voteProducer = async (account, producers = [], proxy = '') => {
    if (!this.eos) {
      return
    }

    return await this.eos.voteproducer(account, proxy, producers)
  }

  refund = async owner => {
    if (!this.eos) {
      return
    }

    return await this.eos.refund({
      owner
    })
  }

  createTransaction = async cb => {
    if (!this.eos) {
      return
    }

    return await this.eos.transaction(cb)
  }

  createTransactionWithContract = async (contract, cb) => {
    if (!this.eos) {
      return
    }

    return await this.eos.transaction(contract, cb)
  }

  signData = data => {
    if (!this.scatter || !this.identity) return null

    console.log('펍키 이거다!!!! :', this.identity.publicKey)
    return this.scatter.getArbitrarySignature(this.identity.publicKey, data, 'Signing', false)
  }
}

export default EosAgent.instance
