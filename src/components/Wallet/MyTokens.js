import React, { Component, Fragment } from 'react'
import { ShadowedCard, MarketHeader } from '../Common/Common'
import { FormattedMessage } from 'react-intl'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { GET_BALANCE_INTERVAL } from '../../constants/Values'
import _ from 'lodash'

class MyTokens extends Component {
  constructor(props) {
    super(props)

    this.state = {
      balanceIntervalId: 0,
      searchKeyword: '',
      hideNoBalace: false,
      tokens: []
    }

    this.handleTokenSymbolChangeDelayed = _.debounce(this.handleTokenSymbolChangeDelayed, 500)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount = async () => {
    const { accountStore } = this.props

    if (accountStore.isLogin) {
      this.getWalletBalance()
      const balanceIntervalId = setInterval(this.getWalletBalance, GET_BALANCE_INTERVAL)

      this.setState({
        balanceIntervalId: balanceIntervalId
      })
    }

    this.disposer = accountStore.subscribeLoginState(changed => {
      if (changed.oldValue !== changed.newValue) {
        if (changed.newValue) {
          this.getWalletBalance()
          const balanceIntervalId = setInterval(this.getWalletBalance, GET_BALANCE_INTERVAL)

          this.setState({
            balanceIntervalId: balanceIntervalId
          })
        } else {
          clearInterval(this.state.balanceIntervalId)
        }
      }
    })
  }

  componentWillUnmount = () => {
    if (this.state.balanceIntervalId > 0) {
      clearInterval(this.state.balanceIntervalId)
    }

    if (this.disposer) {
      this.disposer()
    }
  }

  onHideChanged = event => {
    this.setState({
      hideNoBalace: event.target.checked,
      tokens: []
    })
  }
  handleChange = event => {
    this.handleTokenSymbolChangeDelayed(event.target.value)
  }

  handleTokenSymbolChangeDelayed = value => {
    this.setState({
      searchKeyword: value
    })

    this.getWalletBalance()
  }

  getWalletBalance = async () => {
    const { accountStore, marketStore, eosioStore } = this.props

    const tokens = marketStore.tokens
      ? marketStore.tokens.data
        ? marketStore.tokens.data.tokens
        : null
      : null

    const accountName = accountStore.loginAccountInfo
      ? accountStore.loginAccountInfo.account_name
      : null

    const searchKeyword = this.state.searchKeyword
    const hideNoBalace = this.state.hideNoBalace

    if (accountName && tokens) {
      const tokenBalance = await Promise.all(
        tokens
          .filter(token => {
            if (searchKeyword) {
              return (
                token.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1 ||
                token.symbol.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1
              )
            }

            return true
          })
          .map(async token => {
            const balance = await eosioStore.getCurrencyBalance({
              code: token.contract,
              account: accountStore.loginAccountInfo.account_name,
              symbol: token.symbol
            })

            return {
              id: token.id,
              name: token.name,
              symbol: token.symbol,
              balance: balance.length > 0 ? balance[0].split(' ')[0] : 0.0
            }
          })
      )

      const filterTokens = tokenBalance.filter(token => {
        if (hideNoBalace) {
          if (token.balance > 0) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      })

      this.setState({
        tokens: filterTokens
      })
    }
  }

  render() {
    return (
      <ShadowedCard>
        <h5 className="card-heading pb0">
          <FormattedMessage id="Token Balance" />
        </h5>
        <div className="card-body">
          <Row>
            <Col xs={6}>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter Symbol"
                onChange={this.handleChange}
              />
            </Col>
            <Col xs={6} className="text-right">
              <label className="checkbox checkbox-inline" style={{ fontSize: '15px' }}>
                <input type="checkbox" value="" onChange={this.onHideChanged} />
                Hide no balance
              </label>
            </Col>
          </Row>
        </div>
        <div className="card-divider" />
        <iv className="card-body">
          <table className="table">
            <thead>
              <tr>
                <MarketHeader>
                  <FormattedMessage id="Token" />
                </MarketHeader>
                <MarketHeader>
                  <FormattedMessage id="Available" />
                </MarketHeader>
                <MarketHeader>
                  <FormattedMessage id="Frozen" />
                </MarketHeader>
                <MarketHeader>
                  <FormattedMessage id="EOS valuation" />
                </MarketHeader>
                <MarketHeader>
                  <FormattedMessage id="Exchange" />
                </MarketHeader>
              </tr>
            </thead>

            <tbody>
              {this.state.tokens && this.state.tokens.length > 0 ? (
                this.state.tokens.map((token, idx) => {
                  return (
                    <tr key={idx}>
                      <td style={{ textAlign: 'left', fontSize: '15px' }}>{token.name}</td>
                      <td style={{ fontSize: '15px' }}>{token.balance}</td>
                      <td style={{ fontSize: '15px' }}>0.0000</td>
                      <td style={{ fontSize: '15px' }}>1.000</td>
                      <td style={{ fontSize: '15px' }}>
                        <Link to={'/trades/' + token.symbol}>
                          <FormattedMessage id="Move" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5">
                    <div style={{ width: '100%', margin: '0% 50%', padding: '40px' }}>
                      <Loader type="ThreeDots" color="#448AFF" height={40} width={40} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </iv>
      </ShadowedCard>
    )
  }
}

export default MyTokens
