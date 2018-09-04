import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class Market extends Component {
  render() {
    const { marketStore } = this.props
    const { error, loading, count, tokenList } = marketStore

    if (error) {
      console.log('에러냥')
      console.log(error)
    } else if (loading) {
      console.log('Loading ..')
    } else if (count === 0) {
      console.log('No data :(')
    } else {
      console.log('여긴 오냐')
      console.log(tokenList)
    }

    return <div>{JSON.stringify(tokenList)}</div>
  }
}

export default compose(
  inject('marketStore'),
  observer
)(Market)
