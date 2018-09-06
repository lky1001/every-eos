import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

import MarketView from '../components/Market/MatketView'

import { ProgressBar } from 'react-bootstrap'

class Market extends Component {
  constructor(props) {
    super(props)

    this.state = {
      intervalId: 0
    }
  }

  componentDidMount = async () => {
    const { marketStore } = this.props

    const id = setInterval(async () => {
      await marketStore.getTokens()
    }, 2000)

    this.setState({
      intervalId: id
    })
  }

  componentWillUnmount = async () => {
    if (this.state.intervalId > 0) {
      clearInterval(this.state.intervalId)
    }
  }

  render() {
    const { marketStore } = this.props
    const { tokenList } = marketStore

    return <div>{!tokenList ? <ProgressBar striped bsStyle="success" now={40} /> : <MarketView tokenList={tokenList} />}</div>
  }
}

export default compose(
  inject('marketStore'),
  observer
)(Market)
