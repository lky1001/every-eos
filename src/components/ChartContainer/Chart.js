import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'
import './index.css'
import { widget } from '../../charting_library/charting_library.min'
import { ChartAPIContainer } from './api'

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(window.location.search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

class Chart extends PureComponent {
  static defaultProps = {
    symbol: 'EveryEX:KARMA/EOS',
    interval: '30',
    containerId: 'chart_container',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'everyeos.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {}
  }

  chartWidget = null

  componentDidMount = async () => {
    this.initChart()
  }

  componentDidUpdate = async () => {
    this.initChart()
  }

  initChart = () => {
    const { token } = this.props
    if (!token) return

    const widgetOptions = {
      debug: false,
      symbol: `EveryEX:${token.symbol}/EOS`,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new ChartAPIContainer(token),
      interval: this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'header_widget',
        'context_menus',
        'edit_buttons_in_legend',
        'left_toolbar',
        'go_to_date',
        'volume_force_overlay'
      ],
      enabled_features: ['study_templates', 'move_logo_to_main_pane'],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,

      studies_overrides: this.props.studiesOverrides,
      time_frames: [
        { text: '1M', resolution: '1' },
        { text: '5M', resolution: '5' },
        { text: '15M', resolution: '15' },
        { text: '30M', resolution: '30' },
        { text: '1H', resolution: '60' },
        { text: '1D', resolution: '1440' },
        { text: '1W', resolution: '10080' },
        { text: '1M', resolution: '43200' },
        { text: '1Y', resolution: '525600' }
      ]
    }

    const chartWidget = new widget(widgetOptions)
    this.chartWidget = chartWidget

    chartWidget.onChartReady(() => {
      chartWidget
        .chart()
        .onIntervalChanged()
        .subscribe(null, function(interval, obj) {
          obj.timeframe = interval
        })
    })
  }

  componentWillUnmount = () => {
    if (this.locationChangeListener) {
      this.locationChangeListener()
    }
  }

  componentWillUnmount() {
    if (this.chartWidget !== null) {
      this.chartWidget.remove()
      this.chartWidget = null
    }
  }

  render() {
    return <div id={this.props.containerId} className={'ChartContainer'} />
  }
}

export default withRouter(Chart)
