import React, { Component, Fragment } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { Container } from 'reactstrap'
import SearchableOrderHistory from '../components/OrderHistory/SearchableOrderHistory'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { PAGE_SIZE_FIFTY } from '../constants/Values'

class OrderHistoryPage extends Component {
  render() {
    const { accountStore, tradeStore } = this.props

    return (
      <Fragment>
        <Container>
          <Row>
            <Col xs={12}>
              <SearchableOrderHistory
                accountStore={accountStore}
                tradeStore={tradeStore}
                ordersHistoryList={tradeStore.ordersHistoryList}
                pageSize={PAGE_SIZE_FIFTY}
              />
            </Col>
          </Row>
        </Container>
      </Fragment>
    )
  }
}

export default compose(
  inject('tradeStore', 'accountStore'),
  observer
)(OrderHistoryPage)
