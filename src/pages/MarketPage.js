import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

import MarketView from '../components/Market/MatketView'

class MarketPage extends Component {
  render() {
    return (
      <div>
        <MarketView />
      </div>
    )
  }
}

export default compose(
  inject('marketStore'),
  observer
)(MarketPage)
