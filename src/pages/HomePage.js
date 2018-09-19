import React, { Component } from 'react'
import { Grid, Row, Col, Button, Dropdown, MenuItem, Modal } from 'react-bootstrap'
import styled from 'styled-components'

import MarketView from '../components/Market/MatketView'

const TitleView = styled.span`
  color: white;
  font-size: 40px;
`
const TopView = styled.div`
  height: 500px;
  background: #1976d2;
`

class Home extends Component {
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
        <TopView>
          <Row>
            <Col xs={3} />
            <Col xs={6}>
              <TitleView>Everyeos</TitleView>
            </Col>
            <Col xs={3} />
          </Row>
        </TopView>
        <div className="container container-lg">
          <MarketView />
        </div>
      </section>
    )
  }
}

export default Home
