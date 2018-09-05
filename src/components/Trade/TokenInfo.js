import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class TokenInfo extends Component {
  componentDidMount = async () => {
    const { token } = this.props
  }

  render() {
    return <Fragment />
  }
}

export default compose(
  inject('marketStore'),
  observer
)(TokenInfo)
