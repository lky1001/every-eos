import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col, Button, Dropdown, MenuItem, Modal, Image } from 'react-bootstrap'
import styled from 'styled-components'

import MarketView from '../components/Market/MatketView'
import Faq from '../components/Home/Faq'
import { TopView } from '../components/Common/Common'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModalMsg: false,
      showModalNew: false
    }
  }

  componentDidMount = async () => {
    const { noticeStore } = this.props
    await noticeStore.getNotices()
  }

  closeMsg() {
    this.setState({ showModalMsg: false })
  }

  openMsg() {
    this.setState({ showModalMsg: true })
  }

  closeNew() {
    this.setState({ showModalNew: false })
  }

  openNew() {
    this.setState({ showModalNew: true })
  }

  render() {
    const { noticeStore } = this.props
    const { noticesList } = noticeStore

    return (
      <section>
        <TopView className="container-overlap bg-blue-700" style={{ height: '400px' }}>
          <div className="container container-md">
            <Grid style={{ minWidth: '1440px' }}>
              <Row>
                <Col xs={5} className="col-xs-offset-1">
                  <h1>
                    <strong>
                      <i>EVERY EOS</i>
                    </strong>
                  </h1>
                  <h4>Decentralized exchange based on eos.io</h4>
                </Col>
                <Col xs={6} style={{ textAlign: 'center' }}>
                  <Image src="every_eos_landing_laptop.png" width="512" height="256" />
                </Col>
              </Row>
            </Grid>
          </div>
        </TopView>

        <div
          className="bg-blue-500"
          style={{
            height: '44px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {noticesList.map(n => {
            return (
              <div>
                <a>{`${n.title} ${n.created}`}</a>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '100px' }} className="container container-lg">
          <MarketView />
        </div>

        <div className="container container-lg" />
      </section>
    )
  }
}

export default compose(
  inject('noticeStore'),
  observer
)(HomePage)
