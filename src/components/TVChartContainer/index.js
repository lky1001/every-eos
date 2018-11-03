import * as React from 'react'
import './index.css'
import { widget } from '../../charting_library/charting_library.min'
import Datafeed from './api'

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(window.location.search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export class TVChartContainer extends React.PureComponent {
  static defaultProps = {
    symbol: 'EveryEX:KARMA/EOS',
    interval: '60',
    containerId: 'tv_chart_container',
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
    const widgetOptions = {
      debug: false,
      symbol: this.props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: Datafeed,
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

  // componentWillUnmount() {
  //   if (this.tvWidget !== null) {
  //     this.tvWidget.remove()
  //     this.tvWidget = null
  //   }
  // }

  render() {
    return <div id={this.props.containerId} className={'TVChartContainer'} />
  }
}
