import { decorate, observable, action } from 'mobx'
import eosAgent from '../EosAgent'

class EosioStore {
  info = null

  getInfo = async () => {
    try {
      const eosInfo = await eosAgent.getInfo()

      this.info = eosInfo
    } catch (e) {}
  }
}

decorate(EosioStore, {
  info: observable,
  getInfo: action
})

export default new EosioStore()
