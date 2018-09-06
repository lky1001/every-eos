import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class Market extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Fragment>Market</Fragment>
  }
}

export default compose(
  inject('marketStore'),
  observer
)(Market)
