import { API_SERVER_REST_URI } from '../../../constants/Values'

var rp = require('request-promise').defaults({ json: true })

const api_root = API_SERVER_REST_URI
const history = {}

export default {
  history: history,

  getBars: function(symbolInfo, resolution, from, to, first, limit) {
    const split_symbol = symbolInfo.name.split(/[:/]/)
    const token_id = symbolInfo.token_id
    const statistic_type = symbolInfo.statistic_type
    const url = `/bars?token_id=${token_id}&statistic_type=${statistic_type}&resolution=${resolution}&from=${from}&to=${to}`

    console.log('요청 url', url)
    // const url =
    //   resolution === 'D'
    //     ? '/data/histoday'
    //     : resolution >= 60
    //       ? '/data/histohour'
    //       : '/data/histominute'
    // const qs = {
    //   e: split_symbol[0],
    //   fsym: split_symbol[1],
    //   tsym: split_symbol[2],
    //   toTs: to ? to : '',
    //   limit: limit ? limit : 2000
    // aggregate: 1//resolution
    // }

    return rp({
      url: `${api_root}${url}`
      //qs
    }).then(data => {
      if (data && data.bars && data.bars.length) {
        var bars = data.bars.reverse().map(el => {
          return {
            time: new Date(el.start_time), //TradingView requires bar time in ms
            low: el.low_price,
            high: el.high_price,
            open: el.opening_price,
            close: el.close_price,
            volume: el.volume
          }
        })

        return bars
      }

      return []
      // if (data.Data.length) {
      //   console.log(
      //     `Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(
      //       data.TimeTo * 1000
      //     ).toISOString()}`
      //   )

      //   var bars = data.Data.map(el => {
      //     return {
      //       time: el.time * 1000, //TradingView requires bar time in ms
      //       low: el.low,
      //       high: el.high,
      //       open: el.open,
      //       close: el.close,
      //       volume: el.volumefrom
      //     }
      //   })
      //   if (first) {
      //     var lastBar = bars[bars.length - 1]
      //     history[symbolInfo.name] = { lastBar: lastBar }
      //   }
      //   return bars
      // } else {
      //   return []
      // }
    })
  }
}
