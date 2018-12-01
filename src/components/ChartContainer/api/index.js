import historyProvider from './historyProvider'
const supportedResolutions = ['1', '5', '15', '30', '60', '1440', '10080', '43200', '525600']

const config = {
  supported_resolutions: supportedResolutions
}

export class ChartAPIContainer {
  constructor(token) {
    this.token = token
  }

  onReady(cb) {
    setTimeout(() => cb(config), 0)
  }

  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {}

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    var split_data = symbolName.split(/[:/]/)
    var symbol_stub = {
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: split_data[0],
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: supportedResolutions,
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: 'streaming',
      token_id: this.token.id
    }

    if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
      symbol_stub.pricescale = 100
    }
    setTimeout(function() {
      onSymbolResolvedCallback(symbol_stub)
    }, 0)

    // onResolveErrorCallback('Not feeling it today')
  }
  getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    historyProvider
      .getBars(symbolInfo, resolution, from, to, firstDataRequest)
      .then(bars => {
        if (bars.length) {
          onHistoryCallback(bars, { noData: false })
        } else {
          onHistoryCallback(bars, { noData: true })
        }
      })
      .catch(err => {
        console.log({ err })
        onErrorCallback(err)
      })
  }
  subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) {}
  unsubscribeBars(subscriberUID) {}
  calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
    //optional
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined
  }
  getMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    //optional
  }
  getTimeScaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    //optional
  }
  getServerTime(cb) {}
}
