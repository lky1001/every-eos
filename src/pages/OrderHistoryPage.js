import React, { Component, Fragment } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import OrderHistory from '../components/Trade/OrderHistory'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { PAGE_SIZE_FIFTY } from '../constants/Values'

class OrderHistoryPage extends Component {
  render() {
    const { accountStore, tradeStore } = this.props

    return (
      <Fragment>
        <Grid>
          <Row>
            <Col>
              <OrderHistory
                accountStore={accountStore}
                tradeStore={tradeStore}
                ordersHistoryList={tradeStore.ordersHistoryList}
                pageSize={PAGE_SIZE_FIFTY}
              />
            </Col>
          </Row>
        </Grid>
      </Fragment>
    )
  }
}

export default compose(
  inject('tradeStore', 'accountStore'),
  observer
)(OrderHistoryPage)
