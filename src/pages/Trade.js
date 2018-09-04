import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class Trade extends Component {
  constructor(props) {
    super(props)
    const { token } = this.props.match.params

    this.state = {
      token: token
    }
  }

  render() {
    return <Fragment>{this.state.token}</Fragment>
  }
}

export default compose(
  inject('eosioStore'),
  observer
)(Trade)
