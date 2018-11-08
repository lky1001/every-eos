import React, { Component } from 'react'
import { Grid, Row, Col, Button, Dropdown, MenuItem, Modal, Image } from 'react-bootstrap'
import styled from 'styled-components'

import MarketView from '../components/Market/MatketView'
import Faq from '../components/Home/Faq'
const TopView = styled.div`
  height: 500px;
`

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModalMsg: false,
      showModalNew: false
    }
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
        <div className="container container-lg">
          <MarketView />
        </div>

        <div className="container container-lg" />
      </section>
    )
  }
}

export default HomePage
