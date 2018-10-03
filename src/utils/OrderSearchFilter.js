import {
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  SELECT_ORDER_STATUS_ALL,
  SELECT_ORDER_STATUS_IN_PROGRESS,
  SELECT_ORDER_STATUS_COMPLETED_OR_CANCELLED,
  SELECT_ORDER_STATUS_COMPLETED,
  SELECT_ORDER_STATUS_CANCELLED,
  ORDER_TYPE_BUY,
  ORDER_TYPE_SELL,
  SELECT_ORDER_TYPE_ALL,
  SELECT_ORDER_TYPE_BUY,
  SELECT_ORDER_TYPE_SELL,
  PAGE_SIZE_TEN,
  PAGE_SIZE_TWENTY,
  PAGE_SIZE_THIRTY,
  PAGE_SIZE_FIFTY
} from '../constants/Values'

export const typeOptions = [
  { value: '', label: SELECT_ORDER_TYPE_ALL },
  { value: ORDER_TYPE_BUY, label: SELECT_ORDER_TYPE_BUY },
  { value: ORDER_TYPE_SELL, label: SELECT_ORDER_TYPE_SELL }
]

export const statusOptions = [
  { value: '', label: SELECT_ORDER_STATUS_ALL },
  {
    value: [ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED],
    label: SELECT_ORDER_STATUS_IN_PROGRESS
  },
  {
    value: [ORDER_STATUS_ALL_DEALED, ORDER_STATUS_CANCELLED],
    label: SELECT_ORDER_STATUS_COMPLETED_OR_CANCELLED
  },
  { value: ORDER_STATUS_ALL_DEALED, label: SELECT_ORDER_STATUS_COMPLETED },
  { value: ORDER_STATUS_CANCELLED, label: SELECT_ORDER_STATUS_CANCELLED }
]

export const pageSizeOptions = [
  { value: PAGE_SIZE_TEN, label: `${PAGE_SIZE_TEN}/page` },
  { value: PAGE_SIZE_TWENTY, label: `${PAGE_SIZE_TWENTY}/page` },
  { value: PAGE_SIZE_THIRTY, label: `${PAGE_SIZE_THIRTY}/page` },
  { value: PAGE_SIZE_FIFTY, label: `${PAGE_SIZE_FIFTY}/page` }
]

export const getTypeFilter = selectedType => {
  if (selectedType.label === SELECT_ORDER_TYPE_ALL) {
    return JSON.stringify([ORDER_TYPE_BUY, ORDER_TYPE_SELL])
  } else if (selectedType.label === SELECT_ORDER_TYPE_BUY) {
    return JSON.stringify(ORDER_TYPE_BUY)
  } else if (selectedType.label === SELECT_ORDER_TYPE_SELL) {
    return JSON.stringify(ORDER_TYPE_SELL)
  }
}

export const getStatusFilter = selectedStatus => {
  if (selectedStatus.label === SELECT_ORDER_STATUS_ALL) {
    return JSON.stringify([
      ORDER_STATUS_NOT_DEAL,
      ORDER_STATUS_PARTIAL_DEALED,
      ORDER_STATUS_ALL_DEALED,
      ORDER_STATUS_CANCELLED
    ])
  } else if (selectedStatus.label === SELECT_ORDER_STATUS_IN_PROGRESS) {
    return JSON.stringify([ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED])
  } else if (selectedStatus.label === SELECT_ORDER_STATUS_COMPLETED_OR_CANCELLED) {
    return JSON.stringify([ORDER_STATUS_ALL_DEALED, ORDER_STATUS_CANCELLED])
  } else if (selectedStatus.label === SELECT_ORDER_STATUS_COMPLETED) {
    return JSON.stringify(ORDER_STATUS_ALL_DEALED)
  } else if (selectedStatus.label === SELECT_ORDER_STATUS_CANCELLED) {
    return JSON.stringify(ORDER_STATUS_CANCELLED)
  }
}
