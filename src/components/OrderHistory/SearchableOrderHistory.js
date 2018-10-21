import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'

import {
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_DETAIL_DEAL_STATUS_CANCELLED,
  ORDER_TYPE_BUY,
  ORDER_DATE_FORMAT
} from '../../constants/Values'

import { ShadowedCard } from '../Common/Common'
import FilterBar from './FilterBar'
import PageSummaryView from './PageSummaryView'
import OrdersHistoryView from './OrdersHistoryView'
import OrdersHistoryPagenationView from './OrdersHistoryPagenationView'

class SearchableOrderHistory extends Component {
  componentDidMount = () => {
    const { accountStore, tradeStore } = this.props

    tradeStore.initOrdersHistoryFilter()

    if (accountStore.isLogin) {
      tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
    } else {
      this.disposer = accountStore.subscribeLoginState(changed => {
        if (changed.oldValue !== changed.newValue) {
          if (changed.newValue) {
            tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
          } else {
            tradeStore.clearOrdersHistory()
          }
        }
      })
    }
  }

  componentWillUnmount = () => {
    if (this.disposer) this.disposer()
  }

  handleSearch = () => {
    const { tradeStore, accountStore } = this.props

    tradeStore.setOrdersHistoryPage(1)
    tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
  }

  handleTypeChange = selectedType => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryType(selectedType)
  }

  handleStatusChange = selectedStatus => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryStatus(selectedStatus)
  }

  showFromMonth = () => {
    const { ordersHistoryFrom, ordersHistoryTo } = this.props
    if (!ordersHistoryFrom) {
      return
    }
    if (moment(ordersHistoryTo).diff(moment(ordersHistoryFrom), 'months') < 2) {
      this.to.getDayPicker().showMonth(ordersHistoryFrom)
    }
  }

  handleTokenSymbolChange = s => {
    const { tradeStore } = this.props

    tradeStore.setTokenSymbolForSearch(s.target.value)
  }

  handleFromChange = from => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryFrom(from)
  }

  handleToChange = to => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryTo(to)
  }

  handlePageSizeChange = async selectedPageSize => {
    const { accountStore, tradeStore } = this.props
    tradeStore.setOrdersHistoryPageSize(selectedPageSize)
    await tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
  }

  pageClicked = async idx => {
    const { accountStore, tradeStore, ordersHistoryTotalCount, ordersHistoryPageSize } = this.props

    const pageCount =
      ordersHistoryTotalCount > 0
        ? Math.ceil(ordersHistoryTotalCount / ordersHistoryPageSize.value)
        : 1

    if (idx > 0 && idx <= pageCount) {
      tradeStore.setOrdersHistoryPage(idx)
      await tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
    }
  }

  render() {
    const {
      accountStore,
      ordersHistoryList,
      ordersHistoryCount,
      ordersHistoryLoading,
      ordersHistoryError,
      ordersHistoryFrom,
      ordersHistoryTo,
      ordersHistoryType,
      ordersHistoryStatus,
      ordersHistoryPageSize,
      ordersHistoryPage,
      ordersHistoryTotalCount
    } = this.props

    return (
      <Fragment>
        <section>
          <div className="container-fluid">
            <h5 className="mt0">
              <FormattedMessage id="Order History" />
            </h5>
            <ShadowedCard>
              <FilterBar
                ordersHistoryFrom={ordersHistoryFrom}
                ordersHistoryTo={ordersHistoryTo}
                ordersHistoryType={ordersHistoryType}
                ordersHistoryStatus={ordersHistoryStatus}
                handleSearch={this.handleSearch}
                handleTypeChange={this.handleTypeChange}
                handleStatusChange={this.handleStatusChange}
                showFromMonth={this.showFromMonth}
                handleTokenSymbolChange={this.handleTokenSymbolChange}
                handleFromChange={this.handleFromChange}
                handleToChange={this.handleToChange}
              />

              <PageSummaryView
                ordersHistoryCount={ordersHistoryCount}
                ordersHistoryPageSize={ordersHistoryPageSize}
                handlePageSizeChange={this.handlePageSizeChange}
              />

              <OrdersHistoryView
                accountStore={accountStore}
                ordersHistoryList={ordersHistoryList}
                ordersHistoryCount={ordersHistoryCount}
                ordersHistoryLoading={ordersHistoryLoading}
              />

              <OrdersHistoryPagenationView
                ordersHistoryPage={ordersHistoryPage}
                ordersHistoryTotalCount={ordersHistoryTotalCount}
                ordersHistoryPageSize={ordersHistoryPageSize}
                pageClicked={this.pageClicked}
              />
            </ShadowedCard>
          </div>
        </section>
      </Fragment>
    )
  }
}

export default SearchableOrderHistory
