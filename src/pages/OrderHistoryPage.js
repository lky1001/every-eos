import React, { Component, Fragment } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { Container } from 'reactstrap'
import SearchableOrderHistory from '../components/OrderHistory/SearchableOrderHistory'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

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
                ordersHistoryCount={tradeStore.ordersHistoryCount}
                ordersHistoryTotalCount={tradeStore.ordersHistoryTotalCount}
                ordersHistoryLoading={tradeStore.ordersHistoryLoading}
                ordersHistoryError={tradeStore.ordersHistoryError}
                ordersHistoryPage={tradeStore.ordersHistoryPage}
                ordersHistoryPageSize={tradeStore.ordersHistoryPageSize}
                ordersHistoryFrom={tradeStore.ordersHistoryFrom}
                ordersHistoryTo={tradeStore.ordersHistoryTo}
                ordersHistoryType={tradeStore.ordersHistoryType}
                ordersHistoryStatus={tradeStore.ordersHistoryStatus}
                tokenSymbolForSearch={tradeStore.tokenSymbolForSearch}
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
