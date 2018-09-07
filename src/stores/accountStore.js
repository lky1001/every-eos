import { decorate, observable, action } from 'mobx'
import eosAgent from '../EosAgent'

class AccountStore {
  isLogin = false
  loginAccountInfo = null
  totalBalance = 0.0
  totalRefund = 0.0
  eosBalance = 0.0
  liquid = 0.0
  cpu = {
    max: 0,
    used: 0,
    avaiable: 0
  }
  net = {
    max: 0,
    used: 0,
    avaiable: 0
  }
  ram = {
    max: 0,
    used: 0,
    avaiable: 0
  }
  totalResource = {
    cpuWeight: 0.0,
    netWeight: 0.0
  }
  selfDelegatedResource = {
    cpuWeight: 0.0,
    netWeight: 0.0
  }
  selfStake = 0.0
  delegatedStake = 0.0
  totalStake = 0.0
  permissions = null
  myVoteProducers = []
  isProxy = 0
  proxy = ''

  login = async () => {
    let result = await eosAgent.loginWithScatter()

    if (result) {
      await this.loadAccountInfo()

      this.isLogin = true

      return true
    } else {
      return false
    }
  }

  logout = async () => {
    await eosAgent.logout()

    this.isLogin = false
    this.account = null
  }

  loadAccountInfo = async () => {
    let balance
    const scatterAccount = eosAgent.getScatterAccount()

    const loginAccountInfo = await eosAgent.getAccount(scatterAccount.name)

    if (loginAccountInfo) {
      this.liquid = loginAccountInfo.core_liquid_balance ? parseFloat(loginAccountInfo.core_liquid_balance.split(' ')[0]) : 0
      this.cpu = {
        max: parseFloat(loginAccountInfo.cpu_limit.max),
        used: parseFloat(loginAccountInfo.cpu_limit.used),
        available: parseFloat(loginAccountInfo.cpu_limit.available)
      }
      this.net = {
        max: parseFloat(loginAccountInfo.net_limit.max),
        used: parseFloat(loginAccountInfo.net_limit.used),
        available: parseFloat(loginAccountInfo.net_limit.available)
      }
      this.ram = {
        max: loginAccountInfo.ram_quota,
        used: loginAccountInfo.ram_usage,
        available: loginAccountInfo.ram_quota - loginAccountInfo.ram_usage
      }

      let refundingCpuAmount = 0.0
      let refundingNetAmount = 0.0

      if (loginAccountInfo.refund_request) {
        refundingCpuAmount = parseFloat(loginAccountInfo.refund_request.cpu_amount.split(' ')[0])
        refundingNetAmount = parseFloat(loginAccountInfo.refund_request.net_amount.split(' ')[0])
      }

      this.totalRefund = refundingCpuAmount + refundingNetAmount
      this.totalCpuStaked = parseFloat(loginAccountInfo.total_resources.cpu_weight.split(' ')[0])
      this.totalNetStaked = parseFloat(loginAccountInfo.total_resources.net_weight.split(' ')[0])
      this.selfCpuStaked = loginAccountInfo.self_delegated_bandwidth
        ? parseFloat(loginAccountInfo.self_delegated_bandwidth.cpu_weight.split(' ')[0])
        : 0

      this.selfNetStaked = loginAccountInfo.self_delegated_bandwidth
        ? parseFloat(loginAccountInfo.self_delegated_bandwidth.net_weight.split(' ')[0])
        : (this.totalResource = {
          cpuWeight: this.totalCpuStaked,
          netWeight: this.totalNetStaked
        })

      this.selfDelegatedResource = {
        cpuWeight: this.selfCpuStaked,
        netWeight: this.selfNetStaked
      }

      this.totalStake = this.totalCpuStaked + this.totalNetStaked
      this.selfStake = this.selfCpuStaked + this.selfNetStaked
      // todo - 토탈 발란스에 델리게이트도 포함해야 하는가?
      this.totalBalance = this.netStaked + this.cpuStaked + this.totalRefund + this.liquid
      this.permissions = loginAccountInfo.permissions

      if (loginAccountInfo.voter_info) {
        const myVoteProducers = Object.keys(loginAccountInfo.voter_info.producers).map(k => {
          return loginAccountInfo.voter_info.producers[k]
        })

        this.myVoteProducers = myVoteProducers.sort()
        this.isProxy = loginAccountInfo.voter_info.is_proxy
        this.proxy = loginAccountInfo.voter_info.proxy
      }

      balance = await eosAgent.getCurrencyBalance({
        code: 'eosio.token',
        account: loginAccountInfo.account_name,
        symbol: 'EOS'
      })

      if (balance && balance.length > 0) {
        this.eosBalance = balance[0].split(' ')[0]
      } else {
        this.eosBalance = 0.0
      }

      this.loginAccountInfo = loginAccountInfo
    }
  }

  getTokenBalance = async (symbol, contract) => {
    const balance = await eosAgent.getCurrencyBalance({
      code: contract,
      account: this.loginAccountInfo.account_name,
      symbol: symbol
    })

    return balance[0].split(' ')[0]
  }
}

decorate(AccountStore, {
  isLogin: observable,
  loginAccountInfo: observable,
  totalBalance: observable,
  totalRefund: observable,
  eosBalance: observable,
  liquid: observable,
  cpu: observable,
  net: observable,
  ram: observable,
  totalResource: observable,
  selfDelegatedResource: observable,
  cpuStaked: observable,
  netStaked: observable,
  staked: observable,
  permissions: observable,
  myVoteProducers: observable,
  isProxy: observable,
  proxy: observable,
  login: action,
  logout: action,
  loadAccountInfo: action
})

export default new AccountStore()
