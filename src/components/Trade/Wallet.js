import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Row, Col } from 'reactstrap'

class Wallet extends Component {
  constructor(props) {
    super(props)

    this.state = {
      getBalanceIntervalId: 0,
      tokens: []
    }
  }
  componentDidMount = async () => {
    const { accountStore } = this.props

    if (accountStore.isLogin) {
      const getInOrdersIntervalId = setInterval(this.getWalletBalace, 5000)

      this.setState({
        getInOrdersIntervalId: getInOrdersIntervalId
      })
    }

    this.disposer = accountStore.subscribeLoginState(changed => {
      if (changed.oldValue !== changed.newValue) {
        if (changed.newValue) {
          this.getWalletBalace()
          const getBalanceIntervalId = setInterval(this.getWalletBalace, 5000)

          this.setState({
            getBalanceIntervalId: getBalanceIntervalId
          })
        } else {
          clearInterval(this.state.getBalanceIntervalId)
        }
      }
    })
  }

  getWalletBalace = async () => {
    const { accountStore, marketStore, eosioStore } = this.props

    const tokens = marketStore.tokens ? (marketStore.tokens.data ? marketStore.tokens.data.tokens : null) : null

    let tokenBalance = []

    const accountName = accountStore.loginAccountInfo ? accountStore.loginAccountInfo.account_name : null

    if (accountName && tokens) {
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        const balance = await eosioStore.getCurrencyBalance({
          code: token.contract,
          account: accountStore.loginAccountInfo.account_name,
          symbol: token.symbol
        })

        tokenBalance.push({
          id: token.id,
          name: token.name,
          balance: balance.length > 0 ? balance[0].split(' ')[0] : 0.0
        })
      }
    }

    this.setState({
      tokens: tokenBalance
    })
  }

  componentWillUnmount = () => {
    if (this.state.getBalanceIntervalId > 0) {
      clearInterval(this.state.getBalanceIntervalId)
    }

    this.disposer()
  }

  render() {
    const { accountStore, marketStore } = this.props

    return (
      <Fragment>
        <Row>
          <Col xs={12}>
            <FormattedMessage id="Wallet" />
          </Col>
        </Row>
        {!accountStore.isLogin && <FormattedMessage id="Please Login" />}
        {accountStore.isLogin &&
          this.state.tokens.map((token, idx) => {
            return (
              <Row key={idx}>
                <Col xs={8}>{token.name}</Col>
                <Col xs={4}>{token.balance}</Col>
              </Row>
            )
          })}
      </Fragment>
    )
  }
}

export default Wallet
