import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

import MarketView from '../components/Market/MatketView'

import { ProgressBar } from 'react-bootstrap'

class Market extends Component {
  render() {
    const { marketStore } = this.props
    const { error, loading, tokenList } = marketStore

    return (
      <div>
        {loading ? (
          <ProgressBar striped bsStyle="success" now={40} />
        ) : (
          <MarketView tokenList={tokenList} />
        )}
      </div>
    )
  }
}

export default compose(
  inject('marketStore'),
  observer
)(Market)
