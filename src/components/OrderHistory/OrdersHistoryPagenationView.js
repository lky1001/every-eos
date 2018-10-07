import React, { Component } from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

class OrdersHistoryPagenationView extends Component {
  render() {
    const {
      ordersHistoryPage,
      ordersHistoryTotalCount,
      ordersHistoryPageSize,
      pageClicked
    } = this.props

    const pageCount =
      ordersHistoryTotalCount > 0
        ? Math.ceil(ordersHistoryTotalCount / ordersHistoryPageSize.value)
        : 1

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Pagination
          aria-label="orders pagination"
          style={{ justifyContent: 'center', alignItems: 'center' }}>
          <PaginationItem>
            <PaginationLink previous onClick={() => pageClicked(ordersHistoryPage - 1)} />
          </PaginationItem>
          {Array(pageCount)
            .fill(null)
            .map((v, idx) => (
              <PaginationItem key={idx} active={ordersHistoryPage === idx + 1}>
                <PaginationLink onClick={() => pageClicked(idx + 1)}>{idx + 1}</PaginationLink>
              </PaginationItem>
            ))}
          <PaginationItem>
            <PaginationLink next onClick={() => pageClicked(ordersHistoryPage + 1)} />
          </PaginationItem>
        </Pagination>
      </div>
    )
  }
}

export default OrdersHistoryPagenationView
