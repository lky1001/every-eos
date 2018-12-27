import eosioStore from './eosioStore'
import accountStore from './accountStore'
import marketStore from './marketStore'
import tradeStore from './tradeStore'
import noticeStore from './noticeStore'

class RootStore {
  constructor() {
    this.eosioStore = new eosioStore(this)
    this.accountStore = new accountStore(this)
    this.marketStore = new marketStore(this)
    this.tradeStore = new tradeStore(this)
    this.noticeStore = new noticeStore(this)
  }
}

export default RootStore
