import { decorate, observable, action } from 'mobx'
import eosAgent from '../EosAgent'

class EosioStore {
  everyeoswalletAccount = 'everyeosbank'
  info = null

  getInfo = async () => {
    try {
      const eosInfo = await eosAgent.getInfo()

      this.info = eosInfo
    } catch (e) {}
  }

  getCurrencyBalance = async data => {
    return await eosAgent.getCurrencyBalance(data)
  }

  buyToken = async (contract, data) => {
    //memo : {"type":"buyLimit","symbol": "IQ","market":"IQ_EOS","price":0.00101,"qty":100,"amount":0.101}
    const cb = tr => {
      const options = { authorization: [`${data.accountName}@${data.authority}`] }

      tr.transfer(
        {
          from: data.accountName,
          to: this.everyeoswalletAccount,
          quantity: `${Number(data.quantity)
            .toFixed(data.precision)
            .toString()} ${data.symbol}`,
          memo: data.memo
        },
        options
      )
    }

    return await eosAgent.createTransactionWithContract(contract, cb)
  }

  sellToken = async (contract, data) => {
    //memo : {"type":"sellSimit","symbol": "IQ","market":"IQ_EOS","price":0.00255,"qty":44.89,"amount":0.1144}
    const cb = tr => {
      const options = { authorization: [`${data.accountName}@${data.authority}`] }

      tr.transfer(
        {
          from: data.accountName,
          to: this.everyeoswalletAccount,
          quantity: `${Number(data.quantity)
            .toFixed(data.precision)
            .toString()} ${data.symbol}`,
          memo: data.memo
        },
        options
      )
    }

    return await eosAgent.createTransactionWithContract(contract, cb)
  }
}

decorate(EosioStore, {
  info: observable,
  getInfo: action
})

export default new EosioStore()
