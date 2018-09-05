import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

import TokenInfo from '../components/Trade/TokenInfo'

class Trade extends Component {
  constructor(props) {
    super(props)
    const { token } = this.props.match.params

    this.state = {
      token: token
    }
  }

  render() {
    return (
      <Fragment>
        <TokenInfo token={this.state.token} />
      </Fragment>
    )
  }
}

export default compose(
  inject('eosioStore'),
  observer
)(Trade)
