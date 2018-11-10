import React, { Component, Fragment } from 'react'
import Resource from '../components/Wallet/Resource'
import { FormattedMessage } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col, Button, Dropdown, MenuItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { GET_BALANCE_INTERVAL } from '../constants/Values'
import Loader from 'react-loader-spinner'
import { MarketHeader } from '../components/Common/Common'
import _ from 'lodash'

class Wallet extends Component {
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

  render() {
    const { accountStore } = this.props

    return (
      <Fragment>
        {accountStore.isLogin ? (
          <section>
            <div className="container-overlap bg-blue-700">
              <div className="media m0 pv">
                <div className="media-left" />
                <div className="media-body media-middle">
                  <h4 className="media-heading">{accountStore.loginAccountInfo.account_name}</h4>
                  <h4 className="media-heading">{`${accountStore.liquid} EOS`}</h4>
                </div>
              </div>
            </div>
            <Grid fluid>
              <Row>
                {/* Left column */}
                <Col md={7} lg={8}>
                  <form name="user.profileForm" className="card">
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
                                  <td style={{ textAlign: 'left', fontSize: '15px' }}>
                                    {token.name}
                                  </td>
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
                  </form>
                </Col>
                {/* Right column */}
                <Col md={5} lg={4}>
                  <div className="card">
                    <h5 className="card-heading">
                      <FormattedMessage id="Account Resource" />
                    </h5>
                    <div className="card-body pb0">
                      <Resource accountStore={accountStore} />
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </section>
        ) : (
          ''
        )}
      </Fragment>
    )
  }
}

export default compose(
  inject('marketStore', 'eosioStore', 'tradeStore', 'accountStore'),
  observer
)(Wallet)
