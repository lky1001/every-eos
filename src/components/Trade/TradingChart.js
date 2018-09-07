import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { format } from 'd3-format'
import { ChartCanvas, Chart } from 'react-stockcharts'
import { BarSeries, CandlestickSeries } from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { fitWidth } from 'react-stockcharts/lib/helper'
import { last } from 'react-stockcharts/lib/utils'

class TradingChart extends Component {
  render() {
    const { type, chartData: initialData, width, ratio } = this.props
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date)
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData)

    const start = xAccessor(last(data))
    const end = xAccessor(data[Math.max(0, data.length - 100)])
    const xExtents = [start, end]

    return (
      <ChartCanvas
        height={600}
        ratio={ratio}
        width={width}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}>
        <Chart id={1} height={400} yExtents={d => [d.high, d.low]}>
          <YAxis axisAt="right" orient="right" ticks={5} />
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} />
          <CandlestickSeries />
        </Chart>
        <Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}>
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format('.2s')} />
          <BarSeries yAccessor={d => d.volume} fill={d => (d.close > d.open ? '#6BA583' : 'red')} />
        </Chart>
      </ChartCanvas>
    )
  }
}

TradingChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired
}

TradingChart.defaultProps = {
  type: 'svg'
}
TradingChart = fitWidth(TradingChart)

export default compose(
  inject('marketStore'),
  observer
)(TradingChart)
