import * as React from 'react'
import './index.css'
import { widget } from '../../charting_library/charting_library.min'
import addDays from 'date-fns/add_days'

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(window.location.search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export class TVChartContainer extends React.PureComponent {
  static defaultProps = {
    symbol: 'AAPL',
    interval: 'D',
    containerId: 'tv_chart_container',
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {}
  }

  tvWidget = null

  componentDidMount() {
    const { accountStore, tradeStore } = this.props

    if (accountStore.isLogin) {
      console.log('요청 시작')
      tradeStore.getChartDatas('1MIN', 2, 1, addDays(new Date(), -30), new Date())
      console.log('요청 완료')
    } else {
      // this.disposer = accountStore.subscribeLoginState(changed => {
      //   if (changed.oldValue !== changed.newValue) {
      //     if (changed.newValue) {
      //       tradeStore.initExchangeOrdersHistoryFilter()
      //       tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
      //     } else {
      //       tradeStore.clearOrdersHistory()
      //     }
      //   }
      // })
    }

    const widgetOptions = {
      symbol: this.props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
      interval: this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,

      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_widget',
        'context_menus',
        'edit_buttons_in_legend',
        'left_toolbar'
      ],
      enabled_features: ['study_templates'],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides
    }

    const tvWidget = new widget(widgetOptions)
    this.tvWidget = tvWidget

    tvWidget.onChartReady(() => {
      const button = tvWidget
        .createButton()
        .attr('title', 'Click to show a notification popup')
        .addClass('apply-common-tooltip')
        .on('click', () =>
          tvWidget.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {
              console.log('Noticed!')
            }
          })
        )

      button[0].innerHTML = 'Check API'
    })
  }

  componentWillUnmount() {
    // if (this.tvWidget !== null) {
    //   this.tvWidget.remove()
    //   this.tvWidget = null
    // }
  }

  render() {
    const { accountStore, tradeStore } = this.props

    console.log('가져온 데이터', tradeStore.chartDatas)

    return <div id={this.props.containerId} className={'TVChartContainer'} />
  }
}
