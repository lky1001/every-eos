import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col, Button, Dropdown, MenuItem, Modal, Image } from 'react-bootstrap'
import styled from 'styled-components'

import MarketView from '../components/Market/MatketView'
import Faq from '../components/Home/Faq'
import LinesEllipsis from 'react-lines-ellipsis'
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div
            className="container "
            style={{
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {noticesList.slice(0, 3).map((n, i) => {
              return (
                <Grid
                  key={i}
                  style={{
                    width: '365px',
                    height: '24px'
                  }}>
                  <a>
                    <Row>
                      <Col xs={10}>
                        <LinesEllipsis
                          text={n.title}
                          maxLine="1"
                          ellipsis="..."
                          trimRight
                          basedOn="letters"
                        />
                      </Col>
                      <Col xs={2}>{`${new Date(n.created).getMonth()} - ${new Date(
                        n.created
                      ).getDay()}`}</Col>
                    </Row>
                  </a>
                </Grid>
              )
            })}
          </div>
        </div>

        <div className="container container-lg">
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
