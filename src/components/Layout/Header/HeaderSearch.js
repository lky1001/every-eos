import React from 'react'
import { Modal } from 'react-bootstrap'
import pubsub from 'pubsub-js'
import $ from 'jquery'

class HeaderSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  componentWillMount() {
    this.pubsub_token = pubsub.subscribe('showsearch', () => {
      this.open()
    })
  }

  componentWillUnmount() {
    pubsub.unsubscribe(this.pubsub_token)
  }

  onShowModal() {
    // Add class for white backdrop
    $('body').addClass('modal-backdrop-soft')
  }

  onHiddenModal() {
    // Remove class for white backdrop (if not will affect future modals)
    $('body').removeClass('modal-backdrop-soft')
  }

  onShownModal() {
    // Auto focus the search input
    $('.header-input-search').focus()
  }

  close() {
    this.setState({ showModal: false })
  }

  open() {
    this.setState({ showModal: true })
  }

  onSubmit(e) {
    e.preventDefault()
  }

  render() {
    return (
      <Modal
        show={this.state.showModal}
        onHide={this.close}
        className="modal modal-top fade modal-search"
        onEnter={this.onShowModal}
        onExited={this.onHiddenModal}
        onEntered={this.onShownModal}
      >
        <Modal.Body>
          <div className="pull-left">
            <button type="button" data-dismiss="modal" className="btn btn-flat">
              <em className="ion-arrow-left-c icon-24" />
            </button>
          </div>
          <div className="pull-right">
            <button type="button" className="btn btn-flat">
              <em className="ion-android-microphone icon-24" />
            </button>
          </div>
          <form onSubmit={this.onSubmit} action="#" className="oh">
            <div className="mda-form-control pt0">
              <input
                type="text"
                ref="searchTerm"
                placeholder="Search.."
                className="form-control header-input-search"
              />
              <div className="mda-form-control-line" />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
}

export default HeaderSearch
