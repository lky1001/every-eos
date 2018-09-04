import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class Market extends Component {
  componentDidMount() {
    const { marketStore } = this.props

    marketStore.getTokenList()
  }

  render() {
    const { marketStore } = this.props
    const { error, loading, count, currenttokens } = marketStore

    if (error) {
      console.log('에러냥')
      console.error(error)
    } else if (loading) console.warn('Loading ..')
    else if (count === 0) console.warn('No data :(')
    else {
      console.log('여긴 오냐')
      console.log(currenttokens)
    }

    return <div>{currenttokens}</div>
  }
}

export default compose(
  inject('marketStore'),
  observer
)(Market)
