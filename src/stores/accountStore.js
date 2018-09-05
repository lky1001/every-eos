import { decorate, observable, action } from 'mobx'
import eosAgent from '../EosAgent'

class AccountStore {
  isLogin = false
  loginAccountInfo = null
  totalBalance = 0.0
  totalRefund = 0.0
  eosBalance = 0.0
  liquid = 0.0
  cpuMax = 0.0
  netMax = 0.0
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
      this.isLogin = true

      await this.loadAccountInfo()

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
      this.cpuMax = parseFloat(loginAccountInfo.cpu_limit.max)
      this.netMax = parseFloat(loginAccountInfo.net_limit.max)
      let refundingCpuAmount = 0.0
      let refundingNetAmount = 0.0

      if (loginAccountInfo.refund_request) {
        refundingCpuAmount = parseFloat(loginAccountInfo.refund_request.cpu_amount.split(' ')[0])
        refundingNetAmount = parseFloat(loginAccountInfo.refund_request.net_amount.split(' ')[0])
      }

      this.totalRefund = refundingCpuAmount + refundingNetAmount
      this.totalCpuStaked = parseFloat(loginAccountInfo.total_resources.cpu_weight.split(' ')[0])
      this.totalNetStaked = parseFloat(loginAccountInfo.total_resources.net_weight.split(' ')[0])
      this.selfCpuStaked = parseFloat(loginAccountInfo.self_delegated_bandwidth.cpu_weight.split(' ')[0])
      this.selfNetStaked = parseFloat(loginAccountInfo.self_delegated_bandwidth.cpu_weight.net_weight(' ')[0])

      this.totalResource = {
        cpuWeight: this.totalCpuStaked,
        netWeight: this.totalNetStaked
      }

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

  getAccountTokenBalance = async tokens => {}
}

decorate(AccountStore, {
  isLogin: observable,
  loginAccountInfo: observable,
  totalBalance: observable,
  totalRefund: observable,
  eosBalance: observable,
  liquid: observable,
  cpuMax: observable,
  netMax: observable,
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
