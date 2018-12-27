import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import ApiServerAgent from '../ApiServerAgent'
import { noticesQuery } from '../graphql/query/notice'

class NoticeStore {
  notices = {
    data: {
      notices: []
    },
    loading: false,
    error: null
  }

  constructor(rootStore) {
    this.root = rootStore

    set(this, {
      get notices() {
        return graphql({
          client: ApiServerAgent,
          query: noticesQuery
        })
      }
    })
  }

  getNotices = async () => {
    this.notices = await graphql({
      client: ApiServerAgent,
      query: noticesQuery
    })
  }

  get noticesError() {
    return (this.notices.error && this.notices.error.message) || null
  }

  get noticesLoading() {
    return this.notices.loading
  }

  get noticesList() {
    return (this.notices.data && toJS(this.notices.data.notices)) || []
  }

  get noticesCount() {
    return this.notices.data.notices ? this.notices.data.notices.length : 0
  }
}

decorate(NoticeStore, {
  notices: observable,
  noticesError: computed,
  noticesLoading: computed,
  noticesList: computed,
  noticesCount: computed,
  getNotices: action
})

export default NoticeStore
