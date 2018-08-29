import React, { Component, Fragment } from 'react'

class Trade extends Component {
  constructor(props) {
    super(props)
    const { token } = this.props.match.params

    this.state = {
      token
    }
  }

  render() {
    return <Fragment>{this.state.token}</Fragment>
  }
}

export default Trade
