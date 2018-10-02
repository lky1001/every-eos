import React, { Component } from 'react'
import { Row, Col, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { withAlert } from 'react-alert'
import { FormattedMessage } from 'react-intl'
import ColorsConstant from '../Colors/ColorsConstant'
import { RightAlignCol } from '../Common/Common'
import { EOS_TOKEN, SCATTER_ERROR_LOCKED, SCATTER_ERROR_REJECT_TRANSACTION_BY_USER } from '../../constants/Values'

import styled from 'styled-components'

const CustomSwal = withReactContent(Swal)

const OrderTabPanel = styled(TabPanel)`
  font-size: 1.25rem;
`

const OrderRowPanel = styled(Row)`
  height: 40px;
  margin: 12px;
  align-items: center;
`

const OrderColPanel = styled(Col)`
  text-align: right;
  padding-right: 8px;
`

const PrimaryOrderColPanel = styled(OrderColPanel)`
  text-align: left;
  color: ${props => (props.buy ? ColorsConstant.Thick_green : props.sell && ColorsConstant.Thick_red)};
`

const OrderInput = styled(Input)`
  height: 40px;
  font-size: 1.25rem;
`

const OrderButton = styled(Button)`
  width: 100%;
  height: 40px;
  border: hidden;
  border-radius: 0;
  background: ${props => props.color};
  color: white;
  font-size: 16px;
  &:hover,
  &:focus,
  &:active {
    color: white;
    font-weight: 700;
  }
`

class Order extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      tabIndex: 0,
      buyPrice: 0.1,
      buyQty: 0.0001,
      sellPrice: 0.1,
      sellQty: 0.0001,
      buyMarketTotalEos: 0.1,
      sellMarketAmount: 0.0001,
      tokenBalance: 0.0
    }
  }

  componentWillMount = () => {
    const { tradeStore, accountStore, eosioStore, token } = this.props
    this.disposer = tradeStore.setWatchPrice(changed => {
      this.setState({
        buyPrice: parseFloat(changed.newValue),
        sellPrice: parseFloat(changed.newValue)
      })
    })

    this.disposerAccount = accountStore.subscribeLoginState(async changed => {
      if (changed.oldValue !== changed.newValue) {
        if (changed.newValue) {
          const tokenBalance = await eosioStore.getCurrencyBalance({
            code: token.contract,
            account: accountStore.loginAccountInfo.account_name,
            symbol: token.symbol
          })

          if (tokenBalance.length > 0) {
            const balance = tokenBalance[0].split(' ')[0]

            this.setState({
              tokenBalance: parseFloat(balance)
            })
          }
        } else {
          this.setState({
            tokenBalance: 0.0
          })
        }
      }
    })
  }

  componentWillUnmount = () => {
    if (this.disposer) {
      this.disposer()
    }

    if (this.disposerAccount) {
      this.disposerAccount()
    }
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  handleChange = name => event => {
    if (parseFloat(event.target.value) < 0) {
      return
    }

    this.setState({
      [name]: event.target.value
    })
  }

  onBuyLimitClick = async () => {
    const { eosioStore, accountStore, tradeStore, token } = this.props

    if (!accountStore.isLogin) {
      this.props.alert.show('Please login.')
      return
    }

    let eosBalance = await accountStore.getTokenBalance(EOS_TOKEN.symbol, EOS_TOKEN.contract)
    eosBalance = parseFloat(eosBalance)

    const eosAmount = parseFloat(this.state.buyPrice * this.state.buyQty).toFixed(EOS_TOKEN.precision)

    if (eosAmount < 0.1) {
      this.props.alert.show('Order is must greater then or equal to 0.1000 EOS.')
      return
    }

    if (eosAmount > eosBalance) {
      this.props.alert.show('Please check your eos balance.')
      return
    }

    const tokenPriceInEos = parseFloat(parseFloat(this.state.buyPrice).toFixed(EOS_TOKEN.precision))
    const tokenQty = parseFloat(parseFloat(this.state.buyQty).toFixed(EOS_TOKEN.precision))

    const memo = {
      type: 'BUY_LIMIT',
      symbol: token.symbol,
      market: 'EOS',
      price: tokenPriceInEos,
      qty: tokenQty,
      amount: eosAmount
    }

    const data = {
      accountName: accountStore.loginAccountInfo.account_name,
      authority: accountStore.permissions[0].perm_name,
      quantity: eosAmount,
      precision: EOS_TOKEN.precision,
      symbol: EOS_TOKEN.symbol,
      memo: JSON.stringify(memo)
    }

    try {
      const result = await eosioStore.buyToken(EOS_TOKEN.contract, data)

      if (result) {
        tradeStore.getPollingOrderByTxId(result.transaction_id)
        this.props.alert.show('Success(' + result.transaction_id + ')')
      }
    } catch (e) {
      this.handleError(e)
    }
  }

  onBuyMarketClick = async () => {
    const { eosioStore, accountStore, token } = this.props

    if (!accountStore.isLogin) {
      this.props.alert.show('Please login.')
      return
    }

    const eosBalance = await accountStore.getTokenBalance(EOS_TOKEN.symbol, EOS_TOKEN.contract)

    const eosAmount = parseFloat(this.state.buyMarketTotalEos).toFixed(EOS_TOKEN.precision)

    if (eosAmount < 0.1) {
      this.props.alert.show('Order is must greater then or equal to 0.1000 EOS.')
      return
    }

    if (eosAmount > eosBalance) {
      this.props.alert.show('Please check your eos balance.')
      return
    }

    const memo = {
      type: 'BUY_MARKET',
      symbol: token.symbol,
      market: 'EOS',
      price: 0.0,
      qty: 0.0,
      amount: eosAmount
    }

    const data = {
      accountName: accountStore.loginAccountInfo.account_name,
      authority: accountStore.permissions[0].perm_name,
      quantity: eosAmount,
      precision: EOS_TOKEN.precision,
      symbol: EOS_TOKEN.symbol,
      memo: JSON.stringify(memo)
    }

    try {
      const result = await eosioStore.buyToken(EOS_TOKEN.contract, data)

      if (result) {
        this.props.alert.show('Success(' + result.transaction_id + ')')
        alert(JSON.stringify(result))
      }
    } catch (e) {
      this.handleError(e)
    }
  }

  onSellLimitClick = async () => {
    const { eosioStore, accountStore, tradeStore, token } = this.props

    if (!accountStore.isLogin) {
      this.props.alert.show('Please login.')
      return
    }

    let tokenBalance = await accountStore.getTokenBalance(token.symbol, token.contract)
    tokenBalance = parseFloat(tokenBalance)
    const tokenQty = parseFloat(this.state.sellQty)

    if (tokenQty > tokenBalance) {
      this.props.alert.show('Please check your ' + token.name + ' balance.')
      return
    }

    const tokenPriceInEos = parseFloat(parseFloat(this.state.sellPrice).toFixed(token.precision))
    const eosAmount = parseFloat((tokenPriceInEos * tokenQty).toFixed(token.precision))

    if (eosAmount < 0.1) {
      this.props.alert.show('Order is must greater then or equal to 0.1000 EOS.')
      return
    }

    const memo = {
      type: 'SELL_LIMIT',
      symbol: token.symbol,
      market: 'EOS',
      price: tokenPriceInEos,
      qty: tokenQty,
      amount: eosAmount
    }

    const data = {
      accountName: accountStore.loginAccountInfo.account_name,
      authority: accountStore.permissions[0].perm_name,
      quantity: tokenQty,
      precision: token.precision,
      symbol: token.symbol,
      memo: JSON.stringify(memo)
    }

    try {
      const result = await eosioStore.buyToken(token.contract, data)

      if (result) {
        this.props.alert.show('Success(' + result.transaction_id + ')')
        tradeStore.getPollingOrderByTxId(result.transaction_id)
      }
    } catch (e) {
      this.handleError(e)
    }
  }

  onSellMarketClick = async () => {
    const { eosioStore, accountStore, token } = this.props

    if (!accountStore.isLogin) {
      this.props.alert.show('Please login.')
      return
    }

    const tokenBalance = await accountStore.getTokenBalance(token.symbol, token.contract)
    const tokenQty = parseFloat(this.state.sellQty).toFixed(token.precision)

    if (tokenQty > tokenBalance) {
      this.props.alert.show('Please check your ' + token.name + ' balance.')
      return
    }

    const memo = {
      type: 'SELL_MARKET',
      symbol: token.symbol,
      market: 'EOS',
      price: 0.0,
      qty: parseFloat(tokenQty),
      amount: 0.0
    }

    const data = {
      accountName: accountStore.loginAccountInfo.account_name,
      authority: accountStore.permissions[0].perm_name,
      quantity: tokenQty,
      precision: token.precision,
      symbol: token.symbol,
      memo: JSON.stringify(memo)
    }

    try {
      const result = await eosioStore.buyToken(token.contract, data)

      if (result) {
        this.props.alert.show('Success(' + result.transaction_id + ')')
        alert(JSON.stringify(result))
      }
    } catch (e) {
      this.handleError(e)
    }
  }

  handleError = e => {
    if (e.code === SCATTER_ERROR_LOCKED) {
      this.props.alert.show('Scatter is locked.')
    } else if (e.code === SCATTER_ERROR_REJECT_TRANSACTION_BY_USER) {
      this.props.alert.show('Cancelled.')
    }
  }

  render() {
    const { token, accountStore } = this.props

    return (
      <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
        <TabList>
          <Tab>
            <FormattedMessage id="Limit Order" />
          </Tab>
          <Tab>
            <FormattedMessage id="Market Order" />
          </Tab>
        </TabList>

        <OrderTabPanel>
          <Row>
            <Col sm="6">
              <OrderRowPanel>
                <PrimaryOrderColPanel sm="1" />
                <PrimaryOrderColPanel sm="5" buy="true">
                  <FormattedMessage id="Available" />
                </PrimaryOrderColPanel>
                <RightAlignCol sm="6">{`${accountStore.liquid.toFixed(4)} EOS`}</RightAlignCol>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">
                  <FormattedMessage id="Price" />
                </OrderColPanel>
                <Col sm="9">
                  <InputGroup>
                    <OrderInput type="number" value={this.state.buyPrice} onChange={this.handleChange('buyPrice')} step="1" />
                    <InputGroupAddon addonType="append">EOS</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">
                  <FormattedMessage id="Amount" />
                </OrderColPanel>
                <Col sm="9">
                  <InputGroup style={{ width: '100%' }}>
                    <OrderInput placeholder="Amount" type="number" step="1" onChange={this.handleChange('buyQty')} value={this.state.buyQty} />
                    <InputGroupAddon addonType="append">{token.symbol}</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3" />
                <Col sm="9">
                  <OrderButton onClick={this.onBuyLimitClick} color={ColorsConstant.Thick_green}>
                    <FormattedMessage id="BUY" />
                  </OrderButton>
                </Col>
              </OrderRowPanel>
            </Col>

            <Col sm="6">
              <OrderRowPanel>
                <PrimaryOrderColPanel sm="1" />
                <PrimaryOrderColPanel sm="5" sell="true">
                  <FormattedMessage id="Available" />
                </PrimaryOrderColPanel>
                <RightAlignCol sm="6">
                  {this.state.tokenBalance} {token.symbol}
                </RightAlignCol>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">
                  <FormattedMessage id="Price" />
                </OrderColPanel>
                <Col sm="9">
                  <InputGroup>
                    <OrderInput type="number" onChange={this.handleChange('sellPrice')} value={this.state.sellPrice} step="1" />
                    <InputGroupAddon addonType="append">EOS</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">
                  <FormattedMessage id="Amount" />
                </OrderColPanel>
                <Col sm="9">
                  <InputGroup style={{ width: '100%' }}>
                    <OrderInput placeholder="Amount" type="number" step="1" onChange={this.handleChange('sellQty')} value={this.state.sellQty} />
                    <InputGroupAddon addonType="append">{token.symbol}</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3" />
                <Col sm="9">
                  <OrderButton onClick={this.onSellLimitClick} color={ColorsConstant.Thick_red}>
                    <FormattedMessage id="SELL" />
                  </OrderButton>
                </Col>
              </OrderRowPanel>
            </Col>
          </Row>
        </OrderTabPanel>

        <OrderTabPanel>
          <Row>
            <Col sm="6">
              <OrderRowPanel>
                <PrimaryOrderColPanel sm="1" />
                <PrimaryOrderColPanel sm="5" buy="true">
                  <FormattedMessage id="Available" />
                </PrimaryOrderColPanel>
                <RightAlignCol sm="6">{`${accountStore.liquid.toFixed(4)} EOS`}</RightAlignCol>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">
                  <FormattedMessage id="Amount" />
                </OrderColPanel>
                <Col sm="9">
                  <InputGroup style={{ width: '100%' }}>
                    <OrderInput
                      placeholder="Amount"
                      type="number"
                      step="1"
                      onChange={this.handleChange('buyMarketTotalEos')}
                      value={this.state.buyMarketTotalEos}
                    />
                    <InputGroupAddon addonType="append">EOS</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3" />
                <Col sm="9">
                  <OrderButton onClick={this.onBuyMarketClick} color={ColorsConstant.Thick_green}>
                    <FormattedMessage id="BUY" />
                  </OrderButton>
                </Col>
              </OrderRowPanel>
            </Col>
            <Col sm="6">
              <OrderRowPanel>
                <PrimaryOrderColPanel sm="1" />
                <PrimaryOrderColPanel sm="5" sell>
                  <FormattedMessage id="Available" />
                </PrimaryOrderColPanel>
                <RightAlignCol sm="6">
                  {this.state.tokenBalance} {token.symbol}
                </RightAlignCol>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">
                  <FormattedMessage id="Amount" />
                </OrderColPanel>
                <Col sm="9">
                  <InputGroup style={{ width: '100%' }}>
                    <OrderInput
                      placeholder="Amount"
                      type="number"
                      step="1"
                      onChange={this.handleChange('sellMarketAmount')}
                      value={this.state.sellMarketAmount}
                    />
                    <InputGroupAddon addonType="append">{token.symbol}</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3" />
                <Col sm="9">
                  <OrderButton onClick={this.onSellMarketClick} color={ColorsConstant.Thick_red}>
                    <FormattedMessage id="SELL" />
                  </OrderButton>
                </Col>
              </OrderRowPanel>
            </Col>
          </Row>
        </OrderTabPanel>
      </Tabs>
    )
  }
}

export default withAlert(Order)
