import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { Header6, FavoriteIcon, ShadowedCard, MarketHeader } from '../Common/Common'
import styled from 'styled-components'
import ColorsConstant from '../Colors/ColorsConstant.js'
import { withCookies, Cookies } from 'react-cookie'
import { Tabs, Icon } from 'antd'
import Loader from 'react-loader-spinner'
import { format } from 'date-fns'
import { getTodayNoon } from '../../utils/timezoneHelper'
import './MarketView.scss'

const TabPane = Tabs.TabPane

class MarketView extends Component {
  constructor(props) {
    super(props)

    const { cookies } = props

    this.state = {
      intervalId: 0,
      favorites: cookies.get('favorites') || []
    }

    this.goTrade = this.goTrade.bind(this)
  }

  componentDidMount = async () => {
    const { marketStore } = this.props

    const id = setInterval(async () => {
      const currentDate = getTodayNoon()

      await marketStore.getTokens(currentDate.getTime())
    }, 5000)

    this.setState({
      intervalId: id
    })
  }

  componentWillUnmount = async () => {
    if (this.state.intervalId > 0) {
      clearInterval(this.state.intervalId)
    }
  }

  goTrade = symbol => {
    this.props.history.push('/trades/' + symbol)
  }

  handleFavorite = symbol => {
    const { cookies } = this.props
    const { favorites } = this.state

    const targetIndex = favorites.indexOf(symbol)
    let newFavorites = []

    if (targetIndex !== -1) {
      newFavorites = favorites.filter(f => f !== symbol)
    } else {
      newFavorites = favorites.concat(symbol)
    }

    cookies.set('favorites', newFavorites, { path: '/' })
    this.setState({ favorites: newFavorites })
  }

  render() {
    const { marketStore } = this.props
    const { favorites } = this.state
    const { tokenList } = marketStore

    const operations = (
      <div
        style={{
          fontSize: '14px',
          padding: '8px'
        }}>{`${format(new Date(), 'MM/DD/YYYY 00:00')} 기준`}</div>
    )

    const favoriteTokens = tokenList.filter(t => favorites.some(f => f === t.symbol))

    return !tokenList ? (
      <div
        style={{
          width: '40px',
          margin: 'auto',
          paddingTop: '20px',
          paddingBottom: '0px'
        }}>
        <Loader type="ThreeDots" color="#448AFF" height={40} width={40} />
      </div>
    ) : (
      <ShadowedCard>
        <Tabs defaultActiveKey="2" size="large" tabBarExtraContent={operations}>
          <TabPane
            tab={
              <span>
                <Icon style={{ fontSize: '20px' }} type="star" />
                Favorites
              </span>
            }
            key="1">
            <Grid fluid style={{ padding: '24px 0px' }}>
              <Row>
                <Col xs={12}>
                  <div>
                    <div className="table-responsive bootgrid">
                      <table id="bootgrid-basic" className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '5%' }} />
                            <MarketHeader className="text-center" style={{ width: '10%' }}>
                              <FormattedMessage id="Name" />
                            </MarketHeader>
                            <MarketHeader className="text-right">
                              <FormattedMessage id="Last Price" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-center" style={{ width: '25%' }}>
                              <FormattedMessage id="Today Change" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-right">
                              <FormattedMessage id="Today High" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-right">
                              <FormattedMessage id="Today Low" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-right" style={{ width: '17%' }}>
                              <FormattedMessage id="Today Volume" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-center">
                              <FormattedMessage id="Trend" />
                            </MarketHeader>
                          </tr>
                        </thead>
                        <tbody>
                          {favoriteTokens.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="va-middle text-center">
                                <Header6>No Data</Header6>
                              </td>
                            </tr>
                          ) : (
                            favoriteTokens.map(token => {
                              const todayChanged = token.last_price - token.last_day_price
                              return (
                                <tr
                                  key={token.id}
                                  className="msg-display clickable"
                                  onClick={() => this.goTrade(token.symbol)}>
                                  <td className="va-middle text-center">
                                    <div
                                      onClick={e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        this.handleFavorite(token.symbol)
                                      }}>
                                      <FavoriteIcon className={'ion-ios-star'} />
                                    </div>
                                  </td>
                                  <td className="va-middle text-center">
                                    <Header6>{token.name}</Header6>
                                  </td>
                                  <td className="va-middle text-right">
                                    <Header6
                                      color={
                                        todayChanged < 0
                                          ? ColorsConstant.Thick_red
                                          : ColorsConstant.Thick_green
                                      }>
                                      {token.last_price.toFixed(4)}
                                    </Header6>
                                  </td>
                                  <td className="va-middle text-center">
                                    <Header6
                                      color={
                                        todayChanged < 0
                                          ? ColorsConstant.Thick_red
                                          : ColorsConstant.Thick_green
                                      }>
                                      {todayChanged.toFixed(4)}
                                    </Header6>
                                  </td>
                                  <td className="va-middle text-right">
                                    <Header6>{token.high_price_24h.toFixed(4)}</Header6>
                                  </td>
                                  <td className="va-middle text-right">
                                    <Header6>{token.low_price_24h.toFixed(4)}</Header6>
                                  </td>
                                  <td className="va-middle text-right">
                                    <Header6>{token.volume_24h.toFixed(4)}</Header6>
                                  </td>
                                  <td className="va-middle text-center">
                                    {todayChanged < 0 ? (
                                      <em className="ion-arrow-graph-down-right text-warning" />
                                    ) : (
                                      <em className="ion-arrow-graph-up-right text-success" />
                                    )}
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon style={{ fontSize: '20px' }} type="dollar" />
                EOS
              </span>
            }
            key="2">
            <Grid fluid style={{ padding: '24px 0px' }}>
              <Row>
                <Col xs={12}>
                  <div>
                    <div className="table-responsive bootgrid">
                      <table id="bootgrid-basic" className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '5%' }} />
                            <MarketHeader className="text-center" style={{ width: '10%' }}>
                              <FormattedMessage id="Name" />
                            </MarketHeader>
                            <MarketHeader className="text-right">
                              <FormattedMessage id="Last Price" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-center" style={{ width: '25%' }}>
                              <FormattedMessage id="Today Change" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-right">
                              <FormattedMessage id="Today High" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-right">
                              <FormattedMessage id="Today Low" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-right" style={{ width: '17%' }}>
                              <FormattedMessage id="Today Volume" /> (EOS)
                            </MarketHeader>
                            <MarketHeader className="text-center">
                              <FormattedMessage id="Trend" />
                            </MarketHeader>
                          </tr>
                        </thead>
                        <tbody>
                          {tokenList.map(token => {
                            const todayChanged = token.last_price - token.last_day_price
                            return (
                              <tr
                                key={token.id}
                                className="msg-display clickable"
                                onClick={() => this.goTrade(token.symbol)}>
                                <td className="va-middle text-center">
                                  <div
                                    onClick={e => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      this.handleFavorite(token.symbol)
                                    }}>
                                    <FavoriteIcon
                                      className={
                                        favorites.some(f => f === token.symbol)
                                          ? 'ion-ios-star'
                                          : 'ion-ios-star-outline'
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="va-middle text-center">
                                  <Header6>{token.name}</Header6>
                                </td>
                                <td className="va-middle text-right">
                                  <Header6
                                    color={
                                      todayChanged < 0
                                        ? ColorsConstant.Thick_red
                                        : ColorsConstant.Thick_green
                                    }>
                                    {token.last_price.toFixed(4)}
                                  </Header6>
                                </td>
                                <td className="va-middle text-center">
                                  <Header6
                                    color={
                                      todayChanged < 0
                                        ? ColorsConstant.Thick_red
                                        : ColorsConstant.Thick_green
                                    }>
                                    {todayChanged.toFixed(4)}
                                  </Header6>
                                </td>
                                <td className="va-middle text-right">
                                  <Header6>{token.high_price_24h.toFixed(4)}</Header6>
                                </td>
                                <td className="va-middle text-right">
                                  <Header6>{token.low_price_24h.toFixed(4)}</Header6>
                                </td>
                                <td className="va-middle text-right">
                                  <Header6>{token.volume_24h.toFixed(4)}</Header6>
                                </td>
                                <td className="va-middle text-center">
                                  {todayChanged < 0 ? (
                                    <em className="ion-arrow-graph-down-right text-warning" />
                                  ) : (
                                    <em className="ion-arrow-graph-up-right text-success" />
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </TabPane>
        </Tabs>
      </ShadowedCard>
    )
  }
}

export default withCookies(
  withRouter(
    compose(
      inject('marketStore'),
      observer
    )(MarketView)
  )
)
